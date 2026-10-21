// repo-root.ts - the repo root (tg_js/), for tools and tests that find web/build etc. from build/dist/src/tools/.
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const repoRoot = resolve(fileURLToPath(import.meta.url), "../../../../../..");
