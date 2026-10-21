// From code/game/objects/items/devices/flashlight.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9121, "/obj/item/device/flashlight", "/obj/item/device", {
	on: 0,
	brightness_on: 4,
	flashlight_power: 1,
	flags: 64,
	name: "flashlight",
	desc: "A hand-held emergency light.",
	icon: rt.rsc("icons/obj/lighting.dmi"),
	icon_state: "flashlight",
	item_state: "flashlight",
	w_class: 2,
	slot_flags: 512,
	materials: null,
	actions_types: null,
});

// /obj/item/device/flashlight/proc/<init>  (code/game/objects/items/devices/flashlight.dm:10)
rt.def("/obj/item/device/flashlight/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 50, "$glass", 20]));
	$0 = $0;
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/toggle_light")));
	return f.dot;
});

// /obj/item/device/flashlight/proc/Initialize  (code/game/objects/items/devices/flashlight.dm:17)  may sleep
rt.def("/obj/item/device/flashlight/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update_brightness");
	return f.dot;
}, true);

// /obj/item/device/flashlight/proc/update_brightness  (code/game/objects/items/devices/flashlight.dm:22)
rt.def("/obj/item/device/flashlight/proc/update_brightness", function update_brightness(f: Frame, user: Value) {
	f.vars = () => [user];
	if (live(user) === null) {
		user = null;
	}
	if (truthy(rt.sv(f, "on"))) {
		rt.setSv(f, "icon_state", fmt("＀-on", [rt.initial(f, live(f.src), "icon_state")]));
		if (truthy(rt.sv(f, "flashlight_power"))) {
			rt.callSrc(f, "set_light", ["l_range", rt.sv(f, "brightness_on"), "l_power", rt.sv(f, "flashlight_power")], rt.Args.Named);
		} else {
			rt.callSrc(f, "set_light", [rt.sv(f, "brightness_on")]);
		}
	} else {
		rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
		rt.callSrc(f, "set_light", [0]);
	}
	return f.dot;
});

// /obj/item/device/flashlight/proc/attack_self  (code/game/objects/items/devices/flashlight.dm:32)  may sleep
rt.def("/obj/item/device/flashlight/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let X: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [user, X, A, $e];
	rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
	yield* g.srcCall(f, "update_brightness", live(user));
	X = null;
	rt.forList(f, 0, rt.sv(f, "actions"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.callName(f, (A = live(X)), "UpdateButtonIcon", []);
	}
	rt.endFor(f, 0);
	return 1;
}, true);

// /obj/item/device/flashlight/proc/suicide_act  (code/game/objects/items/devices/flashlight.dm:40)
rt.def("/obj/item/device/flashlight/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is putting ＀ close to ＀ eyes and turning it on! It looks like ＀ trying to commit suicide!</span>", [live(user), live(f.src), rt.callName(f, live(user), "p_their", []), rt.callName(f, live(user), "p_theyre", [])])]);
	return 2;
});

// /obj/item/device/flashlight/proc/attack  (code/game/objects/items/devices/flashlight.dm:46)  may sleep
rt.def("/obj/item/device/flashlight/proc/attack", function* attack(f: Frame) {
	let E: Value = null, their: Value = null, mouth_organs: Value = null, O: Value = null, organ_list: Value = null, organ_count: Value = null, I: Value = null, O_5: Value = null, pill_count: Value = null, AP: Value = null, can_use_mirror: Value = null, mirror: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [E, their, mouth_organs, O, organ_list, organ_count, I, O_5, pill_count, AP, can_use_mirror, mirror, $0, $1, $2, $3, $e];
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	if (truthy((rt.isIn(f, (((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0) && rt.sv(f, "on")) && rt.fv(f, "zone_selected", live(f.args[1]))), rt.list("eyes", "mouth")) ? 1 : 0))) {
		if (((truthy(rt.bitAnd(rt.fv(f, "disabilities", live(f.args[1])), 256)) || rt.ge((yield* g.callName(f, live(f.args[1]), "getBrainLoss", [])), 60)) && truthy(rt.op(f, "Prob", [], [50])))) {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
		if (!truthy((yield* g.callName(f, live(f.args[1]), "IsAdvancedToolUser", [])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You don't have the dexterity to do this!</span>"]);
			return live(f.dot);
		}
		if (!truthy((yield* g.callName(f, live(f.args[0]), "get_bodypart", ["head"])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ doesn't have a head!</span>", [live(f.args[0])])]);
			return live(f.dot);
		}
		if (rt.lt(rt.sv(f, "flashlight_power"), 1)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＄！ isn't bright enough to see anything!</span> ", [live(f.src)])]);
			return live(f.dot);
		}
		$0 = rt.fv(f, "zone_selected", live(f.args[1]));
		if ($0 === "eyes") {
			if ((((truthy(rt.fv(f, "head", live(f.args[0]))) && truthy(rt.bitAnd(rt.gv(f, "flags_cover", rt.fv(f, "head", live(f.args[0]))), 4))) || (truthy(rt.fv(f, "wear_mask", live(f.args[0]))) && truthy(rt.bitAnd(rt.gv(f, "flags_cover", rt.fv(f, "wear_mask", live(f.args[0]))), 2)))) || (truthy(rt.fv(f, "glasses", live(f.args[0]))) && truthy(rt.bitAnd(rt.gv(f, "flags_cover", rt.fv(f, "glasses", live(f.args[0]))), 1))))) {
				$0 = live(f.args[1]);
				if ((truthy(rt.fv(f, "head", live(f.args[0]))) && truthy(rt.bitAnd(rt.gv(f, "flags_cover", rt.fv(f, "head", live(f.args[0]))), 4)))) {
					$1 = "helmet";
				} else {
					if ((truthy(rt.fv(f, "wear_mask", live(f.args[0]))) && truthy(rt.bitAnd(rt.gv(f, "flags_cover", rt.fv(f, "wear_mask", live(f.args[0]))), 2)))) {
						$1 = "mask";
					} else {
						$1 = "glasses";
					}
				}
				yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You're going to need to remove that ＀ first.</span>", [$1])]);
				return live(f.dot);
			}
			if (!truthy((E = (yield* g.callName(f, live(f.args[0]), "getorganslot", ["eye_sight"]))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='danger'>＀ doesn't have any eyes!</span>", [live(f.args[0])])]);
				return live(f.dot);
			}
			if (isEqual(live(f.args[0]), live(f.args[1]))) {
				if (truthy((yield* g.callName(f, live(f.args[0]), "flash_act", ["visual", 1], rt.Args.Named)))) {
					yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("＀ directs ＀ to ＀ eyes.", [live(f.args[0]), live(f.src), (yield* g.callName(f, live(f.args[0]), "p_their", []))]), "<span class='notice'>You wave the light in front of your eyes! Trippy!</span>"]);
				} else {
					yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("＀ directs ＀ to ＀ eyes.", [live(f.args[0]), live(f.src), (yield* g.callName(f, live(f.args[0]), "p_their", []))]), "<span class='notice'>You wave the light in front of your eyes.</span>"]);
				}
			} else {
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ directs ＀ to ＀'s eyes.</span>", [live(f.args[1]), live(f.src), live(f.args[0])]), fmt("<span class='danger'>You direct ＀ to ＀'s eyes.</span>", [live(f.src), live(f.args[0])])]);
				if (((isEqual(rt.fv(f, "stat", live(f.args[0])), 2) || truthy(rt.bitAnd(rt.fv(f, "disabilities", live(f.args[0])), 1))) || !truthy((yield* g.callName(f, live(f.args[0]), "flash_act", ["visual", 1], rt.Args.Named))))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀'s pupils don't react to the light!</span>", [live(f.args[0])])]);
				} else {
					if ((truthy(rt.fv(f, "dna", live(f.args[0]))) && truthy((yield* g.callName(f, rt.fv(f, "dna", live(f.args[0])), "check_mutation", ["X Ray Vision"]))))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='danger'>＀'s pupils give an eerie glow!</span>", [live(f.args[0])])]);
					} else {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀'s pupils narrow.</span>", [live(f.args[0])])]);
					}
				}
			}
		} else if ($0 === "mouth") {
			if (((truthy(rt.fv(f, "head", live(f.args[0]))) && truthy(rt.bitAnd(rt.gv(f, "flags_cover", rt.fv(f, "head", live(f.args[0]))), 16))) || (truthy(rt.fv(f, "wear_mask", live(f.args[0]))) && truthy(rt.bitAnd(rt.gv(f, "flags_cover", rt.fv(f, "wear_mask", live(f.args[0]))), 8))))) {
				$0 = live(f.args[1]);
				if ((truthy(rt.fv(f, "head", live(f.args[0]))) && truthy(rt.bitAnd(rt.gv(f, "flags_cover", rt.fv(f, "head", live(f.args[0]))), 16)))) {
					$1 = "helmet";
				} else {
					$1 = "mask";
				}
				yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You're going to need to remove that ＀ first.</span>", [$1])]);
				return live(f.dot);
			}
			their = (yield* g.callName(f, live(f.args[0]), "p_their", []));
			mouth_organs = (yield* g.new_(f, T("/list"), []));
			O = null;
			rt.forList(f, 0, rt.fv(f, "internal_organs", live(f.args[0])), T("/obj/item/organ"));
			while (($e = rt.next(f, 0)) !== undefined) {
				O = $e;
				if (isEqual(rt.fv(f, "zone", live(O)), "mouth")) {
					yield* g.callName(f, live(mouth_organs), "Add", [live(O)]);
				}
			}
			rt.endFor(f, 0);
			organ_list = "";
			if (truthy((organ_count = rt.length(live(mouth_organs))))) {
				I = null;
				rt.forRange(f, 0, 1, live(organ_count), 1);
				while (($e = rt.next(f, 0)) !== undefined) {
					I = $e;
					if (rt.gt(live(I), 1)) {
						if (isEqual(live(I), rt.len(f, live(mouth_organs)))) {
							organ_list = rt.modify(live(organ_list), ", and ", add);
						} else {
							organ_list = rt.modify(live(organ_list), ", ", add);
						}
					}
					if (isEqual(rt.gv(f, "gender", (O_5 = rt.index(live(mouth_organs), live(I)))), "plural")) {
						$0 = rt.fv(f, "name", live(O_5));
					} else {
						$0 = fmt("＇！", [rt.fv(f, "name", live(O_5))]);
					}
					organ_list = rt.modify(live(organ_list), $0, add);
				}
				rt.endFor(f, 0);
			}
			pill_count = 0;
			AP = null;
			rt.forList(f, 0, rt.fv(f, "actions", live(f.args[0])), T("/datum/action/item_action/hands_free/activate_pill"));
			while (($e = rt.next(f, 0)) !== undefined) {
				AP = $e;
				pill_count = rt.inc(live(pill_count), 1);
			}
			rt.endFor(f, 0);
			if (isEqual(live(f.args[0]), live(f.args[1]))) {
				can_use_mirror = 0;
				if (truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(f.args[1]))])))) {
					if (truthy((mirror = rt.locateIn(f, T("/obj/structure/mirror"), rt.fv(f, "loc", live(f.args[1])))))) {
						$0 = rt.fv(f, "dir", live(f.args[1]));
						if ($0 === 1) {
							can_use_mirror = (rt.gt(rt.fv(f, "pixel_y", live(mirror)), 0) ? 1 : 0);
						} else if ($0 === 2) {
							can_use_mirror = (rt.lt(rt.fv(f, "pixel_y", live(mirror)), 0) ? 1 : 0);
						} else if ($0 === 4) {
							can_use_mirror = (rt.gt(rt.fv(f, "pixel_x", live(mirror)), 0) ? 1 : 0);
						} else if ($0 === 8) {
							can_use_mirror = (rt.lt(rt.fv(f, "pixel_x", live(mirror)), 0) ? 1 : 0);
						}
					}
				}
				yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("＀ directs ＀ to ＀ mouth.", [live(f.args[0]), live(f.src), live(their)]), fmt("<span class='notice'>You point ＀ into your mouth.</span>", [live(f.src)])]);
				if (!truthy(live(can_use_mirror))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You can't see anything without a mirror.</span>"]);
					return live(f.dot);
				}
				if (truthy(live(organ_count))) {
					$0 = live(f.args[1]);
					if (rt.gt(live(organ_count), 1)) {
						$1 = "are";
					} else {
						$1 = "is";
					}
					yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>Inside your mouth ＀ ＀.</span>", [$1, live(organ_list)])]);
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>There's nothing inside your mouth.</span>"]);
				}
				if (truthy(live(pill_count))) {
					$0 = live(f.args[1]);
					$1 = live(pill_count);
					if (rt.gt(live(pill_count), 1)) {
						$2 = "s";
					} else {
						$2 = "";
					}
					yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You have ＀ implanted pill＀.</span>", [$1, $2])]);
				}
			} else {
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ directs ＀ to ＀'s mouth.</span>", [live(f.args[1]), live(f.src), live(f.args[0])]), fmt("<span class='notice'>You direct ＀ to ＀'s mouth.</span>", [live(f.src), live(f.args[0])])]);
				if (truthy(live(organ_count))) {
					$0 = live(f.args[1]);
					$1 = live(their);
					if (rt.gt(live(organ_count), 1)) {
						$2 = "are";
					} else {
						$2 = "is";
					}
					yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>Inside ＀ mouth ＀ ＀.</span>", [$1, $2, live(organ_list)])]);
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀ doesn't have any organs in ＀ mouth.</span>", [live(f.args[0]), live(their)])]);
				}
				if (truthy(live(pill_count))) {
					$0 = live(f.args[1]);
					$1 = live(f.args[0]);
					$2 = live(pill_count);
					if (rt.gt(live(pill_count), 1)) {
						$3 = "s";
					} else {
						$3 = "";
					}
					yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>＀ has ＀ pill＀ implanted in ＀ teeth.", [$1, $2, $3, live(their)])]);
				}
			}
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["M", "user"] });

rt.type(9125, "/obj/item/device/flashlight/pen", "/obj/item/device/flashlight", {
	holo_cooldown: 0,
	flags: 64,
	brightness_on: 2,
	name: "penlight",
	desc: "A pen-sized light, used by medical staff. It can also be used to create a hologram to alert people of incoming medical assistance.",
	icon_state: "penlight",
	item_state: "",
});

// /obj/item/device/flashlight/pen/proc/afterattack  (code/game/objects/items/devices/flashlight.dm:168)  may sleep
rt.def("/obj/item/device/flashlight/pen/proc/afterattack", function* afterattack(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (!truthy(live(f.args[2]))) {
		if (rt.gt(rt.sv(f, "holo_cooldown"), rt.worldTime(f))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ is not ready yet!</span>", [live(f.src)])]);
			return live(f.dot);
		}
		_T = rt.getStep(f, live(f.args[0]), 0);
		if (truthy(rt.locateIn(f, T("/mob/living"), live(_T)))) {
			yield* g.new_(f, T("/obj/effect/temp_visual/medical_holosign"), [live(_T), live(f.args[1])]);
			rt.setSv(f, "holo_cooldown", add(rt.worldTime(f), 100));
			return live(f.dot);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["target", "user", "proximity_flag"] });

rt.type(11659, "/obj/effect/temp_visual/medical_holosign", "/obj/effect/temp_visual", {
	duration: 30,
	name: "medical holosign",
	desc: "A small holographic glow that indicates a medic is coming to treat a patient.",
	icon_state: "medi_holo",
});

// /obj/effect/temp_visual/medical_holosign/proc/Initialize  (code/game/objects/items/devices/flashlight.dm:186)  may sleep
rt.def("/obj/effect/temp_visual/medical_holosign/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/machines/ping.ogg"), 50, 0]);
	if (!truthy(live(f.args[1]))) return f.dot;
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ created a medical hologram!</span>", [live(f.args[1])]));
	return f.dot;
}, true, { args: ["mapload", "creator"] });

rt.type(9127, "/obj/item/device/flashlight/lamp", "/obj/item/device/flashlight", {
	brightness_on: 5,
	flags: 64,
	on: 1,
	name: "desk lamp",
	desc: "A desk lamp with an adjustable mount.",
	icon_state: "lamp",
	item_state: "lamp",
	w_class: 4,
	materials: null,
});

// /obj/item/device/flashlight/lamp/proc/<init>  (code/game/objects/items/devices/flashlight.dm:210)
rt.def("/obj/item/device/flashlight/lamp/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.list());
	return f.dot;
});

// /obj/item/device/flashlight/lamp/verb/toggle_light  (code/game/objects/items/devices/flashlight.dm:227)  may sleep
rt.def("/obj/item/device/flashlight/lamp/verb/toggle_light", function* toggle_light(f: Frame) {
	if (truthy(rt.fv(f, "stat", live(f.usr)))) return f.dot;
	yield* g.srcCall(f, "attack_self", live(f.usr));
	return f.dot;
}, true, { verb: { name: "Toggle light", category: "Object", src: 3, range: 1 } });

rt.type(9122, "/obj/item/device/flashlight/flare", "/obj/item/device/flashlight", {
	fuel: 0,
	on_damage: 7,
	produce_heat: 1500,
	light_color: "#FA644B",
	name: "flare",
	desc: "A red Nanotrasen issued flare. There are instructions on the side, it reads 'pull cord, make light'.",
	w_class: 2,
	brightness_on: 7,
	icon_state: "flare",
	item_state: "flare",
	actions_types: null,
	heat: 1000,
});

// /obj/item/device/flashlight/flare/proc/<init>  (code/game/objects/items/devices/flashlight.dm:246)
rt.def("/obj/item/device/flashlight/flare/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list());
	return f.dot;
});

// /obj/item/device/flashlight/flare/proc/New  (code/game/objects/items/devices/flashlight.dm:254)  may sleep
rt.def("/obj/item/device/flashlight/flare/proc/New", function* New(f: Frame) {
	rt.setSv(f, "fuel", (yield* g.call(f, P("/proc/rand"), null, [800, 1000])));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/device/flashlight/flare/proc/process  (code/game/objects/items/devices/flashlight.dm:258)  may sleep
rt.def("/obj/item/device/flashlight/flare/proc/process", function* process(f: Frame) {
	yield* g.srcCall(f, "open_flame", rt.sv(f, "heat"));
	rt.setSv(f, "fuel", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "fuel"), 1), 0])));
	if (!(!truthy(rt.sv(f, "fuel")) || !truthy(rt.sv(f, "on")))) return f.dot;
	yield* g.srcCall(f, "turn_off");
	if (!truthy(rt.sv(f, "fuel"))) {
		rt.setSv(f, "icon_state", fmt("＀-empty", [rt.initial(f, live(f.src), "icon_state")]));
	}
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return f.dot;
}, true, { waitfor: false });

// /obj/item/device/flashlight/flare/proc/ignition_effect  (code/game/objects/items/devices/flashlight.dm:267)
rt.def("/obj/item/device/flashlight/flare/proc/ignition_effect", function ignition_effect(f: Frame, A: Value, user: Value) {
	if ((truthy(rt.sv(f, "fuel")) && truthy(rt.sv(f, "on")))) {
		f.dot = fmt("<span class='notice'>＀ lights ＀ with ＀ like a real badass.</span>", [live(user), live(A), live(f.src)]);
	} else {
		f.dot = "";
	}
	return f.dot;
});

// /obj/item/device/flashlight/flare/proc/turn_off  (code/game/objects/items/devices/flashlight.dm:275)
rt.def("/obj/item/device/flashlight/flare/proc/turn_off", function turn_off(f: Frame) {
	let U: Value = null;
	f.vars = () => [U];
	rt.setSv(f, "on", 0);
	rt.setSv(f, "force", rt.initial(f, live(f.src), "force"));
	rt.setSv(f, "damtype", rt.initial(f, live(f.src), "damtype"));
	if (truthy(rt.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")]))) {
		rt.callSrc(f, "update_brightness", [(U = rt.sv(f, "loc"))]);
	} else {
		rt.callSrc(f, "update_brightness", [null]);
	}
	return f.dot;
});

// /obj/item/device/flashlight/flare/proc/update_brightness  (code/game/objects/items/devices/flashlight.dm:284)
rt.def("/obj/item/device/flashlight/flare/proc/update_brightness", function update_brightness(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = null;
	}
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "on"))) {
		rt.setSv(f, "item_state", fmt("＀-on", [rt.initial(f, live(f.src), "item_state")]));
	} else {
		rt.setSv(f, "item_state", fmt("＀", [rt.initial(f, live(f.src), "item_state")]));
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/device/flashlight/flare/proc/attack_self  (code/game/objects/items/devices/flashlight.dm:293)  may sleep
rt.def("/obj/item/device/flashlight/flare/proc/attack_self", function* attack_self(f: Frame) {
	if (!truthy(rt.sv(f, "fuel"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>＀ is out of fuel!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "on"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>＀ is already on.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='notice'>＀ lights ％！.</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='notice'>You light ％！!</span>", [live(f.src)])]);
	rt.setSv(f, "force", rt.sv(f, "on_damage"));
	rt.setSv(f, "damtype", "fire");
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/device/flashlight/flare/proc/is_hot  (code/game/objects/items/devices/flashlight.dm:309)
rt.def("/obj/item/device/flashlight/flare/proc/is_hot", function is_hot(f: Frame) {
	return multiply(rt.sv(f, "on"), rt.sv(f, "heat"));
});

rt.type(9131, "/obj/item/device/flashlight/slime", "/obj/item/device/flashlight", {
	brightness_on: 6,
	gender: "plural",
	name: "glowing slime extract",
	desc: "Extract from a yellow slime. It emits a strong light when squeezed.",
	icon: rt.rsc("icons/obj/lighting.dmi"),
	icon_state: "slime",
	item_state: "slime",
	w_class: 2,
	slot_flags: 512,
	materials: null,
});

// /obj/item/device/flashlight/slime/proc/<init>  (code/game/objects/items/devices/flashlight.dm:338)
rt.def("/obj/item/device/flashlight/slime/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.list());
	return f.dot;
});

rt.type(9132, "/obj/item/device/flashlight/emp", "/obj/item/device/flashlight", {
	emp_max_charges: 4,
	emp_cur_charges: 4,
	charge_tick: 0,
	origin_tech: "magnets=3;syndicate=1",
});

// /obj/item/device/flashlight/emp/proc/New  (code/game/objects/items/devices/flashlight.dm:349)  may sleep
rt.def("/obj/item/device/flashlight/emp/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/device/flashlight/emp/proc/Destroy  (code/game/objects/items/devices/flashlight.dm:353)  may sleep
rt.def("/obj/item/device/flashlight/emp/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/item/device/flashlight/emp/proc/process  (code/game/objects/items/devices/flashlight.dm:357)
rt.def("/obj/item/device/flashlight/emp/proc/process", function process(f: Frame) {
	rt.incSrcVar(f, "charge_tick", 1, true);
	if (rt.lt(rt.sv(f, "charge_tick"), 10)) {
		return 0;
	}
	rt.setSv(f, "charge_tick", 0);
	rt.setSv(f, "emp_cur_charges", rt.call(f, P("/proc/min"), null, [add(rt.sv(f, "emp_cur_charges"), 1), rt.sv(f, "emp_max_charges")]));
	return 1;
}, false, { waitfor: false });

// /obj/item/device/flashlight/emp/proc/attack  (code/game/objects/items/devices/flashlight.dm:365)  may sleep
rt.def("/obj/item/device/flashlight/emp/proc/attack", function* attack(f: Frame) {
	if (truthy((rt.isIn(f, (rt.sv(f, "on") && rt.fv(f, "zone_selected", live(f.args[1]))), rt.list("eyes", "mouth")) ? 1 : 0))) {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return live(f.dot);
}, true, { args: ["M", "user"] });

// /obj/item/device/flashlight/emp/proc/afterattack  (code/game/objects/items/devices/flashlight.dm:370)  may sleep
rt.def("/obj/item/device/flashlight/emp/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	let M: Value = null;
	f.vars = () => [A, user, proximity, M];
	if (!truthy(live(proximity))) {
		return live(f.dot);
	}
	if (rt.gt(rt.sv(f, "emp_cur_charges"), 0)) {
		(rt.modSrcVar(f, "emp_cur_charges", 1, subtract));
		if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(A)])))) {
			M = live(A);
			yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(M), "attacked", "EMP-light"]);
			yield* g.callName(f, live(M), "visible_message", [fmt("<span class='danger'>＀ blinks ％！ at ％！.", [live(user), live(f.src), live(A)]), fmt("<span class='userdanger'>＀ blinks ％！ at you.", [live(user), live(f.src)])]);
		} else {
			yield* g.callName(f, live(A), "visible_message", [fmt("<span class='danger'>＀ blinks ％！ at ％！.", [live(user), live(f.src), live(A)])]);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("＄！ now has ＀ charge５.", [live(f.src), rt.sv(f, "emp_cur_charges")])]);
		yield* g.callName(f, live(A), "emp_act", [1]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＄！ needs time to recharge!</span>", [live(f.src)])]);
	}
	return live(f.dot);
}, true);

rt.type(9133, "/obj/item/device/flashlight/glowstick", "/obj/item/device/flashlight", {
	fuel: 0,
	brightness_on: 4,
	name: "glowstick",
	desc: "A military-grade glowstick.",
	w_class: 2,
	color: "#64C864",
	icon_state: "glowstick",
	item_state: "glowstick",
});

// /obj/item/device/flashlight/glowstick/proc/Initialize  (code/game/objects/items/devices/flashlight.dm:402)  may sleep
rt.def("/obj/item/device/flashlight/glowstick/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "fuel", (yield* g.call(f, P("/proc/rand"), null, [1600, 2000])));
	rt.setSv(f, "light_color", rt.sv(f, "color"));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/device/flashlight/glowstick/proc/Destroy  (code/game/objects/items/devices/flashlight.dm:407)  may sleep
rt.def("/obj/item/device/flashlight/glowstick/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/item/device/flashlight/glowstick/proc/process  (code/game/objects/items/devices/flashlight.dm:411)
rt.def("/obj/item/device/flashlight/glowstick/proc/process", function process(f: Frame) {
	rt.setSv(f, "fuel", rt.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "fuel"), 1), 0]));
	if (truthy(rt.sv(f, "fuel"))) return f.dot;
	rt.callSrc(f, "turn_off", []);
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	rt.callSrc(f, "update_icon", []);
	return f.dot;
}, false, { waitfor: false });

// /obj/item/device/flashlight/glowstick/proc/turn_off  (code/game/objects/items/devices/flashlight.dm:419)
rt.def("/obj/item/device/flashlight/glowstick/proc/turn_off", function turn_off(f: Frame) {
	rt.setSv(f, "on", 0);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/item/device/flashlight/glowstick/proc/update_icon  (code/game/objects/items/devices/flashlight.dm:422)
rt.def("/obj/item/device/flashlight/glowstick/proc/update_icon", function update_icon(f: Frame) {
	let glowstick_overlay: Value = null;
	f.vars = () => [glowstick_overlay];
	rt.setSv(f, "item_state", "glowstick");
	rt.callName(f, rt.sv(f, "overlays"), "Cut", []);
	if (!truthy(rt.sv(f, "fuel"))) {
		rt.setSv(f, "icon_state", "glowstick-empty");
		rt.callSrc(f, "cut_overlays", []);
		rt.callSrc(f, "set_light", [0]);
	} else {
		if (truthy(rt.sv(f, "on"))) {
			rt.setFv(f, "color", (glowstick_overlay = rt.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), "glowstick-glow"])), rt.sv(f, "color"));
			rt.callSrc(f, "add_overlay", [live(glowstick_overlay)]);
			rt.setSv(f, "item_state", "glowstick-on");
			rt.callSrc(f, "set_light", [rt.sv(f, "brightness_on")]);
		} else {
			rt.setSv(f, "icon_state", "glowstick");
			rt.callSrc(f, "cut_overlays", []);
		}
	}
	return f.dot;
});

// /obj/item/device/flashlight/glowstick/proc/attack_self  (code/game/objects/items/devices/flashlight.dm:439)  may sleep
rt.def("/obj/item/device/flashlight/glowstick/proc/attack_self", function* attack_self(f: Frame) {
	if (!truthy(rt.sv(f, "fuel"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>＀ is spent.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "on"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>＀ is already lit.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='notice'>＀ cracks and shakes ＀.</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='notice'>You crack and shake ＀, turning it on!</span>", [live(f.src)])]);
	yield* g.srcCall(f, "activate");
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/device/flashlight/glowstick/proc/activate  (code/game/objects/items/devices/flashlight.dm:452)
rt.def("/obj/item/device/flashlight/glowstick/proc/activate", function activate(f: Frame) {
	if (truthy(rt.sv(f, "on"))) return f.dot;
	rt.setSv(f, "on", 1);
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
});

rt.type(9140, "/obj/item/device/flashlight/glowstick/random", "/obj/item/device/flashlight/glowstick", {
	name: "random colored glowstick",
});

// /obj/item/device/flashlight/glowstick/random/proc/Initialize  (code/game/objects/items/devices/flashlight.dm:484)  may sleep
rt.def("/obj/item/device/flashlight/glowstick/random/proc/Initialize", function* Initialize(f: Frame) {
	let glowtypes: Value = null, glowtype: Value = null;
	f.vars = () => [glowtypes, glowtype];
	glowtypes = (yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/device/flashlight/glowstick")]));
	(glowtypes = rt.modify(live(glowtypes), T("/obj/item/device/flashlight/glowstick/random"), subtract));
	rt.setSv(f, "name", rt.initial(f, (glowtype = rt.op(f, "PickUnweighted", [1], [live(glowtypes)])), "name"));
	rt.setSv(f, "color", rt.initial(f, live(glowtype), "color"));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

rt.type(9143, "/obj/item/device/flashlight/eyelight", "/obj/item/device/flashlight", {
	brightness_on: 15,
	flashlight_power: 1,
	flags: 16448,
	name: "eyelight",
	desc: "This shouldn't exist outside of someone's head, how are you seeing this?",
	actions_types: null,
});

// /obj/item/device/flashlight/eyelight/proc/<init>  (code/game/objects/items/devices/flashlight.dm:522)
rt.def("/obj/item/device/flashlight/eyelight/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list());
	return f.dot;
});
