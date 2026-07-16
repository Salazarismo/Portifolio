# Plano 04 - Qualidade, gates, documentacao viva e rollout

- **Tipo:** Plano-Filho
- **Plano mae:** [Plano mae - Home ao nivel do video de referencia](./PLANO_HOME_MOTION_SISTEMA_2026-07-16.md)
- **Data:** 2026-07-16
- **Status:** Proximo
- **Assunto:** Fechamento da cascata — verificacao consolidada, testes novos, docs vivas e a decisao de rollout condicionada ao P0
- **Responsavel pela decisao:** Victor (dono do portfolio)
- **Fonte canonica afetada:** `adorable-azimuth/docs/modulos/design-system/`, `adorable-azimuth/docs/modulos/interatividade/`, `adorable-azimuth/ARQUITETURA.md`

## Objetivo local

Fazer pela cascata home-motion o que o filho 09 fez pela cascata anterior: provar a obra ponta a ponta, atualizar a documentacao viva junto do codigo e governar o rollout. "A prova antes de entregar" — nenhuma camada e considerada entregue sem verificacao registrada.

## Contexto herdado

Os quatro filhos anteriores entregam camadas com verificacao propria; este consolida. Contratos invioláveis e riscos estao no Indice-Mae. O e2e vive em `tests/i18n.spec.ts` (7 testes, rodando local via `playwright.local.config.ts` com channel chrome e dev server manual — NAO roda no CI). O P0 humano (numeros ficticios da cicatriz + literal `[stack principal]`) segue aberto e trava o rollout publico.

## Escopo tecnico

**Entra:**
- `adorable-azimuth/tests/i18n.spec.ts` (ou arquivo novo `tests/home-motion.spec.ts`) — testes novos: (a) badge do hero: continua existindo exatamente 1 `a[href="#em-campo"]`; (b) ancora funcional com coreografia: clicar o CTA do hero aterrissa com `#em-campo` visivel no viewport (cobre o risco pin × ancora); (c) reduced-motion: com `page.emulateMedia({reducedMotion: 'reduce'})`, o `.cursor-spotlight` nao entra no DOM e o `data-mode` swap segue funcionando.
- Documentacao viva: `docs/modulos/design-system/` (tokens novos do Plano 00, keyframes novos, regra do palco bicolor, excecao registrada da decisao load-time vs scroll-driven), `docs/modulos/interatividade/API.md` (contrato de data-attributes do `gsap-reveal` — o island deixa de ser inerte na home; wipe do `NavTransitions`), `ARQUITETURA.md` secao "Paginas — Home" se os partials ganharam wrappers, rodapes de atualizacao com data+commit no padrao existente.
- Checklist de rollout (este arquivo, secao abaixo).

**Fora:** qualquer feature nova; correcao do P0 em si (e tarefa humana do Victor — este plano apenas o verifica como gate de rollout); e2e no CI (divida conhecida, fora da cascata).

## Plano de execucao

1. Escrever os testes novos e roda-los junto dos 7 existentes (meta: verde em duas rodadas consecutivas, padrao do filho 09).
2. Rodar a sequencia completa de gates na ordem canonica: typecheck → astro check → check:i18n → build (prebuild) → tokens (informativo; **zero violacao nova** — baseline 558) → islands → semantics (h1 unico nos dois dist) → projects → `budget:gate` → docs.
3. Consolidar o delta total de JS da cascata e registrar no PR final (teto: 150KB; esperado: ≤ ~145KB).
4. Auditoria manual final: reduced-motion completo (pagina estatica integral), 360/768/1024/1440, teclado (tab order com pin), navegacao com wipe nas rotas do fluxo, spotlight + coreografia coexistindo sem jank.
5. Atualizar a documentacao viva (design-system, interatividade, ARQUITETURA) com rodape data+commit.
6. **Gate de rollout:** conferir o P0 — numeros reais da cicatriz no `home.json` PT+EN (o `data-pending` LOUD desarmado por numero verdadeiro, nao ficticio) e `[stack principal]`/`[main stack]` substituidos. Enquanto aberto, a cascata pode estar mergeada em branch/preview mas NAO promove a producao publica.
7. Atualizar o Indice-Mae: status geral → Concluido; memoria de sessao do projeto atualizada.

## Dependencias

- Planos 00, 01, 02 e 03 concluidos.
- P0 humano fechado pelo Victor (apenas para a etapa 6/rollout; as etapas 1-5 nao dependem dele).

## Verificacao

Este filho E a verificacao consolidada. Criterio de done: e2e (7 antigos + novos) verdes em duas rodadas; todos os gates verdes; delta de JS registrado; docs vivas atualizadas com rodape; checklist de rollout preenchido com o estado do P0.

## Atualizacao do Indice-Mae

Ao concluir: status geral da cascata → Concluido (ou → Em execucao com nota "aguardando P0 para promocao" se o rollout ficar pendente); registrar numeros finais (budget, contagem de testes, violacoes de token) como baseline para a proxima obra.
