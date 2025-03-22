import { Engine, ImageSource, Scene, vec } from "excalibur";
import BaseNote from "../actors/BaseNote";
import HighwayEngine from "../engine";

class MainScene extends Scene {
  counter: number = 0;
  sprites: Record<string, ImageSource> = {};

  public onPostUpdate(engine: Engine, elapsed: number): void {
    super.onPostUpdate(engine, elapsed);
    this.counter += elapsed;
    if (this.counter > 200) {
      this.counter = elapsed - 200;
      const note = new BaseNote(vec(100, 0), "Circle", "Yellow");
      this.add(note);
    }
  }

  /**
   * Each time the scene is entered (Engine.goToScene)
   */
  public onActivate() {
    // preload music
    const engine = this.engine as HighwayEngine;

    engine.audioTracks.forEach((track) => {
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
