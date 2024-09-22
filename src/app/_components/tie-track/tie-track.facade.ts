"use client";

import { useState, useCallback } from "react";
import { signIn, signOut } from "next-auth/react";
import { api } from "@/trpc/react";
import { useChat } from "ai/react";
import sdk from "@/lib/spotify-sdk/ClientInstance";
import type { PlaybackState, Track } from "@spotify/web-api-ts-sdk";

export const useTieTrackFacade = () => {
  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(
    null,
  );
  const item = playbackState?.item as Track;
  const artistName = item?.artists[0]?.name ?? "";
  const albumImageUrl = item?.album?.images[0]?.url;
  const songName = playbackState?.item?.name ?? "";

  const {
    messages,
    append,
    isLoading: chatLoading,
  } = useChat({
    onFinish: (message) => {
      mutateCreateTieUpInfo.mutate({
        artistName,
        songName,
        tieUpInfo: message.content,
      });
    },
  });

  const mutateCreateTieUpInfo = api.music.createTieUpInfo.useMutation();

  const { data: tieUpInfo, isLoading: tieUpInfoLoading } =
    api.music.getTieUpInfo.useQuery(
      { artistName, songName },
      { enabled: !!artistName && !!songName },
    );

  const fetchCurrentlyPlayingTrack = useCallback(async () => {
    const playbackState = await sdk.player.getCurrentlyPlayingTrack();
    setPlaybackState(playbackState);
  }, []);

  const handleSendToOpenAI = useCallback(async () => {
    const message = JSON.stringify({ artistName, songName });
    await append({ role: "user", content: message });
  }, [artistName, songName, append]);

  const handleSignIn = useCallback(() => signIn("spotify"), []);
  const handleSignOut = useCallback(() => signOut(), []);

  return {
    handleSignIn,
    handleSignOut,
    playbackState,
    tieUpInfo,
    tieUpInfoLoading,
    albumImageUrl,
    artistName,
    songName,
    messages,
    handleSendToOpenAI,
    chatLoading,
    fetchCurrentlyPlayingTrack,
  };
};
