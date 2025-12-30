import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Asari Review Portal",
  description: "台本レビューの一覧と閲覧",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <header className="header">
          <div className="container header__inner">
            <Link href="/" className="brand">
              <span style={{ fontSize: "24px", marginRight: "8px" }}>🌊</span>
              <span style={{ fontWeight: 700, letterSpacing: ".2px" }}>
                Asari Review Portal
              </span>
            </Link>
          </div>
        </header>

        <main className="container">{children}</main>

        <footer className="footer">© 2025 Asari</footer>
      </body>
    </html>
  );
}
