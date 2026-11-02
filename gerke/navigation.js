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

// A local gallery works without contacting Meta. Individual embeds load on request.
const postDialog = document.querySelector('#instagram-dialog');
const postContent = document.querySelector('#instagram-dialog-content');
document.querySelectorAll('.instagram-card').forEach(card => {
  card.addEventListener('click', () => {
    postContent.replaceChildren();
    const image = document.createElement('img');
    image.src = card.dataset.postImage;
    image.alt = card.dataset.postTitle;
    image.className = 'instagram-dialog-image';
    const details = document.createElement('div');
    details.className = 'instagram-dialog-details';
    const heading = document.createElement('h2');
    heading.id = 'instagram-dialog-title';
    heading.textContent = card.dataset.postTitle;
    const date = document.createElement('p');
    date.className = 'instagram-dialog-date';
    date.textContent = '@dachdecker_gerke · ' + card.dataset.postDate;
    const notice = document.createElement('p');
    notice.className = 'consent-note';
    notice.textContent = 'Beim Laden des Originals wird eine Verbindung zu Instagram hergestellt. Dabei werden Daten an Meta übertragen.';
    const load = document.createElement('button');
    load.type = 'button';
    load.className = 'button';
    load.textContent = 'Instagram-Beitrag laden ↗';
    load.addEventListener('click', () => {
      const frame = document.createElement('iframe');
      frame.title = 'Instagram-Beitrag: ' + card.dataset.postTitle;
      frame.src = card.dataset.instagramUrl + 'embed/';
      frame.className = 'instagram-post-embed';
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.setAttribute('allowfullscreen', '');
      frame.tabIndex = 0;
      image.remove();
      notice.remove();
      load.replaceWith(frame);
      const fallback = document.createElement('a');
      fallback.href = card.dataset.instagramUrl;
      fallback.target = '_blank';
      fallback.rel = 'noopener noreferrer';
      fallback.className = 'textlink';
      fallback.textContent = 'Falls der Beitrag nicht angezeigt wird: auf Instagram öffnen ↗';
      details.append(fallback);
      postDialog.classList.add('is-embedded');
      frame.focus();
    });
    details.append(heading, date, notice, load);
    postContent.append(image, details);
    postDialog.showModal();
  });
});
postDialog.querySelector('.instagram-dialog-close').addEventListener('click', () => postDialog.close());
postDialog.addEventListener('click', event => { if (event.target === postDialog) postDialog.close(); });
postDialog.addEventListener('close', () => { postContent.replaceChildren(); postDialog.classList.remove('is-embedded'); });
