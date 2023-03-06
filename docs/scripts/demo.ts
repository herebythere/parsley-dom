import { draw, Hangar } from "./deps.ts";

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
    super();

    this.attachShadow({ mode: "open" });
    if (this.shadowRoot) {
      // this.hangar = new Hangar(
      this.hangar = new HangarAsync(
        [testComponent],
        this.shadowRoot,
      );
    }
    
    this.hanger.update(this);
  }

  attributeChangedCallback() {
  	// this is where microtask should be called
    this.hangar.update(this);
    // this.hangar.updateAsync(this);
  }

  update() {
    this.hangar.update(this);
    // this.hangar.updateAsync(this);
  }
}

