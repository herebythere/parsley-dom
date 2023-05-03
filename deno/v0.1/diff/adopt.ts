import type {
  DeltaTargets,
  Render,
  RenderSource,
} from "../type_flyweight/render.ts";

import { Draw } from "../draw/draw.ts";

function adoptSurvivedNodes(
	render: Render<N>,
	delta: DeltaTargets,
) {

}

function findTargets<N>(
  render: Render<N>,
  targets: number[],
  descTargets: number[],
  nodeIndex: number,
  nodeDescIndex: number,
) {
  targets.push(nodeIndex);
  descTargets.push(nodeDescIndex);

  let index = targets.length - 1;
  while (index < targets.length) {
    const targetIndex = targets[index];
    const targetDescIndex = descTargets[index];

    const node = render.nodes[targetIndex];
    const nodeDescIndexes = node.descendants[targetDescIndex];
    for (const nodeIndex of nodeDescIndexes) {
      const descNode = render.nodes[nodeIndex];

      for (let descIndex = 0; index < descNode.descendants.length; index++) {
        targets.push(nodeIndex);
        descTargets.push(descIndex);
      }
    }

    index += 1;
  }
}

function compareSources<N>(
  prevRender: Render<N>,
  render: Render<N>,
  prevDescendants: number[],
  descendants: number[],
) {
  if (prevDescendants.length !== descendants.length) return false;

  for (let index = 0; index < descendants.length; index++) {
    const prevSourceIndex = prevDescendants[index];
    const sourceIndex = descendants[index];

    const prevSource = prevRender.sources[prevSourceIndex];
    const source = render.sources[sourceIndex];

    if (prevSource instanceof Draw && source instanceof Draw) {
      if (prevSource.templateStrings !== source.templateStrings) return false;
      continue;
    }

    if (prevSource !== source) return false;
  }
}

function adoptNodes<N>(
  render: Render<N>,
  prevRender: Render<N>,
  delta: DeltaTargets,
) {
  // might need to compare first then add
  delta.prevSurvivedIndexes.push(0);
  delta.survivedIndexes.push(0);

  // walk through root nodes and descendants
  let survIndex = 0;
  while (survIndex < delta.survivedIndexes.length) {
    const prevParentIndex = delta.prevSurvivedIndexes[survIndex];
    const parentIndex = delta.survivedIndexes[survIndex];

    const prevRenderNode = prevRender.nodes[prevParentIndex];
    const renderNode = render.nodes[parentIndex];

    // iterate through minimal descendant arrays
    const descArrayLength = Math.max(
      prevRenderNode.descendants.length,
      renderNode.descendants.length,
    );

    // for each descendant array
    for (
      let descArrayIndex = 0;
      descArrayIndex < descArrayLength;
      descArrayIndex++
    ) {
      const prevDescIndexes = prevRenderNode.descendants[descArrayIndex];
      const descIndexes = renderNode.descendants[descArrayIndex];

      // compare array
      if (compareSources(prevRender, render, prevDescIndexes, descIndexes)) {
        // sources are the same
        delta.survivedIndexes.push(parentIndex);
        delta.survivedDescIndexes.push(descArrayIndex);
        delta.prevSurvivedIndexes.push(prevParentIndex);
        delta.prevSurvivedDescIndexes.push(descArrayIndex);
        continue;
      }

      // sources are different
      // remove old nodes
      findTargets(
        render,
        delta.removedIndexes,
        delta.removedDescIndexes,
        prevParentIndex,
        descArrayIndex,
      );
      // add new nodes
      findTargets(
        render,
        delta.addedIndexes,
        delta.addedDescIndexes,
        parentIndex,
        descArrayIndex,
      );
    }

    // remove leftover descendant arrays from prev descendants
    if (descArrayLength < prevRenderNode.descendants.length) {
      for (
        let index = descArrayLength;
        index < prevRenderNode.descendants.length;
        index++
      ) {
        findTargets(
          render,
          delta.removedIndexes,
          delta.removedDescIndexes,
          prevParentIndex,
          index,
        );
      }
    }

    // add leftover descendant arrays from curr descendants
    if (descArrayLength < renderNode.descendants.length) {
      for (
        let index = descArrayLength;
        index < prevRenderNode.descendants.length;
        index++
      ) {
        findTargets(
          render,
          delta.addedIndexes,
          delta.addedDescIndexes,
          parentIndex,
          index,
        );
      }
    }

    survIndex += 1;
  }
}

export { adoptNodes, findTargets };
