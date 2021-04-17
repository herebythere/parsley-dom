import { compose, draw } from "../../v0.1/src/parsley-dom.ts";

const codeDemo = compose<string, void>({
  update: ({params}) => {
    return draw`
      <code>
        <pre>${params}</pre>
      </code>
    `;
  },
  connect: () => {},
  disconnect: () => {},
});

export { codeDemo };
