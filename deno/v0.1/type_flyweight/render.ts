import type { DrawInterface } from "./draw.ts";
import type { BuildInterface } from "./build.ts";

interface StringInterface {
  toString(): string;
}

type RenderSource<N> = N | StringInterface | DrawInterface;

type RenderFunc<N, S = unknown> = (state: S) => RenderSource<N>;

type RenderResult<N> = BuildInterface<N> | N | StringInterface | undefined;

type RenderNode = number[][];

interface SourceLinkInterface {
  drawIndex: number;
  nodeIndex: number;
  parentIndex: number;
}

interface Render<N> {
  root: number[];
  sources: (N | StringInterface | SourceLinkInterface)[];
  nodes: RenderNode[];
  draws: DrawInterface[];
  parents: N[];
  builds: (N | BuildInterface<N> | undefined)[];
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
  SourceLinkInterface,
};
