// Savefile persistence: the VFS overlay's data/ files live in one IndexedDB record (whole-record
// replace on each save, so fdel'd files vanish too). No IndexedDB (Node): in-memory, lost at exit.
export type Files = Record<string, Uint8Array>;
export interface FileStore { load(): Promise<Files>; save(files: Files): Promise<void> }

const DB = "ss13-classic", KEY = "files";
const wait = <T>(r: { onsuccess: unknown; onerror: unknown; result?: T; error?: unknown }): Promise<T> =>
	new Promise((ok, no) => { r.onsuccess = () => ok(r.result as T); r.onerror = () => no(r.error); });

/** `idb` defaults to the global indexedDB when there is one. */
export function openStore(idb: IDBFactory | undefined = (globalThis as { indexedDB?: IDBFactory }).indexedDB): FileStore {
	if (!idb) {
		let mem: Files = {};
		return { load: async () => mem, save: async (f) => { mem = f; } };
	}
	const open = (): Promise<IDBDatabase> => {
		const req = idb.open(DB, 1);
		req.onupgradeneeded = () => req.result.createObjectStore("kv");
		return wait(req);
	};
	return {
		async load() {
			const db = await open();
			const v = await wait<Files | undefined>(db.transaction("kv").objectStore("kv").get(KEY));
			db.close();
			return v ?? {};
		},
		async save(files) {
			const db = await open();
			const tx = db.transaction("kv", "readwrite");
			tx.objectStore("kv").put(files, KEY);
			await new Promise<void>((ok, no) => { tx.oncomplete = () => ok(); tx.onerror = () => no(tx.error); });
			db.close();
		},
	};
}

/** data/ is saved except logs and next_map.json: the map is a per-load choice (?map=), never kept (one ?map=runtime visit
 *  used to switch every later load to Runtime Station). */
export const isSavedPath = (p: string): boolean => p.startsWith("data/") && !p.startsWith("data/logs/") && p !== "data/next_map.json";
