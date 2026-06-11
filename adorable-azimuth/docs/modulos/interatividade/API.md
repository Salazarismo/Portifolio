# interatividade — API

## Inventário de islands (`src/islands/`)

| Island | O que hidrata |
| --- | --- |
| `ContactForm.island.tsx` | formulário de contato: validação, estados idle/submitting/success/error, honeypot, POST `/api/contact` |
| `GsapInit.island.tsx` | inicialização global do GSAP + reveals on-scroll |
| `HeaderNavSegmented.tsx` / `SegmentedButton.tsx` | toggle de idioma pt↔en no header, com transição |
| `MorphingText.island.tsx` | animação de texto do hero (timeline GSAP) |
| `NavTransitions.island.tsx` | transições entre rotas |
| `PortfolioGrid.island.tsx` | grade interativa de projetos (consome `featuredProjects`) |
| `AspectRatioImage.tsx` / `aspect-ratio.tsx` | imagem lazy com aspect ratio reservado |

## Helpers

- `src/lib/gsap-reveal.ts` — registro de animações de reveal (ScrollTrigger);
  usado pelo `GsapInit`.

Ao adicionar, remover ou mudar a responsabilidade de uma island, atualize a
tabela acima.

---
Última revisão: 2026-06-11 — 588ffd1
