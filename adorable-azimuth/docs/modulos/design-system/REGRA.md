# design-system — REGRA

Tokens de design + componentes estáticos `.astro`. Garante consistência visual
e impede divergência de estilos entre páginas.

## Regras

1. **Tokens obrigatórios:** cores, espaçamentos, fontes e escalas vêm de
   `src/styles/design-tokens.json`, expostos como CSS custom properties em
   `src/styles/tokens.css`. Valores visuais hardcoded em componentes/CSS são
   violação (`scripts/token-gate.cjs`).
2. **Componentes `.astro` são estáticos:** apresentação pura, sem estado nem
   efeitos — interatividade pertence ao módulo
   [interatividade](../interatividade/REGRA.md).
3. **Organização por família:** `cards/` (CardAction, CardInfo, CardStat,
   CardPreview), `typography/` (H1–H6, P, Highlight, List), `ui/` (Button,
   Input, Badge, Carousel…), `data/` (listas/tabelas), `ux/` (ProofStrip).
   Componente novo entra na família correspondente, em PascalCase.
4. **Semântica:** um único `<h1>` por página (responsabilidade do
   `BaseLayout.astro`); headings descem em ordem. `scripts/semantics-gate.cjs`
   verifica.
5. **CSS modular com escopo por página:** estilos globais em
   `src/styles/global.css` usam classes `.page-*`; estilos novos entram no
   arquivo temático correspondente (`cards.css`, `forms.css`, `layout.css`…),
   não em um CSS monolítico.

## Impactos cruzados

- Mudar um token muda o site inteiro — verificar páginas pt e en.
- `BaseLayout.astro` também carrega canonical/hreflang e o init do GSAP; mexer
  nele afeta [interatividade](../interatividade/REGRA.md) e SEO.

---
Última revisão: 2026-06-11 — 588ffd1
