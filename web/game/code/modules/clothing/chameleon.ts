// From code/modules/clothing/chameleon.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(236, "/datum/action/item_action/chameleon/drone/randomise", "/datum/action/item_action/chameleon/drone", {
	name: "Randomise Headgear",
	button_icon_state: "random",
});

// /datum/action/item_action/chameleon/drone/randomise/proc/Trigger  (code/modules/clothing/chameleon.dm:8)  may sleep
rt.def("/datum/action/item_action/chameleon/drone/randomise/proc/Trigger", function* Trigger(f: Frame) {
	let X: Value = null, Z: Value = null;
	f.vars = () => [X, Z];
	if (!truthy((yield* g.srcCall(f, "IsAvailable")))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(rt.sv(f, "target"), T("/obj/item/clothing/head/chameleon/drone")) ? 1 : 0))) {
		yield* g.callName(f, rt.gv(f, "chameleon_action", (X = rt.sv(f, "target"))), "random_look", [rt.sv(f, "owner")]);
	}
	if (truthy((rt.istype(rt.sv(f, "target"), T("/obj/item/clothing/mask/chameleon/drone")) ? 1 : 0))) {
		yield* g.callName(f, rt.gv(f, "chameleon_action", (Z = rt.sv(f, "target"))), "random_look", [rt.sv(f, "owner")]);
	}
	return 1;
}, true);

rt.type(237, "/datum/action/item_action/chameleon/drone/togglehatmask", "/datum/action/item_action/chameleon/drone", {
	name: "Toggle Headgear Mode",
});

// /datum/action/item_action/chameleon/drone/togglehatmask/proc/New  (code/modules/clothing/chameleon.dm:26)  may sleep
rt.def("/datum/action/item_action/chameleon/drone/togglehatmask/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.istype(rt.sv(f, "target"), T("/obj/item/clothing/head/chameleon/drone")) ? 1 : 0))) {
		rt.setSv(f, "button_icon_state", "drone_camogear_helm");
	}
	if (!truthy((rt.istype(rt.sv(f, "target"), T("/obj/item/clothing/mask/chameleon/drone")) ? 1 : 0))) return f.dot;
	rt.setSv(f, "button_icon_state", "drone_camogear_mask");
	return f.dot;
}, true);

// /datum/action/item_action/chameleon/drone/togglehatmask/proc/Trigger  (code/modules/clothing/chameleon.dm:34)  may sleep
rt.def("/datum/action/item_action/chameleon/drone/togglehatmask/proc/Trigger", function* Trigger(f: Frame) {
	let D: Value = null, old_headgear: Value = null, new_headgear: Value = null;
	f.vars = () => [D, old_headgear, new_headgear];
	if (!truthy((yield* g.srcCall(f, "IsAvailable")))) {
		return live(f.dot);
	}
	D = null;
	if (truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living/simple_animal/drone")) ? 1 : 0))) {
		D = rt.sv(f, "owner");
	} else {
		return live(f.dot);
	}
	old_headgear = rt.sv(f, "target");
	new_headgear = null;
	if (truthy((rt.istype(live(old_headgear), T("/obj/item/clothing/head/chameleon/drone")) ? 1 : 0))) {
		new_headgear = (yield* g.new_(f, T("/obj/item/clothing/mask/chameleon/drone"), []));
	} else {
		if (truthy((rt.istype(live(old_headgear), T("/obj/item/clothing/mask/chameleon/drone")) ? 1 : 0))) {
			new_headgear = (yield* g.new_(f, T("/obj/item/clothing/head/chameleon/drone"), []));
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='warning'>You shouldn't be able to toggle a camogear helmetmask if you're not wearing it</span>"]);
		}
	}
	if (truthy(live(new_headgear))) {
		yield* g.callName(f, live(D), "dropItemToGround", [rt.sv(f, "target"), 1]);
		yield* g.call(f, P("/proc/qdel"), null, [live(old_headgear)]);
		yield* g.callName(f, live(D), "equip_to_slot", [live(new_headgear), 11]);
	}
	return 1;
}, true);

rt.type(238, "/datum/action/item_action/chameleon/change", "/datum/action/item_action/chameleon", {
	chameleon_blacklist: null,
	chameleon_list: null,
	chameleon_type: null,
	chameleon_name: "Item",
	emp_timer: null,
	name: "Chameleon Change",
});

// /datum/action/item_action/chameleon/change/proc/<init>  (code/modules/clothing/chameleon.dm:71)
rt.def("/datum/action/item_action/chameleon/change/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "chameleon_blacklist", rt.list());
	$0 = $0;
	rt.setSv(f, "chameleon_list", rt.list());
	return f.dot;
});

// /datum/action/item_action/chameleon/change/proc/initialize_disguises  (code/modules/clothing/chameleon.dm:80)
rt.def("/datum/action/item_action/chameleon/change/proc/initialize_disguises", function initialize_disguises(f: Frame) {
	let V: Value = null, I: Value = null, chameleon_item_name: Value = null;
	let $e: any;
	f.vars = () => [V, I, chameleon_item_name, $e];
	if (truthy(rt.sv(f, "button"))) {
		rt.setFv(f, "name", rt.sv(f, "button"), fmt("Change ＀ Appearance", [rt.sv(f, "chameleon_name")]));
	}
	(rt.modSrcVar(f, "chameleon_blacklist", rt.call(f, P("/proc/typecacheof"), null, [rt.fv(f, "type", rt.sv(f, "target"))]), rt.bitOr));
	V = null;
	rt.forList(f, 0, rt.call(f, P("/proc/typesof"), null, [rt.sv(f, "chameleon_type")]));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		if ((truthy(rt.call(f, P("/proc/ispath"), null, [live(V)])) && truthy(rt.call(f, P("/proc/ispath"), null, [live(V), T("/obj/item")])))) {
			I = live(V);
			if ((truthy(rt.index(rt.sv(f, "chameleon_blacklist"), live(V))) || truthy(rt.bitAnd(rt.initial(f, live(I), "flags"), 128)))) {
				continue;
			}
			if ((!truthy(rt.initial(f, live(I), "icon_state")) || !truthy(rt.initial(f, live(I), "item_state")))) {
				continue;
			}
			chameleon_item_name = fmt("＀ (＀)", [rt.initial(f, live(I), "name"), rt.initial(f, live(I), "icon_state")]);
			rt.setAt(rt.sv(f, "chameleon_list"), live(chameleon_item_name), live(I));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/action/item_action/chameleon/change/proc/select_look  (code/modules/clothing/chameleon.dm:97)  may sleep
rt.def("/datum/action/item_action/chameleon/change/proc/select_look", function* select_look(f: Frame, user: Value) {
	let picked_item: Value = null, picked_name: Value = null;
	f.vars = () => [user, picked_item, picked_name];
	picked_item = null;
	picked_name = null;
	if (!truthy((picked_name = (yield* g.op(f, "Prompt", [1], [null, live(picked_name), fmt("Chameleon ＀", [rt.sv(f, "chameleon_name")]), fmt("Select ＀ to change into", [rt.sv(f, "chameleon_name")]), rt.sv(f, "chameleon_list")]))))) {
		return live(f.dot);
	}
	if (!truthy((picked_item = rt.index(rt.sv(f, "chameleon_list"), live(picked_name))))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "update_look", live(user), live(picked_item));
	return f.dot;
}, true);

// /datum/action/item_action/chameleon/change/proc/random_look  (code/modules/clothing/chameleon.dm:106)  may sleep
rt.def("/datum/action/item_action/chameleon/change/proc/random_look", function* random_look(f: Frame, user: Value) {
	let picked_name: Value = null;
	f.vars = () => [user, picked_name];
	picked_name = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "chameleon_list")]);
	if (truthy(live(user))) {
		yield* g.srcCall(f, "update_look", live(user), rt.index(rt.sv(f, "chameleon_list"), live(picked_name)));
	} else {
		yield* g.srcCall(f, "update_item", rt.index(rt.sv(f, "chameleon_list"), live(picked_name)));
	}
	return f.dot;
}, true);

// /datum/action/item_action/chameleon/change/proc/update_look  (code/modules/clothing/chameleon.dm:120)  may sleep
rt.def("/datum/action/item_action/chameleon/change/proc/update_look", function* update_look(f: Frame, user: Value, picked_item: Value) {
	let CG: Value = null, C: Value = null;
	f.vars = () => [user, picked_item, CG, C];
	if (truthy((rt.istype(rt.sv(f, "target"), T("/obj/item/weapon/gun/energy/laser/chameleon")) ? 1 : 0))) {
		yield* g.callName(f, (CG = rt.sv(f, "target")), "get_chameleon_projectile", [live(picked_item)]);
	}
	if (truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0))) {
		if (!isEqual(rt.gv(f, "stat", (C = live(user))), 0)) {
			return live(f.dot);
		}
		yield* g.srcCall(f, "update_item", live(picked_item));
		yield* g.srcCall(f, "update_item_icon");
	}
	yield* g.srcCall(f, "UpdateButtonIcon");
	return f.dot;
}, true);

// /datum/action/item_action/chameleon/change/proc/update_item  (code/modules/clothing/chameleon.dm:133)
rt.def("/datum/action/item_action/chameleon/change/proc/update_item", function update_item(f: Frame, picked_item: Value) {
	let I: Value = null, CL: Value = null, PCL: Value = null;
	f.vars = () => [I, CL, PCL];
	rt.setFv(f, "name", rt.sv(f, "target"), rt.initial(f, live(picked_item), "name"));
	rt.setFv(f, "desc", rt.sv(f, "target"), rt.initial(f, live(picked_item), "desc"));
	rt.setFv(f, "icon_state", rt.sv(f, "target"), rt.initial(f, live(picked_item), "icon_state"));
	if (truthy((rt.istype(rt.sv(f, "target"), T("/obj/item")) ? 1 : 0))) {
		rt.setFv(f, "item_state", (I = rt.sv(f, "target")), rt.initial(f, live(picked_item), "item_state"));
		rt.setFv(f, "item_color", live(I), rt.initial(f, live(picked_item), "item_color"));
		if ((truthy((rt.istype(live(I), T("/obj/item/clothing")) ? 1 : 0)) && truthy((rt.istype(live(picked_item), T("/obj/item/clothing")) ? 1 : 0)))) {
			CL = live(I);
			PCL = live(picked_item);
			rt.setFv(f, "flags_cover", live(CL), rt.initial(f, live(PCL), "flags_cover"));
		}
	}
	rt.setFv(f, "icon", rt.sv(f, "target"), rt.initial(f, live(picked_item), "icon"));
	return f.dot;
});

// /datum/action/item_action/chameleon/change/proc/Trigger  (code/modules/clothing/chameleon.dm:147)  may sleep
rt.def("/datum/action/item_action/chameleon/change/proc/Trigger", function* Trigger(f: Frame) {
	if (!truthy((yield* g.srcCall(f, "IsAvailable")))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "select_look", rt.sv(f, "owner"));
	return 1;
}, true);

// /datum/action/item_action/chameleon/change/proc/emp_randomise  (code/modules/clothing/chameleon.dm:154)  may sleep
rt.def("/datum/action/item_action/chameleon/change/proc/emp_randomise", function* emp_randomise(f: Frame) {
	if (truthy((rt.istype(rt.sv(f, "target"), T("/obj/item/weapon/gun/energy/laser/chameleon")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSprocessing"), "processing", live(f.src), add);
	}
	yield* g.srcCall(f, "random_look", rt.sv(f, "owner"));
	rt.setSv(f, "emp_timer", add(rt.worldTime(f), 300));
	return f.dot;
}, true);

// /datum/action/item_action/chameleon/change/proc/process  (code/modules/clothing/chameleon.dm:162)  may sleep
rt.def("/datum/action/item_action/chameleon/change/proc/process", function* process(f: Frame) {
	if (rt.gt(rt.worldTime(f), rt.sv(f, "emp_timer"))) {
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSprocessing"), "processing", live(f.src), subtract));
		return live(f.dot);
	}
	yield* g.srcCall(f, "random_look", rt.sv(f, "owner"));
	return f.dot;
}, true, { waitfor: false });

// /datum/action/item_action/chameleon/change/proc/update_item_icon  (code/modules/clothing/chameleon.dm:168)  may sleep
rt.def("/datum/action/item_action/chameleon/change/proc/update_item_icon", function* update_item_icon(f: Frame) {
	let I: Value = null, M: Value = null, flags: Value = null;
	f.vars = () => [I, M, flags];
	I = rt.sv(f, "target");
	M = rt.sv(f, "owner");
	if (truthy(rt.bitAnd((flags = rt.fv(f, "slot_flags", live(I))), 1))) {
		yield* g.callName(f, live(M), "update_inv_wear_suit", []);
	}
	if (truthy(rt.bitAnd(live(flags), 2))) {
		yield* g.callName(f, live(M), "update_inv_w_uniform", []);
	}
	if (truthy(rt.bitAnd(live(flags), 4))) {
		yield* g.callName(f, live(M), "update_inv_gloves", []);
	}
	if (truthy(rt.bitAnd(live(flags), 8))) {
		yield* g.callName(f, live(M), "update_inv_glasses", []);
	}
	if (truthy(rt.bitAnd(live(flags), 16))) {
		yield* g.callName(f, live(M), "update_inv_ears", []);
	}
	if (truthy(rt.bitAnd(live(flags), 32))) {
		yield* g.callName(f, live(M), "update_inv_wear_mask", []);
	}
	if (truthy(rt.bitAnd(live(flags), 64))) {
		yield* g.callName(f, live(M), "update_inv_head", []);
	}
	if (truthy(rt.bitAnd(live(flags), 128))) {
		yield* g.callName(f, live(M), "update_inv_shoes", []);
	}
	if (truthy(rt.bitAnd(live(flags), 256))) {
		yield* g.callName(f, live(M), "update_inv_wear_id", []);
	}
	if (truthy(rt.bitAnd(live(flags), 512))) {
		yield* g.callName(f, live(M), "update_inv_belt", []);
	}
	if (truthy(rt.bitAnd(live(flags), 1024))) {
		yield* g.callName(f, live(M), "update_inv_back", []);
	}
	if (!truthy(rt.bitAnd(live(flags), 8192))) return f.dot;
	yield* g.callName(f, live(M), "update_inv_neck", []);
	return f.dot;
}, true);

rt.type(8343, "/obj/item/clothing/under/chameleon", "/obj/item/clothing/under", {
	chameleon_action: null,
	name: "black jumpsuit",
	icon_state: "black",
	item_state: "bl_suit",
	item_color: "black",
	desc: "It's a plain jumpsuit. It has a small dial on the wrist.",
	origin_tech: "syndicate=2",
	sensor_mode: 0,
	random_sensor: 0,
	resistance_flags: 0,
	armor: null,
});

// /obj/item/clothing/under/chameleon/proc/<init>  (code/modules/clothing/chameleon.dm:208)
rt.def("/obj/item/clothing/under/chameleon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 10, "bullet", 10, "laser", 10, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 50]));
	return f.dot;
});

// /obj/item/clothing/under/chameleon/proc/New  (code/modules/clothing/chameleon.dm:213)  may sleep
rt.def("/obj/item/clothing/under/chameleon/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "chameleon_action", (yield* g.new_(f, T("/datum/action/item_action/chameleon/change"), [live(f.src)])));
	rt.setFv(f, "chameleon_type", rt.sv(f, "chameleon_action"), T("/obj/item/clothing/under"));
	rt.setFv(f, "chameleon_name", rt.sv(f, "chameleon_action"), "Jumpsuit");
	rt.setFv(f, "chameleon_blacklist", rt.sv(f, "chameleon_action"), (yield* g.call(f, P("/proc/typecacheof"), null, [null, rt.list(T("/obj/item/clothing/under"), T("/obj/item/clothing/under/color"), T("/obj/item/clothing/under/rank"), T("/obj/item/clothing/under/changeling")), "only_root_path", 1], rt.Args.Named)));
	yield* g.callName(f, rt.sv(f, "chameleon_action"), "initialize_disguises", []);
	return f.dot;
}, true);

// /obj/item/clothing/under/chameleon/proc/emp_act  (code/modules/clothing/chameleon.dm:221)  may sleep
rt.def("/obj/item/clothing/under/chameleon/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	yield* g.callName(f, rt.sv(f, "chameleon_action"), "emp_randomise", []);
	return f.dot;
}, true);

rt.type(7832, "/obj/item/clothing/suit/chameleon", "/obj/item/clothing/suit", {
	chameleon_action: null,
	name: "armor",
	desc: "A slim armored vest that protects against most types of damage.",
	icon_state: "armor",
	item_state: "armor",
	blood_overlay_type: "armor",
	origin_tech: "syndicate=2",
	resistance_flags: 0,
	armor: null,
});

// /obj/item/clothing/suit/chameleon/proc/<init>  (code/modules/clothing/chameleon.dm:231)
rt.def("/obj/item/clothing/suit/chameleon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 10, "bullet", 10, "laser", 10, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 50]));
	return f.dot;
});

// /obj/item/clothing/suit/chameleon/proc/New  (code/modules/clothing/chameleon.dm:236)  may sleep
rt.def("/obj/item/clothing/suit/chameleon/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "chameleon_action", (yield* g.new_(f, T("/datum/action/item_action/chameleon/change"), [live(f.src)])));
	rt.setFv(f, "chameleon_type", rt.sv(f, "chameleon_action"), T("/obj/item/clothing/suit"));
	rt.setFv(f, "chameleon_name", rt.sv(f, "chameleon_action"), "Suit");
	rt.setFv(f, "chameleon_blacklist", rt.sv(f, "chameleon_action"), (yield* g.call(f, P("/proc/typecacheof"), null, [null, rt.list(T("/obj/item/clothing/suit/armor/abductor"), T("/obj/item/clothing/suit/changeling")), "only_root_path", 1], rt.Args.Named)));
	yield* g.callName(f, rt.sv(f, "chameleon_action"), "initialize_disguises", []);
	return f.dot;
}, true);

// /obj/item/clothing/suit/chameleon/proc/emp_act  (code/modules/clothing/chameleon.dm:244)  may sleep
rt.def("/obj/item/clothing/suit/chameleon/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	yield* g.callName(f, rt.sv(f, "chameleon_action"), "emp_randomise", []);
	return f.dot;
}, true);

rt.type(8216, "/obj/item/clothing/glasses/chameleon", "/obj/item/clothing/glasses", {
	chameleon_action: null,
	name: "Optical Meson Scanner",
	desc: "Used by engineering and mining staff to see basic structural and terrain layouts through walls, regardless of lighting condition.",
	icon_state: "meson",
	item_state: "meson",
	origin_tech: "syndicate=2",
	resistance_flags: 0,
	armor: null,
});

// /obj/item/clothing/glasses/chameleon/proc/<init>  (code/modules/clothing/chameleon.dm:253)
rt.def("/obj/item/clothing/glasses/chameleon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 10, "bullet", 10, "laser", 10, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 50]));
	return f.dot;
});

// /obj/item/clothing/glasses/chameleon/proc/New  (code/modules/clothing/chameleon.dm:258)  may sleep
rt.def("/obj/item/clothing/glasses/chameleon/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "chameleon_action", (yield* g.new_(f, T("/datum/action/item_action/chameleon/change"), [live(f.src)])));
	rt.setFv(f, "chameleon_type", rt.sv(f, "chameleon_action"), T("/obj/item/clothing/glasses"));
	rt.setFv(f, "chameleon_name", rt.sv(f, "chameleon_action"), "Glasses");
	rt.setFv(f, "chameleon_blacklist", rt.sv(f, "chameleon_action"), (yield* g.call(f, P("/proc/typecacheof"), null, [null, T("/obj/item/clothing/glasses/changeling"), "only_root_path", 1], rt.Args.Named)));
	yield* g.callName(f, rt.sv(f, "chameleon_action"), "initialize_disguises", []);
	return f.dot;
}, true);

// /obj/item/clothing/glasses/chameleon/proc/emp_act  (code/modules/clothing/chameleon.dm:266)  may sleep
rt.def("/obj/item/clothing/glasses/chameleon/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	yield* g.callName(f, rt.sv(f, "chameleon_action"), "emp_randomise", []);
	return f.dot;
}, true);

rt.type(7692, "/obj/item/clothing/gloves/chameleon", "/obj/item/clothing/gloves", {
	chameleon_action: null,
	desc: "These gloves will protect the wearer from electric shock.",
	name: "insulated gloves",
	icon_state: "yellow",
	item_state: "ygloves",
	resistance_flags: 0,
	armor: null,
});

// /obj/item/clothing/gloves/chameleon/proc/<init>  (code/modules/clothing/chameleon.dm:275)
rt.def("/obj/item/clothing/gloves/chameleon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 10, "bullet", 10, "laser", 10, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 50]));
	return f.dot;
});

// /obj/item/clothing/gloves/chameleon/proc/New  (code/modules/clothing/chameleon.dm:280)  may sleep
rt.def("/obj/item/clothing/gloves/chameleon/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "chameleon_action", (yield* g.new_(f, T("/datum/action/item_action/chameleon/change"), [live(f.src)])));
	rt.setFv(f, "chameleon_type", rt.sv(f, "chameleon_action"), T("/obj/item/clothing/gloves"));
	rt.setFv(f, "chameleon_name", rt.sv(f, "chameleon_action"), "Gloves");
	rt.setFv(f, "chameleon_blacklist", rt.sv(f, "chameleon_action"), (yield* g.call(f, P("/proc/typecacheof"), null, [null, rt.list(T("/obj/item/clothing/gloves"), T("/obj/item/clothing/gloves/color"), T("/obj/item/clothing/gloves/changeling")), "only_root_path", 1], rt.Args.Named)));
	yield* g.callName(f, rt.sv(f, "chameleon_action"), "initialize_disguises", []);
	return f.dot;
}, true);

// /obj/item/clothing/gloves/chameleon/proc/emp_act  (code/modules/clothing/chameleon.dm:288)  may sleep
rt.def("/obj/item/clothing/gloves/chameleon/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	yield* g.callName(f, rt.sv(f, "chameleon_action"), "emp_randomise", []);
	return f.dot;
}, true);

rt.type(8086, "/obj/item/clothing/head/chameleon", "/obj/item/clothing/head", {
	chameleon_action: null,
	name: "grey cap",
	desc: "It's a baseball hat in a tasteful grey colour.",
	icon_state: "greysoft",
	item_color: "grey",
	resistance_flags: 0,
	armor: null,
});

// /obj/item/clothing/head/chameleon/proc/<init>  (code/modules/clothing/chameleon.dm:297)
rt.def("/obj/item/clothing/head/chameleon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 5, "bullet", 5, "laser", 5, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 50]));
	return f.dot;
});

// /obj/item/clothing/head/chameleon/proc/New  (code/modules/clothing/chameleon.dm:302)  may sleep
rt.def("/obj/item/clothing/head/chameleon/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "chameleon_action", (yield* g.new_(f, T("/datum/action/item_action/chameleon/change"), [live(f.src)])));
	rt.setFv(f, "chameleon_type", rt.sv(f, "chameleon_action"), T("/obj/item/clothing/head"));
	rt.setFv(f, "chameleon_name", rt.sv(f, "chameleon_action"), "Hat");
	rt.setFv(f, "chameleon_blacklist", rt.sv(f, "chameleon_action"), (yield* g.call(f, P("/proc/typecacheof"), null, [null, T("/obj/item/clothing/head/changeling"), "only_root_path", 1], rt.Args.Named)));
	yield* g.callName(f, rt.sv(f, "chameleon_action"), "initialize_disguises", []);
	return f.dot;
}, true);

// /obj/item/clothing/head/chameleon/proc/emp_act  (code/modules/clothing/chameleon.dm:310)  may sleep
rt.def("/obj/item/clothing/head/chameleon/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	yield* g.callName(f, rt.sv(f, "chameleon_action"), "emp_randomise", []);
	return f.dot;
}, true);

rt.type(8087, "/obj/item/clothing/head/chameleon/drone", "/obj/item/clothing/head/chameleon", {
	flags: 2,
	armor: null,
});

// /obj/item/clothing/head/chameleon/drone/proc/<init>  (code/modules/clothing/chameleon.dm:316)
rt.def("/obj/item/clothing/head/chameleon/drone/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 0, "acid", 0]));
	return f.dot;
});

// /obj/item/clothing/head/chameleon/drone/proc/New  (code/modules/clothing/chameleon.dm:320)  may sleep
rt.def("/obj/item/clothing/head/chameleon/drone/proc/New", function* New(f: Frame) {
	let togglehatmask_action: Value = null, randomise_action: Value = null;
	f.vars = () => [togglehatmask_action, randomise_action];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "chameleon_action"), "random_look", []);
	yield* g.callName(f, (togglehatmask_action = (yield* g.new_(f, T("/datum/action/item_action/chameleon/drone/togglehatmask"), [live(f.src)]))), "UpdateButtonIcon", []);
	yield* g.callName(f, (randomise_action = (yield* g.new_(f, T("/datum/action/item_action/chameleon/drone/randomise"), [live(f.src)]))), "UpdateButtonIcon", []);
	return f.dot;
}, true);

rt.type(8535, "/obj/item/clothing/mask/chameleon", "/obj/item/clothing/mask", {
	vchange: 1,
	chameleon_action: null,
	flags: 4104,
	name: "gas mask",
	desc: "A face-covering mask that can be connected to an air supply. While good for concealing your identity, it isn't good for blocking gas flow.",
	icon_state: "gas_alt",
	item_state: "gas_alt",
	resistance_flags: 0,
	armor: null,
	flags_inv: 736,
	gas_transfer_coefficient: 0.01,
	permeability_coefficient: 0.01,
	flags_cover: 10,
});

// /obj/item/clothing/mask/chameleon/proc/<init>  (code/modules/clothing/chameleon.dm:333)
rt.def("/obj/item/clothing/mask/chameleon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 5, "bullet", 5, "laser", 5, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 50]));
	return f.dot;
});

// /obj/item/clothing/mask/chameleon/proc/New  (code/modules/clothing/chameleon.dm:346)  may sleep
rt.def("/obj/item/clothing/mask/chameleon/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "chameleon_action", (yield* g.new_(f, T("/datum/action/item_action/chameleon/change"), [live(f.src)])));
	rt.setFv(f, "chameleon_type", rt.sv(f, "chameleon_action"), T("/obj/item/clothing/mask"));
	rt.setFv(f, "chameleon_name", rt.sv(f, "chameleon_action"), "Mask");
	rt.setFv(f, "chameleon_blacklist", rt.sv(f, "chameleon_action"), (yield* g.call(f, P("/proc/typecacheof"), null, [null, T("/obj/item/clothing/mask/changeling"), "only_root_path", 1], rt.Args.Named)));
	yield* g.callName(f, rt.sv(f, "chameleon_action"), "initialize_disguises", []);
	return f.dot;
}, true);

// /obj/item/clothing/mask/chameleon/proc/emp_act  (code/modules/clothing/chameleon.dm:354)  may sleep
rt.def("/obj/item/clothing/mask/chameleon/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	yield* g.callName(f, rt.sv(f, "chameleon_action"), "emp_randomise", []);
	return f.dot;
}, true);

// /obj/item/clothing/mask/chameleon/proc/attack_self  (code/modules/clothing/chameleon.dm:357)
rt.def("/obj/item/clothing/mask/chameleon/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.setSv(f, "vchange", (!truthy(rt.sv(f, "vchange")) ? 1 : 0));
	$0 = live(user);
	if (truthy(rt.sv(f, "vchange"))) {
		$1 = "on";
	} else {
		$1 = "off";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>The voice changer is now ＀!</span>", [$1])]);
	return f.dot;
});

rt.type(8536, "/obj/item/clothing/mask/chameleon/drone", "/obj/item/clothing/mask/chameleon", {
	flags: 2,
	vchange: 0,
	armor: null,
});

// /obj/item/clothing/mask/chameleon/drone/proc/<init>  (code/modules/clothing/chameleon.dm:364)
rt.def("/obj/item/clothing/mask/chameleon/drone/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 0, "acid", 0]));
	return f.dot;
});

// /obj/item/clothing/mask/chameleon/drone/proc/New  (code/modules/clothing/chameleon.dm:369)  may sleep
rt.def("/obj/item/clothing/mask/chameleon/drone/proc/New", function* New(f: Frame) {
	let togglehatmask_action: Value = null, randomise_action: Value = null;
	f.vars = () => [togglehatmask_action, randomise_action];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "chameleon_action"), "random_look", []);
	yield* g.callName(f, (togglehatmask_action = (yield* g.new_(f, T("/datum/action/item_action/chameleon/drone/togglehatmask"), [live(f.src)]))), "UpdateButtonIcon", []);
	yield* g.callName(f, (randomise_action = (yield* g.new_(f, T("/datum/action/item_action/chameleon/drone/randomise"), [live(f.src)]))), "UpdateButtonIcon", []);
	return f.dot;
}, true);

// /obj/item/clothing/mask/chameleon/drone/proc/attack_self  (code/modules/clothing/chameleon.dm:377)
rt.def("/obj/item/clothing/mask/chameleon/drone/proc/attack_self", function attack_self(f: Frame, user: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>The ＀ does not have a voice changer.</span>", [live(f.src)])]);
	return f.dot;
});

rt.type(8486, "/obj/item/clothing/shoes/chameleon", "/obj/item/clothing/shoes", {
	chameleon_action: null,
	flags: 1024,
	name: "black shoes",
	icon_state: "black",
	item_color: "black",
	desc: "A pair of black shoes.",
	permeability_coefficient: 0.05,
	origin_tech: "syndicate=2",
	resistance_flags: 0,
	pockets: rt.typePath("/obj/item/weapon/storage/internal/pocket/shoes"),
	armor: null,
});

// /obj/item/clothing/shoes/chameleon/proc/<init>  (code/modules/clothing/chameleon.dm:389)
rt.def("/obj/item/clothing/shoes/chameleon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 10, "bullet", 10, "laser", 10, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 50]));
	return f.dot;
});

// /obj/item/clothing/shoes/chameleon/proc/New  (code/modules/clothing/chameleon.dm:394)  may sleep
rt.def("/obj/item/clothing/shoes/chameleon/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "chameleon_action", (yield* g.new_(f, T("/datum/action/item_action/chameleon/change"), [live(f.src)])));
	rt.setFv(f, "chameleon_type", rt.sv(f, "chameleon_action"), T("/obj/item/clothing/shoes"));
	rt.setFv(f, "chameleon_name", rt.sv(f, "chameleon_action"), "Shoes");
	rt.setFv(f, "chameleon_blacklist", rt.sv(f, "chameleon_action"), (yield* g.call(f, P("/proc/typecacheof"), null, [null, T("/obj/item/clothing/shoes/changeling"), "only_root_path", 1], rt.Args.Named)));
	yield* g.callName(f, rt.sv(f, "chameleon_action"), "initialize_disguises", []);
	return f.dot;
}, true);

// /obj/item/clothing/shoes/chameleon/proc/emp_act  (code/modules/clothing/chameleon.dm:402)  may sleep
rt.def("/obj/item/clothing/shoes/chameleon/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	yield* g.callName(f, rt.sv(f, "chameleon_action"), "emp_randomise", []);
	return f.dot;
}, true);

rt.type(5141, "/obj/item/weapon/gun/energy/laser/chameleon", "/obj/item/weapon/gun/energy/laser", {
	chameleon_action: null,
	chameleon_projectile_vars: null,
	chameleon_ammo_vars: null,
	chameleon_gun_vars: null,
	projectile_copy_vars: null,
	ammo_copy_vars: null,
	gun_copy_vars: null,
	badmin_mode: 0,
	name: "practice laser gun",
	desc: "A modified version of the basic laser gun, this one fires less concentrated energy bolts designed for target practice.",
	clumsy_check: 0,
	needs_permit: 0,
	ammo_type: null,
	pin: rt.typePath("/obj/item/device/firing_pin"),
	cell_type: rt.typePath("/obj/item/weapon/stock_parts/cell/bluespace"),
}, { global: { blacklisted_vars: 728 } });

// /obj/item/weapon/gun/energy/laser/chameleon/proc/<init>  (code/modules/clothing/chameleon.dm:407)
rt.def("/obj/item/weapon/gun/energy/laser/chameleon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/chameleon")));
	return f.dot;
});

// /obj/item/weapon/gun/energy/laser/chameleon/proc/Initialize  (code/modules/clothing/chameleon.dm:424)  may sleep
rt.def("/obj/item/weapon/gun/energy/laser/chameleon/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "chameleon_action", (yield* g.new_(f, T("/datum/action/item_action/chameleon/change"), [live(f.src)])));
	rt.setFv(f, "chameleon_type", rt.sv(f, "chameleon_action"), T("/obj/item/weapon/gun"));
	rt.setFv(f, "chameleon_name", rt.sv(f, "chameleon_action"), "Gun");
	rt.setFv(f, "chameleon_blacklist", rt.sv(f, "chameleon_action"), (yield* g.call(f, P("/proc/typecacheof"), null, [null, T("/obj/item/weapon/gun/magic"), "ignore_root_path", 0], rt.Args.Named)));
	yield* g.callName(f, rt.sv(f, "chameleon_action"), "initialize_disguises", []);
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/laser/chameleon/proc/Initialize  (code/modules/clothing/chameleon.dm:432)  may sleep
rt.def("/obj/item/weapon/gun/energy/laser/chameleon/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "projectile_copy_vars", rt.list("name", "icon", "icon_state", "item_state", "speed", "color", "hitsound", "forcedodge", "impact_effect_type", "range", "suppressed", "hitsound_wall", "impact_effect_type", "pass_flags"));
	rt.setSv(f, "chameleon_projectile_vars", rt.alist(f, ["name", "practice laser", "icon", rt.rsc("icons/obj/projectiles.dmi"), "icon_state", "laser"]));
	rt.setSv(f, "gun_copy_vars", rt.list("fire_sound", "burst_size", "fire_delay"));
	rt.setSv(f, "chameleon_gun_vars", rt.list());
	rt.setSv(f, "ammo_copy_vars", rt.list("firing_effect_type"));
	rt.setSv(f, "chameleon_ammo_vars", rt.list());
	yield* g.srcCall(f, "recharge_newshot");
	yield* g.srcCall(f, "get_chameleon_projectile", T("/obj/item/weapon/gun/energy/laser"));
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/laser/chameleon/proc/reset_chameleon_vars  (code/modules/clothing/chameleon.dm:446)  may sleep
rt.def("/obj/item/weapon/gun/energy/laser/chameleon/proc/reset_chameleon_vars", function* reset_chameleon_vars(f: Frame) {
	let v: Value = null;
	let $e: any;
	f.vars = () => [v, $e];
	rt.setSv(f, "chameleon_ammo_vars", rt.list());
	rt.setSv(f, "chameleon_gun_vars", rt.list());
	rt.setSv(f, "chameleon_projectile_vars", rt.list());
	if (truthy(rt.sv(f, "chambered"))) {
		v = null;
		rt.forList(f, 0, rt.sv(f, "ammo_copy_vars"));
		while (($e = rt.next(f, 0)) !== undefined) {
			v = $e;
			if (truthy((rt.isIn(f, live(v), rt.gl("blacklisted_vars")) ? 1 : 0))) {
				continue;
			}
			rt.setAt(rt.fv(f, "vars", rt.sv(f, "chambered")), live(v), rt.initial(f, rt.fv(f, "vars", rt.sv(f, "chambered")), live(v)));
		}
		rt.endFor(f, 0);
	}
	v = null;
	rt.forList(f, 0, rt.sv(f, "gun_copy_vars"));
	while (($e = rt.next(f, 0)) !== undefined) {
		v = $e;
		if (truthy((rt.isIn(f, live(v), rt.gl("blacklisted_vars")) ? 1 : 0))) {
			continue;
		}
		rt.setAt(rt.sv(f, "vars"), live(v), rt.initial(f, rt.sv(f, "vars"), live(v)));
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "BB", rt.sv(f, "chambered"))]);
	rt.setFv(f, "BB", rt.sv(f, "chambered"), null);
	yield* g.callName(f, rt.sv(f, "chambered"), "newshot", []);
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/laser/chameleon/proc/set_chameleon_ammo  (code/modules/clothing/chameleon.dm:462)  may sleep
rt.def("/obj/item/weapon/gun/energy/laser/chameleon/proc/set_chameleon_ammo", function* set_chameleon_ammo(f: Frame, AC: Value, passthrough: Value, reset: Value) {
	let V: Value = null, _P: Value = null;
	let $e: any;
	f.vars = () => [AC, passthrough, reset, V, _P, $e];
	if (live(passthrough) === null) {
		passthrough = 1;
	}
	if (live(reset) === null) {
		reset = 0;
	}
	if (!truthy((rt.istype(live(AC), T("/obj/item/ammo_casing")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/CRASH"), null, [fmt("＀ is not /obj/item/ammo_casing!", [live(AC)])]);
		return 0;
	}
	V = null;
	rt.forList(f, 0, rt.sv(f, "ammo_copy_vars"));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		if (truthy(rt.index(rt.fv(f, "vars", live(AC)), live(V)))) {
			rt.setAt(rt.sv(f, "chameleon_ammo_vars"), live(V), rt.index(rt.fv(f, "vars", live(AC)), live(V)));
			if ((truthy(rt.sv(f, "chambered")) && truthy(rt.index(rt.fv(f, "vars", rt.sv(f, "chambered")), live(V))))) {
				rt.setAt(rt.fv(f, "vars", rt.sv(f, "chambered")), live(V), rt.index(rt.fv(f, "vars", live(AC)), live(V)));
			}
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(passthrough))) return f.dot;
	yield* g.srcCall(f, "set_chameleon_projectile", (_P = rt.fv(f, "BB", live(AC))));
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/laser/chameleon/proc/set_chameleon_projectile  (code/modules/clothing/chameleon.dm:475)  may sleep
rt.def("/obj/item/weapon/gun/energy/laser/chameleon/proc/set_chameleon_projectile", function* set_chameleon_projectile(f: Frame, _P: Value) {
	let V: Value = null, AC: Value = null;
	let $e: any;
	f.vars = () => [_P, V, AC, $e];
	if (!truthy((rt.istype(live(_P), T("/obj/item/projectile")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/CRASH"), null, [fmt("＀ is not /obj/item/projectile!", [live(_P)])]);
		return 0;
	}
	rt.setSv(f, "chameleon_projectile_vars", rt.alist(f, ["name", "practice laser", "icon", rt.rsc("icons/obj/projectiles.dmi"), "icon_state", "laser", "nodamage", 1]));
	V = null;
	rt.forList(f, 0, rt.sv(f, "projectile_copy_vars"));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		if (truthy(rt.index(rt.fv(f, "vars", live(_P)), live(V)))) {
			rt.setAt(rt.sv(f, "chameleon_projectile_vars"), live(V), rt.index(rt.fv(f, "vars", live(_P)), live(V)));
		}
	}
	rt.endFor(f, 0);
	if (truthy((rt.istype(rt.sv(f, "chambered"), T("/obj/item/ammo_casing/energy/chameleon")) ? 1 : 0))) {
		rt.setFv(f, "projectile_vars", (AC = rt.sv(f, "chambered")), (yield* g.callName(f, rt.sv(f, "chameleon_projectile_vars"), "Copy", [])));
	}
	if (!truthy(rt.sv(f, "badmin_mode"))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "BB", rt.sv(f, "chambered"))]);
	rt.setFv(f, "projectile_type", rt.sv(f, "chambered"), rt.fv(f, "type", live(_P)));
	yield* g.callName(f, rt.sv(f, "chambered"), "newshot", []);
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/laser/chameleon/proc/set_chameleon_gun  (code/modules/clothing/chameleon.dm:491)  may sleep
rt.def("/obj/item/weapon/gun/energy/laser/chameleon/proc/set_chameleon_gun", function* set_chameleon_gun(f: Frame, G: Value, passthrough: Value) {
	let V: Value = null, BG: Value = null, AB: Value = null, AC: Value = null, MG: Value = null, AC_1: Value = null, EG: Value = null, AC_0: Value = null;
	let $e: any;
	f.vars = () => [G, passthrough, V, BG, AB, AC, MG, AC_1, EG, AC_0, $e];
	if (live(passthrough) === null) {
		passthrough = 1;
	}
	if (!truthy((rt.istype(live(G), T("/obj/item/weapon/gun")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/CRASH"), null, [fmt("＀ is not /obj/item/weapon/gun!", [live(G)])]);
		return 0;
	}
	V = null;
	rt.forList(f, 0, rt.sv(f, "gun_copy_vars"));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		if ((truthy(rt.index(rt.sv(f, "vars"), live(V))) && truthy(rt.index(rt.fv(f, "vars", live(G)), live(V))))) {
			rt.setAt(rt.sv(f, "chameleon_gun_vars"), live(V), rt.index(rt.fv(f, "vars", live(G)), live(V)));
			rt.setAt(rt.sv(f, "vars"), live(V), rt.index(rt.fv(f, "vars", live(G)), live(V)));
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(passthrough))) return f.dot;
	if (truthy((rt.istype(live(G), T("/obj/item/weapon/gun/ballistic")) ? 1 : 0))) {
		BG = live(G);
		AB = (yield* g.new_(f, rt.fv(f, "mag_type", live(BG)), [live(G)]));
		yield* g.call(f, P("/proc/qdel"), null, [live(BG)]);
		if ((!truthy((rt.istype(live(AB), T("/obj/item/ammo_box")) ? 1 : 0)) || !truthy(rt.fv(f, "ammo_type", live(AB))))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(AB)]);
			return 0;
		}
		yield* g.srcCall(f, "set_chameleon_ammo", (AC = (yield* g.new_(f, rt.fv(f, "ammo_type", live(AB)), [live(G)]))));
	} else {
		if (truthy((rt.istype(live(G), T("/obj/item/weapon/gun/magic")) ? 1 : 0))) {
			MG = live(G);
			yield* g.srcCall(f, "set_chameleon_ammo", (AC_1 = (yield* g.new_(f, rt.fv(f, "ammo_type", live(MG)), [live(G)]))));
		} else {
			if (truthy((rt.istype(live(G), T("/obj/item/weapon/gun/energy")) ? 1 : 0))) {
				if ((truthy((rt.istype(rt.gv(f, "ammo_type", (EG = live(G))), T("/list")) ? 1 : 0)) && truthy(rt.getLen(f, rt.fv(f, "ammo_type", live(EG)))))) {
					yield* g.srcCall(f, "set_chameleon_ammo", (AC_1 = rt.index(rt.fv(f, "ammo_type", live(EG)), 1)));
				}
			} else {
				if (!truthy((rt.istype(live(G), T("/obj/item/weapon/gun/syringe")) ? 1 : 0))) return f.dot;
				yield* g.srcCall(f, "set_chameleon_ammo", (AC_0 = (yield* g.new_(f, T("/obj/item/ammo_casing/syringegun"), [live(f.src)]))));
			}
		}
	}
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/laser/chameleon/proc/get_chameleon_projectile  (code/modules/clothing/chameleon.dm:522)  may sleep
rt.def("/obj/item/weapon/gun/energy/laser/chameleon/proc/get_chameleon_projectile", function* get_chameleon_projectile(f: Frame, guntype: Value) {
	let G: Value = null;
	f.vars = () => [guntype, G];
	yield* g.srcCall(f, "reset_chameleon_vars");
	yield* g.srcCall(f, "set_chameleon_gun", (G = (yield* g.new_(f, live(guntype), [live(f.src)]))));
	yield* g.call(f, P("/proc/qdel"), null, [live(G)]);
	return f.dot;
}, true);

rt.type(5502, "/obj/item/weapon/storage/backpack/chameleon", "/obj/item/weapon/storage/backpack", {
	chameleon_action: null,
	name: "backpack",
});

// /obj/item/weapon/storage/backpack/chameleon/proc/New  (code/modules/clothing/chameleon.dm:532)  may sleep
rt.def("/obj/item/weapon/storage/backpack/chameleon/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "chameleon_action", (yield* g.new_(f, T("/datum/action/item_action/chameleon/change"), [live(f.src)])));
	rt.setFv(f, "chameleon_type", rt.sv(f, "chameleon_action"), T("/obj/item/weapon/storage/backpack"));
	rt.setFv(f, "chameleon_name", rt.sv(f, "chameleon_action"), "Backpack");
	yield* g.callName(f, rt.sv(f, "chameleon_action"), "initialize_disguises", []);
	return f.dot;
}, true);

// /obj/item/weapon/storage/backpack/chameleon/proc/emp_act  (code/modules/clothing/chameleon.dm:539)  may sleep
rt.def("/obj/item/weapon/storage/backpack/chameleon/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	yield* g.callName(f, rt.sv(f, "chameleon_action"), "emp_randomise", []);
	return f.dot;
}, true);

rt.type(5331, "/obj/item/weapon/storage/belt/chameleon", "/obj/item/weapon/storage/belt", {
	chameleon_action: null,
	name: "toolbelt",
	desc: "Holds tools.",
	silent: 1,
});

// /obj/item/weapon/storage/belt/chameleon/proc/New  (code/modules/clothing/chameleon.dm:548)  may sleep
rt.def("/obj/item/weapon/storage/belt/chameleon/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "chameleon_action", (yield* g.new_(f, T("/datum/action/item_action/chameleon/change"), [live(f.src)])));
	rt.setFv(f, "chameleon_type", rt.sv(f, "chameleon_action"), T("/obj/item/weapon/storage/belt"));
	rt.setFv(f, "chameleon_name", rt.sv(f, "chameleon_action"), "Belt");
	yield* g.callName(f, rt.sv(f, "chameleon_action"), "initialize_disguises", []);
	return f.dot;
}, true);

// /obj/item/weapon/storage/belt/chameleon/proc/emp_act  (code/modules/clothing/chameleon.dm:555)  may sleep
rt.def("/obj/item/weapon/storage/belt/chameleon/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	yield* g.callName(f, rt.sv(f, "chameleon_action"), "emp_randomise", []);
	return f.dot;
}, true);

rt.type(9202, "/obj/item/device/radio/headset/chameleon", "/obj/item/device/radio/headset", {
	chameleon_action: null,
	name: "radio headset",
});

// /obj/item/device/radio/headset/chameleon/proc/Initialize  (code/modules/clothing/chameleon.dm:562)  may sleep
rt.def("/obj/item/device/radio/headset/chameleon/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "chameleon_action", (yield* g.new_(f, T("/datum/action/item_action/chameleon/change"), [live(f.src)])));
	rt.setFv(f, "chameleon_type", rt.sv(f, "chameleon_action"), T("/obj/item/device/radio/headset"));
	rt.setFv(f, "chameleon_name", rt.sv(f, "chameleon_action"), "Headset");
	yield* g.callName(f, rt.sv(f, "chameleon_action"), "initialize_disguises", []);
	return f.dot;
}, true);

// /obj/item/device/radio/headset/chameleon/proc/emp_act  (code/modules/clothing/chameleon.dm:569)  may sleep
rt.def("/obj/item/device/radio/headset/chameleon/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	yield* g.callName(f, rt.sv(f, "chameleon_action"), "emp_randomise", []);
	return f.dot;
}, true);

rt.type(9332, "/obj/item/device/pda/chameleon", "/obj/item/device/pda", {
	chameleon_action: null,
	name: "PDA",
});

// /obj/item/device/pda/chameleon/proc/New  (code/modules/clothing/chameleon.dm:576)  may sleep
rt.def("/obj/item/device/pda/chameleon/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "chameleon_action", (yield* g.new_(f, T("/datum/action/item_action/chameleon/change"), [live(f.src)])));
	rt.setFv(f, "chameleon_type", rt.sv(f, "chameleon_action"), T("/obj/item/device/pda"));
	rt.setFv(f, "chameleon_name", rt.sv(f, "chameleon_action"), "PDA");
	rt.setFv(f, "chameleon_blacklist", rt.sv(f, "chameleon_action"), (yield* g.call(f, P("/proc/typecacheof"), null, [null, rt.list(T("/obj/item/device/pda/heads"), T("/obj/item/device/pda/ai"), T("/obj/item/device/pda/ai/pai")), "only_root_path", 1], rt.Args.Named)));
	yield* g.callName(f, rt.sv(f, "chameleon_action"), "initialize_disguises", []);
	return f.dot;
}, true);

// /obj/item/device/pda/chameleon/proc/emp_act  (code/modules/clothing/chameleon.dm:584)  may sleep
rt.def("/obj/item/device/pda/chameleon/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	yield* g.callName(f, rt.sv(f, "chameleon_action"), "emp_randomise", []);
	return f.dot;
}, true);
