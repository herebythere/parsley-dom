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

/*
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
  console.log("mount result chunk", result);
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

function mountParentNode<N>(
  utils: UtilsInterface<N>,
  delta: DeltaTargets,
  render: Render<N>,
  parent: N,
  left?: N,
) {
	/*
  if (delta.addedIndexes.length === 0) return;

  const node = render.nodes[0];
  console.log("root needs to be added", node);
  if (node !== undefined) {
    let leftNode = left;
    console.log("add children");
    for (const descIndex of node.descendants) {
      console.log("descIndex", descIndex);
      const descResult = render.results[descIndex];
      leftNode = mountResultChunk(
        utils,
        descResult,
        parent,
        leftNode,
      );
    }
  }

}
*/

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

export { mountResults, mountRootToResults };
