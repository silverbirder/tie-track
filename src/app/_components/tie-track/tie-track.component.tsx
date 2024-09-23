"use client";

import { useTieTrackPresenter } from "./tie-track.presenter";
import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import {
  LogOut,
  RefreshCw,
  Send,
  Loader2,
  Music,
  Edit,
  Save,
} from "lucide-react";
import type { PlaybackState } from "@spotify/web-api-ts-sdk";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  chatLoading: boolean;
  playbackState: PlaybackState | null;
  playbackLoading: boolean;
  tieUpInfo?: { tieUpInfo: string | null } | null;
  handleSignOut: () => void;
  handleSendToOpenAI: () => void;
  handleUpdateTieUpInfo: (newTieUpInfo: string) => Promise<void>;
  tieUpInfoLoading: boolean;
  fetchCurrentlyPlayingTrack: () => void;
};

export const TieTrackComponent = memo(function TieTrackComponent({
  chatLoading,
  playbackState,
  playbackLoading,
  tieUpInfo,
  handleSignOut,
  handleSendToOpenAI,
  handleUpdateTieUpInfo,
  tieUpInfoLoading,
  fetchCurrentlyPlayingTrack,
}: Props) {
  const { albumImageUrl, songName, artistName, isTrackAvailable } =
    useTieTrackPresenter(playbackState);

  const [isEditing, setIsEditing] = useState(false);
  const [editedTieUpInfo, setEditedTieUpInfo] = useState(
    tieUpInfo?.tieUpInfo ?? "",
  );

  const handleEdit = () => {
    setIsEditing(true);
    setEditedTieUpInfo(tieUpInfo?.tieUpInfo ?? "");
  };

  const handleSave = async () => {
    await handleUpdateTieUpInfo(editedTieUpInfo);
    setIsEditing(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[320px] overflow-hidden">
          <CardHeader>
            <CardTitle className="text-center text-xl font-bold">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Spotify タイアップ検索
              </motion.div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex h-[calc(100%-4rem)] flex-col justify-between">
            <div className="space-y-4">
              <Button
                onClick={fetchCurrentlyPlayingTrack}
                className="w-full transform bg-green-500 text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-green-600"
                disabled={playbackLoading}
              >
                {playbackLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                再生中の曲を取得
              </Button>
              <AnimatePresence>
                {isTrackAvailable && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-4">
                      {albumImageUrl ? (
                        <motion.div
                          initial={{ rotate: -180, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Image
                            src={albumImageUrl}
                            alt={`Album cover of ${songName}`}
                            width={80}
                            height={80}
                            className="rounded-lg shadow-lg"
                          />
                        </motion.div>
                      ) : (
                        <Skeleton className="h-[80px] w-[80px] rounded-lg" />
                      )}
                      <div className="min-w-0 flex-1">
                        <motion.h2
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2, duration: 0.3 }}
                          className="truncate font-semibold"
                        >
                          {songName || "No track playing"}
                        </motion.h2>
                        <motion.p
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3, duration: 0.3 }}
                          className="truncate text-sm text-gray-600"
                        >
                          {artistName || "Unknown artist"}
                        </motion.p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {tieUpInfoLoading ? (
                        <Skeleton className="h-30 w-full" />
                      ) : isEditing ? (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-2"
                        >
                          <Textarea
                            value={editedTieUpInfo}
                            onChange={(e) => setEditedTieUpInfo(e.target.value)}
                            className="h-30 w-full resize-none text-sm"
                            placeholder="タイアップ情報を入力..."
                          />
                          <Button onClick={handleSave} className="w-full">
                            <Save className="mr-2 h-4 w-4" />
                            変更を保存
                          </Button>
                        </motion.div>
                      ) : tieUpInfo?.tieUpInfo ? (
                        <div className="flex items-start justify-between">
                          <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.3 }}
                            className="h-30 pr-2 text-sm"
                          >
                            {tieUpInfo.tieUpInfo}
                          </motion.p>
                          <Button
                            onClick={handleEdit}
                            variant="ghost"
                            size="sm"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, duration: 0.3 }}
                          className="text-sm text-gray-500"
                        >
                          タイアップ情報は見つかりませんでした。
                        </motion.p>
                      )}
                      {!tieUpInfoLoading && !tieUpInfo?.tieUpInfo && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5, duration: 0.3 }}
                        >
                          <Button
                            onClick={handleSendToOpenAI}
                            className="w-full transform transition-all duration-300 ease-in-out hover:scale-105"
                            disabled={chatLoading}
                          >
                            {chatLoading ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="mr-2 h-4 w-4" />
                            )}
                            {chatLoading ? "送信中..." : "OpenAIに問い合わせ"}
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isTrackAvailable && !playbackLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="flex flex-col items-center justify-center space-y-2 py-8"
                >
                  <Music className="h-12 w-12 text-gray-400" />
                  <p className="text-center text-gray-500">
                    再生中の曲がありません。
                  </p>
                </motion.div>
              )}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="pt-4 text-center"
            >
              <Button
                onClick={handleSignOut}
                variant="ghost"
                size="sm"
                className="text-gray-500 transition-colors duration-300 hover:text-gray-700"
              >
                <LogOut className="mr-2 h-4 w-4" />
                ログアウト
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
});
