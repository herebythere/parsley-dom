/*
	build DrawInterface

	addresses for elements
*/

import type { BuilderInterface, BuildStep } from "../deps.ts";

import { getText } from "../deps.ts";

const disallowedElements = new Set(["script"]);

/*
interface RenderMethods {
	createRoot;
	createNode;
	createTextNode;
	setAttribute;
	insertDescendant;
	clone;
}
*/

interface ParsleyNode {
  nodeName: string;
  parentNode: ParsleyNode | null;
  prevSibling: ParsleyNode | null;
  nextSibling: ParsleyNode | null;
  childNodes: ParsleyNode[];
  setAttribute(name: string, value?: string): void;
  removeAttribute(name: string): void;
}

interface ParsleyMethods<N extends ParsleyNode> {
  createFragment(): N;
  createNode(tag: string): N;
  createTextNode(): N;
  insertDescendant(node: N, index: number, parentNode?: N): void;
  setAttribute(node: N, name: string, value?: string): void;
  removeAttribute(node: N, name: string): void;
}

interface Stacks {
  slotFound: boolean;
  address: number[];
  attribute?: string;
}

interface BuilderInjection {
  address: number[];
  type: string;
  index: number;
}

interface BuilderRender {
  slots: Map<string, number[]>;
  references: Map<string, number[]>;
  injections: Map<number, BuilderInjection>;
}

interface BuilderDataInterface {
  render: BuilderRender;
  stack: Stacks;
  template: Readonly<string[]>;
}

function createBuilderRender(): BuilderRender {
  return {
    slots: new Map<string, number[]>(),
    references: new Map<string, number[]>(),
    injections: new Map<number, BuilderInjection>(),
  };
}

function createStack(): Stacks {
  return {
    attribute: undefined,
    slotFound: false,
    address: [],
  };
}


function attributeLogic(data: BuilderDataInterface, step: BuildStep) {
  if (step.type !== "BUILD") return;
  
  // find independent attribute
  if (data.stack.attribute && (step.state !== "ATTRIBUTE_SETTER" && step.state !== "ATTRIBUTE_DECLARATION")) {
  	// if attribute
  }
  
  // add attribute
  if (step.state === "ATTRIBUTE") {
    const attribute = getText(data.template, step.vector);
    // if reference
    if (attribute !== undefined && attribute.startsWith("*")) {
      data.render.references.set(attribute, data.stack.address.slice());
      return;
    }

    // unset attribute
    data.stack.attribute = attribute;
  }
  
  // if attribute undefined skip the rest?
  
    // attribute declaration close
  if (step.state === "ATTRIBUTE_DECLARATION") {
  	// add new array for attributes
  }

	// add attribute values to array
  if (step.state === "ATTRIBUTE_VALUE" && data.stack.attribute !== undefined) {
  	// logic neds to be updated to include
  	if (data.stack.attribute) {
  	
  	}
  	
  	if (data.stack.attribute) {
  		//
  	}
    const value = getText(data.template, step.vector);
    if (
      data.stack.slotFound && value !== undefined &&
      data.stack.attribute === "name"
    ) {
      data.render.slots.set(value, data.stack.address.slice());
      data.stack.slotFound = false;
    }

    // if (value !== undefined) {
    // set attribute
    // }
    data.stack.attribute = undefined;
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

function stackLogic(data: BuilderDataInterface, step: BuildStep) {
  if (step.type !== "BUILD") return;

  if (step.state === "INITIAL") {
    data.stack.address.push(-1);
  }

  if (step.state === "TAGNAME") {
    const tagname = getText(data.template, step.vector);
    data.stack.slotFound = tagname === "slot";

    data.stack.address[data.stack.address.length - 1] += 1;
    // create node add to stack
    // run through blocklist
    // if blocked then what?
  }

  if (step.state === "NODE_CLOSED") {
    data.stack.address.push(-1);
  }

  if (step.state === "TEXT") {
    data.stack.address[data.stack.address.length - 1] += 1;
    
    // create node add to stack
  }

  if (step.state === "CLOSE_NODE_CLOSED") {
    data.stack.address.pop();
  }
}

function injectLogic(data: BuilderDataInterface, step: BuildStep) {
  if (step.type !== "INJECT") return;
  const { state, index } = step;
  
  // if attribute injection
  // add to array ["", undefined, ""]
  // 

  data.render.injections.set(index, {
    address: data.stack.address.slice(),
    type: state,
    index,
  });
}

class DOMBuilder implements BuilderInterface, BuilderDataInterface {
  template!: Readonly<string[]>;
  stack!: Stacks;
  render!: BuilderRender;

  setup(template: Readonly<string[]>) {
    this.render = createBuilderRender();
    this.stack = createStack();
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
