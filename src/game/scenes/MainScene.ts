import { ImageSource, Scene } from "excalibur";
import HighwayBg from "../actors/Highway";
import { GAME_CONFIG } from "../config";
import Game from "../engine";
import { MusicFile } from "../helpers/loaders";
import {
  createNoteActor,
  getBatchNumber,
  ProcessedNote,
  processNotes,
} from "../helpers/songProcess";

class MainScene extends Scene {
  counter: number = 0;
  sprites: Record<string, ImageSource> = {};
  notes: Record<number, ProcessedNote[]> = {};
  mainTrack: MusicFile | null = null;
  lastBatchNumber: number = -1;

  public onPostUpdate(engine: Game, elapsed: number): void {
    super.onPostUpdate(engine, elapsed);
    const notesDelay =
      (GAME_CONFIG.highwayHeight - GAME_CONFIG.dividerPosition) /
      GAME_CONFIG.notesSpeed /
      1000; // px/s

    const currentTime =
      (this.mainTrack?.getPlaybackPosition() || 0) + notesDelay;

    const batchNumber = getBatchNumber(currentTime);

    if (batchNumber !== this.lastBatchNumber) {
      this.lastBatchNumber = batchNumber;
      const notes = this.notes[batchNumber];
      if (notes) {
        notes.forEach((note) => {
          this.add(createNoteActor(note, currentTime));
        });
      }
    }
  }

  /**
   * Each time the scene is entered (Engine.goToScene)
   */
  public onActivate() {
    const engine = this.engine as Game;

    // process notes to make it easier to use
    this.notes = processNotes(engine.song.events);

    // Add the BG
    this.add(new HighwayBg());

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
    const engine = this.engine as Game;
    // stop music
    [...engine.songTracks, ...engine.drumTracks].forEach((track) => {
      track.stop();
    });
  }
}

export default MainScene;
