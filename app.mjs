// rad/s² — App Shell (Warm Editorial)

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
      <a href="index.html" class="nav-brand">
        <img src="assets/logo.png" alt="Rad/s²" class="nav-logo" />
      </a>
      <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-links" role="list">
        ${NAV_ITEMS.map(item => `
          <li><a href="${item.href}" class="nav-link${cur === item.href ? ' active' : ''}">${item.label}</a></li>
        `).join('')}
        <li><a href="contact.html" class="nav-cta">INITIATE PROJECT</a></li>
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

// ── Greek/Cyrillic cipher morph ──────────────────────────────
const CIPHER = {
  'A':'Α','B':'β','C':'С','D':'Ð','E':'Ε','F':'Ƒ','G':'Ɠ','H':'Η',
  'I':'Ι','J':'ϳ','K':'Κ','L':'Λ','M':'Μ','N':'Ν','O':'Θ','P':'Ρ',
  'Q':'Ω','R':'Я','S':'Ѕ','T':'Τ','U':'Υ','V':'Ѵ','W':'Ш','X':'Χ',
  'Y':'Υ','Z':'Ζ',
  'a':'α','b':'ƀ','c':'с','d':'δ','e':'є','f':'ƒ','g':'ɢ','h':'н',
  'i':'ι','j':'ϳ','k':'κ','l':'ℓ','m':'м','n':'η','o':'σ','p':'ρ',
  'q':'φ','r':'я','s':'ѕ','t':'т','u':'υ','v':'ν','w':'ω','x':'χ',
  'y':'у','z':'ζ',
};

function buildCipherSpans(el) {
  const text = el.textContent;
  el.textContent = '';
  for (const ch of text) {
    const span = document.createElement('span');
    span.className = 'char-morph';
    span.dataset.real = ch;
    span.textContent = CIPHER[ch] ?? ch;
    el.appendChild(span);
  }
}

function resolveChars(el, startMs, staggerMs) {
  [...el.querySelectorAll('.char-morph')].forEach((span, i) => {
    setTimeout(() => {
      span.textContent = span.dataset.real;
      span.classList.add('resolving');
    }, startMs + i * staggerMs);
  });
}

function initCharMorph() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Hero headline — scan beam reveals cipher chars, then they resolve per-word
  // CSS delays: nth-child(1) 0.54s, (2) 1.20s, (3) 1.86s; each word 0.55s duration
  const heroWordDelays = [540, 1200, 1860];
  document.querySelectorAll('.hero-headline .word-reveal').forEach((word, i) => {
    buildCipherSpans(word);
    resolveChars(word, heroWordDelays[i] + 420, 50);
  });

  // Inner page h1s — cipher chars resolve shortly after page load
  document.querySelectorAll('.page-header-title, .inner-page-title').forEach(title => {
    buildCipherSpans(title);
    resolveChars(title, 350, 32);
  });
}

// ── Scramble text reveal ─────────────────────────────────────
function initScramble() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·—/_²';

  function scrambleEl(el) {
    const original = el.textContent;
    const len = original.length;
    const FRAMES = 18; // ~300ms at 60fps
    let frame = 0;

    const tick = setInterval(() => {
      let out = '';
      for (let i = 0; i < len; i++) {
        const ch = original[i];
        if (ch === ' ' || ch === '\n') {
          out += ch;
        } else if (frame / FRAMES > i / len) {
          out += ch; // character has resolved
        } else {
          out += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      el.textContent = out;
      if (++frame > FRAMES) {
        el.textContent = original;
        clearInterval(tick);
      }
    }, 16);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        scrambleEl(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  // Auto-apply to section labels and earmarks across all pages
  document.querySelectorAll('.section-label, .earmark').forEach(el => observer.observe(el));
}

// ── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildNav();
  buildFooter();
  initScrollReveal();
  initCharMorph();
  initScramble();
});
