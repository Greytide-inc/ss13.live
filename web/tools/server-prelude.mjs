// server-prelude - runs inside the server.mjs worker thread. Gives the browser worker script (boot-worker.js) what it expects
// from a Web Worker: `self` with postMessage/onmessage, and a `fetch` that reads file: URLs (the dist folder). Then imports it.
import { parentPort, workerData } from "node:worker_threads";
import { readFile } from "node:fs/promises";
import { readFileSync, writeFileSync, renameSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const realFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
	const u = input instanceof URL ? input : new URL(String(input));
	if (u.protocol !== "file:") return realFetch(input, init);
	try {
		return new Response(await readFile(fileURLToPath(u)), { status: 200 });
	} catch {
		return new Response("not found", { status: 404 });
	}
};
globalThis.self = globalThis;
// --saves FILE (server.mjs): the data/ savefiles (character setups, tg's round-end saves) in one JSON file of base64, instead of in
// memory (no IndexedDB in Node), so they outlive a round and a restart. Written whole to FILE.tmp, then renamed over FILE.
if (workerData.saves) {
	const file = workerData.saves;
	globalThis.tgjsFileStore = {
		async load() { try { return Object.fromEntries(Object.entries(JSON.parse(readFileSync(file, "utf8"))).map(([k, v]) => [k, new Uint8Array(Buffer.from(v, "base64"))])); } catch (e) { if (e.code !== "ENOENT") throw e; return {}; } },
		async save(files) { writeFileSync(file + ".tmp", JSON.stringify(Object.fromEntries(Object.entries(files).map(([k, v]) => [k, Buffer.from(v).toString("base64")])))); renameSync(file + ".tmp", file); },
	};
}
globalThis.tgjsServer = true; // game code reads this: single-player-only features (zoom out) are off on a server
globalThis.postMessage = (m) => parentPort.postMessage(m);
parentPort.on("message", (data) => { if (typeof globalThis.onmessage === "function") globalThis.onmessage({ data }); });
await import(pathToFileURL(workerData.script).href);
parentPort.postMessage({ type: "worker-ready" });
