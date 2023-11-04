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

window.addEventListener('load', () => {
  const open = document.getElementById('navigationOpen');
  const close = document.getElementById('navigationClose');
  const navigation = document.getElementById('navigation');
  open.addEventListener('click', () => {
    navigation.setAttribute('data-open', 'true');
    close.style.visibility = 'visible';
    open.style.visibility = 'hidden';
  });
  close.addEventListener('click', () => {
    navigation.removeAttribute('data-open');
    open.style.visibility = 'visible';
    close.style.visibility = 'hidden';
  });
});
