import { useState, useCallback, useMemo, useEffect } from "react";
import type { PlaybackState } from "@spotify/web-api-ts-sdk";

export const useTieTrackPresenter = (
  playbackState: PlaybackState | null,
  tieUpInfo: { tieUpInfo: string | null } | null,
  handleUpdateTieUpInfo: (newTieUpInfo: string) => Promise<void>,
  fetchCurrentlyPlayingTrack: () => void,
) => {
  const track =
    playbackState?.item && "album" in playbackState.item
      ? playbackState.item
      : null;

  const albumImageUrl = useMemo(() => track?.album.images[0]?.url, [track]);
  const songName = useMemo(() => track?.name ?? "", [track]);
  const artistName = useMemo(() => track?.artists[0]?.name ?? "", [track]);

  const [isEditing, setIsEditing] = useState(false);
  const [editedTieUpInfo, setEditedTieUpInfo] = useState(
    tieUpInfo?.tieUpInfo ?? "",
  );

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setEditedTieUpInfo(tieUpInfo?.tieUpInfo ?? "");
  }, [tieUpInfo]);

  const handleSave = useCallback(async () => {
    await handleUpdateTieUpInfo(editedTieUpInfo);
    setIsEditing(false);
  }, [editedTieUpInfo, handleUpdateTieUpInfo]);

  const handleFetchTrack = useCallback(async () => {
    setIsEditing(false);
    fetchCurrentlyPlayingTrack();
  }, [fetchCurrentlyPlayingTrack]);

  useEffect(() => {
    setEditedTieUpInfo(tieUpInfo?.tieUpInfo ?? "");
  }, [tieUpInfo]);

  return {
    albumImageUrl,
    songName,
    artistName,
    isTrackAvailable: !!track,
    isEditing,
    editedTieUpInfo,
    setEditedTieUpInfo,
    handleEdit,
    handleSave,
    handleFetchTrack,
  };
};
