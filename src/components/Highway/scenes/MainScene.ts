import { ImageSource, Scene, vec } from "excalibur";
import BaseNote from "../actors/BaseNote";
import HiHatNote from "../actors/HiHatNote";
import SnareNote from "../actors/SnareNote";
import { GAME_CONFIG } from "../config";
import HighwayEngine from "../engine";
import { MusicFile } from "../helpers/loaders";

type ProcessedNote = {
  time: number;
  class: string;
  posX: number;
};

class MainScene extends Scene {
  static BATCH_SIZE_SECONDS = 4;
  static NOTES_DELAY_SECONDS = 2;

  static getBatchNumber(time: number | string): number {
    return Math.floor(Number(time) / MainScene.BATCH_SIZE_SECONDS);
  }

  counter: number = 0;
  sprites: Record<string, ImageSource> = {};
  notes: Record<number, ProcessedNote[]> = {};
  instruments: string[] = [];
  mainTrack: MusicFile | null = null;
  lastBatchNumber: number = -1;

  public onPostUpdate(engine: HighwayEngine, elapsed: number): void {
    super.onPostUpdate(engine, elapsed);

    const currentTime =
      (this.mainTrack?.getPlaybackPosition() || 0) +
      MainScene.NOTES_DELAY_SECONDS;

    const batchNumber = MainScene.getBatchNumber(currentTime);

    if (batchNumber !== this.lastBatchNumber) {
      console.group("Processing batch: ", batchNumber);
      this.lastBatchNumber = batchNumber;
      const notes = this.notes[batchNumber];
      if (notes) {
        notes.forEach((note) => {
          // TODO: select based on the instrument. for now random between 100 and 300

          // Should be 0 but fixed based on the remaining time of the note to be played. using the BaseNote.NOTE_SPEED, the time property of the note and the current time of the track.
          console.log("Current time: ", currentTime);
          console.log("Note time: ", note.time);
          console.log("Note speed: ", BaseNote.NOTE_SPEED);
          const posY =
            0 + (currentTime - Number(note.time)) * BaseNote.NOTE_SPEED * 1000;
          console.log("Note posY: ", posY);

          let baseNote: BaseNote | null = null;
          switch (note.class) {
            case "BP_HiHat_C":
              baseNote = new HiHatNote(vec(note.posX, posY));
              break;
            case "BP_Snare_C":
              baseNote = new SnareNote(vec(note.posX, posY));
              break;
            default:
              baseNote = new BaseNote(vec(note.posX, posY));
              break;
          }

          if (baseNote) {
            this.add(baseNote);
          }
        });
      }
      console.groupEnd();
    }
  }

  /**
   * Each time the scene is entered (Engine.goToScene)
   */
  public onActivate() {
    const engine = this.engine as HighwayEngine;

    // load instruments used in the song
    this.instruments = GAME_CONFIG.instrumentsOrder.filter((instrument) =>
      engine.song.events.some((event) => event.name.startsWith(instrument))
    );

    // preprocess the song events to add it in this.notes with the key as the batch number.
    engine.song.events.forEach((event) => {
      const batchNumber = MainScene.getBatchNumber(event.time);
      if (!this.notes[batchNumber]) {
        this.notes[batchNumber] = [];
      }

      const instrumentClass = event.name.substring(
          0,
          event.name.lastIndexOf("_")
        ),
        instrumentIndex = this.instruments.indexOf(instrumentClass);

      const newNote: ProcessedNote = {
        time: Number(event.time),
        class: instrumentClass,
        posX:
          (GAME_CONFIG.width / this.instruments.length) * instrumentIndex +
          GAME_CONFIG.width / (this.instruments.length * 2),
      };

      this.notes[batchNumber].push(newNote);
    });

    // start all tracks
    [...engine.songTracks, ...engine.drumTracks].forEach((track, index) => {
      if (index === 0) {
        this.mainTrack = track;
      }
      track.play();
    });
  }

  /**
   * Each time the scene is exited (Engine.goToScene)
   */
  public onDeactivate() {
    const engine = this.engine as HighwayEngine;
    // stop music
    [...engine.songTracks, ...engine.drumTracks].forEach((track) => {
      track.stop();
    });
  }
}

export default MainScene;
