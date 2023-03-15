import type { Utils } from "../type_flyweight/utils.ts";

// this class encapsulates all dom specific methods from
// the general implementation of Hanger Draw DomBuilder and DomReder

// this could be entirely implemented in the "environment" of the usage context
// this could exist at the "docs level" or as a separate module

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
  getDescendant(baseTier: Node[], address: number[], depth: number = address.length) {
  	if (address.length === 0) return;
  	
    let currNode = baseTier[address[0]];
    if (currNode === undefined) return;
    
    let index = 1;
    while (index < depth) {
      currNode = currNode.childNodes[index];
      if (currNode === undefined) return;
    	index += 1;
    }

    return currNode;
  }
}

export { DOMUtils };
