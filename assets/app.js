// ═══════════════════════════════════════════════════════════
//  WinningWriter — App Logic
// ═══════════════════════════════════════════════════════════

// ── Collapsible paper cards ──────────────────────────────────
function togglePaper(id) {
  const details = document.getElementById(id);
  const arrow   = document.getElementById(id + '-arrow');
  if (!details) return;
  const isOpen = details.classList.contains('open');
  details.classList.toggle('open', !isOpen);
  if (arrow) arrow.classList.toggle('open', !isOpen);
}

// ── Checklist score ──────────────────────────────────────────
function updateScore() {
  const all      = document.querySelectorAll('.checklist-wrap input[type=checkbox]');
  const warn     = document.querySelectorAll('.checklist-wrap .warn input[type=checkbox]');
  const total    = all.length;
  const warnSet  = new Set([...warn]);

  let checked = 0;
  all.forEach(cb => { if (cb.checked) checked++; });

  // Score: regular checkboxes add, warn checkboxes (checked = confirmed absent) SUBTRACT
  let score = 0;
  all.forEach(cb => {
    if (warnSet.has(cb)) {
      if (!cb.checked) score++; // warn item NOT checked = good
    } else {
      if (cb.checked) score++;
    }
  });

  const scoreText = document.getElementById('scoreText');
  const scoreBar  = document.getElementById('scoreBar');
  if (!scoreText || !scoreBar) return;

  const pct = Math.round((score / total) * 100);
  scoreText.textContent = `${score} / ${total} (${pct}%)`;

  // Color
  let color = '#f87171'; // red
  if (pct >= 80) color = '#34d399'; // green
  else if (pct >= 55) color = '#f0b429'; // yellow

  scoreBar.style.width   = pct + '%';
  scoreBar.style.background = color;

  if (scoreText) {
    scoreText.style.color = pct >= 80 ? '#34d399' : pct >= 55 ? '#f0b429' : '#f87171';
  }
}

// ── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Attach score listeners
  const checkboxes = document.querySelectorAll('.checklist-wrap input[type=checkbox]');
  checkboxes.forEach(cb => cb.addEventListener('change', updateScore));
  updateScore();

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
