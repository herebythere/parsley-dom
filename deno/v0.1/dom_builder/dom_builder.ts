import type { BuilderInterface, BuildStep } from "../deps.ts";
import type {
  BuilderDataInterface,
  BuilderInjection,
} from "../type_flyweight/dom_builder.ts";
import type {
  Utils,
} from "../type_flyweight/utils.ts";

import { getText } from "../deps.ts";

/*
function attributeLogic<N>(data: BuilderDataInterface<N>, step: BuildStep) {
  if (step.type !== "BUILD") return;
}
*/

function insertNodeLogic(node: Node, parentNode?: Node, leftNode?: Node) {
	if (parentNode === undefined) return;
	
	if (leftNode?.nextSibling) {
		node.insertBefore(node, leftNode.nextSibling);
		return;
	}
	
	parentNode.appendChild(node);
}

function insertNode(data: BuilderDataInterface, node: Node) {
  const parentIndex = data.nodes.length - 2;
  let parentNode = data.nodes[parentIndex];
  if (parentIndex === -1) {
  	data.baseTier.push(node)
  }
  
  insertNodeLogic(node, parentNode);
  
  data.nodes[data.nodes.length - 1] = node;
  data.address[data.address.length - 1] += 1;
}

function stackLogic(data: BuilderDataInterface, step: BuildStep) {
  if (step.type !== "BUILD") return;

  if (step.state === "INITIAL") {
    data.address.push(-1);
    data.nodes.push(undefined);
  }
  
  if (step.state === "TEXT") {
    const text = getText(data.template, step.vector);
    if (text === undefined) return;

    const node = document.createTextNode(text);
    insertNode(data, node);
  }

  if (step.state === "TAGNAME") {
    const tagname = getText(data.template, step.vector);
    if (tagname === undefined || tagname === "") return;

    const node = document.createElement(tagname);
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

function injectLogic(data: BuilderDataInterface, step: BuildStep) {
  if (step.type !== "INJECT") return;
  const { state: type, index } = step;

  data.injections.set(index, {
    address: data.address.slice(),
    type,
    index,
  });
}

class DOMBuilder implements BuilderInterface, BuilderDataInterface {
  // stack
  baseTier: Node[] = [];
  address: number[] = [];
  nodes: (Node | undefined)[] = [];
  attribute?: string;
  
  // results
  references = new Map<string, number[]>();
  injections = new Map<number, BuilderInjection>();

  template: Readonly<string[]>;
  
  constructor(template: Readonly<string[]>) {
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

export { DOMBuilder };

