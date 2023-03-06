interface Utils<N> {
	createNode(tagname: string): N;
	createTextNode(text: string): N;
}

export type { Utils }
