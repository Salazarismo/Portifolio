# contato — REGRA

Canal de contato do portfólio: formulário (island Preact) + endpoint serverless
`POST /api/contact` na Vercel.

## Regras

1. **Validação dupla:** o formulário valida no cliente (UX) e a API revalida
   com Zod (segurança). A API é a fonte da verdade — nunca confiar só no
   cliente.
2. **Contrato mínimo:** `name` ≥ 2 chars, `email` válido, `message` ≥ 10 chars.
   Mudou o contrato → atualizar island, API **e** [API.md](API.md) juntos.
3. **Anti-spam por honeypot:** o campo oculto `hp` deve permanecer invisível
   para humanos. Se vier preenchido, a API responde **sucesso falso** (204) e
   descarta — bots não podem perceber que foram detectados. Nunca retornar
   erro nesse caso.
4. **Sem persistência:** hoje o endpoint não grava nem envia o conteúdo a
   lugar nenhum (responde ok e descarta). Se isso mudar (e-mail, webhook, DB),
   este documento e o [FLUXOS.md](FLUXOS.md) devem ser atualizados — é a
   mudança de comportamento mais provável do módulo.
5. **Erros silenciosos para o usuário, explícitos no estado:** falha de rede ou
   400 vira estado `error` na UI (AppStateBar), sem expor detalhes técnicos.

## Impactos cruzados

- [interatividade](../interatividade/REGRA.md): `ContactForm.island.tsx`.
- [i18n](../i18n/REGRA.md): labels e mensagens do formulário vêm de namespaces
  i18n nos dois locales.

---
Última revisão: 2026-06-11 — 588ffd1
