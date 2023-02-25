import { recursiveCheck } from "../dom_diff.ts";

type RendererFunction<S> = (state: S) => Draw;

const renderMap = new WeakMap<Readonly<string[]>, DOMBuilder>();




class DOMHanger<N, S> {
	templates: Map<Readonly<string[]>>, BuilderInterface> = new Map();
	renderers!: RenderFunction<S>[];
	prevBuild: unknown[];
	prevRender: unknown[];
	
	queuedForUpdate: boolean;
	
	setup(renderers: RendererFunction<S>[], parentNode?: N, leftNode:? N) {
		// remove all children
		this.parentNode = parentNode;
		this.leftNode = leftNode;
	}
	
	update(state: S) {
		this.state = state;
		if (!queuedForUpdate) {
			queueMicrotask(this.render);
			this.queuedForUpdate = true;
		}
	}
	
	render = () => {
		this.queuedForUpdate = false;
		
		// get new template strings and args
		const build = [];
		for (const renderer of this.renderers) {
			build.push(renderer(this.state));
		}
		
		// we need the top most nodes that have
		
		let addresses = []
		recursiveCheck(addresses, this.prevBuild, build);
		if (addresses.length !== 0) {
			this.addresses = addresses;
			
		}
		// 
		
		//	compare string templates
		// 		recursive call
		//		if string templates are different
		//			remove old tree
		
		
		//	iterate tree for arguments
		//		if args are different than previous render
		//			update remove argument on render tree
		
		// set arguments
	}
}

export { RendererFunction, WebComponentController }

