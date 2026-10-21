// From code/modules/clothing/clothing.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7652, "/obj/item/clothing", "/obj/item", {
	damaged_clothes: 0,
	flash_protect: 0,
	tint: 0,
	up: 0,
	visor_flags: 0,
	visor_flags_inv: 0,
	visor_flags_cover: 0,
	visor_vars_to_toggle: 31,
	alt_desc: null,
	toggle_message: null,
	alt_toggle_message: null,
	active_sound: null,
	toggle_cooldown: null,
	cooldown: 0,
	F: null,
	can_flashlight: 0,
	gang: null,
	scan_reagents: 0,
	user_vars_to_edit: null,
	user_vars_remembered: null,
	pockets: null,
	dynamic_hair_suffix: "",
	dynamic_fhair_suffix: "",
	name: "clothing",
	resistance_flags: 4,
	obj_integrity: 200,
	max_integrity: 200,
	integrity_failure: 80,
	lefthand_file: rt.rsc("icons/mob/inhands/clothing_lefthand.dmi"),
	righthand_file: rt.rsc("icons/mob/inhands/clothing_righthand.dmi"),
});

// /obj/item/clothing/proc/<init>  (code/modules/clothing/clothing.dm:30)
rt.def("/obj/item/clothing/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "user_vars_to_edit", rt.list());
	$0 = $0;
	rt.setSv(f, "user_vars_remembered", rt.list());
	return f.dot;
});

// /obj/item/clothing/proc/New  (code/modules/clothing/clothing.dm:43)  may sleep
rt.def("/obj/item/clothing/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.call(f, P("/proc/ispath"), null, [rt.sv(f, "pockets")])))) return f.dot;
	rt.setSv(f, "pockets", (yield* g.new_(f, rt.sv(f, "pockets"), [live(f.src)])));
	return f.dot;
}, true);

// /obj/item/clothing/proc/MouseDrop  (code/modules/clothing/clothing.dm:48)  may sleep
rt.def("/obj/item/clothing/proc/MouseDrop", function* MouseDrop(f: Frame, over_object: Value) {
	let M: Value = null, H: Value = null;
	f.vars = () => [over_object, M, H];
	M = live(f.usr);
	if ((truthy(rt.sv(f, "pockets")) && isEqual(live(over_object), live(M)))) {
		return (yield* g.callName(f, rt.sv(f, "pockets"), "MouseDrop", [live(over_object)]));
	}
	if (truthy((rt.istype(rt.fv(f, "loc", live(f.usr)), T("/obj/mecha")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!((!truthy((yield* g.callName(f, live(M), "incapacitated", []))) && isEqual(rt.sv(f, "loc"), live(M))) && truthy((rt.istype(live(over_object), T("/obj/screen/inventory/hand")) ? 1 : 0)))) return f.dot;
	H = live(over_object);
	if (!truthy((yield* g.callName(f, live(M), "putItemFromInventoryInHandIfPossible", [live(f.src), rt.fv(f, "held_index", live(H))])))) return f.dot;
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	return f.dot;
}, true);

// /obj/item/clothing/proc/throw_at  (code/modules/clothing/clothing.dm:63)  may sleep
rt.def("/obj/item/clothing/proc/throw_at", function* throw_at(f: Frame) {
	if (live(f.args[4]) === null) {
		f.args[4] = 1;
	}
	if (live(f.args[5]) === null) {
		f.args[5] = 0;
	}
	if (truthy(rt.sv(f, "pockets"))) {
		yield* g.callName(f, rt.sv(f, "pockets"), "close_all", []);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["target", "range", "speed", "thrower", "spin", "diagonals_first", "callback"] });

// /obj/item/clothing/proc/attack_hand  (code/modules/clothing/clothing.dm:67)  may sleep
rt.def("/obj/item/clothing/proc/attack_hand", function* attack_hand(f: Frame) {
	if (((truthy(rt.sv(f, "pockets")) && truthy(rt.fv(f, "priority", rt.sv(f, "pockets")))) && truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")]))))) {
		if (isEqual(rt.fv(f, "s_active", live(f.args[0])), rt.sv(f, "pockets"))) {
			yield* g.callName(f, rt.sv(f, "pockets"), "close", [live(f.args[0])]);
		} else {
			if (truthy(rt.fv(f, "s_active", live(f.args[0])))) {
				yield* g.callName(f, rt.fv(f, "s_active", live(f.args[0])), "close", [live(f.args[0])]);
			}
			yield* g.callName(f, rt.sv(f, "pockets"), "orient2hud", [live(f.args[0])]);
			yield* g.callName(f, rt.sv(f, "pockets"), "show_to", [live(f.args[0])]);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/clothing/proc/attackby  (code/modules/clothing/clothing.dm:81)  may sleep
rt.def("/obj/item/clothing/proc/attackby", function* attackby(f: Frame) {
	let C: Value = null, i: Value = null;
	f.vars = () => [C, i];
	if ((truthy(rt.sv(f, "damaged_clothes")) && truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/cloth")) ? 1 : 0)))) {
		yield* g.callName(f, (C = live(f.args[0])), "use", [1]);
		yield* g.srcCall(f, "update_clothes_damaged_state", 0);
		rt.setSv(f, "obj_integrity", rt.sv(f, "max_integrity"));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You fix the damage on ＀ with ＀.</span>", [live(f.src), live(C)])]);
		return 1;
	}
	if (truthy(rt.sv(f, "pockets"))) {
		if (truthy((i = (yield* g.callName(f, rt.sv(f, "pockets"), "attackby", [live(f.args[0]), live(f.args[1]), live(f.args[2])]))))) {
			return live(i);
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["W", "user", "params"] });

// /obj/item/clothing/proc/AltClick  (code/modules/clothing/clothing.dm:95)  may sleep
rt.def("/obj/item/clothing/proc/AltClick", function* AltClick(f: Frame) {
	let I: Value = null;
	f.vars = () => [I];
	if ((((truthy(rt.sv(f, "pockets")) && truthy(rt.fv(f, "quickdraw", rt.sv(f, "pockets")))) && truthy(rt.getLen(f, rt.fv(f, "contents", rt.sv(f, "pockets"))))) && !truthy((yield* g.callName(f, live(f.args[0]), "incapacitated", []))))) {
		if (!truthy((I = rt.index(rt.fv(f, "contents", rt.sv(f, "pockets")), 1)))) {
			return live(f.dot);
		}
		yield* g.callName(f, rt.sv(f, "pockets"), "remove_from_storage", [live(I), rt.getStep(f, live(f.src), 0)]);
		if (!truthy((yield* g.callName(f, live(f.args[0]), "put_in_hands", [live(I)])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>You fumble for ＀ and it falls on the floor.</span>", [live(I)])]);
			return 1;
		}
		yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='warning'>＀ draws ＀ from ＀!</span>", [live(f.args[0]), live(I), live(f.src)]), fmt("<span class='notice'>You draw ＀ from ＀.</span>", [live(I), live(f.src)])]);
		return 1;
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/clothing/proc/Destroy  (code/modules/clothing/clothing.dm:111)  may sleep
rt.def("/obj/item/clothing/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living")) ? 1 : 0))) {
		yield* g.srcCall(f, "dropped", rt.sv(f, "loc"));
	}
	if (truthy(rt.sv(f, "pockets"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "pockets")]);
		rt.setSv(f, "pockets", null);
	}
	rt.setSv(f, "user_vars_remembered", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/clothing/proc/dropped  (code/modules/clothing/clothing.dm:121)  may sleep
rt.def("/obj/item/clothing/proc/dropped", function* dropped(f: Frame) {
	let variable: Value = null;
	let $e: any;
	f.vars = () => [variable, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.args[0]), T("/mob")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!(truthy(rt.sv(f, "user_vars_remembered")) && truthy(rt.len(f, rt.sv(f, "user_vars_remembered"))))) return f.dot;
	variable = null;
	rt.forList(f, 0, rt.sv(f, "user_vars_remembered"));
	while (($e = rt.next(f, 0)) !== undefined) {
		variable = $e;
		if (truthy((rt.isIn(f, live(variable), rt.fv(f, "vars", live(f.args[0]))) ? 1 : 0))) {
			if (isEqual(rt.index(rt.fv(f, "vars", live(f.args[0])), live(variable)), rt.index(rt.sv(f, "user_vars_to_edit"), live(variable)))) {
				rt.setAt(rt.fv(f, "vars", live(f.args[0])), live(variable), rt.index(rt.sv(f, "user_vars_remembered"), live(variable)));
			}
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "user_vars_remembered", rt.list());
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/clothing/proc/equipped  (code/modules/clothing/clothing.dm:133)  may sleep
rt.def("/obj/item/clothing/proc/equipped", function* equipped(f: Frame) {
	let variable: Value = null;
	let $e: any;
	f.vars = () => [variable, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.bitAnd(rt.sv(f, "slot_flags"), (yield* g.call(f, P("/proc/slotdefine2slotbit"), null, [live(f.args[1])]))))) return f.dot;
	variable = null;
	rt.forList(f, 0, rt.sv(f, "user_vars_to_edit"));
	while (($e = rt.next(f, 0)) !== undefined) {
		variable = $e;
		if (truthy((rt.isIn(f, live(variable), rt.fv(f, "vars", live(f.args[0]))) ? 1 : 0))) {
			rt.setAt(rt.sv(f, "user_vars_remembered"), live(variable), rt.index(rt.fv(f, "vars", live(f.args[0])), live(variable)));
			rt.setAt(rt.fv(f, "vars", live(f.args[0])), live(variable), rt.index(rt.sv(f, "user_vars_to_edit"), live(variable)));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["user", "slot"] });

// /obj/item/clothing/proc/examine  (code/modules/clothing/clothing.dm:143)
rt.def("/obj/item/clothing/proc/examine", function examine(f: Frame) {
	let how_cool_are_your_threads: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [how_cool_are_your_threads, $0, $1, $2];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "damaged_clothes"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>It looks damaged!</span>"]);
	}
	if (!truthy(rt.sv(f, "pockets"))) return f.dot;
	how_cool_are_your_threads = rt.list("<span class='notice'>");
	if (truthy(rt.fv(f, "priority", rt.sv(f, "pockets")))) {
		how_cool_are_your_threads = rt.modify(live(how_cool_are_your_threads), fmt("Your ＀'s storage opens when clicked.\n", [live(f.src)]), add);
	} else {
		how_cool_are_your_threads = rt.modify(live(how_cool_are_your_threads), fmt("Your ＀'s storage opens when dragged to yourself.\n", [live(f.src)]), add);
	}
	$0 = live(f.src);
	$1 = rt.fv(f, "storage_slots", rt.sv(f, "pockets"));
	if (rt.gt(rt.fv(f, "storage_slots", rt.sv(f, "pockets")), 1)) {
		$2 = "s";
	} else {
		$2 = "";
	}
	how_cool_are_your_threads = rt.modify(live(how_cool_are_your_threads), fmt("Your ＀ can store ＀ item＀.\n", [$0, $1, $2]), add);
	how_cool_are_your_threads = rt.modify(live(how_cool_are_your_threads), fmt("Your ＀ can store items that are ＀ or smaller.\n", [live(f.src), rt.call(f, P("/proc/weightclass2text"), null, [rt.fv(f, "max_w_class", rt.sv(f, "pockets"))])]), add);
	if (truthy(rt.fv(f, "quickdraw", rt.sv(f, "pockets")))) {
		how_cool_are_your_threads = rt.modify(live(how_cool_are_your_threads), fmt("You can quickly remove an item from your ＀ using Alt-Click.\n", [live(f.src)]), add);
	}
	if (truthy(rt.fv(f, "silent", rt.sv(f, "pockets")))) {
		how_cool_are_your_threads = rt.modify(live(how_cool_are_your_threads), fmt("Adding or Removing items from your ＀ makes no noise.\n", [live(f.src)]), add);
	}
	how_cool_are_your_threads = rt.modify(live(how_cool_are_your_threads), "</span>", add);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), rt.callName(f, live(how_cool_are_your_threads), "Join", [])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/clothing/proc/obj_break  (code/modules/clothing/clothing.dm:162)  may sleep
rt.def("/obj/item/clothing/proc/obj_break", function* obj_break(f: Frame, damage_flag: Value) {
	let M: Value = null;
	f.vars = () => [damage_flag, M];
	if (!truthy(rt.sv(f, "damaged_clothes"))) {
		yield* g.srcCall(f, "update_clothes_damaged_state", 1);
	}
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) return f.dot;
	yield* g.callName(f, (M = rt.sv(f, "loc")), "visible_message", [fmt("<span class='warning'>＀'s ＀ starts to fall apart!", [live(M), rt.sv(f, "name")]), fmt("<span class='warning'>Your ＀ starts to fall apart!", [rt.sv(f, "name")])]);
	return f.dot;
}, true);

// /obj/item/clothing/proc/update_clothes_damaged_state  (code/modules/clothing/clothing.dm:169)
rt.def("/obj/item/clothing/proc/update_clothes_damaged_state", function update_clothes_damaged_state(f: Frame, damaging: Value) {
	let index: Value = null, damaged_clothes_icon: Value = null;
	f.vars = () => [damaging, index, damaged_clothes_icon];
	if (live(damaging) === null) {
		damaging = 1;
	}
	index = fmt("＃-＀", [rt.initial(f, live(f.src), "icon"), rt.initial(f, live(f.src), "icon_state")]);
	if (truthy(live(damaging))) {
		rt.setSv(f, "damaged_clothes", 1);
		if (!truthy((damaged_clothes_icon = rt.index(rt.gl("damaged_clothes_icons"), live(index))))) {
			rt.callName(f, (damaged_clothes_icon = rt.call(f, P("/proc/icon"), null, [rt.initial(f, live(f.src), "icon"), rt.initial(f, live(f.src), "icon_state"), null, 1])), "Blend", ["#fff", 0]);
			rt.callName(f, live(damaged_clothes_icon), "Blend", [rt.call(f, P("/proc/icon"), null, [rt.rsc("icons/effects/item_damage.dmi"), "itemdamaged"]), 2]);
			damaged_clothes_icon = rt.call(f, P("/proc/fcopy_rsc"), null, [live(damaged_clothes_icon)]);
			rt.setAt(rt.gl("damaged_clothes_icons"), live(index), live(damaged_clothes_icon));
		}
		rt.callSrc(f, "add_overlay", [live(damaged_clothes_icon), 1]);
	} else {
		rt.setSv(f, "damaged_clothes", 0);
		rt.callSrc(f, "cut_overlay", [rt.index(rt.gl("damaged_clothes_icons"), live(index)), 1]);
	}
	return f.dot;
});

rt.type(8593, "/obj/item/clothing/ears/earmuffs", "/obj/item/clothing/ears", {
	name: "earmuffs",
	desc: "Protects your hearing from loud noises, and quiet ones as well.",
	icon_state: "earmuffs",
	item_state: "earmuffs",
	strip_delay: 15,
	equip_delay_other: 25,
	resistance_flags: 4,
});

// /obj/item/clothing/ears/earmuffs/proc/Initialize  (code/modules/clothing/clothing.dm:204)  may sleep
rt.def("/obj/item/clothing/ears/earmuffs/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.fv(f, "secondary_flags", live(f.src)))) {
		rt.setFv(f, "secondary_flags", live(f.src), rt.list());
	}
	rt.setAt(rt.fv(f, "secondary_flags", live(f.src)), "bang_protect", 1);
	if (!truthy(rt.fv(f, "secondary_flags", live(f.src)))) {
		rt.setFv(f, "secondary_flags", live(f.src), rt.list());
	}
	rt.setAt(rt.fv(f, "secondary_flags", live(f.src)), "heals_ears", 1);
	return f.dot;
}, true, { args: ["mapload"] });

rt.type(8204, "/obj/item/clothing/glasses", "/obj/item/clothing", {
	vision_flags: 0,
	darkness_view: 2,
	invis_view: 25,
	invis_override: 0,
	lighting_alpha: null,
	emagged: 0,
	current: null,
	vision_correction: 0,
	glass_colour_type: null,
	name: "glasses",
	icon: rt.rsc("icons/obj/clothing/glasses.dmi"),
	w_class: 2,
	flags_cover: 1,
	slot_flags: 8,
	strip_delay: 20,
	equip_delay_other: 25,
	resistance_flags: 0,
	materials: null,
});

// /obj/item/clothing/glasses/proc/<init>  (code/modules/clothing/clothing.dm:221)
rt.def("/obj/item/clothing/glasses/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "current", rt.list());
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 250]));
	return f.dot;
});

rt.type(7653, "/obj/item/clothing/gloves", "/obj/item/clothing", {
	transfer_prints: 0,
	transfer_blood: 0,
	name: "gloves",
	gender: "plural",
	w_class: 2,
	icon: rt.rsc("icons/obj/clothing/gloves.dmi"),
	siemens_coefficient: 0.5,
	body_parts_covered: 1536,
	slot_flags: 4,
	attack_verb: null,
	strip_delay: 20,
	equip_delay_other: 40,
});

// /obj/item/clothing/gloves/proc/<init>  (code/modules/clothing/clothing.dm:246)
rt.def("/obj/item/clothing/gloves/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("challenged"));
	return f.dot;
});

// /obj/item/clothing/gloves/proc/worn_overlays  (code/modules/clothing/clothing.dm:253)
rt.def("/obj/item/clothing/gloves/proc/worn_overlays", function worn_overlays(f: Frame, isinhands: Value) {
	f.vars = () => [isinhands];
	if (live(isinhands) === null) {
		isinhands = 0;
	}
	f.dot = rt.list();
	if (truthy(live(isinhands))) return f.dot;
	if (truthy(rt.sv(f, "damaged_clothes"))) {
		f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/item_damage.dmi"), "damagedgloves"]), add);
	}
	if (!truthy(rt.sv(f, "blood_DNA"))) return f.dot;
	f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/blood.dmi"), "bloodyhands"]), add);
	return f.dot;
});

// /obj/item/clothing/gloves/proc/update_clothes_damaged_state  (code/modules/clothing/clothing.dm:261)
rt.def("/obj/item/clothing/gloves/proc/update_clothes_damaged_state", function update_clothes_damaged_state(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (live(f.args[0]) === null) {
		f.args[0] = 1;
	}
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")]))) return f.dot;
	rt.callName(f, (M = rt.sv(f, "loc")), "update_inv_gloves", []);
	return f.dot;
}, false, { args: ["damaging"] });

rt.type(7931, "/obj/item/clothing/head", "/obj/item/clothing", {
	blockTracking: 0,
	can_toggle: null,
	name: "head",
	icon: rt.rsc("icons/obj/clothing/hats.dmi"),
	icon_state: "top_hat",
	item_state: "that",
	body_parts_covered: 1,
	slot_flags: 64,
});

// /obj/item/clothing/head/proc/Initialize  (code/modules/clothing/clothing.dm:282)  may sleep
rt.def("/obj/item/clothing/head/proc/Initialize", function* Initialize(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living/carbon/human")) ? 1 : 0)) && truthy(rt.sv(f, "dynamic_hair_suffix")))) return f.dot;
	yield* g.callName(f, (H = rt.sv(f, "loc")), "update_hair", []);
	return f.dot;
}, true);

// /obj/item/clothing/head/proc/worn_overlays  (code/modules/clothing/clothing.dm:288)
rt.def("/obj/item/clothing/head/proc/worn_overlays", function worn_overlays(f: Frame, isinhands: Value) {
	f.vars = () => [isinhands];
	if (live(isinhands) === null) {
		isinhands = 0;
	}
	f.dot = rt.list();
	if (truthy(live(isinhands))) return f.dot;
	if (truthy(rt.sv(f, "damaged_clothes"))) {
		f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/item_damage.dmi"), "damagedhelmet"]), add);
	}
	if (!truthy(rt.sv(f, "blood_DNA"))) return f.dot;
	f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/blood.dmi"), "helmetblood"]), add);
	return f.dot;
});

// /obj/item/clothing/head/proc/update_clothes_damaged_state  (code/modules/clothing/clothing.dm:296)  may sleep
rt.def("/obj/item/clothing/head/proc/update_clothes_damaged_state", function* update_clothes_damaged_state(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (live(f.args[0]) === null) {
		f.args[0] = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) return f.dot;
	yield* g.callName(f, (M = rt.sv(f, "loc")), "update_inv_head", []);
	return f.dot;
}, true, { args: ["damaging"] });

// /obj/item/clothing/head/proc/equipped  (code/modules/clothing/clothing.dm:302)  may sleep
rt.def("/obj/item/clothing/head/proc/equipped", function* equipped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "dynamic_hair_suffix"))) return f.dot;
	yield* g.callName(f, live(f.args[0]), "update_hair", []);
	return f.dot;
}, true, { args: ["user", "slot"] });

// /obj/item/clothing/head/proc/dropped  (code/modules/clothing/clothing.dm:307)  may sleep
rt.def("/obj/item/clothing/head/proc/dropped", function* dropped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "dynamic_hair_suffix"))) return f.dot;
	yield* g.callName(f, live(f.args[0]), "update_hair", []);
	return f.dot;
}, true, { args: ["user"] });

rt.type(8594, "/obj/item/clothing/neck", "/obj/item/clothing", {
	name: "necklace",
	icon: rt.rsc("icons/obj/clothing/neck.dmi"),
	body_parts_covered: 2048,
	slot_flags: 8192,
	strip_delay: 40,
	equip_delay_other: 40,
});

// /obj/item/clothing/neck/proc/worn_overlays  (code/modules/clothing/clothing.dm:322)
rt.def("/obj/item/clothing/neck/proc/worn_overlays", function worn_overlays(f: Frame, isinhands: Value) {
	f.vars = () => [isinhands];
	if (live(isinhands) === null) {
		isinhands = 0;
	}
	f.dot = rt.list();
	if (truthy(live(isinhands))) return f.dot;
	if (!truthy(rt.bitAnd(rt.sv(f, "body_parts_covered"), 1))) return f.dot;
	if (truthy(rt.sv(f, "damaged_clothes"))) {
		f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/item_damage.dmi"), "damagedmask"]), add);
	}
	if (!truthy(rt.sv(f, "blood_DNA"))) return f.dot;
	f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/blood.dmi"), "maskblood"]), add);
	return f.dot;
});

rt.type(8515, "/obj/item/clothing/mask", "/obj/item/clothing", {
	mask_adjusted: 0,
	adjusted_flags: null,
	name: "mask",
	icon: rt.rsc("icons/obj/clothing/masks.dmi"),
	body_parts_covered: 1,
	slot_flags: 32,
	strip_delay: 40,
	equip_delay_other: 40,
});

// /obj/item/clothing/mask/proc/worn_overlays  (code/modules/clothing/clothing.dm:344)
rt.def("/obj/item/clothing/mask/proc/worn_overlays", function worn_overlays(f: Frame, isinhands: Value) {
	f.vars = () => [isinhands];
	if (live(isinhands) === null) {
		isinhands = 0;
	}
	f.dot = rt.list();
	if (truthy(live(isinhands))) return f.dot;
	if (!truthy(rt.bitAnd(rt.sv(f, "body_parts_covered"), 1))) return f.dot;
	if (truthy(rt.sv(f, "damaged_clothes"))) {
		f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/item_damage.dmi"), "damagedmask"]), add);
	}
	if (!truthy(rt.sv(f, "blood_DNA"))) return f.dot;
	f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/blood.dmi"), "maskblood"]), add);
	return f.dot;
});

// /obj/item/clothing/mask/proc/update_clothes_damaged_state  (code/modules/clothing/clothing.dm:353)  may sleep
rt.def("/obj/item/clothing/mask/proc/update_clothes_damaged_state", function* update_clothes_damaged_state(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (live(f.args[0]) === null) {
		f.args[0] = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) return f.dot;
	yield* g.callName(f, (M = rt.sv(f, "loc")), "update_inv_wear_mask", []);
	return f.dot;
}, true, { args: ["damaging"] });

// /obj/item/clothing/mask/proc/adjustmask  (code/modules/clothing/clothing.dm:365)  may sleep
rt.def("/obj/item/clothing/mask/proc/adjustmask", function* adjustmask(f: Frame, user: Value) {
	f.vars = () => [user];
	if ((truthy(live(user)) && truthy((yield* g.callName(f, live(user), "incapacitated", []))))) {
		return live(f.dot);
	}
	rt.setSv(f, "mask_adjusted", (!truthy(rt.sv(f, "mask_adjusted")) ? 1 : 0));
	if (!truthy(rt.sv(f, "mask_adjusted"))) {
		rt.setFv(f, "icon_state", live(f.src), rt.initial(f, live(f.src), "icon_state"));
		rt.setSv(f, "gas_transfer_coefficient", rt.initial(f, live(f.src), "gas_transfer_coefficient"));
		rt.setSv(f, "permeability_coefficient", rt.initial(f, live(f.src), "permeability_coefficient"));
		(rt.modSrcVar(f, "flags", rt.sv(f, "visor_flags"), rt.bitOr));
		(rt.modSrcVar(f, "flags_inv", rt.sv(f, "visor_flags_inv"), rt.bitOr));
		(rt.modSrcVar(f, "flags_cover", rt.sv(f, "visor_flags_cover"), rt.bitOr));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You push ％！ back into place.</span>", [live(f.src)])]);
		rt.setSv(f, "slot_flags", rt.initial(f, live(f.src), "slot_flags"));
	} else {
		rt.modSrcVar(f, "icon_state", "_up", add);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You push ％！ out of the way.</span>", [live(f.src)])]);
		rt.setSv(f, "gas_transfer_coefficient", null);
		rt.setSv(f, "permeability_coefficient", null);
		(rt.modSrcVar(f, "flags", rt.op(f, "BitNot", [], [rt.sv(f, "visor_flags")]), rt.bitAnd));
		(rt.modSrcVar(f, "flags_inv", rt.op(f, "BitNot", [], [rt.sv(f, "visor_flags_inv")]), rt.bitAnd));
		(rt.modSrcVar(f, "flags_cover", rt.op(f, "BitNot", [], [rt.sv(f, "visor_flags_cover")]), rt.bitAnd));
		if (truthy(rt.sv(f, "adjusted_flags"))) {
			rt.setSv(f, "slot_flags", rt.sv(f, "adjusted_flags"));
		}
	}
	if (!truthy(live(user))) return f.dot;
	yield* g.callName(f, live(user), "wear_mask_update", [null, live(f.src), "toggle_off", rt.sv(f, "mask_adjusted")], rt.Args.Named);
	yield* g.callName(f, live(user), "update_action_buttons_icon", []);
	return f.dot;
}, true);

rt.type(8456, "/obj/item/clothing/shoes", "/obj/item/clothing", {
	chained: 0,
	blood_state: "no blood whatsoever",
	bloody_shoes: null,
	offset: 0,
	equipped_before_drop: 0,
	name: "shoes",
	icon: rt.rsc("icons/obj/clothing/shoes.dmi"),
	desc: "Comfortable-looking shoes.",
	gender: "plural",
	body_parts_covered: 96,
	slot_flags: 128,
	permeability_coefficient: 0.5,
	slowdown: 0,
});

// /obj/item/clothing/shoes/proc/step_action  empty
rt.def("/obj/item/clothing/shoes/proc/step_action");

// /obj/item/clothing/shoes/proc/<init>  (code/modules/clothing/clothing.dm:408)
rt.def("/obj/item/clothing/shoes/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bloody_shoes", rt.alist(f, ["blood", 0, "xeno", 0, "oil", 0, "no blood whatsoever", 0]));
	return f.dot;
});

// /obj/item/clothing/shoes/proc/worn_overlays  (code/modules/clothing/clothing.dm:413)
rt.def("/obj/item/clothing/shoes/proc/worn_overlays", function worn_overlays(f: Frame, isinhands: Value) {
	let bloody: Value = null;
	f.vars = () => [isinhands, bloody];
	if (live(isinhands) === null) {
		isinhands = 0;
	}
	f.dot = rt.list();
	if (truthy(live(isinhands))) return f.dot;
	bloody = 0;
	if (truthy(rt.sv(f, "blood_DNA"))) {
		bloody = 1;
	} else {
		bloody = rt.at(rt.sv(f, "bloody_shoes"), "blood");
	}
	if (truthy(rt.sv(f, "damaged_clothes"))) {
		f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/item_damage.dmi"), "damagedshoe"]), add);
	}
	if (!truthy(live(bloody))) return f.dot;
	f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/blood.dmi"), "shoeblood"]), add);
	return f.dot;
});

// /obj/item/clothing/shoes/proc/equipped  (code/modules/clothing/clothing.dm:427)  may sleep
rt.def("/obj/item/clothing/shoes/proc/equipped", function* equipped(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(rt.sv(f, "offset")) && truthy(rt.bitAnd(rt.sv(f, "slot_flags"), (yield* g.call(f, P("/proc/slotdefine2slotbit"), null, [live(f.args[1])])))))) return f.dot;
	rt.modField(f, live(f.args[0]), "pixel_y", rt.sv(f, "offset"), add);
	(rt.modSrcVar(f, "worn_y_dimension", multiply(rt.sv(f, "offset"), 2), subtract));
	yield* g.callName(f, live(f.args[0]), "update_inv_shoes", []);
	rt.setSv(f, "equipped_before_drop", 1);
	return f.dot;
}, true, { args: ["user", "slot"] });

// /obj/item/clothing/shoes/proc/restore_offsets  (code/modules/clothing/clothing.dm:436)
rt.def("/obj/item/clothing/shoes/proc/restore_offsets", function restore_offsets(f: Frame, user: Value) {
	rt.setSv(f, "equipped_before_drop", 0);
	(rt.modField(f, live(user), "pixel_y", rt.sv(f, "offset"), subtract));
	rt.setSv(f, "worn_y_dimension", rt.fv(f, "icon_size", rt.world()));
	return f.dot;
});

// /obj/item/clothing/shoes/proc/dropped  (code/modules/clothing/clothing.dm:440)  may sleep
rt.def("/obj/item/clothing/shoes/proc/dropped", function* dropped(f: Frame) {
	if ((truthy(rt.sv(f, "offset")) && truthy(rt.sv(f, "equipped_before_drop")))) {
		yield* g.srcCall(f, "restore_offsets", live(f.args[0]));
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/clothing/shoes/proc/update_clothes_damaged_state  (code/modules/clothing/clothing.dm:445)
rt.def("/obj/item/clothing/shoes/proc/update_clothes_damaged_state", function update_clothes_damaged_state(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (live(f.args[0]) === null) {
		f.args[0] = 1;
	}
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")]))) return f.dot;
	rt.callName(f, (M = rt.sv(f, "loc")), "update_inv_shoes", []);
	return f.dot;
}, false, { args: ["damaging"] });

// /obj/item/clothing/shoes/proc/clean_blood  (code/modules/clothing/clothing.dm:451)
rt.def("/obj/item/clothing/shoes/proc/clean_blood", function clean_blood(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "bloody_shoes", rt.alist(f, ["blood", 0, "xeno", 0, "oil", 0, "no blood whatsoever", 0]));
	rt.setSv(f, "blood_state", "no blood whatsoever");
	if (!truthy(rt.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")]))) return f.dot;
	rt.callName(f, (M = rt.sv(f, "loc")), "update_inv_shoes", []);
	return f.dot;
});

rt.type(7699, "/obj/item/clothing/suit", "/obj/item/clothing", {
	fire_resist: 373.15,
	blood_overlay_type: "suit",
	togglename: null,
	icon: rt.rsc("icons/obj/clothing/suits.dmi"),
	name: "suit",
	allowed: null,
	armor: null,
	slot_flags: 1,
});

// /obj/item/clothing/suit/proc/<init>  (code/modules/clothing/clothing.dm:466)
rt.def("/obj/item/clothing/suit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/tank/internals/emergency_oxygen")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 0, "acid", 0]));
	return f.dot;
});

// /obj/item/clothing/suit/proc/worn_overlays  (code/modules/clothing/clothing.dm:474)
rt.def("/obj/item/clothing/suit/proc/worn_overlays", function worn_overlays(f: Frame, isinhands: Value) {
	let M: Value = null, U: Value = null, A: Value = null;
	f.vars = () => [isinhands, M, U, A];
	if (live(isinhands) === null) {
		isinhands = 0;
	}
	f.dot = rt.list();
	if (truthy(live(isinhands))) return f.dot;
	if (truthy(rt.sv(f, "damaged_clothes"))) {
		f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/item_damage.dmi"), fmt("damaged＀", [rt.sv(f, "blood_overlay_type")])]), add);
	}
	if (truthy(rt.sv(f, "blood_DNA"))) {
		f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/blood.dmi"), fmt("＀blood", [rt.sv(f, "blood_overlay_type")])]), add);
	}
	if (!(truthy((rt.istype((M = rt.sv(f, "loc")), T("/mob/living/carbon/human")) ? 1 : 0)) && truthy(rt.fv(f, "w_uniform", live(M))))) return f.dot;
	if (!(truthy((rt.istype((U = rt.fv(f, "w_uniform", live(M))), T("/obj/item/clothing/under")) ? 1 : 0)) && truthy(rt.fv(f, "attached_accessory", live(U))))) return f.dot;
	if (!truthy(rt.gv(f, "above_suit", (A = rt.fv(f, "attached_accessory", live(U)))))) return f.dot;
	f.dot = rt.modify(live(f.dot), rt.fv(f, "accessory_overlay", live(U)), add);
	return f.dot;
});

// /obj/item/clothing/suit/proc/update_clothes_damaged_state  (code/modules/clothing/clothing.dm:489)  may sleep
rt.def("/obj/item/clothing/suit/proc/update_clothes_damaged_state", function* update_clothes_damaged_state(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (live(f.args[0]) === null) {
		f.args[0] = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) return f.dot;
	yield* g.callName(f, (M = rt.sv(f, "loc")), "update_inv_wear_suit", []);
	return f.dot;
}, true, { args: ["damaging"] });

rt.type(7933, "/obj/item/clothing/head/helmet/space", "/obj/item/clothing/head/helmet", {
	flags: 8193,
	name: "space helmet",
	icon_state: "spaceold",
	desc: "A special helmet with solar UV shielding to protect your eyes from harmful rays.",
	item_state: "spaceold",
	permeability_coefficient: 0.01,
	armor: null,
	flags_inv: 1008,
	cold_protection: 1,
	min_cold_protection_temperature: 2,
	heat_protection: 1,
	max_heat_protection_temperature: 1500,
	flash_protect: 2,
	strip_delay: 50,
	equip_delay_other: 50,
	flags_cover: 20,
	resistance_flags: 0,
});

// /obj/item/clothing/head/helmet/space/proc/<init>  (code/modules/clothing/clothing.dm:504)
rt.def("/obj/item/clothing/head/helmet/space/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 100, "rad", 50, "fire", 80, "acid", 70]));
	return f.dot;
});

rt.type(7700, "/obj/item/clothing/suit/space", "/obj/item/clothing/suit", {
	flags: 8193,
	name: "space suit",
	desc: "A suit that protects against low pressure environments. Has a big 13 on the back.",
	icon_state: "spaceold",
	item_state: "s_suit",
	w_class: 4,
	gas_transfer_coefficient: 0.01,
	permeability_coefficient: 0.02,
	body_parts_covered: 2046,
	allowed: null,
	slowdown: 1,
	armor: null,
	flags_inv: 13,
	cold_protection: 2046,
	min_cold_protection_temperature: 2,
	heat_protection: 2046,
	max_heat_protection_temperature: 1500,
	strip_delay: 80,
	equip_delay_other: 80,
	resistance_flags: 0,
});

// /obj/item/clothing/suit/space/proc/<init>  (code/modules/clothing/clothing.dm:526)
rt.def("/obj/item/clothing/suit/space/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 100, "rad", 50, "fire", 80, "acid", 70]));
	return f.dot;
});

rt.type(8259, "/obj/item/clothing/under", "/obj/item/clothing", {
	fitted: 1,
	has_sensor: 1,
	random_sensor: 1,
	sensor_mode: 0,
	can_adjust: 1,
	adjusted: 0,
	alt_covers_chest: 0,
	attached_accessory: null,
	accessory_overlay: null,
	mutantrace_variation: 0,
	icon: rt.rsc("icons/obj/clothing/uniforms.dmi"),
	name: "under",
	body_parts_covered: 414,
	permeability_coefficient: 0.9,
	slot_flags: 2,
	armor: null,
});

// /obj/item/clothing/under/proc/<init>  (code/modules/clothing/clothing.dm:546)
rt.def("/obj/item/clothing/under/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 0, "acid", 0]));
	return f.dot;
});

// /obj/item/clothing/under/proc/worn_overlays  (code/modules/clothing/clothing.dm:559)
rt.def("/obj/item/clothing/under/proc/worn_overlays", function worn_overlays(f: Frame, isinhands: Value) {
	f.vars = () => [isinhands];
	if (live(isinhands) === null) {
		isinhands = 0;
	}
	f.dot = rt.list();
	if (truthy(live(isinhands))) return f.dot;
	if (truthy(rt.sv(f, "damaged_clothes"))) {
		f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/item_damage.dmi"), "damageduniform"]), add);
	}
	if (truthy(rt.sv(f, "blood_DNA"))) {
		f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/blood.dmi"), "uniformblood"]), add);
	}
	if (!truthy(rt.sv(f, "accessory_overlay"))) return f.dot;
	f.dot = rt.modify(live(f.dot), rt.sv(f, "accessory_overlay"), add);
	return f.dot;
});

// /obj/item/clothing/under/proc/attackby  (code/modules/clothing/clothing.dm:570)  may sleep
rt.def("/obj/item/clothing/under/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let C: Value = null;
	f.vars = () => [W, user, params, C];
	if (!(isEqual(rt.sv(f, "has_sensor"), -1) && truthy((rt.istype(live(W), T("/obj/item/stack/cable_coil")) ? 1 : 0)))) return f.dot;
	yield* g.callName(f, (C = live(W)), "use", [1]);
	rt.setSv(f, "has_sensor", 1);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You repair the suit sensors on ＀ with ＀.</span>", [live(f.src), live(C)])]);
	return 1;
}, true);

// /obj/item/clothing/under/proc/update_clothes_damaged_state  (code/modules/clothing/clothing.dm:578)  may sleep
rt.def("/obj/item/clothing/under/proc/update_clothes_damaged_state", function* update_clothes_damaged_state(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (live(f.args[0]) === null) {
		f.args[0] = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) {
		yield* g.callName(f, (M = rt.sv(f, "loc")), "update_inv_w_uniform", []);
	}
	if (!rt.gt(rt.sv(f, "has_sensor"), 0)) return f.dot;
	rt.setSv(f, "has_sensor", -1);
	return f.dot;
}, true, { args: ["damaging"] });

// /obj/item/clothing/under/proc/New  (code/modules/clothing/clothing.dm:588)  may sleep
rt.def("/obj/item/clothing/under/proc/New", function* New(f: Frame) {
	if (truthy(rt.sv(f, "random_sensor"))) {
		rt.setSv(f, "sensor_mode", rt.op(f, "PickUnweighted", [8], [0, 1, 1, 2, 2, 2, 3, 3]));
	}
	rt.setSv(f, "adjusted", 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/clothing/under/proc/equipped  (code/modules/clothing/clothing.dm:593)  may sleep
rt.def("/obj/item/clothing/under/proc/equipped", function* equipped(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "adjusted"))) {
		rt.setSv(f, "adjusted", 0);
		rt.setSv(f, "fitted", rt.initial(f, live(f.src), "fitted"));
		if (!truthy(rt.sv(f, "alt_covers_chest"))) {
			(rt.modSrcVar(f, "body_parts_covered", 2, rt.bitOr));
		}
	}
	if ((truthy(rt.sv(f, "mutantrace_variation")) && truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0)))) {
		H = live(f.args[0]);
		if (truthy((rt.isIn(f, 25, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(H))))) ? 1 : 0))) {
			rt.setSv(f, "adjusted", 2);
		}
		yield* g.callName(f, live(H), "update_inv_w_uniform", []);
	}
	if (!((truthy(rt.sv(f, "attached_accessory")) && !isEqual(live(f.args[1]), 4)) && truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0)))) return f.dot;
	H = live(f.args[0]);
	yield* g.callName(f, rt.sv(f, "attached_accessory"), "on_uniform_equip", [live(f.src), live(f.args[0])]);
	if (!truthy(rt.fv(f, "above_suit", rt.sv(f, "attached_accessory")))) return f.dot;
	yield* g.callName(f, live(H), "update_inv_wear_suit", []);
	return f.dot;
}, true, { args: ["user", "slot"] });

// /obj/item/clothing/under/proc/dropped  (code/modules/clothing/clothing.dm:614)  may sleep
rt.def("/obj/item/clothing/under/proc/dropped", function* dropped(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (truthy(rt.sv(f, "attached_accessory"))) {
		yield* g.callName(f, rt.sv(f, "attached_accessory"), "on_uniform_dropped", [live(f.src), live(f.args[0])]);
		if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
			H = live(f.args[0]);
			if (truthy(rt.fv(f, "above_suit", rt.sv(f, "attached_accessory")))) {
				yield* g.callName(f, live(H), "update_inv_wear_suit", []);
			}
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/clothing/under/proc/attackby  (code/modules/clothing/clothing.dm:623)  may sleep
rt.def("/obj/item/clothing/under/proc/attackby", function* attackby(f: Frame) {
	if (truthy((yield* g.srcCall(f, "attach_accessory", live(f.args[0]), live(f.args[1]))))) return f.dot;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/item/clothing/under/proc/attach_accessory  (code/modules/clothing/clothing.dm:628)  may sleep
rt.def("/obj/item/clothing/under/proc/attach_accessory", function* attach_accessory(f: Frame, I: Value, user: Value, notifyAttach: Value) {
	let A: Value = null, accessory_color: Value = null, H: Value = null;
	f.vars = () => [I, user, notifyAttach, A, accessory_color, H];
	if (live(notifyAttach) === null) {
		notifyAttach = 1;
	}
	f.dot = 0;
	if (!truthy((rt.istype(live(I), T("/obj/item/clothing/accessory")) ? 1 : 0))) return f.dot;
	A = live(I);
	if (truthy(rt.sv(f, "attached_accessory"))) {
		if (truthy(live(user))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ already has an accessory.</span>", [live(f.src)])]);
		}
		return live(f.dot);
	} else {
		if ((truthy(live(user)) && !truthy((yield* g.callName(f, live(user), "drop_item", []))))) {
			return live(f.dot);
		}
		if (!truthy((yield* g.callName(f, live(A), "attach", [live(f.src), live(user)])))) {
			return live(f.dot);
		}
		if ((truthy(live(user)) && truthy(live(notifyAttach)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You attach ＀ to ＀.</span>", [live(I), live(f.src)])]);
		}
		if (!truthy((accessory_color = rt.fv(f, "item_color", rt.sv(f, "attached_accessory"))))) {
			accessory_color = rt.fv(f, "icon_state", rt.sv(f, "attached_accessory"));
		}
		rt.setSv(f, "accessory_overlay", (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/mob/accessories.dmi"), fmt("＀", [live(accessory_color)])])));
		rt.setFv(f, "alpha", rt.sv(f, "accessory_overlay"), rt.fv(f, "alpha", rt.sv(f, "attached_accessory")));
		rt.setFv(f, "color", rt.sv(f, "accessory_overlay"), rt.fv(f, "color", rt.sv(f, "attached_accessory")));
		if (truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living/carbon/human")) ? 1 : 0))) {
			yield* g.callName(f, (H = rt.sv(f, "loc")), "update_inv_w_uniform", []);
			yield* g.callName(f, live(H), "update_inv_wear_suit", []);
		}
		return 1;
	}
	return f.dot;
}, true);

// /obj/item/clothing/under/proc/remove_accessory  (code/modules/clothing/clothing.dm:658)  may sleep
rt.def("/obj/item/clothing/under/proc/remove_accessory", function* remove_accessory(f: Frame, user: Value) {
	let A: Value = null, H: Value = null;
	f.vars = () => [user, A, H];
	if (!truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "can_use", live(user))))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "attached_accessory"))) return f.dot;
	A = rt.sv(f, "attached_accessory");
	yield* g.callName(f, rt.sv(f, "attached_accessory"), "detach", [live(f.src), live(user)]);
	if (truthy((yield* g.callName(f, live(user), "put_in_hands", [live(A)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You detach ＀ from ＀.</span>", [live(A), live(f.src)])]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You detach ＀ from ＀ and it falls on the floor.</span>", [live(A), live(f.src)])]);
	}
	if (!truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (H = rt.sv(f, "loc")), "update_inv_w_uniform", []);
	yield* g.callName(f, live(H), "update_inv_wear_suit", []);
	return f.dot;
}, true);

// /obj/item/clothing/under/proc/examine  (code/modules/clothing/clothing.dm:678)
rt.def("/obj/item/clothing/under/proc/examine", function examine(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "can_adjust"))) {
		if (isEqual(rt.sv(f, "adjusted"), 1)) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("Alt-click on ＀ to wear it normally.", [live(f.src)])]);
		} else {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("Alt-click on ＀ to wear it casually.", [live(f.src)])]);
		}
	}
	if (isEqual(rt.sv(f, "has_sensor"), -1)) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "Its sensors appear to be shorted out."]);
	} else {
		if (rt.gt(rt.sv(f, "has_sensor"), 0)) {
			$0 = rt.sv(f, "sensor_mode");
			if ($0 === 0) {
				rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "Its sensors appear to be disabled."]);
			} else if ($0 === 1) {
				rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "Its binary life sensors appear to be enabled."]);
			} else if ($0 === 2) {
				rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "Its vital tracker appears to be enabled."]);
			} else if ($0 === 3) {
				rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "Its vital tracker and tracking beacon appear to be enabled."]);
			}
		}
	}
	if (!truthy(rt.sv(f, "attached_accessory"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("＆！ is attached to it.", [rt.sv(f, "attached_accessory")])]);
	return f.dot;
}, false, { args: ["user"] });

// /proc/generate_female_clothing  (code/modules/clothing/clothing.dm:700)
rt.def("/proc/generate_female_clothing", function generate_female_clothing(f: Frame, index: Value, t_color: Value, icon: Value, type: Value) {
	let female_clothing_icon: Value = null, female_s: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [female_clothing_icon, female_s, $0, $1, $2, $3];
	female_clothing_icon = rt.call(f, P("/proc/icon"), null, ["icon", live(icon), "icon_state", live(t_color)], rt.Args.Named);
	$0 = "icon";
	$1 = rt.rsc("icons/mob/uniform.dmi");
	$2 = "icon_state";
	if (isEqual(live(type), 1)) {
		$3 = "female_full";
	} else {
		$3 = "female_top";
	}
	female_s = rt.call(f, P("/proc/icon"), null, [$0, $1, $2, fmt("＀", [$3])], rt.Args.Named);
	rt.callName(f, live(female_clothing_icon), "Blend", [live(female_s), 2]);
	female_clothing_icon = rt.call(f, P("/proc/fcopy_rsc"), null, [live(female_clothing_icon)]);
	rt.setAt(rt.gl("female_clothing_icons"), live(index), live(female_clothing_icon));
	return f.dot;
});

// /obj/item/clothing/under/verb/toggle  (code/modules/clothing/clothing.dm:710)  may sleep
rt.def("/obj/item/clothing/under/verb/toggle", function* toggle(f: Frame) {
	let M: Value = null, modes: Value = null, switchMode: Value = null, H: Value = null;
	let $0: any;
	f.vars = () => [M, modes, switchMode, H, $0];
	if (truthy((rt.istype((M = live(f.usr)), T("/mob/dead")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "can_use", live(M))))) {
		return live(f.dot);
	}
	if (isEqual(rt.fv(f, "has_sensor", live(f.src)), 2)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "The controls are locked."]);
		return 0;
	}
	if (isEqual(rt.fv(f, "has_sensor", live(f.src)), -1)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "The sensors have shorted out!"]);
		return 0;
	}
	if (rt.le(rt.fv(f, "has_sensor", live(f.src)), 0)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This suit does not have any sensors."]);
		return 0;
	}
	modes = rt.list("Off", "Binary vitals", "Exact vitals", "Tracking beacon");
	switchMode = (yield* g.op(f, "Prompt", [0], [null, rt.index(live(modes), add(rt.sv(f, "sensor_mode"), 1)), "Suit Sensor Mode", "Select a sensor mode:", live(modes)]));
	if (rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(f.usr), live(f.src)])), 1)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>You have moved too far away!</span>"]);
		return live(f.dot);
	}
	rt.setSv(f, "sensor_mode", subtract((yield* g.callName(f, live(modes), "Find", [live(switchMode)])), 1));
	if (isEqual(rt.fv(f, "loc", live(f.src)), live(f.usr))) {
		$0 = rt.sv(f, "sensor_mode");
		if ($0 === 0) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>You disable your suit's remote sensing equipment.</span>"]);
		} else if ($0 === 1) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Your suit will now only report whether you are alive or dead.</span>"]);
		} else if ($0 === 2) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Your suit will now only report your exact vital lifesigns.</span>"]);
		} else if ($0 === 3) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Your suit will now report your exact vital lifesigns as well as your coordinate position.</span>"]);
		}
	}
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (isEqual(rt.gv(f, "w_uniform", (H = rt.sv(f, "loc"))), live(f.src))) {
			yield* g.callName(f, live(H), "update_suit_sensors", []);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { verb: { name: "Adjust Suit Sensors", category: "Object", src: 11 } });

// /obj/item/clothing/under/proc/AltClick  (code/modules/clothing/clothing.dm:751)  may sleep
rt.def("/obj/item/clothing/under/proc/AltClick", function* AltClick(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 1;
	}
	if (!truthy((yield* g.callName(f, live(f.args[0]), "canUseTopic", [null, live(f.src), "be_close", 1], rt.Args.Named)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You can't do that right now!</span>"]);
		return live(f.dot);
	} else {
		if (truthy(rt.sv(f, "attached_accessory"))) {
			yield* g.srcCall(f, "remove_accessory", live(f.args[0]));
		} else {
			yield* g.srcCall(f, "rolldown");
		}
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/clothing/under/verb/jumpsuit_adjust  (code/modules/clothing/clothing.dm:767)  may sleep
rt.def("/obj/item/clothing/under/verb/jumpsuit_adjust", function* jumpsuit_adjust(f: Frame) {
	yield* g.srcCall(f, "rolldown");
	return f.dot;
}, true, { verb: { name: "Adjust Jumpsuit Style", category: "", src: 11 } });

// /obj/item/clothing/under/proc/rolldown  (code/modules/clothing/clothing.dm:770)  may sleep
rt.def("/obj/item/clothing/under/proc/rolldown", function* rolldown(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (!truthy((yield* g.srcCall(f, "can_use", live(f.usr))))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "can_adjust"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>You cannot wear this suit any differently!</span>"]);
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "toggle_jumpsuit_adjust")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>You adjust the suit to wear it more casually.</span>"]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>You adjust the suit back to normal.</span>"]);
	}
	if (!truthy((rt.istype(live(f.usr), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (H = live(f.usr)), "update_inv_w_uniform", []);
	yield* g.callName(f, live(H), "update_body", []);
	return f.dot;
}, true);

// /obj/item/clothing/under/proc/toggle_jumpsuit_adjust  (code/modules/clothing/clothing.dm:785)
rt.def("/obj/item/clothing/under/proc/toggle_jumpsuit_adjust", function toggle_jumpsuit_adjust(f: Frame) {
	if (isEqual(rt.sv(f, "adjusted"), 2)) {
		return live(f.dot);
	}
	rt.setSv(f, "adjusted", (!truthy(rt.sv(f, "adjusted")) ? 1 : 0));
	if (truthy(rt.sv(f, "adjusted"))) {
		if (!isEqual(rt.sv(f, "fitted"), 2)) {
			rt.setSv(f, "fitted", 0);
		}
		if (!truthy(rt.sv(f, "alt_covers_chest"))) {
			(rt.modSrcVar(f, "body_parts_covered", 16777213, rt.bitAnd));
		}
	} else {
		rt.setSv(f, "fitted", rt.initial(f, live(f.src), "fitted"));
		if (!truthy(rt.sv(f, "alt_covers_chest"))) {
			(rt.modSrcVar(f, "body_parts_covered", 2, rt.bitOr));
		}
	}
	return rt.sv(f, "adjusted");
});

// /obj/item/clothing/proc/weldingvisortoggle  (code/modules/clothing/clothing.dm:800)  may sleep
rt.def("/obj/item/clothing/proc/weldingvisortoggle", function* weldingvisortoggle(f: Frame, user: Value) {
	let C: Value = null, X: Value = null, A: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [user, C, X, A, $0, $1, $2, $e];
	if (!truthy((yield* g.srcCall(f, "can_use", live(user))))) {
		return 0;
	}
	yield* g.srcCall(f, "visor_toggling");
	$0 = live(user);
	$1 = live(f.src);
	if (truthy(rt.sv(f, "up"))) {
		$1 = $1;
		$2 = "up";
	} else {
		$2 = "down";
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You adjust ％！ ＀.</span>", [$1, $2])]);
	if (truthy((rt.istype(live(user), T("/mob/living/carbon")) ? 1 : 0))) {
		yield* g.callName(f, (C = live(user)), "head_update", [null, live(f.src), "forced", 1], rt.Args.Named);
	}
	X = null;
	rt.forList(f, 0, rt.sv(f, "actions"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.callName(f, (A = live(X)), "UpdateButtonIcon", []);
	}
	rt.endFor(f, 0);
	return 1;
}, true);

// /obj/item/clothing/proc/visor_toggling  (code/modules/clothing/clothing.dm:816)
rt.def("/obj/item/clothing/proc/visor_toggling", function visor_toggling(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.setSv(f, "up", (!truthy(rt.sv(f, "up")) ? 1 : 0));
	(rt.modSrcVar(f, "flags", rt.sv(f, "visor_flags"), rt.bitXor));
	(rt.modSrcVar(f, "flags_inv", rt.sv(f, "visor_flags_inv"), rt.bitXor));
	(rt.modSrcVar(f, "flags_cover", rt.initial(f, live(f.src), "flags_cover"), rt.bitXor));
	$0 = rt.initial(f, live(f.src), "icon_state");
	if (truthy(rt.sv(f, "up"))) {
		$1 = "up";
	} else {
		$1 = "";
	}
	rt.setSv(f, "icon_state", fmt("＀＀", [$0, $1]));
	if (truthy(rt.bitAnd(rt.sv(f, "visor_vars_to_toggle"), 1))) {
		(rt.modSrcVar(f, "flash_protect", rt.initial(f, live(f.src), "flash_protect"), rt.bitXor));
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "visor_vars_to_toggle"), 2))) return f.dot;
	(rt.modSrcVar(f, "tint", rt.initial(f, live(f.src), "tint"), rt.bitXor));
	return f.dot;
});

// /obj/item/clothing/proc/can_use  (code/modules/clothing/clothing.dm:828)
rt.def("/obj/item/clothing/proc/can_use", function can_use(f: Frame, user: Value) {
	if ((truthy(live(user)) && truthy(rt.call(f, P("/proc/ismob"), null, [live(user)])))) {
		if (!truthy(rt.callName(f, live(user), "incapacitated", []))) {
			return 1;
		}
	}
	return 0;
});

// /obj/item/clothing/proc/obj_destruction  (code/modules/clothing/clothing.dm:835)  may sleep
rt.def("/obj/item/clothing/proc/obj_destruction", function* obj_destruction(f: Frame) {
	let _T: Value = null, Shreds: Value = null;
	f.vars = () => [_T, Shreds];
	if ((isEqual(live(f.args[0]), "bomb") || isEqual(live(f.args[0]), "melee"))) {
		_T = rt.getStep(f, live(f.src), 0);
		rt.spawnTail(f, 1, "/obj/item/clothing/proc/obj_destruction: spawn at modules/clothing/clothing.dm:837", _T, Shreds);
		yield* g.srcCall(f, "deconstruct", 0);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["damage_flag"] });

// a spawn(1) body of /obj/item/clothing/proc/obj_destruction, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/clothing/proc/obj_destruction: spawn at modules/clothing/clothing.dm:837", function* (f: Frame, _T: Value, Shreds: Value) {
	f.vars = () => [_T, Shreds];
	rt.setFv(f, "desc", (Shreds = (yield* g.new_(f, T("/obj/effect/decal/cleanable/shreds"), [live(_T)]))), fmt("The sad remains of what used to be ＀.", [rt.sv(f, "name")]));
	return null;
});
