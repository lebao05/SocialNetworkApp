/* Admin Users page
 *
 * Loads the user list via /admin/users/list (AJAX), wires the filter
 * form, pagination controls, and lock/unlock + promote/demote buttons.
 *
 * Lock/unlock and promote/demote update only the affected row in place —
 * the rest of the table is left untouched so the admin doesn't lose
 * their scroll position or pending bulk selections.
 *
 * Endpoints:
 *   GET  /admin/users/list?q=&status=&role=&page=&pageSize=
 *   POST /admin/users/{id}/lock
 *   POST /admin/users/{id}/unlock
 *   POST /admin/users/{id}/promote
 *   POST /admin/users/{id}/demote
 */
(function () {
  'use strict';

  var Admin = window.Admin = window.Admin || {};
  Admin.Users = Admin.Users || {};

  var PAGE_SIZE = 20;

  // Mirror of the server-side row model. We store the per-row role/lock
  // state here so we can update the row in place after an AJAX mutation
  // without re-fetching the whole page.
  var rowState = {};   // userId -> { isAdmin, isLocked }

  var state = {
    q: '',
    status: '',
    role: '',
    page: 1
  };

  /* ── Helpers ───────────────────────────────────────────────── */

  function currentAdminId() {
    var host = document.getElementById('users-current-admin-id');
    return (host && host.dataset.adminId) || '';
  }

  function badge(roleText, statusText) {
    var roleClass   = roleText === 'Admin'   ? 'badge-info'    : '';
    var statusClass = statusText === 'Locked' ? 'badge-banned'  : 'badge-active';
    return {
      role:   '<span class="badge ' + roleClass   + '">' + escapeHtml(roleText)   + '</span>',
      status: '<span class="badge ' + statusClass + '"><span class="badge-dot"></span>' + escapeHtml(statusText) + '</span>'
    };
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
    });
  }
  function escapeAttr(s) { return escapeHtml(s); }

  function formatDate(iso) {
    if (!iso) return '—';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  /* ── Fetch + render ─────────────────────────────────────────── */

  function fetchAndRender() {
    var tbody = document.getElementById('usersTbody');
    var info  = document.getElementById('usersPaginationInfo');
    var ctrls = document.getElementById('usersPaginationControls');
    if (!tbody) return;

    tbody.innerHTML =
      '<tr><td colspan="8" style="text-align:center;padding:32px;color:#94a3b8;">Loading…</td></tr>';

    var params = new URLSearchParams({
      q: state.q,
      status: state.status,
      role: state.role,
      page: state.page,
      pageSize: PAGE_SIZE
    });

    fetch('/admin/users/list?' + params.toString(), {
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
          '<tr><td colspan="8" style="text-align:center;padding:32px;color:#dc2626;">' +
          'Failed to load users: ' + escapeHtml(err.message) + '</td></tr>';
      });
  }

  function buildActionCell(userId) {
    var lockBtnHtml = rowState[userId].isLocked
      ? '<button class="action-btn success" title="Unlock user" data-action="unlock" data-user-id="' + userId + '">' +
          '<i class="ri-lock-unlock-line"></i></button>'
      : '<button class="action-btn danger" title="Lock user" data-action="lock" data-user-id="' + userId + '">' +
          '<i class="ri-lock-line"></i></button>';

    // The role toggle is hidden when the target user IS the acting admin —
    // self-promotion/demotion is rejected by the server anyway, so don't
    // offer the button at all.
    var roleBtnHtml = '';
    if (userId !== currentAdminId()) {
      roleBtnHtml = rowState[userId].isAdmin
        ? '<button class="action-btn warning" title="Demote to User" data-action="demote" data-user-id="' + userId + '">' +
            '<i class="ri-shield-user-line"></i></button>'
        : '<button class="action-btn primary" title="Promote to Admin" data-action="promote" data-user-id="' + userId + '">' +
            '<i class="ri-shield-star-line"></i></button>';
    }

    return '' +
      '<div class="cell-actions" style="justify-content:flex-end;">' +
        '<button class="action-btn primary" title="View profile" data-action="view" data-user-id="' + userId + '">' +
          '<i class="ri-eye-line"></i></button>' +
        roleBtnHtml +
        lockBtnHtml +
      '</div>';
  }

  function renderRows(items) {
    var tbody = document.getElementById('usersTbody');
    if (!tbody) return;

    if (!items.length) {
      tbody.innerHTML =
        '<tr><td colspan="8" style="text-align:center;padding:32px;color:#94a3b8;">No users found.</td></tr>';
      return;
    }

    var html = '';
    items.forEach(function (u) {
      // Cache server-side truth so in-place updates after a mutation are
      // correct even when the next render hasn't happened yet.
      rowState[u.id] = { isAdmin: !!u.isAdmin, isLocked: !!u.isLocked };

      var fullName = ((u.firstName || '') + ' ' + (u.lastName || '')).trim() || u.email || 'User';
      var initials = (fullName.split(/\s+/).slice(0, 2)
        .map(function (w) { return w[0] || ''; }).join('') || '?').toUpperCase();

      var b = badge(
        rowState[u.id].isAdmin ? 'Admin' : 'User',
        rowState[u.id].isLocked ? 'Locked' : 'Unlocked'
      );

      var avatar = u.avatarUrl
        ? '<img src="' + escapeAttr(u.avatarUrl) + '" alt="" style="width:40px;height:40px;border-radius:50%;object-fit:cover;" />'
        : '<div class="cell-user-avatar">' + escapeHtml(initials) + '</div>';

      html += '' +
        '<tr data-user-id="' + u.id + '">' +
          '<td><input type="checkbox" /></td>' +
          '<td>' +
            '<div class="cell-user">' +
              avatar +
              '<div class="cell-user-info">' +
                '<div class="cell-user-name">' + escapeHtml(fullName) + '</div>' +
                '<div class="cell-user-email">' + escapeHtml(u.email || '') + '</div>' +
              '</div>' +
            '</div>' +
          '</td>' +
          '<td data-cell="role">' + b.role + '</td>' +
          '<td data-cell="status">' + b.status + '</td>' +
          '<td class="cell-muted">' + (u.postCount || 0).toLocaleString() + '</td>' +
          '<td class="cell-muted">' + formatDate(u.createdAt) + '</td>' +
          '<td class="cell-muted">' + formatDate(u.lastActiveAt || u.createdAt) + '</td>' +
          '<td data-cell="actions">' + buildActionCell(u.id) + '</td>' +
        '</tr>';
    });
    tbody.innerHTML = html;
  }

  /* ── In-place row updates ───────────────────────────────────── */

  // After a successful mutation we update the cached state, then rewrite
  // the role cell, status cell, and action cell of *that one row*. The
  // rest of the table (including any open detail modals backed by other
  // rows) is untouched.
  function applyMutationToRow(userId, patch) {
    if (!rowState[userId]) return;
    Object.assign(rowState[userId], patch);

    var row = document.querySelector('#usersTbody tr[data-user-id="' + userId + '"]');
    if (!row) return;

    var b = badge(
      rowState[userId].isAdmin  ? 'Admin'   : 'User',
      rowState[userId].isLocked ? 'Locked'  : 'Unlocked'
    );

    var roleCell   = row.querySelector('[data-cell="role"]');
    var statusCell = row.querySelector('[data-cell="status"]');
    var actionsCell= row.querySelector('[data-cell="actions"]');
    if (roleCell)    roleCell.innerHTML   = b.role;
    if (statusCell)  statusCell.innerHTML = b.status;
    if (actionsCell) actionsCell.innerHTML = buildActionCell(userId);
  }

  /* ── Pagination (unchanged) ─────────────────────────────────── */

  function renderPagination(payload, info, ctrls, onPage) {
    var page       = payload.page       || state.page;
    var pageSize   = payload.pageSize   || PAGE_SIZE;
    var totalCount = payload.totalCount || 0;
    var totalPages = payload.totalPages || 0;

    if (info) {
      var from = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
      var to   = Math.min(page * pageSize, totalCount);
      info.textContent = totalCount === 0
        ? 'No users'
        : 'Showing ' + from + '–' + to + ' of ' + totalCount.toLocaleString() + ' users';
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

  /* ── Action handlers (lock/unlock + promote/demote) ─────────── */

  // Pending user id for the "Confirm Lock" modal.
  var pendingLockUserId = null;
  var pendingLockUserName = '';

  function bindRowActions() {
    var tbody = document.getElementById('usersTbody');
    if (!tbody) return;

    tbody.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-action]');
      if (!btn) return;

      var userId = btn.dataset.userId;
      var action = btn.dataset.action;
      if (!userId) return;

      if (action === 'lock') {
        var row = btn.closest('tr');
        var nameEl = row ? row.querySelector('.cell-user-name') : null;
        pendingLockUserId = userId;
        pendingLockUserName = nameEl ? nameEl.textContent : 'this user';
        var label = document.getElementById('banUserName');
        if (label) label.textContent = pendingLockUserName;
        var modal = document.getElementById('banUserModal');
        if (modal) {
          modal.classList.remove('hidden');
          document.body.style.overflow = 'hidden';
        }
      } else if (action === 'unlock') {
        toggleLock(userId, false, btn);
      } else if (action === 'promote') {
        toggleRole(userId, true, btn);
      } else if (action === 'demote') {
        toggleRole(userId, false, btn);
      } else if (action === 'view') {
        populateUserDetail(userId);
      }
    });

    var confirm = document.getElementById('banUserConfirm');
    if (confirm && !confirm.dataset.bound) {
      confirm.dataset.bound = '1';
      confirm.addEventListener('click', function () {
        if (!pendingLockUserId) return;
        toggleLock(pendingLockUserId, true, confirm);
        pendingLockUserId = null;
        var modal = document.getElementById('banUserModal');
        if (modal) {
          modal.classList.add('hidden');
          document.body.style.overflow = '';
        }
      });
    }
  }

  function populateUserDetail(userId) {
    var row = document.querySelector('#usersTbody tr[data-user-id="' + userId + '"]');
    if (!row) return;
    var name  = row.querySelector('.cell-user-name')?.textContent || '';
    var email = row.querySelector('.cell-user-email')?.textContent || '';
    var role  = row.querySelector('td:nth-child(3) .badge')?.textContent.trim() || '—';
    var stat  = row.querySelector('td:nth-child(4) .badge')?.textContent.trim() || '—';
    var posts = row.querySelector('td:nth-child(5)')?.textContent.trim() || '0';
    var joined = row.querySelector('td:nth-child(6)')?.textContent.trim() || '—';

    setText('userDetailName', name);
    setText('userDetailEmail', email);
    setText('userDetailRole', role);
    setText('userDetailStatus', stat);
    setText('userDetailPosts', posts);
    setText('userDetailJoined', joined);

    var modal = document.getElementById('userDetailModal');
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function toggleLock(userId, isLocked, originBtn) {
    var url = '/admin/users/' + encodeURIComponent(userId) + (isLocked ? '/lock' : '/unlock');
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
        // Update only the affected row — no full-list reload.
        applyMutationToRow(userId, { isLocked: isLocked });
      })
      .catch(function (err) {
        alert(isLocked ? 'Failed to lock user: ' : 'Failed to unlock user: ' + err.message);
        if (originBtn) originBtn.disabled = false;
      });
  }

  function toggleRole(userId, makeAdmin, originBtn) {
    var url = '/admin/users/' + encodeURIComponent(userId) + (makeAdmin ? '/promote' : '/demote');
    if (originBtn) originBtn.disabled = true;

    return fetch(url, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      credentials: 'same-origin'
    })
      .then(function (r) {
        // 400 = self-role-change or validation; 404 = user gone. Both are
        // hard failures for this row — surface the server message.
        if (!r.ok) {
          return r.json().then(function (body) {
            throw new Error((body && body.error) || ('HTTP ' + r.status));
          });
        }
        return r.json();
      })
      .then(function () {
        applyMutationToRow(userId, { isAdmin: makeAdmin });
      })
      .catch(function (err) {
        alert((makeAdmin ? 'Failed to promote user: ' : 'Failed to demote user: ') + err.message);
        if (originBtn) originBtn.disabled = false;
      });
  }

  /* ── Filter form ────────────────────────────────────────────── */

  function bindFilterForm() {
    var form = document.getElementById('usersFilterForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      state.q      = (fd.get('q')      || '').toString();
      state.status = (fd.get('status') || '').toString();
      state.role   = (fd.get('role')   || '').toString();
      state.page   = 1;
      fetchAndRender();
    });

    var resetBtn = document.getElementById('usersResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        form.reset();
        state.q = state.status = state.role = '';
        state.page = 1;
        fetchAndRender();
      });
    }
  }

  /* ── Boot ───────────────────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', function () {
    var params = new URLSearchParams(window.location.search);
    if (params.has('q'))      state.q      = params.get('q');
    if (params.has('status')) state.status = params.get('status');
    if (params.has('role'))   state.role   = params.get('role');
    if (params.has('page'))   state.page   = Math.max(1, parseInt(params.get('page'), 10) || 1);

    bindFilterForm();
    bindRowActions();
    fetchAndRender();
  });
})();