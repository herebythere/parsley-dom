import type { Draws } from "./hangar.ts";

interface RenderNode<N> {
  id: number;
  parentId: number;
  descendants: number[];
}

interface Render<N> {
  builds: Draws<N>[];
  renders: RenderNode<N>[];
}

export type { Render, RenderNode };
