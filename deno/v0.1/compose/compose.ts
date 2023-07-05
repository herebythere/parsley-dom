// unmount

// compose

import type { UtilsInterface } from "../type_flyweight/utils.ts";
import type {
  DeltaTargets,
  Render,
  RenderSource,
} from "../type_flyweight/render.ts";

import { Build } from "../build/build.ts";
import { buildRender, createAddedBuilds } from "./build.ts";
import { findTargets, SourceLink } from "./utils.ts";
import { getDeltas } from "./deltas.ts";

import {
  mountBuilds,
  mountChangedAreas,
  mountNodes,
  unmountBuilds,
  unmountChangedAreas,
} from "./mounts.ts";

// one time compose, no diffs retuns new render
// function compose()

// order:
// create sources
// unmount changed areas
// remove changed nodes
// create added nodes
// mount changed areas
// mount added nodes

function diff<N>(
  utils: UtilsInterface<N>,
  source: RenderSource<N>,
  parentNode: N,
  leftNode?: N,
  prevRender?: Render<N>,
): Render<N> {
  // create current render
  const render: Render<N> = {
    root: [],
    sources: [],
    draws: [],
    builds: [],
    parents: [parentNode],
    nodes: [],
  };

  const delta: DeltaTargets = {
    remountRoot: false,
    addedIndexes: [],
    prevSurvivedIndexes: [],
    survivedIndexes: [],
    descIndexes: [],
    prevDescIndexes: [],
    descArrayIndexes: [],
    removedIndexes: [],
  };

  // create sources
  buildRender<N>(utils, render, source);

  // compare to previous render
  if (prevRender === undefined) {
    // for every source in root
    // if source is a draw add descendant indexes
    for (const sourceIndex of render.root) {
      findTargets(render, delta.addedIndexes, sourceIndex);
    }
  }

  // unmount changed areas
  // unmount removed nodes
  if (prevRender !== undefined) {
    getDeltas(render, prevRender, delta);
    unmountChangedAreas(utils, prevRender, delta);
    unmountBuilds(utils, prevRender, delta, delta.removedIndexes);
  }

  // create added builds
  createAddedBuilds(utils, delta, render);

  // mount changed areas
  if (prevRender !== undefined) {
    mountChangedAreas(
      utils,
      render,
      delta,
    );
  }

  // mount root
  if (prevRender === undefined) {
    // or if parentNode and leftNode changed
    mountBuilds(utils, render, render.root, parentNode, leftNode);
  }

  mountNodes(utils, render, delta);

  console.log("\n", delta, render);

  return render;
}

export { diff };
