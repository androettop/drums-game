import { Engine, ImageSource, Scene, vec } from "excalibur";
import { EventData } from "../../../types/songs";
import BaseNote from "../actors/BaseNote";
import HighwayEngine from "../engine";
import { MusicFile } from "../helpers/loaders";

class MainScene extends Scene {
  static BATCH_SIZE_SECONDS = 4;
  static NOTES_DELAY_SECONDS = 2;

  static getBatchNumber(time: number | string): number {
    return Math.floor(Number(time) / MainScene.BATCH_SIZE_SECONDS);
  }

  counter: number = 0;
  sprites: Record<string, ImageSource> = {};
  notes: Record<number, EventData[]> = {};
  mainTrack: MusicFile | null = null;
  lastBatchNumber: number = -1;

  public onPostUpdate(engine: Engine, elapsed: number): void {
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
          const posX = Math.floor(Math.random() * 200) + 100;

          // Should be 0 but fixed based on the remaining time of the note to be played. using the BaseNote.NOTE_SPEED, the time property of the note and the current time of the track.
          console.log("Current time: ", currentTime);
          console.log("Note time: ", note.time);
          console.log("Note speed: ", BaseNote.NOTE_SPEED);
          const posY =
            0 + (currentTime - Number(note.time)) * BaseNote.NOTE_SPEED * 1000;
          console.log("Note posY: ", posY);

          const baseNote = new BaseNote(vec(posX, posY), "Circle", "Yellow");
          this.add(baseNote);
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

    // preprocess the song events to add it in this.notes with the key as the batch number.

    engine.song.events.forEach((event) => {
      const batchNumber = MainScene.getBatchNumber(event.time);
      if (!this.notes[batchNumber]) {
        this.notes[batchNumber] = [];
      }
      this.notes[batchNumber].push(event);
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
    // stop music
  }
}

export default MainScene;
