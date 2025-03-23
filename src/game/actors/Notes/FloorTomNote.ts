import { Sprite, Vector } from "excalibur";
import BaseNote from "./BaseNote";
import { Resources } from "../../resources";

class FloorTomNote extends BaseNote {
  constructor(pos: Vector) {
    super(pos);
  }

  public onInitialize() {
    const sprite = Sprite.from(Resources.NoteRectPurple);
    this.graphics.use(sprite);

    super.onInitialize();
  }
}

export default FloorTomNote;
