/* ═══════════════════════════════════════════════════════════
   WinningWriter — App Logic
   ═══════════════════════════════════════════════════════════ */

// ── Collapsible paper cards ───────────────────────────────────
function togglePaper(id) {
  var details = document.getElementById(id);
  var arrow   = document.getElementById(id + '-arrow');
  if (!details) return;
  var isOpen = details.classList.contains('open');
  details.classList.toggle('open', !isOpen);
  if (arrow) arrow.classList.toggle('open', !isOpen);
}

// ── Checklist score ───────────────────────────────────────────
function updateScore() {
  var wrap   = document.querySelector('.checklist-wrap');
  var all    = document.querySelectorAll('.checklist-wrap input[type=checkbox]');
  var warn   = document.querySelectorAll('.checklist-wrap .warn input[type=checkbox]');
  if (!all.length) return;

  var total   = all.length;
  var warnSet = new Set([].slice.call(warn));
  var score   = 0;
  all.forEach(function (cb) {
    if (warnSet.has(cb)) {
      if (!cb.checked) score++;
    } else {
      if (cb.checked) score++;
    }
  });

  var scoreText = document.getElementById('scoreText');
  var scoreBar  = document.getElementById('scoreBar');
  if (!scoreText || !scoreBar) return;

  var pct = Math.round((score / total) * 100);

  // Use i18n score template if available
  var tpl = wrap && wrap.dataset.scoreTemplate;
  if (tpl) {
    scoreText.textContent = tpl.replace('{n}', score).replace('{total}', total);
  } else {
    scoreText.textContent = score + ' / ' + total + ' (' + pct + '%)';
  }

  var color = '#f87171';
  if (pct >= 80) color = '#34d399';
  else if (pct >= 55) color = '#f0b429';

  scoreBar.style.width      = pct + '%';
  scoreBar.style.background = color;
  scoreText.style.color     = color;
}

// ── Attach checklist listeners (called after CMS render) ──────
window.initChecklist = function () {
  var checkboxes = document.querySelectorAll('.checklist-wrap input[type=checkbox]');
  checkboxes.forEach(function (cb) {
    cb.addEventListener('change', updateScore);
  });
  updateScore();
};

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
