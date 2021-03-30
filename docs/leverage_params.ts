import type { Banger } from "../src/parsley-dom.ts";

import { compose, draw } from "../src/parsley-dom.ts";
import { codeDemo } from "./code_demo.ts";

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

const countDisplay = compose<number, void>({
  connect: () => {},
  update: ({params: count}) => {
    return draw`<p>${count} </p>`;
  },
  disconnect: () => {},
})

const descendants = [
  countDisplay(0),
  countDisplay(0),
  countDisplay(0),
]

const updateDescendants = (count: number) => {
  let index = 0;
  while (index < descendants.length) {
    const descendant = descendants[index];
    const value = Math.pow(2, index * count);
    descendant.update(value);

    index += 1;
  }
}

const counterWithDescendants = compose<void, Counter>({
  connect: ({banger}) => {
    return new Counter(banger);
  },
  update: ({state}) => {
    updateDescendants(state.count);

    return draw`
      <h3>"Counter"</h3>
      <p>sums:</p>
      <div>
        ${descendants}
      </div>
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
  disconnect: () => {},
})

const counterWithDescendantsChunk = counterWithDescendants();

const actualElements = `Parsley-DOM works with actual HTMLElements and DOM Events.`;

const callbackParameters = `It's also possible to pass callback functions from parents
to descendants through parameters.`;

const counterShellDemoCode = `const countDisplay = compose<number, void>({
  connect: () => {},
  update: ({params: count}) => {
    return draw\`<p>\$\{count\}</p>\`;
  },
  disconnect: () => {},
})`;

const counterWithSavedChildrenDemoCode = `const descendants = [
  countDisplay(0),
  countDisplay(0),
  countDisplay(0),
]

const updateDescendants = (num: number) => {
  let index = 0;
  while (index < descendants.length) {
    const descendant = descendants[index];
    const value = Math.pow(2, index + 1) * count;
    descendant.update(value);

    index += 1;
  }
}

const counterWithDescendants = compose<void, Counter>({
  connect: ({banger}) => {
    return new Counter(banger);
  },
  update: ({state}) => {
    updateDescendants(state.count);

    return draw\`
      <h3>\$\{textDescendant\}</h3>
      <p>sums:</p>
      <div>
        \$\{descendants\}
      </div>
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

const counterWithDescendantsChunk = counterWithDescendants();`;

const counterShellCode = codeDemo(counterShellDemoCode);
const counterWithSavedChildrenCode = codeDemo(counterWithSavedChildrenDemoCode);

const paramsDemoFactory = compose<void, void>({
  connect: () => {},
  update: () => {
    return draw`
      <section>
        <h2>Parameters and Descendants</h2>
        <h3>Data Flow</h3>
        <p>
          Parsley-DOM passes parameters from <span>chunk</span>
          to <span>chunk</span> unidirectionally from parent
          to descendants.
        </p>
        <p>${actualElements}</p>
        <p>${callbackParameters}</p>
        <h3>Re-usable chunks</h3>
        <p>Parameters make chunks more versatile.</p>
        ${[counterShellCode]}
        <h3>Reduce redraws</h3>
        <p>
          Desendants in Parsley-DOM can be a string or an array of
          <span>chunks</span>.
        </p>
        <p>
          A redraw is triggered when descendant strings or arrays change.
        </p>
        <p>
          Parsley can cache chunks and update only when
          parts of a chunk change.
        </p>
        ${[counterWithSavedChildrenCode]}
        <p>
          By giving descendants a place in memory, Parsley-DOM can
          ensure that only three instances of <code>countDisplay</code> will
          exist and only three instances of <code>countDisplay</code> will
          redaw.
        </p>
        <h3>Output</h3>
        <p>The example above will output the following:</p>
        ${[counterWithDescendantsChunk]}
      </section>
    `;
  },
  disconnect: () => {},
});

const paramsDemoChunk = paramsDemoFactory();

export { paramsDemoChunk };
