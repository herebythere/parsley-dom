import type { DrawFunc, HangarInterface } from "../type_flyweight/hangar.ts";
import type { DrawInterface } from "../type_flyweight/draw.ts";

import { diff } from "../diff/diff.ts";

class Hangar<N, S = unknown> implements HangarInterface<S> {
  drawFuncs!: DrawFunc<S>[];
  parentNode?: N;
  leftNode?: N;

  prevDraw!: DrawInterface[];
  prevRender!: unknown[];

  constructor(drawFuncs: DrawFunc<S>[], parentNode?: N, leftNode?: N) {
    // remove all children
    this.drawFuncs = drawFuncs;
    this.parentNode = parentNode;
    this.leftNode = leftNode;
  }

  update(state: S) {
    // update tree
  }
}

export { Hangar };
