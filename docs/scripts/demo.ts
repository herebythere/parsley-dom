import type { HangarInterface } from "./deps.ts";
import { DOMUtils, draw, Hangar } from "./deps.ts";

const domutils = new DOMUtils();

// define minimal interface to interact with object
interface State {
  getAttribute: Element["getAttribute"];
}

// reusable functions
function messageComponent<S extends State>(state: S) {
  const message = state.getAttribute("message");

  return draw`<p>hello!</p>`;
}

const textNode = document.createTextNode("hello!");

const textNodeComponent = () => textNode;

const testNode = () => {
  return draw`
		<div>
			<p>hello world!</p>
		</div>
	`;
};

// actual elements
class TestComponent extends HTMLElement {
  hangar!: Hangar<Node, State>;

  // observedAttributes
  static get observedAttributes() {
    return ["message"];
  }

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    if (this.shadowRoot) {
      this.hangar = new Hangar<Node, State>(
        testNode,
        this.shadowRoot,
      );

      this.hangar.update(domutils, this);
    }
  }

  attributeChangedCallback() {
    // this is where microtask should be called
    this.hangar.update(domutils, this);
    // this.hangar.updateAsync(this);
  }

  update() {
    this.hangar.update(domutils, this);
  }

  updateAsync() {
    queueMicrotask(this.microTaskSentinel);
  }

  microTaskSentinel = () => {
    this.hangar.update(domutils, this);
  };
}

customElements.define("test-component", TestComponent);

const testComponent = document.querySelector("test-component");

function onButtonClick() {
  if (testComponent instanceof TestComponent) {
    testComponent.update();
  }
}
const button = document.querySelector("button");
button?.addEventListener("click", onButtonClick);
