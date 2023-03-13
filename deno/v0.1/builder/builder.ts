import type { BuilderInterface, BuildStep } from "../deps.ts";
import type {
  BuilderDataInterface,
  BuilderInjection,
} from "../type_flyweight/builder.ts";
import type { Utils } from "../type_flyweight/utils.ts";

import { getText } from "../deps.ts";

/*
function attributeLogic<N>(data: BuilderDataInterface<N>, step: BuildStep) {
  if (step.type !== "BUILD") return;
}
*/

function insertNode<N>(data: BuilderDataInterface<N>, node: N) {
  const parentIndex = data.nodes.length - 2;
  let parentNode = data.nodes[parentIndex];
  if (parentIndex === -1) {
    data.baseTier.push(node);
  }

  data.utils.insertNode(node, parentNode);

  data.nodes[data.nodes.length - 1] = node;
  data.address[data.address.length - 1] += 1;
}

function stackLogic<N>(data: BuilderDataInterface<N>, step: BuildStep) {
  if (step.type !== "BUILD") return;

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
  const { index, state: type } = step;
  data.injections.set(index, {
    address: data.address.slice(),
    type,
    index,
  });
}

class Builder<N> implements BuilderInterface, BuilderDataInterface<N> {
  // stack
  nodes: (N | undefined)[] = [undefined];
  address: number[] = [-1];
  baseTier: N[] = [];
  attribute?: string;

  // results
  injections = new Map<number, BuilderInjection>();

  // utils
  utils: Utils<N>;
  template: Readonly<string[]>;

  constructor(utils: Utils<N>, template: Readonly<string[]>) {
    this.utils = utils;
    this.template = template;
  }

  push(step: BuildStep) {
    if (step.state === "ERROR") {
      // empty fragment
      // label as errored
    }

    if (step.type === "BUILD") {
      // attributeLogic(this, step);
      stackLogic(this, step);
    }

    if (step.type === "INJECT") {
      injectLogic(this, step);
    }
  }
}

export { Builder };
