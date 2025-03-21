import { useEffect, useRef, useState } from "react";
import { SongData } from "../../types/songs";
import { loadAudioFile, releaseAudioUrl } from "../../helpers/audioLoader";

interface AudioPlayerProps {
  song: SongData;
}

const AudioPlayer = ({ song }: AudioPlayerProps) => {
  const playerRefs = useRef<(HTMLAudioElement | null)[]>([]);
  const [trackUrls, setTrackUrls] = useState<(string | null)[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTracks = async () => {
      setIsLoading(true);
      
      // Cargar las pistas de canción
      const songTrackPromises = song.audioFileData.songTracks.map(track => 
        loadAudioFile(song, track)
      );
      
      // Cargar las pistas de batería
      const drumTrackPromises = song.audioFileData.drumTracks.map(track => 
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
      trackUrls.forEach(url => releaseAudioUrl(url));
    };
  }, [song]);

  const handlePlay = () => {
    playerRefs.current.forEach(player => {
      if (player) {
        player.play();
      }
    });
  };

  const handlePause = () => {
    playerRefs.current.forEach(player => {
      if (player) {
        player.pause();
      }
    });
  };

  const handleStop = () => {
    playerRefs.current.forEach(player => {
      if (player) {
        player.pause();
        player.currentTime = 0;
      }
    });
  };

  return (
    <div className="audio-player">
      <div className="controls">
        <button onClick={handlePlay} disabled={isLoading}>Play</button>
        <button onClick={handlePause} disabled={isLoading}>Pause</button>
        <button onClick={handleStop} disabled={isLoading}>Stop</button>
        {isLoading && <span>Cargando pistas de audio...</span>}
      </div>
      
      {/* Pistas de canción */}
      {song.audioFileData.songTracks.map((track, index) => (
        <audio
          key={`song-${index}`}
          src={trackUrls[index] || ''}
          ref={(el) => {
            playerRefs.current[index] = el;
          }}
          controls
        />
      ))}

      {/* Pistas de batería */}
      {song.audioFileData.drumTracks.map((track, index) => (
        <audio
          key={`drum-${index}`}
          src={trackUrls[song.audioFileData.songTracks.length + index] || ''}
          ref={(el) => {
            playerRefs.current[song.audioFileData.songTracks.length + index] = el;
          }}
          controls
        />
      ))}
    </div>
  );
};

export default AudioPlayer;
