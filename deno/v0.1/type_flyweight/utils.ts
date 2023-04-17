import type { BuilderDataInterface } from "./builder.ts";
import type { DrawInterface } from "./draw.ts";
import type { DrawFunc, RenderSource } from "./hangar.ts";

interface UtilsInterface<N> {
  createNode(tagname: string): N;
  createTextNode(text: string): N;
  insertNode(node: N, parentNode?: N, leftNode?: N): void;
  getIfNode(node: RenderSource<N>): N | undefined;
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
  // setAttribute(node: N, name: string, value: unknown)
}

export type { UtilsInterface };
