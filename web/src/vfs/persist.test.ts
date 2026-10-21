import { strict as assert } from "node:assert";
import { openStore, isSavedPath } from "./persist.js";
import { Vfs } from "./vfs.js";

// Minimal fake IndexedDB: one database, object stores as Maps, values structured-cloned.
function fakeIdb(): IDBFactory {
	const stores = new Map<string, Map<string, unknown>>();
	const later = (f: () => void) => setTimeout(f);
	const db = { createObjectStore: (n: string) => stores.set(n, new Map()), close() {},
		transaction: (n: string) => {
			const tx: { oncomplete?: () => void } = {};
			return Object.assign(tx, { objectStore: () => ({
				get: (k: string) => { const r: { result?: unknown; onsuccess?: () => void } = {}; later(() => { r.result = stores.get(n)!.get(k); r.onsuccess?.(); }); return r; },
				put: (v: unknown, k: string) => { stores.get(n)!.set(k, structuredClone(v)); later(() => tx.oncomplete?.()); },
			}) });
		} };
	return { open: () => {
		const req: { result: typeof db; onsuccess?: () => void; onupgradeneeded?: () => void } = { result: db };
		later(() => { if (!stores.size) req.onupgradeneeded?.(); req.onsuccess?.(); });
		return req;
	} } as unknown as IDBFactory;
}

const idb = fakeIdb();
// Session 1: game writes prefs, worker exports and stores.
const a = new Vfs({ files: {} } as never);
a.writeText("data/player_saves/a/alice/preferences.sav", "SAVEFILE-JSON-1\n{\"x\":1}");
a.writeText("data/logs/2017/log.txt", "noise");
assert.deepEqual(Object.keys(a.exportOverlay(isSavedPath)), ["data/player_saves/a/alice/preferences.sav"]);
await openStore(idb).save(a.exportOverlay(isSavedPath));
// Session 2: fresh VFS, load, import.
const b = new Vfs({ files: {} } as never);
b.importOverlay(await openStore(idb).load());
assert.equal(b.readText("data/player_saves/a/alice/preferences.sav"), "SAVEFILE-JSON-1\n{\"x\":1}");
assert.equal(b.readText("data/logs/2017/log.txt"), null);
// No-IndexedDB fallback works in memory.
const mem = openStore(null as unknown as undefined); // null, unlike undefined, skips the default
assert.deepEqual(await mem.load(), {});
await mem.save({ "data/x": new Uint8Array([1]) });
assert.equal((await mem.load())["data/x"][0], 1);
console.log("ok   persist: save -> IndexedDB record -> fresh VFS restores savefile bytes");
assert.equal(isSavedPath("data/next_map.json"), false, "the map choice is never saved");
