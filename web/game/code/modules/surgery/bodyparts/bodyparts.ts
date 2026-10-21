// From code/modules/surgery/bodyparts/bodyparts.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10165, "/obj/item/bodypart", "/obj/item", {
	owner: null,
	original_owner: null,
	status: 1,
	body_zone: null,
	body_part: null,
	use_digitigrade: 0,
	brutestate: 0,
	burnstate: 0,
	brute_dam: 0,
	burn_dam: 0,
	max_damage: 0,
	embedded_objects: null,
	held_index: 0,
	is_pseudopart: 0,
	skin_tone: "",
	body_gender: "",
	species_id: "",
	should_draw_gender: 0,
	should_draw_greyscale: 0,
	species_color: "",
	mutation_color: "",
	no_update: 0,
	animal_origin: null,
	dismemberable: 1,
	px_x: 0,
	px_y: 0,
	species_flags_list: null,
	dmg_overlay_type: null,
	name: "limb",
	desc: "why is it detached...",
	force: 3,
	throwforce: 3,
	icon: rt.rsc("icons/mob/human_parts.dmi"),
	icon_state: "",
	layer: 3.7,
});

// /obj/item/bodypart/proc/<init>  (code/modules/surgery/bodyparts/bodyparts.dm:21)
rt.def("/obj/item/bodypart/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "embedded_objects", rt.list());
	$0 = $0;
	rt.setSv(f, "species_flags_list", rt.list());
	return f.dot;
});

// /obj/item/bodypart/proc/examine  (code/modules/surgery/bodyparts/bodyparts.dm:45)
rt.def("/obj/item/bodypart/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	if (rt.gt(rt.sv(f, "brute_dam"), 0)) {
		$0 = live(f.args[0]);
		if (rt.gt(rt.sv(f, "brute_dam"), 30)) {
			$1 = "severe";
		} else {
			$1 = "minor";
		}
		rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='warning'>This limb has ＀ bruising.</span>", [$1])]);
	}
	if (!rt.gt(rt.sv(f, "burn_dam"), 0)) return f.dot;
	$0 = live(f.args[0]);
	if (rt.gt(rt.sv(f, "burn_dam"), 30)) {
		$1 = "severe";
	} else {
		$1 = "minor";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='warning'>This limb has ＀ burns.</span>", [$1])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/bodypart/proc/blob_act  (code/modules/surgery/bodyparts/bodyparts.dm:52)  may sleep
rt.def("/obj/item/bodypart/proc/blob_act", function* blob_act(f: Frame) {
	yield* g.srcCall(f, "take_damage", rt.sv(f, "max_damage"));
	return f.dot;
}, true);

// /obj/item/bodypart/proc/Destroy  (code/modules/surgery/bodyparts/bodyparts.dm:56)  may sleep
rt.def("/obj/item/bodypart/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "owner"))) {
		(rt.modField(f, rt.sv(f, "owner"), "bodyparts", live(f.src), subtract));
		rt.setSv(f, "owner", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/bodypart/proc/attack  (code/modules/surgery/bodyparts/bodyparts.dm:61)  may sleep
rt.def("/obj/item/bodypart/proc/attack", function* attack(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		H = live(f.args[0]);
		if (truthy((rt.isIn(f, 23, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(H))))) ? 1 : 0))) {
			if ((!truthy((yield* g.callName(f, live(H), "get_bodypart", [rt.sv(f, "body_zone")]))) && !truthy(rt.sv(f, "animal_origin")))) {
				if (isEqual(live(H), live(f.args[1]))) {
					yield* g.callName(f, live(H), "visible_message", [fmt("<span class='warning'>＀ jams ＀ into ＀ empty socket!</span>", [live(H), live(f.src), (yield* g.callName(f, live(H), "p_their", []))]), fmt("<span class='notice'>You force ＀ into your empty socket, and it locks into place!</span>", [live(f.src)])]);
				} else {
					yield* g.callName(f, live(H), "visible_message", [fmt("<span class='warning'>＀ jams ＀ into ＀'s empty socket!</span>", [live(f.args[1]), live(f.src), live(H)]), fmt("<span class='notice'>＀ forces ＀ into your empty socket, and it locks into place!</span>", [live(f.args[1]), live(f.src)])]);
				}
				yield* g.callName(f, live(f.args[1]), "temporarilyRemoveItemFromInventory", [live(f.src), 1]);
				yield* g.srcCall(f, "attach_limb", live(f.args[0]));
				return live(f.dot);
			}
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["C", "user"] });

// /obj/item/bodypart/proc/attackby  (code/modules/surgery/bodyparts/bodyparts.dm:77)  may sleep
rt.def("/obj/item/bodypart/proc/attackby", function* attackby(f: Frame) {
	if (truthy(rt.fv(f, "sharpness", live(f.args[0])))) {
		yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
		if (!truthy(rt.len(f, rt.sv(f, "contents")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>There is nothing left inside ＀!</span>", [live(f.src)])]);
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/slice.ogg"), 50, 1, -1]);
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ begins to cut open ＀.</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You begin to cut open ＀...</span>", [live(f.src)])]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 54, "target", live(f.src)], rt.Args.Named)))) {
			yield* g.srcCall(f, "drop_organs", live(f.args[1]));
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/bodypart/proc/throw_impact  (code/modules/surgery/bodyparts/bodyparts.dm:91)
rt.def("/obj/item/bodypart/proc/throw_impact", function throw_impact(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.sv(f, "status"), 2)) {
		rt.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/misc/splort.ogg"), 50, 1, -1]);
	}
	rt.setSv(f, "pixel_x", rt.call(f, P("/proc/rand"), null, [-3, 3]));
	rt.setSv(f, "pixel_y", rt.call(f, P("/proc/rand"), null, [-3, 3]));
	return f.dot;
}, false, { args: ["hit_atom"], waitfor: false });

// /obj/item/bodypart/proc/drop_organs  (code/modules/surgery/bodyparts/bodyparts.dm:99)  may sleep
rt.def("/obj/item/bodypart/proc/drop_organs", function* drop_organs(f: Frame, user: Value) {
	let _T: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [user, _T, I, $e];
	_T = rt.getStep(f, live(f.src), 0);
	if (!isEqual(rt.sv(f, "status"), 2)) {
		yield* g.call(f, P("/proc/playsound"), null, [live(_T), rt.rsc("sound/misc/splort.ogg"), 50, 1, -1]);
	}
	I = null;
	rt.forList(f, 0, live(f.src), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.callName(f, live(I), "forceMove", [live(_T)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/bodypart/proc/receive_damage  (code/modules/surgery/bodyparts/bodyparts.dm:109)  may sleep
rt.def("/obj/item/bodypart/proc/receive_damage", function* receive_damage(f: Frame, brute: Value, burn: Value, updating_health: Value) {
	let can_inflict: Value = null;
	let $0: any;
	f.vars = () => [brute, burn, updating_health, can_inflict, $0];
	if (live(updating_health) === null) {
		updating_health = 1;
	}
	if ((truthy(rt.sv(f, "owner")) && truthy(rt.bitAnd(rt.fv(f, "status_flags", rt.sv(f, "owner")), 4096)))) {
		return 0;
	}
	brute = (yield* g.call(f, P("/proc/max"), null, [multiply(live(brute), rt.fv(f, "damage_multiplier", rt.gl("config"))), 0]));
	burn = (yield* g.call(f, P("/proc/max"), null, [multiply(live(burn), rt.fv(f, "damage_multiplier", rt.gl("config"))), 0]));
	if (isEqual(rt.sv(f, "status"), 2)) {
		brute = (yield* g.call(f, P("/proc/max"), null, [0, subtract(live(brute), 5)]));
		burn = (yield* g.call(f, P("/proc/max"), null, [0, subtract(live(burn), 4)]));
	}
	$0 = rt.sv(f, "animal_origin");
	if ($0 === "alien" || $0 === "larva") {
		(burn = rt.modify(live(burn), 2, multiply));
	}
	if (!truthy((can_inflict = subtract(rt.sv(f, "max_damage"), add(rt.sv(f, "brute_dam"), rt.sv(f, "burn_dam")))))) {
		return 0;
	}
	if (rt.lt(add(live(brute), live(burn)), live(can_inflict))) {
		rt.modSrcVar(f, "brute_dam", live(brute), add);
		rt.modSrcVar(f, "burn_dam", live(burn), add);
	} else {
		if (rt.gt(live(brute), 0)) {
			if (rt.gt(live(burn), 0)) {
				brute = (yield* g.call(f, P("/proc/round"), null, [multiply(divide(live(brute), add(live(brute), live(burn))), live(can_inflict)), 1]));
				burn = subtract(live(can_inflict), live(brute));
				rt.modSrcVar(f, "brute_dam", live(brute), add);
				rt.modSrcVar(f, "burn_dam", live(burn), add);
			} else {
				rt.modSrcVar(f, "brute_dam", live(can_inflict), add);
			}
		} else {
			if (rt.gt(live(burn), 0)) {
				rt.modSrcVar(f, "burn_dam", live(can_inflict), add);
			} else {
				return 0;
			}
		}
	}
	if ((truthy(rt.sv(f, "owner")) && truthy(live(updating_health)))) {
		yield* g.callName(f, rt.sv(f, "owner"), "updatehealth", []);
	}
	return (yield* g.srcCall(f, "update_bodypart_damage_state"));
}, true);

// /obj/item/bodypart/proc/heal_damage  (code/modules/surgery/bodyparts/bodyparts.dm:154)  may sleep
rt.def("/obj/item/bodypart/proc/heal_damage", function* heal_damage(f: Frame, brute: Value, burn: Value, only_robotic: Value, only_organic: Value, updating_health: Value) {
	f.vars = () => [brute, burn, only_robotic, only_organic, updating_health];
	if (live(only_robotic) === null) {
		only_robotic = 0;
	}
	if (live(only_organic) === null) {
		only_organic = 1;
	}
	if (live(updating_health) === null) {
		updating_health = 1;
	}
	if ((truthy(live(only_robotic)) && !isEqual(rt.sv(f, "status"), 2))) {
		return live(f.dot);
	}
	if ((truthy(live(only_organic)) && !isEqual(rt.sv(f, "status"), 1))) {
		return live(f.dot);
	}
	rt.setSv(f, "brute_dam", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "brute_dam"), live(brute)), 0])));
	rt.setSv(f, "burn_dam", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "burn_dam"), live(burn)), 0])));
	if ((truthy(rt.sv(f, "owner")) && truthy(live(updating_health)))) {
		yield* g.callName(f, rt.sv(f, "owner"), "updatehealth", []);
	}
	return (yield* g.srcCall(f, "update_bodypart_damage_state"));
}, true);

// /obj/item/bodypart/proc/get_damage  (code/modules/surgery/bodyparts/bodyparts.dm:169)
rt.def("/obj/item/bodypart/proc/get_damage", function get_damage(f: Frame) {
	return add(rt.sv(f, "brute_dam"), rt.sv(f, "burn_dam"));
});

// /obj/item/bodypart/proc/update_bodypart_damage_state  (code/modules/surgery/bodyparts/bodyparts.dm:175)
rt.def("/obj/item/bodypart/proc/update_bodypart_damage_state", function update_bodypart_damage_state(f: Frame) {
	let tbrute: Value = null, tburn: Value = null;
	f.vars = () => [tbrute, tburn];
	tbrute = rt.call(f, P("/proc/round"), null, [multiply(divide(rt.sv(f, "brute_dam"), rt.sv(f, "max_damage")), 3), 1]);
	tburn = rt.call(f, P("/proc/round"), null, [multiply(divide(rt.sv(f, "burn_dam"), rt.sv(f, "max_damage")), 3), 1]);
	if ((!isEqual(live(tbrute), rt.sv(f, "brutestate")) || !isEqual(live(tburn), rt.sv(f, "burnstate")))) {
		rt.setSv(f, "brutestate", live(tbrute));
		rt.setSv(f, "burnstate", live(tburn));
		return 1;
	}
	return 0;
});

// /obj/item/bodypart/proc/change_bodypart_status  (code/modules/surgery/bodyparts/bodyparts.dm:187)  may sleep
rt.def("/obj/item/bodypart/proc/change_bodypart_status", function* change_bodypart_status(f: Frame, new_limb_status: Value, heal_limb: Value, change_icon_to_default: Value) {
	f.vars = () => [new_limb_status, heal_limb, change_icon_to_default];
	rt.setSv(f, "status", live(new_limb_status));
	if (truthy(live(heal_limb))) {
		rt.setSv(f, "burn_dam", 0);
		rt.setSv(f, "brute_dam", 0);
		rt.setSv(f, "brutestate", 0);
		rt.setSv(f, "burnstate", 0);
	}
	if (truthy(live(change_icon_to_default))) {
		if (isEqual(rt.sv(f, "status"), 1)) {
			rt.setSv(f, "icon", rt.rsc("icons/mob/human_parts_greyscale.dmi"));
		} else {
			if (isEqual(rt.sv(f, "status"), 2)) {
				rt.setSv(f, "icon", rt.rsc("icons/mob/augments.dmi"));
			}
		}
	}
	if (!truthy(rt.sv(f, "owner"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "owner"), "updatehealth", []);
	yield* g.callName(f, rt.sv(f, "owner"), "update_body", []);
	yield* g.callName(f, rt.sv(f, "owner"), "update_hair", []);
	yield* g.callName(f, rt.sv(f, "owner"), "update_damage_overlays", []);
	return f.dot;
}, true);

// /obj/item/bodypart/proc/update_limb  (code/modules/surgery/bodyparts/bodyparts.dm:210)
rt.def("/obj/item/bodypart/proc/update_limb", function update_limb(f: Frame, dropping_limb: Value, source: Value) {
	let C: Value = null, H: Value = null, S: Value = null;
	f.vars = () => [C, H, S];
	C = null;
	if (truthy(live(source))) {
		C = live(source);
		if (!truthy(rt.sv(f, "original_owner"))) {
			rt.setSv(f, "original_owner", live(source));
		}
	} else {
		if ((truthy(rt.sv(f, "original_owner")) && !isEqual(rt.sv(f, "owner"), rt.sv(f, "original_owner")))) {
			rt.setSv(f, "no_update", 1);
		} else {
			C = rt.sv(f, "owner");
			rt.setSv(f, "no_update", 0);
		}
	}
	if (truthy(rt.bitAnd(rt.fv(f, "disabilities", live(C)), 64))) {
		rt.setSv(f, "species_id", "husk");
		rt.setSv(f, "dmg_overlay_type", "");
		rt.setSv(f, "should_draw_gender", 0);
		rt.setSv(f, "should_draw_greyscale", 0);
		rt.setSv(f, "no_update", 1);
	}
	if (truthy(rt.sv(f, "no_update"))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "animal_origin"))) {
		H = live(C);
		rt.setSv(f, "should_draw_greyscale", 0);
		rt.setSv(f, "species_id", rt.gv(f, "limbs_id", (S = rt.gv(f, "species", rt.fv(f, "dna", live(H))))));
		rt.setSv(f, "species_flags_list", rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(H)))));
		if (truthy(rt.fv(f, "use_skintones", live(S)))) {
			rt.setSv(f, "skin_tone", rt.fv(f, "skin_tone", live(H)));
			rt.setSv(f, "should_draw_greyscale", 1);
		} else {
			rt.setSv(f, "skin_tone", "");
		}
		rt.setSv(f, "body_gender", rt.fv(f, "gender", live(H)));
		rt.setSv(f, "should_draw_gender", rt.fv(f, "sexes", live(S)));
		if (truthy((rt.isIn(f, 1, rt.fv(f, "species_traits", live(S))) ? 1 : 0))) {
			if (truthy(rt.fv(f, "fixed_mut_color", live(S)))) {
				rt.setSv(f, "species_color", rt.fv(f, "fixed_mut_color", live(S)));
			} else {
				rt.setSv(f, "species_color", rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "mcolor"));
			}
			rt.setSv(f, "should_draw_greyscale", 1);
		} else {
			rt.setSv(f, "species_color", "");
		}
		if ((!truthy(live(dropping_limb)) && truthy(rt.callName(f, rt.fv(f, "dna", live(H)), "check_mutation", ["Hulk"])))) {
			rt.setSv(f, "mutation_color", "00aa00");
		} else {
			rt.setSv(f, "mutation_color", "");
		}
		rt.setSv(f, "dmg_overlay_type", rt.fv(f, "damage_overlay_type", live(S)));
	} else {
		if (isEqual(rt.sv(f, "animal_origin"), "monkey")) {
			rt.setSv(f, "dmg_overlay_type", rt.sv(f, "animal_origin"));
		}
	}
	if (isEqual(rt.sv(f, "status"), 2)) {
		rt.setSv(f, "dmg_overlay_type", "robotic");
	}
	if (!truthy(live(dropping_limb))) return f.dot;
	rt.setSv(f, "no_update", 1);
	return f.dot;
});

// /obj/item/bodypart/proc/update_icon_dropped  (code/modules/surgery/bodyparts/bodyparts.dm:273)
rt.def("/obj/item/bodypart/proc/update_icon_dropped", function update_icon_dropped(f: Frame) {
	let standing: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [standing, I, $e];
	rt.callSrc(f, "cut_overlays", []);
	if (!truthy(rt.getLen(f, (standing = rt.callSrc(f, "get_limb_icon", [1]))))) {
		rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
		return live(f.dot);
	}
	I = null;
	rt.forList(f, 0, live(standing), T("/image"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		rt.setFv(f, "pixel_x", live(I), rt.sv(f, "px_x"));
		rt.setFv(f, "pixel_y", live(I), rt.sv(f, "px_y"));
	}
	rt.endFor(f, 0);
	rt.callSrc(f, "add_overlay", [live(standing)]);
	return f.dot;
});

// /obj/item/bodypart/proc/get_limb_icon  (code/modules/surgery/bodyparts/bodyparts.dm:285)
rt.def("/obj/item/bodypart/proc/get_limb_icon", function get_limb_icon(f: Frame, dropped: Value) {
	let image_dir: Value = null, limb: Value = null, icon_gender: Value = null, draw_color: Value = null;
	let $0: any;
	f.vars = () => [image_dir, limb, icon_gender, draw_color, $0];
	rt.setSv(f, "icon_state", "");
	f.dot = rt.list();
	image_dir = 0;
	if (truthy(live(dropped))) {
		image_dir = 2;
		if (truthy(rt.sv(f, "dmg_overlay_type"))) {
			if (truthy(rt.sv(f, "brutestate"))) {
				f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/image"), null, [rt.rsc("icons/mob/dam_mob.dmi"), fmt("＀_＀_＀0", [rt.sv(f, "dmg_overlay_type"), rt.sv(f, "body_zone"), rt.sv(f, "brutestate")]), -20, live(image_dir)]), add);
			}
			if (truthy(rt.sv(f, "burnstate"))) {
				f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/image"), null, [rt.rsc("icons/mob/dam_mob.dmi"), fmt("＀_＀_0＀", [rt.sv(f, "dmg_overlay_type"), rt.sv(f, "body_zone"), rt.sv(f, "burnstate")]), -20, live(image_dir)]), add);
			}
		}
	}
	f.dot = rt.modify(live(f.dot), (limb = rt.call(f, P("/proc/image"), null, ["layer", -24, "dir", live(image_dir)], rt.Args.Named)), add);
	if (truthy(rt.sv(f, "animal_origin"))) {
		if (isEqual(rt.sv(f, "status"), 1)) {
			rt.setFv(f, "icon", live(limb), rt.rsc("icons/mob/animal_parts.dmi"));
			if (isEqual(rt.sv(f, "species_id"), "husk")) {
				rt.setFv(f, "icon_state", live(limb), fmt("＀_husk_＀", [rt.sv(f, "animal_origin"), rt.sv(f, "body_zone")]));
			} else {
				rt.setFv(f, "icon_state", live(limb), fmt("＀_＀", [rt.sv(f, "animal_origin"), rt.sv(f, "body_zone")]));
			}
		} else {
			rt.setFv(f, "icon", live(limb), rt.rsc("icons/mob/augments.dmi"));
			rt.setFv(f, "icon_state", live(limb), fmt("＀_＀", [rt.sv(f, "animal_origin"), rt.sv(f, "body_zone")]));
		}
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "body_gender"), "female")) {
		$0 = "f";
	} else {
		$0 = "m";
	}
	icon_gender = $0;
	if ((!isEqual(rt.sv(f, "body_zone"), "head") && !isEqual(rt.sv(f, "body_zone"), "chest"))) {
		rt.setSv(f, "should_draw_gender", 0);
	}
	if (isEqual(rt.sv(f, "status"), 1)) {
		if (truthy(rt.sv(f, "should_draw_greyscale"))) {
			rt.setFv(f, "icon", live(limb), rt.rsc("icons/mob/human_parts_greyscale.dmi"));
			if (truthy(rt.sv(f, "should_draw_gender"))) {
				rt.setFv(f, "icon_state", live(limb), fmt("＀_＀_＀", [rt.sv(f, "species_id"), rt.sv(f, "body_zone"), live(icon_gender)]));
			} else {
				if (truthy(rt.sv(f, "use_digitigrade"))) {
					rt.setFv(f, "icon_state", live(limb), fmt("digitigrade_＀_＀", [rt.sv(f, "use_digitigrade"), rt.sv(f, "body_zone")]));
				} else {
					rt.setFv(f, "icon_state", live(limb), fmt("＀_＀", [rt.sv(f, "species_id"), rt.sv(f, "body_zone")]));
				}
			}
		} else {
			rt.setFv(f, "icon", live(limb), rt.rsc("icons/mob/human_parts.dmi"));
			if (truthy(rt.sv(f, "should_draw_gender"))) {
				rt.setFv(f, "icon_state", live(limb), fmt("＀_＀_＀", [rt.sv(f, "species_id"), rt.sv(f, "body_zone"), live(icon_gender)]));
			} else {
				rt.setFv(f, "icon_state", live(limb), fmt("＀_＀", [rt.sv(f, "species_id"), rt.sv(f, "body_zone")]));
			}
		}
	} else {
		rt.setFv(f, "icon", live(limb), rt.sv(f, "icon"));
		if (truthy(rt.sv(f, "should_draw_gender"))) {
			rt.setFv(f, "icon_state", live(limb), fmt("＀_＀", [rt.sv(f, "body_zone"), live(icon_gender)]));
		} else {
			rt.setFv(f, "icon_state", live(limb), fmt("＀", [rt.sv(f, "body_zone")]));
		}
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "should_draw_greyscale"))) return f.dot;
	if (!truthy((draw_color = ((rt.sv(f, "mutation_color") || rt.sv(f, "species_color")) || (rt.sv(f, "skin_tone") && rt.call(f, P("/proc/skintone2hex"), null, [rt.sv(f, "skin_tone")])))))) return f.dot;
	rt.setFv(f, "color", live(limb), fmt("#＀", [live(draw_color)]));
	return f.dot;
});

// /obj/item/bodypart/proc/deconstruct  (code/modules/surgery/bodyparts/bodyparts.dm:349)  may sleep
rt.def("/obj/item/bodypart/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	yield* g.srcCall(f, "drop_organs");
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(10166, "/obj/item/bodypart/chest", "/obj/item/bodypart", {
	cavity_item: null,
	max_damage: 200,
	body_zone: "chest",
	body_part: 2,
	px_x: 0,
	px_y: 0,
	name: "chest",
	desc: "It's impolite to stare at a person's chest.",
	icon_state: "default_human_chest",
});

// /obj/item/bodypart/chest/proc/Destroy  (code/modules/surgery/bodyparts/bodyparts.dm:365)  may sleep
rt.def("/obj/item/bodypart/chest/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "cavity_item"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "cavity_item")]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/bodypart/chest/proc/drop_organs  (code/modules/surgery/bodyparts/bodyparts.dm:370)  may sleep
rt.def("/obj/item/bodypart/chest/proc/drop_organs", function* drop_organs(f: Frame) {
	if (truthy(rt.sv(f, "cavity_item"))) {
		yield* g.callName(f, rt.sv(f, "cavity_item"), "forceMove", [rt.fv(f, "loc", live(f.args[0]))]);
		rt.setSv(f, "cavity_item", null);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });
