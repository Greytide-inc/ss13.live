// From code/game/objects/items/weapons/handcuffs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5775, "/obj/item/weapon/restraints/handcuffs", "/obj/item/weapon/restraints", {
	cuffsound: rt.rsc("sound/weapons/handcuffs.ogg"),
	trashtype: null,
	flags: 64,
	throw_speed: 3,
	throw_range: 5,
	name: "handcuffs",
	desc: "Use this to keep prisoners in line.",
	gender: "plural",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "handcuff",
	slot_flags: 512,
	throwforce: 0,
	w_class: 2,
	materials: null,
	origin_tech: "engineering=3;combat=3",
	breakouttime: 600,
	armor: null,
});

// /obj/item/weapon/restraints/handcuffs/proc/<init>  (code/game/objects/items/weapons/handcuffs.dm:18)
rt.def("/obj/item/weapon/restraints/handcuffs/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 500]));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 50]));
	return f.dot;
});

// /obj/item/weapon/restraints/handcuffs/proc/attack  (code/game/objects/items/weapons/handcuffs.dm:26)  may sleep
rt.def("/obj/item/weapon/restraints/handcuffs/proc/attack", function* attack(f: Frame, C: Value, user: Value) {
	let M: Value = null;
	f.vars = () => [C, user, M];
	if (!truthy((rt.istype(live(C), T("/mob/living/carbon")) ? 1 : 0))) {
		return live(f.dot);
	}
	if ((truthy(rt.bitAnd(rt.fv(f, "disabilities", live(user)), 256)) && truthy(rt.op(f, "Prob", [], [50])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Uh... how do those things work?!</span>"]);
		yield* g.srcCall(f, "apply_cuffs", live(user), live(user));
		return live(f.dot);
	}
	if ((truthy((rt.istype(live(C), T("/mob/living/carbon/monkey")) ? 1 : 0)) && truthy(rt.op(f, "Prob", [], [20])))) {
		M = null;
		yield* g.callName(f, (M = live(C)), "retaliate", [live(user)]);
	}
	if (truthy(rt.fv(f, "handcuffed", live(C)))) return f.dot;
	if ((rt.ge((yield* g.callName(f, live(C), "get_num_arms", [])), 2) || truthy((yield* g.callName(f, live(C), "get_arm_ignore", []))))) {
		yield* g.callName(f, live(C), "visible_message", [fmt("<span class='danger'>＀ is trying to put ＀ on ＀!</span>", [live(user), rt.fv(f, "name", live(f.src)), live(C)]), fmt("<span class='userdanger'>＀ is trying to put ＀ on ＀!</span>", [live(user), rt.fv(f, "name", live(f.src)), live(C)])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.sv(f, "cuffsound"), 30, 1, -2]);
		if ((truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(user), live(C), 30]))) && (rt.ge((yield* g.callName(f, live(C), "get_num_arms", [])), 2) || truthy((yield* g.callName(f, live(C), "get_arm_ignore", [])))))) {
			yield* g.srcCall(f, "apply_cuffs", live(C), live(user));
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You handcuff ＀.</span>", [live(C)])]);
			yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(C), "handcuffed"]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You fail to handcuff ＀!</span>", [live(C)])]);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ doesn't have two hands...</span>", [live(C)])]);
	}
	return f.dot;
}, true);

// /obj/item/weapon/restraints/handcuffs/proc/apply_cuffs  (code/game/objects/items/weapons/handcuffs.dm:57)  may sleep
rt.def("/obj/item/weapon/restraints/handcuffs/proc/apply_cuffs", function* apply_cuffs(f: Frame, target: Value, user: Value, dispense: Value) {
	let cuffs: Value = null;
	f.vars = () => [target, user, dispense, cuffs];
	if (live(dispense) === null) {
		dispense = 0;
	}
	if (truthy(rt.fv(f, "handcuffed", live(target)))) {
		return live(f.dot);
	}
	if ((!truthy((yield* g.callName(f, live(user), "drop_item", []))) && !truthy(live(dispense)))) {
		return live(f.dot);
	}
	cuffs = live(f.src);
	if (truthy(rt.sv(f, "trashtype"))) {
		cuffs = (yield* g.new_(f, rt.sv(f, "trashtype"), []));
	} else {
		if (truthy(live(dispense))) {
			cuffs = (yield* g.new_(f, rt.sv(f, "type"), []));
		}
	}
	rt.setFv(f, "loc", live(cuffs), live(target));
	rt.setFv(f, "handcuffed", live(target), live(cuffs));
	yield* g.callName(f, live(target), "update_handcuffed", []);
	if ((truthy(rt.sv(f, "trashtype")) && !truthy(live(dispense)))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return live(f.dot);
}, true);

rt.type(5781, "/obj/item/weapon/restraints/handcuffs/cable", "/obj/item/weapon/restraints/handcuffs", {
	wirestorage: null,
	cuffsound: rt.rsc("sound/weapons/cablecuff.ogg"),
	name: "cable restraints",
	desc: "Looks like some cables tied together. Could be used to tie something up.",
	icon_state: "cuff_red",
	item_state: "coil_red",
	materials: null,
	origin_tech: "engineering=2",
	breakouttime: 300,
});

// /obj/item/weapon/restraints/handcuffs/cable/proc/<init>  (code/game/objects/items/weapons/handcuffs.dm:91)
rt.def("/obj/item/weapon/restraints/handcuffs/cable/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 150, "$glass", 75]));
	return f.dot;
});

// /obj/item/weapon/restraints/handcuffs/cable/proc/attack  (code/game/objects/items/weapons/handcuffs.dm:98)  may sleep
rt.def("/obj/item/weapon/restraints/handcuffs/cable/proc/attack", function* attack(f: Frame) {
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "wirestorage")) && rt.lt(rt.fv(f, "energy", rt.sv(f, "wirestorage")), 15))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You need at least 15 wire to restrain ＀!</span>", [live(f.args[0])])]);
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["C", "user"] });

// /obj/item/weapon/restraints/handcuffs/cable/proc/apply_cuffs  (code/game/objects/items/weapons/handcuffs.dm:107)  may sleep
rt.def("/obj/item/weapon/restraints/handcuffs/cable/proc/apply_cuffs", function* apply_cuffs(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (truthy(rt.sv(f, "wirestorage"))) {
		if (!truthy((yield* g.callName(f, rt.sv(f, "wirestorage"), "use_charge", [15])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You need at least 15 wire to restrain ＀!</span>", [live(f.args[0])])]);
			return live(f.dot);
		}
		return (yield* g.callSuper(f, [live(f.args[0]), live(f.args[1]), 1]));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["target", "user", "dispense"] });

// /obj/item/weapon/restraints/handcuffs/cable/proc/attackby  (code/game/objects/items/weapons/handcuffs.dm:160)  may sleep
rt.def("/obj/item/weapon/restraints/handcuffs/cable/proc/attackby", function* attackby(f: Frame) {
	let R: Value = null, W: Value = null, M: Value = null, S: Value = null;
	f.vars = () => [R, W, M, S];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/rods")) ? 1 : 0))) {
		if (truthy((yield* g.callName(f, (R = live(f.args[0])), "use", [1])))) {
			W = (yield* g.new_(f, T("/obj/item/weapon/wirerod"), []));
			yield* g.srcCall(f, "remove_item_from_storage", live(f.args[1]));
			yield* g.callName(f, live(f.args[1]), "put_in_hands", [live(W)]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You wrap the cable restraint around the top of the rod.</span>"]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need one rod to make a wired rod!</span>"]);
			return live(f.dot);
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/metal")) ? 1 : 0))) {
			if (rt.lt((yield* g.callName(f, (M = live(f.args[0])), "get_amount", [])), 6)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need at least six metal sheets to make good enough weights!</span>"]);
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You begin to apply ＀ to ＀...</span>", [live(f.args[0]), live(f.src)])]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 35, "target", live(f.src)], rt.Args.Named)))) {
				if ((rt.lt((yield* g.callName(f, live(M), "get_amount", [])), 6) || !truthy(live(M)))) {
					return live(f.dot);
				}
				S = (yield* g.new_(f, T("/obj/item/weapon/restraints/legcuffs/bola"), []));
				yield* g.callName(f, live(M), "use", [6]);
				yield* g.callName(f, live(f.args[1]), "put_in_hands", [live(S)]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You make some weights out of ＀ and tie them to ＀.</span>", [live(f.args[0]), live(f.src)])]);
				yield* g.srcCall(f, "remove_item_from_storage", live(f.args[1]));
				yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			}
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

rt.type(5791, "/obj/item/weapon/restraints/handcuffs/cable/zipties/cyborg", "/obj/item/weapon/restraints/handcuffs/cable/zipties", {});

// /obj/item/weapon/restraints/handcuffs/cable/zipties/cyborg/proc/attack  (code/game/objects/items/weapons/handcuffs.dm:191)  may sleep
rt.def("/obj/item/weapon/restraints/handcuffs/cable/zipties/cyborg/proc/attack", function* attack(f: Frame, C: Value, user: Value) {
	f.vars = () => [C, user];
	if (!truthy((rt.istype(live(user), T("/mob/living/silicon/robot")) ? 1 : 0))) return f.dot;
	if (truthy(rt.fv(f, "handcuffed", live(C)))) return f.dot;
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/cablecuff.ogg"), 30, 1, -2]);
	yield* g.callName(f, live(C), "visible_message", [fmt("<span class='danger'>＀ is trying to put zipties on ＀!</span>", [live(user), live(C)]), fmt("<span class='userdanger'>＀ is trying to put zipties on ＀!</span>", [live(user), live(C)])]);
	if (truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(user), live(C), 30])))) {
		if (!truthy(rt.fv(f, "handcuffed", live(C)))) {
			rt.setFv(f, "handcuffed", live(C), (yield* g.new_(f, T("/obj/item/weapon/restraints/handcuffs/cable/zipties/used"), [live(C)])));
			yield* g.callName(f, live(C), "update_handcuffed", []);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You handcuff ＀.</span>", [live(C)])]);
			yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(C), "handcuffed"]);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You fail to handcuff ＀!</span>", [live(C)])]);
	}
	return f.dot;
}, true);

rt.type(5790, "/obj/item/weapon/restraints/handcuffs/cable/zipties", "/obj/item/weapon/restraints/handcuffs/cable", {
	name: "zipties",
	desc: "Plastic, disposable zipties that can be used to restrain temporarily but are destroyed after use.",
	icon_state: "cuff_white",
	item_state: "coil_white",
	materials: null,
	breakouttime: 450,
	trashtype: rt.typePath("/obj/item/weapon/restraints/handcuffs/cable/zipties/used"),
});

// /obj/item/weapon/restraints/handcuffs/cable/zipties/proc/<init>  (code/game/objects/items/weapons/handcuffs.dm:210)
rt.def("/obj/item/weapon/restraints/handcuffs/cable/zipties/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.list());
	return f.dot;
});

rt.type(5771, "/obj/item/weapon/restraints/legcuffs/beartrap", "/obj/item/weapon/restraints/legcuffs", {
	armed: 0,
	trap_damage: 20,
	throw_speed: 1,
	throw_range: 1,
	name: "bear trap",
	icon_state: "beartrap",
	desc: "A trap used to catch bears and other legged creatures.",
	origin_tech: "engineering=4",
});

// /obj/item/weapon/restraints/legcuffs/beartrap/proc/Initialize  (code/game/objects/items/weapons/handcuffs.dm:248)  may sleep
rt.def("/obj/item/weapon/restraints/legcuffs/beartrap/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("＀＀", [rt.initial(f, live(f.src), "icon_state"), rt.sv(f, "armed")]));
	return f.dot;
}, true);

// /obj/item/weapon/restraints/legcuffs/beartrap/proc/suicide_act  (code/game/objects/items/weapons/handcuffs.dm:252)
rt.def("/obj/item/weapon/restraints/legcuffs/beartrap/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is sticking ＀ head in the ＀! It looks like ＀ trying to commit suicide!</span>", [live(user), rt.callName(f, live(user), "p_their", []), rt.fv(f, "name", live(f.src)), rt.callName(f, live(user), "p_theyre", [])])]);
	rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/bladeslice.ogg"), 50, 1, -1]);
	return 1;
});

// /obj/item/weapon/restraints/legcuffs/beartrap/proc/attack_self  (code/game/objects/items/weapons/handcuffs.dm:257)  may sleep
rt.def("/obj/item/weapon/restraints/legcuffs/beartrap/proc/attack_self", function* attack_self(f: Frame) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!((truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0)) && !truthy(rt.fv(f, "stat", live(f.args[0])))) && !truthy((yield* g.callName(f, live(f.args[0]), "restrained", []))))) return f.dot;
	rt.setSv(f, "armed", (!truthy(rt.sv(f, "armed")) ? 1 : 0));
	rt.setSv(f, "icon_state", fmt("＀＀", [rt.initial(f, live(f.src), "icon_state"), rt.sv(f, "armed")]));
	$0 = live(f.args[0]);
	$1 = live(f.src);
	if (truthy(rt.sv(f, "armed"))) {
		$1 = $1;
		$2 = "armed";
	} else {
		$2 = "disarmed";
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>＀ is now ＀</span>", [$1, $2])]);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/restraints/legcuffs/beartrap/proc/Crossed  (code/game/objects/items/weapons/handcuffs.dm:264)  may sleep
rt.def("/obj/item/weapon/restraints/legcuffs/beartrap/proc/Crossed", function* Crossed(f: Frame) {
	let L: Value = null, snap: Value = null, def_zone: Value = null, C: Value = null, SA: Value = null;
	f.vars = () => [L, snap, def_zone, C, SA];
	if ((truthy(rt.sv(f, "armed")) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(f.src))]))))) {
		if (truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
			L = live(f.args[0]);
			snap = 0;
			def_zone = "chest";
			if (truthy((rt.istype(live(L), T("/mob/living/carbon")) ? 1 : 0))) {
				C = live(L);
				snap = 1;
				if (!truthy(rt.fv(f, "lying", live(C)))) {
					def_zone = rt.op(f, "PickUnweighted", [2], ["l_leg", "r_leg"]);
					if ((!truthy(rt.fv(f, "legcuffed", live(C))) && rt.ge((yield* g.callName(f, live(C), "get_num_legs", [])), 2))) {
						rt.setFv(f, "legcuffed", live(C), live(f.src));
						rt.setFv(f, "loc", live(f.src), live(C));
						yield* g.callName(f, live(C), "update_inv_legcuffed", []);
					}
				}
			} else {
				if (truthy((rt.istype(live(L), T("/mob/living/simple_animal")) ? 1 : 0))) {
					if (rt.gt(rt.gv(f, "mob_size", (SA = live(L))), 0)) {
						snap = 1;
					}
				}
			}
			if (truthy(rt.bitAnd(rt.fv(f, "movement_type", live(L)), 2))) {
				snap = 0;
			}
			if (truthy(live(snap))) {
				rt.setSv(f, "armed", 0);
				rt.setSv(f, "icon_state", fmt("＀＀", [rt.initial(f, live(f.src), "icon_state"), rt.sv(f, "armed")]));
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/snap.ogg"), 50, 1]);
				yield* g.callName(f, live(L), "visible_message", [fmt("<span class='danger'>＀ triggers ％！.</span>", [live(L), live(f.src)]), fmt("<span class='userdanger'>You trigger ％！!</span>", [live(f.src)])]);
				yield* g.callName(f, live(L), "apply_damage", [rt.sv(f, "trap_damage"), "brute", live(def_zone)]);
			}
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["AM"] });

rt.type(5772, "/obj/item/weapon/restraints/legcuffs/beartrap/energy", "/obj/item/weapon/restraints/legcuffs/beartrap", {
	armed: 1,
	trap_damage: 0,
	flags: 16384,
	name: "energy snare",
	icon_state: "e_snare",
});

// /obj/item/weapon/restraints/legcuffs/beartrap/energy/proc/New  (code/game/objects/items/weapons/handcuffs.dm:302)  may sleep
rt.def("/obj/item/weapon/restraints/legcuffs/beartrap/energy/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/weapon/restraints/legcuffs/beartrap/energy/proc/dissipate")])), 100]);
	return f.dot;
}, true);

// /obj/item/weapon/restraints/legcuffs/beartrap/energy/proc/dissipate  (code/game/objects/items/weapons/handcuffs.dm:306)  may sleep
rt.def("/obj/item/weapon/restraints/legcuffs/beartrap/energy/proc/dissipate", function* dissipate(f: Frame) {
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) return f.dot;
	yield* g.call(f, P("/proc/do_sparks"), null, [1, 1, live(f.src)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/restraints/legcuffs/beartrap/energy/proc/attack_hand  (code/game/objects/items/weapons/handcuffs.dm:311)  may sleep
rt.def("/obj/item/weapon/restraints/legcuffs/beartrap/energy/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "Crossed", live(user));
	return f.dot;
}, true);

rt.type(5767, "/obj/item/weapon/restraints/legcuffs/bola", "/obj/item/weapon/restraints/legcuffs", {
	knockdown: 0,
	name: "bola",
	desc: "A restraining device designed to be thrown at the target. Upon connecting with said target, it will wrap around their legs, making it difficult for them to move quickly.",
	icon_state: "bola",
	breakouttime: 35,
	gender: "neuter",
	origin_tech: "engineering=3;combat=1",
});

// /obj/item/weapon/restraints/legcuffs/bola/proc/throw_at  (code/game/objects/items/weapons/handcuffs.dm:326)  may sleep
rt.def("/obj/item/weapon/restraints/legcuffs/bola/proc/throw_at", function* throw_at(f: Frame) {
	if (live(f.args[4]) === null) {
		f.args[4] = 1;
	}
	if (live(f.args[5]) === null) {
		f.args[5] = 0;
	}
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/weapons/bolathrow.ogg"), 75, 1]);
	return f.dot;
}, true, { args: ["target", "range", "speed", "thrower", "spin", "diagonals_first", "callback"] });

// /obj/item/weapon/restraints/legcuffs/bola/proc/throw_impact  (code/game/objects/items/weapons/handcuffs.dm:331)  may sleep
rt.def("/obj/item/weapon/restraints/legcuffs/bola/proc/throw_impact", function* throw_impact(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if ((truthy((yield* g.callSuper(f, [], rt.Args.Same))) || !truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0)))) {
		return live(f.dot);
	}
	if (!(!truthy(rt.gv(f, "legcuffed", (C = live(f.args[0])))) && rt.ge((yield* g.callName(f, live(C), "get_num_legs", [])), 2))) return f.dot;
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＄！ ensnares ＀!</span>", [live(f.src), live(C)]));
	rt.setFv(f, "legcuffed", live(C), live(f.src));
	rt.setFv(f, "loc", live(f.src), live(C));
	yield* g.callName(f, live(C), "update_inv_legcuffed", []);
	yield* g.call(f, P("/proc/to_chat"), null, [live(C), fmt("<span class='userdanger'>＄！ ensnares you!</span>", [live(f.src)])]);
	yield* g.callName(f, live(C), "Knockdown", [rt.sv(f, "knockdown")]);
	return f.dot;
}, true, { args: ["hit_atom"], waitfor: false });

rt.type(5770, "/obj/item/weapon/restraints/legcuffs/bola/energy", "/obj/item/weapon/restraints/legcuffs/bola", {
	name: "energy bola",
	desc: "A specialized hard-light bola designed to ensnare fleeing criminals and aid in arrests.",
	icon_state: "ebola",
	hitsound: rt.rsc("sound/weapons/taserhit.ogg"),
	w_class: 2,
	breakouttime: 60,
});

// /obj/item/weapon/restraints/legcuffs/bola/energy/proc/throw_impact  (code/game/objects/items/weapons/handcuffs.dm:360)  may sleep
rt.def("/obj/item/weapon/restraints/legcuffs/bola/energy/proc/throw_impact", function* throw_impact(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/restraints/legcuffs/beartrap/energy/cyborg"), [rt.getStep(f, live(f.args[0]), 0)]))), "Crossed", [live(f.args[0])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["hit_atom"], waitfor: false });
