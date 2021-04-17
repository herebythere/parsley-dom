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
      <article *article>
        <section *content class="demo_area__vertical">
        <p>Press <code>ctl alt i</code>.</p>
        <p>Then click this button!</p>
        <input
          *button
          class="leverage_references__button"
          type="button"
          value="Get Refs"
          @click="${state.click}"></input>
        </section>
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
      <section *content>
        <p>Press <code>ctl alt i</code>.</p>
        <p>Then click this button!</p>
      </section>
      <input *button type="button" value="Get Refs"></input>
    </article>
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