import type { UtilsInterface } from "../type_flyweight/utils.ts";
import type { DrawInterface } from "../type_flyweight/draw.ts";
import type { BuildInterface } from "../type_flyweight/build.ts";
import type {
  Render,
  RenderNode,
  RenderResult,
  RenderSource,
} from "../type_flyweight/render.ts";

import { Draw } from "../draw/draw.ts";
import { Build } from "../build/build.ts";
import { Builder } from "../builder/builder.ts";
import { parse } from "../deps.ts";

interface DeltaTargets {
  addedIndexes: number[];
  survivedIndexes: number[];
  prevSurvivedIndexes: number[];
  removedIndexes: number[];
}

// we are adding all descendants to parent
function mountAddedNodes<N>(
  utils: UtilsInterface<N>,
  delta: DeltaTargets,
  render: Render<N>,
  parent: N,
  left?: N,
) {
  // mount root
  const result = render.results[0];
  const node = utils.getIfNode(result);
  if (node !== undefined) {
    utils.insertNode(node, parent, left);
  }

  if (result instanceof Build) {
    let leftNode = left;
    for (const node of result.nodes) {
      utils.insertNode(node, parent, leftNode);
      leftNode = node;
    }
  }

  // mount descendants
  for (
    let addedIndex = 0;
    addedIndex < delta.addedIndexes.length;
    addedIndex++
  ) {
    const index = delta.addedIndexes[addedIndex];
    const result = render.results[index];
    if (!(result instanceof Build)) continue;

    const node = render.nodes[index];
    for (let descIndex = 0; descIndex < node.descendants.length; descIndex++) {
      const descNodeIndex = node.descendants[descIndex];
      const descResult = render.results[descNodeIndex];

      let { parentNode, node: leftNode } = result.descendants[descIndex];
      if (parentNode === undefined) {
        parentNode = parent;
      }

      const descNode = utils.getIfNode(descResult);
      if (descNode !== undefined) {
        utils.insertNode(descNode, parentNode, leftNode);
      }

      if (descResult instanceof Build) {
        for (const node of descResult.nodes) {
          utils.insertNode(node, parentNode, leftNode);
          leftNode = node;
        }
      }
    }
  }
}

function adoptProperties<N>(
  utils: UtilsInterface<N>,
  delta: DeltaTargets,
  render: Render<N>,
  prevRender: Render<N>,
) {
  for (let index = 0; index < delta.survivedIndexes.length; index++) {
    const source = render.sources[index];
    const prevSource = prevRender.sources[index];

    const result = render.results[index];
    if (
      source instanceof Draw && prevSource instanceof Draw &&
      result instanceof Build
    ) {
      for (const descIndex of result.injections) {
        // add injections from map
        // "ATTRIBUTE_MAP_INJECTION"
        // "ATTRIBUTE_INJECTION"

        // compare source stuff
      }
    }
  }
}

function removeProperties<N>(
  utils: UtilsInterface<N>,
  delta: DeltaTargets,
  render: Render<N>,
) {
  for (let index = 0; index < delta.addedIndexes.length; index++) {
    const source = render.sources[index];
    const result = render.results[index];
    if (source instanceof Draw && result instanceof Build) {
      for (const descIndex of result.injections) {
        // add injection map
        // "ATTRIBUTE_MAP_INJECTION"
        // "ATTRIBUTE_INJECTION"
      }
    }
  }
}

function addProperties<N>(
  utils: UtilsInterface<N>,
  delta: DeltaTargets,
  render: Render<N>,
) {
  for (let index = 0; index < delta.addedIndexes.length; index++) {
    const source = render.sources[index];
    const result = render.results[index];
    if (source instanceof Draw && result instanceof Build) {
      for (const descIndex of result.injections) {
        // add injections from map
        // "ATTRIBUTE_MAP_INJECTION"
        // "ATTRIBUTE_INJECTION"
      }
    }
  }
}

function unmountNodes<N>(
  utils: UtilsInterface<N>,
  delta: DeltaTargets,
  render: Render<N>,
  parentNode: N,
  leftNode?: N,
) {
  for (let index = 0; index < delta.removedIndexes.length; index++) {
    const result = render.results[index];
    if (!(result instanceof Build)) continue;

    const node = render.nodes[index];
    for (let descIndex = 0; descIndex < node.descendants.length; descIndex++) {
      const descNodeIndex = node.descendants[descIndex];
      const descResult = render.results[descNodeIndex];

      let { parentNode, node: leftNode } = result.descendants[descIndex];
      if (parentNode === undefined) {
        parentNode = parent;
      }

      const descNode = utils.getIfNode(descResult);
      if (descNode !== undefined) {
        utils.removeNode(descNode, parentNode, leftNode);
      }

      if (descResult instanceof Build) {
        for (const node of descResult.nodes) {
          utils.removeNode(node, parentNode, leftNode);
          // worry about left nodes
        }
      }
    }
  }
}

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

// first node should be the root node
function diff<N>(
  utils: UtilsInterface<N>,
  source: RenderSource<N>,
  parentNode: N,
  leftNode?: N,
  prevRender?: Render<N>,
): Render<N> {
  // create structures
  //
  const render: Render<N> = {
    results: [undefined],
    sources: [source],
    nodes: [{
      id: 0,
      descendants: [],
      parentId: -1,
    }],
  };

  const delta: DeltaTargets = {
    addedIndexes: [],
    removedIndexes: [],
    survivedIndexes: [],
    prevSurvivedIndexes: [],
  };

  // create sources
  //
  createNodesFromSource(utils, render);

  // diff check
  //
  if (prevRender === undefined) {
    findTargets(delta.addedIndexes, render, 0);
  }
  if (prevRender !== undefined) {
    adoptNodes(delta, render, prevRender);
  }

  // unmount
  //
  if (prevRender !== undefined) {
    unmountNodes(
      utils,
      delta,
      prevRender,
      parentNode,
      leftNode,
    );
  }

  // remove properties from unmounted
  //
  /*
  if (prevRender !== undefined) {
  	removeProperties(
  		utils,
  		delta,
  		prevRender
  	);
  }
  */

  // build
  //
  if (prevRender === undefined) {
    createAddedBuilds(utils, delta, render);
  }
  if (prevRender !== undefined) {
    adoptBuilds(delta, render, prevRender);
  }

  // properties
  //
  if (prevRender !== undefined) {
    removeProperties(utils, delta, prevRender);
    adoptProperties(utils, delta, render, prevRender);
  }
  addProperties(utils, delta, render);

  // mount
  //
  mountAddedNodes(
    utils,
    delta,
    render,
    parentNode,
    leftNode,
  );

  return render;
}

export { diff };
