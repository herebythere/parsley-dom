import type {
  BuilderDataInterface,
  BuilderInjection,
} from "../type_flyweight/builder.ts";
import type {
  BuildInjection,
  BuildInterface,
} from "../type_flyweight/build.ts";
import type { Utils } from "../type_flyweight/utils.ts";

function cloneNodes<N>(utils: Utils<N>, nodes: N[]) {
  let clonedNodes = [];
  for (const node of nodes) {
    clonedNodes.push(utils.cloneTree(node));
  }
  return clonedNodes;
}

function createInjections<N>(
  utils: Utils<N>,
  nodes: N[],
  builderInjections: BuilderInjection[],
) {
  const injections = [];
  for (const entry of builderInjections) {
    const { address } = entry;
    const node = utils.getDescendant(nodes, address);
    const parentNode = utils.getDescendant(
      nodes,
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
    this.nodes = cloneNodes(utils, data.nodes);
    this.injections = createInjections(utils, this.nodes, data.injections);
    this.descendants = createInjections(utils, this.nodes, data.descendants);

    this.references = new Map<string, N>();
  }
}

export { Build };
