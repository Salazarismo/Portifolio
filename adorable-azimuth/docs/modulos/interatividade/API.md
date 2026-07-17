# interatividade — API

## Inventário de islands (`src/islands/`)

| Island | O que hidrata |
| --- | --- |
| `ContactForm.island.tsx` | formulário de contato: validação, estados idle/submitting/success/error, honeypot, POST `/api/contact` |
| `GsapInit.island.tsx` | inicialização global do GSAP + reveals on-scroll |
| `HeaderNavSegmented.tsx` | nav de seções do header (scroll-spy + scroll suave), sobre o `SegmentedButton` |
| `SegmentedButton.tsx` | radiogroup base compartilhado (indicador animado + roving de teclado: setas/Home/End) |
| `ModeToggle.tsx` | toggle recrutador/cliente da home: escreve `#home-root[data-mode]`; o conteúdo troca por CSS (`.hm-when-*`), sem persistência |
| `MorphingText.island.tsx` | animação de texto do hero (timeline GSAP) |
| `NavTransitions.island.tsx` | transições entre rotas: aplica `nav-forward`/`nav-back` no `<html>` e chama `startViewTransition()`; o visual (wipe orgânico coral, plano home-motion 03) vive em `src/styles/transitions.css` |
| `PortfolioGrid.island.tsx` | grade interativa de projetos (consome `featuredProjects`) |
| `AspectRatioImage.tsx` / `aspect-ratio.tsx` | imagem lazy com aspect ratio reservado |

## Helpers

- `src/lib/gsap-reveal.ts` — registro de animações de reveal (ScrollTrigger);
  usado pelo `GsapInit`.

## Contrato do wipe de transição (CSS-only)

`src/styles/transitions.css` estiliza os pseudo-elementos
`::view-transition-old(root)`/`::view-transition-new(root)` sob as classes
que o `NavTransitions.island.tsx` já aplica:

- `html.nav-forward` / `html.nav-back` → varredura orgânica coral
  (keyframes `wipeOld*`/`wipeNew*`, elipses defasadas; a faixa coral é o
  background do `::view-transition-image-pair(root)`). Cor, duração e easing
  vêm de tokens (`--color-primary` + `color-mix`, `--duration-slow`,
  `--ease-emphasized`).
- Sem classe de direção → cross-fade default; `html.hash-scroll` → slide
  vertical (inalterados).
- Reduced-motion: guarda no próprio CSS anula animação e fundo coral,
  redundante à guarda do island (defesa em profundidade).
- O wipe vale para QUALQUER navegação interna que receba classe de direção
  (todas as rotas, não só home→recruiter/client) — decisão registrada no
  plano home-motion 03; para restringir, escopar por classe no `<body>`.

Ao adicionar, remover ou mudar a responsabilidade de uma island, atualize a
tabela acima.

---
Última revisão: 2026-07-17 — d168512
