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
    return draw`<p class="count_display">${count}</p>`;
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
      <div class="demo_area__vertical">
        <p>sums:</p>
        <div class="leverage_params__sums">
          ${descendants}
        </div>
        <div class="leverage_state__buttons">
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
        </div>
      </div>
    `;
  },
  disconnect: () => {},
})

const counterWithDescendantsChunk = counterWithDescendants();

const parsleyURL = "https://github.com/taylor-vann/parsley"

const counterShellDemoCode = `// typescript
const countDisplay = compose<number, void>({
  connect: () => {},
  update: ({params: count}) => {
    return draw\`<p>\$\{count\}</p>\`;
  },
  disconnect: () => {},
});`;

const countDisplayMemoryDemoCode = `const descendants = [
  countDisplay(0),
  countDisplay(0),
  countDisplay(0),
];`;

const updateDisplayMemoryDemoCode = `// typescript
const updateDescendants = (count: number) => {
  let index = 0;
  while (index < descendants.length) {
    const descendant = descendants[index];
    const value = Math.pow(2, index * count);
    descendant.update(value);

    index += 1;
  }
};`;

const counterWithSavedChildrenDemoCode = `// typescript
const counterFactory = compose<void, Counter>({
  ...
  update: ({state}) => {
    updateDescendants(state.count);
    return draw\`
      <p>sums:</p>
      <div> \$\{descendants\}</div>
      ...
    \`;
  },
  ...
});`;

const countDisplayMemoryCode = codeDemo(countDisplayMemoryDemoCode);
const updateDisplayMemoryCode = codeDemo(updateDisplayMemoryDemoCode);

const counterShellCode = codeDemo(counterShellDemoCode);
const counterWithSavedChildrenCode = codeDemo(counterWithSavedChildrenDemoCode);

const paramsDemoFactory = compose<void, void>({
  connect: () => {},
  update: () => {
    return draw`
      <section id="descend">
        <h2>Descend</h2>
        <h3>Data Flow</h3>
        <p>
          Parsley-DOM passes parameters unidirectionally from 
          <span>chunk</span> to <span>chunk</span>, from parent
          to descendants.
        </p>
        <p>
          Desendants are expected to be
          <span>chunk</span> arrays. Otherwise, descendants
          are converted into strings.
        </p>
        ${[counterShellCode]}
        <h3>Reduce draws</h3>
        <p>
          Three instances of <code>countDisplay</code> are created
          in the example below.
        </p>
        ${[countDisplayMemoryCode]}
        <p>
          By giving descendants a place in memory, Parsley-DOM can
          ensure that a finite number of instances exist in a document.
        </p>
        <p>
          In the example below <code>updateDescendants</code> modulates
          the value of each <code>countDisplay</code> instance.
        </p>
        ${[updateDisplayMemoryCode]}
        <p>
          <span>Chunks</span> draw when descendants change. Luckily,
          <a target="_blank" href="${parsleyURL}">Parsley</a>
          caches renders and only updates when necessary.
        </p>
        <p>
          In the example below, the previous <code>counterFactory</code>
          is modified to include <code>updateDescendants</code> and
          <code>descendants</code>.
        </p>
        ${[counterWithSavedChildrenCode]}
        <h3>Chunk out</h3>
        <p>The example above will have similar output to the following:</p>
        ${[counterWithDescendantsChunk]}
      </section>
    `;
  },
  disconnect: () => {},
});

const paramsDemoChunk = paramsDemoFactory();

export { paramsDemoChunk };
