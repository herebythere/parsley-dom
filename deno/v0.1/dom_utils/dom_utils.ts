import type { Utils } from "../type_flyweight/utils.ts";

// this class encapsulates all dom specific methods from
// the general implementation of Hanger Draw DomBuilder and DomReder

// should render cache be set here?
const builderCache = new WeakMap();

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
  insertNode(node: Node, parentNode?: Node, leftNode?: Node) {
    if (parentNode === undefined) return;

    if (leftNode?.nextSibling) {
      node.insertBefore(node, leftNode.nextSibling);
      return;
    }

    parentNode.appendChild(node);
  }
  removeNode(node: Node, parentNode: Node) {
    parentNode.removeChild(node);
  }
  cloneTree(node: Node) {
    return node.cloneNode(true);
  }
  getDescendent(node: Node, address: number[]) {
    let currNode = node;
    for (const index of address) {
      currNode = node.childNodes[index];
      if (currNode !== undefined) return;
    }

    return currNode;
  }
}

export { DOMUtils };
