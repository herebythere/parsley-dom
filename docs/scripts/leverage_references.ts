import { codeDemo } from "./code_demo.ts";
import { compose, draw } from "../../v0.1/src/parsley-dom.ts";

interface ArticleWithRefsState {
  click: EventListener;
}

const articleWithRefs = compose<void, ArticleWithRefsState>({
  connect: ({ banger }) => {
    return {
      click: (e: Event) => {
        const refs = banger.getReferences();        
        console.log(refs);
      },
    };
  },
  update: ({ state }) => {
    return draw`
      <article *article class="demo_area__vertical">
        <div *content>
          <h3>
            Press <code class="demo_area__code">ctl alt i</code>
          </h3>
          <input
            *button
            class="leverage_params__button"
            type="button"
            value="Then click this button!"
            @click="${state.click}"></input>
        </div>
      </article>
    `;
  },
  disconnect: () => {},
});

const articleWithRefsDemoCode = `// typescript
interface ArticleWithRefsState {
  click: EventListener;
}

const articleWithRefs = compose<void, ArticleWithRefsState>({
  connect: ({ banger }) => {
    return {
      click: (e: Event) => {
        const refs = banger.getReferences();        
        console.log(refs);
      },
    };
  },
  update: ({ state }) => {
    return draw\`
    <article *article @click="\$\{state.click}\">
      <h3 *title>Hello, world!</h3>
      <div *content>
        <p>Press <code>ctl alt i</code>.</p>
        <p>Then click this button!</p>
      </section>
      <input *button type="button" value="Get Refs"></input>
    </div>
    \`;
  },
  disconnect: () => {},
});`;

const articleWithRefsChunk = articleWithRefs();
const articleWithRefsCode = codeDemo(articleWithRefsDemoCode);

const refsDemoFactory = compose<void, void>({
  connect: () => {},
  update: () => {
    return draw`
      <section id="reference">
        <h2>Reference</h2>
        <h3>Pointers</h3>
        <p>
          A <code>chunk</code> might need to reference
          rendered HTMLElements. Parsley-DOM declares references
          with an <code>*</code> asterisk prefix on an attribue.
          It's visually similar to pointer syntax in C/C++.
        </p>
        <p>
          Parsley-DOM uses <code>banger.getReferences()</code> to return
          an object with the attributes as keys and the elements as values.
        </p>
        <p>
          The example below will log references on <code>state.click</code>.
        </p>
        ${[articleWithRefsCode]}
        <h3>Chunk out</h3>
        <p>The example above will output:</p>
        ${[articleWithRefsChunk]}
      </section>
    `;
  },
  disconnect: () => {},
});

const refsDemoChunk = refsDemoFactory();

export { refsDemoChunk };