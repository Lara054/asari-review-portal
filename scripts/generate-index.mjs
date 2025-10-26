import { readdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

const REVIEWS_DIR = path.join(process.cwd(), 'public', 'reviews');
const INDEX_PATH  = path.join(REVIEWS_DIR, 'index.json');

function parseMeta(html) {
  const titleMatch = html.match(/<title>([^<]+)<\\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : null;

  const tagsMatch = html.match(/<meta\\s+name=["']asari:tags["']\\s+content=["']([^"']+)["']/i);
  const tags = tagsMatch ? tagsMatch[1].split(',').map(s => s.trim()).filter(Boolean) : [];

  return { title, tags };
}

function parseFilename(file) {
  // 例: 20251026-0730_sova-review.html
  const m = file.match(/^(\\d{8})-(\\d{4})_(.+)\\.html$/);
  if (!m) return null;
  const [ , ymd, hm, slug ] = m;
  const yyyy = ymd.slice(0,4), mm = ymd.slice(4,6), dd = ymd.slice(6,8);
  const HH = hm.slice(0,2), MM = hm.slice(2,4);
  const iso = `${yyyy}-${mm}-${dd}T${HH}:${MM}:00+09:00`; // JST想定
  return { date: iso, slug, file };
}

(async () => {
  const files = (await readdir(REVIEWS_DIR)).filter(f => f.endsWith('.html'));
  const items = [];
  for (const file of files) {
    const meta = parseFilename(file);
    if (!meta) continue;
    const html = await readFile(path.join(REVIEWS_DIR, file), 'utf-8');
    const { title, tags } = parseMeta(html);
    items.push({
      title: title ?? meta.slug,
      tags,
      date: meta.date,
      href: `/reviews/${file}`,   // 直接静的ファイルへ
      slug: meta.slug,
      file: file
    });
  }
  items.sort((a,b) => (a.date < b.date ? 1 : -1));
  await writeFile(INDEX_PATH, JSON.stringify({ generatedAt: new Date().toISOString(), items }, null, 2));
  console.log(`Wrote ${INDEX_PATH} with ${items.length} items`);
})();
