/* Admin Dashboard — JS entry point.
 *
 * Loads the four KPI cards and four time-series charts via AJAX. Each chart
 * has a `<select data-period="...">` that re-fetches when the user changes
 * the window. SVG strings are built here (mirroring _LineChart.cshtml and
 * _StackedBarChart.cshtml so the look matches the server-rendered version).
 */
(function () {
  'use strict';

  var Admin = window.Admin = window.Admin || {};
  Admin.Dashboard = Admin.Dashboard || {};

  var API = '/admin/api/stats';

  // Each chart card carries the same colour identity it has in the
  // server-rendered view, so we don't have to touch CSS.
  var LINE_THEMES = {
    userGrowthChart:  { stroke: '#3b82f6', fill: 'rgba(59, 130, 246, .18)', label: 'Users'    },
    postsChart:       { stroke: '#10b981', fill: 'rgba(16, 185, 129, .18)', label: 'Posts'    },
    commentsChart:    { stroke: '#f59e0b', fill: 'rgba(245, 158, 11, .18)', label: 'Comments' }
  };

  /* ── helpers ───────────────────────────────────────────────────────── */

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function fmt(n) {
    // Keep up to 2 decimal places, no trailing zeros.
    return Number.isFinite(n) ? +n.toFixed(2) + '' : '0';
  }

  // Day labels for the X axis. The server returns ISO weeks as DateOnly
  // strings (yyyy-MM-dd). Weekly buckets still get a short label.
  function shortLabel(iso) {
    var d = new Date(iso + 'T00:00:00Z');
    if (isNaN(d.getTime())) return iso;
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[d.getUTCMonth()] + ' ' + d.getUTCDate();
  }

  function fetchJson(url) {
    return fetch(url, { credentials: 'same-origin', headers: { Accept: 'application/json' } })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      });
  }

  /* ── SVG builders (mirror the partials in Views/Admin/Shared) ──────── */

  function buildLineSvg(daysArr, values, theme) {
    var n = values.length;
    if (n === 0) {
      return '<div style="text-align:center;color:#94a3b8;padding:60px 0;font-size:.875rem;">No data available</div>';
    }

    var W = 720, H = 220, padL = 44, padR = 16, padT = 24, padB = 32;
    var plotW = W - padL - padR;
    var plotH = H - padT - padB;

    var maxVal = Math.max.apply(null, values);
    if (maxVal <= 0) maxVal = 1;
    var niceMax = Math.max(maxVal, Math.ceil(maxVal / 50) * 50);
    if (niceMax <= 0) niceMax = 1;

    var pts = [];
    var i;
    for (i = 0; i < n; i++) {
      var x = padL + (plotW * i) / Math.max(1, n - 1);
      var y = padT + plotH - (values[i] / niceMax) * plotH;
      pts.push({ x: x, y: y, v: values[i] });
    }

    var linePoints = pts.map(function (p) { return p.x + ',' + p.y; }).join(' ');
    var areaPoints = (n > 0)
      ? (padL + ',' + (padT + plotH) + ' ' + linePoints + ' ' + (padL + plotW) + ',' + (padT + plotH))
      : '';

    var ticks = [0, niceMax / 3, (2 * niceMax) / 3, niceMax];
    var gridLines = '';
    for (i = 0; i < ticks.length; i++) {
      var t = ticks[i];
      var ratio = t / niceMax;
      var y = padT + plotH - ratio * plotH;
      var dash = (i === 0) ? '0' : '3 4';
      gridLines += '<line x1="' + padL + '" x2="' + (padL + plotW) + '" y1="' + y + '" y2="' + y +
        '" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="' + dash + '"/>';
      gridLines += '<text x="' + (padL - 8) + '" y="' + (y + 4) + '" text-anchor="end" ' +
        'font-size="10" fill="#94a3b8" font-family="Inter, sans-serif">' + Math.round(t) + '</text>';
    }

    var dots = '';
    for (i = 0; i < pts.length; i++) {
      var p = pts[i];
      dots += '<g class="line-chart-point">' +
        '<circle cx="' + p.x + '" cy="' + p.y + '" r="9" fill="transparent"/>' +
        '<circle cx="' + p.x + '" cy="' + p.y + '" r="4" fill="#fff" stroke="' + theme.stroke + '" stroke-width="2.5"/>' +
        '<g class="line-chart-tip">' +
        '<rect x="' + (p.x - 24) + '" y="' + (p.y - 32) + '" width="48" height="20" rx="4" fill="#0f172a"/>' +
        '<text x="' + p.x + '" y="' + (p.y - 18) + '" text-anchor="middle" ' +
        'font-size="11" fill="#fff" font-family="Inter, sans-serif" font-weight="600">' +
        p.v + '</text>' +
        '</g>' +
        '</g>';
    }

    var xLabels = '';
    for (i = 0; i < daysArr.length; i++) {
      var x = padL + (plotW * i) / Math.max(1, daysArr.length - 1);
      xLabels += '<text x="' + x + '" y="' + (padT + plotH + 18) + '" text-anchor="middle" ' +
        'font-size="10" fill="#94a3b8" font-family="Inter, sans-serif">' +
        escapeHtml(daysArr[i]) + '</text>';
    }

    return '' +
      '<div style="position:relative;">' +
        '<span style="position:absolute;top:0;left:0;font-size:.7rem;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.04em;">' +
          theme.label +
        '</span>' +
        '<span style="position:absolute;top:0;right:0;font-size:.7rem;color:#94a3b8;">Peak: <strong style="color:#0f172a;">' + maxVal + '</strong></span>' +
        '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none">' +
          gridLines +
          (areaPoints ? '<polygon points="' + areaPoints + '" fill="' + theme.fill + '" stroke="none"/>' : '') +
          '<polyline points="' + linePoints + '" fill="none" stroke="' + theme.stroke + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>' +
          dots +
          xLabels +
        '</svg>' +
      '</div>';
  }

  function buildStackedBarSvg(daysArr, series) {
    var n = daysArr.length;
    if (n === 0 || series.length === 0) {
      return '<div style="text-align:center;color:#94a3b8;padding:60px 0;font-size:.875rem;">No data available</div>';
    }

    var W = 720, H = 240, padL = 44, padR = 16, padT = 24, padB = 36;
    var plotW = W - padL - padR;
    var plotH = H - padT - padB;

    var totals = new Array(n);
    var allZero = true;
    for (var i = 0; i < n; i++) {
      var sum = 0;
      for (var s = 0; s < series.length; s++) {
        sum += series[s].values[i] || 0;
      }
      totals[i] = sum;
      if (sum !== 0) allZero = false;
    }
    if (allZero) {
      return '<div style="text-align:center;color:#94a3b8;padding:60px 0;font-size:.875rem;">No data available</div>';
    }

    var maxTotal = Math.max.apply(null, totals);
    if (maxTotal <= 0) maxTotal = 1;
    var niceMax = Math.max(maxTotal, Math.ceil(maxTotal / 50) * 50);
    if (niceMax <= 0) niceMax = 1;

    var ticks = [0, niceMax / 3, (2 * niceMax) / 3, niceMax];
    var gridLines = '';
    for (var t = 0; t < ticks.length; t++) {
      var ratio = ticks[t] / niceMax;
      var y = padT + plotH - ratio * plotH;
      var dash = (t === 0) ? '0' : '3 4';
      gridLines += '<line x1="' + padL + '" x2="' + (padL + plotW) + '" y1="' + y + '" y2="' + y +
        '" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="' + dash + '"/>';
      gridLines += '<text x="' + (padL - 8) + '" y="' + (y + 4) + '" text-anchor="end" ' +
        'font-size="10" fill="#94a3b8" font-family="Inter, sans-serif">' + Math.round(ticks[t]) + '</text>';
    }

    var slotW = plotW / Math.max(1, n);
    var barW  = Math.max(8, slotW * 0.55);
    var barGap = (slotW - barW) / 2;

    var bars = '';
    for (var i = 0; i < n; i++) {
      var slotX = padL + slotW * i;
      var x = slotX + barGap;
      var stackTop = padT + plotH;

      for (var s = 0; s < series.length; s++) {
        var sv = series[s];
        var v = sv.values[i] || 0;
        if (v <= 0) continue;
        var segH = (v / niceMax) * plotH;
        var y = stackTop - segH;

        bars += '<g class="stacked-bar-segment" tabindex="0">' +
          '<rect x="' + fmt(x) + '" y="' + fmt(y) + '" width="' + fmt(barW) + '" height="' + fmt(segH) + '" fill="' + sv.color + '"/>' +
          '<g class="stacked-bar-tip">' +
            '<rect x="' + fmt(x + barW / 2 - 30) + '" y="' + fmt(y - 28) + '" width="60" height="22" rx="4" fill="#0f172a"/>' +
            '<text x="' + fmt(x + barW / 2) + '" y="' + fmt(y - 12) + '" text-anchor="middle" ' +
              'font-size="11" fill="#fff" font-family="Inter, sans-serif" font-weight="600">' +
              escapeHtml(sv.label) + ': ' + v +
            '</text>' +
          '</g>' +
        '</g>';

        stackTop -= segH;
      }

      var labelY = padT + plotH - (totals[i] / niceMax) * plotH - 6;
      bars += '<text x="' + fmt(x + barW / 2) + '" y="' + fmt(labelY) + '" text-anchor="middle" ' +
        'font-size="10" fill="#0f172a" font-family="Inter, sans-serif" font-weight="600">' +
        totals[i] + '</text>';
    }

    var xLabels = '';
    for (var i = 0; i < daysArr.length; i++) {
      var xc = padL + slotW * i + slotW / 2;
      xLabels += '<text x="' + fmt(xc) + '" y="' + (padT + plotH + 18) + '" text-anchor="middle" ' +
        'font-size="10" fill="#94a3b8" font-family="Inter, sans-serif">' +
        escapeHtml(daysArr[i]) + '</text>';
    }

    var legend = '';
    for (var s = 0; s < series.length; s++) {
      var total = series[s].values.reduce(function (a, b) { return a + b; }, 0);
      legend += '<span style="display:inline-flex;align-items:center;gap:6px;">' +
        '<span style="width:10px;height:10px;border-radius:2px;background:' + series[s].color + ';display:inline-block;"></span>' +
        escapeHtml(series[s].label) + ' <strong style="color:#0f172a;">' + total + '</strong>' +
        '</span>';
    }

    return '' +
      '<div style="position:relative;">' +
        '<span style="position:absolute;top:0;left:0;font-size:.7rem;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.04em;">Reels</span>' +
        '<span style="position:absolute;top:0;right:0;font-size:.7rem;color:#94a3b8;">Peak: <strong style="color:#0f172a;">' + maxTotal + '</strong></span>' +
        '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none">' +
          gridLines +
          bars +
          xLabels +
        '</svg>' +
        '<div style="display:flex;justify-content:flex-end;gap:14px;flex-wrap:wrap;margin-top:6px;font-size:.75rem;color:#475569;">' +
          legend +
        '</div>' +
      '</div>';
  }

  /* ── data → view glue ──────────────────────────────────────────────── */

  function renderLineChart(cardId, series, theme) {
    var card = document.getElementById(cardId);
    if (!card) return;
    var labels = series.map(function (r) { return shortLabel(r.day); });
    var values = series.map(function (r) { return r.count; });
    card.innerHTML =
      '<style>' +
        '.line-chart-wrap svg { width: 100%; height: 220px; display: block; }' +
        '@media (max-width: 768px) { .line-chart-wrap svg { height: 180px !important; } }' +
        '.line-chart-point { cursor: pointer; }' +
        '.line-chart-tip { opacity: 0; pointer-events: none; transition: opacity .15s ease; }' +
        '.line-chart-point:hover .line-chart-tip, .line-chart-point:focus .line-chart-tip { opacity: 1 !important; }' +
      '</style>' +
      buildLineSvg(labels, values, theme);
  }

  function renderStackedBar(cardId, series, items) {
    var card = document.getElementById(cardId);
    if (!card) return;
    var labels = series.map(function (r) { return shortLabel(r.day); });
    card.innerHTML =
      '<style>' +
        '.stacked-bar-wrap svg { width: 100%; height: 240px; display: block; }' +
        '@media (max-width: 768px) { .stacked-bar-wrap svg { height: 200px !important; } }' +
        '.stacked-bar-segment { transition: opacity .15s ease; cursor: pointer; }' +
        '.stacked-bar-segment:hover { opacity: .85; }' +
        '.stacked-bar-tip { opacity: 0; pointer-events: none; transition: opacity .15s ease; }' +
        '.stacked-bar-segment:hover .stacked-bar-tip, .stacked-bar-segment:focus .stacked-bar-tip { opacity: 1 !important; }' +
      '</style>' +
      buildStackedBarSvg(labels, items);
  }

  function setText(selector, value) {
    var el = document.querySelector(selector);
    if (el) el.textContent = value;
  }

  /* ── fetchers ──────────────────────────────────────────────────────── */

  function loadTotals() {
    return fetchJson(API + '/totals').then(function (t) {
      setText('[data-stat="total-users"]',       Number(t.totalUsers       || 0).toLocaleString());
      setText('[data-stat="total-posts"]',       Number(t.totalPosts       || 0).toLocaleString());
      setText('[data-stat="active-groups"]',     Number(t.totalActiveGroups|| 0).toLocaleString());
      setText('[data-stat="online-now"]',        Number(t.onlineNow        || 0).toLocaleString());
    });
  }

  function loadLineChart(cardId, endpoint, days) {
    return fetchJson(API + '/' + endpoint + '?days=' + days)
      .then(function (data) { renderLineChart(cardId, data, LINE_THEMES[cardId]); });
  }

  function loadStackedChart(cardId, endpoint, days) {
    return fetchJson(API + '/' + endpoint + '?days=' + days)
      .then(function (data) {
        renderStackedBar(cardId, data, [{
          label: 'Reels uploaded',
          color: '#ec4899',
          values: data.map(function (r) { return r.count; })
        }]);
      });
  }

  /* ── period switchers ──────────────────────────────────────────────── */

  function bindPeriodSelectors() {
    document.querySelectorAll('[data-period]').forEach(function (sel) {
      sel.addEventListener('change', function () {
        var days = parseInt(sel.value, 10) || 7;
        var key  = sel.dataset.period;

        // Reflect the chosen window in the card title (e.g. "Last 30 Days").
        var labelEl = document.querySelector('[data-period-label="' + key + '"]');
        if (labelEl) labelEl.textContent = String(days);

        // Per-card refresh — only the affected chart re-fetches.
        if (key === 'user-growth')  return loadLineChart('userGrowthChart',  'user-growth',    days);
        if (key === 'post-volume')  return loadLineChart('postsChart',       'post-volume',    days);
        if (key === 'comment-volume')return loadLineChart('commentsChart',    'comment-volume', days);
        if (key === 'reel-volume')  return loadStackedChart('reelsChart',    'reel-volume',    days);
      });
    });
  }

  /* ── master refresh ────────────────────────────────────────────────── */

  function refreshAll(days) {
    days = days || 7;
    var tasks = [
      loadTotals(),
      loadLineChart('userGrowthChart', 'user-growth',    days),
      loadLineChart('postsChart',      'post-volume',    days),
      loadLineChart('commentsChart',   'comment-volume', days),
      loadStackedChart('reelsChart',   'reel-volume',    days)
    ];
    return Promise.all(tasks).catch(function (err) {
      console.error('[dashboard] refresh failed', err);
    });
  }

  /* ── boot ──────────────────────────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', function () {
    if (!document.querySelector('[data-stat="total-users"]')) return; // not on dashboard
    bindPeriodSelectors();
    refreshAll(7);
    setInterval(function () { refreshAll(7); }, 60000); // soft auto-refresh every minute
  });
})();