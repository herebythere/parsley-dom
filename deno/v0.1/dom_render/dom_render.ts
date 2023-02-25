function getNodeByAddress(fragment: Element, address: number[]): Element | undefined {
	let node = fragment;
	for (const index of address) {
		node = node.childNodes[index];
		if (node === undefined) return;
	}
	
	return node;
}

function getReferenceElements<N>(fragment: Element, addresses: Map<N, number[]>) {
	const references = new Map<N, Element>();
	for (const [index, address] of map) {
		const node = getNodeByAddress(fragment, address);
		if (node !== undefined) {
			references.set(index, node);
		}
	}
	
	return references;
}

function getInjections(fragment: Element, addresses: Map<N, BuilderInjection>) {
	const injections = new Map<N, RenderInjection>();
	for (const [index, entry] of map) {
		const node = getNodeByAddress(fragment, entry.address);
		references.set(index, { node, index, type: entry.type });
	}
	
	return injections;
}

function createRender(builder: BuilderInterface) {
	const fragment = builder.fragment.cloneNode(true);
	const slots = getReferenceElements<number>(fragment, builder.slots);
	const references = getReferenceELements<string>(fragment, builder.references);
	const injections = getInjections(fragment, builder.injections);
	
	
	// pop nodes onto array? for future add / remove
	// make array
	// push every child node
	
	// then remove every childnode
	return {
		fragment,
		slots,
		references,
		injections,
	}
}

function updateRender(render: DOMRenderer, args: unknown[]) {
	// iterate through args
	
	// get injection step
	
	// if children
	// remove previous children
	// add updated children
}

