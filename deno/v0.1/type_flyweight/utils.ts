interface Utils<N> {
	createNode(tagname: string): N;
	createTextNode(text: string): N;
	getAttribute(node: N, attribute: string): string | undefined;
	setAttribute(node: N, attribute: string, value: unknown): void;
	removeAttribute(node: N, attribute: string, value: unknown): void;
}

export type { Utils }
