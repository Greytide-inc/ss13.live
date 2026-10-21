// fast-air: hand-written stand-ins for the hottest atmos procs of the translated tg, for a breached station
// (after a bomb ~1000 turfs stay active in SSair and process_cell was ~85% of the extra time).
//
// Each one does what the translated proc does, operation for operation (same float32 rounding through the VM's
// add/subtract/multiply/divide, same order of reads, writes and calls, same calls into DM for everything else),
// minus the per-proc machinery: no frame per call between these procs, no f.at bookkeeping, direct list reads.
// Anything unusual (an overriding proc, a value that isn't the list or number tg always has there, a diff trace)
// goes the normal way: the DM proc by name, or the original translation.
//
// Switch: on by default; FAST_AIR=0 (Node env) or ?fastair=0 (page; boot-worker sets globalThis.FAST_AIR = false) keeps the
// plain translation, for A/B runs.
//
// The DM it stands in for: code/modules/atmospherics/environmental/LINDA_turf_tile.dm (turf/open archive,
// update_visuals, process_cell) and code/modules/atmospherics/gasmixtures/gas_mixture.dm (archive, heat_capacity,
// share, compare, react).
import * as rt from "./runtime.js";
import { add, bitAnd, bitOr, divide, lessThan, multiply, subtract, type VM } from "../vm/interpreter.js";
import type { Frame } from "../vm/interpreter.js";
import { DMList, DMObject, FieldIC, live } from "../vm/objects.js";
import { fround, isEqual, isTruthy as truthy, type Value } from "../vm/value.js";
import type { DMProc, DMType } from "../vm/objtree.js";

let vm: VM;
const gt = (a: Value, b: Value): boolean => lessThan(b, a);
const lt = lessThan;
const abs = (v: Value): number => Math.abs(typeof v === "number" ? v : 0); // the Abs instruction
const ic = (name: string): FieldIC => new FieldIC(name);
const rd = (o: Value, c: FieldIC): Value => vm.readIC(o, c);
const wr = (o: Value, c: FieldIC, v: Value): void => vm.writeIC(o, c, v);
const idx = (l: Value, i: Value): Value => vm.getIndex(l, i);
/** QUANTIZE(x): round(x, 0.0000001) as the /round native does it. */
const QUANT = 1.0000000116860974e-7;
const quantize = (x: Value): number => fround(Math.floor((typeof x === "number" ? x : 0) / QUANT + 0.5) * QUANT);
/** What a for (x in L) loop walks: a copy of L's items (an enumerator's snapshot); null for a non-list (the caller bails). */
const items = (l: Value): Value[] | null => (l === null ? [] : l instanceof DMList ? l.items.slice() : null);
/**
 * L's items for a loop whose body can't change L (a gas list read or written per gas): the list's own array, walked
 * up to its length at the start (no copy). A non-list walks nothing.
 */
const NO_KEYS: Value[] = [];
const keys = (l: Value): Value[] => (l instanceof DMList ? l.items : NO_KEYS);

// The procs (resolved at install) and the DM types they belong to.
let gasType: DMType, egType: DMType, gm: Record<string, DMProc | undefined>, turf: Record<string, DMProc | undefined>;
let SSairIdx = -1;
const SSair = (): Value => live(vm.globals[SSairIdx]);
/** The original translations (fallbacks). */
let origShare: (f: Frame, a: Value, b: Value) => Value;
let origCompare: (f: Frame, a: Value) => Value;
let origUpdateVisuals: (f: Frame) => Value;
let origReact: (f: Frame, a: Value) => Generator<any, Value, Value>;
let origProcessCell: (f: Frame, a: Value) => Generator<any, Value, Value>;

/** True when `o.name()` would run the stand-in `p` (an object of a type that doesn't override it) and nothing traces calls. */
function is(o: Value, name: string, p: DMProc | undefined): o is DMObject {
	return o instanceof DMObject && o.deleted === false && p !== undefined && o.type.procs.get(name) === p && !rt.traceHooked();
}

// ---- /datum/gas_mixture ------------------------------------------------------------------------------------

const G = { gases: ic("gases"), gases2: ic("gases"), gases3: ic("gases"), gases4: ic("gases"), gases5: ic("gases"), gases6: ic("gases"), gases7: ic("gases"),
	temperature: ic("temperature"), temperature2: ic("temperature"), temperature3: ic("temperature"), temperature4: ic("temperature"), temperature5: ic("temperature"),
	temperature6: ic("temperature"), temperature7: ic("temperature"), temperature8: ic("temperature"),
	tarch: ic("temperature_archived"), tarch2: ic("temperature_archived"), tarch3: ic("temperature_archived"), tarch4: ic("temperature_archived"),
	tarch5: ic("temperature_archived"), tarch6: ic("temperature_archived"), tarch7: ic("temperature_archived"), tarch8: ic("temperature_archived"), tarch9: ic("temperature_archived"),
	last_share: ic("last_share"), volume: ic("volume"), reaction_results: ic("reaction_results"), gas_reactions: ic("gas_reactions"),
	min_requirements: ic("min_requirements") };

/** heat_capacity(): sum of moles * specific heat. */
function heatCapacity(src: DMObject): Value {
	const cached = rd(src, G.gases);
	let dot: Value = 0;
	const L = keys(cached);
	for (let i = 0, n = L.length; i < n; i++) {
		const gd = idx(cached, L[i]);
		dot = add(dot, multiply(idx(gd, 1), idx(idx(gd, 3), 1)));
	}
	return dot;
}
function callHeatCapacity(f: Frame, o: Value): Value {
	return is(o, "heat_capacity", gm.heat_capacity) ? heatCapacity(o) : rt.callName(f, o, "heat_capacity", []);
}

/** gas_mixture archive(): temperature_archived = temperature, each gas's ARCHIVE = MOLES. */
function gasArchive(src: DMObject): Value {
	const cached = rd(src, G.gases2);
	wr(src, G.tarch, rd(src, G.temperature));
	const L = keys(cached);
	for (let i = 0, n = L.length; i < n; i++) vm.setIndex(idx(cached, L[i]), 2, idx(idx(cached, L[i]), 1));
	return 1;
}

/** share(sharer, atmos_adjacent_turfs = 4): tg's gas_mixture.dm share(), step for step. */
function share(f: Frame, src: DMObject, sharer: Value, n: Value): Value {
	if (live(n) === null) n = 4;
	if (!truthy(live(sharer))) return 0;
	const cached = rd(src, G.gases3);
	const sg = rd(live(sharer), G.gases4);
	if (!(cached instanceof DMList) || !(sg instanceof DMList)) return origShare.call(null, f, sharer, n); // never in tg
	const tDelta = subtract(rd(src, G.tarch2), rd(live(sharer), G.tarch3));
	const absTD = abs(tDelta);
	const hot = gt(absTD, 0.5);
	let oldSelfHC: Value = 0, oldSharerHC: Value = 0;
	if (hot) {
		oldSelfHC = callHeatCapacity(f, src);
		oldSharerHC = callHeatCapacity(f, live(sharer));
	}
	let s2s: Value = 0, sh2s: Value = 0, moved: Value = 0, absMoved: Value = 0;
	// for(var/id in sharer_gases - cached_gases) add_gas(id)
	let missing: Value[] | null = null;
	for (const id of sg.items) if (!cached.contains(id)) (missing ??= []).push(id);
	if (missing !== null) for (const id of missing) rt.callName(f, src, "add_gas", [id]);
	const CK = cached.items; // sharer.add_gas() below changes only the sharer's list
	for (let i = 0, cn = CK.length; i < cn; i++) {
		const id = CK[i];
		if (!truthy(idx(sg, id))) rt.callName(f, live(sharer), "add_gas", [id]);
		const gas = idx(cached, id);
		const sgas = idx(sg, id);
		const delta = divide(quantize(subtract(idx(gas, 2), idx(sgas, 2))), add(live(n), 1));
		if (truthy(delta) && hot) {
			const ghc = multiply(delta, idx(idx(gas, 3), 1));
			if (gt(delta, 0)) s2s = add(s2s, ghc);
			else sh2s = subtract(sh2s, ghc);
		}
		vm.setIndex(gas, 1, subtract(idx(gas, 1), delta));
		vm.setIndex(sgas, 1, add(idx(sgas, 1), delta));
		moved = add(moved, delta);
		absMoved = add(absMoved, abs(delta));
	}
	wr(src, G.last_share, absMoved);
	if (hot) {
		const newSelfHC = subtract(add(oldSelfHC, sh2s), s2s);
		const newSharerHC = subtract(add(oldSharerHC, s2s), sh2s);
		if (gt(newSelfHC, 0.0003000000142492354))
			wr(src, G.temperature, divide(add(subtract(multiply(oldSelfHC, rd(src, G.temperature2)), multiply(s2s, rd(src, G.tarch4))), multiply(sh2s, rd(live(sharer), G.tarch5))), newSelfHC));
		if (gt(newSharerHC, 0.0003000000142492354)) {
			wr(live(sharer), G.temperature3, divide(add(subtract(multiply(oldSharerHC, rd(live(sharer), G.temperature4)), multiply(sh2s, rd(live(sharer), G.tarch6))), multiply(s2s, rd(src, G.tarch7))), newSharerHC));
			if (gt(abs(oldSharerHC), 0.0003000000142492354) && lt(abs(subtract(divide(newSharerHC, oldSharerHC), 1)), 0.10000000149011612))
				rt.callName(f, src, "temperature_share", [live(sharer), 0.4000000059604645]);
		}
	}
	// var/list/unique_gases = cached_gases ^ sharer_gases; if(unique_gases.len) ...
	if (!sameItems(cached, sg)) {
		rt.callName(f, src, "garbage_collect", [subtract(cached, sg)]);
		rt.callName(f, live(sharer), "garbage_collect", [subtract(sg, cached)]);
	}
	const sh = live(sharer);
	if (!(sh instanceof DMObject && gm.after_share_base !== undefined && sh.type.procs.get("after_share") === gm.after_share_base && !rt.traceHooked()))
		rt.callName(f, sh, "after_share", [src, live(n)]); // the base one is an empty proc
	if (!(gt(tDelta, 393.1499938964844) || gt(abs(moved), 0.1039837971329689))) return null;
	let our: Value = 0, their: Value = 0;
	for (let i = 0, k = cached.items, cn = k.length; i < cn; i++) our = add(our, idx(idx(cached, k[i]), 1));
	for (let i = 0, k = sg.items, sn = k.length; i < sn; i++) their = add(their, idx(idx(sg, k[i]), 1));
	return divide(multiply(subtract(multiply(rd(src, G.tarch8), add(our, moved)), multiply(rd(live(sharer), G.tarch9), subtract(their, moved))), 8.3100004196167), rd(src, G.volume));
}
/** (a ^ b).len == 0 for lists without repeated items (gas lists). */
function sameItems(a: DMList, b: DMList): boolean {
	if (a.items.length !== b.items.length) return false;
	for (const k of a.items) if (!b.contains(k)) return false;
	return true;
}

/** compare()'s test for one gas id (a plain function, not a closure made per call). */
function differs(cached: DMList, sgs: DMList, id: Value): boolean {
	let gmol = idx(cached, id);
	gmol = truthy(gmol) ? idx(gmol, 1) : 0;
	let smol = idx(sgs, id);
	smol = truthy(smol) ? idx(smol, 1) : 0;
	const delta = abs(subtract(gmol, smol));
	return gt(delta, 0.1039837971329689) && gt(delta, multiply(gmol, 0.0010000000474974513));
}

/** compare(sample): the first gas id that differs enough, "temp", or "". */
function compare(src: DMObject, sample: Value): Value {
	const sgs = rd(live(sample), G.gases5);
	const cached = rd(src, G.gases6);
	if (!(cached instanceof DMList) || !(sgs instanceof DMList)) return undefined as unknown as Value; // caller falls back
	// for(var/id in cached_gases | sample_gases)
	const CK = cached.items, SK = sgs.items;
	for (let i = 0, n = CK.length; i < n; i++) if (differs(cached, sgs, CK[i])) return CK[i];
	for (let i = 0, n = SK.length; i < n; i++) if (!cached.contains(SK[i]) && differs(cached, sgs, SK[i])) return SK[i];
	let our: Value = 0;
	for (let i = 0, n = CK.length; i < n; i++) our = add(our, idx(idx(cached, CK[i]), 1));
	if (gt(our, 0.1039837971329689)) {
		const temp = rd(src, G.temperature5);
		const st = rd(live(sample), G.temperature6);
		if (gt(abs(subtract(temp, st)), 4)) return "temp";
	}
	return "";
}

/**
 * The part of react() that only reads: true when no reaction's requirements are met (react would then only clamp the
 * temperature and make a new reaction_results), done here. False: run react() as it is.
 */
function reactQuiet(src: DMObject): boolean {
	const reactions = rd(SSair(), G.gas_reactions);
	if (!(reactions instanceof DMList)) return false;
	let temp = rd(src, G.temperature7);
	if (lt(temp, 2.700000047683716)) temp = 2.700000047683716;
	const cached = rd(src, G.gases7);
	for (const r of reactions.items) {
		const reaction = live(r);
		const mr = rd(reaction, G.min_requirements);
		if (!(mr instanceof DMList)) return false;
		const tv = idx(mr, "TEMP");
		if (truthy(tv) && lt(temp, tv)) continue;
		if (truthy(idx(mr, "ENER"))) return false; // needs thermal_energy(): leave it to react()
		let met = true;
		for (const id of mr.items) {
			if (id === "TEMP" || id === "ENER") continue;
			if (!truthy(idx(cached, id)) || lt(idx(idx(cached, id), 1), idx(mr, id))) { met = false; break; }
		}
		if (met) return false;
	}
	if (lt(rd(src, G.temperature8), 2.700000047683716)) wr(src, G.temperature, 2.700000047683716);
	wr(src, G.reaction_results, vm.newList([]));
	return true;
}

// ---- /turf/open --------------------------------------------------------------------------------------------

const TU = { air: ic("air"), air2: ic("air"), air3: ic("air"), archived_cycle: ic("archived_cycle"), times_fired: ic("times_fired"),
	temperature: ic("temperature"), temperature_archived: ic("temperature_archived"), atmos_overlay_types: ic("atmos_overlay_types"),
	atmos_overlay_types2: ic("atmos_overlay_types"), current_cycle: ic("current_cycle"), current_cycle2: ic("current_cycle"),
	atmos_adjacent_turfs: ic("atmos_adjacent_turfs"), excited_group: ic("excited_group"), atmos_cooldown: ic("atmos_cooldown"),
	planetary_atmos: ic("planetary_atmos"), excited: ic("excited"), recently_active: ic("recently_active"), recently_active2: ic("recently_active"),
	last_share: ic("last_share"), dismantle_cooldown: ic("dismantle_cooldown"), airTemp: ic("temperature"), gases: ic("gases") };

/** turf/open archive(): air.archive(), archived_cycle = SSair.times_fired, temperature_archived = temperature. */
function turfArchive(f: Frame, src: DMObject): void {
	const air = rd(src, TU.air);
	if (is(air, "archive", gm.archive)) gasArchive(air);
	else rt.callName(f, air, "archive", []);
	wr(src, TU.archived_cycle, rd(SSair(), TU.times_fired));
	wr(src, TU.temperature_archived, rd(src, TU.temperature));
}

/** update_visuals() when it changes nothing: no gas over its visible amount and no gas overlays on the turf. False: run it. */
function visualsQuiet(src: DMObject): boolean {
	if (truthy(rd(src, TU.atmos_overlay_types))) return false;
	if (src.type.procs.get("tile_graphic") !== turf.tile_graphic) return false;
	const air = rd(src, TU.air2);
	if (truthy(air)) {
		const gases = rd(air, TU.gases);
		if (!(gases instanceof DMList)) return false;
		for (const id of gases.items) {
			const gas = idx(gases, id);
			const meta = idx(gas, 3);
			if (truthy(idx(meta, 4)) && gt(idx(gas, 1), idx(meta, 3))) return false;
		}
	}
	wr(src, TU.atmos_overlay_types2, null); // UNSETEMPTY(new_overlay_types); atmos_overlay_types = new_overlay_types
	return true;
}

/** turf/open process_cell(fire_count): LINDA_turf_tile.dm, step for step; DM procs it calls that may sleep are yielded to. */
/** our_air.compare(enemy_air) by the stand-in, or undefined when the proc must run (override, odd lists). */
function quickCompare(ourAir: Value, enemyAir: Value): Value | undefined {
	const a = live(ourAir);
	return is(a, "compare", gm.compare) ? compare(a, live(enemyAir)) : undefined;
}

function* processCell(f: Frame, fire_count: Value): Generator<any, Value, Value> {
	const src = f.src;
	if (!(src instanceof DMObject) || rt.traceHooked()) return yield* origProcessCell(f, fire_count);
	let adjacent: Value = null, oeg: Value = null, our_air: Value = null, enemy: Value = null, enemy_air: Value = null, eeg: Value = null, EG: Value = null;
	f.vars = () => [fire_count, adjacent, oeg, our_air, enemy, enemy_air, eeg, EG];
	if (lt(rd(src, TU.archived_cycle), live(fire_count))) {
		if (is(src, "archive", turf.archive)) turfArchive(f, src);
		else yield* rt.g.callSrc(f, "archive", []);
	}
	wr(src, TU.current_cycle, live(fire_count));
	adjacent = rd(src, TU.atmos_adjacent_turfs);
	oeg = rd(src, TU.excited_group);
	let adjLen: Value = rt.length(adjacent);
	let cooldown = add(rd(src, TU.atmos_cooldown), 1);
	const planet = rd(src, TU.planetary_atmos);
	if (truthy(planet)) adjLen = rt.inc(adjLen, 1);
	our_air = rd(src, TU.air3);
	const L = items(live(adjacent));
	if (L === null) throw new Error("fast-air: atmos_adjacent_turfs isn't a list");
	// our_air.compare(enemy_air): the stand-in when it applies (quickCompare), else the proc. no generator closure per call.
	let c: Value | undefined;
	for (const t of L) {
		enemy = live(t);
		if (!gt(live(fire_count), rd(live(enemy), TU.current_cycle2))) continue;
		const e = live(enemy);
		if (is(e, "archive", turf.archive)) turfArchive(f, e);
		else yield* rt.g.callName(f, e, "archive", []);
		let share_air = false;
		enemy_air = rd(live(enemy), TU.air);
		if (truthy(rd(live(enemy), TU.excited))) {
			eeg = rd(live(enemy), TU.excited_group);
			if (truthy(live(oeg))) {
				if (truthy(live(eeg))) {
					if (!isEqual(live(oeg), live(eeg))) {
						yield* rt.g.callName(f, live(oeg), "merge_groups", [live(eeg)]);
						oeg = rd(src, TU.excited_group);
					}
					share_air = true;
				} else if ((isEqual(rd(src, TU.recently_active), 1) && isEqual(rd(live(enemy), TU.recently_active2), 1)) || truthy((c = quickCompare(our_air, enemy_air)) !== undefined ? c : yield* rt.g.callName(f, live(our_air), "compare", [live(enemy_air)]))) {
					yield* rt.g.callName(f, live(oeg), "add_turf", [live(enemy)]);
					share_air = true;
				}
			} else if (truthy(live(eeg))) {
				if ((isEqual(rd(src, TU.recently_active), 1) && isEqual(rd(live(enemy), TU.recently_active2), 1)) || truthy((c = quickCompare(our_air, enemy_air)) !== undefined ? c : yield* rt.g.callName(f, live(our_air), "compare", [live(enemy_air)]))) {
					yield* rt.g.callName(f, live(eeg), "add_turf", [src]);
					oeg = rd(src, TU.excited_group);
					share_air = true;
				}
			} else if ((isEqual(rd(src, TU.recently_active), 1) && isEqual(rd(live(enemy), TU.recently_active2), 1)) || truthy((c = quickCompare(our_air, enemy_air)) !== undefined ? c : yield* rt.g.callName(f, live(our_air), "compare", [live(enemy_air)]))) {
				EG = yield* rt.g.new_(f, egType, []);
				yield* rt.g.callName(f, live(EG), "add_turf", [src]);
				yield* rt.g.callName(f, live(EG), "add_turf", [live(enemy)]);
				oeg = rd(src, TU.excited_group);
				share_air = true;
			}
		} else if (truthy((c = quickCompare(our_air, enemy_air)) !== undefined ? c : yield* rt.g.callName(f, live(our_air), "compare", [live(enemy_air)]))) {
			yield* rt.g.callName(f, SSair(), "add_to_active", [live(enemy)]);
			if (truthy(live(oeg))) yield* rt.g.callName(f, live(oeg), "add_turf", [live(enemy)]);
			else {
				EG = yield* rt.g.new_(f, egType, []);
				yield* rt.g.callName(f, live(EG), "add_turf", [src]);
				yield* rt.g.callName(f, live(EG), "add_turf", [live(enemy)]);
				oeg = rd(src, TU.excited_group);
			}
			share_air = true;
		}
		if (!share_air) continue;
		const a = live(our_air);
		const difference = is(a, "share", gm.share) ? share(f, a, live(enemy_air), adjLen) : yield* rt.g.callName(f, a, "share", [live(enemy_air), adjLen]);
		if (truthy(difference)) {
			if (gt(difference, 0)) yield* rt.g.callSrc(f, "consider_pressure_difference", [live(enemy), difference]);
			else yield* rt.g.callName(f, live(enemy), "consider_pressure_difference", [src, rt.neg(difference)]);
		}
		const ls = rd(live(our_air), TU.last_share);
		if (gt(ls, 10.3983793258667)) {
			yield* rt.g.callName(f, live(oeg), "reset_cooldowns", []);
			cooldown = 0;
		} else if (gt(ls, 0.1039837971329689)) {
			rt.setI(f, live(oeg), TU.dismantle_cooldown, 0);
			cooldown = 0;
		}
	}
	if (truthy(planet)) { // share with the planet's atmosphere (lavaland): as translated
		const Gm = yield* rt.g.new_(f, gasType, []);
		yield* rt.g.callName(f, Gm, "copy_from_turf", [src]);
		yield* rt.g.callName(f, Gm, "archive", []);
		if (truthy(yield* rt.g.callName(f, live(our_air), "compare", [Gm]))) {
			if (!truthy(live(oeg))) {
				EG = yield* rt.g.new_(f, egType, []);
				yield* rt.g.callName(f, live(EG), "add_turf", [src]);
				oeg = rd(src, TU.excited_group);
			}
			yield* rt.g.callName(f, live(our_air), "share", [Gm, adjLen]);
			const ls = rd(live(our_air), TU.last_share);
			if (gt(ls, 10.3983793258667)) {
				yield* rt.g.callName(f, live(oeg), "reset_cooldowns", []);
				cooldown = 0;
			} else if (gt(ls, 0.1039837971329689)) {
				rt.setI(f, live(oeg), TU.dismantle_cooldown, 0);
				cooldown = 0;
			}
		}
	}
	const a = live(our_air);
	if (!(is(a, "react", gm.react) && reactQuiet(a))) yield* rt.g.callName(f, a, "react", [src]);
	if (!(is(src, "update_visuals", turf.update_visuals) && visualsQuiet(src))) yield* rt.g.callSrc(f, "update_visuals", []);
	let remove = true;
	if (gt(rd(live(our_air), TU.airTemp), 493.1499938964844)) {
		if (truthy(yield* rt.g.callSrc(f, "consider_superconductivity", ["starting", 1], rt.Args.Named))) remove = false;
	}
	if ((!truthy(live(oeg)) && remove) || gt(cooldown, 32)) yield* rt.g.callName(f, SSair(), "remove_from_active", [src]);
	wr(src, TU.atmos_cooldown, cooldown);
	return f.dot;
}

// ---- gas maths (speed-gas): merge, return_pressure, copy_from, copy_from_scaled ----------------------------------
// Same operations in the same order as the translations in gas_mixture.ts / datum_pipeline.ts (same float32 rounding),
// minus the per-gas runtime machinery (forList/next, rt.index of the same list over and over, a DM call per assert_gas).

let gasListCacheIdx = -1;
const GM = { gases: ic("gases"), gases2: ic("gases"), gases3: ic("gases"), gases4: ic("gases"), gases5: ic("gases"),
	temperature: ic("temperature"), temperature2: ic("temperature"), temperature3: ic("temperature"), temperature4: ic("temperature"),
	temperature5: ic("temperature"), temperature6: ic("temperature"), temperature7: ic("temperature"), temperature8: ic("temperature"), volume: ic("volume"), volume2: ic("volume"), volume3: ic("volume"), volume4: ic("volume"),
	volume5: ic("volume"), volume6: ic("volume"), volume7: ic("volume"), volume8: ic("volume"), temperature9: ic("temperature"), temperature10: ic("temperature") };

/** assert_gas(id) on the gas list `cached`: add a copy of the cache's entry when the gas isn't there (truthy test as the DM does). */
function assertGas(f: Frame, cached: DMList, id: Value): void {
	if (truthy(cached.get(id))) return;
	const tmp = idx(live(vm.globals[gasListCacheIdx]), id);
	cached.set(id, rt.callName(f, live(tmp), "Copy", []));
}

/** merge(giver): undefined = not the usual case, run the translation. */
function mergeFast(f: Frame, src: DMObject, giver0: Value): Value | undefined {
	const giver = live(giver0);
	if (!truthy(giver)) return 0;
	if (!(giver instanceof DMObject) || giver === src) return undefined;
	const cached = rd(src, GM.gases), gg = rd(giver, GM.gases2);
	if (!(cached instanceof DMList) || !(gg instanceof DMList) || cached === gg) return undefined;
	if (gt(abs(subtract(rd(src, GM.temperature), rd(giver, GM.temperature2))), 0.5)) {
		const selfHC = callHeatCapacity(f, src);
		const giverHC = callHeatCapacity(f, giver);
		const combined = add(giverHC, selfHC);
		if (truthy(combined))
			wr(src, GM.temperature3, divide(add(multiply(rd(giver, GM.temperature4), giverHC), multiply(rd(src, GM.temperature5), selfHC)), combined));
	}
	const K = gg.items; // the loop below changes only our list
	for (let i = 0, n = K.length; i < n; i++) {
		const id = K[i];
		assertGas(f, cached, id);
		const mine = idx(cached, id);
		vm.setIndex(mine, 1, add(idx(mine, 1), idx(idx(gg, id), 1)));
	}
	return 1;
}

/** return_pressure(): undefined = run the translation. */
function returnPressureFast(src: DMObject): Value | undefined {
	if (!gt(rd(src, GM.volume), 0)) return 0;
	const cached = rd(src, GM.gases3);
	if (!(cached instanceof DMList)) return undefined;
	let dot: Value = 0;
	const K = cached.items;
	for (let i = 0, n = K.length; i < n; i++) dot = add(dot, idx(idx(cached, K[i]), 1));
	return multiply(dot, divide(multiply(8.3100004196167, rd(src, GM.temperature6)), rd(src, GM.volume2)));
}

/** copy_from(sample): false = not the usual case (nothing was touched), run the translation. */
function copyFromFast(f: Frame, src: DMObject, sample0: Value): boolean {
	const sample = live(sample0);
	if (!(sample instanceof DMObject) || sample === src) return false;
	const cached = rd(src, GM.gases4), sg = rd(sample, GM.gases5);
	if (!(cached instanceof DMList) || !(sg instanceof DMList) || cached === sg) return false;
	wr(src, GM.temperature8, rd(sample, GM.temperature7));
	const K = sg.items; // the loop below changes only our list
	for (let i = 0, n = K.length; i < n; i++) {
		const id = K[i];
		assertGas(f, cached, id);
		vm.setIndex(idx(cached, id), 1, idx(idx(sg, id), 1));
	}
	if (!sameItems(cached, sg)) rt.modify(cached, sg, bitAnd); // cached_gases &= sample_gases
	return true;
}

/** copy_from_scaled(sample): copy_from(sample), then every gas's moles *= volume / sample.volume (reconcile_air's second loop). */
function copyFromScaled(f: Frame, src: DMObject, sample: Value): boolean {
	if (!is(src, "copy_from", gm.copy_from)) return false;
	if (!copyFromFast(f, src, sample)) return false;
	const sm = live(sample) as DMObject;
	const ratio = divide(rd(src, GM.volume3), rd(sm, GM.volume4));
	const cached = rd(src, GM.gases) as DMList;
	const K = cached.items;
	for (let i = 0, n = K.length; i < n; i++) {
		const gas = idx(cached, K[i]);
		vm.setIndex(gas, 1, multiply(idx(gas, 1), ratio));
	}
	return true;
}

/**
 * reconcile_from(GL), run on the pipeline's fresh total mixture: reconcile_air's two loops over the gas mixtures GL (add each
 * one's volume and merge it in, total up thermal energy and heat capacity, set the temperature, then give every mixture the
 * total's gases scaled by its volume share). False (nothing touched) = not the usual case, run the translation.
 */
function reconcileFrom(f: Frame, total: DMObject, GL: Value): boolean {
	if (!(GL instanceof DMList) || !is(total, "merge", gm.merge)) return false;
	const K = GL.items;
	const n = K.length;
	for (let i = 0; i < n; i++) if (!(live(K[i]) instanceof DMObject)) return false;
	let tte: Value = 0, thc: Value = 0;
	for (let i = 0; i < n; i++) {
		const G = live(K[i]) as DMObject;
		wr(total, GM.volume5, add(rd(total, GM.volume6), rd(G, GM.volume7)));
		if (mergeFast(f, total, G) === undefined) rt.callName(f, total, "merge", [G]);
		if (is(G, "thermal_energy", gm.thermal_energy) && is(G, "heat_capacity", gm.heat_capacity)) {
			const hc = heatCapacity(G); // thermal_energy() and heat_capacity() both give this (G doesn't change in between)
			tte = add(tte, multiply(rd(G, GM.temperature9), hc));
			thc = add(thc, hc);
		} else {
			tte = add(tte, rt.callName(f, G, "thermal_energy", []));
			thc = add(thc, callHeatCapacity(f, G));
		}
	}
	wr(total, GM.temperature10, truthy(thc) ? divide(tte, thc) : 0);
	if (!gt(rd(total, GM.volume8), 0)) return true;
	for (let i = 0; i < n; i++) {
		const G = live(K[i]) as DMObject;
		if (!copyFromScaled(f, G, total)) rt.callName(f, G, "copy_from_scaled", [total]);
	}
	return true;
}

// ---- install -----------------------------------------------------------------------------------------------

function enabled(): boolean {
	const g = globalThis as { process?: { env?: Record<string, string | undefined> }; FAST_AIR?: boolean };
	return g.process?.env?.FAST_AIR !== "0" && g.FAST_AIR !== false; // boot-worker sets FAST_AIR = false for ?fastair=0
}

/** Called at the end of rt.install: puts the stand-ins in for the translated procs. Returns how many. */
export function installFastAir(v: VM, only?: (id: number) => boolean): number {
	vm = v;
	if (!enabled()) return 0;
	const gt_ = v.tree.getType("/datum/gas_mixture"), tt = v.tree.getType("/turf/open"), et = v.tree.getType("/datum/excited_group");
	SSairIdx = v.tree.globalNames.indexOf("SSair");
	if (!gt_ || !tt || !et || SSairIdx < 0) return 0; // not tg (the DM tests' small worlds)
	gasType = gt_;
	egType = et;
	const get = (t: DMType, n: string): DMProc | undefined => {
		const p = t.procs.get(n);
		return p && (!only || only(p.id)) ? p : undefined;
	};
	gm = { heat_capacity: get(gt_, "heat_capacity"), archive: get(gt_, "archive"), share: get(gt_, "share"), compare: get(gt_, "compare"), react: get(gt_, "react"), after_share_base: gt_.procs.get("after_share"),
		merge: get(gt_, "merge"), return_pressure: get(gt_, "return_pressure"), copy_from: get(gt_, "copy_from"), copy_from_scaled: get(gt_, "copy_from_scaled"), reconcile_from: get(gt_, "reconcile_from"), thermal_energy: gt_.procs.get("thermal_energy") };
	gasListCacheIdx = v.tree.globalNames.indexOf("gaslist_cache");
	turf = { archive: get(tt, "archive"), update_visuals: get(tt, "update_visuals"), tile_graphic: tt.procs.get("tile_graphic"), process_cell: get(tt, "process_cell") };
	let n = 0;
	const put = (p: DMProc | undefined, fn: Function, gen: boolean): unknown => {
		if (!p) return undefined;
		n++;
		return rt.override(p, fn as never, gen);
	};
	// Plain procs: f.src is the gas mixture / turf.
	put(gm.heat_capacity, function heat_capacity(f: Frame) { return heatCapacity(f.src as DMObject); }, false);
	put(gm.archive, function archive(f: Frame) { return gasArchive(f.src as DMObject); }, false);
	origShare = put(gm.share, function share_(f: Frame, sharer: Value, n2: Value) { return share(f, f.src as DMObject, sharer, n2); }, false) as typeof origShare;
	origCompare = put(gm.compare, function compare_(f: Frame, sample: Value) { const r = compare(f.src as DMObject, sample); return r !== undefined ? r : origCompare(f, sample); }, false) as typeof origCompare;
	origReact = put(gm.react, function* react(f: Frame, dump: Value): Generator<any, Value, Value> { if (reactQuiet(f.src as DMObject)) return (f.dot = 0); return yield* origReact(f, dump); }, true) as typeof origReact;
	if (gasListCacheIdx >= 0) {
		const oMerge = put(gm.merge, function merge(f: Frame, giver: Value) { if (rt.traceHooked()) return oMerge!(f, giver); const r = mergeFast(f, f.src as DMObject, giver); return r !== undefined ? r : oMerge!(f, giver); }, false) as (f: Frame, a: Value) => Value;
		const oPress = put(gm.return_pressure, function return_pressure(f: Frame) { if (rt.traceHooked()) return oPress!(f); const r = returnPressureFast(f.src as DMObject); return r !== undefined ? r : oPress!(f); }, false) as (f: Frame) => Value;
		const oCopy = put(gm.copy_from, function copy_from(f: Frame, sample: Value) { if (rt.traceHooked() || !copyFromFast(f, f.src as DMObject, sample)) return oCopy!(f, sample); return 1; }, false) as (f: Frame, a: Value) => Value;
		const oScaled = put(gm.copy_from_scaled, function copy_from_scaled(f: Frame, sample: Value) { if (rt.traceHooked() || !copyFromScaled(f, f.src as DMObject, sample)) return oScaled!(f, sample); return f.dot; }, false) as (f: Frame, a: Value) => Value;
		const oRecon = put(gm.reconcile_from, function reconcile_from(f: Frame, GL: Value) { if (rt.traceHooked() || !reconcileFrom(f, f.src as DMObject, GL)) return oRecon!(f, GL); return f.dot; }, false) as (f: Frame, a: Value) => Value;
	}
	put(turf.archive, function archive(f: Frame) { turfArchive(f, f.src as DMObject); return f.dot; }, false);
	origUpdateVisuals = put(turf.update_visuals, function update_visuals(f: Frame) { return visualsQuiet(f.src as DMObject) ? f.dot : origUpdateVisuals(f); }, false) as typeof origUpdateVisuals;
	origProcessCell = put(turf.process_cell, processCell, true) as typeof origProcessCell;
	return n;
}
