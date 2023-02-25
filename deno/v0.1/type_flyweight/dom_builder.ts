interface ParsleyNode {
  nodeName: string;
  parentNode: ParsleyNode | null;
  prevSibling: ParsleyNode | null;
  nextSibling: ParsleyNode | null;
  childNodes: ParsleyNode[];
  setAttribute(name: string, value?: string): void;
  removeAttribute(name: string): void;
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

interface RenderDataInterface {
  template: Readonly<string[]>;
  fragment: Element;
	slots: Map<string, number[]>;
  references: Map<string, number[]>;
  injections: Map<number, BuilderInjection>;
  address: number[];
  attribute?: string;
}


export type { Stacks, BuilderInjection, BuilderRender, BuilderDataInterface, ParsleyNode, UtilityMethods }
