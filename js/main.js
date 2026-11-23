/* ============================================
   MAIN — точка входа, инициализация модулей
   ============================================ */

import { initNavigation } from './navigation.js';
import { initAnimations } from './animations.js';
import { initFormValidation } from './form-validation.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initAnimations();
  initFormValidation();
});
