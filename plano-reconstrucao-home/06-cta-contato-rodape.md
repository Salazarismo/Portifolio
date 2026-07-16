# 06. CTA final, contato, rodapé e higiene de marca

> Fecha a home com UM CTA que muda só de ênfase conforme o toggle (recrutador → `/recruiter`; cliente → WhatsApp), concentra o contato ao lado do pedido, transforma o nome em assinatura pequena no rodapé e mata o ® em toda a casa. Serve ao Bloco 6 e à Lista de Morte (Seções 4, 6 e 8 da autópsia).

---

> **⚠️ Reconciliação — ver [índice-mãe](00-indice-mae.md) §4.** Onde este plano diverge, vale o índice: wrapper **`#home-root[data-mode]`** (não `.nh-page`); variação por modo **`.hm-when-recruiter`/`.hm-when-client`** (não `.nh-cta-variant--*`); chaves **`home.cta.*`** (não `home.cta_final.*`); **CTA cliente → `/client`** (não WhatsApp direto — o WhatsApp vive na lista de contato desta seção). O contato fica nesta seção; o rodapé guarda só a assinatura.

## 1. Objetivo

Implementar o **Bloco 6 — CTA FINAL + contato** (autópsia §3 e §4) e executar dois itens da **Lista de Morte** (autópsia §8): o **®** (cosplay de marca) e o **nome como elemento grande** (encolhe pra assinatura no rodapé). O CTA não refaz a página: ele lê o modo do toggle (filho 05) e troca só o texto/destino do botão. Governam aqui três leis do AGENTS.md: **o mais simples que resolve vence** (troca de modo por CSS + um atributo, sem segundo island), **tenha opinião de design — crave** (modo padrão, destino do CTA cliente, ano computado), e **resolva o problema, não o pedido** (o ® sai de TODA página a um clique da home, não só do `<nav>`).

---

## 2. Arquivos afetados

Todos sob `adorable-azimuth/`.

| Caminho exato | Ação | Por quê |
|---|---|---|
| `src/data/profile.ts` | editar | `brand: "Victor®"` → `brand: "Victor"`. Fonte única da marca (consumida por `Header.astro`); matar o ® aqui conserta a marca em cascata. |
| `src/components/home/CtaContato.astro` | criar | Seção do Bloco 6: `<h2>` de fechamento + as duas variantes do CTA (recrutador/cliente) + lista de contato (email, WhatsApp, LinkedIn, GitHub). Componente **estático** (sem estado). |
| `src/pages/index.astro` | editar | Nav-logo sem ® (`{profile.brand}`); montar `<CtaContato locale="pt-br" />`; rodapé = assinatura (`profile.fullName`) + ©; importar `profile`. |
| `src/pages/en/index.astro` | editar | Idem para EN (`locale="en"`, deep-link `/en/recruiter`); sem ®. |
| `src/i18n/pt-br/home.json` | editar | 5 chaves novas `home.cta_final.*`. |
| `src/i18n/en/home.json` | editar | Espelho EN das 5 chaves (paridade `check:i18n`). |
| `src/styles/new-home.css` | editar | Classes `.nh-cta-final*`, `.nh-cta-btn*`, `.nh-contact*`, troca por `.nh-page[data-mode]`, `.nh-footer-sign`. (Arquivo temático da home criado/definido no filho 01; se ele usou outro nome/prefixo, escreva lá.) |
| `src/pages/recruiter.astro` | editar | Higiene de marca: linha 544 `Victor<span>®</span>` → `Victor`. É o destino do deep-link do CTA recrutador. |
| `src/pages/client.astro` | editar | Linha 12 `Victor<span>®</span>` → `Victor`. |
| `src/pages/en/client.astro` | editar | Linha 12 `Victor<span>®</span>` → `Victor`. |
| `src/pages/projects/p3.astro` · `p5.astro` · `p7.astro` | editar | `Victor<sup>®</sup>` → `Victor` (linhas 96/101/102). |
| `src/pages/en/projects/p3.astro` · `p5.astro` · `p7.astro` | editar | Idem (linhas 96/101/102). |
| `src/pages/docs/content.md` | editar | Linha 150 `Logo/Marca "Victor®"` → `"Victor"` (doc descreve a marca antiga; coerência). |

**Mandatório para fechar este bloco:** `profile.ts`, ambos `index.astro`, `CtaContato.astro`, os dois `home.json`, `new-home.css`. **Varredura de marca (mesmo commit, fortemente recomendada):** `recruiter`, `client` (+en), `projects p3/p5/p7` (+en), `docs/content.md`. Deixar um ® num destino do próprio CTA reintroduz exatamente o que a autópsia mandou matar.

---

## 3. Dependências

**Precisam existir antes:**
- [01-fundacao-arquitetura.md](01-fundacao-arquitetura.md) — define o shell da home (`BaseLayout`, `body.page-home`), o wrapper **`.nh-page`** que envolve o conteúdo de `<main>`, o arquivo de CSS temático (`new-home.css`, prefixo `.nh-*`) e o wiring de i18n via `loadMessages(locale, "home")`. Este filho consome `.nh-page` e escreve no mesmo CSS.
- [05-em-campo-toggle.md](05-em-campo-toggle.md) — dono do **toggle** (island Preact, reusa `SegmentedButton`). **Contrato duro:** o island escreve o atributo `data-mode ∈ {recruiter, client}` no elemento `.nh-page`. Este filho NÃO cria island; só reage a esse atributo via CSS. O modo padrão renderizado no SSR é `recruiter`.
- [07-i18n-conteudo.md](07-i18n-conteudo.md) — dono da estrutura de `home.json`. As 5 chaves `home.cta_final.*` abaixo entram no esquema dele, com paridade pt-br/en.

**Depende deste filho:** nenhum bloco posterior. Este é o fecho da página.

---

## 4. Implementação passo a passo

### Passo 1 — Matar o ® na fonte (`src/data/profile.ts`)

```ts
// antes
brand: "Victor®",
// depois
brand: "Victor",
```

Não remova a chave `brand`: `Header.astro:16` faz `{profile.brand}`. Mudar o valor conserta o Header de graça. `displayName` já é `"Victor"` (sem ®) e segue como fallback.

### Passo 2 — Criar `src/components/home/CtaContato.astro`

Componente estático (sem `useState`/efeito — respeita a REGRA do design-system; interatividade fica no island de 05). Recebe `locale`, resolve o deep-link do recrutador com `getRelativeLocaleUrl` e puxa contato de `profile` (fonte única).

```astro
---
import { profile } from "@/data/profile";
import { getRelativeLocaleUrl } from "astro:i18n";
import { createT, loadMessages, type Locale } from "@/i18n";

const { locale } = Astro.props as { locale: Locale };
const t = createT(loadMessages(locale, "home"), { locale, namespace: "home" });
const recruiterHref = getRelativeLocaleUrl(locale, "recruiter"); // "/recruiter" | "/en/recruiter"
---
<section class="nh-cta-final" aria-labelledby="cta-final-title">
  <h2 id="cta-final-title" class="nh-cta-final__title">{t("home.cta_final.title")}</h2>

  {/* Variante RECRUTADOR — visível por padrão (SSR data-mode="recruiter") */}
  <div class="nh-cta-variant nh-cta-variant--recruiter">
    <p class="nh-cta-final__lead">{t("home.cta_final.recruiter_lead")}</p>
    <a class="nh-cta-btn" href={recruiterHref}>{t("home.cta_final.recruiter_button")}</a>
  </div>

  {/* Variante CLIENTE — destino é WhatsApp direto (fricção mínima) */}
  <div class="nh-cta-variant nh-cta-variant--client">
    <p class="nh-cta-final__lead">{t("home.cta_final.client_lead")}</p>
    <a class="nh-cta-btn nh-cta-btn--accent" href={profile.links.whatsapp}
       target="_blank" rel="noopener">{t("home.cta_final.client_button")}</a>
  </div>

  {/* Contato — persistente nos dois modos */}
  <ul class="nh-contact" aria-label={t("home.section.contact")}>
    <li><a class="nh-contact__link" href={`mailto:${profile.email}`}>Email</a></li>
    <li><a class="nh-contact__link" href={profile.links.whatsapp} target="_blank" rel="noopener">WhatsApp</a></li>
    <li><a class="nh-contact__link" href={profile.links.linkedin} target="_blank" rel="noopener">LinkedIn</a></li>
    <li><a class="nh-contact__link" href={profile.links.github} target="_blank" rel="noopener">GitHub</a></li>
  </ul>
</section>
```

Pontos cravados no markup:
- **Sem `<h1>` aqui.** O único `<h1>` da página é a tese no hero (filho 02). Este bloco é `<h2>` + `<p>` — exige o `semantics-gate`.
- **As duas variantes vão no HTML.** A escondida continua no DOM (crawlable; funciona sem JS). A troca é CSS, não re-render.
- **WhatsApp = `https://wa.me/5548984586949`** já está em `profile.links.whatsapp` (confirmado em `profile.ts:13`). Não hardcode o número.
- A `<ul>` usa `aria-label={t("home.section.contact")}` — chave **já existente** em `home.json` (`"Contato"`/`"Contact"`); não crie chave duplicada.

### Passo 3 — Editar `src/pages/index.astro` (PT)

Importe `profile`, limpe o ® do nav, monte o componente, troque o rodapé por assinatura.

```astro
---
import BaseLayout from "../components/BaseLayout.astro";
import CtaContato from "../components/home/CtaContato.astro";
import { profile } from "../data/profile";
// ...demais imports da composição (hero, cicatriz, tensão, em-campo) conforme 01–05
export const prerender = true;
---
<BaseLayout title={/* de 01 */} description={/* de 01 */}>
  <Fragment slot="nav">
    <a class="nav-logo" href="/">{profile.brand}</a>   {/* "Victor", sem ® */}
    <div class="nav-lang">
      <a href="/" class="active">PT</a><span>/</span><a href="/en/">EN</a>
    </div>
  </Fragment>

  {/* Wrapper .nh-page (de 01) carrega data-mode; o toggle de 05 o reescreve */}
  {/* ...hero, cicatriz, tensão, em-campo+toggle (01–05)... */}
  <CtaContato locale="pt-br" />

  <Fragment slot="footer">
    <span class="nh-footer-sign">{profile.fullName}</span>
    <span class="nh-footer-copy">© {new Date().getFullYear()}</span>
  </Fragment>
</BaseLayout>
```

`CtaContato` precisa ficar **dentro do `.nh-page`** (o wrapper de 01, dentro de `<main>`) para o seletor descendente `.nh-page[data-mode] .nh-cta-variant--*` alcançar. O rodapé (slot `footer` do `BaseLayout`) é mode-independente e fica **fora** do `.nh-page` — é só assinatura + ©.

### Passo 4 — Editar `src/pages/en/index.astro` (EN)

Igual ao Passo 3, com `href="/en/"`, `PT`/`EN` invertendo o `active`, e `<CtaContato locale="en" />` (gera `/en/recruiter`). Nada de literal PT na página — tudo via `t()`/`profile` (atende o `check-en-no-pt`, que varre `src/pages/en/**`).

### Passo 5 — Chaves i18n (`home.json` pt-br **e** en)

Adicione as 5 chaves (Seção 5). Espelhe **as mesmas chaves** nos dois arquivos ou o `check:i18n` quebra o `prebuild`.

### Passo 6 — CSS no `src/styles/new-home.css`

Tudo em tokens `var(--…)`. O `1px` da borda usa o token real **`--border-width-1`** (`tokens.css:57`) — zero valor cru.

```css
/* ============================================================
   Bloco 6 — CTA final + contato (filho 06)
   Modo (recrutador/cliente) dirigido por .nh-page[data-mode],
   atributo escrito pelo island do toggle (filho 05).
   ============================================================ */
.nh-cta-final {
  max-width: var(--container-max);
  margin-inline: auto;
  padding-block: var(--space-9);
  padding-inline: var(--space-4);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-5);
  text-align: center;
}
.nh-cta-final__title {
  margin: 0;
  font-size: var(--font-size-3xl);
  line-height: var(--line-height-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--ink-1);
}
.nh-cta-final__lead {
  margin: 0;
  max-width: 42ch;
  font-size: var(--font-size-lg);
  line-height: var(--line-height-relaxed);
  color: var(--ink-2);
}

/* Botão: a frase sussurra, o botão grita (autópsia §6) */
.nh-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  border: var(--border-width-1) solid var(--color-border);
  border-radius: var(--radius-full);
  color: var(--ink-1);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  transition:
    border-color var(--duration-normal) var(--ease-standard),
    background-color var(--duration-normal) var(--ease-standard);
}
.nh-cta-btn:hover { border-color: var(--ink-1); }
.nh-cta-btn:focus-visible {
  outline: var(--border-width-1) solid var(--accent-1);
  outline-offset: var(--space-1);
}
.nh-cta-btn--accent {
  background: var(--accent-1);
  color: var(--accent-ink);
  border-color: transparent;
}

/* Troca de modo — default = recrutador (robusto se data-mode faltar) */
.nh-cta-variant {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}
.nh-cta-variant--client { display: none; }
.nh-page[data-mode="client"] .nh-cta-variant--recruiter { display: none; }
.nh-page[data-mode="client"] .nh-cta-variant--client { display: flex; }

/* Contato — persistente nos dois modos */
.nh-contact {
  margin: 0;
  padding: var(--space-5) 0 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-3) var(--space-5);
}
.nh-contact__link {
  color: var(--ink-2);
  font-size: var(--font-size-sm);
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-standard);
}
.nh-contact__link:hover { color: var(--ink-1); }

/* Rodapé — nome vira assinatura pequena (autópsia §6) */
.nh-footer-sign { font-size: var(--font-size-sm); color: var(--ink-2); }
.nh-footer-copy { font-size: var(--font-size-sm); color: var(--ink-2); opacity: 0.7; }
```

A regra de troca usa só `data-mode="client"` como override; sem o atributo (ou com `recruiter`) o recrutador aparece. É o mesmo contrato que o filho 05 usa para alternar a ênfase do Bloco 5 — **um único `data-mode`** rege os dois blocos.

### Passo 7 — Varredura do ® (mesmo commit)

Remoção literal, arquivo por arquivo:

| Arquivo | De | Para |
|---|---|---|
| `src/pages/recruiter.astro:544` | `Victor<span>®</span>` | `Victor` |
| `src/pages/client.astro:12` | `Victor<span>®</span>` | `Victor` |
| `src/pages/en/client.astro:12` | `Victor<span>®</span>` | `Victor` |
| `src/pages/projects/p3.astro:96` · `p5.astro:101` · `p7.astro:102` | `Victor<sup>®</sup>` | `Victor` |
| `src/pages/en/projects/p3.astro:96` · `p5.astro:101` · `p7.astro:102` | `Victor<sup>®</sup>` | `Victor` |
| `src/pages/docs/content.md:150` | `Logo/Marca "Victor®"` | `Logo/Marca "Victor"` |

Confira ao fim que a busca por `®` no `src/` zera (PowerShell: `Select-String -Path .\adorable-azimuth\src\** -Pattern '®' -Recurse`).

---

## 5. Copy

### 5.1 PT — colável (de §4 da autópsia)

Chaves novas em `src/i18n/pt-br/home.json`:

```json
"home.cta_final.title": "Vamos construir pro pior dia.",
"home.cta_final.recruiter_lead": "Estou aberto a vagas onde quebrar custa caro.",
"home.cta_final.recruiter_button": "Ver perfil e cases →",
"home.cta_final.client_lead": "Tem um sistema que não pode cair? Vamos conversar.",
"home.cta_final.client_button": "Falar sobre o projeto →"
```

- `recruiter_lead` / `recruiter_button` e `client_lead` / `client_button` são **verbatim** da autópsia §4 (CTA). Não reescreva.
- `home.cta_final.title` (o `<h2>` de fechamento) é **PROPOSTA cravada**, não dado faltante: ecoa a tese ("pior dia"), é curta, tem verbo e zero adjetivo. O dono pode trocar — mas a seção **não pode** ficar sem âncora (`semantics`/leitura). Se quiser variar, mantenha o motivo recorrente da §2 ("software para o pior dia, não para a demo").
- A microcopy do toggle (`Para recrutadores | Para clientes` + a linha de apoio "Mesmo trabalho. O que muda é o que você precisa ver.") pertence ao **filho 05** (é o controle), não a este bloco. Não duplique aqui.
- Contato: rótulos `Email` / `WhatsApp` / `LinkedIn` / `GitHub` são literais de marca (iguais nos dois idiomas) — sem chave i18n.
- **Sem `[___]` neste bloco.** Os placeholders de dado real (`[tempo]`, `[volume]`…) são da **Cicatriz** (Bloco 3), não do CTA. Aqui nada depende de número que falta.

### 5.2 EN — referência (`src/i18n/en/home.json`)

```json
"home.cta_final.title": "Let's build for the worst day.",
"home.cta_final.recruiter_lead": "I'm open to roles where breaking is expensive.",
"home.cta_final.recruiter_button": "See profile and cases →",
"home.cta_final.client_lead": "Got a system that can't go down? Let's talk.",
"home.cta_final.client_button": "Talk about your project →"
```

**Tokens PT banidos pelo `check-en-no-pt`** (fronteira de palavra, case-insensitive): `portaria, custo, tempo, projetos, contato, latência, disponível, evidência, risco, qualidade`. Conferência das strings EN acima: nenhuma contém esses tokens — `expensive` (não `custo`), `cases`/`project` (não `projetos`), `talk`/`reach` (não `contato`). O gate varre `src/pages/en/**`; como a página EN renderiza tudo via `t()`/`profile` (sem literal PT) e o `aria-label` vem de `t("home.section.contact")` → `"Contact"` (não `"contato"`), a página passa. Mesmo assim, estas strings em `src/i18n/en/home.json` já evitam os tokens por princípio.

---

## 6. Conformidade com gates

| Gate | Como este filho mantém verde |
|---|---|
| **semantics** (1 único `<h1>`) | `CtaContato.astro` usa `<h2>` + `<p>` + `<ul>`. Nenhum `<h1>` é adicionado; o único fica no hero (filho 02). `<nav>`/`<main>`/`<footer>` vêm do `BaseLayout`. |
| **check-en-no-pt** | Página EN só usa `t()`/`profile`; strings EN evitam os 10 tokens banidos (ver §5.2). |
| **check:i18n** (paridade de chaves) | As 5 chaves `home.cta_final.*` entram em pt-br **e** en `home.json`, conjuntos idênticos. Reusa `home.section.contact` (já espelhada). |
| **js-budget** (≤150KB) | **Zero JS novo.** Nenhum island criado aqui; a troca é CSS + o `data-mode` que o island de 05 já escreve. Não toca no orçamento. |
| **token-gate** (informativo) | CSS 100% em `var(--…)`; o `1px` da borda usa `--border-width-1`. Sem `px`/`rem`/`#hex`/`hsl(` crus → não adiciona violação. |
| **islands-gate** (`.tsx` só em `src/islands/`) | Não cria `.tsx`. `CtaContato.astro` é estático. |
| **docs-gate** | Não adiciona/edita módulo de fundação nem `docs/modulos/*`. `plano-reconstrucao-home/` não é varrido. (Se 01 documentar a home em `ARQUITETURA.md`, é lá que se renova o rodapé "Última revisão:".) |

---

## 7. Critérios de aceitação

- [ ] `profile.brand === "Victor"` e busca por `®` em `adorable-azimuth/src/` retorna **zero** ocorrências.
- [ ] Home PT e EN renderizam o nav-logo "Victor" sem ®; rodapé mostra `profile.fullName` pequeno + `© {ano atual}`.
- [ ] `CtaContato` aparece após o Bloco 5, **dentro** do `.nh-page`, com `<h2>` (não `<h1>`).
- [ ] Sem JS / com `data-mode` ausente ou `recruiter`: aparece a variante recrutador, botão → `/recruiter` (PT) / `/en/recruiter` (EN).
- [ ] Com o toggle em **cliente** (`data-mode="client"` no `.nh-page`): aparece a variante cliente, botão → `https://wa.me/5548984586949` (`target="_blank" rel="noopener"`).
- [ ] Lista de contato exibe Email (`mailto:`), WhatsApp, LinkedIn, GitHub — todos de `profile`, nenhum hardcode.
- [ ] `pnpm build` passa: `check:i18n` (5 chaves espelhadas), `semantics-gate` (1 `<h1>`), `check-en-no-pt`, `js-budget` (sem aumento por este filho).
- [ ] Clicar no botão recrutador navega (NavTransitions) sem reload; clicar no cliente abre o WhatsApp em nova aba.

---

## 8. Decisões cravadas e riscos

**Decisões (com o que abri mão):**
1. **Modo padrão (SSR) = recrutador.** A persona é primariamente "aberto a vagas"; o funil recrutador é o principal. Sem JS, mostra-se recrutador — determinístico. Abri mão de adivinhar a intenção do visitante no servidor (impossível sem JS).
2. **Troca de modo por CSS + um único `data-mode` no `.nh-page`, NÃO um segundo island.** As duas variantes do CTA vão no HTML (uma escondida). Custo: um bloco de markup a mais. Ganho: zero JS novo, SSR/crawlable, funcional sem JS, uma só fonte de verdade do modo (a mesma do Bloco 5). Abri mão de "renderizar só a variante ativa".
3. **CTA cliente → WhatsApp direto** (não um formulário, não `/client`). "Falar sobre o projeto" pede fricção mínima; o recrutador vai pro deep-link `/recruiter` (perfil/cases). Abri mão de uma página de contato intermediária.
4. **Contato concentrado na seção do CTA, rodapé só assinatura + ©.** Links de contato colados ao pedido convertem melhor; o rodapé fica enxuto. Abri mão da redundância dos links sociais no rodapé.
5. **® removido na FONTE + varredura total no mesmo commit.** Resolve o problema, não o pedido: um ® em `/recruiter` (um clique do CTA) reintroduz o cosplay que a autópsia matou.
6. **Ano do © computado** (`new Date().getFullYear()`) em vez de `"2026"` literal — não deixo a data envelhecer calada. Como a home é `prerender`, regenera a cada build.

**Riscos / bombas-relógio:**
- **Contrato com 05.** Se o island de 05 escrever `data-mode` em outro elemento que não o `.nh-page` que envolve `CtaContato`, o CTA cliente nunca aparece. O contrato (atributo `data-mode`, valores `recruiter|client`, no `.nh-page`) é interface dura entre 05 e 06 — documente nos dois.
- **`CtaContato` fora do `.nh-page`.** Se cair no slot `footer` ou fora de `<main>`, o seletor descendente quebra e o modo trava no default. Garanta que está no slot default, dentro do wrapper.
- **NavTransitions e link externo.** O botão recrutador é interno (ok, navegação sem reload). O cliente é externo (`wa.me`, `target="_blank"`): confirme que `NavTransitions.island` ignora hrefs externos e não previne o default.
- **Paridade i18n.** Esquecer de espelhar uma das 5 chaves quebra o `prebuild` (`check:i18n`). Edite os dois `home.json` no mesmo passo.
- **`new-home.css` precisa estar importado** (via `global.css` ou `BaseLayout`, conforme 01); senão o CTA/contato renderiza sem estilo e a troca de modo não acontece.

---

## 9. Conexões

- Índice-mãe: [00-indice-mae.md](00-indice-mae.md)
- Fundação/arquitetura (shell, `.nh-page`, `new-home.css`, wiring i18n): [01-fundacao-arquitetura.md](01-fundacao-arquitetura.md)
- Toggle e Bloco 5 (dono do island e do `data-mode`): [05-em-campo-toggle.md](05-em-campo-toggle.md)
- i18n / conteúdo (esquema de `home.json`, paridade): [07-i18n-conteudo.md](07-i18n-conteudo.md)
- Hero (dono do único `<h1>` da página): ver o filho do Bloco 2 no índice-mãe.
