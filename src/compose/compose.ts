// brian taylor vann
// compose

import type {
  Chunker,
  Draw,
} from "https://raw.githubusercontent.com/taylor-vann/parsley/main/src/parsley.ts";
import type { DocumentNode, Attributes } from "../hooks/hooks.ts";

import { Chunk } from "https://raw.githubusercontent.com/taylor-vann/parsley/main/src/parsley.ts";
import { hooks } from "../hooks/hooks.ts";

type ContextFactory<N, A, P, S> = (params: P) => Chunk<N, A, P, S>;

// N, A are provided initially, P S are provided later
type Compose<N, A> = <P = void, S = void>(
  chunker: Chunker<N, A, P, S>
) => ContextFactory<N, A, P, S>;

// create DEFAULT CHUNKER

const compose: Compose<DocumentNode, Attributes> = (chunker) => {
  return (params) => {
    return new Chunk({ hooks, chunker, params });
  };
};

const draw: Draw<DocumentNode, Attributes> = (templateArray, ...injections) => {
  return {
    templateArray,
    injections,
  };
};

export type { ContextFactory, Compose };

export { compose, draw };
