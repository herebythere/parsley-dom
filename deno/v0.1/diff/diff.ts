import type { UtilsInterface } from "../type_flyweight/utils.ts";
import type {
  DeltaTargets,
  Render,
  RenderNode,
  RenderSource,
} from "../type_flyweight/render.ts";

import {
  createAddedBuilds,
  createNodesFromSource,
  createRender,
} from "./build.ts";

import { findTargets } from "./nodes.ts";

import { mountResults, mountRootToResults } from "./mounts.ts";

// need to create * lists of things *
// which means arrays need to be accounted for as arguments

// add sources that are an array to nodes and results
// if node add node with no descendants
// if source add node with descendants
// if another array, with descendants

// import { findTargets } from "./adopt.ts";

// first node should be the root node

// account for arrays
//
// create render +
// create nodes from source +
// find targets
// adopt nodes
// unmount results
// create added builds
// adopt builds
//

function diff<N>(
  utils: UtilsInterface<N>,
  source: RenderSource<N>,
  parentNode: N,
  leftNode?: N,
  prevRender?: Render<N>,
): Render<N> {
  // render needs a reference to parent node?
  // create structures
  //
  const render: Render<N> = createRender<N>(utils, source);
  const delta: DeltaTargets = {
    addedIndexes: [],
    survivedIndexes: [],
    prevSurvivedIndexes: [],
    removedIndexes: [],
  };

  if (prevRender === undefined) {
    createNodesFromSource(utils, render, source);
    findTargets(delta.addedIndexes, render, 0);
  }

  createAddedBuilds(utils, delta, render);

  console.log(render);
  console.log(delta);

  mountResults(utils, delta, render, parentNode);

  // if parent roots changed
  mountRootToResults(utils, delta, render, parentNode, leftNode);

  return render;
}

export { diff };
