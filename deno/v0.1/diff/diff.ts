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



import { adoptNodes, adoptSurvivedTargets, findTargets } from "./adopt.ts";

// import { mountResults, mountRootToResults, unmountResults } from "./mounts.ts";

function diff<N>(
  utils: UtilsInterface<N>,
  source: RenderSource<N>,
  parentNode: N,
  leftNode?: N,
  prevRender?: Render<N>,
): Render<N> {
  const render: Render<N> = createRender<N>(utils, source, parentNode);
  createNodesFromSource(utils, render);
  
  const delta: DeltaTargets = {
    addedIndexes: [],
    survivedIndexes: [],
    prevSurvivedIndexes: [],
    removedIndexes: [],
  };

  if (prevRender === undefined) {
	  findTargets(render, delta.addedIndexes, 0);
  }

  createAddedBuilds(utils, delta, render);
  
	console.log(delta);
	console.log(render);
	
  // mountResults(utils, delta, render, parentNode);
  
  // need ability to add parent to descending nodes
  // go from node to node, and add parent
  // if no parent exists on the descendant build, then use the parent

  return render;
}

export { diff };
