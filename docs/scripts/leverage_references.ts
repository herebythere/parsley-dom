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
      <article
        *article
        @click="${state.click}">
        <h3 *title>Hello, world!</h3>
        <section *content>
          <p>Have a wonderful day :D</p>
        </section>
        <input
          *button
          type="button"
          value="Get Refs"></input>
      </article>
    `;
  },
  disconnect: () => {},
});

const articleWithRefsDemoCode = `interface ArticleWithRefsState {
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
    <article
      *article
      @click="\$\{state.click}\">
      <h3 *title>Hello, world!</h3>
      <section *content>
        <p>Have a wonderful day :D</p>
      </section>
      <input
        *button
        type="button"
        value="Get Refs"></input>
    </article>
    \`;
  },
  disconnect: () => {},
});
`;

const articleWithRefsChunk = articleWithRefs();
const articleWithRefsCode = codeDemo(articleWithRefsDemoCode);

const refsDemoFactory = compose<void, void>({
  connect: () => {},
  update: () => {
    return draw`
      <section>
        <h2>Chunks and references</h2>
        <h3>Syntax</h3>
        <p>
          Occasionally, a <code>chunk</code> will need to reference
          HTMLElements rendered in <code>draw</code>.
        </p>
        <p>
          Parsley-DOM declares references in a <span>chunk</span>
          by using the <code>*</code> symbol on an implicit attribue,
          similar to pointer syntax in C/C++ and Java.
        </p>
        <h3>Example</h3>
        <p>
          The example below will create a <code>chunk</code> with references
          and log them to the console when a button is clicked.
        </p>
        ${[articleWithRefsCode]}
        <h3>Output</h3>
        <p>The output of the example above will be:</p>
        ${[articleWithRefsChunk]}
      </section>
    `;
  },
  disconnect: () => {},
});

const refsDemoChunk = refsDemoFactory();

export { refsDemoChunk };