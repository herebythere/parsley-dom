import type { Utils } from "../type_flyweight/utils.ts";
import type { DrawInterface } from "../type_flyweight/draw.ts";
import type { BuildInterface } from "../type_flyweight/build.ts";
import type { BuilderDataInterface } from "../type_flyweight/builder.ts";
import type { Render, RenderNode } from "../type_flyweight/render.ts";
import type { Draws } from "../type_flyweight/hangar.ts";

import { Draw } from "../draw/draw.ts";
import { Build } from "../build/build.ts";
import { Builder } from "../builder/builder.ts";

import { parse } from "../deps.ts";

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

/*
	there are a couple cases
	
	there are some primative operations
	
		remove a node
	
		remove a string
		
		remove a build
		
		add a build
		
		add a string
		
		add a node
	
		
	and there is a prev draw and curr draw
	there is a prev render and a current render
	prev renders have "builds"
	compare draws to create a render a new render
	
*/

// case #0 build Render Tree
/*
function buildSubtree<N, S>(
  utils: Utils<N>,
  render: Render<N>,
  parentID: number,
  draw: Draws<N, S>,
) {
  const builderData = getBuilderData(utils, draw.templateStrings);
  if (builderData === undefined) return;

  const build = new Build(utils, builderData);
  render.builds.push(build);

  const buildID = render.builds.length - 1;
  const parentRender = render.renders[parentID];
  parentRender.descendants.push(buildID);

  const rend = {
  	id: buildID,
  	parentId: parentID,
  	descendants: [],
  };
  render.renders.push(rend);

  // mount render to parent and left node

  // create stack
  const drawStack = [draw];
  const buildIDStack = [buildID];
  const descIndexStack = [0];

  while (drawStack.length > 0) {
  	const stackIndex = drawStack.length - 1;
  	const draw = drawStack[stackIndex];
  	const builderData = getBuilderData(utils, draw.templateStrings);
  	if (builderData === undefined) break;

		const descIndex = descIndexStack[stackIndex];
		if (descIndex >= builderData.descendants.length ) {
		  drawStack.pop();
		  buildIDStack.pop();
		  descIndexStack.pop();
		  continue;
		}

		// increase descendant index
		descIndexStack[stackIndex] += 1;

		const { index } = builderData.descendants[descIndex];
		const descendant = draw.injections[index];
		if (descendant instanceof Draw) {
	  	const builderData = getBuilderData(utils, descendant.templateStrings);
  		if (builderData === undefined) break;

			const build = new Build(utils, builderData);
			render.builds.push(build);

			const parentBuildID = buildIDStack[stackIndex];
			const parentRender = render.renders[parentBuildID];
			const parentBuild = render.builds[parentBuildID];

			const buildID = render.builds.length - 1;
			parentRender.descendants.push(buildID);
			const rend = {
				id: buildID,
				parentId: parentBuildID,
				descendants: [],
			};
			render.renders.push(rend);

			// mount build to Parent Build

			drawStack.push(descendant);
			descIndexStack.push(0);
			buildIDStack.push(buildID);
		}

		// if descendant instance of Build

		// if descendant instanceof N
  }
}
*/
// diffs are

// perhaps make this a params object


function addNode<N>(
  utils: Utils<N>,
  curDraw: Draws<N>[],
  prvDraw?: Draws<N>[],
  prevRender?: Render<N>,
  parentNode?: N,
  leftNode?: N,
) {

}

function removeNode<N>(
  utils: Utils<N>,
  curDraw: Draws<N>[],
  prvDraw?: Draws<N>[],
  prevRender?: Render<N>,
  parentNode?: N,
  leftNode?: N,
) {

}

function addString<N>(
  utils: Utils<N>,
  curDraw: Draws<N>[],
  prvDraw?: Draws<N>[],
  prevRender?: Render<N>,
  parentNode?: N,
  leftNode?: N,
) {

}

function removeString<N>(
  utils: Utils<N>,
  curDraw: Draws<N>[],
  prvDraw?: Draws<N>[],
  prevRender?: Render<N>,
  parentNode?: N,
  leftNode?: N,
) {

}

function addDraw(
  utils: Utils<N>,
  curDraw: Draws<N>[],
  prvDraw?: Draws<N>[],
  prevRender?: Render<N>,
  parentNode?: N,
  leftNode?: N,
) {

}

function removeDraw(
  utils: Utils<N>,
  curDraw: Draws<N>[],
  prvDraw?: Draws<N>[],
  prevRender?: Render<N>,
  parentNode?: N,
  leftNode?: N,
) {

}

function diffRender(
  utils: Utils<N>,
  curDraw: Draws<N>,
  prvDraw?: Draws<N>,
  prevRender?: Render<N>,
  parentNode?: N,
  leftNode?: N,
) {
		// does prev not exist?
		//	create node or build with stack
		//
		// does prev
		//
		//
		//
		// descendant stack
		
		if (currDraw === undefined) {
			// remove prevDraw
		}
		
		if (prevDraw === undefined) {
			// add new
		}
		
	  if (prevDraw === currDraw) continue;
  	
  	if (prevDraw instanceof currDraw) {
  		// compare
  	}
  	
    if (prevDraw instanceof Draw && currDraw instanceof Draw) {
    	
    }


    const node = utils.getIfNode(currDraw);
    if (node !== undefined) {
      render.builds.push(node);
      render.renders.push({
        id: render.builds.length - 1,
        parentId: -1,
        descendants: [],
      });
      utils.insertNode(node, parentNode, leftNode);
      continue;
    }
}

// iterate left to right with 
function diff<N>(
  utils: Utils<N>,
  curDraw: Draws<N>[],
  prvDraw?: Draws<N>[],
  prevRender?: Render<N>,
  parentNode?: N,
  leftNode?: N,
): Render<N> {
  // this function renders new builds
  const render: Render<N> = {
    builds: [],
    renders: [],
  };

	let parent = parentNode;
	let left = leftNode;
	
  let drawLength = Math.max(prvDraw?.length ?? 0, curDraw.length);
  for(const index = 0; index < drawLength; index++) {
  	const prevDraw = prvDraw?.[index];
  	const currDraw = curDraw[index];
  }
  
  return render;
}

export { diff };
