(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const year = document.getElementById('year');
  const menuButton = document.querySelector('.menu-button');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (year) year.textContent = new Date().getFullYear();

  const setMenu = (open) => {
    menuButton?.setAttribute('aria-expanded', String(open));
    mobileMenu?.setAttribute('aria-hidden', String(!open));
    mobileMenu?.classList.toggle('is-open', open);
  };
  menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

  const stage = document.querySelector('.capability-stage');
  const steps = [...document.querySelectorAll('.capability-step')];
  const stageImages = [...document.querySelectorAll('[data-stage-image]')];
  const stageLabel = document.querySelector('[data-stage-label]');
  const stageCurrent = document.querySelector('[data-stage-current]');
  const labels = ['Структура / Главная', 'Интерфейс / Адаптив', 'Функциональность / Каталог', 'Запуск / Live'];

  const activateScene = (index) => {
    steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
    stageImages.forEach((image, i) => image.classList.toggle('is-active', i === index));
    if (stage) stage.dataset.scene = String(index);
    if (stageLabel) stageLabel.textContent = labels[index];
    if (stageCurrent) stageCurrent.textContent = String(index + 1).padStart(2, '0');
  };

  if (reduceMotion) {
    root.classList.add('ready');
    document.querySelectorAll('.reveal').forEach((el) => el.style.opacity = '1');
    document.querySelectorAll('.image-mask').forEach((el) => el.style.clipPath = 'none');
    activateScene(0);
    return;
  }

  const hasGsap = typeof window.gsap !== 'undefined';
  const hasScrollTrigger = typeof window.ScrollTrigger !== 'undefined';

  if (hasGsap) {
    const { gsap } = window;
    if (hasScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    const intro = gsap.timeline({ defaults: { ease: 'power4.out' }, onStart: () => root.classList.add('ready') });
    intro
      .to('.hero-line > span', { y: 0, duration: 1.05, stagger: 0.09 })
      .to('.hero-reveal', { opacity: 1, y: 0, duration: .72, stagger: .08 }, '-=.68')
      .to('.laptop', { opacity: 1, x: 0, y: 0, rotateX: 0, rotateY: 0, scale: 1, duration: 1.35 }, '-=.9')
      .to('.phone', { opacity: 1, x: 0, y: 0, rotate: 0, duration: 1.05 }, '-=.9')
      .to('.screen-sheen', { x: '165%', duration: 1.25, ease: 'power2.inOut' }, '-=.55');

    gsap.to('.laptop', {
      yPercent: -3,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 }
    });
    gsap.to('.phone', {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 }
    });

    gsap.utils.toArray('.reveal').forEach((item) => {
      gsap.to(item, {
        opacity: 1,
        y: 0,
        duration: .75,
        ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 86%', once: true }
      });
    });
    gsap.utils.toArray('.image-mask').forEach((item) => {
      gsap.to(item, {
        clipPath: 'inset(0 0 0% 0)',
        duration: 1.15,
        ease: 'power4.inOut',
        scrollTrigger: { trigger: item, start: 'top 84%', once: true }
      });
    });

    if (hasScrollTrigger && window.innerWidth > 900) {
      steps.forEach((step, index) => {
        window.ScrollTrigger.create({
          trigger: step,
          start: 'top 47%',
          end: 'bottom 47%',
          onEnter: () => activateScene(index),
          onEnterBack: () => activateScene(index)
        });
      });
      gsap.fromTo('.stage-browser',
        { rotateY: -5, rotateX: 2, scale: .96 },
        { rotateY: 0, rotateX: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: '.capability-story', start: 'top 78%', end: 'top 25%', scrub: .8 } }
      );
    } else {
      const sceneObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) activateScene(Number(entry.target.dataset.scene));
        });
      }, { threshold: .55 });
      steps.forEach((step) => sceneObserver.observe(step));
    }
  } else {
    root.classList.add('ready');
    document.querySelectorAll('.hero-line > span').forEach((el) => el.style.transform = 'none');
    document.querySelectorAll('.hero-reveal,.laptop,.phone,.reveal').forEach((el) => { el.style.opacity = '1'; el.style.transform = 'none'; });
    document.querySelectorAll('.image-mask').forEach((el) => el.style.clipPath = 'none');
    const sceneObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) activateScene(Number(entry.target.dataset.scene)); });
    }, { threshold: .5 });
    steps.forEach((step) => sceneObserver.observe(step));
  }

  activateScene(0);
})();
