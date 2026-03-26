/* ═══════════════════════════════════════════════════════════
   WinningWriter — i18n Engine + CMS Renderer
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const STORAGE_KEY = 'ww_lang';
  const DEFAULT_LANG = 'en';
  let lang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  let t = {};

  // ── Utilities ────────────────────────────────────────────────
  function get(path) {
    return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), t);
  }

  function loadJSON(l) {
    return fetch('assets/i18n/' + l + '.json').then(function (r) { return r.json(); });
  }

  // ── Apply data-i18n attributes ───────────────────────────────
  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var val = get(el.dataset.i18n);
      if (val !== undefined) el.innerHTML = val;
    });

    var page = document.body.dataset.page;
    if (page) {
      var title = get('meta.' + page + '_title');
      if (title) document.title = title;
    }

    var btn = document.getElementById('lang-switcher');
    if (btn) btn.textContent = get('nav.lang_label') || (lang === 'en' ? 'ID' : 'EN');

    document.documentElement.lang = lang;
  }

  // ── CMS: Conference grid (index) ─────────────────────────────
  function renderConferences() {
    var grid = document.querySelector('[data-cms="conf-grid"]');
    if (!grid) return;
    var cs = get('conferences_section');
    if (!cs) return;

    var items = (cs.items || []).map(function (item) {
      return '<a href="' + item.href + '" class="conf-card conf-' + item.id + '">' +
        '<div class="conf-tag">' + item.papers_label + '</div>' +
        '<div class="conf-logo-area"><div class="conf-abbr">' + item.abbr + '</div></div>' +
        '<div class="conf-info">' +
          '<h3>' + item.name + '</h3>' +
          '<p>' + item.org + '</p>' +
          '<div class="conf-meta">' +
            '<span class="badge badge-gold">' + item.badge_gold + '</span>' +
            '<span class="badge badge-blue">' + item.badge_blue + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="conf-arrow">→</div>' +
      '</a>';
    }).join('');

    var placeholder = '<div class="conf-card conf-placeholder">' +
      '<div class="conf-info" style="text-align:center;width:100%">' +
        '<div style="font-size:2.5rem;margin-bottom:.75rem;opacity:.3">+</div>' +
        '<h3 style="color:var(--muted)">' + cs.placeholder_title + '</h3>' +
        '<p style="color:var(--muted-2)">' + cs.placeholder_sub + '</p>' +
      '</div></div>';

    grid.innerHTML = items + placeholder;
  }

  // ── CMS: Formula grid (index) ────────────────────────────────
  function renderFormula() {
    var grid = document.querySelector('[data-cms="formula-grid"]');
    if (!grid) return;
    var fs = get('formula_section');
    if (!fs) return;

    grid.innerHTML = (fs.items || []).map(function (item) {
      var chip = item.chip
        ? '<div class="example-chip' + (item.chip_class ? ' ' + item.chip_class : '') + '">' + item.chip + '</div>'
        : '';
      return '<div class="formula-item">' +
        '<div class="formula-num">' + item.num + '</div>' +
        '<h4>' + item.title + '</h4>' +
        '<p>' + item.desc + '</p>' +
        chip +
      '</div>';
    }).join('');
  }

  // ── CMS: Paper cards (ies) ───────────────────────────────────
  function renderPapers() {
    var grid = document.querySelector('[data-cms="paper-grid"]');
    if (!grid) return;
    var ps = get('ies_papers');
    if (!ps) return;

    grid.innerHTML = (ps.items || []).map(function (p) {
      var pills = (p.fig_pills || []).map(function (pill) {
        return '<span class="fig-pill' + (pill.highlight ? ' highlight-pill' : '') + '">' + pill.text + '</span>';
      }).join('');

      var points = (p.win_points || []).map(function (pt) {
        return '<li>' + pt + '</li>';
      }).join('');

      return '<div class="paper-card" onclick="togglePaper(\'' + p.id + '\')">' +
        '<div class="paper-card-top">' +
          '<span class="badge badge-' + p.badge_type + '">' + p.badge + '</span>' +
          '<span class="paper-toggle" id="' + p.id + '-arrow">▼</span>' +
        '</div>' +
        '<h3>' + p.title + '</h3>' +
        '<div class="paper-meta">' +
          '<span>' + p.meta.pages + '</span> · <span>' + p.meta.figures + '</span> · ' +
          '<span>' + p.meta.tables + '</span> · <span>' + p.meta.refs + '</span>' +
        '</div>' +
        '<div class="paper-details" id="' + p.id + '">' +
          '<div class="pd-section"><div class="pd-title">' + p.section_win_title + '</div>' +
          '<ul>' + points + '</ul></div>' +
          '<div class="pd-section"><div class="pd-title">' + p.section_figs_title + '</div>' +
          '<div class="fig-pills">' + pills + '</div></div>' +
          '<div class="pd-section"><div class="pd-title">' + p.section_results_title + '</div>' +
          '<p>' + p.results_text + '</p></div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  // ── CMS: DO/DON'T patterns (ies) ─────────────────────────────
  function renderPatterns() {
    var doCol   = document.querySelector('[data-cms="patterns-do"]');
    var dontCol = document.querySelector('[data-cms="patterns-dont"]');
    var ps = get('ies_patterns');
    if (!ps) return;

    if (doCol) {
      var doTitle = document.querySelector('[data-cms="patterns-do-title"]');
      if (doTitle) doTitle.textContent = ps.do_title;
      doCol.innerHTML = (ps.do_items || []).map(function (item) {
        return '<div class="pattern-item"><strong>' + item.title + '</strong><p>' + item.desc + '</p></div>';
      }).join('');
    }
    if (dontCol) {
      var dontTitle = document.querySelector('[data-cms="patterns-dont-title"]');
      if (dontTitle) dontTitle.textContent = ps.dont_title;
      dontCol.innerHTML = (ps.dont_items || []).map(function (item) {
        return '<div class="pattern-item warn-item"><strong>' + item.title + '</strong><p>' + item.desc + '</p></div>';
      }).join('');
    }
  }

  // ── CMS: Figure strategy table (ies) ─────────────────────────
  function renderFigStrategy() {
    var wrap    = document.querySelector('[data-cms="fig-strategy-table"]');
    var insight = document.querySelector('[data-cms="fig-strategy-insight"]');
    var fs = get('ies_fig_strategy');
    if (!fs) return;

    if (wrap) {
      var thead = '<tr>' + (fs.cols || []).map(function (c) { return '<th>' + c + '</th>'; }).join('') + '</tr>';
      var tbody = (fs.rows || []).map(function (row) {
        var cells = row.vals.map(function (v) {
          return '<td class="' + (v === '✓' ? 'yes' : 'no') + '">' + v + '</td>';
        }).join('');
        return '<tr><td><strong>' + row.type + '</strong></td><td>' + row.purpose + '</td>' + cells + '</tr>';
      }).join('');

      wrap.innerHTML = '<table class="fig-table">' +
        '<thead>' + thead + '</thead>' +
        '<tbody>' + tbody + '<tr class="row-note"><td colspan="6">' + fs.note + '</td></tr></tbody>' +
      '</table>';
    }

    if (insight) insight.innerHTML = fs.insight;
  }

  // ── CMS: Figure combo cards (ies) ────────────────────────────
  function renderFigCombos() {
    var grid = document.querySelector('[data-cms="fig-combo-grid"]');
    var fc = get('ies_fig_combos');
    if (!grid || !fc) return;

    grid.innerHTML = (fc.items || []).map(function (item) {
      return '<div class="fig-combo-card ' + item.level + '">' +
        '<div class="fc-label">' + item.label + '</div>' +
        '<div class="fc-icon">' + item.icon + '</div>' +
        '<h4>' + item.title + '</h4>' +
        '<p>' + item.desc + '</p>' +
      '</div>';
    }).join('');
  }

  // ── CMS: Checklist (ies) ─────────────────────────────────────
  function renderChecklist() {
    var wrap = document.querySelector('[data-cms="checklist-wrap"]');
    var cl = get('ies_checklist');
    if (!wrap || !cl) return;

    var total = 0;
    var groupsHtml = (cl.groups || []).map(function (group) {
      var items = (group.items || []).map(function (item) {
        total++;
        return '<label class="check-item' + (item.warn ? ' warn' : '') + '">' +
          '<input type="checkbox" />' + item.text + '</label>';
      }).join('');
      return '<div class="checklist-group">' +
        '<div class="checklist-group-title">' + group.title + '</div>' +
        items + '</div>';
    }).join('');

    var scoreTpl = (cl.score_text || '{n} / {total}')
      .replace('{n}', '0').replace('{total}', total);

    wrap.innerHTML = groupsHtml +
      '<div class="checklist-score" id="scoreBox">' +
        '<span id="scoreText">' + scoreTpl + '</span>' +
        '<div class="score-bar-track"><div class="score-bar-fill" id="scoreBar"></div></div>' +
      '</div>';

    // Store score template and total for updateScore
    wrap.dataset.scoreTemplate = cl.score_text || '{n} / {total}';
    wrap.dataset.total = total;

    if (window.initChecklist) window.initChecklist();
  }

  // ── Full render cycle ────────────────────────────────────────
  function render() {
    applyTranslations();
    renderConferences();
    renderFormula();
    renderPapers();
    renderPatterns();
    renderFigStrategy();
    renderFigCombos();
    renderChecklist();
  }

  // ── Language switch (exposed globally) ──────────────────────
  window.switchLang = function () {
    lang = lang === 'en' ? 'id' : 'en';
    localStorage.setItem(STORAGE_KEY, lang);
    loadJSON(lang).then(function (data) {
      t = data;
      render();
    });
  };

  // ── Boot ─────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    loadJSON(lang).then(function (data) {
      t = data;
      render();
    });
  });
})();
