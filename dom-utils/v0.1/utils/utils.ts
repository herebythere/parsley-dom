import type { BuilderDataInterface, UtilsInterface } from "../deps.ts";

// import { Builder } from "../builder/builder.ts";
import { Builder, parse } from "../deps.ts";

const builderDataCache = new WeakMap<
  Readonly<string[]>,
  BuilderDataInterface<Node>
>();

function getBuilder(
  utils: UtilsInterface<Node>,
  template: Readonly<string[]>,
) {
  let builderData = builderDataCache.get(template);
  if (builderData === undefined) {
    const builder = new Builder();
    parse(template, builder);
    builderData = builder.build(utils, template);
  }

  if (builderData !== undefined) {
    builderDataCache.set(template, builderData);
  }

  return builderData;
}

class DOMUtils implements UtilsInterface<Node> {
  createNode(tagname: string) {
    return document.createElement(tagname);
  }
  createTextNode(text: string) {
    return document.createTextNode(text);
  }
  insertNode(node: Node, parentNode?: Node, leftNode?: Node) {
    if (parentNode === undefined) return;
    if (leftNode?.nextSibling === undefined) {
      parentNode.appendChild(node);
      return;
    }
    parentNode.insertBefore(node, leftNode.nextSibling);
  }
  removeNode(node: Node, parentNode?: Node, leftNode?: Node) {
    if (parentNode !== undefined) {
      parentNode.removeChild(node);
      return;
    }
    if (node.parentNode !== null) {
      node.parentNode.removeChild(node);
    }
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
  getBuilderData(
    template: Readonly<string[]>,
  ): BuilderDataInterface<Node> | undefined {
    return getBuilder(this, template);
  }
}

export { DOMUtils };
