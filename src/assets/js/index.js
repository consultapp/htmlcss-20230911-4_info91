window.addEventListener('load', () => {
  document.body.classList.remove('preload');

  const html = document.querySelector('html');
  const themeToggler = document.querySelectorAll('[data-theme-toggler]');
  themeToggler.forEach((item) => {
    item.addEventListener('mousedown', () => {
      if (html.hasAttribute('data-theme')) {
        html.removeAttribute('data-theme');
      } else {
        html.setAttribute('data-theme', 'dark');
      }
    });
  });
});
