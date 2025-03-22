import { useState } from "react";
import { SongData } from "../../types/songs";
import Highway from "../Highway/Highway";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import CoverBg from "../CoverBg/CoverBg";

interface GamePlayerProps {
  song: SongData;
  onExit: () => void;
}

const GamePlayer = ({ song, onExit }: GamePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);

  // Manejador para actualizar el tiempo actual
  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  // Manejador para actualizar el estado de reproducción
  const handlePlayingChange = (playing: boolean) => {
    setIsPlaying(playing);
  };

  return (
    <>
      <Highway song={song} time={currentTime} isPlaying={isPlaying} />
      <AudioPlayer
        song={song}
        onTimeUpdate={handleTimeUpdate}
        onPlayingChange={handlePlayingChange}
        onExit={onExit}
      />
      <CoverBg song={song} />
    </>
  );
};

export default GamePlayer;
