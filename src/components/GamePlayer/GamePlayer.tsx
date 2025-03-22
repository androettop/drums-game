import { SongData } from "../../types/songs";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import CoverBg from "../CoverBg/CoverBg";
import Highway from "../Highway/Highway";

interface GamePlayerProps {
  song: SongData;
  onExit: () => void;
}

const GamePlayer = ({ song, onExit }: GamePlayerProps) => {
  return (
    <>
      <Highway song={song} />
      <AudioPlayer song={song} onExit={onExit} />
      <CoverBg song={song} />
    </>
  );
};

export default GamePlayer;
