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

import { SourceLink, findTargets } from "./utils.ts";


function getDeltas<N>(
	render: Render<N>,
	prevRender: Render<N>,
	delta: DeltaTargets,
) {
	// take two renders
	let index = 0;
	while (index < render.root.length && index < prevRender.root.length) {
		const sourceIndex = render.root[index];
		const prevSourceIndex = prevRender.root[index];
		
		const source = render.sources[sourceIndex];
		const prevSource = prevRender.sources[prevSourceIndex];
		
		// if theyre equal
		if (prevSource instanceof SourceLink && source instanceof SourceLink) {
			const draw = render.draws[source.drawIndex];
			const prevDraw = prevRender.draws[prevSource.drawIndex];
			
			if (prevDraw.templateStrings !== draw.templateStrings) {
				// add remove
				findTargets(render, delta.addedIndexes, sourceIndex);
				findTargets(render, delta.removedIndexes, prevSourceIndex);
				delta.remountRoot = true;
			} else {
				// add to build
				render.builds[sourceIndex] = prevRender.builds[prevSourceIndex];
				delta.survivedIndexes.push(sourceIndex);
				delta.prevSurvivedIndexes.push(prevSourceIndex);
			}
		} else {
			if (prevSource !== source) {
				// add remove
				findTargets(render, delta.addedIndexes, sourceIndex);
				findTargets(render, delta.removedIndexes, prevSourceIndex);
				delta.remountRoot = true;
			} else {
				// add to build
				render.builds[index] = prevRender.builds[index];
			}
		}
		
		index += 1;	
	}
	
	while (index < render.root.length) {
		const sourceIndex = render.root[index];
		findTargets(render, delta.addedIndexes, sourceIndex);
		delta.remountRoot = true;
		index +=1;
	}
	while (index < prevRender.root.length) {
		const prevSourceIndex = prevRender.root[index];
		findTargets(prevRender, delta.removedIndexes, prevSourceIndex);
		delta.remountRoot = true;
		index +=1;
	}
	
	
	// now survived indexes
	//
	let survivedIndex = 0;
	while (survivedIndex < delta.survivedIndexes.length) {
		const sourceIndex = delta.survivedIndexes[survivedIndex];
		const prevSourceIndex = delta.prevSurvivedIndexes[survivedIndex];
		
		// they should always be 
		const source = render.sources[sourceIndex];
		const prevSource = prevRender.sources[prevSourceIndex];
		
		if (prevSource instanceof SourceLink && source instanceof SourceLink) {
			// check if desc array changed
			// check add remove
			
			const nodes = render.nodes[source.nodeIndex];
			const prevNodes = prevRender.nodes[prevSource.nodeIndex];
			
			for (let nodeIndex = 0; nodeIndex < nodes.length; nodeIndex++) {
				const node = nodes[nodeIndex];
				const prevNode = prevNodes[nodeIndex];
				
				let resetIndex = false;
				
				let descIndex = 0
				while (descIndex < node.length && descIndex < prevNode.length) {
					const sourceIndex = node[descIndex];
					const prevSourceIndex = prevNode[descIndex];
					
					const source = render.sources[sourceIndex];
					const prevSource = prevRender.sources[prevSourceIndex];
					
					// if theyre equal

					if (prevSource instanceof SourceLink && source instanceof SourceLink) {
						const draw = render.draws[source.drawIndex];
						const prevDraw = prevRender.draws[prevSource.drawIndex];
						
						if (prevDraw.templateStrings !== draw.templateStrings) {
							// add remove
							findTargets(render, delta.addedIndexes, sourceIndex);
							findTargets(prevRender, delta.removedIndexes, prevSourceIndex);
							resetIndex = true;
						} else {
							// add to build
							render.builds[sourceIndex] = prevRender.builds[prevSourceIndex];
							delta.survivedIndexes.push(sourceIndex);
							delta.prevSurvivedIndexes.push(prevSourceIndex);
						}
					} else {
						if (prevSource !== source) {
							// add remove
							findTargets(render, delta.addedIndexes, sourceIndex);
							findTargets(prevRender, delta.removedIndexes, prevSourceIndex);
							resetIndex = true;
						} else {
							// add to build
							render.builds[index] = prevRender.builds[index];
						}
					}
						
					descIndex += 1;	
				}
				
				while (descIndex < node.length) {
					const sourceIndex = node[descIndex];
					findTargets(render, delta.addedIndexes, sourceIndex);
					resetIndex = true;
					descIndex +=1;
				}
				while (descIndex < prevNode.length) {
					const prevSourceIndex = prevNode[descIndex];
					findTargets(prevRender, delta.removedIndexes, prevSourceIndex);
					resetIndex = true;
					descIndex +=1;
				}
				
				if (resetIndex) {
					delta.prevDescIndexes.push(prevSource.nodeIndex);
					delta.descIndexes.push(source.nodeIndex);
					delta.descArrayIndexes.push(nodeIndex);
				}
			}
		}

		survivedIndex += 1;
	}

}
	
	// start with roots
	
	// if source is same, add to render
	
	// if source is not same, mark node id and node descendant id
	// to "unmount" and "re-mount" later 
	
	// mark descend nodes for removal
	// make new nodes as added
	
	
	
	// trick is that later order is:
	// create sources
	// unmount changed areas
	// remove changed nodes
	// create added nodes
	// mount changed areas
	// mount added nodes

export { getDeltas }
