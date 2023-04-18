import type { UtilsInterface } from "../type_flyweight/utils.ts";
import type { DrawInterface } from "../type_flyweight/draw.ts";
import type { BuildInterface } from "../type_flyweight/build.ts";
import type { BuilderDataInterface } from "../type_flyweight/builder.ts";
import type { Render, RenderResult, RenderSource } from "../type_flyweight/render.ts";

import { Draw } from "../draw/draw.ts";
import { Build } from "../build/build.ts";
import { Builder } from "../builder/builder.ts";
import { parse } from "../deps.ts";


function getBuild<N>(
  utils: UtilsInterface<N>,
  template: Readonly<string[]>,
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

function compareSources<N>(source: RenderSource<N>, prevSource: RenderSource<N>) {
	if (source instanceof Draw && prevSource instanceof Draw) {
		return source.templateStrings === prevSource.templateStrings;
	}
	
	return source === prevSource;
}

function removeRenderResults<N>(
	utils: UtilsInterface<N>,
	render: Render<N>,
  index: number,
) {
	const indexStack = [index];
	
	// hello
}

function addRenderResults<N>(
	utils: UtilsInterface<N>,
	render: Render<N>,
	source: RenderSource<N>,
  index: number,
) {
	const indexStack = [index];
	
	// hello
}

function diffSources<N>(
  utils: UtilsInterface<N>,
  source: RenderSource<N>,
  prevSource: RenderSource<N>,
  prevRender?: Render<N>,
  parentNode?: N,
  leftNode?: N,
) {

		// create stack
		//
		//

  	if (prevSource === undefined) {
  		// add source
  	}
  	
  	if (source === undefined) {
  		// remove source
  	}
  	
  	// diffSource
  	
		// if same source
		if (compareSources(source, prevSource)) {
			// migrate source
		}
		
		// otherwise
		// remove source
		// add source
	
}

// iterate left to right with 
function diff<N>(
  utils: UtilsInterface<N>,
  sources: RenderSource<N>[],
  prevSources?: RenderSource<N>[],
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
	
  let sourceLength = Math.max(prevSources?.length ?? 0, sources.length);
  for(let index = 0; index < sourceLength; index++) {
  	const prevSource = prevSources?.[index];
  	const source = sources[index];
		
		if (source === undefined) {
  		// remove prev source
  		continue
  	}
  	
		if (prevSource === undefined) {
  		// add source
  		continue;
  	}

  	// compare sources
  }
  
  return render;
}

export { diff };
