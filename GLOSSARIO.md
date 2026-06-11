# GLOSSARIO.md — Termos oficiais do domínio

Use estes termos exatamente como definidos; eles aparecem em código, docs e gates.

| Termo | Definição |
| --- | --- |
| **Island** | Componente interativo Preact (`.tsx`) hidratado no cliente via diretiva `client:*`. Só pode existir em `src/islands/`. Tudo que não é island é HTML estático gerado por `.astro`. |
| **Gate** | Script em `scripts/` que falha o build/CI quando uma regra do repositório é violada (ex.: `islands-gate.cjs`, `token-gate.cjs`). É o mecanismo de enforcement do projeto. |
| **Namespace (i18n)** | Um arquivo JSON de traduções por área (`common`, `home`, `cards`, `projects`, `project_p3/p5/p7`). Existe em par: `src/i18n/pt-br/X.json` e `src/i18n/en/X.json`, com chaves idênticas. |
| **Paridade i18n** | Invariante de que pt-br e en têm exatamente as mesmas chaves em cada namespace. Verificada por `check-i18n.mjs`. |
| **Case study** | Página de projeto em destaque (`/projects/p3`, `p5`, `p7`) gerada a partir de `src/data/projects.ts` + namespace `project_<slug>`. |
| **Ladder** | Eixo de impacto de um projeto: `Receita`, `Custo`, `Risco`, `Tempo`, `Qualidade` ou `Experiência do usuário`. Campo tipado de `FeaturedProject`. |
| **Token (design token)** | Variável de design (cor, espaçamento, fonte) definida em `src/styles/design-tokens.json` e exposta como CSS custom property em `tokens.css`. Valores visuais hardcoded são proibidos. |
| **M2 (Islands Hygiene)** | Marco arquitetural: separação estrita estático (`.astro`) vs interativo (islands). Ver [ARQUITETURA.md](ARQUITETURA.md). |
| **M4 (LCP/CLS)** | Marco de performance: Hero como LCP controlado, dimensões fixas de imagem, fontes non-blocking. |
| **Honeypot (`hp`)** | Campo oculto do formulário de contato. Se um bot o preenche, a API responde sucesso falso (204) e descarta o envio. |
| **JS budget** | Limite de tamanho do JavaScript entregue ao navegador, monitorado por `js-budget.cjs`. |
| **Landing especializada** | Páginas `/recruiter` e `/client`, versões da home direcionadas a um público específico. |
