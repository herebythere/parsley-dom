type RendererFunction<S> = (state: S) => Draw;

const renderMap = new WeakMap<Readonly<string[]>, DOMBuilder>()

class DOMHanger<N, S> {
	queuedForUpdate: boolean;
	
	templates: Map<Readonly<string[]>>, BuilderInterface> = new Map();
	prevArguments: unknown[] = [];
	renderers!: RenderFunction<S>[];
	
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
	
	render(state: S) {
		// for each renderer
		// update the children
		//
		
		this.queuedForUpdate = false;
	}
}

export { RendererFunction, WebComponentController }

