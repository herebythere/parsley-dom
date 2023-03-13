import type { Utils } from "./utils.ts";

// other types of injections later
interface BuilderInjection {
  address: number[];
  type: string;
  index: number;
}

interface BuilderDataInterface<N> {
  utils: Utils<N>;
  template: Readonly<string[]>;
  baseTier: N[];
  references: Map<string, number[]>;
  injections: Map<number, BuilderInjection>;
  address: number[];
  nodes: (N | undefined)[];
  attribute?: string;
}

export type { BuilderDataInterface, BuilderInjection };
