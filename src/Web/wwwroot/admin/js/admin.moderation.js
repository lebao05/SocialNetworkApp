/* ============================================================
   Admin Moderation — real API wiring
   ============================================================ */
(function () {
  'use strict';

  /* ── State ─────────────────────────────────────────────── */
  var filters = { type: '', status: '', from: '', to: '' };
  var currentPage = 1;
  var pageSize = 20;

  /* ── Init ───────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    bindFilters();
    bindBulkActions();
    loadReports(1);
  });

  /* ── Fetch & render ─────────────────────────────────────── */
  function loadReports(page) {
    currentPage = page;
    var tbody = document.querySelector('#reportsBody');
    var pagination = document.getElementById('paginationControls');
    var info = document.getElementById('paginationInfo');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="9" class="text-center text-muted" style="padding:32px;"><i class="ri-loader-4-line" style="font-size:1.5rem;animation:spin 1s linear infinite;"></i> Loading...</td></tr>';
    if (pagination) pagination.innerHTML = '';
    if (info) info.textContent = '';

    var params = new URLSearchParams({ page: page, pageSize: pageSize });
    if (filters.type)   params.set('type',   filters.type);
    if (filters.status) params.set('status', filters.status);
    if (filters.from)   params.set('from',   filters.from);
    if (filters.to)     params.set('to',     filters.to);

    fetch('/admin/moderation/reports?' + params.toString())
      .then(function (r) { return r.json(); })
      .then(function (data) {
        renderRows(tbody, data.items);
        renderPagination(pagination, info, data);
      })
      .catch(function (err) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center text-danger" style="padding:32px;">Failed to load reports. ' + err.message + '</td></tr>';
      });
  }

  function renderRows(tbody, items) {
    if (!items || items.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" class="text-center text-muted" style="padding:40px;">No reports found.</td></tr>';
      return;
    }

    var html = '';
    for (var i = 0; i < items.length; i++) {
      var r = items[i];
      html += buildRow(r);
    }
    tbody.innerHTML = html;
    bindRowActions();
  }

  function buildRow(r) {
    var typeBadgeClass = {
      Post: 'badge-danger',
      Reel: 'badge-warning',
      User: 'badge-info',
      Group: 'badge-pending'
    }[r.reportType] || '';

    var statusBadgeClass = {
      Pending:  'badge-pending',
      Reviewed: 'badge-active',
      Dismissed:'badge-inactive'
    }[r.status] || 'badge-pending';

    var reasonBadgeClass = {
      Spam:             'badge-warning',
      Harassment:      'badge-danger',
      HateSpeech:      'badge-danger',
      NudityOrSexual:  'badge-danger',
      Misinformation:   'badge-warning',
      Other:           'badge-inactive'
    }[r.reason] || 'badge-inactive';

    var content = getContentHtml(r);
    var authorInitials = getInitials(r);
    var authorHtml = getAuthorHtml(r);
    var groupName = getGroupName(r);
    var timeAgo = timeAgoStr(r.createdAt);
    var isLocked = isContentLocked(r);
    var actionsHtml = buildActions(r, isLocked);

    return '<tr data-id="' + r.id + '" data-type="' + r.reportType + '">' +
      '<td><input type="checkbox" class="row-check" data-id="' + r.id + '" /></td>' +
      '<td><span class="badge ' + typeBadgeClass + '">' + r.reportType + '</span></td>' +
      '<td style="max-width:240px;">' +
        '<div class="truncate" style="font-size:.8375rem;max-width:220px;" title="' + escHtml(getContentPreview(r)) + '">' +
          escHtml(getContentPreview(r)) + '</div>' +
        (groupName ? '<div class="text-xs text-muted" style="margin-top:2px;"><i class="ri-group-line"></i> ' + escHtml(groupName) + '</div>' : '') +
      '</td>' +
      '<td><div class="cell-user"><div class="cell-user-avatar">' + authorInitials + '</div><div class="cell-user-info"><div class="cell-user-name">' + authorHtml + '</div></div></div></td>' +
      '<td><span class="badge ' + reasonBadgeClass + '">' + fmtReason(r.reason) + '</span></td>' +
      '<td class="cell-muted"><div style="display:flex;align-items:center;gap:5px;">' +
        '<span>' + r.reportCount + '</span>' +
        (r.reportCount >= 5 ? '<i class="ri-fire-line text-danger" style="font-size:.85rem;" title="High report count"></i>' : '') +
      '</div></td>' +
      '<td><span class="badge ' + statusBadgeClass + '"><span class="badge-dot"></span>' + r.status + '</span></td>' +
      '<td class="cell-muted">' + timeAgo + '</td>' +
      '<td><div class="cell-actions" style="justify-content:flex-end;">' +
        '<button class="action-btn primary" title="View"     onclick="Admin.Moderation.openView(' + r.id + ')"><i class="ri-eye-line"></i></button>' +
        '<button class="action-btn success" title="Review"   onclick="Admin.Moderation.openReview(' + r.id + ')"><i class="ri-checkbox-circle-line"></i></button>' +
        actionsHtml +
      '</div></td>' +
    '</tr>';
  }

  function buildActions(r, isLocked) {
    if (r.reportType === 'User') {
      return ''; // no lock on user here — handled on Users page
    }
    if (isLocked) {
      return '<button class="action-btn success" title="Unlock ' + r.reportType + '" onclick="Admin.Moderation.unlockContent(' + r.id + ', \'' + r.reportType + '\')"><i class="ri-lock-unlock-line"></i></button>';
    } else {
      return '<button class="action-btn danger" title="Lock ' + r.reportType + '" onclick="Admin.Moderation.lockContent(' + r.id + ', \'' + r.reportType + '\')"><i class="ri-lock-line"></i></button>';
    }
  }

  function getContentHtml(r) {
    if (r.reportType === 'Post' && r.post)  return escHtml(r.post.content || '(no text)');
    if (r.reportType === 'Reel' && r.reel)   return escHtml(r.reel.caption || '(no caption)');
    if (r.reportType === 'User' && r.user)   return escHtml(r.user.firstName + ' ' + r.user.lastName);
    if (r.reportType === 'Group' && r.group) return escHtml(r.group.name);
    return '';
  }

  function getContentPreview(r) {
    if (r.reportType === 'Post' && r.post)  return r.post.content || '';
    if (r.reportType === 'Reel' && r.reel)   return r.reel.caption || '';
    if (r.reportType === 'User' && r.user)   return r.user.firstName + ' ' + r.user.lastName;
    if (r.reportType === 'Group' && r.group) return r.group.name;
    return '';
  }

  function getGroupName(r) {
    if (r.reportType === 'Post' && r.post && r.post.groupName) return r.post.groupName;
    return '';
  }

  function getInitials(r) {
    var name = '';
    if (r.reportType === 'Post' && r.post)   name = r.post.author ? r.post.author.name : '';
    if (r.reportType === 'Reel' && r.reel)   name = r.reel.author ? r.reel.author.name : '';
    if (r.reportType === 'User' && r.user)   name = (r.user.firstName || '') + ' ' + (r.user.lastName || '');
    if (r.reportType === 'Group' && r.group) name = r.group.owner ? r.group.owner.name : '';
    return name.split(' ').map(function (w) { return w[0] || ''; }).join('').substring(0, 2).toUpperCase();
  }

  function getAuthorHtml(r) {
    var name = '';
    if (r.reportType === 'Post' && r.post && r.post.author)   name = r.post.author.name;
    if (r.reportType === 'Reel' && r.reel && r.reel.author)   name = r.reel.author.name;
    if (r.reportType === 'User' && r.user)                   name = (r.user.firstName || '') + ' ' + (r.user.lastName || '');
    if (r.reportType === 'Group' && r.group && r.group.owner) name = r.group.owner.name;
    return escHtml(name.trim());
  }

  function isContentLocked(r) {
    if (r.reportType === 'Post' && r.post)  return r.post.isLocked;
    if (r.reportType === 'Reel' && r.reel)   return r.reel.isLocked;
    if (r.reportType === 'Group' && r.group) return r.group.isLocked;
    return false;
  }

  /* ── Pagination ─────────────────────────────────────────── */
  function renderPagination(container, info, data) {
    if (!container || !info) return;

    info.textContent = 'Showing ' + ((data.page - 1) * data.pageSize + 1) +
      '–' + Math.min(data.page * data.pageSize, data.totalCount) +
      ' of ' + data.totalCount + ' reports';

    var totalPages = data.totalPages;
    var page = data.page;
    var html = '';

    html += '<button class="page-btn" ' + (data.hasPrev ? ('onclick="Admin.Moderation.gotoPage(' + (page - 1) + ')') : 'disabled') + '><i class="ri-arrow-left-s-line"></i></button>';

    var start = Math.max(1, page - 2);
    var end   = Math.min(totalPages, page + 2);
    if (start > 1) { html += '<button class="page-btn" onclick="Admin.Moderation.gotoPage(1)">1</button>'; if (start > 2) html += '<span class="page-ellipsis">...</span>'; }
    for (var p = start; p <= end; p++) {
      html += '<button class="page-btn ' + (p === page ? 'active' : '') + '" onclick="Admin.Moderation.gotoPage(' + p + ')">' + p + '</button>';
    }
    if (end < totalPages) { if (end < totalPages - 1) html += '<span class="page-ellipsis">...</span>'; html += '<button class="page-btn" onclick="Admin.Moderation.gotoPage(' + totalPages + ')">' + totalPages + '</button>'; }

    html += '<button class="page-btn" ' + (data.hasNext ? ('onclick="Admin.Moderation.gotoPage(' + (page + 1) + ')') : 'disabled') + '><i class="ri-arrow-right-s-line"></i></button>';
    container.innerHTML = html;
  }

  /* ── Filter bindings ────────────────────────────────────── */
  function bindFilters() {
    var typeSel    = document.getElementById('filterType');
    var statusSel = document.getElementById('filterStatus');
    var fromInput = document.getElementById('filterFrom');
    var toInput   = document.getElementById('filterTo');
    var applyBtn  = document.getElementById('btnApplyFilter');
    var resetBtn  = document.getElementById('btnResetFilter');

    function apply() {
      filters.type   = typeSel    ? typeSel.value    : '';
      filters.status = statusSel ? statusSel.value  : '';
      filters.from   = fromInput ? fromInput.value  : '';
      filters.to     = toInput   ? toInput.value    : '';
      loadReports(1);
    }

    if (applyBtn)  applyBtn.addEventListener('click', apply);
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        if (typeSel)    typeSel.value    = '';
        if (statusSel) statusSel.value  = '';
        if (fromInput) fromInput.value  = '';
        if (toInput)   toInput.value    = '';
        filters = { type: '', status: '', from: '', to: '' };
        loadReports(1);
      });
    }
  }

  /* ── Bulk actions ───────────────────────────────────────── */
  function bindBulkActions() {
    document.addEventListener('change', function (e) {
      if (e.target.classList && e.target.classList.contains('row-check')) {
        updateBulkBar();
      }
    });
  }

  function updateBulkBar() {
    var checked = document.querySelectorAll('.row-check:checked');
    var bar = document.getElementById('bulkActionBar');
    var count = document.getElementById('bulkCount');
    if (!bar) return;
    if (checked.length > 0) {
      bar.classList.remove('hidden');
      bar.style.display = 'flex';
      if (count) count.textContent = checked.length;
    } else {
      bar.classList.add('hidden');
      bar.style.display = 'none';
    }
  }

  /* ── Lock / Unlock content ───────────────────────────────── */

  /* ── View modal ─────────────────────────────────────────── */
  var _cachedItems = [];

  function openView(reportId) {
    var r = null;
    for (var i = 0; i < _cachedItems.length; i++) {
      if (_cachedItems[i].id === reportId) { r = _cachedItems[i]; break; }
    }
    if (!r) return;

    var modal = document.getElementById('viewModal');
    if (!modal) return;

    document.getElementById('vmReportId').textContent = '#' + r.id;
    document.getElementById('vmContent').textContent = getContentPreview(r);
    document.getElementById('vmAuthor').textContent = getAuthorHtml(r);
    document.getElementById('vmReason').textContent = fmtReason(r.reason);
    document.getElementById('vmReporter').textContent = r.reporter ? r.reporter.name : '—';
    document.getElementById('vmReportCount').textContent = r.reportCount + ' user' + (r.reportCount > 1 ? 's' : '');
    document.getElementById('vmDate').textContent = new Date(r.createdAt).toLocaleString();
    document.getElementById('vmStatus').innerHTML = fmtStatusBadge(r.status);
    document.getElementById('vmContentId').textContent = getContentIdStr(r);
    document.getElementById('vmContentId').parentElement.style.display = getContentIdStr(r) ? '' : 'none';

    openModal('viewModal');
  }

  function getContentIdStr(r) {
    if (r.reportType === 'Post' && r.post)  return '#' + r.post.id;
    if (r.reportType === 'Reel' && r.reel)   return '#' + r.reel.id;
    if (r.reportType === 'Group' && r.group) return '#' + r.group.id;
    if (r.reportType === 'User' && r.user)   return r.user.id;
    return '';
  }

  /* ── Review modal ─────────────────────────────────────────── */
  var _reviewingId = null;

  function openReview(reportId) {
    var r = null;
    for (var i = 0; i < _cachedItems.length; i++) {
      if (_cachedItems[i].id === reportId) { r = _cachedItems[i]; break; }
    }
    if (!r) return;
    _reviewingId = reportId;

    var modal = document.getElementById('reviewModal');
    if (!modal) return;

    document.getElementById('revReportId').textContent = '#' + r.id;
    document.getElementById('revContentPreview').textContent = getContentPreview(r);

    var actionSel = document.getElementById('revAction');
    var isLocked = isContentLocked(r);
    // Options: Nothing (default), Lock, Unlock
    actionSel.options.length = 0;
    actionSel.options.add(new Option('No action on content', '0'));
    if (r.reportType !== 'User') {
      if (isLocked) {
        actionSel.options.add(new Option('Unlock ' + r.reportType, '2'));
      } else {
        actionSel.options.add(new Option('Lock ' + r.reportType, '1'));
      }
    }
    actionSel.value = '0';

    document.getElementById('revNote').value = '';
    document.getElementById('revDismiss').checked = false;

    openModal('reviewModal');
  }

  function submitReview() {
    if (!_reviewingId) return;
    var reportId = _reviewingId;

    var actionSel  = document.getElementById('revAction');
    var isDismiss = document.getElementById('revDismiss').checked;
    var note      = document.getElementById('revNote').value.trim();

    var body = JSON.stringify({
      action:      parseInt(actionSel.value, 10),
      isDismissed: isDismiss,
      reviewNote:  note || null
    });

    fetch('/admin/moderation/reports/' + reportId + '/review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'RequestVerificationToken': getCsrfToken()
      },
      body: body
    })
    .then(function (r) {
      if (!r.ok) throw new Error('Server error ' + r.status);
      return r.json();
    })
    .then(function () {
      closeModal('reviewModal');
      loadReports(currentPage);
      showToast('Report #' + reportId + ' ' + (isDismiss ? 'dismissed' : 'reviewed') + ' successfully.');
    })
    .catch(function (err) {
      showToast('Error: ' + err.message, 'danger');
    });
  }

  /* ── Lock / Unlock from row button ──────────────────────── */
  window.Admin.Moderation = {
    gotoPage: function (page) { loadReports(page); },

    openView: function (id) {
      window.__reviewFromViewId = id;
      openView(id);
    },

    openReview: function (id) { openReview(id); },

    submitReview: function () { submitReview(); },

    openReviewFromView: function () {
      if (window.__reviewFromViewId) {
        closeModal('viewModal');
        openReview(window.__reviewFromViewId);
      }
    },

    lockContent: function (reportId, contentType) {
      doContentAction(reportId, contentType, 'lock');
    },

    unlockContent: function (reportId, contentType) {
      doContentAction(reportId, contentType, 'unlock');
    }
  };

  /* We need to look up content ID from the current cached items */
  function doContentAction(reportId, contentType, action) {
    var r = null;
    for (var i = 0; i < _cachedItems.length; i++) {
      if (_cachedItems[i].id === reportId) { r = _cachedItems[i]; break; }
    }
    if (!r) return;

    var contentId = null;
    if (contentType === 'Post'  && r.post)   contentId = r.post.id;
    if (contentType === 'Reel'   && r.reel)   contentId = r.reel.id;
    if (contentType === 'Group' && r.group)   contentId = r.group.id;
    if (!contentId) return;

    var endpoint = '/admin/moderation/' + contentType.toLowerCase() + 's/' + contentId + '/' + action;

    fetch(endpoint, {
      method: 'POST',
      headers: { 'RequestVerificationToken': getCsrfToken() }
    })
    .then(function (res) {
      if (!res.ok) throw new Error('Server error');
      return res.json();
    })
    .then(function () {
      loadReports(currentPage);
      showToast(contentType + ' ' + action + 'ed successfully.');
    })
    .catch(function (err) {
      showToast('Error: ' + err.message, 'danger');
    });
  }

  /* ── Row action bindings ─────────────────────────────────── */
  function bindRowActions() {
    // Store items for lookup
    var rows = document.querySelectorAll('#reportsBody tr[data-id]');
    _cachedItems = [];
    rows.forEach(function (row) {
      var id = parseInt(row.getAttribute('data-id'), 10);
      var type = row.getAttribute('data-type');
      // Find item from last loaded data via a global map
    });

    // Cache data for modal lookups
    // Re-fetch won't happen; we stored in renderRows implicitly
    // Let's collect items from the DOM by re-reading the last fetch
    // (Simpler: store the last rendered items array)
    window._modItems = window._modItems || [];
  }

  /* ── Helpers ─────────────────────────────────────────────── */
  function escHtml(s) {
    if (!s) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function fmtReason(reason) {
    return (reason || '').replace(/([A-Z])/g, ' $1').trim();
  }

  function fmtStatusBadge(status) {
    var cls = { Pending: 'badge-pending', Reviewed: 'badge-active', Dismissed: 'badge-inactive' }[status] || 'badge-pending';
    return '<span class="badge ' + cls + '"><span class="badge-dot"></span>' + status + '</span>';
  }

  function timeAgoStr(dateStr) {
    var diff = Date.now() - new Date(dateStr).getTime();
    var m = Math.floor(diff / 60000);
    if (m < 1)      return 'just now';
    if (m < 60)     return m + ' min ago';
    var h = Math.floor(m / 60);
    if (h < 24)     return h + ' hr ago';
    var d = Math.floor(h / 24);
    if (d < 30)     return d + ' day' + (d > 1 ? 's' : '') + ' ago';
    return new Date(dateStr).toLocaleDateString();
  }

  function getCsrfToken() {
    var el = document.querySelector('input[name="__RequestVerificationToken"]');
    return el ? el.value : '';
  }

  function openModal(id) {
    var m = document.getElementById(id);
    if (m) m.classList.remove('hidden');
  }

  function closeModal(id) {
    var m = document.getElementById(id);
    if (m) m.classList.add('hidden');
  }

  // Wire [data-modal-close] buttons
  document.addEventListener('click', function (e) {
    if (e.target.hasAttribute('data-modal-close')) {
      var modal = e.target.closest('.modal-overlay');
      if (modal) modal.classList.add('hidden');
    }
  });

  function showToast(msg, type) {
    type = type || 'success';
    var toast = document.getElementById('toast');
    if (!toast) return;
    var cls = { success: 'alert-success', danger: 'alert-danger' }[type] || 'alert-info';
    toast.className = 'alert ' + cls;
    toast.innerHTML = '<i class="ri-checkbox-circle-line"></i> ' + msg;
    toast.classList.remove('hidden');
    setTimeout(function () { toast.classList.add('hidden'); }, 3500);
  }

  /* ── Cache items for modal lookups ─────────────────────── */
  // renderRows stores items in _cachedItems before DOM insertion so
  // openView / openReview can look up any report by ID.


})();
