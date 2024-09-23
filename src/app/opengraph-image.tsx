import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "タイアップ検索";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to right, #60a5fa, #a855f7, #ec4899)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <h1
            style={{
              fontSize: 80,
              fontWeight: 600,
              color: "white",
              marginLeft: 20,
            }}
          >
            タイアップ検索
          </h1>
        </div>
        <p
          style={{
            fontSize: 40,
            fontWeight: 500,
            color: "white",
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          Spotifyで再生中の曲情報を取得し、AIを使ってタイアップ情報を自動で検索します。
        </p>
      </div>
    ),
    {
      ...size,
    },
  );
}
