"use client";

import { memo } from "react";
import type { PlaybackState } from "@spotify/web-api-ts-sdk";
import { useTieTrackPresenter } from "./tie-track.presenter";
import type { Message } from "ai";

type Props = {
  playbackState: PlaybackState | null;
  tieUpInfo?: { tieUpInfo: string | null } | null;
  handleSignOut: () => void;
  handleSendToOpenAI: () => void;
  messages: Message[];
  tieUpInfoLoading: boolean;
  fetchCurrentlyPlayingTrack: () => void;
};

export const TieTrackComponent = memo(function TieTrackComponent({
  playbackState,
  tieUpInfo,
  handleSignOut,
  handleSendToOpenAI,
  messages,
  tieUpInfoLoading,
  fetchCurrentlyPlayingTrack,
}: Props) {
  const { albumImageUrl, songName, artistName } =
    useTieTrackPresenter(playbackState);

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
      {tieUpInfo && (
        <p>
          <strong>Tie-Up Info:</strong>
          {tieUpInfo.tieUpInfo ?? "タイアップ情報は見つかりませんでした。"}
        </p>
      )}
      {tieUpInfoLoading && <p>Loading tie-up info...</p>}
      <button onClick={handleSignOut}>Sign out</button>
      <button onClick={handleSendToOpenAI}>Send to OpenAI</button>
      <button onClick={fetchCurrentlyPlayingTrack}>
        Fetch Currently Playing Track
      </button>
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
});
