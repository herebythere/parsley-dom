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

import { findTargets, adoptNodes } from "./adopt.ts";

import { mountResults, mountRootToResults } from "./mounts.ts";

function diff<N>(
  utils: UtilsInterface<N>,
  source: RenderSource<N>,
  parentNode: N,
  leftNode?: N,
  prevRender?: Render<N>,
): Render<N> {
  // create structures
  //
  const render: Render<N> = createRender<N>(utils, source);
  const delta: DeltaTargets = {
    addedIndexes: [],
    survivedIndexes: [],
    prevSurvivedIndexes: [],
    removedIndexes: [],
  };

	// create source build
	//
  createNodesFromSource(utils, render, source);
  
	// find targets
	//
  if (prevRender === undefined) {
    findTargets(delta.addedIndexes, render, 0);
  }
  if (prevRender !== undefined) {
  	// find added, survived, and removed nodes
  	adoptNodes(prevRender, render, delta);
  }

	// build from targets
	//
	
	
	// unmount previous render
	//

	// create new builds 
	//
  // adopt survivedNodes
  createAddedBuilds(utils, delta, render);


  console.log(render);
  console.log(delta);

  mountResults(utils, delta, render, parentNode);
  // if parent roots changed
  mountRootToResults(utils, delta, render, parentNode, leftNode);

  return render;
}

export { diff };
