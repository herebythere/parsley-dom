import type { Utils } from "../type_flyweight/utils.ts";
import type { DrawInterface } from "../type_flyweight/draw.ts";
import type { BuildInterface } from "../type_flyweight/build.ts";
import type { BuilderDataInterface } from "../type_flyweight/builder.ts";

import { Draw } from "../draw/draw.ts";
import { Build } from "../build/build.ts";
import { Builder } from "../builder/builder.ts";

interface RenderNode<N> {
  id: number;
  parentId: number;
  leftId: number;
  draw: DrawInterface;
  build: BuildInterface<N>;
}

// we get two

function getBuilder<N>(
  utils: Utils<N>,
  template: ReadonlyArray<string>,
): BuilderDataInterface<N> {
  let builder = utils.getBuilder(template);
  if (builder !== undefined) return builder;

  builder = new Builder(utils, template);
  utils.setBuilder(template, builder);

  return builder;
}

// diffs are

function createBuilderArray<N>(
  utils: Utils<N>,
  prevRender: RenderNode<N>[],
  draw: DrawInterface,
) {
  // keep track of parent render and left render
  //	can grab nodes[] from render

  //

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
    //
    //	if prevDraw === last draw
    // 		add render to new renders
    //		remove old properties; add new properties; combine as update?
    //		mount parent and left node

    //

    //	if prevDraw !== currDraw
    //		unmount prevRender
    //		remove old properties
    //
    //		create new Render
    //		add updated properties
    //		mount new render

    // moving to next descendant in current queue
    drawStackIndex[stackIndex] += 1;
    const { index } = builder.descendants[drawIndex];
    const descendant = draw.injections[index];

    // could be an already composed "render"
    // something static who's args can be updated
    if (descendant instanceof Draw) {
      drawStack.push(descendant);
      drawStackIndex.push(0);
    }
  }
}

function diff() {
}

export { diff };
