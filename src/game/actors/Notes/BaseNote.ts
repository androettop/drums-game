import { Actor, vec, Vector } from "excalibur";
import { GAME_CONFIG } from "../../config";

class BaseNote extends Actor {
  constructor(pos: Vector, z: number = 10) {
    super({
      pos,
      anchor: Vector.Half,
      z,
    });
  }

  public onInitialize() {
    const fixedDistance = GAME_CONFIG.highwayHeight - this.pos.y;
    const fixedAnimDuration = fixedDistance / GAME_CONFIG.notesSpeed;

    this.actions
      .moveTo({
        pos: vec(this.pos.x, GAME_CONFIG.highwayHeight),
        duration: fixedAnimDuration,
      })
      .die();
  }
}

export default BaseNote;
