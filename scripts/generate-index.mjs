// scripts/generate-index.mjs
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const REVIEWS_DIR = path.join(ROOT, "public", "reviews");
const OUT_PATH = path.join(REVIEWS_DIR, "index.json");

// 対象: public/reviews/*.html （index.htmlと先頭._は除外）
const isTargetHtml = (name) =>
  name.endsWith(".html") &&
  name !== "index.html" &&
  !name.startsWith(".") &&
  !name.startsWith("_");

function extractTitle(html) {
  const m = html.match(/<title>([^<]+)<\/title>/i);
  return m ? m[1].trim() : null;
}

// 例: <meta name="tags" content="恋愛, コメディ">
function extractTags(html) {
  const m = html.match(/<meta\s+name=["']tags["']\s+content=["']([^"']+)["']/i);
  if (!m) return [];
  return m[1]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// 例: <meta name="date" content="2025-10-26">
function extractDate(html) {
  const m = html.match(/<meta\s+name=["']date["']\s+content=["']([^"']+)["']/i);
  if (!m) return null;
  const d = new Date(m[1]);
  return isNaN(+d) ? null : d.toISOString();
}

function toSlug(filename) {
  // 先頭の拡張子を除いたものをそのまま
  return filename.replace(/\.html$/i, "");
}

async function main() {
  // 1) ディレクトリ存在チェック
  await fs.mkdir(REVIEWS_DIR, { recursive: true });

  // 2) ファイル一覧
  const entries = await fs.readdir(REVIEWS_DIR, { withFileTypes: true });
  const htmlFiles = entries
    .filter((e) => e.isFile() && isTargetHtml(e.name))
    .map((e) => e.name);

  // 3) HTMLごとにメタ抽出
  const items = [];
  for (const file of htmlFiles) {
    const full = path.join(REVIEWS_DIR, file);
    const html = await fs.readFile(full, "utf8");

    const title = extractTitle(html);
    if (!title) {
      // タイトルがない場合はスキップ（ログだけ出す）
      console.warn(`[warn] Skip (no <title>): ${file}`);
      continue;
    }

    const tags = extractTags(html);
    const dateFromMeta = extractDate(html);

    // ファイルの更新日時（メタが無ければこれを使う）
    const stat = await fs.stat(full);
    const isoMtime = new Date(stat.mtimeMs).toISOString();

    const date = dateFromMeta ?? isoMtime;

    items.push({
      title,
      tags,
      date,
      href: `/reviews/${file}`,
      slug: toSlug(file),
      file,
    });
  }

  // 4) 日付降順へ
  items.sort((a, b) => (a.date < b.date ? 1 : -1));

  // 5) 出力
  const out = {
    generatedAt: new Date().toISOString(),
    count: items.length,
    items,
  };

  await fs.writeFile(OUT_PATH, JSON.stringify(out, null, 2), "utf8");
  console.log(`Wrote ${OUT_PATH} with ${items.length} items`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
