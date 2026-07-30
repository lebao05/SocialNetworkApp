/* Admin Groups page
 *
 * Mirrors admin.users.js but talks to /admin/groups/list and the
 * /admin/groups/{id}/(un)lock endpoints.
 */
(function () {
  'use strict';

  var Admin = window.Admin = window.Admin || {};
  Admin.Groups = Admin.Groups || {};

  var PAGE_SIZE = 20;

  var state = {
    q: '',
    privacy: '',
    status: '',
    page: 1
  };

  function fetchAndRender() {
    var tbody = document.getElementById('groupsTbody');
    var info  = document.getElementById('groupsPaginationInfo');
    var ctrls = document.getElementById('groupsPaginationControls');
    if (!tbody) return;

    tbody.innerHTML =
      '<tr><td colspan="9" style="text-align:center;padding:32px;color:#94a3b8;">Loading…</td></tr>';

    var params = new URLSearchParams({
      q: state.q,
      privacy: state.privacy,
      status: state.status,
      page: state.page,
      pageSize: PAGE_SIZE
    });

    fetch('/admin/groups/list?' + params.toString(), {
      headers: { 'Accept': 'application/json' },
      credentials: 'same-origin'
    })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (payload) {
        renderRows(payload.items || []);
        renderPagination(payload, info, ctrls, function (nextPage) {
          state.page = nextPage;
          fetchAndRender();
        });
        if (Admin.initTables) Admin.initTables();
      })
      .catch(function (err) {
        tbody.innerHTML =
          '<tr><td colspan="9" style="text-align:center;padding:32px;color:#dc2626;">' +
          'Failed to load groups: ' + escapeHtml(err.message) + '</td></tr>';
      });
  }

  function renderRows(items) {
    var tbody = document.getElementById('groupsTbody');
    if (!tbody) return;

    if (!items.length) {
      tbody.innerHTML =
        '<tr><td colspan="9" style="text-align:center;padding:32px;color:#94a3b8;">No groups found.</td></tr>';
      return;
    }

    var html = '';
    items.forEach(function (g) {
      var initials = (g.name || '?').split(/\s+/).slice(0, 2)
        .map(function (w) { return w[0] || ''; }).join('').toUpperCase() || '?';

      var privacyText = (g.privacyType || '').toLowerCase();
      var privacyClass = privacyText === 'public'
        ? 'badge-info'
        : privacyText === 'private' ? 'badge-pending' : '';

      var statusText  = g.isLocked ? 'Locked' : 'Unlocked';
      var statusClass = g.isLocked ? 'badge-banned' : 'badge-active';

      var lockBtn = g.isLocked
        ? '<button class="action-btn success" title="Unlock" aria-label="Unlock group" data-action="unlock" data-group-id="' + g.id + '">' +
            '<i class="ri-lock-unlock-line"></i></button>'
        : '<button class="action-btn danger" title="Lock" aria-label="Lock group" data-action="lock" data-group-id="' + g.id + '">' +
            '<i class="ri-lock-line"></i></button>';

      html += '' +
        '<tr data-group-id="' + g.id + '">' +
          '<td><input type="checkbox" /></td>' +
          '<td>' +
            '<div class="cell-user">' +
              '<div class="cell-user-avatar">' + escapeHtml(initials) + '</div>' +
              '<div class="cell-user-info">' +
                '<div class="cell-user-name">' + escapeHtml(g.name || '—') + '</div>' +
                '<div class="cell-user-email">G-' + g.id + '</div>' +
              '</div>' +
            '</div>' +
          '</td>' +
          '<td><span class="badge ' + privacyClass + '"><span class="badge-dot"></span>' + escapeHtml(privacyText) + '</span></td>' +
          '<td class="cell-muted">' + (g.memberCount || 0).toLocaleString() + '</td>' +
          '<td class="cell-muted">' + (g.postCount || 0).toLocaleString() + '</td>' +
          '<td>' + escapeHtml(g.ownerDisplayName || '—') + '</td>' +
          '<td class="cell-muted">' + formatDate(g.createdAt) + '</td>' +
          '<td><span class="badge ' + statusClass + '"><span class="badge-dot"></span>' + statusText + '</span></td>' +
          '<td style="text-align:right;">' +
            '<div class="cell-actions" style="justify-content:flex-end;">' +
              lockBtn +
            '</div>' +
          '</td>' +
        '</tr>';
    });
    tbody.innerHTML = html;
  }

  function renderPagination(payload, info, ctrls, onPage) {
    var page       = payload.page       || state.page;
    var pageSize   = payload.pageSize   || PAGE_SIZE;
    var totalCount = payload.totalCount || 0;
    var totalPages = payload.totalPages || 0;

    if (info) {
      var from = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
      var to   = Math.min(page * pageSize, totalCount);
      info.textContent = totalCount === 0
        ? 'No groups'
        : 'Showing ' + from + '–' + to + ' of ' + totalCount.toLocaleString() + ' groups';
    }

    if (!ctrls) return;
    var html = '';
    html += '<button class="page-btn" ' + (page <= 1 ? 'disabled' : '') +
            ' data-page="' + (page - 1) + '"><i class="ri-arrow-left-s-line"></i></button>';

    var pages = compactPages(page, totalPages);
    pages.forEach(function (p) {
      if (p === '...') {
        html += '<span class="page-ellipsis">…</span>';
      } else {
        html += '<button class="page-btn ' + (p === page ? 'active' : '') +
                '" data-page="' + p + '">' + p + '</button>';
      }
    });

    html += '<button class="page-btn" ' + (page >= totalPages ? 'disabled' : '') +
            ' data-page="' + (page + 1) + '"><i class="ri-arrow-right-s-line"></i></button>';
    ctrls.innerHTML = html;

    ctrls.querySelectorAll('button.page-btn:not([disabled])').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var next = parseInt(btn.dataset.page, 10);
        if (!isNaN(next)) onPage(next);
      });
    });
  }

  function compactPages(current, total) {
    if (total <= 7) {
      var arr = [];
      for (var i = 1; i <= total; i++) arr.push(i);
      return arr;
    }
    var out = [1];
    var from = Math.max(2, current - 1);
    var to   = Math.min(total - 1, current + 1);
    if (from > 2) out.push('...');
    for (var j = from; j <= to; j++) out.push(j);
    if (to < total - 1) out.push('...');
    out.push(total);
    return out;
  }

  /* ── Action handlers (lock/unlock) ──────────────────────────── */

  function bindRowActions() {
    var tbody = document.getElementById('groupsTbody');
    if (!tbody) return;

    tbody.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-action]');
      if (!btn) return;

      var groupId = btn.dataset.groupId;
      var action  = btn.dataset.action;
      if (!groupId) return;

      if (action === 'lock' || action === 'unlock') {
        toggleLock(groupId, action === 'lock', btn);
      }
    });
  }

  function toggleLock(groupId, isLocked, originBtn) {
    var url = '/admin/groups/' + encodeURIComponent(groupId) + (isLocked ? '/lock' : '/unlock');
    if (originBtn) originBtn.disabled = true;

    return fetch(url, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      credentials: 'same-origin'
    })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function () {
        fetchAndRender();
      })
      .catch(function (err) {
        alert(isLocked ? 'Failed to lock group: ' : 'Failed to unlock group: ' + err.message);
        if (originBtn) originBtn.disabled = false;
      });
  }

  /* ── Filter form ────────────────────────────────────────────── */

  function bindFilterForm() {
    var form = document.getElementById('groupsFilterForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      state.q       = (fd.get('q')       || '').toString();
      state.privacy = (fd.get('privacy') || '').toString();
      state.status  = (fd.get('status')  || '').toString();
      state.page    = 1;
      fetchAndRender();
    });

    var resetBtn = document.getElementById('groupsResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        form.reset();
        state.q = state.privacy = state.status = '';
        state.page = 1;
        fetchAndRender();
      });
    }
  }

  /* ── Utilities ──────────────────────────────────────────────── */

  function formatDate(iso) {
    if (!iso) return '—';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var params = new URLSearchParams(window.location.search);
    if (params.has('q'))       state.q       = params.get('q');
    if (params.has('privacy')) state.privacy = params.get('privacy');
    if (params.has('status'))  state.status  = params.get('status');
    if (params.has('page'))    state.page    = Math.max(1, parseInt(params.get('page'), 10) || 1);

    bindFilterForm();
    bindRowActions();
    fetchAndRender();
  });
})();