// brian taylor vann
// connect

import { compose, draw } from "../compose/compose.ts";
import { hooks } from "../hooks/hooks.ts";
import { attach } from "./attach.ts";

const title = "parsely-dom:attach";

const runTestsAsynchronously = true;

const attachContext = () => {
  const assertions: string[] = [];

  const chunker = {
    update: () => {
      return draw`<article>hello world!</article>`;
    },
    connect: () => {},
    disconnect: () => {},
  };

  const myFirstComponent = compose(chunker);

  const myFirstComponentContext = myFirstComponent(undefined);
  const anchorElement = hooks.createNode("article");

  attach(anchorElement, [myFirstComponentContext]);

  const childNodes = anchorElement.childNodes;

  if (childNodes.length !== 1) {
    assertions.push("childnodes should be of length one");
  }

  if (childNodes[0]?.parentElement !== anchorElement) {
    assertions.push("parent element is not the anchor element");
  }

  return assertions;
};

// compose with state and update

const tests = [attachContext];

const unitTestAttach = {
  title,
  tests,
  runTestsAsynchronously,
};

export { unitTestAttach };
