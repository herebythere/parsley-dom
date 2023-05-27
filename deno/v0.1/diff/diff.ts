import type { UtilsInterface } from "../type_flyweight/utils.ts";
import type {
  DeltaTargets,
  Render,
  RenderNode,
  RenderSource,
} from "../type_flyweight/render.ts";

import {
  createAddedBuilds,
  createNodesFromSource,
  createRender,
} from "./build.ts";

import { findTargets } from "./utils.ts";
import { Build } from "../build/build.ts";
import { SourceLink } from "./utils.ts";
// one time compose, no diffs retuns new render
// function compose()

function compose<N>(
  utils: UtilsInterface<N>,
  source: RenderSource<N>,
  parentNode: N,
  leftNode?: N,
) {
  const render: Render<N> = createRender<N>(utils, source, parentNode);

  // mount

  return render;
}

function mount<N>(
  utils: UtilsInterface<N>,
  render: Render<N>,
  parentNode: N,
  prevNode?: N,
) {
  let prev = prevNode;

  // mount root
  for (const sourceIndex of render.root) {
    const build = render.builds[sourceIndex];
    const node = utils.getIfNode(build);
    if (node !== undefined) {
      utils.insertNode(node, parentNode, prev);
      prev = node;
      continue;
    }

    if (build instanceof Build) {
      for (const node of build.nodes) {
        utils.insertNode(node, parentNode, prev);
        prev = node;
      }
    }
  }
}

function mountNodes<N>(
  utils: UtilsInterface<N>,
  render: Render<N>,
  delta: DeltaTargets,
) {
  // added indexes
  // if sourrce link
  // get build and parent for each render

  for (const sourceIndex of delta.addedIndexes) {
    const source = render.sources[sourceIndex];
    if (!(source instanceof SourceLink)) continue;

    if (source instanceof SourceLink) {
      const parentNode = render.parents[source.parentIndex];
      const node = render.nodes[source.nodeIndex];
      const buildSource = render.builds[sourceIndex];
      if (!(buildSource instanceof Build)) continue;

      for (let arrayIndex = 0; arrayIndex < node.length; arrayIndex++) {
        const sourceIndexes = node[arrayIndex];
        let { node: prev, parentNode: descParentNode } =
          buildSource.descendants[arrayIndex];
        descParentNode = descParentNode ?? parentNode;

        for (const sourceIndex of sourceIndexes) {
          const source = render.sources[sourceIndex];
          if (source instanceof SourceLink) {
            const parent = render.parents[source.parentIndex];
            const build = render.builds[sourceIndex];
            if (build instanceof Build) {
              for (const node of build.nodes) {
                utils.insertNode(node, parent, prev);
                prev = node;
              }
            }
            continue;
          }

          const build = render.builds[sourceIndex];
          const nodeBuild = utils.getIfNode(build);
          if (nodeBuild !== undefined) {
            console.log("found node descendants!");
            utils.insertNode(nodeBuild, descParentNode, prev);
            prev = node;
          }
        }
      }
    }
  }
}

function diff<N>(
  utils: UtilsInterface<N>,
  source: RenderSource<N>,
  parentNode: N,
  leftNode?: N,
  prevRender?: Render<N>,
): Render<N> {
  // create current render
  const render: Render<N> = createRender<N>(utils, source, parentNode);

  const delta: DeltaTargets = {
    addedIndexes: [],
    survivedIndexes: [],
    prevSurvivedIndexes: [],
    removedIndexes: [],
  };

  if (prevRender === undefined) {
    // for every source in root
    // if source is a draw add descendant indexes
    for (const sourceIndex of render.root) {
      findTargets(render, delta.addedIndexes, sourceIndex);
    }
  }

  createAddedBuilds(utils, delta, render);

  // mount
  if (prevRender === undefined) {
    mount(utils, render, parentNode, leftNode);
  }

  // missing first child
  // mount nodes
  mountNodes(utils, render, delta);

  console.log(delta);
  console.log(render);

  return render;
}

export { compose, diff };
