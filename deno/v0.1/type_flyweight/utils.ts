interface Utils<N> {
  createNode(tagname: string): N;
  createTextNode(text: string): N;
  insertNode(node: N, parentNode?: N, leftNode?: N): void;
  cloneTree(node: N): N;
  getDescendent(node: N, address: number[]): N | void;
}

export type { Utils };
