import { SongData } from "../../types/songs";

interface CoverBgProps {
  song: SongData;
}

const CoverBg = ({ song }: CoverBgProps) => {
  return (
    <div className="cover-bg">
      <img src={""} alt={song.recordingMetadata.title} />
    </div>
  );
};

export default CoverBg;
