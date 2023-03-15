import type {
  BuilderDataInterface,
  BuilderInjection,
} from "../type_flyweight/builder.ts";
import type {
  RenderInjection,
  RenderInterface,
} from "../type_flyweight/render.ts";
import type { Utils } from "../type_flyweight/utils.ts";
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

function cloneNodeTier<N>(utils: Utils<N>, nodeTier: N[]) {
  let nodes = [];
  for (const node of nodeTier) {
    nodes.push(utils.cloneTree(node));
  }
  return nodes;
}

function createInjections<N>(
  utils: Utils<N>,
  nodeTier: N[],
  builderInjections: BuilderInjection[],
) {
  const injections = [];
  for (const entry of builderInjections) {
    const node = utils.getDescendant(nodeTier, entry.address);
    const parentNode = utils.getDescendant(
      nodeTier,
      entry.address,
      entry.address.length - 1,
    );
    if (node !== undefined) {
      injections.push({
        index: entry.index,
        type: entry.type,
        node,
        parentNode,
      });
    }
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
    this.nodeTier = cloneNodeTier(utils, data.nodeTier);
    this.injections = createInjections(utils, this.nodeTier, data.injections);
    this.descendants = createInjections(utils, this.nodeTier, data.descendants);

    this.references = new Map<string, N>();
  }
}

export { Render };
