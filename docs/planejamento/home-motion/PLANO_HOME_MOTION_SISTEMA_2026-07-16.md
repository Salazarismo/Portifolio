# Plano mae - Home ao nivel do video de referencia (motion, profundidade e coreografia)

- **Tipo:** Indice-Mae
- **Data:** 2026-07-16
- **Status geral:** Proximo
- **Assunto:** Elevar a experiencia da home-manifesto ao patamar do video de referencia (motion shot "hübas") sem trair a estetica navy+coral nem os gates
- **Responsavel pela decisao:** Victor (dono do portfolio)
- **Fonte canonica afetada:** `adorable-azimuth/docs/modulos/design-system/`, `adorable-azimuth/docs/modulos/interatividade/`

## Resumo

O video de referencia (`original-01ba443687e9a2cf04b42856f994728a.mp4`, raiz do repo — 10s, motion shot estilo Dribbble da landing ficticia "hübas") mostra seis tecnicas que produzem a sensacao de "unico": (1) a pagina como objeto fisico (cartao com sombra sobre fundo bicolor, grain); (2) tipografia editorial gigante como protagonista e como elemento de colagem; (3) colagem em camadas com profundidade; (4) **transicao de elementos compartilhados no scroll** — as secoes se transformam uma na outra em vez de apenas passar; (5) microdetalhes coreografados (badge circular girando, sublinhado caligrafico, reveal palavra a palavra); (6) wipe organico como transicao de estado.

A home-manifesto ja entrega a metade tipografica disso (Cormorant display, word-rise, grain, glow coral, spotlight). O gap e a **coreografia de scroll e a camada de profundidade fisica**. Descoberta-chave que muda o custo do plano: GSAP + ScrollTrigger ja sao baixados em toda pagina (`GsapInit.island.tsx`, `client:load` no BaseLayout) mas estao **inertes na home** — miram `[data-cell]`/`[data-anim="hero"]` que nao existem nos partials novos. O recurso mais caro ja esta pago dentro dos 142.76KB do budget.

**Diretriz central: traduzir os principios do video, nao copiar a estetica.** A home permanece navy+coral do manifesto; o "W" gigante do video vira o numero da cicatriz como objeto de colagem; a petala vira o glow/pincel coral; o card de stats persistente vira a cicatriz assumindo o palco.

A cascata esta concluida quando as quatro camadas tecnicas (fisica/textura, coreografia GSAP, scroll-driven CSS, wipe de transicao) estiverem entregues com a sequencia completa de gates verde, e2e 7/7, reduced-motion 100% degradavel e budget ≤150KB com delta registrado.

## Estado de implementacao

| Plano | Status | Papel na cascata | Dependencias | Observacao |
| --- | --- | --- | --- | --- |
| [Plano 00 - Fisica e textura](./PLANO_HOME_MOTION_00_FISICA_TEXTURA_2026-07-16.md) | Concluido | Camada A: pagina-como-cartao, colagem da cicatriz, badge circular, sublinhado caligrafico (CSS puro, 0KB JS) | nenhuma | Entregue 2026-07-16: gates verdes, e2e 7/7, delta 0KB; aguarda aprovacao visual do Victor |
| [Plano 01 - Coreografia GSAP](./PLANO_HOME_MOTION_01_COREOGRAFIA_GSAP_2026-07-16.md) | Proximo | Camada C: reativar o GSAP inerte; pin + morph hero→cicatriz (elemento compartilhado) | Plano 00 | O diferencial do video; delta JS ~1-2KB; rollout publico travado pelo P0 dos numeros ficticios |
| [Plano 02 - Scroll-driven CSS](./PLANO_HOME_MOTION_02_SCROLL_CSS_2026-07-16.md) | Proximo | Camada B: reveals por scroll (`animation-timeline`) + parallax das camadas (0KB JS) | Plano 01 | Depois do 01 para calibrar com o pin; fallback = comportamento atual |
| [Plano 03 - Wipe de transicao](./PLANO_HOME_MOTION_03_WIPE_TRANSICOES_2026-07-16.md) | Proximo | Camada D: wipe organico coral nas View Transitions existentes (0KB JS) | Plano 00 | So CSS sobre o `NavTransitions.island.tsx` ja entregue |
| [Plano 04 - Qualidade e rollout](./PLANO_HOME_MOTION_04_QUALIDADE_ROLLOUT_2026-07-16.md) | Proximo | Gates, e2e, auditoria reduced-motion/mobile, docs vivas, decisao de rollout | Planos 00-03 | Espelha o papel do filho 09 da cascata anterior |

## Direcionamento

Ordem recomendada: **00 → 01 → 02 → 03 → 04** (A → C → B → D → qualidade). O 00 e barato e independente; o 01 e a aposta principal e destrava o GSAP morto; o 02 so se calibra depois que o pin do 01 existir (elementos dentro de area pinada mudam a geometria do scroll); o 03 e independente do 01/02 e pode adiantar se o 01 emperrar; o 04 fecha a obra.

Decisoes cravadas que nao devem ser reabertas sem novo registro:

1. **Estetica intocada.** Navy+coral do manifesto permanece. Nenhuma cor nova alem de `color-mix` sobre tokens existentes (token-gate: zero hex novo).
2. **Contratos dos e2e sao invioláveis.** `#hero-thesis` (id e texto exato), h1 unico em `main`, ancora `#em-campo` (1 link + 1 alvo), roles/labels do toggle, `#home-root[data-mode]`, classes `.hm-when-*` em `#cta`. A coreografia move e transforma; nao renomeia nem remove.
3. **Nenhuma biblioteca de animacao nova.** O plano existe para dar retorno ao GSAP ja pago. Lenis, Motion, Locomotive etc. estao vetados.
4. **Tudo degrada em reduced-motion.** Cada camada entra no bloco mestre de `home.css`; a pagina estatica continua completa e legivel.
5. **Prova antes de entregar** (lei do AGENTS.md): cada filho fecha com gates verdes e verificacao manual registrada; o delta de JS vai anotado no PR.

## Escopo consolidado

**Entra:** home PT e EN (`src/pages/index.astro`, `src/pages/en/index.astro`), partials `src/components/home/*`, `src/styles/home.css`, tokens `--home-*` em `src/styles/tokens.css`, `src/islands/GsapInit.island.tsx` + `src/lib/gsap-reveal.ts` (reativacao), CSS das View Transitions (`src/styles/transitions.css`), chaves novas de i18n estritamente necessarias (com paridade PT/EN).

**Fora:** outras paginas (recruiter, client, projects, docs) alem do efeito de wipe na navegacao; refactor das 558 violacoes legadas do token-gate; criacao de `/en/recruiter`; mudanca de copy/conteudo da home (exceto chaves novas do badge); persistencia do ModeToggle; qualquer mudanca de arquitetura de partials.

## Riscos e premissas

- **P0 humano (herdado, agora mais urgente):** os numeros da cicatriz sao FICTICIOS e `[stack principal]` segue literal na copy. O Plano 01 coloca um holofote (pin + zoom) exatamente nesse numero — dar palco a um numero inventado contradiz a tese "software para o pior dia". **O 01 pode ser implementado, mas o rollout publico da cascata fica travado ate os numeros reais entrarem no `home.json`.**
- **Pin (ScrollTrigger) × ancora `#em-campo`:** o pin altera a altura efetiva da pagina; o smooth-scroll proprio do `NavTransitions.island.tsx` calcula destino por posicao. Testar o clique no CTA do hero com o pin ativo e obrigatorio (e2e ja cobre a existencia; a verificacao manual cobre o comportamento).
- **Suporte parcial de CSS Scroll-Driven Animations** (Safari): tudo do Plano 02 vive dentro de `@supports`; o fallback e o comportamento atual (reveal no load). Nada pode depender do scroll-driven para ser legivel.
- **Performance em mobile:** grain + glow + parallax + pin acumulam custo de paint/composite. Premissa: so animar `transform`/`opacity`; auditoria manual em viewport 360px no Plano 04.
- **Budget:** folga atual ~7.2KB (142.76 de 150KB). Delta previsto total ~1-2KB (config da coreografia). Se estourar, corta-se escopo do 01, nao se sobe o teto.
- **Premissa de dados:** nenhuma. Nenhuma integracao externa, schema ou RLS envolvido.
- **Validacao humana:** direcao estetica das camadas (intensidade do parallax, forma do wipe, velocidade do badge) exige aprovacao visual do Victor antes do merge de cada filho.

## Verificacao consolidada

- Sequencia completa de gates do CI, na ordem canonica: typecheck → astro check → check:i18n → build (com prebuild) → tokens (informativo; zero violacao nova) → islands → semantics (h1 unico nos dois dist) → projects → `budget:gate` (≤150KB, delta anotado no PR) → docs.
- e2e local 7/7 (`pnpm test:e2e` com `playwright.local.config.ts`, channel chrome, dev server manual em 127.0.0.1) apos cada filho; novos testes do Plano 04 verdes.
- Auditoria manual: reduced-motion (pagina estatica completa; spotlight nem entra no DOM), viewports 360/768/1024/1440, clique na ancora `#em-campo` com pin ativo, navegacao com wipe nas rotas home → `/recruiter` e home → `/client`.
- Registro visual: screenshots antes/depois por camada no PR.

## Documentacao afetada

- `adorable-azimuth/docs/modulos/design-system/` — tokens novos (`--home-*` de profundidade/cartao), keyframes novos, regra do fundo bicolor.
- `adorable-azimuth/docs/modulos/interatividade/API.md` — `GsapInit`/`gsap-reveal` deixam de estar inertes na home (novo contrato de data-attributes); `NavTransitions` ganha o wipe.
- `adorable-azimuth/ARQUITETURA.md` (secao "Paginas — Home") — so se o markup dos partials ganhar wrappers novos.
- Nenhum ADR novo previsto; se o Plano 01 mudar a decisao "reveal e load-time, nao scroll-triggered" registrada no `home.css`, o comentario-decisao no proprio CSS e a doc de design-system devem ser atualizados juntos.
