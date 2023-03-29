import type { Utils } from "../type_flyweight/utils.ts";
import type { DrawInterface } from "../type_flyweight/draw.ts";
import type { BuildInterface } from "../type_flyweight/build.ts";
import type { BuilderDataInterface } from "../type_flyweight/builder.ts";
import type { RenderNode, Render } from "../type_flyweight/render.ts";

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

// case #0 build Render Tree
function buildSubtree<N>(
  utils: Utils<N>,
  render: Render<N>,
  parentID: number,
  draw: DrawInterface,
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

// diffs are

// perhaps make this a params object
function diff<N>(
  utils: Utils<N>,
  curDraw: DrawInterface,
  prvDraw?: DrawInterface,
  prevRender?: Render<N>,
  parentNode?: N,
  leftNode?: N,
): Render<N> {
  // this function renders new builds
  const render: Render<N> = {
  	builds: [],
  	renders: [],
  };

  // case #1 prevDraw does not exist (first render)
  if (prvDraw === undefined) {

  }

  // case #2 prevDraw equals currDraw
  if (prvDraw?.templateStrings === curDraw.templateStrings) {
    // get prevBuild
    //
  }

  return render;
}

export { diff };
