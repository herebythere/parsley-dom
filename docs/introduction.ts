import { compose, draw } from "../src/parsley-dom.ts";
import { codeDemo } from "./code_demo.ts";

const whatIsParsley = `
Parsley is a library that creates chunks of interactive XML.
`;

const whatIsParsleyDOM = ` Parsley-DOM is an interface to Parsley
and lets you create chunks of interactive DOM.`;

const parsleyIsDifferent = `This page is rendered in Parsely-DOM.
But it works a little differently than other rendering libraries.`

const parsleyIsUnique = `Parsley has no dependencies and it's unique in that
it isn't concerned with the content rendered.`;

const parsleyNoDependenices = `It does not rely on DOM Templates
or JSX and is fully capable of being ported to other languages.`;


const introDemo = compose<void, void>({
  connect: () => {},
  update: () => {
    return draw`
      <h1>Parsley-DOM</h1>
      <p>Brian Taylor Vann</p>
      <section>
        <h2>Quick Start</h2>
        <p>${whatIsParsley}</p>
        <p>${whatIsParsleyDOM}</p>
      </section>
    `;
  },
  disconnect: () => {},
});

const outroDemo = compose<void, void>({
  connect: () => {},
  update: () => {
    return draw`
      <section>
        <h2>Notes</h2>
        <p>${parsleyIsUnique}</p>
        <p>${parsleyNoDependenices}</p>
        <p>${parsleyIsDifferent}</p>  
      </section>
    `;
  },
  disconnect: () => {},
});

const introDemoChunk = introDemo();
const outroDemoChunk = outroDemo();

export { introDemoChunk, outroDemoChunk };