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

// need to create * lists of things *
// which means arrays need to be accounted for as arguments

// add sources that are an array to nodes and results
// if node add node with no descendants
// if source add node with descendants
// if another array, with descendants

import {
  adoptBuilds,
  adoptNodes,
  createAddedBuilds,
  createNodesFromSource,
  findTargets,
} from "./nodes.ts";

// first node should be the root node

// account for arrays
//
// create render
// create nodes from source
// find targets
// adopt nodes
// unmount results
// create added builds
// adopt builds
//

function createRender<N>(
  source: RenderSource<N>,
  parentNode: N,
) {
  const node = { id: 0, parentId: -1, descendants: [] };
  const render: Render<N> = {
    results: [undefined],
    sources: [parentNode],
    nodes: [node],
  };

  if (Array.isArray(source)) {
    for (const chunk of source) {
      render.sources.push(chunk);
      const id = render.sources.length - 1;
      render.nodes.push({ id, parentId: node.id, descendants: [] });
      render.results.push(undefined);
    }

    return render;
  }

  render.sources.push(source);
  const id = render.sources.length - 1;
  render.nodes.push({ id, parentId: node.id, descendants: [] });
  render.results.push(undefined);

  return render;
}

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

  // create sources
  //
  createNodesFromSource(utils, render, source);

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
