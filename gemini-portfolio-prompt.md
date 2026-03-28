# TAREFA

Você é um engenheiro frontend sênior. Sua tarefa é gerar **dois arquivos HTML completos e independentes** (`p3.html` e `p7.html`) que aplicam exatamente o mesmo design system de `p5-redesign.html` (o arquivo de referência), trocando apenas o conteúdo específico de cada projeto.

Leia o arquivo de referência antes de começar:

```
@p5-redesign.html
```

---

## REGRAS ABSOLUTAS

1. **Não altere nenhum token de design** — CSS variables, fontes, cores, grain overlay, animações, estrutura de seções, tudo deve ser idêntico ao template de referência.
2. **Não simplifique nem omita seções** — gere todas as seções: Nav, Hero, TL;DR, Snapshot, Problema & Impacto, Abordagem, Confiabilidade (com bloco de código), Stack Tags, Extensões, CTA band, Nav bottom, Footer.
3. **Adapte o bloco de código** ao snippet real de cada projeto (linguagem e conteúdo fornecidos abaixo). Atualize `.code-lang` para a linguagem correta.
4. **Adapte o highlight de sintaxe inline** (classes `.kw`, `.fn`, `.str`, `.cm`, `.pu`) ao snippet de cada projeto.
5. **Atualize os links de navegação** (`Voltar`, `Próximo case`) conforme especificado por projeto.
6. **Mantenha o grain overlay**, o parallax do hero, o scroll reveal e todas as micro-interações.
7. **Para p3**: o código é público — substitua o notice de NDA por um link para o repositório GitHub.
8. Gere cada arquivo completo, sem cortes nem `<!-- ... resto igual ... -->`.

---

## DESIGN SYSTEM (não altere)

```
Fontes:      Cormorant Garamond (serif, títulos) · Syne (sans, UI) · JetBrains Mono (código)
Paleta:      --bg #080807 · --amber #C8923A · --text #EDE9E1 · --text-dim #7A7871
Estrutura:   Nav fixo → Hero fullscreen com parallax → <main max-width:900px> → Footer
Seções:      01 TL;DR · 02 Snapshot · 03 Problema · 04 Abordagem · 05 Confiabilidade · 06 Extensões
Animações:   IntersectionObserver scroll reveal (.reveal → .visible) + hero parallax
```

---

## ARQUIVO 1 — `p7.html`
### Plataforma Nexus

**Meta do Hero**
```
Eyebrow:    Case de Produto
Título:     Plataforma\nNexus  (com <em> em "Nexus")
Subtítulo:  Plataforma de ingressos com vendas via WhatsApp, pagamentos integrados
            e operação de check‑in resiliente em eventos.
```

**Hero Stats** (4 colunas)
```
Escopo    → Full-stack · Arquitetura
Stack     → NestJS · PostgreSQL · WhatsApp · Mercado Pago
Código    → Privado (NDA)
KPI       → Check-in 100% offline
```

**Hero CTA buttons**
```
Primário:  "Falar no WhatsApp ↗"  → https://wa.me/5548984586949
Ghost 1:   "Ver Evidências"        → #evidence
Ghost 2:   "Código (NDA)"          → #code
```

**Hero image**
```
URL: https://victor-alcantara.vercel.app/images/98f5ae2c-0f91-4fda-9e44-1fd81a607417.png
```
> Esta é uma imagem real (screenshot do produto), não um stock photo. Aplique-a como background do hero com filter: grayscale(.6) brightness(.3) — menos escuro que o p5, pois a imagem já é de produto.

**Badge de categoria** (hero eyebrow label)
```
Risco
```

**TL;DR**
```
Problema:   Venda e atendimento dependentes de canais fragmentados e check‑in
            que falha quando a rede cai na portaria.

Solução:    Fluxo de venda via WhatsApp + backend multi-tenant (WhatsApp Cloud API
            e Mercado Pago) + check‑in offline-first com fila local e sincronização.

Resultado:  Operação de portaria sem internet com sincronização segura; menos
            incidência operacional em dia de evento e mais previsibilidade no fluxo de venda.
```

**Notice NDA** (mesmo estilo do p5)
```
Este software está em produção e sob propriedade de uma empresa.
O código é privado (NDA). Acesso a material sanitizado pode ser solicitado diretamente.
```

**Snapshot**
```
Papel / escopo   → Full‑stack. Arquitetura + backend (NestJS) + dashboards (React/Next).
Escala           → Operação em eventos e múltiplas organizações (multi-tenant), com necessidade
                   de baixa fricção e consistência operacional.
Restrições       → Portaria pode ficar sem internet; integrações externas exigem idempotência
                   e rastreabilidade para evitar duplicidade e erros.
```

**Problema & Impacto**
```
Sintoma  → Venda/atendimento com dependência de integrações e portaria travando quando
           o check‑in exige rede.
Causa    → Falta de um fluxo único de venda e ausência de mecanismo offline-first
           com fila e retry controlado para a operação crítica.
Impacto  → Risco operacional alto na portaria, divergências por reprocessamento
           e aumento de suporte em dia de evento.
```

**Abordagem (3 passos)**
```
1. Identificar  → Vendas via WhatsApp integrando WhatsApp Cloud API e orquestração
                  server-side por organização (multi-tenant).
2. Encapsular   → Pagamentos via Mercado Pago com rotas administrativas para operação e suporte.
3. Navegar      → Operação offline-first (check‑in e POS) com fila local (IndexedDB)
                  e sincronização em lote para reduzir rajadas na reconexão.
```
> Renomeie os títulos dos passos para "Vendas", "Pagamentos", "Offline-first" em vez de "Identificar/Encapsular/Navegar".

**Confiabilidade**
```
Riscos      → Duplicidade em reenvio (offline/retry), rajadas na reconexão,
              inconsistência operacional entre dispositivos.
Garantias   → Fila local (IndexedDB) com retry e sincronização em lote para POS;
              idempotência por externalId para não duplicar vendas.
Evidência   → Snippet do mecanismo de fila/sync (IndexedDB + batch sync do POS).
```

**Código** (linguagem: JS · Node.js)
```javascript
await db.add('syncQueue', {
  url,
  method,
  body,
  timestamp: Date.now(),
  retryCount: 0
});

// offline POS: fila local → sync em lote
await fetch(syncUrl, {
  method: 'POST',
  body: JSON.stringify({ orders })
});
```

**Stack Tags**
```
NestJS · PostgreSQL · WhatsApp Cloud API · Mercado Pago · PWA · IndexedDB
```

**Extensões (3 itens)**
```
1. Expandir observabilidade de fila (pendentes, idade, taxa de sync) para antecipar falhas em campo.
2. Consolidar relatórios operacionais (check‑in, POS e reconciliação) para reduzir suporte e acelerar auditoria.
3. Aprimorar métricas do funil (WhatsApp → pagamento → emissão/validação) para identificar gargalos por etapa.
```

**CTA band**
```
Eyebrow:  "Você tem esse problema?"
Título:   "Precisa vender com baixa fricção e operar em campo sem depender de internet?"
Texto:    "Eu desenho um fluxo offline-first com idempotência, sync em lote e trilha de auditoria."
```

**Nav bottom**
```
← Voltar       → https://victor-alcantara.vercel.app/#projects
   Topo        → scroll to top
   Próximo case → https://victor-alcantara.vercel.app/projects/p3/  →
```

**Links de idioma no nav**
```
PT → /projects/p7/
EN → /en/projects/p7/
```

---

## ARQUIVO 2 — `p3.html`
### Habit Analyzer

**Meta do Hero**
```
Eyebrow:    Case de Produto
Título:     Habit\nAnalyzer  (com <em> em "Analyzer")
Subtítulo:  Aplicativo web de acompanhamento de hábitos com API REST e dashboard
            de visualização de progresso.
```

**Hero Stats** (4 colunas)
```
Escopo    → Arquitetura + Full-stack
Stack     → FastAPI · Next.js · PostgreSQL
Código    → Público (GitHub)
KPI       → MVP com testes E2E
```

**Hero CTA buttons**
```
Primário:  "Ver Repositório ↗"  → https://github.com/Salazarismo/habit_analyzer
Ghost 1:   "Ver Evidências"     → #evidence
Ghost 2:   "Falar no WhatsApp"  → https://wa.me/5548984586949
```

**Hero image**
```
URL: https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fm=jpg&w=1600&q=80
(imagem de analytics/dashboard - mais adequada que a de circuitos do p5)
```

**Badge de categoria**
```
Custo
```

**TL;DR**
```
Problema:   Registrar hábitos e acompanhar evolução tende a virar planilha ou notas,
            com pouco insight e baixa consistência.

Solução:    App com backend FastAPI (JWT) e frontend Next.js/TypeScript com fluxo
            de registro e gráficos por hábito.

Resultado:  MVP funcional com Docker Compose, documentação via Swagger/OpenAPI
            e testes (pytest + Playwright E2E).
```

**Notice — CÓDIGO PÚBLICO** (substitui o notice NDA — use mesma classe `.notice` mas troque a borda de âmbar para verde `#5DC275` e o texto para):
```
Código público disponível no GitHub. README inclui setup, OpenAPI snapshot e suíte de testes.
[Ver repositório →] (link: https://github.com/Salazarismo/habit_analyzer)
```

**Snapshot**
```
Papel / escopo   → Arquitetura + Full-stack. Ano: 2025.
Escala           → Múltiplos hábitos por usuário, registros diários e histórico suficiente
                   para gráficos e tendências.
Restrições       → Dados consistentes (datas/valores), autenticação e evolução segura
                   do schema com migrações.
```

**Problema & Impacto**
```
Sintoma  → Registro manual disperso e pouca visibilidade de consistência e progresso.
Causa    → Dados sem modelo único e sem visualização agregada do histórico por hábito.
Impacto  → Baixa aderência ao acompanhamento e decisões piores sobre rotina por falta de sinal.
```

**Abordagem (3 passos)**
```
1. Modelar    → Hábitos e registros (domínio) persistidos no Postgres com migrações via Alembic.
2. Expor      → API REST com FastAPI e autenticação JWT; documentação automática via Swagger/OpenAPI.
3. Visualizar → Dashboard web (Next.js) com fluxo de registro e gráficos por hábito via Chart.js.
```
> Renomeie os títulos dos passos para "Modelar", "Expor", "Visualizar".

**Confiabilidade**
```
Riscos      → Dados inconsistentes (datas/valores), regressão de autenticação
              e divergência entre resumo e série temporal.
Garantias   → Validação com Pydantic, migrações com Alembic e testes
              (unitários + E2E com Playwright no fluxo crítico).
Evidência   → README, OpenAPI snapshot e suíte de testes no repositório.
```

**Código** (linguagem: Python · FastAPI)
```python
# Geração do token
encoded_jwt = jwt.encode(
    {**data, "exp": expire},
    settings.JWT_SECRET,
    algorithm=settings.JWT_ALGORITHM
)

# Validação do token
payload = jwt.decode(
    token,
    settings.JWT_SECRET,
    algorithms=[settings.JWT_ALGORITHM]
)
```

**Stack Tags**
```
FastAPI · Next.js · PostgreSQL · JWT · Pydantic · Alembic · pytest · Playwright
```

**Extensões (3 itens)**
```
1. Adicionar metas, streaks e lembretes para reforçar aderência ao acompanhamento de hábitos.
2. Expandir relatórios (semanal/mensal) e filtros por hábito e período.
3. Observabilidade: métricas de API e rastreamento de erros para evolução segura do produto.
```

**CTA band**
```
Eyebrow:  "Você tem esse problema?"
Título:   "Precisa de um MVP com API e dashboard — auth, gráficos e testes incluídos?"
Texto:    "Eu desenho a arquitetura, implemento o fluxo crítico e valido com testes end-to-end."
```

**Nav bottom**
```
← Voltar       → https://victor-alcantara.vercel.app/#projects
   Topo        → scroll to top
   Próximo case → https://victor-alcantara.vercel.app/projects/p5/  →
```

**Links de idioma no nav**
```
PT → /projects/p3/
EN → /en/projects/p3/
```

---

## OUTPUT ESPERADO

Gere os dois arquivos completos, um após o outro, claramente delimitados:

```
=== INÍCIO p7.html ===
<!DOCTYPE html>
...html completo...
=== FIM p7.html ===

=== INÍCIO p3.html ===
<!DOCTYPE html>
...html completo...
=== FIM p3.html ===
```

Cada arquivo deve ter entre 400 e 600 linhas de HTML+CSS+JS. Não use comentários genéricos do tipo `<!-- igual ao template -->` — gere o código real completo.
