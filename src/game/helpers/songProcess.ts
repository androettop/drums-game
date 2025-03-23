import { Actor, ImageSource, vec } from "excalibur";
import { EventData } from "../../types/songs";
import BaseNote from "../actors/Notes/BaseNote";
import { GAME_CONFIG } from "../config";
import { Resources } from "../resources";
import DividerNote from "../actors/Notes/DividerNote";

export type ProcessedNote = {
  time: number;
  class: string;
  posX: number;
};

export const getBatchNumber = (time: number | string): number => {
  return Math.floor(Number(time) / GAME_CONFIG.notesBatchSize);
};

export const processNotesAndInstruments = (events: EventData[]) => {
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

  return { notes, instruments };
};

export const createNoteActor = (note: ProcessedNote, currentTime: number) => {
  const posY = (currentTime - note.time) * GAME_CONFIG.notesSpeed * 1000;

  let noteActor: BaseNote | null = null;

  switch (note.class) {
    case "BP_HiHat_C":
      noteActor = new BaseNote(vec(note.posX, posY), Resources.NoteCircleCyan);
      break;
    case "BP_Crash15_C":
      noteActor = new BaseNote(
        vec(note.posX, posY),
        Resources.NoteCirclePurple
      );
      break;
    case "BP_Snare_C":
      noteActor = new BaseNote(vec(note.posX, posY), Resources.NoteRectRed);
      break;
    case "BP_Tom1_C":
      noteActor = new BaseNote(vec(note.posX, posY), Resources.NoteRectCyan);
      break;
    case "BP_Tom2_C":
      noteActor = new BaseNote(vec(note.posX, posY), Resources.NoteRectGreen);
      break;
    case "BP_FloorTom_C":
      noteActor = new BaseNote(vec(note.posX, posY), Resources.NoteRectPurple);
      break;
    case "BP_Crash17_C":
      noteActor = new BaseNote(
        vec(note.posX, posY),
        Resources.NoteCircleOrange
      );
      break;
    case "BP_Ride17_C":
      noteActor = new BaseNote(
        vec(note.posX, posY),
        Resources.NoteCircleYellow
      );
      break;
    case "BP_Kick_C":
      noteActor = new BaseNote(vec(note.posX, posY), Resources.NoteKick, 8);
      break;
    default:
      console.log("Unknown note class: ", note.class);
      noteActor = new BaseNote(vec(note.posX, posY), Resources.NoteRectBase);
      break;
  }

  return noteActor;
};

export const createDividerNoteActor = (instruments: string[]) => {
  const dividerActors: Actor[] = [];
  instruments.forEach((instrument, index) => {
    if (instrument === "BP_Kick_C") {
      return;
    }

    const posX =
      (GAME_CONFIG.highwayWidth / instruments.length) * index +
      GAME_CONFIG.highwayWidth / (instruments.length * 2) -
      GAME_CONFIG.highwayWidth / 2;

    const pos = vec(posX, -4);
    let dividerImage: ImageSource | null = null;

    switch (instrument) {
      case "BP_HiHat_C":
        dividerImage = Resources.DividerNoteCircleCyan;
        break;
      case "BP_Crash15_C":
        dividerImage = Resources.DividerNoteCirclePurple;
        break;
      case "BP_Snare_C":
        dividerImage = Resources.DividerNoteRectRed;
        break;
      case "BP_Tom1_C":
        dividerImage = Resources.DividerNoteRectCyan;
        break;
      case "BP_Tom2_C":
        dividerImage = Resources.DividerNoteRectGreen;
        break;
      case "BP_FloorTom_C":
        dividerImage = Resources.DividerNoteRectPurple;
        break;
      case "BP_Crash17_C":
        dividerImage = Resources.DividerNoteCircleOrange;
        break;
      case "BP_Ride17_C":
        dividerImage = Resources.DividerNoteCircleYellow;
        break;
      default:
        dividerImage = Resources.DividerNoteRectBase;
        console.log("Unknown instrument: ", instrument);
        break;
    }
    dividerActors.push(new DividerNote(pos, dividerImage));
  });

  return dividerActors;
};
