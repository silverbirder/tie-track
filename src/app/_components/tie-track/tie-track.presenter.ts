"use client";

import { useMemo } from "react";
import type { PlaybackState } from "@spotify/web-api-ts-sdk";

export const useTieTrackPresenter = (playbackState: PlaybackState | null) => {
  const track =
    playbackState?.item && "album" in playbackState.item
      ? playbackState.item
      : null;

  const albumImageUrl = useMemo(() => track?.album.images[0]?.url, [track]);
  const songName = useMemo(() => track?.name ?? "", [track]);
  const artistName = useMemo(() => track?.artists[0]?.name ?? "", [track]);

  return {
    albumImageUrl,
    songName,
    artistName,
  };
};
