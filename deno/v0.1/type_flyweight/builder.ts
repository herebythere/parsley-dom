import type { Utils } from "./utils.ts";

// other types of injections later
interface BuilderInjection {
  address: number[];
  type: string;
  index: number;
}

interface BuilderDataInterface<N> {
  template: Readonly<string[]>;
  nodes: N[];
  references: Map<string, number[]>;
  injections: BuilderInjection[];
  descendants: BuilderInjection[];
  address: number[];
  nodeStack: (N | undefined)[];
  attribute?: string;
}

export type { BuilderDataInterface, BuilderInjection };
