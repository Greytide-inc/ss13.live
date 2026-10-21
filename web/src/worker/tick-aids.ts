// tick-aids - the per-tick test aids of the boot worker (?ride=1, ?lie=1, ?tgui=..., ?setup=... and friends), moved out of run().
// makeTickAids(ctx) holds the aids' own state; step() runs them once per tick, after the player has joined.

import type { VM } from "../vm/interpreter.js";
import { DMList, DMObject, live } from "../vm/objects.js";
import { refOf } from "../vm/refs.js";
import { isTruthy, stringify, type Value } from "../vm/value.js";
import { holdLobby } from "./test-aids.js";
import type { StartMsg } from "./boot-worker.js";

/** What run() shares with the aids. The getters read run()'s live variables; freshAsk is also written. */
export interface TickAidsCtx {
	opts: StartMsg;
	vm: VM;
	log: (line: string) => void;
	post: (m: unknown) => void;
	firstC: () => DMObject;
	players: { client: unknown }[];
	readonly joinAt: number;
	readonly ticks: number;
	freshAsk: { id: string; tgui?: string; tguiSet?: string; tguiWatch?: string } | null;
}

export function makeTickAids(ctx: TickAidsCtx) {
	const { opts, vm, log, firstC, players, post } = ctx;
				let giftAt = 0, giftItem: DMObject | null = null, stripTgt: DMObject | null = null, stripState = ""; // tgui aid for the strip menu (?tgui=/mob/...): the player's held items and the target's worn items, logged when they change
				let mobWatch = false, watchPos = [0, 0, 0], smallIt: DMObject | null = null, smallLog = "", fridgeTgt: DMObject | null = null, fridgeLog = "", fabTgt: DMObject | null = null, fabLog = "", watchTgt: DMObject | null = null, watchLog = "", watchRefs = ""; // watchTgt: ps-harness (tools/topic-check.mjs), the --tgui atom's vars (opts.tguiWatch) logged when they change // tgui aid for the signaler / destination tagger / smartfridge: frequency, code, tag, fridge contents, logged when they change
				let freshOf = null as { arg: string; obj: DMObject; keep: Set<DMObject>; x: number; y: number; z: number } | null, freshNew: DMObject | null = null, freshN = 0; // hot2 test aid: what --tgui opened, and everything that stood within 2 tiles of it (and on the player) at that moment
				const freshArea = (f: {
					x: number;
					y: number;
					z: number;
				}, mob: DMObject, each: (o: DMObject) => void) => { const lists: unknown[] = [live(vm.getField(mob, "contents"))]; for (let dx = -2; dx <= 2; dx++)
					for (let dy = -2; dy <= 2; dy++) {
						const t = vm.map.turfAt(f.x + dx, f.y + dy, f.z);
						if (t)
							lists.push(live(vm.getField(t, "contents")));
					} for (const cl of lists)
					if (cl instanceof DMList)
						for (const i of [...cl.items]) {
							const o = live(i as never);
							if (o instanceof DMObject)
								each(o);
						} };
				const freshMark = (obj: DMObject, mob: DMObject, arg: string) => { if (!opts.hot)
					return; if (freshOf) {
					freshOf.obj = obj;
					return;
				} const c = obj.type.path.startsWith("/obj/item/") ? mob : obj, f = { arg, obj, keep: new Set<DMObject>(), x: Number(vm.getField(c, "x")), y: Number(vm.getField(c, "y")), z: Number(vm.getField(c, "z")) }; freshArea(f, mob, (o) => f.keep.add(o)); freshOf = f; };
				let stackIt: DMObject | null = null, stackLog = "", stackAgainAt = 0; // tgui aid for a sheet stack: its amount and what stands on the player's turf, logged when it changes
				let buddyPda: DMObject | null = null, buddyNote = ""; // tgui aid for a PDA: a second PDA with an owner, so the messenger has someone to message; its message log is logged when it changes
				let rideDone = false, crewStep = 0, crewAt = -1, crewCon: DMObject | null = null, shootAt = -1, shootN = 0, shakeN = 0, shakeT0 = -1, shootCase: DMObject | null = null, lieDone = false, gotoDone = false, setupDone = false;
	return { step() {
		const { joinAt, ticks } = ctx;
				if (opts.ride && !rideDone && ticks > joinAt + 100) { // de1 test aid: ?ride=1 puts the player's mob into the first disposal bin and flushes it (a disposal ride for the view-follows-the-pipes check)
					const mob = live(firstC()?.getVar("mob"));
					if (mob instanceof DMObject) {
						rideDone = true;
						let bin: DMObject | null = null;
						for (const a of vm.map.atoms) if (!a.deleted && a.type.path === "/obj/machinery/disposal/bin") { bin = a; break; }
						if (bin) {
							const ch = live(mob.getVar("buckled"));
							if (ch instanceof DMObject) vm.call(ch.type.procs.get("unbuckle_mob")!, [mob, 1], ch, mob);
							vm.setField(mob, "loc", bin);
							vm.call(bin.type.procs.get("flush")!, [], bin, mob);
							log(`[vm-boot] ride: mob put in the disposal bin at ${vm.getField(bin, "x")},${vm.getField(bin, "y")},${vm.getField(bin, "z")} and flushed, world.time ${vm.sched.time}`);
						} else log("[vm-boot] ride: no disposal bin on this map");
					}
				}
				if (giftAt && ticks >= giftAt && stripTgt && stripTgt.type.path.includes("/carbon/")) {
					giftAt = 0;
					const ct = vm.tree.getType("/obj/item/weapon/crowbar"), pih = stripTgt.type.procs.get("put_in_hands");
					if (ct && pih) {
						const cb = vm.newObject(ct, [vm.getField(stripTgt, "loc")], stripTgt);
						const pr = vm.call(pih, [cb], stripTgt, stripTgt);
						log(`[vm-boot] tgui: gave the target a crowbar in hand (put_in_hands returned ${stringify(live(pr as never))}) for the Take click`);
					}
				}
				if (giftAt && ticks >= giftAt) {
					giftAt = 0;
					const gm = live(firstC()?.getVar("mob")), ht = vm.tree.getType("/obj/item/clothing/head/helmet"), pih = gm instanceof DMObject ? gm.type.procs.get("put_in_hands") : undefined;
					if (gm instanceof DMObject && ht && pih) {
						const hat = giftItem = vm.newObject(ht, [vm.getField(gm, "loc")], gm);
						const pr = vm.call(pih, [hat], gm, gm);
						log(`[vm-boot] tgui: gave the player a helmet (a dog fashion item) to put on the dog: put_in_hands returned ${stringify(live(pr as never))}, it is now in ${stringify(live(vm.getField(hat, "loc")))}`);
					}
				}
				if (stripTgt) {
					const sm = live(firstC()?.getVar("mob")) as DMObject, hl = (o: DMObject) => { const h = live(o.getVar("held_items")); return h instanceof DMList ? h.items.map((i) => stringify(live(i as never))).join(", ") : "-"; }, g1 = (n: string) => { try {
						return stringify(live(stripTgt!.getVar(n)));
					}
					catch {
						return "-";
					} }, st = `player holds [${hl(sm)}]; target holds [${hl(stripTgt)}] back=${g1("back")} head=${g1("head")} mask=${g1("wear_mask")} suit=${g1("wear_suit")} shoes=${g1("shoes")} ears=${g1("ears")} dog head=${g1("inventory_head")} dog back=${g1("inventory_back")}`;
					if (st !== stripState) {
						stripState = st;
						log(`[vm-boot] tgui: strip: t${ticks} ${st}`);
					}
				}
				if (stackAgainAt && ticks >= stackAgainAt && stackIt) { stackAgainAt = 0; const sm = live(firstC()?.getVar("mob")) as DMObject; // the shuttle-arrival stun made the player drop it: pick it up again and reopen the window
					if (live(vm.getField(stackIt, "loc")) !== sm) { const pih = sm.type.procs.get("put_in_hands"); if (pih) vm.call(pih, [stackIt], sm, sm); }
					log(`[vm-boot] tgui: stack: reopening, in hand: ${live(vm.getField(stackIt, "loc")) === sm}`); vm.call(stackIt.type.procs.get("attack_self")!, [sm], stackIt, sm); }
				if (smallIt && ticks % 10 === 0) {
					const gv = (n: string) => { try {
						return stringify(live(smallIt!.getVar(n)));
					}
					catch {
						return "-";
					} }, ln = `freq ${gv("frequency")} code ${gv("code")} currTag ${gv("currTag")}`;
					if (ln !== smallLog) {
						smallLog = ln;
						log(`[vm-boot] tgui: small: t${ticks} ${ln}`);
					}
				}
				if (fridgeTgt && ticks % 10 === 0) {
					const tl = live(vm.getField(fridgeTgt, "loc")), floor = tl instanceof DMObject ? ((live(vm.getField(tl, "contents")) as DMList).items as unknown[]).map((i) => { const o = live(i as never); return o instanceof DMObject ? o.type.path : ""; }).filter((q) => q.startsWith("/obj/item")).length : -1, fl = vm.getField(fridgeTgt, "contents"), ln = `fridge holds ${(live(fl as never) as DMList).items.length} items; items on the floor under it ${floor}`;
					if (ln !== fridgeLog) {
						fridgeLog = ln;
						log(`[vm-boot] tgui: fridge: t${ticks} ${ln}`);
					}
				}
				if (fabTgt && ticks % 10 === 0) {
					const gv = (n: string) => { try {
						return stringify(live(fabTgt!.getVar(n)));
					}
					catch {
						return "-";
					} }, q = (() => { try {
						return live(fabTgt!.getVar("queue"));
					}
					catch {
						return null;
					} })(), mt = live(fabTgt.getVar("materials")), ml = mt instanceof DMObject ? live(mt.getVar("materials")) : null, ma = ml instanceof DMList ? ml.items.map((k) => { const m = live(ml.get(live(k as never)) as never); return m instanceof DMObject ? `${stringify(live(k as never))}=${stringify(live(m.getVar("amount")))}` : "?"; }).join(",") : "-", ln = `fab: screen ${gv("screen")} part_set ${gv("part_set")} queue ${q instanceof DMList ? q.items.length : 0} processing ${gv("processing_queue")} being_built ${live(fabTgt.getVar("being_built")) ? "yes" : "no"} busy ${gv("busy")} selected_category ${gv("selected_category")} materials ${ma}`;
					if (ln !== fabLog) {
						fabLog = ln;
						log(`[vm-boot] tgui: t${ticks} ${ln}`);
					}
				}
				if (mobWatch) { const m = live(firstC()?.getVar("mob")); if (m instanceof DMObject) watchTgt = m; } // ps-client test aid (--tgui @mob): the watch follows the player's own mob (lobby, then whatever it joins as)
				if (watchTgt && ticks % 5 === 0) { // ps-harness test aid (--tgui-watch a,b,c): the --tgui atom's named vars, the /obj/items on its tile and the four beside it, and the refs a hostile href would need; one line each time they change
					const wt = watchTgt, tryGet = (o: DMObject, n: string): unknown => { try { let r: unknown = o; for (const k of n.split(".")) r = r instanceof DMObject ? live(r.getVar(k)) : null; return r === null ? undefined : r; } catch { return undefined; } }; // a.b.c walks vars (client.prefs.be_special) // undefined = no such var or null
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
					if (typeof vm.getField(at, "x") === "number" && at.type.path.startsWith("/turf")) watchPos = [vm.getField(at, "x") as number, vm.getField(at, "y") as number, vm.getField(at, "z") as number]; // a used-up stack is deleted: keep the last place
					const [x, y, z] = watchPos, floor: Record<string, number> = {};
					const sentCount = (): number => { const ls = live(vm.globals[vm.tree.globalNames.indexOf("lastsignalers")]); return ls instanceof DMList ? ls.items.length : -1; }; // watch name "sent" (signaler scenario): signals sent so far = entries in the global lastsignalers log
					const shuttleState = (): string => { const ss = live(vm.globals[vm.tree.globalNames.indexOf("SSshuttle")]); const em = ss instanceof DMObject ? live(vm.getField(ss, "emergency")) : null; return em instanceof DMObject ? `${stringify(vm.getField(em, "mode") as never)}/${ss instanceof DMObject ? stringify(vm.getField(ss, "shuttle_purchased") as never) + "/" + stringify(vm.getField(ss, "points") as never) : "?"}` : "none"; }; // watch name "shuttle" (comms scenarios): the emergency shuttle's mode / whether a replacement was bought; "g:NAME" reads the global NAME
					const addItem = (i: unknown) => { const o = live(i as never); if (o instanceof DMObject && o.type.path.startsWith("/obj/item")) { const k = o.type.path + (tryGet(o, "amount") !== undefined ? `(amount=${stringify(tryGet(o, "amount") as never)})` : ""); floor[k] = (floor[k] ?? 0) + 1; } };
					if (holder instanceof DMObject && holder.type.path.startsWith("/mob/")) { const hc = live(vm.getField(holder, "contents")); if (hc instanceof DMList) for (const i of hc.items) addItem(i); }
					for (const [dx, dy] of [[0, 0], [0, -1], [0, 1], [-1, 0], [1, 0]]) { const t = vm.map.turfAt(x + dx, y + dy, z), cl = t ? live(vm.getField(t, "contents")) : null; if (cl instanceof DMList) for (const i of cl.items) addItem(i); }
					const ln = (opts.tguiWatch ?? "").split(",").filter(Boolean).map((n) => `${n}=${n === "sent" ? sentCount() : n.startsWith("g:") ? sum(live(vm.globals[vm.tree.globalNames.indexOf(n.slice(2))]) as never, 0) : n === "shuttle" ? shuttleState() : n === "type" ? wt.type.path : sum(tryGet(wt, n) ?? null, 0)}`).join("; ") + `; floor: ${Object.entries(floor).map(([k, n]) => `${k} x${n}`).join(", ") || "-"}`;
					if (ln !== watchLog) { watchLog = ln; log(`[vm-boot] tgui-watch: ${ln}`); }
					const uis: string[] = [], walk = (v: unknown, d: number) => { v = live(v as never); if (v instanceof DMList && d < 4)
						for (const k of v.items) {
							walk(k, d + 1);
							walk(v.get(live(k as never)) as never, d + 1);
						}
					else if (v instanceof DMObject && v.type.path === "/datum/tgui" && live(v.getVar("src_object")) === wt)
						uis.push(refOf(v)); };
					const tg = live(vm.globals[vm.tree.globalNames.indexOf("SStgui")]); if (tg instanceof DMObject) walk(tryGet(tg, "open_uis"), 0);
					const rl = `machine=${refOf(wt)} at=${x},${y},${z} uis=${uis.join(",")} mob=${refOf(live(firstC()?.getVar("mob")) as never)}`; if (rl !== watchRefs) { watchRefs = rl; log(`[vm-boot] tgui-refs: ${rl}`); }
				}
				if (stackIt && ticks % 10 === 0) {
					const sm = live(firstC()?.getVar("mob")) as DMObject, tl = live(vm.getField(sm, "loc")), cs = tl instanceof DMObject ? ((live(vm.getField(tl, "contents")) as DMList).items as unknown[]).map((i) => { const o = live(i as never); return o instanceof DMObject ? o.type.path : ""; }).filter((p) => p.startsWith("/obj/structure") || p.startsWith("/obj/item/stack")).join(",") : "?";
					const ln = `amount ${stringify(live(stackIt.getVar("amount")))} deleted ${stackIt.deleted}; turf has: ${cs}`;
					if (ln !== stackLog) {
						stackLog = ln;
						log(`[vm-boot] tgui: stack: t${ticks} ${ln}`);
					}
				}
				if (buddyPda && ticks % 25 === 0) { const n = stringify(live(buddyPda.getVar("tnote"))); if (n !== buddyNote) { buddyNote = n; log(`[vm-boot] tgui: Test Buddy's PDA message log is now: ${n.replace(/\n/g, " ").slice(0, 300)}`); } }
				if (ctx.freshAsk !== null) { // hot2 test aid (server.mjs --hot; topic-check --again --fresh): delete the --tgui machine (or spawned item) and what it left within 2 tiles and on the player, then open a new one of its type in its place, so the next pass starts as a clean start would
					const ask = ctx.freshAsk, id = ask.id, fo = freshOf, mob = live(firstC()?.getVar("mob")), qd = vm.tree.globalProcs.get("qdel"); ctx.freshAsk = null;
					const other = !!fo && ask.tgui !== undefined && ask.tgui.split(":")[0] !== fo.arg.split(":")[0]; // another machine: that is a new station, not a fresh one
					const turf = fo ? live(vm.getField(fo.obj, "loc")) : null, isItem = !!fo && fo.obj.type.path.startsWith("/obj/item/");
					if (!fo || other || !qd || !(mob instanceof DMObject) || opts.tgui || (!isItem && !(turf instanceof DMObject && turf.type.path.startsWith("/turf"))))
						post({ type: "hotResult", id, ok: false, lines: [!fo ? "nothing to make fresh: no --tgui machine or spawned item is open (a /mob target and the player's own PDA are not remade)" : other ? `this station opened ${fo.arg.split(":")[0]}, not ${ask.tgui!.split(":")[0]}: that needs a new start` : opts.tgui ? "the last one is still being opened" : "the machine is not on a turf (or no player, or no qdel)"] });
					else {
						let gone = 0;
						vm.call(qd, [fo.obj]);
						freshArea(fo, mob, (o) => { if (o !== fo.obj && !o.deleted && !fo.keep.has(o) && /^\/obj\/(item|structure|machinery)\//.test(o.type.path)) { vm.call(qd, [o]); gone++; } });
						if (!isItem) freshNew = vm.newObject(fo.obj.type, [turf as DMObject], mob);
						watchTgt = fridgeTgt = fabTgt = stackIt = smallIt = null; watchLog = watchRefs = fridgeLog = fabLog = stackLog = smallLog = ""; stackAgainAt = 0;
						if (ask.tgui !== undefined) { fo.arg = ask.tgui; opts.tguiSet = ask.tguiSet; if (ask.tguiWatch) opts.tguiWatch = ask.tguiWatch; }
						for (const p of players) { const c = p?.client; if (c instanceof DMObject) c.setVar("topiclimiter", null); } // the game's own "too many actions in a minute" count starts again too
						opts.tgui = fo.arg; freshN++;
						const ln = `fresh ${fo.arg}${opts.tguiSet ? ` (set ${opts.tguiSet})` : ""} (number ${freshN}): the old one and ${gone} thing(s) left around it deleted`;
						log(`[vm-boot] tgui: ${ln} (world.time ${vm.sched.time})`); post({ type: "hotResult", id, ok: true, lines: [ln] });
					}
				}
				if (opts.tgui === "@mob") { opts.tgui = undefined; mobWatch = true; holdLobby(vm); log(`[vm-boot] tgui: watching the player's own mob (lobby countdown held)`); }
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
							if (!freshN)
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
									smallIt = it;
								log(`[vm-boot] tgui: none on the map, spawned ${want} x${wantAmount} (in hand: ${live(vm.getField(mob, "held_items")) !== null})`);
							}
						}
						if (!it) log(`[vm-boot] tgui: no ${want} on this map`);
						else {
							log(`[vm-boot] tgui: attack_self of ${it.type.path} (carried by the player: ${live(vm.getField(it, "loc")) === mob})`);
							if (want === "/obj/item/device/pda") {
								const bt = vm.tree.getType("/obj/item/device/pda/medical"), here = vm.getField(mob, "loc");
								if (bt && here) {
									buddyPda = vm.newObject(bt, [here], mob);
									vm.setField(buddyPda, "owner", "Test Buddy");
									vm.setField(buddyPda, "ownjob", "Test Job");
									vm.call(buddyPda.type.procs.get("update_label")!, [], buddyPda, mob);
									log(`[vm-boot] tgui: a second PDA owned by Test Buddy is on the floor next to the player`);
								}
							}
							if (opts.tguiWatch) watchTgt = it;
							if (spawnIt) { stackIt = it; stackAgainAt = freshN ? 0 : ticks + 250; freshMark(it, mob, tguiArg.join(":")); }
							vm.call(it.type.procs.get("attack_self")!, [mob], it, mob);
						}
					} else if (alive) { opts.tgui = undefined;
						let tgt: DMObject | null = freshNew; freshNew = null; // the one made fresh, when there is one
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
							if (!freshN) { const tk = live(vm.globals[vm.tree.globalNames.indexOf("SSticker")]); if (tk instanceof DMObject) tk.setVar("round_start_time", (tk.getVar("round_start_time") as number) - 12000); } // so the emergency shuttle's refuel delay (20 min after round start) doesn't refuse a call made from the window
							if (want.startsWith("/mob/")) stripTgt = tgt;
							if (want.startsWith("/obj/machinery/smartfridge")) fridgeTgt = tgt;
							if (opts.tguiWatch) watchTgt = tgt;
							if (!want.startsWith("/mob/")) freshMark(tgt, mob, tguiArg.join(":"));
							for (const kv of (opts.tguiSet ?? "").split(",").filter(Boolean)) { const [k, v] = kv.split("="); const fa = v.startsWith("@first:") ? [...vm.map.atoms].find((a) => !a.deleted && a.type.path.startsWith(v.slice(7))) : undefined; vm.setField(tgt, k, fa ?? (/^-?\d+(\.\d+)?$/.test(v) ? Number(v) : v)); } // test aid (--tgui-set var=value,..): e.g. disabled=1, extended_inventory=1; @first:TYPE = the first such atom on the map (strip: machine=@first:/obj/structure/table)
							if (want === "/obj/machinery/mecha_part_fabricator" || want === "/obj/machinery/autolathe") { fabTgt = tgt; const mc = live(tgt.getVar("materials")), ml = mc instanceof DMObject ? live(mc.getVar("materials")) : null; if (ml instanceof DMList) for (const k of ml.items) { const m = live(ml.get(live(k as never)) as never); if (m instanceof DMObject && stringify(live(k as never)) === "$metal") vm.setField(m, "amount", tguiArg[1] ? wantAmount : 30000); } } // test aid: 30000 metal so Build / Remove are enabled (the autolathe too)
							if (want.includes("/corgi/") || want.includes("/carbon/")) giftAt = ticks + 200; // test aid: something the corgi's Equip can take, handed over a little after the window opens
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
				if (opts.crew && ticks > joinAt + 100 && crewStep < 3) { // cm1 test aid: ?crew=1 stands the player next to the first crew monitoring console and opens it (attack_hand), logs the suit sensor state and the monitor's data; then sets the sensors to tracking (3) and updates, logging the data again
					const mob = live(firstC()?.getVar("mob"));
					const glob = live(vm.globals[vm.tree.root.globalVars.get("GLOB")!]) as DMObject, gi = glob.type.globalVars.get("crewmonitor"), cm = (gi === undefined ? null : live(vm.globals[gi])) as DMObject | null;
					const dataLen = () => { const d = live(cm ? cm.getVar("data") : null); return d instanceof DMList ? d.items.map((r) => { const l = live(r); return l instanceof DMList ? l.items.map((v) => stringify(live(v))).join("|") : "?"; }) : []; };
					const uni = () => live(mob instanceof DMObject ? mob.getVar("w_uniform") : null) as DMObject | null;
					if (mob instanceof DMObject && crewStep === 0) {
						for (const a of vm.map.atoms) if (!a.deleted && a.type.path === "/obj/machinery/computer/crew") { crewCon = a; break; }
						if (!crewCon) { log("[vm-boot] crew: no crew monitoring console on this map"); crewStep = 3; }
						else {
							const cx = vm.getField(crewCon, "x") as number, cy = vm.getField(crewCon, "y") as number, cz = vm.getField(crewCon, "z") as number;
							const ch = live(mob.getVar("buckled"));
							if (ch instanceof DMObject) vm.call(ch.type.procs.get("unbuckle_mob")!, [mob, 1], ch, mob);
							for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) { const t = vm.map.turfAt(cx + dx, cy + dy, cz); if (t && !vm.getField(t, "density")) { vm.setField(mob, "loc", t); break; } }
							const u = uni();
							log(`[vm-boot] crew: console at ${cx},${cy},${cz}, player at ${vm.getField(mob, "x")},${vm.getField(mob, "y")}; uniform ${u ? u.type.path : "none"} has_sensor ${u ? stringify(u.getVar("has_sensor")) : "-"} sensor_mode ${u ? stringify(u.getVar("sensor_mode")) : "-"}, world.time ${vm.sched.time}`);
							vm.call(crewCon.type.procs.get("attack_hand")!, [mob], crewCon, mob);
							crewStep = 1; crewAt = ticks;
						}
					} else if (mob instanceof DMObject && crewStep === 1 && ticks === crewAt + 40) {
						log(`[vm-boot] crew: monitor data with the player's own sensor mode: ${JSON.stringify(dataLen())}`);
						const u = uni(); if (u) vm.setField(u, "sensor_mode", 3);
						vm.call(cm!.type.procs.get("update")!, [vm.getField(mob, "z") as number, 1], cm!, mob);
						crewStep = 2;
					} else if (mob instanceof DMObject && crewStep === 2 && ticks === crewAt + 60) {
						log(`[vm-boot] crew: monitor data after sensor_mode=3: ${JSON.stringify(dataLen())}`);
						crewStep = 3;
					}
				}
				if (opts.shoot && ticks > joinAt + 100) { // ls1 test aid: ?shoot=1 stands the player 2 west, 4 south of the Captain's display case with an energy gun on kill and clicks the case at playtest-recorded times (ticks 0,13,20,24,31,38,41), then counts projectiles left in the world
					const c = firstC(), mob = live(c?.getVar("mob"));
					if (shootAt < 0 && c && mob instanceof DMObject) {
						shootAt = ticks;
						for (const a of vm.map.atoms) if (!a.deleted && a.type.path === "/obj/structure/displaycase/captain") { shootCase = a; break; }
						if (!shootCase) { log("[vm-boot] shoot: no captain's display case on this map"); opts.shoot = false; }
						else {
							const cx = vm.getField(shootCase, "x") as number, cy = vm.getField(shootCase, "y") as number, cz = vm.getField(shootCase, "z") as number;
							const ch = live(mob.getVar("buckled"));
							if (ch instanceof DMObject) vm.call(ch.type.procs.get("unbuckle_mob")!, [mob, 1], ch, mob);
							const t = vm.map.turfAt(cx - 2, cy - 4, cz);
							vm.setField(mob, "loc", t);
							const gun = vm.newObject(vm.tree.getType("/obj/item/weapon/gun/energy/e_gun")!, [t], mob);
							vm.call(mob.type.procs.get("put_in_hands")!, [gun], mob, mob);
							for (let i = 0; i < 3 && stringify(live(gun.getVar("chambered")) instanceof DMObject ? (live(gun.getVar("chambered")) as DMObject).getVar("select_name") : null) !== "kill"; i++)
								vm.call(gun.type.procs.get("select_fire")!, [mob], gun, mob);
							log(`[vm-boot] shoot: player at ${cx - 2},${cy - 4},${cz} holding ${stringify(gun.getVar("name"))} on ${stringify((live(gun.getVar("chambered")) as DMObject).getVar("select_name"))}, case at ${cx},${cy},${cz}, world.time ${vm.sched.time}`);
						}
					}
					const at = [0, 13, 20, 24, 31, 38, 41];
					if (opts.shoot && shootCase && shootN < at.length && ticks === shootAt + 1 + at[shootN]) {
						const obj = shootCase.deleted || !vm.getField(shootCase, "loc") ? vm.map.turfAt(vm.getField(shootCase, "x") as number, vm.getField(shootCase, "y") as number, vm.getField(shootCase, "z") as number) : shootCase;
						shootN++;
						log(`[vm-boot] shoot: click ${shootN} on ${obj ? obj.type.path : "-"}, world.time ${vm.sched.time}`);
						if (c && obj) vm.clients.click(c, { object: obj as DMObject, x: vm.getField(obj as DMObject, "x") as number, y: vm.getField(obj as DMObject, "y") as number, dbl: false, control: "mapwindow.map", params: "icon-x=16;icon-y=16;left=1;screen-loc=10:16,12:16" });
					}
					if (opts.shoot && shootCase && (ticks === shootAt + 80 || ticks === shootAt + 400)) {
						let n = 0; for (const a of vm.map.atoms) if (!a.deleted && a.type.isSubtypeOf(vm.tree.getType("/obj/item/projectile")!) && live(vm.getField(a, "loc")) instanceof DMObject && (live(vm.getField(a, "loc")) as DMObject).type.isSubtypeOf(vm.tree.getType("/turf")!)) n++; // flying ones (on a turf), not the ones waiting in casings
						log(`[vm-boot] shoot: ${n} projectiles on turfs ${ticks - shootAt} ticks after the first click, world.time ${vm.sched.time}`);
					}
				}
				if (opts.shake && shakeN < 3 && ticks > joinAt + 100) { // ss1 test aid: ?shake=1 calls tg's shake_camera on the player three times, 8 s apart (duration 10 strength 1, 15/2, 25/4: 1, 1.5 and 2.5 s)
					const c = firstC(), mob = live(c?.getVar("mob")), p = vm.tree.globalProcs.get("shake_camera");
					if (c && mob instanceof DMObject && p && (shakeN === 0 || vm.sched.time >= shakeT0 + 80)) {
						const [d, st] = [[10, 1], [15, 2], [25, 4]][shakeN++];
						shakeT0 = vm.sched.time;
						vm.call(p, [mob, d, st]);
						log(`[vm-boot] shake: shake_camera(player, ${d}, ${st}) ${shakeN}/3, world.time ${vm.sched.time}`);
					}
				}
				if (opts.goto && !gotoDone && ticks > joinAt + 100) { // pv1 test aid: ?goto=TYPESUBSTR stands the player on a free tile next to the first atom whose type path contains it (e.g. cryo_cell), for screenshots of a spot on the station
					const mob = live(firstC()?.getVar("mob"));
					if (mob instanceof DMObject) {
						gotoDone = true;
						const target = [...vm.map.atoms].find((a) => !a.deleted && a.type.path.includes(opts.goto!));
						if (!target) log(`[vm-boot] goto: no ${opts.goto} on this map`);
						else {
							const ch = live(mob.getVar("buckled"));
							if (ch instanceof DMObject) vm.call(ch.type.procs.get("unbuckle_mob")!, [mob, 1], ch, mob);
							const cx = vm.getField(target, "x") as number, cy = vm.getField(target, "y") as number, cz = vm.getField(target, "z") as number;
							for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) { const t = vm.map.turfAt(cx + dx, cy + dy, cz); if (t && !vm.getField(t, "density")) { vm.setField(mob, "loc", t); break; } }
							log(`[vm-boot] goto: ${target.type.path} at ${cx},${cy},${cz}; player now at ${vm.getField(mob, "x")},${vm.getField(mob, "y")}`);
						}
					}
				}
				if (opts.setup && !setupDone && ticks > joinAt + 100) { // vt2 debug aid: ?setup=OP;OP stages a scene before the keys/clicks run (see the header of tools/verify-file.mjs). Off unless ?setup is in the page query.
					const c = firstC(), mob = live(c?.getVar("mob"));
					if (c && mob instanceof DMObject) {
						setupDone = true;
						const px = () => vm.getField(mob, "x") as number, py = () => vm.getField(mob, "y") as number, pz = () => vm.getField(mob, "z") as number;
						const unbuckle = () => { const ch = live(mob.getVar("buckled")); if (ch instanceof DMObject) vm.call(ch.type.procs.get("unbuckle_mob")!, [mob, 1], ch, mob); };
						const isSpace = (t: DMObject | null) => !!t && t.type.path.startsWith("/turf/open/space");
						for (const raw of opts.setup.split(";")) {
							const [op, ...rest] = raw.trim().split(":"), arg = rest.join(":");
							if (op === "spawn") { // spawn:TYPE[@DX,DY]: a new object on the tile DX,DY from the player (default 1,0)
								const [tp, off] = arg.split("@"), [dx, dy] = (off ?? "1,0").split(",").map(Number), ty = vm.tree.getType(tp);
								const t = vm.map.turfAt(px() + dx, py() + dy, pz());
								if (!ty || !t) { log(`[vm-boot] setup: spawn ${arg}: ${ty ? "no turf there" : "no such type"}`); continue; }
								const o = vm.newObject(ty, [t], mob);
								log(`[vm-boot] setup: spawned ${ty.path} at ${vm.getField(o, "x")},${vm.getField(o, "y")},${vm.getField(o, "z")}`);
							} else if (op === "hand") { // hand:TYPE: a new item in the player's active hand
								const ty = vm.tree.getType(arg);
								if (!ty) { log(`[vm-boot] setup: hand ${arg}: no such type`); continue; }
								const o = vm.newObject(ty, [vm.getField(mob, "loc")], mob);
								const ok = vm.call(mob.type.procs.get("put_in_hands")!, [o], mob, mob);
								log(`[vm-boot] setup: ${ty.path} put in hands (${String(ok)})`);
							} else if (op === "tp") { // tp:X,Y,Z or tp:space (nearest turf with open space all round, 2 tiles deep) or tp:+DX,DY (relative)
								unbuckle();
								let dest: DMObject | null = null;
								if (arg === "space") {
									let bd = 1e9;
									for (const a of vm.map.atoms) {
										if (a.deleted || !isSpace(a)) continue;
										const ax = vm.getField(a, "x") as number, ay = vm.getField(a, "y") as number;
										if (vm.getField(a, "z") !== pz()) continue;
										let open = true; for (let dy = -2; dy <= 2 && open; dy++) for (let dx = -2; dx <= 2; dx++) if (!isSpace(vm.map.turfAt(ax + dx, ay + dy, pz()))) { open = false; break; }
										const d = Math.hypot(ax - px(), ay - py()); if (open && d < bd) { bd = d; dest = a; }
									}
								} else if (arg.startsWith("+")) { const [dx, dy] = arg.slice(1).split(",").map(Number); dest = vm.map.turfAt(px() + dx, py() + dy, pz()); }
								else { const [x, y, z] = arg.split(",").map(Number); dest = vm.map.turfAt(x, y, z ?? pz()); }
								if (dest) vm.setField(mob, "loc", dest);
								log(`[vm-boot] setup: tp ${arg}: ${dest ? `player now at ${px()},${py()},${pz()}` : "no such tile"}`);
							} else if (op === "throwmode") { // throwmode: throw mode on (as the HUD throw button), so the next click on a tile throws the hand item
								vm.call(mob.type.procs.get("throw_mode_on")!, [], mob, mob);
								log(`[vm-boot] setup: throw mode on (${String(vm.getField(mob, "in_throw_mode"))})`);
							} else if (op === "drift") { // drift:DIR (BYOND dir number, 4 = east): newtonian_move, as if pushed off in space
								vm.call(mob.type.procs.get("newtonian_move")!, [Number(arg)], mob, mob);
								log(`[vm-boot] setup: newtonian_move(${arg})`);
							} else log(`[vm-boot] setup: unknown op ${raw}`);
						}
						log("[vm-boot] setup: done");
					}
				}
				if (opts.lie && !lieDone && ticks > joinAt + 100) { // Test aid: ?lie=1 has the player's mob rest (lay_down), i.e. lie 90 degrees
					const mob = live(firstC()?.getVar("mob"));
					if (mob instanceof DMObject) {
						lieDone = true;
						const ch = live(mob.getVar("buckled")); // spawn seats the player in a shuttle chair; a buckled mob doesn't lie
						if (ch instanceof DMObject) vm.call(ch.type.procs.get("unbuckle_mob")!, [mob, 1], ch, mob);
						vm.call(mob.type.procs.get("lay_down")!, [], mob, mob); log(`[vm-boot] lie: ${mob.type.path} lay_down, world.time ${vm.sched.time}`);
					}
				}
	} };
}
