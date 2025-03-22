import { Sprite, Vector } from "excalibur";
import BaseNote from "./BaseNote";
import { Resources } from "./resources";

class SnareNote extends BaseNote {
  constructor(pos: Vector) {
    super(pos);
  }

  public onInitialize() {
    const sprite = Sprite.from(Resources.NoteRectRed);
    this.graphics.use(sprite);

    super.onInitialize();
  }
}

export default SnareNote;
