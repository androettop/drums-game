import { Color, Engine, ImageSource, Sound } from "excalibur";
import { SongData } from "../types/songs";
import { GAME_CONFIG } from "./config";
import { ImageFile, MusicFile } from "./helpers/loaders";
import { createLoader, Resources as NotesResources } from "./resources";
import MainScene from "./scenes/MainScene";

class Game extends Engine {
  song: SongData;
  songTracks: Sound[] = [];
  drumTracks: Sound[] = [];
  cover: ImageSource | null = null;

  constructor(canvas: HTMLCanvasElement, song: SongData) {
    super({
      canvasElement: canvas,
      resolution: { height: GAME_CONFIG.height, width: GAME_CONFIG.width },
      backgroundColor: Color.Black,
    });

    this.song = song;
  }

  public play() {
    [...this.songTracks, ...this.drumTracks].forEach((track) => {
      track.play();
    });
  }

  public pause() {
    [...this.songTracks, ...this.drumTracks].forEach((track) => {
      track.pause();
    });
  }

  public seek(progress: number) {
    [...this.songTracks, ...this.drumTracks].forEach((track) => {
      track.seek(progress * (track.duration || 0));
    });
  }

  public hasDrums() {
    return this.drumTracks.length > 0;
  }

  public areDrumsMuted() {
    return this.drumTracks?.[0]?.volume === 0;
  }

  public muteDrums() {
    this.drumTracks.forEach((track) => track.volume = 0);
  }

  public unmuteDrums() {
    this.drumTracks.forEach((track) => track.volume = 1);
  }

  public getPlaybackPosition() {
    return this.songTracks[0].getPlaybackPosition();
  }

  public getDuration() {
    return this.songTracks[0].duration || 1;
  }

  public isPlaying() {
    return this.songTracks[0].isPlaying();
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
