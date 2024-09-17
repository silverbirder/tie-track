"use client";

import sdk from "@/lib/spotify-sdk/ClientInstance";
import { type SpotifyApi } from "@spotify/web-api-ts-sdk";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
  const session = useSession();

  if (!session || session.status !== "authenticated") {
    return (
      <div>
        <h1>Spotify Web API Typescript SDK in Next.js</h1>
        <button onClick={() => signIn("spotify")}>Sign in with Spotify</button>
      </div>
    );
  }

  return (
    <div>
      <p>Logged in as {session.data.user?.name}</p>
      <button onClick={() => signOut()}>Sign out</button>
      <SpotifySearch sdk={sdk} />
    </div>
  );
}

function SpotifySearch({ sdk }: { sdk: SpotifyApi }) {
  useEffect(() => {
    void sdk.player.getCurrentlyPlayingTrack().then((data) => {
      console.log({ data });
    });
  }, [sdk]);

  return (
    <>
      <h1>Spotify Search for The Beatles</h1>
    </>
  );
}
