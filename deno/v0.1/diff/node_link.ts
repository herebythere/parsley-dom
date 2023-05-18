import type { SourceLinkInterface } from "../type_flyweight/render.ts";

class SourceLink implements SourceLinkInterface {
	drawIndex: number;
	nodeIndex: number;
	parentIndex: number = 0;
	
	constructor(drawIndex: number, nodeIndex: number) {
		this.drawIndex = drawIndex;
		this.nodeIndex = nodeIndex;
	}
}

export { SourceLink }

