import { codeDemo } from "./code_demo.ts";

import { compose, draw } from "../src/parsley-dom.ts";

const actualElements = `
Parsley-DOM works with actual HTMLElements and DOM Events that flow
from descendants to parents.
`;

const callbackParameters = `
It's also possible to pass callback functions from parents
to descendants through parameters.
`;

const counterShellDemoCode = `
interface CountDisplayParams {
    index: number,
    value: number,
}

const countDisplay = compose<CountDisplayParams, void>({
    update: ({params}) => {
        const modulated = params.index * params.value;

        return draw\`
            <h4>\$\{params.index\}:</h4>
            <p>\$\{modulated\}</p>
        \`;
    },
    connect: () => {},
    disconnect: () => {},
})
`;

const counterWithChildrenDemoCode = `
const counterWithDescendants = compose<void, Counter>({
    update: ({state}) => {
        return draw\`
            <h3>\$\{textDescendant\}</h3>
            <input
              type="button"
              value="- 1"
              @click="\$\{state.decrease\}">
            </input>
            <input
              type="button"
              value="+ 1"
              @click="\$\{state.increase\}">
            </input>
            <p>counters:</p>
            <div>
              \$\{[
                countDisplay({index: 2, value: state.count}),
                countDisplay({index: 4, value: state.count}),
              ]\}
            </div>
        \`;
    },
    connect: ({banger}) => {
        return new Counter(banger);
    },
    disconnect: () => {},
})

const counterWithDescendantsChunk = counterWithDescendants();
`;


const counterShellCode = codeDemo(counterShellDemoCode);
const counterWithChildrenCode = codeDemo(counterWithChildrenDemoCode);

const leverageParamsDemoFactory = compose<void, void>({
    update: () => {
      return draw`
        <h2>Leverage Parameters</h2>
        <h3>Parameter Flow</h3>
        <p>
          Parsley-DOM passes parameters from <span>chunk</span>
          to <span>chunk</span> unidirectionally from parent
          to descendants.
        </p>
        <p>${actualElements}</p>
        <p>${callbackParameters}</p>
        <h3>Create a re-usable Chunk</h3>
        <p>Parameters make chunks more versatile.</p>
        ${[counterShellCode]}
        <h3>Use Chunks as Descendants</h3>
        <p>
          Desendants in Parsley-DOM can be strings or an array of
          <span>chunks</span>.
        </p>
        <p>
            A redraw is triggered when descendant strings or arrays change.
        </p>
        ${[counterWithChildrenCode]}
      `;
    },
    connect: () => {},
    disconnect: () => {},
  });
  
  const leverageParamsDemo = leverageParamsDemoFactory();
  
  export { leverageParamsDemo };