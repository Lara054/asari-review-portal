"use client";

export default function HomePage() {
  return (
    <div style={{ display: "flex", gap: "24px", alignItems: "center", justifyContent: "center", minHeight: "100vh", flexWrap: "wrap", padding: "24px" }}>
      {/* レビュー結果ボタン */}
      <a href="/reviews" style={{ textDecoration: "none" }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "280px",
          height: "280px",
          padding: "32px",
          backgroundColor: "#f0f7ff",
          border: "2px solid #0066ff",
          borderRadius: "12px",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: "#0066ff", textAlign: "center" }}>
            レビュー結果
          </h2>
          <p style={{ margin: "12px 0 0", color: "#666", fontSize: "14px", textAlign: "center" }}>
            台本レビューを確認
          </p>
        </div>
      </a>

      {/* 動画作成指示書ボタン */}
      <a href="/instructions" style={{ textDecoration: "none" }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "280px",
          height: "280px",
          padding: "32px",
          backgroundColor: "#fff7f0",
          border: "2px solid #ff6600",
          borderRadius: "12px",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎬</div>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: "#ff6600", textAlign: "center" }}>
            動画作成指示書
          </h2>
          <p style={{ margin: "12px 0 0", color: "#666", fontSize: "14px", textAlign: "center" }}>
            動画作成の指示を確認
          </p>
        </div>
      </a>
    </div>
  );
}
