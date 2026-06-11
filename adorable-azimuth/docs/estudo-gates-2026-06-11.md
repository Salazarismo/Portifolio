# Estudo — Gates órfãos e gates pós-build (2026-06-11)

Origem: dívida registrada em [modulos/qualidade/REGRA.md](modulos/qualidade/REGRA.md)
("scripts existentes mas não conectados"). O estudo ampliou o escopo ao
descobrir que o problema afeta também os gates **ativos** no CI.

## Descoberta central: os gates de HTML não verificam nada

Todos os gates pós-build que analisam HTML escaneiam `dist/**/*.html`. Porém:

- `astro.config.mjs` usa `output: 'server'` e **nenhuma página declara
  `prerender = true`** → o build não emite nenhum arquivo `.html`
  (verificado: `dist/` contém apenas `client/_astro`; `.vercel/output/` não
  tem HTML).
- Resultado: os gates varrem zero arquivos e imprimem sucesso. **Verde vácuo**
  — passam desde sempre sem checar nada, inclusive os que estão no CI.

Evidência (execução local pós-build, todos exit 0 sem analisar nenhum HTML):
`semantics-gate`, `projects-gate`, `components-standard-gate`, `layout-gate`,
`perf-gate`, `sections-gate`, `typography-gate`, `ux-quality-gate`.

## Veredito por gate

| Gate | Status real | Causa |
| --- | --- | --- |
| `js-budget.cjs` (CI) | **Funcional** — mediu 141,69 KB ≤ 150 KB | lê `dist/client/_astro/*.js`, que existe |
| `token-gate.cjs`, `islands-gate.cjs`, `check-i18n.mjs`, `check-en-no-pt.mjs`, `docs-gate.cjs` | **Funcionais** | escaneiam `src/`, não o build |
| `semantics-gate.cjs` (CI) | Verde vácuo | sem HTML no build |
| `projects-gate.cjs` (CI) | Verde vácuo duplo | sem HTML; e exige `data-project-card`, emitido só por `ProjectCard.astro`, que **nenhuma página usa** |
| `components-standard-gate.cjs` | Verde vácuo | sem HTML |
| `layout-gate.cjs` (órfão) | Verde vácuo duplo | sem HTML; exige `data-section`/`data-cell`, emitidos só por `Section.astro`, **não usado por páginas** |
| `sections-gate.cjs` (órfão) | Verde vácuo duplo | idem (`data-objective/action/completion`) |
| `ux-quality-gate.cjs` (órfão) | Verde vácuo duplo | idem + `ProjectCard` |
| `typography-gate.cjs` (órfão) | Verde vácuo; se houvesse HTML, provavelmente **falharia** | exige `data-text` em todo heading; páginas atuais não seguem 100% |
| `perf-gate.cjs` (órfão) | Verde vácuo; checagens ainda desejáveis (M4) | preload de hero, `loading="eager"`, `fetchpriority`, `prefers-reduced-motion` |
| `token-gate.js` | **Morto** | versão antiga do `token-gate.cjs` (diff confirma: mesmo gate, menos refinado) |

Contexto: `Section.astro` e `ProjectCard.astro` pertencem a uma convenção de
markup de fase anterior do design; as páginas atuais usam
`HomeHybridLanding`/`ProjectCaseRedesign`, que não emitem esses atributos. A
única referência restante é um exemplo em `src/pages/docs/content.md`.

## Recomendações

### Fase A — higiene (sem risco, fazer já)

1. **Apagar** `token-gate.js` (duplicata morta).
2. **Aposentar** `layout-gate.cjs`, `sections-gate.cjs`, `ux-quality-gate.cjs`
   e `typography-gate.cjs`: a convenção que eles cobram morreu com o redesign.
   Junto, decidir o destino de `Section.astro` e `ProjectCard.astro` (remover
   ou re-adotar — hoje são código morto).
3. **Anti-vacuidade:** todo gate de HTML mantido deve falhar quando encontra
   zero arquivos `.html` — verde sem amostra é mentira.

### Fase B — restaurar a verificabilidade (decisão de arquitetura)

O conteúdo do site é estático por natureza; só `/api/contact` precisa de
servidor. Recomendação: adicionar `export const prerender = true` às páginas
(mantendo o endpoint como está). Efeitos:

- O build volta a emitir HTML → `semantics-gate`, `projects-gate` e
  `perf-gate` voltam a ter o que verificar (re-apontar para o diretório onde
  o HTML prerenderizado cair — confirmar na implementação).
- Bônus: páginas servidas estáticas pela CDN (TTFB menor, menos invocações de
  function na Vercel).

Alternativa, se quiser manter SSR puro: mover essas checagens para testes
Playwright (que enxergam o HTML renderizado de verdade). Custo: CI mais lento;
o repo já tem a infraestrutura (`tests/i18n.spec.ts`).

### Fase C — ajustes pós-B

- `perf-gate`: revisar contra o HTML real (o Hero usa `<picture>`; a exigência
  de `<link rel="preload" as="image">` pode não refletir o markup atual).
- `projects-gate`: ou reescrever para validar `src/data/projects.ts`
  diretamente (campos, imagens, slugs — sem depender de markup), ou re-adotar
  `data-project-card` nas páginas. A validação por dados é mais robusta.
- Atualizar a tabela de gates em [modulos/qualidade/REGRA.md](modulos/qualidade/REGRA.md)
  a cada mudança.

## Status de execução (2026-06-11)

O plano foi executado, com dois desvios descobertos durante a implementação:

- **Fase A:** removidos `token-gate.js`, `layout-gate.cjs`, `sections-gate.cjs`,
  `ux-quality-gate.cjs`, `typography-gate.cjs`, `Section.astro` e
  `ProjectCard.astro`. Anti-vacuidade adicionada a `semantics-gate`,
  `components-standard-gate` e `js-budget`.
- **Fase B:** `prerender = true` em todas as 12 páginas; o build passou a
  emitir 12 HTML em `dist/client/` (espelhados em `.vercel/output/static/`).
- **Fase C:** `projects-gate` reescrito para validar dados
  (`projects.ts` ↔ páginas ↔ i18n ↔ imagens). **Desvio 1:** `perf-gate` foi
  aposentado em vez de revisado — suas checagens se provaram obsoletas: exigia
  um `<link rel="preload">` de imagem Unsplash que não é usada em página
  nenhuma (preload morto, removido do `BaseLayout`), e procurava
  `prefers-reduced-motion` no HTML, mas a regra vive em CSS externo.
- **Desvio 2 (achado novo):** com HTML real, o `token-gate` revelou **791
  violações pré-existentes** — o redesign abandonou a disciplina de tokens.
  Refatorar é fora de escopo; o gate ficou **informativo** no CI
  (`continue-on-error`) até o refactor. Registrado como dívida em
  [modulos/qualidade/REGRA.md](modulos/qualidade/REGRA.md).
- Correções legítimas apanhadas pelos gates reativados: `recruiter.astro` sem
  `<nav>`/`<main>` (corrigido) e `tsconfig.json` com `baseUrl` depreciado no
  TypeScript 6 (removido).

## Riscos de não agir

O CI (agora funcional na raiz) exibirá uma bateria de gates verdes que não
verificam nada — pior que ausência de gate, porque gera falsa confiança. O
único guarda-corpo pós-build real hoje é o `js-budget`, que está a 8 KB do
limite.

---
Última revisão: 2026-06-11 — 588ffd1
