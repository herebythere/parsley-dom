import { compose, draw } from "../src/parsley-dom.ts";

const codeDemo = compose<string, void>({
  update: ({params}) => {
    return draw`
      <div>
        <code>
          <pre>
            ${params}
          </pre>
        </code>
      </div>
    `;
  },
  connect: () => {},
  disconnect: () => {},
});

export { codeDemo };
