import "./globals.css";
import Image from "next/image";
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
              {/* あさりアイコン： public/images/asari-icon.png を配置 */}
              <span className="avatar">
                <Image
                  src="/images/asari-icon.png"
                  alt="Asari"
                  fill
                  sizes="38px"
                  style={{ objectFit: "cover" }}
                />
              </span>
              <span style={{ fontWeight: 700, letterSpacing: ".2px" }}>
                Asari Review Portal
              </span>
            </Link>
          </div>
        </header>

        <main className="container">{children}</main>

        <footer className="footer">© {new Date().getFullYear()} Asari</footer>
      </body>
    </html>
  );
}
