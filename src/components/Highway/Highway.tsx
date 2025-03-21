import { SongData } from "../../types/songs";

interface HighwayProps {
    song: SongData,
}

const Highway = ({song}: HighwayProps) => {
    return <>{song.recordingMetadata.title}</>
};

export default Highway;