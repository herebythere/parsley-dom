import type { Utils } from "../type_flyweight/utils.ts";

// this class encapsulates all dom specific methods from
// the general implementation of Hanger Draw DomBuilder and DomReder
class DOMUtils implements Utils<Node> {
	createNode(tagname: string) {
		return document.createElement(tagname);
	}
	createTextNode(text: string) {
		return document.createTextNode(text);
	}
	insertNode(node: Node, parentNode?: Node, leftNode?: Node) {
		if (parentNode === undefined) return;
		
		if (leftNode) {
			node.insertBefore(node, leftNode);
			return;
		}
		
		parentNode.appendChild(node);
	}
}

export { DOMUtils }

