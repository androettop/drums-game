import { Sprite, Vector } from "excalibur";
import BaseNote from "./BaseNote";
import { Resources } from "./resources";

class Crash15Note extends BaseNote {
  constructor(pos: Vector) {
    super(pos);
  }

  public onInitialize() {
    const sprite = Sprite.from(Resources.NoteCirclePurple);
    this.graphics.use(sprite);

    super.onInitialize();
  }
}

export default Crash15Note;
