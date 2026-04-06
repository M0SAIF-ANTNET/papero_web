(() => {
  const translations = window.PAPERO_TRANSLATIONS;
  const html = document.documentElement;
  const header = document.querySelector('.site-header');
  const nav = document.getElementById('primary-nav');
  const menuToggle = document.getElementById('menu-toggle');
  const langButtons = document.querySelectorAll('.lang-btn');
  const i18nNodes = document.querySelectorAll('[data-i18n]');
  const navAnchors = document.querySelectorAll('.nav a');
  const revealNodes = document.querySelectorAll('.reveal');
  const form = document.querySelector('.contact-form');

  const defaultLang = 'ar';

  const setLanguage = (lang) => {
    const current = translations[lang] ? lang : defaultLang;

    localStorage.setItem('papero_lang', current);
    html.lang = current;
    html.dir = current === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('lang-en', current === 'en');

    i18nNodes.forEach((node) => {
      const key = node.dataset.i18n;
      const value = translations[current][key];
      if (value) node.textContent = value;
    });

    document.title = translations[current].pageTitle;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', translations[current].pageDescription);

    langButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.lang === current);
    });
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

    header.classList.toggle('scrolled', window.scrollY > 18);
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

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    form.querySelectorAll(':invalid').forEach((field) => field.setAttribute('aria-invalid', 'true'));
    if (form.checkValidity()) {
      form.reset();
    }
  });

  setLanguage(localStorage.getItem('papero_lang') || defaultLang);
})();
