"use client";

import sdk from "@/lib/spotify-sdk/ClientInstance";
import { useChat } from "ai/react";
import type { PlaybackState, SpotifyApi } from "@spotify/web-api-ts-sdk";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

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
  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(
    null,
  );
  const { messages, handleSubmit, setInput } = useChat();

  useEffect(() => {
    void sdk.player.getCurrentlyPlayingTrack().then((data) => {
      setPlaybackState(data);
    });
  }, [sdk]);

  if (!playbackState?.item) {
    return <div>Loading...</div>;
  }

  const item = playbackState.item;

  if (item && "album" in item) {
    const track = item;
    const albumImageUrl = track.album.images[0]?.url;
    const artistName = track.artists[0]?.name;
    const trackName = track.name;

    const handleSendToOpenAI = () => {
      const message = `アーティスト名: "${artistName}", 曲名: "${trackName}".`;
      setInput(message);
      handleSubmit();
    };

    return (
      <div>
        <h1>Now Playing</h1>
        {albumImageUrl && (
          <img
            src={albumImageUrl}
            alt={`Album cover of ${trackName}`}
            width={300}
          />
        )}
        <p>
          <strong>Track:</strong> {trackName}
        </p>
        <p>
          <strong>Artist:</strong> {artistName}
        </p>
        <button onClick={handleSendToOpenAI}>Send to OpenAI</button>
        <div>
          {messages.map((message) => (
            <div key={message.id}>
              <div>{message.role}</div>
              <div>{message.content}</div>
            </div>
          ))}
        </div>
      </div>
    );
  } else if (item && "show" in item) {
    const episode = item;
    const episodeName = episode.name;

    return (
      <div>
        <h1>Now Playing</h1>
        <p>
          <strong>Episode:</strong> {episodeName}
        </p>
      </div>
    );
  }

  return <div>No media is currently playing.</div>;
}
