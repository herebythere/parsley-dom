import type {
  BuilderDataInterface,
  BuilderInjection,
} from "../type_flyweight/builder.ts";
import type {
  BuildInjection,
  BuildInterface,
} from "../type_flyweight/build.ts";
import type { Utils } from "../type_flyweight/utils.ts";

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
    const { address } = entry;
    const node = utils.getDescendant(nodeTier, address);
    const parentNode = utils.getDescendant(
      nodeTier,
      address,
      address.length - 1,
    );

    const { index, type } = entry;
    injections.push({
      index,
      node,
      parentNode,
      type,
    });
  }

  return injections;
}

class Build<N> implements BuildInterface<N> {
  nodes: N[];
  descendants: BuildInjection<N>[];
  injections: BuildInjection<N>[];
  references: Map<string, N>;

  constructor(
    utils: Utils<N>,
    data: BuilderDataInterface<N>,
  ) {
    this.nodes = cloneNodeTier(utils, data.nodes);
    this.injections = createInjections(utils, this.nodes, data.injections);
    this.descendants = createInjections(utils, this.nodes, data.descendants);

    this.references = new Map<string, N>();
  }
}

export { Build };
