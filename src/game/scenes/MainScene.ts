import { ImageSource, Scene } from "excalibur";
import Highway from "../actors/Highway";
import Game from "../engine";
import { MusicFile } from "../helpers/loaders";
import {
  processNotes
} from "../helpers/songProcess";

class MainScene extends Scene {
  counter: number = 0;
  sprites: Record<string, ImageSource> = {};

  /**
   * Each time the scene is entered (Engine.goToScene)
   */
  public onActivate() {
    const engine = this.engine as Game;

    // process notes to make it easier to use
    const notes = processNotes(engine.song.events);
    const mainTrack: MusicFile = engine.songTracks[0];

    // Add the Highway
    this.add(new Highway(notes, mainTrack));

    // start all tracks
    [...engine.songTracks, ...engine.drumTracks].forEach((track) => {
      track.play();
    });
  }

  /**
   * Each time the scene is exited (Engine.goToScene)
   */
  public onDeactivate() {
    const engine = this.engine as Game;
    // stop music
    [...engine.songTracks, ...engine.drumTracks].forEach((track) => {
      track.stop();
    });
  }
}

export default MainScene;
