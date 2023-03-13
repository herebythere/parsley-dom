import type { BuilderDataInterface, BuilderInjection } from "../type_flyweight/dom_builder.ts";

// fragment get children to start the address crawl

interface RenderInjection {
	node: Node;
	index: number;
	type: string;
}

function getNodeByAddress(
  fragment: DocumentFragment,
  address: number[],
): Element | undefined {
  let node;
  for (const index of address) {
    node = node.childNodes[index];
    if (node === undefined) return;
  }

  return node;
}

function getReferenceElements(
  fragment: DocumentFragment,
  addresses: Map<string, number[]>,
) {
  const references = new Map<string, Node>();
  for (const [index, address] of addresses) {
    const node = getNodeByAddress(fragment, address);
    if (node !== undefined) {
      references.set(index, node);
    }
  }

  return references;
}

function getInjections(fragment: DocumentFragment, addresses: Map<number, BuilderInjection>) {
  const injections = new Map<number, RenderInjection>();
  for (const [index, entry] of addresses) {
    const node = getNodeByAddress(fragment, entry.address);
    if (node === undefined) return;
    injections.set(index, { node, index, type: entry.type });
  }

  return injections;
}

function createRender(builder: BuilderDataInterface) {
  const fragment = builder.fragment.cloneNode(true);
  if (fragment === undefined) return;
  
  const references = getReferenceElements(fragment, builder.references);
  const injections = getInjections(fragment, builder.injections);

  // pop nodes onto array? for future add / remove
  // make array
  // push every child node

  // then remove every childnode
  return {
    fragment,
    references,
    injections,
  };
}

export { createRender }
