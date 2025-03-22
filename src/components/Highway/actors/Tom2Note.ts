import { Sprite, Vector } from "excalibur";
import BaseNote from "./BaseNote";
import { Resources } from "./resources";

class Tom2Note extends BaseNote {
  constructor(pos: Vector) {
    super(pos);
  }

  public onInitialize() {
    const sprite = Sprite.from(Resources.NoteRectGreen);
    this.graphics.use(sprite);

    super.onInitialize();
  }
}

export default Tom2Note;
