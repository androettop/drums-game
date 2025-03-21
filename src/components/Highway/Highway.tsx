import classNames from "classnames";
import { useEffect, useState } from "react";
import { EventData, SongData } from "../../types/songs";
import useStaticHandler from "../hooks/useStaticHandler";
import styles from "./Highway.module.css";

// Configuración principal
const CONFIG = {
  HIGHWAY_HEIGHT: 900,
  DIVIDER_POSITION: 10, // percentage, keep in sync with CSS
  BATCH_LOAD_FREQUENCY: 3, // seconds
  ANIM_DURATION: 3, // seconds
};

// Colores de los instrumentos
const INSTRUMENT_COLORS = {
  BP_HiHat_C: "#33FFF5", // cyan
  BP_Snare_C: "#FF3333", // rojo
  BP_Tom1_C: "#33FFAA", // turquesa
  BP_Tom2_C: "#118811", // verde oscuro
  BP_FloorTom_C: "#552288", // violeta
  BP_Crash17_C: "#FF5733", // naranja
  BP_Ride17_C: "#F5FF33", // amarillo
  BP_Kick_C: "rgba(64, 84, 182, 0.6)", // azul
  BP_Crash15_C: "#FF33F5", // rosa
  BP_Ride20_C: "#FFAA33", // naranja claro
};

const CIRCLE_INSTRUMENTS = [
  "BP_HiHat_C",
  "BP_Crash17_C",
  "BP_Ride17_C",
  "BP_Crash15_C",
  "BP_Ride20_C",
];

// Crear un array de las clases de instrumento en el orden que aparecen en INSTRUMENT_COLORS
const ORDERED_INSTRUMENTS = [
  "BP_HiHat_C",
  "BP_Snare_C",
  "BP_Tom1_C",
  "BP_Tom2_C",
  "BP_FloorTom_C",
  "BP_Crash17_C",
  "BP_Ride17_C",
  "BP_Crash15_C",
  "BP_Ride20_C",
];
interface HighwayProps {
  song: SongData;
  isPlaying: boolean;
  time: number;
}

const Highway = ({ song, isPlaying, time = 0 }: HighwayProps) => {
  const [notes, setNotes] = useState<Record<string, EventData[]>>(() => {
    const initialNotes: Record<string, EventData[]> = {};
    ORDERED_INSTRUMENTS.forEach((instrument) => {
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
          Number(note.time) >= currentTime - CONFIG.ANIM_DURATION &&
          Number(note.time) <= currentTime + CONFIG.ANIM_DURATION
      );
      const notesMap: Record<string, EventData[]> = {};

      ORDERED_INSTRUMENTS.forEach((instrument) => {
        notesMap[instrument] = [];
      });
      notesMap["BP_Kick_C"] = [];

      notesBatch.forEach((event) => {
        const instrument = event.name.substring(0, event.name.lastIndexOf("_"));
        notesMap[instrument].push({
          ...event,
          time: `${
            Number(event.time) -
            currentTime
          }`,
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
    }, CONFIG.BATCH_LOAD_FREQUENCY * 1000);

    return () => clearInterval(interval);
  }, [song.events, getNotes, isPlaying]);

  return (
    <div>
      <div className={styles.highway} style={{ height: CONFIG.HIGHWAY_HEIGHT }}>
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

        {ORDERED_INSTRUMENTS.map((instrument) => (
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
    </div>
  );
};

export default Highway;
