import type { HangarInterface } from "./deps.ts";
import { DOMUtils, draw, Hangar } from "./deps.ts";

const domutils = new DOMUtils();

// define minimal interface to interact with object
interface State {
  getAttribute: Element["getAttribute"];
}

let nodeSwitch = 0;

const textNode = document.createTextNode("UwU!");

const testArray = ["world", ["what's", "really"], "good"];

const testNodeFunc = () => {
	nodeSwitch += 1;
	nodeSwitch %= 2;
	console.log("nodeSwitch", nodeSwitch);
	const node = nodeSwitch ? textNode : testArray;
	
  return draw`
  	<p>horray! ${node}</p>
	`;
};

const testNodeNested = () => {
  return [
    "whatup",
    draw`
  	<p>howdy!</p>
		<p>hello ${testNodeFunc()}!</p>
	`,
  ];
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

    const shadowRoot = this.attachShadow({ mode: "closed" });
    if (shadowRoot) {
      this.hangar = new Hangar<Node, State>(
        testNodeNested,
        shadowRoot,
      );

      this.hangar.update(domutils, this);
    }
  }

  attributeChangedCallback() {
    this.hangar.update(domutils, this);
  }

  update() {
    this.hangar.update(domutils, this);
  }
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
