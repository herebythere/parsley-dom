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

/*
function adoptBuilds<N>(
  delta: DeltaTargets,
  render: Render<N>,
  prevRender: Render<N>,
) {
  for (let index = 0; index < delta.survivedIndexes.length; index++) {
    const prevIndex = delta.prevSurvivedIndexes[index];
    const currIndex = delta.survivedIndexes[index];

    const result = prevRender.results[prevIndex];
    render.results[currIndex] = result;
  }
}

function compareSources<N>(
  source: RenderSource<N>,
  prevSource: RenderSource<N>,
) {
  // compare arrays
  if (Array.isArray(source) && Array.isArray(prevSource)) {
    if (source.length !== prevSource.length) return false;
    for (let index = 0; index < source.length; index++) {
      if (source[index] !== prevSource[index]) return false;
    }

    return true;
  }

  if (source instanceof Draw && prevSource instanceof Draw) {
    return source.templateStrings === prevSource.templateStrings;
  }

  return source === prevSource;
}
*/

function findTargets<N>(
  targets: number[],
  render: Render<N>,
  sourceIndex: number,
) {
  targets.push(sourceIndex);

  let index = targets.length - 1;
  while (index < targets.length) {
    const nodeIndex = targets[index];
    const node = render.nodes[nodeIndex];
    for (const descIndexes of node.descendants) {
      for (const descIndex of descIndexes) {
        targets.push(descIndex);
      }
    }

    index += 1;
  }
}

/*
function adoptNodes<N>(
  delta: DeltaTargets,
  render: Render<N>,
  prevRender: Render<N>,
) {
  let index = 0;

  // compare root nodes
  const prev = prevRender.sources[index];
  const curr = render.sources[index];
  if (!compareSources(prev, curr)) {
    // findRemovedTargets
    findTargets(delta.removedIndexes, prevRender, index);
    // addCreationTargets
    findTargets(delta.addedIndexes, render, index);
    return;
  }

  // explore adopted nodes
  delta.survivedIndexes.push(index);
  delta.prevSurvivedIndexes.push(index);

  while (index < delta.survivedIndexes.length) {
    // if adopted, the sources and renders are already equal
    // if adopted, the source is only builds
    //
    const prevIndex = delta.prevSurvivedIndexes[index];
    const currIndex = delta.survivedIndexes[index];

    const prevNode = prevRender.nodes[prevIndex];
    const currNode = render.nodes[currIndex];

    // if adopted, the sources and renders are already equal
    for (
      let descIndex = 0;
      descIndex < prevNode.descendants.length;
      descIndex++
    ) {
      const prevDescIndex = prevNode.descendants[descIndex];
      const currDescIndex = currNode.descendants[descIndex];

      const prevDescSource = prevRender.sources[prevDescIndex];
      const currDescSource = render.sources[currDescIndex];

      if (compareSources(prevDescSource, currDescSource)) {
        delta.prevSurvivedInddexes.push(prevDescIndex);
        delta.survivedIndexes.push(currDescIndex);
        continue;
      }

      findTargets(delta.removedIndexes, prevRender, prevDescIndex);
      findTargets(delta.addedIndexes, render, currDescIndex);
    }

    index += 1;
  }
}
*/

export { findTargets };
