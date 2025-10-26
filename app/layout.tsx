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
      <body className="bg-gray-50 text-gray-900">
        <header className="sticky top-0 z-10 border-b bg-white/70 backdrop-blur">
          <div className="container mx-auto flex items-center gap-3 px-4 py-3">
            <Link href="/" className="flex items-center gap-3">
              <span className="relative size-9 overflow-hidden rounded-full ring-1 ring-gray-200">
                <Image
                  src="/images/asari-icon.png"
                  alt="Asari"
                  fill
                  className="object-cover"
                  sizes="36px"
                />
              </span>
              <span className="text-lg font-semibold tracking-tight">
                Asari Review Portal
              </span>
            </Link>
            <nav className="ml-auto">
              <Link
                href="/reviews"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                レビュー一覧
              </Link>
            </nav>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">{children}</main>

        <footer className="border-t bg-white py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Asari
        </footer>
      </body>
    </html>
  );
}
