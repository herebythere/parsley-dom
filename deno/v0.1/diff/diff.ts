import type { UtilsInterface } from "../type_flyweight/utils.ts";
import type { DrawInterface } from "../type_flyweight/draw.ts";
import type { BuildInterface } from "../type_flyweight/build.ts";
import type {
  Render,
  RenderResult,
  RenderSource,
} from "../type_flyweight/render.ts";

import { Draw } from "../draw/draw.ts";
import { Build } from "../build/build.ts";
import { Builder } from "../builder/builder.ts";
import { parse } from "../deps.ts";

function getBuild<N>(
  utils: UtilsInterface<N>,
  draw: DrawInterface,
): BuildInterface<N> | undefined {
  const { templateStrings } = draw;

  const builderData = utils.getBuilder(templateStrings);
  if (builderData !== undefined) {
    return new Build(utils, builderData);
  }

  const builder = new Builder();
  parse(templateStrings, builder);

  const data = builder.build(utils, templateStrings);
  if (data !== undefined) {
    utils.setBuilder(templateStrings, data);
    return new Build(utils, data);
  }
}

function getRightNode<N>(
  utils: UtilsInterface<N>,
  result: RenderResult<N>,
): N | undefined {
  if (result instanceof Build) {
    return result.nodes[result.nodes.length - 1];
  }

  const node = utils.getIfNode(result);
  if (node !== undefined) {
    return node;
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

function createRenderResult<N>(
  utils: UtilsInterface<N>,
  source: unknown,
): RenderResult<N> {
  if (source instanceof Draw) {
    const build = getBuild(utils, source);
    if (build !== undefined) return build;
  }

  return utils.getIfNode(source) ?? utils.createTextNode(source);
}

function getRenderSource<N>(
  utils: UtilsInterface<N>,
  source: unknown,
): RenderResult<N> {
  if (source instanceof Draw) {
    const build = getBuild(utils, source);
    if (build !== undefined) return build;
  }

  return utils.getIfNode(source) ?? utils.createTextNode(source);
}

// return source id for left sibling addition
function addRenderResults<N>(
  utils: UtilsInterface<N>,
  render: Render<N>,
  source: unknown,
): number {
  render.sources.push(source);
  render.results.push(createRenderResult(utils, source));

  // to connect
  const receipt = render.sources.length - 1;
  render.nodes.push({
    id: receipt,
    parentId: -1,
    descendants: [],
  });

  let parentId = receipt;
  let leftId = -1;

  let index = receipt;
  while (index < render.sources.length - 1) {
    const node = render.nodes[index];
    const result = render.results[index];
    const source = render.sources[index];

    // if draw and build
    if (source instanceof Draw && result instanceof Build) {
      for (const descendant of result.descendants) {
        // add source and descendant to render
        const { index } = descendant;
        const descSource = source.injections[index];
        render.sources.push(descSource);
        render.results.push(createRenderResult(utils, descSource));

        // add descendant to parent
        const receipt = render.sources.length - 1;
        node.descendants.push(receipt);

        // add node to stack
        render.nodes.push({
          id: receipt,
          parentId: node.id,
          descendants: [],
        });

        // mount renders
        // then add properties
        if (result instanceof Build) {
          // mount
          // need parent and left
        }

        const descNode = utils.getIfNode(descSource);
        if (descNode !== undefined) {
          // mount
          //connect renders
          // add properties
          //
          // get left
        }
      }
    }

    index += 1;
  }

  return receipt;
}

// iterate left to right with
function diff<N>(
  utils: UtilsInterface<N>,
  sources: RenderSource<N>[],
  prevSources?: RenderSource<N>[],
  prevRender?: Render<N>,
  parentNode?: N,
  leftNode?: N,
): Render<N> {
  // this function renders new builds
  const render: Render<N> = {
    results: [],
    sources: [],
    nodes: [],
  };

  let parent = parentNode;
  let left = leftNode;

  let sourceLength = Math.max(prevSources?.length ?? 0, sources.length);
  for (let index = 0; index < sourceLength; index++) {
    const prevSource = prevSources?.[index];
    const source = sources[index];

    if (source === undefined) {
      // remove prev source
      continue;
    }

    if (prevSource === undefined) {
      // add source
      continue;
    }

    // compare sources
  }

  return render;
}

export { diff };
