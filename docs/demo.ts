import { attach } from "../src/parsley-dom.ts";

import {introDemoChunk, outroDemoChunk} from "./introduction.ts";
import { paramsDemoChunk } from "./leverage_params.ts";
import { stateDemoChunk } from "./leverage_state.ts";

import { helloWorldDemoChunk } from "./hello_world.ts";
import { refsDemoChunk } from "./leverage_references.ts";

const demoContent = [
  introDemoChunk,
  helloWorldDemoChunk,
  stateDemoChunk,
  paramsDemoChunk,
  refsDemoChunk,
  outroDemoChunk,
];

const mainElement = document.querySelector("main");
if (mainElement !== null) {
  attach(mainElement, demoContent);
}
