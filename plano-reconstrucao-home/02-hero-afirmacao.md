# 02. Hero / A Afirmação

> Entrega o Bloco 2 da reconstrução: o `<h1>` que crava a tese como o maior tipo da página, subhead que sussurra, tagline mono e UM CTA médio — a página afirma quem você é antes de pedir qualquer coisa de volta. Serve a Lei "10x, não 10%": é o movimento que troca o frame de "cardápio de garçom" por "manifesto".

## 1. Objetivo

Construir o **Bloco 2 — HERO / A AFIRMAÇÃO** (Seção 4 do doc fonte, hierarquia da Seção 6): um único `<h1>` = a tese `"Eu construo o sistema que funciona quando nada mais funciona."`, maior tipo da página inteira; subhead em corpo médio que sussurra; tagline pequena em mono/caixa-alta; e UM CTA médio `"Ver o que sobrevive ao campo"`. O nome e o ® **saem** do hero (viram assinatura no nav/rodapé — Bloco 6, child `06`). Governado pela lei do AGENTS.md **"Resolva o problema, não o pedido"** (o maior elemento tem que persuadir, não cumprimentar) e **"O mais simples que resolve vence"** (zero island novo, reaproveita o padrão `hn-word` e o island de scroll que já existe).

## 2. Arquivos afetados

| Caminho exato | Ação | Por que |
| --- | --- | --- |
| `adorable-azimuth/src/components/home/HeroAfirmacao.astro` | criar | Componente estático (sem estado/efeito) do hero: `<h1>` tese + subhead + tagline + 1 CTA. Recebe copy por props vindas do i18n. |
| `adorable-azimuth/src/styles/home.css` | editar | Acrescentar as regras `body.page-home .hero-*`, os `@keyframes` reusados e o bloco `prefers-reduced-motion`. (Arquivo criado/importado pela fundação — child `01`.) |
| `adorable-azimuth/src/styles/tokens.css` | editar | Tokens de tipografia fluida do hero (`--home-hero-size`, `--home-subhead-size`). Fica em `tokens.css` porque o token-gate **exclui** esse arquivo — clamp com `rem` aqui não vira violação. (Coordenar com child `08`.) |
| `adorable-azimuth/src/i18n/pt-br/home.json` | editar | Chaves do hero (`home.hero.thesis`, `home.hero.subhead`, `home.hero.tagline`, `home.hero.cta`). Remover chaves órfãs do design MorphingText. (Coordenar com child `07`.) |
| `adorable-azimuth/src/i18n/en/home.json` | editar | Espelho EN exato das mesmas chaves (paridade obrigatória no `check:i18n`). |
| `adorable-azimuth/src/pages/index.astro` | editar | Carregar `home` via `loadMessages`/`createT`, renderizar `<HeroAfirmacao>` com `locale="pt-br"`. Remover o objeto `data` hardcoded do hero. |
| `adorable-azimuth/src/pages/en/index.astro` | editar | Idem, `locale="en"`. |
| `adorable-azimuth/src/components/HomeHybridLanding.astro` | excluir | A bifurcação das duas portas morre (Lista de Morte §8). A **remoção** é orquestrada pela fundação (child `01`); este child entrega o hero que a substitui. |
| `adorable-azimuth/tests/i18n.spec.ts` | editar | As asserções de hero (`ENGENHEIRO DE SOFTWARE` / `SOFTWARE ENGINEER` e o seletor antigo) deixam de valer. Atualizar para o novo `#hero-thesis` e o texto da tese. (Não roda no CI, mas roda local com `pnpm test:e2e`.) |

## 3. Dependências

**Precisam existir antes deste:**
- [`01-fundacao-arquitetura.md`](01-fundacao-arquitetura.md) — esqueleto da nova home (composição de blocos nas páginas `index.astro`/`en/index.astro`, criação e import do `src/styles/home.css`, e a remoção de `HomeHybridLanding.astro`).
- [`07-i18n-conteudo.md`](07-i18n-conteudo.md) — copy canônica em `home.json` (PT/EN) com paridade de chaves; este child declara as 4 chaves de hero que `07` deve materializar.
- [`08-estilo-tokens-animacao.md`](08-estilo-tokens-animacao.md) — tokens de tipografia/cor da home e a casa canônica dos `@keyframes` (`homeWordRise`, `homeFadeUp`, `homeFadeIn`) reusados aqui.

**Dependem deste (contratos que este child publica):**
- [`03-cicatriz-prova.md`](03-cicatriz-prova.md) — o número da cicatriz é o maior tipo **do bloco dele**, mas tem que ficar visualmente **abaixo** do `<h1>` do hero (contrato: `--home-hero-size` máx. > tamanho do número). E o número é `<p>`/`<span>`, **nunca** `<h1>`.
- [`05-em-campo-toggle.md`](05-em-campo-toggle.md) — precisa expor `id="em-campo"` no `<section>` do bloco 5; o CTA do hero ancora em `href="#em-campo"`.
- [`06-cta-contato-rodape.md`](06-cta-contato-rodape.md) — recebe o nome/®/identidade que **saíram** do hero (vira assinatura pequena no nav e rodapé).

## 4. Implementação passo a passo

### Passo 1 — Declarar as chaves de hero no i18n (PT e EN, espelhadas)

Em `adorable-azimuth/src/i18n/pt-br/home.json`, garanta estas chaves (copy final na Seção 5). Em `adorable-azimuth/src/i18n/en/home.json`, as **mesmas chaves** com a tradução. Remova as chaves órfãs do MorphingText (`home.hero.tagline_prefix`, `home.hero.tagline_morph_1..3`, `home.hero.scroll_right`, `home.hero.role_line`, etc.) **dos dois arquivos ao mesmo tempo** — senão o `check:i18n` quebra por desbalanceamento. (A varredura completa de `home.json` é responsabilidade do child `07`; aqui só fixamos o contrato do hero.)

### Passo 2 — Criar o componente `HeroAfirmacao.astro`

`adorable-azimuth/src/components/home/HeroAfirmacao.astro`. Estático: sem `useState`, sem `<script>`, sem island (design-system REGRA: `.astro` é estático). A tese chega como **uma** string e é fatiada em palavras no frontmatter para reusar o padrão `hn-word`/`hn-inner` — generalizando o stagger de 3 palavras fixas (nth-child hardcoded no `HomeHybridLanding`) para N palavras via `animation-delay` calculado.

```astro
---
type Props = {
  thesis: string;     // home.hero.thesis  -> o ÚNICO <h1> da página
  subhead: string;    // home.hero.subhead
  tagline: string;    // home.hero.tagline
  ctaLabel: string;   // home.hero.cta
  ctaHref: string;    // âncora interna -> "#em-campo"
};
const { thesis, subhead, tagline, ctaLabel, ctaHref } = Astro.props as Props;

// Tese vira palavras pro rise. Stagger curto e COM TETO: a manchete
// resolve por ~1.1s, não vira caça-níquel quando a frase é longa.
const words = thesis.split(/\s+/).filter(Boolean);
const BASE = 0.15;   // s antes da 1a palavra
const STEP = 0.06;   // s entre palavras
const MAX  = 0.9;    // teto do atraso
const delayFor = (i: number) => Math.min(BASE + i * STEP, MAX).toFixed(2);
---
<section class="hero">
  <h1 id="hero-thesis" class="hero-thesis">
    {words.map((w, i) => (
      <Fragment>
        <span class="hn-word"
          ><span class="hn-inner" style={`animation-delay:${delayFor(i)}s`}>{w}</span></span
        >{" "}
      </Fragment>
    ))}
  </h1>

  <p class="hero-subhead">{subhead}</p>
  <p class="hero-tagline">{tagline}</p>

  <a class="hero-cta" href={ctaHref}>
    <span>{ctaLabel}</span>
    <span class="hero-cta__arrow" aria-hidden="true">→</span>
  </a>
</section>
```

Notas de borda que **não** são "depois":
- O `{" "}` depois de cada `.hn-word` é obrigatório: `.hn-word` é `inline-block` com `overflow:hidden`; sem o espaço explícito as palavras grudam. O espaço fica **fora** da região cortada.
- A pontuação final (`...funciona.`) sobe junto com a última palavra — comportamento desejado.
- A seta `→` é decorativa: `aria-hidden` e **fora** da string i18n. Leitor de tela lê só a frase.
- `id="hero-thesis"` é o gancho do teste e2e (substitui o seletor antigo).

### Passo 3 — Estilos do hero no `home.css` (escopo `body.page-home`)

Cole em `adorable-azimuth/src/styles/home.css`. Escopo global por `.page-home` (não `<style>` scoped do componente) **de propósito**: os `@keyframes` e o override de `prefers-reduced-motion` precisam enxergar as classes pelo nome real — classe com hash de Astro scoped quebraria o reduced-motion. É o mesmo padrão que o `HomeHybridLanding` já usava (`body.page-home ...`).

```css
/* ---- Bloco 2: HERO / A AFIRMAÇÃO ---- */
body.page-home .hero {
  max-width: var(--container-max);
  margin-inline: auto;
  padding-inline: var(--space-5);
  padding-block: clamp(var(--space-8), 12vh, var(--space-9));
  display: flex;
  flex-direction: column;
  align-items: flex-start;   /* manifesto à esquerda, não cumprimento centralizado */
  gap: var(--space-5);
  text-align: left;
}

/* O MAIOR tipo da página inteira. Tamanho vem de token (clamp mora em tokens.css). */
body.page-home .hero-thesis {
  font-family: 'Cormorant Garamond', serif;
  font-weight: var(--font-weight-bold);
  font-size: var(--home-hero-size);
  line-height: 1.04;
  letter-spacing: -0.02em;
  color: var(--ink-1);
  max-width: 18ch;           /* força ~3 linhas: densidade de manifesto */
  margin: 0;
}

/* Padrão de rise reaproveitado do HomeHybridLanding (.hn-word/.hn-inner). */
body.page-home .hn-word {
  display: inline-block;
  overflow: hidden;
  padding: 0.12em 0.04em;
  margin: -0.12em -0.04em;
  vertical-align: top;
}
body.page-home .hn-inner {
  display: inline-block;
  transform: translateY(115%);
  animation: homeWordRise 0.9s var(--ease-standard) forwards;
  /* animation-delay vem inline por palavra (frontmatter) */
}

/* Subhead: sussurra logo abaixo. */
body.page-home .hero-subhead {
  font-family: 'Cormorant Garamond', serif;
  font-weight: var(--font-weight-regular);
  font-size: var(--home-subhead-size);
  line-height: var(--line-height-relaxed);
  color: var(--ink-2);
  max-width: 46ch;
  margin: 0;
  opacity: 0;
  animation: homeFadeUp 0.7s var(--ease-standard) forwards 0.6s;
}

/* Tagline: sussurro técnico em mono/caixa-alta. */
body.page-home .hero-tagline {
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--font-size-sm);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-2);
  margin: 0;
  opacity: 0;
  animation: homeFadeUp 0.7s var(--ease-standard) forwards 0.75s;
}

/* UM CTA, médio. O botão grita; o resto sussurra. */
body.page-home .hero-cta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  border: var(--border-width-1) solid var(--color-border);
  border-radius: var(--radius-full);
  font-family: 'Syne', sans-serif;
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-base);
  color: var(--ink-1);
  text-decoration: none;
  opacity: 0;
  animation: homeFadeUp 0.8s var(--ease-standard) forwards 0.9s;
  transition: border-color var(--duration-fast) var(--ease-standard),
              background var(--duration-fast) var(--ease-standard),
              gap var(--duration-fast) var(--ease-standard);
}
body.page-home .hero-cta:hover {
  border-color: var(--accent-1);
  background: var(--surface-2);
  gap: var(--space-3);
}
body.page-home .hero-cta:focus-visible {
  outline: var(--border-width-1) solid var(--accent-1);
  outline-offset: var(--space-1);
}
body.page-home .hero-cta__arrow {
  transition: transform var(--duration-fast) var(--ease-standard);
}
body.page-home .hero-cta:hover .hero-cta__arrow {
  transform: translateX(var(--space-1));
}

/* Keyframes: definir UMA vez no home.css (compartilhados com cicatriz/tensão).
   Se o child 08 já os declarar, NÃO duplicar — referenciar. */
@keyframes homeWordRise { to { transform: translateY(0); } }
@keyframes homeFadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
@keyframes homeFadeIn { from { opacity: 0; } to { opacity: 1; } }

/* Acessibilidade: sem movimento, conteúdo aparece estático. */
@media (prefers-reduced-motion: reduce) {
  body.page-home .hero-subhead,
  body.page-home .hero-tagline,
  body.page-home .hero-cta {
    animation: none;
    opacity: 1;
  }
  body.page-home .hn-inner {
    animation: none;
    transform: none;
  }
}
```

### Passo 4 — Tokens de tipografia fluida (em `tokens.css`)

Acrescente ao bloco `@theme` de `adorable-azimuth/src/styles/tokens.css` (coordenado com `08`). Os `clamp()` com `rem` ficam **aqui** porque o `token-gate` exclui `tokens.css` — assim o `home.css` referencia só `var()` e fica verde:

```css
  /* Tipografia fluida da home (Bloco 2) */
  --home-hero-size: clamp(2.25rem, 6vw, 5rem);
  --home-subhead-size: clamp(1.05rem, 2vw, 1.3rem);
```

Contrato com `03`: o número da cicatriz deve usar um token de tamanho **menor** que `--home-hero-size` (ex.: máx. `4rem`), para o `<h1>` continuar o maior da página.

### Passo 5 — Wiring nas páginas (PT e EN)

`adorable-azimuth/src/pages/index.astro` (PT). O hero deixa de receber dados hardcoded; a copy vem do namespace `home`:

```astro
---
import BaseLayout from "@/components/BaseLayout.astro";
import HeroAfirmacao from "@/components/home/HeroAfirmacao.astro";
import { loadMessages, createT } from "@/i18n";
// ... demais blocos (03..06) importados pela composição do child 01

export const prerender = true;   // OBRIGATÓRIO: semantics-gate só vê dist/*.html

const locale = "pt-br";
const t = createT(loadMessages(locale, "home"), { locale, namespace: "home" });
---
<BaseLayout title={t("home.meta.title")} description={t("home.meta.description")}>
  <Fragment slot="nav"><!-- nav mínima: child 06 --></Fragment>

  <HeroAfirmacao
    thesis={t("home.hero.thesis")}
    subhead={t("home.hero.subhead")}
    tagline={t("home.hero.tagline")}
    ctaLabel={t("home.hero.cta")}
    ctaHref="#em-campo"
  />

  <!-- Bloco 3 (cicatriz), 4 (tensão), 5 (em campo + toggle), 6 (CTA final) -->

  <Fragment slot="footer"><!-- assinatura: child 06 --></Fragment>
</BaseLayout>
```

`adorable-azimuth/src/pages/en/index.astro` (EN): idêntico, trocando `const locale = "en"`. `ctaHref` continua `"#em-campo"` (âncora na mesma página). Mantenha `export const prerender = true`.

O CTA não precisa de JS novo: `NavTransitions.island` (já `client:load` no `BaseLayout`) intercepta `href` começando com `#`, dá `preventDefault` e faz scroll suave até `getElementById("em-campo")`, com fallback `scrollIntoView` quando `prefers-reduced-motion` (ver `src/islands/NavTransitions.island.tsx:36-60`). Logo, o `id="em-campo"` precisa existir no Bloco 5 — contrato publicado em §3.

## 5. Copy

Sem `[___]` neste bloco: a copy do hero é **final** (os placeholders urgentes vivem no Bloco 3 — child `03`).

**PT (colável — Seção 4 do doc fonte):**

| Chave | Valor |
| --- | --- |
| `home.hero.thesis` | `Eu construo o sistema que funciona quando nada mais funciona.` |
| `home.hero.subhead` | `Produtos web e mobile offline-first, com integrações críticas que aguentam o campo — não só o ambiente controlado da demo.` |
| `home.hero.tagline` | `Offline. Sob carga. Em campo. Continua de pé.` |
| `home.hero.cta` | `Ver o que sobrevive ao campo` |

**EN (tradução de referência — espelhar as mesmas chaves):**

| Chave | Valor |
| --- | --- |
| `home.hero.thesis` | `I build the system that works when nothing else does.` |
| `home.hero.subhead` | `Offline-first web and mobile products, with critical integrations built to hold up in the field — not just the controlled environment of a demo.` |
| `home.hero.tagline` | `Offline. Under load. In the field. Still standing.` |
| `home.hero.cta` | `See what survives the field` |

**Tokens PT banidos no EN** (`check-en-no-pt`, fronteira de palavra, case-insensitive): `portaria, custo, tempo, projetos, contato, latência, disponível, evidência, risco, qualidade`. A copy EN acima foi escrita evitando-os. Cuidados ao revisar:
- "tempo" → use `time`/`duration`. "projetos" → use `work`/`cases` (e note que o inglês `projects` **não** casa com `projetos`, mas evite ambiguidade). "risco" → `risk`. "custo" → `cost`. "qualidade" → `quality`. "contato" → `contact`. Nenhuma palavra EN do hero coincide com a lista — confirmado.

**Meta (recomendação, domínio do child `07`):** `home.meta.title`/`home.meta.description` devem ecoar a tese (ex.: PT `Victor de Alcântara Bueno — Construo software para o pior dia`; EN `Victor de Alcântara Bueno — I build software for the worst day`). O `<title>` e a `<meta name="description">` únicos já vêm do `BaseLayout` (semantics-gate satisfeito pelo layout).

## 6. Conformidade com gates

- **semantics-gate (um único `<h1>`):** o **único** `<h1>` da página é `.hero-thesis`. Cicatriz/tensão/em-campo/CTA usam `<h2>`/`<p>`. Conferir em `dist/index.html` e `dist/en/index.html` que `h1 count == 1`. `<nav>/<main>/<footer>/<title>/meta` já vêm do `BaseLayout`. `prerender = true` mantido nas duas páginas (sem `.html` no `dist`, o gate falha por falta de amostra).
- **check-en-no-pt:** copy EN do hero (tese/subhead/tagline/CTA) não contém nenhum dos 10 tokens PT banidos. Conferido palavra a palavra na §5.
- **check:i18n (paridade de chaves):** as 4 chaves novas (`home.hero.thesis|subhead|tagline|cta`) entram em `pt-br/home.json` **e** `en/home.json` no mesmo commit; chaves órfãs do MorphingText saem dos **dois** arquivos juntas. Conjuntos de chaves idênticos por arquivo.
- **js-budget (≤150KB):** zero island novo. O CTA reusa `NavTransitions.island` que já está carregado. O rise é CSS puro (`@keyframes`). Delta de JS = 0KB.
- **token-gate (informativo):** `home.css` referencia só `var()`; os únicos valores fluidos crus (`clamp` com `rem`) ficam em `tokens.css`, que o gate **exclui**. `outline`/bordas usam `--border-width-1`; espaçamentos usam `--space-*`. `em`/`ch`/`vh`/`s` e `line-height` unitless não são padrões vigiados pelo gate. Resultado esperado: este child **não adiciona** violação de token.
- **docs-gate:** não toca em arquivos de fundação nem em `docs/modulos/*`. A pasta `plano-reconstrucao-home/` não é varrida. Se o child `01` adicionar uma seção "Home" em `ARQUITETURA.md`, é lá que se renova o rodapé "Última revisão:" — não aqui.
- **islands-gate:** nenhum `.tsx` criado fora de `src/islands/`. `HeroAfirmacao.astro` é `.astro` estático.
- **components-standard-gate / design-system:** componente `.astro` sem estado/efeito; CSS modular escopado em `.page-home`, em arquivo temático (`home.css`), não no monólito.

## 7. Critérios de aceitação

- [ ] `dist/index.html` e `dist/en/index.html` têm **exatamente um** `<h1>`, e o conteúdo dele é a tese.
- [ ] O `<h1>` é, de fato, o maior tipo renderizado da página (maior que o número da cicatriz no Bloco 3).
- [ ] Ordem visual no hero: tese → subhead → tagline (mono/caixa-alta) → **um** CTA. Sem segundo CTA, sem grade de duas portas.
- [ ] Nenhum nome próprio nem `®` aparece no hero (migraram para nav/rodapé — child `06`).
- [ ] As palavras da tese sobem (rise) com stagger; a manchete resolve em ~1.1s; com `prefers-reduced-motion: reduce` tudo aparece estático (sem rise, sem fade).
- [ ] Espaços entre palavras preservados (sem palavras grudadas) em PT e EN.
- [ ] CTA `#em-campo` rola suave até o Bloco 5; com reduced-motion, salta via `scrollIntoView`.
- [ ] `pnpm check:i18n` verde (paridade PT/EN); `pnpm run build` verde; `semantics`, `islands`, `js-budget` verdes.
- [ ] `node scripts/check-en-no-pt.mjs` (ou o passo equivalente do CI) verde para as páginas EN.
- [ ] `tests/i18n.spec.ts` atualizado: assere `#hero-thesis` contém a tese PT/EN (não mais `ENGENHEIRO DE SOFTWARE`).

## 8. Decisões cravadas e riscos

**Cravado:**
- **Manchete à esquerda, não centralizada.** Abri mão da simetria "de portfólio" do hero antigo (centralizado). Frase longa alinhada à esquerda com borda direita irregular **lê como afirmação**, não como saudação — e fixa o ritmo dos blocos seguintes. Trade-off: exige que cicatriz/tensão respeitem o mesmo eixo (contrato pro `08`/`01`).
- **Stagger por palavra, com teto, calculado no frontmatter.** Mata o `nth-child(1..3)` hardcoded do `HomeHybridLanding` (que só servia a um nome de 3 palavras). Agora N palavras em PT ou EN sobem sozinhas, sem editar CSS por idioma. Abri mão de delays "artesanais" por palavra — o teto de 0.9s evita virar caça-níquel numa frase de 10 palavras.
- **Zero island novo; CTA é âncora.** O CTA reaproveita o `NavTransitions.island` já carregado em vez de criar comportamento próprio. Delta de JS = 0KB — o orçamento apertado (150KB) fica intocado para o toggle do Bloco 5.
- **Eyebrow (scramble) deletado.** Não está no hero da Seção 4 do doc fonte; é o "mais simples que resolve". Remove um `<script>` inline. Se `08` quiser um kicker, é aditivo.
- **Tamanhos fluidos como token em `tokens.css`.** Mantém o `home.css` 100% em `var()` e o token-gate verde, sem brigar com a ausência de tokens de tipografia fluida no sistema atual.

**Riscos / bombas-relógio:**
- **`tests/i18n.spec.ts` vai quebrar local** ao trocar a copy do hero — está previsto (§2). Não roda no CI, mas atualizar antes do `push` ou o `pnpm test:e2e` fica vermelho.
- **Contrato `#em-campo`:** se o Bloco 5 (child `05`) não expuser `id="em-campo"`, o CTA vira clique morto (NavTransitions faz `return` quando `getElementById` é `null`). Aceitação do hero **depende** de `05` honrar o id.
- **Paleta de cor:** `tokens.css` hoje é coral/slate (`--accent-1 = #d65a52`), não o âmbar/charcoal do hero antigo. A identidade visual da home é decisão do `08`. Este child referencia `--accent-1`/`--ink-1`/`--surface-2`; se `08` cravar âmbar, basta remapear esses tokens (ou definir `--home-accent`) — o hero acompanha sem reescrever regra.
- **`max-width: 18ch` na tese:** se `07` trocar a tese por uma frase muito mais longa/curta, revisar o `18ch` para manter ~3 linhas. Acoplamento leve copy↔layout, documentado aqui.

## 9. Conexões

- Índice-mãe: [`00-indice-mae.md`](00-indice-mae.md)
- Depende de: [`01-fundacao-arquitetura.md`](01-fundacao-arquitetura.md), [`07-i18n-conteudo.md`](07-i18n-conteudo.md), [`08-estilo-tokens-animacao.md`](08-estilo-tokens-animacao.md)
- Publica contratos para: [`03-cicatriz-prova.md`](03-cicatriz-prova.md), [`05-em-campo-toggle.md`](05-em-campo-toggle.md), [`06-cta-contato-rodape.md`](06-cta-contato-rodape.md)
