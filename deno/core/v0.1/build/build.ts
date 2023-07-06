import type {
  BuilderDataInterface,
  BuilderInjection,
} from "../type_flyweight/builder.ts";
import type {
  BuildInjection,
  BuildInterface,
} from "../type_flyweight/build.ts";
import type { UtilsInterface } from "../type_flyweight/utils.ts";

function cloneNodes<N>(utils: UtilsInterface<N>, sourceNodes: N[]) {
  let nodes = [];
  for (const node of sourceNodes) {
    nodes.push(utils.cloneTree(node));
  }
  return nodes;
}

function createInjections<N>(
  utils: UtilsInterface<N>,
  nodes: N[],
  builderInjections: BuilderInjection[],
) {
  const injections = [];
  for (const entry of builderInjections) {
    const { address, parentAddress } = entry;
    const node = utils.getDescendant(nodes, address);
    const parentNode = utils.getDescendant(
      nodes,
      parentAddress,
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

  constructor(
    utils: UtilsInterface<N>,
    data: BuilderDataInterface<N>,
  ) {
    this.nodes = cloneNodes(utils, data.nodes);
    this.injections = createInjections(utils, this.nodes, data.injections);
    this.descendants = createInjections(utils, this.nodes, data.descendants);
  }
}

export { Build };
