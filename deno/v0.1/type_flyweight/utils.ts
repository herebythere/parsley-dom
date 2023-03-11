interface Utils<N> {
	createNode(tagname: string): N;
	createTextNode(text: string): N;
	insertNode(node: N, parentNode?: N, leftNode?: N): void;
	cloneNode(node: N): N | undefined;
	getChildNodes(node: N): N[] | undefined;
}

export type { Utils }
