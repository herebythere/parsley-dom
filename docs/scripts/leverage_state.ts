import type { Banger } from "../../v0.1/src/parsley-dom.ts";

import { codeDemo } from "./code_demo.ts";

import { compose, draw } from "../../v0.1/src/parsley-dom.ts";

interface CounterState {
  count: number;
  banger: Banger;
  increase: EventListener;
  decrease: EventListener;
}

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
        @click="${state.decrease}"/>
      <input
        type="button"
        value="+ 1"
        @click="${state.increase}"/>
    `;
  },
  connect: ({ banger }) => {
    return new Counter(banger);
  },
  disconnect: () => {},
});


const typescriptSyntax = `compose<Params, State>({
  connect: ({ params, banger }) => {
    // initialization
    return state;
  },
  update: ({ params, state }) => {
    // render logic
    return draw\`<html>\`;
  },
  disconnect: ({state}) => {
    // tear down
  },
});
`;

const counterStateCode = `import type { Banger } from "../parsley-dom.ts";

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

const counterDemoCode = `const counter = compose<void, Counter>({
  connect: ({banger}) => {
    return new Counter(banger);
  },
  update: ({state}) => {
    return draw\`
      <h3>Counter</h3>
      <p>sum: \$\{state.count\}</p>
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
  disconnect: () => {},
})

const counterChunk = counter();
`;

const parsleyLifecycle = `Parsley-DOM has a three-part lifecycle:
connect, update, disconnect.`

const parsleyEventListeners = `Event listeners are added by Parsley-DOM
to DOM elements through an atmark.`

const counterChunk = counter();

const tsSyntaxChunk = codeDemo(typescriptSyntax);
const exampleStateCode = codeDemo(counterStateCode);
const exampleCode = codeDemo(counterDemoCode);

const stateDemoFactory = compose<void, void>({
  update: () => {
    return draw`
      <section>
        <h2>Interact with state</h2>
        <h3>Connect</h3>
        <p>${parsleyLifecycle}</p>
        <p>
          These are also the functions that constitute a <span>chunk</span>.
        </p>
        <p>
          State is considered separate from a <span>chunk</span> and
          Parsley-DOM expects state to be returned from the
          <code>connect</code> method.
        </p>
        <h3>Lifecycle Syntax</h3>
        ${[tsSyntaxChunk]}
        <h3>Update a chunk</h3>
        <p>
          Parsley has a utility class called <span><code>banger</code></span>.
          A <span>chunk</span> will redraw when
          <span><code>banger.bang()</code></span> is called.
        </p>
        <p>
          In the example below, event listeners will use
          <span><code>banger.bang()</code></span> to update and redraw.
        </p>
        ${[exampleStateCode]}
        <h3>Chunk factory</h3>
        <p>${parsleyEventListeners}</p>
        <p>
          Below, an atmark tells Parsley-DOM that <code>@click</code> property
          is going to be an EventListener.
        </p>
        ${[exampleCode]}
        <h3>Output</h3>
        <p>This <span>chunk</span> will output:</p>
        ${[counterChunk]}
      </section>
    `;
  },
  connect: () => {},
  disconnect: () => {},
});

const stateDemoChunk = stateDemoFactory();

export { stateDemoChunk };
