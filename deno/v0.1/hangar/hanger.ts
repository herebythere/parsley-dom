import type { DrawFunc } form "../type_flyweight/hangar.ts";

import { recursiveCheck } from "../dom_diff.ts";



/*
	hangar
	
	controls render and flow
	max node count?
	
	prevDraw -> what is returned from () => draw``;
	
	a draw can be a linear jaunt?
	
	
	yes? it's just a stack
	
	const elements = [root, child1, child1A, child1B, child1C];
	const draws = [rootDraw, childDraw];
	const renders = [rootRender, childRender];
	
	iterate across new renders to find discrepancies
	
	
	initial goal
	remove prev render entirely
	create entire new render
	add new render to root
	
	secondary goal
	iterate through array and find changes
	
	
	available structures, previously rendered? before garbage collection?
	-> template?
	-> 
	
	
	options
*/


class DOMHangar<N, S> {
	drawFuncs!: DrawFunc<S>[];
	prevDraw: Draw[];
	prevRender: unknown[];
	
	state!: S;
	
	queuedForUpdate: boolean = false;
	
	setup(renderers: RendererFunction<S>[], parentNode?: N, leftNode:? N) {
		// remove all children
		this.parentNode = parentNode;
		this.leftNode = leftNode;
	}
	
	update(state: S) {
		this.state = state;
		if (!this.queuedForUpdate) {
			queueMicrotask(this.render);
			this.queuedForUpdate = true;
		}
	}
	
	render = () => {
		this.queuedForUpdate = false;
		
		// get new template strings and args
		const build = [];
		for (const drawFunc of this.drawFuncs) {
			build.push(drawFunc(this.state));
		}
		
		let addresses = []
		recursiveCheck(addresses, this.prevBuild, build);
		if (addresses.length !== 0) {
			this.addresses = addresses;
			// enqueue build render with addresses
			// build a new render map
		}
	}
}

export { RendererFunction, DOMHangar }

