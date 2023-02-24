import { draw } from "./deps.ts";



function testComponent() {
	return draw`<p>${"hai!"}</p>`;
}

function testStyles() {
	return draw`<style>${"hai!"}</style>`;
}



// ideally the user can provide 
// -> a template
// -> a state object

// state could be an htmlelement itself
// it could be a store from service like redux

class TestComponent extends HTMLElement {
	hanager: HangerInterface;
	
	// observedAttributes
	static get observedAttributes() {
		return [];
	}
	
	constructor() {
		this.attachShadow({ mode: "open" });
		if (this.shadowRoot) {
			this.hangar = new Hangar(
				[testStyles, testComponent],
				this.shadowRoot,
			);
		}
	}
	
	attributeChangedCallback() {
		this.wc.update(this);
	}
	
	update() {
		this.wc.update(this);
	}
}

