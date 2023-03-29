import type { HangarInterface } from "./deps.ts";
import { draw, Hangar } from "./deps.ts";

// define minimal interface to interact with object
interface State {
  getAttribute: Element["getAttribute"];
}

// reusable functions
function messageComponent<S extends State>(state: S) {
  const message = state.getAttribute("message");

  return draw`<p>${message}</p>`;
}

// actual elements
class TestComponent extends HTMLElement {
  hangar?: Hangar<Node, State>;

  // observedAttributes
  static get observedAttributes() {
    return ["message"];
  }

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    if (this.shadowRoot) {
      this.hangar = new Hangar(
        [messageComponent],
        this,
        this.shadowRoot,
      );
      
      this.hangar.update(this);
    }
  }

  attributeChangedCallback() {
    // this is where microtask should be called
    this.hangar?.update(this);
    // this.hangar.updateAsync(this);
  }

  update() {
    this.hangar?.update(this);
  }
}

customElements.define("test-component", TestComponent);

const testComponent = document.querySelector("test-component");

