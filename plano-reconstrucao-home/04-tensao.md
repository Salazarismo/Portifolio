# 04. A Tensão (o inimigo)

> Este plano entrega o Bloco 4 da nova home — a TENSÃO: nomear o inimigo (o happy path / a demo) e cravar visualmente o contraste entre o mundo controlado da demo e o "pior dia" em campo. Serve o **Bloco 4 — A TENSÃO** da autópsia (`da-autopsia-ao-bisturi-reconstrucao.md`, Seções 3, 4 "CORPO 1 — A TENSÃO" e 6).

## 1. Objetivo

Construir a seção de tensão da home: um `<section>` com **um `<h2>`** (o motivo recorrente "para o pior dia, não para a demo") e **um `<p>`** que carrega o CORPO 1 da autópsia, com o destaque visual do contraste entre `happy path` (dimmed, riscado) e `campo` (vivo, com barra de acento). É a **única** tensão da página — tipo médio, o que grita é o contraste, não o tamanho.

Bloco da autópsia: **Bloco 4 — A TENSÃO** (Seção 3) + copy da Seção 4 ("CORPO 1 — A TENSÃO") + hierarquia da Seção 6 ("TENSÃO. Tipo médio. O que grita é o contraste"). Lei do AGENTS.md que governa: *resolva o problema, não só o pedido* (o inimigo dá emoção à tese) e *o mais simples que resolve vence* (seção 100% estática, zero JS, contraste por CSS). Lei dos gates: **exatamente um `<h1>` por página** — esta seção é `<h2>`, nunca `<h1>`.

## 2. Arquivos afetados

| Caminho exato | Ação | Por que |
|---|---|---|
| `adorable-azimuth/src/components/home/TensionSection.astro` | criar | Componente estático (.astro, sem estado/efeito — design-system REGRA) que renderiza a seção. Recebe strings já resolvidas via props, no mesmo padrão de `HomeHybridLanding.astro`. |
| `adorable-azimuth/src/styles/home.css` | editar (arquivo criado em [08](08-estilo-tokens-animacao.md)) | Adicionar o bloco de regras `.hm-tension*` com o destaque do contraste, usando apenas tokens de `tokens.css`. Se 08 nomear o stylesheet temático de outra forma, colar as mesmas regras lá. |
| `adorable-azimuth/src/i18n/pt-br/home.json` | editar | Adicionar as 4 chaves `home.tension.*` (PT). |
| `adorable-azimuth/src/i18n/en/home.json` | editar | Espelhar as 4 chaves `home.tension.*` (EN) — paridade exigida pelo `check:i18n`. |
| `adorable-azimuth/src/pages/index.astro` | editar (montagem definida em [01](01-fundacao-arquitetura.md)) | Resolver `t('home.tension.*')` e montar `<TensionSection .../>` na ordem dos blocos (depois da Cicatriz, antes de Em Campo). |
| `adorable-azimuth/src/pages/en/index.astro` | editar (montagem definida em [01](01-fundacao-arquitetura.md)) | Idem, com `locale = "en"`. |

> Observação de fronteira: a pasta `plano-reconstrucao-home/` na raiz **não** é varrida pelo docs-gate (só varre fundação + `docs/modulos/`), então este `.md` é livre de gate. Os arquivos sob `adorable-azimuth/src/` é que precisam respeitar os gates da Seção 6.

## 3. Dependências

**Precisam existir antes deste:**
- [01-fundacao-arquitetura.md](01-fundacao-arquitetura.md) — define o shell da nova home (qual componente compõe as seções, em que ordem, e onde a página chama `loadMessages`/`createT`). Esta seção apenas pluga no slot que 01 abre.
- [07-i18n-conteudo.md](07-i18n-conteudo.md) — dono do inventário global do namespace `home`. Este bloco **acrescenta** as 4 chaves `home.tension.*`; 07 garante a paridade e a estratégia de expansão.
- [08-estilo-tokens-animacao.md](08-estilo-tokens-animacao.md) — cria o stylesheet temático da home (`src/styles/home.css`), define a paleta da página via tokens, o prefixo de classe (`.hm-*`) e o tratamento de `prefers-reduced-motion`. Este bloco adiciona regras `.hm-tension*` lá dentro.

**Dependem deste:** nenhum bloqueia, mas o **Bloco 5 (Em Campo + Toggle)** lê emocionalmente logo após a tensão; manter o ritmo de `<section>` consistente com o que 05 define. A Cicatriz (Bloco 3) vem imediatamente antes — a tensão pressupõe que o número já bateu.

## 4. Implementação passo a passo

### Passo 1 — Criar o componente `TensionSection.astro`

Caminho: `adorable-azimuth/src/components/home/TensionSection.astro` (criar a pasta `home/` se 01 ainda não criou). Componente **estático**: nada de hooks, nada de `<script>`. Recebe strings já resolvidas (mesmo contrato de `HomeHybridLanding.astro`, que recebe `eyebrow`, `title`, etc.).

```astro
---
type Props = {
  titleField: string;   // promessa, brilha
  titleDemo: string;    // inimigo, riscado
  leadDemo: string;     // o mundo da demo (dimmed)
  leadField: string;    // o mundo do campo (vivo)
  anchorId?: string;
};

const {
  titleField,
  titleDemo,
  leadDemo,
  leadField,
  anchorId = "tensao",
} = Astro.props as Props;
---
<section id={anchorId} class="hm-tension" aria-labelledby={`${anchorId}-title`}>
  <div class="hm-tension__inner">
    <h2 id={`${anchorId}-title`} class="hm-tension__title">
      <span class="hm-tension__title-field">{titleField}</span>
      <span class="hm-tension__title-demo">{titleDemo}</span>
    </h2>

    <p class="hm-tension__lead">
      <span class="hm-tension__demo">{leadDemo}</span>
      <span class="hm-tension__field">{leadField}</span>
    </p>
  </div>
</section>
```

Notas de markup:
- **Um único `<h2>`** com dois `<span>` filhos (não dois headings) — preserva a contagem `h1 == 1` da página e mantém o título como um só nó semântico.
- O `<p>` é **um só parágrafo** (um pensamento), dividido em dois `<span>` de display block para o contraste visual — não vira dois `<p>`, não vira lista.
- `anchorId` default `tensao` (não é palavra PT banida) — serve a âncora/scroll; estável nos dois locales.
- Sem `client:*`, sem `<script>`: **zero JS** entra no bundle por causa desta seção.

### Passo 2 — Adicionar as regras de contraste em `home.css`

Anexar ao stylesheet temático criado em [08](08-estilo-tokens-animacao.md). Tudo escopado em `.page-home` (o `<body>` recebe `page-home` via `BaseLayout.astro`) e **só tokens** de `tokens.css` — sem px/rem/#hex/hsl crus, para manter o token-gate verde.

```css
/* Bloco 4 — A Tensão (o inimigo). Contraste happy path vs. campo. */
.page-home .hm-tension {
  scroll-margin-top: var(--space-8);
}

.page-home .hm-tension__inner {
  max-width: var(--container-max);
  margin-inline: auto;
  padding-inline: clamp(var(--space-5), 5vw, var(--space-7));
  padding-block: clamp(var(--space-8), 10vw, var(--space-9));
}

.page-home .hm-tension__title {
  margin: 0 0 var(--space-6);
  font-size: clamp(var(--space-6), 4vw, var(--space-8)); /* tipo medio: cresce, mas nao grita como o H1 */
  line-height: var(--line-height-tight);
  letter-spacing: -0.02em;
  font-weight: var(--font-weight-bold);
  text-wrap: balance;
}

/* a promessa: viva */
.page-home .hm-tension__title-field {
  display: block;
  color: var(--color-text);
}

/* o inimigo: riscado e apagado */
.page-home .hm-tension__title-demo {
  display: block;
  color: var(--color-secondary);
  text-decoration: line-through;
  text-decoration-color: var(--color-primary);
}

.page-home .hm-tension__lead {
  margin: 0;
  max-width: 62ch;
  font-size: var(--font-size-xl);            /* corpo medio */
  line-height: var(--line-height-relaxed);
}

/* mundo da demo: dimmed, recua */
.page-home .hm-tension__demo {
  display: block;
  color: var(--color-secondary);
}

/* mundo do campo: brilha, avanca com barra de acento */
.page-home .hm-tension__field {
  display: block;
  margin-top: var(--space-4);
  padding-left: var(--space-4);
  border-left: var(--border-width-1) solid var(--color-primary);
  color: var(--color-text);
  font-weight: var(--font-weight-medium);
}
```

O **destaque visual do contraste** (o que a autópsia pede em "destaque visual em 'happy path' contra 'campo' / 'pior dia'") é cravado por três opostos simultâneos:
1. **Cor**: demo em `--color-secondary` (apagado) vs. campo em `--color-text` (cheio).
2. **Riscado**: o `<span>` "Não para a demo." leva `line-through` com `text-decoration-color: var(--color-primary)` — o inimigo aparece literalmente cortado, no acento da marca.
3. **Avanço espacial**: o bloco do campo ganha `border-left` no acento + `padding-left` — ele "entra em cena", o mundo real começa ali.

### Passo 3 — Adicionar as chaves de copy (PT e EN)

Em `adorable-azimuth/src/i18n/pt-br/home.json`, acrescentar (a copy exata está na Seção 5):

```json
"home.tension.title_field": "Software para o pior dia.",
"home.tension.title_demo": "Não para a demo.",
"home.tension.lead_demo": "Quase todo software é construído para o happy path: boa conexão, dados limpos, tudo no lugar. O seu problema não vive lá.",
"home.tension.lead_field": "Ele vive no galpão sem sinal, no dispositivo que passou doze horas no sol, na integração que precisa responder mesmo quando o outro lado caiu. É pra esse mundo que eu construo."
```

Em `adorable-azimuth/src/i18n/en/home.json`, espelhar **as mesmas chaves** (paridade obrigatória — `check:i18n`):

```json
"home.tension.title_field": "Built for the worst day.",
"home.tension.title_demo": "Not for the demo.",
"home.tension.lead_demo": "Almost all software is built for the happy path: good connection, clean data, everything in place. Your problem doesn't live there.",
"home.tension.lead_field": "It lives in the warehouse with no signal, in the device that spent twelve hours in the sun, in the integration that has to respond even when the other side goes down. That's the world I build for."
```

### Passo 4 — Montar a seção nas páginas (PT e EN)

A montagem final é orquestrada por [01](01-fundacao-arquitetura.md); este bloco entrega o trecho concreto. Em `adorable-azimuth/src/pages/index.astro` (PT), no frontmatter já existente que resolve o `t` da home (padrão de `Header.astro`):

```astro
---
import { loadMessages, createT } from "@/i18n";
import TensionSection from "@/components/home/TensionSection.astro";

const locale = "pt-br"; // "en" na pagina EN
const tHome = createT(loadMessages(locale, "home"), { locale, namespace: "home" });
---
<!-- ...HERO (h1) ...CICATRIZ... -->
<TensionSection
  titleField={tHome("home.tension.title_field")}
  titleDemo={tHome("home.tension.title_demo")}
  leadDemo={tHome("home.tension.lead_demo")}
  leadField={tHome("home.tension.lead_field")}
/>
<!-- ...EM CAMPO + TOGGLE... -->
```

Em `adorable-azimuth/src/pages/en/index.astro`, idêntico, trocando `const locale = "en"`. A assinatura `createT(messages, { locale, namespace })` é a real de `src/i18n/index.ts`; o alias `@/i18n` resolve para `src/i18n`. Como a copy vem por `t()`, o markup do `.astro` não carrega texto PT — o EN é resolvido em build a partir de `en/home.json`.

### Passo 5 — Verificar localmente

```text
cd adorable-azimuth
pnpm check:i18n        # paridade das chaves home.tension.*
pnpm build             # prerender gera dist/index.html e dist/en/index.html
node scripts/semantics-gate.cjs   # h1 == 1, nav/main/footer presentes
node scripts/check-en-no-pt.mjs   # nenhuma palavra PT banida em src/pages/en
node scripts/js-budget.cjs        # bundle inalterado por esta seção
```

## 5. Copy

**CORPO 1 — A TENSÃO (PT, colável — Seção 4 da autópsia):**

- `title_field` (promessa, brilha): **Software para o pior dia.**
- `title_demo` (inimigo, riscado): **Não para a demo.**
- `lead_demo` (mundo da demo, dimmed): *Quase todo software é construído para o happy path: boa conexão, dados limpos, tudo no lugar. O seu problema não vive lá.*
- `lead_field` (mundo do campo, vivo): *Ele vive no galpão sem sinal, no dispositivo que passou doze horas no sol, na integração que precisa responder mesmo quando o outro lado caiu. É pra esse mundo que eu construo.*

O parágrafo da autópsia é uma frase só; a divisão demo/campo segue exatamente o ponto de virada do texto ("O seu problema não vive lá." → "Ele vive no galpão sem sinal..."). O `<h2>` é o motivo recorrente (headline #2 da Seção 2: "Software para o pior dia — não para a demo"), aqui quebrado em duas linhas para o contraste.

**Tradução EN de referência:**

- `title_field`: **Built for the worst day.**
- `title_demo`: **Not for the demo.**
- `lead_demo`: *Almost all software is built for the happy path: good connection, clean data, everything in place. Your problem doesn't live there.*
- `lead_field`: *It lives in the warehouse with no signal, in the device that spent twelve hours in the sun, in the integration that has to respond even when the other side goes down. That's the world I build for.*

**Tokens PT banidos a evitar no EN** (`check-en-no-pt.mjs`, fronteira de palavra, case-insensitive): `portaria`, `custo`, `tempo`, `projetos`, `contato`, `latência`, `disponível`, `evidência`, `risco`, `qualidade`. Conferido: nenhuma aparece no EN acima — em especial usei "twelve hours" (não "tempo") e descrições concretas (não "evidência"/"qualidade"/"risco"). O termo de jargão "happy path" é mantido verbatim nos dois locales (já é assim na copy-fonte PT).

**Faltam dados reais?** Não. O CORPO 1 da autópsia está 100% escrito; os únicos `[___]` da autópsia pertencem à **Cicatriz** (Bloco 3), não a este bloco. Nada a perguntar aqui.

## 6. Conformidade com gates

- **semantics-gate (um único `<h1>`?):** SIM — esta seção usa `<h2>`. O `<h1>` é exclusivo do hero (Bloco 2). `<nav>`/`<main>`/`<footer>` já vêm do `BaseLayout.astro`; a seção mora dentro do `<main>`. Verde.
- **check-en-no-pt:** as strings EN vivem em `src/i18n/en/home.json` (fora do alvo do gate, que só varre `src/pages/en/**`); ainda assim foram escritas sem nenhuma palavra banida. O markup montado em `src/pages/en/index.astro` (classes `hm-tension*`, id `tensao`, `aria-labelledby`) não contém palavra PT banida. Verde por dupla garantia.
- **check:i18n (paridade de chaves):** as 4 chaves `home.tension.*` são adicionadas em `pt-br/home.json` **e** `en/home.json` no mesmo commit — conjuntos idênticos. Verde.
- **js-budget (≤ 150KB):** esta seção é `.astro` estática, sem island e sem `<script>`. Acréscimo ao bundle: **0 KB**. Verde por construção.
- **token-gate (informativo):** todas as regras CSS usam `var(--token)`; sem px/rem/#hex/hsl crus. As medidas responsivas usam `clamp()` com tokens (sem `@media` de breakpoint em px), `vw`/`ch`/`em` não são flagados. Verde (e o gate é não-bloqueante de qualquer modo).
- **docs-gate:** este bloco adiciona componente + CSS + chaves i18n — nenhum deles é doc de fundação ou de módulo. Sem impacto. (Se 01 documentar a home em `ARQUITETURA.md`, renovar o rodapé "Última revisão:" é tarefa de 01.) Verde/N-A.

## 7. Critérios de aceitação

- [ ] `TensionSection.astro` existe em `src/components/home/`, é estático (sem hooks, sem `<script>`) e renderiza um `<section>` com **um** `<h2>` e **um** `<p>`.
- [ ] As 4 chaves `home.tension.*` existem em `pt-br/home.json` e `en/home.json` com conjuntos idênticos; `pnpm check:i18n` passa.
- [ ] As páginas PT e EN montam `<TensionSection>` entre a Cicatriz e o bloco Em Campo, com a copy vindo de `t()` (nada hardcoded no markup).
- [ ] No `pnpm build`, `dist/index.html` e `dist/en/index.html` continuam com **exatamente um** `<h1>`; `semantics-gate.cjs` passa.
- [ ] `check-en-no-pt.mjs` passa (nenhuma palavra PT banida em `src/pages/en`).
- [ ] Visualmente: "Não para a demo." aparece riscado/apagado; o bloco do campo aparece vivo, com barra de acento à esquerda; o contraste é a coisa mais legível da seção.
- [ ] `js-budget.cjs` reporta o mesmo total de antes (esta seção não adiciona JS).
- [ ] As regras CSS estão no stylesheet temático de 08, escopadas em `.page-home`, só com tokens.

## 8. Decisões cravadas e riscos

**Cravado — o contraste é a única tensão, e ele é tipográfico/cromático, não decorativo.** Nada de ilustração, ícone de raio ou caixa "antes/depois". A seção é texto: a demo apagada e riscada no acento, o campo vivo e avançando. É o mais simples que entrega a emoção que a autópsia pede (Seção 6: "deixa ela aparecer").

**Cravado — o `<h2>` é o motivo recorrente "pior dia, não demo", quebrado em duas linhas.** Em vez de um título genérico ("A tensão"), o heading já é o contraste. A linha 1 promete, a linha 2 risca o inimigo. Abri mão de um título-rótulo neutro em favor de um título que já trabalha.

**Cravado — sem fragmentar o i18n por palavra.** Considerei isolar o termo "happy path" em chave própria para riscá-lo no meio da frase; **rejeitado** — fragmentaria a copy em 3 chaves por sentença e dificultaria a tradução. O contraste é carregado pela divisão demo/campo (dois `<span>` de bloco) + o `<h2>` riscado. Abri mão do risco palavra-a-palavra; ganhei copy íntegra e i18n limpo.

**Cravado — seção 100% estática, zero island.** A tensão não tem interação. Resolver com CSS preserva o js-budget e evita conflito com os scripts inline que ainda existirem na home durante a transição.

**Riscos / bombas-relógio:**
- **Paleta da página depende de 08.** Uso `--color-text`/`--color-secondary`/`--color-primary` de `tokens.css`. Se 08 ainda não tiver definido o fundo escuro da nova home (a antiga vinha do `is:global` de `HomeHybridLanding`, que será morto), o contraste pode ficar com baixo contraste sobre fundo claro. **Mitigação:** 08 deve cravar o fundo da `.page-home` antes de validar visualmente esta seção.
- **`global.css` exclui `.page-home` de `[data-sr]`/transições.** Se alguém quiser um scroll-reveal aqui, o mecanismo `GsapInit`/`data-sr` não dispara sob `page-home` sem 08 reabilitar. **Decisão:** manter a seção sem reveal (estática) — qualquer animação fica sob responsabilidade e regras de `prefers-reduced-motion` de 08.
- **Contrato de props pode divergir de 01.** Se 01 optar por inline das seções num único `HomeManifesto.astro` em vez de partials, colar o markup do Passo 1 diretamente lá e ler as mesmas 4 chaves. O conteúdo não muda.
- **`line-through` legível?** O risco fica só no `<h2>` curto ("Não para a demo."), nunca no parágrafo inteiro — riscar um parágrafo longo prejudicaria a leitura. Mantido curto de propósito.

## 9. Conexões

- Índice-mãe: [00-indice-mae.md](00-indice-mae.md)
- Dependências diretas: [01-fundacao-arquitetura.md](01-fundacao-arquitetura.md) · [07-i18n-conteudo.md](07-i18n-conteudo.md) · [08-estilo-tokens-animacao.md](08-estilo-tokens-animacao.md)
- Vizinhos de leitura (ordem dos blocos): a Cicatriz (Bloco 3) vem imediatamente antes; Em Campo + Toggle (Bloco 5) vem logo depois — manter o ritmo de `<section>` coerente com o que esses blocos definirem.
