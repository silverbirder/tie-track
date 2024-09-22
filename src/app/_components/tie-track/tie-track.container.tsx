"use client";

import { signIn, useSession } from "next-auth/react";
import { useTieTrackFacade } from "./tie-track.facade";
import { TieTrackComponent } from "./tie-track.component";

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
      <div>
        <h1>Spotify Web API Typescript SDK in Next.js</h1>
        <button onClick={() => signIn("spotify")}>Sign in with Spotify</button>
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
