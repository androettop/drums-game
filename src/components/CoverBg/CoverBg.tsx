import { useEffect, useRef, useState } from "react";
import { loadFile, releaseFileUrl } from "../../helpers/filesLoader";
import { SongData } from "../../types/songs";
import useStaticHandler from "../hooks/useStaticHandler";
import styles from "./CoverBg.module.css";
interface CoverBgProps {
  song: SongData;
}

const CoverBg = ({ song }: CoverBgProps) => {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const coverUrlRef = useRef<string | null>(null);

  const loadCover = useStaticHandler(async () => {
    const filename = song.recordingMetadata.coverImagePath;
    const url = await loadFile(song, filename);
    if (url) {
      setCoverUrl(url);
    }
  });

  useEffect(() => {
    loadCover();
    const coverUrlValue = coverUrlRef.current;
    // Clean up URL when component unmounts
    return () => {
      if (coverUrlValue) {
        releaseFileUrl(coverUrlValue);
      }
    };
  }, [loadCover, song]);

  return (
    <div className={styles.cover} style={coverUrl ? { backgroundImage: `url(${coverUrl})` } : {}}>

    </div>
  );
};

export default CoverBg;