# 09. Qualidade, Gates, Docs e Ordem de Execução

> Este é o filho transversal: ele não constrói um bloco da home — ele prova que os blocos 01–08 fecham juntos. Mapeia cada gate do CI a esta obra com o comando exato de verificação, define a ordem de execução ranqueada (Seção 7 da autópsia), atualiza a documentação viva, conserta os testes e2e, governa o rollout (substituir e só depois matar o `HomeHybridLanding`) e crava a Definition of Done global. Serve à régua do AGENTS.md: "a prova antes de entregar" — o CI prova que funciona; este filho prova que está *certo*.

## 1. Objetivo

Fechar o ciclo da reconstrução (autópsia `da-autopsia-ao-bisturi-reconstrucao.md`, Seção 7 "Ordem de execução" + Seção 8 "Lista de morte") garantindo que a nova home entra em produção **verde em todos os gates, documentada, testada e sem deixar o cadáver da bifurcação no repo**. Governam este filho três leis do AGENTS.md: **"A prova antes de entregar"** (o CI não basta; auditar h1-único, paridade i18n e EN-sem-PT à mão, com olhos de estranho impaciente), **"Resolva o problema, não o pedido"** (o pedido é "passar nos gates"; o problema é *trocar* a home sem regressão e *remover* o que ela substitui) e **"Código é comunicação"** (a `ARQUITETURA.md` precisa contar que a home agora é um manifesto i18n-driven, não duas portas hardcoded).

## 2. Arquivos afetados

Todos os caminhos sob a raiz do repo (`C:/Users/TONCONNECT/Documents/Portifolio/`) ou sob `adorable-azimuth/`.

| Caminho exato | Ação | Por que |
|---|---|---|
| `adorable-azimuth/tests/i18n.spec.ts` | editar | Os dois testes de hero asseram `#hero-title` contém `ENGENHEIRO DE SOFTWARE` / `SOFTWARE ENGINEER` — copy e seletor que **morrem** com o hero novo (child 02 usa `#hero-thesis` + a tese). Atualizar + **adicionar** testes de h1-único, do toggle (`data-mode`) e da âncora `#em-campo`. |
| `ARQUITETURA.md` (raiz) | editar | Adicionar a seção **"Páginas — Home"** (hoje a home não é descrita; é dívida de doc). Renovar o rodapé `Última revisão:` (exigido pelo `docs-gate`). |
| `adorable-azimuth/docs/modulos/interatividade/API.md` | editar | Inventariar a island nova `ModeToggle.tsx` e o patch de teclado do `SegmentedButton.tsx` (child 05). Renovar rodapé. |
| `adorable-azimuth/docs/modulos/interatividade/REGRA.md` | editar (se necessário) | Se a regra do módulo precisar citar o novo island/`data-mode`. Renovar rodapé se tocado. |
| `adorable-azimuth/docs/modulos/i18n/API.md` | editar | Marcar o namespace `home` como **vivo** (deixou de ser órfão do MorphingText). Renovar rodapé. |
| `adorable-azimuth/src/components/HomeHybridLanding.astro` | **excluir (só após paridade)** | A bifurcação das duas portas (Lista de Morte §8). Removido **depois** que a nova home está no ar e verde — não no mesmo passo (ver Rollout, §4.5). |
| `adorable-azimuth/src/components/HomeLandingRedesign.astro` | excluir (opcional, limpeza) | Single-scroll não conectado; só referência. Se ninguém doar o padrão hero-bar, é código morto — remover na limpeza derruba 158 violações de token informativas. |
| `adorable-azimuth/scripts/check-en-no-pt.mjs` | editar (decisão de time — §8) | Estender a raiz varrida para incluir `src/i18n/en/**`. Hoje o gate só varre `src/pages/en/**`; com a home i18n-driven, a copy EN vive em `en/home.json` e **escapa do gate**. |

> Este filho **não cria** componente de home nem chave i18n — esses são dos children 01–08. Ele **verifica** o trabalho deles e fecha as pontas soltas (testes, docs, rollout). Tudo o que ele edita está **fora** do caminho dos gates de HTML/JS (são `.md`, `.spec.ts` e um `.mjs` de gate) — exceto a exclusão do `HomeHybridLanding`, que é o ato central do rollout.

## 3. Dependências

**Precisam estar implementados antes deste (este filho audita os seis):**

- [01-fundacao-arquitetura.md](01-fundacao-arquitetura.md) — shell da home, wrapper único do modo, ordem dos blocos, import do CSS temático, remoção da referência ao `HomeHybridLanding` nas páginas.
- [02-hero-afirmacao.md](02-hero-afirmacao.md) — o **único `<h1>`** (`#hero-thesis`), cujo texto os testes e2e passam a asserir.
- [03-cicatriz-prova.md](03-cicatriz-prova.md) — o bloco com os `[___]`; o **único bloqueador de conteúdo** que o launch-gate humano segura.
- [04-tensao.md](04-tensao.md), [05-em-campo-toggle.md](05-em-campo-toggle.md), [06-cta-contato-rodape.md](06-cta-contato-rodape.md) — `<h2>`/`<p>` que **não** podem virar `<h1>`; o toggle (`data-mode`) e o ®/assinatura que os testes e docs descrevem.
- [07-i18n-conteudo.md](07-i18n-conteudo.md) — esquema final de `home.json` (paridade pt-br/en, poda das órfãs); este filho audita o conjunto-união de chaves.
- [08-estilo-tokens-animacao.md](08-estilo-tokens-animacao.md) — nome canônico do stylesheet temático e do wrapper de modo; **este filho registra a decisão na `ARQUITETURA.md`**.

**Dependem deste:** nenhum filho. Este fecha o ciclo — ele é a condição de **shippar** (`/` pública = nova home) e de **limpar** (deletar o `HomeHybridLanding`).

## 4. Implementação passo a passo

### 4.1 — A ORDEM DE EXECUÇÃO (Seção 7 da autópsia, mapeada aos filhos)

A autópsia ranqueia por **impacto emocional**, não por facilidade. Mas há uma verdade técnica acima dela: alguns filhos são *andaime* — sem impacto emocional próprio, mas sem eles nenhum bloco renderiza. Crave-se a reconciliação: o andaime (01/07/08) entra na **mesma primeira onda** do movimento 10x, porque é o concreto que se despeja antes de erguer a estátua; o que o visitante *sente* primeiro é o hero + a morte da bifurcação.

| Ordem | Movimento da autópsia (§7) | Impacto | Filhos que entregam |
|---|---|---|---|
| **Onda 0 — Andaime** | Pré-requisito técnico de tudo | (enabler) | **01** (shell: wrapper de modo, ordem dos blocos, kill da referência ao `HomeHybridLanding`, import do CSS) · **07** (reativar `home.json`, paridade, poda das órfãs) · **08** (stylesheet temático, tokens, keyframes, prefixo de classe) |
| **1 — [10x]** | Matar a bifurcação + hero com a tese como maior tipo | 10x | **02** (hero `#hero-thesis`) — sobre o andaime da Onda 0 |
| **2** | Plantar a cicatriz logo abaixo do hero | Promessa → crença | **03** |
| **3** | Nomear a tensão (happy path vs. campo) | Dá inimigo e emoção | **04** |
| **4 — [polimento]** | Refazer "em campo" com o toggle discreto | Triagem subordinada ao gancho | **05** |
| **5 — [polimento]** | Microcopy, tagline, rodapé, remover o ® | Acabamento; cosplay vira marca | **06** |
| **Onda 6 — Fecho** | A prova antes de entregar + limpar o cadáver | (qualidade) | **09** (este: testes, docs, gates, rollout, DoD) |

**Por que esta ordem e não a literal da §7:** a §7 lista "matar a bifurcação" como passo 1, mas *matar* tem duas metades — **parar de renderizar** (Onda 0, child 01: as páginas deixam de importar `HomeHybridLanding`) e **deletar o arquivo** (Onda 6, child 09: só depois da paridade). Separá-las dá um ponto de revert barato (§4.5). O resto segue a §7 verbatim.

**Regra de paralelismo:** dentro da Onda 0, `08` (CSS/tokens) e `07` (i18n) podem correr em paralelo; `01` depende de ambos para compor. Blocos 02→06 são sequenciais na *leitura* mas independentes no *código* (cada um é um `.astro` + chaves próprias) — podem ser digitados em qualquer ordem desde que 01/07/08 existam. **09 é sempre o último.**

### 4.2 — CHECKLIST GATE-A-GATE (mapeado a esta obra + como verificar local)

Ordem do CI (`.github/workflows/ci.yml`, `working-directory: adorable-azimuth`): typecheck → astro check → check:i18n → build → tokens(informativo) → islands → semantics → projects → js-budget → docs. O `build` dispara o `prebuild` (`clean-vercel-output` + `check-i18n` + `check-en-no-pt`) por ciclo de vida do pnpm — então `check-en-no-pt` roda dentro do `pnpm run build`.

**Sequência local canônica (espelha o CI, de dentro de `adorable-azimuth/`):**

```bash
cd adorable-azimuth
pnpm install --frozen-lockfile     # paridade com o CI
pnpm run typecheck                 # tsc --noEmit
pnpm run check                     # astro check
pnpm run check:i18n                # paridade de chaves pt-br/en (todos os namespaces)
pnpm run build                     # prebuild (clean + check-i18n + check-en-no-pt) + astro build → dist/*.html
pnpm run tokens:gate               # INFORMATIVO: conferir que NÃO subiu a contagem
pnpm run islands:gate              # .tsx só em src/islands/
pnpm run semantics:gate            # h1==1, nav/main/footer/meta em cada dist/**/*.html
pnpm run projects:gate             # case studies por dados (a home não pode quebrá-lo)
pnpm run budget:gate               # soma dist/client/_astro/*.js <= 150KB
pnpm run docs:gate                 # INDEX/REGRA/rodapés/links da doc viva
pnpm run test:e2e                  # NÃO roda no CI — rodar local antes do push (§4.3)
```

Gate a gate, o que esta obra exige e como confirmar:

**1. semantics-gate — UM ÚNICO `<h1>` (a tese).** É o invariante transversal mais frágil: cinco seções, cada uma tentada a abrir com um título grande. A regra cravada para *todos* os blocos: **o único `<h1>` é o hero (`#hero-thesis`, child 02)**; cicatriz/tensão/em-campo/cta-final usam `<h2>`; o número da cicatriz, a tagline, os leads são `<p>`/`<span>` (tipo grande **não** é nível de heading). `<nav>`/`<main>`/`<footer>`/`<title>`/`<meta description>` já vêm do `BaseLayout.astro` (linhas 31–61) — a página só fornece o conteúdo do `<main>`. Ambas as páginas mantêm `export const prerender = true` (sem `.html` no `dist`, o gate falha por vacuidade).
  - Verificar: `pnpm run build && pnpm run semantics:gate`. Auditoria manual extra (o que o gate não pega — confiança, não só contagem):
    ```bash
    grep -o '<h1' dist/index.html | wc -l        # tem que dar 1
    grep -o '<h1' dist/en/index.html | wc -l     # tem que dar 1
    ```

**2. check-en-no-pt — copy EN sem as 10 palavras PT.** Lista (fronteira de palavra, case-insensitive): `portaria, custo, tempo, projetos, contato, latência, disponível, evidência, risco, qualidade`. As perigosas para este domínio: **tempo** (usar `time`/`duration`), **projetos** (usar `work`/`cases`), **contato** (usar `talk`/`reach out`), **risco** (usar `risk`). As páginas `en/index.astro` renderizam tudo via `t()`/`profile` — sem literal PT — e o `aria-label` de contato vem de `t("home.section.contact")` → `Contact`.
  - Verificar: `node scripts/check-en-no-pt.mjs` (ou simplesmente `pnpm run build`, que o chama no prebuild).
  - **Ponto cego conhecido (§8):** o gate varre `src/pages/en/**`, **não** `src/i18n/en/**`. Uma palavra banida em `en/home.json` passaria o gate e **mesmo assim apareceria** na página EN renderizada. Mitigação imediata: auditar a copy EN à mão —
    ```bash
    grep -wiE 'portaria|custo|tempo|projetos|contato|latência|disponível|evidência|risco|qualidade' src/i18n/en/home.json
    ```
    (esperado: zero linhas).

**3. check:i18n — paridade de chaves por arquivo.** A home cresce o namespace `home` com chaves de 02 (`home.hero.*`), 03 (`home.scar.*`), 04 (`home.tension.*`), 05 (`home.field.*` + `home.toggle.*`) e 06 (`home.cta_final.*`); as órfãs do MorphingText (`home.hero.tagline_morph_*`, etc.) saem dos **dois** arquivos juntas. Conjuntos idênticos em `pt-br/home.json` e `en/home.json`.
  - Verificar: `pnpm run check:i18n` (no prebuild e standalone).
  - Auditoria transversal (conferir que a união de todos os filhos casa nos dois lados):
    ```bash
    node -e "const a=require('./src/i18n/pt-br/home.json'),b=require('./src/i18n/en/home.json');const ka=Object.keys(a).sort(),kb=Object.keys(b).sort();console.log('só em pt:',ka.filter(k=>!kb.includes(k)));console.log('só em en:',kb.filter(k=>!ka.includes(k)))"
    ```

**4. islands-gate — `.tsx` só em `src/islands/`.** O único `.tsx` novo é `ModeToggle.tsx` (child 05), em `src/islands/`; o `SegmentedButton.tsx` editado já mora lá. Nenhum `.astro` de home vira `.tsx`.
  - Verificar: `pnpm run islands:gate`.

**5. js-budget — soma de `dist/client/_astro/*.js` ≤ 150KB.** O único delta é `ModeToggle` (~1KB) reusando `SegmentedButton` (~3KB, já no bundle se o header o usa). Hero/cicatriz/tensão/cta são `.astro` + CSS = 0KB. **E ganha folga:** matar o `HomeHybridLanding` remove o `<script>` inline do scramble/spotlight.
  - Verificar: medir antes e depois.
    ```bash
    pnpm run build && pnpm run budget:gate
    du -ch dist/client/_astro/*.js | tail -1   # registrar o KB total no PR
    ```

**6. token-gate — INFORMATIVO (não bloqueante).** Padrões vigiados: `\d+px`, `\d+rem`, `#hex`, `hsl(` (exclui `tokens.css`/`design-tokens.json`). CSS novo usa só `var(--…)`; os `clamp(...rem...)` de escala vivem em `tokens.css` (excluído) ou numa custom property única por bloco. `em`/`ch`/`vw`/`%` não disparam. **A meta transversal: a contagem DESCE**, porque o `HomeHybridLanding` (55 violações) é deletado e a nova home adiciona ~0.
  - Verificar: `pnpm run tokens:gate` — capturar a contagem antes (baseline atual: 791) e depois; documentar a queda no PR. Não introduzir violação nova.

**7. docs-gate — estrutura da doc viva.** Foundation presente; todo módulo com `REGRA.md` listado no `INDEX.md`; `ARQUITETURA.md` + docs de módulo com rodapé `Última revisão:`; links `.md` relativos resolvem. Este filho **edita** `ARQUITETURA.md` e docs de `interatividade`/`i18n` → renovar os rodapés e manter links válidos. A pasta `plano-reconstrucao-home/` **não** é varrida (só foundation + `docs/modulos/`).
  - Verificar: `pnpm run docs:gate`.

**8. projects-gate — não é da home, mas não pode quebrar.** Valida case studies por dados (`projects.ts` ↔ páginas ↔ i18n `project_p*` ↔ imagens). A home não os toca; mas a varredura de ® do child 06 edita `projects/p3|p5|p7.astro` (+en) — confirmar que só o `®` saiu, nada de dado de case.
  - Verificar: `pnpm run projects:gate`.

**9. components-standard-gate — fora do CI (opcional).** Exige `data-section-type` em seções e `data-variant` em CTAs no HTML do build; roda só via `pnpm components:gate`. **Decisão (§8):** não bloquear a obra nisso (não está no CI). Se o time optar por rodá-lo, as novas `<section>` adotam `data-section-type` e os CTAs `data-variant` — adição barata, mas fora do escopo mínimo.

### 4.3 — TESTES E2E (`tests/i18n.spec.ts`)

O Playwright sobe `pnpm dev` (`playwright.config.ts`: `webServer.command`, `baseURL http://127.0.0.1:4321`, `reuseExistingServer: !CI`). **Em dev, `createT` lança em chave faltante** (`src/i18n/index.ts:21`, `isDev` true) — então qualquer chave i18n ausente derruba a página com 500 e o teste falha **alto**. Isso é uma feature: o e2e cobre o que o `check:i18n` não vê (a *renderização*). Os testes **não rodam no CI** (`docs/modulos/qualidade/REGRA.md:39`) — rodar local antes do push é item da DoD.

**O que muda (os dois primeiros testes morrem com o hero antigo):**

```ts
import { expect, test } from "@playwright/test";

// --- HERO: a tese é o único H1 (substitui ENGENHEIRO/SOFTWARE ENGINEER) ---
test("PT home: o H1 é a tese", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("#hero-thesis")).toContainText("funciona quando nada mais funciona");
});

test("EN home: o H1 é a tese", async ({ page }) => {
  await page.goto("/en/");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("#hero-thesis")).toContainText("works when nothing else does");
});
```

**O que se adiciona (cobre o valor do redesign):**

```ts
// --- TOGGLE: troca a ênfase SEM reload, escrevendo data-mode ---
test("toggle recrutador→cliente troca o modo sem navegar", async ({ page }) => {
  await page.goto("/");
  const root = page.locator("#home-root"); // id/seletor do wrapper de modo (child 01)
  await expect(root).toHaveAttribute("data-mode", "recruiter"); // default no SSR
  await page.getByRole("radio", { name: "Para clientes" }).click();
  await expect(root).toHaveAttribute("data-mode", "client");
  await expect(page).toHaveURL(/\/$/); // não navegou
  await expect(page.locator(".nh-cta-variant--client")).toBeVisible();
  await expect(page.locator(".nh-cta-variant--recruiter")).toBeHidden();
});

// --- TECLADO: o radiogroup do toggle anda por setas (child 05) ---
test("toggle é operável por teclado", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("radio", { name: "Para recrutadores" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("radio", { name: "Para clientes" })).toHaveAttribute("aria-checked", "true");
});

// --- ÂNCORA: o CTA do hero aponta para a seção que existe ---
test("CTA do hero ancora em #em-campo existente", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('a[href="#em-campo"]')).toHaveCount(1);
  await expect(page.locator("#em-campo")).toHaveCount(1);
});
```

**Mantêm-se sem mudança:** o teste de toggle de locale em `/projects/p5` e o de header-não-sobrepõe-hero em `/projects/p7` — são de páginas internas (`#site-header`/`Header.astro`), não da home, e o redesign não os afeta.

**Atenção ao contrato:** os seletores `#home-root`, `.nh-cta-variant--*`, `#em-campo` e os nomes de role `Para clientes`/`Para recrutadores` têm de bater **exatamente** com o que 01/05/06 implementarem. Se 08/01 cravarem o wrapper como `.nh-page` em vez de `#home-root` (divergência real entre os filhos 05 e 06 — ver §8), ajustar o seletor do teste **e** unificar os filhos antes.

### 4.4 — DOCS A ATUALIZAR (documentação viva)

**(a) `ARQUITETURA.md` — nova seção "Páginas — Home".** Hoje a home não é descrita (dívida). Inserir antes de "## Deploy (Vercel)" e **renovar o rodapé** (a copy colável está na §5.1):

A seção descreve: a home é `prerender = true` em `/` (PT) e `/en/` (EN); a copy vem do namespace i18n `home` (deixou de ser hardcoded); a ordem dos blocos (hero → cicatriz → tensão → em-campo+toggle → cta+contato); o **único `<h1>`** é a tese; o toggle recrutador/cliente é uma island que escreve um atributo `data-mode` no wrapper único da home, e **dois consumidores** (em-campo e cta) leem por CSS — sem reload, sem segundo island.

**(b) `docs/modulos/interatividade/API.md` — inventariar a island nova.** Adicionar `ModeToggle.tsx` (wrapper que reusa `SegmentedButton`, escreve `data-mode`, `client:visible`) e registrar o patch de roving-keyboard do `SegmentedButton.tsx`. Renovar rodapé.

**(c) `docs/modulos/i18n/API.md` — namespace `home` vivo.** Onde o inventário de namespaces lista `home`, anotar que deixou de ser órfão do MorphingText e agora alimenta a home real. Renovar rodapé.

**(d) Decisão cravada — NÃO criar `docs/modulos/home/`.** A home não é um módulo de código com gate/superfície de dados próprios; suas regras já vivem repartidas em **i18n** (copy), **design-system** (CSS/componentes `.astro`) e **interatividade** (o island do toggle). Criar um módulo forçaria `REGRA.md` + linha no `INDEX.md` + rodapé a manter, por valor marginal — viola "o mais simples que resolve vence" e "complexidade paga aluguel". A home fica **descrita na `ARQUITETURA.md`** (onde "páginas e roteamento" já moram, conforme o `INDEX.md` linha 15–17). Assim o `docs-gate` não ganha nova pasta para cobrar, e ninguém é tentado a duplicar regra.

**Rodapés a renovar** (formato exigido, `docs-gate` só checa a presença da string `Última revisão:`; a convenção do `DOCUMENTACAO.md` §2 quer data + sha reais):

```
Última revisão: 2026-06-26 — <commit curto>
```

Pegar o sha com `git rev-parse --short HEAD` (após o commit que landa a mudança, ou o anterior). Renovar em: `ARQUITETURA.md`, `docs/modulos/interatividade/API.md` (e `REGRA.md` se tocado), `docs/modulos/i18n/API.md`. Depois: `pnpm run docs:gate` verde.

### 4.5 — ROLLOUT (substituir, provar paridade, e só então matar o `HomeHybridLanding`)

A autópsia manda matar a bifurcação. "Matar" tem duas metades, separadas de propósito para deixar um **revert barato**:

**Etapa A — Substituir (a nova home vai ao ar).** Children 01–08 reconstroem `index.astro`/`en/index.astro` para compor os blocos novos. As páginas **param de importar e renderizar** `HomeHybridLanding`. O arquivo `HomeHybridLanding.astro` **continua no repo**, órfão. Resultado: `/` e `/en/` já são a nova home, mas um `git revert` do commit de composição restaura a antiga (o componente ainda existe).

**Etapa B — Provar paridade (gate humano + máquina).** Antes de deletar qualquer coisa, confirmar:
- Toda a sequência de §4.2 verde localmente (build + 7 gates) e o `pnpm test:e2e` verde.
- Revisão visual de `/` e `/en/` lado a lado: hero como maior tipo, cicatriz logo abaixo, tensão com contraste, em-campo + toggle discreto, cta com contato; o nome saiu do palco; **zero ®** (`grep -r '®' adorable-azimuth/src/` retorna vazio).
- Deep-links sobrevivem: `/recruiter`, `/client`, `/en/client` resolvem. **`/en/recruiter` NÃO existe hoje** (bomba pré-existente, §8) — resolver no rollout: ou criar `src/pages/en/recruiter.astro`, ou o CTA EN aponta para `/recruiter`. **Não shippar com 404 no próprio CTA.**
- A cicatriz: ou o número real entrou, ou está conscientemente no ar com `[___]` + tratamento `data-pending` (o launch-gate humano P0 da autópsia §5 — "urgência, não detalhe").

**Etapa C — Matar (limpeza).** Só depois de B: deletar `HomeHybridLanding.astro`; conferir que nada mais o importa antes —
```bash
grep -rn "HomeHybridLanding" adorable-azimuth/src/   # tem que retornar vazio antes do delete
```
Opcional na mesma limpeza: deletar `HomeLandingRedesign.astro` (morto, não conectado) — derruba ~158 violações informativas de token. Rodar a §4.2 de novo: `semantics`/`js-budget`/`tokens` devem **melhorar ou manter**. A queda de `tokens:gate` (≥55, idealmente ~213 com o redesign morto) é a prova material de que a obra reduziu dívida, não só adicionou código.

**Por que duas etapas e não um commit:** se a paridade falhar na revisão (um número que não fecha, um contraste que não lê), reverter a Etapa A é um comando; ter deletado o `HomeHybridLanding` no mesmo commit obrigaria a ressuscitar código de um diff. "Erros e bordas não são depois" — o caminho de volta é desenhado antes de precisar dele.

### 4.6 — DEFINITION OF DONE GLOBAL

A obra inteira (não só este filho) está pronta quando **todas** as caixas abaixo fecham:

- [ ] **Bifurcação morta:** `/` e `/en/` não renderizam mais o `HomeHybridLanding`; após paridade, o arquivo foi deletado e `grep -rn HomeHybridLanding src/` retorna vazio.
- [ ] **Hero = único `<h1>`:** `dist/index.html` e `dist/en/index.html` têm exatamente um `<h1>`, e é a tese. `semantics:gate` verde.
- [ ] **Cicatriz:** número real preenchido **ou** `[___]` no ar com `data-pending` (decisão humana registrada no PR). Nunca shippar a cicatriz como `<h1>`.
- [ ] **Tensão, em-campo, cta:** `<h2>`/`<p>`; o toggle troca só a ênfase do bloco 5 + o CTA, sem mexer em hero/cicatriz/tensão, sem reload.
- [ ] **® e nome:** zero `®` em `adorable-azimuth/src/`; nome encolhido para assinatura no nav/rodapé.
- [ ] **i18n:** `pnpm check:i18n` verde; órfãs do MorphingText removidas dos dois lados; toda chave nova espelhada pt-br/en.
- [ ] **EN limpo:** `check-en-no-pt` verde **e** `grep` manual em `src/i18n/en/home.json` sem palavra banida.
- [ ] **Budget:** `budget:gate` ≤ 150KB; delta de JS registrado no PR.
- [ ] **Tokens (informativo):** contagem **não subiu** (idealmente caiu com o delete dos componentes mortos).
- [ ] **Islands:** `islands:gate` verde; `ModeToggle.tsx` em `src/islands/`; toggle operável por teclado (setas/Home/End) e o header segue funcionando.
- [ ] **Docs:** `ARQUITETURA.md` descreve a home; `interatividade/API.md` inventaria `ModeToggle`; `i18n/API.md` marca `home` vivo; rodapés `Última revisão:` renovados; `docs:gate` verde.
- [ ] **Testes:** `tests/i18n.spec.ts` atualizado (hero `#hero-thesis` + toggle + h1-único + âncora); `pnpm test:e2e` verde local.
- [ ] **Deep-links:** `/recruiter`, `/client`, `/en/client` resolvem; `/en/recruiter` resolvido (criado ou redirecionado) — sem 404 no CTA.
- [ ] **CI verde:** typecheck → check → check:i18n → build → islands → semantics → projects → js-budget → docs, todos verdes; tokens informativo sem regressão.
- [ ] **Os 5 segundos (AGENTS.md):** lendo frio, a `/` afirma "construo software para o pior dia" antes de pedir qualquer coisa — inspira alívio, não escolha de cardápio.

## 5. Copy

Este filho **não adiciona copy de usuário** — logo não tem exposição própria às palavras PT banidas no EN. As únicas strings que ele escreve são (i) a prosa da `ARQUITETURA.md` (doc interno, PT, fora de qualquer gate de EN) e (ii) os asserts de teste, que **espelham** a copy do hero do child 02 (não inventam texto).

### 5.1 — `ARQUITETURA.md`: seção "Páginas — Home" (colável)

```markdown
## Páginas — Home

A home (`/` em pt-br, `/en/` em inglês) é `prerender = true` e composta por
seções `.astro` estáticas; nenhuma copy é hardcoded — tudo vem do namespace
i18n `home` (`src/i18n/{locale}/home.json`), resolvido na página com
`loadMessages` + `createT`.

Ordem dos blocos (a página afirma antes de pedir):

1. **Hero** — a tese, o **único `<h1>` da página** e o maior tipo dela.
2. **Cicatriz** — um número concreto em corpo grande (a prova antes do argumento).
3. **Tensão** — o contraste happy path vs. campo (o inimigo nomeado).
4. **Em campo + toggle** — três provas compartilhadas e um segmented control
   discreto recrutador/cliente.
5. **CTA final + contato** — um pedido que muda só de ênfase pelo modo.

O toggle não refaz a página: uma island (`ModeToggle`, em `src/islands/`)
escreve um atributo `data-mode ∈ {recruiter, client}` num **wrapper único** da
home. Dois consumidores (o bloco "em campo" e o CTA final) leem esse atributo
por CSS e revelam a variante ativa — ambas as variantes vão no HTML
prerenderizado, então a home funciona sem JS e o modo padrão (recruiter) é
visível no primeiro paint. Não há reload, não há segundo island.

Estrutura semântica base (`<nav>`, `<main id="main">`, `<footer>`, `<title>`,
`<meta description>`) vem do `BaseLayout.astro`; a página só fornece o conteúdo
do `<main>` e os slots `nav`/`footer`.
```

Renovar o rodapé do arquivo (substituir a linha existente `Última revisão: 2026-06-11 — 588ffd1`):

```
Última revisão: 2026-06-26 — <commit curto>
```

### 5.2 — Asserts de teste (espelham o child 02, não criam copy)

- PT (substring do `#hero-thesis`): `funciona quando nada mais funciona`
- EN (substring do `#hero-thesis`): `works when nothing else does`

Nenhuma dessas substrings EN contém palavra banida (`works/nothing/else/does`). Os asserts são *referência* à copy canônica do child 02/07; se 02/07 ajustarem a tese, ajustar o substring — acoplamento documentado.

## 6. Conformidade com gates

Este filho edita `.md`, um `.spec.ts` e (por decisão) um `.mjs` de gate, e **deleta** um `.astro` — nada que gere HTML/JS novo. Mesmo assim, cada gate:

- **semantics-gate:** este filho **não adiciona** `<h1>`; ao contrário, *audita* que só o hero o tem (§4.2.1). O delete do `HomeHybridLanding` não pode deixar import órfão (verificado por `grep` antes do delete, §4.5-C). Verde.
- **check-en-no-pt:** o `i18n.spec.ts` vive em `tests/` (fora de `src/pages/en/**`) — não é varrido; ainda assim a única string EN nele (`works when nothing else does`) é limpa. Se o time adotar a extensão do gate para `src/i18n/en/**` (§8), este filho a documenta — e a copy EN dos outros filhos já foi escrita limpa. Verde.
- **check:i18n:** este filho não cria chave (audita a união — §4.2.3). Verde por não tocar o conjunto.
- **js-budget / islands-gate:** o delete do `HomeHybridLanding` só **reduz** JS (mata o `<script>` inline); nenhum `.tsx` criado aqui. Verde, com folga.
- **token-gate (informativo):** o delete reduz a contagem (55 do `HomeHybridLanding`, +158 se `HomeLandingRedesign` cair). Sem violação nova. Melhora.
- **docs-gate:** este é o gate que este filho mais toca — **renovar os rodapés** de `ARQUITETURA.md`, `interatividade/API.md`, `i18n/API.md`; manter os links `.md` válidos; **não** criar `docs/modulos/home/` (decisão §4.4) para não abrir cobrança de `REGRA.md`/`INDEX.md`. Rodar `pnpm run docs:gate` após editar. Verde.
- **projects-gate:** a varredura de ® (child 06) toca `projects/p*.astro` — confirmar que só o `®` saiu. Verde.

## 7. Critérios de aceitação

Deste filho (transversal). A DoD global está em §4.6.

- [ ] `tests/i18n.spec.ts` não referencia mais `#hero-title`/`ENGENHEIRO DE SOFTWARE`/`SOFTWARE ENGINEER`; assere `#hero-thesis` + h1-único + toggle (`data-mode`) + âncora `#em-campo`; `pnpm test:e2e` verde local.
- [ ] `ARQUITETURA.md` tem a seção "Páginas — Home" e o rodapé `Última revisão:` renovado para `2026-06-26`.
- [ ] `docs/modulos/interatividade/API.md` inventaria `ModeToggle.tsx` + o patch de teclado; `docs/modulos/i18n/API.md` marca `home` vivo; rodapés renovados.
- [ ] `pnpm run docs:gate` verde (links válidos, rodapés presentes, nenhum módulo novo órfão).
- [ ] A ordem de execução (§4.1) e o rollout (§4.5) estão acordados; `HomeHybridLanding.astro` só é deletado **após** a checklist de paridade (Etapa B).
- [ ] A sequência local de §4.2 roda verde de ponta a ponta (build + 7 gates), e os números de `budget:gate` e `tokens:gate` (antes/depois) estão registrados no PR.
- [ ] `/en/recruiter` resolvido (criado ou redirecionado) — nenhum CTA aponta para 404.
- [ ] A DoD global (§4.6) está toda fechada antes de promover a nova home a `/` pública.

## 8. Decisões cravadas e riscos

**Cravado — o `HomeHybridLanding` morre em DOIS passos, não em um.** Parar de renderizar (Onda 0) e deletar o arquivo (Onda 6) são commits separados. Abri mão da "limpeza num commit só" em troca de um `git revert` de uma linha se a paridade falhar na revisão. O caminho de volta é desenhado antes de precisar dele.

**Cravado — NÃO criar `docs/modulos/home/`.** A home é descrita na `ARQUITETURA.md` (onde páginas/roteamento já vivem). Abri mão de um módulo "completo" (REGRA/API/FLUXOS) porque ele cobraria manutenção eterna (rodapé, INDEX, links) por valor marginal — as regras da home já estão repartidas em i18n/design-system/interatividade. Complexidade tem que pagar aluguel; esta não paga.

**Cravado — recomendo ESTENDER `check-en-no-pt.mjs` para varrer `src/i18n/en/**`.** Trade-off honesto: hoje o gate dá **falsa confiança** — varre `src/pages/en/**`, mas com a home i18n-driven a copy EN real mora em `en/home.json`, que o gate **não vê**. Uma palavra banida lá passaria o CI e apareceria na página. A correção é mudar a raiz da varredura (o gate já aceita `.json`). É mudança de gate (qualidade/REGRA §1: corrigir o gate como mudança explícita e documentada, nunca contornar), então é **decisão de time** registrada aqui, não imposição silenciosa. Enquanto não entrar, o `grep` manual de §4.2.2 é o backstop.

**Riscos / bombas-relógio:**

- **Divergência entre os filhos sobre o wrapper de modo e o stylesheet.** Os filhos 05 usam `#home-root`; o 06 usa `.nh-page`. Os filhos 02/04 escrevem em `src/styles/home.css` (prefixo `.hm-*`/`.hero-*`); os 03/06 em `src/styles/new-home.css` (prefixo `.nh-*`); o 05 em `home.css` com `.ec-*` reusando `.nl-seg*`. **São o mesmo elemento e o mesmo arquivo com nomes diferentes.** Se não forem unificados por 01/08 antes da composição, o seletor de swap (`[data-mode] .is-mode-*` vs `.nh-page[data-mode] .nh-cta-variant--*`) e o import do CSS **não casam** e o toggle/estilo quebra silenciosamente. **Mitigação (P0 da Onda 0):** 01 crava UM nome de wrapper e 08 crava UM nome de stylesheet + prefixo; este filho **bloqueia o rollout** até a unificação, e o seletor do teste e2e (§4.3) aponta para o nome canônico decidido.
- **`/en/recruiter` é 404.** Só existem `recruiter.astro`, `client.astro`, `en/client.astro`, `en/index.astro` — não há `en/recruiter.astro`. O CTA recrutador em EN aponta para um destino inexistente. Pré-existente, mas o redesign o expõe. Resolver na Etapa B do rollout. Sinalizar, não silenciar.
- **e2e roda em DEV, gates rodam no BUILD.** O Playwright sobe `pnpm dev`; os gates de HTML leem `dist/`. São dois alvos: uma chave i18n faltante quebra o **dev/e2e** (500), mas o **semantics/budget** só veem o que o `build` gerou. Rodar os dois — passar num não garante o outro.
- **Os testes não rodam no CI.** `test:e2e` é manual. Se ninguém rodar antes do push, o hero pode regredir sem o CI piscar. Mitigação: a DoD §4.6 exige `pnpm test:e2e` verde local; idealmente, um passo futuro adiciona o e2e ao CI (fora do escopo desta obra, mas anotado).
- **Cross-links quebrados entre os filhos-irmãos.** O child 02 linka `03-cicatriz.md` e `06-assinatura-nav-rodape.md`; o child 05 linka `06-cta-final-contato.md` — nomes que **não existem** (reais: `03-cicatriz-prova.md`, `06-cta-contato-rodape.md`). Não quebra o `docs-gate` (a pasta `plano-reconstrucao-home/` não é varrida), mas confunde quem digita. Este filho usa os nomes reais (§9); recomendo uma passada de correção dos links nos irmãos.
- **Shippar a cicatriz com `[___]`.** O único bloqueador de conteúdo real (autópsia §5). O launch-gate é **humano** (P0 antes de `/` pública), não um gate de CI — travar build por copy travaria deploys por uma decisão humana. O tratamento `data-pending` (child 03) é a forcing function visível.

## 9. Conexões

- Índice-mãe: [00-indice-mae.md](00-indice-mae.md)
- Andaime (Onda 0, precisam existir antes): [01-fundacao-arquitetura.md](01-fundacao-arquitetura.md) · [07-i18n-conteudo.md](07-i18n-conteudo.md) · [08-estilo-tokens-animacao.md](08-estilo-tokens-animacao.md)
- Blocos auditados por este filho: [02-hero-afirmacao.md](02-hero-afirmacao.md) · [03-cicatriz-prova.md](03-cicatriz-prova.md) · [04-tensao.md](04-tensao.md) · [05-em-campo-toggle.md](05-em-campo-toggle.md) · [06-cta-contato-rodape.md](06-cta-contato-rodape.md)
- Este filho fecha o ciclo: nenhum filho depende dele, mas ele é a condição de **shippar** (paridade verde) e **limpar** (deletar o `HomeHybridLanding`).
