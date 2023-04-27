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

import { mountResults } from "./mounts.ts";

// need to create * lists of things *
// which means arrays need to be accounted for as arguments

// add sources that are an array to nodes and results
// if node add node with no descendants
// if source add node with descendants
// if another array, with descendants

import { findTargets } from "./adopt.ts";

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
  // create structures
  //
  const render: Render<N> = createRender<N>(source, parentNode);
  const delta: DeltaTargets = {
    addedIndexes: [],
    survivedIndexes: [],
    prevSurvivedIndexes: [],
    removedIndexes: [],
  };

  // diff check
  //
  createNodesFromSource(utils, render, source);
  if (prevRender === undefined) {
    findTargets(delta.addedIndexes, render, 0);
  }

  // build
  //
  if (prevRender === undefined) {
    console.log("prevRender doesnt Exists!");
    createAddedBuilds(utils, delta, render);
  }

  // mount
  //
  console.log(render);
  mountResults(
    utils,
    delta,
    render,
    leftNode,
  );

  /*
  if (prevRender !== undefined) {
    adoptNodes(delta, render, prevRender);
  }
  */

  // unmount
  //
  /*
  if (prevRender !== undefined) {
    unmountResults(
      utils,
      delta,
      prevRender,
      parentNode,
      leftNode,
    );
  }
  */

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

  /*
  if (prevRender !== undefined) {
    adoptBuilds(delta, render, prevRender);
  }
  */

  // properties
  //
  /*
  if (prevRender !== undefined) {
    removeProperties(utils, delta, prevRender);
    adoptProperties(utils, delta, render, prevRender);
  }
  addProperties(utils, delta, render);
	*/

  return render;
}

export { diff };
