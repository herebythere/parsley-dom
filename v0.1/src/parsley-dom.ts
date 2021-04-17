// brian taylor vann
// parsely-dom

import type { ChunkBaseArray } from "./deps.ts";
import type { Banger, DocumentNode, Attributes } from "./hooks/hooks.ts";

type ChunkBaseArrayDOM = ChunkBaseArray<DocumentNode>;

export { compose, draw } from "./compose/compose.ts";
export { attach } from "./attach/attach.ts";
export type {
  Attributes,
  Banger,
  ChunkBaseArray,
  ChunkBaseArrayDOM,
  DocumentNode,
};
