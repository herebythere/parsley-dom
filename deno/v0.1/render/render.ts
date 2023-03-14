import type {
  BuilderDataInterface,
  BuilderInjection,
} from "../type_flyweight/builder.ts";
import type {
  RenderInterface,
  RenderInjection,
} from "../type_flyweight/render.ts";
// fragment get children to start the address crawl

class Render<N> implements RenderInterface<N> {
	nodeTier: N[];
	descendants: RenderInjection<N>[];
	references: Map<string, N>;
	injections: RenderInjection<N>[];
	
	constructor(
		data: BuilderDataInterface<N>
  ) {
  	let nodeTier = [];
		for (const node of data.nodeTier) {
			nodeTier.push(data.utils.cloneTree(node));
		}
		
		this.nodeTier = nodeTier;
		this.descendants = [];
		this.references = new Map<string, N>();
		this.injections = getInjections(data, this.nodeTier);
	}
}

/*
function getReferenceElements<N>(
	data: BuilderDataInterface<N>,
) {
  const references = new Map<string, Node>();
  for (const [index, address] of data.addresses) {
    const node = data(fragment, address);
    if (node !== undefined) {
      references.set(index, node);
    }
  }

  return references;
}
*/

function getInjections<N>(
  data: BuilderDataInterface<N>,
  descendants: N[],
) {
  const injections = [];
  for (const entry of data.injections) {
    const node = data.utils.getDescendant(descendants, entry.address);
    if (node !== undefined) {
      injections.push({ node, index: entry.index, type: entry.type });
    };
  }

  return injections;
}


export { Render };
