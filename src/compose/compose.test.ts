// brian taylor vann
// compose tests

import { Chunk } from "https://raw.githubusercontent.com/taylor-vann/parsley/main/src/chunk/chunk.ts";
import { compose, draw } from "./compose.ts";

const title = "parsely-dom:composer";
const runTestsAsynchronously = true;

const renderTemplate = () => {
  const assertions = [];
  const template = draw`<article>${"hello world!"}</article>`;

  if (template.injections.length !== 1) {
    assertions.push("template should have one injection");
  }

  if (template.templateArray.length !== 2) {
    assertions.push("template should have two template array chunks");
  }

  return assertions;
};

const composerAChunker = () => {
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

  if (!(myFirstComponentContext instanceof Chunk)) {
    assertions.push("component should return an instance of context");
    return assertions;
  }

  const siblings = myFirstComponentContext.getSiblings();
  if (siblings.length !== 1) {
    assertions.push("context should have one sibling");
  }

  return assertions;
};

const composerAStaterChunker = () => {
  const assertions: string[] = [];

  const expectedArticleText =
    "\n          hello world #42! from world #X7!\n        ";

  const mySecondComponent = compose<number, string>({
    update: ({ params, state }) => {
      return draw`
        <article>
          hello world #${params}! from world #${state}!
        </article>`;
    },
    connect: (params) => {
      return "X7";
    },
    disconnect: (state) => {},
  });

  const mySecondComponentContext = mySecondComponent(42);

  const siblings = mySecondComponentContext.getSiblings();
  const article = siblings[1];

  if (article?.textContent !== expectedArticleText) {
    assertions.push("article text is unexpected");
  }

  return assertions;
};

const tests = [renderTemplate, composerAChunker, composerAStaterChunker];

const unitTestComposer = {
  title,
  tests,
  runTestsAsynchronously,
};

export { unitTestComposer };
