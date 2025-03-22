import { Actor, Engine, Sprite, vec, Vector } from "excalibur";
import { GAME_CONFIG } from "../config";
import BaseNote from "./BaseNote";
import { Resources } from "./resources";

class HighwayBg extends Actor {
  constructor() {
    super({
      pos: vec(0, -GAME_CONFIG.height),
      width: GAME_CONFIG.width,
      height: GAME_CONFIG.height * 2,
      anchor: Vector.Zero,
      z: 0,
    });
  }

  public update(engine: Engine, elapsed: number): void {
    super.update(engine, elapsed);
    let newYOffset = this.graphics.offset.y + BaseNote.NOTE_SPEED * elapsed;

    if (newYOffset >= GAME_CONFIG.height) {
      newYOffset -= GAME_CONFIG.height;
    }
    this.graphics.offset = vec(this.graphics.offset.x, newYOffset);
  }

  public onInitialize() {
    this.graphics.use(
      Sprite.from(Resources.HighwayBg, { height: GAME_CONFIG.height * 2 })
    );
  }
}

export default HighwayBg;
