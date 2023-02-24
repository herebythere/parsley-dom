/*
	Iterate the builder steps?
	
	What if builder took the parsed steps
	find addresses
	saved parsed steps
	-> create node
	-> 
	
	render takes steps
	creates nodes
	sets properties
	finds nodes by address


	what if this is an interface to building a fragment
	
	addElement(buildStep)
	getElementByAddress([1, 1, 0])	
*/



// this needs to be coupled with utility methods
// 

function createReferences(): BuilderRender {
  return {
    slots: new Map<string, number[]>(),
    references: new Map<string, number[]>(),
    injections: new Map<number, BuilderInjection>(),
  };
}

function createStack<N>(): Stacks<N> {
  return {
    attribute: undefined,
    address: [],
  };
}


class DOMRender {
	build(template: Readonly<string[]>, builderRender: BuilderRender) {
		
	}
}
