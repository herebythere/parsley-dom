import type { NodeLinkInterface } from "../type_flyweight/render.ts";

class NodeLink implements NodeLinkInterface {
	drawIndex: number;
	nodeIndex: number;
	
	constructor(drawIndex: number, nodeIndex: number) {
		this.drawIndex = drawIndex;
		this.nodeIndex = nodeIndex;
	}
}

export { NodeLink }

