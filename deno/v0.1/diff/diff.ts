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
import { adoptNodes, findTargets } from "./adopt.ts";
import { mountResults, mountRootToResults } from "./mounts.ts";

function diff<N>(
  utils: UtilsInterface<N>,
  source: RenderSource<N>,
  parentNode: N,
  leftNode?: N,
  prevRender?: Render<N>,
): Render<N> {
	// create structures
	// create new nodes from sources
	// if prevRender does not exist
	//		find all added nodes
	//		create nodes
	// if prevRender exists
	//		find survived nodes
	//		find added and removed nodes
	//
	// if parent node has changed
	//		unmount all top level nodes
	//		
	// unmount removed nodes
	// mount added nodes


  // create structures
  //
  const render: Render<N> = createRender<N>(utils, source, parentNode);
  const delta: DeltaTargets = {
    addedIndexes: [],
    addedDescIndexes: [],
    survivedIndexes: [],
    survivedDescIndexes: [],
    prevSurvivedIndexes: [],
    prevSurvivedDescIndexes: [],
    removedIndexes: [],
    removedDescIndexes: [],
  };

	// if parent node	

  // create source build
  //
  createNodesFromSource(utils, render, source);

  // find targets
  //
  if (prevRender === undefined) {
    findTargets(render, delta.addedIndexes, delta.addedDescIndexes, 0, 0);
  }
  if (prevRender !== undefined) {
    // find added, survived, and removed nodes
    // adoptNodes(prevRender, render, delta);
  }

  // unmount previous renders
  //

  // create new builds
  //
  // adopt survivedNodes
  createAddedBuilds(utils, delta, render);

  console.log(render);
  console.log(delta);

  // mount new renders
  mountResults(utils, delta, render, parentNode);
  // if parent roots changed

  mountRootToResults(utils, delta, render, parentNode, leftNode);

  return render;
}

export { diff };
