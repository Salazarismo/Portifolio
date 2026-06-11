# projetos — FLUXOS

## Adicionar um projeto novo (ex.: `p9`)

Ordem recomendada — cada passo tem um gate que o cobra:

1. **Dados:** adicionar o objeto em `src/data/projects.ts` com todos os campos
   (métrica, ladder, imagem com `width`/`height` e `alt`).
2. **Imagem:** colocar em `public/images/` (preferir AVIF/WebP com fallback).
3. **i18n:** criar `src/i18n/pt-br/project_p9.json` e `src/i18n/en/project_p9.json`
   com as mesmas chaves (seguir o padrão de `project_p3.json`).
4. **Páginas:** criar `src/pages/projects/p9.astro` e `src/pages/en/projects/p9.astro`
   usando `ProjectCaseRedesign.astro` (copiar de um case existente).
5. **Validar:** `pnpm check:i18n && pnpm projects:gate && pnpm build`.

## Atualizar métrica/descrição de um projeto

- Números e frases curtas → `projects.ts`.
- Texto do case → `project_<slug>.json` **nos dois locales**.
- Se a mudança alterar uma regra deste módulo, atualizar o `REGRA.md` junto.

## Remover/despublicar um projeto

1. Remover de `projects.ts`, remover as duas páginas e os dois JSON.
2. Considerar redirect da rota antiga (projeto já publicado = link externo
   possível).

---
Última revisão: 2026-06-11 — 588ffd1
