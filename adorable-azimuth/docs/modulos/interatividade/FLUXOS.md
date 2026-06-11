# interatividade — FLUXOS

## Criar uma island nova

1. Confirmar que precisa ser island (estado/eventos/efeitos no cliente — regra 2
   do [REGRA.md](REGRA.md)).
2. Criar `src/islands/<Nome>.island.tsx` (Preact; `jsxImportSource: preact` já
   configurado no tsconfig).
3. Usar na página `.astro` com a diretiva `client:*` menos agressiva possível.
4. Registrar a island na tabela do [API.md](API.md).
5. Validar: `pnpm islands:gate && pnpm budget:gate && pnpm typecheck`.

## Fluxo de animação (reveal)

1. `BaseLayout.astro` monta `GsapInit.island.tsx`.
2. `GsapInit` registra os reveals de `src/lib/gsap-reveal.ts` (ScrollTrigger).
3. Elementos marcados recebem a animação ao entrar no viewport; sem JS, o
   conteúdo permanece visível (degradação progressiva).

## Transição de rota / toggle de idioma

- `NavTransitions.island.tsx` cuida das transições entre páginas.
- `HeaderNavSegmented.tsx` traduz a rota atual para o equivalente no outro
  locale (`/projects/p5` ↔ `/en/projects/p5`) — comportamento coberto por
  `tests/i18n.spec.ts`.

---
Última revisão: 2026-06-11 — 588ffd1
