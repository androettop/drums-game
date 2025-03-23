import { Actor, Sprite, Vector } from "excalibur";
import { GAME_CONFIG } from "../config";
import Game from "../engine";
import { MusicFile } from "../helpers/loaders";
import {
  createNoteActor,
  getBatchNumber,
  ProcessedNote,
} from "../helpers/songProcess";
import { Resources } from "../resources";
import Divider from "./Divider";

class Highway extends Actor {
  mainTrack: MusicFile;
  notes: Record<number, ProcessedNote[]> = {};
  instruments: string[] = [];
  lastBatchNumber: number = -1;

  constructor(
    notes: Record<number, ProcessedNote[]>,
    instruments: string[],
    mainTrack: MusicFile
  ) {
    super({
      pos: Vector.Zero,
      width: GAME_CONFIG.highwayWidth,
      height: GAME_CONFIG.highwayHeight,
      anchor: Vector.Zero,
      z: 0,
    });
    this.notes = notes;
    this.instruments = instruments;
    this.mainTrack = mainTrack;
  }

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
          this.addChild(createNoteActor(note));
        });
      }
    }
  }

  public onInitialize() {
    this.graphics.use(Sprite.from(Resources.HighwayBg));

    // Create the divider
    const divider = new Divider(this.instruments);
    this.addChild(divider);
  }
}

export default Highway;
