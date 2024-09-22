"use client";

import { useState, useCallback, useMemo } from "react";
import { signIn, signOut } from "next-auth/react";
import { api } from "@/trpc/react";
import { useChat } from "ai/react";
import sdk from "@/lib/spotify-sdk/ClientInstance";
import type { PlaybackState, Track } from "@spotify/web-api-ts-sdk";

export const useTieTrackFacade = () => {
  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(
    null,
  );
  const [playbackLoading, setPlaybackLoading] = useState(false);

  const { artistName, albumImageUrl, songName } = useMemo(() => {
    const item = playbackState?.item as Track | undefined;
    return {
      artistName: item?.artists[0]?.name ?? "",
      albumImageUrl: item?.album?.images[0]?.url ?? "",
      songName: item?.name ?? "",
    };
  }, [playbackState]);

  const mutateCreateTieUpInfo = api.music.createTieUpInfo.useMutation();
  const {
    append,
    isLoading: chatLoading,
    setMessages,
  } = useChat({
    onFinish: (message) => {
      mutateCreateTieUpInfo.mutate(
        {
          artistName,
          songName,
          tieUpInfo: message.content,
        },
        {
          onSuccess: () => {
            void refetch();
          },
        },
      );
    },
  });

  const {
    data: tieUpInfo,
    isLoading: tieUpInfoLoading,
    refetch,
  } = api.music.getTieUpInfo.useQuery(
    { artistName, songName },
    { enabled: !!artistName && !!songName },
  );

  const fetchCurrentlyPlayingTrack = useCallback(async () => {
    setPlaybackLoading(true);
    try {
      const playbackState = await sdk.player.getCurrentlyPlayingTrack();
      setPlaybackState(playbackState);
      setMessages([]);
    } finally {
      setPlaybackLoading(false);
    }
  }, [setMessages]);

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
    handleSendToOpenAI,
    chatLoading,
    fetchCurrentlyPlayingTrack,
    playbackLoading,
  };
};
