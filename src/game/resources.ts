import { DefaultLoader, Loadable, ImageSource } from "excalibur";

import noteCircleCyan from "../assets/NoteCircleCyan.png";
import noteCircleOrange from "../assets/NoteCircleOrange.png";
import noteCirclePurple from "../assets/NoteCirclePurple.png";
import noteCircleYellow from "../assets/NoteCircleYellow.png";
import noteRectCyan from "../assets/NoteRectCyan.png";
import noteRectGreen from "../assets/NoteRectGreen.png";
import noteRectPurple from "../assets/NoteRectPurple.png";
import noteRectRed from "../assets/NoteRectRed.png";
import noteKick from "../assets/NoteKick.png";

import highwayBg from "../assets/HighwayBg.png";

export const createLoader = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...resourceObjects: Record<string, Loadable<any>>[]
) => {
  const loader = new DefaultLoader();
  for (const resourceObject of resourceObjects) {
    for (const key in resourceObject) {
      loader.addResource(resourceObject[key]);
    }
  }

  return loader;
};

const noteCircleCyanImg = new ImageSource(noteCircleCyan);
const noteCircleOrangeImg = new ImageSource(noteCircleOrange);
const noteCirclePurpleImg = new ImageSource(noteCirclePurple);
const noteCircleYellowImg = new ImageSource(noteCircleYellow);
const noteRectCyanImg = new ImageSource(noteRectCyan);
const noteRectGreenImg = new ImageSource(noteRectGreen);
const noteRectPurpleImg = new ImageSource(noteRectPurple);
const noteRectRedImg = new ImageSource(noteRectRed);
const noteKickImg = new ImageSource(noteKick);

const highwayBgImg = new ImageSource(highwayBg);

export const Resources = {
  NoteCircleCyan: noteCircleCyanImg,
  NoteCircleOrange: noteCircleOrangeImg,
  NoteCirclePurple: noteCirclePurpleImg,
  NoteCircleYellow: noteCircleYellowImg,
  NoteRectCyan: noteRectCyanImg,
  NoteRectGreen: noteRectGreenImg,
  NoteRectPurple: noteRectPurpleImg,
  NoteRectRed: noteRectRedImg,
  NoteKick: noteKickImg,

  HighwayBg: highwayBgImg,
} as const;
