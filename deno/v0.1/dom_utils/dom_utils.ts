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
	getAttribute(node: Node, attribute: string) {
		if (node instanceof HTMLElement) {
			const value = node.getAttribute(attribute);
			if (value) return value;
		}
	}
	setAttribute(node: Node, attribute: string, value: unknown) {
	
	}
	removeAttribute(node: Node, attribute: string, value: unknown) {
	
	}
}

export { DOMUtils }
