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

import { findTargets } from "./utils.ts";

// one time compose, no diffs retuns new render
// function compose()


function diff<N>(
  utils: UtilsInterface<N>,
  source: RenderSource<N>,
  parentNode: N,
  leftNode?: N,
  prevRender?: Render<N>,
): Render<N> {
	// create current render
  const render: Render<N> = createRender<N>(utils, source, parentNode);
  
  // build initial structure
  createNodesFromSource(utils, render);
  
  /*
  const delta: DeltaTargets = {
    addedIndexes: [],
    survivedIndexes: [],
    prevSurvivedIndexes: [],
    removedIndexes: [],
  };

  if (prevRender === undefined) {
  	// for every source in root
  	// if source is a draw add descendant indexes
	  findTargets(render, delta.addedIndexes, 0);
  }

	// this stays the same essentially
  createAddedBuilds(utils, delta, render);

	console.log(delta);
	*/

  console.log(render);
  return render;
}

export { diff };
