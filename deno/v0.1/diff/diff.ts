import type { UtilsInterface } from "../type_flyweight/utils.ts";
import type { DrawInterface } from "../type_flyweight/draw.ts";
import type { BuildInterface } from "../type_flyweight/build.ts";
import type {
  DeltaTargets,
  Render,
  RenderNode,
  RenderResult,
  RenderSource,
} from "../type_flyweight/render.ts";

import { Draw } from "../draw/draw.ts";
import { Build } from "../build/build.ts";
import { Builder } from "../builder/builder.ts";
import { parse } from "../deps.ts";

import { mountResults, unmountResults } from "./mounts.ts";

import {
  adoptBuilds,
  adoptNodes,
  createAddedBuilds,
  createNodesFromSource,
  findTargets,
} from "./nodes.ts";

// first node should be the root node
function diff<N>(
  utils: UtilsInterface<N>,
  source: RenderSource<N>,
  parentNode: N,
  leftNode?: N,
  prevRender?: Render<N>,
): Render<N> {
  // create structures
  //
  const render: Render<N> = {
    results: [undefined],
    sources: [source],
    nodes: [{
      id: 0,
      descendants: [],
      parentId: -1,
    }],
  };

  const delta: DeltaTargets = {
    addedIndexes: [],
    removedIndexes: [],
    survivedIndexes: [],
    prevSurvivedIndexes: [],
  };

  // create sources
  //
  createNodesFromSource(utils, render);

  // diff check
  //
  if (prevRender === undefined) {
    findTargets(delta.addedIndexes, render, 0);
  }
  if (prevRender !== undefined) {
    adoptNodes(delta, render, prevRender);
  }

  // unmount
  //
  if (prevRender !== undefined) {
    unmountResults(
      utils,
      delta,
      prevRender,
      parentNode,
      leftNode,
    );
  }

  // remove properties from unmounted
  //
  /*
  if (prevRender !== undefined) {
  	removeProperties(
  		utils,
  		delta,
  		prevRender
  	);
  }
  */

  // build
  //
  if (prevRender === undefined) {
    createAddedBuilds(utils, delta, render);
  }
  if (prevRender !== undefined) {
    adoptBuilds(delta, render, prevRender);
  }

  // properties
  //
  /*
  if (prevRender !== undefined) {
    removeProperties(utils, delta, prevRender);
    adoptProperties(utils, delta, render, prevRender);
  }
  addProperties(utils, delta, render);
	*/
  // mount
  //
  mountResults(
    utils,
    delta,
    render,
    parentNode,
    leftNode,
  );

  return render;
}

export { diff };
