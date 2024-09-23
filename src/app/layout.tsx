import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import AuthSessionProvider from "./_components/AuthSessionProvider";
import { getServerSession } from "next-auth";
import authOptions from "./api/auth/[...nextauth]/authOptions";
import { Footer } from "./_components/Footer";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  robots: {
    index: true,
  },
  title: "タイアップ検索",
  description:
    "Spotifyで再生中の曲情報を取得し、AIを使ってタイアップ情報を自動で検索します。",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  keywords: ["Spotify", "タイアップ検索", "AI"],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="ja" className={`${GeistSans.variable} h-full`}>
      <head>
        <link
          rel="apple-touch-icon"
          type="image/png"
          href="/apple-touch-icon.png"
        ></link>
        <link rel="icon" type="image/png" href="/icon-192x192.png"></link>
      </head>
      <AuthSessionProvider session={session}>
        <body className="flex h-full flex-col">
          <main className="flex-1 overflow-auto">
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </main>
          <Footer />
          {process.env.GA_ID && <GoogleAnalytics gaId={process.env.GA_ID} />}
          <Analytics />
        </body>
      </AuthSessionProvider>
    </html>
  );
}
