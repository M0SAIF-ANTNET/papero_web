(() => {
  const translations = window.PAPERO_TRANSLATIONS;
  const html = document.documentElement;
  const header = document.querySelector('.site-header');
  const nav = document.getElementById('primary-nav');
  const menuToggle = document.getElementById('menu-toggle');
  const langButtons = document.querySelectorAll('.lang-btn');
  const i18nNodes = document.querySelectorAll('[data-i18n]');
  const i18nPlaceholders = document.querySelectorAll('[data-i18n-placeholder]');
  const navAnchors = document.querySelectorAll('.nav a');
  const revealNodes = document.querySelectorAll('.reveal');

  const defaultLang = 'ar';

  const setLanguage = (lang) => {
    const current = translations[lang] ? lang : defaultLang;
    localStorage.setItem('papero_lang', current);
    html.lang = current;
    html.dir = current === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('lang-en', current === 'en');

    i18nNodes.forEach((node) => {
      const key = node.dataset.i18n;
      if (translations[current][key]) node.textContent = translations[current][key];
    });

    i18nPlaceholders.forEach((node) => {
      const key = node.dataset.i18nPlaceholder;
      if (translations[current][key]) node.setAttribute('placeholder', translations[current][key]);
    });

    document.title = translations[current].pageTitle;
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute('content', translations[current].pageDescription);

    langButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.lang === current));
  };

  const closeMenu = () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  menuToggle?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navAnchors.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  langButtons.forEach((button) => {
    button.addEventListener('click', () => setLanguage(button.dataset.lang));
  });

  const sections = [...document.querySelectorAll('main section[id]')];
  const setActiveSection = () => {
    const y = window.scrollY + 160;
    sections.forEach((section) => {
      const active = y >= section.offsetTop && y < section.offsetTop + section.offsetHeight;
      const link = document.querySelector(`.nav a[href="#${section.id}"]`);
      if (link) link.classList.toggle('active', active);
    });
    header.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', setActiveSection, { passive: true });
  setActiveSection();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealNodes.forEach((node) => observer.observe(node));

  document.querySelectorAll('.faq-item').forEach((item) => {
    const button = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    button.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach((current) => {
        current.classList.remove('open');
        current.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        current.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });

  const form = document.querySelector('.contact-form');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    form.classList.add('validated');
    form.querySelectorAll(':invalid').forEach((invalidField) => {
      invalidField.setAttribute('aria-invalid', 'true');
    });
    if (form.checkValidity()) {
      form.reset();
      form.classList.remove('validated');
    }
  });

  const saved = localStorage.getItem('papero_lang') || defaultLang;
  setLanguage(saved);
})();
