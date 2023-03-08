import type { BuilderInterface, BuildStep } from "../deps.ts";
import type {
  BuilderDataInterface,
  BuilderInjection,
} from "../type_flyweight/dom_builder.ts";
import type {
  Utils,
} from "../type_flyweight/utils.ts";

import { getText } from "../deps.ts";

function attributeLogic<N>(data: BuilderDataInterface<N>, step: BuildStep) {
  if (step.type !== "BUILD") return;
}

function insertNode<N>(data: BuilderDataInterface<N>, node: N) {
  const parentIndex = data.nodes.length - 2;
  const parentNode = data.nodes[parentIndex];
  const leftIndex = data.nodes.length - 1;
  const leftNode = data.nodes[leftIndex];
  
  data.utils.insertNode(node, parentNode, leftNode);
  
  data.nodes[data.nodes.length - 1] = node;
  data.address[data.address.length - 1] += 1;
}

function stackLogic<N>(data: BuilderDataInterface<N>, step: BuildStep) {
  if (step.type !== "BUILD") return;

  if (step.state === "INITIAL") {
    data.address.push(-1);
    data.nodes.push(undefined);
  }
  
  if (step.state === "TEXT") {
    const text = getText(data.template, step.vector);
    if (text === undefined) return;

    const node = data.utils.createTextNode(text);
    insertNode(data, node);
  }

  if (step.state === "TAGNAME") {
    const tagname = getText(data.template, step.vector);
    if (tagname === undefined || tagname === "") return;

    const node = data.utils.createNode(tagname);
    insertNode(data, node);
  }

  if (step.state === "NODE_CLOSED") {
    data.address.push(-1);
    data.nodes.push(undefined);
  }

  if (step.state === "CLOSE_NODE_CLOSED") {
    data.address.pop();
    data.nodes.pop();
  }
}

function injectLogic<N>(data: BuilderDataInterface<N>, step: BuildStep) {
  if (step.type !== "INJECT") return;
  const { state: type, index } = step;

  data.injections.set(index, {
    address: data.address.slice(),
    type,
    index,
  });
}

class DOMBuilder<N> implements BuilderInterface, BuilderDataInterface<N> {
	utils!: Utils<N>;
  template!: Readonly<string[]>;

  // results
  references = new Map<string, number[]>();
  injections = new Map<number, BuilderInjection>();

  // stack
  fragment!: N;
  address!: number[];
  nodes!: (N | undefined)[];
  attribute?: string;

  setup(utils: Utils<N>, template: Readonly<string[]>) {
  	this.utils = utils;
    this.template = template;
    this.address = [];
    this.nodes = [];
  }

  push(step: BuildStep) {
    if (step.state === "ERROR") {
      // empty fragment
      // label as errored
    }

    if (step.type === "BUILD") {
      attributeLogic(this, step);
      stackLogic(this, step);
    }

    if (step.type === "INJECT") {
      injectLogic(this, step);
    }
  }
}

export { DOMBuilder };

export type { BuilderInjection };
