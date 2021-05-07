import type { Banger } from "../../v0.1/src/parsley-dom.ts";

import { codeDemo } from "./code_demo.ts";

import { compose, draw } from "../../v0.1/src/parsley-dom.ts";

class Counter {
  banger: Banger;
  count: number;

  constructor(banger: Banger) {
    this.banger = banger;
    this.count = 0;
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

const counterFactory = compose<void, Counter>({
  connect: ({ banger }) => {
    return new Counter(banger);
  },
  update: ({ state }) => {
    const count = state.count;

    return draw`
      <div class="demo_area__vertical">
        <div class="demo_area__top_bump">
          <h3>sum: ${count}</h3>
          <div class="leverage_state__buttons">
            <input
              class="leverage_params__button"
              type="button"
              value="- 1"
              @click="${state.decrease}"/>
            <input
              class="leverage_params__button"
              type="button"
              value="+ 1"
              @click="${state.increase}"/>
          </div>
        </div>
      </div>
    `;
  },
  disconnect: () => {},
});

const typescriptSyntax = `//typescript
compose<Params, State>({
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

const counterStateCode = `//typescript
import type { Banger } from "../parsley-dom.ts";

class Counter {
  banger: Banger;
  count: number;

  constructor(banger: Banger) {
    this.banger = banger;
    this.count = 0
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

const counterDemoCode = `//typescript
const counterFactory = compose<void, Counter>({
  connect: ({banger}) => {
    return new Counter(banger);
  },
  update: ({state}) => {
    return draw\`
      <p>sum: \$\{state.count\}</p>
      <input type="button" value="- 1" @click="\$\{state.decrease\}"/>
      <input type="button" value="+ 1" @click="\$\{state.increase\}"/>\`;
  },
  disconnect: () => {},
});

const counterChunk = counterFactory();
`;

const parsleyLifecycle = `Parsley-DOM has a three-part lifecycle:
connect, update, and disconnect.`;

const counterChunk = counterFactory();

const tsSyntaxChunk = codeDemo(typescriptSyntax);
const exampleStateCode = codeDemo(counterStateCode);
const exampleCode = codeDemo(counterDemoCode);

const stateDemoFactory = compose<void, void>({
  connect: () => {},
  update: () => {
    return draw`
      <section id="interact">
        <h2>Interact</h2>
        <h3>The Lifecycle</h3>
        <p>
          ${parsleyLifecycle} These functions also constitute a
          <span>chunk</span>.
        </p>
        ${[tsSyntaxChunk]}
        <h3>Update chunks</h3>
        <p>
          Updates in Parsley depend on the
          <code>banger</code> class.
          In the example below, event listeners use
          <code>banger.bang()</code> to update and redraw.
        </p>
        ${[exampleStateCode]}
        <h3>Event Listeners</h3>
        <p>
          Event listeners are attached to DOM elements through an
          <code>@</code> atmark. They can interact
          with state through the <code>banger</code> class.
        </p>
        <p>
          In the example below, Parsley-DOM understands that the
          <code>@click</code> property is going
          to be an Event Listener.
        </p>
        ${[exampleCode]}
        <h3>Chunk out</h3>
        <p>The <code>counterChunk</code> will output:</p>
        ${[counterChunk]}
      </section>
    `;
  },
  disconnect: () => {},
});

const stateDemoChunk = stateDemoFactory();

export { stateDemoChunk };
