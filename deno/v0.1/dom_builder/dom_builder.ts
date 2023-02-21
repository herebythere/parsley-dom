/*
	build DrawInterface
	
	addresses for elements
*/

import type { BuildStep, BuilderInterface } from "../deps.ts";

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

interface ParsleyNode<N> {
	parentNode: N;
	prevSibling: N;
	nextSibling: N;
	childNodes: N[];
}

interface ParsleyMethods<N> {
	createFragment(): N;
	createNode(tag: string): N;
	createTextNode(): N;
	insertAdjacentSibling(referenceNode: N, node: N): void;
	removeAttribute(name: string): void;
	setAttribute(name: string, value: string): void;
}

interface Stringable {
	toString(): string;
}

interface Stacks {
	slotFound: boolean;
	slotName?: string;
	attributeStep?: BuildStep;
	address: number[];
}

interface AttributeMapInjection {
	address: number[];
	type: "ATTRIBUTE_MAP_INJECTION";
	index: number;
}

interface DescendantInjection {
	address: number[];
	type: "DESCENDANT_INJECTION";
	index: number;
}

type BuilderInjection = AttributeMapInjection | DescendantInjection;

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
	}
}

function createStack(): Stacks {
	return {
		slotFound: false,
		slotName: undefined,
		attributeStep: undefined,
		address: [],
	}
}

function attributeSlot(data: BuilderDataInterface, step: BuildStep) {
	// is it a ref *name
	// -> get ref name
	// -> add address to stack
}

function attributeLogic(data: BuilderDataInterface, step: BuildStep) {
	// is it a ref *name
	// -> get ref name
	// -> add address to stack
}

function buildLogic(data: BuilderDataInterface, step: BuildStep) {
	if (step.type !== "BUILD") return;
	
	// build stacks
	if (step.state === "INITIAL") {
		data.stack.address.push(-1);
	}
	
	if (step.state === "TAGNAME") {
		data.stack.address[data.stack.address.length - 1] += 1;
		data.stack.address.push(-1);
		// get text
		// create element
		// swap last element in queue
		// push undefined to queue
	}
	
	if (step.state === "TEXT") {
		data.stack.address[data.stack.address.length - 1] += 1;	
		// get text
		// create text element
	}
	
	if (step.state === "CLOSE_TAGNAME") {
		data.stack.address.pop();
		// pop element queue
	}
	
	if (step.state === "INDEPENDENT_NODE_CLOSED") {
		data.stack.address.pop();
	}
	
	// references involve a property name
	if (step.state === "ATTRIBUTE") {		
		// if attribute !== undefined
		// 	set attribute with undefined
		
		// set attribute name
		data.stack.attributeStep = step;
	}
	
	if (step.state === "ATTRIBUTE_VALUE" && data.stack.attributeStep !== undefined) {
		data.stack.attributeStep = undefined;
		// const value = getText(data.template, step.vector);
		// if (value !== undefined) {
				// set attribute
		// }
	}
	
	// steps that could 
	if (step.state === "NODE_SPACE") {
		// if attribute
	}
	// slot involves element and property name
}

function injectLogic(data: BuilderDataInterface, step: BuildStep) {
	if (step.type !== "INJECT") return;
	const {index, state} = step;
	
	/*
	if (state === "ATTRIBUTE_INJECTION" && data.stack.attribute !== undefined) {
		data.render.injections.set(index, {
			address: data.stack.address.slice(),
			type: state,
			index,
			name: data.stack.attribute,
		});
	}
	*/
	
	if (state === "ATTRIBUTE_MAP_INJECTION") {
		data.render.injections.set(index, {
			address: data.stack.address.slice(),
			type: state,
			index,
		});
	}
	
	if (state === "DESCENDANT_INJECTION") {
		data.render.injections.set(index, {
			address: data.stack.address.slice(),
			index,
			type: state,
		});
	}
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
		}

		if (step.type === "BUILD") {
			buildLogic(this, step);
		}

		if (step.type === "INJECT") {
			injectLogic(this, step);
		}
	}
}

export { DOMBuilder }

export type { BuilderInjection }

