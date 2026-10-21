// From code/modules/mob/living/simple_animal/guardian/types/dextrous.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4875, "/mob/living/simple_animal/hostile/guardian/dextrous", "/mob/living/simple_animal/hostile/guardian", {
	internal_storage: null,
	playstyle_string: "<span class='holoparasite'>As a <b>dextrous</b> type you can hold items, store an item within yourself, and have medium damage resistance, but do low damage on attacks. Recalling and leashing will force you to drop unstored items!</span>",
	magic_fluff_string: "<span class='holoparasite'>..And draw the Drone, a dextrous master of construction and repair.</span>",
	tech_fluff_string: "<span class='holoparasite'>Boot sequence complete. Dextrous combat modules loaded. Holoparasite swarm online.</span>",
	carp_fluff_string: "<span class='holoparasite'>CARP CARP CARP! You caught one! It can hold stuff in its fins, sort of.</span>",
	melee_damage_lower: 10,
	melee_damage_upper: 10,
	damage_coeff: null,
	dextrous: 1,
	environment_target_typecache: null,
});

// /mob/living/simple_animal/hostile/guardian/dextrous/proc/<init>  (code/modules/mob/living/simple_animal/guardian/types/dextrous.dm:5)
rt.def("/mob/living/simple_animal/hostile/guardian/dextrous/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "damage_coeff", rt.alist(f, ["brute", 0.75, "fire", 0.75, "tox", 0.75, "clone", 0.75, "stamina", 0, "oxy", 0.75]));
	$0 = $0;
	rt.setSv(f, "environment_target_typecache", rt.list(T("/obj/machinery/door/window"), T("/obj/structure/window"), T("/obj/structure/closet"), T("/obj/structure/table"), T("/obj/structure/grille"), T("/obj/structure/rack"), T("/obj/structure/barricade"), T("/obj/machinery/camera")));
	return f.dot;
});

// /mob/living/simple_animal/hostile/guardian/dextrous/proc/death  (code/modules/mob/living/simple_animal/guardian/types/dextrous.dm:23)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/dextrous/proc/death", function* death(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "internal_storage"))) return f.dot;
	yield* g.srcCall(f, "dropItemToGround", rt.sv(f, "internal_storage"));
	return f.dot;
}, true, { args: ["gibbed"] });

// /mob/living/simple_animal/hostile/guardian/dextrous/proc/examine  (code/modules/mob/living/simple_animal/guardian/types/dextrous.dm:29)
rt.def("/mob/living/simple_animal/hostile/guardian/dextrous/proc/examine", function examine(f: Frame) {
	let msg: Value = null, I: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [msg, I, $0, $1, $e];
	if (truthy(rt.sv(f, "dextrous"))) {
		msg = fmt("<span class='info'>*---------*\nThis is ＀ ＇<b>！</b>!\n", [rt.call(f, P("/proc/bicon"), null, [live(f.src)]), live(f.src)]);
		msg = rt.modify(live(msg), fmt("＀\n", [rt.sv(f, "desc")]), add);
		I = null;
		rt.forList(f, 0, rt.sv(f, "held_items"), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			if (!truthy(rt.bitAnd(rt.fv(f, "flags", live(I)), 128))) {
				if (truthy(rt.fv(f, "blood_DNA", live(I)))) {
					$0 = rt.call(f, P("/proc/bicon"), null, [live(I)]);
					if (isEqual(rt.fv(f, "gender", live(I)), "plural")) {
						$1 = "some";
					} else {
						$1 = "a";
					}
					msg = rt.modify(live(msg), fmt("<span class='warning'>It has ＀ ＀ blood-stained ＀ in its ＀!</span>\n", [$0, $1, rt.fv(f, "name", live(I)), rt.callSrc(f, "get_held_index_name", [rt.callSrc(f, "get_held_index_of_item", [live(I)])])]), add);
				} else {
					msg = rt.modify(live(msg), fmt("It has ＀ ＇！ in its ＀.\n", [rt.call(f, P("/proc/bicon"), null, [live(I)]), live(I), rt.callSrc(f, "get_held_index_name", [rt.callSrc(f, "get_held_index_of_item", [live(I)])])]), add);
				}
			}
		}
		rt.endFor(f, 0);
		if ((truthy(rt.sv(f, "internal_storage")) && !truthy(rt.bitAnd(rt.fv(f, "flags", rt.sv(f, "internal_storage")), 128)))) {
			if (truthy(rt.fv(f, "blood_DNA", rt.sv(f, "internal_storage")))) {
				$0 = rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "internal_storage")]);
				if (isEqual(rt.fv(f, "gender", rt.sv(f, "internal_storage")), "plural")) {
					$1 = "some";
				} else {
					$1 = "a";
				}
				msg = rt.modify(live(msg), fmt("<span class='warning'>It is holding ＀ ＀ blood-stained ＀ in its internal storage!</span>\n", [$0, $1, rt.fv(f, "name", rt.sv(f, "internal_storage"))]), add);
			} else {
				msg = rt.modify(live(msg), fmt("It is holding ＀ ＇！ in its internal storage.\n", [rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "internal_storage")]), rt.sv(f, "internal_storage")]), add);
			}
		}
		msg = rt.modify(live(msg), "*---------*</span>", add);
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), live(msg)]);
	} else {
		rt.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, false, { args: ["user"] });

// /mob/living/simple_animal/hostile/guardian/dextrous/proc/Recall  (code/modules/mob/living/simple_animal/guardian/types/dextrous.dm:50)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/dextrous/proc/Recall", function* Recall(f: Frame) {
	if (((!truthy(rt.sv(f, "summoner")) || isEqual(rt.sv(f, "loc"), rt.sv(f, "summoner"))) || (rt.gt(rt.sv(f, "cooldown"), rt.worldTime(f)) && !truthy(live(f.args[0]))))) {
		return 0;
	}
	yield* g.srcCall(f, "drop_all_held_items");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["forced"] });

// /mob/living/simple_animal/hostile/guardian/dextrous/proc/snapback  (code/modules/mob/living/simple_animal/guardian/types/dextrous.dm:56)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/dextrous/proc/snapback", function* snapback(f: Frame) {
	if (!(truthy(rt.sv(f, "summoner")) && !rt.le((yield* g.call(f, P("/proc/get_dist"), null, [rt.getStep(f, rt.sv(f, "summoner"), 0), rt.getStep(f, live(f.src), 0)])), rt.sv(f, "range")))) return f.dot;
	yield* g.srcCall(f, "drop_all_held_items");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/guardian/dextrous/proc/doUnEquip  (code/modules/mob/living/simple_animal/guardian/types/dextrous.dm:62)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/dextrous/proc/doUnEquip", function* doUnEquip(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		yield* g.srcCall(f, "update_inv_hands");
		if (isEqual(live(f.args[0]), rt.sv(f, "internal_storage"))) {
			rt.setSv(f, "internal_storage", null);
			yield* g.srcCall(f, "update_inv_internal_storage");
		}
		return 1;
	}
	return 0;
}, true, { args: ["I", "force"] });

// /mob/living/simple_animal/hostile/guardian/dextrous/proc/can_equip  (code/modules/mob/living/simple_animal/guardian/types/dextrous.dm:71)
rt.def("/mob/living/simple_animal/hostile/guardian/dextrous/proc/can_equip", function can_equip(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(f.args[1]);
	if ($0 === 20) {
		if (truthy(rt.sv(f, "internal_storage"))) {
			return 0;
		}
		return 1;
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["I", "slot"] });

// /mob/living/simple_animal/hostile/guardian/dextrous/proc/equip_to_slot  (code/modules/mob/living/simple_animal/guardian/types/dextrous.dm:79)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/dextrous/proc/equip_to_slot", function* equip_to_slot(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[1]);
	if ($0 === 20) {
		rt.setSv(f, "internal_storage", live(f.args[0]));
		yield* g.srcCall(f, "update_inv_internal_storage");
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>You are trying to equip this item to an unsupported inventory slot. Report this to a coder!</span>"]);
	}
	return f.dot;
}, true, { args: ["I", "slot"] });

// /mob/living/simple_animal/hostile/guardian/dextrous/proc/update_inv_internal_storage  (code/modules/mob/living/simple_animal/guardian/types/dextrous.dm:96)
rt.def("/mob/living/simple_animal/hostile/guardian/dextrous/proc/update_inv_internal_storage", function update_inv_internal_storage(f: Frame) {
	if (!(((truthy(rt.sv(f, "internal_storage")) && truthy(rt.sv(f, "client"))) && truthy(rt.sv(f, "hud_used"))) && truthy(rt.fv(f, "hud_shown", rt.sv(f, "hud_used"))))) return f.dot;
	rt.setFv(f, "screen_loc", rt.sv(f, "internal_storage"), "CENTER-4:12,SOUTH:5");
	rt.modField(f, rt.sv(f, "client"), "screen", rt.sv(f, "internal_storage"), add);
	return f.dot;
});

// /mob/living/simple_animal/hostile/guardian/dextrous/proc/regenerate_icons  (code/modules/mob/living/simple_animal/guardian/types/dextrous.dm:101)
rt.def("/mob/living/simple_animal/hostile/guardian/dextrous/proc/regenerate_icons", function regenerate_icons(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_inv_internal_storage", []);
	return f.dot;
});
