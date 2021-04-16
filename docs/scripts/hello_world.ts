import { compose, draw } from "../../v0.1/src/parsley-dom.ts";
import { codeDemo } from "./code_demo.ts";

const helloWorld = compose<void, void>({
  update: () => {
    return draw`
      <h3>hello, world!</h3>
    `;
  },
  connect: () => {},
  disconnect: () => {},
});

const parsleyURL = "https://github.com/taylor-vann/parsley";

const helloWorldDemoCode = `// typescript
import { attach, compose, draw } from "../parsley-dom.ts";

const helloWorldFactory = compose<void, void>({
    connect: () => {},
    update: () => {
      return draw\`<h4>hello, world!</h4>\`;
    },
    disconnect: () => {},
});`;

const helloWorldChunkDemoCode = `const helloWorldChunk = helloWorldFactory();`

const helloWorldAttachDemoCode = `const fixture = document.querySelector("#fixture");
if (fixture !== null) {
  attach(fixture, [helloWorldChunk]);
}`;

const helloWorldChunk = helloWorld();

const codeDemoChunk = codeDemo(helloWorldDemoCode);
const codeDemoChunkChunk = codeDemo(helloWorldChunkDemoCode);
const codeDemoConnectChunk = codeDemo(helloWorldAttachDemoCode);

const helloWorldDemo = compose<void, void>({
  connect: () => {},
  update: () => {
    return draw`
       <section id="chunk">
        <h2>Chunk</h2>
        <p>
          Parsley-DOM creates chunks of interactive DOM with
          <a href="${parsleyURL}" target="_blank">Parsley</a>
          in three broad steps.
        </p>        
        <h3>1) Build a Factory</h3>
        <p>
          Use <span><code>compose</code></span>
          and <span><code>draw</code></span> to
          create a <span>Chunk Factory</span>.
        </p>
        ${[codeDemoChunk]}
        <h3>2) Make a chunk</h3>
        <p>
          Use the <span>Chunk Factory</span> to create
          a <span>Chunk</span>.
        </p>
        ${[codeDemoChunkChunk]}
        <h3>3) Attach to DOM</h3>
        <p>
          Append the <span>Chunk</span> with
          <span><code>attach</code></span>.
        </p>
        ${[codeDemoConnectChunk]}
        <h3>Chunk out</h3>
        <p>
          The <span><code>helloWorldChunk</code></span>
          will output:
        </p>
        <div class="hello_world__demo">${[helloWorldChunk]}</div>
      </section>
    `;
  },
  disconnect: () => {},
});

const helloWorldDemoChunk = helloWorldDemo();

export { helloWorldDemoChunk };
