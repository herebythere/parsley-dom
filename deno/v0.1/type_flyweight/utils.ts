import type { BuilderDataInterface } from "./builder.ts";
import type { DrawInterface } from "./draw.ts";
import type { DrawFunc, Draws } from "./hangar.ts";

interface Utils<N> {
  createNode(tagname: string): N;
  createTextNode(text: string): N;
  insertNode(node: N, parentNode?: N, leftNode?: N): void;
  getIfNode(node: Draws<N>): N | undefined;
  //  getIfDrawFunc(node: Draws<N>): DrawFunc | undefined;
  cloneTree(node: N): N;
  getDescendant(
    baseTier: N[],
    address: number[],
    depth?: number,
  ): N | undefined;
  getBuilder(template: Readonly<string[]>): BuilderDataInterface<N> | undefined;
  setBuilder(
    template: Readonly<string[]>,
    builder: BuilderDataInterface<N>,
  ): void;
  // setAttribute(references: Map<string, N>, node: N, name: string, value: unknown)
}

export type { Utils };
