import { Sprite, Vector } from "excalibur";
import BaseNote from "./BaseNote";
import { Resources } from "../../resources";

class Ride17Note extends BaseNote {
  constructor(pos: Vector) {
    super(pos);
  }

  public onInitialize() {
    const sprite = Sprite.from(Resources.NoteCircleYellow);
    this.graphics.use(sprite);

    super.onInitialize();
  }
}

export default Ride17Note;
