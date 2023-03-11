// other types of injections later
interface BuilderInjection {
  address: number[];
  type: string;
  index: number;
};

interface BuilderDataInterface {
  template: Readonly<string[]>;
  baseTier: Node[];
  references: Map<string, number[]>;
  injections: Map<number, BuilderInjection>;
  address: number[];
  nodes: (Node | undefined)[];
  attribute?: string;
}

export type {
  BuilderDataInterface,
  BuilderInjection,
};
