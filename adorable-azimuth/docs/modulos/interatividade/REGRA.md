# interatividade — REGRA

Tudo que roda JavaScript no navegador: islands Preact e animações GSAP.
Governado pela regra arquitetural M2 (Islands Hygiene).

## Regras

1. **`.tsx` só em `src/islands/`** — verificado por `scripts/islands-gate.cjs`.
   Qualquer `.tsx` fora dali quebra o CI.
2. **Island só quando necessário:** um componente vira island apenas se exige
   estado, eventos ou efeitos no cliente. Se dá para resolver com HTML/CSS em
   `.astro`, não é island.
3. **JS tem orçamento:** o tamanho total de JS entregue é monitorado por
   `scripts/js-budget.cjs`. Island nova = custo; justifique-a.
4. **Hidratação explícita:** islands entram nas páginas `.astro` via diretivas
   `client:*` (preferir `client:visible`/`client:idle` quando a interação não
   é imediata).
5. **Convenção de nome:** islands de página usam sufixo `.island.tsx`
   (`ContactForm.island.tsx`); helpers interativos menores podem ser `.tsx`
   simples, mas sempre dentro de `src/islands/`.
6. **Animações degradam bem:** reveals GSAP não podem esconder conteúdo se o
   JS falhar (conteúdo visível por padrão, animação é progressiva).

## Impactos cruzados

- [design-system](../design-system/REGRA.md): `BaseLayout.astro` inicializa o
  GSAP global (`GsapInit.island.tsx`).
- [contato](../contato/REGRA.md): `ContactForm.island.tsx` é a island mais
  complexa (estado de submissão + chamada à API).
- [qualidade](../qualidade/REGRA.md): islands-gate e js-budget rodam no CI.

---
Última revisão: 2026-06-11 — 588ffd1
