import type {
  DeltaTargets,
  Render,
  RenderSource,
  NodeLinkInterface,
} from "../type_flyweight/render.ts";

import { Draw } from "../draw/draw.ts";

import { NodeLink } from "./node_link.ts";

function adoptSurvivedTargets<N>(
  prevRender: Render<N>,
  render: Render<N>,
  delta: DeltaTargets,
) {
	/*
  for (let index = 0; index < delta.survivedIndexes.length; index++) {
    const prevSurvivedIndex = delta.prevSurvivedIndexes[index];
    const prevSurvivedDescIndex = delta.prevSurvivedDescIndexes[index];

    const survivedIndex = delta.survivedIndexes[index];
    const survivedDescIndex = delta.survivedDescIndexes[index];

    const prevNode = prevRender.nodes[prevSurvivedIndex];
    const node = prevRender.nodes[survivedIndex];

    const prevDescendants = prevNode.descendants[prevSurvivedDescIndex];
    const descendants = node.descendants[survivedDescIndex];

    for (let descIndex = 0; descIndex < descendants.length; descIndex++) {
      const prevResultIndex = prevDescendants[descIndex];
      const resultIndex = descendants[descIndex];
      render.results[resultIndex] = prevRender.results[prevResultIndex];
    }
  }
  */
}

function findTargets<N>(
  render: Render<N>,
  targets: number[],
  nodeIndex: number,
) {
	/*
  targets.push(nodeIndex);
  
  

  let index = targets.length - 1;
  while (index < targets.length) {
    const targetIndex = targets[index];

    const node = render.nodes[targetIndex];
    for (const descArray of node) {
    	for (const descIndex of descArray) {
    		const source = render.sources[descIndex];
    		if (source instanceof NodeLink) {
    			targets.push(descIndex);
    		}
    	}
    }

    index += 1;
  }
  */
}

function compareSources<N>(
  prevRender: Render<N>,
  render: Render<N>,
  prevDescendants: number[],
  descendants: number[],
) {
	/*
	console.log("compare sources:", prevDescendants, descendants);
  if (prevDescendants.length !== descendants.length) return false;

  for (let index = 0; index < descendants.length; index++) {
    const prevSourceIndex = prevDescendants[index];
    const sourceIndex = descendants[index];

    const prevSource = prevRender.sources[prevSourceIndex];
    const source = render.sources[sourceIndex];
		console.log("sources:", prevSource, source);
		
    if (prevSource instanceof Draw && source instanceof Draw) {
    	console.log("pair of draws:", prevSource.templateStrings === source.templateStrings);
      if (prevSource.templateStrings !== source.templateStrings) return false;
      continue;
    }

    if (prevSource !== source) return false;
  }
  
  return true;
  */
}

function adoptNodes<N>(
  prevRender: Render<N>,
  render: Render<N>,
  delta: DeltaTargets,
) {
	/*
  // might need to compare first then add
  delta.prevSurvivedIndexes.push(0);
  delta.survivedIndexes.push(0);
  delta.prevSurvivedDescIndexes.push(0);
  delta.survivedDescIndexes.push(0);
  
  console.log("adopt delta:", delta);

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
      if (compareSources(prevRender, render, prevDescIndexes, descIndexes)) {
        // sources are the same
        console.log("passed strings");
        // causes recursion
        // add each survived indexes
        //
        for (const prevIndex of prevDescIndexes) {
        	delta.prevSurvivedIndexes.push(prevIndex);
        }
        
        
        
        continue;
      }

      // sources are different
      // remove old nodes
      findTargets(
        prevRender,
        delta.removedIndexes,
        delta.removedDescIndexes,
        prevParentIndex,
        descArrayIndex,
      );
      // add new nodes
      findTargets(
        render,
        delta.addedIndexes,
        delta.addedDescIndexes,
        parentIndex,
        descArrayIndex,
      );
    }

    // remove leftover descendant arrays from prev descendants
    if (descArrayLength < prevRenderNode.descendants.length) {
      for (
        let index = descArrayLength;
        index < prevRenderNode.descendants.length;
        index++
      ) {
        findTargets(
          prevRender,
          delta.removedIndexes,
          delta.removedDescIndexes,
          prevParentIndex,
          index,
        );
      }
    }

    // add leftover descendant arrays from curr descendants
    if (descArrayLength < renderNode.descendants.length) {
      for (
        let index = descArrayLength;
        index < renderNode.descendants.length;
        index++
      ) {
        findTargets(
          render,
          delta.addedIndexes,
          delta.addedDescIndexes,
          parentIndex,
          index,
        );
      }
    }

    survIndex += 1;
  }
  */
}

export { adoptNodes, adoptSurvivedTargets, findTargets };
