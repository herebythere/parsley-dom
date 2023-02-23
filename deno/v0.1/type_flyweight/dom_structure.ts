// minimal amount of interface to get nodes
interface HTMLInterface {
  parentNode: HTMLElement["parentNode"];
  previousSibling: HTMLElement["previousSibling"];
  nextSibling: HTLMElement["nextSibling"];
  childNodes: HTMLElement["childNodes"];
  setAttribute: HTMLElement["setAttribute"];
  getAttribute: HTMLElement["getAttribute"];
}

interface RootInterface {
  parentNode: HTMLElement;
  leftNode: HTMLElement;
}

interface GenericInjectionInterface<T, V> {
  type: T;
  address: number[];
}

// injection type for every kinds
// attribute injection
// descendant injection
// attribute map injection
const injectionMap = new Map([
  ["ATTRIBUTE_DECLARATION", "ATTRIBUTE_INJECTION"],
  ["INDEPENDENT_NODE_CLOSED", "DESCENDANT_INJECTION"],
  ["NODE_CLOSED", "DESCENDANT_INJECTION"],
  ["INITIAL", "DESCENDANT_INJECTION"],
  ["NODE_SPACE", "ATTRIBUTE_INJECTION_MAP"],
  ["TAGNAME", "ATTRIBUTE_INJECTION_MAP"],
  ["TEXT", "DESCENDANT_INJECTION"],
]);

interface DrawInterface {
  slots: Record<string, number[]>;
  references: Record<string, number[]>;
  injections: InjectionInterface[];
  descendantInjections: number[]; // index in injections
}

interface UserRenderInterface<E> {
  slots: Record<string, E>;
  references: Record<string, E>;
  injections: Injection[];
  injectionIndexes: number[];
}
