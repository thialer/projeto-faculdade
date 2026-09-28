(function () {
  const digits = (value) => value.replace(/\D/g, '');
  const formatters = {
    phone(value) {
      const d = digits(value).slice(0, 11);
      if (d.length <= 2) return d.length ? '(' + d : '';
      const number = d.slice(2);
      const splitAt = d.length > 10 ? 5 : 4;
      return '(' + d.slice(0, 2) + ') ' + number.slice(0, splitAt) + (number.length > splitAt ? '-' + number.slice(splitAt) : '');
    },
    cpf(value) {
      const d = digits(value).slice(0, 11);
      return d.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    },
    cep(value) {
      const d = digits(value).slice(0, 8);
      return d.length > 5 ? d.slice(0, 5) + '-' + d.slice(5) : d;
    }
  };

  function isValidCpf(value) {
    const cpf = digits(value);
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    const checkDigit = (base, factor) => {
      let total = 0;
      for (const digit of base) total += Number(digit) * factor--;
      const remainder = (total * 10) % 11;
      return remainder === 10 ? 0 : remainder;
    };
    return checkDigit(cpf.slice(0, 9), 10) === Number(cpf[9]) && checkDigit(cpf.slice(0, 10), 11) === Number(cpf[10]);
  }

  document.addEventListener('click', (event) => {
    const menuButton = event.target.closest('.menu-toggle');
    if (menuButton) {
      const menu = document.querySelector('.main-nav');
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.querySelector('.sr-only').textContent = open ? 'Fechar menu' : 'Abrir menu';
      menu.classList.toggle('open', open);
      return;
    }

    const openButton = event.target.closest('[data-open-modal]');
    if (openButton) document.querySelector('.feedback-modal')?.showModal();

    if (event.target.closest('[data-close-modal]')) {
      document.querySelector('.feedback-modal')?.close();
    }

    if (event.target.closest('[data-show-toast]')) {
      const toast = document.getElementById('feedback-toast');
      if (!toast) return;
      toast.hidden = false;
      window.clearTimeout(window.feedbackToastTimer);
      window.feedbackToastTimer = window.setTimeout(() => { toast.hidden = true; }, 4500);
    }
  });

  document.addEventListener('input', (event) => {
    const input = event.target.closest('[data-mask]');
    if (!input || !formatters[input.dataset.mask]) return;
    const caretAtEnd = input.selectionStart === input.value.length;
    input.value = formatters[input.dataset.mask](input.value);
    if (caretAtEnd) input.setSelectionRange(input.value.length, input.value.length);
    if (input.dataset.mask === 'cpf') {
      input.setCustomValidity(input.value.length === 14 && !isValidCpf(input.value) ? 'Confira os números do CPF informado.' : '');
    }
  });

  document.addEventListener('submit', (event) => {
    const form = event.target.closest('#volunteer-form');
    if (!form) return;
    event.preventDefault();
    const notice = form.querySelector('#form-notice');
    notice.classList.remove('error');
    form.classList.add('was-validated');
    if (!form.checkValidity()) {
      form.reportValidity();
      notice.textContent = 'Confira os campos destacados e corrija os dados antes de enviar.';
      notice.classList.add('error');
      return;
    }
    notice.textContent = 'Cadastro preenchido com sucesso! Nossa equipe entrará em contato em breve.';
    form.reset();
    form.classList.remove('was-validated');
  });

  window.addEventListener('spa:rendered', (event) => {
    if (event.detail.route !== 'projetos') return;
    const projectGrid = document.querySelector('.project-grid');
    if (projectGrid && window.SITE_COMPONENTS) {
      projectGrid.innerHTML = window.SITE_COMPONENTS.renderProjects();
      window.restoreProjectFavorites?.();
    }
  });
})();
