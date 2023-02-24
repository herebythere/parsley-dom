interface ParsleyNode {
  nodeName: string;
  parentNode: ParsleyNode | null;
  prevSibling: ParsleyNode | null;
  nextSibling: ParsleyNode | null;
  childNodes: ParsleyNode[];
  setAttribute(name: string, value?: string): void;
  removeAttribute(name: string): void;
}

interface UtilityMethods<N extends ParsleyNode = ParsleyNode> {
  createFragment(): N;
  createNode(tag: string): N;
  createTextNode(): N;
  insertDescendant(node: N, index: number, parentNode?: N): void;
  setAttribute(node: N, name: string, value?: string): void;
  removeAttribute(node: N, name: string): void;
}

interface Stacks {
  address: number[];
  attribute?: string;
}

interface DescendantInjection {
  address: number[];
  type: string;
  index: number;
}

interface DescendantInjectionBR {
  element: Element;
  type: string;
  index: number;
}

// other types of injections later
type BuilderInjection = DescendantInjection;

interface BuilderRender {
  slots: Map<string, number[]>;
  references: Map<string, number[]>;
  injections: Map<number, DescendantInjectionBR>;
}

interface BuilderDataInterface {
  render: BuilderRender;
  stack: Stacks;
  template: Readonly<string[]>;
}


export type { Stacks, BuilderInjection, BuilderRender, BuilderDataInterface, ParsleyNode, UtilityMethods }
