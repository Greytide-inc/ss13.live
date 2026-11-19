// view-predict - What the page may do before the server says so (lag smoothing): the tiles the player's
// mover may walk to (predOf), mob swaps, pulled things, carried light, vehicles and mechs, and predicted
// pick-up and put-down. Split out of client-view.ts; ViewDiffer sends what these find with each update.

import type { VM } from "../vm/interpreter.js";
import { DMList, DMObject, live } from "../vm/objects.js";
import { DMType } from "../vm/objtree.js";
import { DMAtom, Kind } from "../vm/world.js";
import { resolveIconPath } from "../appearance/appearance.js";

// lag-smoothing step 4: where the page may move the player's own mob before the server says so. Only the plain case: a living mob standing
// on a turf it is the eye of, free to walk (tg's client/Move checks, as far as vars show them). A tile counts as free when it isn't space and
// nothing there is dense (a lying mob isn't) or a dense border object (a directional window, which blocks some ways: never guessed). The mob's
// own tile must have no dense border object either, or nothing is free. The page walks only between free tiles, diagonals only when both
// straight steps are free too (up to three steps ahead, so the 7x7 square around the mob).
export const PRED_R = 3, PRED_W = 2 * PRED_R + 1;
/** The view id of a mover the client doesn't see (the AI eye), in pred and moved. TILE_GLIDE: its glide size, a tile a tick (AIMove runs every tick). */
export const MOVER_ID = -1, TILE_GLIDE = 32;
const ON_BORDER = 512;
export const truthyVar = (o: DMObject, k: string): boolean => { const v = live(o.getVar(k)); return v !== null && v !== 0 && v !== "" && v !== undefined; };
function blocks(o: DMAtom, mob: DMAtom): boolean {
	if (o === mob || !truthyVar(o, "density")) return false;
	return !(o.kind === Kind.Mob && truthyVar(o, "lying"));
}
const borderDense = (t: DMAtom, mob: DMAtom): boolean => t.contents.some((o) => o !== mob && truthyVar(o, "density") && (Number(live(o.getVar("flags"))) & ON_BORDER) !== 0);
/** netcode 5: the pulled thing, when the page may move it along with predicted steps: on a turf of the mob's z within one tile of it, not anchored. */
export function pullOf(m: unknown): { o: DMAtom; ox: number; oy: number; dense: number } | null {
	if (!(m instanceof DMAtom) || !m.hasVar("pulling")) return null;
	const o = live(m.getVar("pulling")), t = m.loc;
	if (!(o instanceof DMAtom) || o.kind === Kind.Turf || !t || t.kind !== Kind.Turf || truthyVar(o, "anchored")) return null;
	const l = o.loc;
	if (!l || l.kind !== Kind.Turf || l.z !== t.z || Math.abs(l.x - t.x) > 1 || Math.abs(l.y - t.y) > 1) return null;
	return { o, ox: l.x - t.x, oy: l.y - t.y, dense: blocks(o, m) ? 1 : 0 };
}
/** Carried light: the mob's own light sources (a flashlight in hand, a lit PDA: tg moves them with their top_atom), as the page needs them
 *  to draw them where it draws the mob (live-light.ts). [mob id, the sources' applied turf minus the mob's (east+, north+),
 *  the number of sources and per source its light_power, light_range and applied_lum r, g, b (the page works out from those how strongly
 *  it lights a corner from where it draws the mob), then per corner they light: its offset from that turf in half tiles (odd) and r, g, b
 *  as it shows without them]; [] for none. That base is the corner's lum less effect_str[corner] * applied_lum per source (what
 *  update_lumcount added), scaled and rounded as update_objects does: a corner over 1 is scaled down, so the page can't work it out from
 *  what it shows. Sources applied on different turfs: none. */
export function carriedLightOf(m: unknown, mobId: number): number[] {
	if (!(m instanceof DMAtom) || m.kind !== Kind.Mob || !m.loc || m.loc.kind !== Kind.Turf) return [];
	const ls = live(m.getVar("light_sources"));
	if (!(ls instanceof DMList)) return [];
	let at: DMAtom | null = null;
	const sum = new Map<number, [number, number, number, number, number]>(), cornerOf = new Map<number, DMObject>(), srcs: number[] = [];
	for (const s of ls.items) {
		if (!(s instanceof DMObject) || live(s.getVar("top_atom")) !== m || !truthyVar(s, "applied")) continue;
		const pt = live(s.getVar("pixel_turf")), es = live(s.getVar("effect_str"));
		if (!(pt instanceof DMAtom) || !(es instanceof DMList) || !es.items.length) continue;
		if (at && at !== pt) return [];
		at = pt;
		const lr = Number(live(s.getVar("applied_lum_r"))) || 0, lg = Number(live(s.getVar("applied_lum_g"))) || 0, lb = Number(live(s.getVar("applied_lum_b"))) || 0;
		srcs.push(Number(live(s.getVar("light_power"))) || 0, Number(live(s.getVar("light_range"))) || 0, lr, lg, lb);
		for (const c of es.items) {
			if (!(c instanceof DMObject)) continue;
			const k = Number(live(es.assocOf(c) ?? null)) || 0;
			if (!k) continue;
			const cx = Math.round((Number(live(c.getVar("x"))) - pt.x) * 2), cy = Math.round((Number(live(c.getVar("y"))) - pt.y) * 2), key = cx * 1000 + cy;
			const e = sum.get(key) ?? [cx, cy, 0, 0, 0];
			cornerOf.set(key, c);
			e[2] += k * lr; e[3] += k * lg; e[4] += k * lb;
			sum.set(key, e);
		}
	}
	if (!at || at.z !== m.loc.z || !sum.size) return [];
	const out = [mobId, at.x - m.loc.x, at.y - m.loc.y, srcs.length / 5, ...srcs];
	const lum = (c: DMObject, k: string): number => Number(live(c.getVar(k))) || 0;
	for (const [key, e] of sum) {
		if (!(e[2] > 0 || e[3] > 0 || e[4] > 0)) continue;
		const c = cornerOf.get(key)!, br = Math.max(0, lum(c, "lum_r") - e[2]), bg = Math.max(0, lum(c, "lum_g") - e[3]), bb = Math.max(0, lum(c, "lum_b") - e[4]);
		const mx = Math.max(br, bg, bb), k = mx > 1 ? 1 / mx : 1, base = (v: number) => Math.round(v * k * 64) / 64; // update_objects: round(lum * k, 1/64)
		out.push(e[0], e[1], base(br), base(bg), base(bb));
	}
	return out.length > 4 + srcs.length ? out : [];
}
/** What a client's movement keys move, for the page to predict: its mob, the AI's eye while the AI looks through it (client/Move -> AIMove), or a
 *  camera console's eye while the client looks through it (remote_control -> relaymove). */
export function predMover(vm: VM, c: DMObject): DMAtom | null {
	const m = live(c.getVar("mob"));
	if (!(m instanceof DMAtom)) return null;
	const rc = m.hasVar("remote_control") ? live(m.getVar("remote_control")) : null;
	if (rc instanceof DMAtom && rc.type.path.startsWith("/mob/camera/aiEye/remote")) return live(c.getVar("eye")) === rc ? rc : null;
	if (m.loc && JAUNTS.some((p) => m.loc!.type.path.startsWith(p))) return m.loc; // a jaunt's dummy: client/Move -> relaymove moves it
	if (m.loc?.type.path.startsWith("/obj/mecha") && live(m.loc.getVar("occupant")) === m) return m.loc; // the mech you pilot: relaymove -> domove
	const b = m.hasVar("buckled") ? live(m.getVar("buckled")) : null;
	if (b instanceof DMAtom && b.type.path.startsWith("/obj/vehicle")) return b; // a vehicle you ride: relaymove -> its riding datum steps it
	if (!m.type.path.startsWith("/mob/living/silicon/ai")) return m;
	const eye = live(m.getVar("eyeobj"));
	return eye instanceof DMAtom && live(c.getVar("eye")) === eye ? eye : null;
}
/** The AI eye's run for the page: [sprint, acceleration] of its AI (AIMove moves the eye ceil(max(sprint, 10) / 20) tiles a step, sprint
 *  growing 0.5 a step up to 50 with acceleration on, back to 10 after half a second without a step); a camera console's eye keeps its own
 *  (remote relaymove, the same rule); null for anything else. */
export function predRunOf(mover: DMAtom | null): [number, number] | null {
	if (!mover?.type.path.startsWith("/mob/camera/aiEye")) return null;
	const ai = mover.type.path.startsWith("/mob/camera/aiEye/remote") ? mover : live(mover.getVar("ai")), s = ai instanceof DMObject ? live(ai.getVar("sprint")) : null;
	return ai instanceof DMObject && typeof s === "number" ? [s, truthyVar(ai, "acceleration") ? 1 : 0] : null;
}
/** The dummies a jaunting mob rides in (client/Move: the mob's loc is an obj -> its relaymove). spell_jaunt: the wizard's jaunt, onto any
 *  tile without NOJAUNT, then canmove off for 0.2 s (Clients.step waits for it: moverWait); slaughter: blood-crawl, forceMove anywhere. */
const JAUNTS = ["/obj/effect/dummy/spell_jaunt", "/obj/effect/dummy/slaughter"], NOJAUNT = 1;
/** client/Move's checks on the mob before it gets to relaymove (a dummy) or incorporeal_move: alive, not frozen, not held. */
const movesFree = (u: DMAtom, grab: boolean): boolean => live(u.getVar("stat")) !== 2 && ["notransform", "control_object", "force_moving", ...(grab ? ["pulledby", "buckled"] : [])].every((k) => !u.hasVar(k) || !truthyVar(u, k));
const areaIs = (vm: VM, t: DMAtom, path: string): boolean => { const a = live(vm.getField(t, "loc")); return a instanceof DMObject && a.type.path.startsWith(path); };
export function predOf(vm: VM, m: unknown, eyeTile: { x: number; y: number; z: number } | null): number {
	if (!(m instanceof DMAtom) || !eyeTile) return 0;
	const t = m.loc;
	if (!t || t.kind !== Kind.Turf || t.x !== eyeTile.x || t.y !== eyeTile.y || t.z !== eyeTile.z) return 0;
	const p = m.type.path;
	if (m.kind !== Kind.Mob && !JAUNTS.some((j) => p.startsWith(j)) && !p.startsWith("/obj/vehicle") && !p.startsWith("/obj/mecha")) return 0;
	const square = (ok: (n: DMAtom) => boolean): number => {
		let free = 0;
		for (let dy = -PRED_R; dy <= PRED_R; dy++) for (let dx = -PRED_R; dx <= PRED_R; dx++) { const n = vm.map.turfAt(t.x + dx, t.y + dy, t.z); if (n && ok(n)) free += 2 ** ((dy + PRED_R) * PRED_W + dx + PRED_R); }
		return free;
	};
	if (p.startsWith("/mob/dead/observer")) { // a ghost's Move never refuses a tile that exists; orbiting and following are moved by the server
		if (truthyVar(m, "orbiting")) return 0;
		return square(() => true);
	}
	if (p.startsWith("/mob/camera/aiEye/remote")) { // a camera console's eye: client/Move -> relaymove -> setLoc, while its user stands on a turf
		const u = live(m.getVar("eye_user"));
		if (!(u instanceof DMAtom) || u.kind !== Kind.Mob || !u.type.path.startsWith("/mob/living") || u.loc?.kind !== Kind.Turf || live(u.getVar("remote_control")) !== m || live(u.getVar("stat")) === 2) return 0;
		for (const k of ["notransform", "control_object", "force_moving", "incorporeal_move"]) if (u.hasVar(k) && truthyVar(u, k)) return 0;
		const setLoc = procFrom(m, "setLoc"), areaOk = (ok: (a: DMObject) => boolean) => (n: DMAtom): boolean => { const a = live(vm.getField(n, "loc")); return a instanceof DMObject && ok(a); };
		if (setLoc === "/mob/camera/aiEye/remote/xenobio") { // only in the area it was made in, or xenobiology
			const name = live(m.getVar("allowed_area"));
			return square(areaOk((a) => live(a.getVar("name")) === name || a.type.path.startsWith("/area/science/xenobiology")));
		}
		if (setLoc === "/mob/camera/aiEye/remote/base_construction") { // the aux base drone: its starting area, or the aux base itself
			const start = live(m.getVar("starting_area"));
			return square(areaOk((a) => a === start || a.type.path.startsWith("/area/shuttle/auxillary_base")));
		}
		return setLoc === "/mob/camera/aiEye/remote" || setLoc === "/mob/camera/aiEye/remote/holo" ? square(() => true) : 0; // holo: moves, then the hologram follows
	}
	if (p.startsWith("/mob/camera/aiEye")) { // AIMove: setLoc onto any tile that exists, while the AI is on a turf (not carded) and alive
		const ai = live(m.getVar("ai"));
		if (!(ai instanceof DMAtom) || ai.loc?.kind !== Kind.Turf || live(ai.getVar("stat")) === 2 || truthyVar(ai, "notransform")) return 0;
		return square(() => true);
	}
	if (p.startsWith("/mob/camera/blob")) { // /mob/camera/blob/Move: placed, only next to a blob (range 3x3); before that, anywhere but space and shuttles
		if (truthyVar(m, "notransform")) return 0;
		if (!truthyVar(m, "placed")) return square((n) => !n.type.path.startsWith("/turf/open/space") && !areaIs(vm, n, "/area/shuttle"));
		const blob = new Set<number>(); // tiles within PRED_R + 1 holding a blob
		for (let dy = -PRED_R - 1; dy <= PRED_R + 1; dy++) for (let dx = -PRED_R - 1; dx <= PRED_R + 1; dx++) {
			const n = vm.map.turfAt(t.x + dx, t.y + dy, t.z);
			if (n?.contents.some((o) => o.type.path.startsWith("/obj/structure/blob"))) blob.add(n.x + n.y * 65536);
		}
		return square((n) => { for (let y = -1; y <= 1; y++) for (let x = -1; x <= 1; x++) if (blob.has(n.x + x + (n.y + y) * 65536)) return true; return false; });
	}
	if (p.startsWith("/obj/vehicle")) return vehicleFree(vm, m, t);
	if (p.startsWith("/obj/mecha")) return mechFree(vm, m, t);
	if (m.kind === Kind.Obj) { // a jaunt's dummy, with the mob inside
		const u = m.contents.find((o) => o.kind === Kind.Mob && o.type.path.startsWith("/mob/living"));
		if (!u || !movesFree(u, true) || !truthyVar(u, "canmove") || (u.hasVar("incorporeal_move") && truthyVar(u, "incorporeal_move")) || (u.hasVar("remote_control") && truthyVar(u, "remote_control"))) return 0;
		if (p.startsWith("/obj/effect/dummy/slaughter")) return square(() => true);
		return truthyVar(m, "reappearing") ? 0 : square((n) => !(Number(live(n.getVar("flags"))) & NOJAUNT));
	}
	if (p.startsWith("/mob/living/") && m.hasVar("incorporeal_move") && truthyVar(m, "incorporeal_move")) { // Process_Incorpmove: before the grab, buckle, canmove and space checks
		if (!movesFree(m, false)) return 0;
		const mode = live(m.getVar("incorporeal_move"));
		if (mode === 1) return square(() => true); // anywhere (Poly's ghost, the spooky ghost costume, a scouting guardian)
		if (mode === 3) return square((n) => !(Number(live(n.getVar("flags"))) & NOJAUNT) && !n.contents.some((o) => o.type.path.startsWith("/obj/effect/decal/cleanable/salt"))); // a revenant
		return 0; // 2, the ninja's: half its steps jump two tiles at random
	}
	if (!p.startsWith("/mob/living/") || p.startsWith("/mob/living/silicon/ai") || t.type.path.startsWith("/turf/open/space")) return 0;
	if (!truthyVar(m, "canmove") || live(m.getVar("stat")) === 2) return 0;
	for (const k of ["buckled", "notransform", "control_object", "remote_control", "pulledby", "incorporeal_move", "confused", "throwing", "force_moving"]) if (m.hasVar(k) && truthyVar(m, k)) return 0;
	return walkFree(vm, m, t, [m]);
}
/** The walking square: the tiles round t that mover m (riders `skip` too) could surely step onto, not space; 0 when none. */
function walkFree(vm: VM, m: DMAtom, t: DMAtom, skip: DMAtom[]): number {
	if (t.contents.some((o) => !skip.includes(o) && truthyVar(o, "density") && (Number(live(o.getVar("flags"))) & ON_BORDER) !== 0)) return 0;
	const self = 2 ** (PRED_R * PRED_W + PRED_R);
	let free = self;
	for (let dy = -PRED_R; dy <= PRED_R; dy++) for (let dx = -PRED_R; dx <= PRED_R; dx++) {
		if (!dx && !dy) continue;
		const n = vm.map.turfAt(t.x + dx, t.y + dy, t.z);
		if (!n || truthyVar(n, "density") || n.type.path.startsWith("/turf/open/space") || n.contents.some((o) => !skip.includes(o) && blocks(o, m)) || borderDense(n, m)) continue;
		free += 2 ** ((dy + PRED_R) * PRED_W + dx + PRED_R);
	}
	return free === self ? 0 : free;
}
/** Mob swap: the mobs round your mob (within PRED_R) that a straight step into would swap places with (/mob/living/MobBump): both on help
 *  intent, neither buckled nor carrying riders, neither pulling anything nor pulled, the swapped one the only thing that blocks its tile, and
 *  that tile free otherwise. [mob, its tile minus yours (east+, north+)]. Restrained mobs (who swap on any intent) aren't guessed, nor diagonal
 *  steps (MobBump refuses them: moving_diagonally). Empty when the page may not predict your mob walking (free 0). */
export function swapOf(vm: VM, m: unknown, free: number): [DMAtom, number, number][] {
	if (!free || !(m instanceof DMAtom) || m.kind !== Kind.Mob || !m.type.path.startsWith("/mob/living/") || !m.loc || m.loc.kind !== Kind.Turf) return [];
	const easy = (o: DMAtom): boolean => {
		const riders = o.hasVar("buckled_mobs") ? live(o.getVar("buckled_mobs")) : null;
		return live(o.getVar("a_intent")) === "help" && ["buckled", "pulling", "pulledby"].every((k) => !o.hasVar(k) || !truthyVar(o, k)) && !(riders instanceof DMList && riders.items.length);
	};
	if (!easy(m) || (m.hasVar("incorporeal_move") && truthyVar(m, "incorporeal_move"))) return []; // a revenant walks through them
	const t = m.loc, out: [DMAtom, number, number][] = [];
	for (let dy = -PRED_R; dy <= PRED_R; dy++) for (let dx = -PRED_R; dx <= PRED_R; dx++) {
		if (!dx && !dy) continue;
		const n = vm.map.turfAt(t.x + dx, t.y + dy, t.z);
		if (!n || truthyVar(n, "density") || n.type.path.startsWith("/turf/open/space") || borderDense(n, m)) continue;
		const bl = n.contents.filter((o) => blocks(o, m));
		if (bl.length === 1 && bl[0].kind === Kind.Mob && easy(bl[0])) out.push([bl[0], dx, dy]);
	}
	return out;
}
/** A vehicle the client's mob rides (/obj/vehicle relaymove -> /datum/riding handle_ride): the rider not incapacitated (no stun, knockdown,
 *  sleep or restraints), its key in hand (keycheck), gravity where the vehicle is (Process_Spacemove), then step(): the walking square, the
 *  riders not in the way. Vehicles or riding datums with their own relaymove/handle_ride/keycheck (the lava boat) aren't guessed. */
function vehicleFree(vm: VM, v: DMAtom, t: DMAtom): number {
	const rd = live(v.getVar("riding_datum")), riders = live(v.getVar("buckled_mobs"));
	if (!(rd instanceof DMObject) || !(riders instanceof DMList) || procFrom(v, "relaymove") !== "/obj/vehicle") return 0;
	if (procFrom(rd, "handle_ride") !== "/datum/riding" || procFrom(rd, "keycheck") !== "/datum/riding" || procFrom(rd, "Process_Spacemove") !== "/datum/riding") return 0;
	const rs = riders.items.map((x) => live(x)).filter((x): x is DMAtom => x instanceof DMAtom);
	const u = rs.find((r) => r.type.path.startsWith("/mob/living/carbon/human"));
	if (!u || !movesFree(u, false) || live(u.getVar("stat")) !== 0 || truthyVar(u, "pulledby") || truthyVar(u, "handcuffed")) return 0;
	const se = live(u.getVar("status_effects")), suit = live(u.getVar("wear_suit"));
	if (se instanceof DMList && se.items.some((x) => { const e = live(x); return e instanceof DMObject && e.type.path.startsWith("/datum/status_effect/incapacitating"); })) return 0;
	if (suit instanceof DMObject && truthyVar(suit, "breakouttime")) return 0;
	const key = live(rd.getVar("keytype")), held = live(u.getVar("held_items"));
	if (key instanceof DMType && !(held instanceof DMList && held.items.some((x) => { const h = live(x); return h instanceof DMObject && h.type.isSubtypeOf(key); }))) return 0;
	if (!hasGravity(vm, t)) return 0;
	return walkFree(vm, v, t, rs);
}
/** A mech the client's mob pilots (/obj/mecha relaymove -> domove): the pilot free to move (canmove, as client/Move wants before relaymove),
 *  not connected to a port, not in maintenance, defence or zoom mode, its controls not lost (MECHA_INT_CONTROL_LOST: random steps), a cell
 *  with a step's charge, gravity where it stands (thrusters and push-offs not guessed), then step(): the walking square. Not phasing (a
 *  phazon walks through walls) and no bump-smashing: those tiles stay blocked. Mechs with their own relaymove/domove/mechstep aren't guessed. */
const MECHA_INT_CONTROL_LOST = 16;
function mechFree(vm: VM, me: DMAtom, t: DMAtom): number {
	const u = live(me.getVar("occupant")), cell = live(me.getVar("cell"));
	if (!(u instanceof DMAtom) || !movesFree(u, true) || !truthyVar(u, "canmove") || (u.hasVar("remote_control") && truthyVar(u, "remote_control"))) return 0;
	if (["relaymove", "domove", "mechstep", "mechturn"].some((k) => procFrom(me, k) !== "/obj/mecha")) return 0;
	for (const k of ["connected_port", "state", "defence_mode", "zoom_mode", "phasing"]) if (me.hasVar(k) && truthyVar(me, k)) return 0;
	if (Number(live(me.getVar("internal_damage"))) & MECHA_INT_CONTROL_LOST) return 0;
	if (!(cell instanceof DMObject) || !(Number(live(cell.getVar("charge"))) >= Number(live(me.getVar("step_energy_drain"))))) return 0;
	return hasGravity(vm, t) ? walkFree(vm, me, t, []) : 0;
}
/** With pred: 1 when a key in a direction the mover doesn't face only turns it (a mech that isn't strafing: domove -> mechturn), else 0. */
export function predTurnOf(mover: DMAtom | null): number {
	return mover?.type.path.startsWith("/obj/mecha") && !truthyVar(mover, "strafe") ? 1 : 0;
}
/** /atom/proc/has_gravity on a turf: not space, and its area has gravity or a gravity generator runs on its z. */
function hasGravity(vm: VM, t: DMAtom): boolean {
	if (t.type.path.startsWith("/turf/open/space")) return false;
	const a = live(vm.getField(t, "loc"));
	if (a instanceof DMObject && truthyVar(a, "has_gravity")) return true;
	const gi = vm.tree.globalNames.indexOf("gravity_generators"), gens = gi < 0 ? null : live(vm.globals[gi] as never) as unknown;
	const z = gens instanceof DMList ? live((gens.assocOf(String(t.z)) ?? null) as never) as unknown : null;
	return z instanceof DMList && z.len > 0;
}
export const procFrom = (o: DMObject, name: string): string | undefined => o.type.procs.get(name)?.owner.path;
const PREVENT_CLICK_UNDER = 32768, ON_FIRE = 8;
/** Predicted pick-up: the items on turfs within PRED_R of mob `m` that a plain left click with the empty active hand would surely pick up,
 *  bar the reach (the page checks it from where it draws the mob) and next_move. As tg runs it: ClickOn (not incapacitated, restrained,
 *  in throw mode or in a locker) -> human UnarmedAttack (a hand there, no gloves' Touch or mutation taking over) -> /obj/item attack_hand (not
 *  anchored, burning, acid on it or flying) -> put_in_active_hand (not lying). Items with their own attack_hand (storage, two-handed...) aren't
 *  listed. [item, its tile minus the mob's (east+, north+), in-hand icon, state (update_inv_hands: lefthand_file for an odd hand index,
 *  righthand_file for an even one; item_state, else icon_state)][]. */
export function pickOf(vm: VM, m: unknown): [DMAtom, number, number, string, string][] {
	if (!(m instanceof DMAtom) || m.kind !== Kind.Mob || !m.type.path.startsWith("/mob/living/carbon/human")) return [];
	const t = m.loc;
	if (!t || t.kind !== Kind.Turf || procFrom(m, "ClickOn") !== "/mob" || procFrom(m, "UnarmedAttack") !== "/mob/living/carbon/human") return [];
	if (live(m.getVar("stat")) !== 0 || !truthyVar(m, "canmove") || truthyVar(m, "lying") || truthyVar(m, "handcuffed") || truthyVar(m, "in_throw_mode") || truthyVar(m, "pulledby")) return [];
	const suit = live(m.getVar("wear_suit")), gloves = live(m.getVar("gloves")), dna = live(m.getVar("dna"));
	if (suit instanceof DMObject && truthyVar(suit, "breakouttime")) return [];
	if (gloves instanceof DMObject && procFrom(gloves, "Touch") !== "/obj/item/clothing/gloves") return [];
	const muts = dna instanceof DMObject ? live(dna.getVar("mutations")) : null;
	if (muts instanceof DMList && muts.items.some((x) => { const u = live(x); return u instanceof DMObject && procFrom(u, "on_attack_hand") !== "/datum/mutation/human"; })) return [];
	const hand = Number(live(m.getVar("active_hand_index"))), held = live(m.getVar("held_items")), hands = live(m.getVar("hand_bodyparts"));
	if (!(held instanceof DMList) || !(hands instanceof DMList) || !(hand >= 1) || live(held.items[hand - 1] ?? null) !== null || !(live(hands.items[hand - 1] ?? null) instanceof DMObject)) return [];
	const out: [DMAtom, number, number, string, string][] = [];
	for (let dy = -PRED_R; dy <= PRED_R; dy++) for (let dx = -PRED_R; dx <= PRED_R; dx++) {
		const n = vm.map.turfAt(t.x + dx, t.y + dy, t.z);
		if (!n) continue;
		for (const o of n.contents) {
			if (o.kind !== Kind.Obj || !o.type.path.startsWith("/obj/item") || procFrom(o, "attack_hand") !== "/obj/item") continue;
			if (truthyVar(o, "anchored") || truthyVar(o, "throwing") || (Number(live(o.getVar("resistance_flags"))) & ON_FIRE) || Number(live(o.getVar("acid_level"))) > 20) continue;
			const layer = Number(live(o.getVar("layer"))); // IsObscured: a dense PREVENT_CLICK_UNDER thing above it (a door, a full-tile window)
			if (n.contents.some((b) => b !== o && (Number(live(b.getVar("flags"))) & PREVENT_CLICK_UNDER) && truthyVar(b, "density") && Number(live(b.getVar("layer"))) > layer)) continue;
			const file = resolveIconPath(o.getVar(hand % 2 === 0 ? "righthand_file" : "lefthand_file")), st = live(o.getVar("item_state")) || live(o.getVar("icon_state"));
			out.push([o, dx, dy, file ?? "", typeof st === "string" ? st : ""]);
		}
	}
	return out;
}
const NODROP = 2, ABSTRACT = 128, DROPDEL = 16384, NODECONSTRUCT = 128; // NODECONSTRUCT on structures, ABSTRACT on items: the same bit
/** Predicted put-down: what the item in the active hand of mob `m` would surely do, or null. drop: the drop key (client/Northwest -> drop_item:
 *  doUnEquip puts it on the mob's tile at its initial layer and plane). on: the tables and racks on turfs within PRED_R that a plain left click
 *  with it would put it on (ClickOn -> melee_attack_chain -> table/rack attackby: not harm intent, no tool that takes them apart, not a full tray),
 *  bar the reach (the page checks it) and next_move; a table centres it on the click (centre 1). As pickOf: storage, ABSTRACT, NODROP and DROPDEL
 *  items aren't guessed. */
export function putOf(vm: VM, m: unknown): { item: DMObject; layer: number; plane: number; icon: string; state: string; on: [DMAtom, number, number, number][] } | null {
	if (!(m instanceof DMAtom) || m.kind !== Kind.Mob || !m.type.path.startsWith("/mob/living/carbon/human")) return null;
	const t = m.loc;
	if (!t || t.kind !== Kind.Turf || procFrom(m, "ClickOn") !== "/mob" || procFrom(t, "allow_drop") !== "/atom") return null;
	if (live(m.getVar("stat")) !== 0 || !truthyVar(m, "canmove") || truthyVar(m, "handcuffed") || truthyVar(m, "in_throw_mode") || truthyVar(m, "pulledby")) return null;
	const suit = live(m.getVar("wear_suit"));
	if (suit instanceof DMObject && truthyVar(suit, "breakouttime")) return null;
	const hand = Number(live(m.getVar("active_hand_index"))), held = live(m.getVar("held_items")), I = held instanceof DMList && hand >= 1 ? live(held.items[hand - 1] ?? null) : null;
	if (!(I instanceof DMObject) || !I.type.path.startsWith("/obj/item") || I.type.path.startsWith("/obj/item/weapon/storage/bag/tray") || (Number(live(I.getVar("flags"))) & (NODROP | ABSTRACT | DROPDEL))) return null;
	const file = resolveIconPath(I.getVar(hand % 2 === 0 ? "righthand_file" : "lefthand_file")), st = live(I.getVar("item_state")) || live(I.getVar("icon_state"));
	const out = { item: I, layer: Number(vm.initialOf(I, "layer")), plane: Number(vm.initialOf(I, "plane")), icon: file ?? "", state: typeof st === "string" ? st : "", on: [] as [DMAtom, number, number, number][] };
	if (live(m.getVar("a_intent")) === "harm" || procFrom(I, "melee_attack_chain") !== "/obj/item" || procFrom(I, "pre_attackby") !== "/obj/item") return out;
	const p = I.type.path, isTool = p.startsWith("/obj/item/weapon/wrench") || p.startsWith("/obj/item/weapon/screwdriver");
	for (let dy = -PRED_R; dy <= PRED_R; dy++) for (let dx = -PRED_R; dx <= PRED_R; dx++) {
		const n = vm.map.turfAt(t.x + dx, t.y + dy, t.z);
		if (!n) continue;
		for (const o of n.contents) {
			const by = o.kind === Kind.Obj ? procFrom(o, "attackby") : undefined;
			let centre: number;
			if (by === "/obj/structure/table" || (by === "/obj/structure/table/reinforced" && !p.startsWith("/obj/item/weapon/weldingtool"))) {
				if (isTool && truthyVar(o, "deconstruction_ready") && !(Number(live(o.getVar("flags"))) & NODECONSTRUCT)) continue;
				centre = 1;
			} else if (by === "/obj/structure/rack") {
				if (p.startsWith("/obj/item/weapon/wrench") && !(Number(live(o.getVar("flags"))) & NODECONSTRUCT)) continue;
				centre = 0;
			} else continue;
			const layer = Number(live(o.getVar("layer"))); // IsObscured, as pickOf
			if (n.contents.some((b) => b !== o && (Number(live(b.getVar("flags"))) & PREVENT_CLICK_UNDER) && truthyVar(b, "density") && Number(live(b.getVar("layer"))) > layer)) continue;
			out.on.push([o, dx, dy, centre]);
		}
	}
	return out;
}
