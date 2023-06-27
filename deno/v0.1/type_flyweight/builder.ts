interface BuilderInjection {
  address: number[];
  parentAddress: number[];
  type: string;
  index: number;
}

interface BuilderDataInterface<N> {
  nodes: N[];
  injections: BuilderInjection[];
  descendants: BuilderInjection[];
}

export type { BuilderDataInterface, BuilderInjection };
