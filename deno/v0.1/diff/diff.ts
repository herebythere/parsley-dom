import { Utils } from "../type_flyweight/utils.ts";
import { DrawInterface } from "../type_flyweight/draw.ts";
import { BuildInterface } from "../type_flyweight/build.ts";

interface RenderNode<N> {
  id: number;
  parentId: number;
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

function createBuilderArray<N>(
  utils: Utils<N>,
  prevBuild: RenderNode<N>[],
  draw: DrawInterface,
) {
  // swap prev build
  stack.index = 0;
  stack.prevBuild = stack.build;

  //
  // iterate through draws
  //
  const index = 0;
  const currBuild: RenderNode<N> = [{ id: index, parentId: -1, draw, build }];
  while (index < drwStack.length) {
    // get build

    // if instance of build or draw
    // for now just draw
    let builder = builderCache.get(draw.template);
    if (builder === undefined) {
      builder = new Builder(utils, draw.template);
      builderCache.set(draw.template, builder);
    }

    // add children to drwStack
    for (const descendant of builder.descendants) {
      const draw = draw.args[descendant.index];
      const build = prevBuild[1 + index + descendant.index];
      if (draw instanceof Draw) {
        drwStack.push(draw);
      }
    }

    // if they match that's great
    // this should be the easy part
    const drw = drwStack[index];
    if (drw.template === builder.template) {
      // indexes need to be reconciled
      currBuild[index] = prevBuild[index];
      index += 1;
      continue;
    }

    // if they don't
    // the index of the previous build will be off from the current build
    // but I only add to the tail because there is order to the render
    //

    // remove subsequent renders from previous renders
    // create a stack
    // remove descendants from parent nodes
    // remove mapped properties
    //

    // add children and create Current render
  }
}

function diff() {
}

export { diff };
