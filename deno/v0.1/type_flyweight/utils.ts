interface Utils<N> {
  createNode(tagname: string): N;
  createTextNode(text: string): N;
  insertNode(node: N, parentNode?: N, leftNode?: N): void;
  cloneTree(node: N): N;
  getDescendant(
    baseTier: N[],
    address: number[],
    depth?: number,
  ): N | undefined;
  // setAttribute(references: Map<string, N>, node: N, name: string, value: unknown)
}

export type { Utils };
