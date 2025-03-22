import classNames from "classnames";
import { useEffect, useState } from "react";
import { EventData, SongData } from "../../types/songs";
import useStaticHandler from "../hooks/useStaticHandler";
import styles from "./Highway.module.css";

// Main configuration
const CONFIG = {
  DIVIDER_POSITION: 10, // percentage, keep in sync with CSS
  ANIM_DURATION: 2, // seconds
  LOAD_BATCH_DURATION: 30, // seconds
};

// Instrument colors
const INSTRUMENT_COLORS = {
  BP_HiHat_C: "#33FFF5", // cyan
  BP_Crash15_C: "#FF33F5", // pink
  BP_Snare_C: "#FF3333", // red
  BP_Tom1_C: "#33FFAA", // turquoise
  BP_Tom2_C: "#118811", // dark green
  BP_FloorTom_C: "#552288", // violet
  BP_Crash17_C: "#FF5733", // orange
  BP_Ride17_C: "#F5FF33", // yellow
  BP_Kick_C: "rgba(64, 84, 182, 0.6)", // blue
  BP_Ride20_C: "#FFAA33", // light orange
};

const CIRCLE_INSTRUMENTS = [
  "BP_HiHat_C",
  "BP_Crash17_C",
  "BP_Ride17_C",
  "BP_Crash15_C",
  "BP_Ride20_C",
];

// Create an array of instrument classes in the order they appear in INSTRUMENT_COLORS
const ORDERED_INSTRUMENTS = [
  "BP_HiHat_C",
  "BP_Crash15_C",
  "BP_Snare_C",
  "BP_Tom1_C",
  "BP_Tom2_C",
  "BP_FloorTom_C",
  "BP_Crash17_C",
  "BP_Ride17_C",
  "BP_Ride20_C",
];
interface HighwayProps {
  song: SongData;
  isPlaying: boolean;
  time: number;
}

const Highway = ({ song, isPlaying, time = 0 }: HighwayProps) => {
  const instrumentsInSong = ORDERED_INSTRUMENTS.filter(
    (instrument) =>
      song.events.some((event) => event.name.startsWith(instrument)) &&
      instrument !== "BP_Kick_C"
  );

  const [notes, setNotes] = useState<Record<string, EventData[]>>(() => {
    const initialNotes: Record<string, EventData[]> = {};
    instrumentsInSong.forEach((instrument) => {
      initialNotes[instrument] = [];
    });
    initialNotes["BP_Kick_C"] = [];
    return initialNotes;
  });

  const getNotes = useStaticHandler((force: boolean = false) => {
    if (isPlaying || force) {
      // add the anim delay to the current time
      const currentTime = time + CONFIG.ANIM_DURATION * 0.9; // 0.9 to reach the divider

      const notesBatch = song.events.filter(
        (note) =>
          Number(note.time) >= currentTime - CONFIG.LOAD_BATCH_DURATION &&
          Number(note.time) <= currentTime + CONFIG.LOAD_BATCH_DURATION
      );
      const notesMap: Record<string, EventData[]> = {};

      instrumentsInSong.forEach((instrument) => {
        notesMap[instrument] = [];
      });
      notesMap["BP_Kick_C"] = [];

      notesBatch.forEach((event) => {
        const instrument = event.name.substring(0, event.name.lastIndexOf("_"));
        notesMap[instrument].push({
          ...event,
          time: `${Number(event.time) - currentTime}`,
        });
      });
      setNotes(notesMap);
    }
  });

  useEffect(() => {
    getNotes(true);
    const interval = setInterval(() => {
      // load the notes 3 seconds before the current time and 3 seconds after
      getNotes();
    }, (CONFIG.LOAD_BATCH_DURATION / 2) * 1000);

    return () => clearInterval(interval);
  }, [song.events, getNotes, isPlaying]);

  return (
    <div className={styles.highway}>
      <div
        className={styles.divider}
        style={{ bottom: `${CONFIG.DIVIDER_POSITION}%` }}
      ></div>

      {/* Kick notes */}

      <div className={styles.kickNotesContainer}>
        {notes["BP_Kick_C"].map((note) => (
          <div
            key={note.time}
            className={classNames(styles.note, styles.kick)}
            style={{
              backgroundColor: INSTRUMENT_COLORS["BP_Kick_C"],
              animationDelay: `${note.time}s`,
              animationPlayState: isPlaying ? "running" : "paused",
              animationDuration: `${CONFIG.ANIM_DURATION}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Notes (no kick) */}

      {instrumentsInSong.map((instrument) => (
        <div className={styles.instNotesContainer} key={instrument}>
          {notes[instrument].map((note) => (
            <div
              key={note.time}
              className={classNames(styles.note, {
                [styles.circle]: CIRCLE_INSTRUMENTS.includes(instrument),
              })}
              style={{
                backgroundColor:
                  INSTRUMENT_COLORS[
                    instrument as keyof typeof INSTRUMENT_COLORS
                  ],
                animationDelay: `${note.time}s`,
                animationPlayState: isPlaying ? "running" : "paused",
                animationDuration: `${CONFIG.ANIM_DURATION}s`,
              }}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Highway;
