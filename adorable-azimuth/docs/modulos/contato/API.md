# contato — API

## `POST /api/contact` (`src/pages/api/contact.ts`)

SSR-only (`prerender = false`), declarado com `runtime = 'edge'`.

### Request

```json
{
  "name": "string (min 2)",
  "email": "string (e-mail válido)",
  "message": "string (min 10)",
  "hp": "string (opcional — honeypot, deve vir vazio)"
}
```

Validação: Zod (`safeParse`). Content-Type esperado: JSON.

### Responses

| Status | Corpo | Quando |
| --- | --- | --- |
| `200` | `{ "ok": true, "t": <ms> }` | payload válido, honeypot vazio (`t` = tempo de processamento) |
| `204` | — | honeypot preenchido → sucesso falso para o bot (o código monta um corpo, mas 204 não entrega corpo; comportamento intencionalmente indistinguível de sucesso) |
| `400` | `{ "error": "Invalid payload" }` | falha de validação Zod |
| `400` | `{ "error": "Bad request" }` | JSON inválido / exceção |

### Observações

- Não há persistência nem envio: a mensagem é validada e descartada (ver
  regra 4 do [REGRA.md](REGRA.md)).
- Consumidor único: `ContactForm.island.tsx`.

---
Última revisão: 2026-06-11 — 588ffd1
