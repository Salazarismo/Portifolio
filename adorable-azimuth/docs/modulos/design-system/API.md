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
| `typography.css` | h1–h6, p, a, listas |
| `layout.css` | padrões de grid/flex |
| `cards.css` / `forms.css` / `portfolio.css` / `new-landing.css` | áreas temáticas |
| `transitions.css` | view transitions do Astro |
| `skeleton.css` | placeholders de carregamento |
| `z.css` | gestão centralizada de z-index |

## Componentes (superfície pública, todos `.astro`)

- **Layout:** `BaseLayout` (h1, canonical, hreflang, dark mode, GSAP init),
  `Header`, `Footer`, `Hero`, `HomeHybridLanding`, `ProjectCaseRedesign`.
- **Famílias:** `cards/`, `typography/`, `ui/`, `data/`, `ux/` — ver pastas em
  `src/components/`.

Padrões de naming/estrutura são validados por
`scripts/components-standard-gate.cjs` (`pnpm components:gate`).

---
Última revisão: 2026-06-11 — 588ffd1
