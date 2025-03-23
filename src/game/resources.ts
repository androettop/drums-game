import { DefaultLoader, Loadable, ImageSource } from "excalibur";

import noteCircleCyan from "../assets/NoteCircleCyan.png";
import noteCircleOrange from "../assets/NoteCircleOrange.png";
import noteCirclePurple from "../assets/NoteCirclePurple.png";
import noteCircleYellow from "../assets/NoteCircleYellow.png";
import noteRectCyan from "../assets/NoteRectCyan.png";
import noteRectGreen from "../assets/NoteRectGreen.png";
import noteRectPurple from "../assets/NoteRectPurple.png";
import noteRectRed from "../assets/NoteRectRed.png";
import noteRectBase from "../assets/NoteRectBase.png";
import noteKick from "../assets/NoteKick.png";

import dividerNoteCircleCyan from "../assets/DividerNoteCircleCyan.png";
import dividerNoteCircleOrange from "../assets/DividerNoteCircleOrange.png";
import dividerNoteCirclePurple from "../assets/DividerNoteCirclePurple.png";
import dividerNoteCircleYellow from "../assets/DividerNoteCircleYellow.png";
import dividerNoteRectCyan from "../assets/DividerNoteRectCyan.png";
import dividerNoteRectGreen from "../assets/DividerNoteRectGreen.png";
import dividerNoteRectPurple from "../assets/DividerNoteRectPurple.png";
import dividerNoteRectRed from "../assets/DividerNoteRectRed.png";
import dividerNoteRectBase from "../assets/DividerNoteRectBase.png";

import divider from "../assets/Divider.png";

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
const noteRectBaseImg = new ImageSource(noteRectBase);
const noteKickImg = new ImageSource(noteKick);

const dividerNoteCircleCyanImg = new ImageSource(dividerNoteCircleCyan);
const dividerNoteCircleOrangeImg = new ImageSource(dividerNoteCircleOrange);
const dividerNoteCirclePurpleImg = new ImageSource(dividerNoteCirclePurple);
const dividerNoteCircleYellowImg = new ImageSource(dividerNoteCircleYellow);
const dividerNoteRectCyanImg = new ImageSource(dividerNoteRectCyan);
const dividerNoteRectGreenImg = new ImageSource(dividerNoteRectGreen);
const dividerNoteRectPurpleImg = new ImageSource(dividerNoteRectPurple);
const dividerNoteRectRedImg = new ImageSource(dividerNoteRectRed);
const dividerNoteRectBaseImg = new ImageSource(dividerNoteRectBase);

const dividerImg = new ImageSource(divider);

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
  NoteRectBase: noteRectBaseImg,
  NoteKick: noteKickImg,

  DividerNoteCircleCyan: dividerNoteCircleCyanImg,
  DividerNoteCircleOrange: dividerNoteCircleOrangeImg,
  DividerNoteCirclePurple: dividerNoteCirclePurpleImg,
  DividerNoteCircleYellow: dividerNoteCircleYellowImg,
  DividerNoteRectCyan: dividerNoteRectCyanImg,
  DividerNoteRectGreen: dividerNoteRectGreenImg,
  DividerNoteRectPurple: dividerNoteRectPurpleImg,
  DividerNoteRectRed: dividerNoteRectRedImg,
  DividerNoteRectBase: dividerNoteRectBaseImg,

  Divider: dividerImg,

  HighwayBg: highwayBgImg,
} as const;
