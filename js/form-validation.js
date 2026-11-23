/* ============================================
   FORM VALIDATION — проверка полей и
   демонстрация успешной отправки (только клиент)
   ============================================ */

const form = document.getElementById('contact-form');
const successBox = document.getElementById('form-success');
const resetButton = document.getElementById('form-reset');

/* --- Правила валидации для каждого поля --- */
const validators = {
  name: (value) => {
    const trimmed = value.trim();
    if (!trimmed) return 'Пожалуйста, укажите имя';
    if (trimmed.length < 2) return 'Имя должно содержать минимум 2 символа';
    if (/[0-9]/.test(trimmed)) return 'Имя не должно содержать цифры';
    return '';
  },

  phone: (value) => {
    const digits = value.replace(/\D/g, '');
    if (!digits) return 'Пожалуйста, укажите телефон';
    // Допускаем: 10 цифр (маска +7) или 11 цифр (начинается с 8 или 7)
    if (digits.length !== 10 && digits.length !== 11) {
      return 'Введите корректный номер: +7 (999) 000-00-00';
    }
    return '';
  },

  email: (value) => {
    const trimmed = value.trim();
    if (!trimmed) return 'Пожалуйста, укажите email';
    // Простая, но надёжная проверка формата email
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!pattern.test(trimmed)) return 'Введите корректный email, например name@mail.ru';
    return '';
  },

  'project-type': (value) => {
    if (!value) return 'Выберите тип проекта';
    return '';
  },

  message: () => '' // комментарий необязательный, maxlength контролирует длину
};

/* --- Работа с ошибками --- */

/** Показать ошибку под полем */
function showError(field, message) {
  field.classList.add('is-invalid');
  field.classList.remove('is-valid');
  field.setAttribute('aria-invalid', 'true');

  const errorEl = document.getElementById(`${field.id}-error`);
  if (errorEl) errorEl.textContent = message;
}

/** Убрать ошибку, отметить поле валидным */
function clearError(field) {
  field.classList.remove('is-invalid');
  field.removeAttribute('aria-invalid');

  const errorEl = document.getElementById(`${field.id}-error`);
  if (errorEl) errorEl.textContent = '';

  // Поле не пустое и без ошибок — зелёная индикация
  if (field.value.trim()) {
    field.classList.add('is-valid');
  } else {
    field.classList.remove('is-valid');
  }
}

/** Проверить одно поле по его правилу */
function validateField(field) {
  const rule = validators[field.id];
  if (!rule) return true;

  const message = rule(field.value);
  if (message) {
    showError(field, message);
    return false;
  }
  clearError(field);
  return true;
}

/* --- Инициализация --- */

export function initFormValidation() {
  if (!form) return;

  const fields = Array.from(form.querySelectorAll('.field__input'));

  // Валидация при уходе из поля (blur) — сразу даём обратную связь
  fields.forEach((field) => {
    field.addEventListener('blur', () => {
      if (field.value.trim() || field.classList.contains('is-invalid')) {
        validateField(field);
      }
    });

    // Если ошибка уже показана — исправление подсвечивается на лету
    field.addEventListener('input', () => {
      if (field.classList.contains('is-invalid')) {
        validateField(field);
      } else {
        field.classList.remove('is-valid');
      }
    });
  });

  // Отправка формы
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // бэкенда нет — демо-режим

    let firstInvalid = null;

    fields.forEach((field) => {
      const isValid = validateField(field);
      if (!isValid && !firstInvalid) {
        firstInvalid = field;
      }
    });

    // Есть ошибки — фокус на первое невалидное поле
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    // Всё валидно — демонстрация успешной отправки
    showSuccess();
  });

  // Кнопка «Отправить ещё раз»
  resetButton.addEventListener('click', () => {
    form.reset();
    fields.forEach((field) => {
      field.classList.remove('is-valid', 'is-invalid');
      field.removeAttribute('aria-invalid');
      const errorEl = document.getElementById(`${field.id}-error`);
      if (errorEl) errorEl.textContent = '';
    });

    successBox.hidden = true;
    form.hidden = false;
    form.querySelector('.field__input').focus();
  });
}

/** Показать сообщение об успехе, скрыть форму */
function showSuccess() {
  form.hidden = true;
  successBox.hidden = false;
  successBox.focus?.();
}
