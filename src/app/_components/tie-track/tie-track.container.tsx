"use client";

import { signIn, useSession } from "next-auth/react";
import { useTieTrackFacade } from "./tie-track.facade";
import { TieTrackComponent } from "./tie-track.component";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const TieTrackContainer = () => {
  const session = useSession();
  const {
    playbackState,
    tieUpInfo,
    handleSignOut,
    handleSendToOpenAI,
    messages,
    tieUpInfoLoading,
    fetchCurrentlyPlayingTrack,
  } = useTieTrackFacade();

  if (!session || session.status !== "authenticated") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-xl font-bold">
              Spotify TieTrack
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button
              onClick={() => signIn("spotify")}
              className="bg-green-500 text-white hover:bg-green-600"
            >
              Sign in with Spotify
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TieTrackComponent
      playbackState={playbackState}
      tieUpInfo={tieUpInfo}
      handleSignOut={handleSignOut}
      handleSendToOpenAI={handleSendToOpenAI}
      messages={messages}
      tieUpInfoLoading={tieUpInfoLoading}
      fetchCurrentlyPlayingTrack={fetchCurrentlyPlayingTrack}
    />
  );
};
