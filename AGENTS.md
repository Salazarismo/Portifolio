# AGENTS.md — Regras para agentes e contribuidores

Este repositório é o portfólio técnico de Victor de Alcântara Bueno. O site fica
inteiro em `adorable-azimuth/` (Astro 5 SSR + Preact islands + Tailwind 4, deploy
na Vercel). A raiz do repositório guarda apenas o `README.md` (bio) e a
documentação de fundação.

## Onde buscar contexto (nesta ordem)

1. [DOCUMENTACAO.md](DOCUMENTACAO.md) — como a documentação está organizada.
2. [ARQUITETURA.md](ARQUITETURA.md) — visão macro do sistema.
3. [adorable-azimuth/docs/modulos/INDEX.md](adorable-azimuth/docs/modulos/INDEX.md) — mapa de módulos; antes de mexer
   em um módulo, leia o `REGRA.md` dele.
4. [GLOSSARIO.md](GLOSSARIO.md) — termos oficiais (island, gate, ladder, namespace…).

## Regras invioláveis (verificadas por gates no CI)

- **Islands Hygiene (M2):** arquivos `.tsx` existem somente em `src/islands/`.
  Componentes `.astro` são apresentação estática, sem interatividade.
- **Paridade i18n:** toda string visível ao usuário vem de `src/i18n/{pt-br,en}/`
  via `loadMessages`/`createT`. As chaves de `pt-br` e `en` devem ser idênticas,
  e páginas sob `/en` não podem conter português.
- **Design tokens:** cores, espaçamentos e fontes usam variáveis CSS de
  `src/styles/design-tokens.json`/`tokens.css`. Não introduza valores
  hardcoded novos (há dívida pré-existente; o `tokens:gate` roda como
  informativo no CI até o refactor — ver `docs/modulos/qualidade/REGRA.md`).
- **Prerender obrigatório:** toda página declara `export const prerender =
  true`; apenas `/api/*` roda on-demand.
- **Semântica:** um único `<h1>` por página (vem do `BaseLayout`).
- **Imagens com dimensões fixas:** `width`/`height` explícitos (CLS = 0, ver M4).
- **Documentação viva:** se a mudança altera o comportamento descrito em um
  `REGRA.md`, `API.md` ou `FLUXOS.md`, atualize o documento **na mesma mudança**
  e renove o rodapé `Última revisão`. O `docs:gate` valida a estrutura.

## Comandos (rodar dentro de `adorable-azimuth/`, gerenciador é `pnpm`)

| Comando | O que faz |
| --- | --- |
| `pnpm dev` | servidor de desenvolvimento (localhost:4321) |
| `pnpm build` | build; o `prebuild` já roda limpeza + checks de i18n |
| `pnpm typecheck` / `pnpm check` | TypeScript / `astro check` |
| `pnpm check:i18n` | paridade de chaves pt-br ↔ en |
| `pnpm tokens:gate` · `islands:gate` · `semantics:gate` · `projects:gate` · `budget:gate` · `components:gate` · `docs:gate` | gates individuais |
| `pnpm test:e2e` | testes Playwright |

Antes de finalizar qualquer mudança: `pnpm typecheck && pnpm check:i18n` e os
gates relevantes ao que foi tocado. O CI roda todos (ver
[docs/modulos/qualidade/FLUXOS.md](adorable-azimuth/docs/modulos/qualidade/FLUXOS.md)).

## Convenções

- Idioma do código e dos docs: português (pt-BR); conteúdo do site é bilíngue.
- Componentes em PascalCase; islands interativas usam sufixo `.island.tsx`.
- Dados canônicos (perfil, projetos) vivem em `src/data/` — nunca duplicar
  esses valores em componentes ou JSON de i18n.
- Commits seguem Conventional Commits (`feat:`, `fix(i18n):`, `chore:`…).
