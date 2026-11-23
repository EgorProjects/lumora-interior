/* ============================================
   ANIMATIONS — плавное появление блоков
   при прокрутке (IntersectionObserver)
   ============================================ */

export function initAnimations() {
  const elements = document.querySelectorAll('.reveal');

  // Если браузер не поддерживает наблюдатель — сразу показываем
  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  // Пользователь отключил анимации — показываем без движения
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target); // анимация срабатывает один раз
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}
