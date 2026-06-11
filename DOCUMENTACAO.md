# DOCUMENTACAO.md — Como esta documentação funciona

A documentação deste repositório é **viva**: descreve o comportamento atual do
código, é atualizada na mesma mudança que altera esse comportamento, e tem sua
estrutura verificada por gate no CI (`docs:gate`). Documento desatualizado é
tratado como bug.

## Camada 1 — Fundação (raiz do repositório)

| Arquivo | Papel |
| --- | --- |
| [AGENTS.md](AGENTS.md) | Regras para agentes/contribuidores, convenções e onde buscar contexto. **Comece por aqui.** |
| [ARQUITETURA.md](ARQUITETURA.md) | Visão macro: stack, roteamento, decisões M2/M4, pipeline de CI. |
| [GLOSSARIO.md](GLOSSARIO.md) | Termos oficiais do domínio. |
| DOCUMENTACAO.md | Este arquivo: explica a estrutura documental. |

## Camada 2 — Módulos (`adorable-azimuth/docs/modulos/`)

Cada área funcional tem uma pasta com até três arquivos:

| Arquivo | Obrigatório? | Conteúdo |
| --- | --- | --- |
| `REGRA.md` | **Sim** | O que o módulo faz e suas regras/invariantes. É o documento mais importante. |
| `API.md` | Quando há superfície pública | Contratos, helpers, tipos, estruturas de dados. |
| `FLUXOS.md` | Quando há processos | Como as coisas acontecem na prática, incluindo impactos entre módulos. |

Não existe `SCHEMA.md`: este projeto não tem banco de dados. Onde a forma dos
dados importa (tipos de `projects.ts`, JSON de i18n, tokens), ela é descrita em
uma seção *Estrutura de dados* dentro do `API.md` do módulo.

O mapa de módulos é [adorable-azimuth/docs/modulos/INDEX.md](adorable-azimuth/docs/modulos/INDEX.md): mostra quais módulos
existem, onde está o código e o que ler.

## Regras de manutenção

1. **Mesma mudança:** alterou comportamento documentado → atualize o doc no
   mesmo commit/PR. Nunca "depois".
2. **Rodapé de rastreabilidade:** todo doc de módulo (e o ARQUITETURA.md)
   termina com `Última revisão: <AAAA-MM-DD> — <commit curto>`. Ao revisar um
   doc, renove a linha.
3. **Novo módulo:** crie a pasta com pelo menos `REGRA.md` e adicione a linha
   no `INDEX.md`. O `docs:gate` falha se a pasta não estiver no índice ou se
   faltar `REGRA.md`.
4. **Escopo dos docs:** documente regras, contratos e fluxos — não reescreva o
   código em prosa. O que o TypeScript já expressa (assinaturas simples) não
   precisa de doc; o *porquê* e os invariantes precisam.

## Enforcement

`scripts/docs-gate.cjs` (rodando em `pnpm docs:gate` e no CI) verifica:
`INDEX.md` existe; toda pasta de módulo tem `REGRA.md` e está listada no índice;
todo doc de módulo tem rodapé `Última revisão`; links markdown relativos da
fundação e dos módulos apontam para arquivos existentes.
