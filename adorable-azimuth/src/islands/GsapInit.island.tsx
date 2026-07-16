import { useEffect } from 'preact/hooks';
import initGsapReveal, { initHomeChoreography } from '../lib/gsap-reveal';

export default function GsapInit() {
  useEffect(() => {
    // Home-manifesto tem coreografia própria (plano home-motion 01); as demais
    // páginas seguem no reveal legado [data-cell]/[data-anim="hero"].
    if (document.getElementById('home-root')) {
      void initHomeChoreography();
    } else {
      void initGsapReveal();
    }
  }, []);
  return null;
}
