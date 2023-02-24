/*
	build DrawInterface

	addresses for elements
*/

import type { BuilderInterface, BuildStep } from "../deps.ts";
import type { Stacks, BuilderInjection, BuilderRender, BuilderDataInterface, ParsleyNode, UtilityMethods } from "../type_flyweight/dom_builder.ts";

import { getText } from "../deps.ts";




function attributeLogic(data: BuilderDataInterface, step: BuildStep) {
  if (step.type !== "BUILD") return;
  
  // find independent attribute
  if (data.stack.attribute && (step.state !== "ATTRIBUTE_SETTER" && step.state !== "ATTRIBUTE_DECLARATION")) {
  	// if attribute
  }
  
  // add attribute
  if (step.state === "ATTRIBUTE") {
    const attribute = getText(data.template, step.vector);
    if (attribute === undefined) return;
    
    // if reference
    if (attribute.startsWith("*")) {
      data.render.references.set(attribute, data.stack.address.slice());
      return;
    }
    
    // otherwise send to "set attribute" for handling
    

    // set attribute
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
  	
    const value = getText(data.template, step.vector);
    // need replacement logic
    // data.stack.tagname === "slot" &&
    if (
    	value !== undefined &&
      data.stack.attribute === "name"
    ) {
      data.render.slots.set(value, data.stack.address.slice());
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
    if (tagname === undefined) return;
    
    data.stack.address[data.stack.address.length - 1] += 1;

  }

  if (step.state === "NODE_CLOSED") {
    data.stack.address.push(-1);
  }

  if (step.state === "TEXT") {

    const text = getText(data.template, step.vector)
    if (text === undefined) return;
    // create node
    // const node = hooks.createTextNode(text);
    // data.stack.nodes[data.stack.address.length - 1] = node;
    data.stack.address[data.stack.address.length - 1] += 1;
    //add to stack
  }

  if (step.state === "CLOSE_NODE_CLOSED") {
    data.stack.address.pop();
    // data.stack.nodes.pop();
  }
}

function injectLogic(data: BuilderDataInterface, step: BuildStep) {
  if (step.type !== "INJECT") return;
  const { state: type, index } = step;
	
  data.render.injections.set(index, {
    address: data.stack.address.slice(),
    type,
    index,
  });
}


class DOMBuilder implements BuilderInterface, BuilderDataInterface {
	fragment = document.creatDocumentFragment();
	slots = new Map<string, number[]>();
  references = new Map<string, number[]>();
  injections = new Map<number, BuilderInjection>();
  address: number[];
  attribute?: string;
  
  push(template: Readonly<string[]>, step: BuildStep) {
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
  
  createRender() {
  	// clone fragment
  	//
  	// create slot map from addresses
  	// create reference map from addresses
  	// injections
  }
}

export { DOMBuilder };

export type { BuilderInjection };
