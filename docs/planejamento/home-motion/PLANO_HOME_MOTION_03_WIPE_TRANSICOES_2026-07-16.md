# Plano 03 - Wipe organico nas View Transitions (home → recruiter/client)

- **Tipo:** Plano-Filho
- **Plano mae:** [Plano mae - Home ao nivel do video de referencia](./PLANO_HOME_MOTION_SISTEMA_2026-07-16.md)
- **Data:** 2026-07-16
- **Status:** Proximo
- **Assunto:** Camada D — transicao de pagina com varredura organica coral sobre a infraestrutura de View Transitions ja existente (0KB JS)
- **Responsavel pela decisao:** Victor (dono do portfolio)
- **Fonte canonica afetada:** `adorable-azimuth/docs/modulos/interatividade/`

## Objetivo local

Reproduzir a tecnica de fechamento do video — o blob que varre a tela revelando o proximo estado — como transicao de navegacao home → `/recruiter` e home → `/client` (os dois deep-links do CTA final). E o momento "uau" de saida, que transforma o clique no CTA em continuacao da experiencia em vez de corte seco. Traducao estetica: o blob verde do video vira uma varredura coral/navy com a forma organica derivada do glow que ja existe.

## Contexto herdado

`src/islands/NavTransitions.island.tsx` (`client:load` global) ja intercepta navegacao interna e chama `document.startViewTransition()` com classes de direcao `nav-forward`/`nav-back` e fallback para navegadores sem suporte; ja respeita `prefers-reduced-motion`. O CSS das transicoes vive em `src/styles/transitions.css`. Este filho NAO toca no JS — e so CSS sobre os pseudo-elementos `::view-transition-old(root)`/`::view-transition-new(root)`.

## Escopo tecnico

**Entra:**
- `adorable-azimuth/src/styles/transitions.css` — keyframes do wipe: `clip-path` (ou `mask` com gradiente radial) animando uma forma organica que varre da borda ao centro sobre `::view-transition-new(root)`, com a cor de varredura via token (`--color-primary`/derivada `color-mix`); variantes `nav-forward` (varre para frente) e `nav-back` (varre para tras); duracao com `--duration-slow`/`--ease-emphasized`.
- Guarda de reduced-motion no proprio CSS (`@media (prefers-reduced-motion: reduce)` → transicao instantanea/fade minimo), redundante a guarda do JS de proposito (defesa em profundidade).

**Fora:** mudanca no `NavTransitions.island.tsx` (se o wipe exigir JS novo, o escopo esta errado — redesenhar em CSS); transicoes por elemento (`view-transition-name` granular) — fica como melhoria futura fora desta cascata; navegacao hash (`#em-campo`), que continua no smooth-scroll proprio.

## Plano de execucao

1. Desenhar a forma do wipe em `clip-path` (2-3 keyframes de poligono/elipse — formas organicas simples animam melhor que blobs complexos) e validar a estetica com o Victor num prototipo de rota unica.
2. Implementar as variantes `nav-forward`/`nav-back` em `transitions.css` usando as classes que o island ja aplica.
3. Cravar cor, duracao e easing via tokens (zero valor cru — token-gate).
4. Adicionar a guarda CSS de reduced-motion.
5. Testar as quatro rotas do fluxo principal: home→`/recruiter`, home→`/client`, e as voltas; conferir tambem `/en/` → `/recruiter` (CTA EN aponta para a pagina PT — decisao do filho 09 da cascata anterior).
6. Conferir que paginas fora do fluxo (projects, docs) continuam com a transicao padrao sem regressao visual.

## Dependencias

- Plano 00 concluido (a estetica do wipe deriva do palco bicolor/glow definidos la; tecnicamente o filho e independente e pode adiantar se o Plano 01 emperrar — registrado no direcionamento do mae).
- Aprovacao visual do Victor na etapa 1.

## Verificacao

- Gates completos; `budget:gate` delta 0KB obrigatorio.
- e2e local 7/7 (regressao — os testes navegam entre rotas e nao podem flakear por causa da transicao; se o wipe introduzir flakiness, reduzir duracao no ambiente de teste NAO e permitido — corrigir a causa).
- Manual: as quatro rotas da etapa 5 em Chrome (View Transitions suportado); navegador sem suporte — navegacao normal sem wipe (fallback do island); reduced-motion — sem varredura; conferir que o wipe nao "pisca" conteudo da pagina nova antes da varredura.

## Atualizacao do Indice-Mae

Ao concluir: status → Concluido; registrar a forma final do `clip-path` e as rotas cobertas; anotar se alguma rota fora do fluxo principal ganhou o wipe por efeito colateral (decidir se e desejado ou se escopa-se por classe de body).
