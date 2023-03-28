import type { BuilderInterface, BuildStep } from "../deps.ts";
import type {
  BuilderDataInterface,
  BuilderInjection,
  BuilderStack,
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
}

function stackLogic<N>(
  utils: Utils<N>,
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
    stack.nodes.push(undefined);
  }

  if (step.state === "CLOSE_NODE_CLOSED") {
    stack.address.pop();
    stack.nodes.pop();
  }
}

function injectLogic<N>(stack: BuilderStack<N>, step: BuildStep, data: BuilderDataInterface<N>) {
  if (step.type !== "INJECT") return;
  const { index, state: type } = step;
  const injection = {
    address: stack.address.slice(),
    index,
    type,
  };

  if (type === "DESCENDANT_INJECTION") {
    data.descendants.push(injection);
    return;
  }

  data.injections.push(injection);
}

class Builder implements BuilderInterface {
	steps: BuildStep[] = [];

  push(step: BuildStep) {
  	this.steps.push(step);
  }
  
  // build, gather steps, then build steps
  build<N>(utils: Utils<N>, template: Readonly<string[]>): BuilderDataInterface<N> | undefined {
  	const error = this.steps[this.steps.length - 1];
  	if (error?.state === "ERROR") {
  		return;
  	};
  	
  	const stack: BuilderStack<N> = {
			nodes: [undefined],
			address: [-1],
			attribute: undefined,
		};
		
		const data: BuilderDataInterface<N> = {
			nodes: [],
			injections: [],
			descendants: [],
			references: new Map<string, number[]>(),
		}

  	for (const step of this.steps) {
      if (step.state === "ERROR") {
				// do something
		  }

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
}

export { Builder };
