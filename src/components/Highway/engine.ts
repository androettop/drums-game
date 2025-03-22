import { Color, Engine } from "excalibur";
import { SongData } from "../../types/songs";
import { Resources as NotesResources } from "./actors/resources";
import { GAME_CONFIG } from "./config";
import { MusicFile } from "./helpers/loaders";
import { createLoader } from "./resources";
import MainScene from "./scenes/MainScene";

class HighwayEngine extends Engine {
  song: SongData;
  audioTracks: MusicFile[] = [];

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
    this.audioTracks = this.song.audioFileData.songTracks.map((trackName) => new MusicFile(this.song, trackName));
    this.add("main", new MainScene());
    const loader = createLoader(NotesResources);
    loader.addResources(this.audioTracks);
    this.start(loader);
  }

  onInitialize(engine: Engine): void {
    super.onInitialize(engine);
    this.goToScene("main");
  }
}

export default HighwayEngine;
