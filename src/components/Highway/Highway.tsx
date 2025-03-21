import { useMemo } from "react";
import { EventData, SongData } from "../../types/songs";
import styles from "./Highway.module.css";
import classNames from "classnames";

// Configuración principal
const CONFIG = {
  HIGHWAY_HEIGHT: 900,
  DIVIDER_POSITION: 100,
  NOTES_SPEED: 2, // seconds to reach divider
  NOTES_DELAY: 30 / 1000, // 30ms in seconds
};

// Colores de los instrumentos
const INSTRUMENT_COLORS = {
  BP_HiHat_C: "#33FFF5", // cyan
  BP_Snare_C: "#FF3333", // rojo
  BP_Tom1_C: "#33FFAA", // turquesa
  BP_Tom2_C: "#118811", // verde oscuro
  BP_FloorTom_C: "#552288", // violeta
  BP_Ride17_C: "#F5FF33", // amarillo
  BP_Crash17_C: "#FF5733", // naranja
  BP_Kick_C: "#3357FF", // azul
  BP_Crash15_C: "#FF33F5", // rosa
  BP_Ride20_C: "#FFAA33", // naranja claro
};

// Crear un array de las clases de instrumento en el orden que aparecen en INSTRUMENT_COLORS
const ORDERED_INSTRUMENTS = [
  "BP_HiHat_C",
  "BP_Snare_C",
  "BP_Tom1_C",
  "BP_Tom2_C",
  "BP_FloorTom_C",
  "BP_Ride17_C",
  "BP_Crash17_C",
  "BP_Crash15_C",
  "BP_Ride20_C",
];
interface HighwayProps {
  song: SongData;
  isPlaying: boolean;
}

const Highway = ({ song, isPlaying }: HighwayProps) => {
  const notes = useMemo(() => {
    // instrument, event
    const notesMap: Record<string, EventData[]> = {};

    ORDERED_INSTRUMENTS.forEach((instrument) => {
      notesMap[instrument] = [];
    });
    notesMap["BP_Kick_C"] = [];   

    song.events.forEach((event) => {
      const instrument = event.name.substring(0, event.name.lastIndexOf("_"));
      notesMap[instrument].push(event);
    });

    return notesMap;
  }, [song.events]);

  return (
    <div>
      <div className={styles.highway} style={{ height: CONFIG.HIGHWAY_HEIGHT }}>
        <div
          className={styles.divider}
          style={{ bottom: CONFIG.DIVIDER_POSITION }}
        ></div>

        {/* Notes (no kick) */}

        {ORDERED_INSTRUMENTS.map((instrument) => (
          <div className={styles.instNotesContainer} key={instrument}>
            {notes[instrument].map((note) => (
              <div
                key={note.time}
                className={classNames(styles.note, {
                  kick: instrument === "BP_Kick_C",
                  hiHat: instrument === "BP_HiHat_C",
                })}
                style={{
                  backgroundColor:
                    INSTRUMENT_COLORS[
                      instrument as keyof typeof INSTRUMENT_COLORS
                    ],
                }}
              ></div>
            ))}
          </div>
        ))}

        {/* Kick notes */}

        <div className={styles.kickNotesContainer}>
          {notes["BP_Kick_C"].map((note) => (
            <div
              key={note.time}
              className={classNames(styles.note, styles.kick)}
              style={{
                backgroundColor: INSTRUMENT_COLORS["BP_Kick_C"],
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Highway;
