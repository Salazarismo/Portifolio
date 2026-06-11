# projetos — REGRA

Os case studies são o conteúdo central do portfólio. A fonte da verdade é o
array tipado `featuredProjects` em `src/data/projects.ts`; as páginas em
`src/pages/projects/` (e espelho `en/`) renderizam esse dado + o namespace
i18n `project_<slug>`.

## O que é um case study

Um projeto em destaque com: problema resolvido, papel exercido, **uma métrica
de impacto concreta** e um eixo de impacto (*ladder*). Projetos atuais: `p3`
(Habit Analyzer), `p5` (Relatório Rural), `p7` (Plataforma-Ingressos-WhatsApp).

## Regras

1. **Métrica obrigatória e honesta:** todo projeto declara `metric` e
   `impactLine` com número verificável (ex.: "−40% custo de leitura"). Sem
   métrica, o projeto não entra no destaque.
2. **Ladder fechado:** `ladder` é um dos seis valores tipados (`Receita`,
   `Custo`, `Risco`, `Tempo`, `Qualidade`, `Experiência do usuário`). Não
   inventar eixo novo sem alterar o tipo conscientemente.
3. **Imagem com dimensões fixas:** `image.width`/`image.height` obrigatórios
   (CLS = 0, regra M4). `alt` descritivo obrigatório.
4. **Slug curto e estável** (`p<numero>`): nomeia a rota (`/projects/<slug>`),
   o namespace i18n (`project_<slug>`) e os arquivos de página. Nunca renomear
   slug publicado sem redirect.
5. **Sem duplicação:** nome, descrição e métricas vivem só em `projects.ts`;
   o texto longo do case vive só no namespace i18n.

`scripts/projects-gate.cjs` valida os metadados no CI.

## Impactos cruzados

- [i18n](../i18n/REGRA.md): cada projeto exige par de namespaces pt-br/en.
- [design-system](../design-system/REGRA.md): o template visual é
  `src/components/ProjectCaseRedesign.astro`.
- [interatividade](../interatividade/REGRA.md): a grade da home é
  `PortfolioGrid.island.tsx`.

---
Última revisão: 2026-06-11 — 588ffd1
