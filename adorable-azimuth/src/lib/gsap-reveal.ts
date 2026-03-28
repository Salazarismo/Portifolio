export default async function initGsapReveal() {
  const { gsap } = await import('gsap');
  const mod = await import('gsap/ScrollTrigger');
  const ScrollTrigger = (mod as any).ScrollTrigger ?? (mod as any).default;
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();
  mm.add({ reduce: '(prefers-reduced-motion: reduce)' }, (ctx) => {
    if (ctx.conditions?.reduce) {
      const targets = Array.from(document.querySelectorAll('[data-cell]'));
      for (const el of targets) {
        if (el instanceof HTMLElement) el.setAttribute('data-sr', 'show');
      }
      return () => {};
    }
    const cells = Array.from(document.querySelectorAll('[data-cell]')).filter(
      (el): el is HTMLElement => el instanceof HTMLElement
    );
    for (const el of cells) {
      gsap.set(el, { opacity: 0, y: 60 });
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () =>
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'expo.out'
          })
      });
    }
    const hero = document.querySelector('[data-anim="hero"]');
    if (hero instanceof HTMLElement) {
      const header = document.getElementById('site-header');
      const title = hero.querySelector('#hero-title');
      const subtitle = hero.querySelector('[data-hero-subtitle]');
      const cta = hero.querySelector('[data-cta]');
      const scrollIndicator = hero.querySelector('.nl-hero-scroll');

      if (header) gsap.set(header, { opacity: 0, y: -20 });
      if (title) gsap.set(title, { opacity: 0, y: 20 });
      if (subtitle) gsap.set(subtitle, { opacity: 0, y: 30 });
      if (cta) gsap.set(cta, { opacity: 0, scale: 0.95 });
      if (scrollIndicator) gsap.set(scrollIndicator, { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      if (header) tl.to(header, { opacity: 1, y: 0, duration: 0.4 }, 0);
      if (title) tl.to(title, { opacity: 1, y: 0, duration: 0.8 }, 0.2);
      if (subtitle) tl.to(subtitle, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0.6);
      if (cta) tl.to(cta, { opacity: 1, scale: 1, duration: 0.4 }, 0.8);
      if (scrollIndicator) tl.to(scrollIndicator, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 1.0);
    }
    return () => {};
  });
}
