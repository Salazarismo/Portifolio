# INDEX.md — Mapa de módulos

Antes de mexer em um módulo, leia o `REGRA.md` dele. Visão macro em
[ARQUITETURA.md](../../../ARQUITETURA.md); regras gerais em [AGENTS.md](../../../AGENTS.md).

| Módulo | Onde está o código | O que ler |
| --- | --- | --- |
| [i18n](i18n/REGRA.md) | `src/i18n/`, `scripts/check-i18n.mjs`, `scripts/check-en-no-pt.mjs` | [REGRA](i18n/REGRA.md) · [API](i18n/API.md) · [FLUXOS](i18n/FLUXOS.md) |
| [projetos](projetos/REGRA.md) | `src/data/projects.ts`, `src/pages/projects/`, `src/pages/en/projects/`, `scripts/projects-gate.cjs` | [REGRA](projetos/REGRA.md) · [API](projetos/API.md) · [FLUXOS](projetos/FLUXOS.md) |
| [design-system](design-system/REGRA.md) | `src/styles/`, `src/components/`, `scripts/token-gate.cjs` | [REGRA](design-system/REGRA.md) · [API](design-system/API.md) |
| [interatividade](interatividade/REGRA.md) | `src/islands/`, `src/lib/gsap-reveal.ts`, `scripts/islands-gate.cjs`, `scripts/js-budget.cjs` | [REGRA](interatividade/REGRA.md) · [API](interatividade/API.md) · [FLUXOS](interatividade/FLUXOS.md) |
| [contato](contato/REGRA.md) | `src/pages/api/contact.ts`, `src/islands/ContactForm.island.tsx` | [REGRA](contato/REGRA.md) · [API](contato/API.md) · [FLUXOS](contato/FLUXOS.md) |
| [qualidade](qualidade/REGRA.md) | `scripts/`, `.github/workflows/ci.yml` (raiz do repo), `tests/` | [REGRA](qualidade/REGRA.md) · [FLUXOS](qualidade/FLUXOS.md) |

Áreas sem pasta própria: páginas e roteamento estão descritos em
[ARQUITETURA.md](../../../ARQUITETURA.md); o relatório histórico de performance M4 está em
[../m4-relatorio.md](../m4-relatorio.md).

---
Última revisão: 2026-06-11 — 588ffd1
