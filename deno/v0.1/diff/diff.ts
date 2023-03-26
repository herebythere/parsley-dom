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
  descendants: number[];
  build: BuildInterface<N>;
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

// diffs are

function diff<N>(
  utils: Utils<N>,
  prevBuilds: BuildNode<N>[],
  curDraw: DrawInterface,
  prvDraw?: DrawInterface,
): BuildNode<N>[] {
	// this function renders new builds
  const builds: BuildNode<N>[] = [];

  const descendantIndex = [0];
  const prevDrawStack = [prvDraw];
  const currDrawStack = [curDraw];
  const currBuildIDStack = [prevBuilds[0]?.id];
  
  const stackIndex = descendantIndex.length - 1;
  const descIndex = descendantIndex[stackIndex];
  const prevDraw = prevDrawStack[stackIndex];
  const currDraw = currDrawStack[stackIndex];
  const buildID = currBuildIDStack[stackIndex];

	/*
  if (prevDraw.templateStrings === currDraw.templateStrings) {
  	
  	let build = prevBuilds[prevBuilds.length - 1];
		if (build === undefined) {
			const builder = getBuilder(utils, draw.templateStrings);
			const build = new Build(utils, builder);
			buildNode = {id: builds.length, parentID: -1, leftId: -1, descendants: [], build};
		}
		currBuilds.push(buildNode);
  }
  
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
