// pixi-no-eval.test - security step 7: the page's CSP has no 'unsafe-eval', so PixiJS must get worker/pixi-no-eval.js first, and that file
// must match the installed PixiJS (else `node tools/pixi-no-eval.mjs` from web/).
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { pixiNoEval } from "../../tools/pixi-no-eval.mjs";

const web = new URL("../../", import.meta.url);
assert.equal(readFileSync(new URL("worker/pixi-no-eval.js", web), "utf8"), pixiNoEval(), "worker/pixi-no-eval.js is stale: run node tools/pixi-no-eval.mjs");
const page = readFileSync(new URL("worker/index.html", web), "utf8");
assert.ok(!/<meta http-equiv="Content-Security-Policy" content="[^"]*unsafe-eval/.test(page), "the page's CSP allows eval again");
const mod = page.slice(page.indexOf('<script type="module">'));
assert.ok(/^import /m.test(mod) && mod.match(/^import .*$/m)[0].includes("/web/worker/pixi-no-eval.js"), "pixi-no-eval.js is the page module's first import");
console.log("pixi-no-eval: current for this PixiJS, imported first, CSP without 'unsafe-eval'");
