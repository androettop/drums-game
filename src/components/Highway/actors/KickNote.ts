import { Sprite, Vector } from "excalibur";
import BaseNote from "./BaseNote";
import { Resources } from "./resources";

class KickNote extends BaseNote {
  constructor(pos: Vector) {
    super(pos, 5);
  }

  public onInitialize() {
    const sprite = Sprite.from(Resources.NoteKick);
    this.graphics.use(sprite);

    super.onInitialize();
  }
}

export default KickNote;
