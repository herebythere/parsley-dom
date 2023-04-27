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

function unmountResult<N>(
  utils: UtilsInterface<N>,
  result: RenderResult<N>,
  parent: N,
  left?: N,
) {
  const node = utils.getIfNode(result);
  if (node !== undefined) {
    utils.removeNode(node, parent, left);
  }

  if (result instanceof Build) {
    let leftNode = left;
    for (const node of result.nodes) {
      utils.removeNode(node, parent, leftNode);
    }
  }
}

function unmountResults<N>(
  utils: UtilsInterface<N>,
  delta: DeltaTargets,
  render: Render<N>,
  parent: N,
  left?: N,
) {
  if (delta.removedIndexes.length === 0) return;
  if (delta.removedIndexes[0] === 0) {
    const result = render.results[0];
    unmountResult(
      utils,
      result,
      parent,
      left,
    );
  }

  for (let index = 0; index < delta.removedIndexes.length; index++) {
    const result = render.results[index];
    if (!(result instanceof Build)) continue;

    const resultNode = render.nodes[index];
    for (
      let descIndex = 0;
      descIndex < resultNode.descendants.length;
      descIndex++
    ) {
      const descNodeIndex = resultNode.descendants[descIndex];
      const descResult = render.results[descNodeIndex];

      let { parentNode, node } = result.descendants[descIndex];
      if (parentNode === undefined) {
        parentNode = parent;
      }

      unmountResult(
        utils,
        descResult,
        parentNode,
        node,
      );
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
  left?: N,
) {
  if (delta.addedIndexes.length === 0) return;

  console.log("mount results!");
  // mount root
  const firstIndex = delta.addedIndexes[0];
  if (firstIndex === 0) {
    // root is first added index
    const result = utils.getIfNode(render.results[firstIndex]);
    if (result !== undefined) {
      const node = render.nodes[firstIndex];
      let leftNode = left;
      for (const descIndex of node.descendants) {
        const descResult = render.results[descIndex];
        leftNode = mountResultChunk(
          utils,
          descResult,
          result,
          left,
        );
      }
    }
  }

  // mount descendants
  for (
    let addedIndex = 1;
    addedIndex < delta.addedIndexes.length;
    addedIndex++
  ) {
    const index = delta.addedIndexes[addedIndex];
    const result = render.results[index];
    if (!(result instanceof Build)) continue;

    const renderNode = render.nodes[index];
    for (
      let descIndex = 0;
      descIndex < renderNode.descendants.length;
      descIndex++
    ) {
      const descNodeIndex = renderNode.descendants[descIndex];
      const descResult = render.results[descNodeIndex];

      let { parentNode, node } = result.descendants[descIndex];
      if (parentNode === undefined) {
        parentNode = parent;
      }

      mountResultChunk(
        utils,
        descResult,
        parentNode,
        node,
      );
    }
  }
}

export { mountResults, unmountResults };
