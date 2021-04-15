// brian taylor vann
// parsely-dom tests

import { unitTestAttach } from "./attach/attach.test.ts";
import { unitTestHooks } from "./hooks/hooks.test.ts";
import { unitTestComposer } from "./compose/compose.test.ts";

const tests = [unitTestComposer, unitTestAttach, unitTestHooks];

export { tests };
