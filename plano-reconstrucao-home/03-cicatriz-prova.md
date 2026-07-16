# 03. A Cicatriz (a prova)

> Este plano entrega o bloco número-primeiro logo abaixo do hero: um NÚMERO concreto como maior tipo do bloco, com o resto da frase virando legenda. Serve ao **Bloco 3 — A CICATRIZ** do doc fonte (`da-autopsia-ao-bisturi-reconstrucao.md`, seções 3, 4, 5 e 6) e à lei "todo adjetivo solto sem número, ou vira prova, ou sai do palco".

> **⚠️ Reconciliação — ver [índice-mãe](00-indice-mae.md) §4.** Onde este plano diverge, vale o índice: stylesheet **`src/styles/home.css`** (não `new-home.css`); prefixo **`.hm-*`** (não `.nh-*`); token do número **`--home-scar-size`** (não `--nh-display-2`); chaves **`home.scar.eyebrow/value/unit/caption`**. O número é `<h2>`/`<span>` estilizado grande, **nunca** `<h1>`.

## 1. Objetivo

Plantar, imediatamente abaixo do hero e antes da Tensão, **um dado em corpo grande que converte promessa em crença** (Bloco 3 — A CICATRIZ). A prova vem antes do argumento: o visitante lê a tese no hero e, antes que a dúvida nasça, bate o olho num número que a sustenta. Governa este filho a lei do AGENTS.md **"Tenha opinião de design. Crave."** (a hierarquia é cravada: o número grita, o resto sussurra) somada a **"O data model conta a verdade"** (a métrica é dado real, não adjetivo) e **"Erros e bordas não são depois"** (a estratégia de placeholder é tratada como bloqueador, não como pendência).

## 2. Arquivos afetados

| Caminho exato | Ação | Por que |
|---|---|---|
| `adorable-azimuth/src/components/home/Cicatriz.astro` | criar | Seção bespoke do Bloco 3: número como maior tipo + eyebrow `<h2>` + legenda. `.astro` estático, zero JS. |
| `adorable-azimuth/src/i18n/pt-br/home.json` | editar | +4 chaves `home.scar.*` (PT) — a métrica e o molde, separados em valor/unidade/legenda. |
| `adorable-azimuth/src/i18n/en/home.json` | editar | +4 chaves `home.scar.*` (EN) espelhadas, evitando os tokens PT banidos. |
| `adorable-azimuth/src/pages/index.astro` | editar | Importar e posicionar `<Cicatriz>` logo após o hero (a orquestração final da página é de [01-fundacao-arquitetura.md](01-fundacao-arquitetura.md)). |
| `adorable-azimuth/src/pages/en/index.astro` | editar | Idem, `locale = "en"`. |
| `adorable-azimuth/src/styles/new-home.css` | editar | Regras `.nh-scar*` + a custom property de display `--nh-display-2`. Arquivo temático da nova home, criado/convencionado em [08-estilo-tokens-animacao.md](08-estilo-tokens-animacao.md). |

> O arquivo `src/components/ux/ProofStrip.astro` **não** é tocado — ver a decisão cravada na seção 8.

## 3. Dependências

**Precisam existir antes deste filho:**

- [01-fundacao-arquitetura.md](01-fundacao-arquitetura.md) — define o orquestrador da nova home (`src/pages/index.astro` + `src/pages/en/index.astro` reconstruídos, a ordem dos blocos e o padrão `prerender = true`). Este filho só **encaixa** a seção na fenda "logo após o hero".
- [07-i18n-conteudo.md](07-i18n-conteudo.md) — dono do namespace `home` e da política de chaves (incluindo a poda das chaves órfãs do MorphingText). Aqui eu cravo as chaves concretas `home.scar.*`; 07 garante a paridade pt-br/en do arquivo inteiro.
- [08-estilo-tokens-animacao.md](08-estilo-tokens-animacao.md) — dono do stylesheet temático (`src/styles/new-home.css`, prefixo `.nh-*`), da escala de display e do gancho de reveal (`data-reveal`). Aqui eu escrevo o bloco `.nh-scar*`; 08 hospeda e importa.

**Dependem deste filho:**

- O filho do **Bloco 4 — A TENSÃO** (o inimigo nomeado, happy path vs. campo) entra logo abaixo desta seção; ele assume que a Cicatriz já ocupa o espaço imediatamente pós-hero.
- O orquestrador em [01-fundacao-arquitetura.md](01-fundacao-arquitetura.md) consome o componente `Cicatriz.astro` e as chaves `home.scar.*`.

## 4. Implementação passo a passo

### Passo 1 — Criar o componente bespoke `Cicatriz.astro`

Componente `.astro` **puro** (sem estado, sem efeito, sem island — design-system REGRA). Recebe as quatro strings já resolvidas por `t()` na página, mantendo o componente burro e a fonte de verdade no i18n. O `value` é o número que **vira o maior tipo do bloco**; `unit` é o qualificador; `caption` é o resto do molde. A flag `pending` detecta o placeholder e arma o tratamento visual de urgência.

`adorable-azimuth/src/components/home/Cicatriz.astro`:

```astro
---
/**
 * Bloco 3 — A CICATRIZ (a prova).
 * O NÚMERO (value) é o maior tipo do bloco; tudo o mais é legenda.
 * A métrica nasce das 3 perguntas (doc fonte, seção 5):
 *   1) Sob qual carga?   2) Por quanto tempo?   3) O que NÃO quebrou?
 * Molde: "Rodou [tempo] offline em [contexto], com [volume] de [operação],
 *         sem [o que não quebrou]."
 * Enquanto o número real não chega, value/caption carregam "[___]" e o bloco
 * entra em data-pending="true" — placeholder LOUD, não silencioso.
 */
interface Props {
  eyebrow: string; // home.scar.eyebrow
  value: string;   // home.scar.value  — o número, maior tipo do bloco
  unit: string;    // home.scar.unit   — qualificador do número
  caption: string; // home.scar.caption — o resto do molde
}
const { eyebrow, value, unit, caption } = Astro.props as Props;
const pending = value.includes("[___]") || caption.includes("[___]");
---
<section
  class="nh-scar"
  aria-labelledby="scar-eyebrow"
  data-reveal
  data-pending={pending ? "true" : undefined}
>
  <h2 class="nh-scar__eyebrow" id="scar-eyebrow">{eyebrow}</h2>
  <p class="nh-scar__number">
    <span class="nh-scar__value">{value}</span>
    <span class="nh-scar__unit">{unit}</span>
  </p>
  <p class="nh-scar__caption">{caption}</p>
</section>
```

Notas de semântica:

- O heading do bloco é o **eyebrow** (`<h2>`), pequeno em mono. O número fica num `<p>` — tamanho de tipo não é nível de heading. Assim a seção tem heading real para acessibilidade **sem** disputar o `<h1>` do hero (ver seção 6).
- `aria-labelledby` amarra a região ao eyebrow; leitores de tela anunciam "Em produção" e depois leem número + legenda na ordem natural.
- `data-reveal` é o gancho de animação **de entrada** definido em [08-estilo-tokens-animacao.md](08-estilo-tokens-animacao.md). Não use `data-sr`: o `global.css` exclui `.page-home` das regras base de scroll-reveal (`body:not(.page-home)`), então o reveal da home roda pelo mecanismo do 08, não pelo global.

### Passo 2 — Estilo: o número como maior tipo (em `new-home.css`)

As regras vão no stylesheet temático da nova home (dono: 08), escopadas em `.page-home` — mesma estratégia de escopo que a home atual já usa (`body.page-home`). Tudo referencia tokens de `tokens.css`. O único valor sem token equivalente é a **escala de display** do número, centralizada numa custom property (mesma abordagem do hero, que já usa `clamp(...)`).

Adicionar em `adorable-azimuth/src/styles/new-home.css`:

```css
/* Escala de display da nova home — sem token equivalente em tokens.css.
   Centralizada aqui (espelha o clamp do hero). Ver nota de token-gate na seção 6. */
.page-home { --nh-display-2: clamp(3rem, 12vw, 7rem); }

/* === Bloco 3 — A CICATRIZ ===
   O número é o maior tipo do bloco; o resto é legenda que sussurra. */
.page-home .nh-scar {
  max-width: var(--container-max);
  margin-inline: auto;
  padding-block: var(--space-9);
  padding-inline: var(--space-6);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  text-align: center;
}

.page-home .nh-scar__eyebrow {
  margin: 0;
  font-family: "JetBrains Mono", monospace;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-2);
}

.page-home .nh-scar__number {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  line-height: var(--line-height-tight);
}

.page-home .nh-scar__value {
  font-size: var(--nh-display-2); /* o grito */
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.02em;
  color: var(--ink-1);
}

.page-home .nh-scar__unit {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-regular);
  color: var(--ink-2);
}

.page-home .nh-scar__caption {
  margin: 0;
  max-width: 46ch; /* ch e %, não px/rem — fora do radar do token-gate */
  font-size: var(--font-size-lg);
  line-height: var(--line-height-relaxed);
  color: var(--ink-2);
}

/* Placeholder URGENTE: enquanto o número real não chega, o [___] grita em accent
   e a seção carrega um lembrete dashed. É proposital: a página parece inacabada
   até a métrica real entrar — porque shippar sem ela é pior. Ver seção 8. */
.page-home .nh-scar[data-pending="true"] .nh-scar__value {
  color: var(--accent-1);
}
.page-home .nh-scar[data-pending="true"]::after {
  content: "preencher: carga? tempo? o que nao quebrou?";
  font-family: "JetBrains Mono", monospace;
  font-size: var(--font-size-sm);
  color: var(--accent-1);
  border: var(--border-width-1) dashed var(--accent-1);
  border-radius: var(--radius-full);
  padding: var(--space-1) var(--space-3);
}

@media (prefers-reduced-motion: reduce) {
  /* o reveal (08) já degrada; nada a fazer aqui além de garantir conteúdo visível */
  .page-home .nh-scar { opacity: 1; }
}
```

### Passo 3 — Chaves i18n (PT e EN, espelhadas)

Adicionar as **mesmas 4 chaves** em ambos os arquivos (paridade exigida pelo `check:i18n`). O molde é fatiado em `value` (o número que cresce), `unit` (qualificador) e `caption` (o resto), para que a hierarquia viva no markup e não dependa de parsing de string.

Em `adorable-azimuth/src/i18n/pt-br/home.json`:

```json
"home.scar.eyebrow": "Em produção",
"home.scar.value": "[___] meses",
"home.scar.unit": "rodando offline",
"home.scar.caption": "em [contexto real], com [___] sincronizações — zero perda de dado. Quando a conexão voltou, tudo bateu."
```

Em `adorable-azimuth/src/i18n/en/home.json`:

```json
"home.scar.eyebrow": "In production",
"home.scar.value": "[___] months",
"home.scar.unit": "running offline",
"home.scar.caption": "in [real-world setting], across [___] syncs — zero data loss. When the connection came back, everything matched."
```

### Passo 4 — Wiring na página (resolver `t()` e posicionar)

A orquestração completa da página é de [01-fundacao-arquitetura.md](01-fundacao-arquitetura.md). Este filho contribui o import, a resolução das strings via `createT` (mesmo padrão de `Header.astro`) e a posição **imediatamente após o hero**.

Em `adorable-azimuth/src/pages/index.astro` (PT — `locale = "pt-br"`):

```astro
---
import { loadMessages, createT } from "@/i18n";
import Cicatriz from "@/components/home/Cicatriz.astro";
// ...demais imports da página (hero, tensão, etc.) ficam em 01.

const locale = "pt-br" as const;
const tHome = createT(loadMessages(locale, "home"), { locale, namespace: "home" });
---
<!-- ...Hero (Bloco 2)... -->

<Cicatriz
  eyebrow={tHome("home.scar.eyebrow")}
  value={tHome("home.scar.value")}
  unit={tHome("home.scar.unit")}
  caption={tHome("home.scar.caption")}
/>

<!-- ...Tensão (Bloco 4)... -->
```

Em `adorable-azimuth/src/pages/en/index.astro`, idêntico, trocando apenas `const locale = "en" as const;`. Ambas as páginas mantêm `export const prerender = true;` (semantics-gate exige `.html` no `dist`).

### Passo 5 — Importar o stylesheet

Garantir que `src/styles/new-home.css` é importado uma vez (via `global.css` ou pela página, conforme 08 cravar). Sem o import, o `.nh-scar` fica sem estilo e o número não cresce. Esse import é responsabilidade de 08; este filho só **depende** dele.

## 5. Copy

### PT (colável, do doc fonte — seção 4 "A CICATRIZ" + molde da seção 5)

Molde exato (doc fonte, seção 5):

> Rodou `[tempo]` offline em `[contexto]`, com `[volume]` de `[operação]`, sem `[o que não quebrou]`.

Fatiado nas chaves:

- `home.scar.eyebrow` → **Em produção**
- `home.scar.value` → **[___] meses** (o número — maior tipo)
- `home.scar.unit` → **rodando offline**
- `home.scar.caption` → **em [contexto real], com [___] sincronizações — zero perda de dado. Quando a conexão voltou, tudo bateu.**

Exemplo do molde **preenchido** (formato-alvo, doc fonte seção 5 — só para o digitador ver o destino):

> **8 meses** · rodando offline · em coletores de campo, com 40 mil sincronizações — zero perda de dado. Quando a conexão voltou, tudo bateu.

### EN (tradução de referência)

- `home.scar.eyebrow` → **In production**
- `home.scar.value` → **[___] months**
- `home.scar.unit` → **running offline**
- `home.scar.caption` → **in [real-world setting], across [___] syncs — zero data loss. When the connection came back, everything matched.**

**Tokens PT banidos a evitar no EN** (`check-en-no-pt`, fronteira de palavra): `portaria, custo, tempo, projetos, contato, latencia, disponivel, evidencia, risco, qualidade`. A tradução acima já os evita — note que usei **months/running offline** (não "tempo"), **syncs/data loss** e **setting** (não "contato"/"projetos"/"risco"). Se for traduzir "operação/contexto" no futuro, prefira *operation/setting/environment*, nunca os tokens da lista.

### O BLOQUEIO DE CONTEÚDO — destaque

**Este é o único bloqueador de conteúdo verdadeiro da home inteira.** Todo o resto da página já está escrito no doc fonte; a Cicatriz é a única peça que depende de um dado que só você tem. As **3 perguntas** que arrancam a métrica do trabalho real (doc fonte, seção 5):

1. **Sob qual carga?** Quantos usuários, dispositivos ou transações simultâneas no **pior pico** — não na média? → vira `[volume]` / `[___] sincronizações`.
2. **Por quanto tempo?** Qual o maior período que rodou sem rede, sem cair, ou em produção ininterrupta? → vira `[___] meses` (o `value`, o número que grita).
3. **O que NÃO quebrou?** O que era esperado falhar e não falhou — o dado que não se perdeu, a integração que não caiu, o sync que bateu 100%? → vira o `sem [o que não quebrou]` ("zero perda de dado").

**Estratégia de placeholder:** enquanto as três respostas não vierem, `value` e `caption` mantêm o `[___]`. O `[___]` **fica no ar visível** (lê como dado redigido, "chegando") e o bloco entra em `data-pending="true"`, que pinta o número em accent e estampa o lembrete dashed *"preencher: carga? tempo? o que nao quebrou?"*. É urgência, não detalhe: a página deve **parecer inacabada** até o número real entrar — porque o doc fonte é explícito ("trata isso como urgência, não como detalhe") e porque, sem o número, a página volta a *pedir* confiança em vez de torná-la desnecessária.

## 6. Conformidade com gates

- **semantics-gate (um único `<h1>`):** verde. O hero (Bloco 2) é o dono do `<h1>`. A Cicatriz usa `<h2>` no eyebrow e `<p>` no número/legenda — o número grande é **tipo grande, não heading**. `<nav>`, `<main>`, `<footer>` vêm do `BaseLayout`; a página só adiciona esta seção.
- **check-en-no-pt:** verde. A copy EN da seção evita todos os tokens banidos (*months, running offline, syncs, data loss, setting*). Bônus: o componente vive em `src/components/home/` e o CSS em `src/styles/` — fora de `src/pages/en/**`, que é o que o gate varre — então nem é escaneado; ainda assim a string EN é escrita limpa.
- **check:i18n (paridade de chaves):** verde. Exatamente as **mesmas 4 chaves** `home.scar.*` entram em `pt-br/home.json` e `en/home.json`. Adicionar em só um dos arquivos quebra o prebuild — entram juntas, no mesmo commit.
- **js-budget (≤150KB):** verde, e com **folga ganha**. A Cicatriz é `.astro` estática, **zero island, zero hydration** — adiciona 0 KB ao `dist/client/_astro`. O orçamento apertado é problema do toggle do Bloco 5; esta seção não o consome.
- **token-gate (informativo/não-bloqueante):** cores, espaçamentos, raios e bordas usam tokens (`var(--ink-1)`, `var(--space-*)`, `var(--radius-full)`, `var(--border-width-1)`). A **única** exceção é a escala de display `--nh-display-2: clamp(3rem, 12vw, 7rem)` — não há token de display em `tokens.css`, e é a mesma abordagem que o hero já adota. Centralizei numa custom property única para que a violação informativa fique **num lugar só**, não espalhada. `ch`/`%`/`vw` não disparam o regex (`\d+px`, `\d+rem`, `#hex`, `hsl(`).
- **docs-gate:** sem impacto. Este filho não toca em `AGENTS.md`, `ARQUITETURA.md`, `GLOSSARIO.md`, `DOCUMENTACAO.md` nem em `docs/modulos/**`. A pasta `plano-reconstrucao-home/` não é varrida. (Se 01 decidir documentar a nova home em `ARQUITETURA.md`, o rodapé "Última revisão:" é responsabilidade de 01.)

## 7. Critérios de aceitação

- [ ] A Cicatriz renderiza **imediatamente abaixo do hero** e **acima da Tensão**, em `/` (PT) e `/en/` (EN).
- [ ] O número (`.nh-scar__value`) é, **a olho**, o maior tipo do bloco — maior que eyebrow, unit e caption.
- [ ] A página tem **exatamente um `<h1>`** (o hero); o eyebrow da Cicatriz é `<h2>`. `npm run build` + semantics-gate passam.
- [ ] As strings vêm de `home.json` via `tHome("home.scar.*")` — nenhuma copy hardcoded inline no componente ou na página.
- [ ] `pt-br/home.json` e `en/home.json` têm o **mesmo conjunto de chaves** (`check:i18n` verde no prebuild).
- [ ] Enquanto houver `[___]`, o bloco mostra o número em accent + o lembrete dashed (`data-pending="true"` ativo).
- [ ] Substituir os `[___]` pelos valores reais **não exige mudança de markup nem de CSS** — só editar `home.json` (PT e EN). Ao preencher, `data-pending` some sozinho e o número volta à cor `--ink-1`.
- [ ] `dist/client/_astro/*.js` **não cresce** por causa desta seção (zero JS adicionado).
- [ ] `prefers-reduced-motion: reduce` mantém número e legenda visíveis e legíveis.

## 8. Decisões cravadas e riscos

**Cravo: bloco bespoke (`Cicatriz.astro`), NÃO reaproveitar `ProofStrip.astro`.** O `ProofStrip` renderiza *N* pares valor/rótulo **de peso igual** numa tira horizontal (`<strong data-text="heading-lg">` para cada item). Isso é o oposto exato do que o Bloco 3 pede: o doc fonte é categórico — *"O maior tipo do bloco é o NÚMERO; o número grita, o resto da frase vira legenda… um dado em corpo grande vale mais que três adjetivos em negrito."* Reusar o `ProofStrip` nivelaria tudo em `heading-lg` e mataria a hierarquia que é a razão de existir do bloco. **Trade-off:** mais um arquivo (`Cicatriz.astro`) em troca de uma hierarquia honesta e de uma escala de display que o `ProofStrip` não tem. Abri mão da economia de um componente; ganhei a tese visível. (O `ProofStrip` serve melhor ao **Bloco 5 — Em campo**, onde as três provas *são* equivalentes — recomendação para o filho do Bloco 5, não para este.)

**Cravo: `.astro` estática, zero JS.** Sem count-up animado, sem island. **Trade-off:** abro mão da animação de contagem do número; em troca, o budget de 150 KB fica intacto e o impacto vem do **tamanho** do número, não do movimento. Se um dia quiserem o count-up, ele entra pelo reveal GSAP do 08 (`data-reveal`), **sem island nova** — não reabrir como Preact.

**Cravo: o número agnóstico (`value`/`unit`/`caption`), liderado pela duração.** O componente não sabe *qual* das 3 respostas é a maior — ele só amplia o que estiver em `value`. O placeholder lidera com a **duração** (`[___] meses`) porque "continuar de pé ao longo do tempo" é a prova mais visceral de "funciona quando nada mais funciona". Mas se a resposta mais forte for o volume ou o "zero perda", basta trocar o que vai em `value`/`unit` no `home.json` — o markup não muda. Data model honesto: a resposta real decide o que grita.

**Cravo: placeholder LOUD, não silencioso.** O `[___]` fica visível e o `data-pending` estampa o lembrete. **Trade-off:** a home parece inacabada até o número entrar — de propósito. Abri mão de "parecer pronto cedo" para não shippar a peça que *desfaz* a tese. O lembrete é a forcing function.

**Riscos / bombas-relógio:**

- **A bomba real: shippar a home pública com `[___]`.** É o único bloqueador de conteúdo verdadeiro. Mitigação escolhida: tratamento visual urgente (acima) + a nova home fica atrás do rollout de 01 até o número existir. **Não** recomendo um gate de CI que **trave o build** por causa de copy (travaria deploys por um dado que é decisão humana) — recomendo, no máximo, um *warn* não-bloqueante no pipeline. O launch-gate aqui é **humano**: P0 antes de tornar a nova home a `/` pública.
- **Número fantasioso.** Se as 3 perguntas forem respondidas "no chute", a Cicatriz mente e tudo desaba. A métrica precisa ser rastreável a um projeto real (o doc fonte assume que o trabalho existe — só falta extrair o número).
- **Quebra de layout em telas pequenas.** O `clamp(3rem, 12vw, 7rem)` tem mínimo de `3rem`; conferir que `[___] meses` + unit não estouram a largura no menor breakpoint. O `max-width: 46ch` na caption segura a legenda.
- **Acoplamento de import.** Se 08 não importar `new-home.css`, o número não cresce e a Cicatriz vira texto comum — dependência explícita na seção 3.

## 9. Conexões

- Índice-mãe: [00-indice-mae.md](00-indice-mae.md)
- Dependências (precisam vir antes): [01-fundacao-arquitetura.md](01-fundacao-arquitetura.md) · [07-i18n-conteudo.md](07-i18n-conteudo.md) · [08-estilo-tokens-animacao.md](08-estilo-tokens-animacao.md)
- Vizinhança na ordem dos blocos: o Hero (Bloco 2) entrega o `<h1>` logo acima; a Tensão (Bloco 4) entra logo abaixo desta seção e assume que a Cicatriz já ocupa o espaço pós-hero.
