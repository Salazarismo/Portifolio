# Plano 00 - Fisica e textura (pagina-como-objeto, colagem, badge, sublinhado)

- **Tipo:** Plano-Filho
- **Plano mae:** [Plano mae - Home ao nivel do video de referencia](./PLANO_HOME_MOTION_SISTEMA_2026-07-16.md)
- **Data:** 2026-07-16
- **Status:** Concluido (aguardando aprovacao visual do Victor sobre a intensidade do cartao)
- **Assunto:** Camada A — dar corpo fisico e profundidade a home com CSS puro (0KB de JS)
- **Responsavel pela decisao:** Victor (dono do portfolio)
- **Fonte canonica afetada:** `adorable-azimuth/docs/modulos/design-system/`

## Objetivo local

Entregar as quatro tecnicas "estaticas" do video traduzidas para o manifesto navy+coral: (a) a pagina como cartao flutuando sobre fundo bicolor; (b) o numero da cicatriz como objeto de colagem em camadas; (c) o badge circular girando como CTA secundario; (d) o sublinhado/risco caligrafico animado. Tudo em CSS, delta de JS = 0KB. E a camada que muda a percepcao de "site" para "objeto desenhado" antes de qualquer coreografia.

## Contexto herdado

O video trata a pagina como um cartao claro com sombra sobre fundo bicolor com grain; usa uma letra serifada gigante como camada de colagem atras da foto; tem um badge circular "see how it's made" girando; e sublinha palavras do headline com um traco caligrafico. A home ja tem grain de filme (`body::before` em `home.css`), glow coral (`main::after`), display Cormorant e tokens de sombra/easing. Ver diretrizes 1, 2 e 4 do Indice-Mae (estetica intocada, contratos e2e, reduced-motion).

## Escopo tecnico

**Entra:**
- `adorable-azimuth/src/styles/tokens.css` — tokens novos no bloco `:root` da home: tinta do fundo-palco (via `color-mix` sobre `--home-bg`, zero hex novo), sombra do cartao (derivada de `--shadow-*` existente), raio e respiro do cartao.
- `adorable-azimuth/src/styles/home.css` — (a) fundo bicolor no `body.page-home` (duas faixas via `linear-gradient` de tokens) com o `main` virando o cartao (max-width `--container-max`, sombra, radius, grain por cima do conjunto); (b) classes de colagem `.hm-scar-*` (bloco coral deslocado atras do numero, leve rotacao, `z-index` em 2-3 camadas); (c) `@keyframes` do giro do badge e do `stroke-dashoffset` do sublinhado; (d) entradas novas no bloco mestre de reduced-motion (badge para de girar, sublinhado aparece completo).
- `adorable-azimuth/src/components/home/Cicatriz.astro` — wrappers de camada da colagem (sem tocar no `<h2>` estilizado nem no mecanismo `data-pending`).
- `adorable-azimuth/src/components/home/HeroAfirmacao.astro` — SVG inline do sublinhado caligrafico sob a palavra de acento do H1 (decorativo, `aria-hidden`, fora do texto do `#hero-thesis`) e o badge circular (SVG `<textPath>`) como elemento do CTA existente para `#em-campo` — o badge NAO cria um segundo link (o e2e exige exatamente 1 `a[href="#em-campo"]`).
- `adorable-azimuth/src/components/home/TensionSection.astro` — trocar o `line-through` estatico do titulo-demo por risco SVG animado (`stroke-dashoffset`), mantendo `text-decoration` como fallback sem SVG.
- i18n: se o badge tiver texto proprio, 1 chave nova `home.hero.badge` em `src/i18n/pt-br/home.json` + `src/i18n/en/home.json` (paridade obrigatoria).

**Fora:** qualquer JS; qualquer mudanca no texto do H1 ou na estrutura de headings; parallax (Plano 02); pin (Plano 01); paginas fora da home.

## Plano de execucao

1. Cravar os tokens novos em `tokens.css` (`--home-stage-bg`, `--home-card-shadow`, `--home-card-radius` ou nomes equivalentes na convencao `--home-*`), todos derivados por `color-mix`/aliases — validar que o token-gate nao acusa valor cru novo fora de `tokens.css`.
2. Implementar o palco bicolor + cartao em `home.css`, escopo `body.page-home`; conferir que grain e glow continuam compondo por cima do cartao e que o `--header-h`/`scroll-padding-top` da casca nao quebra.
3. Montar a colagem da cicatriz em `Cicatriz.astro` + `home.css`: bloco coral atras do numero (pseudo-elemento ou `<span>` decorativo), deslocamento e rotacao sutis via `transform`, sem tocar em `data-pending`.
4. Adicionar o badge circular no `HeroAfirmacao.astro` (SVG `textPath`, giro continuo lento via CSS) acoplado ao unico CTA `#em-campo`; texto via i18n se houver.
5. Adicionar o sublinhado caligrafico do H1 e o risco animado da TensionSection (SVG `stroke-dasharray`/`stroke-dashoffset`, disparo junto do word-rise via `animation-delay`).
6. Estender o bloco mestre de reduced-motion em `home.css` para as animacoes novas.
7. Passar as chaves novas (se houver) pelos gates `check:i18n` e `check-en-no-pt`.

## Dependencias

Nenhum Plano-Filho anterior. Depende apenas da aprovacao visual do Victor sobre a intensidade do efeito de cartao (quanto o fundo-palco aparece em 360px e um trade-off de respiro vs. largura util).

## Verificacao

- Gates: typecheck, astro check, check:i18n, build, tokens (zero violacao nova), islands, semantics, budget (delta 0KB — conferir que nada novo caiu em `dist/client/_astro/*.js`), docs.
- e2e local 7/7 — atencao ao teste "exatamente 1 `a[href='#em-campo']`" apos o badge.
- Manual: 360/768/1024/1440 (cartao nao estrangula o conteudo em mobile; se estrangular, o cartao colapsa para full-bleed abaixo de um breakpoint); reduced-motion (badge parado, sublinhado completo, risco completo); dark contrast do fundo-palco vs. cartao.

## Atualizacao do Indice-Mae

Ao concluir: status → Concluido, anotar delta de budget real, screenshots antes/depois, e registrar qualquer token novo criado (nome exato) para a doc de design-system no Plano 04. Se o cartao for descartado em mobile, registrar o breakpoint decidido.

## Registro de conclusao (2026-07-16)

- **Delta de budget: 0KB** — `budget:gate` em 142.76KB antes e depois (nada novo em `dist/client/_astro/*.js`).
- **Gates:** typecheck, astro check (0 erros), check:i18n, check-en-no-pt, build, islands, semantics, budget e docs verdes. Token-gate: 558 violacoes (baseline legado exato — **zero violacao nova**).
- **e2e local 7/7** com `playwright.local.config.ts` (channel chrome, dev server manual em 127.0.0.1) — incluindo o contrato "exatamente 1 `a[href='#em-campo']`" com o badge dentro do mesmo `<a>`.
- **Tokens novos criados** (nome exato, p/ doc de design-system no Plano 04): `--home-stage-bg`, `--home-stage-bg-2` (faixas do palco, color-mix sobre `--home-bg` + accent/ink, zero hex novo), `--home-card-shadow` (alias de `--shadow-xl`), `--home-card-radius` (alias de `--radius-2xl`), `--home-card-gap` (respiro do cartao, clamp), `--home-badge-size` (diametro do badge).
- **Cartao NAO foi descartado em mobile:** mantido em todos os viewports; o respiro colapsa naturalmente via clamp (~9px em 360px). Verificado em 360/768/1024/1440 — conteudo nao estrangula.
- **Decisoes de implementacao:** (a) palavra de acento do sublinhado = ULTIMA palavra da tese (PT "funciona." / EN "does.") — regra estavel nas duas linguas, sem chave i18n de indice; (b) badge acoplado DENTRO do unico CTA (pill migrou p/ `.hm-hero-cta__pill`, anchor virou grupo); (c) chave nova `home.hero.badge` (PT "para o pior dia" / EN "for the worst day"); (d) grain subiu p/ z-index 2 para compor por cima do cartao; (e) `vector-effect: non-scaling-stroke` foi REMOVIDO dos tracos SVG — quebra o dash normalizado por `pathLength` sob `preserveAspectRatio=none` (o traco aparecia partido em dois).
- **Reduced-motion:** badge parado, sublinhado e risco completos (`stroke-dashoffset: 0`), colagem e palco sao estaticos por natureza. Verificado com `reducedMotion: "reduce"`.
- **Screenshots "depois"** (4 viewports + reduced-motion) capturados na sessao; "antes" pode ser regerado do commit anterior para o PR.
- **Pendencia humana:** aprovacao visual do Victor sobre a intensidade do efeito (quanto palco aparece, opacidade do bloco coral da colagem, velocidade do giro de 24s do badge).
