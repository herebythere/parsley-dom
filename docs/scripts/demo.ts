import { draw } from "./deps.ts";

// define minimal interface to interact with object
interface State {
	getAttribute: Element["getAttribute"];
}

// reusable functions
function testComponent<S extends State>(state: S) {
	const message = state.getAttribute("message");
	
	return draw`<p>${message}</p>`;
}


// actual elements
class TestComponent extends HTMLElement {
	hanager: HangerInterface;
	
	// observedAttributes
	static get observedAttributes() {
		return ["message"];
	}
	
	constructor() {
		this.attachShadow({ mode: "open" });
		if (this.shadowRoot) {
			this.hangar = new Hangar(
				[testComponent],
				this.shadowRoot,
			);
		}
	}
	
	attributeChangedCallback() {
		this.hangar.update(this);
	}
	
	update() {
		this.hangar.update(this);
	}
}

