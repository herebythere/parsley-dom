import type {
  BuilderDataInterface,
  BuilderInjection,
} from "../type_flyweight/dom_builder.ts";

// fragment get children to start the address crawl

interface RenderInjection<N> {
  node: N;
  index: number;
  type: string;
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

function getInjections(
  fragment: DocumentFragment,
  addresses: Map<number, BuilderInjection>,
) {
  const injections = new Map<number, RenderInjection>();
  for (const [index, entry] of addresses) {
    const node = getNodeByAddress(fragment, entry.address);
    if (node === undefined) return;
    injections.set(index, { node, index, type: entry.type });
  }

  return injections;
}

function createRender<N>(builder: BuilderDataInterface<N>) {
	// copy of base tier not fragment
	
  const baseTier = builder.fragment.cloneNode(true);
  if (fragment === undefined) return;

  const references = new Map<string, N>();
  const injections = getInjections(fragment, builder.injections);

  return {
    baseTier,
    references,
    injections,
  };
}

export { createRender };
