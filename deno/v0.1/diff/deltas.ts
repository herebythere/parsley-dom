import type { DeltaTargets, Render } from "../type_flyweight/render.ts";

import { findTargets, SourceLink } from "./utils.ts";

// sources are equal

function addRemove<N>(
  render: Render<N>,
  prevRender: Render<N>,
  delta: DeltaTargets,
  sourceIndex: number,
  prevSourceIndex: number,
) {
  findTargets(render, delta.addedIndexes, sourceIndex);
  findTargets(prevRender, delta.removedIndexes, prevSourceIndex);
}

function getDeltas<N>(
  render: Render<N>,
  prevRender: Render<N>,
  delta: DeltaTargets,
) {
  // take two renders
  let index = 0;
  while (index < render.root.length && index < prevRender.root.length) {
    const sourceIndex = render.root[index];
    const prevSourceIndex = prevRender.root[index];

    const source = render.sources[sourceIndex];
    const prevSource = prevRender.sources[prevSourceIndex];

    // if theyre equal
    if (prevSource instanceof SourceLink && source instanceof SourceLink) {
      const draw = render.draws[source.drawIndex];
      const prevDraw = prevRender.draws[prevSource.drawIndex];

      if (prevDraw.templateStrings !== draw.templateStrings) {
        // add remove
        findTargets(render, delta.addedIndexes, sourceIndex);
        findTargets(prevRender, delta.removedIndexes, prevSourceIndex);
        delta.remountRoot = true;
      } else {
        // add to build
        render.builds[sourceIndex] = prevRender.builds[prevSourceIndex];
        delta.survivedIndexes.push(sourceIndex);
        delta.prevSurvivedIndexes.push(prevSourceIndex);
      }
    } else {
      if (prevSource !== source) {
        // add remove
        findTargets(render, delta.addedIndexes, sourceIndex);
        findTargets(prevRender, delta.removedIndexes, prevSourceIndex);
        delta.remountRoot = true;
      } else {
        // add to build
        render.builds[index] = prevRender.builds[index];
      }
    }

    index += 1;
  }

  while (index < render.root.length) {
    findTargets(render, delta.addedIndexes, render.root[index]);
    delta.remountRoot = true;
    index += 1;
  }
  while (index < prevRender.root.length) {
    findTargets(prevRender, delta.removedIndexes, prevRender.root[index]);
    delta.remountRoot = true;
    index += 1;
  }

  // now survived indexes
  //
  let survivedIndex = 0;
  while (survivedIndex < delta.survivedIndexes.length) {
    const sourceIndex = delta.survivedIndexes[survivedIndex];
    const prevSourceIndex = delta.prevSurvivedIndexes[survivedIndex];

    survivedIndex += 1;

    const source = render.sources[sourceIndex];
    const prevSource = prevRender.sources[prevSourceIndex];

    // they should always be source links
    if (!(prevSource instanceof SourceLink && source instanceof SourceLink)) {
      continue;
    }

    render.parents.push(prevRender.parents[prevSource.parentIndex]);
    source.parentIndex = render.parents.length - 1;

    const nodes = render.nodes[source.nodeIndex];
    const prevNodes = prevRender.nodes[prevSource.nodeIndex];

    for (let nodeIndex = 0; nodeIndex < nodes.length; nodeIndex++) {
      const node = nodes[nodeIndex];
      const prevNode = prevNodes[nodeIndex];

      let resetIndex = false;

      let descIndex = 0;
      while (descIndex < node.length && descIndex < prevNode.length) {
        const sourceIndex = node[descIndex];
        const prevSourceIndex = prevNode[descIndex];

        const source = render.sources[sourceIndex];
        const prevSource = prevRender.sources[prevSourceIndex];

        // if theyre equal

        if (
          prevSource instanceof SourceLink && source instanceof SourceLink
        ) {
          const draw = render.draws[source.drawIndex];
          const prevDraw = prevRender.draws[prevSource.drawIndex];

          if (prevDraw.templateStrings !== draw.templateStrings) {
            // add remove
            findTargets(render, delta.addedIndexes, sourceIndex);
            findTargets(prevRender, delta.removedIndexes, prevSourceIndex);
            resetIndex = true;
          } else {
            // add to build
            render.builds[sourceIndex] = prevRender.builds[prevSourceIndex];
            delta.survivedIndexes.push(sourceIndex);
            delta.prevSurvivedIndexes.push(prevSourceIndex);
          }
        } else {
          if (prevSource !== source) {
            // add remove
            findTargets(render, delta.addedIndexes, sourceIndex);
            findTargets(prevRender, delta.removedIndexes, prevSourceIndex);
            resetIndex = true;
          } else {
            // add to build
            render.builds[index] = prevRender.builds[index];
          }
        }

        descIndex += 1;
      }

      while (descIndex < node.length) {
        findTargets(render, delta.addedIndexes, node[descIndex]);
        resetIndex = true;
        descIndex += 1;
      }
      while (descIndex < prevNode.length) {
        findTargets(prevRender, delta.removedIndexes, prevNode[descIndex]);
        resetIndex = true;
        descIndex += 1;
      }

      if (resetIndex) {
        delta.prevDescIndexes.push(prevSourceIndex);
        delta.descIndexes.push(sourceIndex);
        delta.descArrayIndexes.push(nodeIndex);
      }
    }
  }
}

export { getDeltas };
