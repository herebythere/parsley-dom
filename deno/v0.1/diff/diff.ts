import type { UtilsInterface } from "../type_flyweight/utils.ts";
import type {
  DeltaTargets,
  Render,
  RenderNode,
  RenderSource,
} from "../type_flyweight/render.ts";

import { createAddedBuilds, createRender } from "./build.ts";

import { findTargets } from "./utils.ts";
import { Build } from "../build/build.ts";
import { SourceLink } from "./utils.ts";

import { getDeltas } from "./deltas.ts";

// one time compose, no diffs retuns new render
// function compose()

// order:
// create sources
// unmount changed areas
// remove changed nodes
// create added nodes
// mount changed areas
// mount added nodes

function mountRoot<N>(
  utils: UtilsInterface<N>,
  render: Render<N>,
  parentNode: N,
  prevNode?: N,
) {
  let prev = prevNode;

  for (const sourceIndex of render.root) {
    const build = render.builds[sourceIndex];
    if (build instanceof Build) {
      for (const node of build.nodes) {
        utils.insertNode(node, parentNode, prev);
        prev = node;
      }
    }

    const node = utils.getIfNode(build);
    if (node !== undefined) {
      utils.insertNode(node, parentNode, prev);
      prev = node;
    }
  }
}

function mountNodes<N>(
  utils: UtilsInterface<N>,
  render: Render<N>,
  delta: DeltaTargets,
) {
  for (const sourceIndex of delta.addedIndexes) {
    const source = render.sources[sourceIndex];
    if (!(source instanceof SourceLink)) continue;

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
        const build = render.builds[sourceIndex];

        if (source instanceof SourceLink && build instanceof Build) {
          const parent = render.parents[source.parentIndex];
          for (const node of build.nodes) {
            utils.insertNode(node, descParentNode, prev);
            prev = node;
          }
        }

        const nodeBuild = utils.getIfNode(build);
        if (nodeBuild !== undefined) {
          utils.insertNode(nodeBuild, descParentNode, prev);
          prev = node;
        }
      }
    }
  }
}

function unmountNodes<N>(
  utils: UtilsInterface<N>,
  render: Render<N>,
  delta: DeltaTargets,
) {
  for (const sourceIndex of delta.removedIndexes) {
    const build = render.builds[sourceIndex];
    if (build instanceof Build) {
      for (const node of build.nodes) {
        utils.removeNode(node);
      }
    }

    const nodeBuild = utils.getIfNode(build);
    if (nodeBuild !== undefined) {
      utils.removeNode(nodeBuild);
    }
  }
}

function unmountChangedAreas<N>(
  utils: UtilsInterface<N>,
  prevRender: Render<N>,
  delta: DeltaTargets,
) {
  for (let index = 0; index < delta.prevDescIndexes.length; index++) {
    const prevRenderIndex = delta.prevDescIndexes[index];
    const descArrayIndex = delta.descArrayIndexes[index];
    const prevSource = prevRender.sources[prevRenderIndex];

    if (prevSource instanceof SourceLink) {
      const prevParent = prevRender.parents[prevSource.parentIndex];
      const prevNodes = prevRender.nodes[prevSource.nodeIndex];
      const prevDescs = prevNodes[descArrayIndex];

      for (const descIndex of prevDescs) {
        const descBuild = prevRender.builds[descIndex];
        if (descBuild instanceof Build) {
          for (const node of descBuild.nodes) {
            utils.removeNode(node);
          }
          continue;
        }

        const node = utils.getIfNode(descBuild);
        if (node !== undefined) {
          utils.removeNode(node);
        }
      }
    }
  }
}

function mountChangedAreas<N>(
  utils: UtilsInterface<N>,
  render: Render<N>,
  delta: DeltaTargets,
) {
  for (let index = 0; index < delta.descIndexes.length; index++) {
    const renderIndex = delta.descIndexes[index];
    const descArrayIndex = delta.descArrayIndexes[index];

    const source = render.sources[renderIndex];
    const build = render.builds[renderIndex];

    if (source instanceof SourceLink && build instanceof Build) {
      const nodes = render.nodes[source.nodeIndex];
      const parent = render.parents[source.parentIndex];

      const descs = nodes[descArrayIndex];

      let { node: left, parentNode: descParentNode } =
        build.descendants[descArrayIndex];
      descParentNode = descParentNode ?? parent;

      for (const descIndex of descs) {
        const source = render.sources[descIndex];
        const descBuild = render.builds[descIndex];
        if (source instanceof SourceLink && descBuild instanceof Build) {
          for (const node of descBuild.nodes) {
            utils.insertNode(node, descParentNode, left);
            left = node;
          }
          continue;
        }

        const node = utils.getIfNode(descBuild);
        if (node !== undefined) {
          utils.insertNode(node, descParentNode, left);
          left = node;
        }
      }
    }
  }
}

// order:
// create sources
// unmount changed areas
// remove changed nodes
// create added nodes
// mount changed areas
// mount added nodes
function diff<N>(
  utils: UtilsInterface<N>,
  source: RenderSource<N>,
  parentNode: N,
  leftNode?: N,
  prevRender?: Render<N>,
): Render<N> {
  // create current render
  const render: Render<N> = {
    root: [],
    sources: [],
    draws: [],
    builds: [],
    parents: [parentNode],
    nodes: [],
  };

  const delta: DeltaTargets = {
    remountRoot: false,
    addedIndexes: [],
    prevSurvivedIndexes: [],
    survivedIndexes: [],
    descIndexes: [],
    prevDescIndexes: [],
    descArrayIndexes: [],
    removedIndexes: [],
  };

  // create sources
  createRender<N>(utils, render, source);

  // compare to previous render
  if (prevRender === undefined) {
    // for every source in root
    // if source is a draw add descendant indexes
    for (const sourceIndex of render.root) {
      findTargets(render, delta.addedIndexes, sourceIndex);
    }
  } else {
    getDeltas(render, prevRender, delta);
  }

  // unmount changed areas
  if (prevRender !== undefined) {
    unmountChangedAreas(
      utils,
      prevRender,
      delta,
    );
  }

  // unmount removed nodes
  if (prevRender !== undefined) {
    unmountNodes(utils, prevRender, delta);
  }

  // remove changed nodes
  // create added nodes
  // mount changed areas
  // mount added nodes

  createAddedBuilds(utils, delta, render);

  if (prevRender === undefined) {
    // or if parentNode and leftNode changed
    mountRoot(utils, render, parentNode, leftNode);
  }

  if (prevRender !== undefined) {
    mountChangedAreas(
      utils,
      render,
      delta,
    );
  }

  mountNodes(utils, render, delta);

  console.log(delta);
  console.log(render);

  return render;
}

export { diff };
