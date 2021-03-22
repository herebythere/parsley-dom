import { compose, draw } from "../src/parsley-dom.ts";
import { codeDemo } from "./code_demo.ts";

const helloWorldDemoCode = `
import { connect, compose, draw } from "../parsley-dom.ts";

const helloWorldFactory = compose<void, void>({
    update: () => {
        return draw\`
            <h4>hello, world!</h4>
        \`;
    },
    connect: () => {},
    disconnect: () => {},
});
`;

const helloWorldChunkDemoCode = `
const helloWorldChunk = helloWorldFactory();
`

const helloWorldConnectDemoCode = `
const fixture = document.querySelector("#fixture");
if (fixture !== null) {
  connect(fixture, [helloWorldChunk]);
}
`;

const helloWorld = compose<void, void>({
  update: () => {
    return draw`
      <h4>hello, world!</h4>
    `;
  },
  connect: () => {},
  disconnect: () => {},
});

const codeDemoChunk = codeDemo(helloWorldDemoCode);
const codeDemoChunkChunk = codeDemo(helloWorldChunkDemoCode);
const codeDemoConnectChunk = codeDemo(helloWorldConnectDemoCode);

const helloWorldChunk = helloWorld();

const helloWorldDemo = compose<void, void>({
  update: () => {
    return draw`
      <h2>Hello, world! Example</h2>
      <h3>Create a Hello, World! Factory</h3>
      ${[codeDemoChunk]}
      <h3>Create a Hello, World! Chunk</h3>
      ${[codeDemoChunkChunk]}
      <h3>Connect the Hello, World! Chunk to the DOM</h3>
      ${[codeDemoConnectChunk]}
      <h3>Hello, World! Output</h3>
      <p>This <span>chunk</span> will output:</h3>
      ${[helloWorldChunk]}
    `;
  },
  connect: () => {},
  disconnect: () => {},
});

export { helloWorldDemo };
