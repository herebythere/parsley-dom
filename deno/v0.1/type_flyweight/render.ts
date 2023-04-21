import type { DrawInterface } from "./draw.ts";
import type { BuildInterface } from "./build.ts";

interface StringInterface {
  toString(): string;
}

type RenderSource<N> = DrawInterface | N | StringInterface;

type RenderFunc<N, S = unknown> = (state: S) => RenderSource<N>;

type RenderResult<N> = BuildInterface<N> | N;

interface RenderNode {
  id: number;
  parentId: number;
  descendants: number[];
}

interface Render<N> {
  sources: unknown[];
  results: RenderResult<N>[];
  nodes: RenderNode[];
}

export type { Render, RenderFunc, RenderNode, RenderResult, RenderSource };
