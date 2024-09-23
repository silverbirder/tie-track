"use client";

import { useTieTrackFacade } from "./tie-track.facade";
import { TieTrackComponent } from "./tie-track.component";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { memo } from "react";

export const TieTrackContainer = () => {
  const {
    session,
    demoSlides,
    currentSlide,
    nextSlide,
    prevSlide,
    handleSignIn,
    playbackState,
    tieUpInfo,
    handleSignOut,
    handleSendToOpenAI,
    handleUpdateTieUpInfo,
    chatLoading,
    tieUpInfoLoading,
    fetchCurrentlyPlayingTrack,
    playbackLoading,
    setCurrentSlide,
  } = useTieTrackFacade();

  if (!session || session.status !== "authenticated") {
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
                Spotify タイアップ検索
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative h-[320px] overflow-hidden rounded-lg bg-gray-100">
                <AnimatePresence mode="wait">
                  {demoSlides.map((slide, index) => (
                    <DemoSlide
                      key={index}
                      icon={slide.icon}
                      title={slide.title}
                      description={slide.description}
                      isActive={index === currentSlide}
                    />
                  ))}
                </AnimatePresence>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-600"
                  onClick={prevSlide}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600"
                  onClick={nextSlide}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
              <div className="flex justify-center space-x-2">
                {demoSlides.map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      index === currentSlide ? "bg-blue-500" : "bg-gray-300"
                    }`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
              <Button
                onClick={handleSignIn}
                className="w-full bg-green-500 text-white hover:bg-green-600"
              >
                Spotifyでログイン
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <TieTrackComponent
      chatLoading={chatLoading}
      playbackState={playbackState}
      playbackLoading={playbackLoading}
      tieUpInfo={tieUpInfo}
      handleSignOut={handleSignOut}
      handleSendToOpenAI={handleSendToOpenAI}
      handleUpdateTieUpInfo={handleUpdateTieUpInfo}
      tieUpInfoLoading={tieUpInfoLoading}
      fetchCurrentlyPlayingTrack={fetchCurrentlyPlayingTrack}
    />
  );
};

type DemoSlideProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  isActive: boolean;
};

const DemoSlide = memo(
  ({ icon: Icon, title, description, isActive }: DemoSlideProps) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`absolute inset-0 flex flex-col items-center justify-center p-4 ${
        isActive ? "" : "pointer-events-none"
      }`}
    >
      <div className="mb-4 rounded-full bg-blue-100 p-4">
        <Icon className="h-12 w-12 text-blue-500" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-center text-sm text-gray-600">{description}</p>
    </motion.div>
  ),
);

DemoSlide.displayName = "DemoSlide";
