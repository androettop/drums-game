import { Actor, ImageSource, Sprite, vec, Vector } from "excalibur";
import { GAME_CONFIG } from "../../config";
import Game from "../../engine";

class BaseNote extends Actor {
  sprite: Sprite;

  constructor(pos: Vector, imageSource: ImageSource, z: number = 10) {
    super({
      pos,
      anchor: Vector.Half,
      z,
      opacity: 1,
    });

    this.sprite = Sprite.from(imageSource);
  }

  public onPostUpdate(engine: Game, elapsed: number): void {
    super.onPostUpdate(engine, elapsed);

    let opacity = 0;
    if (
      this.pos.y >= GAME_CONFIG.dividerPosition &&
      this.pos.y <= GAME_CONFIG.highwayHeight - GAME_CONFIG.dividerPosition
    ) {
      opacity = 0.98;
    } else if (this.pos.y > 0 && this.pos.y < GAME_CONFIG.dividerPosition) {
      opacity = this.pos.y / GAME_CONFIG.dividerPosition;
    } else if (
      this.pos.y > GAME_CONFIG.highwayHeight - GAME_CONFIG.dividerPosition &&
      this.pos.y < GAME_CONFIG.highwayHeight
    ) {
      opacity =
        1 -
        (this.pos.y -
          (GAME_CONFIG.highwayHeight - GAME_CONFIG.dividerPosition)) /
          GAME_CONFIG.dividerPosition;
    }

    this.graphics.opacity = opacity;
  }

  public onInitialize() {
    this.graphics.use(this.sprite);

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
