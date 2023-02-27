// minimal amount of interface to get nodes
interface HTMLElementInterface {
  parentNode: HTMLElementInterface | null;
  previousSibling: HTMLElementInterface | null;
  nextSibling: HTMLElementInterface | null;
  childNodes: HTMLElementInterface[];
  setAttribute(name: string, value: string): void;
  getAttribute(name: string): string;
}

export type { HTMLElementInterface };
