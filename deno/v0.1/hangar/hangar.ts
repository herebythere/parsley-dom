import type { DrawFunc, HangarInterface } from "../type_flyweight/hangar.ts";
import type { DrawInterface } from "../type_flyweight/draw.ts";
import type { Render } from "../type_flyweight/render.ts";

import { diff } from "../diff/diff.ts";

class Hangar<N, S = unknown> implements HangarInterface<S> {
  drawFuncs!: DrawFunc<S>[];
  parentNode?: N;
  leftNode?: N;

  prevDraw?: DrawInterface[];
  prevRender?: Render<N>;

  constructor(drawFuncs: DrawFunc<S>[], state: S, parentNode?: N, leftNode?: N) {
    // remove all children
    this.drawFuncs = drawFuncs;
    this.parentNode = parentNode;
    this.leftNode = leftNode;
  }

  update(state: S) {
    // update tree
    // send state to draw funcs
    
    // diff prev draw with curr draw
  }
}

export { Hangar };
