// brian taylor vann
// general syntax

import { compose, draw } from "../src/parsley-dom.ts";
import { codeDemo } from "./code_demo.ts";

const twoSteps = `There are three broad steps to create chunks of DOM:`;

const attributes = `Parsley-DOM uses three attribute prefixes to interact with rendered DOM content:`;
const attributeEventPrefix = `@event-listener`;
const attributeOptionalPrefix = `?optional`;
const attributeReferencePrefix = `*reference`;


const syntaxDemo = compose<void, void>({
  update: () => {
    return draw`
        <h2>Create a Chunk of DOM</h2>
        <p>${twoSteps}</p>
        <ul>
          <li>
           create a <span>Chunk Factory</span> with <span><code>compose</code></span>
           and <span><code>draw</code></span>
          </li>
          <li>
           use the <span>Chunk Factory</span> to create a <span>chunk</span> of DOM
          </li>
          <li>append the <span>chunk</span> to the DOM with <span><code>attach</code></span></li>
        </ul>
      `;
  },
  connect: () => {},
  disconnect: () => {},
});

const worthNoting = `
  It's worth noting that chunks of acutal DOM are created.
  They can be refererenced for resuse later.
  This makes a chunk reliably atomic.`;

const alsoWorthNoting = `
  It's also worth noting,
  Parsley does not use JSX or Template elements.
  It's an algorithm that can be ported to other languages.`;

const syntaxDemoChunk = syntaxDemo();

export { syntaxDemoChunk };
