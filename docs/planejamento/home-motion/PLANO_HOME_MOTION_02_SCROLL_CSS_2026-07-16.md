# Plano 02 - Scroll-driven CSS (reveals por scroll + parallax das camadas)

- **Tipo:** Plano-Filho
- **Plano mae:** [Plano mae - Home ao nivel do video de referencia](./PLANO_HOME_MOTION_SISTEMA_2026-07-16.md)
- **Data:** 2026-07-16
- **Status:** Concluido (aguardando aprovacao visual do Victor sobre a intensidade do parallax)
- **Assunto:** Camada B — migrar reveals de load-time para scroll com CSS Scroll-Driven Animations e dar parallax sutil a colagem (0KB JS)
- **Responsavel pela decisao:** Victor (dono do portfolio)
- **Fonte canonica afetada:** `adorable-azimuth/docs/modulos/design-system/`

## Objetivo local

Hoje a regra `[data-reveal]` dispara no load; antes deste filho, so a cicatriz
estava marcada e as secoes seguintes eram estaticas. Este filho torna a
estrategia explicita, faz cada secao abaixo da dobra entrar no viewport e da as
camadas da colagem da cicatriz (Plano 00) velocidades levemente diferentes
(parallax), que e o que produz a profundidade do video. Tudo com
`animation-timeline: view()` dentro de um feature gate completo, sem um byte de
JS: navegadores sem suporte preservam conteudo/layout e executam os novos
marcadores pelo fallback load-time.

## Contexto herdado

O mecanismo `[data-reveal]` + `--reveal-index` × `--home-reveal-step` (90ms) vive em `home.css` (entregue pelo filho 08 da cascata anterior); os keyframes canonicos sao `homeFadeUp`/`homeFadeIn`/`homeWordRise`. A decisao original "nao scroll-triggered" foi tomada por js-budget — CSS scroll-driven anula essa razao, mas a excecao deve ser registrada no mesmo comentario-decisao (ver etapa 7 do Plano 01). Risco herdado: interacao com o pin do Plano 01 — elementos dentro de area pinada tem geometria de viewport alterada, por isso este filho vem DEPOIS do 01.

## Escopo tecnico

**Entra:**
- `adorable-azimuth/src/styles/home.css` — bloco `@supports (animation-timeline: view())`: (a) `[data-reveal]` passa a `animation-timeline: view()` com `animation-range` (proposta: `entry 0% entry 60%`) nas secoes abaixo da dobra (tensao, em-campo, CTA — hero e cicatriz sao territorio do pin do 01); (b) parallax das camadas da colagem: bloco coral e numero com `animation-range`/keyframes de `translateY` distintos; (c) manter fora do `@supports` o comportamento atual intacto.
- `adorable-azimuth/src/components/home/*.astro` — nenhuma mudanca estrutural prevista; no maximo `data-reveal` em elementos que ainda nao o tenham.
- Bloco mestre de reduced-motion — as animacoes scroll-driven tambem sao desligadas la (ja cobre `animation`; conferir que cobre as novas).

**Fora:** JS de qualquer especie (se algo exigir JS, volta para o escopo do Plano 01 ou e cortado); scroll-snap; mudanca no mecanismo de stagger do hero (word-rise continua load-time — o hero esta visivel no load por definicao); polyfills.

## Plano de execucao

1. Mapear quais `[data-reveal]` ficam load-time (hero, cicatriz — area do pin) e quais migram para view-time (tensao, em-campo, CTA, contato).
2. Escrever o bloco `@supports` com `animation-timeline: view()` + `animation-range`, reusando os keyframes canonicos existentes (nao criar keyframes duplicados).
3. Implementar o parallax das camadas da colagem com deslocamentos pequenos (proposta: ±0.5em, tokens de spacing — token-gate proibe px cru).
4. Conferir a convivencia com o pin do 01: dentro da area pinada nada usa `view()`; se houver conflito visual na fronteira hero/cicatriz→tensao, ajustar `animation-range`.
5. Testar o fallback explicitamente: forcar navegador sem suporte (ou desligar
   a feature) e confirmar mesmo conteudo/layout, reveals completos no load e
   ausencia de parallax.
6. Registrar a excecao na decisao "reveal e load-time" (mesmo comentario de `home.css` tocado pelo 01).

## Dependencias

- Plano 01 concluido (a geometria do pin define a fronteira load-time/view-time).
- Plano 00 concluido (as camadas da colagem sao o alvo do parallax).

## Verificacao

- Gates completos; `budget:gate` com delta 0KB obrigatorio (qualquer delta aqui e sinal de que JS vazou para o escopo errado).
- e2e local 7/7 (nenhum contrato tocado — verificacao de regressao).
- Manual: Chrome (suporte pleno) — reveals disparam por secao ao rolar,
  parallax perceptivel mas sutil; navegador sem suporte — mesmo conteudo/layout,
  reveal load-time e nenhum parallax; reduced-motion — tudo estatico; 360px —
  parallax nao causa overflow horizontal.

## Atualizacao do Indice-Mae

Ao concluir: status → Concluido; registrar os `animation-range` finais escolhidos e a lista de secoes migradas; anotar qualquer ajuste de fronteira feito por causa do pin (interessa a manutencao futura do 01).

## Registro de conclusao (2026-07-16)

- **Modelo explicito de reveal:** `data-reveal` deixou de ser booleano na home.
  `data-reveal="load"` marca a cicatriz (territorio do pin); `data-reveal="view"`
  marca tensao (`#tensao`), em-campo (`#em-campo`) e CTA+contato (`#cta`).
  Hero permanece na coreografia propria `homeWordRise`/GSAP e nao entra no
  seletor de view timeline.
- **Range final dos reveals:** `entry 0% entry 60%`, com
  `animation-duration: auto`, `animation-delay: 0s` e o keyframe canonico
  `homeFadeUp`. O feature gate exige timeline, named range e duracao `auto`;
  suporte parcial tambem cai na regra load-time original, o fallback integral.
- **Range final do parallax:** a secao `.hm-scar` publica a view timeline
  `--home-scar-progress`; bloco coral e figura percorrem
  `entry 0% exit 100%`. O bloco usa amplitude `-var(--space-2)` →
  `var(--space-2)` e o numero faz o contramovimento
  `var(--space-1)` → `-var(--space-1)`. A propriedade individual `translate`
  preserva o `rotate()` das camadas e o `transform` GSAP da colagem-pai.
- **Ajuste de fronteira exigido pelo pin/cartao:** `main#main` usava
  `overflow: hidden`; isso o tornava o scroll container mais proximo e fazia
  `view()` terminar imediatamente, porque o proprio `main` nao rola. A cascata
  agora declara `hidden` como fallback e `overflow: clip` em seguida: o raio do
  cartao continua recortando a colagem, mas a timeline volta a acompanhar o
  viewport. Hero segue sendo o unico elemento pinado; nenhum reveal `view()`
  entrou nele ou na cicatriz.
- **Reduced motion:** o bloco mestre desliga os reveals e os dois keyframes de
  parallax, restaura `opacity: 1` e `translate: none`. Verificado com media
  emulada: quatro secoes visiveis, zero animacao, zero pin spacer e hero
  `position: static`.
- **Fallback sem suporte:** verificado no build estatico removendo o feature
  block da resposta CSS antes do parse. As quatro secoes terminaram visiveis
  em `timeline: auto`; bloco e numero ficaram com `animation: none` e
  `translate: none`.
- **Performance e mobile:** delta de JS **0KB**; `budget:gate` permaneceu em
  **143.69KB / 150KB**. Em 360px, reveals e parallax acompanharam o scroll,
  sem pin e com overflow horizontal igual a zero.
- **Qualidade:** typecheck; Astro check (0 erros); i18n; build; islands;
  semantics; projects; components; budget e docs verdes. Token gate manteve as
  558 violacoes legadas, sem ocorrencia nova nos arquivos deste plano. E2E
  local **7/7** no Chrome.
- **Evidencias:** `evidencias/plano-02/home-1440-top.png`,
  `home-1440-tensao.png`, `home-360-tensao.png` e
  `home-reduced-tensao.png`.
- **Pendencia humana:** a implementacao esta fechada; a intensidade final do
  parallax ainda precisa da aprovacao visual do Victor antes do merge. O P0 dos
  numeros ficticios herdado do Plano 01 continua bloqueando o rollout publico.
