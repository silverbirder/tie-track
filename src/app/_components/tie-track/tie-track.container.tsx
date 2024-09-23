"use client";

import { signIn, useSession } from "next-auth/react";
import { useTieTrackFacade } from "./tie-track.facade";
import { TieTrackComponent } from "./tie-track.component";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DEMO from "./demo.png";
import Image from "next/image";

export const TieTrackContainer = () => {
  const session = useSession();
  const {
    playbackState,
    tieUpInfo,
    handleSignOut,
    handleSendToOpenAI,
    handleUpdateTieUpInfo,
    chatLoading,
    tieUpInfoLoading,
    fetchCurrentlyPlayingTrack,
    playbackLoading,
  } = useTieTrackFacade();

  if (!session || session.status !== "authenticated") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-4">
        <Card className="w-[320px]">
          <CardHeader>
            <CardTitle className="text-center text-xl font-bold">
              Spotify タイアップ検索
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="text-left">
              <p className="text-gray-700">
                このアプリは、現在
                Spotifyで再生中の曲に関連するタイアップ情報を検索します。
              </p>
            </div>
            <Button
              onClick={() => signIn("spotify")}
              className="bg-green-500 text-white hover:bg-green-600"
            >
              Spotifyでログイン
            </Button>
            <div>
              <p className="text-center text-gray-500">デモ画面</p>
              <Image
                src={DEMO}
                alt="アプリのデモ画面"
                width={911}
                height={911}
                className="rounded-lg border-4 border-gray-300 shadow-lg"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TieTrackComponent
      chatLoading={chatLoading}
      playbackState={playbackState}
      playbackLoading={playbackLoading}
      tieUpInfo={tieUpInfo}
      handleSignOut={handleSignOut}
      handleSendToOpenAI={handleSendToOpenAI}
      handleUpdateTieUpInfo={handleUpdateTieUpInfo}
      tieUpInfoLoading={tieUpInfoLoading}
      fetchCurrentlyPlayingTrack={fetchCurrentlyPlayingTrack}
    />
  );
};
