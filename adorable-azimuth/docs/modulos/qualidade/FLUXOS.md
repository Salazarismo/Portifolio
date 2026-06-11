# qualidade — FLUXOS

## Pipeline de CI (`.github/workflows/ci.yml` na **raiz do repo**, push/PR em `main`)

Todos os steps rodam com `working-directory: adorable-azimuth`:

0. `pnpm install --frozen-lockfile`.
1. `pnpm typecheck` — TypeScript sem emissão.
2. `pnpm check` — `astro check`.
3. `pnpm check:i18n` — paridade pt-br ↔ en.
4. `pnpm build` — o `prebuild` roda antes: limpa `.vercel/output`,
   re-checa i18n e ausência de PT em `/en`.
5. Gates pós-build: tokens (informativo, não bloqueia) → islands → semantics →
   projects → js-budget → docs.

## Checklist local antes de commitar

```sh
pnpm typecheck && pnpm check:i18n
# + os gates da área tocada, ex.:
pnpm islands:gate   # mexeu em islands
pnpm tokens:gate    # mexeu em estilos
pnpm projects:gate  # mexeu em projects.ts
pnpm docs:gate      # mexeu em docs
```

## Adicionar um gate novo

1. Criar `scripts/<nome>-gate.cjs` seguindo o padrão dos existentes
   (coletar violações → listar no stderr → `process.exit(1)`).
2. Adicionar script no `package.json` (`"<nome>:gate": "node scripts/..."`).
3. Adicionar step no `ci.yml`.
4. Registrar na tabela do [REGRA.md](REGRA.md).

---
Última revisão: 2026-06-11 — 588ffd1
