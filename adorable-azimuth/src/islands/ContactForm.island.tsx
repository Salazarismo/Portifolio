import { useState } from 'preact/hooks';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactForm() {
  const [state, setState] = useState<FormState>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: Event) {
    e.preventDefault();
    if (!(e.target instanceof HTMLFormElement)) return;
    setState('submitting');
    try { window.dispatchEvent(new CustomEvent('appstate:set', { detail: { state: 'loading', message: 'Enviando…' } })); } catch {}
    const fd = new FormData(e.target);
    const payload = {
      name: String(fd.get('name') || ''),
      email: String(fd.get('email') || ''),
      message: String(fd.get('message') || ''),
      hp: String(fd.get('hp') || ''),
    };
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setState('success');
        setMessage('Mensagem enviada. Obrigado!');
        try { window.dispatchEvent(new CustomEvent('appstate:set', { detail: { state: 'success', message: 'Mensagem enviada' } })); } catch {}
        e.target.reset();
      } else {
        setState('error');
        const data = await res.json().catch(() => ({}));
        setMessage(data.error || 'Falha ao enviar.');
        try { window.dispatchEvent(new CustomEvent('appstate:set', { detail: { state: 'error', message: 'Falha ao enviar' } })); } catch {}
      }
    } catch (err) {
      setState('error');
      setMessage('Erro de rede.');
      try { window.dispatchEvent(new CustomEvent('appstate:set', { detail: { state: 'error', message: 'Erro de rede' } })); } catch {}
    }
  }

  return (
    <form onSubmit={onSubmit} class="grid" style="gap: var(--spacing-3)" data-state={state}>
      <div>
        <label for="name">Nome</label>
        <input id="name" name="name" type="text" required class="ui-input" />
      </div>
      <div>
        <label for="email">Email</label>
        <input id="email" name="email" type="email" required class="ui-input" />
      </div>
      <div>
        <label for="message">Mensagem</label>
        <textarea id="message" name="message" rows={4} required class="ui-textarea" />
      </div>
      <div aria-hidden="true" class="sr-only">
        <label htmlFor="hp">Não preencher</label>
        <input id="hp" name="hp" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <button type="submit" disabled={state === 'submitting'} class="ui-button">
        {state === 'submitting' ? 'Enviando...' : 'Enviar'}
      </button>
      {state !== 'idle' && (
        <p aria-live="polite" data-text="ui-helper">{message}</p>
      )}
    </form>
  );
}
