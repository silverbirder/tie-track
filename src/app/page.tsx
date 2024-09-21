"use client";

import sdk from "@/lib/spotify-sdk/ClientInstance";
import { useChat } from "ai/react";
import type { PlaybackState, SpotifyApi } from "@spotify/web-api-ts-sdk";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { api } from "@/trpc/react";

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
  const { messages, handleSubmit, setInput, isLoading } = useChat();
  const mutateCreateTieUpInfo = api.music.createTieUpInfo.useMutation();

  useEffect(() => {
    void sdk.player.getCurrentlyPlayingTrack().then((data) => {
      setPlaybackState(data);
    });
  }, [sdk]);

  const item = playbackState?.item;

  const track = item && "album" in item ? item : null;
  const artistName = track?.artists[0]?.name ?? "";
  const songName = track?.name ?? "";

  const { data: tieUpInfo } = api.music.getTieUpInfo.useQuery(
    { artistName, songName },
    {
      enabled: !!artistName && !!songName,
    },
  );

  const handleSendToOpenAI = () => {
    const message = JSON.stringify({ artistName, songName });
    setInput(message);
    handleSubmit();
  };

  useEffect(() => {
    if (!isLoading && messages.length > 0 && artistName && songName) {
      const tieUpInfoFromMessages = messages
        .filter((message) => message.role !== "user")
        .map((message) => message.content.toString())
        .join(",");
      console.log({ tieUpInfoFromMessages });
      mutateCreateTieUpInfo.mutate({
        artistName,
        songName,
        tieUpInfo: tieUpInfoFromMessages,
      });
    }
  }, [isLoading, messages, artistName, songName, mutateCreateTieUpInfo]);

  if (!track) {
    return <div>Loading...</div>;
  }

  const albumImageUrl = track.album.images[0]?.url;

  return (
    <div>
      <h1>Now Playing</h1>
      {albumImageUrl && (
        <img
          src={albumImageUrl}
          alt={`Album cover of ${songName}`}
          width={300}
        />
      )}
      <p>
        <strong>Track:</strong> {songName}
      </p>
      <p>
        <strong>Artist:</strong> {artistName}
      </p>
      {tieUpInfo ? (
        <p>
          <strong>Tie-Up Info:</strong>
          {tieUpInfo.tieUpInfo ?? "タイアップ情報は見つかりませんでした。"}
        </p>
      ) : (
        <p>Loading tie-up info...</p>
      )}
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
}
