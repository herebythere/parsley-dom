import type { ChunkBaseArray } from "https://raw.githubusercontent.com/taylor-vann/parsley/main/src/parsley.ts";
import type { DocumentNode } from "../hooks/hooks.ts";

type Attach<N> = (parentNode: N, chunkArray: ChunkBaseArray<N>) => void;

const attach: Attach<DocumentNode> = (parentNode, chunkArray) => {
  let leftNode;

  for (const chunkID in chunkArray) {
    const chunk = chunkArray[chunkID];
    leftNode = chunk.mount(parentNode, leftNode);
  }
};

export { attach };
