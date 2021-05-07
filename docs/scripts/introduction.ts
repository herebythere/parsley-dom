import { compose, draw } from "../../v0.1/src/parsley-dom.ts";

const parsleyNoStackDependenices = `It does not rely on DOM Templates
or JSX and is fully capable of being ported to other languages.`;

const introDemo = compose<void, void>({
  connect: () => {},
  update: () => {
    return draw`
      <section id="parsley-dom">
        <h1>PARSLEY-DOM</h1>
        <h2>Quick Start</h2>
        <p>Brian Taylor Vann</p>
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
        <h2>Note</h2>
        <p>
          This page is rendered in Parsely-DOM, a library built with
          <a href="https://github.com/taylor-vann/parsley" target="_blank">Parsley</a>, a library
          that builds tools to maintain interactive XML documents.
        </p>
        <p>${parsleyNoStackDependenices}</p>
      </section>
    `;
  },
  disconnect: () => {},
});

const introDemoChunk = introDemo();
const outroDemoChunk = outroDemo();

export { introDemoChunk, outroDemoChunk };
