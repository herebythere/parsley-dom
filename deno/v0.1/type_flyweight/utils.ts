import type { BuilderDataInterface } from "./builder.ts";
import type { DrawInterface } from "./draw.ts";
import type { RenderResult } from "./render.ts";

interface UtilsInterface<N> {
  createNode(tagname: string): N;
  createTextNode(text: unknown): N;
  insertNode(node: N, parentNode?: N, leftNode?: N): void;
  removeNode(node: N, parentNode?: N, leftNode?: N): void;
  getIfNode(node: unknown): N | undefined;
  cloneTree(node: N): N;
  getDescendant(
    baseTier: N[],
    address: number[],
    depth?: number,
  ): N | undefined;
  getBuilderData(
    template: Readonly<string[]>,
  ): BuilderDataInterface<N> | undefined;
  // setAttribute(node: N, name: string, value: unknown)
}

export type { UtilsInterface };
