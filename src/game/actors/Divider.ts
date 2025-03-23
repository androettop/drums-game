import { Actor, Sprite, vec, Vector } from "excalibur";
import { Resources } from "../resources";
import { GAME_CONFIG } from "../config";
import { createDividerNoteActor } from "../helpers/songProcess";

class Divider extends Actor {
  instruments: string[];

  constructor(instruments: string[]) {
    super({
      pos: vec(
        GAME_CONFIG.highwayWidth / 2,
        GAME_CONFIG.highwayHeight - GAME_CONFIG.dividerPosition
      ),
      anchor: Vector.Half,
      z: 5,
    });

    this.instruments = instruments;
  }

  public onInitialize() {
    this.graphics.use(Sprite.from(Resources.Divider));

    // put the divider note for each instrument
    const dividerNoteActors = createDividerNoteActor(this.instruments);
    dividerNoteActors.forEach((actor) => {
      this.addChild(actor);
    });
  }
}

export default Divider;
