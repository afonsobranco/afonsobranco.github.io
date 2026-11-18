(function () {
  'use strict';

  /* ---------- Project icons (24×24, stroke) ----------
     Use one of these names in projects.json "icon".
     Unknown or missing icons fall back to the project's first letter. */
  var ICONS = {
    weather: '<path d="M12 2v2M4.9 4.9l1.4 1.4M20 12h2M19.1 4.9l-1.4 1.4"/><path d="M15.9 12.6a4 4 0 0 0-5.9-4.1"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/>',
    mountain: '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>',
    translate: '<path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>',
    teleport: '<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>',
    pdf: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8M16 17H8M10 9H8"/>',
    record: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5" fill="currentColor"/>',
    compress: '<path d="m15 15 6 6M15 15v4.8M15 15h4.8"/><path d="M9 19.8V15m0 0H4.2M9 15l-6 6"/><path d="M15 4.2V9m0 0h4.8M15 9l6-6"/><path d="M9 4.2V9m0 0H4.2M9 9 3 3"/>',
    code: '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>',
    regex: '<path d="M17 3v10"/><path d="m12.67 5.5 8.66 5"/><path d="m12.67 10.5 8.66-5"/><rect x="3" y="15" width="6" height="6" rx="2"/>',
    contrast: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor"/>',
    path: '<path d="M15.7 21.3a1 1 0 0 1-1.4 0l-1.6-1.6a1 1 0 0 1 0-1.4l5.6-5.6a1 1 0 0 1 1.4 0l1.6 1.6a1 1 0 0 1 0 1.4z"/><path d="m18 13-1.4-6.9a1 1 0 0 0-.7-.8L3.2 2a1 1 0 0 0-1.2 1.2l3.3 12.7a1 1 0 0 0 .8.7L13 18"/><path d="m2.3 2.3 7.3 7.3"/><circle cx="11" cy="11" r="2"/>',
    glass: '<path d="M12.8 2.2a2 2 0 0 0-1.7 0L2.6 6.1a1 1 0 0 0 0 1.8l8.6 3.9a2 2 0 0 0 1.7 0l8.6-3.9a1 1 0 0 0 0-1.8Z"/><path d="m22 17.6-9.2 4.2a2 2 0 0 1-1.7 0L2 17.6"/><path d="m22 12.6-9.2 4.2a2 2 0 0 1-1.7 0L2 12.6"/>',
    ratio: '<rect x="6" y="2" width="12" height="20" rx="2"/><rect x="2" y="6" width="20" height="12" rx="2"/>',
    tool: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/>'
  };

  var ARROW = '<svg class="go" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';
  var GH = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/></svg>';

  var main = document.getElementById('main');
  var chipsEl = document.getElementById('chips');
  var q = document.getElementById('q');
  var subtitle = document.getElementById('subtitle');

  var projects = [];
  var categories = [];
  var active = 'All';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function safeUrl(u) {
    try {
      var url = new URL(u, location.href);
      return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
    } catch (e) { return null; }
  }

  function hostLabel(u) {
    var h = new URL(u).hostname;
    if (h.endsWith('github.io')) return 'GitHub Pages';
    if (h.endsWith('vercel.app')) return 'Vercel';
    if (h.endsWith('netlify.app')) return 'Netlify';
    return h.replace(/^www\./, '');
  }

  function safeColor(c) {
    return /^#[0-9a-f]{3,8}$/i.test(c || '') ? c : '#0f766e';
  }

  function tileHtml(p) {
    var svg = ICONS[p.icon];
    if (svg) return '<svg viewBox="0 0 24 24" aria-hidden="true">' + svg + '</svg>';
    return '<span class="mono" aria-hidden="true">' + esc((p.name || '?').trim().charAt(0).toUpperCase()) + '</span>';
  }

  function cardHtml(p) {
    var code = p.repo && !p.private && safeUrl(p.repo)
      ? '<a class="code-link" href="' + esc(safeUrl(p.repo)) + '" target="_blank" rel="noopener" aria-label="Source code for ' + esc(p.name) + '">' + GH + 'Code</a>'
      : '';
    return (
      '<article class="card" style="--accent:' + safeColor(p.accent) + '">' +
        '<div class="tile">' + tileHtml(p) + '</div>' +
        '<div class="card-body">' +
          '<h3><a class="card-link" href="' + esc(p.href) + '" target="_blank" rel="noopener">' + esc(p.name) + '</a></h3>' +
          '<p>' + esc(p.description) + '</p>' +
          '<div class="meta"><span class="badge">' + esc(hostLabel(p.href)) + '</span>' + code + '</div>' +
        '</div>' +
        ARROW +
      '</article>'
    );
  }

  function matches(p, term) {
    if (!term) return true;
    var hay = (p.name + ' ' + (p.description || '') + ' ' + p.category + ' ' + (p.keywords || '')).toLowerCase();
    return term.split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
  }

  function renderChips() {
    var term = q.value.trim().toLowerCase();
    var all = ['All'].concat(categories);
    chipsEl.innerHTML = all.map(function (c) {
      var n = projects.filter(function (p) { return (c === 'All' || p.category === c) && matches(p, term); }).length;
      return '<button type="button" class="chip" data-cat="' + esc(c) + '" aria-pressed="' + (c === active) + '">' +
        esc(c) + '<span class="n">' + n + '</span></button>';
    }).join('');
  }

  function render() {
    var term = q.value.trim().toLowerCase();
    var html = '';
    var total = 0;
    categories.forEach(function (c) {
      if (active !== 'All' && active !== c) return;
      var items = projects.filter(function (p) { return p.category === c && matches(p, term); });
      if (!items.length) return;
      total += items.length;
      var id = 'g-' + c.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      html += '<section class="group" aria-labelledby="' + id + '">' +
        '<h2 id="' + id + '">' + esc(c) + '<span class="n">' + items.length + '</span></h2>' +
        '<div class="grid">' + items.map(cardHtml).join('') + '</div></section>';
    });
    main.innerHTML = total ? html : '<p class="status">No tools match “' + esc(q.value.trim()) + '”.</p>';
    renderChips();
  }

  chipsEl.addEventListener('click', function (e) {
    var btn = e.target.closest('.chip');
    if (!btn) return;
    active = btn.getAttribute('data-cat');
    render();
  });

  q.addEventListener('input', render);

  document.addEventListener('keydown', function (e) {
    var tag = (document.activeElement && document.activeElement.tagName) || '';
    if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA' && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      q.focus();
      q.select();
    } else if (e.key === 'Escape' && document.activeElement === q) {
      q.value = '';
      render();
      q.blur();
    }
  });

  fetch('projects.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (list) {
      projects = list
        .map(function (p) {
          return Object.assign({}, p, { href: safeUrl(p.url), category: p.category || 'Other' });
        })
        .filter(function (p) { return p.name && p.href && !p.hidden; });
      projects.forEach(function (p) {
        if (categories.indexOf(p.category) === -1) categories.push(p.category);
      });
      subtitle.textContent = projects.length + ' web tools, one link';
      render();
    })
    .catch(function () {
      main.innerHTML = '<p class="status">Couldn’t load the tool list. Check your connection and reload.</p>';
    });

  /* ---------- Theme: system → light → dark ---------- */
  var root = document.documentElement;
  var themeBtn = document.getElementById('theme');
  var MODES = ['system', 'light', 'dark'];
  var ICON = { system: '#i-system', light: '#i-sun', dark: '#i-moon' };
  var metas = Array.prototype.slice.call(document.querySelectorAll('meta[name="theme-color"]'));
  var metaDefaults = metas.map(function (m) { return m.content; });

  function currentMode() {
    return root.dataset.theme === 'light' || root.dataset.theme === 'dark' ? root.dataset.theme : 'system';
  }

  function applyMode(mode) {
    if (mode === 'system') delete root.dataset.theme;
    else root.dataset.theme = mode;
    try {
      if (mode === 'system') localStorage.removeItem('theme');
      else localStorage.setItem('theme', mode);
    } catch (e) {}
    themeBtn.querySelector('use').setAttribute('href', ICON[mode]);
    var next = MODES[(MODES.indexOf(mode) + 1) % MODES.length];
    themeBtn.setAttribute('aria-label', 'Theme: ' + mode + '. Switch to ' + next);
    themeBtn.title = 'Theme: ' + mode;
    metas.forEach(function (m, i) {
      m.content = mode === 'system' ? metaDefaults[i] : (mode === 'dark' ? '#0b0f17' : '#f6f7f9');
    });
  }

  themeBtn.addEventListener('click', function () {
    applyMode(MODES[(MODES.indexOf(currentMode()) + 1) % MODES.length]);
  });
  applyMode(currentMode());

  /* ---------- Sticky toolbar divider ---------- */
  var toolbar = document.querySelector('.toolbar');
  var header = document.querySelector('.site-header');
  function onScroll() { toolbar.classList.toggle('stuck', window.scrollY > header.offsetHeight); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Install as app ---------- */
  var installBtn = document.getElementById('install');
  var deferred = null;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferred = e;
    installBtn.hidden = false;
  });
  installBtn.addEventListener('click', function () {
    if (!deferred) return;
    deferred.prompt();
    deferred.userChoice.finally(function () { deferred = null; installBtn.hidden = true; });
  });
  window.addEventListener('appinstalled', function () { installBtn.hidden = true; });

  var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var standalone = window.navigator.standalone === true ||
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
  if (isIOS && !standalone) document.getElementById('ios-hint').hidden = false;

  /* ---------- Offline support ---------- */
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }
})();
