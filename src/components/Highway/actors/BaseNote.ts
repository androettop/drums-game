import { Actor, Sprite, vec, Vector } from "excalibur";
import { Resources } from "./resources";
import { GAME_CONFIG } from "../config";

type NoteShape = "Circle" | "Rect" | "Line";

type NoteColor = "Red" | "Yellow";

class BaseNote extends Actor {
  static ANIM_DURATION = 2000; // note anim duration in ms
  static NOTE_SPEED = GAME_CONFIG.height / BaseNote.ANIM_DURATION;
  shape: NoteShape;
  noteColor: NoteColor;

  constructor(pos: Vector, shape: NoteShape, color: NoteColor) {
    super({
      pos,
      anchor: Vector.Half,
    });
    this.shape = shape;
    this.noteColor = color;
  }

  public onInitialize() {
    const sprite = Sprite.from(Resources.NoteCircleYellow);
    this.graphics.use(sprite);
    const fixedDistance = GAME_CONFIG.height - this.pos.y;
    const fixedAnimDuration = fixedDistance / BaseNote.NOTE_SPEED;

    this.actions.moveTo({pos: vec(this.pos.x, GAME_CONFIG.height), duration: fixedAnimDuration}).die();
  }
}

export default BaseNote;
