// savefile ExportText's reader: bad or unknown input gives up instead of looping forever (security review 2026-10-19 #3).
import assert from "node:assert";
import { Worker, isMainThread, parentPort, workerData } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import { parseExportedValue, SavedList } from "../../src/vm/savefile.js";

if (isMainThread) {
	const cases = ['. = list(1, 2', '. = list(object(".0"))', '. = list("a" = 1, foo)', '. = list(', '. = list(1 = '];
	for (const text of cases) {
		const w = new Worker(fileURLToPath(import.meta.url), { workerData: text });
		const done = await Promise.race([
			new Promise((res) => w.once("message", () => res(true))),
			new Promise((res) => setTimeout(() => res(false), 2000)),
		]);
		await w.terminate();
		assert.ok(done, `parser hangs on ${text}`);
	}
	const ok = parseExportedValue('. = list("a" = 1, "b", 2.5)');
	assert.ok(ok instanceof SavedList);
	assert.deepStrictEqual(ok.items, [["a", 1], ["b", undefined], [2.5, undefined]]);
	assert.strictEqual(parseExportedValue('. = "hi\\n"'), "hi\n");
	console.log("savefile export-text ok");
} else {
	parseExportedValue(workerData as string);
	parentPort!.postMessage("done");
}
