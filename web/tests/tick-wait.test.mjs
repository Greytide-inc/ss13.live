// tick-wait.test.mjs - the server's wait before a tick lets player input in: a message posted to the worker while it waits
// is handled at once, not after the wait (the old MessageChannel spin held it up to 16 ms: the step missed its tick).
// Runs the wait in a worker thread wired like tools/server-prelude.mjs. Usage (from web/, after `npx tsc -p .`):
// node tests/tick-wait.test.mjs [mode]   (mode: server, the default; "browser" shows the old starving spin failing)
import { Worker } from "node:worker_threads";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
const web = resolve(import.meta.dirname, "..");
const mode = process.argv[2] ?? "server";
const mod = pathToFileURL(resolve(web, "build/dist/src/worker/tick-wait.js")).href;

// The worker: 60 ticks, 50 ms apart, each 2 ms of work; replies with how late each message was handled.
const w = new Worker(`
	const { parentPort } = require("node:worker_threads");
	import(${JSON.stringify(mod)}).then(async ({ waitUntil }) => {
		const late = [];
		parentPort.on("message", (sent) => late.push(Date.now() - sent));
		parentPort.postMessage("ready");
		let target = Date.now();
		for (let i = 0; i < 60; i++) { target += 50; await waitUntil(target, ${JSON.stringify(mode)}); const end = Date.now() + 2; while (Date.now() < end); }
		parentPort.postMessage(late);
	});`, { eval: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await new Promise((r) => w.once("message", r));
const timer = setInterval(() => w.postMessage(Date.now()), 7); // every 7 ms: lands at all points of the 50 ms cycle
const late = await new Promise((r) => w.once("message", r));
clearInterval(timer); await sleep(10); await w.terminate();
// A message arriving during the 2 ms of work waits up to ~2 ms; one held by the spin waited up to 16 ms.
const held = late.filter((ms) => ms > 6);
const ok = late.length > 300 && held.length <= late.length * 0.02;
console.log(`${ok ? "ok  " : "FAIL"} ${mode} wait: ${held.length} of ${late.length} messages handled >6 ms late (max ${Math.max(...late)} ms)`);
process.exit(ok ? 0 : 1);
