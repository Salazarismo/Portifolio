# 08. Estilo, Tokens e Animação (transversal)

> Define o sistema visual da nova home — paleta tokenizada, escala de display, casca da `body.page-home` (fundo/ruído/glow), keyframes canônicos e o bloco mestre de `prefers-reduced-motion` — e crava a **invariante de hierarquia** da Seção 6 da autópsia: o `<h1>` (tese) é o maior tipo da página em **todo** breakpoint, e o número da cicatriz cresce sem nunca ultrapassá-lo. Serve a lei do AGENTS.md *"Tenha opinião de design. Crave."* somada a *"Erros e bordas não são depois"* (a invariante de tamanho é provada, não torcida).

## 1. Objetivo

Entregar a camada transversal de estilo que os blocos 02–06 consomem: (1) o conjunto de **tokens** da home (cor, tipografia, espaçamento e escala de display fluida) com nomes exatos em `tokens.css`; (2) o **arquivo temático** `src/styles/home.css`, escopado em `body.page-home`, onde a casca + os primitivos de animação vivem e onde cada filho cola suas regras de seção; (3) a tradução da **HIERARQUIA da Seção 6** em regras concretas — o que cresce (H1 tese, número da cicatriz) e o que encolhe/some (nome, ®, adjetivos nus); (4) as **animações** reaproveitadas (`word-rise`, `reveal`, `spotlight`) e o bloco único de `prefers-reduced-motion`; (5) o tratamento de **ruído/textura** de fundo. Governa este filho a lei *"O mais simples que resolve vence"* (reaproveita keyframes e o ruído que o `HomeHybridLanding` já tinha, em vez de inventar) e *"Tenha opinião de design e crave"* — aqui se decide a paleta, a escala e a invariante que mantêm a tese visualmente soberana (Seção 6 do doc fonte).

## 2. Arquivos afetados

| Caminho exato | Ação | Por que |
|---|---|---|
| `adorable-azimuth/src/styles/tokens.css` | editar | Acrescentar a família de tokens `--home-*` (fundo, tinta, fontes, escala de display fluida, glow, passo de reveal) ao bloco `@theme`. Os `clamp()` com `rem` moram **aqui** porque o `token-gate` exclui `tokens.css` — assim `home.css` referencia só `var()` e fica verde. |
| `adorable-azimuth/src/styles/home.css` | criar (ou editar, se [01-fundacao-arquitetura.md](01-fundacao-arquitetura.md) já criou) | Arquivo temático da nova home. Este filho escreve a **casca** (`body.page-home`: fundo, ruído, glow, fontes, `scroll-padding`), os **keyframes canônicos** (`homeWordRise`, `homeFadeUp`, `homeFadeIn`), o mecanismo `[data-reveal]`, o `.cursor-spotlight` e o **bloco mestre de `prefers-reduced-motion`**. As regras por seção (hero/cicatriz/tensão/em-campo/toggle/CTA) são **coladas pelos filhos 02–05 dentro deste mesmo arquivo**. |
| `adorable-azimuth/src/styles/global.css` | editar | Adicionar `@import "./home.css";` à cadeia de imports (logo após `./new-landing.css`). O **wiring do import é de posse de [01-fundacao-arquitetura.md](01-fundacao-arquitetura.md)**; se 01 já importar, **não duplicar**. |
| `adorable-azimuth/src/pages/index.astro` e `adorable-azimuth/src/pages/en/index.astro` | editar | (Opcional, posse de 01) Inserir o `<script is:inline>` do spotlight ambiente no shell da página — especificado aqui no Passo 6. `is:inline` mantém o script **fora** de `dist/client/_astro/*.js` (não conta no js-budget). |
| `adorable-azimuth/src/styles/design-tokens.json` | **não tocar** | Fonte **não usada** em produção (tema claro em HSL, dessincronizado de `tokens.css`). Decisão cravada na Seção 8: `tokens.css` é a única verdade. Copiar `hsl()` de lá quebraria o `token-gate`. |
| `adorable-azimuth/src/components/HomeHybridLanding.astro` | (não é deste filho) | A casca/ruído/spotlight que este filho recria vêm de lá; a **exclusão** do arquivo é orquestrada por [01-fundacao-arquitetura.md](01-fundacao-arquitetura.md). Este filho garante que nada visual se perde quando ele morre. |

## 3. Dependências

**Precisa existir antes deste (ou ser coordenado no mesmo commit):**
- [01-fundacao-arquitetura.md](01-fundacao-arquitetura.md) — decide **onde o CSS vive** (criação de `src/styles/home.css` e o `@import` em `global.css`) e orquestra a **morte** de `HomeHybridLanding.astro`. Este filho crava o **nome** do arquivo (`home.css`) e o **conteúdo** da casca; 01 faz o fio.

**Dependem deste (contratos que este filho publica — atravessa 02 a 06):**
- [02-hero-afirmacao.md](02-hero-afirmacao.md) — consome `--home-hero-size`, `--home-subhead-size`, os keyframes `homeWordRise`/`homeFadeUp`/`homeFadeIn` e as fontes `--home-font-*`. Recebe a invariante: o H1 é o maior tipo da página.
- [03-cicatriz-prova.md](03-cicatriz-prova.md) — consome `--home-scar-size` (substitui o `--nh-display-2` que o rascunho de 03 inventou) e o gancho `[data-reveal]` aqui definido. Recebe a invariante: o número cresce, mas **< H1**.
- [04-tensao.md](04-tensao.md) — consome `--home-tension-size` e as tintas `--home-ink`/`--home-ink-dim`/`--home-accent`. Já usa o prefixo canônico `hm-`.
- [05-em-campo-toggle.md](05-em-campo-toggle.md) — consome as tintas, o `scroll-padding-top` da casca (âncora `#em-campo`) e as classes `.nl-seg*` do segmented control (reaproveitadas, ver Seção 8). O toggle muda **só** a ênfase do bloco 5 + texto do CTA; nada no sistema visual reage ao modo.
- [06-cta-contato-rodape.md](06-cta-contato-rodape.md) — consome `--home-font-mono`/`--home-ink-dim` para a assinatura pequena (nome que **saiu** do hero) e `--header-h` da casca.
- [07-i18n-conteudo.md](07-i18n-conteudo.md) — independente em runtime, mas a invariante de hierarquia pressupõe a copy de 07 (tese curta no H1). Acoplamento leve documentado na Seção 8.

## 4. Implementação passo a passo

### Passo 0 — Convenções cravadas (reconciliação transversal)

Os rascunhos 02/03/04 divergiram em nome de arquivo, prefixo de classe e nome de token. Como dono da camada transversal, **eu cravo o cânone** e listo a reconciliação. Quem digitar 02–06 segue esta tabela:

| Tema | Cânone (cravado aqui) | Reconciliar |
|---|---|---|
| Arquivo temático | `src/styles/home.css` | 03 dizia `new-home.css` → usar `home.css`. (Motivo: "new-" envelhece — vide `new-landing.css`.) |
| Escopo CSS | `body.page-home …` | Igual ao `HomeHybridLanding` e ao `global.css` (que já usa `body.page-home`/`body:not(.page-home)`). `.page-home …` (sem `body`) também casa; aceito, mas **prefira** `body.page-home` por paridade de especificidade com os resets globais. |
| Prefixo de classe | `hm-` (home manifesto) | 04 já usa `hm-tension` ✓. 03 usava `nh-scar` → `hm-scar`. **Exceção grandfathered:** o hero (02) mantém `.hero-*` — é inequívoco e o gancho de e2e é um `id` (`#hero-thesis`), não classe. |
| Escala de display | `--home-hero-size`, `--home-scar-size`, `--home-tension-size`, `--home-subhead-size` | 03 usava `--nh-display-2: clamp(3rem,12vw,7rem)` → **trocar** por `--home-scar-size`. (Motivo na Seção 8: `12vw/7rem` ultrapassava o H1.) |
| Fontes | `--home-font-display` / `--home-font-body` / `--home-font-mono` | 02/03/04 escreviam `'Cormorant Garamond'`/`'Syne'`/`'JetBrains Mono'` literais → referenciar os tokens (single source). |
| Reveal | `[data-reveal]` CSS-only, load-time, com `--reveal-index` | 03 referencia `data-reveal` "definido em 08" — eis a definição (Passo 4). Não usar `[data-sr]` (o `global.css` o exclui sob `.page-home`). |

### Passo 1 — Tokens da home em `tokens.css`

Acrescentar ao final do bloco `@theme {}` de `adorable-azimuth/src/styles/tokens.css` (antes do `}` de fechamento). Tudo aqui dentro é **excluído** do `token-gate`, então é o único lugar legítimo para `clamp()` com `rem` e para o hex do fundo.

```css
  /* === Nova Home (manifesto) — ambiente, fontes e escala de display ===
     Vive em tokens.css de propósito: o token-gate exclui este arquivo,
     então clamp(rem) e o hex do fundo ficam centralizados aqui e o
     home.css referencia só var(). */

  /* Ambiente: o manifesto é escuro + coral. O âmbar/charcoal da home
     antiga MORRE com o HomeHybridLanding (ver 08, Seção 8). */
  --home-bg:       #0b1220;                 /* navy quase-preto (= valor de --color-primary-foreground) */
  --home-ink:      var(--color-text);       /* off-white #f8fafc */
  --home-ink-dim:  var(--color-secondary);  /* sussurro: rgba(248,250,252,0.72) */
  --home-accent:   var(--color-primary);    /* coral #d65a52 — "o campo" */

  /* Fontes (BaseLayout já carrega Cormorant/Syne/JetBrains Mono p/ a home) */
  --home-font-display: 'Cormorant Garamond', serif;     /* H1, número da cicatriz */
  --home-font-body:    'Syne', sans-serif;              /* subhead, CTA, em-campo */
  --home-font-mono:    'JetBrains Mono', monospace;     /* eyebrow, tagline, labels */

  /* Escala de display fluida. INVARIANTE: hero >= scar em TODO viewport
     (cada parâmetro do hero domina o do scar: min, slope-vw e max).
     Ver prova na Seção 8. NÃO afrouxar sem refazer a prova. */
  --home-hero-size:    clamp(2.5rem, 7vw, 5.5rem);   /* o MAIOR tipo da página (H1 tese) */
  --home-scar-size:    clamp(2rem, 5.5vw, 4.25rem);  /* número da cicatriz: grande, < hero */
  --home-tension-size: clamp(1.5rem, 4vw, 2.75rem);  /* tipo médio */
  --home-subhead-size: clamp(1.05rem, 2vw, 1.3rem);  /* sussurro logo abaixo do H1 */

  /* Ambiente decorativo */
  --home-glow-size:   clamp(18rem, 60vw, 46rem);     /* diâmetro do glow coral atrás do hero */
  --home-reveal-step: 90ms;                          /* passo do stagger do [data-reveal] */
```

> Por que um hex novo (`--home-bg: #0b1220`) e não um alias de `--color-primary-foreground`? Mesmo valor, mas **nome honesto**: usar "primary-foreground" como background confundiria quem lê. Fica num token só, em `tokens.css`, fora do gate. As demais tintas são **alias** dos tokens existentes (zero hex novo).

### Passo 2 — Casca da `body.page-home` em `home.css` (fundo, ruído, glow, fontes)

Criar `adorable-azimuth/src/styles/home.css` (se 01 ainda não criou) e colar a casca. A home **deixa de ser** uma tela centralizada (o velho `main#main { justify-content:center }`) e passa a ser um **fluxo vertical de seções** — é um manifesto que rola, não um cartão de visita.

```css
/* ============================================================
   NOVA HOME — manifesto. Escopo: body.page-home.
   Casca + primitivos de animação. As regras por seção (hero,
   cicatriz, tensão, em-campo, toggle, CTA) são coladas pelos
   filhos 02–05 NESTE arquivo, sempre sob body.page-home.
   ============================================================ */

body.page-home {
  --header-h: var(--space-8);          /* nav mínima (filho 06) — offset de âncora */
  background: var(--home-bg);
  color: var(--home-ink);
  font-family: var(--home-font-body);
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  scroll-padding-top: var(--header-h);  /* âncora #em-campo não some sob a nav fixa */
}

/* Ruído/textura — REAPROVEITADO do HomeHybridLanding (SVG fractalNoise inline).
   data-URI sem px/rem/#hex/hsl => não dispara o token-gate. Dá grão de
   "material/campo" ao fundo escuro. Fica atrás de tudo (z-index 0). */
body.page-home::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
  opacity: 0.5;
}

/* O <main> empilha as seções; conteúdo fica acima do ruído. */
body.page-home main#main {
  flex: 1;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
}

/* Glow coral atrás do hero — REAPROVEITADO (era âmbar no main::after antigo),
   recolorido p/ o accent e dimensionado por token (vw/rem em tokens.css).
   color-mix evita rgba hardcoded. Estático (não anima): seguro em reduced-motion. */
body.page-home main#main::after {
  content: '';
  position: absolute;
  top: 18%;
  left: 50%;
  width: var(--home-glow-size);
  height: var(--home-glow-size);
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, color-mix(in srgb, var(--home-accent) 8%, transparent) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}
```

### Passo 3 — Keyframes canônicos (definir UMA vez aqui)

Os filhos 02 e 03 referenciam `homeWordRise`, `homeFadeUp`, `homeFadeIn`. Para não duplicar (e divergir), **a casa canônica é `home.css`** — os filhos só os **usam**, não os redeclaram.

```css
/* === Keyframes canônicos da home (definidos UMA vez) === */
@keyframes homeWordRise { to { transform: translateY(0); } }
@keyframes homeFadeUp   { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
@keyframes homeFadeIn   { from { opacity: 0; } to { opacity: 1; } }
```

`18px` em keyframe — o `token-gate` flagaria `\d+px`. Mantenho `18px` aqui de propósito e o aceito como **dívida informativa única e centralizada** (é uma distância de animação, não há token de "deslocamento de 18px" no sistema). Alternativa 100% verde, se quiser zerar a dívida: `transform: translateY(var(--space-2))` (`0.5rem`/8px) — desloca menos, mas é token puro. **Cravo `var(--space-2)`** para manter o gate limpo:

```css
@keyframes homeFadeUp { from { opacity: 0; transform: translateY(var(--space-2)); } to { opacity: 1; transform: translateY(0); } }
```

### Passo 4 — Mecanismo de reveal `[data-reveal]` (CSS-only, load-time)

O `global.css` **exclui** `.page-home` do scroll-reveal global (`body:not(.page-home) [data-sr]`). Então a home tem o **seu** reveal, e ele é **CSS puro, disparado no load** com stagger — zero JS, zero island, js-budget intocado. Cada seção recebe `data-reveal` e, opcionalmente, `style="--reveal-index: N"` para escalonar.

```css
/* Reveal da home: entra no load, escalona por --reveal-index.
   NÃO é scroll-triggered (decisão na Seção 8) — é o mais simples que
   resolve sem adicionar JS ao bundle apertado de 150KB. */
body.page-home [data-reveal] {
  opacity: 0;
  animation: homeFadeUp var(--duration-slow) var(--ease-standard) both;
  animation-delay: calc(var(--reveal-index, 0) * var(--home-reveal-step));
}
```

### Passo 5 — Spotlight do cursor (`.cursor-spotlight`) — CSS

Mantido (a tarefa pede "spotlight reaproveitado"), **recolorido** do âmbar para o coral. O CSS vive aqui; o `<script>` que o move é o Passo 6.

```css
/* Spotlight ambiente que segue o cursor (pointer:fine). Recolorido p/ accent. */
body.page-home .cursor-spotlight {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--duration-slow) var(--ease-standard);
  background: radial-gradient(
    var(--home-glow-size) circle at var(--spot-x, 50%) var(--spot-y, 35%),
    color-mix(in srgb, var(--home-accent) 8%, transparent),
    transparent 65%
  );
}
body.page-home .cursor-spotlight.is-on { opacity: 1; }
```

### Passo 6 — Bloco mestre de `prefers-reduced-motion`

Um bloco único, no fim de `home.css`, que neutraliza **todo** o movimento da home. Os filhos 02–05 não precisam repetir reduced-motion para os primitivos cobertos aqui (word-rise, fades, reveal, spotlight); só adicionam casos próprios se inventarem animação nova.

```css
@media (prefers-reduced-motion: reduce) {
  body.page-home [data-reveal] { opacity: 1; animation: none; }
  body.page-home .hn-inner { animation: none; transform: none; }   /* word-rise (hero) */
  body.page-home :where(.hero-subhead, .hero-tagline, .hero-cta) { animation: none; opacity: 1; }
  body.page-home .cursor-spotlight { display: none; }
}
```

O ruído (`::before`) e o glow (`::after`) **não** são animados — permanecem (são textura estática, não movimento), o que é correto sob reduced-motion.

### Passo 7 — Spotlight `<script is:inline>` (opcional, posse de 01)

O `HomeHybridLanding` morre levando seu `<script>` inline. Para preservar o spotlight **sem** custar js-budget, ele volta como `<script is:inline>` no shell (`index.astro`/`en/index.astro` — montagem de 01), **sem** o scramble do eyebrow (deletado em 02) e com guardas de `pointer: fine` + `prefers-reduced-motion`. `is:inline` mantém o código **na HTML**, fora de `dist/client/_astro/*.js` — não conta no orçamento.

```astro
<script is:inline>
  (function () {
    var fine = window.matchMedia('(pointer: fine)').matches;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;
    var spot = document.createElement('div');
    spot.className = 'cursor-spotlight';
    spot.setAttribute('aria-hidden', 'true');
    document.body.appendChild(spot);
    var tx = window.innerWidth / 2, ty = window.innerHeight * 0.35, x = tx, y = ty, raf = 0;
    function step() {
      x += (tx - x) * 0.1; y += (ty - y) * 0.1;
      spot.style.setProperty('--spot-x', x + 'px');
      spot.style.setProperty('--spot-y', y + 'px');
      raf = (Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5) ? requestAnimationFrame(step) : 0;
    }
    window.addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY; spot.classList.add('is-on');
      if (!raf) raf = requestAnimationFrame(step);
    }, { passive: true });
  })();
</script>
```

> É o mesmo loop RAF provado do `HomeHybridLanding` (linhas 462–492), menos o scramble e recolorido via CSS. Se 01 preferir a home **sem** efeito de cursor, basta não inserir o script: o `.cursor-spotlight` CSS fica inerte (nenhum elemento o instancia). O spotlight é **ambiente secundário**, nunca pré-requisito de leitura.

### Passo 8 — Tipografia da hierarquia (Seção 6 → regras concretas)

Esta é a tradução direta da Seção 6 ("o que carrega a tese cresce; o que é identidade pessoal encolhe ou some"). As regras de **cada** seção são coladas pelos respectivos filhos, mas o **contrato de tamanho/peso/cor** é cravado aqui e referenciado por todos:

| Elemento | Cresce/encolhe | Token de tamanho | Fonte | Cor | Dono |
|---|---|---|---|---|---|
| **H1 — tese** | MAIOR da página | `--home-hero-size` | `--home-font-display`, `--font-weight-bold` | `--home-ink` | 02 |
| Subhead | sussurra | `--home-subhead-size` | `--home-font-display`, `--font-weight-regular` | `--home-ink-dim` | 02 |
| Tagline (mono) | sussurro técnico | `--font-size-sm` + `letter-spacing` + `uppercase` | `--home-font-mono` | `--home-ink-dim` | 02 |
| **Número da cicatriz** | maior **do bloco**, `< H1` | `--home-scar-size` | `--home-font-display`, `--font-weight-bold` | `--home-ink` (ou `--home-accent` em `data-pending`) | 03 |
| Legenda da cicatriz | vira legenda | `--font-size-lg` | `--home-font-body` | `--home-ink-dim` | 03 |
| Título da tensão | médio | `--home-tension-size` | `--home-font-body`, `--font-weight-bold` | contraste `--home-ink` vs `--home-ink-dim`+`line-through` no `--home-accent` | 04 |
| Pontos "em campo" | corpo médio | `--font-size-lg`/`xl` | `--home-font-body` | `--home-ink` | 05 |
| Toggle recrutador/cliente | **mais discreto** da seção | `.nl-seg*` (reaproveitado) | `--home-font-mono`/`body` | `--home-ink-dim` | 05 |
| CTA | botão grita, frase sussurra | `--font-size-base` | `--home-font-body`, `--font-weight-medium` | borda `--home-accent` no hover | 02/05 |
| **Nome próprio + ®** | **some do hero** → assinatura mínima | `--font-size-sm`/`xs` | `--home-font-mono` | `--home-ink-dim` | 06 |

**O que some / encolhe (Lista de Morte, Seção 8 do doc fonte):** o nome deixa de ser o maior tipo (era `clamp(3rem,8vw,5.8rem)` no `.hero-name`) e vira assinatura `--font-size-sm` no nav/rodapé (filho 06); o **®** é deletado (não tem token, não tem regra — simplesmente não existe no markup novo); todo adjetivo nu sem número não ganha estilo de destaque — ou vira prova (cicatriz) ou sai. Nenhuma classe `.hero-name`/`.cta-grid`/`.cta-card*` do `HomeHybridLanding` é portada.

### Passo 9 — Wiring do import

Garantir, **uma vez**, em `adorable-azimuth/src/styles/global.css`, a linha:

```css
@import "./home.css";
```

logo após `@import "./new-landing.css";`. Posse do fio é de [01-fundacao-arquitetura.md](01-fundacao-arquitetura.md); se 01 já adicionou, **não duplicar**. Sem o import, toda a home fica sem estilo e a invariante de hierarquia não existe.

## 5. Copy

**Este filho é transversal de estilo: não introduz copy de usuário nem chaves i18n.** As únicas strings literais são:

1. **Comentários CSS em PT** — vivem em `src/styles/{tokens,home}.css`, **fora** de `src/pages/en/**`, então o `check-en-no-pt` nem os varre. Sem risco.
2. **Nenhum `content:` com palavra PT** é introduzido aqui. (O `content: "preencher: carga? tempo? o que nao quebrou?"` do estado `data-pending` é do filho [03-cicatriz-prova.md](03-cicatriz-prova.md), não deste — e mesmo assim mora em `src/styles`, fora do alvo do gate.)

**Sem `[___]` neste filho.** O único bloqueador de conteúdo da home (o número real da cicatriz, arrancado pelas 3 perguntas) pertence a [03-cicatriz-prova.md](03-cicatriz-prova.md). Aqui só se garante que, **enquanto** o `[___]` existir, o token `--home-accent` pinta o número e o reveal não esconde a urgência.

**Nota EN para quem colar:** ao referenciar fontes/tokens, nunca escrever as palavras PT banidas (`portaria, custo, tempo, projetos, contato, latência, disponível, evidência, risco, qualidade`) em qualquer arquivo sob `src/pages/en/**`. Este filho não toca esses arquivos (exceto o `<script is:inline>` opcional do spotlight, que é só código — sem texto PT).

## 6. Conformidade com gates

- **semantics-gate (um único `<h1>`):** este filho **não cria heading nenhum** — só estiliza. A invariante que ele crava (`--home-hero-size` > `--home-scar-size` em todo viewport) garante que o **único** `<h1>` (hero, filho 02) também é o maior tipo **visualmente**, sem que ninguém seja tentado a promover o número da cicatriz a `<h1>`. `<nav>/<main>/<footer>/<title>/meta` vêm do `BaseLayout`. Verde.
- **check-en-no-pt:** não toca `src/pages/en/**` com texto PT. Comentários/tokens vivem em `src/styles` (não varrido). O `<script is:inline>` opcional é código puro. Verde.
- **check:i18n (paridade de chaves):** zero chave nova. Verde por não-participação.
- **js-budget (≤150KB):** **zero island, zero `<script>` bundlado.** Reveal e word-rise são CSS (`@keyframes`). O spotlight é `<script is:inline>` → fica na HTML, **fora** de `dist/client/_astro/*.js`. Delta de bundle = **0KB**. Verde, e protege o orçamento para o toggle do filho 05.
- **token-gate (informativo/não-bloqueante):** `home.css` referencia **só** `var()` para cor/tamanho/espaço; bordas via `--border-width-1`; os `clamp(rem)` e o `#0b1220` moram em `tokens.css` (excluído pelo gate). `color-mix(...)` e `rgba(...)` **não** são padrões vigiados (o gate caça `\d+px`, `\d+rem`, `#hex`, `hsl(`). O ruído é data-URI sem unidade flagável. `vw/vmin/ch/%/dvh/ms` e `line-height` unitless não disparam. O keyframe usa `var(--space-2)` (não `18px`). **Resultado esperado: este filho não adiciona violação** — e ainda dá um caminho para reduzir a dívida pré-existente de 791 violações da home antiga, que morre junto.
- **docs-gate:** não toca fundação (`AGENTS.md`/`ARQUITETURA.md`/`GLOSSARIO.md`/`DOCUMENTACAO.md`) nem `docs/modulos/**`. A pasta `plano-reconstrucao-home/` não é varrida. (Se 01 documentar a home em `ARQUITETURA.md`, o rodapé "Última revisão:" é de 01.) Verde/N-A.
- **islands-gate:** nenhum `.tsx` criado. Verde.

## 7. Critérios de aceitação

- [ ] `tokens.css` contém a família `--home-*` (bg, ink, accent, font-display/body/mono, hero/scar/tension/subhead-size, glow-size, reveal-step); `npm run build` compila sem erro.
- [ ] `src/styles/home.css` existe, é importado por `global.css` **uma vez**, e estiliza `body.page-home` (fundo escuro `--home-bg`, ruído `::before`, glow `::after`).
- [ ] A casca não centraliza mais o `main` (a home **rola** como fluxo de seções).
- [ ] Os keyframes `homeWordRise`/`homeFadeUp`/`homeFadeIn` estão definidos **uma única vez** (em `home.css`); nenhum filho os redeclara.
- [ ] **Invariante provada a olho:** em 360px, 768px, 1024px e 1440px, o H1 (tese) é, sem exceção, maior que o número da cicatriz. (Teste manual: redimensionar e comparar.)
- [ ] `[data-reveal]` aparece com fade/rise no load; com `prefers-reduced-motion: reduce`, tudo aparece estático (sem reveal, sem word-rise, sem spotlight) e legível.
- [ ] O spotlight (se 01 inserir o script) segue o cursor só em `pointer: fine`, é coral, e **some** sob reduced-motion.
- [ ] `node scripts/token-gate.cjs` **não** acusa nova violação atribuível a `home.css` (referências só `var()` fora de `tokens.css`).
- [ ] `node scripts/js-budget.cjs` reporta o mesmo total de antes (delta 0KB por este filho).
- [ ] Nenhum vestígio de `--charcoal`/`--amber`/`.hero-name`/`.cta-grid` do `HomeHybridLanding` sobrevive na home nova.

## 8. Decisões cravadas e riscos

**Cravo: a home nova é escura + coral; o âmbar/charcoal morre.** A paleta âmbar/charcoal do `HomeHybridLanding` era hardcoded num `is:global` (dívida). Em vez de portá-la (e reabrir 791 violações de token), **adoto o sistema de tokens**: fundo `--home-bg` (#0b1220, valor que já existia como `--color-primary-foreground`), tinta `--color-text`, accent `--color-primary` (coral) como "o campo". Trade-off: abro mão da identidade quente/âmbar antiga; ganho uma home 100% tokenizada (token-gate limpo) e um accent que já é a cor da marca no resto do site. O coral sobre navy quase-preto carrega a seriedade do "pior dia" melhor que o dourado de portfólio.

**Cravo: a invariante hero ≥ scar, provada, não torcida.** O rascunho de 02 (`--home-hero-size: clamp(2.25rem,6vw,5rem)`) e o de 03 (`--nh-display-2: clamp(3rem,12vw,7rem)`) **colidiam**: em ~711px o número da cicatriz (9–12vw) ficaria **maior** que o H1 — violando a Seção 6 ("HERO é o maior tipo da página inteira"). Recravo a escala para que **cada** parâmetro do hero domine o do scar: `hero = clamp(2.5rem, 7vw, 5.5rem)` vs `scar = clamp(2rem, 5.5vw, 4.25rem)`. Como `clamp(a,x,b)=max(a,min(x,b))` é não-decrescente em cada argumento, e `2.5≥2`, `7vw≥5.5vw` (∀ largura) e `5.5≥4.25`, então `hero(w) ≥ scar(w)` para **todo** `w`. Trade-off: o número da cicatriz nunca poderá ser o maior elemento da tela — mas é exatamente o que a Seção 6 exige (o número é o maior **do seu bloco**, não da página). Abri mão da liberdade de 03 dimensionar à vontade; ganhi a tese soberana em qualquer breakpoint.

**Cravo: reveal CSS-only no load, não scroll-triggered.** Scroll-reveal honesto pede IntersectionObserver (JS) ou `animation-timeline: view()` (suporte ainda irregular). Com o budget de 150KB apertado e o toggle do filho 05 já comendo orçamento, **escolho stagger no load** (puro CSS, 0KB). Trade-off: seções abaixo da dobra animam fora da vista (o usuário as encontra estáticas ao rolar) — imperfeição aceitável num manifesto curto de ~2–3 viewports. Se um dia quiserem scroll-reveal real, ele entra como `@supports (animation-timeline: view())` aditivo, sem island. Não reabrir como Preact.

**Cravo: spotlight via `is:inline`, ambiente e descartável.** Mantenho o spotlight (a tarefa pede), mas recolorido e **sem** o scramble do eyebrow (que 02 matou). `is:inline` o tira do bundle (js-budget intocado). É efeito secundário: se 01 não inserir o script, o CSS fica inerte. Abri mão de um efeito "garantido"; ganhei zero acoplamento e zero custo de orçamento.

**Cravo: `tokens.css` é a única verdade; `design-tokens.json` não é tocado.** Ele é tema claro em HSL, dessincronizado (container 72rem vs 87.5rem; coral vs `hsl(221 83% 53%)`; durações divergentes) e **não** é consumido pelo CSS de produção. Copiar `hsl()` dele quebraria o `token-gate` (padrão `hsl(`). Decisão: ignorá-lo. (Sincronizá-lo é um item de dívida separado, fora deste filho.)

**Riscos / bombas-relógio:**
- **`--header-h` sob `page-home`.** O `global.css` só define `--header-h` para `body:not(.page-home)`. Defino-o na casca (`body.page-home { --header-h: var(--space-8) }`) para o `scroll-padding-top` e a nav (06) funcionarem. Se 06 cravar uma nav mais alta, **atualizar este token** ou a âncora `#em-campo` fica parcialmente sob a nav.
- **Ordem de import importa.** `home.css` precisa vir **depois** de `tokens.css` (senão os `var(--home-*)` resolvem vazio) e depois de `tailwindcss`. Na cadeia atual de `global.css`, colá-lo após `./new-landing.css` satisfaz ambos. Se 01 importar em outra ordem, validar que `--home-*` resolve.
- **Acoplamento copy↔escala.** A invariante pressupõe a tese curta (filho 07). Se 07 trocar por uma frase muito mais longa, o H1 pode ganhar muitas linhas e o **bloco** (não o tamanho de glifo) competir com a cicatriz por presença. O tamanho de tipo segue íntegro; revisar `max-width`/`line-height` do hero (02) se a copy mudar de comprimento.
- **`color-mix` / `dvh` em navegadores antigos.** `color-mix(in srgb, …)` e `100dvh` têm suporte amplo mas não universal. Fallback: o glow/spotlight degradam para "sem cor" (transparente) — perda só estética, não funcional. O fundo `--home-bg` e o texto não dependem deles.
- **Migração dos rascunhos 02/03.** Se quem digitar 03 ignorar a reconciliação do Passo 0 e mantiver `--nh-display-2: clamp(3rem,12vw,7rem)`, a invariante quebra e o critério de aceitação "H1 > número" falha. A tabela do Passo 0 é **bloqueante** para a aceitação visual.

## 9. Conexões

- Índice-mãe: [00-indice-mae.md](00-indice-mae.md)
- Depende de (vem antes / coordenado): [01-fundacao-arquitetura.md](01-fundacao-arquitetura.md)
- Publica contratos para (atravessa 02 a 06): [02-hero-afirmacao.md](02-hero-afirmacao.md) · [03-cicatriz-prova.md](03-cicatriz-prova.md) · [04-tensao.md](04-tensao.md) · [05-em-campo-toggle.md](05-em-campo-toggle.md) · [06-cta-contato-rodape.md](06-cta-contato-rodape.md)
- Coordena copy/i18n com: [07-i18n-conteudo.md](07-i18n-conteudo.md)
</content>
</invoke>
