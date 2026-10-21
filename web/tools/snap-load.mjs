// snap-load - Snapshot decode time + heap + loaded-world fingerprint, in a fresh node process per run.
// Usage (from web/, after npm run build): node --expose-gc tools/snap-load.mjs [SNAP=build/snapshot-cache/world.snap.gz] [--runs N=5] [--fp]
//   Prints one JSON line per run (decode_ms, heap before/after, objects) and a median line.
//   --fp: after the load, saves the world again and prints a sha256 of the saved bytes (without the meta part, which holds
//   wall-clock host data): the same snapshot must give the same fingerprint with old and new snapshot.ts.
// Compare old/new code on the SAME snapshot file (saved world size varies between builds).
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { gunzipSync } from "node:zlib";
import { pathToFileURL, fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";
import { spawnSync } from "node:child_process";
const argv = process.argv.slice(2);
const web = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
const snapFile = resolve(argv.find((a, i) => !a.startsWith("--") && !(i > 0 && argv[i - 1] === "--runs")) ?? web + "/build/snapshot-cache/world.snap.gz");
if (!argv.includes("--once")) {
	const runs = Number(opt("--runs", "5")), res = [];
	for (let i = 0; i < runs; i++) {
		const r = spawnSync(process.execPath, ["--expose-gc", "--max-old-space-size=6000", fileURLToPath(import.meta.url), snapFile, "--once", ...(argv.includes("--fp") ? ["--fp"] : [])], { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] });
		const line = r.stdout.trim().split("\n").pop(); console.log(line); res.push(JSON.parse(line));
	}
	const med = (k) => res.map((x) => x[k]).sort((a, b) => a - b)[res.length >> 1];
	console.log(`median tree_ms ${med("tree_ms")}, decode_ms ${med("decode_ms")} (min ${Math.min(...res.map((x) => x.decode_ms))} max ${Math.max(...res.map((x) => x.decode_ms))}), heap_after_gc_mb ${med("heap_after_gc_mb")}${res[0].fp_load ? ", fp " + [...new Set(res.map((x) => x.fp_load))].join("/") : ""}`);
	process.exit(0);
}
const S = pathToFileURL(web + "/build/dist/src/").href;
const { VM } = await import(S + "vm/interpreter.js");
const { ObjectTree } = await import(S + "vm/objtree.js");
const { gameProgram } = await import(S + "vm/typedefs.js");
const { Vfs } = await import(S + "vfs/vfs.js");
const { iconLoader, iconStatesReader } = await import(S + "dmi/dmi-node.js");
const { iconSizeReader } = await import(S + "tools/dmi-size.js");
const { loadSnapshot, saveSnapshot } = await import(S + "vm/snapshot.js");
const root = resolve(web, "..");
const raw = gunzipSync(readFileSync(snapFile));
await import(pathToFileURL(web + "/build/game-types.js").href);
const prog = gameProgram();
const tt = performance.now();
const tree = new ObjectTree(prog);
const tree_ms = performance.now() - tt;
const bundle = JSON.parse(readFileSync(web + "/build/vfs-bundle.json", "utf8"));
const cfg = bundle.files["config/config.txt"];
if (cfg) bundle.files["config/config.txt"] = cfg.replace(/^GUEST_BAN/m, "#GUEST_BAN");
const vm = new VM(tree);
vm.vfs = new Vfs(bundle);
vm.lenient = true; vm.debugInfo = true;
vm.iconSize = iconSizeReader([root]); vm.loadIcon = iconLoader([root]); vm.iconStates = iconStatesReader([root]);
await import(pathToFileURL(web + "/build/translated-tg.js").href);
const rt = await import(S + "translate/runtime.js");
rt.install(vm);
vm.clients.setSkin(readFileSync(root + "/interface/skin.dmf", "utf8"));
gc(); gc();
const mb = () => Math.round(process.memoryUsage().heapUsed / 1048576);
const h0 = mb();
const t = performance.now();
const r = loadSnapshot(vm, raw);
const decode = performance.now() - t;
const out = { tree_ms: Math.round(tree_ms), vm_heap_mb: h0, decode_ms: Math.round(decode), heap_before_mb: h0, heap_after_mb: mb(), objects: r.objects };
gc(); gc(); out.heap_after_gc_mb = mb();
if (argv.includes("--fp")) {
	const b = saveSnapshot(vm, null).bytes;
	const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
	let at = 12; const h = createHash("sha256");
	for (let i = 0; i < 5; i++) { const len = dv.getUint32(at, true); at += 4; if (i > 0) h.update(b.subarray(at, at + len)); at += len; }
	out.fp_load = h.digest("hex").slice(0, 16);
}
console.log(JSON.stringify(out));
