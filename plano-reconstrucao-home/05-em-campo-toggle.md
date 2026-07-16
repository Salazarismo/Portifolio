# 05. Em Campo + Toggle recrutador/cliente

> Entrega o Bloco 5 da nova home — as três provas compartilhadas (CORPO 2) e o segmented control discreto recrutador/cliente que troca apenas a ênfase (CORPO 3) e alimenta o CTA do Bloco 6, tudo por **CSS-swap via `data-mode`** com uma única island barata. Serve a lei do AGENTS.md "o mais simples que resolve vence" e "erros e bordas não são depois".

---

> **⚠️ Reconciliação — ver [índice-mãe](00-indice-mae.md) §4.3.** Este é o dono do toggle e já alinha em `#home-root[data-mode]`, padrão `recruiter`, sem persistência e âncora `#em-campo`. Ajuste só a classe de variação para a canônica **`.hm-when-recruiter`/`.hm-when-client`** (não `.is-mode-*`) e o prefixo **`.hm-*`**.

## 1. Objetivo

Construir o **Bloco 5 — EM CAMPO + TOGGLE** descrito na Seção 3 e 4 (CORPO 2, CORPO 3, microcopy do toggle) do `da-autopsia-ao-bisturi-reconstrucao.md`: três provas de "como eu construo" (idênticas nos dois modos) + um toggle discreto que muda **só** a ênfase do bloco 5 e o texto do CTA final, sem refazer hero/cicatriz/tensão e **sem reload**. Governa este filho a lei do AGENTS.md "Tenha opinião de design. Crave." (CSS-swap vence re-render) e "O mais simples que resolve de verdade vence" (uma island reusando `SegmentedButton`, zero dependência nova).

---

## 2. Arquivos afetados

| Caminho exato | Ação | Por quê |
|---|---|---|
| `adorable-azimuth/src/islands/ModeToggle.tsx` | criar | Island wrapper minúscula que reusa `SegmentedButton` e flipa o `data-mode` do `#home-root`. É o único controlador. |
| `adorable-azimuth/src/islands/SegmentedButton.tsx` | editar | Completar o contrato de `radiogroup`: roving por setas/Home/End (hoje só tem `tabIndex` rotativo, sem teclas — um teclado não consegue trocar de opção). Conserta também o header. |
| `adorable-azimuth/src/components/home/EmCampo.astro` | criar | Seção estática (`<section>`/`<h2>`/`<ul>`) com CORPO 2 (3 provas) + CORPO 3 (as DUAS variantes no DOM) + embed do island. `.astro` sem estado (design-system REGRA). |
| `adorable-azimuth/src/pages/index.astro` | editar | Montar `<EmCampo>` dentro do `#home-root` (PT), passando `locale`/`t`. |
| `adorable-azimuth/src/pages/en/index.astro` | editar | Idem (EN). |
| `adorable-azimuth/src/i18n/pt-br/home.json` | editar | Chaves `home.field.*` + `home.toggle.*`. |
| `adorable-azimuth/src/i18n/en/home.json` | editar | Espelho EN, mesmo conjunto de chaves. |
| `adorable-azimuth/src/styles/home.css` | editar/criar | Classes `.ec-*` da seção + a regra de swap `[data-mode]`. Arquivo temático do 08 (`08-estilo-tokens-animacao.md`); importado por `global.css` ao lado de `new-landing.css`. As classes `.nl-seg*` já existem em `new-landing.css` e são reaproveitadas. |

> Caminhos reais confirmados: `new-landing.css` é importado em `src/styles/global.css` (linha 3); `SegmentedButton`/`HeaderNavSegmented` vivem em `src/islands/`; `loadMessages`/`createT` em `src/i18n/index.ts`; o gate de islands exige `.tsx` **só** em `src/islands/`.

---

## 3. Dependências

**Precisam existir antes:**
- [01-fundacao-arquitetura.md](01-fundacao-arquitetura.md) — define o shell da home e, principalmente, o **wrapper `#home-root` com `data-mode="recruiter"` no SSR** que envolve todas as seções (fonte única de verdade do modo). Define a ordem dos blocos e a âncora `#em-campo`.
- [07-i18n-conteudo.md](07-i18n-conteudo.md) — reativa `home.json` (hoje órfão, com chaves do MorphingText antigo) e faz a página chamar `loadMessages(locale, 'home')` + `createT`. Este filho **adiciona** chaves; a limpeza das legadas é do 07.
- [08-estilo-tokens-animacao.md](08-estilo-tokens-animacao.md) — registra o stylesheet temático da home (`home.css`) e os tokens (`--space-*`, `--color-*`, `--ease-standard`...). As `.nl-seg*` já existem.
- **Módulo interatividade** (`docs/modulos/interatividade/`) — convenções de island, orçamento de JS, degradação progressiva. `ModeToggle` entra no inventário desse módulo.

**Dependem deste:**
- [06-cta-contato-rodape.md](06-cta-contato-rodape.md) — o CTA final **lê** o `data-mode` deste contrato (renderiza ambas as variantes e esconde a inativa por CSS). Não há JS no Bloco 6: ele só consome a verdade que o island do Bloco 5 escreve.

---

## 4. Implementação passo a passo

### Mecânica cravada: CSS-swap, não re-render

**Renderiza-se AMBAS as variantes (CORPO 3 + CTA) no SSR/prerender** e alterna-se via CSS por um único atributo `data-mode` no `#home-root`. A island não constrói/destrói DOM nem refaz a página — só troca uma string de atributo. Isso dá: SSR/prerender intacto (semantics-gate feliz), um modo visível sem JS (degradação), custo de JS quase nulo (sem re-render, sem template no cliente), zero CLS no load. Trade-off explícito na Seção 8.

A verdade do modo mora em **um lugar**: `#home-root[data-mode]`. **Dois consumidores** (CORPO 3 no Bloco 5, CTA no Bloco 6) leem por CSS. **Um controlador** (a island `ModeToggle`) escreve.

### Passo 1 — Regra de swap + estilos da seção (em `src/styles/home.css`)

```css
/* ===== Bloco 5 — Em Campo ===== */
.ec {
  padding-block: calc(var(--space-9) * 1.5) var(--space-9);
}
.ec-inner {
  width: 100%;
  max-width: var(--container-max);
  margin-inline: auto;
  padding-inline: var(--space-7);
}
.ec-kicker {
  font-family: var(--font-mono, ui-monospace, monospace); /* JetBrains Mono já carregada na home */
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: var(--space-3);
  color: var(--color-primary);
}
.ec-title {
  margin-top: var(--space-4);
  max-width: 24ch;
  font-size: clamp(var(--space-6), 4vw, var(--space-8));
  font-weight: var(--font-weight-bold);
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--ink-1);
}
.ec-proofs {
  list-style: none;
  margin: var(--space-8) 0 0;
  padding: 0;
  display: grid;
  gap: var(--space-6);
  grid-template-columns: repeat(3, 1fr);
}
.ec-proof-lead {
  font-weight: var(--font-weight-bold);
  font-size: var(--space-4);
  color: var(--ink-1);
}
.ec-proof-body {
  margin-top: var(--space-2);
  font-size: var(--space-4);
  line-height: 1.6;
  color: var(--color-secondary);
}
/* CORPO 3 — variação por modo (ambas no DOM) */
.ec-variant {
  margin-top: var(--space-8);
  border-top: var(--border-width-1) solid var(--color-border);
  padding-top: var(--space-6);
}
.ec-variant-body {
  max-width: 60ch;
  font-size: var(--space-4);
  line-height: 1.6;
  color: var(--ink-1);
}
/* Toggle discreto — sussurro proposital (Seção 6 da autópsia) */
.ec-toggle {
  margin-top: var(--space-6);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-4);
}
.ec-toggle-support {
  font-size: var(--space-3);
  color: var(--color-secondary);
}
.ec-seg {
  background: var(--surface-2);
  border: var(--border-width-1) solid var(--color-border);
}

@media (max-width: 720px) {
  .ec-proofs { grid-template-columns: 1fr; }
}

/* ===== O SWAP (consumido pelo Bloco 5 E pelo Bloco 6) ===== */
/* #home-root[data-mode] é a fonte de verdade; SSR já entrega data-mode="recruiter". */
/* Ambas as variantes existem no DOM; o CSS revela só a ativa. Troca instantânea. */
[data-mode="recruiter"] .is-mode-client,
[data-mode="client"]    .is-mode-recruiter {
  display: none;
}
```

> Todas as cores/espaços vêm de tokens (`--space-*`, `--color-*`, `--surface-2`, `--ink-1`, `--border-width-1`, `--ease-standard`) — confirmados em `tokens.css`/`new-landing.css`. `em`/`vw`/`ch`/`clamp()` não são flagados pelo token-gate (ele só pega `px`, `rem`, `#hex`, `hsl(`). `--font-mono` tem fallback caso o 08 ainda não tenha cunhado o token.

### Passo 2 — A island controladora (`src/islands/ModeToggle.tsx`)

Reusa `SegmentedButton` (radiogroup + `nl-seg*` + indicador animado, ~3KB). A island só **escreve** o `data-mode`; ela não conhece a copy do CORPO 3 (que é estática e trocada por CSS). Adota o modo que o SSR já renderizou (o DOM é a verdade) para nunca divergir no primeiro paint.

```tsx
import { useEffect, useState } from "preact/hooks";
import { SegmentedButton } from "./SegmentedButton";

type Mode = "recruiter" | "client";

type Props = {
  recruiterLabel: string;
  clientLabel: string;
  ariaLabel: string;
  rootId?: string; // id do elemento que carrega data-mode
};

export default function ModeToggle({
  recruiterLabel,
  clientLabel,
  ariaLabel,
  rootId = "home-root"
}: Props) {
  const [mode, setMode] = useState<Mode>("recruiter");

  // Adota o modo que o servidor já pintou: o DOM é a fonte de verdade,
  // então controle e CSS-swap nunca discordam no primeiro paint.
  useEffect(() => {
    const m = document.getElementById(rootId)?.dataset.mode;
    if (m === "client" || m === "recruiter") setMode(m);
  }, [rootId]);

  const apply = (next: Mode) => {
    setMode(next);
    const root = document.getElementById(rootId);
    if (root) root.dataset.mode = next; // único efeito colateral: troca a string
  };

  return (
    <SegmentedButton
      buttons={[
        { id: "recruiter", label: recruiterLabel },
        { id: "client", label: clientLabel }
      ]}
      activeId={mode}
      onChange={(id) => apply(id as Mode)}
      ariaLabel={ariaLabel}
      className="ec-seg"
    />
  );
}
```

Decisões cravadas aqui: **sem persistência** (sem `localStorage`, sem `?mode=`) e **sem `lockSpy`** (não há scroll-spy a destravar como no header). Justificativa na Seção 8.

### Passo 3 — Completar o radiogroup em `SegmentedButton.tsx` (a11y)

Hoje o componente tem `role="radio"`, `aria-checked` e `tabIndex` rotativo, mas **nenhum** handler de seta — um usuário de teclado tabula só para a opção ativa e fica preso nela. Adicionar roving (additivo, ~12 linhas; beneficia também `HeaderNavSegmented`):

```tsx
// dentro de SegmentedButton, perto de handleButtonClick:
const moveTo = (rawIndex: number) => {
  const i = (rawIndex + buttons.length) % buttons.length;
  buttonRefs.current[i]?.focus();
  handleButtonClick(buttons[i].id);
};

const handleKeyDown = (e: KeyboardEvent, index: number) => {
  switch (e.key) {
    case "ArrowRight":
    case "ArrowDown": e.preventDefault(); moveTo(index + 1); break;
    case "ArrowLeft":
    case "ArrowUp":   e.preventDefault(); moveTo(index - 1); break;
    case "Home":      e.preventDefault(); moveTo(0); break;
    case "End":       e.preventDefault(); moveTo(buttons.length - 1); break;
  }
};
```

E no `<button>`: `onKeyDown={(e) => handleKeyDown(e as unknown as KeyboardEvent, index)}`. Setas selecionam ao mover (`aria-activedescendant`-free, padrão WAI-ARIA radiogroup). Blast radius: o header passa a navegar por setas também — comportamento esperado; checar na aceitação.

### Passo 4 — A seção estática (`src/components/home/EmCampo.astro`)

```astro
---
import ModeToggle from "@/islands/ModeToggle";
const { t } = Astro.props; // t = createT(loadMessages(locale, "home"), {...}) vindo da página
---
<section id="em-campo" class="ec" aria-labelledby="ec-title">
  <div class="ec-inner">
    <p class="ec-kicker">{t("home.field.kicker")}</p>
    <h2 id="ec-title" class="ec-title">{t("home.field.title")}</h2>

    <!-- CORPO 2 — três provas, idênticas nos dois modos -->
    <ul class="ec-proofs">
      <li class="ec-proof">
        <p class="ec-proof-lead">{t("home.field.proof1.title")}</p>
        <p class="ec-proof-body">{t("home.field.proof1.body")}</p>
      </li>
      <li class="ec-proof">
        <p class="ec-proof-lead">{t("home.field.proof2.title")}</p>
        <p class="ec-proof-body">{t("home.field.proof2.body")}</p>
      </li>
      <li class="ec-proof">
        <p class="ec-proof-lead">{t("home.field.proof3.title")}</p>
        <p class="ec-proof-body">{t("home.field.proof3.body")}</p>
      </li>
    </ul>

    <!-- CORPO 3 — variação por modo: AMBAS no DOM, CSS revela a ativa -->
    <div class="ec-variant">
      <p class="ec-variant-body is-mode-recruiter">{t("home.field.recruiter.body")}</p>
      <p class="ec-variant-body is-mode-client">{t("home.field.client.body")}</p>
    </div>

    <!-- Toggle discreto: o elemento mais quieto da seção -->
    <div class="ec-toggle">
      <ModeToggle
        client:visible
        recruiterLabel={t("home.toggle.recruiter")}
        clientLabel={t("home.toggle.client")}
        ariaLabel={t("home.toggle.aria")}
      />
      <p class="ec-toggle-support">{t("home.toggle.support")}</p>
    </div>
  </div>
</section>
```

Notas: `client:visible` (não `client:load`) — o bloco fica abaixo da dobra (depois de hero+cicatriz+tensão); hidrata só quando entra na viewport, poupando orçamento. Antes de hidratar o modo padrão já está pintado e legível. `id="em-campo"` é o alvo da âncora do CTA do hero ("Ver o que sobrevive ao campo →", Bloco 2).

### Passo 5 — Montagem na página (`src/pages/index.astro` e `en/index.astro`)

Dentro do `#home-root` que o 01 estabelece (já com `data-mode="recruiter"`), entre Tensão (Bloco 4) e CTA final (Bloco 6):

```astro
---
import { loadMessages, createT } from "@/i18n";
import EmCampo from "@/components/home/EmCampo.astro";
const locale = "pt-br"; // "en" na variante /en/
const t = createT(loadMessages(locale, "home"), { locale, namespace: "home" });
---
<!-- ... #home-root[data-mode="recruiter"] aberto pelo Bloco 01 ... -->
  <EmCampo t={t} />
<!-- ... Bloco 06 (CTA) também dentro do #home-root, lendo o mesmo data-mode ... -->
```

A wiring de i18n da página (frontmatter `loadMessages`/`createT`) é do 07/01; aqui ela é só consumida. O `#home-root` é do 01. Este filho **não** abre/fecha o wrapper — só pluga a seção dentro dele.

---

## 5. Copy

Copy PT colável (da Seção 4 do doc fonte). EN é tradução de referência — evitar os tokens PT banidos pelo `check-en-no-pt` (com fronteira de palavra): **portaria, custo, tempo, projetos, contato, latencia, disponivel, evidencia, risco, qualidade**. As strings EN abaixo já foram varridas e não contêm nenhum deles (ex.: usa-se "project"/"talk"/"reliability", não "projetos"/"contato"/"qualidade").

### `home.field.*` (Bloco 5)

| Chave | PT (colável) | EN (referência) |
|---|---|---|
| `home.field.kicker` | `Em campo` | `In the field` |
| `home.field.title` | `Três coisas que eu construo pensando no pior dia.` | `Three things I build for the worst day, not the demo.` |
| `home.field.proof1.title` | `Offline-first de verdade.` | `Truly offline-first.` |
| `home.field.proof1.body` | `O app funciona primeiro sem rede e sincroniza depois — não o contrário.` | `The app works without a network first and syncs later — not the other way around.` |
| `home.field.proof2.title` | `Integrações que assumem a falha.` | `Integrations that assume failure.` |
| `home.field.proof2.body` | `Construídas partindo do princípio de que o outro lado vai cair. E que seguram a barra quando ele cai.` | `Built on the premise that the other side will go down — and that hold the line when it does.` |
| `home.field.proof3.title` | `Confiabilidade medida no pior cenário.` | `Reliability measured at the worst case.` |
| `home.field.proof3.body` | `Não na média. No pico, na borda, no dia ruim.` | `Not on average. At the peak, at the edge, on the bad day.` |
| `home.field.recruiter.body` | `O que eu entrego num time de produto: [stack principal], e a parte que ninguém quer tocar — o que precisa funcionar quando quebrar custa caro.` | `What I bring to a product team: [main stack], plus the part nobody wants to touch — the thing that has to work when failing is expensive.` |
| `home.field.client.body` | `Do escopo ao sistema rodando: eu assumo a parte crítica do projeto, a que não pode ter um dia ruim.` | `From scope to a running system: I own the critical part of the work, the one that can't have a bad day.` |

### `home.toggle.*` (microcopy do toggle)

| Chave | PT | EN |
|---|---|---|
| `home.toggle.recruiter` | `Para recrutadores` | `For recruiters` |
| `home.toggle.client` | `Para clientes` | `For clients` |
| `home.toggle.support` | `Mesmo trabalho. O que muda é o que você precisa ver.` | `Same work. What changes is what you need to see.` |
| `home.toggle.aria` | `Escolha o que você precisa ver` | `Choose what you need to see` |

### Contrato de CTA (copy é do Bloco 6 — `06-cta-contato-rodape.md` é dono das chaves `home.cta.*`)

O toggle deste filho **muda também o CTA**. O Bloco 6 renderiza ambas as variantes dentro do `#home-root` com as mesmas classes `.is-mode-recruiter`/`.is-mode-client`:

| Modo | PT | EN |
|---|---|---|
| recruiter | `Estou aberto a vagas onde quebrar custa caro.` + botão `Ver perfil e cases →` | `I'm open to roles where breaking is expensive.` + button `See profile and cases →` |
| client | `Tem um sistema que não pode cair? Vamos conversar.` + botão `Falar sobre o projeto →` | `Got a system that can't go down? Let's talk.` + button `Talk about the project →` |

**Destinos (deep-link, sobrevivem):** recruiter → `/recruiter` (PT) / `/en/recruiter` (EN); client → `/client` (PT) / `/en/client` (EN). **Atenção:** `en/recruiter.astro` **não existe** no repo hoje (só `recruiter.astro`, `client.astro`, `en/client.astro`, `en/index.astro`) — ver Seção 8 (risco) e Seção 9.

### Dados faltando (marcados `[___]`)

- `[stack principal]` em `home.field.recruiter.body` — **perguntar ao Victor:** qual a string canônica da stack a exibir para recrutador (ex.: "React/TypeScript, Flutter, Node"). Candidato a reaproveitar de `home.about.p3` ("Astro/React, TypeScript, Flutter") — confirmar antes de cravar. Manter `[stack principal]` no ar como urgência, não detalhe.
- A **cicatriz** (Bloco 3) com `[___]` é de outro filho; este bloco não depende dela para shippar.

---

## 6. Conformidade com gates

| Gate | Como este filho mantém verde |
|---|---|
| **semantics** (1 único `<h1>`) | A seção só introduz `<h2 id="ec-title">` e `<p>`/`<ul>`. O único `<h1>` é a tese no hero (Bloco 2). As **duas** variantes de CORPO 3 e os **dois** CTAs no DOM são `<p>`/`<a>`, nunca `<h1>`. Páginas seguem `prerender = true`. |
| **check-en-no-pt** | Copy EN varrida: nenhum dos tokens banidos aparece. A copy EN mora em `en/home.json` (não no `.astro`); `ModeToggle.tsx` fica em `src/islands/` (fora de `src/pages/en/**`, não é escaneado). |
| **check:i18n** (paridade de chaves) | Toda chave nova entra **no mesmo commit** em `pt-br/home.json` **e** `en/home.json`, conjuntos idênticos. As `home.cta.*` são do Bloco 6 — não duplicar aqui (dono único evita conflito). |
| **js-budget** (≤150KB) | Reusa `SegmentedButton` (~3KB); `ModeToggle` é wrapper (~1KB). Preact já é embarcado (GsapInit/NavTransitions são islands `.island.tsx` `client:load`). Sem dependência nova. Rodar `pnpm build && pnpm budget:gate` para confirmar margem. |
| **token-gate** (informativo) | CSS novo usa só tokens (`var(--...)`); reusa `.nl-seg*`. Sem `px`/`rem`/`#hex`/`hsl(`. Mantido limpo mesmo sendo não-bloqueante. |
| **islands-gate** | `ModeToggle.tsx` em `src/islands/`. `EmCampo.astro` é `.astro` estático (sem estado/efeito); interatividade isolada na island. |
| **components-standard-gate** | `EmCampo.astro` não tem `useState`/efeito/script de estado — só markup + embed de island. Cumpre "componentes `.astro` são estáticos". |
| **docs-gate** | A pasta `plano-reconstrucao-home/` na raiz **não** é varrida. Se 01 documentar a home em `ARQUITETURA.md` ao criar `#home-root`, renovar o rodapé "Última revisão: AAAA-MM-DD — <sha>" (responsabilidade do 01). Inventariar `ModeToggle` em `docs/modulos/interatividade/` (módulo dono). |

---

## 7. Critérios de aceitação

- [ ] `#home-root[data-mode="recruiter"]` no HTML do `dist` (SSR) — modo padrão visível **sem JS**.
- [ ] Com JS desligado: as três provas (CORPO 2) e a variante **recruiter** do CORPO 3 aparecem; a variante client fica escondida por CSS; o controle não interativo não quebra layout.
- [ ] Clicar no segmented control troca CORPO 3 **e** o CTA do Bloco 6 ao mesmo tempo, **sem reload** e sem mudar hero/cicatriz/tensão.
- [ ] Teclado: Tab chega ao radiogroup; ArrowLeft/Right (e Home/End) trocam o modo; `aria-checked` reflete o ativo; foco visível.
- [ ] Nenhum flash de modo errado no primeiro paint (a island adota o `data-mode` do DOM no mount).
- [ ] `pnpm check:i18n` verde (paridade `home.field.*` + `home.toggle.*`).
- [ ] `pnpm build` verde; `prebuild` (check-i18n + check-en-no-pt) passa; EN sem tokens PT banidos.
- [ ] `pnpm budget:gate` ≤ 150KB.
- [ ] Exatamente um `<h1>` no `dist` da home (`pnpm semantics:gate`).
- [ ] `prefers-reduced-motion`: a troca é instantânea (display) — sem animação de conteúdo; só o indicador do segmented control mantém sua transição leve.
- [ ] Header (`HeaderNavSegmented`) continua funcionando após o patch de teclas no `SegmentedButton`.
- [ ] `[stack principal]` ou virou dado real, ou está sinalizado como urgência aberta.

---

## 8. Decisões cravadas e riscos

**Cravo CSS-swap (`data-mode`) sobre re-render Preact.** Ambas as variantes vão no SSR; a island só troca um atributo. Ganho: prerender intacto, um modo legível sem JS, custo de JS ~0 (sem template no cliente), zero CLS no load, e — o ponto — **uma fonte de verdade** (`#home-root[data-mode]`) servindo dois consumidores (Bloco 5 e Bloco 6) com **um** controlador. Abro mão de: poder renderizar conteúdo arbitrariamente diferente por modo (aqui não preciso — a diferença é uma frase e um CTA) e de ter o HTML "minimal" (mando os dois textos no DOM; são curtos, o peso é irrisório e ainda ajuda crawler/SEO).

**Cravo modo padrão = recruiter.** É o primeiro na ordem do doc fonte e na microcopy ("Para recrutadores | Para clientes"). A verdade vive no atributo `data-mode` do `#home-root`; a island **lê** isso (não duplica um default em código) — trocar o padrão é mudar um atributo no 01, num lugar só.

**Cravo sem persistência (sem `?mode=`/`localStorage`).** O toggle muda ênfase de uma página; os destinos (`/recruiter`, `/client`) já são específicos por rota — persistir o modo até lá é redundante. Persistência traria idempotência de URL, flash de hidratação e estado a sincronizar, por valor marginal. Abro mão de "lembrar a escolha" (porta aberta para um futuro `?mode=` se houver demanda real).

**Cravo consertar o teclado do `SegmentedButton` agora.** Um radiogroup sem setas é um teclado preso na opção ativa — borda, não "depois" (AGENTS.md). O patch é additivo e conserta o header de quebra. Trade-off: toco uma island compartilhada → exijo na aceitação que o header siga ok.

**Riscos / bombas-relógio:**
- **`en/recruiter.astro` não existe.** O CTA recruiter em EN aponta para `/en/recruiter` (convenção atual do `en/index.astro`), que hoje **404**. Pré-existente. Resolver no Bloco 6 / trabalho de destinos: ou criar `en/recruiter.astro`, ou apontar EN para `/recruiter`. **Sinalizar, não silenciar.**
- **Divergência de default.** Se 01 mudar `data-mode` do `#home-root` e a island tivesse um default hardcoded, dariam telas diferentes. Mitigado: a island adota o `data-mode` do DOM no mount. Manter assim.
- **Spotlight do hero (`HomeHybridLanding`) é legado.** A nova home substitui esse componente; o `cursor-spotlight` inline não convive com este bloco. Garantir que 01 não reimporte o script antigo sobre a nova seção.
- **`client:visible` + scroller rápido.** Quem rola muito rápido pode tocar o controle antes da hidratação; como o modo padrão já está pintado e funcional, o pior caso é um clique sem efeito por ~1 frame até hidratar. Aceitável; não vale `client:load` (gastaria orçamento à toa).

---

## 9. Conexões

- Índice-mãe: [00-indice-mae.md](00-indice-mae.md)
- Dependências (antes): [01-fundacao-arquitetura.md](01-fundacao-arquitetura.md), [07-i18n-conteudo.md](07-i18n-conteudo.md), [08-estilo-tokens-animacao.md](08-estilo-tokens-animacao.md)
- Consome este contrato (depois): [06-cta-contato-rodape.md](06-cta-contato-rodape.md) — lê `#home-root[data-mode]` para alternar o CTA (mesmas classes `.is-mode-recruiter`/`.is-mode-client`), e resolve o destino `en/recruiter` faltante.
- Módulo dono da island: `docs/modulos/interatividade/` — inventariar `ModeToggle.tsx` e o patch de teclado do `SegmentedButton.tsx`.
- Âncora consumida pelo hero (Bloco 2): `#em-campo` (alvo do CTA "Ver o que sobrevive ao campo →").
