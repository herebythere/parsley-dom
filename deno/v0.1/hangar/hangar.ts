import type { HangarInterface } from "../type_flyweight/hangar.ts";
import type {
  Render,
  RenderFunc,
  RenderSource,
} from "../type_flyweight/render.ts";
import type { UtilsInterface } from "../type_flyweight/utils.ts";

import { diff } from "../diff/diff.ts";

class Hangar<N, S = unknown> implements HangarInterface<N, S> {
  renderFunc: RenderFunc<N>;
  parentNode: N;
  leftNode?: N;

  render?: Render<N>;

  constructor(renderFunc: RenderFunc<N>, parentNode: N, leftNode?: N) {
    this.renderFunc = renderFunc;
    this.parentNode = parentNode;
    this.leftNode = leftNode;
  }

  update(utils: UtilsInterface<N>, state: S) {
    const start = performance.now();
    
    const source = this.renderFunc(state);
    this.render = diff(
      utils,
      source,
      this.parentNode,
      this.leftNode,
      this.render,
    );
    
    console.log("time", performance.now() - start);
  }
}

export { Hangar };
