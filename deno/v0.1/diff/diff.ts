import type { Utils } from "../type_flyweight/utils.ts";
import type { DrawInterface } from "../type_flyweight/draw.ts";
import type { BuildInterface } from "../type_flyweight/build.ts";
import type { BuilderDataInterface } from "../type_flyweight/builder.ts";

import { Draw } from "../draw/draw.ts";
import { Build } from "../build/build.ts";
import { Builder } from "../builder/builder.ts";

interface BuildNode<N> {
  id: number;
  parentId: number;
  leftId: number;
  buildID: number;
  descendants: number[];
}

interface Render<N> {
  builds: BuildInterface<N>,
  renders: BuildNode<N>[],
}

function getBuilder<N>(
  utils: Utils<N>,
  template: ReadonlyArray<string>,
): BuilderDataInterface<N> {
  let builder = utils.getBuilder(template);
  if (builder === undefined) {
    builder = new Builder(utils, template);
  	utils.setBuilder(template, builder);
  };

  return builder;
}

// case #0 build Render Tree
function buildSubtree() {
	// add new renders to builds
	//
	// walk through draw descendants
	//
	// add descendant ids to parents
}

// diffs are

function diff<N>(
  utils: Utils<N>,
  curDraw: DrawInterface,
  prvDraw?: DrawInterface,
  prevRender?: Render<N>,
): BuildNode<N>[] {
	// this function renders new builds
  const builds: BuildNode<N>[] = [];

  const descendantIndex = [0];
  const prevDrawStack = [prvDraw];
  const currDrawStack = [curDraw];
  const prevBuildIDStack = [0];
  const currBuildIDStack = [0];
  
  const stackIndex = descendantIndex.length - 1;
  const descIndex = descendantIndex[stackIndex];
  const prevDraw = prevDrawStack[stackIndex];
  const currDraw = currDrawStack[stackIndex];
  const prevBuildID = prevBuildIDStack[stackIndex];
  const currBuildID = currBuildIDStack[stackIndex];

	// case #1 prevDraw does not exist (first render)
  if (prevDraw.templateStrings === undefined) {
  	// create build
  	// get buildID
  	// create build node
  	// add injected properties to render
  	// add build node to render
  	//
  }
  
  // case #2 prevDraw equals currDraw
  if (prevDraw.templateStrings === currDraw.templateStrings) {
  	// get prevBuild
  	// 
  }
  
  // case #3 tree differs at this node
  
  
  

	/*
	const builder = getBuilder(utils, draw.templateStrings);

  // go back in queue
  if (builder.descendants.length >= drawIndex) {
    drawStack.pop();
    drawStackIndex.pop();
    continue;
  }

  const { index } = builder.descendants[drawIndex];
  const descendant = currDraw.injections[index];
  // move to next descendant in current queue
  drawStackIndex[stackIndex] += 1;
  
  if (descendant instanceof Draw) {
    drawStack.push(descendant);
    drawStackIndex.push(0);
  }
  */
  
  return builds;
}

export { diff };
