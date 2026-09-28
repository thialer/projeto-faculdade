(function () {
  const routeNames = ['home', 'projetos', 'cadastro'];
  const titles = {
    home: 'Raízes do Amanhã | Início',
    projetos: 'Nossos projetos | Raízes do Amanhã',
    cadastro: 'Faça parte | Raízes do Amanhã'
  };

  function currentRoute() {
    const route = window.location.hash.replace(/^#\/?/, '');
    return routeNames.includes(route) ? route : 'home';
  }

  function render(route) {
    const outlet = document.getElementById('app');
    const content = window.SITE_TEMPLATES[route] || window.SITE_TEMPLATES.home;
    outlet.innerHTML = content;
    document.title = titles[route] || titles.home;

    document.querySelectorAll('.main-nav [data-route]').forEach((link) => {
      const active = link.dataset.route === route;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    const menuButton = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.main-nav');
    if (menuButton && menu) {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.querySelector('.sr-only').textContent = 'Abrir menu';
      menu.classList.remove('open');
    }

    window.scrollTo(0, 0);
    window.dispatchEvent(new CustomEvent('spa:rendered', { detail: { route } }));
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-route]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const route = link.dataset.route;
    if (route === currentRoute()) {
      render(route);
      return;
    }
    window.location.hash = '/' + route;
  });

  window.addEventListener('hashchange', () => render(currentRoute()));
  document.addEventListener('DOMContentLoaded', () => render(currentRoute()));
})();
