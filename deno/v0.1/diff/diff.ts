import type { UtilsInterface } from "../type_flyweight/utils.ts";
import type { DrawInterface } from "../type_flyweight/draw.ts";
import type { BuildInterface } from "../type_flyweight/build.ts";
import type {
  Render,
  RenderResult,
  RenderSource,
  RenderNode,
} from "../type_flyweight/render.ts";

import { Draw } from "../draw/draw.ts";
import { Build } from "../build/build.ts";
import { Builder } from "../builder/builder.ts";
import { parse } from "../deps.ts";

interface DeltaTargets {
	survivedIndexes: number[];
	survivedRenderIndexes: number[];
	removedIndexes: number[];
}

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

function findRemovalTargets<N>(
  utils: UtilsInterface<N>,
  render: Render<N>,
  delta: DeltaTargets,
  sourceId: number,
) {
	delta.removedIndexes.push(sourceId);
	let index = delta.removedIndexes.length - 1;

	while (index < delta.removedIndexes.length) {
		const nodeId = delta.removedIndexes[index];
		
		const node = render.nodes[nodeId]
		for (const descendantId of node.descendants) {
			delta.removedIndexes.push(descendantId);
		}
	
		index += 1;
	}
}

// return source id for left sibling addition
function addRenderResults<N>(
  utils: UtilsInterface<N>,
  render: Render<N>,
  source: unknown,
  parentNode: N,
): number {
  render.sources.push(source);
  render.results.push(createRenderResult(utils, source));
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
        const descResult = createRenderResult(utils, descSource);
        render.results.push(descResult);

        // add descendant to parent
        const receipt = render.sources.length - 1;
        node.descendants.push(receipt);

        // add node to stack
        render.nodes.push({
          id: receipt,
          parentId: node.id,
          descendants: [],
        });
      }
    }

    index += 1;
  }

  return receipt;
}


// first node should be the root node
function diff<N>(
  utils: UtilsInterface<N>,
  sources: RenderSource<N>[],
  parentNode: N,
  leftNode?: N,
  prevRender?: Render<N>,
): Render<N> {
	// set parent as root node
	// create render
  const rootNode: RenderNode = { id: 0, parentId: -1, descendants: [] };
  const render: Render<N> = {
    results: [parentNode],
    sources: [parentNode],
    nodes: [rootNode],
  };
  
  const targets: DeltaTargets = {
    survivedIndexes: [],
  	survivedRenderIndexes: [],
  	removedIndexes: [],
  };
  
  // only need to mark changed nodes?
  // later can remove descendants
  // add sources to render
	for (const source of sources) {
		render.sources.push(source);
		
		const id = render.sources.length - 1;
		rootNode.descendants.push(id);
		render.nodes.push({ id, parentId: 0, descendants: [] });
		
		const result = createRenderResult(utils, source);
		render.results.push(result);
	}
	
	
	// see if theyre different
	for (let index = 1; index < render.sources.length - 1; index++) {
		// if different add index to removal queue
	}
	
	// get differences for properties, remove properties that change
	
	// remove all marked for removal in removal queue
	
	// mount all nodes
	

	
	// add all properties to nodes
	

	return render;
}

export { diff };
