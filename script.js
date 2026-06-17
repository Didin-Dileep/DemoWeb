const root = document.documentElement;
const body = document.body;
const navToggle = document.getElementById('navToggle');
const navPanel = document.getElementById('primaryNav');
const themeToggle = document.getElementById('themeToggle');
const themeLabel = themeToggle.querySelector('.theme-toggle__label');
const themeIcon = themeToggle.querySelector('.theme-toggle__icon');
const scrollTopButton = document.getElementById('scrollTop');
const loader = document.getElementById('loader');
const volunteerForm = document.getElementById('volunteerForm');
const formStatus = document.getElementById('formStatus');
const header = document.querySelector('.site-header');
const revealTargets = document.querySelectorAll('.reveal');

const THEME_KEY = 'nayepankh-theme';

function setTheme(theme) {
  root.dataset.theme = theme;
  const isDark = theme === 'dark';
  themeLabel.textContent = isDark ? 'Dark' : 'Light';
  themeIcon.textContent = isDark ? '☾' : '☼';
  themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
  localStorage.setItem(THEME_KEY, theme);
}

function initTheme() {
  const storedTheme = localStorage.getItem(THEME_KEY);
  const preferredTheme = storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  setTheme(preferredTheme);
}

function toggleNavigation(forceClose = false) {
  const shouldOpen = forceClose ? false : !navPanel.classList.contains('is-open');
  navPanel.classList.toggle('is-open', shouldOpen);
  navToggle.setAttribute('aria-expanded', String(shouldOpen));
}

function validateVolunteerForm() {
  const fields = Array.from(volunteerForm.querySelectorAll('input, select, textarea'));
  let isValid = true;

  fields.forEach((field) => {
    const errorTarget = volunteerForm.querySelector(`[data-error-for="${field.name}"]`);
    let message = '';

    if (!field.value.trim()) {
      message = 'This field is required.';
    } else if (field.name === 'name' && field.value.trim().length < 2) {
      message = 'Please enter at least 2 characters.';
    } else if (field.name === 'email' && !field.checkValidity()) {
      message = 'Please enter a valid email address.';
    } else if (field.name === 'phone' && !/^\+?[0-9\s-]{7,15}$/.test(field.value.trim())) {
      message = 'Please enter a valid phone number.';
    } else if (field.name === 'message' && field.value.trim().length < 20) {
      message = 'Please share at least 20 characters.';
    }

    if (errorTarget) {
      errorTarget.textContent = message;
    }

    if (message) {
      isValid = false;
    }
  });

  return isValid;
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  setTimeout(() => loader.classList.add('is-hidden'), 450);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  revealTargets.forEach((target) => observer.observe(target));
});

navToggle.addEventListener('click', () => toggleNavigation());

navPanel.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    if (window.innerWidth < 768) {
      toggleNavigation(true);
    }
  });
});

themeToggle.addEventListener('click', () => {
  const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(nextTheme);
});

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY || window.pageYOffset;
  header.classList.toggle('is-scrolled', scrollY > 12);
  scrollTopButton.classList.toggle('is-visible', scrollY > 500);
});

scrollTopButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

volunteerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  formStatus.textContent = '';

  if (validateVolunteerForm()) {
    formStatus.textContent = 'Thank you for registering. Our team will contact you soon.';
    volunteerForm.reset();
    volunteerForm.querySelectorAll('.field-error').forEach((node) => {
      node.textContent = '';
    });
  } else {
    formStatus.textContent = 'Please correct the highlighted fields and try again.';
  }
});

volunteerForm.querySelectorAll('input, select, textarea').forEach((field) => {
  field.addEventListener('input', () => {
    const errorTarget = volunteerForm.querySelector(`[data-error-for="${field.name}"]`);
    if (errorTarget && field.value.trim()) {
      errorTarget.textContent = '';
    }
  });
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    toggleNavigation(true);
  }
});