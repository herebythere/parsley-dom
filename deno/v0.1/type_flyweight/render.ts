interface RenderInjection<N> {
  node: N;
  index: number;
  type: string;
}

interface RenderInterface<N> {
	descendants: N[];
  references: Map<string, N>;
  injections: Map<number, RenderInjection<N>>;
}

export type { RenderInjection, RenderInterface }
