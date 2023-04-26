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

function createAddedBuilds<N>(
  utils: UtilsInterface<N>,
  delta: DeltaTargets,
  render: Render<N>,
) {
  for (const index of delta.addedIndexes) {
    const source = render.sources[index];

    let result: RenderResult<N> = utils.getIfNode(source);
    if (source instanceof Draw) {
      result = getBuild(utils, source);
    }
    if (result === undefined && source !== undefined) {
      result = utils.createTextNode(source);
    }
    render.results[index] = result;
  }
}

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

function getBuilderData<N>(
  utils: UtilsInterface<N>,
  template: Readonly<string[]>,
) {
  let builderData = utils.getBuilder(template);
  if (builderData === undefined) {
    const builder = new Builder();
    parse(template, builder);
    builderData = builder.build(utils, template);
  }

  if (builderData !== undefined) {
    utils.setBuilder(template, builderData);
  }

  return builderData;
}

function getBuild<N>(
  utils: UtilsInterface<N>,
  draw: DrawInterface,
): BuildInterface<N> | undefined {
  const builderData = getBuilderData(
    utils,
    draw.templateStrings,
  );

  if (builderData !== undefined) {
    return new Build(utils, builderData);
  }
}

function compareSources<N>(
  source: RenderSource<N>,
  prevSource: RenderSource<N>,
) {
  if (source instanceof Draw && prevSource instanceof Draw) {
    return source.templateStrings === prevSource.templateStrings;
  }

  return source === prevSource;
}

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
    for (const descIndex of node.descendants) {
      targets.push(descIndex);
    }

    index += 1;
  }
}

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
        delta.prevSurvivedIndexes.push(prevDescIndex);
        delta.survivedIndexes.push(currDescIndex);
        continue;
      }

      findTargets(delta.removedIndexes, prevRender, prevDescIndex);
      findTargets(delta.addedIndexes, render, currDescIndex);
    }

    index += 1;
  }
}

// create renders and add
function createNodesFromSource<N>(
  utils: UtilsInterface<N>,
  render: Render<N>,
) {
  let index = 0;
  while (index < render.sources.length) {
    const node = render.nodes[index];
    const source = render.sources[index];

    if (source instanceof Draw) {
      let data = getBuilderData(utils, source.templateStrings);
      if (data !== undefined) {
        for (const descendant of data.descendants) {
          const { index } = descendant;
          const descSource = source.injections[index];

          // add source and descendant to render
          render.sources.push(descSource);
          const id = render.sources.length - 1;
          node.descendants.push(id);
          render.nodes.push({
            parentId: node.id,
            descendants: [],
            id,
          });
          render.results.push(undefined);
        }
      }
    }

    index += 1;
  }
}

export {
  adoptBuilds,
  adoptNodes,
  createAddedBuilds,
  createNodesFromSource,
  findTargets,
};
