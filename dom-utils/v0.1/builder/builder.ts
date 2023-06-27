import type { BuilderStack } from "../type_flyweight/builder.ts";
import type {
  BuilderDataInterface,
  BuilderInjection,
  BuilderInterface,
  BuildStep,
  UtilsInterface,
} from "../deps.ts";

import { getText } from "../deps.ts";

/*
function attributeLogic<N>(data: BuilderDataInterface<N>, step: BuildStep) {
  if (step.type !== "BUILD") return;
}
*/

function insertNode<N>(
  utils: UtilsInterface<N>,
  stack: BuilderStack<N>,
  data: BuilderDataInterface<N>,
  node: N,
) {
  const parentIndex = stack.nodes.length - 2;
  let parentNode = stack.nodes[parentIndex];
  if (parentNode === undefined) {
    data.nodes.push(node);
  }

  utils.insertNode(node, parentNode);

  const nodesLength = stack.nodes.length - 1;
  stack.nodes[nodesLength] = node;
  stack.address[nodesLength] += 1;

  if (!utils.getIfTextNode(node)) {
    stack.parentAddress[nodesLength] = stack.address[nodesLength];
  }
}

function stackLogic<N>(
  utils: UtilsInterface<N>,
  template: Readonly<string[]>,
  stack: BuilderStack<N>,
  step: BuildStep,
  data: BuilderDataInterface<N>,
) {
  if (step.type !== "BUILD") return;

  if (step.state === "TEXT") {
    const text = getText(template, step.vector);
    if (text === undefined) return;

    const node = utils.createTextNode(text);
    insertNode(utils, stack, data, node);
  }

  if (step.state === "TAGNAME") {
    const tagname = getText(template, step.vector);
    if (tagname === undefined || tagname === "") return;

    const node = utils.createNode(tagname);
    insertNode(utils, stack, data, node);
  }

  if (step.state === "NODE_CLOSED") {
    stack.address.push(-1);
    stack.parentAddress.push(-1);
    stack.nodes.push(undefined);
  }

  if (step.state === "CLOSE_NODE_CLOSED") {
    stack.address.pop();
    stack.parentAddress.pop();
    stack.nodes.pop();
  }
}

function injectLogic<N>(
  stack: BuilderStack<N>,
  step: BuildStep,
  data: BuilderDataInterface<N>,
) {
  if (step.type !== "INJECT") return;
  const { index, state: type } = step;
  const injection = {
    address: stack.address.slice(),
    parentAddress: stack.parentAddress.slice(0, stack.parentAddress.length - 1),
    index,
    type,
  };

  if (type === "DESCENDANT_INJECTION") {
    data.descendants.push(injection);
    return;
  }

  data.injections.push(injection);
}

// make steps array or array like

// Builder becomes associated with utils more specifically

function createBuilder<N>(
  utils: UtilsInterface<N>,
  template: Readonly<string[]>,
  steps: BuildStep[],
) {
  const data: BuilderDataInterface<N> = {
    nodes: [],
    injections: [],
    descendants: [],
  };

  // if last step is an error return data
  if (steps.length === 0 || steps[steps.length - 1].state === "ERROR") {
    return data;
  }

  const stack: BuilderStack<N> = {
    nodes: [undefined],
    // parent address
    parentAddress: [-1],
    address: [-1],
    attribute: undefined,
  };

  for (const step of steps) {
    if (step.type === "BUILD") {
      // attributeLogic(this, step);
      stackLogic(utils, template, stack, step, data);
    }

    if (step.type === "INJECT") {
      injectLogic(stack, step, data);
    }
  }

  return data;
}

export { createBuilder };
