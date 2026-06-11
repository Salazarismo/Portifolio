# ARQUITETURA.md — Visão macro

Portfólio técnico em Astro 5 com adapter Vercel, em modo **híbrido**:
`output: 'server'`, mas todas as páginas declaram `export const prerender =
true` e são geradas como HTML estático no build; só `/api/contact` roda
on-demand. Todo o código vive em `adorable-azimuth/`.

Regra: página nova **deve** declarar `prerender = true` — além de servir
estático pela CDN, é isso que dá material real aos gates de HTML
(`semantics-gate`, `components-standard-gate`).

## Stack

- **Astro 5** — roteamento por arquivos, SSR, view transitions.
- **Preact** — apenas para componentes interativos (islands), via `@astrojs/preact`.
- **Tailwind CSS 4** (plugin Vite) + CSS modular próprio com design tokens.
- **GSAP** — animações de reveal e morphing.
- **Zod** — validação do endpoint de contato.
- **Playwright** — testes e2e de i18n e layout.
- **Vercel** — deploy; o endpoint de contato roda como function.

## Roteamento e i18n

- Locale padrão `pt-br` **sem prefixo**: `/`, `/projects/p3`, `/recruiter`, `/client`.
- Inglês sob prefixo `/en`: `/en/`, `/en/projects/p3`, …
- Configurado em `astro.config.mjs` (`i18n.routing.prefixDefaultLocale: false`).
- Strings vêm de JSON por namespace em `src/i18n/{locale}/`; detalhes no módulo
  [i18n](adorable-azimuth/docs/modulos/i18n/REGRA.md).

## Decisão estrutural M2 — Islands Hygiene

A separação estático/interativo é a regra arquitetural central:

- `.astro` (`src/components/`) = apresentação estática pura, sem efeitos.
- `.tsx` = **somente** em `src/islands/`, hidratado nas páginas via diretivas
  `client:*`. Proibido `.tsx` fora dali (verificado por `islands-gate.cjs`).

Isso mantém o JS enviado ao navegador mínimo e auditável (`js-budget.cjs`).

## Decisão de performance M4 — LCP/CLS controlados

- LCP é o Hero: `<picture>` com AVIF/WebP, `fetchpriority="high"`, `loading="eager"`.
- Toda imagem declara `width`/`height` → CLS = 0.
- Fontes do sistema via tokens (`--font-family-sans`); se entrarem webfonts
  self-hosted, usar `@font-face` com `font-display: swap`.
- Relatório original: `adorable-azimuth/docs/m4-relatorio.md` (histórico).

## Mapa de pastas (resumo)

```
(raiz)
├── .github/workflows/ci.yml   # CI (roda com working-directory: adorable-azimuth)
├── package.json               # shim de deploy: build delega a adorable-azimuth
├── scripts/copy-vercel-output.mjs  # copia .vercel/output para a raiz (Vercel)
└── adorable-azimuth/
    ├── src/
    │   ├── pages/        # rotas (pt na raiz, en/ espelhado, api/contact.ts)
    │   ├── components/   # .astro estáticos (cards/, typography/, ui/, data/, ux/)
    │   ├── islands/      # .tsx interativos — único lugar permitido
    │   ├── data/         # fonte da verdade: profile.ts, projects.ts
    │   ├── i18n/         # loader + JSON por locale/namespace
    │   ├── styles/       # tokens + CSS modular
    │   └── lib/          # helpers (gsap-reveal.ts)
    ├── scripts/          # gates de qualidade (CI)
    ├── tests/            # Playwright
    └── docs/modulos/     # documentação viva por módulo (Camada 2)
```

## Deploy (Vercel)

A Vercel builda a partir da **raiz**: o `package.json` da raiz instala e builda
`adorable-azimuth` e `scripts/copy-vercel-output.mjs` copia `.vercel/output`
para a raiz (`vercel.json` aponta para lá). Mudanças de build precisam manter
esse shim funcionando.

## Pipeline de qualidade

CI (push/PR em `main`): typecheck → `astro check` → paridade i18n → build
(prebuild limpa output e re-checa i18n + ausência de PT em `/en`) → gates de
tokens (informativo, dívida documentada), islands, semântica, projetos, budget
de JS e documentação. Detalhes no módulo
[qualidade](adorable-azimuth/docs/modulos/qualidade/REGRA.md).

---
Última revisão: 2026-06-11 — 588ffd1
