import Link from 'next/link';

export default function Page() {
  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Asari Review Portal</h1>
      <p style={{ marginTop: 12 }}>
        カスタムチャットで生成したHTMLを <code>public/reviews/</code> に置くだけで、一覧に自動反映されます。
      </p>
      <ul style={{ marginTop: 16 }}>
        <li><Link href="/reviews">台本レビュー一覧へ</Link></li>
      </ul>
    </main>
  );
}
