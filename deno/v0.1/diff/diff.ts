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
	addedIndexes: number[];
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

// mark prev render for removal
// really only need to mark top nodes
// remove through node iteration
function findRemovalTargets<N>(
  delta: DeltaTargets,
  render: Render<N>,
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

// create renders and add
function addRenderTargets<N>(
  utils: UtilsInterface<N>,
  delta: DeltaTargets,
  render: Render<N>,
  parentId: number,
  source: unknown,
): number {
  render.sources.push(source);
  const receipt = render.sources.length - 1;
  render.nodes.push({
    id: receipt,
    descendants: [],
    parentId,
  });
  render.results.push(createRenderResult(utils, source));

  let index = receipt;
  while (index < render.sources.length - 1) {
    const node = render.nodes[index];
    const result = render.results[index];
    const source = render.sources[index];

    // if draw and build, create and add descendant nodes
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


function diffRootNodes<N>(
	utils: UtilsInterface<N>,
	targets: DeltaTargets,
  sources: RenderSource<N>[],
  render: Render<N>,
  prevRender?: Render<N>,
) {
	// diff, add, remove
	// could be own function
  const minLength = Math.min(sources.length, prevRender?.rootLength ?? 0);
  for (let index = 0; index < minLength; index++) {
  	// diff check
  	const prev = prevRender?.sources[index];
  	const curr = sources[index];
  	if (compareSources(prev, curr)) {
  		// copy and update
  		targets.survivedIndexes.push(index);
  		targets.survivedRenderIndexes.push(index);
  		continue;
  	}
  	
  	// mark for removal
  	if (prevRender) {
  	  findRemovalTargets(targets, prevRender, index);
  	}

  	// add nodes
  	addRenderTargets(
  		utils,
  		targets,
  		render,
  		-1,
  		curr,
  	);
  	
  }
  
  // if prevSources longer than curr, remove prevRenders
  if (prevRender && minLength < prevRender.rootLength) {
  	for (let removedIndex = minLength; removedIndex < minLength; removedIndex++) {
			// remove stuff
  		findRemovalTargets(targets, prevRender, removedIndex);
  	}
  }
  
  if (minLength < sources.length) {
    for (let addedIndex = minLength; addedIndex < sources.length; addedIndex++) {
  		// add nodes
  		//
  		addRenderTargets(
				utils,
				targets,
				render,
				-1,
				curr,
			);
		}
  }
}


// first node should be the root node
function diff<N>(
  utils: UtilsInterface<N>,
  sources: RenderSource<N>[],
  parentNode: N,
  leftNode?: N,
  prevRender?: Render<N>,
): Render<N> {
  const render: Render<N> = {
  	rootLength: sources.length - 1,
    results: [],
    sources: [],
    nodes: [],
  };
  
  const targets: DeltaTargets = {
  	addedIndexes: [],
  	removedIndexes: [],
    survivedIndexes: [],
  	survivedRenderIndexes: [],
  };
  
  // big diff
  //
  
  // diff sources and prevRender sources
  diffRootNodes(utils, targets, sources, render, prevRender);
  
  // add more diff-ed nodes
  //
  
	// remove nodes
  //
  
  // add nodes
  //
  
  // remove injected properties from nodes
  //
  
	// add properties to new nodes
	//
	
	return render;
}

export { diff };
