// brian taylor vann
// parsely-dom

import type { ChunkBaseArray } from "https://raw.githubusercontent.com/taylor-vann/parsley/main/src/parsley.ts";
import type { Banger, DocumentNode, Attributes } from "./hooks/hooks.ts";

import { compose, draw } from "./compose/compose.ts";
import { attach } from "./attach/attach.ts";

type ChunkBaseArrayDOM = ChunkBaseArray<DocumentNode>;

export type { Banger, ChunkBaseArrayDOM, DocumentNode, Attributes };

export { compose, draw, attach };
