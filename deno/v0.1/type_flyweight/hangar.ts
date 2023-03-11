import type { DrawInterface } from "./draw.ts";

type DrawFunc<S = unknown> = (state: S) => DrawInterface;

interface HangarInterface<S> {
  update(state: S): void;
}

export type { DrawFunc, HangarInterface };
