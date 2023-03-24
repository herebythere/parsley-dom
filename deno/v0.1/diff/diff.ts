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
		// get draw and builder
		const stackIndex = drawStack.length - 1;
		const draw = drawStack[stackIndex];
		const drawIndex = drawStackIndex[stackIndex];
		const builder = getBuilder(utils, draw.templateStrings);
		// go back in queue
		if (builder.descendants.length >= drawIndex) {
			drawStack.pop();
			drawStackIndex.pop();
			continue;
		}
		
		// compare draws

		// moving to next descendant in current queue
		drawStackIndex[stackIndex] += 1;
		const { index } = builder.descendants[drawIndex];
		const descendant = draw.injections[index];

		// there needs to be a space to decide if draw is sames
		if (descendant instanceof Draw) {
			drawStack.push(descendant);
			drawStackIndex.push(0);
		}
	}
}

function diff() {
}

export { diff };
