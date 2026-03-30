# Prompt para TRAE — Migração da Landing Híbrida para Astro

## Contexto
Este é o portfólio em Astro hospedado em victor-alcantara.vercel.app. A home atual (src/pages/index.astro e src/pages/en/index.astro) funciona como página de projetos/cliente. O objetivo é substituí-la por uma landing híbrida com bifurcação de audiência.

## O que fazer

### 1. Substituir src/pages/index.astro

Substitua o conteúdo da home atual pela landing híbrida abaixo. Preserve o componente de layout existente (provavelmente `<Layout>` ou similar) se ele já injeta `<html>`, `<head>` e fontes globais — nesse caso, remova as tags duplicadas do HTML fornecido e adapte apenas o conteúdo interno.

**HTML de referência:** `landing-hybrid.html` (arquivo na raiz do projeto ou onde for colado)

Pontos de atenção na migração:

- As fontes (Cormorant Garamond, Syne, JetBrains Mono) provavelmente já estão no layout global. Não duplique o `<link>` do Google Fonts se já existir.
- As CSS Variables (--charcoal, --amber, --gold, etc.) devem ser verificadas: se já existem no arquivo de design tokens/CSS global do projeto, use as existentes e ajuste os nomes no HTML. Se não existem, adicione ao escopo do componente via `<style>` scoped ou no global.css.
- O grain overlay (body::before com SVG de ruído) pode já existir globalmente. Evite duplicar.
- Preserve os atributos `lang` e as rotas PT/EN existentes.

### 2. Criar src/pages/en/index.astro (versão EN)

Clone a mesma estrutura, trocando apenas os textos pelo equivalente em inglês abaixo:

```
eyebrow:      "Software Engineer"
name:         "Victor de Alcântara" (manter)
title:        "Full-Stack · Offline-First · Critical Integrations"
description:  "I build web and mobile products focused on operational reliability,
               consistent field experience, and integrations that don't fail under pressure."

cta-recruiter:
  tag:        "→ Recruiters & Hiring Managers"
  headline:   "I'm looking for a role"
  sub:        "Resume, technical case studies, and full professional profile."
  arrow:      "View professional profile →"
  href:       "/en/recruiter"

cta-client:
  tag:        "→ Clients & Projects"
  headline:   "I have a project in mind"
  sub:        "Case studies, stack, approach, and direct contact for scoping."
  arrow:      "View projects →"
  href:       "/en/projects/p7/"
```

### 3. Rotas dos CTAs

| CTA | PT | EN |
|-----|----|----|
| Recrutador | /recruiter | /en/recruiter |
| Cliente | /projects/p7/ | /en/projects/p7/ |

A página /recruiter já foi criada. A /en/recruiter será criada em etapa posterior.

### 4. Nav

A nav da landing híbrida é minimalista (logo + seletor de idioma). Se o projeto tem um componente `<Nav>` compartilhado com mais itens (Projetos, Sobre, Contato), **não o use na landing**. Crie uma variante simples ou passe uma prop `minimal={true}` que oculte os links extras. A landing não deve ter navegação para /projects ou /sobre — o visitante deve escolher o caminho pelos dois CTAs.

### 5. O que NÃO alterar

- src/pages/projects/* — nenhuma alteração
- src/pages/recruiter.astro — já criado, não tocar
- Componentes globais de layout, fontes e tokens que já funcionam
- Configuração de deploy (vercel.json, astro.config.mjs)

## Critérios de aceitação

- [ ] / (PT) renderiza a landing com dois CTAs funcionais
- [ ] /en/ (EN) renderiza a versão em inglês
- [ ] Nenhum link quebrado (testar /recruiter e /projects/p7/)
- [ ] Fontes carregam sem FOUT visível
- [ ] Layout responsivo funciona em 375px (mobile) e 1280px (desktop)
- [ ] Grain overlay aparece uma vez (não duplicado)
- [ ] Animações de entrada (fadeUp) funcionam sem travamento

## Arquivos relevantes para consultar antes de editar

- src/layouts/Layout.astro (ou equivalente) — entender o que já é injetado globalmente
- src/styles/global.css (ou tokens.css) — checar variáveis CSS existentes
- src/pages/index.astro atual — entender a estrutura antes de substituir
