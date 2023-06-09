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

interface BuilderStack<N> {
  address: number[];
  nodes: (N | undefined)[];
  attribute?: string;
}

export type { BuilderDataInterface, BuilderInjection, BuilderStack };
