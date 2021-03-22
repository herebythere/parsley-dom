// brian taylor vann
// hooks

import {
  createNode,
  createTextNode,
  setAttribute,
  removeAttribute,
  insertDescendant,
  removeDescendant,
} from "./hooks.ts";

const title = "parsely-dom:hooks";
const runTestsAsynchronously = true;

const testCreateNode = () => {
  const assertions = [];

  const node = createNode("article");

  if (node === null || node === undefined) {
    assertions.push("node should not be null or undefined");
    return assertions;
  }

  if (!(node instanceof HTMLElement)) {
    assertions.push("node should be an instance of HTML Element");
    return assertions;
  }

  if (node.tagName !== "ARTICLE") {
    assertions.push("node should be an ARTICLE");
  }

  return assertions;
};

const testCreateTextNode = () => {
  const assertions = [];

  const articleContent = "this is some article content";

  const node = createTextNode(articleContent);

  if (node === null || node === undefined) {
    assertions.push("node should not be null or undefined");
    return assertions;
  }

  if (!(node instanceof Text)) {
    assertions.push("node should be an instance of HTML Element");
    return assertions;
  }

  if (node.textContent !== articleContent) {
    assertions.push("node should be an article");
  }

  return assertions;
};

const testSetAttribute = () => {
  const assertions = [];

  const node = createNode("article");

  setAttribute({ references: {}, attribute: "style", value: "heckin based", node });

  if (node === null || node === undefined) {
    assertions.push("node should not be null or undefined");
    return assertions;
  }

  if (node.getAttribute("style") !== "heckin based") {
    assertions.push("node styles shold be 'heckin based'");
  }

  return assertions;
};

const testSetEventAttribute = () => {
  const assertions = [];

  const node = createNode("article");
  const callback = () => {};

  setAttribute({ references: {}, attribute: "@click", value: callback, node });

  if (node === null || node === undefined) {
    assertions.push("node should not be null or undefined");
    return assertions;
  }

  removeAttribute({ references: {}, attribute: "@click", value: callback, node });

  if (node.onclick === callback) {
    assertions.push("click event should have been removed");
  }

  return assertions;
};

const testSetOptionalAttribute = () => {
  const assertions = [];

  const node = createNode("article");

  setAttribute({ references: {}, attribute: "?disabled", value: true, node });

  if (node === null || node === undefined) {
    assertions.push("node should not be null or undefined");
    return assertions;
  }

  setAttribute({ references: {}, attribute: "?disabled", value: undefined, node });

  if (node.getAttribute("?disabled") === undefined) {
    assertions.push("node styles shold be 'heckin based'");
  }

  return assertions;
};

const testRemoveAttribute = () => {
  const assertions = [];
  const node = createNode("article");

  setAttribute({ references: {}, attribute: "style", value: "heckin based", node });

  if (node === null || node === undefined) {
    assertions.push("node should not be null or undefined");
    return assertions;
  }

  if (node.getAttribute("style") !== "heckin based") {
    assertions.push("node styles should initially be 'heckin based'");
  }

  removeAttribute({ references: {}, attribute: "style", value: "heckin based", node });

  if (node.getAttribute("style") === "heckin based") {
    assertions.push("node styles should now unfortunately not be heckin based");
  }

  return assertions;
};

const testInsertNode = () => {
  const assertions = [];

  const node = createNode("article");
  const descendant = createNode("image");

  insertDescendant({ parentNode: node, descendant });

  if (node === null || node === undefined) {
    assertions.push("node should not be null or undefined");
    return assertions;
  }

  if (!node.hasChildNodes()) {
    assertions.push("node should have some kind of descendant");
  }

  if (!node.contains(descendant)) {
    assertions.push("node should have descendant as a child node");
  }

  return assertions;
};

const testRemoveNode = () => {
  const assertions = [];
  const node = createNode("article");
  const descendant = createNode("image");

  insertDescendant({ parentNode: node, descendant });

  if (node === null || node === undefined) {
    assertions.push("node should not be null or undefined");
    return assertions;
  }

  if (!node.hasChildNodes()) {
    assertions.push("node should initially have some kind of descendant");
  }

  if (!node.contains(descendant)) {
    assertions.push("node should initially have descendant as a child node");
  }

  removeDescendant(descendant);

  if (node.hasChildNodes()) {
    assertions.push("node should not have descendants now");
  }

  if (node.contains(descendant)) {
    assertions.push("node should not have descendant as a child node");
  }

  return assertions;
};

const testInsertMultipleNodes = () => {
  const assertions = [];

  const node = createNode("article");
  const descendant = createNode("image");
  const descendantText = createTextNode("such an article");

  insertDescendant({ parentNode: node, descendant });
  insertDescendant({
    parentNode: node,
    leftNode: descendant,
    descendant: descendantText,
  });

  if (node === null || node === undefined) {
    assertions.push("node should not be null or undefined");
    return assertions;
  }

  if (!node.hasChildNodes()) {
    assertions.push("node should initially have some kind of descendant");
  }

  if (!node.contains(descendant)) {
    assertions.push("node should initially have ARTICLE as a child node");
  }

  if (!node.contains(descendantText)) {
    assertions.push("node should initially have article text as a child node");
  }

  if (descendant.nextSibling !== descendantText) {
    assertions.push(
      "descendant should have descendantText as its next sibling"
    );
  }

  if (descendantText.previousSibling !== descendant) {
    assertions.push(
      "descendant should have descendantText as its next sibling"
    );
  }

  return assertions;
};

const testInsertMultipleNodesAndRemoveOne = () => {
  const assertions = [];

  const node = createNode("article");
  const descendant = createNode("image");
  const descendantText = createTextNode("such an article");

  insertDescendant({ parentNode: node, descendant });
  insertDescendant({
    parentNode: node,
    leftNode: descendant,
    descendant: descendantText,
  });

  if (node === null || node === undefined) {
    assertions.push("node should not be null or undefined");
    return assertions;
  }

  if (!node.hasChildNodes()) {
    assertions.push("node should initially have some kind of descendant");
  }

  if (!node.contains(descendant)) {
    assertions.push("node should initially have ARTICLE as a child node");
  }

  if (!node.contains(descendantText)) {
    assertions.push("node should initially have article text as a child node");
  }

  removeDescendant(descendant);

  if (!node.hasChildNodes()) {
    assertions.push("node should not have descendants now");
  }

  if (node.contains(descendant)) {
    assertions.push("node should not have descendant as a child node");
  }

  if (!node.contains(descendantText)) {
    assertions.push("node should still have article text as a child node");
  }

  return assertions;
};

const tests = [
  testCreateNode,
  testCreateTextNode,
  testSetAttribute,
  testSetOptionalAttribute,
  testSetEventAttribute,
  testRemoveAttribute,
  testInsertNode,
  testRemoveNode,
  testInsertMultipleNodes,
  testInsertMultipleNodesAndRemoveOne,
];

const unitTestHooks = {
  title,
  tests,
  runTestsAsynchronously,
};

export { unitTestHooks };
