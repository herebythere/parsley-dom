import { attach } from "../src/parsley-dom.ts";

import { leverageParamsDemo } from "./leverage_params.ts";
import { leverageStateDemo } from "./leverage_state.ts";

import { helloWorldDemo } from "./hello_world.ts";
import { syntaxDemoChunk } from "./syntax.ts";
import { tilebar } from "./tilebar.ts";

const demoContent = [
  // intro, show this page.
  // explain basic syntax.
  syntaxDemoChunk,
  helloWorldDemo(),
  leverageStateDemo,
  leverageParamsDemo,
  tilebar(""),
];

const mainElement = document.querySelector("main");
if (mainElement !== null) {
  attach(mainElement, demoContent);
}
