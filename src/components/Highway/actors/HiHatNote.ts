import { Sprite, Vector } from "excalibur";
import BaseNote from "./BaseNote";
import { Resources } from "./resources";

class HiHatNote extends BaseNote {
  constructor(pos: Vector) {
    super(pos);
  }

  public onInitialize() {
    const sprite = Sprite.from(Resources.NoteCircleCyan);
    this.graphics.use(sprite);

    super.onInitialize();
  }
}

export default HiHatNote;
