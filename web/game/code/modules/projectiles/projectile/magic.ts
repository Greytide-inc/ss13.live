// From code/modules/projectiles/projectile/magic.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8904, "/obj/item/projectile/magic/death", "/obj/item/projectile/magic", {
	name: "bolt of death",
	icon_state: "pulse1_bl",
});

// /obj/item/projectile/magic/death/proc/on_hit  (code/modules/projectiles/projectile/magic.dm:15)  may sleep
rt.def("/obj/item/projectile/magic/death/proc/on_hit", function* on_hit(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [live(f.args[0])])))) return f.dot;
	yield* g.callName(f, (M = live(f.args[0])), "death", [0]);
	return f.dot;
}, true, { args: ["target"] });

rt.type(8905, "/obj/item/projectile/magic/resurrection", "/obj/item/projectile/magic", {
	damage: 0,
	damage_type: "oxy",
	nodamage: 1,
	name: "bolt of resurrection",
	icon_state: "ion",
});

// /obj/item/projectile/magic/resurrection/proc/on_hit  (code/modules/projectiles/projectile/magic.dm:28)  may sleep
rt.def("/obj/item/projectile/magic/resurrection/proc/on_hit", function* on_hit(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) return f.dot;
	if (truthy(rt.fv(f, "hellbound", live(f.args[0])))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		yield* g.callName(f, (C = live(f.args[0])), "regenerate_limbs", []);
		yield* g.callName(f, live(C), "regenerate_organs", []);
	}
	if (truthy((yield* g.callName(f, live(f.args[0]), "revive", ["full_heal", 1], rt.Args.Named)))) {
		yield* g.callName(f, live(f.args[0]), "grab_ghost", ["force", 1], rt.Args.Named);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>You rise with a start, you're alive!!!</span>"]);
	} else {
		if (isEqual(rt.fv(f, "stat", live(f.args[0])), 2)) return f.dot;
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>You feel great!</span>"]);
	}
	return f.dot;
}, true, { args: ["target"] });

rt.type(8906, "/obj/item/projectile/magic/teleport", "/obj/item/projectile/magic", {
	inner_tele_radius: 0,
	outer_tele_radius: 6,
	damage: 0,
	damage_type: "oxy",
	nodamage: 1,
	name: "bolt of teleportation",
	icon_state: "bluespace",
});

// /obj/item/projectile/magic/teleport/proc/on_hit  (code/modules/projectiles/projectile/magic.dm:52)  may sleep
rt.def("/obj/item/projectile/magic/teleport/proc/on_hit", function* on_hit(f: Frame) {
	let teleammount: Value = null, teleloc: Value = null, stuff: Value = null, smoke: Value = null;
	let $e: any;
	f.vars = () => [teleammount, teleloc, stuff, smoke, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	teleammount = 0;
	teleloc = live(f.args[0]);
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [live(f.args[0])])))) {
		teleloc = rt.fv(f, "loc", live(f.args[0]));
	}
	stuff = null;
	rt.forList(f, 0, live(teleloc), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		stuff = $e;
		if ((!truthy(rt.fv(f, "anchored", live(stuff))) && truthy(rt.fv(f, "loc", live(stuff))))) {
			if (truthy((yield* g.call(f, P("/proc/do_teleport"), null, [live(stuff), live(stuff), 10])))) {
				teleammount = rt.inc(live(teleammount), 1);
				yield* g.callName(f, (smoke = (yield* g.new_(f, T("/datum/effect_system/smoke_spread"), []))), "set_up", [(yield* g.call(f, P("/proc/max"), null, [(yield* g.call(f, P("/proc/round"), null, [subtract(4, live(teleammount))])), 0])), rt.fv(f, "loc", live(stuff))]);
				yield* g.callName(f, live(smoke), "start", []);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["target"] });

rt.type(8907, "/obj/item/projectile/magic/door", "/obj/item/projectile/magic", {
	door_types: null,
	damage: 0,
	damage_type: "oxy",
	nodamage: 1,
	name: "bolt of door creation",
	icon_state: "energy",
});

// /obj/item/projectile/magic/door/proc/<init>  (code/modules/projectiles/projectile/magic.dm:71)
rt.def("/obj/item/projectile/magic/door/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "door_types", rt.list(T("/obj/structure/mineral_door/wood"), T("/obj/structure/mineral_door/iron"), T("/obj/structure/mineral_door/silver"), T("/obj/structure/mineral_door/gold"), T("/obj/structure/mineral_door/uranium"), T("/obj/structure/mineral_door/sandstone"), T("/obj/structure/mineral_door/transparent/plasma"), T("/obj/structure/mineral_door/transparent/diamond")));
	return f.dot;
});

// /obj/item/projectile/magic/door/proc/on_hit  (code/modules/projectiles/projectile/magic.dm:77)  may sleep
rt.def("/obj/item/projectile/magic/door/proc/on_hit", function* on_hit(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy((rt.istype(live(f.args[0]), T("/obj/machinery/door")) ? 1 : 0))) {
		yield* g.srcCall(f, "OpenDoor", live(f.args[0]));
	} else {
		if (!(truthy((rt.istype((_T = rt.getStep(f, live(f.args[0]), 0)), T("/turf/closed")) ? 1 : 0)) && !truthy((rt.istype(live(_T), T("/turf/closed/indestructible")) ? 1 : 0)))) return f.dot;
		yield* g.srcCall(f, "CreateDoor", live(_T));
	}
	return f.dot;
}, true, { args: ["target"] });

// /obj/item/projectile/magic/door/proc/CreateDoor  (code/modules/projectiles/projectile/magic.dm:86)  may sleep
rt.def("/obj/item/projectile/magic/door/proc/CreateDoor", function* CreateDoor(f: Frame, _T: Value) {
	let door_type: Value = null, D: Value = null;
	f.vars = () => [_T, door_type, D];
	door_type = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "door_types")]);
	D = (yield* g.new_(f, live(door_type), [live(_T)]));
	yield* g.callName(f, live(_T), "ChangeTurf", [T("/turf/open/floor/plating")]);
	yield* g.callName(f, live(D), "Open", []);
	return f.dot;
}, true);

// /obj/item/projectile/magic/door/proc/OpenDoor  (code/modules/projectiles/projectile/magic.dm:92)  may sleep
rt.def("/obj/item/projectile/magic/door/proc/OpenDoor", function* OpenDoor(f: Frame, D: Value) {
	let A: Value = null;
	f.vars = () => [D, A];
	if (truthy((rt.istype(live(D), T("/obj/machinery/door/airlock")) ? 1 : 0))) {
		rt.setFv(f, "locked", (A = live(D)), 0);
	}
	yield* g.callName(f, live(D), "open", []);
	return f.dot;
}, true);

rt.type(8908, "/obj/item/projectile/magic/change", "/obj/item/projectile/magic", {
	damage: 0,
	damage_type: "fire",
	nodamage: 1,
	name: "bolt of change",
	icon_state: "ice_1",
});

// /obj/item/projectile/magic/change/proc/on_hit  (code/modules/projectiles/projectile/magic.dm:105)  may sleep
rt.def("/obj/item/projectile/magic/change/proc/on_hit", function* on_hit(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.call(f, P("/proc/wabbajack"), null, [live(f.args[0])]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["change"] });

// /proc/wabbajack  (code/modules/projectiles/projectile/magic.dm:110)  may sleep
rt.def("/proc/wabbajack", function* wabbajack(f: Frame, M: Value) {
	let contents: Value = null, Robot: Value = null, W: Value = null, new_mob: Value = null, randomize: Value = null, robot: Value = null, path: Value = null, Robot_4: Value = null, path_3: Value = null, beast: Value = null, animal: Value = null, A: Value = null, H: Value = null, all_species: Value = null, speciestype: Value = null, S: Value = null, W_3: Value = null;
	let $0: any, $e: any;
	f.vars = () => [M, contents, Robot, W, new_mob, randomize, robot, path, Robot_4, path_3, beast, animal, A, H, all_species, speciestype, S, W_3, $0, $e];
	if ((((!truthy((rt.istype(live(M), T("/mob/living")) ? 1 : 0)) || isEqual(rt.fv(f, "stat", live(M)), 2)) || truthy(rt.fv(f, "notransform", live(M)))) || truthy(rt.bitAnd(4096, rt.fv(f, "status_flags", live(M)))))) {
		return live(f.dot);
	}
	rt.setFv(f, "notransform", live(M), 1);
	rt.setFv(f, "canmove", live(M), 0);
	rt.setFv(f, "icon", live(M), null);
	yield* g.callName(f, live(M), "cut_overlays", []);
	rt.setFv(f, "invisibility", live(M), 101);
	contents = (yield* g.callName(f, rt.fv(f, "contents", live(M)), "Copy", []));
	if (truthy((rt.istype(live(M), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "mmi", (Robot = live(M))))) {
			yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "mmi", live(Robot))]);
		}
		yield* g.callName(f, live(Robot), "notify_ai", [1]);
	} else {
		W = null;
		rt.forList(f, 0, live(contents), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			W = $e;
			if (!truthy((yield* g.callName(f, live(M), "dropItemToGround", [live(W)])))) {
				yield* g.call(f, P("/proc/qdel"), null, [live(W)]);
			}
		}
		rt.endFor(f, 0);
	}
	new_mob = null;
	$0 = (randomize = rt.op(f, "PickUnweighted", [6], ["monkey", "robot", "slime", "xeno", "humanoid", "animal"]));
	if ($0 === "monkey") {
		new_mob = (yield* g.new_(f, T("/mob/living/carbon/monkey"), [rt.fv(f, "loc", live(M))]));
	} else if ($0 === "robot") {
		$0 = (robot = rt.op(f, "PickUnweighted", [3], ["cyborg", "syndiborg", "drone"]));
		if ($0 === "cyborg") {
			new_mob = (yield* g.new_(f, T("/mob/living/silicon/robot"), [rt.fv(f, "loc", live(M))]));
		} else if ($0 === "syndiborg") {
			path = null;
			if (truthy(rt.op(f, "Prob", [], [50]))) {
				path = T("/mob/living/silicon/robot/syndicate");
			} else {
				path = T("/mob/living/silicon/robot/syndicate/medical");
			}
			new_mob = (yield* g.new_(f, live(path), [rt.fv(f, "loc", live(M))]));
		} else if ($0 === "drone") {
			new_mob = (yield* g.new_(f, T("/mob/living/simple_animal/drone/polymorphed"), [rt.fv(f, "loc", live(M))]));
		}
		if (truthy((rt.istype(live(new_mob), T("/mob/living/silicon")) ? 1 : 0))) {
			rt.setFv(f, "gender", live(new_mob), rt.fv(f, "gender", live(M)));
			rt.setFv(f, "invisibility", live(new_mob), 0);
			rt.setFv(f, "job", live(new_mob), "Cyborg");
			yield* g.callName(f, rt.gv(f, "mmi", (Robot_4 = live(new_mob))), "transfer_identity", [live(M)]);
			yield* g.callName(f, live(Robot_4), "clear_inherent_laws", [0]);
			yield* g.callName(f, live(Robot_4), "clear_zeroth_law", [0, 0]);
			rt.setFv(f, "connected_ai", live(Robot_4), null);
		}
	} else if ($0 === "slime") {
		new_mob = (yield* g.new_(f, T("/mob/living/simple_animal/slime/random"), [rt.fv(f, "loc", live(M))]));
	} else if ($0 === "xeno") {
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			new_mob = (yield* g.new_(f, T("/mob/living/carbon/alien/humanoid/hunter"), [rt.fv(f, "loc", live(M))]));
		} else {
			new_mob = (yield* g.new_(f, T("/mob/living/carbon/alien/humanoid/sentinel"), [rt.fv(f, "loc", live(M))]));
		}
	} else if ($0 === "animal") {
		path_3 = null;
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			$0 = (beast = rt.op(f, "PickUnweighted", [19], ["carp", "bear", "mushroom", "statue", "bat", "goat", "killertomato", "spiderbase", "spiderhunter", "blobbernaut", "magicarp", "chaosmagicarp", "watcher", "goliath", "headcrab", "morph", "stickman", "stickdog", "lesserdragon"]));
			if ($0 === "carp") {
				path_3 = T("/mob/living/simple_animal/hostile/carp");
			} else if ($0 === "bear") {
				path_3 = T("/mob/living/simple_animal/hostile/bear");
			} else if ($0 === "mushroom") {
				path_3 = T("/mob/living/simple_animal/hostile/mushroom");
			} else if ($0 === "statue") {
				path_3 = T("/mob/living/simple_animal/hostile/statue");
			} else if ($0 === "bat") {
				path_3 = T("/mob/living/simple_animal/hostile/retaliate/bat");
			} else if ($0 === "goat") {
				path_3 = T("/mob/living/simple_animal/hostile/retaliate/goat");
			} else if ($0 === "killertomato") {
				path_3 = T("/mob/living/simple_animal/hostile/killertomato");
			} else if ($0 === "spiderbase") {
				path_3 = T("/mob/living/simple_animal/hostile/poison/giant_spider");
			} else if ($0 === "spiderhunter") {
				path_3 = T("/mob/living/simple_animal/hostile/poison/giant_spider/hunter");
			} else if ($0 === "blobbernaut") {
				path_3 = T("/mob/living/simple_animal/hostile/blob/blobbernaut/independent");
			} else if ($0 === "magicarp") {
				path_3 = T("/mob/living/simple_animal/hostile/carp/ranged");
			} else if ($0 === "chaosmagicarp") {
				path_3 = T("/mob/living/simple_animal/hostile/carp/ranged/chaos");
			} else if ($0 === "watcher") {
				path_3 = T("/mob/living/simple_animal/hostile/asteroid/basilisk/watcher");
			} else if ($0 === "goliath") {
				path_3 = T("/mob/living/simple_animal/hostile/asteroid/goliath/beast");
			} else if ($0 === "headcrab") {
				path_3 = T("/mob/living/simple_animal/hostile/headcrab");
			} else if ($0 === "morph") {
				path_3 = T("/mob/living/simple_animal/hostile/morph");
			} else if ($0 === "stickman") {
				path_3 = T("/mob/living/simple_animal/hostile/stickman");
			} else if ($0 === "stickdog") {
				path_3 = T("/mob/living/simple_animal/hostile/stickman/dog");
			} else if ($0 === "lesserdragon") {
				path_3 = T("/mob/living/simple_animal/hostile/megafauna/dragon/lesser");
			}
		} else {
			$0 = (animal = rt.op(f, "PickUnweighted", [13], ["parrot", "corgi", "crab", "pug", "cat", "mouse", "chicken", "cow", "lizard", "chick", "fox", "butterfly", "cak"]));
			if ($0 === "parrot") {
				path_3 = T("/mob/living/simple_animal/parrot");
			} else if ($0 === "corgi") {
				path_3 = T("/mob/living/simple_animal/pet/dog/corgi");
			} else if ($0 === "crab") {
				path_3 = T("/mob/living/simple_animal/crab");
			} else if ($0 === "pug") {
				path_3 = T("/mob/living/simple_animal/pet/dog/pug");
			} else if ($0 === "cat") {
				path_3 = T("/mob/living/simple_animal/pet/cat");
			} else if ($0 === "mouse") {
				path_3 = T("/mob/living/simple_animal/mouse");
			} else if ($0 === "chicken") {
				path_3 = T("/mob/living/simple_animal/chicken");
			} else if ($0 === "cow") {
				path_3 = T("/mob/living/simple_animal/cow");
			} else if ($0 === "lizard") {
				path_3 = T("/mob/living/simple_animal/hostile/lizard");
			} else if ($0 === "fox") {
				path_3 = T("/mob/living/simple_animal/pet/fox");
			} else if ($0 === "butterfly") {
				path_3 = T("/mob/living/simple_animal/butterfly");
			} else if ($0 === "cak") {
				path_3 = T("/mob/living/simple_animal/pet/cat/cak");
			} else if ($0 === "chick") {
				path_3 = T("/mob/living/simple_animal/chick");
			}
		}
		new_mob = (yield* g.new_(f, live(path_3), [rt.fv(f, "loc", live(M))]));
	} else if ($0 === "humanoid") {
		new_mob = (yield* g.new_(f, T("/mob/living/carbon/human"), [rt.fv(f, "loc", live(M))]));
		yield* g.callName(f, (A = (yield* g.new_(f, T("/datum/preferences"), []))), "copy_to", [null, live(new_mob), "icon_updates", 0], rt.Args.Named);
		H = live(new_mob);
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			all_species = rt.list();
			speciestype = null;
			rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/species")])), T("/datum/species")));
			while (($e = rt.next(f, 0)) !== undefined) {
				speciestype = $e;
				if (!truthy(rt.gv(f, "dangerous_existence", (S = (yield* g.new_(f, live(speciestype), [])))))) {
					all_species = rt.modify(live(all_species), live(speciestype), add);
				}
			}
			rt.endFor(f, 0);
			yield* g.callName(f, live(H), "set_species", [null, rt.op(f, "PickUnweighted", [1], [live(all_species)]), "icon_update", 0], rt.Args.Named);
		}
		yield* g.callName(f, live(H), "update_body", []);
		yield* g.callName(f, live(H), "update_hair", []);
		yield* g.callName(f, live(H), "update_body_parts", []);
		yield* g.callName(f, rt.fv(f, "dna", live(H)), "update_dna_identity", []);
	}
	if (!truthy(live(new_mob))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(new_mob), "grant_language", [T("/datum/language/common")]);
	if (!truthy(rt.fv(f, "secondary_flags", live(new_mob)))) {
		rt.setFv(f, "secondary_flags", live(new_mob), rt.list());
	}
	rt.setAt(rt.fv(f, "secondary_flags", live(new_mob)), "omnitongue", 1);
	rt.setFv(f, "logging", live(new_mob), rt.fv(f, "logging", live(M)));
	W_3 = null;
	rt.forList(f, 0, live(contents), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		W_3 = $e;
		yield* g.callName(f, live(new_mob), "equip_to_appropriate_slot", [live(W_3)]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(M), "log_message", [fmt("<font color='orange'>became ＀.</font>", [rt.fv(f, "real_name", live(new_mob))]), "Attack log"]);
	rt.setFv(f, "a_intent", live(new_mob), "harm");
	yield* g.callName(f, live(M), "wabbajack_act", [live(new_mob)]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(new_mob), fmt("<span class='warning'>Your form morphs into that of a ＀.</span>", [live(randomize)])]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(new_mob), rt.index(rt.fv(f, "policies", rt.gl("config")), "polymorph")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(M)]);
	return live(new_mob);
}, true);

rt.type(8909, "/obj/item/projectile/magic/animate", "/obj/item/projectile/magic", {
	damage: 0,
	damage_type: "fire",
	nodamage: 1,
	name: "bolt of animation",
	icon_state: "red_1",
});

// /obj/item/projectile/magic/animate/proc/on_hit  (code/modules/projectiles/projectile/magic.dm:293)  may sleep
rt.def("/obj/item/projectile/magic/animate/proc/on_hit", function* on_hit(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callName(f, live(f.args[0]), "animate_atom_living", [rt.sv(f, "firer")]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["target", "blocked"] });

// /atom/proc/animate_atom_living  (code/modules/projectiles/projectile/magic.dm:297)  may sleep
rt.def("/atom/proc/animate_atom_living", function* animate_atom_living(f: Frame, owner: Value) {
	let _P: Value = null, L: Value = null, S: Value = null, O: Value = null, C: Value = null;
	f.vars = () => [owner, _P, L, S, O, C];
	if (live(owner) === null) {
		owner = null;
	}
	if (((truthy((rt.istype(live(f.src), T("/obj/item")) ? 1 : 0)) || truthy((rt.istype(live(f.src), T("/obj/structure")) ? 1 : 0))) && !truthy((yield* g.call(f, P("/proc/is_type_in_list"), null, [live(f.src), rt.gl("protected_objects")]))))) {
		if (truthy((rt.istype(live(f.src), T("/obj/structure/statue/petrified")) ? 1 : 0))) {
			if (truthy(rt.gv(f, "petrified_mob", (_P = live(f.src))))) {
				L = rt.fv(f, "petrified_mob", live(_P));
				rt.setFv(f, "name", (S = (yield* g.new_(f, T("/mob/living/simple_animal/hostile/statue"), [rt.fv(f, "loc", live(_P)), live(owner)]))), fmt("statue of ＀", [rt.fv(f, "name", live(L))]));
				if (truthy(live(owner))) {
					rt.setFv(f, "faction", live(S), rt.list(fmt("＃", [live(owner)])));
				}
				rt.setFv(f, "icon", live(S), rt.fv(f, "icon", live(_P)));
				rt.setFv(f, "icon_state", live(S), rt.fv(f, "icon_state", live(_P)));
				yield* g.callName(f, live(S), "copy_overlays", [live(_P), 1]);
				rt.setFv(f, "color", live(S), rt.fv(f, "color", live(_P)));
				rt.setFv(f, "atom_colours", live(S), (yield* g.callName(f, rt.fv(f, "atom_colours", live(_P)), "Copy", [])));
				if (truthy(rt.fv(f, "mind", live(L)))) {
					yield* g.callName(f, rt.fv(f, "mind", live(L)), "transfer_to", [live(S)]);
					if (truthy(live(owner))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(S), fmt("<span class='userdanger'>You are an animate statue. You cannot move when monitored, but are nearly invincible and deadly when unobserved! Do not harm ＀, your creator.</span>", [live(owner)])]);
					}
				}
				rt.setFv(f, "loc", live(_P), live(S));
				return live(f.dot);
			}
		} else {
			if (truthy((rt.istype((O = live(f.src)), T("/obj/item/weapon/gun")) ? 1 : 0))) {
				yield* g.new_(f, T("/mob/living/simple_animal/hostile/mimic/copy/ranged"), [rt.sv(f, "loc"), live(f.src), live(owner)]);
			} else {
				yield* g.new_(f, T("/mob/living/simple_animal/hostile/mimic/copy"), [rt.sv(f, "loc"), live(f.src), live(owner)]);
			}
		}
	} else {
		if (!truthy((rt.istype(live(f.src), T("/mob/living/simple_animal/hostile/mimic/copy")) ? 1 : 0))) return f.dot;
		C = live(f.src);
		if (!truthy(live(owner))) return f.dot;
		yield* g.callName(f, live(C), "ChangeOwner", [live(owner)]);
	}
	return f.dot;
}, true);

rt.type(8912, "/obj/item/projectile/magic/aoe", "/obj/item/projectile/magic", {
	proxdet: 1,
	damage: 0,
	name: "Area Bolt",
	desc: "What the fuck does this do?!",
});

// /obj/item/projectile/magic/aoe/proc/Range  (code/modules/projectiles/projectile/magic.dm:356)  may sleep
rt.def("/obj/item/projectile/magic/aoe/proc/Range", function* Range(f: Frame) {
	let L: Value = null;
	let $e: any;
	f.vars = () => [L, $e];
	if (truthy(rt.sv(f, "proxdet"))) {
		L = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, rt.getStep(f, live(f.src), 0)])), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			L = $e;
			if ((!isEqual(rt.fv(f, "stat", live(L)), 2) && !isEqual(live(L), rt.sv(f, "firer")))) {
				return (yield* g.srcCall(f, "Bump", live(L), 1));
			}
		}
		rt.endFor(f, 0);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(8913, "/obj/item/projectile/magic/aoe/lightning", "/obj/item/projectile/magic/aoe", {
	tesla_power: 20000,
	tesla_range: 15,
	tesla_boom: 0,
	chain: null,
	caster: null,
	damage: 15,
	damage_type: "fire",
	nodamage: 0,
	speed: 0.3,
	flag: "magic",
	name: "lightning bolt",
	icon_state: "tesla_projectile",
});

// /obj/item/projectile/magic/aoe/lightning/proc/fire  (code/modules/projectiles/projectile/magic.dm:378)  may sleep
rt.def("/obj/item/projectile/magic/aoe/lightning/proc/fire", function* fire(f: Frame) {
	if (truthy(rt.sv(f, "caster"))) {
		rt.setSv(f, "chain", (yield* g.callName(f, rt.sv(f, "caster"), "Beam", [null, live(f.src), "icon_state", fmt("lightning＀", [(yield* g.call(f, P("/proc/rand"), null, [1, 12]))]), "time", 9.999999848243207e+30, "maxdistance", 9.999999848243207e+30], rt.Args.Named)));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["setAngle"], waitfor: false });

// /obj/item/projectile/magic/aoe/lightning/proc/on_hit  (code/modules/projectiles/projectile/magic.dm:382)  may sleep
rt.def("/obj/item/projectile/magic/aoe/lightning/proc/on_hit", function* on_hit(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.call(f, P("/proc/tesla_zap"), null, [live(f.src), rt.sv(f, "tesla_range"), rt.sv(f, "tesla_power"), rt.sv(f, "tesla_boom")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["target"] });

// /obj/item/projectile/magic/aoe/lightning/proc/Destroy  (code/modules/projectiles/projectile/magic.dm:387)  may sleep
rt.def("/obj/item/projectile/magic/aoe/lightning/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "chain")]);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

rt.type(8914, "/obj/item/projectile/magic/aoe/fireball", "/obj/item/projectile/magic/aoe", {
	exp_heavy: 0,
	exp_light: 2,
	exp_flash: 3,
	exp_fire: 2,
	damage: 10,
	damage_type: "brute",
	nodamage: 0,
	name: "bolt of fireball",
	icon_state: "fireball",
});

// /obj/item/projectile/magic/aoe/fireball/proc/on_hit  (code/modules/projectiles/projectile/magic.dm:404)  may sleep
rt.def("/obj/item/projectile/magic/aoe/fireball/proc/on_hit", function* on_hit(f: Frame) {
	let _T: Value = null, M: Value = null;
	f.vars = () => [_T, M];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	_T = rt.getStep(f, live(f.args[0]), 0);
	yield* g.call(f, P("/proc/explosion"), null, [null, live(_T), null, -1, null, rt.sv(f, "exp_heavy"), null, rt.sv(f, "exp_light"), null, rt.sv(f, "exp_flash"), null, 0, "flame_range", rt.sv(f, "exp_fire")], rt.Args.Named);
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [live(f.args[0])])))) return f.dot;
	yield* g.callName(f, (M = live(f.args[0])), "take_overall_damage", [0, 10]);
	return f.dot;
}, true, { args: ["target"] });

rt.type(8915, "/obj/item/projectile/magic/aoe/fireball/infernal", "/obj/item/projectile/magic/aoe/fireball", {
	exp_heavy: -1,
	exp_light: -1,
	exp_flash: 4,
	exp_fire: 5,
	name: "infernal fireball",
});

// /obj/item/projectile/magic/aoe/fireball/infernal/proc/on_hit  (code/modules/projectiles/projectile/magic.dm:419)  may sleep
rt.def("/obj/item/projectile/magic/aoe/fireball/infernal/proc/on_hit", function* on_hit(f: Frame) {
	let _T: Value = null, i: Value = null;
	f.vars = () => [_T, i];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	_T = rt.getStep(f, live(f.args[0]), 0);
	i = null;
	i = 0;
	while (rt.lt(live(i), 50)) {
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/explosion"), live(_T), -1, rt.sv(f, "exp_heavy"), rt.sv(f, "exp_light"), rt.sv(f, "exp_flash"), 0, 0, rt.sv(f, "exp_fire")])), live(i)]);
		i = rt.modify(live(i), 10, add);
	}
	return f.dot;
}, true, { args: ["target"] });
