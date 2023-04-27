import type { Render } from "../type_flyweight/render.ts";

function findTargets<N>(
  targets: number[],
  render: Render<N>,
  sourceIndex: number,
) {
  targets.push(sourceIndex);

  let index = targets.length - 1;
  while (index < targets.length) {
    const nodeIndex = targets[index];
    const node = render.nodes[nodeIndex];
    for (const descIndex of node.descendants) {
      targets.push(descIndex);
    }

    index += 1;
  }
}

export { findTargets };
