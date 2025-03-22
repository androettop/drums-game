import { Actor, vec, Vector } from "excalibur";
import { GAME_CONFIG } from "../config";

class BaseNote extends Actor {
  static ANIM_DURATION = 2000; // note anim duration in ms
  static NOTE_SPEED = GAME_CONFIG.height / BaseNote.ANIM_DURATION;

  constructor(pos: Vector) {
    super({
      pos,
      anchor: Vector.Half,
    });
  }

  public onInitialize() {
    const fixedDistance = GAME_CONFIG.height - this.pos.y;
    const fixedAnimDuration = fixedDistance / BaseNote.NOTE_SPEED;

    this.actions
      .moveTo({
        pos: vec(this.pos.x, GAME_CONFIG.height),
        duration: fixedAnimDuration,
      })
      .die();
  }
}

export default BaseNote;
