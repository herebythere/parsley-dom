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

function createAddedBuilds<N>(
  utils: UtilsInterface<N>,
  delta: DeltaTargets,
  render: Render<N>,
) {
  for (const index of delta.addedIndexes) {
    const source = render.sources[index];
    let result: RenderResult<N> = utils.getIfNode(source);
    if (source instanceof Draw) {
  	  const builderData = utils.getBuilder(source.templateStrings);
			if (builderData !== undefined) {
				result = new Build(utils, builderData);
			}
    }
    if (result === undefined && source !== undefined) {
      result = utils.createTextNode(source);
    }

    render.results[index] = result;
  }
}

function addSourceToRender<N>(
  utils: UtilsInterface<N>,
  render: Render<N>,
  source: RenderSource<N>,
  parentId: number,
  parentDescId: number,
) {
  render.sources.push(source);
  render.results.push(undefined);

  const id = render.sources.length - 1;
  const parentNode = render.nodes[parentId];
  parentNode.descendants[parentDescId].push(id);

  // add descendant index arrays
  const node: RenderNode = { id, parentId, descendants: [] };
  if (!(source instanceof Draw)) {
    node.descendants.push([]);
  }
  if (source instanceof Draw) {
    let data = utils.getBuilder(source.templateStrings);
    if (data !== undefined) {
      for (const desc of data.descendants) {
        node.descendants.push([]);
      }
    }
  }

  render.nodes.push(node);
}

// create renders and add
function createNodesFromSource<N>(
  utils: UtilsInterface<N>,
  render: Render<N>,
  source: RenderSource<N>,
) {
  let index = 1;
  while (index < render.sources.length) {
    const source = render.sources[index];
    if (source instanceof Draw) {
      let data = utils.getBuilder(source.templateStrings);
      if (data !== undefined) {
        for (
          let descIndex = 0;
          descIndex < data.descendants.length;
          descIndex++
        ) {
          const descendant = data.descendants[descIndex];
          const descSource = source.injections[descendant.index];

          if (!Array.isArray(descSource)) {
            addSourceToRender(utils, render, descSource, index, descIndex);
          }

          if (Array.isArray(descSource)) {
            for (const chunk of descSource) {
              // add source and descendant to render
              addSourceToRender(utils, render, chunk, index, descIndex);
            }
          }
        }
      }
    }

    index += 1;
  }
}

function createRender<N>(
  utils: UtilsInterface<N>,
  source: RenderSource<N>,
  parent: N,
) {
  // create root node
  const node: RenderNode = { id: 0, parentId: -1, descendants: [[]] };
  const render: Render<N> = {
    results: [parent],
    sources: [parent],
    nodes: [node],
  };

  // add sources
  if (!Array.isArray(source)) {
    addSourceToRender(utils, render, source, 0, 0);
  }

  if (Array.isArray(source)) {
    for (const chunk of source) {
      addSourceToRender(utils, render, chunk, 0, 0);
    }
  }

  return render;
}

export { createAddedBuilds, createNodesFromSource, createRender };
