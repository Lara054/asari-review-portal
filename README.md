# Asari Review Portal

カスタムチャットで生成した **HTML** を `public/reviews/` に置くだけで、
`/reviews` に **自動で一覧** が表示されるポータルです。

## 使い方（運用）
1. `public/reviews/` に HTML をアップロード（命名規約: `YYYYMMDD-HHMM_slug.html`）
2. push すると GitHub Actions が `public/reviews/index.json` を生成
3. サイトの `/reviews` に自動反映

### HTML テンプレ
```html
<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <title>ソーヴァ：台本レビュー 11.08</title>
  <meta name="asari:tags" content="Sova,初心者向け,Patch11.08">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>…本文…</body>
</html>
```

## ローカル開発
```bash
npm i
npm run dev
# http://localhost:3000
```

## インデックス手動生成
```bash
npm run gen:index
```

## デプロイ
Vercel に GitHub 連携でデプロイしてください（推奨）。
