import type { UtilsInterface } from "../type_flyweight/utils.ts";
import type { DrawInterface } from "../type_flyweight/draw.ts";
import type { BuildInterface } from "../type_flyweight/build.ts";
import type {
  DeltaTargets,
  Render,
  RenderNode,
  SourceLinkInterface,
  RenderResult,
  RenderSource,
} from "../type_flyweight/render.ts";

import { Draw } from "../draw/draw.ts";
import { Build } from "../build/build.ts";
import { parse } from "../deps.ts";

import { SourceLink } from "./node_link.ts";

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
      }
      
      const node = render.nodes[source.nodeIndex];
      for (const descIndexArray of node) {
      	for (const descIndex of descIndexArray) {
      		const source = render.sources[descIndex];
  		    const node = utils.getIfNode(source);
					if (node !== undefined) {
						render.builds[descIndex] = node;
						continue;
					}
					
					render.builds[descIndex] = utils.createTextNode(source);
      	}
      }
    }
  }
}

function addSourceToRender<N>(
  utils: UtilsInterface<N>,
  render: Render<N>,
  source: RenderSource<N>,
  parentId: number,
  parentDescId: number,
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
	const parent = render.nodes[parentId];
	const sourceIndex = render.sources.length - 1;
	parent[parentDescId].push(sourceIndex);
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
    for (let descArrayIndex = 0; descArrayIndex < node.length; descArrayIndex++) {
    	const descArray = node[descArrayIndex];
    	    console.log("desc array:", descArray);
    	for (const sourceIndex of descArray) {
    		const source = render.sources[sourceIndex];
  	    console.log("source:", source);
    		if (source instanceof SourceLink) {
    			const node = render.nodes[source.nodeIndex];
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

					    if (!Array.isArray(descSource)) {
					      addSourceToRender(utils, render, descSource, source.nodeIndex, descIndex);
					    }

					    if (Array.isArray(descSource)) {
					      for (const chunk of descSource) {
					        // add source and descendant to render
					        addSourceToRender(utils, render, chunk, source.nodeIndex, descIndex);
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
) {
	console.log("create render:", source);
  // create root node
  const node: RenderNode = [[]];
  const render: Render<N> = {
  	root: [],
    sources: [],
    draws: [],
    builds: [],
    parents: [],
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
