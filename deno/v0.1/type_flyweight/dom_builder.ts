import type { HTMLElementInterface } from "./dom_structure.ts"

// other types of injections later
interface BuilderInjection {
  address: number[];
  type: string;
  index: number;
};

interface BuilderDataInterface<N> {
  template: Readonly<string[]>;
  fragment: N;
  slots: Map<string, number[]>;
  references: Map<string, number[]>;
  injections: Map<number, BuilderInjection>;
  address: number[];
  nodes: (N | undefined)[];
  attribute?: string;
}

export type {
  BuilderDataInterface,
  BuilderInjection,
};
