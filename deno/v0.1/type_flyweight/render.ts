import type { DrawInterface } from "./draw.ts";

interface RenderNode<N> {
  id: number;
  parentId: number;
  descendants: number[];
}

type RenderSource<N> = DrawInterface | N | string;

type RenderFunc<N, S = unknown> = (state: S) => RenderSource<N>;

type RenderResult<N> = BuildInterface | N;

interface Render<N> {
  results: RenderResult<N>[];
  nodes: RenderNode<N>[];
}

export type { RenderNode, RenderSource, RenderFunc, Render };
