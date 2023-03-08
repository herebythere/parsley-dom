/*
	build DrawInterface

	addresses for elements
*/

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

  // find independent attribute
  if (
    data.attribute &&
    (step.state !== "ATTRIBUTE_SETTER" &&
      step.state !== "ATTRIBUTE_DECLARATION")
  ) {
    // if attribute
  }

  // add attribute
  if (step.state === "ATTRIBUTE") {
    const attribute = getText(data.template, step.vector);
    if (attribute === undefined) return;

    // if reference
    if (attribute.startsWith("*")) {
      data.references.set(attribute, data.address.slice());
      return;
    }

    // otherwise send to "set attribute" for handling

    // set attribute
    data.attribute = attribute;
  }

  // if attribute undefined skip the rest?

  // attribute declaration close
  if (step.state === "ATTRIBUTE_DECLARATION") {
    // add new array for attributes
  }

  // add attribute values to array
  if (step.state === "ATTRIBUTE_VALUE" && data.attribute !== undefined) {
    // logic neds to be updated to include
    if (data.attribute) {
    }

    const value = getText(data.template, step.vector);
    // need replacement logic
    // data.tagname === "slot" &&
    if (
      value !== undefined &&
      data.attribute === "name"
    ) {
      data.slots.set(value, data.address.slice());
    }

    // if (value !== undefined) {
    // set attribute
    // }
    data.attribute = undefined;
  }

  // attribute declaration close
  if (step.state === "ATTRIBUTE_DECLARATION_END") {
    // if attribute value length < 2
    // 	set attribute
    //	return

    //  otherwise its an injection
    //	set array in attribute injections
    //	{ address, name, array, index }
  }
}

function insertNode<N>(data: BuilderDataInterface<N>, node: N) {
  const leftIndex = data.nodes.length - 1;
  const parentIndex = data.nodes.length - 2;
  const leftNode = data.nodes[leftIndex];
  const parentNode = data.nodes[parentIndex];
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
  slots = new Map<string, number[]>();
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
