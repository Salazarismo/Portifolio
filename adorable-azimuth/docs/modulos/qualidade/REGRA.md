# qualidade — REGRA

A qualidade do repositório é garantida por **gates**: scripts em `scripts/` que
falham o build/CI quando uma regra é violada. Gate vermelho = mudança não entra.

## Gates ativos (conectados ao package.json e/ou CI)

| Gate | Script | O que garante |
| --- | --- | --- |
| i18n parity | `check-i18n.mjs` | chaves idênticas entre pt-br e en (roda no `prebuild` e no CI) |
| en sem pt | `check-en-no-pt.mjs` | nenhum português em páginas `/en` (roda no `prebuild`) |
| islands | `islands-gate.cjs` | `.tsx` somente em `src/islands/` |
| tokens | `token-gate.cjs` | estilos usam variáveis de token, sem valores hardcoded. **Informativo no CI** (`continue-on-error`): 791 violações pré-existentes do redesign; tornar bloqueante após o refactor |
| semantics | `semantics-gate.cjs` | HTML semântico no build prerenderizado (h1 único, nav/main/footer, meta); falha se não encontrar nenhum `.html` |
| projects | `projects-gate.cjs` | consistência dos case studies **por dados**: `projects.ts` ↔ páginas pt/en ↔ namespaces i18n ↔ imagens locais existentes, dimensões e métricas obrigatórias |
| js budget | `js-budget.cjs` | tamanho do JS entregue dentro do orçamento (falha se o build não existir) |
| components | `components-standard-gate.cjs` | `data-section-type` em seções e `data-variant` em CTAs no HTML do build (só via `pnpm components:gate`; não está no CI) |
| docs | `docs-gate.cjs` | estrutura da documentação viva (INDEX completo, REGRA.md presente, rodapés, links válidos) |

Os gates de HTML dependem do prerender (toda página tem `prerender = true`;
ver [ARQUITETURA.md](../../../../ARQUITETURA.md)) e têm proteção anti-vacuidade:
zero arquivos `.html` no build = falha, não verde.

## Regras

1. **Nunca contornar um gate** (ajustar o script para passar, pular no CI).
   Se o gate está errado, corrija o gate como mudança explícita e documentada.
2. **Regra nova de projeto → gate novo** quando for verificável por script;
   docs sozinhos não seguram regra.
3. Gate novo entra em três lugares: `scripts/`, script `pnpm` no
   `package.json`, e step no `.github/workflows/ci.yml`.

## Estado conhecido (dívidas)

- **Tokens (791 violações):** o redesign abandonou a disciplina de tokens
  (`ProjectCaseRedesign` 209, `HomeLandingRedesign` 158, `HomeHybridLanding`
  55, páginas `recruiter`/`client`…). O `tokens:gate` roda como informativo no
  CI até o refactor; não introduzir violações novas.
- Testes Playwright (`test:e2e`) não rodam no CI.
- Histórico: os gates órfãos da convenção de markup antiga (`layout`,
  `sections`, `typography`, `ux-quality`, `perf`) e os componentes mortos
  `Section.astro`/`ProjectCard.astro` foram removidos em 2026-06-11; estudo e
  justificativas em [../../estudo-gates-2026-06-11.md](../../estudo-gates-2026-06-11.md).

## Testes

`tests/i18n.spec.ts` (Playwright, `pnpm test:e2e`): hero pt e en corretos,
toggle de locale preserva a rota equivalente, header não sobrepõe o hero.

---
Última revisão: 2026-06-11 — 588ffd1
