import {
  Actor,
  Handler,
  ImageSource,
  PointerEvent,
  Sprite,
  Vector,
} from "excalibur";

class Button extends Actor {
  imageSource: ImageSource;
  onPress: Handler<PointerEvent>;

  constructor(
    pos: Vector,
    imageSource: ImageSource,
    onPress: Handler<PointerEvent>
  ) {
    super({
      pos,
      anchor: Vector.Half,
      z: 30,
    });
    this.onPress = onPress;
    this.imageSource = imageSource;
  }

  public onInitialize() {
    this.graphics.use(Sprite.from(this.imageSource));
    this.on("pointerup", this.onPress);
  }
}

export default Button;
