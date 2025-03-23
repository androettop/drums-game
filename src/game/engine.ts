import { Color, Engine, ImageSource, Sound } from "excalibur";
import { SongData } from "../types/songs";
import { ImageFile, MusicFile } from "./helpers/loaders";
import { createLoader, Resources as NotesResources } from "./resources";
import MainScene from "./scenes/MainScene";

class Game extends Engine {
  song: SongData;
  songTracks: Sound[] = [];
  drumTracks: Sound[] = [];
  cover: ImageSource | null = null;

  constructor(canvas: HTMLCanvasElement, song: SongData) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    super({
      canvasElement: canvas,
      resolution: { width: width, height: height },
      viewport: { width: width, height: height },
      backgroundColor: Color.Black,
    });

    this.song = song;
  }

  initialize() {
    this.songTracks = this.song.audioFileData.songTracks.map(
      (trackName) => new MusicFile(this.song, trackName)
    );
    this.drumTracks = this.song.audioFileData.drumTracks.map(
      (trackName) => new MusicFile(this.song, trackName)
    );

    this.cover = new ImageFile(
      this.song,
      this.song.recordingMetadata.coverImagePath
    );
    this.add("main", new MainScene());
    const loader = createLoader(NotesResources);
    loader.addResources(this.songTracks);
    loader.addResources(this.drumTracks);
    loader.addResource(this.cover);
    this.start(loader);
  }

  onInitialize(engine: Engine): void {
    super.onInitialize(engine);
    this.goToScene("main");
  }
}

export default Game;
