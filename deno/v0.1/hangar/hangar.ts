import type { DrawFunc, HangarInterface } from "../type_flyweight/hangar.ts";
import type { DrawInterface } from "../type_flyweight/draw.ts";

class DOMHangar<S = unknown>
  implements HangarInterface<S> {
  drawFuncs!: DrawFunc<S>[];
  parentNode?: Node;
  leftNode?: Node;

  prevDraw!: DrawInterface[];
  prevRender!: unknown[];

  constructor(drawFuncs: DrawFunc<S>[], parentNode?: Node, leftNode?: Node) {
    // remove all children
    this.drawFuncs = drawFuncs;
    this.parentNode = parentNode;
    this.leftNode = leftNode;
  }

  update(state: S) {
		// call draw functions
		// compare diff
		// update structure
		// update properties
  }
}

export { DOMHangar };
