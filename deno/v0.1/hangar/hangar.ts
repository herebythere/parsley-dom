
import type { DrawFunc, HangarInterface } from "../type_flyweight/hangar.ts";
import type { DrawInterface } from "../type_flyweight/draw.ts";

class DOMHangar<N = unknown, S = unknown>
  implements HangarInterface<N, S> {
  drawFuncs!: DrawFunc<S>[];
  parentNode?: N;
  leftNode?: N;

  prevDraw!: DrawInterface[];
  prevRender!: unknown[];
  state!: S;

  queuedForUpdate: boolean = false;

  setup(drawFuncs: DrawFunc<S>[], parentNode?: N, leftNode?: N) {
    // remove all children
    this.drawFuncs = drawFuncs;
    this.parentNode = parentNode;
    this.leftNode = leftNode;
  }

  update(state: S) {
    this.state = state;
    if (!this.queuedForUpdate) {
      queueMicrotask(this.render);
      this.queuedForUpdate = true;
    }
  }

  render = () => {
    // perform render steps
    this.queuedForUpdate = false;
  };
}

export { DOMHangar };
