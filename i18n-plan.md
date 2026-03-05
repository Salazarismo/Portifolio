# Plano de tradução (PT → EN) com i18n, SEO e QA

## Decisões (travadas agora, sem enrolação)

- **Localidades**: `pt-br` (default) e `en` (os nomes de pasta precisam bater com `locales`).
- **URLs**: PT no root (`/`), EN com prefixo (`/en/...`). Isso é o caso padrão com `prefixDefaultLocale: false`.
- **Sem detecção automática/redirecionamento por idioma no começo**: previsibilidade + SEO limpo. (Se quiser depois, dá.)
- **Nada de `Record<string,string>` ingênuo**: criar `t(key)` com fallback + erro em dev quando faltar chave.

## Milestone 1 — Base de i18n (1 commit)

### 1) `astro.config.mjs`

- Adicionar i18n (e `site` para URLs absolutas de hreflang/canonical):
  - `i18n.locales: ["pt-br", "en"]`
  - `i18n.defaultLocale: "pt-br"`
  - manter `routing.prefixDefaultLocale: false` (default) para PT ficar no root
  - `site: "https://victor-alcantara.vercel.app"` (ou seu domínio real)

### 2) Estrutura de arquivos de tradução

Criar:

- `src/i18n/pt-br/common.json`
- `src/i18n/pt-br/home.json`
- `src/i18n/pt-br/projects.json`
- `src/i18n/pt-br/project_p3.json`
- `src/i18n/pt-br/project_p5.json`
- `src/i18n/pt-br/project_p7.json`

Espelho em `src/i18n/en/...`.

### 3) Loader + `t()`

Criar `src/i18n/index.ts` com:

- `export type Locale = "pt-br" | "en"`
- `loadMessages(locale, namespace)` usando `import.meta.glob` (build-time, sem fetch)
- `createT(messages)` que:
  - retorna `t(key): string`
  - em dev, se faltar chave: `throw` (ou `console.error` + placeholder bem óbvio)

Objetivo: impedir “site em EN com 20 strings faltando e você não viu”.

## Milestone 2 — Rotas e páginas (sem gambiarra)

### 4) Pastas em `src/pages`

- PT continua onde já está:
  - `src/pages/index.astro`
  - `src/pages/projects/p3.astro` etc.

- EN com espelhos mínimos:
  - `src/pages/en/index.astro`
  - `src/pages/en/projects/p3.astro` etc.

Regra do Astro: as pastas localizadas devem bater com `locales` (ex.: `/en/`).

Se quiser reduzir duplicação depois: dá para migrar para um padrão com `[locale]` + `getStaticPaths`, mas não é o primeiro passo se a prioridade é velocidade com baixo risco.

## Milestone 3 — Layout + links corretos (o ponto que quase todo mundo erra)

### 5) `BaseLayout` recebe locale e injeta SEO básico

No layout:

- `<html lang="pt-BR">` quando `locale === "pt-br"`, `<html lang="en">` quando `en`
- gerar `canonical` e `hreflang` com helpers do `astro:i18n` (não no “string replace”)

Helpers a usar:

- `getLocaleByPath()` para descobrir a locale pela URL
- `getPathByLocale()` / `getRelativeLocaleUrl()` para montar a URL equivalente
- `getAbsoluteLocaleUrlList()` para gerar todas as alternates (melhor do que hardcode)

### 6) Toggle PT/EN no `Header` (sem JS, só link)

O toggle deve:

- pegar o path atual
- computar a URL equivalente na outra locale via helper
- renderizar `<a href="...">PT</a>` / `<a href="...">EN</a>`

Isso evita bug clássico com `base`, `trailingSlash`, build format etc. (os helpers existem exatamente pra isso).

## Milestone 4 — Refactor de strings (primeiro as críticas)

### 7) Ordem de ataque

- Header, Footer, Home Hero
- Cards de projetos na Home
- Cases `p7`, `p3`, `p5` (Hero, TL;DR, Snapshot, CTA)
- Resto

### 8) Regra de refactor

- Não mexer em markup.
- Trocar literal por `t("home.hero.title")`.

## Milestone 5 — Guardrails que evitam regressão

### 9) Script de verificação de chaves

Criar `scripts/check-i18n.mjs` que:

- carrega todos os JSON de `pt-br`
- garante que `en` tem as mesmas chaves
- falha o CI se faltar algo

Esse script elimina a maior parte do risco de “EN incompleto”.

### 10) Testes mínimos (Playwright)

- Abrir `/` e `/en/`
- Validar presença de 3 textos críticos (Hero title, CTA, 1 card)
- Testar toggle PT/EN mantendo o path equivalente

## SEO multilíngue (feito do jeito certo)

- `hreflang` e `canonical` por página (auto-gerados)
- Se usar `getAbsoluteLocaleUrlList`, configurar `site` no Astro senão sai URL quebrada
- Evitar redirecionar automaticamente com base em idioma no começo (crawlers + rastreabilidade)
