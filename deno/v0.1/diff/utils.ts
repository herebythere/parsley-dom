import type {
  DeltaTargets,
  Render,
  RenderSource,
  SourceLinkInterface,
} from "../type_flyweight/render.ts";

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
  const source = render.sources[sourceIndex];
  if (source instanceof SourceLink) {
    let index = targets.length;
    console.log("findTargets");

    const node = render.nodes[source.nodeIndex];
    for (const descArray of node) {
      for (const descIndex of descArray) {
        const descSource = render.sources[descIndex];
        if (descSource instanceof SourceLink) {
          targets.push(descIndex);
        }
      }
    }

    console.log("mid findTargets");
    while (index < targets.length) {
      const targetIndex = targets[index];
      const source = render.sources[targetIndex];
      console.log("found target", targetIndex, source);
      if (source instanceof SourceLink) {
        const node = render.nodes[source.nodeIndex];
        // iterate across all nodes
        console.log("target is source link", node);
        for (const descArray of node) {
          for (const descIndex of descArray) {
            const descSource = render.sources[descIndex];
            if (descSource instanceof SourceLink) {
              console.log("desc source link found");
              targets.push(descIndex);
            }
          }
        }
      }

      index += 1;
    }
  }
  // get soujrce
  // if source is not node link skip
  //
  // get node index
}

export { findTargets, SourceLink };
