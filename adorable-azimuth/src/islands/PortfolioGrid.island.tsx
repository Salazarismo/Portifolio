import { useEffect, useMemo, useRef, useState } from 'preact/hooks';

type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  category: 'App Mobile' | 'Websites' | 'Design';
  caseLabel?: string;
  caseTarget?: string;
};

interface Props {
  items: PortfolioItem[];
}

function toFormat(url: string, fmt: 'avif' | 'webp') {
  try {
    const u = new URL(url);
    if (u.hostname.includes('images.unsplash.com')) {
      return url.replace(/fm=[^&]*/i, `fm=${fmt}`);
    }
  } catch {}
  return '';
}

export default function PortfolioGrid({ items }: Props) {
  const categories = useMemo(() => ['Todos', 'App Mobile', 'Websites', 'Design'] as const, []);
  const [selected, setSelected] = useState<typeof categories[number]>('Todos');
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const containerRef = useRef<HTMLDivElement>(null);
  const counts = useMemo(() => {
    const map = { 'Todos': items.length, 'App Mobile': 0, 'Websites': 0, 'Design': 0 } as Record<typeof categories[number], number>;
    for (const it of items) map[it.category as 'App Mobile' | 'Websites' | 'Design']++;
    return map;
  }, [items]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected('Todos');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('img[data-pid]'));
    if (imgs.length) {
      setLoaded((prev) => {
        const next = { ...prev };
        for (const img of imgs) {
          const pid = img.getAttribute('data-pid') || '';
          if (pid && img.complete) next[pid] = true;
        }
        return next;
      });
    }
  }, []);

  const onSelect = (cat: typeof categories[number]) => {
    setSelected(cat);
    const el = containerRef.current;
    if (el) {
      el.setAttribute('data-state', 'changing');
      setTimeout(() => el.removeAttribute('data-state'), 260);
    }
  };

  return (
    <div ref={containerRef} class="portfolio-grid" data-active={selected} style="display:grid; gap: var(--spacing-4)">
      <div role="toolbar" aria-label="Filtros de portfólio" style="display:flex; gap: var(--space-2); flex-wrap: wrap">
        {categories.map((cat) => {
          const active = selected === cat;
          return (
            <button
              key={cat}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(cat)}
              class="filter-btn"
              data-text={active ? 'ui-label' : 'ui-helper'}
              style={`position:relative; padding: var(--space-1) var(--space-2); border-radius: var(--radius-md); border: var(--border-width-1) solid ${
                active ? 'var(--accent-1)' : 'var(--color-border)'
              }; background: ${active ? 'var(--surface-1)' : 'transparent'}; transition: all var(--duration-fast) var(--ease-standard)`}
            >
              {cat} · {cat === 'Todos' ? counts['Todos'] : counts[cat]}
              <span aria-hidden="true" class="filter-underline"></span>
            </button>
          );
        })}
      </div>
      <div aria-live="polite" data-text="ui-label">
        {selected === 'Todos'
          ? 'Todos os projetos'
          : `${items.filter((i) => i.category === selected).length} projetos — ${selected}`}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-token-4">
        {items.map((item, idx) => {
          const avif = toFormat(item.imageUrl, 'avif');
          const webp = toFormat(item.imageUrl, 'webp');
          const eager = idx < 3;
          const match = selected === 'Todos' ? true : item.category === selected;
          return (
            <a
              key={item.id}
              class="card-interactive portfolio-item"
              data-cell
              data-z="1"
              aria-labelledby={`${item.id}-title`}
              href={`/projects/${item.id}`}
              data-category={item.category}
              data-match={match ? 'true' : 'false'}
              onMouseEnter={(e) => {
                const el = containerRef.current;
                if (!el) return;
                (e.currentTarget as HTMLElement).setAttribute('data-hovered', 'true');
                el.setAttribute('data-hover', match ? 'active' : 'inactive');
                const cr = el.getBoundingClientRect();
                const tr = (e.currentTarget as HTMLElement).getBoundingClientRect();
                const cx = tr.left + tr.width / 2 - cr.left;
                const cy = tr.top + tr.height / 2 - cr.top;
                el.style.setProperty('--hover-x', `${cx}px`);
                el.style.setProperty('--hover-y', `${cy}px`);
                el.setAttribute('data-hoverfx', 'on');
              }}
              onMouseLeave={(e) => {
                const el = containerRef.current;
                if (!el) return;
                (e.currentTarget as HTMLElement).removeAttribute('data-hovered');
                el.removeAttribute('data-hover');
                el.removeAttribute('data-hoverfx');
              }}
              style={`background: var(--surface-1); border-color: var(--color-border); box-shadow: var(--elevation-1)`}
            >
              <div style="position:relative; overflow:hidden; border-radius: var(--radius-md)">
                {!loaded[item.id] && (
                  <div
                    aria-hidden="true"
                    data-skeleton
                    style="position:absolute; inset:0; border-radius: var(--radius-md); pointer-events:none"
                  />
                )}
                <picture>
                  {avif && <source type="image/avif" srcSet={`${avif} 1200w`} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />}
                  {webp && <source type="image/webp" srcSet={`${webp} 1200w`} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />}
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    width="640"
                    height="360"
                    loading={eager ? 'eager' : 'lazy'}
                    decoding="async"
                    fetchpriority={eager ? 'high' as any : 'auto' as any}
                    data-pid={item.id}
                    onLoad={() => setLoaded((s) => ({ ...s, [item.id]: true }))}
                    onError={() => setLoaded((s) => ({ ...s, [item.id]: true }))}
                    style="display:block; width:100%; height:auto; aspect-ratio: 16/9; border-radius: var(--radius-md)"
                  />
                </picture>
              </div>
              <div class="card-body">
                <h3 id={`${item.id}-title`} data-text="heading-lg">{item.title}</h3>
                {item.caseLabel && item.caseTarget && (
                  <a href={item.caseTarget} data-text="ui-label" style="display:inline-block; padding: var(--space-1) var(--space-2); border-radius: var(--radius-sm); background: var(--surface-2); border: var(--border-width-1) solid var(--color-border)">
                    {item.caseLabel}
                  </a>
                )}
                <p data-text="body-normal" style="max-width: 65ch">{item.description}</p>
                <div style="display:flex; flex-wrap:wrap; gap: var(--space-1)">
                  {item.technologies.map((t) => (
                    <span
                      key={t}
                      data-text="ui-label"
                      style="border: var(--border-width-1) solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-1) var(--space-2); background: var(--surface-2)"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
