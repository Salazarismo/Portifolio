# projetos — API

## Estrutura de dados (`src/data/projects.ts`)

```ts
type FeaturedProject = {
  slug: string;          // "p3" | "p5" | "p7" — nomeia rota e namespace i18n
  name: string;
  description: string;   // 1–2 frases, foco no problema resolvido
  impactLine: string;    // resultado em uma linha, com número
  ladder: "Receita" | "Custo" | "Risco" | "Tempo" | "Qualidade" | "Experiência do usuário";
  role: string;          // ex.: "Full-stack", "Mobile + UX"
  metric: { label: string; value: string };  // ex.: { label: "Latência", value: "−40%" }
  year: string;
  href: string;          // rota relativa pt-br, ex.: "/projects/p7"
  image: { src: string; alt: string; width: number; height: number };
};

export const featuredProjects: FeaturedProject[];
```

## Consumidores

- `PortfolioGrid.island.tsx` — grade de projetos na home.
- Páginas `src/pages/projects/<slug>.astro` e `src/pages/en/projects/<slug>.astro`
  — case study completo via `ProjectCaseRedesign.astro`.
- `scripts/projects-gate.cjs` — validação de slugs, imagens e campos no CI.

O conteúdo textual longo de cada case (TL;DR, abordagem, etc.) **não** fica
aqui: vive em `src/i18n/{locale}/project_<slug>.json`.

---
Última revisão: 2026-06-11 — 588ffd1
