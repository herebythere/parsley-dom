interface RenderInjection<N> {
  parentNode?: N;
  node?: N;
  index: number;
  type: string;
}

interface RenderInterface<N> {
  nodeTier: N[];
  references: Map<string, N>;
  descendants: RenderInjection<N>[];
  injections: RenderInjection<N>[];
}

export type { RenderInjection, RenderInterface };
