import { Actor, Sprite, Vector } from "excalibur";
import { GAME_CONFIG } from "../config";
import { Resources } from "../resources";

class Highway extends Actor {
  constructor() {
    super({
      pos: Vector.Zero,
      width: GAME_CONFIG.highwayWidth,
      height: GAME_CONFIG.highwayHeight,
      anchor: Vector.Zero,
      z: 0,
    });
  }

  public onInitialize() {
    this.graphics.use(Sprite.from(Resources.HighwayBg));
  }
}

export default Highway;
