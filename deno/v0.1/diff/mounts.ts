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
import { parse } from "../deps.ts";

function unmountResultChunk<N>(
  utils: UtilsInterface<N>,
  result: RenderResult<N>,
  parent: N,
  left?: N,
) {
  const node = utils.getIfNode(result);
  if (node !== undefined) {
    utils.insertNode(node, parent, left);
    return node;
  }

  if (result instanceof Build) {
    let leftNode = left;
    for (const node of result.nodes) {
      utils.removeNode(node, parent, leftNode);
      leftNode = node;
    }
    return leftNode;
  }
}

// we are adding all descendants to parent
function unmountResults<N>(
  utils: UtilsInterface<N>,
  delta: DeltaTargets,
  render: Render<N>,
  parent: N,
) {
  // mount descendants
  for (const removedIndex of delta.removedIndexes) {
    const result = render.results[removedIndex];
    // avoids "undefined" as well, including root result
    if (!(result instanceof Build)) continue;

    const renderNode = render.nodes[removedIndex];
    // for each descendant
    for (let index = 0; index < result.descendants.length; index++) {
      const descIndexes = renderNode.descendants[index];

      const { parentNode, node } = result.descendants[index];
      let leftNode = node;
      for (const descIndex of descIndexes) {
        const descResult = render.results[descIndex];
        leftNode = unmountResultChunk(
          utils,
          descResult,
          parentNode ?? parent,
          leftNode,
        );
      }
    }
  }
}

function mountResultChunk<N>(
  utils: UtilsInterface<N>,
  result: RenderResult<N>,
  parent: N,
  left?: N,
) {
  const node = utils.getIfNode(result);
  if (node !== undefined) {
    utils.insertNode(node, parent, left);
    return node;
  }

  if (result instanceof Build) {
    let leftNode = left;
    for (const node of result.nodes) {
      utils.insertNode(node, parent, leftNode);
      leftNode = node;
    }
    return leftNode;
  }
}

// we are adding all descendants to parent
function mountResults<N>(
  utils: UtilsInterface<N>,
  delta: DeltaTargets,
  render: Render<N>,
  parent: N,
) {
  // mount descendants
  for (const addedIndex of delta.addedIndexes) {
    const result = render.results[addedIndex];
    // avoids "undefined" as well, including root result
    if (!(result instanceof Build)) continue;

    const renderNode = render.nodes[addedIndex];
    // for each descendant
    for (let index = 0; index < result.descendants.length; index++) {
      const descIndexes = renderNode.descendants[index];

      const { parentNode, node } = result.descendants[index];
      let leftNode = node;
      for (const descIndex of descIndexes) {
        const descResult = render.results[descIndex];
        leftNode = mountResultChunk(
          utils,
          descResult,
          parentNode ?? parent,
          leftNode,
        );
      }
    }
  }
}

function mountRootToResults<N>(
  utils: UtilsInterface<N>,
  delta: DeltaTargets,
  render: Render<N>,
  parent: N,
  left?: N,
) {
  // root node is always a node
  const rootNode = render.nodes[0];
  let leftNode = left;
  for (const index of rootNode.descendants[0]) {
    const result = render.results[index];
    leftNode = mountResultChunk(utils, result, parent, leftNode);
  }
}

export { mountResults, mountRootToResults, unmountResults };
