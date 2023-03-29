import type { BuildInterface } from "./build.ts";

interface RenderNode<N> {
  id: number;
  parentId: number;
  descendants: number[];
}

interface Render<N> {
  builds: BuildInterface<N>[];
  renders: RenderNode<N>[];
}

export type { RenderNode, Render }
