import type { BuildInterface } from "./build.ts";
import type { Utils } from "./utils.ts";


type Draws<N> = BuildInterface<N> | N | string;
type DrawFunc<N> = (state: unknown) => Draws<N>;

interface HangarInterface<N, S> {
  update(utils: Utils<N>, state: S): void;
}

export type { DrawFunc, HangarInterface, Draws };
