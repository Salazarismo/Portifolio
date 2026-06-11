# i18n — REGRA

Sistema de internacionalização bilíngue (pt-br padrão, en secundário) baseado em
arquivos JSON por namespace, carregados em build/SSR — sem biblioteca externa.

## O que o módulo garante

- Toda string visível ao usuário vem de `src/i18n/{locale}/{namespace}.json`,
  nunca hardcoded em componente ou página.
- **Paridade de chaves:** cada namespace existe nos dois locales com exatamente
  as mesmas chaves (`scripts/check-i18n.mjs` falha o build se divergirem).
- **Inglês limpo:** páginas sob `src/pages/en/` não podem conter texto em
  português (`scripts/check-en-no-pt.mjs`).
- Chave faltante **quebra em dev** (throw) e em produção renderiza o marcador
  `[[locale:namespace:chave]]` — visível de propósito, para não passar batido.

## Regras ao trabalhar no módulo

1. Nova string → adicionar a chave **nos dois locales** no mesmo commit.
2. Não reaproveitar chave com significado diferente entre páginas; na dúvida,
   crie chave nova no namespace da página.
3. Namespaces seguem a página/área (`home`, `projects`, `project_<slug>`,
   `cards`, `common`). `common` é só para termos realmente compartilhados.
4. Rotas: pt-br vive na raiz (`/`), en sob `/en/` — cada página pt tem um
   espelho em `src/pages/en/`. Ao criar página nova, criar o espelho.

## Impactos cruzados

- [projetos](../projetos/REGRA.md): cada case study tem namespace próprio
  (`project_p3`, `project_p5`, `project_p7`).
- [qualidade](../qualidade/REGRA.md): os dois checks de i18n rodam no `prebuild`
  e no CI; os testes Playwright (`tests/i18n.spec.ts`) validam o toggle pt↔en.

---
Última revisão: 2026-06-11 — 588ffd1
