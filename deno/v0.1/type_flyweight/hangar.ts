import type { Utils } from "./utils.ts";

interface HangarInterface<N, S> {
  update(utils: Utils<N>, state: S): void;
}

export type { HangarInterface };
