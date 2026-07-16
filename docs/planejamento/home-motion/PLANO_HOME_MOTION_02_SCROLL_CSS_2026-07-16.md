# Plano 02 - Scroll-driven CSS (reveals por scroll + parallax das camadas)

- **Tipo:** Plano-Filho
- **Plano mae:** [Plano mae - Home ao nivel do video de referencia](./PLANO_HOME_MOTION_SISTEMA_2026-07-16.md)
- **Data:** 2026-07-16
- **Status:** Proximo
- **Assunto:** Camada B — migrar reveals de load-time para scroll com CSS Scroll-Driven Animations e dar parallax sutil a colagem (0KB JS)
- **Responsavel pela decisao:** Victor (dono do portfolio)
- **Fonte canonica afetada:** `adorable-azimuth/docs/modulos/design-system/`

## Objetivo local

Hoje todo `[data-reveal]` dispara no load: quem abre a pagina e rola depois de 2s encontra as secoes de baixo ja "prontas", sem vida. Este filho faz cada secao entrar quando entra no viewport — e da as camadas da colagem da cicatriz (Plano 00) velocidades levemente diferentes (parallax), que e o que produz a profundidade do video. Tudo com `animation-timeline: view()` dentro de `@supports`, sem um byte de JS: onde o navegador nao suporta (Safari), o comportamento atual (load-time) permanece como fallback integral.

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
5. Testar o fallback explicitamente: forcar navegador sem suporte (ou desligar a feature) e confirmar que a home fica identica a de hoje.
6. Registrar a excecao na decisao "reveal e load-time" (mesmo comentario de `home.css` tocado pelo 01).

## Dependencias

- Plano 01 concluido (a geometria do pin define a fronteira load-time/view-time).
- Plano 00 concluido (as camadas da colagem sao o alvo do parallax).

## Verificacao

- Gates completos; `budget:gate` com delta 0KB obrigatorio (qualquer delta aqui e sinal de que JS vazou para o escopo errado).
- e2e local 7/7 (nenhum contrato tocado — verificacao de regressao).
- Manual: Chrome (suporte pleno) — reveals disparam por secao ao rolar, parallax perceptivel mas sutil; navegador sem suporte — identico ao estado pre-filho; reduced-motion — tudo estatico; 360px — parallax nao causa overflow horizontal.

## Atualizacao do Indice-Mae

Ao concluir: status → Concluido; registrar os `animation-range` finais escolhidos e a lista de secoes migradas; anotar qualquer ajuste de fronteira feito por causa do pin (interessa a manutencao futura do 01).
