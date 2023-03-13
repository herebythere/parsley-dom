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
	descendants: N[];
	references: Map<string, N>;
	injections: Map<number, RenderInjection<N>>;
	
	constructor(
		data: BuilderDataInterface<N>
  ) {
  	let descendants = [];
		for (const node of data.baseTier) {
			descendants.push(data.utils.cloneTree(node));
		}
		
		this.descendants = descendants;
		this.references = new Map<string, N>();
		this.injections = getInjections(data, descendants);
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
  const injections = new Map<number, RenderInjection<N>>();
  for (const [index, entry] of data.injections) {
    const node = data.utils.getDescendant(descendants, entry.address);
    if (node !== undefined) {
      injections.set(index, { node, index, type: entry.type });
    };
  }

  return injections;
}


export { Render };
