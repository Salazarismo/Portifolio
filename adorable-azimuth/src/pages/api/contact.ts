import type { APIContext } from 'astro';
import { z } from 'zod';

export const runtime = 'edge';
export const prerender = false;

const Schema = z.object({
  name: z.string().min(2),
  email: z.string().email({ message: 'Invalid email address' }),
  message: z.string().min(10),
  hp: z.string().optional().default(''),
});

export async function POST({ request }: APIContext) {
  const start = performance.now();
  try {
    const json = await request.json();
    const parsed = Schema.safeParse(json);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const { hp } = parsed.data;
    if (hp && hp.trim() !== '') {
      return new Response(JSON.stringify({ ok: true }), {
        status: 204,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const elapsed = performance.now() - start;
    return new Response(JSON.stringify({ ok: true, t: Math.round(elapsed) }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Bad request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

