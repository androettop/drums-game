import { useEffect, useRef, useState } from "react";
import { SongData } from "../../types/songs";
import { loadAudioFile, releaseFileUrl } from "../../helpers/filesLoader";
import classNames from "classnames";
import styles from "./AudioPlayer.module.css";

interface AudioPlayerProps {
  song: SongData;
  onTimeUpdate?: (time: number) => void; // Callback to update the time
  onPlayingChange?: (isPlaying: boolean) => void; // Callback to update the playing state
  onExit: () => void; // Callback to exit the game
}

const AudioPlayer = ({
  song,
  onTimeUpdate,
  onPlayingChange,
  onExit,
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
  const [isDrumsMuted, setIsDrumsMuted] = useState(false);

  useEffect(() => {
    const loadTracks = async () => {
      setIsLoading(true);

      // Load song tracks
      const songTrackPromises = song.audioFileData.songTracks.map((track) =>
        loadAudioFile(song, track)
      );

      // Load drum tracks
      const drumTrackPromises = song.audioFileData.drumTracks.map((track) =>
        loadAudioFile(song, track)
      );

      // Wait for all tracks to load
      const songUrls = await Promise.all(songTrackPromises);
      const drumUrls = await Promise.all(drumTrackPromises);

      setTrackUrls([...songUrls, ...drumUrls]);
      setIsLoading(false);
    };

    loadTracks();

    // Clean up URLs when the component unmounts
    return () => {
      trackUrls.forEach((url) => releaseFileUrl(url));
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [song]);

  // Function to update the time using requestAnimationFrame
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
        // Set the first player as the master for time
        if (index === 0) {
          masterPlayerRef.current = player;
        } else if (masterPlayerRef.current) {
          player.currentTime = masterPlayerRef.current.currentTime;
        }
      }
    });
    isPlaying.current = true;
    // Start time update
    animationFrameRef.current = requestAnimationFrame(updateTime);
    // Notify state change
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
    // Stop time update
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    // Notify state change
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
    // Stop time update and reset to zero
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (onTimeUpdate) {
      onTimeUpdate(0);
    }
    // Notify state change
    if (onPlayingChange) {
      onPlayingChange(false);
    }
  };

  // Function to change the song position
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

  // Function to change the volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);

    const songTracksCount = song.audioFileData.songTracks.length;
    playerRefs.current.forEach((player, index) => {
      if (player) {
        // If it's a drum track and muted, keep the volume at 0
        if (index >= songTracksCount && isDrumsMuted) {
          player.volume = 0;
        } else {
          player.volume = newVolume / 100;
        }
      }
    });
  };

  const handleExit = () => {
    onExit();
  };

  // Function to mute/unmute drum tracks
  const toggleDrumsMute = () => {
    const newMuteState = !isDrumsMuted;
    setIsDrumsMuted(newMuteState);
    
    // Update the volume of drum tracks
    const songTracksCount = song.audioFileData.songTracks.length;
    playerRefs.current.forEach((player, index) => {
      if (player && index >= songTracksCount) {
        // It's a drum track
        player.volume = newMuteState ? 0 : volume / 100;
      }
    });
  };

  // Update the duration when the first audio is loaded
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
        <button onClick={toggleDrumsMute} disabled={isLoading} className={isDrumsMuted ? styles.activeToggle : ''}>
          {isDrumsMuted ? 'Unmute' : 'Mute'} Drums
        </button>
        <button onClick={handleExit} disabled={isLoading}>
          Exit
        </button>
        {isLoading && <span>Loading audio tracks...</span>}
      </div>

      {/* Position Slider */}
      <div className={styles.sliderContainer}>
        <label className={styles.label}>
          Position: {Math.floor(currentTime / 60)}:
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
        <label className={styles.label}>Volume: {volume}%</label>
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

      {/* Song Tracks */}
      {song.audioFileData.songTracks.map((_track, index) => (
        <audio
          key={`song-${index}`}
          src={trackUrls[index] || ""}
          ref={(el) => {
            playerRefs.current[index] = el;
          }}
        />
      ))}

      {/* Drum Tracks */}
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
