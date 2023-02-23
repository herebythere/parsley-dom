interface ParsleyNode {
  nodeName: string;
  parentNode: ParsleyNode | null;
  prevSibling: ParsleyNode | null;
  nextSibling: ParsleyNode | null;
  childNodes: ParsleyNode[];
  setAttribute(name: string, value?: string): void;
}

interface ParsleyMethods<N extends ParsleyNode> {
  createFragment(): N;
  createNode(tagname: string): N;
  createTextNode(text: string): N;
  insertDescendant(node: N, index: number, parentNode?: N): void;
  removeAttribute(name: string): void;
  setAttribute(node: N, name: string, value: string): void;
}

export { ParsleyNode, ParsleyMethods }
