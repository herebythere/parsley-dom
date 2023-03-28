import type { Utils } from "../type_flyweight/utils.ts";
import type { DrawInterface } from "../type_flyweight/draw.ts";
import type { BuildInterface } from "../type_flyweight/build.ts";
import type { BuilderDataInterface } from "../type_flyweight/builder.ts";

import { Draw } from "../draw/draw.ts";
import { Build } from "../build/build.ts";
import { Builder } from "../builder/builder.ts";

import { parse } from "../deps.ts";

interface BuildNode<N> {
  id: number;
  parentId: number;
  leftId: number;
  buildID: number;
  descendants: number[];
}

interface Render<N> {
  builds: BuildInterface<N>[];
  renders: BuildNode<N>[];
}

function getBuilderData<N>(
  utils: Utils<N>,
  template: ReadonlyArray<string>,
): BuilderDataInterface<N> | undefined {
  const builderData = utils.getBuilder(template);
  if (builderData !== undefined) return builderData;

  const builder = new Builder();
  parse(template, builder);

  const data = builder.build(utils, template);
  if (data !== undefined) {
    utils.setBuilder(template, data);
  }

  return data;
}

// case #0 build Render Tree
function buildSubtree<N>(
  utils: Utils<N>,
  render: Render<N>,
  draw: DrawInterface,
) {
  const builderData = getBuilderData(utils, draw.templateStrings);
  if (builderData === undefined) return;

  const build = new Build(utils, builderData);
  /*
	while (drawStack.length > 0) {
		const stackIndex = drawStack.length - 1;
		const idIndex = idStack[stackIndex];
		const descendantIndex = descendantIndexStack[stackIndex];

		const { index } = builder.descendants[drawIndex];
		const descendant = currDraw.injections[index];
		// go back in queue
		if (builder.descendants.length >= drawIndex) {
		  idStack.pop();
		  drawStack.pop();
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
	}
	*/
  // add new renders to builds
  //
  // walk through draw descendants
  //
  // add descendant ids to parents
}

// diffs are

// perhaps make this a params object
function diff<N>(
  utils: Utils<N>,
  curDraw: DrawInterface,
  prvDraw?: DrawInterface,
  prevRender?: Render<N>,
  parentNode?: N,
  leftNode?: N,
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
  if (prevDraw === undefined) {
    // create build
    // get buildID
    // create build node
    // add injected properties to render
    // add build node to render
    //
    return builds;
  }

  // case #2 prevDraw equals currDraw
  if (prevDraw.templateStrings === currDraw.templateStrings) {
    // get prevBuild
    //
  }

  return builds;
}

export { diff };
