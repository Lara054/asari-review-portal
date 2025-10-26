"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

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
    items.forEach((i) => i.tags?.forEach((t) => s.add(t)));
    return ["all", ...Array.from(s).sort((a, b) => a.localeCompare(b, "ja"))];
  }, [items]);

  const filtered = useMemo(() => {
    let arr = items.filter((i) => {
      const text = q.trim().toLowerCase();
      const hitQ =
        !text ||
        i.title.toLowerCase().includes(text) ||
        i.tags?.some((t) => t.toLowerCase().includes(text));
      const hitTag = tag === "all" || i.tags?.includes(tag);
      return hitQ && hitTag;
    });
    arr.sort((a, b) =>
      sort === "new" ? (a.date < b.date ? 1 : -1) : (a.date > b.date ? 1 : -1)
    );
    return arr;
  }, [items, q, tag, sort]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">台本レビュー一覧</h1>
          <p className="text-sm text-gray-500">
            <code className="rounded bg-gray-100 px-1.5 py-0.5">public/reviews/</code>{" "}
            にHTMLを置くと自動反映されます。
          </p>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="検索（タイトル / タグ）"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-4 ring-transparent transition focus:border-gray-400 focus:ring-blue-100 sm:w-64"
          />
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            {allTags.map((t) => (
              <option key={t} value={t}>
                {t === "all" ? "すべてのタグ" : t}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "new" | "old")}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="new">新しい順</option>
            <option value="old">古い順</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((it) => (
          <li
            key={it.file}
            className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Link href={it.href} className="block">
              <div className="flex items-start justify-between gap-3">
                <h3 className="line-clamp-2 text-base font-semibold tracking-tight group-hover:text-blue-700">
                  {it.title}
                </h3>
                <span className="shrink-0 rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-600">
                  {new Date(it.date).toLocaleDateString("ja-JP")}
                </span>
              </div>
              {it.tags?.length ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {it.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-600"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="mt-3 text-sm text-gray-500">{it.slug}</div>
            </Link>
          </li>
        ))}
      </ul>

      {!error && filtered.length === 0 && (
        <div className="rounded-lg border bg-white p-6 text-center text-gray-500">
          該当するレビューがありません。
        </div>
      )}
    </div>
  );
}
