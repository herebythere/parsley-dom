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

const largetTestArray: Node[] = [];
for (let index = 0; index < 2000; index++) {
  const p = document.createElement("p");
  p.appendChild(document.createTextNode("UwU"));
  largetTestArray.push(p);
}

const testDraw = draw`<p>horray!</p>`;

const testNodeFunc = () => {
  nodeSwitch += 1;
  nodeSwitch %= 2;

  return nodeSwitch ? testDraw : largetTestArray;
};

const testNodeNested = () => {
  return [
    "whatup",
    draw`
			<div>
				${testNodeFunc()}
			</div>
			<style>
				this shouldn't fly at all
      <style>
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
    queueMicrotask(this.updateAsync);
  }

  updateAsync = () => {
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
