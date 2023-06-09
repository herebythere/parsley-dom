import type { UtilsInterface } from "../type_flyweight/utils.ts";
import type { BuildInterface } from "../type_flyweight/build.ts";
import type {
  DeltaTargets,
  Render,
  RenderSource,
} from "../type_flyweight/render.ts";

import { Draw } from "../draw/draw.ts";
import { Build } from "../build/build.ts";
import { SourceLink } from "./utils.ts";

function createAddedBuilds<N>(
  utils: UtilsInterface<N>,
  delta: DeltaTargets,
  render: Render<N>,
) {
  for (const index of delta.addedIndexes) {
    const source = render.sources[index];

    const node = utils.getIfNode(source);
    if (node !== undefined) {
      render.builds[index] = node;
      continue;
    }

    if (source instanceof SourceLink) {
      const draw = render.draws[source.drawIndex];
      const builderData = utils.getBuilderData(draw.templateStrings);
      if (builderData === undefined) continue;

      const build = new Build(utils, builderData);
      render.builds[index] = build;

      // below could be it's own system
      const node = render.nodes[source.nodeIndex];
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
          if (source instanceof SourceLink) {
            source.parentIndex = parentIndex;
          }
        }
      }
      continue;
    }

    render.builds[index] = utils.createTextNode(source);
  }
}

function addSourceToRender<N>(
  render: Render<N>,
  indexes: number[],
  source: RenderSource<N>,
) {
  // create a node link and / or add to source
  if (source instanceof Draw) {
    // add node link to services
    const nodeLink = new SourceLink(
      render.draws.push(source) - 1,
      render.nodes.push([]) - 1,
    );

    render.sources.push(nodeLink);
  } else {
    render.sources.push(source);
  }

  render.builds.push(undefined);
  indexes.push(render.sources.length - 1);
}

function addSource<N>(
  render: Render<N>,
  sourceIndexArray: number[],
  source: RenderSource<N>,
) {
  if (!Array.isArray(source)) {
    addSourceToRender(render, sourceIndexArray, source);
  }

  if (Array.isArray(source)) {
    for (const chunk of source) {
      addSourceToRender(render, sourceIndexArray, chunk);
    }
  }
}

function addDescToRender<N>(
  utils: UtilsInterface<N>,
  render: Render<N>,
  sourceIndexArray: number[],
) {
  for (const sourceIndex of sourceIndexArray) {
    const source = render.sources[sourceIndex];
    if (!(source instanceof SourceLink)) continue;

    const node = render.nodes[source.nodeIndex];
    const draw = render.draws[source.drawIndex];

    const buildData = utils.getBuilderData(draw.templateStrings);
    if (buildData === undefined) continue;

    while (node.length < buildData.descendants.length) {
      const { index } = buildData.descendants[node.length];
      const descendants: number[] = [];
      node.push(descendants);

      addSource(render, descendants, draw.injections[index]);
    }
  }
}

function createNodesFromSource<N>(
  utils: UtilsInterface<N>,
  render: Render<N>,
) {
  // iterate across root
  let index = 0;
  for (const sourceIndex of render.root) {
    const source = render.sources[sourceIndex];
    if (source instanceof SourceLink) {
      index = source.nodeIndex;
    }
  }

  while (index < render.nodes.length) {
    const node = render.nodes[index];
    for (
      let descArrayIndex = 0;
      descArrayIndex < node.length;
      descArrayIndex++
    ) {
      const descArray = node[descArrayIndex];
      for (const sourceIndex of descArray) {
        const source = render.sources[sourceIndex];
        if (!(source instanceof SourceLink)) continue;

        const draw = render.draws[source.drawIndex];
        let data = utils.getBuilderData(draw.templateStrings);
        if (data === undefined) continue;

        const node = render.nodes[source.nodeIndex];
        for (
          let descIndex = 0;
          descIndex < data.descendants.length;
          descIndex++
        ) {
          const descendant = data.descendants[descIndex];
          const descSource = draw.injections[descendant.index];

          const descendants: number[] = [];
          node.push(descendants);

          addSource(render, descendants, descSource);
          addDescToRender(utils, render, descendants);
        }
      }
    }

    index += 1;
  }
}

function buildRender<N>(
  utils: UtilsInterface<N>,
  render: Render<N>,
  source: RenderSource<N>,
) {
  addSource(render, render.root, source);

  addDescToRender(utils, render, render.root);

  createNodesFromSource(utils, render);

  return render;
}

export { buildRender, createAddedBuilds };
