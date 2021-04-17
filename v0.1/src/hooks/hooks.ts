// brian taylor vann
// hooks

import type {
  CreateNode,
  CreateTextNode,
  GetSibling,
  Hooks,
  InsertDescendant,
  RemoveDescendant,
  SetAttribute,
  SetAttributeParams,
} from "../deps.ts";

import type { BangerBase } from "../deps.ts";

type DocumentNode = HTMLElement | Text;

type Attributes =
  | EventListenerOrEventListenerObject
  | boolean
  | string
  | undefined;

type Banger = BangerBase<DocumentNode>;

const createNode: CreateNode<HTMLElement> = (tag: string) => {
  return document.createElement(tag);
};

const createTextNode: CreateTextNode<Text> = (content: string) => {
  return document.createTextNode(content);
};

const setAttribute: SetAttribute<DocumentNode, Attributes> = ({
  node,
  attribute,
  value,
  references,
}: SetAttributeParams<DocumentNode, Attributes>) => {
  if (!(node instanceof HTMLElement)) {
    return;
  }

  const firstChar = attribute.charAt(0);

  // *reference
  if (firstChar === "*") {
    const trimmedAttribute = attribute.substr(1);
    references[trimmedAttribute] = node;

    return;
  }

  // @event
  if (firstChar === "@" && value instanceof Function) {
    const trimmedAttribute = attribute.substr(1);
    node.addEventListener(trimmedAttribute, value);

    return;
  }

  // ?optional
  if (firstChar === "?") {
    const trimmedAttribute = attribute.substr(1);
    if (value === undefined) {
      node.removeAttribute(trimmedAttribute);
      return;
    }

    node.setAttribute(trimmedAttribute, String(value));

    return;
  }

  // default
  node.setAttribute(attribute, String(value));
};

const removeAttribute: SetAttribute<DocumentNode, Attributes> = ({
  node,
  attribute,
  value,
}: SetAttributeParams<DocumentNode, Attributes>) => {
  if (!(node instanceof HTMLElement)) {
    return;
  }

  // @event
  if (attribute.charAt(0) === "@" && value instanceof Function) {
    const trimmedAttribute = attribute.substr(1, attribute.length - 2);
    node.removeEventListener(trimmedAttribute, value);

    return;
  }

  // ?optional
  // ?optional might not be necessary
  if (attribute.charAt(0) === "?") {
    const trimmedAttribute = attribute.substr(1);
    node.removeAttribute(trimmedAttribute);

    return;
  }

  node.removeAttribute(attribute);
};

const insertDescendant: InsertDescendant<DocumentNode> = ({
  descendant,
  leftNode,
  parentNode,
}) => {
  if (leftNode === undefined && parentNode?.hasChildNodes()) {
    const firstNode = parentNode.firstChild;
    parentNode.insertBefore(descendant, firstNode);
    return;
  }

  const nextSibling = leftNode?.nextSibling;
  if (nextSibling !== undefined) {
    parentNode?.insertBefore(descendant, nextSibling);
  } else {
    parentNode?.appendChild(descendant);
  }

  if (nextSibling instanceof HTMLElement || nextSibling instanceof Text) {
    return nextSibling;
  }
};

const removeDescendant: RemoveDescendant<DocumentNode> = (descendant) => {
  const parentNode = descendant.parentNode;
  parentNode?.removeChild(descendant);

  return descendant;
};

const getSibling: GetSibling<DocumentNode> = (descendant) => {
  const nextSibling = descendant.nextSibling;

  if (nextSibling instanceof HTMLElement || nextSibling instanceof Text) {
    return nextSibling;
  }
};

const hooks: Hooks<DocumentNode, Attributes> = {
  createNode,
  createTextNode,
  setAttribute,
  removeAttribute,
  insertDescendant,
  removeDescendant,
  getSibling,
};

export type { Banger, DocumentNode, Attributes };

export {
  hooks,
  createNode,
  createTextNode,
  setAttribute,
  removeAttribute,
  insertDescendant,
  removeDescendant,
};
