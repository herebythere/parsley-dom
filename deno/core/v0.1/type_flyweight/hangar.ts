import type { UtilsInterface } from "./utils.ts";

interface HangarInterface<N, S> {
  update(utils: UtilsInterface<N>, state: S): void;
}

export type { HangarInterface };
