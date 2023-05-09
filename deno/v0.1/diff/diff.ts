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
import { mountResults, mountRootToResults, unmountResults } from "./mounts.ts";


/*
	Need to handle this from a different perspective
	
	"sources" can be nodes or draws (or later builds)
	
	render nodes only occur on root and on draws
	render nodes keep track of descendants and descendant arrays
	
	nodes should have:
	a source index
	a build index
	a parent node index
	descendant source indexes
	
*/
function diff<N>(
  utils: UtilsInterface<N>,
  source: RenderSource<N>,
  parentNode: N,
  leftNode?: N,
  prevRender?: Render<N>,
): Render<N> {
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

  createNodesFromSource(utils, render, source);
  console.log(render);
  console.log(delta);
	/*
  if (prevRender === undefined) {
    findTargets(render, delta.addedIndexes, delta.addedDescIndexes, 0, 0);
  }
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
