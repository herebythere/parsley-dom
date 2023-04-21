import type { HangarInterface } from "../type_flyweight/hangar.ts";
import type {
  Render,
  RenderFunc,
  RenderSource,
} from "../type_flyweight/render.ts";
import type { UtilsInterface } from "../type_flyweight/utils.ts";

import { diff } from "../diff/diff.ts";

class Hangar<N, S = unknown> implements HangarInterface<N, S> {
  renderFuncs: RenderFunc<N>[];
  parentNode: N;
  leftNode?: N;

  render?: Render<N>;

  constructor(renderFuncs: RenderFunc<N>[], parentNode: N, leftNode?: N) {
    this.renderFuncs = renderFuncs;
    this.parentNode = parentNode;
    this.leftNode = leftNode;
  }

  update(utils: UtilsInterface<N>, state: S) {
    // create draws
    let renderSources: RenderSource<N>[] = [];
    for (const func of this.renderFuncs) {
      renderSources.push(func(state));
    }

    // update render
    const render = diff(
      utils,
      renderSources,
      this.parentNode,
      this.leftNode,
      this.render,
    );

    // swap renders
    this.render = render;
  }
}

export { Hangar };
