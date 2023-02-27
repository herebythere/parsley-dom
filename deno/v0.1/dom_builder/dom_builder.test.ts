// import type { BuilderInjection } from "./dom_builder.ts";

import { parse } from "../deps.ts";
import { draw } from "../draw/draw.ts";
// import { DOMBuilder } from "./dom_builder.ts";

const title = "DOMBuilder";
const runTestsAsynchronously = true;

function autoFail() {
	return ["fail first"];
}
/*
function isNotEqual(
  mapA: Map<number, BuilderInjection>,
  mapB: Map<number, BuilderInjection>,
): boolean {
  if (mapA.size !== mapB.size) {
    return false;
  }

  for (const [index, entry] of mapA) {
    const mapEntry = mapB.get(index);
    if (mapEntry === undefined) return true;
    if (entry.type !== mapEntry.type) return true;
    if (entry.address.length !== mapEntry.address.length) return true;

    let arrIndex = 0;
    while (arrIndex < entry.address.length) {
      if (entry.address[arrIndex] !== mapEntry.address[arrIndex]) return true;
      arrIndex += 1;
    }
  }

  return false;
}

const testInjectionAddresses = () => {
  const assertions = [];

  const expectedResults = new Map<number, BuilderInjection>([]);

  const template = draw`<a ${"a"}><b>${"b"}</b>${"b_tail"}</a>`;
  const builder = new DOMBuilder();
  builder.setup(template.templateStrings);

  parse(template.templateStrings, builder);
  console.log(builder.render.injections);
  if (isNotEqual(expectedResults, builder.render.injections)) {
    assertions.push("map addresses do not match");
  }
  return assertions;
};

const testInjectionAddressesWithText = () => {
  const assertions = [];
  const expectedResults = new Map<number, BuilderInjection>([]);

  const template = draw`${"a_head"}
  	<a ${"a"}>
  		<b>  ${"b"} </b>
  		${"b_tail"}
  	</a>
${"a_tail"}`;

  const builder = new DOMBuilder();
  builder.setup(template.templateStrings);

  parse(template.templateStrings, builder);

  if (isNotEqual(expectedResults, builder.render.injections)) {
    assertions.push("map addresses do not match");
  }
  return assertions;
};

const testInjectionAddressesListWithText = () => {
  const assertions = ["fail"];

  const template = draw`
  	<a ${"a"}>
  		<b>  ${"b"}</b>
  		<c></c>
  		<d></d>
  	</a>
 `;

  const builder = new DOMBuilder();
  builder.setup(template.templateStrings);

  parse(template.templateStrings, builder);

  return assertions;
};

const testReferenceAddresses = () => {
  const assertions = [];
  const expectedResults = new Map<number, BuilderInjection>([]);

  const template = draw`<a *ref ></a>`;
  const builder = new DOMBuilder();
  builder.setup(template.templateStrings);

  parse(template.templateStrings, builder);
  console.log(builder.render);
  if (isNotEqual(expectedResults, builder.render.injections)) {
    assertions.push("map addresses do not match");
  }
  return assertions;
};

const testSlotAddresses = () => {
  const assertions = [];
  const expectedResults = new Map<number, BuilderInjection>([]);

  const template = draw`<slot name="boop"></slot><slot name="snoot"></slot>`;
  const builder = new DOMBuilder();
  builder.setup(template.templateStrings);

  parse(template.templateStrings, builder);
  console.log(builder.render);
  if (isNotEqual(expectedResults, builder.render.injections)) {
    assertions.push("map addresses do not match");
  }
  return assertions;
};
*/

const tests = [
	autoFail,
  /*
  testInjectionAddresses,
  testInjectionAddressesWithText,
  testReferenceAddresses,
  testSlotAddresses,
  */
];

const unitTestDOMBuilder = {
  title,
  tests,
  runTestsAsynchronously,
};

export { unitTestDOMBuilder };
