import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  src: string;
  isActive: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.play().catch(() => {
        // Autoplay blocked, user needs to interact
      });
      setIsPlaying(true);
    } else {
      video.pause();
      video.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div
      className="relative w-full h-full bg-background"
      onClick={togglePlay}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        loop
        muted={isMuted}
        playsInline
        preload="auto"
      />

      {/* Play/Pause Overlay */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-opacity duration-200",
          !isPlaying ? "opacity-100" : showControls ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="h-16 w-16 rounded-full bg-background/30 backdrop-blur-sm flex items-center justify-center">
          {isPlaying ? (
            <Pause className="h-8 w-8 text-foreground" />
          ) : (
            <Play className="h-8 w-8 text-foreground ml-1" />
          )}
        </div>
      </div>

      {/* Volume Control */}
      <button
        onClick={toggleMute}
        className={cn(
          "absolute top-4 right-4 p-3 rounded-full bg-background/30 backdrop-blur-sm transition-opacity duration-200",
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        )}
      >
        {isMuted ? (
          <VolumeX className="h-5 w-5 text-foreground" />
        ) : (
          <Volume2 className="h-5 w-5 text-foreground" />
        )}
      </button>
    </div>
  );
};

export default VideoPlayer;
