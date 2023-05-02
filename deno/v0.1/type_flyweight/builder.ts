interface BuilderInjection {
  address: number[];
  type: string;
  index: number;
}

interface BuilderDataInterface<N> {
  nodes: N[];
  injections: BuilderInjection[];
  descendants: BuilderInjection[];
}

export type { BuilderDataInterface, BuilderInjection };
