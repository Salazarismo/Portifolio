# Plano 01 - Coreografia de elemento compartilhado (reativar o GSAP inerte)

- **Tipo:** Plano-Filho
- **Plano mae:** [Plano mae - Home ao nivel do video de referencia](./PLANO_HOME_MOTION_SISTEMA_2026-07-16.md)
- **Data:** 2026-07-16
- **Status:** Concluido (aguardando aprovacao visual do Victor; rollout publico travado pelo P0)
- **Assunto:** Camada C — transicao hero→cicatriz com pin + morph via ScrollTrigger, dando retorno ao GSAP ja pago
- **Responsavel pela decisao:** Victor (dono do portfolio)
- **Fonte canonica afetada:** `adorable-azimuth/docs/modulos/interatividade/`

## Objetivo local

Implementar a assinatura do video: as duas primeiras secoes **se transformam uma na outra** em vez de rolar. Ao sair do hero, a tese encolhe/sobe cedendo o palco enquanto o numero da cicatriz cresce e assume — o equivalente do card de stats persistindo e o headline fazendo crossfade no video. Uma unica transicao bem-feita entre hero e cicatriz entrega ~80% da sensacao do video. Este filho tambem elimina uma divida: GSAP+ScrollTrigger sao baixados em toda pagina e hoje nao fazem NADA na home (custo sem retorno).

## Contexto herdado

`src/islands/GsapInit.island.tsx` (`client:load` no BaseLayout) importa GSAP `^3.12.5` + ScrollTrigger dinamicamente e delega a `src/lib/gsap-reveal.ts`, que mira `[data-cell]`/`[data-anim="hero"]` — seletores que nao existem nos partials da home-manifesto. O reveal atual da home e 100% CSS no load (decisao registrada em `home.css` ~488-496 por js-budget). O smooth-scroll da ancora `#em-campo` e implementacao propria em `NavTransitions.island.tsx` (rAF + easeInOutCubic). Riscos herdados do Indice-Mae: pin × ancora, budget (folga ~7.2KB), e o P0 dos numeros ficticios que trava o rollout publico deste filho.

## Escopo tecnico

**Entra:**
- `adorable-azimuth/src/lib/gsap-reveal.ts` — novo modulo/funcao de coreografia da home, dirigido por data-attributes novos (proposta: `[data-home-stage]` no wrapper pinado, `[data-home-actor="thesis"|"scar"]` nos elementos coreografados). Timeline com `scrub` suave: pin da dobra do hero; tese anima `scale/opacity/y` para fora; colagem da cicatriz (do Plano 00) anima de "coadjuvante" para "palco". So `transform`/`opacity`.
- `adorable-azimuth/src/islands/GsapInit.island.tsx` — passa a reconhecer a home (ex.: presenca de `#home-root`) e registrar a coreografia; `gsap.matchMedia()` com guarda `prefers-reduced-motion: no-preference` (reduced-motion = zero ScrollTrigger, layout estatico intacto).
- `adorable-azimuth/src/components/home/HeroAfirmacao.astro` e `Cicatriz.astro` — apenas data-attributes e, se necessario, um wrapper `<div data-home-stage>` em `index.astro`/`en/index.astro` (fora do `<h1>`; `#hero-thesis` intocado).
- `adorable-azimuth/src/styles/home.css` — ajustes de empilhamento/altura que o pin exigir.

**Fora:** qualquer lib nova (vetado pelo mae); coreografia das secoes 3-5 (tensao/em-campo/CTA seguem com reveal simples — escopo minimo primeiro); mudanca no texto/markup contratual; parallax fino (Plano 02).

## Plano de execucao

1. Prototipo isolado primeiro (branch): pin + morph hero→cicatriz com valores chutados, para aprovacao visual do Victor antes de polir — a aposta e validada barata.
2. Definir o contrato de data-attributes e documenta-lo em comentario no `gsap-reveal.ts` (sera copiado para `interatividade/API.md` no Plano 04).
3. Implementar a timeline com `scrub` + pin; calibrar duracao do pin (proposta: 100vh de scroll para a transicao completa) e easing com os tokens de referencia (`--ease-emphasized`).
4. Guardas: `gsap.matchMedia()` para reduced-motion e para viewport estreito se o pin nao couber em 360px (decidir com o Victor: pin so ≥768px e cross-fade simples abaixo, ou pin universal).
5. Regressao da ancora: com o pin ativo, clicar o CTA `#em-campo` deve aterrissar na secao certa (o pin adiciona altura de scroll; validar o calculo do smooth-scroll proprio do `NavTransitions` e corrigir por `scroll-margin`/offset se necessario).
6. Medir o delta de JS (`pnpm budget:gate`) e registrar; teto interno deste filho: +2KB.
7. Atualizar o comentario-decisao em `home.css` (~488-496): a decisao "reveal e load-time" ganha a excecao registrada "coreografia hero→cicatriz e scroll-driven via GSAP ja amortizado".

## Dependencias

- Plano 00 concluido (a colagem da cicatriz e o ator da coreografia).
- Aprovacao visual do prototipo pelo Victor (etapa 1) antes das etapas 3-7.
- **Rollout publico** (nao a implementacao) depende do P0: numeros reais da cicatriz no `home.json` PT+EN e remocao do literal `[stack principal]`/`[main stack]`.

## Verificacao

- Gates completos com atencao ao `budget:gate` (delta anotado no PR) e `islands` (codigo novo so em `src/islands/`/`src/lib/`).
- e2e local 7/7 — em especial: h1 unico, texto exato de `#hero-thesis`, ancora `#em-campo` funcional.
- Manual: scroll completo da home em 360/768/1024/1440 com pin ativo; clique na ancora com e sem pin ja iniciado; reduced-motion (nenhum pin, nenhum ScrollTrigger registrado — conferir via devtools); teclado (tab order nao muda com o pin); performance (sem jank visivel — só transform/opacity, conferir camadas no painel de rendering).

## Atualizacao do Indice-Mae

Ao concluir: status → Concluido com o delta de JS real; registrar a decisao tomada para mobile (pin universal ou ≥768px); registrar se a etapa 5 exigiu mudanca no `NavTransitions` (isso amplia a fonte canonica afetada); reafirmar no mae que o rollout segue travado ate o P0 fechar, se ainda estiver aberto.

## Registro de conclusao (2026-07-16)

- **Delta de JS: +0.93KB** — `budget:gate` 142.76KB → 143.69KB (teto interno era +2KB; folga do orcamento: 6.31KB de 150KB).
- **Arquitetura do pin (decisao central):** `pinSpacing: false` — o hero fica fixado enquanto a cicatriz viaja ~100vh (rodape→topo do viewport) POR CIMA dele. A altura do documento NAO muda, o que elimina na raiz o risco "pin × ancora": o calculo do smooth-scroll do `NavTransitions` permanece correto **sem nenhuma mudanca** (etapa 5 verificada por teste automatizado: aterrissagem em `#em-campo` com pin ativo a <120px do topo). Fonte canonica NAO ampliada.
- **Contrato de data-attributes** (documentado em `src/lib/gsap-reveal.ts`, copiar p/ `interatividade/API.md` no Plano 04): `[data-home-stage]` = dobra pinada (a section do hero); `[data-home-actor="thesis"]` = quem cede o palco (hoje o mesmo elemento do stage); `[data-home-actor="scar"]` = colagem que assume (trigger = `closest('section')` do ator). Atributos fora do `<h1>`; `#hero-thesis` intocado; nenhum wrapper novo em `index.astro` foi necessario.
- **Timeline:** unico ScrollTrigger com `scrub: 0.8`, `start/end` com `clamp()` (nao nasce "no meio" quando a cicatriz ja esta perto da dobra no load). Tese sai cedo (autoAlpha/scale 0.94/yPercent -10 em 0→0.45) para nao cruzar texto com texto; colagem faz 0.85→1 de scale chegando em identidade exatamente no unpin (zero salto visual). So transform/opacity. `ScrollTrigger.refresh()` apos `document.fonts.ready` (Cormorant muda a altura do hero pos-hidratacao).
- **Decisao mobile: pin so ≥48em (768px)** — guarda unica `gsap.matchMedia('(prefers-reduced-motion: no-preference) and (min-width: 48em)')`. Abaixo de 48em e em reduced-motion: zero ScrollTrigger, layout estatico e reveal CSS de load intactos (verificado: 0 pin-spacer, hero `position: static`).
- **CSS (home.css):** (a) `.hm-hero` ganhou `min-height` da dobra + `justify-content: center` em ≥48em (palco do pin); (b) `.hm-scar` ganhou `position: relative; z-index: 2` (vence o stacking do elemento pinado; inocuo sem pin); (c) comentario-decisao do reveal ganhou a EXCECAO registrada (coreografia hero→cicatriz e scroll-driven via GSAP ja amortizado).
- **GsapInit** agora bifurca por `#home-root`: home → `initHomeChoreography()`; demais paginas → reveal legado `[data-cell]`/`[data-anim="hero"]` (inalterado).
- **Gates:** typecheck, astro check (0 erros), check:i18n, build, tokens (558 = baseline legado exato, zero violacao nova), islands, semantics, projects, budget e docs verdes. **e2e local 7/7** (`playwright.local.config.ts`, channel chrome, dev server manual em 127.0.0.1).
- **Verificacao automatizada extra (spec temporario, nao commitado):** pin+morph em 1440 (hero `fixed`, tese some, colagem chega em scale 1), ancora com pin ativo, reduced-motion (0 pin-spacer), 360px (0 pin-spacer), EN 1024 (coreografia ativa). Gotcha de ambiente: `test.use({ reducedMotion })` nao aplica no channel chrome desta maquina — usar `page.emulateMedia({ reducedMotion: 'reduce' })` antes do `goto`.
- **Pendencias humanas:** aprovacao visual do Victor (valores de scale/y/scrub e a decisao mobile sao provisorios ate la); P0 dos numeros ficticios segue aberto — **rollout publico continua travado**. Verificacao manual de teclado/jank em maquina real recomendada no Plano 04.
