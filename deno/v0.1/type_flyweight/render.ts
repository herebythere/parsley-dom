interface Render<N> {
	baseTier: N[];
  references: Map<string, number[]>;
  injections: Map<number, DescendantInjectionBR>;
}
