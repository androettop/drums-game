import { ImageSource, Scene, Sound, vec } from "excalibur";
import Button from "../actors/Button";
import Highway from "../actors/Highway";
import { GAME_CONFIG } from "../config";
import Game from "../engine";
import { processNotesAndInstruments } from "../helpers/songProcess";
import { Resources } from "../resources";

class MainScene extends Scene {
  counter: number = 0;
  sprites: Record<string, ImageSource> = {};
  startBtn: Button | null = null;

  public startSong(engine: Game) {
    // start all tracks
    [...engine.songTracks, ...engine.drumTracks].forEach((track) => {
      track.play();
    });

    // remove the start button
    this.startBtn?.kill();
    this.startBtn = null;
  }

  /**
   * Each time the scene is entered (Engine.goToScene)
   */
  public onActivate() {
    const engine = this.engine as Game;

    // process notes to make it easier to use
    const { notes, instruments } = processNotesAndInstruments(
      engine.song.events
    );

    const mainTrack: Sound = engine.songTracks[0];

    // Add the Highway
    this.add(new Highway(notes, instruments, mainTrack));

    // Create the Start Button
    this.startBtn = new Button(
      vec(GAME_CONFIG.width / 2, GAME_CONFIG.height / 2),
      Resources.StartBtn,
      () => this.startSong(engine)
    );

    this.add(this.startBtn);
  }
}

export default MainScene;
