// rad/s² — App Shell

const NAV_ITEMS = [
  { label: 'Engine',        href: 'index.html' },
  { label: 'Manifesto',     href: 'manifesto.html' },
  { label: 'Framework',     href: 'roadmap.html' },
  { label: 'Ventures',      href: 'ventures.html' },
  { label: 'Team',          href: 'team.html' },
  { label: 'Opportunities', href: 'opportunities.html' },
  { label: 'System Access', href: 'contact.html' },
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
      <a href="index.html" class="nav-brand">rad/s²</a>
      <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-links" role="list">
        ${NAV_ITEMS.map(item => `
          <li><a href="${item.href}" class="nav-link${cur === item.href ? ' active' : ''}">${item.label}</a></li>
        `).join('')}
      </ul>
    </nav>`;

  const toggle = wrap.querySelector('.nav-toggle');
  const links  = wrap.querySelector('.nav-links');

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target) && links.classList.contains('open')) {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.body.prepend(wrap);
}

function buildFooter() {
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `
    <div class="container footer-inner">
      <span class="footer-brand">© ${new Date().getFullYear()} Radians per Second Squared, LLC</span>
      <nav class="footer-links" aria-label="Footer navigation">
        <a href="mailto:hello@radsquared.ai">hello@radsquared.ai</a>
        <a href="legal.html">Privacy &amp; Terms</a>
      </nav>
    </div>`;
  document.body.append(footer);
}

document.addEventListener('DOMContentLoaded', () => {
  buildNav();
  buildFooter();
});
