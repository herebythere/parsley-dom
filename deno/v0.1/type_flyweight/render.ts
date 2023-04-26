import type { DrawInterface } from "./draw.ts";
import type { BuildInterface } from "./build.ts";

interface StringInterface {
  toString(): string;
}

type RenderSource<N> = DrawInterface | N | StringInterface;

type RenderFunc<N, S = unknown> = (state: S) => RenderSource<N>;

type RenderResult<N> = BuildInterface<N> | N | undefined;

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

interface DeltaTargets {
  addedIndexes: number[];
  survivedIndexes: number[];
  prevSurvivedIndexes: number[];
  removedIndexes: number[];
}

export type {
  DeltaTargets,
  Render,
  RenderFunc,
  RenderNode,
  RenderResult,
  RenderSource,
};
