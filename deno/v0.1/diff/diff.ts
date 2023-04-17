import type { UtilsInterface } from "../type_flyweight/utils.ts";
import type { DrawInterface } from "../type_flyweight/draw.ts";
import type { BuildInterface } from "../type_flyweight/build.ts";
import type { BuilderDataInterface } from "../type_flyweight/builder.ts";
import type { Render, RenderResult, RenderSource } from "../type_flyweight/render.ts";

import { Draw } from "../draw/draw.ts";
import { Build } from "../build/build.ts";
import { Builder } from "../builder/builder.ts";

import { parse } from "../deps.ts";

/*
	getBuild
	getRightNode
	
	buildTree
	destroyTree
*/

function getBuild<N>(
  utils: UtilsInterface<N>,
  template: ReadonlyArray<string[]>,
): BuildInterface<N> | undefined {
  const builderData = utils.getBuilder(template);
  if (builderData !== undefined) {
    return new Build(utils, builderData);
	}

  const builder = new Builder();
  parse(template, builder);

  const data = builder.build(utils, template);
  if (data !== undefined) {
    utils.setBuilder(template, data);
    return new Build(utils, data);
  }
}

function getRightNode<N>(utils: UtilsInterface<N>, result: RenderResult<N>): N | undefined {
	if (result instanceof Build) {
		return result.nodes[result.nodes.length - 1];
	}
	
	const node = utils.getIfNode(result);
	if (node !== undefined) {
		return node;
	}
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

// iterate left to right with 
function diff<N>(
  utils: UtilsInterface<N>,
  curDraw: RenderSource<N>[],
  prvDraw?: RenderSource<N>[],
  prevRender?: Render<N>,
  parentNode?: N,
  leftNode?: N,
): Render<N> {
  // this function renders new builds
  const render: Render<N> = {
    results: [],
    nodes: [],
  };

	let parent = parentNode;
	let left = leftNode;
	
  let drawLength = Math.max(prvDraw?.length ?? 0, curDraw.length);
  for(let index = 0; index < drawLength; index++) {
  	const prevDraw = prvDraw?.[index];
  	const currDraw = curDraw[index];
  	
  	
  }
  
  return render;
}

export { diff };
