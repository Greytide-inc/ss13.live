// From code/modules/clothing/glasses/glasses.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/item/clothing/glasses/proc/visor_toggling  (code/modules/clothing/glasses/glasses.dm:7)
rt.def("/obj/item/clothing/glasses/proc/visor_toggling", function visor_toggling(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.bitAnd(rt.sv(f, "visor_vars_to_toggle"), 4))) {
		(rt.modSrcVar(f, "vision_flags", rt.initial(f, live(f.src), "vision_flags"), rt.bitXor));
	}
	if (truthy(rt.bitAnd(rt.sv(f, "visor_vars_to_toggle"), 8))) {
		(rt.modSrcVar(f, "darkness_view", rt.initial(f, live(f.src), "darkness_view"), rt.bitXor));
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "visor_vars_to_toggle"), 16))) return f.dot;
	(rt.modSrcVar(f, "invis_view", rt.initial(f, live(f.src), "invis_view"), rt.bitXor));
	return f.dot;
});

// /obj/item/clothing/glasses/proc/weldingvisortoggle  (code/modules/clothing/glasses/glasses.dm:16)  may sleep
rt.def("/obj/item/clothing/glasses/proc/weldingvisortoggle", function* weldingvisortoggle(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(live(f.dot)) && truthy(live(f.args[0])))) return f.dot;
	yield* g.callName(f, live(f.args[0]), "update_sight", []);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/clothing/glasses/proc/thermal_overload  (code/modules/clothing/glasses/glasses.dm:22)  may sleep
rt.def("/obj/item/clothing/glasses/proc/thermal_overload", function* thermal_overload(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (!truthy((rt.istype(rt.fv(f, "loc", live(f.src)), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	if (truthy(rt.bitAnd(rt.gv(f, "disabilities", (H = rt.fv(f, "loc", live(f.src)))), 1))) return f.dot;
	if (!isEqual(rt.fv(f, "glasses", live(H)), live(f.src))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='danger'>The ＀ overloads and blinds you!</span>", [live(f.src)])]);
	yield* g.callName(f, live(H), "flash_act", ["visual", 1], rt.Args.Named);
	yield* g.callName(f, live(H), "blind_eyes", [3]);
	yield* g.callName(f, live(H), "blur_eyes", [5]);
	yield* g.callName(f, live(H), "adjust_eye_damage", [5]);
	return f.dot;
}, true);

rt.type(8215, "/obj/item/clothing/glasses/meson/gar", "/obj/item/clothing/glasses/meson", {
	throw_speed: 4,
	name: "gar mesons",
	icon_state: "garm",
	item_state: "garm",
	desc: "Do the impossible, see the invisible!",
	force: 10,
	throwforce: 10,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	sharpness: 1,
});

// /obj/item/clothing/glasses/meson/gar/proc/<init>  (code/modules/clothing/glasses/glasses.dm:61)
rt.def("/obj/item/clothing/glasses/meson/gar/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("sliced"));
	return f.dot;
});

rt.type(8217, "/obj/item/clothing/glasses/science", "/obj/item/clothing/glasses", {
	glass_colour_type: rt.typePath("/datum/client_colour/glass_colour/purple"),
	name: "science goggles",
	desc: "A pair of snazzy goggles used to protect against chemical spills. Fitted with an analyzer for scanning items and reagents.",
	icon_state: "purple",
	item_state: "glasses",
	origin_tech: "magnets=2;engineering=1",
	scan_reagents: 1,
	actions_types: null,
	resistance_flags: 32,
	armor: null,
});

// /obj/item/clothing/glasses/science/proc/<init>  (code/modules/clothing/glasses/glasses.dm:72)
rt.def("/obj/item/clothing/glasses/science/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/toggle_research_scanner")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 80, "acid", 100]));
	return f.dot;
});

// /obj/item/clothing/glasses/science/proc/item_action_slot_check  (code/modules/clothing/glasses/glasses.dm:78)
rt.def("/obj/item/clothing/glasses/science/proc/item_action_slot_check", function item_action_slot_check(f: Frame, slot: Value) {
	if (!isEqual(live(slot), 8)) return f.dot;
	return 1;
});

rt.type(8222, "/obj/item/clothing/glasses/material/mining/gar", "/obj/item/clothing/glasses/material/mining", {
	throw_speed: 4,
	glass_colour_type: rt.typePath("/datum/client_colour/glass_colour/lightgreen"),
	name: "gar material scanner",
	icon_state: "garm",
	item_state: "garm",
	desc: "Do the impossible, see the invisible!",
	force: 10,
	throwforce: 20,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	sharpness: 1,
});

// /obj/item/clothing/glasses/material/mining/gar/proc/<init>  (code/modules/clothing/glasses/glasses.dm:128)
rt.def("/obj/item/clothing/glasses/material/mining/gar/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("sliced"));
	return f.dot;
});

rt.type(8228, "/obj/item/clothing/glasses/sunglasses/garb", "/obj/item/clothing/glasses/sunglasses", {
	throw_speed: 4,
	name: "black gar glasses",
	desc: "Go beyond impossible and kick reason to the curb!",
	icon_state: "garb",
	item_state: "garb",
	force: 10,
	throwforce: 10,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	sharpness: 1,
});

// /obj/item/clothing/glasses/sunglasses/garb/proc/<init>  (code/modules/clothing/glasses/glasses.dm:179)
rt.def("/obj/item/clothing/glasses/sunglasses/garb/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("sliced"));
	return f.dot;
});

rt.type(8230, "/obj/item/clothing/glasses/sunglasses/gar", "/obj/item/clothing/glasses/sunglasses", {
	throw_speed: 4,
	glass_colour_type: rt.typePath("/datum/client_colour/glass_colour/orange"),
	name: "gar glasses",
	desc: "Just who the hell do you think I am?!",
	icon_state: "gar",
	item_state: "gar",
	force: 10,
	throwforce: 10,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	sharpness: 1,
});

// /obj/item/clothing/glasses/sunglasses/gar/proc/<init>  (code/modules/clothing/glasses/glasses.dm:199)
rt.def("/obj/item/clothing/glasses/sunglasses/gar/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("sliced"));
	return f.dot;
});

rt.type(8234, "/obj/item/clothing/glasses/welding", "/obj/item/clothing/glasses", {
	glass_colour_type: rt.typePath("/datum/client_colour/glass_colour/gray"),
	name: "welding goggles",
	desc: "Protects the eyes from welders; approved by the mad scientist association.",
	icon_state: "welding-g",
	item_state: "welding-g",
	actions_types: null,
	materials: null,
	flash_protect: 2,
	tint: 2,
	visor_vars_to_toggle: 3,
	flags_cover: 1,
	visor_flags_inv: 64,
});

// /obj/item/clothing/glasses/welding/proc/<init>  (code/modules/clothing/glasses/glasses.dm:218)
rt.def("/obj/item/clothing/glasses/welding/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/toggle")));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 250]));
	return f.dot;
});

// /obj/item/clothing/glasses/welding/proc/attack_self  (code/modules/clothing/glasses/glasses.dm:228)  may sleep
rt.def("/obj/item/clothing/glasses/welding/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "weldingvisortoggle", live(user));
	return f.dot;
}, true);

rt.type(8235, "/obj/item/clothing/glasses/thermal", "/obj/item/clothing/glasses", {
	vision_flags: 4,
	invis_view: 2,
	glass_colour_type: rt.typePath("/datum/client_colour/glass_colour/red"),
	name: "optical thermal scanner",
	desc: "Thermals in the shape of glasses.",
	icon_state: "thermal",
	item_state: "glasses",
	origin_tech: "magnets=3",
	flash_protect: 0,
});

// /obj/item/clothing/glasses/thermal/proc/emp_act  (code/modules/clothing/glasses/glasses.dm:256)  may sleep
rt.def("/obj/item/clothing/glasses/thermal/proc/emp_act", function* emp_act(f: Frame) {
	yield* g.srcCall(f, "thermal_overload");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

rt.type(8236, "/obj/item/clothing/glasses/thermal/syndi", "/obj/item/clothing/glasses/thermal", {
	chameleon_action: null,
	name: "chameleon thermals",
	desc: "A pair of thermal optic goggles with an onboard chameleon generator.",
	origin_tech: "magnets=3;syndicate=4",
	flash_protect: -1,
});

// /obj/item/clothing/glasses/thermal/syndi/proc/New  (code/modules/clothing/glasses/glasses.dm:268)  may sleep
rt.def("/obj/item/clothing/glasses/thermal/syndi/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "chameleon_action", (yield* g.new_(f, T("/datum/action/item_action/chameleon/change"), [live(f.src)])));
	rt.setFv(f, "chameleon_type", rt.sv(f, "chameleon_action"), T("/obj/item/clothing/glasses"));
	rt.setFv(f, "chameleon_name", rt.sv(f, "chameleon_action"), "Glasses");
	rt.setFv(f, "chameleon_blacklist", rt.sv(f, "chameleon_action"), (yield* g.call(f, P("/proc/typecacheof"), null, [null, T("/obj/item/clothing/glasses/changeling"), "only_root_path", 1], rt.Args.Named)));
	yield* g.callName(f, rt.sv(f, "chameleon_action"), "initialize_disguises", []);
	return f.dot;
}, true);

// /obj/item/clothing/glasses/thermal/syndi/proc/emp_act  (code/modules/clothing/glasses/glasses.dm:276)  may sleep
rt.def("/obj/item/clothing/glasses/thermal/syndi/proc/emp_act", function* emp_act(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "chameleon_action"), "emp_randomise", []);
	return f.dot;
}, true, { args: ["severity"] });

rt.type(8237, "/obj/item/clothing/glasses/thermal/monocle", "/obj/item/clothing/glasses/thermal", {
	flags: null,
	name: "thermoncle",
	desc: "Never before has seeing through walls felt so gentlepersonly.",
	icon_state: "thermoncle",
});

// /obj/item/clothing/glasses/thermal/monocle/proc/examine  (code/modules/clothing/glasses/glasses.dm:286)
rt.def("/obj/item/clothing/glasses/thermal/monocle/proc/examine", function examine(f: Frame) {
	let desk: Value = null;
	f.vars = () => [desk];
	desk = rt.sv(f, "desc");
	if (isEqual(rt.fv(f, "gender", live(f.args[0])), "male")) {
		rt.setSv(f, "desc", rt.call(f, P("/proc/replacetext"), null, [rt.sv(f, "desc"), "person", "man"]));
	} else {
		if (isEqual(rt.fv(f, "gender", live(f.args[0])), "female")) {
			rt.setSv(f, "desc", rt.call(f, P("/proc/replacetext"), null, [rt.sv(f, "desc"), "person", "woman"]));
		}
	}
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "desc", live(desk));
	return f.dot;
}, false, { args: ["user"] });

rt.type(8243, "/obj/item/clothing/glasses/godeye", "/obj/item/clothing/glasses", {
	vision_flags: 28,
	darkness_view: 8,
	flags: 2,
	lighting_alpha: 128,
	name: "eye of god",
	desc: "A strange eye, said to have been torn from an omniscient creature that used to roam the wastes.",
	icon_state: "godeye",
	item_state: "godeye",
	scan_reagents: 1,
});

// /obj/item/clothing/glasses/godeye/proc/attackby  (code/modules/clothing/glasses/glasses.dm:338)  may sleep
rt.def("/obj/item/clothing/glasses/godeye/proc/attackby", function* attackby(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (((truthy(rt.op(f, "IsType", [], [live(f.args[0]), live(f.src)])) && !isEqual(live(f.args[0]), live(f.src))) && isEqual(rt.fv(f, "loc", live(f.args[0])), live(f.args[1])))) {
		if (isEqual(rt.fv(f, "icon_state", live(f.args[0])), "godeye")) {
			rt.setFv(f, "icon_state", live(f.args[0]), "doublegodeye");
			rt.setFv(f, "item_state", live(f.args[0]), "doublegodeye");
			rt.setFv(f, "desc", live(f.args[0]), "A pair of strange eyes, said to have been torn from an omniscient creature that used to roam the wastes. There's no real reason to have two, but that isn't stopping you.");
			if (truthy((rt.istype(live(f.args[1]), T("/mob/living/carbon")) ? 1 : 0))) {
				yield* g.callName(f, (C = live(f.args[1])), "update_inv_wear_mask", []);
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>The eye winks at you and vanishes into the abyss, you feel really unlucky.</span>"]);
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/clothing/glasses/proc/AltClick  (code/modules/clothing/glasses/glasses.dm:352)  may sleep
rt.def("/obj/item/clothing/glasses/proc/AltClick", function* AltClick(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if ((truthy(rt.sv(f, "glass_colour_type")) && truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0)))) {
		if (truthy(rt.gv(f, "client", (H = live(f.args[0]))))) {
			if (truthy(rt.gv(f, "prefs", rt.fv(f, "client", live(H))))) {
				if (isEqual(live(f.src), rt.fv(f, "glasses", live(H)))) {
					rt.setFv(f, "uses_glasses_colour", rt.gv(f, "prefs", rt.fv(f, "client", live(H))), (!truthy(rt.gv(f, "uses_glasses_colour", rt.gv(f, "prefs", rt.fv(f, "client", live(H))))) ? 1 : 0));
					if (truthy(rt.gv(f, "uses_glasses_colour", rt.gv(f, "prefs", rt.fv(f, "client", live(H)))))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(H), "You will now see glasses colors."]);
					} else {
						yield* g.call(f, P("/proc/to_chat"), null, [live(H), "You will no longer see glasses colors."]);
					}
					yield* g.callName(f, live(H), "update_glasses_color", [live(f.src), 1]);
				}
			}
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/clothing/glasses/proc/change_glass_color  (code/modules/clothing/glasses/glasses.dm:367)  may sleep
rt.def("/obj/item/clothing/glasses/proc/change_glass_color", function* change_glass_color(f: Frame, H: Value, new_color_type: Value) {
	let old_colour_type: Value = null;
	f.vars = () => [H, new_color_type, old_colour_type];
	old_colour_type = rt.sv(f, "glass_colour_type");
	if (!(!truthy(live(new_color_type)) || truthy((yield* g.call(f, P("/proc/ispath"), null, [live(new_color_type)]))))) return f.dot;
	rt.setSv(f, "glass_colour_type", live(new_color_type));
	if (!(truthy(live(H)) && isEqual(rt.fv(f, "glasses", live(H)), live(f.src)))) return f.dot;
	if (truthy(live(old_colour_type))) {
		yield* g.callName(f, live(H), "remove_client_colour", [live(old_colour_type)]);
	}
	if (!truthy(rt.sv(f, "glass_colour_type"))) return f.dot;
	yield* g.callName(f, live(H), "update_glasses_color", [live(f.src), 1]);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/update_glasses_color  (code/modules/clothing/glasses/glasses.dm:378)  may sleep
rt.def("/mob/living/carbon/human/proc/update_glasses_color", function* update_glasses_color(f: Frame, G: Value, glasses_equipped: Value) {
	f.vars = () => [G, glasses_equipped];
	if (((truthy(rt.sv(f, "client")) && truthy(rt.gv(f, "uses_glasses_colour", rt.fv(f, "prefs", rt.sv(f, "client"))))) && truthy(live(glasses_equipped)))) {
		yield* g.srcCall(f, "add_client_colour", rt.fv(f, "glass_colour_type", live(G)));
	} else {
		yield* g.srcCall(f, "remove_client_colour", rt.fv(f, "glass_colour_type", live(G)));
	}
	return f.dot;
}, true);
