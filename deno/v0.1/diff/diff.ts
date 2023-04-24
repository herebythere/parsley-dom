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
			delta.survivedRenderIndexes.push(index)
			continue;
		}
		
		// findRemovalTargets
		// addCreationTargets
	}
	
	if (prevRender.rootLength > minLength) {
		for (let index = prevRender.rootLength; index < prevRender.rootLength; index++) {
			// remove targets
		}
	}
	
	if (render.rootLength > minLength) {
		for (let index = render.rootLength; index < render.rootLength; index++) {
			// add targets
		}
	}
	
	// explore adopted nodes
	let index = 0;
	while (index < delta.survivedIndexes.length) {
		// if adopted, the sources and renders are already equal
		// if adopted, the source is only builds
		//
		// below is wrong
		const prevIndex = delta.survivedIndexes[index];
		const currIndex = delta.survivedRenderIndexes[index];
		
		const prevSource = prevRender.sources[prevIndex];
		const currSource = render.sources[currIndex];
		
		// ts needs check for draws
		if (prevSource instanceof Draw && currSource instanceof Draw) {
			// get min
			const prevNode = prevRender.nodes[prevIndex];
			const currNode = render.nodes[currIndex];
			
			// if adopted, the sources and renders are already equal
			for (let index = 0; index < prevNode.descendants.length; index++) {
				const prevDescIndex = prevNode.descendants[index];
				const currDescIndex = currNode.descendants[index];
				
				const prevDescSource = prevRender.sources[prevDescIndex];
				const currDescSource = render.sources[currDescIndex];
				
				if (compareSources(prevDescSource, currDescSource)) {
					delta.survivedRenderIndexes.push(prevDescIndex);
					delta.survivedIndexes.push(currDescIndex);
					continue;
				}
				
				// add for removal from prev
				// add new nodes to curr
			}
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
		      render.results.push(undefined);

		      // add descendant index to parent
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
    }

    index += 1;
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
  

	// get sources
	// getSourcesAndNodes(render, sources);

	if (prevRender !== undefined) {
		// borrowAndCreateBuilds
	} else {
		// createBuilds
	}
	
	// remove properties from prev render
	
	// unmount builds top down
	
	// mount renders, top down
	
	// add or update properties

	return render;
}

export { diff };
