// overview-bench - Times ways to capture a whole-station overview for the landing page (a live map / time-lapse), on the lobby snapshot.
// Usage (from web/, after npm run build): node --max-old-space-size=6000 tools/overview-bench.mjs [SNAP=build/snapshot-cache/world.snap.gz]
//        [--minutes N=20] [--every S=30] [--out DIR=build/overview] [--blasts]
// Starts a round as in view-bench.mjs, then every S game seconds captures the station z level four ways and times each:
//   tiles1: one colour a tile (turf + objects blended by their average colour), mobs as dots, darkened by the tile's light
//   delta:  the same, but only the tiles that changed since the last capture (bytes of the change list)
//   tiles4: 4x4 pixels a tile from the real sprites shrunk down (each sprite's 32x32 averaged to 4x4), mobs drawn the same way
//   dots:   just the living mobs on the z level (x, y, kind): what a live crew-dot layer every few seconds would cost
//   view:   what a real zoomed-out spectator costs: the game's own view update for an aghost seeing the whole z (ViewDiffer)
// Frames go to DIR as PNG (t1-NNN.png, t4-NNN.png) plus DIR/summary.json; the mockup plays them as a time-lapse.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { gunzipSync, deflateSync, gzipSync } from "node:zlib";
import { pathToFileURL, fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";
const argv = process.argv.slice(2);
const web = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
const snapFile = resolve(argv.find((a, i) => !a.startsWith("--") && !(i > 0 && argv[i - 1].startsWith("--"))) ?? web + "/build/snapshot-cache/world.snap.gz");
const MINUTES = Number(opt("--minutes", "20")), EVERY = Number(opt("--every", "30")), outDir = resolve(opt("--out", web + "/build/overview"));
mkdirSync(outDir, { recursive: true });

const S = pathToFileURL(web + "/build/dist/src/").href;
const { VM } = await import(S + "vm/interpreter.js");
const { ObjectTree } = await import(S + "vm/objtree.js");
const { gameProgram } = await import(S + "vm/typedefs.js");
const { Vfs } = await import(S + "vfs/vfs.js");
const { iconLoader, iconStatesReader } = await import(S + "dmi/dmi-node.js");
const { iconSizeReader } = await import(S + "tools/dmi-size.js");
const { loadSnapshot, resumeWorld } = await import(S + "vm/snapshot.js");
const { ViewDiffer } = await import(S + "worker/client-view.js");
const { DMObject, live } = await import(S + "vm/objects.js");
const { encodePng } = await import(S + "dmi/png.js");
const aids = await import(S + "worker/test-aids.js");
const root = resolve(web, "..");
await import(pathToFileURL(web + "/build/game-types.js").href);
const vm = new VM(new ObjectTree(gameProgram()));
const bundle = JSON.parse(readFileSync(web + "/build/vfs-bundle.json", "utf8"));
const cfg = bundle.files["config/config.txt"];
if (cfg) bundle.files["config/config.txt"] = cfg.replace(/^GUEST_BAN/m, "#GUEST_BAN");
vm.vfs = new Vfs(bundle);
vm.lenient = true; vm.debugInfo = true;
const loadIcon = iconLoader([root]);
vm.iconSize = iconSizeReader([root]); vm.loadIcon = loadIcon; vm.iconStates = iconStatesReader([root]);
await import(pathToFileURL(web + "/build/translated-tg.js").href);
(await import(S + "translate/runtime.js")).install(vm);
vm.onRuntimeError = () => {};
const r = loadSnapshot(vm, gunzipSync(readFileSync(snapFile)));
resumeWorld(vm, 1);
vm.clients.setSkin(readFileSync(root + "/interface/skin.dmf", "utf8"));
console.log(`snapshot ${snapFile}: ${r.objects} objects`);

const step = () => { const due = vm.nextDue(); vm.sched.skipTicks(due - vm.sched.tick - 1); vm.clients.runInput(); vm.runTick(); };
const mobOf = (c) => { const m = live(c.getVar("mob")); return m instanceof DMObject ? m : null; };
const v = (o, n) => (o.hasVar(n) ? live(o.getVar(n)) : null);
aids.holdLobby(vm);
const c = vm.clients.connect("LocalPlayer");
for (let i = 0; i < 20; i++) step();
aids.readyAtRoundStart(vm, c, "Assistant");
let n = 0;
while (mobOf(c)?.type.path.includes("new_player") && n++ < 3000) step();
const mob0 = mobOf(c);
const Z = vm.map.coords(mob0)[2], W = vm.map.maxx, H = vm.map.maxy;
console.log(`round started; station z ${Z}, ${W}x${H}`);

// ---- sprite colour caches: icon|state|dir -> average RGBA (tiles1) or a 4x4 RGBA block (tiles4)
const DIRS = [2, 1, 4, 8, 6, 10, 5, 9]; // dmi dir order: S N E W SE SW NE NW
const avgCache = new Map(), blk4Cache = new Map();
function cell(icon, state, dir) {
	const img = loadIcon(icon);
	if (!img) return null;
	const s = img.states.find((x) => x.name === state && !x.movement) ?? img.states.find((x) => x.name === state) ?? (state === "" ? null : null);
	if (!s) return null;
	const di = Math.max(0, DIRS.indexOf(dir));
	const px = s.px[di < s.dirs ? di : 0]?.[0];
	return px ? { px, w: img.width, h: img.height } : null;
}
function avgOf(icon, state, dir) {
	const k = `${icon}|${state}|${dir}`;
	let a = avgCache.get(k);
	if (a !== undefined) return a;
	a = null;
	const ce = cell(icon, state, dir);
	if (ce) {
		let R = 0, G = 0, B = 0, A = 0;
		for (let i = 0; i < ce.px.length; i += 4) { const al = ce.px[i + 3]; R += ce.px[i] * al; G += ce.px[i + 1] * al; B += ce.px[i + 2] * al; A += al; }
		if (A > 0) a = [R / A, G / A, B / A, A / (255 * (ce.px.length / 4))];
	}
	avgCache.set(k, a);
	return a;
}
function blk4Of(icon, state, dir) { // 32x32 -> 4x4 premultiplied average, as Float32Array(64) rgba (a 0..1)
	const k = `${icon}|${state}|${dir}`;
	let b = blk4Cache.get(k);
	if (b !== undefined) return b;
	b = null;
	const ce = cell(icon, state, dir);
	if (ce && ce.w === 32 && ce.h === 32) {
		b = new Float32Array(64);
		for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) {
			const i = (y * 32 + x) * 4, al = ce.px[i + 3] / 255, o = (((y >> 3) * 4 + (x >> 3)) * 4);
			b[o] += ce.px[i] * al; b[o + 1] += ce.px[i + 1] * al; b[o + 2] += ce.px[i + 2] * al; b[o + 3] += al;
		}
		for (let i = 0; i < 64; i += 4) { const al = b[i + 3]; if (al > 0) { b[i] /= al; b[i + 1] /= al; b[i + 2] /= al; } b[i + 3] = al / 64; }
	}
	blk4Cache.set(k, b);
	return b;
}
const hexRgb = (s) => { const m = /^#([0-9a-f]{6})/i.exec(s ?? ""); return m ? [parseInt(m[1].slice(0, 2), 16), parseInt(m[1].slice(2, 4), 16), parseInt(m[1].slice(4, 6), 16)] : null; };

// What a tile is made of: the atoms drawn, bottom to top, plus its light (0..1) and its mob dot.
const SKIP = /^\/(atom\/movable\/lighting_object|obj\/effect\/(landmark|spawner|light_emitter|mapping_helpers))/;
function tileParts(t) {
	const atoms = [t];
	for (const o of t.contents) {
		if (SKIP.test(o.type.path) || o.kind === 4 /* mob, drawn as a dot */) continue;
		if ((v(o, "invisibility") ?? 0) > 0) continue;
		atoms.push(o);
	}
	if (atoms.length > 2) atoms.sort((a, b) => (v(a, "plane") ?? 0) - (v(b, "plane") ?? 0) || (v(a, "layer") ?? 0) - (v(b, "layer") ?? 0));
	return atoms;
}
function lightOf(t) {
	if (t.type.path.startsWith("/turf/open/space")) return 1;
	const lo = live(v(t, "lighting_object"));
	if (!(lo instanceof DMObject)) return 1;
	const st = v(lo, "icon_state");
	if (st === "transparent") return 1;
	if (st === "dark") return 0;
	const m = v(lo, "color");
	if (!m?.items) return 1;
	const it = m.items; // 4 corner rows of r,g,b,0
	let s = 0; for (const i of [0, 1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 14]) s += Number(live(it[i])) || 0;
	return Math.min(1, s / 12);
}
// mob dot colour: player green, dead grey, crew-like humans light blue, silicon yellow, others red
function mobDot(t) {
	let best = null;
	for (const o of t.contents) {
		if (o.kind !== 4 || !o.type.path.startsWith("/mob/living")) continue;
		const dead = (v(o, "stat") ?? 0) === 2, p = o.type.path;
		const col = dead ? [120, 120, 120] : live(o.getVar("client")) ? [80, 255, 120] : p.startsWith("/mob/living/silicon") ? [255, 220, 60] : p.startsWith("/mob/living/carbon/human") ? [140, 200, 255] : [255, 80, 80];
		if (!best || !dead) best = col;
	}
	return best;
}
const LIGHT_FLOOR = 0.3; // dark tiles still show, just dimmed

const SPACE = [8, 10, 18]; // space is one flat dark colour: its noise texture only costs bytes
const isSpace = (t) => t.type.path.startsWith("/turf/open/space");
const iconPath = (a) => { const i = v(a, "icon"); return typeof i === "string" ? i : i?.path; };
const acc = new Float32Array(48);
/** paints tile (x, y) into the 1 px map (out1, W wide) and the 4 px map (out4, 4W wide); returns 1 if a mob dot was drawn */
function paintTile(x, y, out1, out4) {
	const t = vm.map.turfAt(x, y, Z);
	const o1 = ((H - y) * W + (x - 1)) * 4;
	if (!t) return 0;
	let R = 0, G = 0, B = 0;
	const parts = tileParts(t), space = isSpace(t);
	if (space) { [R, G, B] = SPACE; for (let j = 0; j < 48; j += 3) { acc[j] = SPACE[0]; acc[j + 1] = SPACE[1]; acc[j + 2] = SPACE[2]; } }
	else acc.fill(0);
	for (const a of parts) {
		if (space && a === t) continue;
		const ip = iconPath(a);
		if (!ip) continue;
		const st = v(a, "icon_state") ?? "", dir = v(a, "dir") ?? 2, tint = hexRgb(v(a, "color"));
		const av = avgOf(ip, st, dir);
		if (av) {
			let [r, g, b, al] = av;
			if (tint) { r = (r * tint[0]) / 255; g = (g * tint[1]) / 255; b = (b * tint[2]) / 255; }
			al = a === t ? 1 : Math.min(1, al * 1.6); // objects cover only part of a tile: boost so doors/tables read
			R = R * (1 - al) + r * al; G = G * (1 - al) + g * al; B = B * (1 - al) + b * al;
		}
		const bk = out4 && blk4Of(ip, st, dir);
		if (bk) for (let i = 0, j = 0; i < 64; i += 4, j += 3) {
			const al = bk[i + 3];
			if (!al) continue;
			let r = bk[i], g = bk[i + 1], bl = bk[i + 2];
			if (tint) { r = (r * tint[0]) / 255; g = (g * tint[1]) / 255; bl = (bl * tint[2]) / 255; }
			acc[j] = acc[j] * (1 - al) + r * al; acc[j + 1] = acc[j + 1] * (1 - al) + g * al; acc[j + 2] = acc[j + 2] * (1 - al) + bl * al;
		}
	}
	if (out4) for (const m of t.contents) { // mobs: their own sprite, shrunk the same way
		if (m.kind !== 4 || !m.type.path.startsWith("/mob/living")) continue;
		const ip = iconPath(m), b = ip && blk4Of(ip, v(m, "icon_state") ?? "", v(m, "dir") ?? 2);
		if (!b) continue;
		for (let i = 0, j = 0; i < 64; i += 4, j += 3) { const al = Math.min(1, b[i + 3] * 1.5); acc[j] = acc[j] * (1 - al) + b[i] * al; acc[j + 1] = acc[j + 1] * (1 - al) + b[i + 1] * al; acc[j + 2] = acc[j + 2] * (1 - al) + b[i + 2] * al; }
	}
	const L = LIGHT_FLOOR + (1 - LIGHT_FLOOR) * lightOf(t);
	const dot = mobDot(t);
	if (dot) [R, G, B] = dot; else { R *= L; G *= L; B *= L; }
	out1[o1] = R; out1[o1 + 1] = G; out1[o1 + 2] = B; out1[o1 + 3] = 255;
	if (out4) for (let py = 0; py < 4; py++) for (let px = 0; px < 4; px++) {
		const j = (py * 4 + px) * 3, o = (((H - y) * 4 + py) * W * 4 + (x - 1) * 4 + px) * 4;
		out4[o] = acc[j] * L; out4[o + 1] = acc[j + 1] * L; out4[o + 2] = acc[j + 2] * L; out4[o + 3] = 255;
	}
	return dot ? 1 : 0;
}
/** full: every tile of the z level, both maps */
function captureFull(with4 = true) {
	const out1 = new Uint8Array(W * H * 4), out4 = with4 ? new Uint8Array(W * H * 64) : null;
	let mobs = 0;
	for (let y = 1; y <= H; y++) for (let x = 1; x <= W; x++) mobs += paintTile(x, y, out1, out4);
	return { out1, out4, mobs };
}
// incremental: only the tiles the game marked as changed since the last capture (the same marks the view differ uses)
const { registerViewMarks } = await import(S + "vm/world.js");
const myMarks = new Set();
registerViewMarks(myMarks);
function captureMarked(out1, out4) {
	let n = 0;
	for (const t of myMarks) { const [x, y, z] = vm.map.coords(t); if (z === Z) { paintTile(x, y, out1, out4); n++; } }
	myMarks.clear();
	return n;
}
const png = (w, h, rgba) => encodePng(w, h, rgba, (d) => deflateSync(d, { level: 9 }));
const tm = (f) => { const t = performance.now(); const r = f(); return [r, performance.now() - t]; };

// view: an aghost seeing the whole z, as a real spectator page would (one ViewDiffer, full + per-capture update)
const spec = vm.clients.connect("Spectator");
for (let i = 0; i < 20; i++) step();
const specMob = mobOf(spec);
const ag = aids.aghost(vm, c) ? null : "aghost failed";
for (let i = 0; i < 10; i++) step();
const ghost = mobOf(c);
if (ag) console.log(ag);
vm.setField?.(ghost, "x", Math.floor(W / 2)); // not needed: the view box is the whole z when it's big enough
c.setVar("view", `${W * 2 + 1}x${H * 2 + 1}`);
const differ = new ViewDiffer({ dirty: true });
const [full, fullMs] = tm(() => differ.update(vm, true));
const fullBytes = gzipSync(JSON.stringify(full)).length;
console.log(`view: full update ${fullMs.toFixed(0)} ms, ${full.tiles.length} tiles, ${full.apps.length} appearances, ${(fullBytes / 1024).toFixed(0)} KB gzipped (spectator ${specMob?.type.path})`);

const rows = [];
const png6 = (w, h, rgba) => encodePng(w, h, rgba, (d) => deflateSync(d, { level: 6 }));
captureFull(); // warms the icon caches
const [warm, warmMs] = tm(() => captureFull());
console.log(`full capture after warm-up: ${warmMs.toFixed(0)} ms`);
let bx0 = W, bx1 = 0, by0 = H, by1 = 0; // the station's box (non-space tiles), in image rows (top = north)
for (let y = 1; y <= H; y++) for (let x = 1; x <= W; x++) { const t = vm.map.turfAt(x, y, Z); if (t && !isSpace(t)) { bx0 = Math.min(bx0, x - 1); bx1 = Math.max(bx1, x - 1); by0 = Math.min(by0, H - y); by1 = Math.max(by1, H - y); } }
myMarks.clear();
const inc1 = warm.out1.slice(), inc4 = warm.out4.slice();
let prev1 = warm.out1;
// --blasts: a few explosions so the time-lapse has something to show (a lone test player's round is quiet); frame index, tile, ranges
const BLASTS = argv.includes("--blasts") ? [{ at: 8, x: 140, y: 150, r: [2, 4, 8] }, { at: 20, x: 105, y: 110, r: [3, 6, 10] }, { at: 34, x: 170, y: 120, r: [2, 5, 9] }, { at: 46, x: 120, y: 175, r: [4, 7, 12] }] : [];
const ticksPerCapture = Math.round(EVERY * 20); // 20 ticks a second (tick_lag 0.5)
const frames = Math.floor((MINUTES * 60) / EVERY);
let tickMsSum = 0, tickN = 0, viewSince = [];
for (let f = 0; f < frames; f++) {
	const blast = BLASTS.find((b) => b.at === f);
	if (blast) { const t = vm.map.turfAt(blast.x, blast.y, Z); console.log(`blast at ${blast.x},${blast.y} (${t?.type.path})`); vm.callGlobal("explosion", [t, blast.r[0], blast.r[1], blast.r[2], blast.r[2]]); }
	for (let i = 0; i < ticksPerCapture; i++) {
		const t = performance.now(); step(); tickMsSum += performance.now() - t; tickN++;
		if (i % 20 === 0) { const [, ms] = tm(() => differ.update(vm)); viewSince.push(ms); }
	}
	const [dots, msDots] = tm(() => { const out = []; for (const m of vm.map.atomsOfKind(4)) { if (!m.type.path.startsWith("/mob/living")) continue; const t = vm.map.turfOf(m); if (!t) continue; const [x, y, z] = vm.map.coords(t); if (z === Z) out.push(x, y, (v(m, "stat") ?? 0) === 2 ? 1 : 0); } return out; });
	const [marked, msInc] = tm(() => captureMarked(inc1, inc4));
	const [, ms1] = tm(() => captureFull(false));
	const [full, msF] = tm(() => captureFull(true));
	let changed = 0, incWrong = 0;
	for (let i = 0; i < full.out1.length; i += 4) {
		if (full.out1[i] !== prev1[i] || full.out1[i + 1] !== prev1[i + 1] || full.out1[i + 2] !== prev1[i + 2]) changed++;
		if (full.out1[i] !== inc1[i] || full.out1[i + 1] !== inc1[i + 1] || full.out1[i + 2] !== inc1[i + 2]) incWrong++;
	}
	inc1.set(full.out1); inc4.set(full.out4); // keep the incremental copy honest for the next round of the comparison
	const [p1, msP1] = tm(() => png6(W, H, full.out1));
	const [p4, msP4] = tm(() => png6(W * 4, H * 4, full.out4));
	const [u, msV] = tm(() => differ.update(vm));
	const vBytes = gzipSync(JSON.stringify(u)).length;
	writeFileSync(`${outDir}/t1-${String(f).padStart(3, "0")}.png`, p1);
	writeFileSync(`${outDir}/t4-${String(f).padStart(3, "0")}.png`, p4);
	const row = { frame: f, gameMin: +(((f + 1) * EVERY) / 60).toFixed(1), tickAvg: +(tickMsSum / tickN).toFixed(2),
		dotsMs: +msDots.toFixed(2), dotsKB: +((dots.length * 2) / 1024).toFixed(2) /* 2 bytes each of x, y, kind */, full1ms: +ms1.toFixed(1), full4ms: +msF.toFixed(1), incMs: +msInc.toFixed(2), marked, incWrong, changed, deltaRawKB: +((changed * 7) / 1024).toFixed(1) /* x,y,rgb a changed tile, before gzip */, mobs: full.mobs,
		png1ms: +msP1.toFixed(1), png1KB: +(p1.length / 1024).toFixed(1), png4ms: +msP4.toFixed(1), png4KB: +(p4.length / 1024).toFixed(1),
		viewUpdMs: +msV.toFixed(1), viewUpdKB: +(vBytes / 1024).toFixed(1), viewEverySecMs: +(viewSince.reduce((s, x) => s + x, 0) / viewSince.length).toFixed(2) };
	rows.push(row); console.log(JSON.stringify(row));
	tickMsSum = 0; tickN = 0; viewSince = []; prev1 = full.out1;
}
const med = (k) => { const a = rows.map((r) => r[k]).sort((x, y) => x - y); return a[a.length >> 1]; };
const summary = { snap: snapFile, W, H, warmFullMs: +warmMs.toFixed(0), box: [bx0, by0, bx1, by1], frames, every: EVERY, view: { fullMs: +fullMs.toFixed(0), fullKB: +(fullBytes / 1024).toFixed(0), tiles: full.tiles.length, apps: full.apps.length },
	median: Object.fromEntries(["tickAvg", "dotsMs", "dotsKB", "full1ms", "full4ms", "incMs", "marked", "incWrong", "changed", "deltaRawKB", "mobs", "png1ms", "png1KB", "png4ms", "png4KB", "viewUpdMs", "viewUpdKB", "viewEverySecMs"].map((k) => [k, med(k)])), caches: { avg: avgCache.size, blk4: blk4Cache.size } };
writeFileSync(`${outDir}/summary.json`, JSON.stringify({ summary, rows }, null, 1));
console.log("\nSUMMARY " + JSON.stringify(summary));
