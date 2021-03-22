import type { Banger } from "../src/parsley-dom.ts";

import { codeDemo } from "./code_demo.ts";

import { compose, draw } from "../src/parsley-dom.ts";

interface CounterState {
  count: number;
  banger: Banger;
  increase: EventListener;
  decrease: EventListener;
}

const typescriptSyntax = `
compose<Params, State>({
  update: ({ params, state }) => {

    // render logic

    return draw\`<html>\`;
  },
  connect: ({ params, banger }) => {

    // initialization

    return state;
  },
  disconnect: ({state}) => {

    // tear down

    return;
  },
});
`;

const counterStateCode = `
import type { Banger } from "../parsley-dom.ts";

class Counter implements CounterState {
    count: number;
    banger: Banger;

    constructor(banger: Banger) {
        this.count = 0
        this.banger = banger;
    }
    increase = () => {
        this.count += 1;
        this.banger.bang();
    }
    decrease = () => {
        this.count -= 1;
        this.banger.bang();
    }
}
`;

const counterDemoCode = `
const counter = compose<void, Counter>({
    update: ({state}) => {
        const count = state.count;

        return draw\`
            <h3>Counter</h3>
            <p>sum: \$\{count\}</p>
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
        \`;
    },
    connect: ({banger}) => {
        return new Counter(banger);
    },
    disconnect: (state) => {
      console.log(state.count)
    },
})

const counterChunk = counter();
`;

class Counter implements CounterState {
  count: number;
  banger: Banger;

  constructor(banger: Banger) {
    this.count = 0;
    this.banger = banger;
  }
  increase = () => {
    this.count += 1;
    this.banger.bang();
  };
  decrease = () => {
    this.count -= 1;
    this.banger.bang();
  };
}

const counter = compose<void, Counter>({
  update: ({ state }) => {
    const count = state.count;

    return draw`
        <h3>Counter</h3>
        <p>sum: ${count}</p>
        <input
          type="button"
          value="- 1"
          @click="${state.decrease}">
        </input>
        <input
          type="button"
          value="+ 1"
          @click="${state.increase}">
        </input>
    `;
  },
  connect: ({ banger }) => {
    return new Counter(banger);
  },
  disconnect: () => {},
});

const tsSyntaxChunk = codeDemo(typescriptSyntax);
const exampleStateCode = codeDemo(counterStateCode);
const exampleCode = codeDemo(counterDemoCode);
const counterChunk = counter();

const leverageStateDemoFactory = compose<void, void>({
  update: () => {
    return draw`
      <h2>Leverageing State</h2>
      <h3>Connect to state</h3>
      <p>Parsley-DOM has a three-part lifecycle: connect, update, disconnect.</p>
      <p>
        These are also the names of the functions that constitute a
        <span>chunk</span>.
      </p>
      <h3>Lifecycle Syntax</h3>
      <p>${[tsSyntaxChunk]}</p>
      <p>
        Parsley has a utility class called <span><code>banger</code></span>.
        The <span>chunk<span> will rerender when <span><code>banger.bang()</code></span> is called.
      </p>
      <p>Event listeners attached to state can use <span><code>banger.bang()</code></span></p>
      <h3>Counter State Example</h3>
      ${[exampleStateCode]}
      <h3>Counter Chunk Factory Code</h3>
      ${[exampleCode]}
      <h3>Chunk Output</h3>
      <p>This <span>chunk</span> will output:</h3>
      ${[counterChunk]}
    `;
  },
  connect: () => {},
  disconnect: () => {},
});

const leverageStateDemo = leverageStateDemoFactory();

export { leverageStateDemo };
