import type {
  DrawFunc,
  Draws,
  HangarInterface,
} from "../type_flyweight/hangar.ts";
import type { DrawInterface } from "../type_flyweight/draw.ts";
import type { Render } from "../type_flyweight/render.ts";
import type { Utils } from "../type_flyweight/utils.ts";

import { Draw } from "../draw/draw.ts";
import { Build } from "../build/build.ts";
import { diff } from "../diff/diff.ts";

class Hangar<N, S = unknown> implements HangarInterface<N, S> {
  drawFuncs!: DrawFunc<N>[];
  parentNode?: N;
  leftNode?: N;

  prevDraws?: Draws<N>[];
  prevRender?: Render<N>;

  constructor(drawFuncs: DrawFunc<N>[], parentNode?: N, leftNode?: N) {
    // remove all children
    this.drawFuncs = drawFuncs;
    this.parentNode = parentNode;
    this.leftNode = leftNode;
  }

  update(utils: Utils<N>, state: S) {
    // create draws
    let draws: Draws<N>[] = [];

    // diff prev draw with curr draw
    for (const func of this.drawFuncs) {
      // this needs to be in utils
      draws.push(func(state));
    }

    const render = diff(
      utils,
      draws,
      this.prevDraws,
      this.prevRender,
      this.parentNode,
      this.leftNode,
    );

    this.prevDraws = draws;
    this.prevRender = render;
  }
}

export { Hangar };
