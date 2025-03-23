import { Sprite, Vector } from "excalibur";
import BaseNote from "./BaseNote";
import { Resources } from "../../resources";

class Tom1Note extends BaseNote {
  constructor(pos: Vector) {
    super(pos);
  }

  public onInitialize() {
    const sprite = Sprite.from(Resources.NoteRectCyan);
    this.graphics.use(sprite);

    super.onInitialize();
  }
}

export default Tom1Note;
