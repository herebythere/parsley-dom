import type { Attach, ChunkBaseArray } from "../deps.ts";
import type { DocumentNode } from "../hooks/hooks.ts";

const attach: Attach<DocumentNode> = (parentNode, chunkArray) => {
  let leftNode;

  for (const chunkID in chunkArray) {
    const chunk = chunkArray[chunkID];
    leftNode = chunk.mount(parentNode, leftNode);
  }
};

export { attach };
