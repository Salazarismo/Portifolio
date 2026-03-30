# Prompt para TRAE — Diagrama de Arquitetura do Nexus

## Objetivo

Criar um arquivo `nexus-architecture.svg` (ou `nexus-architecture.astro` com SVG inline) para ser embutido na página `src/pages/projects/p7.astro`, antes do TL;DR. O diagrama deve ser tecnicamente preciso com base na arquitetura real do sistema — não genérico.

---

## Estética

Seguir o design system do portfólio:

| Token         | Valor          |
|---------------|----------------|
| Background    | `#1a1a1a`      |
| Surface       | `#222222`      |
| Border        | `rgba(200,146,42,0.18)` |
| Amber/acento  | `#c8922a`      |
| Gold          | `#d4a843`      |
| Off-white     | `#f0ece4`      |
| Muted         | `#7a7570`      |
| Fonte labels  | JetBrains Mono, 10–11px |
| Fonte títulos | Syne, 12–13px  |

Bordas dos blocos: `1px solid rgba(200,146,42,0.18)`, cantos levemente arredondados (4px).  
Setas de fluxo: linhas finas `#c8922a` com opacidade 60–80%, pontas de seta simples.  
Grupos/swimlanes: fundo levemente diferente (`rgba(255,255,255,0.025)`) com label no topo em JetBrains Mono uppercase.

---

## Estrutura do diagrama

O diagrama é dividido em **4 swimlanes verticais**, da esquerda para a direita:

```
[ CLIENTES / ATORES ] | [ PWA / FRONTEND ] | [ BACKEND NestJS ] | [ INFRA & EXTERNOS ]
```

---

### Swimlane 1 — Clientes / Atores

Três atores empilhados verticalmente:

- **Usuário final** (comprador via WhatsApp)
- **Operador de portaria** (usa PWA offline)
- **Admin / Organização** (usa dashboard admin)

---

### Swimlane 2 — PWA / Frontend

Dois blocos principais:

**App Landing (PWA)**
- SyncManager.tsx — listener `online` + intervalo de retry
- db.ts — IndexedDB (syncQueue)
- CheckinClient.tsx — enfileira check-ins offline
- POS module — enfileira pedidos offline

**Dashboard Admin**
- Interface React/Next para gestão de eventos, pedidos, relatórios e CRM

---

### Swimlane 3 — Backend NestJS

Organizado em subcamadas:

**Bootstrap / Cross-cutting** (faixa fina no topo)
- main.ts: pipes, filtros, CORS, logger
- app.module.ts: Config, TypeORM, Redis, Throttler, Schedule
- TenantMiddleware → resolve `organizationId` via `x-org-id` / body / JWT
- JwtGuard + RBAC + Entitlements

**Módulos de Feature** (blocos individuais):

| Módulo | Controllers principais | Responsabilidade |
|--------|----------------------|------------------|
| **Webhooks** | `webhooks.whatsapp.controller` → `whatsapp.inbound.service` | Recebe msgs do usuário via WA |
| **Payments** | `payments.controller` → `payment-processor.service`, `webhook.controller` → DLQ | Preferência MP, Bricks, confirmação via webhook |
| **Shop** | `shop-payments-webhook.controller` → `shop.service.confirmPayment` | Pedidos: PENDING → PAID, vouchers, estoque |
| **Billing** | `billing.service` | Assinaturas, reutiliza /payments/webhook |
| **Check-in / POS** | `checkin.admin.controller` → `/admin/checkin/sync`; `pos.controller` → `/admin/pos/sync` | Recebe batch sync da fila offline |
| **Events / Admin** | `events`, `admin` modules | Gestão de eventos, organização |
| **Messages** | `whatsapp.controller` (send manual), `broadcast.controller` | Envio outbound manual e broadcast |
| **CRM** | `crm.controller` — queries com filtro `organizationId` | Relatórios com row-level multi-tenant |
| **Metrics** | `metrics.controller` → GET /metrics | Prometheus endpoint |

**Outbox / Workers** (faixa separada dentro do backend):
- `outbound-worker.service.ts` — confiabilidade de eventos server-side
- `plan-change-outbox.worker.ts` — mudanças de plano com retry

---

### Swimlane 4 — Infra & Externos

**Externos:**
- **WhatsApp Cloud API** — recebe webhook inbound, aceita envio outbound
- **Mercado Pago** — cria preferência/payment, dispara webhook de confirmação; valida assinatura via `MP_WEBHOOK_SECRET`

**Infra local (Docker Compose):**
- **PostgreSQL** — banco único, row-level multi-tenant por `organizationId` (FK nas entidades)
- **Redis (ioredis)** — locks (`lock.service`), throttling/rate-limit (`throttler-storage-redis`), cache de reports (`reports-cache.service`), pubsub
- **Prometheus** — coleta de `/metrics`, config em `monitoring/prometheus.yml`

---

## Fluxos principais a destacar com setas nomeadas

Mostrar pelo menos estes 4 fluxos com cor/rótulo diferente ou numeração:

1. **Venda via WhatsApp**
   `Usuário → WhatsApp Cloud API → POST /webhooks/whatsapp → whatsapp.inbound.service → PostgreSQL`

2. **Confirmação de pagamento**
   `Mercado Pago → POST /payments/webhook → webhook.controller → DLQ (idempotência) → payment-processor.service → PostgreSQL`

3. **Sync offline (POS/Check-in)**
   `Operador offline → IndexedDB (syncQueue) → [reconecta] → SyncManager → POST /admin/pos/sync ou /admin/checkin/sync → PostgreSQL`

4. **Multi-tenant**
   `Qualquer request → TenantMiddleware (x-org-id) → organizationId filter nas queries → PostgreSQL`
   *(pode ser mostrado como anotação ou faixa transversal, não precisa ser seta)*

---

## Dimensões e formato

- Largura: 1100–1300px, altura: auto (mínimo 680px)
- Exportar como `.svg` estático — sem JavaScript necessário
- Se for `.astro`, o SVG deve ser inline no template, sem dependências externas
- O arquivo deve ser self-contained (sem imports de imagem)

---

## Localização no projeto

Salvar em: `src/assets/nexus-architecture.svg`  
Referenciar na página: `src/pages/projects/p7.astro`

Inserir **antes do `## TL;DR`**, com este markup:

```astro
<figure class="arch-diagram">
  <img
    src={import('../assets/nexus-architecture.svg')}
    alt="Diagrama de arquitetura da Plataforma Nexus: PWA offline-first, backend NestJS multi-tenant, WhatsApp Cloud API, Mercado Pago e infra com Redis e Prometheus"
    width="1200"
    loading="lazy"
  />
  <figcaption>Arquitetura do sistema — fluxos principais e camadas de infra.</figcaption>
</figure>
```

Adicionar ao CSS da página:

```css
.arch-diagram {
  margin: 2.5rem 0;
  border: 1px solid rgba(200, 146, 42, 0.18);
  border-radius: 4px;
  overflow: hidden;
}
.arch-diagram img {
  width: 100%;
  height: auto;
  display: block;
}
.arch-diagram figcaption {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #7a7570;
  padding: 0.6rem 1rem;
  border-top: 1px solid rgba(200, 146, 42, 0.1);
  background: rgba(255,255,255,0.015);
}
```

---

## Critérios de aceitação

- [ ] 4 swimlanes claramente delimitadas
- [ ] Todos os módulos NestJS listados aparecem como blocos individuais
- [ ] Os 3 fluxos principais têm setas nomeadas e distinguíveis
- [ ] PostgreSQL mostra anotação "row-level multi-tenant (organizationId)"
- [ ] Redis mostra suas 4 funções: locks, throttling, cache, pubsub
- [ ] Prometheus aparece conectado ao endpoint /metrics do backend
- [ ] IndexedDB/SyncManager no frontend com seta de sync bidirecional para o backend
- [ ] Outbox workers aparecem como componente separado dentro do backend
- [ ] Paleta de cores e fontes seguem o design system do portfólio
- [ ] SVG renderiza corretamente em fundo escuro (#1a1a1a)
