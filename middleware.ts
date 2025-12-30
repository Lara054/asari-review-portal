// middleware.ts（サイト全体保護・静的は除外）
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    // 静的アセットは素通ししつつ、ページ/APIは保護
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};

// 環境変数はビルド時に文字列に埋め込まれる（EdgeでもOK）
const BASIC_AUTH_USER = process.env.BASIC_AUTH_USER ?? "";
const BASIC_AUTH_PASS = process.env.BASIC_AUTH_PASS ?? "";
const SHARE_TOKEN     = process.env.SHARE_TOKEN ?? ""; // 任意

export function middleware(req: NextRequest) {
  // 開発環境では認証をスキップ
  // process.env.NODE_ENV が undefined の場合もスキップ
  const isDev = process.env.NODE_ENV === "development" || !process.env.NODE_ENV || process.env.NODE_ENV !== "production";
  if (isDev) {
    return NextResponse.next();
  }
  
  if (!BASIC_AUTH_USER || !BASIC_AUTH_PASS) {
    return new NextResponse("Auth not configured", { status: 500 });
  }

  // 共有リンク（?t=... or cookie）でバイパス
  const token = req.nextUrl.searchParams.get("t") || req.cookies.get("share_t")?.value;
  if (SHARE_TOKEN && token === SHARE_TOKEN) {
    const res = NextResponse.next();
    res.cookies.set("share_t", SHARE_TOKEN, {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });
    return res;
  }

  // Basic 認証
  const auth = req.headers.get("authorization");
  if (!auth) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Protected"' },
    });
  }

  const [scheme, encoded] = auth.split(" ");
  if (scheme !== "Basic" || !encoded) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Protected"' },
    });
  }

  // Edge Runtime でも atob は利用可
  const [name, pwd] = atob(encoded).split(":");
  if (name === BASIC_AUTH_USER && pwd === BASIC_AUTH_PASS) {
    return NextResponse.next();
  }

  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Protected"' },
  });
}
