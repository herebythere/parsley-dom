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

interface ParsleyNode {
	nodeName: string;
	parentNode: ParsleyNode | null;
	prevSibling: ParsleyNode | null;
	nextSibling: ParsleyNode | null;
	childNodes: ParsleyNode[];
	setAttribute(name: string, value: string): void;
}

interface ParsleyMethods<N extends ParsleyNode> {
	createFragment(): N;
	createNode(tag: string): N;
	createTextNode(): N;
	insertSiblings(node: N, index: number, parentNode?: N): void;
	removeAttribute(name: string): void;
	setAttribute(node: N, name: string, value: string): void;
}

interface Stacks {
	slotFound: boolean;
	attribute?: string;
	address: number[];
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
	}
}

function createStack(): Stacks {
	return {
		attribute: undefined,
		slotFound: false,
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
		const tagname = getText(data.template, step.vector);
		data.stack.slotFound = tagname === "slot";
		console.log("slot found!", data.stack.slotFound);
		data.stack.address[data.stack.address.length - 1] += 1;
	}
	
	if (step.state === "NODE_CLOSED") {
		data.stack.address.push(-1);
	}
	
	if (step.state === "TEXT") {
		data.stack.address[data.stack.address.length - 1] += 1;	
	}
	
	if (step.state === "CLOSE_TAGNAME") {
		data.stack.address.pop();
	}
	
	if (step.state === "INDEPENDENT_NODE_CLOSED") {
		// data.stack.address.pop();
	}
	
	// attributes
	if (step.state === "ATTRIBUTE") {		
		const attribute = getText(data.template, step.vector);
		// if reference
		if (attribute !== undefined && attribute.startsWith("*")) {
			const name = attribute.slice(1);
			data.render.references.set(name, data.stack.address.slice());
			return;
		}
		
		// unset attribute
		data.stack.attribute = attribute; 
	}
	
	if (step.state === "ATTRIBUTE_VALUE" && data.stack.attribute !== undefined) {
		const value = getText(data.template, step.vector);
		console.log("attr value:", value);
		if (value !== undefined && data.stack.slotFound && data.stack.attribute === "name") {
			data.render.slots.set(value, data.stack.address.slice());
		}
		
		// if slot and attribute === "name"
		// if attribute starts with *ref
		// if (value !== undefined) {
				// set attribute
		// }
		data.stack.attribute = undefined;
	}
}

function injectLogic(data: BuilderDataInterface, step: BuildStep) {
	if (step.type !== "INJECT") return;
	const { state, index } = step;

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

