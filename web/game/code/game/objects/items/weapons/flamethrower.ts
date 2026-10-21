// From code/game/objects/items/weapons/flamethrower.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7229, "/obj/item/weapon/flamethrower", "/obj/item/weapon", {
	status: 0,
	lit: 0,
	operating: 0,
	weldtool: null,
	igniter: null,
	ptank: null,
	warned_admins: 0,
	create_full: 0,
	create_with_tank: 0,
	igniter_type: rt.typePath("/obj/item/device/assembly/igniter"),
	flags: 64,
	throw_speed: 1,
	throw_range: 5,
	name: "flamethrower",
	desc: "You are a firestarter!",
	icon: rt.rsc("icons/obj/flamethrower.dmi"),
	icon_state: "flamethrowerbase",
	item_state: "flamethrower_0",
	force: 3,
	throwforce: 10,
	w_class: 3,
	materials: null,
	origin_tech: "combat=1;plasmatech=2;engineering=2",
	resistance_flags: 2,
});

// /obj/item/weapon/flamethrower/proc/<init>  (code/game/objects/items/weapons/flamethrower.dm:13)
rt.def("/obj/item/weapon/flamethrower/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 500]));
	return f.dot;
});

// /obj/item/weapon/flamethrower/proc/Destroy  (code/game/objects/items/weapons/flamethrower.dm:30)  may sleep
rt.def("/obj/item/weapon/flamethrower/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "weldtool"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "weldtool")]);
	}
	if (truthy(rt.sv(f, "igniter"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "igniter")]);
	}
	if (truthy(rt.sv(f, "ptank"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "ptank")]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/weapon/flamethrower/proc/process  (code/game/objects/items/weapons/flamethrower.dm:38)  may sleep
rt.def("/obj/item/weapon/flamethrower/proc/process", function* process(f: Frame) {
	let location: Value = null, M: Value = null;
	f.vars = () => [location, M];
	if ((!truthy(rt.sv(f, "lit")) || !truthy(rt.sv(f, "igniter")))) {
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
		return null;
	}
	if (truthy((rt.istype((location = rt.sv(f, "loc")), T("/mob")) ? 1 : 0))) {
		if (truthy((yield* g.callName(f, (M = live(location)), "is_holding", [live(f.src)])))) {
			location = rt.fv(f, "loc", live(M));
		}
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [live(location)])))) return f.dot;
	yield* g.callName(f, rt.sv(f, "igniter"), "flamethrower_process", [live(location)]);
	return f.dot;
}, true, { waitfor: false });

// /obj/item/weapon/flamethrower/proc/update_icon  (code/game/objects/items/weapons/flamethrower.dm:51)  may sleep
rt.def("/obj/item/weapon/flamethrower/proc/update_icon", function* update_icon(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	yield* g.srcCall(f, "cut_overlays");
	if (truthy(rt.sv(f, "igniter"))) {
		yield* g.srcCall(f, "add_overlay", fmt("+igniter＀", [rt.sv(f, "status")]));
	}
	if (truthy(rt.sv(f, "ptank"))) {
		yield* g.srcCall(f, "add_overlay", "+ptank");
	}
	if (truthy(rt.sv(f, "lit"))) {
		yield* g.srcCall(f, "add_overlay", "+lit");
		rt.setSv(f, "item_state", "flamethrower_1");
	} else {
		rt.setSv(f, "item_state", "flamethrower_0");
	}
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) {
		yield* g.callName(f, (M = rt.sv(f, "loc")), "update_inv_hands", []);
	}
	return live(f.dot);
}, true);

// /obj/item/weapon/flamethrower/proc/afterattack  (code/game/objects/items/weapons/flamethrower.dm:69)  may sleep
rt.def("/obj/item/weapon/flamethrower/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, flag: Value) {
	let H: Value = null, target_turf: Value = null, turflist: Value = null;
	f.vars = () => [target, user, flag, H, target_turf, turflist];
	if (truthy(live(flag))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (truthy((yield* g.callName(f, rt.gv(f, "dna", (H = live(user))), "check_mutation", ["Hulk"])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Your meaty finger is much too large for the trigger guard!</span>"]);
			return live(f.dot);
		}
		if (truthy((rt.isIn(f, 11, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(H))))) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Your fingers don't fit in the trigger guard!</span>"]);
			return live(f.dot);
		}
	}
	if (!(truthy(live(user)) && isEqual((yield* g.callName(f, live(user), "get_active_held_item", [])), live(f.src)))) return f.dot;
	if (!truthy((target_turf = rt.getStep(f, live(target), 0)))) return f.dot;
	turflist = (yield* g.call(f, P("/proc/getline"), null, [live(user), live(target_turf)]));
	yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(target), "flamethrowered", live(f.src)]);
	yield* g.srcCall(f, "flame_turf", live(turflist));
	return f.dot;
}, true);

// /obj/item/weapon/flamethrower/proc/attackby  (code/game/objects/items/weapons/flamethrower.dm:85)  may sleep
rt.def("/obj/item/weapon/flamethrower/proc/attackby", function* attackby(f: Frame) {
	let _T: Value = null, I: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [_T, I, $0, $1, $2];
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0)) && !truthy(rt.sv(f, "status")))) {
		_T = rt.getStep(f, live(f.src), 0);
		if (truthy(rt.sv(f, "weldtool"))) {
			yield* g.callName(f, rt.sv(f, "weldtool"), "forceMove", [live(_T)]);
			rt.setSv(f, "weldtool", null);
		}
		if (truthy(rt.sv(f, "igniter"))) {
			yield* g.callName(f, rt.sv(f, "igniter"), "forceMove", [live(_T)]);
			rt.setSv(f, "igniter", null);
		}
		if (truthy(rt.sv(f, "ptank"))) {
			yield* g.callName(f, rt.sv(f, "ptank"), "forceMove", [live(_T)]);
			rt.setSv(f, "ptank", null);
		}
		yield* g.new_(f, T("/obj/item/stack/rods"), [live(_T)]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	} else {
		if (((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0)) && truthy(rt.sv(f, "igniter"))) && !truthy(rt.sv(f, "lit")))) {
			rt.setSv(f, "status", (!truthy(rt.sv(f, "status")) ? 1 : 0));
			$0 = live(f.args[1]);
			$1 = rt.sv(f, "igniter");
			if (truthy(rt.sv(f, "status"))) {
				$1 = $1;
				$2 = "secured";
			} else {
				$2 = "unsecured";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>＀ is now ＀!</span>", [$1, $2])]);
			yield* g.srcCall(f, "update_icon");
			return live(f.dot);
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/assembly/igniter")) ? 1 : 0))) {
				if (truthy(rt.gv(f, "secured", (I = live(f.args[0]))))) {
					return live(f.dot);
				}
				if (truthy(rt.sv(f, "igniter"))) {
					return live(f.dot);
				}
				if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
					return live(f.dot);
				}
				rt.setSv(f, "igniter", live(I));
				yield* g.srcCall(f, "update_icon");
				return live(f.dot);
			} else {
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/tank/internals/plasma")) ? 1 : 0))) {
					if (truthy(rt.sv(f, "ptank"))) {
						if (truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
							yield* g.callName(f, rt.sv(f, "ptank"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
							rt.setSv(f, "ptank", live(f.args[0]));
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You swap the plasma tank in ＀!</span>", [live(f.src)])]);
						}
						return live(f.dot);
					}
					if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
						return live(f.dot);
					}
					rt.setSv(f, "ptank", live(f.args[0]));
					yield* g.srcCall(f, "update_icon");
					return live(f.dot);
				} else {
					if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/device/analyzer")) ? 1 : 0)) && truthy(rt.sv(f, "ptank")))) {
						yield* g.srcCall(f, "atmosanalyzer_scan", rt.fv(f, "air_contents", rt.sv(f, "ptank")), live(f.args[1]));
					} else {
						return (yield* g.callSuper(f, [], rt.Args.Same));
					}
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/weapon/flamethrower/proc/attack_self  (code/game/objects/items/weapons/flamethrower.dm:138)  may sleep
rt.def("/obj/item/weapon/flamethrower/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "toggle_igniter", live(user));
	return f.dot;
}, true);

// /obj/item/weapon/flamethrower/proc/AltClick  (code/game/objects/items/weapons/flamethrower.dm:141)  may sleep
rt.def("/obj/item/weapon/flamethrower/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!(((truthy(rt.sv(f, "ptank")) && truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0))) && !truthy((yield* g.callName(f, live(user), "incapacitated", [])))) && truthy((yield* g.srcCall(f, "Adjacent", live(user)))))) return f.dot;
	yield* g.callName(f, live(user), "put_in_hands", [rt.sv(f, "ptank")]);
	rt.setSv(f, "ptank", null);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You remove the plasma tank from ＀!</span>", [live(f.src)])]);
	return f.dot;
}, true);

// /obj/item/weapon/flamethrower/proc/examine  (code/game/objects/items/weapons/flamethrower.dm:147)
rt.def("/obj/item/weapon/flamethrower/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "ptank"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>＄！ has ％！ attached. Alt-click to remove it.</span>", [live(f.src), rt.sv(f, "ptank")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/flamethrower/proc/toggle_igniter  (code/game/objects/items/weapons/flamethrower.dm:152)  may sleep
rt.def("/obj/item/weapon/flamethrower/proc/toggle_igniter", function* toggle_igniter(f: Frame, user: Value) {
	let $0: any, $1: any;
	f.vars = () => [user, $0, $1];
	if (!truthy(rt.sv(f, "ptank"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Attach a plasma tank first!</span>"]);
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "status"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Secure the igniter first!</span>"]);
		return live(f.dot);
	}
	$0 = live(user);
	if (truthy(rt.sv(f, "lit"))) {
		$1 = "extinguish";
	} else {
		$1 = "ignite";
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀ ＀!</span>", [$1, live(f.src)])]);
	rt.setSv(f, "lit", (!truthy(rt.sv(f, "lit")) ? 1 : 0));
	if (truthy(rt.sv(f, "lit"))) {
		if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
			rt.setFv(f, "isprocessing", live(f.src), 1);
			rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
		}
		if (!truthy(rt.sv(f, "warned_admins"))) {
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has lit a flamethrower.", [fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(user)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(user)])])])]);
			rt.setSv(f, "warned_admins", 1);
		}
	} else {
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/weapon/flamethrower/proc/CheckParts  (code/game/objects/items/weapons/flamethrower.dm:170)  may sleep
rt.def("/obj/item/weapon/flamethrower/proc/CheckParts", function* CheckParts(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "weldtool", rt.locateIn(f, T("/obj/item/weapon/weldingtool"), rt.sv(f, "contents")));
	rt.setSv(f, "igniter", rt.locateIn(f, T("/obj/item/device/assembly/igniter"), rt.sv(f, "contents")));
	rt.setFv(f, "status", rt.sv(f, "weldtool"), 0);
	rt.setFv(f, "secured", rt.sv(f, "igniter"), 0);
	rt.setSv(f, "status", 1);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["parts_list"] });

// /obj/item/weapon/flamethrower/proc/flame_turf  (code/game/objects/items/weapons/flamethrower.dm:180)  may sleep
rt.def("/obj/item/weapon/flamethrower/proc/flame_turf", function* flame_turf(f: Frame, turflist: Value) {
	let previousturf: Value = null, _T: Value = null, turfs_sharing_with_prev: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [turflist, previousturf, _T, turfs_sharing_with_prev, M, $e];
	if ((!truthy(rt.sv(f, "lit")) || truthy(rt.sv(f, "operating")))) {
		return live(f.dot);
	}
	rt.setSv(f, "operating", 1);
	previousturf = rt.getStep(f, live(f.src), 0);
	_T = null;
	rt.forList(f, 0, live(turflist), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (isEqual(live(_T), live(previousturf))) {
			continue;
		}
		turfs_sharing_with_prev = (yield* g.callName(f, live(previousturf), "GetAtmosAdjacentTurfs", ["alldir", 1], rt.Args.Named));
		if (!truthy((rt.isIn(f, live(_T), live(turfs_sharing_with_prev)) ? 1 : 0))) {
			break;
		}
		if (truthy(rt.sv(f, "igniter"))) {
			yield* g.callName(f, rt.sv(f, "igniter"), "ignite_turf", [live(f.src), live(_T)]);
		} else {
			yield* g.srcCall(f, "default_ignite", live(_T));
		}
		yield* g.call(f, P("/proc/sleep"), null, [1]);
		previousturf = live(_T);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "operating", 0);
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/viewers"), null, [1, rt.sv(f, "loc")])), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if ((truthy(rt.fv(f, "client", live(M))) && isEqual(rt.fv(f, "machine", live(M)), live(f.src)))) {
			yield* g.srcCall(f, "attack_self", live(M));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/weapon/flamethrower/proc/default_ignite  (code/game/objects/items/weapons/flamethrower.dm:205)  may sleep
rt.def("/obj/item/weapon/flamethrower/proc/default_ignite", function* default_ignite(f: Frame, target: Value, release_amount: Value) {
	let air_transfer: Value = null;
	f.vars = () => [target, release_amount, air_transfer];
	if (live(release_amount) === null) {
		release_amount = 0.05000000074505806;
	}
	if (truthy(rt.index(rt.gv(f, "gases", (air_transfer = (yield* g.callName(f, rt.fv(f, "air_contents", rt.sv(f, "ptank")), "remove_ratio", [live(release_amount)])))), "plasma"))) {
		(rt.modAt(rt.index(rt.fv(f, "gases", live(air_transfer)), "plasma"), 1, 5, multiply));
	}
	yield* g.callName(f, live(target), "assume_air", [live(air_transfer)]);
	yield* g.callName(f, live(target), "hotspot_expose", [add(multiply(rt.gv(f, "temperature", rt.fv(f, "air_contents", rt.sv(f, "ptank"))), 2), 380), 500]);
	yield* g.callName(f, rt.gl("SSair"), "add_to_active", [live(target), 0]);
	return f.dot;
}, true);

// /obj/item/weapon/flamethrower/proc/Initialize  (code/game/objects/items/weapons/flamethrower.dm:216)  may sleep
rt.def("/obj/item/weapon/flamethrower/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.sv(f, "create_full"))) return f.dot;
	if (!truthy(rt.sv(f, "weldtool"))) {
		rt.setSv(f, "weldtool", (yield* g.new_(f, T("/obj/item/weapon/weldingtool"), [live(f.src)])));
	}
	rt.setFv(f, "status", rt.sv(f, "weldtool"), 0);
	if (!truthy(rt.sv(f, "igniter"))) {
		rt.setSv(f, "igniter", (yield* g.new_(f, rt.sv(f, "igniter_type"), [live(f.src)])));
	}
	rt.setFv(f, "secured", rt.sv(f, "igniter"), 0);
	rt.setSv(f, "status", 1);
	if (truthy(rt.sv(f, "create_with_tank"))) {
		rt.setSv(f, "ptank", (yield* g.new_(f, T("/obj/item/weapon/tank/internals/plasma/full"), [live(f.src)])));
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/item/weapon/flamethrower/proc/hit_reaction  (code/game/objects/items/weapons/flamethrower.dm:236)  may sleep
rt.def("/obj/item/weapon/flamethrower/proc/hit_reaction", function* hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	let _P: Value = null, target_turf: Value = null;
	f.vars = () => [owner, hitby, attack_text, final_block_chance, damage, attack_type, _P, target_turf];
	if (live(attack_text) === null) {
		attack_text = "the attack";
	}
	if (live(final_block_chance) === null) {
		final_block_chance = 0;
	}
	if (live(damage) === null) {
		damage = 0;
	}
	if (live(attack_type) === null) {
		attack_type = 1;
	}
	_P = live(hitby);
	if (!(((truthy(live(damage)) && isEqual(live(attack_type), 3)) && !isEqual(rt.fv(f, "damage_type", live(_P)), "stamina")) && truthy(rt.op(f, "Prob", [], [15])))) return f.dot;
	yield* g.callName(f, live(owner), "visible_message", [fmt("<span class='danger'>＀ hits the fueltank on ＀'s ＀, rupturing it! What a shot!</span>", [live(attack_text), live(owner), live(f.src)])]);
	target_turf = rt.getStep(f, live(owner), 0);
	yield* g.callName(f, rt.sv(f, "igniter"), "ignite_turf", [null, live(f.src), null, live(target_turf), "release_amount", 100], rt.Args.Named);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "ptank")]);
	return 1;
}, true);

// /obj/item/device/assembly/igniter/proc/flamethrower_process  (code/game/objects/items/weapons/flamethrower.dm:246)  may sleep
rt.def("/obj/item/device/assembly/igniter/proc/flamethrower_process", function* flamethrower_process(f: Frame, location: Value) {
	f.vars = () => [location];
	yield* g.callName(f, live(location), "hotspot_expose", [700, 2]);
	return f.dot;
}, true);

// /obj/item/device/assembly/igniter/proc/ignite_turf  (code/game/objects/items/weapons/flamethrower.dm:252)  may sleep
rt.def("/obj/item/device/assembly/igniter/proc/ignite_turf", function* ignite_turf(f: Frame, F: Value, location: Value, release_amount: Value) {
	f.vars = () => [F, location, release_amount];
	if (live(release_amount) === null) {
		release_amount = 0.05000000074505806;
	}
	yield* g.callName(f, live(F), "default_ignite", [live(location), live(release_amount)]);
	return f.dot;
}, true);
