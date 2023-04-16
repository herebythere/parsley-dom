import type { DrawInterface } from "./draw.ts";

interface RenderNode<N> {
  id: number;
  parentId: number;
  descendants: number[];
}

type RenderSource<N> = DrawInterface | N | string;

type RenderFunc<N, S = unknown> = (state: S) => RenderSource<N>;

interface Render<N> {
  sources: RenderSource<N>[];
  nodes: RenderNode<N>[];
}

export type { RenderNode, RenderSource, RenderFunc, Render };
