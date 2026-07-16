/**
 * Coreografia da home-manifesto (plano home-motion 01) — reativa o GSAP que
 * já é baixado em toda página e estava inerte na home.
 *
 * CONTRATO DE DATA-ATTRIBUTES (copiar p/ docs/modulos/interatividade/API.md
 * no Plano 04):
 * - [data-home-stage]          a dobra pinada (a <section> do hero). O pin usa
 *                              pinSpacing:false — a altura do documento NÃO
 *                              muda; a âncora #em-campo e o smooth-scroll do
 *                              NavTransitions ficam intactos.
 * - [data-home-actor="thesis"] quem cede o palco: sai em scale/y/autoAlpha.
 *                              Hoje é o mesmo elemento do stage; o contrato
 *                              permite separar no futuro.
 * - [data-home-actor="scar"]   quem assume o palco: a colagem da cicatriz
 *                              (plano 00) cresce de coadjuvante a protagonista.
 *                              O trigger da timeline é a <section> mais próxima
 *                              do ator (closest).
 *
 * Guardas (gsap.matchMedia): só roda com prefers-reduced-motion: no-preference
 * E viewport ≥48em. Fora disso, zero ScrollTrigger — o layout estático e o
 * reveal CSS de load (home.css) permanecem como estão. Decisão mobile (<48em):
 * sem pin; o reveal de load atual já resolve.
 */
export async function initHomeChoreography() {
  const stage = document.querySelector('[data-home-stage]');
  const thesis = document.querySelector('[data-home-actor="thesis"]');
  const scar = document.querySelector('[data-home-actor="scar"]');
  if (
    !(stage instanceof HTMLElement) ||
    !(thesis instanceof HTMLElement) ||
    !(scar instanceof HTMLElement)
  ) {
    return;
  }
  const scarSection = scar.closest('section') ?? scar;
  const { gsap } = await import('gsap');
  const mod = await import('gsap/ScrollTrigger');
  const ScrollTrigger = (mod as any).ScrollTrigger ?? (mod as any).default;
  gsap.registerPlugin(ScrollTrigger);
  // Cormorant/Syne chegam depois da hidratação e mudam a altura do hero —
  // sem o refresh, start/end do pin ficam medidos com a fonte fallback.
  void document.fonts?.ready.then(() => ScrollTrigger.refresh());
  gsap.matchMedia().add(
    '(prefers-reduced-motion: no-preference) and (min-width: 48em)',
    () => {
      // Um único trigger dirige pin e timeline: a cicatriz viaja do rodapé ao
      // topo do viewport (~100vh de scroll) enquanto o hero segura o palco.
      // clamp() evita a timeline nascer "no meio" quando a cicatriz já está
      // perto da dobra no load.
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: scarSection,
          start: 'clamp(top bottom)',
          end: 'clamp(top top)',
          scrub: 0.8,
          pin: stage,
          pinSpacing: false
        }
      });
      // A tese sai cedo (0→0.45) para a cicatriz não cruzar texto com texto;
      // a colagem atinge identidade (scale 1 / y 0) ANTES do fim do pin, então
      // o unpin nunca produz salto visual.
      tl.to(thesis, { autoAlpha: 0, scale: 0.94, yPercent: -10, duration: 0.45 }, 0)
        .fromTo(
          scar,
          { scale: 0.85, yPercent: 12 },
          { scale: 1, yPercent: 0, duration: 0.55 },
          0.25
        );
    }
  );
}

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
