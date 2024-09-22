"use client";

import { useTieTrackPresenter } from "./tie-track.presenter";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { LogOut, RefreshCw, Send, Loader2 } from "lucide-react";
import type { PlaybackState } from "@spotify/web-api-ts-sdk";
import type { Message } from "ai";

type Props = {
  chatLoading: boolean;
  playbackState: PlaybackState | null;
  tieUpInfo?: { tieUpInfo: string | null } | null;
  handleSignOut: () => void;
  handleSendToOpenAI: () => void;
  messages: Message[];
  tieUpInfoLoading: boolean;
  fetchCurrentlyPlayingTrack: () => void;
};

export const TieTrackComponent = memo(function TieTrackComponent({
  chatLoading,
  playbackState,
  tieUpInfo,
  handleSignOut,
  handleSendToOpenAI,
  messages,
  tieUpInfoLoading,
  fetchCurrentlyPlayingTrack,
}: Props) {
  const { albumImageUrl, songName, artistName, isTrackAvailable } =
    useTieTrackPresenter(playbackState);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">
            Spotify TieTrack
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            {albumImageUrl ? (
              <Image
                src={albumImageUrl}
                alt={`Album cover of ${songName}`}
                width={100}
                height={100}
                className="rounded-lg shadow-lg"
              />
            ) : (
              <Skeleton className="h-[100px] w-[100px] rounded-lg" />
            )}
            <div>
              <h2 className="font-semibold">
                {songName || "No track playing"}
              </h2>
              <p className="text-sm text-gray-600">
                {artistName || "Unknown artist"}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button onClick={fetchCurrentlyPlayingTrack} className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Track
            </Button>
            <Button onClick={handleSignOut} variant="outline" size="icon">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
          {isTrackAvailable && (
            <>
              <div className="space-y-2">
                {tieUpInfoLoading ? (
                  <Skeleton className="h-20 w-full" />
                ) : tieUpInfo?.tieUpInfo ? (
                  <p className="text-sm">{tieUpInfo.tieUpInfo}</p>
                ) : (
                  <p className="text-sm text-gray-500">
                    タイアップ情報は見つかりませんでした。
                  </p>
                )}
                {!tieUpInfoLoading && !tieUpInfo?.tieUpInfo && (
                  <Button
                    onClick={handleSendToOpenAI}
                    className="w-full"
                    disabled={chatLoading}
                  >
                    {chatLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    {chatLoading ? "Sending..." : "Send to OpenAI"}
                  </Button>
                )}
              </div>
              {messages.length > 0 && (
                <div className="mt-4 space-y-2">
                  {messages
                    .filter((message) => message.role === "system")
                    .map((message) => (
                      <div key={message.id} className="rounded bg-gray-100 p-2">
                        <div className="text-sm">{message.content}</div>
                      </div>
                    ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
});
