import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { SongData } from "../../types/songs";
import HighwayEngine from "./engine";

interface HighwayProps {
  song: SongData;
}

const Highway = ({ song }: HighwayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<HighwayEngine | null>(null);
  const [canvasId, setCanvasId] = useState<string>(uuid());

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
        setCanvasId(uuid());
      }
    };
  }, [song]);

  return <canvas id={canvasId} ref={canvasRef} />;
};

export default Highway;
