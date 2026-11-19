// tick-aids-tgui - the boot worker's tgui test aid (?tgui=TYPE, --tgui-set, --tgui-watch, hot2's fresh): opens one window, then logs what changes.
// Moved out of tick-aids.ts makeTickAids; its state lives in one TguiState object (T), shared by the four steps below.

import { DMList, DMObject, live } from "../vm/objects.js";
import { refOf } from "../vm/refs.js";
import { isTruthy, stringify } from "../vm/value.js";
import { holdLobby } from "./test-aids.js";
import type { TickAidsCtx } from "./tick-aids.js";

/** watchTgt: ps-harness (tools/topic-check.mjs), the --tgui atom's vars (opts.tguiWatch) logged when they change. smallIt: the signaler / destination tagger. freshOf: hot2, what --tgui opened and everything within 2 tiles of it (and on the player) at that moment. */
export function newTguiState() {
	return {
		giftAt: 0, stripTgt: null as DMObject | null, stripState: "", // the strip menu (?tgui=/mob/...): the player's held items and the target's worn items
		mobWatch: false, watchPos: [0, 0, 0], smallIt: null as DMObject | null, smallLog: "", fridgeTgt: null as DMObject | null, fridgeLog: "", fabTgt: null as DMObject | null, fabLog: "", watchTgt: null as DMObject | null, watchLog: "", watchRefs: "",
		freshOf: null as { arg: string; obj: DMObject; keep: Set<DMObject>; x: number; y: number; z: number } | null, freshNew: null as DMObject | null, freshN: 0,
		stackIt: null as DMObject | null, stackLog: "", stackAgainAt: 0, // a sheet stack: its amount and what stands on the player's turf
		buddyPda: null as DMObject | null, buddyNote: "", // a PDA: a second PDA with an owner, so the messenger has someone to message
	};
}
export type TguiState = ReturnType<typeof newTguiState>;

function freshArea(ctx: TickAidsCtx, f: { x: number; y: number; z: number }, mob: DMObject, each: (o: DMObject) => void) {
	const { vm } = ctx;
	const lists: unknown[] = [live(vm.getField(mob, "contents"))];
	for (let dx = -2; dx <= 2; dx++)
		for (let dy = -2; dy <= 2; dy++) {
			const t = vm.map.turfAt(f.x + dx, f.y + dy, f.z);
			if (t)
				lists.push(live(vm.getField(t, "contents")));
		}
	for (const cl of lists)
		if (cl instanceof DMList)
			for (const i of [...cl.items]) {
				const o = live(i as never);
				if (o instanceof DMObject)
					each(o);
			}
}

function freshMark(ctx: TickAidsCtx, T: TguiState, obj: DMObject, mob: DMObject, arg: string) {
	const { opts, vm } = ctx;
	if (!opts.hot)
		return;
	if (T.freshOf) {
		T.freshOf.obj = obj;
		return;
	}
	const c = obj.type.path.startsWith("/obj/item/") ? mob : obj, f = { arg, obj, keep: new Set<DMObject>(), x: Number(vm.getField(c, "x")), y: Number(vm.getField(c, "y")), z: Number(vm.getField(c, "z")) };
	freshArea(ctx, f, mob, (o) => f.keep.add(o));
	T.freshOf = f;
}

/** After the window opens: the gifts, the re-pick-up of a dropped stack, and one log line per watched thing each time it changes. */
export function tguiFollow(ctx: TickAidsCtx, T: TguiState) {
	const { opts, vm, log, firstC, players, post } = ctx;
	const { joinAt, ticks } = ctx;
	if (T.giftAt && ticks >= T.giftAt && T.stripTgt && T.stripTgt.type.path.includes("/carbon/")) {
		T.giftAt = 0;
		const ct = vm.tree.getType("/obj/item/weapon/crowbar"), pih = T.stripTgt.type.procs.get("put_in_hands");
		if (ct && pih) {
			const cb = vm.newObject(ct, [vm.getField(T.stripTgt, "loc")], T.stripTgt);
			const pr = vm.call(pih, [cb], T.stripTgt, T.stripTgt);
			log(`[vm-boot] tgui: gave the target a crowbar in hand (put_in_hands returned ${stringify(live(pr as never))}) for the Take click`);
		}
	}
	if (T.giftAt && ticks >= T.giftAt) {
		T.giftAt = 0;
		const gm = live(firstC()?.getVar("mob")), ht = vm.tree.getType("/obj/item/clothing/head/helmet"), pih = gm instanceof DMObject ? gm.type.procs.get("put_in_hands") : undefined;
		if (gm instanceof DMObject && ht && pih) {
			const hat = vm.newObject(ht, [vm.getField(gm, "loc")], gm);
			const pr = vm.call(pih, [hat], gm, gm);
			log(`[vm-boot] tgui: gave the player a helmet (a dog fashion item) to put on the dog: put_in_hands returned ${stringify(live(pr as never))}, it is now in ${stringify(live(vm.getField(hat, "loc")))}`);
		}
	}
	if (T.stripTgt) {
		const sm = live(firstC()?.getVar("mob")) as DMObject, hl = (o: DMObject) => { const h = live(o.getVar("held_items")); return h instanceof DMList ? h.items.map((i) => stringify(live(i as never))).join(", ") : "-"; }, g1 = (n: string) => { try {
			return stringify(live(T.stripTgt!.getVar(n)));
		}
		catch {
			return "-";
		} }, st = `player holds [${hl(sm)}]; target holds [${hl(T.stripTgt)}] back=${g1("back")} head=${g1("head")} mask=${g1("wear_mask")} suit=${g1("wear_suit")} shoes=${g1("shoes")} ears=${g1("ears")} dog head=${g1("inventory_head")} dog back=${g1("inventory_back")}`;
		if (st !== T.stripState) {
			T.stripState = st;
			log(`[vm-boot] tgui: strip: t${ticks} ${st}`);
		}
	}
	if (T.stackAgainAt && ticks >= T.stackAgainAt && T.stackIt) { T.stackAgainAt = 0; const sm = live(firstC()?.getVar("mob")) as DMObject; // the shuttle-arrival stun made the player drop it: pick it up again and reopen the window
		if (live(vm.getField(T.stackIt, "loc")) !== sm) { const pih = sm.type.procs.get("put_in_hands"); if (pih) vm.call(pih, [T.stackIt], sm, sm); }
		log(`[vm-boot] tgui: stack: reopening, in hand: ${live(vm.getField(T.stackIt, "loc")) === sm}`); vm.call(T.stackIt.type.procs.get("attack_self")!, [sm], T.stackIt, sm); }
	if (T.smallIt && ticks % 10 === 0) {
		const gv = (n: string) => { try {
			return stringify(live(T.smallIt!.getVar(n)));
		}
		catch {
			return "-";
		} }, ln = `freq ${gv("frequency")} code ${gv("code")} currTag ${gv("currTag")}`;
		if (ln !== T.smallLog) {
			T.smallLog = ln;
			log(`[vm-boot] tgui: small: t${ticks} ${ln}`);
		}
	}
	if (T.fridgeTgt && ticks % 10 === 0) {
		const tl = live(vm.getField(T.fridgeTgt, "loc")), floor = tl instanceof DMObject ? ((live(vm.getField(tl, "contents")) as DMList).items as unknown[]).map((i) => { const o = live(i as never); return o instanceof DMObject ? o.type.path : ""; }).filter((q) => q.startsWith("/obj/item")).length : -1, fl = vm.getField(T.fridgeTgt, "contents"), ln = `fridge holds ${(live(fl as never) as DMList).items.length} items; items on the floor under it ${floor}`;
		if (ln !== T.fridgeLog) {
			T.fridgeLog = ln;
			log(`[vm-boot] tgui: fridge: t${ticks} ${ln}`);
		}
	}
	if (T.fabTgt && ticks % 10 === 0) {
		const gv = (n: string) => { try {
			return stringify(live(T.fabTgt!.getVar(n)));
		}
		catch {
			return "-";
		} }, q = (() => { try {
			return live(T.fabTgt!.getVar("queue"));
		}
		catch {
			return null;
		} })(), mt = live(T.fabTgt.getVar("materials")), ml = mt instanceof DMObject ? live(mt.getVar("materials")) : null, ma = ml instanceof DMList ? ml.items.map((k) => { const m = live(ml.get(live(k as never)) as never); return m instanceof DMObject ? `${stringify(live(k as never))}=${stringify(live(m.getVar("amount")))}` : "?"; }).join(",") : "-", ln = `fab: screen ${gv("screen")} part_set ${gv("part_set")} queue ${q instanceof DMList ? q.items.length : 0} processing ${gv("processing_queue")} being_built ${live(T.fabTgt.getVar("being_built")) ? "yes" : "no"} busy ${gv("busy")} selected_category ${gv("selected_category")} materials ${ma}`;
		if (ln !== T.fabLog) {
			T.fabLog = ln;
			log(`[vm-boot] tgui: t${ticks} ${ln}`);
		}
	}
	if (T.mobWatch) { const m = live(firstC()?.getVar("mob")); if (m instanceof DMObject) T.watchTgt = m; } // ps-client test aid (--tgui @mob): the watch follows the player's own mob (lobby, then whatever it joins as)
	if (T.watchTgt && ticks % 5 === 0) tguiWatch(ctx, T, T.watchTgt);
	if (T.stackIt && ticks % 10 === 0) {
		const sm = live(firstC()?.getVar("mob")) as DMObject, tl = live(vm.getField(sm, "loc")), cs = tl instanceof DMObject ? ((live(vm.getField(tl, "contents")) as DMList).items as unknown[]).map((i) => { const o = live(i as never); return o instanceof DMObject ? o.type.path : ""; }).filter((p) => p.startsWith("/obj/structure") || p.startsWith("/obj/item/stack")).join(",") : "?";
		const ln = `amount ${stringify(live(T.stackIt.getVar("amount")))} deleted ${T.stackIt.deleted}; turf has: ${cs}`;
		if (ln !== T.stackLog) {
			T.stackLog = ln;
			log(`[vm-boot] tgui: stack: t${ticks} ${ln}`);
		}
	}
	if (T.buddyPda && ticks % 25 === 0) { const n = stringify(live(T.buddyPda.getVar("tnote"))); if (n !== T.buddyNote) { T.buddyNote = n; log(`[vm-boot] tgui: Test Buddy's PDA message log is now: ${n.replace(/\n/g, " ").slice(0, 300)}`); } }
}

/** ps-harness test aid (--tgui-watch a,b,c): the --tgui atom's named vars, the /obj/items on its tile and the four beside it, and the refs a hostile href would need; one line each time they change */
function tguiWatch(ctx: TickAidsCtx, T: TguiState, wt: DMObject) {
	const { opts, vm, log, firstC, players, post } = ctx;
	const { joinAt, ticks } = ctx;
	const tryGet = (o: DMObject, n: string): unknown => { try { let r: unknown = o; for (const k of n.split(".")) r = r instanceof DMObject ? live(r.getVar(k)) : null; return r === null ? undefined : r; } catch { return undefined; } }; // a.b.c walks vars (client.prefs.be_special) // undefined = no such var or null
	const sum = (v: unknown, d: number): string => {
		v = live(v as never);
		if (v instanceof DMList) { if (d > 2) return "list"; return "[" + v.items.slice(0, 90).map((k) => { const kk = live(k as never), val = kk instanceof DMObject || typeof kk === "string" ? live(v instanceof DMList ? v.get(kk) as never : null) : null; return val === null || val === undefined ? sum(kk, d + 1) : `${sum(kk, d + 1)}=${sum(val, d + 1)}`; }).join(",") + (v.items.length > 90 ? `,+${v.items.length - 90} more` : "") + "]"; } // the first 90 entries, and how many more there are
		if (v instanceof DMObject) {
			const ml = tryGet(v, "materials"), am = tryGet(v, "amount"), pn = tryGet(v, "product_name");
			if (v.type.path === "/datum/material_container" && ml instanceof DMList)
				return `container${sum(ml, d + 1)}`;
			if (am !== undefined)
				return `${v.type.path.split("/").pop()}${pn !== undefined ? `:${stringify(pn as never)}@${refOf(v)}` : ""}(amount=${stringify(am as never)})`;
			return v.type.path;
		}
		return stringify(v as never);
	};
	let at: DMObject = wt; for (let g = 0; g < 8 && !at.type.path.startsWith("/turf"); g++) { const up = live(vm.getField(at, "loc")); if (!(up instanceof DMObject)) break; at = up; } // an item in someone's hand has no turf of its own: the turf of whatever holds it
	const holder = wt.type.path.startsWith("/obj/item/") ? live(vm.getField(wt, "loc")) : null; // a held item: what the holder carries is listed with the floor
	if (typeof vm.getField(at, "x") === "number" && at.type.path.startsWith("/turf")) T.watchPos = [vm.getField(at, "x") as number, vm.getField(at, "y") as number, vm.getField(at, "z") as number]; // a used-up stack is deleted: keep the last place
	const [x, y, z] = T.watchPos, floor: Record<string, number> = {};
	const sentCount = (): number => { const ls = live(vm.globals[vm.tree.globalNames.indexOf("lastsignalers")]); return ls instanceof DMList ? ls.items.length : -1; }; // watch name "sent" (signaler scenario): signals sent so far = entries in the global lastsignalers log
	const shuttleState = (): string => { const ss = live(vm.globals[vm.tree.globalNames.indexOf("SSshuttle")]); const em = ss instanceof DMObject ? live(vm.getField(ss, "emergency")) : null; return em instanceof DMObject ? `${stringify(vm.getField(em, "mode") as never)}/${ss instanceof DMObject ? stringify(vm.getField(ss, "shuttle_purchased") as never) + "/" + stringify(vm.getField(ss, "points") as never) : "?"}` : "none"; }; // watch name "shuttle" (comms scenarios): the emergency shuttle's mode / whether a replacement was bought; "g:NAME" reads the global NAME
	const addItem = (i: unknown) => { const o = live(i as never); if (o instanceof DMObject && o.type.path.startsWith("/obj/item")) { const k = o.type.path + (tryGet(o, "amount") !== undefined ? `(amount=${stringify(tryGet(o, "amount") as never)})` : ""); floor[k] = (floor[k] ?? 0) + 1; } };
	if (holder instanceof DMObject && holder.type.path.startsWith("/mob/")) { const hc = live(vm.getField(holder, "contents")); if (hc instanceof DMList) for (const i of hc.items) addItem(i); }
	for (const [dx, dy] of [[0, 0], [0, -1], [0, 1], [-1, 0], [1, 0]]) { const t = vm.map.turfAt(x + dx, y + dy, z), cl = t ? live(vm.getField(t, "contents")) : null; if (cl instanceof DMList) for (const i of cl.items) addItem(i); }
	const ln = (opts.tguiWatch ?? "").split(",").filter(Boolean).map((n) => `${n}=${n === "sent" ? sentCount() : n.startsWith("g:") ? sum(live(vm.globals[vm.tree.globalNames.indexOf(n.slice(2))]) as never, 0) : n === "shuttle" ? shuttleState() : n === "type" ? wt.type.path : sum(tryGet(wt, n) ?? null, 0)}`).join("; ") + `; floor: ${Object.entries(floor).map(([k, n]) => `${k} x${n}`).join(", ") || "-"}`;
	if (ln !== T.watchLog) { T.watchLog = ln; log(`[vm-boot] tgui-watch: ${ln}`); }
	const uis: string[] = [], walk = (v: unknown, d: number) => { v = live(v as never); if (v instanceof DMList && d < 4)
		for (const k of v.items) {
			walk(k, d + 1);
			walk(v.get(live(k as never)) as never, d + 1);
		}
	else if (v instanceof DMObject && v.type.path === "/datum/tgui" && live(v.getVar("src_object")) === wt)
		uis.push(refOf(v)); };
	const tg = live(vm.globals[vm.tree.globalNames.indexOf("SStgui")]); if (tg instanceof DMObject) walk(tryGet(tg, "open_uis"), 0);
	const rl = `machine=${refOf(wt)} at=${x},${y},${z} uis=${uis.join(",")} mob=${refOf(live(firstC()?.getVar("mob")) as never)}`; if (rl !== T.watchRefs) { T.watchRefs = rl; log(`[vm-boot] tgui-refs: ${rl}`); }
}

/** hot2 test aid (server.mjs --hot; topic-check --again --fresh): delete the --tgui machine (or spawned item) and what it left within 2 tiles and on the player, then open a new one of its type in its place, so the next pass starts as a clean start would */
export function tguiFresh(ctx: TickAidsCtx, T: TguiState, ask: NonNullable<TickAidsCtx["freshAsk"]>) {
	const { opts, vm, log, firstC, players, post } = ctx;
	const { joinAt, ticks } = ctx;
	const id = ask.id, fo = T.freshOf, mob = live(firstC()?.getVar("mob")), qd = vm.tree.globalProcs.get("qdel");
	const other = !!fo && ask.tgui !== undefined && ask.tgui.split(":")[0] !== fo.arg.split(":")[0]; // another machine: that is a new station, not a fresh one
	const turf = fo ? live(vm.getField(fo.obj, "loc")) : null, isItem = !!fo && fo.obj.type.path.startsWith("/obj/item/");
	if (!fo || other || !qd || !(mob instanceof DMObject) || opts.tgui || (!isItem && !(turf instanceof DMObject && turf.type.path.startsWith("/turf"))))
		post({ type: "hotResult", id, ok: false, lines: [!fo ? "nothing to make fresh: no --tgui machine or spawned item is open (a /mob target and the player's own PDA are not remade)" : other ? `this station opened ${fo.arg.split(":")[0]}, not ${ask.tgui!.split(":")[0]}: that needs a new start` : opts.tgui ? "the last one is still being opened" : "the machine is not on a turf (or no player, or no qdel)"] });
	else {
		let gone = 0;
		vm.call(qd, [fo.obj]);
		freshArea(ctx, fo, mob, (o) => { if (o !== fo.obj && !o.deleted && !fo.keep.has(o) && /^\/obj\/(item|structure|machinery)\//.test(o.type.path)) { vm.call(qd, [o]); gone++; } });
		if (!isItem) T.freshNew = vm.newObject(fo.obj.type, [turf as DMObject], mob);
		T.watchTgt = T.fridgeTgt = T.fabTgt = T.stackIt = T.smallIt = null; T.watchLog = T.watchRefs = T.fridgeLog = T.fabLog = T.stackLog = T.smallLog = ""; T.stackAgainAt = 0;
		if (ask.tgui !== undefined) { fo.arg = ask.tgui; opts.tguiSet = ask.tguiSet; if (ask.tguiWatch) opts.tguiWatch = ask.tguiWatch; }
		for (const p of players) { const c = p?.client; if (c instanceof DMObject) c.setVar("topiclimiter", null); } // the game's own "too many actions in a minute" count starts again too
		opts.tgui = fo.arg; T.freshN++;
		const ln = `fresh ${fo.arg}${opts.tguiSet ? ` (set ${opts.tguiSet})` : ""} (number ${T.freshN}): the old one and ${gone} thing(s) left around it deleted`;
		log(`[vm-boot] tgui: ${ln} (world.time ${vm.sched.time})`); post({ type: "hotResult", id, ok: true, lines: [ln] });
	}
}

/** ui2 test aid: ?tgui=/obj/machinery/disposal/bin stands the player next to the first such atom and opens its tgui window (ui_interact) */
export function tguiOpen(ctx: TickAidsCtx, T: TguiState) {
	const { opts, vm, log, firstC, players, post } = ctx;
	const { joinAt, ticks } = ctx;
	if (opts.tgui === "@mob") { opts.tgui = undefined; T.mobWatch = true; holdLobby(vm); log(`[vm-boot] tgui: watching the player's own mob (lobby countdown held)`); }
	if (opts.tgui && ticks > joinAt + 100) { // ui2 test aid: ?tgui=/obj/machinery/disposal/bin stands the player next to the first such atom and opens its tgui window (ui_interact)
		const mob = live(firstC()?.getVar("mob")), tguiArg = opts.tgui.split(":"), want = tguiArg[0], wantAmount = Number(tguiArg[1] ?? 50), alive = mob instanceof DMObject && !mob.type.path.startsWith("/mob/dead");
		if (alive && want.startsWith("/obj/item/")) { opts.tgui = undefined; // an item (e.g. /obj/item/device/pda): the player's own (or a subtype's), else the first on the map, and its attack_self
			let it: DMObject | null = null;
			for (const a of vm.map.atoms) if (!a.deleted && (a.type.path === want || a.type.path.startsWith(want + "/")) && live(vm.getField(a, "loc")) === mob) { it = a; break; }
			if (!it) for (const a of vm.map.atoms) if (!a.deleted && (a.type.path === want || a.type.path.startsWith(want + "/"))) { it = a; break; }
			const spawnIt = want.startsWith("/obj/item/stack/") || want.startsWith("/obj/item/device/assembly/signaler") || want.startsWith("/obj/item/device/destTagger") || want.startsWith("/obj/item/device/pda/"); // spawned into the player's hand: stacks, a signaler, a destination tagger, a PDA subtype (the plain pda is the player's own)
			if (spawnIt && (!it || live(vm.getField(it, "loc")) !== mob)) { it = null; // a stack (?tgui=/obj/item/stack/sheet/metal:3 = 3 sheets): spawn it into the player's hand
				const st = vm.tree.getType(want), pih = mob.type.procs.get("put_in_hands"); // the player starts seated in a shuttle chair (one_per_turf recipes would refuse): step to a bare adjacent floor first
				const mc = live(vm.getField(mob, "loc")) as DMObject, mx = Number(vm.getField(mc, "x")), my = Number(vm.getField(mc, "y")), mz = Number(vm.getField(mc, "z"));
				if (!T.freshN)
					for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0], [0, -2], [0, 2], [-2, 0], [2, 0]]) {
						const t = vm.map.turfAt(mx + dx, my + dy, mz);
						if (!t || vm.getField(t, "density"))
							continue;
						const co = ((live(vm.getField(t, "contents")) as DMList).items as unknown[]).map((i) => { const o = live(i as never); return o instanceof DMObject ? o.type.path : ""; });
						if (co.some((q) => q.startsWith("/obj/structure") || q.startsWith("/obj/machinery") || q.startsWith("/mob/")))
							continue;
						vm.setField(mob, "buckled", null);
						vm.setField(mob, "loc", t);
						break;
					}
				const here = vm.getField(mob, "loc");
				if (st && here) {
					it = vm.newObject(st, want.startsWith("/obj/item/stack/") ? [here, wantAmount] : [here], mob);
					if (pih)
						vm.call(pih, [it], mob, mob);
					if (!want.startsWith("/obj/item/stack/"))
						T.smallIt = it;
					log(`[vm-boot] tgui: none on the map, spawned ${want} x${wantAmount} (in hand: ${live(vm.getField(mob, "held_items")) !== null})`);
				}
			}
			if (!it) log(`[vm-boot] tgui: no ${want} on this map`);
			else {
				log(`[vm-boot] tgui: attack_self of ${it.type.path} (carried by the player: ${live(vm.getField(it, "loc")) === mob})`);
				if (want === "/obj/item/device/pda") {
					const bt = vm.tree.getType("/obj/item/device/pda/medical"), here = vm.getField(mob, "loc");
					if (bt && here) {
						T.buddyPda = vm.newObject(bt, [here], mob);
						vm.setField(T.buddyPda, "owner", "Test Buddy");
						vm.setField(T.buddyPda, "ownjob", "Test Job");
						vm.call(T.buddyPda.type.procs.get("update_label")!, [], T.buddyPda, mob);
						log(`[vm-boot] tgui: a second PDA owned by Test Buddy is on the floor next to the player`);
					}
				}
				if (opts.tguiWatch) T.watchTgt = it;
				if (spawnIt) { T.stackIt = it; T.stackAgainAt = T.freshN ? 0 : ticks + 250; freshMark(ctx, T, it, mob, tguiArg.join(":")); }
				vm.call(it.type.procs.get("attack_self")!, [mob], it, mob);
			}
		} else if (alive) { opts.tgui = undefined;
			let tgt: DMObject | null = T.freshNew; T.freshNew = null; // the one made fresh, when there is one
			const sil0 = mob.type.path.startsWith("/mob/living/silicon"), cn0 = live(vm.globals[vm.tree.root.globalVars.get("GLOB")!]) as DMObject, ci0 = cn0.type.globalVars.get("cameranet"), cam0 = ci0 === undefined ? null : live(vm.globals[ci0]) as DMObject | null;
			if (!tgt) for (const a of vm.map.atoms) if (!a.deleted && a.type.path === want) { // an AI/cyborg needs one the camera network sees (tgui default state: get_dist or cameranet.checkTurfVis), as in play
				if (!tgt) tgt = a;
				if (!sil0 || !cam0) break;
				const tu = vm.map.turfAt(vm.getField(a, "x") as number, vm.getField(a, "y") as number, vm.getField(a, "z") as number);
				if (tu && isTruthy(live(vm.call(cam0.type.procs.get("checkTurfVis")!, [tu], cam0, mob) as never))) { tgt = a; break; }
			}
			if (!tgt && want.startsWith("/mob/")) { const mt = vm.tree.getType(want), here = vm.getField(mob, "loc"); if (mt && here) { tgt = vm.newObject(mt, [here], mob); log(`[vm-boot] tgui: none on the map, spawned a ${want} at the player's feet (test aid)`); } } // none on the map: spawn one next to the player
			if (!tgt && want === "/obj/machinery/smartfridge/drying_rack") { // ps-smartfridge: the Box map has no drying rack; build one on a bare floor tile beside the player
				const mt = vm.tree.getType(want), mc = live(vm.getField(mob, "loc")) as DMObject, mx = Number(vm.getField(mc, "x")), my = Number(vm.getField(mc, "y")), mz = Number(vm.getField(mc, "z"));
				for (const [dx, dy] of [[0, -2], [0, 2], [-2, 0], [2, 0], [-2, -2], [2, 2]]) {
					const t = vm.map.turfAt(mx + dx, my + dy, mz);
					if (mt && t && !vm.getField(t, "density")) {
						tgt = vm.newObject(mt, [t], mob);
						log(`[vm-boot] tgui: none on the map, built a ${want} at ${mx + dx},${my + dy},${mz}`);
						break;
					}
				}
			}
			if (!tgt) log(`[vm-boot] tgui: no ${want} on this map`);
			else {
				const cx = vm.getField(tgt, "x") as number, cy = vm.getField(tgt, "y") as number, cz = vm.getField(tgt, "z") as number;
				const silicon = mob.type.path.startsWith("/mob/living/silicon"); // an AI/cyborg is not walked next to the machine: it uses attack_ai
				if (!silicon) {
					const ch = live(mob.getVar("buckled"));
					if (ch instanceof DMObject) vm.call(ch.type.procs.get("unbuckle_mob")!, [mob, 1], ch, mob);
					for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) { const t = vm.map.turfAt(cx + dx, cy + dy, cz); if (t && !vm.getField(t, "density")) { vm.setField(mob, "loc", t); break; } }
				}
				if (!T.freshN) { const tk = live(vm.globals[vm.tree.globalNames.indexOf("SSticker")]); if (tk instanceof DMObject) tk.setVar("round_start_time", (tk.getVar("round_start_time") as number) - 12000); } // so the emergency shuttle's refuel delay (20 min after round start) doesn't refuse a call made from the window
				if (want.startsWith("/mob/")) T.stripTgt = tgt;
				if (want.startsWith("/obj/machinery/smartfridge")) T.fridgeTgt = tgt;
				if (opts.tguiWatch) T.watchTgt = tgt;
				if (!want.startsWith("/mob/")) freshMark(ctx, T, tgt, mob, tguiArg.join(":"));
				for (const kv of (opts.tguiSet ?? "").split(",").filter(Boolean)) { const [k, v] = kv.split("="); const fa = v.startsWith("@first:") ? [...vm.map.atoms].find((a) => !a.deleted && a.type.path.startsWith(v.slice(7))) : undefined; vm.setField(tgt, k, fa ?? (/^-?\d+(\.\d+)?$/.test(v) ? Number(v) : v)); } // test aid (--tgui-set var=value,..): e.g. disabled=1, extended_inventory=1; @first:TYPE = the first such atom on the map (strip: machine=@first:/obj/structure/table)
				if (want === "/obj/machinery/mecha_part_fabricator" || want === "/obj/machinery/autolathe") { T.fabTgt = tgt; const mc = live(tgt.getVar("materials")), ml = mc instanceof DMObject ? live(mc.getVar("materials")) : null; if (ml instanceof DMList) for (const k of ml.items) { const m = live(ml.get(live(k as never)) as never); if (m instanceof DMObject && stringify(live(k as never)) === "$metal") vm.setField(m, "amount", tguiArg[1] ? wantAmount : 30000); } } // test aid: 30000 metal so Build / Remove are enabled (the autolathe too)
				if (want.includes("/corgi/") || want.includes("/carbon/")) T.giftAt = ticks + 200; // test aid: something the corgi's Equip can take, handed over a little after the window opens
				log(`[vm-boot] tgui: opening ${want} at ${cx},${cy},${cz} for ${mob.type.path}${silicon ? " (attack_ai)" : ""}`);
				const rv = vm.call(tgt.type.procs.get(silicon ? "attack_ai" : want.startsWith("/obj/machinery/modular_computer") ? "attack_hand" : "ui_interact")!, [mob], tgt, mob);
				if (silicon) { const sh = mob.type.procs.get("shared_ui_interaction"), dc = mob.type.procs.get("default_can_use_topic"); log(`[vm-boot] tgui: attack_ai returned ${stringify(live(rv as never))}, stat ${stringify(live(mob.getVar("stat")))}, client ${mob.getVar("client") ? "yes" : "no"}, shared_ui_interaction ${sh ? stringify(live(vm.call(sh, [tgt], mob, mob) as never)) : "?"}, default_can_use_topic ${dc ? stringify(live(vm.call(dc, [tgt], mob, mob) as never)) : "?"} (2 interactive, 1 update, 0 disabled, -1 close)`);
					const gp = vm.tree.globalProcs.get("get_turf_pixel"), cn = live(vm.globals[vm.tree.root.globalVars.get("GLOB")!]) as DMObject, ci = cn.type.globalVars.get("cameranet"), cam = ci === undefined ? null : live(vm.globals[ci]) as DMObject | null;
					const tp = gp ? live(vm.call(gp, [tgt]) as never) : null, tt = vm.map.turfAt(cx, cy, cz);
					const vis = (t: unknown) => (cam && t instanceof DMObject ? stringify(live(vm.call(cam.type.procs.get("checkTurfVis")!, [t], cam, mob) as never)) : "?");
					log(`[vm-boot] tgui: turf_pixel ${tp instanceof DMObject ? `${tp.type.path} ${vm.getField(tp, "x")},${vm.getField(tp, "y")},${vm.getField(tp, "z")}` : "none"} vis ${vis(tp)}; own turf vis ${vis(tt)}; AI eye at ${(() => { const e = live(mob.getVar("eyeobj")); return e instanceof DMObject ? `${vm.getField(e, "x")},${vm.getField(e, "y")}` : "none"; })()}; cameras ${cam ? stringify(live(cam.getVar("cameras")) instanceof DMList ? (live(cam.getVar("cameras")) as DMList).items.length : "?") : "no cameranet"}`); }
			}
		}
	}
}
