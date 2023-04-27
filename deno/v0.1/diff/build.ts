import type { UtilsInterface } from "../type_flyweight/utils.ts";
import type { DrawInterface } from "../type_flyweight/draw.ts";
import type { BuildInterface } from "../type_flyweight/build.ts";
import type {
  DeltaTargets,
  Render,
  RenderResult,
  RenderSource,
} from "../type_flyweight/render.ts";

import { Draw } from "../draw/draw.ts";
import { Build } from "../build/build.ts";
import { Builder } from "../builder/builder.ts";
import { parse } from "../deps.ts";

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

function createAddedBuilds<N>(
  utils: UtilsInterface<N>,
  delta: DeltaTargets,
  render: Render<N>,
) {
  console.log("create added builds");
  for (const index of delta.addedIndexes) {
    const source = render.sources[index];
    console.log("source:", source);
    let result: RenderResult<N> = utils.getIfNode(source);
    if (source instanceof Draw) {
      result = getBuild(utils, source);
    }
    if (result === undefined && source !== undefined) {
      result = utils.createTextNode(source);
    }
    console.log("final result", result);

    render.results[index] = result;
  }
}

function addSourceToRender<N>(
  render: Render<N>,
  source: RenderSource<N>,
  parentId: number,
) {
  render.sources.push(source);
  render.results.push(undefined);

  const id = render.sources.length - 1;
  render.nodes.push({ id, parentId, descendants: [] });

  const node = render.nodes[parentId];
  node.descendants.push(id);
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
      let data = getBuilderData(utils, source.templateStrings);
      console.log("builder data:", data);
      if (data !== undefined) {
        for (const descendant of data.descendants) {
          const { index: sourceIndex } = descendant;
          const descSource = source.injections[sourceIndex];

          if (!Array.isArray(descSource)) {
            addSourceToRender(render, descSource, index);
          }

          if (Array.isArray(descSource)) {
            for (const chunk of descSource) {
              // add source and descendant to render
              addSourceToRender(render, chunk, index);
            }
          }
        }
      }
    }

    index += 1;
  }
}

function createRender<N>(
  source: RenderSource<N>,
  parentNode: N,
) {
  const render: Render<N> = {
    results: [undefined],
    sources: [parentNode],
    nodes: [{ id: 0, parentId: -1, descendants: [] }],
  };

  if (Array.isArray(source)) {
    for (const chunk of source) {
      addSourceToRender(render, chunk, 0);
    }
  }

  if (!Array.isArray(source)) {
    addSourceToRender(render, source, 0);
  }

  return render;
}

export { createAddedBuilds, createNodesFromSource, createRender };
