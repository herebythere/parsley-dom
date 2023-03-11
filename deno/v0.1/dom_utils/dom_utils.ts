import type { Utils } from "../type_flyweight/utils.ts";

// this class encapsulates all dom specific methods from
// the general implementation of Hanger Draw DomBuilder and DomReder
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
	cloneNode(node: Node) {
		if (!(node instanceof Element)) return;
		return node.cloneNode(true);
	}
	getChildNodes(node: Node) {
		if (!(node instanceof Element)) return;
		return node.childNodes as unknown as Node[];
	}
}

export { DOMUtils }

