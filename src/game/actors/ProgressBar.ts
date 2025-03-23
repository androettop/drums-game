import { Actor, Sprite, vec } from "excalibur";
import { GAME_CONFIG } from "../config";
import Game from "../engine";
import { Resources } from "../resources";

class ProgressBar extends Actor {
  progressBarActor: Actor | null = null;

  constructor() {
    super({
      pos: vec(GAME_CONFIG.width / 2, GAME_CONFIG.highwayHeight + 10),
      anchor: vec(0.5, 0),
      z: 30,
    });
  }

  public onPostUpdate(engine: Game, elapsed: number): void {
    super.onPostUpdate(engine, elapsed);

    if (!this.progressBarActor) {
      return;
    }

    const currentTime = engine.songTracks[0].getPlaybackPosition();
    const progress = Math.min(
      currentTime / (engine.songTracks[0].duration || 1),
      1
    );

    // TODO: fix the image distortion
    this.progressBarActor.scale.x = progress
  }

  public onInitialize() {
    this.graphics.use(Sprite.from(Resources.ProgressBarEmpty));
    this.progressBarActor = new Actor({
      pos: vec(-GAME_CONFIG.highwayWidth / 2, 0),
      anchor: vec(0, 0),
    });
    this.progressBarActor.graphics.use(Sprite.from(Resources.ProgressBarFull));

    this.addChild(this.progressBarActor);
  }
}

export default ProgressBar;
