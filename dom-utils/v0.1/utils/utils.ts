import type {
  BuilderDataInterface,
  BuilderInjection,
  UtilsInterface,
} from "../deps.ts";
import type { BuildStep } from "../deps.ts";

import { parse } from "../deps.ts";
import { createBuilder } from "../builder/builder.ts";

const builderDataCache = new WeakMap<
  Readonly<string[]>,
  BuilderDataInterface<Node>
>();

function getBuilder(
  utils: UtilsInterface<Node>,
  template: Readonly<string[]>,
) {
  let builderData = builderDataCache.get(template);
  if (builderData === undefined) {
    const steps: BuildStep[] = [];
    parse(template, steps);
    builderData = createBuilder(utils, template, steps);
  }

  if (builderData !== undefined) {
    builderDataCache.set(template, builderData);
  }

  return builderData;
}

class DOMUtils implements UtilsInterface<Node> {
  createNode(tagname: string) {
    const tag = tagname.toLowerCase();
    // there is no tag named ":unknown" hopefully
    if (tag === "script" || tag === "style") return document.createElement(":unknown");

    return document.createElement(tagname);
  }
  createTextNode(text: string) {
    return document.createTextNode(text);
  }
  insertNode(node: Node, parentNode?: Node, leftNode?: Node) {
    if (parentNode === undefined) return;

    if (leftNode?.nextSibling !== undefined) {
      parentNode.insertBefore(node, leftNode.nextSibling);
      return;
    }

    parentNode.appendChild(node);
  }
  removeNode(node: Node, parentNode?: Node, leftNode?: Node) {
    if (parentNode !== undefined) {
      parentNode.removeChild(node);
      return;
    }
    node.parentNode?.removeChild(node);
  }
  getIfNode(node: unknown): Node | undefined {
    if (node instanceof Node) {
      return node;
    }
  }
  getIfTextNode(node: unknown): Node | undefined {
    if (node instanceof Text) {
      return node;
    }
  }
  cloneTree(node: Node) {
    return node.cloneNode(true);
  }
  getDescendant(
    baseTier: Node[],
    address: number[],
  ) {
    if (address.length === 0) return;

    let node = baseTier[address[0]];
    if (node === undefined) return;

    for (let index = 1; index < address.length; index++) {
      const addressIndex = address[index];
      node = node.childNodes[addressIndex];
    }

    return node;
  }
  getBuilderData(
    template: Readonly<string[]>,
  ): BuilderDataInterface<Node> | undefined {
    const buildData = getBuilder(this, template);
    console.log("buildData", buildData);
    return buildData;
  }
  setAttribute(
    node: Node,
    name: string,
    value: unknown,
    prevValue: unknown,
  ) {
    // disallowed attributess
    // [form, button, submit] form formaction
    // autofocus + event
  }
  removeAttribute(
    node: Node,
    name: string,
    value: unknown,
  ) {
  }
}

export { DOMUtils };
