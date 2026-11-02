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
