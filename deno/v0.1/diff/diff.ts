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
	prevSurvivedIndexes: number[];
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
function findRemovedTargets<N>(
  delta: DeltaTargets,
  render: Render<N>,
  sourceIndex: number,
) {
	delta.removedIndexes.push(sourceIndex);
	
	let index = delta.removedIndexes.length - 1;
	while (index < delta.removedIndexes.length) {
		const nodeIndex = delta.removedIndexes[index];
		
		const node = render.nodes[nodeIndex]
		for (const descIndex of node.descendants) {
			delta.removedIndexes.push(descIndex);
		}
	
		index += 1;
	}
}

// mark prev render for removal
// really only need to mark top nodes
// remove through node iteration
function findAddedTargets<N>(
  delta: DeltaTargets,
  render: Render<N>,
  sourceIndex: number,
) {
	delta.addedIndexes.push(sourceIndex);
	
	let index = delta.addedIndexes.length - 1;
	while (index < delta.addedIndexes.length) {
		const nodeIndex = delta.addedIndexes[index];
		
		const node = render.nodes[nodeIndex]
		for (const descIndex of node.descendants) {
			delta.addedIndexes.push(descIndex);
		}
	
		index += 1;
	}
}


function adoptPrevNodes<N>(
  delta: DeltaTargets,
  render: Render<N>,
  prevRender: Render<N>,
) {
	// do the root nodes
	//
	const minLength = Math.min(render.rootLength, prevRender.rootLength);
	for (let index = 0; index < minLength; index++) {
		const prev = prevRender.sources[index];
		const curr = render.sources[index];
		if (compareSources(prev, curr)) {
			delta.survivedIndexes.push(index)
			delta.prevSurvivedIndexes.push(index)
			continue;
		}
		
		// findRemovedTargets
		findRemovedTargets(delta, render, index);
		// addCreationTargets
		findAddedTargets(delta, render, index);
	}
	
	if (prevRender.rootLength > minLength) {
		for (let index = prevRender.rootLength; index < prevRender.rootLength; index++) {
			// remove targets
			findRemovedTargets(delta, render, index);
		}
	}
	
	if (render.rootLength > minLength) {
		for (let index = render.rootLength; index < render.rootLength; index++) {
			// add targets
			findAddedTargets(delta, render, index);
		}
	}
	
	// explore adopted nodes
	let index = 0;
	while (index < delta.survivedIndexes.length) {
		// if adopted, the sources and renders are already equal
		// if adopted, the source is only builds
		//
		const prevIndex = delta.prevSurvivedIndexes[index];
		const currIndex = delta.survivedIndexes[index];
		
		const prevNode = prevRender.nodes[prevIndex];
		const currNode = render.nodes[currIndex];
		
		// if adopted, the sources and renders are already equal
		for (let index = 0; index < prevNode.descendants.length; index++) {
			const prevDescIndex = prevNode.descendants[index];
			const currDescIndex = currNode.descendants[index];
			
			const prevDescSource = prevRender.sources[prevDescIndex];
			const currDescSource = render.sources[currDescIndex];
			
			if (compareSources(prevDescSource, currDescSource)) {
				delta.prevSurvivedIndexes.push(prevDescIndex);
				delta.survivedIndexes.push(currDescIndex);
				continue;
			}
			
			// add for removal from prev
			findRemovedTargets(delta, render, prevDescIndex);
			// add new nodes to curr
			findAddedTargets(delta, render, currDescIndex);
		}
		
		index += 1;
	}
}

// create renders and add
function createNodesFromSources<N>(
  utils: UtilsInterface<N>,
  render: Render<N>,
  sources: unknown[],
) {
	for (const source of sources) {
	  render.sources.push(source);
		const receipt = render.sources.length - 1;
		render.nodes.push({
		  id: receipt,
		  descendants: [],
		  parentId: -1,
		});
		render.results.push(undefined);
	}

  let index = 0;
  while (index < render.sources.length) {
    const node = render.nodes[index];
    const source = render.sources[index];

    if (source instanceof Draw) {
      const builder = utils.getBuilder(source.templateStrings);
      if (builder !== undefined) {
		    for (const descendant of builder.descendants) {
		      const { index } = descendant;
		      const descSource = source.injections[index];
		      
		      // add source and descendant to render
		      render.sources.push(descSource);
		      const receipt = render.sources.length - 1;
		      // add descendant index to parent
		      render.nodes.push({
		        id: receipt,
		        parentId: node.id,
		        descendants: [],
		      });
		      render.results.push(undefined);
		      node.descendants.push(receipt);
		    }
      }
    }

    index += 1;
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

function createNewBuilds<N>(
	utils: UtilsInterface<N>,
	delta: DeltaTargets,
	render: Render<N>,
) {
	for (const index of delta.addedIndexes) {
		const source = render.sources[index];
		const result = createRenderResult(utils, source);
		render.results[index] = result;
	}
}

function unmountPrevNodes<N>(
	utils: UtilsInterface<N>,
	delta: DeltaTargets,
	prevRender: Render<N>,
	parentNode: N,
	leftNode?: N,
) {

}

function mountNewNodes<N>(
	utils: UtilsInterface<N>,
	delta: DeltaTargets,
	render: Render<N>,
	parentNode: N,
	leftNode?: N,
) {
	// insert roots
	// while addedIndexes < delta.rootLength
	//   get left node
	// 
	
	let index = 0;
	let addedIndex = delta.addedIndexes[index];
	let left = leftNode;
	while (addedIndex < render.root) {
		const node = render.results[addedIndex];
		const leftResult = render.results[addedIndex - 1]);
		left = getRightNode(leftResult);
		
		// insert node or nodes
		utils.insertNode(node, parentNode, left);
		
		index += 1;
		addedIndex = delta.addedIndexes[index]
	}
	
	// mount descendants
	for (let index = 0; index < delta.addedIndexes.length; index++) {
		const node = render.nodes[index];
		const result = render.results[index];
		
		for (const descIndex of node.descendants) {
			
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
  // create required structures
  //
  //
  
  const render: Render<N> = {
  	rootLength: sources.length - 1,
    results: [],
    sources: [],
    nodes: [],
  };
  
  const delta: DeltaTargets = {
  	addedIndexes: [],
  	removedIndexes: [],
    survivedIndexes: [],
  	prevSurvivedIndexes: [],
  };
  

	// create sources
	//
	//
	createNodesFromSources(utils, render, sources);
	
	
	// diff check
	//
	if (prevRender !== undefined) {
		adoptPrevNodes(delta, render, prevRender);
	}
	
	if (prevRender === undefined) {
		for (let index = 0; index < render.rootLength; index++) {
			findAddedTargets(delta, render, index);
		}
	}
	
	
	// clean up
	//
	//
	
	// iterate through removedIndexes
	// get parent, remove parent and left
	// 
	if (prevRender !== undefined) {
		unmountPrevNodes(
			utils,
			delta,
			prevRender,
			parentNode,
			leftNode,
		);
	}
	
	// remove properties from prev render (no need, no attributes added just yet)
	// iterate through removed nodes and remove properties
	//
	
	
	// build
	//	
	if (prevRender === undefined) {
		createNewBuilds(utils, delta, render);
	}
	
	if (prevRender !== undefined) {
		adoptBuilds(delta, render, prevRender);
	}

	
	// mount
	//	survived nodes exist top down, only need to mount
	//

	mountNewNodes(
		utils,
		delta,
		render,
		parentNode,
		leftNode,
	)
	
	// diff old properties
	//
	//
	
	// add properties
	//
	//

	return render;
}

export { diff };
