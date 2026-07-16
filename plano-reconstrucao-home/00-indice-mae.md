# 00. Índice-Mãe — Reconstrução da Home (Da Autópsia ao Bisturi)

> O legista terminou; a autópsia virou bisturi. Este índice é o **contrato**: ele crava as decisões compartilhadas que nenhum plano filho podia decidir sozinho. Os filhos detalham a implementação bloco a bloco; **onde um filho divergir deste índice, este índice manda.** Leia este arquivo primeiro, depois o filho do bloco que você vai digitar.

Fonte: [`../da-autopsia-ao-bisturi-reconstrucao.md`](../da-autopsia-ao-bisturi-reconstrucao.md). Código: `adorable-azimuth/`.

---

## 1. A tese e o frame

**Construo software para o pior dia, não para a demo.**

A home para de **perguntar** (o cardápio de duas portas) e passa a **afirmar** (o manifesto). A tese é universal — vale para recrutador e cliente — então o hero, a cicatriz e a tensão são **idênticos** nos dois modos. A triagem de público (toggle) vem **depois** do gancho, pequena, subordinada. A emoção é entregue antes da classificação.

Regra de ouro que governa todas as decisões abaixo: **o que carrega a tese cresce; o que é identidade pessoal (nome, ®) encolhe ou some.**

---

## 2. Mapa dos planos filhos

| # | Plano | Escopo | Bloco da autópsia | Onda |
|---|---|---|---|---|
| 01 | [01-fundacao-arquitetura.md](01-fundacao-arquitetura.md) | Matar a bifurcação; esqueleto; wiring i18n; plano de corte | §3, §8 | 0–1 |
| 02 | [02-hero-afirmacao.md](02-hero-afirmacao.md) | Hero: o H1 = a tese (maior tipo), subhead, tagline, 1 CTA | §2, §4, §6 | 1 |
| 03 | [03-cicatriz-prova.md](03-cicatriz-prova.md) | A prova: o número como maior tipo do bloco; as 3 perguntas | §3, §4, §5 | 2 |
| 04 | [04-tensao.md](04-tensao.md) | O inimigo nomeado: happy path × campo | §3, §4, §6 | 3 |
| 05 | [05-em-campo-toggle.md](05-em-campo-toggle.md) | 3 provas + segmented control discreto recrutador/cliente | §3, §4, §6 | 4 |
| 06 | [06-cta-contato-rodape.md](06-cta-contato-rodape.md) | CTA final por modo, contato, assinatura, higiene do ® | §4, §6, §8 | 5 |
| 07 | [07-i18n-conteudo.md](07-i18n-conteudo.md) | **Transversal** — copy deck → i18n, paridade, en-no-pt | §4, §5 | 0–5 |
| 08 | [08-estilo-tokens-animacao.md](08-estilo-tokens-animacao.md) | **Transversal** — tokens, CSS, hierarquia, animação | §6 | 0–5 |
| 09 | [09-qualidade-gates-docs.md](09-qualidade-gates-docs.md) | **Transversal** — gates, docs, testes, DoD, rollout | §7, §8 | 0–5 |

---

## 3. A nova arquitetura (canônica)

**Partials por bloco, compostos na página.** Não um componente monolítico. Cada bloco é um `.astro` estático e independente em `src/components/home/`; o `index.astro` os compõe e lê como o sumário da página ("código é comunicação"). 6 dos 7 filhos e todo o wiring de i18n já assumem isto — o monólito `HomeManifesto.astro` proposto no 01 fica **revogado** (mas o resto do 01 — kill plan, wiring, riscos — continua valendo).

```astro
---
// src/pages/index.astro (PT) — espelhado em en/index.astro (locale="en", hrefs /en/*)
import BaseLayout from "../components/BaseLayout.astro";
import HeroAfirmacao   from "../components/home/HeroAfirmacao.astro";
import Cicatriz        from "../components/home/Cicatriz.astro";
import TensionSection  from "../components/home/TensionSection.astro";
import EmCampo         from "../components/home/EmCampo.astro";
import CtaContato      from "../components/home/CtaContato.astro";
import { loadMessages, createT } from "../i18n";
import { profile } from "../data/profile";

export const prerender = true;
const locale = "pt-br" as const;
const t = createT(loadMessages(locale, "home"), { locale, namespace: "home" });
---
<BaseLayout title={t("home.meta.title")} description={t("home.meta.description")}>
  <Fragment slot="nav">
    <a class="nav-logo" href="/">Victor</a>   <!-- sem ® -->
    <div class="nav-lang"><a href="/" class="active">PT</a><span>/</span><a href="/en/">EN</a></div>
  </Fragment>

  <div id="home-root" data-mode="recruiter">
    <HeroAfirmacao   t={t} />            <!-- ÚNICO <h1> da página -->
    <Cicatriz        t={t} />
    <TensionSection  t={t} />
    <EmCampo         t={t} />            <!-- contém o island ModeToggle -->
    <CtaContato      t={t} recruiterHref="/recruiter" clientHref="/client" />
  </div>

  <Fragment slot="footer"> <!-- assinatura pequena: nome + © + links mínimos --> </Fragment>
</BaseLayout>
```

- `<nav>`, `<main>`, `<footer>` vêm do **BaseLayout** (slots) — o semantics-gate já está satisfeito na casca. A **página** entrega só o `<h1>` (no `HeroAfirmacao`).
- `#home-root[data-mode]` é o **único** wrapper de modo (envolve os partials dentro do `<main>`). O CSS e o island leem dele.
- `t` é passado como prop a componentes **server** (sem `client:`), o que Astro permite com props não-serializáveis.

---

## 4. Contratos canônicos (o índice manda)

Tabela de resolução de toda divergência encontrada entre os filhos. **Estes valores vencem.**

### 4.1 Arquitetura & arquivos

| Contrato | Valor canônico | Revoga |
|---|---|---|
| Decomposição | **Partials** em `src/components/home/` compostos em `index.astro`/`en/index.astro` | monólito `HomeManifesto.astro` (01) |
| Partial hero | `src/components/home/HeroAfirmacao.astro` | — |
| Partial cicatriz | `src/components/home/Cicatriz.astro` | — |
| Partial tensão | `src/components/home/TensionSection.astro` | — |
| Partial em-campo | `src/components/home/EmCampo.astro` | `EmCampoToggle.astro` (07) |
| Partial CTA/contato | `src/components/home/CtaContato.astro` | — |
| Island do toggle | `src/islands/ModeToggle.tsx` (reusa `SegmentedButton`) | `HomeModeToggle.tsx` (01) |

### 4.2 Estilo (dono: 08)

| Contrato | Valor canônico | Revoga |
|---|---|---|
| Stylesheet temático | `src/styles/home.css`, importado **uma vez** em `global.css` após `new-landing.css` | `home-manifesto.css` (01), `new-home.css` (03/06) |
| Prefixo de classe | `.hm-*`, com `.hero-*` **grandfathered** no hero | `.nh-*` (03/06), `.ec-*` (05) |
| Classe de variação por modo | `.hm-when-recruiter` / `.hm-when-client` | `.is-mode-*` (05), `.nh-cta-variant--*` (06) |
| Token do número da cicatriz | `--home-scar-size` (menor que `--home-hero-size`, p/ manter hero ≥ scar) | `--nh-display-2` (03) |
| Paleta | tokens `--home-*` definidos em `tokens.css` (isento do token-gate); valores finais no 08 | âmbar/charcoal hardcoded (HomeHybridLanding) |

### 4.3 Toggle (dono: 05)

| Contrato | Valor canônico | Revoga |
|---|---|---|
| Wrapper | `#home-root` | `.hm-root` (01), `.nh-page` (06) |
| Atributo | `data-mode` | `data-home-mode` (01) |
| Mecânica | **CSS-swap**: ambas variações no SSR, island só seta `document.getElementById('home-root').dataset.mode`; funciona sem JS, sem flash | — |
| Modo padrão | `recruiter` (unânime) | — |
| Persistência | **Nenhuma** (sem `?mode=`, sem localStorage) | `history.replaceState` de `?mode=` (01) |
| Hidratação | `client:visible` (o toggle vive abaixo da dobra) | — |

### 4.4 Âncoras & ids

| Contrato | Valor canônico | Revoga |
|---|---|---|
| id do `<h1>` | `#hero-thesis` | `#hm-tese` (01) |
| Âncora do CTA do hero → seção em-campo | `#em-campo` (CTA `href="#em-campo"`, `<section id="em-campo">`) | `#campo` (01) |
| Demais seções | `#cicatriz`, `#tensao`, `#cta` | — |

### 4.5 i18n (dono do mapa completo PT/EN: 07)

Convenção: namespace `home.*`, chaves **flat snake** (`home.<bloco>.<slot>`). Espelhamento exato pt-br/en (trava `check:i18n`). O **07 detém os valores PT/EN completos**; o índice crava só os nomes que estavam em conflito e as pendências:

| Slot | Chave canônica | Revoga |
|---|---|---|
| Tese (h1) | `home.hero.thesis` | `home.hero.h1` (01) |
| Número da cicatriz | `home.scar.eyebrow` / `home.scar.value` / `home.scar.unit` / `home.scar.caption` | `home.scar.figure`+`caption` (01) |
| Provas | `home.field.proof1_title` … `proof3_body` | `proof1.title` notação-ponto (05) |
| Eyebrow do em-campo | `home.field.eyebrow` | `home.field.kicker` (05) |
| Variação por modo | `home.field.recruiter_body` / `home.field.client_body` | `variation_*` (01), `recruiter.body` (05) |
| CTA final | `home.cta.*` | `home.cta_final.*` (06) |
| Microcopy do toggle | `home.toggle.support` | `home.toggle.note` (01) |

**07 deve ADICIONAR (consumidas mas ausentes do inventário):** `home.field.title`, `home.toggle.aria`, `home.cta.title`. Sem elas, `createT` lança em dev/e2e e renderiza `[[…]]` em prod.

**NÃO apagar (bomba-relógio):** `home.hero.role_line` e `home.section.{projects,about,contact}` são consumidas por `Footer.astro`/`Header.astro` (via `docs/index.astro` e páginas sobreviventes). A poda das chaves de fato mortas do MorphingText (`tagline_morph_*`, `microcopy`, `cta_primary/secondary`, `scroll_right`, `about.*`, `contact.p`, `projects.cta`) é polimento de baixo risco, **não** parte do caminho crítico. Isto revoga a instrução do 02 de remover `role_line`/`section.*`.

### 4.6 Destinos & contato

| Contrato | Valor canônico |
|---|---|
| CTA recrutador | "Ver perfil e cases →" → `/recruiter` (PT) e `/en/recruiter` (EN) |
| CTA cliente | "Falar sobre o projeto →" → `/client` (PT) e `/en/client` (EN) — **não** WhatsApp direto (revoga 06) |
| Contato | Vive na **seção do Bloco 6** (ponto de conversão): email, WhatsApp, LinkedIn, GitHub |
| Rodapé | **Assinatura**: nome pequeno + © + links mínimos. O nome sai do palco do hero e vira assinatura aqui |
| **Pendência de rollout** | `src/pages/en/recruiter.astro` **não existe** → `/en/recruiter` é 404. Criar o espelho de `en/client.astro` antes de shippar (não shippar 404 no próprio CTA) |

---

## 5. Ordem de execução (ondas)

Ranqueada por **impacto emocional** (autópsia §7), não por facilidade. As transversais 07/08/09 correm em paralelo, alimentando cada onda.

- **Onda 0 — Contratos & fundação.** Este índice + `08` Passo-0 (tokens `--home-*`, `home.css`, prefixo `.hm-*`) + `01` (esqueleto dos partials, `#home-root`, wiring i18n nos dois `index.astro`) + `07` define o mapa de chaves. *Nada visual sem isto.*
- **Onda 1 — [10x] Matar a bifurcação + Hero.** `01` (corte da home-cardápio) + `02` (o H1 = a tese como maior tipo). É o movimento que muda o frame de cardápio para manifesto. *Sem isto, todo o resto é polir um cadáver.*
- **Onda 2 — A Cicatriz.** `03`. Converte promessa em crença. **Bloqueada por conteúdo humano** (§6) — o molde sobe com `[___]`, mas a prioridade é arrancar o número real.
- **Onda 3 — A Tensão.** `04`. Dá inimigo e emoção à tese.
- **Onda 4 — [polimento] Em campo + Toggle.** `05`. A triagem de público, agora subordinada ao gancho.
- **Onda 5 — [polimento] CTA, contato, microcopy, assinatura, ®.** `06` + cauda do `08`. O acabamento que transforma cosplay de marca em marca.
- **Encerramento — `09`.** Gates verdes + paridade → **deletar** `HomeHybridLanding.astro` (estrangulamento) + atualizar docs.

**Grafo de dependência:** `01` → todos. `08` Passo-0 → todo bloco visual. `07` (chaves) → todo bloco com copy. `05` → `06` (contrato de modo). `09` fecha.

---

## 6. Bloqueadores P0 (humanos — não-CI)

A régua final da autópsia: o único ponto onde a próxima palavra a teclar depende **só do Victor**.

1. **O número da cicatriz** (único bloqueador de conteúdo verdadeiro). Responda as 3 perguntas e a cicatriz se escreve sozinha:
   - **Por quanto tempo?** Maior período rodando offline / sem cair / em produção ininterrupta → `home.scar.value` + `home.scar.unit` (ex.: `[___]` `meses`).
   - **Sob qual carga?** Volume no **pior pico** (sincronizações/dispositivos/transações, não a média) → o número dentro de `home.scar.caption` (`[___]` sincronizações).
   - **O que NÃO quebrou?** O dado que não se perdeu, a integração que não caiu, o sync que bateu 100% → fecha a `caption` ("zero perda de dado") + `[contexto real]`.
2. **Stack principal.** `[stack principal]` em `home.field.recruiter_body`. Qual a string canônica a exibir? Candidato a confirmar: `Astro/React, TypeScript, Flutter` (de `home.about.p3`).
3. **Destino EN do recrutador.** Criar `en/recruiter.astro` (recomendado) ou apontar o CTA EN para `/recruiter`? Decidir antes do rollout.

Enquanto o número não vier, o `[___]` fica no ar — mas tratado como **urgência**, não detalhe.

---

## 7. Gates (resumo — detalhe no `09`)

Ordem do CI: `typecheck → astro check → check:i18n → build → islands → semantics → projects → js-budget → docs` (tokens é informativo). Os que esta obra mais toca:

- **semantics-gate:** exatamente **um `<h1>`** por página (só a tese, em `HeroAfirmacao`). Número da cicatriz, tensão, etc. são `<h2>`/`<p>`.
- **check:i18n:** chaves pt-br/en idênticas por arquivo.
- **check-en-no-pt:** copy EN sem as palavras PT banidas (`portaria, custo, tempo, projetos, contato, latencia, disponivel, evidencia, risco, qualidade`). Atenção: o gate varre só `src/pages/en/**`; a copy real vive em `en/home.json` — `09` avalia estender o gate a `src/i18n/en/**`.
- **js-budget:** ≤ 150KB de JS cliente. O toggle reusa `SegmentedButton` (Preact já amortizado) — sem dependência nova.
- **docs-gate:** ao editar `ARQUITETURA.md`/docs de módulo, renovar o rodapé `Última revisão:` e manter links relativos resolvendo. A pasta `plano-reconstrucao-home/` **não** é varrida.

Comandos locais: `pnpm typecheck && pnpm check && pnpm check:i18n && pnpm build && pnpm semantics:gate && pnpm budget:gate && pnpm islands:gate`.

---

## 8. Definition of Done (global)

- [ ] A home **afirma**: um único `<h1>` = a tese, maior tipo da página. As duas portas saíram da entrada.
- [ ] A cicatriz existe logo abaixo do hero, com o número como maior tipo do bloco (ou `[___]` sinalizado se o dado real ainda não veio).
- [ ] A tensão (happy path × campo) está nomeada e visualmente contrastada.
- [ ] O toggle recrutador/cliente é discreto, fica no Bloco 5, alterna **só** Bloco 5 + CTA via `#home-root[data-mode]`, e funciona sem JS.
- [ ] O ® sumiu do nav e do rodapé da home; o nome virou assinatura pequena.
- [ ] Todos os gates verdes localmente (§7) + `pnpm test:e2e` ajustado para os seletores canônicos (`#hero-thesis`, `#home-root`, `#em-campo`).
- [ ] `HomeHybridLanding.astro` deletado, sem importador órfão; `/recruiter`, `/client`, `/en/recruiter`, `/en/client` de pé como destinos.
- [ ] `ARQUITETURA.md` descreve a home nova; rodapés de docs renovados.

---

## 9. Conexões

- Doc fonte (a autópsia): [`../da-autopsia-ao-bisturi-reconstrucao.md`](../da-autopsia-ao-bisturi-reconstrucao.md)
- Filhos: [01](01-fundacao-arquitetura.md) · [02](02-hero-afirmacao.md) · [03](03-cicatriz-prova.md) · [04](04-tensao.md) · [05](05-em-campo-toggle.md) · [06](06-cta-contato-rodape.md) · [07](07-i18n-conteudo.md) · [08](08-estilo-tokens-animacao.md) · [09](09-qualidade-gates-docs.md)
