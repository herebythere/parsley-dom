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
	
	elements can be "pre-rendered" and then used throughout the tree
	(html being stateful and linking to animations requires an instance surviving renders)
	
	draws are the only object that truly expand a tree

	sources: node | NodeLink
	nodes: node[]
	draws: draw[]
	builds: draw[]

	relational class
	NodeLink {
		drawIndex: number; (is build index too)
		nodeIndex: number;
	}
	
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
  const render: Render<N> = createRender<N>(utils, source);
  const delta: DeltaTargets = {
    addedIndexes: [],
    survivedIndexes: [],
    prevSurvivedIndexes: [],
    removedIndexes: [],
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
