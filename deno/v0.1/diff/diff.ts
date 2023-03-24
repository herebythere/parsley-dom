import { Utils } from "../type_flyweight/utils.ts";
import { DrawInterface } from "../type_flyweight/draw.ts";
import { BuildInterface } from "../type_flyweight/build.ts";

interface RenderNode<N> {
  id: number;
  parentId: number;
  leftId: number;
  prevId: number;
  draw: DrawInterface;
  build: BuildInterface<N>;
}

interface RenderStack<N> {
  // the missing renders from current draw (clean up)
  prevRender: RenderNode<N>[];
  // the current renders
  currRender: RenderNode<N>[];
}

// we get two

function getBuilder(template: ReadonlyArray<string>): BuilderInterface {
	let builder = builderCache.get(draw.template);
  if (builder !== undefined) return builder;

  builder = new Builder(utils, draw.template);
  builderCache.set(draw.template, builder);
}

function createBuilderArray<N>(
  utils: Utils<N>,
  prevRender: RenderNode<N>[],
  draw: DrawInterface,
) {
	const drawStack = [draw];
	const drawStackIndex = [0];
	
	while (drawStack.length > 0) {		
		// get draw
		const draw = drawStack[drawStack.length - 1];
		const builder = getBuilder(utils, draw.templateStrings);
		
		const stackIndex = drawStackIndex.length - 1;
		const drawIndex = drawStackIndex[stackIndex];
		drawStackIndex[stackIndex] += 1;
		
		// pop if draw index past descendant length
		if (builder.descendants.length <= drawIndex) {
			drawStack.pop();
			drawStackIndex.pop();
			continue;
		}

		const { index } = builder.descendants[drawIndex];
		const descendant = draw.injections[index];
		if (descendant instanceof Draw) {
			drawStack.push(descendant);
			drawStackIndex.push(0);
		}
	}
}

function diff() {
}

export { diff };
