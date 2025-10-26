import { readdir, readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

const ROOT = process.cwd();
const REVIEWS_DIR = path.join(ROOT, "public", "reviews");
const INDEX_PATH  = path.join(REVIEWS_DIR, "index.json");

// 小さなユーティリティ：タグ間文字列をケース無視で安全抽出
function extractBetween(html, startTag, endTag) {
  const lower = html.toLowerCase();
  const s = lower.indexOf(startTag.toLowerCase());
  if (s === -1) return null;
  const e = lower.indexOf(endTag.toLowerCase(), s + startTag.length);
  if (e === -1) return null;
  const start = s + startTag.length;
  return html.slice(start, e).trim();
}

function parseMeta(html) {
  try {
    const title = extractBetween(html, "<title>", "</title>");

    // <meta name="asari:tags" content="A,B,C">
    // 正規表現を避け、素朴に走査
    const lower = html.toLowerCase();
    const needle = '<meta';
    let cursor = 0;
    const tags = [];
    while (true) {
      const i = lower.indexOf(needle, cursor);
      if (i === -1) break;
      const j = lower.indexOf('>', i + 5);
      if (j === -1) break;
      const chunk = html.slice(i, j + 1);
      const chk = chunk.toLowerCase();
      if (chk.includes('name="asari:tags"') || chk.includes("name='asari:tags'")) {
        // content="..."/'...'
        const c1 = chk.indexOf('content="');
        const c2 = chk.indexOf("content='");
        let val = null;
        if (c1 !== -1) {
          const s = c1 + 'content="'.length;
          const e = chk.indexOf('"', s);
          if (e !== -1) val = chunk.slice(s, e);
        } else if (c2 !== -1) {
          const s = c2 + "content='".length;
          const e = chk.indexOf("'", s);
          if (e !== -1) val = chunk.slice(s, e);
        }
        if (val) {
          val.split(',').map(s => s.trim()).filter(Boolean).forEach(v => tags.push(v));
        }
      }
      cursor = j + 1;
    }
    return { title, tags };
  } catch {
    return { title: null, tags: [] };
  }
}

// 例: 20251026-0730_sova-review.html
function parseFilename(file) {
  const m = file.match(/^(\d{8})-(\d{4})_(.+)\.html$/i);
  if (!m) return null;
  const [, ymd, hm, slug] = m;
  const yyyy = ymd.slice(0, 4), mm = ymd.slice(4, 6), dd = ymd.slice(6, 8);
  const HH = hm.slice(0, 2),   MM = hm.slice(2, 4);
  const iso = `${yyyy}-${mm}-${dd}T${HH}:${MM}:00+09:00`; // JST
  return { date: iso, slug, file };
}

(async () => {
  try {
    await mkdir(REVIEWS_DIR, { recursive: true });

    const all = await readdir(REVIEWS_DIR);
    const htmlFiles = all.filter(f => f.toLowerCase().endsWith(".html"));

    const items = [];
    for (const file of htmlFiles) {
      const meta = parseFilename(file);
      if (!meta) continue;

      const html = await readFile(path.join(REVIEWS_DIR, file), "utf-8");
      const { title, tags } = parseMeta(html);

      items.push({
        title: (title && title.length ? title : meta.slug),
        tags,
        date: meta.date,
        href: `/reviews/${file}`,
        slug: meta.slug,
        file
      });
    }

    items.sort((a, b) => (a.date < b.date ? 1 : -1));

    const payload = { generatedAt: new Date().toISOString(), items };
    await writeFile(INDEX_PATH, JSON.stringify(payload, null, 2), "utf-8");
    console.log(`Wrote ${INDEX_PATH} with ${items.length} items`);
    process.exit(0);
  } catch (err) {
    console.error("Failed to generate index.json:", err);
    // 失敗でCIが止まると不便なので 0 で終了（必要なら 1 に戻してください）
    process.exit(0);
  }
})();
