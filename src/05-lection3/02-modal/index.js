window.addEventListener('load', () => {
  const close = document.getElementById('modal-close');
  const modal = document.getElementById('modal');
  const modalOpen = document.getElementById('modal-open');

  if (!close || !modalOpen || !modal) {
    return;
  }

  modalOpen.addEventListener('click', () => {
    modal.setAttribute('data-open', false);
    document.body.overflow = 'hidden';
  });

  close.addEventListener('click', () => {
    modal.removeAttribute('data-open');
    document.body.overflow = 'initial';
  });
});
