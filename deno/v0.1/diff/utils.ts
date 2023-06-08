import type { Render, SourceLinkInterface } from "../type_flyweight/render.ts";

class SourceLink implements SourceLinkInterface {
  drawIndex: number;
  nodeIndex: number;
  parentIndex: number = 0;

  constructor(drawIndex: number, nodeIndex: number) {
    this.drawIndex = drawIndex;
    this.nodeIndex = nodeIndex;
  }
}

function findTargets<N>(
  render: Render<N>,
  targets: number[],
  sourceIndex: number,
) {
  let index = targets.push(sourceIndex);

  const source = render.sources[sourceIndex];
  if (!(source instanceof SourceLink)) return;

  const node = render.nodes[source.nodeIndex];
  for (const descArray of node) {
    for (const descIndex of descArray) {
      // if source link?
      targets.push(descIndex);
    }
  }

  while (index < targets.length) {
    const targetIndex = targets[index];
    index += 1;

    const source = render.sources[targetIndex];
    if (!(source instanceof SourceLink)) continue;

    const node = render.nodes[source.nodeIndex];
    for (const descArray of node) {
      for (const descIndex of descArray) {
        targets.push(descIndex);
      }
    }
  }
}

export { findTargets, SourceLink };
