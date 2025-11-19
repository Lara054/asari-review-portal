"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Item = {
  title: string;
  tags: string[];
  date: string; // ISO
  href: string; // 例: "/reviews/20251026-1010_sample.html"
  slug: string;
  file: string;
};

export default function ReviewsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string>("all");
  const [sort, setSort] = useState<"new" | "old">("new");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/reviews/index.json", { cache: "no-store" });
        if (!res.ok) {
          setError("index.json が見つかりません。HTMLを1枚アップロードして生成してください。");
          return;
        }
        const json = await res.json();
        setItems(json.items || []);
      } catch {
        setError("一覧の取得に失敗しました。");
      }
    })();
  }, []);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    items.forEach(i => i.tags?.forEach(t => s.add(t)));
    return ["all", ...Array.from(s).sort((a,b)=>a.localeCompare(b,"ja"))];
  }, [items]);

  const filtered = useMemo(() => {
    let arr = items.filter(i => {
      const text = q.trim().toLowerCase();
      const hitQ =
        !text ||
        i.title.toLowerCase().includes(text) ||
        i.tags?.some(t => t.toLowerCase().includes(text));
      const hitTag = tag === "all" || i.tags?.includes(tag);
      return hitQ && hitTag;
    });
    arr.sort((a,b)=> sort==="new" ? (a.date < b.date ? 1 : -1) : (a.date > b.date ? 1 : -1));
    return arr;
  }, [items, q, tag, sort]);

  return (
    <div className="space" style={{ display:"grid", gap: "16px" }}>
      {/* ヘッダー行 */}
      <div style={{display:"flex",gap:16,alignItems:"center",justifyContent:"space-between",flexWrap:"wrap"}}>
        <div>
          <h1 style={{margin:0,fontSize:22,fontWeight:700,letterSpacing:".2px"}}>台本レビュー一覧</h1>
          <p style={{margin:"6px 0 0",color:"var(--muted)",fontSize:13}}>
            <code>public/reviews/</code> にHTMLを置くと自動反映されます。
          </p>
        </div>
        <div className="controls">
          <input
            className="input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="検索（タイトル / タグ）"
          />
          <select className="select" value={tag} onChange={(e)=>setTag(e.target.value)}>
            {allTags.map(t => <option key={t} value={t}>{t==="all"?"すべてのタグ":t}</option>)}
          </select>
          <select className="select" value={sort} onChange={(e)=>setSort(e.target.value as "new"|"old")}>
            <option value="new">新しい順</option>
            <option value="old">古い順</option>
          </select>
        </div>
        <Link href="/privacy" style={{fontSize:13,color:"var(--muted)"}}>
          プライバシーポリシー
        </Link>
      </div>

      {/* エラー */}
      {error && <div className="alert">{error}</div>}

      {/* カード一覧 */}
      <ul className="grid" style={{listStyle:"none",padding:0,margin:0}}>
        {filtered.map((it)=>(
          <li key={it.file} className="card">
            {/* typed routes を避けるため a を使用（内部遷移でもOK） */}
            <a href={it.href} style={{display:"block"}}>
              <h3 className="card__title">{it.title}</h3>
              <div className="card__meta">{new Date(it.date).toLocaleDateString("ja-JP")}</div>
              {it.tags?.length ? (
                <div className="badges">
                  {it.tags.map(t => <span key={t} className="badge">{t}</span>)}
                </div>
              ) : null}
              <div style={{marginTop:10,color:"var(--muted)",fontSize:13}}>{it.slug}</div>
            </a>
          </li>
        ))}
      </ul>

      {!error && filtered.length===0 && (
        <div className="empty">該当するレビューがありません。</div>
      )}

      {/* ページ内プライバシー */}
      <section id="privacy" style={{padding:20,maxWidth:900,margin:"24px auto 80px",background:"var(--card)",borderRadius:8}}>
        <h2 style={{marginTop:0}}>プライバシーポリシー</h2>
        <p>本プライバシーポリシーは、shell's（以下「本サービス」）が収集・利用する情報について説明します。</p>
        <h3>1. 収集する情報</h3>
        <ul>
          <li>ユーザーが本サービスに入力するテキスト（例：台本本文、slug 等）</li>
          <li>本サービスに添付されたファイルおよびそのメタ情報</li>
          <li>利用状況に関するログ（利用日時、エラー情報等）</li>
        </ul>
        <h3>2. 利用目的</h3>
        <ul>
          <li>ユーザー入力に対する生成結果の提供</li>
          <li>本サービスの保守・改善</li>
          <li>問い合わせ対応</li>
        </ul>
        <h3>3. 第三者提供および外部送信</h3>
        <p>外部サービスへ送信する場合があります（送信項目：slug, 台本本文, メタ情報）。範囲と目的は最小化します。</p>
        <h3>4. 保管期間</h3>
        <p>受領したデータは最大30日保管し、その後削除または匿名化します（例外あり）。</p>
        <h3>5. セキュリティ</h3>
        <p>TLS等の標準的な暗号化を使用し、保存データは適切に保護します。</p>
        <h3>6. お問い合わせ</h3>
        <p>問い合わせ先：&lt;katutosi0504@icloud.com&gt;</p>
      </section>
    </div>
  );
}
