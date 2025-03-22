import { useEffect, useRef, useState } from "react";
import { SongData } from "../../types/songs";
import { loadAudioFile, releaseFileUrl } from "../../helpers/filesLoader";
import classNames from "classnames";
import styles from "./AudioPlayer.module.css";

interface AudioPlayerProps {
  song: SongData;
  onTimeUpdate?: (time: number) => void; // Callback para actualizar el tiempo
  onPlayingChange?: (isPlaying: boolean) => void; // Callback para actualizar el estado de reproducción
}

const AudioPlayer = ({
  song,
  onTimeUpdate,
  onPlayingChange,
}: AudioPlayerProps) => {
  const playerRefs = useRef<(HTMLAudioElement | null)[]>([]);
  const [trackUrls, setTrackUrls] = useState<(string | null)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isPlaying = useRef<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);
  const masterPlayerRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);

  useEffect(() => {
    const loadTracks = async () => {
      setIsLoading(true);

      // Cargar las pistas de canción
      const songTrackPromises = song.audioFileData.songTracks.map((track) =>
        loadAudioFile(song, track)
      );

      // Cargar las pistas de batería
      const drumTrackPromises = song.audioFileData.drumTracks.map((track) =>
        loadAudioFile(song, track)
      );

      // Esperar a que todas las pistas se carguen
      const songUrls = await Promise.all(songTrackPromises);
      const drumUrls = await Promise.all(drumTrackPromises);

      setTrackUrls([...songUrls, ...drumUrls]);
      setIsLoading(false);
    };

    loadTracks();

    // Limpiar las URLs cuando el componente se desmonte
    return () => {
      trackUrls.forEach((url) => releaseFileUrl(url));
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [song]);

  // Función para actualizar el tiempo utilizando requestAnimationFrame
  const updateTime = () => {
    if (masterPlayerRef.current && onTimeUpdate) {
      const time = masterPlayerRef.current.currentTime;
      onTimeUpdate(time);
      setCurrentTime(time);
    }

    if (isPlaying.current) {
      animationFrameRef.current = requestAnimationFrame(updateTime);
    }
  };

  const handlePlay = () => {
    playerRefs.current.forEach((player, index) => {
      if (player) {
        player.play();
        // Guardar el primer reproductor como maestro para el tiempo
        if (index === 0) {
          masterPlayerRef.current = player;
        } else if (masterPlayerRef.current) {
          player.currentTime = masterPlayerRef.current.currentTime;
        }
      }
    });
    isPlaying.current = true;
    // Iniciar la actualización del tiempo
    animationFrameRef.current = requestAnimationFrame(updateTime);
    // Notificar cambio de estado
    if (onPlayingChange) {
      onPlayingChange(true);
    }
  };

  const handlePause = () => {
    playerRefs.current.forEach((player) => {
      if (player) {
        player.pause();
      }
    });
    isPlaying.current = false;
    // Detener la actualización del tiempo
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    // Notificar cambio de estado
    if (onPlayingChange) {
      onPlayingChange(false);
    }
  };

  const handleStop = () => {
    playerRefs.current.forEach((player) => {
      if (player) {
        player.pause();
        player.currentTime = 0;
      }
    });
    isPlaying.current = false;
    // Detener la actualización del tiempo y reiniciar a cero
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (onTimeUpdate) {
      onTimeUpdate(0);
    }
    // Notificar cambio de estado
    if (onPlayingChange) {
      onPlayingChange(false);
    }
  };

  // Función para cambiar la posición de la canción
  const handlePositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);

    playerRefs.current.forEach((player) => {
      if (player) {
        player.currentTime = newTime;
      }
    });

    if (onTimeUpdate) {
      onTimeUpdate(newTime);
    }
  };

  // Función para cambiar el volumen
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);

    playerRefs.current.forEach((player) => {
      if (player) {
        player.volume = newVolume / 100;
      }
    });
  };

  // Actualizar la duración cuando se cargue el primer audio
  useEffect(() => {
    const handleLoadedMetadata = () => {
      if (masterPlayerRef.current) {
        setDuration(masterPlayerRef.current.duration);
      }
    };

    const firstPlayer = playerRefs.current[0];
    if (firstPlayer) {
      firstPlayer.addEventListener("loadedmetadata", handleLoadedMetadata);
      masterPlayerRef.current = firstPlayer;

      return () => {
        firstPlayer.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, [trackUrls]);

  return (
    <div className={styles.audioPlayer}>
      <div className={styles.controls}>
        <button onClick={handlePlay} disabled={isLoading}>
          Play
        </button>
        <button onClick={handlePause} disabled={isLoading}>
          Pause
        </button>
        <button onClick={handleStop} disabled={isLoading}>
          Stop
        </button>
        {isLoading && <span>Cargando pistas de audio...</span>}
      </div>

      {/* Position Slider */}
      <div className={styles.sliderContainer}>
        <label className={styles.label}>
          Posición: {Math.floor(currentTime / 60)}:
          {Math.floor(currentTime % 60)
            .toString()
            .padStart(2, "0")}
        </label>
        <input
          type="range"
          min="0"
          max={duration || 100}
          step="0.1"
          value={currentTime}
          onChange={handlePositionChange}
          className={classNames(styles.slider, styles.positionSlider)}
          style={
            {
              "--progress": `${(currentTime / (duration || 100)) * 100}%`,
            } as React.CSSProperties
          }
          disabled={isLoading || duration === 0}
        />
      </div>

      {/* Volume Slider */}
      <div className={styles.sliderContainer}>
        <label className={styles.label}>Volumen: {volume}%</label>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={volume}
          onChange={handleVolumeChange}
          className={classNames(styles.slider, styles.volumeSlider)}
          style={{ "--volume": `${volume}%` } as React.CSSProperties}
          disabled={isLoading}
        />
      </div>

      {/* Pistas de canción */}
      {song.audioFileData.songTracks.map((_track, index) => (
        <audio
          key={`song-${index}`}
          src={trackUrls[index] || ""}
          ref={(el) => {
            playerRefs.current[index] = el;
          }}
        />
      ))}

      {/* Pistas de batería */}
      {song.audioFileData.drumTracks.map((_track, index) => (
        <audio
          key={`drum-${index}`}
          src={trackUrls[song.audioFileData.songTracks.length + index] || ""}
          ref={(el) => {
            playerRefs.current[song.audioFileData.songTracks.length + index] =
              el;
          }}
        />
      ))}
    </div>
  );
};

export default AudioPlayer;
