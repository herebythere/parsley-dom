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
  const render: Render<N> = createRender<N>(utils, source);
  
  // create nodes frorm source
  // - no matter what, the *new* structure *is* the structure to be presented

  createNodesFromSource(utils, render);
  console.log(render);
  
  const delta: DeltaTargets = {
    addedIndexes: [],
    survivedIndexes: [],
    prevSurvivedIndexes: [],
    removedIndexes: [],
  };
  
  if (prevRender === undefined) {
  	for (const index of render.nodes[0][0]) {
	    findTargets(render, delta.addedIndexes, index);
  	}
  }
  console.log(delta);
  
  createAddedBuilds(utils, delta, render);
	/*
  if (prevRender !== undefined) {
    adoptNodes(prevRender, render, delta);
  }

  // parent root has changed
  unmountResults(utils, delta, render, parentNode);

  if (prevRender !== undefined) {
    adoptSurvivedTargets(prevRender, render, delta);
  }

  createAddedBuilds(utils, delta, render);

  console.log(render);
  console.log(delta);

  mountResults(utils, delta, render, parentNode);

  if (prevRender === undefined) {
    // or if parent roots changed
    mountRootToResults(utils, delta, render, parentNode, leftNode);
  }
	*/

  return render;
}

export { diff };
