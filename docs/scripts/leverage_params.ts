import type { Banger } from "../../v0.1/src/parsley-dom.ts";

import { compose, draw } from "../../v0.1/src/parsley-dom.ts";
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

const parsleyURL = "https://github.com/taylor-vann/parsley"

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
          Parsley-DOM passes parameters unidirectionally from 
          <span>chunk</span> to <span>chunk</span>, from parent
          to descendants.
        </p>
        <h3>Re-usable chunks</h3>
        <p>Parameters make chunks more versatile.</p>
        ${[counterShellCode]}
        <h3>Reduce redraws</h3>
        <p>
          Desendants can be strings or <span>chunk</span> arrays.
          Redraws are triggered when descendants change. However,
          <a target="_blank" href="${parsleyURL}">Parsley</a>
          will cache renders and only update when necessary.
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
