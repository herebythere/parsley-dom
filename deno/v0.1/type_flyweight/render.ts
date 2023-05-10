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
  parentDescId: number;
  sourceId: number;
  descendants: number[][];
}

interface NodeLink {
	drawIndex: number;
	nodeIndex: number;
}

type RenderSource<N> = N | NodeLink;

interface Render<N> {
	sources: RenderSource[];
	nodes: RenderNode[];
	draws: DrawInterface[];
	builds: BuildInterface[];
}

interface DeltaTargets {
  addedIndexes: number[];
  addedDescIndexes: number[];
  survivedIndexes: number[];
  survivedDescIndexes: number[];
  prevSurvivedIndexes: number[];
  prevSurvivedDescIndexes: number[];
  removedIndexes: number[];
  removedDescIndexes: number[];
}

export type {
  DeltaTargets,
  Render,
  RenderFunc,
  RenderNode,
  RenderResult,
  RenderSource,
};
