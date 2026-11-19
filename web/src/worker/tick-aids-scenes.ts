// tick-aids-scenes - the boot worker's one-shot scene aids (?ride, ?crew, ?shoot, ?shake, ?goto, ?setup, ?lie), moved out of tick-aids.ts makeTickAids.
// Each make...(ctx) holds its own state and returns the step run once per tick.

import { DMList, DMObject, live } from "../vm/objects.js";
import { stringify } from "../vm/value.js";
import type { TickAidsCtx } from "./tick-aids.js";

export function makeRide(ctx: TickAidsCtx) {
	let rideDone = false;
	return () => {
		const { opts, vm, log, firstC } = ctx;
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
	};
}

export function makeCrew(ctx: TickAidsCtx) {
	let crewStep = 0, crewAt = -1, crewCon: DMObject | null = null;
	return () => {
		const { opts, vm, log, firstC } = ctx;
		const { joinAt, ticks } = ctx;
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
	};
}

export function makeShoot(ctx: TickAidsCtx) {
	let shootAt = -1, shootN = 0, shootCase: DMObject | null = null;
	return () => {
		const { opts, vm, log, firstC } = ctx;
		const { joinAt, ticks } = ctx;
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
	};
}

export function makeShake(ctx: TickAidsCtx) {
	let shakeN = 0, shakeT0 = -1;
	return () => {
		const { opts, vm, log, firstC } = ctx;
		const { joinAt, ticks } = ctx;
		if (opts.shake && shakeN < 3 && ticks > joinAt + 100) { // ss1 test aid: ?shake=1 calls tg's shake_camera on the player three times, 8 s apart (duration 10 strength 1, 15/2, 25/4: 1, 1.5 and 2.5 s)
			const c = firstC(), mob = live(c?.getVar("mob")), p = vm.tree.globalProcs.get("shake_camera");
			if (c && mob instanceof DMObject && p && (shakeN === 0 || vm.sched.time >= shakeT0 + 80)) {
				const [d, st] = [[10, 1], [15, 2], [25, 4]][shakeN++];
				shakeT0 = vm.sched.time;
				vm.call(p, [mob, d, st]);
				log(`[vm-boot] shake: shake_camera(player, ${d}, ${st}) ${shakeN}/3, world.time ${vm.sched.time}`);
			}
		}
	};
}

export function makeGoto(ctx: TickAidsCtx) {
	let gotoDone = false;
	return () => {
		const { opts, vm, log, firstC } = ctx;
		const { joinAt, ticks } = ctx;
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
	};
}

export function makeSetup(ctx: TickAidsCtx) {
	let setupDone = false;
	return () => {
		const { opts, vm, log, firstC } = ctx;
		const { joinAt, ticks } = ctx;
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
	};
}

export function makeLie(ctx: TickAidsCtx) {
	let lieDone = false;
	return () => {
		const { opts, vm, log, firstC } = ctx;
		const { joinAt, ticks } = ctx;
		if (opts.lie && !lieDone && ticks > joinAt + 100) { // Test aid: ?lie=1 has the player's mob rest (lay_down), i.e. lie 90 degrees
			const mob = live(firstC()?.getVar("mob"));
			if (mob instanceof DMObject) {
				lieDone = true;
				const ch = live(mob.getVar("buckled")); // spawn seats the player in a shuttle chair; a buckled mob doesn't lie
				if (ch instanceof DMObject) vm.call(ch.type.procs.get("unbuckle_mob")!, [mob, 1], ch, mob);
				vm.call(mob.type.procs.get("lay_down")!, [], mob, mob); log(`[vm-boot] lie: ${mob.type.path} lay_down, world.time ${vm.sched.time}`);
			}
		}
	};
}
