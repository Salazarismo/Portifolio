# 07. i18n e Copy Deck (transversal)

> Crava a fonte única da copy da home: migra todo o COPY DECK (Seções 4 e 5 do doc fonte) para `src/i18n/{pt-br,en}/home.json`, reaproveitando o namespace `home` semi-órfão, e entrega o MAPA COMPLETO de chaves (hero, cicatriz, tensão, em-campo, corpo3 recrutador/cliente, CTA recrutador/cliente, microcopy) com paridade PT/EN gated. Serve todos os blocos 2–6 da reconstrução e a lei "O data model conta a verdade" — a copy é dado, não markup.

> **⚠️ Reconciliação — ver [índice-mãe](00-indice-mae.md) §4.5.** Você é o dono do mapa de chaves. O índice cravou: **adicionar** `home.field.title`, `home.toggle.aria`, `home.cta.title` (consumidas mas ausentes do inventário); usar `home.cta.*` (não `home.cta_final.*`), `home.field.eyebrow` (não `kicker`), `home.field.recruiter_body`/`client_body`, `home.toggle.support`; e **preservar** `home.hero.role_line` + `home.section.*` (servem ao Header/Footer de outras páginas — não podar).

## 1. Objetivo

Tornar `src/i18n/{pt-br,en}/home.json` a **única fonte de verdade** da copy da nova home (Seções 4 "COPY DECK" e 5 "A CICATRIZ" do doc fonte), com conjunto de chaves idêntico nos dois locales e EN escrito limpo de palavras PT. Este filho é **transversal**: os filhos 02–06 *declaram* as chaves que precisam; aqui elas são *materializadas*, *consolidadas* e *gated*. Governa a lei do AGENTS.md **"O data model conta a verdade"** (a hierarquia visual — número que grita, legenda que sussurra — só funciona se a copy chegar fatiada em chaves atômicas, não em strings monolíticas) e **"Tenha opinião de design. Crave."** (cravo i18n estruturado contra inline, e cravo estender o gate `check-en-no-pt` para que a promessa "EN sem vazamento PT" seja real, não aspiracional).

## 2. Arquivos afetados

| Caminho exato | Ação | Por que |
|---|---|---|
| `adorable-azimuth/src/i18n/pt-br/home.json` | editar | Reescrever: **podar** as chaves mortas do MorphingText, **preservar** as 4 chaves ainda consumidas (ver §3), **adicionar** todas as chaves dos blocos 2–6. Fonte PT. |
| `adorable-azimuth/src/i18n/en/home.json` | editar | Espelho EN exato (mesmo conjunto de chaves — `check:i18n`), com a tradução de referência escrita sem nenhuma das 10 palavras PT banidas. |
| `adorable-azimuth/scripts/check-en-no-pt.mjs` | editar | Estender a varredura para incluir `src/i18n/en` além de `src/pages/en`. É o que faz a garantia "EN pega vazamento PT automaticamente" valer para a copy da home (hoje o gate não enxerga `src/i18n/en`). Diff cirúrgico de 2 trechos — ver Passo 4. |
| `adorable-azimuth/src/pages/index.astro` | editar | Trocar o objeto `data` hardcoded por `createT(loadMessages("pt-br","home"), …)` e resolver cada chave em `t(...)`, passando às seções (composição final é de [01-fundacao-arquitetura.md](01-fundacao-arquitetura.md)). |
| `adorable-azimuth/src/pages/en/index.astro` | editar | Idem, `locale = "en"`. |

> Os componentes de seção (`HeroAfirmacao.astro`, `Cicatriz.astro`, `TensionSection.astro`, `EmCampoToggle.astro`, etc.) são criados pelos filhos 02–06. Este filho **não** os cria — entrega a copy que eles consomem e o wiring `t()` que liga uma coisa à outra. O island do toggle (filho 05) **não** carrega copy: recebe tudo por props (decisão cravada, §8).

## 3. Dependências

**Precisa existir antes deste:**
- [01-fundacao-arquitetura.md](01-fundacao-arquitetura.md) — define o esqueleto da nova home (a ordem dos blocos em `index.astro`/`en/index.astro`, o ponto onde `loadMessages`/`createT` é chamado, e `export const prerender = true`). Este filho preenche o `t()` de cada slot que 01 abre. **Depende de 01 para o contrato de chaves**: 01 (com os filhos de bloco) fixa quais componentes existem e quais props consomem.

**Dependem deste (este filho atravessa 02–06):**
- [02-hero-afirmacao.md](02-hero-afirmacao.md) — chaves `home.hero.thesis|subhead|tagline|cta` + `home.meta.title|description`.
- [03-cicatriz-prova.md](03-cicatriz-prova.md) — chaves `home.scar.eyebrow|value|unit|caption` (e os `[___]` urgentes vivem aqui).
- [04-tensao.md](04-tensao.md) — chaves `home.tension.title_field|title_demo|lead_demo|lead_field`.
- [05-em-campo-toggle.md](05-em-campo-toggle.md) — chaves `home.field.*`, `home.toggle.*` e as 4 chaves `home.cta.*` (o toggle troca corpo 3 + texto do CTA).
- [06-cta-contato-rodape.md](06-cta-contato-rodape.md) — consome `home.meta.*`; e **atenção**: a nav/rodapé da home é dele, mas as chaves `home.hero.role_line` e `home.section.*` que este filho **preserva** servem ao `Header`/`Footer` de *outras* páginas (ver aviso abaixo).
- Coordenação (sem bloqueio de chave): [08-estilo-tokens-animacao.md](08-estilo-tokens-animacao.md) estiliza o que estas chaves renderizam.

**Aviso de landmine (corrige uma suposição do filho 02):** o namespace `home` **não é totalmente órfão**. Verificado no código real:
- `adorable-azimuth/src/components/Footer.astro:20` usa `tHome("home.hero.role_line")`.
- `adorable-azimuth/src/components/Header.astro:26-28` usa `tHome("home.section.projects" | "home.section.about" | "home.section.contact")`.
- Ambos são renderizados por `adorable-azimuth/src/pages/docs/index.astro` (única página que importa `Header`/`Footer`).

Logo, `home.hero.role_line` e `home.section.{projects,about,contact}` **devem ser preservadas**. O Passo 1 do filho 02 lista `role_line` (e implicitamente `section.*`) como "órfã do MorphingText" a remover — **isso quebraria `docs/index.astro`** (`createT` lança em dev; em prod renderiza `[[en:home:home.hero.role_line]]` no rodapé). Este filho é o dono do inventário e cravando a poda correta fecha esse buraco.

## 4. Implementação passo a passo

### Passo 1 — Decisão cravada: i18n estruturado (não inline)

**Cravo: copy da home em `src/i18n/{pt-br,en}/home.json`, reaproveitando o namespace `home`.** Não inline nos `data = {…}` das páginas. Por quê:

1. **Fonte única por locale.** Hoje a copy vive duplicada em dois objetos `data` (PT em `index.astro`, EN em `en/index.astro`) sem nada que garanta que mudaram juntos — convite ao drift. Com i18n, cada string existe **uma vez por locale**, num arquivo cuja única razão de existir é ser tradução.
2. **Paridade gated de graça.** `check-i18n.mjs` (no `prebuild`) já exige conjuntos de chaves idênticos PT/EN por arquivo. Esquecer de traduzir uma chave **quebra o build**, não vira bug silencioso em produção.
3. **A casa já faz assim.** `Header.astro` e `Footer.astro` já consomem o namespace `home` via `createT(loadMessages(locale,"home"), …)`. Inline na home seria o único ponto fora do padrão — "entenda a casa".
4. **O island do toggle fica burro.** Copy em JSON → a página resolve `t()` → passa strings por props ao island do filho 05. O island não embute texto, não duplica copy no bundle JS, e é agnóstico de locale.

**Alternativa registrada (inline por página) — rejeitada.** Manter os `data = {…}` literais. *Único ganho real:* a copy EN inline ficaria sob `src/pages/en/**`, que o `check-en-no-pt` **já varre** — ou seja, leak de PT seria pego automaticamente. *Perdas:* sem fonte única, sem paridade gated, contra o padrão da casa, e o island precisaria de copy hardcoded. Eu **reaproprio** o único ganho do inline estendendo o `check-en-no-pt` para varrer `src/i18n/en` (Passo 4) — aí a copy estruturada herda a checagem automática **e** mantém todas as vantagens. Inline perde sem contrapartida.

### Passo 2 — Reescrever `pt-br/home.json` (fonte PT)

Conteúdo completo do arquivo (poda + preserva + adiciona, numa tacada). As linhas em branco são whitespace JSON válido — pode manter para leitura.

```json
{
  "home.meta.title": "Victor de Alcântara Bueno — Construo software para o pior dia",
  "home.meta.description": "Construo o sistema que funciona quando nada mais funciona: produtos web e mobile offline-first, com integrações críticas que aguentam o campo — não só a demo.",

  "home.hero.thesis": "Eu construo o sistema que funciona quando nada mais funciona.",
  "home.hero.subhead": "Produtos web e mobile offline-first, com integrações críticas que aguentam o campo — não só o ambiente controlado da demo.",
  "home.hero.tagline": "Offline. Sob carga. Em campo. Continua de pé.",
  "home.hero.cta": "Ver o que sobrevive ao campo",

  "home.hero.role_line": "ENGENHEIRO DE SOFTWARE",
  "home.section.projects": "Projetos",
  "home.section.about": "Sobre",
  "home.section.contact": "Contato",

  "home.scar.eyebrow": "Em produção",
  "home.scar.value": "[___] meses",
  "home.scar.unit": "rodando offline",
  "home.scar.caption": "em [contexto real], com [___] sincronizações — zero perda de dado. Quando a conexão voltou, tudo bateu.",

  "home.tension.title_field": "Software para o pior dia.",
  "home.tension.title_demo": "Não para a demo.",
  "home.tension.lead_demo": "Quase todo software é construído para o happy path: boa conexão, dados limpos, tudo no lugar. O seu problema não vive lá.",
  "home.tension.lead_field": "Ele vive no galpão sem sinal, no dispositivo que passou doze horas no sol, na integração que precisa responder mesmo quando o outro lado caiu. É pra esse mundo que eu construo.",

  "home.field.eyebrow": "Em campo",
  "home.field.proof1_title": "Offline-first de verdade.",
  "home.field.proof1_body": "O app funciona primeiro sem rede e sincroniza depois — não o contrário.",
  "home.field.proof2_title": "Integrações que assumem a falha.",
  "home.field.proof2_body": "Construídas partindo do princípio de que o outro lado vai cair. E que seguram a barra quando ele cai.",
  "home.field.proof3_title": "Confiabilidade medida no pior cenário.",
  "home.field.proof3_body": "Não na média. No pico, na borda, no dia ruim.",
  "home.field.recruiter_body": "O que eu entrego num time de produto: [stack principal], e a parte que ninguém quer tocar — o que precisa funcionar quando quebrar custa caro.",
  "home.field.client_body": "Do escopo ao sistema rodando: eu assumo a parte crítica do projeto, a que não pode ter um dia ruim.",

  "home.toggle.recruiter": "Para recrutadores",
  "home.toggle.client": "Para clientes",
  "home.toggle.support": "Mesmo trabalho. O que muda é o que você precisa ver.",

  "home.cta.recruiter_lead": "Estou aberto a vagas onde quebrar custa caro.",
  "home.cta.recruiter_button": "Ver perfil e cases",
  "home.cta.client_lead": "Tem um sistema que não pode cair? Vamos conversar.",
  "home.cta.client_button": "Falar sobre o projeto"
}
```

**Chaves PODADAS** (MorphingText, sem nenhum consumidor — verificado por grep em todo `src/`): `home.hero.tagline_prefix`, `home.hero.tagline_morph_1`, `home.hero.tagline_morph_2`, `home.hero.tagline_morph_3`, `home.hero.microcopy`, `home.hero.cta_primary`, `home.hero.cta_secondary`, `home.hero.scroll_right`, `home.about.p1`, `home.about.p2`, `home.about.p3`, `home.contact.p`, `home.projects.cta`.

**Chaves PRESERVADAS** (consumidas por `Header`/`Footer` em `docs/index.astro` — **não** remover): `home.hero.role_line`, `home.section.projects`, `home.section.about`, `home.section.contact`.

**Chaves REPROPOSITADAS** (existiam, não eram consumidas, agora alimentam a nova home): `home.meta.title`, `home.meta.description` — valor atualizado para ecoar a tese.

### Passo 3 — Espelhar `en/home.json` (mesmo conjunto de chaves)

Conteúdo completo. EN escrito limpo das 10 palavras PT banidas (auditoria na §6). Mesmas 34 chaves, mesma ordem.

```json
{
  "home.meta.title": "Victor de Alcântara Bueno — I build software for the worst day",
  "home.meta.description": "I build the system that works when nothing else does: offline-first web and mobile products, with critical integrations that hold up in the field — not just a demo.",

  "home.hero.thesis": "I build the system that works when nothing else does.",
  "home.hero.subhead": "Offline-first web and mobile products, with critical integrations built to hold up in the field — not just the controlled environment of a demo.",
  "home.hero.tagline": "Offline. Under load. In the field. Still standing.",
  "home.hero.cta": "See what survives the field",

  "home.hero.role_line": "SOFTWARE ENGINEER",
  "home.section.projects": "Projects",
  "home.section.about": "About",
  "home.section.contact": "Contact",

  "home.scar.eyebrow": "In production",
  "home.scar.value": "[___] months",
  "home.scar.unit": "running offline",
  "home.scar.caption": "in [real-world setting], across [___] syncs — zero data loss. When the connection came back, everything matched.",

  "home.tension.title_field": "Built for the worst day.",
  "home.tension.title_demo": "Not for the demo.",
  "home.tension.lead_demo": "Almost all software is built for the happy path: good connection, clean data, everything in place. Your problem doesn't live there.",
  "home.tension.lead_field": "It lives in the warehouse with no signal, in the device that spent twelve hours in the sun, in the integration that has to respond even when the other side goes down. That's the world I build for.",

  "home.field.eyebrow": "In the field",
  "home.field.proof1_title": "Truly offline-first.",
  "home.field.proof1_body": "The app works without a network first and syncs later — not the other way around.",
  "home.field.proof2_title": "Integrations that assume failure.",
  "home.field.proof2_body": "Built on the assumption that the other side will go down — and to hold the line when it does.",
  "home.field.proof3_title": "Reliability measured at the worst case.",
  "home.field.proof3_body": "Not at the average. At the peak, at the edge, on the bad day.",
  "home.field.recruiter_body": "What I bring to a product team: [main stack], and the part nobody wants to touch — the part that has to work when breaking gets expensive.",
  "home.field.client_body": "From scope to a running system: I take on the critical piece — the one that can't have a bad day.",

  "home.toggle.recruiter": "For recruiters",
  "home.toggle.client": "For clients",
  "home.toggle.support": "Same work. What changes is what you need to see.",

  "home.cta.recruiter_lead": "I'm open to roles where breaking gets expensive.",
  "home.cta.recruiter_button": "See profile and cases",
  "home.cta.client_lead": "Got a system that can't go down? Let's talk.",
  "home.cta.client_button": "Talk about your project"
}
```

### Passo 4 — Estender `check-en-no-pt.mjs` para varrer `src/i18n/en`

Hoje o gate só caminha por `src/pages/en` (`check-en-no-pt.mjs:9`). Como a copy EN passa a viver em `src/i18n/en/home.json`, **sem esta extensão o gate não enxerga a copy da home** — a promessa "EN pega vazamento PT automaticamente" seria falsa. Diff cirúrgico:

```diff
-const enRoot = path.join(projectRoot, "src", "pages", "en");
+const enRoots = [
+  path.join(projectRoot, "src", "pages", "en"),
+  path.join(projectRoot, "src", "i18n", "en"),
+];
```

```diff
-  const files = await walk(enRoot);
+  let files = [];
+  for (const root of enRoots) files = await walk(root, files);
```

(`walk(dir, files = [])` já acumula no array passado e o retorna — por isso o loop encadeia.)

**Por que é seguro estender agora:** rodei a busca pelas 10 palavras banidas (fronteira de palavra, case-insensitive) em **todo** `src/i18n/en` (`common`, `cards`, `home`, `projects`, `project_p3/p5/p7`) e **não há nenhuma ocorrência**. Em especial: `"Projects"`, `"Contact"`, `"risks"`, `"scope"` que aparecem hoje no EN **não casam** com `\bprojetos\b`/`\bcontato\b`/`\brisco\b` (grafia diferente). Logo, a extensão **não quebra** nada existente e passa a proteger toda a copy EN — agora e no futuro.

### Passo 5 — Wiring `createT`/`loadMessages` nos dois `index.astro`

Assinatura real (de `adorable-azimuth/src/i18n/index.ts`): `createT(messages, { locale, namespace })` e `loadMessages(locale, namespace)`. Alias `@` → `src`, então `@/i18n` resolve `src/i18n/index.ts`. Mesmo padrão de `Header.astro:11`.

**`adorable-azimuth/src/pages/index.astro` (PT)** — substitui o objeto `data` hardcoded:

```astro
---
import BaseLayout from "@/components/BaseLayout.astro";
import HeroAfirmacao from "@/components/home/HeroAfirmacao.astro";   // filho 02
import Cicatriz from "@/components/home/Cicatriz.astro";             // filho 03
import TensionSection from "@/components/home/TensionSection.astro"; // filho 04
import EmCampoToggle from "@/components/home/EmCampoToggle.astro";   // filho 05 (nome final é de 05)
import { loadMessages, createT } from "@/i18n";

export const prerender = true; // OBRIGATÓRIO: semantics-gate só lê dist/*.html

const locale = "pt-br" as const;
const t = createT(loadMessages(locale, "home"), { locale, namespace: "home" });
const isEN = false;
---
<BaseLayout title={t("home.meta.title")} description={t("home.meta.description")}>
  <Fragment slot="nav"><!-- nav mínima + assinatura: filho 06 --></Fragment>

  <HeroAfirmacao
    thesis={t("home.hero.thesis")}
    subhead={t("home.hero.subhead")}
    tagline={t("home.hero.tagline")}
    ctaLabel={t("home.hero.cta")}
    ctaHref="#em-campo"
  />

  <Cicatriz
    eyebrow={t("home.scar.eyebrow")}
    value={t("home.scar.value")}
    unit={t("home.scar.unit")}
    caption={t("home.scar.caption")}
  />

  <TensionSection
    titleField={t("home.tension.title_field")}
    titleDemo={t("home.tension.title_demo")}
    leadDemo={t("home.tension.lead_demo")}
    leadField={t("home.tension.lead_field")}
  />

  <!-- Bloco 5: as 3 provas compartilhadas + corpo 3 (recrutador/cliente) +
       microcopy + CTA final. O toggle troca SÓ corpo 3 e o texto do CTA;
       por isso TODAS as variantes são resolvidas aqui e passadas por props
       ao island (que não carrega copy). Estrutura final do componente é de 05. -->
  <EmCampoToggle
    eyebrow={t("home.field.eyebrow")}
    proofs={[
      { title: t("home.field.proof1_title"), body: t("home.field.proof1_body") },
      { title: t("home.field.proof2_title"), body: t("home.field.proof2_body") },
      { title: t("home.field.proof3_title"), body: t("home.field.proof3_body") }
    ]}
    recruiterBody={t("home.field.recruiter_body")}
    clientBody={t("home.field.client_body")}
    toggleRecruiter={t("home.toggle.recruiter")}
    toggleClient={t("home.toggle.client")}
    toggleSupport={t("home.toggle.support")}
    recruiterLead={t("home.cta.recruiter_lead")}
    recruiterButton={t("home.cta.recruiter_button")}
    recruiterHref={isEN ? "/en/recruiter" : "/recruiter"}
    clientLead={t("home.cta.client_lead")}
    clientButton={t("home.cta.client_button")}
    clientHref={isEN ? "/en/client" : "/client"}
  />

  <Fragment slot="footer"><!-- assinatura/rodapé: filho 06 --></Fragment>
</BaseLayout>
```

**`adorable-azimuth/src/pages/en/index.astro` (EN)** — idêntico, trocando só duas linhas:

```astro
const locale = "en" as const;
const isEN = true;
```

`ctaHref="#em-campo"` é o mesmo nos dois (âncora na mesma página). Os `*Href` de recrutador/cliente já saem corretos via `isEN` (deep-link para `/en/recruiter` e `/en/client`, destinos que sobrevivem). Nenhum texto literal entra no `.astro` — o EN é resolvido em build a partir de `en/home.json`, então o markup de `src/pages/en/index.astro` não carrega palavra PT.

### Passo 6 — Verificar localmente

```text
cd adorable-azimuth
pnpm check:i18n                      # paridade: os mesmos 34 chaves em pt-br/home.json e en/home.json
node scripts/check-en-no-pt.mjs      # agora também varre src/i18n/en — deve passar (auditoria §6)
pnpm build                           # prebuild roda check-i18n + check-en-no-pt; prerender gera dist/index.html e dist/en/index.html
node scripts/semantics-gate.cjs      # h1 == 1 nas duas páginas
node scripts/budget:gate || node scripts/js-budget.cjs   # bundle inalterado por este filho
```

## 5. Copy

Mapa completo, colável. Coluna PT = doc fonte (Seções 4–5). Coluna EN = tradução de referência, já auditada contra as palavras banidas. `[___]`, `[contexto real]`, `[stack principal]` = dado real que falta (ver "O que perguntar").

### Bloco 2 — HERO (consumido por 02)

| Chave | PT | EN |
|---|---|---|
| `home.meta.title` | Victor de Alcântara Bueno — Construo software para o pior dia | Victor de Alcântara Bueno — I build software for the worst day |
| `home.meta.description` | Construo o sistema que funciona quando nada mais funciona: produtos web e mobile offline-first, com integrações críticas que aguentam o campo — não só a demo. | I build the system that works when nothing else does: offline-first web and mobile products, with critical integrations that hold up in the field — not just a demo. |
| `home.hero.thesis` | Eu construo o sistema que funciona quando nada mais funciona. | I build the system that works when nothing else does. |
| `home.hero.subhead` | Produtos web e mobile offline-first, com integrações críticas que aguentam o campo — não só o ambiente controlado da demo. | Offline-first web and mobile products, with critical integrations built to hold up in the field — not just the controlled environment of a demo. |
| `home.hero.tagline` | Offline. Sob carga. Em campo. Continua de pé. | Offline. Under load. In the field. Still standing. |
| `home.hero.cta` | Ver o que sobrevive ao campo | See what survives the field |

### Bloco 3 — A CICATRIZ (consumido por 03) — **contém os únicos `[___]` da home**

| Chave | PT | EN |
|---|---|---|
| `home.scar.eyebrow` | Em produção | In production |
| `home.scar.value` | **[___] meses** | **[___] months** |
| `home.scar.unit` | rodando offline | running offline |
| `home.scar.caption` | em **[contexto real]**, com **[___]** sincronizações — zero perda de dado. Quando a conexão voltou, tudo bateu. | in **[real-world setting]**, across **[___]** syncs — zero data loss. When the connection came back, everything matched. |

### Bloco 4 — A TENSÃO (consumido por 04)

| Chave | PT | EN |
|---|---|---|
| `home.tension.title_field` | Software para o pior dia. | Built for the worst day. |
| `home.tension.title_demo` | Não para a demo. | Not for the demo. |
| `home.tension.lead_demo` | Quase todo software é construído para o happy path: boa conexão, dados limpos, tudo no lugar. O seu problema não vive lá. | Almost all software is built for the happy path: good connection, clean data, everything in place. Your problem doesn't live there. |
| `home.tension.lead_field` | Ele vive no galpão sem sinal, no dispositivo que passou doze horas no sol, na integração que precisa responder mesmo quando o outro lado caiu. É pra esse mundo que eu construo. | It lives in the warehouse with no signal, in the device that spent twelve hours in the sun, in the integration that has to respond even when the other side goes down. That's the world I build for. |

### Bloco 5 — EM CAMPO: as 3 provas compartilhadas (corpo 2, consumido por 05)

| Chave | PT | EN |
|---|---|---|
| `home.field.eyebrow` | Em campo | In the field |
| `home.field.proof1_title` | Offline-first de verdade. | Truly offline-first. |
| `home.field.proof1_body` | O app funciona primeiro sem rede e sincroniza depois — não o contrário. | The app works without a network first and syncs later — not the other way around. |
| `home.field.proof2_title` | Integrações que assumem a falha. | Integrations that assume failure. |
| `home.field.proof2_body` | Construídas partindo do princípio de que o outro lado vai cair. E que seguram a barra quando ele cai. | Built on the assumption that the other side will go down — and to hold the line when it does. |
| `home.field.proof3_title` | Confiabilidade medida no pior cenário. | Reliability measured at the worst case. |
| `home.field.proof3_body` | Não na média. No pico, na borda, no dia ruim. | Not at the average. At the peak, at the edge, on the bad day. |

### Bloco 5 — CORPO 3: a variação do toggle (consumido por 05)

| Chave | PT | EN |
|---|---|---|
| `home.field.recruiter_body` | O que eu entrego num time de produto: **[stack principal]**, e a parte que ninguém quer tocar — o que precisa funcionar quando quebrar custa caro. | What I bring to a product team: **[main stack]**, and the part nobody wants to touch — the part that has to work when breaking gets expensive. |
| `home.field.client_body` | Do escopo ao sistema rodando: eu assumo a parte crítica do projeto, a que não pode ter um dia ruim. | From scope to a running system: I take on the critical piece — the one that can't have a bad day. |

### Bloco 5 — MICROCOPY do toggle (consumido por 05)

| Chave | PT | EN |
|---|---|---|
| `home.toggle.recruiter` | Para recrutadores | For recruiters |
| `home.toggle.client` | Para clientes | For clients |
| `home.toggle.support` | Mesmo trabalho. O que muda é o que você precisa ver. | Same work. What changes is what you need to see. |

### Bloco 6 — CTA FINAL (consumido por 05/06; o toggle troca qual par aparece)

| Chave | PT | EN |
|---|---|---|
| `home.cta.recruiter_lead` | Estou aberto a vagas onde quebrar custa caro. | I'm open to roles where breaking gets expensive. |
| `home.cta.recruiter_button` | Ver perfil e cases | See profile and cases |
| `home.cta.client_lead` | Tem um sistema que não pode cair? Vamos conversar. | Got a system that can't go down? Let's talk. |
| `home.cta.client_button` | Falar sobre o projeto | Talk about your project |

### O que perguntar (dado real que falta)

Três `[___]` da Cicatriz + 1 placeholder de stack. Trate como **bloqueador de launch** (mesma régua do filho 03 — é a única peça que não está escrita no doc fonte):

1. **`home.scar.value` — "Por quanto tempo?"** Maior período rodando offline/sem cair/em produção ininterrupta → vira `[___] meses`.
2. **`home.scar.caption` `[___]` — "Sob qual carga?"** Volume no pior pico (sincronizações, dispositivos, transações) → vira `[___] sincronizações`.
3. **`home.scar.caption` `[contexto real]` — onde rodou?** O ambiente concreto (coletores de campo, galpão, etc.).
4. **`home.field.recruiter_body` `[stack principal]`** — qual stack destacar para recrutadores (ex.: TypeScript/React/Node, Flutter, Postgres). Não é bloqueador de tese, mas o corpo 3 recrutador fica capenga sem ela.

Enquanto o dado real não chega, **mantenha os `[___]` no ar** — o filho 03 dá tratamento visual de urgência (`data-pending`). Para o `[stack principal]`, o fallback aceitável é encurtar a frase ("O que eu entrego num time de produto: a parte que ninguém quer tocar…") até o stack vir.

### Tokens PT banidos no EN — armadilhas e como a copy as evita

`check-en-no-pt.mjs` reprova, com fronteira de palavra (`\bpalavra\b`, case-insensitive), estes 10 termos **PT**: `portaria`, `custo`, `tempo`, `projetos`, `contato`, `latência`, `disponível`, `evidência`, `risco`, `qualidade`.

A armadilha conceitual: **9 dos 10 são seguros por grafia** — o cognato inglês é escrito diferente do PT, então não casa:

| Banido (PT) | Cognato EN seguro | Na copy EN deste filho |
|---|---|---|
| `custo` | cost / **expensive** | "breaking gets **expensive**" |
| `tempo` | **time / duration** | "twelve hours", "months" (nunca "tempo") |
| `projetos` | projects / **work / cases / build** | "product **team**", "**cases**", "**scope**" |
| `contato` | contact / **talk / reach out** | "Let's **talk**" |
| `risco` | risk / **failure / breaking** | "assume **failure**", "where **breaking** gets expensive" |
| `qualidade` | quality / **reliability** | "**Reliability** measured at the worst case" |
| `disponível` | available / **open to** | "I'm **open to** roles" |
| `evidência` | evidence / **proof** | (sem uso; provas são mostradas, não nomeadas) |
| `latência` | latency | (sem uso) |
| `portaria` | (front desk) | (sem uso) |

**A única armadilha de verdade:** `tempo` **também é uma palavra inglesa** (termo musical) — é o único da lista com grafia idêntica que poderia vazar num texto EN legítimo. A copy acima nunca usa "tempo": usa **"twelve hours"** (tensão) e **"months"** (cicatriz). Os demais ("Projects", "Contact" nas chaves preservadas, "risks"/"scope" em outras namespaces) são EN e **não casam** com os termos PT. Auditoria por chave: nenhuma das 34 strings EN contém qualquer um dos 10 tokens.

## 6. Conformidade com gates

- **semantics-gate (um único `<h1>`):** este filho **não emite markup** — só strings. Nenhuma chave é renderizada como `<h1>` exceto `home.hero.thesis` (no `HeroAfirmacao`, filho 02). `home.scar.value` (o número), `home.tension.title_*`, `home.field.*` são `<p>`/`<h2>`/`<span>` nos componentes — tipo grande, nunca heading-de-topo. A copy foi fatiada para *permitir* essa hierarquia (número em `value` separado de `caption`). `<nav>/<main>/<footer>/<title>/meta` vêm do `BaseLayout`; `home.meta.*` alimenta `<title>`/`<meta description>`.
- **check-en-no-pt (BLOQUEANTE, roda no `prebuild`):** verde. (1) `src/pages/en/index.astro` não tem texto literal — só `t()` — então não há palavra PT no arquivo. (2) A copy EN passa a viver em `src/i18n/en/home.json`, e o **Passo 4 estende o gate para varrer `src/i18n/en`**, fechando o buraco. (3) As 34 strings EN foram auditadas (§5) e nenhuma contém os 10 tokens. (4) A extensão é segura: `src/i18n/en` inteiro já está limpo (verificado por grep).
- **check:i18n (BLOQUEANTE, paridade de chaves):** verde. `pt-br/home.json` e `en/home.json` têm **exatamente o mesmo conjunto de 34 chaves**. Poda, preservação e adição acontecem **nos dois arquivos no mesmo commit** — adicionar/remover em só um quebra o `prebuild`.
- **js-budget (≤150KB):** verde, delta **0KB**. i18n é resolvido em build-time (server/prerender); strings viram texto no HTML, não JS. O island do toggle (filho 05) recebe copy por props — props serializam no HTML do island, não incham `dist/client/_astro/*.js`. Este filho não adiciona dependência nem island.
- **token-gate (informativo):** N/A — não há CSS aqui. O diff em `check-en-no-pt.mjs` é JS de build, fora do alcance do token-gate (que varre `src/components`/`src/pages`/`src/styles`).
- **docs-gate:** sem impacto. Não toca `AGENTS.md`/`ARQUITETURA.md`/`GLOSSARIO.md`/`DOCUMENTACAO.md` nem `docs/modulos/**`. `plano-reconstrucao-home/` não é varrida. (Se 01 documentar o fluxo i18n da home em `ARQUITETURA.md`, o rodapé "Última revisão:" é tarefa de 01.)
- **islands-gate:** N/A — nenhum `.tsx` criado. `check-en-no-pt.mjs` é `.mjs` em `scripts/`, fora do alcance do gate de islands.

## 7. Critérios de aceitação

- [ ] `pt-br/home.json` e `en/home.json` têm o **mesmo conjunto de 34 chaves**; `pnpm check:i18n` verde.
- [ ] As 13 chaves mortas do MorphingText foram **removidas dos dois arquivos**; as 4 chaves `role_line`/`section.*` foram **preservadas**.
- [ ] `docs/index.astro` continua renderizando `Header`/`Footer` sem `[[...]]` — `home.hero.role_line` e `home.section.*` resolvem.
- [ ] `check-en-no-pt.mjs` agora varre `src/pages/en` **e** `src/i18n/en`, e passa (verde) com a nova copy.
- [ ] Nenhuma das 34 strings EN contém os 10 tokens PT banidos (auditoria por chave bate).
- [ ] `src/pages/index.astro` e `src/pages/en/index.astro` não têm copy hardcoded — toda string vem de `t(...)`; o objeto `data = {…}` antigo sumiu.
- [ ] Ambas as páginas mantêm `export const prerender = true`; `pnpm build` gera `dist/index.html` e `dist/en/index.html`.
- [ ] O island do toggle (filho 05) recebe **todas** as variantes (`recruiter_body`, `client_body`, ambos os pares de CTA, microcopy) por props — não há copy embutida no `.tsx`.
- [ ] `js-budget.cjs` reporta o mesmo total de antes (delta 0KB).
- [ ] Os `[___]` da Cicatriz e o `[stack principal]` estão sinalizados como pendência de dado real (não silenciados).

## 8. Decisões cravadas e riscos

**Cravado — i18n estruturado, namespace `home` reaproveitado.** Fonte única por locale + paridade gated + alinhamento com `Header`/`Footer`. Abri mão da conveniência de ler a copy ao lado do markup (inline); reconquistei o único ganho real do inline (checagem EN automática) estendendo o `check-en-no-pt` para `src/i18n/en`. Trade-off líquido a favor do estruturado, sem contrapartida.

**Cravado — estender `check-en-no-pt` em vez de confiar em disciplina manual.** "Erros e bordas não são depois": uma promessa de gate que o gate não cumpre é pior que não ter promessa. O custo é tocar um script de gate (2 trechos, comportamento idêntico para `src/pages/en`, só adiciona cobertura). Verifiquei que `src/i18n/en` já está limpo, então a extensão não retroage quebrando o build. Alternativa rejeitada: "escrever EN limpo e torcer" — é o que os filhos 03/04 assumem ("fora do alvo do gate, ainda assim limpo"); aceitável por bloco, frágil como política de namespace.

**Cravado — poda cirúrgica, não terra arrasada.** O namespace `home` é semi-órfão, não órfão. Preservo `home.hero.role_line` e `home.section.*` porque `docs/index.astro` os consome via `Header`/`Footer`. Isso **corrige** o Passo 1 do filho 02, que os listaria como removíveis. Abri mão de um JSON "limpo" (essas 4 chaves são, conceitualmente, rótulos de nav/rodapé que *deveriam* morar em `common.json`, não em `home`) em troca de não quebrar uma página viva fora do escopo desta reconstrução.

**Cravado — copy fatiada em chaves atômicas.** `value`/`unit`/`caption` (não uma frase só); `title_field`/`title_demo` (não um título só); `proofN_title`/`proofN_body`. A hierarquia "número grita, legenda sussurra" e o contraste "happy path riscado vs. campo vivo" vivem no **markup**, não em parsing de string. Data model honesto: cada pedaço que recebe tratamento visual distinto é uma chave distinta.

**Cravado — island do toggle sem copy.** A página resolve `t()` e injeta strings por props; o `.tsx` é agnóstico de locale e não duplica texto no bundle. Mantém i18n como fonte única e o js-budget intocado.

**Riscos / bombas-relógio:**
- **Conflito com o filho 02.** Se 02 for digitado *antes* deste e remover `role_line`/`section.*` como planeja, `docs/index.astro` quebra. **Mitigação:** este filho é o dono do inventário; sincronizar a poda com 02 (este `.md` manda) e rodar `pnpm dev` em `/docs` após a edição do `home.json`.
- **Drift de chave entre filhos.** 02–06 declaram chaves; se um filho mudar o nome de uma chave sem atualizar este mapa, `t()` retorna `[[...]]` (prod) ou lança (dev). **Mitigação:** este arquivo é o contrato canônico de chaves; qualquer renomeação passa por aqui.
- **`[___]` em produção.** Lançar a `/` pública com placeholder desfaz a tese (volta a *pedir* confiança). **Mitigação:** launch-gate **humano** (P0), não gate de CI — travar o build por copy travaria deploys por um dado que é decisão humana. O tratamento visual de urgência (filho 03) é a forcing function.
- **`tempo` (EN musical) e futuros tradutores.** A única palavra banida que é EN legítima. Quem traduzir copy nova precisa lembrar: nunca "tempo"; use "time"/"duration"/uma quantidade concreta. A extensão do gate (Passo 4) pega o deslize no `prebuild`.
- **Dívida conceitual registrada (não resolvida agora):** `role_line`/`section.*` deveriam migrar para `common.json`. Fazer isso toca `Header.astro`, `Footer.astro` e `common.json` — fora do escopo desta reconstrução e arriscado para `docs/index.astro`. Fica como cleanup futuro, dito em voz alta.

## 9. Conexões

- Índice-mãe: [00-indice-mae.md](00-indice-mae.md)
- Depende de (contrato de chaves + esqueleto da página): [01-fundacao-arquitetura.md](01-fundacao-arquitetura.md)
- Atravessa e materializa a copy de: [02-hero-afirmacao.md](02-hero-afirmacao.md) · [03-cicatriz-prova.md](03-cicatriz-prova.md) · [04-tensao.md](04-tensao.md) · [05-em-campo-toggle.md](05-em-campo-toggle.md) · [06-cta-contato-rodape.md](06-cta-contato-rodape.md)
- Coordenação de estilo (sem dependência de chave): [08-estilo-tokens-animacao.md](08-estilo-tokens-animacao.md)
