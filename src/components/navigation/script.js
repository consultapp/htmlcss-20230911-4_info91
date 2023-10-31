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
