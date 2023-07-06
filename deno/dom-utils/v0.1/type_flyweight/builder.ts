interface BuilderStack<N> {
  address: number[];
  parentAddress: number[];
  nodes: (N | undefined)[];
  attribute?: string;
}

export type { BuilderStack };
