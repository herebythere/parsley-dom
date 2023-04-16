import type { Utils } from "../type_flyweight/utils.ts";
import type { BuilderDataInterface } from "../type_flyweight/builder.ts";
import type { DrawFunc, Draws } from "../type_flyweight/hangar.ts";

const builderCache = new Map<Readonly<string[]>, BuilderDataInterface<Node>>();

class DOMUtils implements Utils<Node> {
  createNode(tagname: string) {
    if (tagname === ":fragment") {
      return document.createDocumentFragment();
    }
    return document.createElement(tagname);
  }
  createTextNode(text: string) {
    return document.createTextNode(text);
  }
  // update for node[], node, string
  insertNode(node: Node, parentNode?: Node, leftNode?: Node) {
    if (parentNode === undefined) return;
    if (leftNode?.nextSibling === undefined) {
      parentNode.appendChild(node);
      return;
    }

    node.insertBefore(node, leftNode.nextSibling);
  }
  getIfNode(node: Draws<Node>): Node | undefined {
    if (node instanceof Node) {
      return node;
    }
  }
  removeNode(node: Node, parentNode: Node) {
    parentNode.removeChild(node);
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

		for (const index = 1; index < depth; index++) {
		  currNode = currNode.childNodes[index];
      if (currNode === undefined) return;
		}

    return currNode;
  }
  setBuilder(
    template: Readonly<string[]>,
    builder: BuilderDataInterface<Node>,
  ) {
    builderCache.set(template, builder);
  }
  getBuilder(template: Readonly<string[]>) {
    return builderCache.get(template);
  }
}

export { DOMUtils };
