# contato — FLUXOS

## Envio de mensagem (caminho feliz)

1. Usuário preenche o formulário (`ContactForm.island.tsx`); validação local
   habilita o envio.
2. Estado vai a `submitting` (spinner); island faz `POST /api/contact` com JSON.
3. API valida com Zod, responde `200 { ok: true, t }`.
4. Estado vai a `success`: formulário é resetado e um evento custom atualiza a
   AppStateBar com feedback visual.

## Caminho do bot

1. Bot preenche o campo oculto `hp`.
2. API responde `204` (sucesso falso) e descarta — o bot não distingue de um
   envio real.

## Caminhos de erro

- Validação falha ou JSON inválido → `400` → estado `error` na UI, usuário pode
  corrigir e reenviar.
- Falha de rede → estado `error` (mesmo tratamento).

## Se for adicionada persistência/notificação no futuro

Pontos a tocar: `src/pages/api/contact.ts` (integração), variáveis de ambiente
na Vercel, e os três docs deste módulo. Manter o honeypot respondendo sucesso
falso **antes** de qualquer side effect.

---
Última revisão: 2026-06-11 — 588ffd1
