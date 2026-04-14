// rad/s² — App Shell (Kinetic Precision)

// ── Font injection ──────────────────────────────────────────
function injectFont() {
  if (!document.querySelector('#space-grotesk-font')) {
    const link = document.createElement('link');
    link.id   = 'space-grotesk-font';
    link.rel  = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap';
    document.head.appendChild(link);
  }
  // Preconnects
  ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'].forEach(url => {
    if (!document.querySelector(`link[href="${url}"]`)) {
      const pc = document.createElement('link');
      pc.rel = 'preconnect';
      pc.href = url;
      if (url.includes('gstatic')) pc.crossOrigin = 'anonymous';
      document.head.prepend(pc);
    }
  });
}

// ── Background layers ───────────────────────────────────────
function injectBackgroundLayers() {
  if (!document.querySelector('.dot-grid')) {
    const grid = document.createElement('div');
    grid.className = 'dot-grid';
    document.body.prepend(grid);
  }
  if (!document.querySelector('.film-grain')) {
    const grain = document.createElement('div');
    grain.className = 'film-grain';
    document.body.prepend(grain);
  }
}

// ── Live indicator ──────────────────────────────────────────
function injectLiveIndicator() {
  if (!document.querySelector('.live-indicator')) {
    const el = document.createElement('div');
    el.className = 'live-indicator';
    el.innerHTML = '<span class="live-dot"></span>LIVE_TELEMETRY_FEED_ESTABLISHED';
    document.body.appendChild(el);
  }
}

// ── Nav ─────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: 'LABS',      href: 'index.html' },
  { label: 'THESIS',    href: 'manifesto.html' },
  { label: 'VENTURES',  href: 'ventures.html' },
  { label: 'TEAM',      href: 'team.html' },
  { label: 'CONTACT',   href: 'contact.html' },
];

function currentPage() {
  const p = location.pathname.split('/').pop() || 'index.html';
  return p === '' ? 'index.html' : p;
}

function buildNav() {
  const cur = currentPage();
  const wrap = document.createElement('div');
  wrap.className = 'site-nav-wrap';
  wrap.innerHTML = `
    <nav class="site-nav" role="navigation" aria-label="Main navigation">
      <a href="index.html" class="nav-brand">RAD/S²</a>
      <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-links" role="list">
        ${NAV_ITEMS.map(item => `
          <li><a href="${item.href}" class="nav-link${cur === item.href ? ' active' : ''}">${item.label}</a></li>
        `).join('')}
        <li><a href="contact.html" class="nav-cta">_INITIATE_PROJECT</a></li>
      </ul>
    </nav>`;

  const toggle = wrap.querySelector('.nav-toggle');
  const links  = wrap.querySelector('.nav-links');

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target) && links.classList.contains('open')) {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.body.prepend(wrap);
}

// ── Footer ──────────────────────────────────────────────────
function buildFooter() {
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-col">
        <span class="footer-brand-name">RAD/S²</span>
        <p class="footer-copy">©${new Date().getFullYear()} RADIANS PER<br>SECOND SQUARED, LLC.</p>
      </div>
      <div class="footer-col">
        <span class="footer-col-label">Infrastructure</span>
        <ul class="footer-links-list">
          <li><a href="#">_SYSTEM_STATUS</a></li>
          <li><a href="#">_CORE_LOGS</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <span class="footer-col-label">Governance</span>
        <ul class="footer-links-list">
          <li><a href="legal.html">_PRIVACY_POLICY</a></li>
          <li><a href="legal.html">_LICENSE_AGREEMENT</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <span class="footer-col-label">Connect</span>
        <ul class="footer-links-list">
          <li><a href="mailto:hello@radsquared.ai">hello@radsquared.ai</a></li>
        </ul>
      </div>
    </div>`;
  document.body.appendChild(footer);
}

// ── Scroll reveal ────────────────────────────────────────────
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  injectFont();
  injectBackgroundLayers();
  buildNav();
  buildFooter();
  injectLiveIndicator();
  initScrollReveal();
});
