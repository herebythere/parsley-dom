import type { UtilsInterface } from "../type_flyweight/utils.ts";
import type { DrawInterface } from "../type_flyweight/draw.ts";
import type { BuildInterface } from "../type_flyweight/build.ts";
import type {
  DeltaTargets,
  Render,
  RenderNode,
  RenderResult,
  RenderSource,
  SourceLinkInterface,
} from "../type_flyweight/render.ts";

import { Draw } from "../draw/draw.ts";
import { Build } from "../build/build.ts";
import { parse } from "../deps.ts";

import { SourceLink } from "./utils.ts";

function createAddedBuilds<N>(
  utils: UtilsInterface<N>,
  delta: DeltaTargets,
  render: Render<N>,
) {
  for (const index of delta.addedIndexes) {
    const source = render.sources[index];

    if (source instanceof SourceLink) {
      const draw = render.draws[source.drawIndex];
      const builderData = utils.getBuilderData(draw.templateStrings);
      if (builderData !== undefined) {
        const build = new Build(utils, builderData);
        render.builds[index] = build;
        const node = render.nodes[source.nodeIndex];
        // for each descendant
        // use index to get node and descendant at same time
        // if descendant injection has parent
        // create parrent and add index to the found node links

        for (
          let buildIndex = 0;
          buildIndex < build.descendants.length;
          buildIndex++
        ) {
          let parentIndex = source.parentIndex;
          const descendant = build.descendants[buildIndex];
          if (descendant.parentNode !== undefined) {
            render.parents.push(descendant.parentNode);
            parentIndex = render.parents.length - 1;
          }

          const descIndexArray = node[buildIndex];
          for (const descIndex of descIndexArray) {
            const source = render.sources[descIndex];
            const node = utils.getIfNode(source);
            if (node !== undefined) {
              render.builds[descIndex] = node;
              continue;
            }

            if (source instanceof SourceLink) {
              // add parent node referernce
              source.parentIndex = parentIndex;
              continue;
            }

            // if node link, add parent index

            render.builds[descIndex] = utils.createTextNode(source);
          }
        }
      }
    }
  }
}

function addSourceToRender<N>(
  utils: UtilsInterface<N>,
  render: Render<N>,
  sourceIndexArray: number[],
  source: RenderSource<N>,
) {
  // create a node link and / or add to source
  if (source instanceof Draw) {
    // add to draws
    render.draws.push(source);

    // get builder and add nodes
    const descendants = [];
    const builderData = utils.getBuilderData(source.templateStrings);
    if (builderData !== undefined) {
      while (descendants.length < builderData.descendants.length) {
        descendants.push([]);
      }
    }
    render.nodes.push(descendants);

    // add node link to services
    const drawIndex = render.draws.length - 1;
    const nodeIndex = render.nodes.length - 1;
    const nodeLink = new SourceLink(drawIndex, nodeIndex);

    render.sources.push(nodeLink);
  } else {
    render.sources.push(source);
  }

  render.builds.push(undefined);
  const sourceIndex = render.sources.length - 1;
  sourceIndexArray.push(sourceIndex);
}

// create renders and add
//
// needs to be updated so that nested structures are added
function createNodesFromSource<N>(
  utils: UtilsInterface<N>,
  render: Render<N>,
) {
  let index = 0;
  console.log("crreate nodes frmo source");
  while (index < render.nodes.length) {
    const node = render.nodes[index];
    console.log("node", node);
    for (
      let descArrayIndex = 0;
      descArrayIndex < node.length;
      descArrayIndex++
    ) {
      const descArray = node[descArrayIndex];
      console.log("desc array:", descArray);
      for (const sourceIndex of descArray) {
        const source = render.sources[sourceIndex];
        console.log("source:", source);
        if (source instanceof SourceLink) {
          const draw = render.draws[source.drawIndex];
          let data = utils.getBuilderData(draw.templateStrings);
          if (data !== undefined) {
            for (
              let descIndex = 0;
              descIndex < data.descendants.length;
              descIndex++
            ) {
              const descendant = data.descendants[descIndex];
              const descSource = draw.injections[descendant.index];

              const sourceIndexArray =
                render.nodes[source.nodeIndex][descIndex];
              if (!Array.isArray(descSource)) {
                addSourceToRender(utils, render, sourceIndexArray, descSource);
              }

              if (Array.isArray(descSource)) {
                for (const chunk of descSource) {
                  // add source and descendant to render
                  addSourceToRender(utils, render, sourceIndexArray, chunk);
                }
              }
            }
          }
        }
      }
    }

    index += 1;
  }
}

// changed render order
function createRender<N>(
  utils: UtilsInterface<N>,
  source: RenderSource<N>,
  parentNode: N,
) {
  // create root node
  const render: Render<N> = {
    root: [],
    sources: [],
    draws: [],
    builds: [],
    parents: [parentNode],
    nodes: [],
  };

  // add sources
  if (!Array.isArray(source)) {
    addSourceToRender(utils, render, render.root, source);
  }

  if (Array.isArray(source)) {
    for (const chunk of source) {
      addSourceToRender(utils, render, render.root, chunk);
    }
  }

  return render;
}

export { createAddedBuilds, createNodesFromSource, createRender };
