# 01. Fundação e Arquitetura — Matar a Bifurcação

> Este plano cria o componente `HomeManifesto.astro` que substitui `HomeHybridLanding` nos dois index, define o esqueleto de 5 `<section>` com UM único `<h1>` (a tese), crava a Lista de Morte e o que sobrevive, e fixa o plano de corte. É a base que serve ao Bloco 3 (A Nova Arquitetura) e à Lista de Morte (Seção 8) da autópsia.

---

> **⚠️ Reconciliação — o [índice-mãe](00-indice-mae.md) (§3–§4) revoga parte deste plano.** Ele foi escrito antes da consolidação dos contratos. Onde este filho diverge, **vale o índice**:
> - **Arquitetura: partials, não monólito.** Em vez de um único `HomeManifesto.astro`, a home são partials em `src/components/home/` (`HeroAfirmacao`, `Cicatriz`, `TensionSection`, `EmCampo`, `CtaContato`) compostos em `index.astro`/`en/index.astro`. Todo o resto deste plano (kill plan, wiring i18n, riscos do `home.json`, plano de corte) continua valendo.
> - **Toggle:** wrapper `#home-root[data-mode]` (não `.hm-root[data-home-mode]`); island **`ModeToggle.tsx`** (não `HomeModeToggle.tsx`); **sem persistência** (sem `?mode=`/`replaceState`).
> - **Estilo:** `src/styles/home.css`, prefixo `.hm-*`, variação por modo `.hm-when-recruiter`/`.hm-when-client`.
> - **Âncoras/ids:** `<h1 id="hero-thesis">`; CTA do hero → `#em-campo` (não `#campo`).
> - **i18n:** `home.hero.thesis` (não `home.hero.h1`); cicatriz em 4 chaves `home.scar.eyebrow/value/unit/caption`.

## 1. Objetivo

Substituir a home-cardápio (duas portas) por uma home-afirmação: um único componente que renderiza 5 seções verticais com **um único `<h1>` = a tese**, nos dois locais (`index.astro` PT e `en/index.astro` EN), preservando `prerender = true`. Serve o **Bloco 3 — A Nova Arquitetura (matar a bifurcação)** e a **Seção 8 — Lista de Morte** do doc fonte. Lei do AGENTS.md que governa: **"10x, não 10%"** (joga fora a bifurcação e refaz o frame) e **"o mais simples que resolve vence"** (toggle que só troca ênfase, não refaz a página).

---

## 2. Arquivos afetados

Todos os caminhos são relativos à raiz da app `adorable-azimuth/`.

| Caminho exato | Ação | Por quê |
|---|---|---|
| `src/components/HomeManifesto.astro` | criar | Novo componente da home-afirmação: 5 `<section>` (hero/cicatriz/tensão/em-campo+toggle/cta), exatamente 1 `<h1>`. Substitui `HomeHybridLanding`. |
| `src/styles/home-manifesto.css` | criar | CSS temático, escopado em `body.page-home`, namespace `.hm-*`. Recebe o **reset base** (background, fonte, layout de coluna) + estilos de `nav`/`footer` que hoje vivem no `<style is:global>` do `HomeHybridLanding` e somem quando ele for deletado. |
| `src/styles/global.css` | editar | Adicionar `@import "./home-manifesto.css";` (depois de `new-landing.css`). É o único ponto de entrada de CSS da app. |
| `src/islands/HomeModeToggle.tsx` | criar | Island do segmented control recrutador/cliente. Reusa `SegmentedButton`. Só pode existir em `src/islands/` (islands-gate). |
| `src/pages/index.astro` | editar | Trocar import/uso `HomeHybridLanding` → `HomeManifesto`; remover o `®` do logo; ligar i18n via `loadMessages(locale, "home")`; usar `profile` para os links do rodapé. |
| `src/pages/en/index.astro` | editar | Idem para EN (`locale = "en"`, hrefs `/en/recruiter` e `/en/client`). |
| `src/i18n/pt-br/home.json` | editar | **Adicionar** as chaves novas do manifesto (não apagar as em uso — ver §8). |
| `src/i18n/en/home.json` | editar | Espelhar exatamente as chaves novas (paridade `check:i18n`), traduzindo sem as palavras PT banidas. |
| `src/components/HomeHybridLanding.astro` | excluir | Após paridade visual/comportamental e gates verdes. Único importador são os dois index (confirmado por busca); nada mais depende dele. |
| `src/data/profile.ts` | **não editar (nota)** | `brand: "Victor®"` é consumido por `Header.astro` (páginas que sobrevivem). Não remover aqui — viraria texto quebrado no header de `/recruiter` e `/client`. Poda do `®` global é um filho de polimento. |

---

## 3. Dependências

**A montante (precisa existir antes):** nenhuma. Este é o tronco.

**A jusante (dependem deste):** todos os outros filhos. Eles preenchem os contratos que este define (skeleton de seções, classes `.hm-*`, contrato `data-home-mode`, chaves i18n):

- [02-hero-afirmacao.md](02-hero-afirmacao.md) — conteúdo/tipografia do `<h1>` e tagline sussurro.
- [03-cicatriz-prova.md](03-cicatriz-prova.md) — o número grande e as 3 perguntas que arrancam a métrica.
- [04-tensao.md](04-tensao.md) — contraste happy path × campo.
- [05-em-campo-toggle.md](05-em-campo-toggle.md) — as 3 provas, o comportamento fino do toggle e a persistência.
- [06-cta-contato-rodape.md](06-cta-contato-rodape.md) — CTA final por modo + contato.
- [07-i18n-conteudo.md](07-i18n-conteudo.md) — finalização da copy e paridade pt-br/en.
- [08-estilo-tokens-animacao.md](08-estilo-tokens-animacao.md) — paleta, tokens e animações.

A enumeração canônica está em [00-indice-mae.md](00-indice-mae.md).

---

## 4. Implementação passo a passo

### Passo 1 — Criar `src/components/HomeManifesto.astro`

Componente **estático** (sem estado/efeito — regra do design-system; interatividade fica no island). Recebe a função `t` de i18n e os hrefs dos destinos que sobrevivem. Estrutura de 5 `<section>` dentro de um wrapper `.hm-root` que carrega o contrato `data-home-mode`.

```astro
---
import HomeModeToggle from "@/islands/HomeModeToggle";

interface Props {
  t: (key: string) => string;
  recruiterHref: string; // "/recruiter" | "/en/recruiter"
  clientHref: string;    // "/client"    | "/en/client"
}
const { t, recruiterHref, clientHref } = Astro.props as Props;
---
<div class="hm-root" data-home-mode="recruiter">

  <!-- BLOCO 2 — HERO / A AFIRMAÇÃO (único <h1> da página) -->
  <section class="hm-hero" aria-labelledby="hm-tese">
    <h1 id="hm-tese" class="hm-tese">{t("home.hero.h1")}</h1>
    <p class="hm-subhead">{t("home.hero.subhead")}</p>
    <p class="hm-tagline">{t("home.hero.tagline")}</p>
    <a class="hm-hero-cta" href="#campo">{t("home.hero.cta")}</a>
  </section>

  <!-- BLOCO 3 — A CICATRIZ (o NÚMERO é o maior tipo do bloco; é <h2>, nunca <h1>) -->
  <section id="cicatriz" class="hm-scar" aria-labelledby="hm-scar-figure">
    <h2 id="hm-scar-figure" class="hm-scar-figure">{t("home.scar.figure")}</h2>
    <p class="hm-scar-caption">{t("home.scar.caption")}</p>
  </section>

  <!-- BLOCO 4 — A TENSÃO -->
  <section id="tensao" class="hm-tension" aria-labelledby="hm-tension-title">
    <h2 id="hm-tension-title" class="hm-tension-title">{t("home.tension.title")}</h2>
    <p class="hm-tension-body">{t("home.tension.body")}</p>
  </section>

  <!-- BLOCO 5 — EM CAMPO + TOGGLE (3 provas compartilhadas + segmented discreto) -->
  <section id="campo" class="hm-field" aria-labelledby="hm-field-title">
    <h2 id="hm-field-title" class="hm-field-title">{t("home.field.title")}</h2>
    <ul class="hm-proofs">
      <li><p class="hm-proof-title">{t("home.field.proof1_title")}</p><p>{t("home.field.proof1_body")}</p></li>
      <li><p class="hm-proof-title">{t("home.field.proof2_title")}</p><p>{t("home.field.proof2_body")}</p></li>
      <li><p class="hm-proof-title">{t("home.field.proof3_title")}</p><p>{t("home.field.proof3_body")}</p></li>
    </ul>

    <div class="hm-mode">
      <HomeModeToggle
        client:visible
        recruiterLabel={t("home.toggle.recruiter")}
        clientLabel={t("home.toggle.client")}
        ariaLabel={t("home.toggle.aria")}
      />
      <p class="hm-mode-note">{t("home.toggle.note")}</p>
    </div>

    <p class="hm-field-variation hm-when-recruiter">{t("home.field.variation_recruiter")}</p>
    <p class="hm-field-variation hm-when-client">{t("home.field.variation_client")}</p>
  </section>

  <!-- BLOCO 6 — CTA FINAL + CONTATO (texto e href mudam por modo) -->
  <section id="cta" class="hm-cta" aria-labelledby="hm-cta-title">
    <h2 id="hm-cta-title" class="hm-cta-title">{t("home.cta.title")}</h2>
    <div class="hm-when-recruiter">
      <p class="hm-cta-lead">{t("home.cta.lead_recruiter")}</p>
      <a class="hm-cta-btn" href={recruiterHref}>{t("home.cta.btn_recruiter")}</a>
    </div>
    <div class="hm-when-client">
      <p class="hm-cta-lead">{t("home.cta.lead_client")}</p>
      <a class="hm-cta-btn" href={clientHref}>{t("home.cta.btn_client")}</a>
    </div>
  </section>

</div>
```

**Contagem de headings (trava do semantics-gate):** 1 `<h1>` (hero) + 5 `<h2>` (cicatriz, tensão, em-campo, cta — o hero não tem `<h2>`). As provas usam `<p class="hm-proof-title">`, não headings, para não inflar a árvore. O número da cicatriz é `<h2>` estilizado grande — é o maior tipo do bloco, mas continua `<h2>`.

> Nota: o `<nav>` e o `<footer>` **não** entram neste componente — vêm dos slots do `BaseLayout` preenchidos no `index.astro` (Bloco 1 — NAV mínima). Os elementos estruturais `<nav>/<main>/<footer>` exigidos pelo semantics-gate já são servidos pelo layout; a página fornece apenas o `<h1>`.

### Passo 2 — Criar o contrato do toggle: `src/islands/HomeModeToggle.tsx`

O island **não renderiza conteúdo**. Ele só alterna o atributo `data-home-mode` no `.hm-root` mais próximo. Ambas as variações (recrutador/cliente) já existem no HTML estático; o CSS mostra/esconde. Resultado: JS minúsculo, modo padrão funcional **sem JS**, sem flash no carregamento.

```tsx
import { SegmentedButton } from "./SegmentedButton";

interface Props {
  recruiterLabel: string;
  clientLabel: string;
  ariaLabel?: string;
}

export default function HomeModeToggle({ recruiterLabel, clientLabel, ariaLabel }: Props) {
  const items = [
    { id: "recruiter", label: recruiterLabel },
    { id: "client", label: clientLabel }
  ];

  return (
    <SegmentedButton
      buttons={items}
      defaultActive="recruiter"
      ariaLabel={ariaLabel}
      className="hm-mode-seg bg-white/5 ring-1 ring-white/10"
      onChange={(id) => {
        const root = document.querySelector<HTMLElement>(".hm-root");
        if (root) root.dataset.homeMode = id;
        // persistência leve sem reload — detalhe fino fica no filho 05
        const url = new URL(window.location.href);
        url.searchParams.set("mode", id);
        history.replaceState(null, "", url);
      }}
    />
  );
}
```

`SegmentedButton` é export nomeado e já implementa `role="radiogroup"`/`role="radio"`, `aria-checked` e indicador animado. As classes `nl-seg*` estão em `new-landing.css`, que é importado globalmente via `global.css` — logo o controle nasce estilizado em qualquer página, inclusive na home escura. Hidratação `client:visible` porque o toggle vive abaixo da dobra (Bloco 5): não compete com o carregamento crítico do hero.

### Passo 3 — Criar `src/styles/home-manifesto.css`

Arquivo temático, namespace `.hm-*`, tudo escopado em `body.page-home` (o `global.css` já exclui `.page-home` das regras base — a home é self-contained). Este arquivo **carrega o reset base** que morre junto com o `HomeHybridLanding`.

```css
/* base que migra do is:global do HomeHybridLanding */
body.page-home {
  background: var(--home-bg);
  color: var(--home-ink-1);
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

/* nav e footer (slots do BaseLayout) — estilos que viviam no componente morto */
body.page-home nav[aria-label="Principal"] { /* logo + lang, fixa no topo */ }
body.page-home .nav-logo { /* "Victor", sem ® */ }
body.page-home footer[role="contentinfo"] { /* assinatura pequena + links */ }

/* layout vertical das 5 seções */
.hm-root { display: flex; flex-direction: column; }
.hm-hero, .hm-scar, .hm-tension, .hm-field, .hm-cta {
  max-width: var(--container-max);
  margin-inline: auto;
  padding-inline: var(--space-7);
}

/* hierarquia: a TESE é o maior tipo da página; o NÚMERO é o maior do bloco cicatriz */
.hm-tese        { /* clamp grande, o maior da página */ }
.hm-scar-figure { /* clamp grande, o maior do bloco */ }

/* CONTRATO do toggle: default recrutador visível, cliente escondido */
.hm-root .hm-when-client { display: none; }
.hm-root[data-home-mode="client"] .hm-when-recruiter { display: none; }
.hm-root[data-home-mode="client"] .hm-when-client { display: block; }

@media (prefers-reduced-motion: reduce) { /* sem transições de troca */ }
```

> **Token-gate:** este arquivo **não pode** ter valores crus (`px`/`rem`/`#hex`/`hsl()`) fora de `tokens.css`. A paleta charcoal/amber da home (hoje hardcodada no componente morto) deve virar tokens nomeados em `src/styles/tokens.css` — único arquivo isento do gate — ex. `--home-bg`, `--home-ink-1`, `--home-amber`. Assim o `home-manifesto.css` referencia só `var(--home-*)` e nasce **verde** no token-gate, em vez de herdar a dívida. O preenchimento completo da paleta/tipografia é do filho [08-estilo-tokens-animacao.md](08-estilo-tokens-animacao.md); aqui basta definir os tokens que o esqueleto usa.

### Passo 4 — Reescrever `src/pages/index.astro` (PT)

```astro
---
import BaseLayout from "../components/BaseLayout.astro";
import HomeManifesto from "../components/HomeManifesto.astro";
import { loadMessages, createT } from "../i18n";
import { profile } from "../data/profile";

export const prerender = true;

const locale = "pt-br" as const;
const t = createT(loadMessages(locale, "home"), { locale, namespace: "home" });
---
<BaseLayout title={t("home.meta.title")} description={t("home.meta.description")}>
  <Fragment slot="nav">
    <a class="nav-logo" href="/">Victor</a>
    <div class="nav-lang">
      <a href="/" class="active">PT</a>
      <span>/</span>
      <a href="/en/">EN</a>
    </div>
  </Fragment>

  <HomeManifesto t={t} recruiterHref="/recruiter" clientHref="/client" />

  <Fragment slot="footer">
    <div class="footer-links">
      <a href={profile.links.linkedin} target="_blank" rel="noopener">LinkedIn</a>
      <a href={profile.links.github} target="_blank" rel="noopener">GitHub</a>
      <a href={`mailto:${profile.email}`}>{t("home.footer.email")}</a>
    </div>
    <span class="footer-copy">{t("home.footer.copy")}</span>
  </Fragment>
</BaseLayout>
```

Mudanças-chave: o logo é `Victor` (o `<span>®</span>` **sai**); o objeto `data` hardcoded de 21 linhas **morre**; a copy vem de `home.json`; os links do rodapé vêm de `profile` (fonte única). `t` é uma função passada como prop a um componente **server** (`HomeManifesto` não tem `client:` directive) — Astro aceita props não-serializáveis em componentes server; só islands exigem props serializáveis.

### Passo 5 — Espelhar em `src/pages/en/index.astro` (EN)

Idêntico, com `locale = "en"`, logo `Victor` (sem `®`), `class="active"` no `EN`, e `recruiterHref="/en/recruiter"` / `clientHref="/en/client"`. Como a copy vive em `en/home.json` e o arquivo da página só carrega chaves (sem prosa), o `check-en-no-pt` (que varre só `src/pages/en/**`) passa trivialmente — mas mesmo assim as strings em `en/home.json` devem evitar as palavras PT banidas (§6).

### Passo 6 — Adicionar chaves em `home.json` (pt-br e en)

**Adicionar** (não substituir o arquivo) as chaves da §5. As chaves antigas em uso (`home.section.*`, `home.hero.role_line`) ficam — ver §8. Conjuntos de chaves idênticos entre pt-br e en (trava `check:i18n`).

### Passo 7 — Plano de corte do `HomeHybridLanding` (estrangulamento)

1. Criar componente, CSS, island e tokens (Passos 1–3).
2. Trocar os dois index para `HomeManifesto` e ligar i18n (Passos 4–6).
3. `pnpm build` + rodar gates locais: `semantics:gate`, `budget:gate`, `check:i18n`, `check-en-no-pt`, `islands:gate`, `tokens:gate`.
4. Conferir paridade: a home afirma (1 `<h1>` = tese), o toggle alterna só Bloco 5 + CTA, e os deep-links `/recruiter` e `/client` (+ `/en/`) continuam de pé.
5. Com gates verdes e paridade ok, **deletar** `src/components/HomeHybridLanding.astro` (sem outros importadores).
6. Limpeza opcional (filho posterior): podar chaves mortas de `home.json`, remover `®` de outras páginas.

---

## 5. Copy

Copy PT colável do doc fonte (Seções 4–5). EN é tradução de referência **evitando** as palavras PT banidas: `tempo, projetos, contato, risco, custo, disponível` (lista completa em §6). Onde falta dado real, `[___]` sinalizado como **URGENTE**.

| Chave (`home.*`) | PT (colável) | EN (referência) |
|---|---|---|
| `home.meta.title` | `Victor de Alcântara Bueno — Engenharia para o pior dia` | `Victor de Alcântara Bueno — Engineering for the worst day` |
| `home.meta.description` | `Construo software para o pior dia, não para a demo. Produtos offline-first e integrações críticas que aguentam o campo.` | `I build software for the worst day, not the demo. Offline-first products and critical integrations that survive the field.` |
| `home.hero.h1` | `Eu construo o sistema que funciona quando nada mais funciona.` | `I build the system that works when nothing else does.` |
| `home.hero.subhead` | `Produtos web e mobile offline-first, com integrações críticas que aguentam o campo — não só o ambiente controlado da demo.` | `Offline-first web and mobile products, with critical integrations built to survive the field — not just the controlled comfort of a demo.` |
| `home.hero.tagline` | `Offline. Sob carga. Em campo. Continua de pé.` | `Offline. Under load. In the field. Still standing.` |
| `home.hero.cta` | `Ver o que sobrevive ao campo →` | `See what survives the field →` |
| `home.scar.figure` | `[___] meses` **(URGENTE)** | `[___] months` **(URGENT)** |
| `home.scar.caption` | `rodando offline em [contexto real]. [___] sincronizações, zero perda de dado. Quando a conexão voltou, tudo bateu.` **(URGENTE)** | `running offline in [real context]. [___] syncs, zero data loss. When the connection came back, everything matched.` **(URGENT)** |
| `home.tension.title` | `O happy path não é o seu mundo.` | `The happy path isn't your world.` |
| `home.tension.body` | `Quase todo software é construído para o happy path: boa conexão, dados limpos, tudo no lugar. O seu problema não vive lá. Ele vive no galpão sem sinal, no dispositivo que passou doze horas no sol, na integração que precisa responder mesmo quando o outro lado caiu. É pra esse mundo que eu construo.` | `Almost all software is built for the happy path: good connection, clean data, everything in place. Your problem doesn't live there. It lives in the warehouse with no signal, the device that spent twelve hours in the sun, the integration that has to answer even when the other side went down. That's the world I build for.` |
| `home.field.title` | `Como eu construo` | `How I build` |
| `home.field.proof1_title` | `Offline-first de verdade.` | `Offline-first for real.` |
| `home.field.proof1_body` | `O app funciona primeiro sem rede e sincroniza depois — não o contrário.` | `The app works without a network first and syncs later — not the other way around.` |
| `home.field.proof2_title` | `Integrações que assumem a falha.` | `Integrations that assume failure.` |
| `home.field.proof2_body` | `Construídas partindo do princípio de que o outro lado vai cair. E que seguram a barra quando ele cai.` | `Built on the premise that the other side will go down. And that hold the line when it does.` |
| `home.field.proof3_title` | `Confiabilidade medida no pior cenário.` | `Reliability measured at the worst case.` |
| `home.field.proof3_body` | `Não na média. No pico, na borda, no dia ruim.` | `Not the average. At the peak, the edge, the bad day.` |
| `home.field.variation_recruiter` | `O que eu entrego num time de produto: [stack principal], e a parte que ninguém quer tocar — o que precisa funcionar quando quebrar sai caro.` **([stack principal] URGENTE)** | `What I deliver on a product team: [main stack], and the part no one wants to touch — what has to work when breaking gets expensive.` **([main stack] URGENT)** |
| `home.field.variation_client` | `Do escopo ao sistema rodando: eu assumo a parte crítica do projeto, a que não pode ter um dia ruim.` | `From scope to a running system: I take on the critical part of the build — the one that can't have a bad day.` |
| `home.toggle.recruiter` | `Para recrutadores` | `For recruiters` |
| `home.toggle.client` | `Para clientes` | `For clients` |
| `home.toggle.note` | `Mesmo trabalho. O que muda é o que você precisa ver.` | `Same work. What changes is what you need to see.` |
| `home.toggle.aria` | `Alternar público: recrutadores ou clientes` | `Switch audience: recruiters or clients` |
| `home.cta.title` | `Vamos ao pior dia.` | `Let's get to the worst day.` |
| `home.cta.lead_recruiter` | `Estou aberto a vagas onde quebrar sai caro.` | `Open to roles where breaking gets expensive.` |
| `home.cta.btn_recruiter` | `Ver perfil e cases →` | `See profile and cases →` |
| `home.cta.lead_client` | `Tem um sistema que não pode cair? Vamos conversar.` | `Got a system that can't go down? Let's talk.` |
| `home.cta.btn_client` | `Falar sobre o projeto →` | `Talk about the build →` |
| `home.footer.email` | `Email` | `Email` |
| `home.footer.copy` | `© 2026 Victor de Alcântara Bueno` | `© 2026 Victor de Alcântara Bueno` |

**Dado que falta (perguntar ao Victor — Seção 5 do doc fonte, as 3 perguntas que arrancam a métrica):**
1. **Sob qual carga?** Quantos usuários/dispositivos/transações simultâneas no pior pico — não na média? → preenche `[___] sincronizações`.
2. **Por quanto tempo?** Maior período rodando sem rede / sem cair / em produção ininterrupta? → preenche `home.scar.figure` (`[___] meses`).
3. **O que NÃO quebrou?** O dado que não se perdeu, a integração que não caiu, o sync que bateu 100%? → fecha `home.scar.caption`.

Enquanto o número real não vier, o `[___]` fica no ar — mas como **urgência**, não detalhe. `[stack principal]` em `variation_recruiter` também precisa do valor real (ex.: `Astro/React, TypeScript, Flutter`).

**Notas de tradução EN (palavras PT banidas a evitar):** `tempo`→`duration`/`time`; `projetos`→`work`/`cases`; `contato`→`talk`/`reach out`; `risco`→(reescrever, não usar “risk” como gancho); `custo`/“custa caro”→`expensive`; `disponível`→`open to`. As strings EN acima já respeitam isso.

---

## 6. Conformidade com gates

- **semantics-gate (1 único `<h1>`):** ✅ O `<h1>` existe só no `hm-hero` (a tese). Cicatriz, tensão, em-campo e cta usam `<h2>`; o número da cicatriz é `<h2>` estilizado grande, nunca `<h1>`. `<nav>/<main>/<footer>` vêm do `BaseLayout`. `prerender = true` mantido nos dois index → gera `.html` para o gate amostrar.
- **check-en-no-pt:** ✅ A página EN (`src/pages/en/index.astro`) só carrega chaves i18n — sem prosa. O gate varre apenas `src/pages/en/**`; `HomeManifesto.astro`, o island e `en/home.json` ficam fora do alcance. Ainda assim, as strings de `en/home.json` evitam `tempo/projetos/contato/risco/custo/disponível` (§5). Atenção a ids/strings inline em EN: usar ids neutros (`#campo`, `#cta`) — evitamos `id="contato"`.
- **check:i18n (paridade de chaves):** ✅ As ~30 chaves novas entram **idênticas** em `pt-br/home.json` e `en/home.json`. Nenhuma chave existente é removida (ver §8), então a paridade atual não é quebrada.
- **js-budget (≤ 150KB):** ✅ `HomeModeToggle` reusa `SegmentedButton` (Preact, ~3KB já amortizado por `HeaderNavSegmented`); o island novo é um wrapper minúsculo, sem dependência nova. O toggle só alterna `data-*` + `history.replaceState` — zero biblioteca pesada. Rodar `pnpm build && pnpm budget:gate` para confirmar a margem.
- **token-gate (informativo):** ✅ por construção. Todo CSS novo vai em `home-manifesto.css` usando só `var(--…)`; a paleta charcoal/amber é promovida a tokens `--home-*` em `tokens.css` (arquivo isento). Em vez de herdar as ~791 violações do componente morto, a home nova nasce sem valores crus.
- **docs-gate:** ✅ não afeta. A pasta `plano-reconstrucao-home/` na raiz **não** é varrida (só fundação + `docs/modulos/`). Os arquivos do plano são livres de gate. (Documentar a home em `ARQUITETURA.md` é dívida real, mas é trabalho de um filho de docs, não desta base.)
- **components-standard-gate (dormente):** ✅ Não está na ordem de CI declarada. Mesmo assim, o markup **não** usa `data-section`/`data-cta`, então o gate é no-op para a home. Se um filho decidir adotar a convenção da casa (`Button.astro`/`Hero.astro`), terá de incluir `data-section-type` e `data-variant` — fora do escopo desta base.
- **islands-gate:** ✅ `HomeModeToggle.tsx` mora em `src/islands/` — único lugar permitido para `.tsx`.

---

## 7. Critérios de aceitação

- [ ] `src/components/HomeManifesto.astro` existe e renderiza exatamente 5 `<section>` com **um único `<h1>`** (a tese).
- [ ] `index.astro` e `en/index.astro` importam `HomeManifesto` (não `HomeHybridLanding`), mantêm `export const prerender = true` e passam `t` + hrefs corretos por locale.
- [ ] O logo no nav é `Victor` **sem** `®` nos dois index; o rodapé usa `profile.links` e `profile.email`.
- [ ] `pnpm build` gera `dist/` e `pnpm semantics:gate` passa (1 `<h1>` por página).
- [ ] `pnpm check:i18n` passa (paridade pt-br/en) e `pnpm check-en-no-pt` passa.
- [ ] `pnpm budget:gate` passa (≤ 150KB) com o island do toggle incluído.
- [ ] `pnpm islands:gate` e `pnpm tokens:gate` passam; `home-manifesto.css` sem valores crus.
- [ ] O toggle alterna `data-home-mode` no `.hm-root`: só Bloco 5 (variação) e Bloco 6 (CTA) mudam; hero, cicatriz e tensão ficam idênticos. Sem JS, o modo recrutador aparece completo e clicável.
- [ ] Deep-links `/recruiter`, `/client`, `/en/recruiter`, `/en/client` continuam alvos válidos dos CTAs.
- [ ] `Header.astro` (em `/recruiter`, `/client`) e `Footer.astro` seguem renderizando seus labels — nenhuma chave `home.json` em uso foi removida.
- [ ] `src/components/HomeHybridLanding.astro` foi deletado após paridade, sem importador órfão.

---

## 8. Decisões cravadas e riscos

**Nome do componente: `HomeManifesto.astro`.** Crave. A home inteira virou manifesto (Seção 7 do doc: “muda o frame de cardápio pra manifesto”). “Affirmation” descreve só o Bloco 2; “Manifesto” descreve a página. Abri mão de um nome mais literal (`HomeAffirmation`) em troca de um que nomeia a tese da página inteira.

**Toggle = troca de atributo, não troca de página.** Crave. As duas variações (recrutador/cliente) vão no HTML estático; o island só seta `data-home-mode` no `.hm-root` e o CSS mostra/esconde via `.hm-when-*`. Trade-off: ambos os textos viajam no HTML (alguns bytes a mais) em troca de **funcionar sem JS**, **sem flash** e **sem custo de bundle**. Recusei renderizar conteúdo no Preact (geraria hidratação cara, FOUC e dependência do JS para ver o CTA).

**Modo padrão = recrutador.** Crave. O doc lista recrutador primeiro em todo par; é o topo-de-funil mais amplo e a superfície que mais sobrevive (perfil + cases). Abri mão de “cliente” como default — pode ser revisto no filho 05 se a analítica disser o contrário.

**CTA do hero = âncora interna `#campo`.** Crave. É UM CTA (“Ver o que sobrevive ao campo”), e o que “sobrevive ao campo” são as provas do Bloco 5. Mantém o fluxo “prova antes do argumento” sem mandar o visitante pra fora antes da triagem.

**CSS em arquivo temático + paleta promovida a tokens.** Crave. Em vez de copiar o `<style is:global>` monolítico (e suas ~791 violações de token) para o novo componente, o CSS vai para `home-manifesto.css` e a paleta vira `--home-*` em `tokens.css`. Resolve o problema (dívida de token), não só o pedido (mover a home).

**Risco / bomba-relógio nº 1 — `home.json` NÃO está órfão.** O BRIEF afirma que `home.json` é órfão; a busca no código diz o contrário: `Header.astro` consome `home.section.{projects,about,contact}` (labels do `HeaderNavSegmented` em `/recruiter` e `/client`) e `Footer.astro` consome `home.hero.role_line`. **Apagar essas chaves quebra páginas que sobrevivem** (em dev, `createT` lança; em prod, renderiza `[[pt-br:home:…]]` visível). Mitigação cravada: **adicionar** as chaves novas e **preservar** as em uso. Podar as chaves de fato mortas (`tagline_morph_*`, `microcopy`, `cta_primary/secondary`, `scroll_right`, `about.*`, `contact.p`, `projects.cta`) é limpeza de baixo risco para um filho posterior, fora do caminho crítico.

**Risco nº 2 — o reset base mora no componente que vamos deletar.** `background`, fonte e layout de coluna de `body.page-home` vivem no `<style is:global>` do `HomeHybridLanding`. Deletar antes de migrar deixa a home sem fundo/estilo. Mitigação: o reset entra em `home-manifesto.css` (Passo 3) **antes** de qualquer deleção; só apagar o componente no Passo 7.5, após gates verdes.

**Risco nº 3 — `®` espalhado.** O `®` aparece em 8+ lugares (recruiter, client, projects p3/p5/p7, `profile.brand`). Esta base mata só os dois do home-nav. Não tocar em `profile.brand` (Header das páginas que sobrevivem depende dele). Limpeza global do `®` é polimento (Seção 7.5 do doc), filho separado — não arrastar para a fundação.

---

## 9. Conexões

- Índice-mãe: [00-indice-mae.md](00-indice-mae.md)
- Doc fonte: `../da-autopsia-ao-bisturi-reconstrucao.md` (Seções 3 e 8)
- Filhos que dependem desta base: [02-hero-afirmacao.md](02-hero-afirmacao.md), [03-cicatriz-prova.md](03-cicatriz-prova.md), [04-tensao.md](04-tensao.md), [05-em-campo-toggle.md](05-em-campo-toggle.md), [06-cta-contato-rodape.md](06-cta-contato-rodape.md), [07-i18n-conteudo.md](07-i18n-conteudo.md), [08-estilo-tokens-animacao.md](08-estilo-tokens-animacao.md)
