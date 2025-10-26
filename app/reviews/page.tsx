'use client';
import { useEffect, useState } from 'react';

type Item = {
  title: string;
  tags: string[];
  date: string;
  href: string;
  slug: string;
  file: string;
};

export default function ReviewsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/reviews/index.json', { cache: 'no-store' });
        if (!res.ok) {
          setError('index.json がまだ生成されていません。HTMLを1枚アップロードしてください。');
          return;
        }
        const json = await res.json();
        setItems(json.items || []);
      } catch (e) {
        setError('一覧の取得に失敗しました。');
      }
    })();
  }, []);

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>台本レビュー一覧</h1>
      {error && <p style={{ color: 'crimson', marginTop: 12 }}>{error}</p>}
      <ul style={{ marginTop: 16, display: 'grid', gap: 12 }}>
        {items.map((it, i) => (
          <li key={i} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
            <a href={it.href} style={{ fontSize: 18, fontWeight: 600, textDecoration: 'underline' }}>{it.title}</a>
            <div style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>
              {new Date(it.date).toLocaleString('ja-JP')}
            </div>
            {it.tags?.length ? (
              <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {it.tags.map((t, j) => (
                  <span key={j} style={{ fontSize: 12, border: '1px solid #e5e7eb', borderRadius: 9999, padding: '2px 8px' }}>{t}</span>
                ))}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
