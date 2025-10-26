export const metadata = {
  title: 'Asari Review Portal',
  description: '台本レビューの一覧と閲覧',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Noto Sans JP, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
