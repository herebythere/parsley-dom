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
	HTMLElementInterface
} from "../type_flyweight/dom_structure.ts";

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

function stackLogic<N>(data: BuilderDataInterface<N>, step: BuildStep) {
  if (step.type !== "BUILD") return;

  if (step.state === "INITIAL") {
    data.address.push(-1);
    data.nodes.push(undefined);
  }

  if (step.state === "TAGNAME") {
    const tagname = getText(data.template, step.vector);
    if (tagname === undefined || tagname === "") return;

    const node = document.createElement(tagname);
    // data.nodes[data.nodes.length - 1] = node;
    // data.address[data.address.length - 1] += 1;
  }

  if (step.state === "NODE_CLOSED") {
    data.address.push(-1);
    data.nodes.push(undefined);
  }

  if (step.state === "TEXT") {
    const text = getText(data.template, step.vector);
    if (text === undefined) return;

    const node = document.createTextNode(text);
    // data.nodes[data.nodes.length - 1] = node;
    // data.address[data.address.length - 1] += 1;
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

// unique circumstance of building template outside of service worker
//
// template
// send build instructions
//
//
//  DOMSender -> {build step}

// this class is intended to reside on client ui
// Web component built on UI thread

/*
	why does this feel wrong?
	build something with steps

	need to cross from vector -> string
	that requires a template

	that eventually has to happen
*/



class DOMBuilder<N> implements BuilderInterface, BuilderDataInterface<N> {
	fragment!: N;
  template!: Readonly<string[]>;

  // results
  slots = new Map<string, number[]>();
  references = new Map<string, number[]>();
  injections = new Map<number, BuilderInjection>();

  // stack
  address!: number[];
  nodes!: (N | undefined)[];
  attribute?: string;

  setup(template: Readonly<string[]>) {
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
