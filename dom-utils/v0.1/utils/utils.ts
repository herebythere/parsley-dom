import type { BuilderDataInterface, UtilsInterface } from "../deps.ts";

const builderCache = new Map<Readonly<string[]>, BuilderDataInterface<Node>>();

function getBuilderData<N>(
  template: Readonly<string[]>,
) {
  let builderData = utils.getBuilder(template);
  if (builderData === undefined) {
    const builder = new Builder();
    parse(template, builder);
    builderData = builder.build(utils, template);
  }

  if (builderData !== undefined) {
    utils.setBuilder(template, builderData);
  }

  return builderData;
}

function getBuild<N>(
  utils: UtilsInterface<N>,
  draw: DrawInterface,
): BuildInterface<N> | undefined {
  const builderData = getBuilderData(
    utils,
    draw.templateStrings,
  );

  if (builderData !== undefined) {
    return new Build(utils, builderData);
  }
}

class DOMUtils implements UtilsInterface<Node> {
  createNode(tagname: string) {
    return document.createElement(tagname);
  }
  createTextNode(text: unknown) {
    return document.createTextNode(text);
  }
  insertNode(node: Node, parentNode: Node, leftNode?: Node) {
    if (parentNode === undefined) return;
    if (leftNode?.nextSibling === undefined) {
      parentNode.appendChild(node);
      return;
    }
    parentNode.insertBefore(node, leftNode.nextSibling);
  }
  removeNode(node: Node, parentNode: Node, leftNode?: Node) {
    parentNode.removeChild(node);
  }
  getIfNode(node: unknown): Node | undefined {
    if (node instanceof Node) {
      return node;
    }
  }
  cloneTree(node: Node) {
    return node.cloneNode(true);
  }
  getDescendant(
    baseTier: Node[],
    address: number[],
    depth: number = address.length,
  ) {
    if (address.length === 0) return;

    let currNode = baseTier[address[0]];
    if (currNode === undefined) return;

    for (let index = 1; index < depth; index++) {
      const addressIndex = address[index];
      currNode = currNode.childNodes[addressIndex];
    }

    return currNode;
  }
  getBuilder(template: Readonly<string[]>) {
    const builder = builderCache.get(template);
    if (builder !== undefined) {
      return builder;
    }
  }
}

export { DOMUtils };
