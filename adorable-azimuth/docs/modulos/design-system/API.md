# design-system — API

## Estrutura de dados: tokens

- `src/styles/design-tokens.json` — fonte da verdade (cores, espaçamentos,
  fontes, escalas tipográficas).
- `src/styles/tokens.css` — materializa os tokens como custom properties em
  `:root` (`--color-*`, `--spacing-*`, `--font-*`).
- Consumo: sempre `var(--token)` em CSS/`.astro`; nunca o valor literal.

## Arquivos de estilo

| Arquivo | Escopo |
| --- | --- |
| `global.css` | reset + regras app-wide (escopadas por `.page-*`) |
| `home.css` | home-manifesto: layout, tokens visuais e motion progressivo |
| `typography.css` | h1–h6, p, a, listas |
| `layout.css` | padrões de grid/flex |
| `cards.css` / `forms.css` / `portfolio.css` / `new-landing.css` | áreas temáticas |
| `transitions.css` | view transitions do Astro |
| `skeleton.css` | placeholders de carregamento |
| `z.css` | gestão centralizada de z-index |

## Motion da home

`src/styles/home.css` mantém um único fallback load-time para todo
`[data-reveal]`. O valor do atributo declara qual timeline pode assumir:

- `data-reveal="load"` — permanece na document timeline; usado na cicatriz,
  que participa do pin hero→cicatriz.
- `data-reveal="view"` — dentro do feature gate que exige `view()`,
  named ranges e `animation-duration: auto`, usa o range
  `entry 0% entry 60%`; hoje marca tensão, em-campo e CTA/contato.

A colagem da cicatriz expõe a view timeline nomeada
`--home-scar-progress`. Bloco coral e número percorrem
`entry 0% exit 100%` em sentidos e amplitudes diferentes, animando a
propriedade individual `translate` para compor com os transforms existentes.
Sem suporte, o bloco inteiro é ignorado. Em `prefers-reduced-motion: reduce`,
reveals e parallax ficam estáticos e visíveis.

O cartão `main#main` usa `overflow: hidden` como fallback seguido de
`overflow: clip`. A segunda declaração é estrutural: preserva o recorte do
cartão sem criar um scroll container imóvel, que faria `view()` resolver pela
geometria do `main` em vez do viewport.

## Componentes (superfície pública, todos `.astro`)

- **Layout:** `BaseLayout` (h1, canonical, hreflang, dark mode, GSAP init),
  `Header`, `Footer`, `Hero`, `HomeHybridLanding`, `ProjectCaseRedesign`.
- **Famílias:** `cards/`, `typography/`, `ui/`, `data/`, `ux/` — ver pastas em
  `src/components/`.

Padrões de naming/estrutura são validados por
`scripts/components-standard-gate.cjs` (`pnpm components:gate`).

---
Última revisão: 2026-07-16 — Plano Home Motion 02
