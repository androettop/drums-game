import { useEffect, useRef } from "react";
import { SongData } from "../../types/songs";
import HighwayEngine from "./engine";
import styles from "./Highway.module.css";

interface HighwayProps {
  song: SongData;
}

const Highway = ({ song }: HighwayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<HighwayEngine | null>(null);

  useEffect(() => {
    if (canvasRef.current && !engineRef.current) {
      engineRef.current = new HighwayEngine(canvasRef.current, song);
      engineRef.current.initialize();
    }
    const engine = engineRef.current;

    return () => {
      if (engine) {
        engine.stop();
        engineRef.current = null;
      }
    };
  }, [song]);

  return (
    <div className={styles.highway}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Highway;
