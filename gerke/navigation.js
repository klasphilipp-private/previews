const siteHeader = document.querySelector('#site-header');
let compact = false;
function updateHeader() {
  if (!compact && window.scrollY > 90) compact = true;
  else if (compact && window.scrollY < 25) compact = false;
  siteHeader.classList.toggle('is-compact', compact);
}
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();
const menu = document.querySelector('#menu-drawer');
const toggle = document.querySelector('#open-menu');
let closing = false;
let oldOverflow = '';
toggle.addEventListener('click', () => {
  if (menu.open) return;
  oldOverflow = document.body.style.overflow;
  menu.classList.remove('is-closing');
  menu.showModal();
  document.body.style.overflow = 'hidden';
  toggle.setAttribute('aria-expanded', 'true');
});
function closeMenu() {
  if (!menu.open || closing) return;
  closing = true;
  menu.classList.add('is-closing');
  const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 220;
  setTimeout(() => {
    menu.close();
    menu.classList.remove('is-closing');
    closing = false;
  }, delay);
}
menu.querySelector('.drawer-close').addEventListener('click', closeMenu);
menu.addEventListener('cancel', event => { event.preventDefault(); closeMenu(); });
menu.addEventListener('close', () => {
  document.body.style.overflow = oldOverflow;
  toggle.setAttribute('aria-expanded', 'false');
});
menu.addEventListener('click', event => {
  if (event.target === menu) {
    const rect = menu.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeMenu();
  }
  const link = event.target.closest('a');
  if (!link) return;
  const href = link.getAttribute('href');
  if (href.startsWith('#')) {
    event.preventDefault();
    menu.addEventListener('close', () => {
      if (href === '#') window.scrollTo({ top: 0, behavior: 'smooth' });
      else document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }, { once: true });
  }
  closeMenu();
});

// Preview: retain the menu interactions while all links remain deliberately inactive.
document.addEventListener('click', event => {
  if (event.target.closest('a[href="/#"]')) event.preventDefault();
});

// Instagram is contacted only after the visitor explicitly loads the feed.
const loadInstagram = document.querySelector('#load-instagram');
loadInstagram?.addEventListener('click', () => {
  const feed = document.querySelector('#instagram-feed');
  const frame = document.createElement('iframe');
  frame.title = 'Instagram-Profil und Beiträge von dachdecker_gerke';
  frame.src = 'https://www.instagram.com/dachdecker_gerke/embed/';
  frame.className = 'instagram-embed';
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  frame.setAttribute('allowfullscreen', '');
  frame.tabIndex = 0;
  feed.replaceChildren(frame);
  const note = document.createElement('p');
  note.className = 'instagram-embed-note';
  note.textContent = 'Falls Instagram hier durch Ihre Browser-Einstellungen blockiert wird, können Sie das Profil direkt öffnen.';
  const fallback = document.createElement('a');
  fallback.href = 'https://www.instagram.com/dachdecker_gerke/';
  fallback.target = '_blank';
  fallback.rel = 'noopener noreferrer';
  fallback.className = 'textlink';
  fallback.textContent = 'Auf Instagram ansehen ↗';
  feed.append(note, fallback);
  frame.focus();
});
