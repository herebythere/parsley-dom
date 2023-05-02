import type {
  DeltaTargets,
  Render,
  RenderSource,
} from "../type_flyweight/render.ts";

import { Draw } from "../draw/draw.ts";

// possibly need to add descendant index 
function findTargets<N>(
  targets: number[],
  descTargets: number[],
  render: Render<N>,
  nodeIndex: number,
  nodeDescIndex: number,
) {
  targets.push(nodeIndex);
  descTargets.push(nodeDescIndex);
  
  let index = targets.length - 1;
  while (index < targets.length) {
    const targetIndex = targets[index];
    const targetDescIndex = descTargets[index];
    
  	const node = render.nodes[targetIndex];
		const nodeDescIndexes = node.descendants[targetDescIndex];
		for (const nodeIndex of nodeDescIndexes) {
			const descNode = render.nodes[nodeIndex];
			
		  for (let descIndex = 0; index < descNode.descendants.length; index++) {
		  	targets.push(nodeIndex);
		  	descTargets.push(descIndex);
		  }
		}
   	
    index += 1;
  }
}

function compareSources<N>(
  source: RenderSource<N>,
  prevSource: RenderSource<N>,
  prevRender: Render<N>,
  render: Render<N>,
  prevDescendants: number[],
  descendants: number[],
) {
  if (prevDescendants.length !== descendants.length) return false;

  for (let index = 0; index < descendants.length; index++) {
    const prevSourceIndex = prevDescendants[index];
    const sourceIndex = descendants[index];

    const prevSource = prevRender.sources[prevSourceIndex];
    const source = render.sources[prevSourceIndex];

    if (prevSource instanceof Draw && source instanceof Draw) {
      if (prevSource.templateStrings !== source.templateStrings) return false;
      continue;
    }

    if (prevSource !== source) return false;
  }
}

function adoptNodes<N>(
  render: Render<N>,
  prevRender: Render<N>,
  delta: DeltaTargets,
) {
  delta.prevSurvivedIndexes.push(0);
  delta.survivedIndexes.push(0);

  // walk through root nodes and descendants
  let survIndex = 0;
  while (survIndex < delta.survivedIndexes.length) {
    const prevParentIndex = delta.prevSurvivedIndexes[survIndex];
    const parentIndex = delta.survivedIndexes[survIndex];

    const prevRenderNode = prevRender.nodes[prevParentIndex];
    const renderNode = render.nodes[parentIndex];

    // iterate through minimal descendant arrays
    const descArrayLength = Math.max(
      prevRenderNode.descendants.length,
      renderNode.descendants.length,
    );

    // for each descendant array
    for (
      let descArrayIndex = 0;
      descArrayIndex < descArrayLength;
      descArrayIndex++
    ) {
      const prevDescIndexes = prevRenderNode.descendants[descArrayIndex];
      const descIndexes = renderNode.descendants[descArrayIndex];

      // compare array

      // compare sources, iterate across array
      
      // if same add all to adopted arrays and survived indexes

      // if not, add all prev to removed arrays
      // add all source to added arrays

      descArrayIndex += 1;
    }

    // remove leftover descendant arrays from prev descendants

    // add leftover descendant arrays from curr descendants

    survIndex += 1;
  }
}

export { adoptNodes, findTargets };
