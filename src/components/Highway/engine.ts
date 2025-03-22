import { Color, Engine } from "excalibur";
import { SongData } from "../../types/songs";
import MainScene from "./scenes/MainScene";
import { createLoader } from "./resources";
import { Resources as NotesResources } from "./actors/resources";
import { GAME_CONFIG } from "./config";

class HighwayEngine extends Engine {
  song: SongData;

  constructor(canvas: HTMLCanvasElement, song: SongData) {
    super({
      canvasElement: canvas,
      resolution: { width: GAME_CONFIG.width, height: GAME_CONFIG.height },
      viewport: { width: GAME_CONFIG.width, height: GAME_CONFIG.height },
      backgroundColor: Color.Black,
    });

    this.song = song;
  }
  initialize() {
    this.add("main", new MainScene());
    this.start(createLoader(NotesResources));
  }

  onInitialize(engine: Engine): void {
    super.onInitialize(engine);
    this.goToScene("main");
  }
}

export default HighwayEngine;
