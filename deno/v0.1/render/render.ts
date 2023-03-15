import type {
  BuilderDataInterface,
  BuilderInjection,
} from "../type_flyweight/builder.ts";
import type {
  RenderInterface,
  RenderInjection,
} from "../type_flyweight/render.ts";
import type {
  Utils
} from "../type_flyweight/utils.ts";
// fragment get children to start the address crawl


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

function cloneNodeTier<N>(utils: Utils<N>, data: BuilderDataInterface<N>) {
	let nodeTier = [];
	for (const node of data.nodeTier) {
		nodeTier.push(utils.cloneTree(node));
	}
	return nodeTier;
}

function getInjections<N>(
	utils: Utils<N>,
  data: BuilderDataInterface<N>,
  descendants: N[],
) {
  const injections = [];
  for (const entry of data.injections) {
    const node = utils.getDescendant(descendants, entry.address);
    if (node !== undefined) {
      injections.push({ index: entry.index, type: entry.type, node });
    };
  }

  return injections;
}

class Render<N> implements RenderInterface<N> {
	nodeTier: N[];
	descendants: RenderInjection<N>[];
	injections: RenderInjection<N>[];
	references: Map<string, N>;
	
	constructor(
		utils: Utils<N>,
		data: BuilderDataInterface<N>,
  ) {
		this.nodeTier = cloneNodeTier(utils, data);
		this.injections = getInjections(utils, data, this.nodeTier);
		
		this.descendants = [];
		this.references = new Map<string, N>();
	}
}


export { Render };
