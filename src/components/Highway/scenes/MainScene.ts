import { Engine, ImageSource, Scene, vec } from "excalibur";
import BaseNote from "../actors/BaseNote";

class MainScene extends Scene {
  counter: number = 0;
  sprites: Record<string, ImageSource> = {};

  public onPostUpdate(engine: Engine, elapsed: number): void {
    super.onPostUpdate(engine, elapsed);
    this.counter += elapsed;
    if (this.counter > 50) {
      this.counter = elapsed - 50;
      const note = new BaseNote(vec(100, 0), "Circle", "Yellow");
      this.add(note);
    }
  }

  /**
   * Each time the scene is entered (Engine.goToScene)
   */
  public onActivate() {}

  /**
   * Each time the scene is exited (Engine.goToScene)
   */
  public onDeactivate() {
    // stop music
  }
}

export default MainScene;
