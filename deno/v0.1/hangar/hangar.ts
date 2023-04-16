import type {
  HangarInterface,
} from "../type_flyweight/hangar.ts";
import type {
  BuilderFunc,
  Renders,
} from "../type_flyweight/render.ts";
import type { BuilderSources } from "../type_flyweight/draw.ts";
import type { Render, RenderFunc, RenderSource } from "../type_flyweight/render.ts";
import type { Utils } from "../type_flyweight/utils.ts";

import { Draw } from "../draw/draw.ts";
import { diff } from "../diff/diff.ts";

class Hangar<N, S = unknown> implements HangarInterface<N, S> {
  renderFuncs: RenderFunc<N>[];
  parentNode?: N;
  leftNode?: N;

  renderSources?: RenderSource<N>[];
  render?: Render<N>;

  constructor(drawFuncs: DrawFunc<N>[], parentNode?: N, leftNode?: N) {
    // remove all children
    this.drawFuncs = drawFuncs;
    this.parentNode = parentNode;
    this.leftNode = leftNode;
  }

  update(utils: Utils<N>, state: S) {
    // create draws
    let renderSources: RenderSource<N>[] = [];
    for (const func of this.renderFuncs) {
      renderSources.push(func(state));
    }

		// update render
    const render = diff(
      utils,
      renderSources,
      this.renderSources,
      this.render,
      this.parentNode,
      this.leftNode,
    );

		// swap renders and draws
    this.renderSources = renderSources;
    this.render = render;
    
    console.log(this);
  }
}

export { Hangar };
