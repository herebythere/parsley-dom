import type { UtilsInterface } from "../type_flyweight/utils.ts";
import type {
  DeltaTargets,
  Render,
  RenderSource,
} from "../type_flyweight/render.ts";

import { buildRender, createAddedBuilds } from "./build.ts";
import { findTargets, SourceLink } from "./utils.ts";
import { Build } from "../build/build.ts";
import { getDeltas } from "./deltas.ts";

// one time compose, no diffs retuns new render
// function compose()

// order:
// create sources
// unmount changed areas
// remove changed nodes
// create added nodes
// mount changed areas
// mount added nodes

function mountBuilds<N>(
  utils: UtilsInterface<N>,
  render: Render<N>,
  sourceIndexes: number[],
  parentNode: N,
  prevNode?: N,
) {
  let prev = prevNode;
  for (const sourceIndex of sourceIndexes) {
    const build = render.builds[sourceIndex];
    if (build instanceof Build) {
      for (const node of build.nodes) {
        utils.insertNode(node, parentNode, prev);
        prev = node;
      }
    }

    const node = utils.getIfNode(build);
    if (node !== undefined) {
      utils.insertNode(node, parentNode, prev);
      prev = node;
    }
  }
}

function mountNodes<N>(
  utils: UtilsInterface<N>,
  render: Render<N>,
  delta: DeltaTargets,
) {
  for (const sourceIndex of delta.addedIndexes) {
    const source = render.sources[sourceIndex];
    const buildSource = render.builds[sourceIndex];
    if (source instanceof SourceLink && buildSource instanceof Build) {
      const parent = render.parents[source.parentIndex];
      const nodes = render.nodes[source.nodeIndex];

      for (let arrayIndex = 0; arrayIndex < nodes.length; arrayIndex++) {
        const descs = nodes[arrayIndex];
        const { node, parentNode } = buildSource.descendants[arrayIndex];

        mountBuilds(
          utils,
          render,
          descs,
          parentNode ?? parent,
          node,
        );
      }
    }
  }
}

function mountChangedAreas<N>(
  utils: UtilsInterface<N>,
  render: Render<N>,
  delta: DeltaTargets,
) {
  for (let index = 0; index < delta.descIndexes.length; index++) {
    const renderIndex = delta.descIndexes[index];
    const source = render.sources[renderIndex];
    if (!(source instanceof SourceLink)) continue;

    const nodes = render.nodes[source.nodeIndex];
    const descArrayIndex = delta.descArrayIndexes[index];
    const descs = nodes[descArrayIndex];

    const build = render.builds[renderIndex];
    if (!(build instanceof Build)) continue;

    const { node, parentNode } = build.descendants[descArrayIndex];

    mountBuilds(
      utils,
      render,
      descs,
      parentNode ?? render.parents[source.parentIndex],
      node,
    );
  }
}

function unmountBuilds<N>(
  utils: UtilsInterface<N>,
  render: Render<N>,
  delta: DeltaTargets,
  sourceIndexes: number[],
) {
  for (const sourceIndex of sourceIndexes) {
    const build = render.builds[sourceIndex];
    const nodeBuild = utils.getIfNode(build);
    if (nodeBuild !== undefined) {
      utils.removeNode(nodeBuild);
    }

    if (build instanceof Build) {
      for (const node of build.nodes) {
        utils.removeNode(node);
      }
    }
  }
}

function unmountChangedAreas<N>(
  utils: UtilsInterface<N>,
  prevRender: Render<N>,
  delta: DeltaTargets,
) {
  for (let index = 0; index < delta.prevDescIndexes.length; index++) {
    const prevRenderIndex = delta.prevDescIndexes[index];
    const prevSource = prevRender.sources[prevRenderIndex];
    if (!(prevSource instanceof SourceLink)) continue;

    const prevNodes = prevRender.nodes[prevSource.nodeIndex];
    const descArrayIndex = delta.descArrayIndexes[index];
    const prevDescs = prevNodes[descArrayIndex];

    unmountBuilds(utils, prevRender, delta, prevDescs);
  }
}

export {
  mountBuilds,
  mountChangedAreas,
  mountNodes,
  unmountBuilds,
  unmountChangedAreas,
};
