interface Utils<N> {
	createNode(tagname: string): N;
	createTextNode(text: string): N;
	insertNode(node: N, parentNode?: N, leftNode?: N): void;
}

export type { Utils }
