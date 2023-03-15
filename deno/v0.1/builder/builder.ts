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

function insertNode<N>(
  utils: Utils<N>,
  data: BuilderDataInterface<N>,
  node: N,
) {
  const parentIndex = data.nodes.length - 2;
  let parentNode = data.nodes[parentIndex];
  if (parentIndex === -1) {
    data.nodeTier.push(node);
  }

  utils.insertNode(node, parentNode);

  data.nodes[data.nodes.length - 1] = node;
  data.address[data.address.length - 1] += 1;
}

function stackLogic<N>(
  utils: Utils<N>,
  data: BuilderDataInterface<N>,
  step: BuildStep,
) {
  if (step.type !== "BUILD") return;

  if (step.state === "TEXT") {
    const text = getText(data.template, step.vector);
    if (text === undefined) return;

    const node = utils.createTextNode(text);
    insertNode(utils, data, node);
  }

  if (step.state === "TAGNAME") {
    const tagname = getText(data.template, step.vector);
    if (tagname === undefined || tagname === "") return;

    const node = utils.createNode(tagname);
    insertNode(utils, data, node);
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
  const injection = {
    address: data.address.slice(),
    index,
    type,
  };

  if (type === "DESCENDANT_INJECTION") {
    data.descendants.push(injection);
    return;
  }

  data.injections.push(injection);
}

class Builder<N> implements BuilderInterface, BuilderDataInterface<N> {
  // stack
  nodes: (N | undefined)[] = [undefined];
  address: number[] = [-1];
  attribute?: string;

  // results
  nodeTier: N[] = [];
  injections: BuilderInjection[] = [];
  descendants: BuilderInjection[] = [];
  references = new Map<string, number[]>();

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
      stackLogic(this.utils, this, step);
    }

    if (step.type === "INJECT") {
      injectLogic(this, step);
    }
  }
}

export { Builder };
