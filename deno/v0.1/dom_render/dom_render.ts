type RendererFunction<S> = (state: S) => Draw;

class WebComponentController<S> {
	templates: Map<Readonly<string[]>>, BuilderInterface> = new Map();
	prevArguments: unknown[] = [];
	renderers!: RenderFunction<S>[];
	
	setup(renderers: RendererFunction<S>[]) {
		
	}
	
	render(state: S) {
		
	}
}

export { RendererFunction, WebComponentController }
