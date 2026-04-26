/* ── Navbar scroll effect ────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Mobile hamburger ────────────────────────────────────────────────── */
const hamburger = document.getElementById('nav-hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
// Close on nav link click
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ── Theme toggle ────────────────────────────────────────────────────── */
const themeBtn = document.getElementById('theme-toggle');
let isLight = false;
themeBtn.addEventListener('click', () => {
  isLight = !isLight;
  document.body.classList.toggle('light', isLight);
  themeBtn.textContent = isLight ? '🌑 Dark' : '☀ Light';
});

/* ── Typing effect ───────────────────────────────────────────────────── */
const phrases = [
  'Developer · 3D Artist · Video Editor',
  'Python Enthusiast · Arch Linux User',
  'Open Source Contributor',
  'Multilingual · 8 Languages',
  'Probably writing horrible code 😅',
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typed-text');

function typeLoop() {
  const current = phrases[phraseIdx];
  if (deleting) {
    charIdx--;
    typedEl.textContent = current.slice(0, charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(typeLoop, 450);
      return;
    }
    setTimeout(typeLoop, 28);
  } else {
    charIdx++;
    typedEl.textContent = current.slice(0, charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeLoop, 2000);
      return;
    }
    setTimeout(typeLoop, 55);
  }
}
typeLoop();

/* ── Scroll reveal ───────────────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObs.observe(el));

/* ── Contribution graph ──────────────────────────────────────────────── */
(async () => {
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const DAY_MS = 86400000;

  function levelClass(count) {
    if (count === 0) return 'cl-0';
    if (count <= 2)  return 'cl-1';
    if (count <= 5)  return 'cl-2';
    if (count <= 10) return 'cl-3';
    return 'cl-4';
  }

  function formatDate(dateStr) {
    const [y, m, d] = dateStr.split('-');
    return `${MONTHS[+m - 1]} ${+d}, ${y}`;
  }

  try {
    const res = await fetch('https://github-contributions-api.jogruber.de/v4/NVitschDEV?y=last');
    if (!res.ok) throw new Error('API error');
    const data = await res.json();

    // Build lookup: date -> {count, level}
    const map = {};
    let total = 0;
    (data.contributions || []).forEach(c => {
      map[c.date] = c;
      total += c.count;
    });

    // Find date range: Sunday-aligned 53 weeks ending today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endSunday = new Date(today.getTime() + (6 - today.getDay()) * DAY_MS);
    const startSunday = new Date(endSunday.getTime() - 52 * 7 * DAY_MS);

    // Build weeks array
    const weeks = [];
    let cur = new Date(startSunday);
    while (cur <= endSunday) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const iso = cur.toISOString().slice(0, 10);
        week.push({ date: iso, ...(map[iso] || { count: 0, level: 0 }) });
        cur = new Date(cur.getTime() + DAY_MS);
      }
      weeks.push(week);
    }

    // Render month labels
    const monthsEl = document.getElementById('contrib-months');
    monthsEl.innerHTML = '<div class="contrib-month-spacer"></div>';
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      const m = new Date(week[0].date).getMonth();
      const label = document.createElement('div');
      label.className = 'contrib-month-label';
      label.style.flex = '1';
      label.textContent = (m !== lastMonth) ? MONTHS[m] : '';
      if (m !== lastMonth) lastMonth = m;
      monthsEl.appendChild(label);
    });

    // Render grid
    const grid = document.getElementById('contrib-grid');
    const tooltip = document.getElementById('contrib-tooltip');
    grid.innerHTML = '';

    weeks.forEach(week => {
      const weekEl = document.createElement('div');
      weekEl.className = 'contrib-week';
      week.forEach(day => {
        const cell = document.createElement('div');
        cell.className = `contrib-cell ${levelClass(day.count)}`;
        cell.setAttribute('role', 'gridcell');
        const label = day.count === 1
                ? `1 contribution on ${formatDate(day.date)}`
                : `${day.count} contributions on ${formatDate(day.date)}`;
        cell.setAttribute('aria-label', label);

        // Tooltip events
        cell.addEventListener('mouseenter', (e) => {
          tooltip.textContent = day.count === 0
                  ? `No contributions on ${formatDate(day.date)}`
                  : `${day.count} contribution${day.count > 1 ? 's' : ''} · ${formatDate(day.date)}`;
          tooltip.style.opacity = '1';
        });
        cell.addEventListener('mousemove', (e) => {
          tooltip.style.left = (e.clientX + 14) + 'px';
          tooltip.style.top  = (e.clientY - 30) + 'px';
        });
        cell.addEventListener('mouseleave', () => {
          tooltip.style.opacity = '0';
        });

        weekEl.appendChild(cell);
      });
      grid.appendChild(weekEl);
    });

    // Update counts and year
    const yearLabel = new Date(startSunday).getFullYear();
    document.getElementById('contrib-year').textContent = yearLabel + '–' + today.getFullYear();
    document.getElementById('contrib-total').textContent = total.toLocaleString();
    const statContrib = document.getElementById('stat-contributions');
    if (statContrib) statContrib.textContent = total.toLocaleString();

    // Swap loading → graph
    document.getElementById('contrib-loading').style.display = 'none';
    document.getElementById('contrib-graph').style.display = 'block';

    // Staggered cell animation
    const cells = grid.querySelectorAll('.contrib-cell');
    cells.forEach((c, i) => {
      c.style.opacity = '0';
      c.style.transition = 'opacity 0.3s ease';
      setTimeout(() => { c.style.opacity = '1'; }, Math.floor(i / 7) * 8);
    });

  } catch (e) {
    document.getElementById('contrib-loading').style.display = 'none';
    document.getElementById('contrib-error').style.display = 'block';
  }
})();

/* ── Contact form — powered by Formspree (no mail client needed) ────────
   SETUP (one-time, 2 minutes):
     1. Go to https://formspree.io  →  sign up free
     2. "New Form" → give it a name → set email to omar.hozdic@tutamail.com
     3. Copy the form endpoint (looks like: https://formspree.io/f/xpwzgdkq)
     4. Paste it into FORMSPREE_ENDPOINT below
   ──────────────────────────────────────────────────────────────────────── */
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mnjllbwl'; // ← replace

function setFeedback(msg, isError) {
  const fb = document.getElementById('form-feedback');
  fb.textContent = msg;
  fb.style.display = 'block';
  if (isError) {
    fb.style.color = '#f87171';
    fb.style.borderColor = 'rgba(248,113,113,0.35)';
    fb.style.background = 'rgba(248,113,113,0.08)';
  } else {
    fb.style.color = 'var(--accent)';
    fb.style.borderColor = 'var(--border)';
    fb.style.background = 'rgba(0,212,255,0.06)';
  }
}

function resetForm() {
  document.getElementById('form-name').value = '';
  document.getElementById('form-email').value = '';
  document.getElementById('form-msg').value = '';
  document.getElementById('form-feedback').style.display = 'none';
  document.getElementById('form-success').style.display = 'none';
  // Show the fields + button again
  ['form-name','form-email','form-msg'].forEach(id => {
    document.getElementById(id).closest('.form-group').style.display = '';
  });
  document.getElementById('form-submit-btn').style.display = '';
}

async function handleFormSubmit() {
  const nameEl  = document.getElementById('form-name');
  const emailEl = document.getElementById('form-email');
  const msgEl   = document.getElementById('form-msg');
  const btn     = document.getElementById('form-submit-btn');
  const btnContent = document.getElementById('form-btn-content');

  const name  = nameEl.value.trim();
  const email = emailEl.value.trim();
  const msg   = msgEl.value.trim();

  // ── Validation ──────────────────────────────────────────────────────
  if (!name || !email || !msg) {
    setFeedback('⚠  Please fill in all fields.', true);
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setFeedback('⚠  Please enter a valid email address.', true);
    return;
  }
  if (FORMSPREE_ENDPOINT.includes('YOUR_FORM_ID')) {
    setFeedback('⚠  Form not yet configured — see the HTML comment above handleFormSubmit().', true);
    return;
  }

  // ── Loading state ────────────────────────────────────────────────────
  document.getElementById('form-feedback').style.display = 'none';
  btn.disabled = true;
  btnContent.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
        style="animation:spin 0.8s linear infinite;flex-shrink:0;">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
      </svg>
      Sending…
    `;

  // ── Submit to Formspree ──────────────────────────────────────────────
  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, email, message: msg }),
    });

    const data = await res.json();

    if (res.ok) {
      // Hide fields + button, show success panel
      ['form-name','form-email','form-msg'].forEach(id => {
        document.getElementById(id).closest('.form-group').style.display = 'none';
      });
      btn.style.display = 'none';
      document.getElementById('form-success').style.display = 'block';
    } else {
      // Formspree returns errors array
      const errMsg = (data.errors || []).map(e => e.message).join(' ') || 'Submission failed. Please try again.';
      setFeedback('⚠  ' + errMsg, true);
      btn.disabled = false;
      btnContent.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          Send Message
        `;
    }
  } catch (_) {
    setFeedback('⚠  Network error — please check your connection and try again.', true);
    btn.disabled = false;
    btnContent.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        Send Message
      `;
  }
}

/* ── GitHub API: live repo count ─────────────────────────────────────── */
(async () => {
  try {
    const res = await fetch('https://api.github.com/users/NVitschDEV');
    if (res.ok) {
      const data = await res.json();
      const el = document.getElementById('stat-repos');
      if (el && data.public_repos) el.textContent = data.public_repos;
    }
  } catch (_) { /* silently fail — static fallback shown */ }
})();

/* ── Smooth active nav highlight ─────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const activateNav = () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 140) current = s.id;
  });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}`
            ? 'var(--accent)' : '';
  });
};
window.addEventListener('scroll', activateNav, { passive: true });
