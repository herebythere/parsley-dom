interface BuildInjection<N> {
  parentNode?: N;
  node?: N;
  index: number;
  type: string;
}

interface BuildInterface<N> {
  nodes: N[];
  references: Map<string, N>;
  descendants: BuildInjection<N>[];
  injections: BuildInjection<N>[];
}

export type { BuildInjection, BuildInterface };
