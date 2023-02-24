
class HTMLMethods implements ParsleyMethods {
	createFragment() {
		return document.createDocumentFragment();
	}
	
	createNode(tagname: string) {
		return document.createNode(tagname);
	}
	
	createTextNode() {
		return document.createTextNode();
	}
	
	insertDescendant(parentNode: ParsleyNode, node: ParsleyNode, index: number) {
		const sibling = parnetNode.childNodes[index]?.nextSibling;
		if (silbing) {
			sibling.insertBefore(node, sibling)
		}
	}
	
	setAttribute(node: ParsleyNode, name: string, value?: string) {
		return node.setAttribute(name, value ?? name);
	}
	
	removeAttribute(node: ParsleyNode, name: string) {
		return node.removeAttribute(name)
	}
}

