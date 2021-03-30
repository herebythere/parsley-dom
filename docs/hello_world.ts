import { compose, draw } from "../src/parsley-dom.ts";
import { codeDemo } from "./code_demo.ts";

const helloWorld = compose<void, void>({
  update: () => {
    return draw`
      <h4>hello, world!</h4>
    `;
  },
  connect: () => {},
  disconnect: () => {},
});

const helloWorldDemoCode = `import { attach, compose, draw } from "../parsley-dom.ts";

const helloWorldFactory = compose<void, void>({
    connect: () => {},
    update: () => {
      return draw\`
        <h4>hello, world!</h4>
      \`;
    },
    disconnect: () => {},
});`;

const helloWorldChunkDemoCode = `const helloWorldChunk = helloWorldFactory();`

const helloWorldAttachDemoCode = `const fixture = document.querySelector("#fixture");
if (fixture !== null) {
  attach(fixture, [helloWorldChunk]);
}`;

const twoSteps = `There are three broad steps to create chunks of DOM:`;

const helloWorldChunk = helloWorld();

const codeDemoChunk = codeDemo(helloWorldDemoCode);
const codeDemoChunkChunk = codeDemo(helloWorldChunkDemoCode);
const codeDemoConnectChunk = codeDemo(helloWorldAttachDemoCode);

const helloWorldDemo = compose<void, void>({
  connect: () => {},
  update: () => {
    return draw`
      <section>
        <h2>Create a Chunk (of DOM)</h2>
        <p>${twoSteps}</p>
        <ul>
          <li>
            create a <span>Chunk Factory</span> with
            <span><code>compose</code></span>
            and <span><code>draw</code></span>
          </li>
          <li>
            use the <span>Chunk Factory</span> to create
            a <span>chunk</span>
          </li>
          <li>
            append the <span>chunk</span> to the DOM with
            <span><code>attach</code></span>.
          </li>
        </ul>
        <h3>Example</h3>
        <h4>Create a Factory</h4>
        ${[codeDemoChunk]}
        <h4>Create a Chunk</h4>
        ${[codeDemoChunkChunk]}
        <h4>Attach the Chunk to the DOM</h4>
        ${[codeDemoConnectChunk]}
        <h4>Output</h4>
        <p>This <span>chunk</span> will output:</p>
        ${[helloWorldChunk]}
      </section>
    `;
  },
  disconnect: () => {},
});

const helloWorldDemoChunk = helloWorldDemo();

export { helloWorldDemoChunk };
