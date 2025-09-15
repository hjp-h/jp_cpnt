import Symbol1 from "./imgs/spin-items/1.png";
import Symbol2 from "./imgs/spin-items/2.png";
import Symbol3 from "./imgs/spin-items/3.png";
import Symbol4 from "./imgs/spin-items/4.png";
import Symbol5 from "./imgs/spin-items/5.png";
import Symbol6 from "./imgs/spin-items/6.png";
import Symbol7 from "./imgs/spin-items/7.png";
import Symbol8 from "./imgs/spin-items/8.png";
import Symbol9 from "./imgs/spin-items/9.png";
import Symbol10 from "./imgs/spin-items/10.png";
import Symbol11 from "./imgs/spin-items/11.png";
import Symbol12 from "./imgs/spin-items/12.png";

import PIXI from "pixi.js";

// SpriteSheet
import LineAnimationPNG from "./spritesheets/line/texture.png";
import LineAnimationJSON from "./spritesheets/line/texture.json";
import TinyVLineAnimationPNG from "./spritesheets/tiny-v-line/texture.png";
import TinyVLineAnimationJSON from "./spritesheets/tiny-v-line/texture.json";
import VLineAnimationPNG from "./spritesheets/v-line/texture.png";
import VLineAnimationJSON from "./spritesheets/v-line/texture.json";
import ZLineAnimationPng from "./spritesheets/z-line/texture.png";
import ZLineAnimationJSON from "./spritesheets/z-line/texture.json";
import Light1AnimationPNG from "./spritesheets/light1/texture.png";
import Light1AnimationJSON from "./spritesheets/light1/texture.json";
import Light2AnimationPNG from "./spritesheets/light2/texture.png";
import Light2AnimationJSON from "./spritesheets/light2/texture.json";

// type
/** 线号 */
export enum LineNo {
  LINE_NO_NONE = 0,
  LINE_NO_L1 = 1,
  LINE_NO_L2 = 2,
  LINE_NO_L3 = 3,
  LINE_NO_L4 = 4,
  LINE_NO_L5 = 5,
  LINE_NO_L6 = 6,
  LINE_NO_L7 = 7,
  LINE_NO_L8 = 8,
  LINE_NO_L9 = 9,
  UNRECOGNIZED = -1,
}

export type Cell = {
  no: number;
  row: number;
  col: number;
  item: number;
};

// config
export const SYMBOL_RESOURCE = [
  {
    alias: "symbol1",
    src: Symbol1,
  },
  {
    alias: "symbol2",
    src: Symbol2,
  },
  {
    alias: "symbol3",
    src: Symbol3,
  },
  {
    alias: "symbol4",
    src: Symbol4,
  },
  {
    alias: "symbol5",
    src: Symbol5,
  },
  {
    alias: "symbol6",
    src: Symbol6,
  },
  {
    alias: "symbol7",
    src: Symbol7,
  },
  {
    alias: "symbol8",
    src: Symbol8,
  },
  {
    alias: "symbol9",
    src: Symbol9,
  },
  {
    alias: "symbol10",
    src: Symbol10,
  },
  {
    alias: "symbol11",
    src: Symbol11,
  },
  {
    alias: "symbol12",
    src: Symbol12,
  },
];

export const LINE_RESOURCE = [
  {
    alias: "LineAnimation",
    src: LineAnimationPNG,
  },
  {
    alias: "Light1Animation",
    src: Light1AnimationPNG,
  },
  {
    alias: "Light2Animation",
    src: Light2AnimationPNG,
  },
  {
    alias: "VLineAnimation",
    src: VLineAnimationPNG,
  },

  {
    alias: "TinyVLineAnimation",
    src: TinyVLineAnimationPNG,
  },
  {
    alias: "ZLineAnimation",
    src: ZLineAnimationPng,
  },
];

export const LINE_ANIMATION_CONFIG = [
  {
    spritesheet: [
      {
        json: LineAnimationJSON,
        pngAlias: "LineAnimation",
      },
    ],
    type: LineNo.LINE_NO_L1,
    rowIndex: 0,
    rotateY: 0,
    rotateX: 0,
    loopReverseDirection: "x",
    getY: ({ SYMBOL_HEIGHT }: { SYMBOL_HEIGHT: number }) => 2 * SYMBOL_HEIGHT,
    speed: 0.5,
  },
  {
    spritesheet: [
      {
        json: LineAnimationJSON,
        pngAlias: "LineAnimation",
      },
    ],
    type: LineNo.LINE_NO_L2,
    rowIndex: 1,
    rotateY: 0,
    rotateX: 0,
    loopReverseDirection: "x",
    getY: ({
      SYMBOL_HEIGHT,
      MARGIN_Y,
    }: {
      SYMBOL_HEIGHT: number;
      MARGIN_Y: number;
    }) => SYMBOL_HEIGHT / 2,
    speed: 0.5,
  },

  {
    spritesheet: [
      {
        json: LineAnimationJSON,
        pngAlias: "LineAnimation",
      },
    ],
    type: LineNo.LINE_NO_L3,
    rowIndex: 2,
    rotateY: 0,
    rotateX: 0,
    loopReverseDirection: "x",
    getY: ({
      SYMBOL_HEIGHT,
      MARGIN_Y,
    }: {
      SYMBOL_HEIGHT: number;
      MARGIN_Y: number;
    }) => 3 * SYMBOL_HEIGHT + MARGIN_Y,
    speed: 0.5,
  },
  {
    spritesheet: [
      {
        json: VLineAnimationJSON,
        pngAlias: "VLineAnimation",
      },
    ],
    type: LineNo.LINE_NO_L4,
    rowIndex: 0,
    rotateY: 0,
    rotateX: 0,
    loopReverseDirection: "x",
    getY: ({ app }: { app: PIXI.Application }) => app.screen.height / 2,
    speed: 0.5,
  },
  {
    spritesheet: [
      {
        json: VLineAnimationJSON,
        pngAlias: "VLineAnimation",
      },
    ],
    type: LineNo.LINE_NO_L5,
    rowIndex: 0,
    rotateY: 180,
    rotateX: 0,
    loopReverseDirection: "x",
    getY: ({ app }: { app: PIXI.Application }) => app.screen.height / 2,
    speed: 0.5,
  },
  {
    spritesheet: [
      {
        json: TinyVLineAnimationJSON,
        pngAlias: "TinyVLineAnimation",
      },
    ],
    type: LineNo.LINE_NO_L6,
    rowIndex: 1,
    rotateY: 180,
    loopReverseDirection: "x",
    getY: ({
      app,
      MARGIN_Y,
      SYMBOL_WIDTH,
    }: {
      app: PIXI.Application;
      MARGIN_Y: number;
      SYMBOL_WIDTH: number;
    }) => SYMBOL_WIDTH + MARGIN_Y * 2,
    speed: 0.5,
  },
  {
    spritesheet: [
      {
        json: TinyVLineAnimationJSON,
        pngAlias: "TinyVLineAnimation",
      },
    ],
    type: LineNo.LINE_NO_L7,
    rowIndex: 1,
    rotateY: 0,
    loopReverseDirection: "x",
    getY: ({
      app,
      MARGIN_Y,
      SYMBOL_WIDTH,
    }: {
      app: PIXI.Application;
      MARGIN_Y: number;
      SYMBOL_WIDTH: number;
    }) => 2 * SYMBOL_WIDTH + MARGIN_Y * 2,
    speed: 0.5,
  },
  {
    spritesheet: [
      {
        json: ZLineAnimationJSON,
        pngAlias: "ZLineAnimation",
      },
    ],
    type: LineNo.LINE_NO_L8,
    rowIndex: 0,
    loopReverseDirection: "y",
    getY: ({ SYMBOL_HEIGHT }: { SYMBOL_HEIGHT: number }) => SYMBOL_HEIGHT * 2,
    speed: 0.5085,
  },
  {
    spritesheet: [
      {
        json: ZLineAnimationJSON,
        pngAlias: "ZLineAnimation",
      },
    ],
    type: LineNo.LINE_NO_L9,
    rowIndex: 2,
    loopReverseDirection: "y",
    rotateY: 180,
    getY: ({ SYMBOL_HEIGHT }: { SYMBOL_HEIGHT: number }) => SYMBOL_HEIGHT * 2,
    speed: 0.5085,
  },
];

export const SYMBOL_BORDER_ANIMATION_CONFIG = [
  {
    spritesheet: [
      {
        json: Light1AnimationJSON,
        pngAlias: "Light1Animation",
      },
    ],
    type: 1,
    speed: 0.5,
  },
  {
    spritesheet: [
      {
        json: Light2AnimationJSON,
        pngAlias: "Light2Animation",
      },
    ],
    type: 2,
    speed: 0.5,
  },
];

export const MOCK_RESULT = [
  {
    no: 1,
    row: 1,
    col: 1,
    item: 3,
  },
  {
    no: 2,
    row: 1,
    col: 2,
    item: 3,
  },
  {
    no: 3,
    row: 1,
    col: 3,
    item: 9,
  },
  {
    no: 4,
    row: 1,
    col: 4,
    item: 1,
  },
  {
    no: 5,
    row: 1,
    col: 5,
    item: 1,
  },
  {
    no: 6,
    row: 2,
    col: 1,
    item: 3,
  },
  {
    no: 7,
    row: 2,
    col: 2,
    item: 1,
  },
  {
    no: 8,
    row: 2,
    col: 3,
    item: 3,
  },
  {
    no: 9,
    row: 2,
    col: 4,
    item: 3,
  },
  {
    no: 10,
    row: 2,
    col: 5,
    item: 10,
  },
  {
    no: 11,
    row: 3,
    col: 1,
    item: 2,
  },
  {
    no: 12,
    row: 3,
    col: 2,
    item: 3,
  },
  {
    no: 13,
    row: 3,
    col: 3,
    item: 2,
  },
  {
    no: 14,
    row: 3,
    col: 4,
    item: 3,
  },
  {
    no: 15,
    row: 3,
    col: 5,
    item: 11,
  },
];

export const MOCK_WIN_LINE = [
  {
    no: 6,
    cell: [
      {
        no: 6,
        row: 2,
        col: 1,
        item: 3,
      },
      {
        no: 2,
        row: 1,
        col: 2,
        item: 3,
      },
    ],
  },
  {
    no: 7,
    cell: [
      {
        no: 6,
        row: 2,
        col: 1,
        item: 3,
      },
      {
        no: 12,
        row: 3,
        col: 2,
        item: 3,
      },
    ],
  },
  {
    no: 2,
    cell: [
      {
        no: 1,
        row: 1,
        col: 1,
        item: 3,
      },
      {
        no: 2,
        row: 1,
        col: 2,
        item: 3,
      },
    ],
  },
];
