import { useState, useCallback, useMemo } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "@/trpc/react";
import { useChat } from "ai/react";
import sdk from "@/lib/spotify-sdk/ClientInstance";
import type { PlaybackState, Track } from "@spotify/web-api-ts-sdk";
import { Music, Search, Edit } from "lucide-react";
import { useRouter } from "next/navigation";

export const useTieTrackFacade = () => {
  const session = useSession();
  const router = useRouter();
  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(
    null,
  );
  const [playbackLoading, setPlaybackLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const demoSlides = useMemo(
    () => [
      {
        icon: Music,
        title: "曲情報を取得",
        description: "Spotifyで再生中の曲情報を簡単に取得できます。",
      },
      {
        icon: Search,
        title: "タイアップ情報を検索",
        description: "AIを使って曲のタイアップ情報を自動で検索します。",
      },
      {
        icon: Edit,
        title: "情報を編集・保存",
        description: "タイアップ情報を編集し、保存することができます。",
      },
    ],
    [],
  );

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % demoSlides.length);
  }, [demoSlides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(
      (prev) => (prev - 1 + demoSlides.length) % demoSlides.length,
    );
  }, [demoSlides.length]);

  const { artistName, albumImageUrl, songName } = useMemo(() => {
    const item = playbackState?.item as Track | undefined;
    return {
      artistName: item?.artists[0]?.name ?? "",
      albumImageUrl: item?.album?.images[0]?.url ?? "",
      songName: item?.name ?? "",
    };
  }, [playbackState]);

  const mutateUpsertTieUpInfo = api.music.upsertTieUpInfo.useMutation();
  const {
    append,
    isLoading: chatLoading,
    setMessages,
  } = useChat({
    onFinish: (message) => {
      mutateUpsertTieUpInfo.mutate(
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

  const fetchCurrentlyPlayingTrack = useCallback(() => {
    setPlaybackLoading(true);
    try {
      sdk.player
        .getCurrentlyPlayingTrack()
        .then((playbackState) => {
          setPlaybackState(playbackState);
          setMessages([]);
        })
        .catch(async () => {
          await signOut();
        });
    } finally {
      setPlaybackLoading(false);
    }
  }, [router, setMessages]);

  const handleSendToOpenAI = useCallback(async () => {
    const message = JSON.stringify({ artistName, songName });
    await append({ role: "user", content: message });
  }, [artistName, songName, append]);

  const handleUpdateTieUpInfo = useCallback(
    async (newTieUpInfo: string) => {
      mutateUpsertTieUpInfo.mutate(
        {
          artistName,
          songName,
          tieUpInfo: newTieUpInfo,
        },
        {
          onSuccess: () => {
            void refetch();
          },
        },
      );
    },
    [artistName, songName, mutateUpsertTieUpInfo, refetch],
  );

  const handleSignIn = useCallback(() => signIn("spotify"), []);
  const handleSignOut = useCallback(() => signOut(), []);

  return {
    session,
    demoSlides,
    currentSlide,
    setCurrentSlide,
    nextSlide,
    prevSlide,
    handleSignIn,
    handleSignOut,
    playbackState,
    tieUpInfo,
    tieUpInfoLoading,
    albumImageUrl,
    artistName,
    songName,
    handleSendToOpenAI,
    handleUpdateTieUpInfo,
    chatLoading,
    fetchCurrentlyPlayingTrack,
    playbackLoading,
  };
};
