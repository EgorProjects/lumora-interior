/* ============================================
   NAVIGATION — шапка при скролле, бургер,
   плавная прокрутка, активный якорь
   ============================================ */

const header = document.getElementById('header');
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

/** Смена вида шапки при прокрутке */
function handleScroll() {
  header.classList.toggle('is-scrolled', window.scrollY > 40);
}

/** Открытие / закрытие мобильного меню */
function toggleMenu() {
  const isOpen = nav.classList.toggle('is-open');
  burger.classList.toggle('is-open', isOpen);
  burger.setAttribute('aria-expanded', String(isOpen));
  burger.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
  document.body.classList.toggle('menu-open', isOpen);
}

/** Закрытие меню (по Escape или клику по ссылке) */
function closeMenu() {
  if (!nav.classList.contains('is-open')) return;
  nav.classList.remove('is-open');
  burger.classList.remove('is-open');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', 'Открыть меню');
  document.body.classList.remove('menu-open');
}

/** Подсветка активного якоря по положению секции */
function updateActiveLink() {
  const sections = document.querySelectorAll('main section[id]');
  const links = document.querySelectorAll('.nav__link');

  let currentId = '';
  sections.forEach((section) => {
    // Проверяем, какая секция сейчас в верхней части вьюпорта
    if (window.scrollY >= section.offsetTop - 150) {
      currentId = section.id;
    }
  });

  links.forEach((link) => {
    link.classList.toggle('is-active', link.getAttribute('href') === `#${currentId}`);
  });
}

export function initNavigation() {
  // Вид шапки + активный якорь на каждой прокрутке
  window.addEventListener('scroll', () => {
    handleScroll();
    updateActiveLink();
  }, { passive: true });

  handleScroll();
  updateActiveLink();

  // Бургер
  burger.addEventListener('click', toggleMenu);

  // Закрытие: Escape
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  // Закрытие: клик по ссылке меню + плавная прокрутка к секции
  nav.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });

  // Закрытие: клик мимо панели
  document.addEventListener('click', (event) => {
    if (
      nav.classList.contains('is-open') &&
      !nav.contains(event.target) &&
      !burger.contains(event.target)
    ) {
      closeMenu();
    }
  });
}
