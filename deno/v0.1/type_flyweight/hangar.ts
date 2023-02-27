import type { DrawInterface } from "./draw.ts";

type DrawFunc<S = unknown> = (state: S) => DrawInterface;

interface HangarInterface<N, S> {
	setup(drawFuncs: DrawFunc<S>[], parentNode?: N, leftNode?: N): void;
	update(state: S): void;
}

export type { DrawFunc, HangarInterface }
