(function () {
  const storageKey = 'raizes-do-amanha:projetos-favoritos';
  const availableProjects = new Set(['quintal-saber', 'rede-afeto', 'primeiro-passo']);

  function getFavorites() {
    try {
      const storedValue = window.localStorage.getItem(storageKey);
      const parsedValue = storedValue ? JSON.parse(storedValue) : [];
      return Array.isArray(parsedValue) ? parsedValue.filter((id) => availableProjects.has(id)) : [];
    } catch (error) {
      return [];
    }
  }

  function saveFavorites(favorites) {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(favorites));
      return true;
    } catch (error) {
      return false;
    }
  }

  function updateFavoriteButtons() {
    const favorites = new Set(getFavorites());
    document.querySelectorAll('[data-favorite-id]').forEach((button) => {
      const isSaved = favorites.has(button.dataset.favoriteId);
      button.setAttribute('aria-pressed', String(isSaved));
      button.classList.toggle('is-saved', isSaved);
      button.innerHTML = `<span aria-hidden="true">${isSaved ? '♥' : '♡'}</span><span>${isSaved ? 'Salvo' : 'Salvar projeto'}</span>`;
    });
  }

  window.restoreProjectFavorites = updateFavoriteButtons;

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-favorite-id]');
    if (!button) return;

    const id = button.dataset.favoriteId;
    const favorites = getFavorites();
    const index = favorites.indexOf(id);
    const isSaved = index === -1;
    if (isSaved) favorites.push(id);
    else favorites.splice(index, 1);

    const saved = saveFavorites(favorites);
    updateFavoriteButtons();

    const toast = document.getElementById('feedback-toast');
    if (toast) {
      const message = toast.querySelector('span:last-child');
      message.textContent = saved
        ? (isSaved ? 'Projeto adicionado aos seus favoritos.' : 'Projeto removido dos seus favoritos.')
        : 'Não foi possível salvar esta preferência neste navegador.';
      toast.hidden = false;
      window.clearTimeout(window.feedbackToastTimer);
      window.feedbackToastTimer = window.setTimeout(() => { toast.hidden = true; }, 4000);
    }
  });

  window.addEventListener('spa:rendered', updateFavoriteButtons);
})();
