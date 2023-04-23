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
function getSourcesAndNodes<N>(
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
  render.results.push(undefined);

  let index = receipt;
  while (index < render.sources.length - 1) {
    const node = render.nodes[index];
    const source = render.sources[index];

    // if draw and build, create and add descendant nodes
    let builder;
    if (source instanceof Draw) {
    	builder = utils.getBuilder(source.templateStrings);
    }

    if (source instanceof Draw && builder !== undefined) {
      for (const descendant of builder.descendants) {
        // add source and descendant to render
        const { index } = descendant;
        const descSource = source.injections[index];
        render.sources.push(descSource);
        render.results.push(undefined);

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

/*
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
  		render.sources.push(curr);
  		render.results.push(prevRender.results[index]);
  		render.nodes.push({
  			id: index,
  			parentId: -1,
  			descendants: [],
  		});
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
				sources[addedIndex],
			);
		}
  }
}

*/


// first node should be the root node
function diff<N>(
  utils: UtilsInterface<N>,
  sources: RenderSource<N>[],
  parentNode: N,
  leftNode?: N,
  prevRender?: Render<N>,
): Render<N> {
  // sources are the template or the node, those will always change
  
  // compare a previous render to a current render
  
  // either way a sketch of what must be build should be created
  //
  // iterate through sources regardless, the render result will be 'undefined'
  // but a space in the array will be preserved
  //
  // then there is a space to mark for addition and deletion
  // deletion has to do with the previous renders, clean up, removal of properties
  //
  // addition involves the current drawn sources
  // no previous id
  //
  // this becomes about moving cursors through an iteration
  // that's it
  // that's what i want.
  //
  // i need to build a new source to comapre the old one to the new one.
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
  

	// get sources
	// getSourcesAndNodes(render, sources);


  
  // can build through template or node once
  
  // then diffing can happen and renders can be either built or copied
  
  // big diff
  //
  
  // diff sources and prevRender sources
  //diffRootNodes(utils, targets, sources, render, prevRender);
  
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
