import type { DrawInterface } from "./draw.ts";
import type { BuildInterface } from "./build.ts";

type RenderSource<N> = DrawInterface | N | string;

type RenderFunc<N, S = unknown> = (state: S) => RenderSource<N>;

type RenderResult<N> = BuildInterface<N> | N;

interface RenderNode<N> {
  id: number;
  parentId: number;
  descendants: number[];
}

interface Render<N> {
  results: RenderResult<N>[];
  nodes: RenderNode<N>[];
}

export type { RenderNode, RenderResult, RenderSource, RenderFunc, Render };
