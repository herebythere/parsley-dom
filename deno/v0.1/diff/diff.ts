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

  return render;
}

export { diff };
