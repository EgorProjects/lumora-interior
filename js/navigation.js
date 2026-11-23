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

/** Подсветка активного якоря */
function setActiveLink(id) {
  document.querySelectorAll('.nav__link').forEach((link) => {
    const isActive = link.getAttribute('href') === `#${id}`;
    link.classList.toggle('is-active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

/** Отслеживание активной секции через IntersectionObserver */
function initActiveLink() {
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const links = document.querySelectorAll('.nav__link');
  if (!sections.length || !links.length) return;

  // Синхронное определение активной секции по позиции прокрутки
  // (надёжный запасной вариант, работает даже если IO не срабатывает)
  const computeActiveByScroll = () => {
    let currentId = sections[0].id;
    const offset = 150;
    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - offset) {
        currentId = section.id;
      }
    });
    setActiveLink(currentId);
  };

  // Основной путь — IntersectionObserver (эффективнее scroll-события)
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        let best = null;
        entries.forEach((entry) => {
          if (entry.isIntersecting && (!best || entry.intersectionRatio > best.intersectionRatio)) {
            best = entry;
          }
        });
        if (best) setActiveLink(best.target.id);
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach((section) => observer.observe(section));
  }

  // Запасной путь на scroll — гарантирует корректное определение активной
  // секции, если IO не сработал (фоновая вкладка, старый браузер).
  // Считаем синхронно: requestAnimationFrame здесь не срабатывает.
  window.addEventListener('scroll', () => {
    computeActiveByScroll();
  }, { passive: true });

  // Начальное состояние
  computeActiveByScroll();
}

/** Открытие / закрытие мобильного меню */
function toggleMenu() {
  const isOpen = nav.classList.toggle('is-open');
  burger.classList.toggle('is-open', isOpen);
  burger.setAttribute('aria-expanded', String(isOpen));
  burger.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
  document.body.classList.toggle('menu-open', isOpen);

  if (isOpen) {
    // Фокус на первый пункт меню (доступность с клавиатуры)
    const firstLink = nav.querySelector('.nav__link');
    if (firstLink) firstLink.focus();
  } else {
    // Возвращаем фокус на кнопку бургера
    burger.focus();
  }
}

/** Закрытие меню (по Escape или клику по ссылке) */
function closeMenu() {
  if (!nav.classList.contains('is-open')) return;
  nav.classList.remove('is-open');
  burger.classList.remove('is-open');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', 'Открыть меню');
  document.body.classList.remove('menu-open');
  burger.focus();
}

/** Ловушка фокуса внутри открытого меню (Tab / Shift+Tab) */
function trapFocus(event) {
  if (!nav.classList.contains('is-open') || event.key !== 'Tab') return;

  const focusable = nav.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])');
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

export function initNavigation() {
  // Вид шапки при прокрутке
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Активный якорь
  initActiveLink();

  // Бургер
  burger.addEventListener('click', toggleMenu);

  // Закрытие: Escape
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
    trapFocus(event);
  });

  // Закрытие: клик по ссылке меню
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
