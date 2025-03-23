import { vec } from "excalibur";
import BaseNote from "../actors/Notes/BaseNote";
import Crash15Note from "../actors/Notes/Crash15Note";
import Crash17Note from "../actors/Notes/Crash17Note";
import FloorTomNote from "../actors/Notes/FloorTomNote";
import HiHatNote from "../actors/Notes/HiHatNote";
import KickNote from "../actors/Notes/KickNote";
import Ride17Note from "../actors/Notes/Ride17Note";
import SnareNote from "../actors/Notes/SnareNote";
import Tom1Note from "../actors/Notes/Tom1Note";
import Tom2Note from "../actors/Notes/Tom2Note";
import { GAME_CONFIG } from "../config";
import { EventData } from "../../types/songs";

export type ProcessedNote = {
  time: number;
  class: string;
  posX: number;
};

export const getBatchNumber = (time: number | string): number => {
  return Math.floor(Number(time) / GAME_CONFIG.notesBatchSize);
};

export const processNotes = (
  events: EventData[]
): Record<number, ProcessedNote[]> => {
  const notes: Record<number, ProcessedNote[]> = {};

  // load instruments used in the song
  const instruments = GAME_CONFIG.instrumentsOrder.filter((instrument) =>
    events.some((event) => event.name.startsWith(instrument))
  );

  // preprocess the song events to add it in notes with the key as the batch number.
  events.forEach((event) => {
    const batchNumber = getBatchNumber(event.time);
    if (!notes[batchNumber]) {
      notes[batchNumber] = [];
    }

    const instrumentClass = event.name.substring(
      0,
      event.name.lastIndexOf("_")
    );

    let posX = 0;

    if (instrumentClass === "BP_Kick_C") {
      posX = GAME_CONFIG.highwayWidth / 2;
    } else {
      const instrumentIndex = instruments.indexOf(instrumentClass);
      posX =
        (GAME_CONFIG.highwayWidth / instruments.length) * instrumentIndex +
        GAME_CONFIG.highwayWidth / (instruments.length * 2);
    }

    const newNote: ProcessedNote = {
      time: Number(event.time),
      class: instrumentClass,
      posX,
    };

    notes[batchNumber].push(newNote);
  });

  return notes;
};

export const createNoteActor = (note: ProcessedNote, currentTime: number) => {
  const posY = (currentTime - note.time) * GAME_CONFIG.notesSpeed * 1000;

  let noteActor: BaseNote | null = null;

  switch (note.class) {
    case "BP_HiHat_C":
      noteActor = new HiHatNote(vec(note.posX, posY));
      break;
    case "BP_Crash15_C":
      noteActor = new Crash15Note(vec(note.posX, posY));
      break;
    case "BP_Snare_C":
      noteActor = new SnareNote(vec(note.posX, posY));
      break;
    case "BP_Tom1_C":
      noteActor = new Tom1Note(vec(note.posX, posY));
      break;
    case "BP_Tom2_C":
      noteActor = new Tom2Note(vec(note.posX, posY));
      break;
    case "BP_FloorTom_C":
      noteActor = new FloorTomNote(vec(note.posX, posY));
      break;
    case "BP_Crash17_C":
      noteActor = new Crash17Note(vec(note.posX, posY));
      break;
    case "BP_Ride17_C":
      noteActor = new Ride17Note(vec(note.posX, posY));
      break;
    case "BP_Kick_C":
      noteActor = new KickNote(vec(note.posX, posY));
      break;
    default:
      console.log("Unknown note class: ", note.class);
      noteActor = new BaseNote(vec(note.posX, posY));
      break;
  }

  return noteActor;
};
