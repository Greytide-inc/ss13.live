// From code/modules/surgery/organs/eyes.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9476, "/obj/item/organ/eyes", "/obj/item/organ", {
	sight_flags: 0,
	see_in_dark: 2,
	eye_damage: 0,
	tint: 0,
	eye_color: "",
	old_eye_color: "fff",
	flash_protect: 0,
	see_invisible: 25,
	lighting_alpha: null,
	name: "eyes",
	icon_state: "eyeballs",
	desc: "I see you!",
	zone: "eyes",
	slot: "eye_sight",
	gender: "plural",
});

// /obj/item/organ/eyes/proc/Insert  (code/modules/surgery/organs/eyes.dm:20)  may sleep
rt.def("/obj/item/organ/eyes/proc/Insert", function* Insert(f: Frame) {
	let HMN: Value = null;
	f.vars = () => [HMN];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living/carbon/human")) ? 1 : 0))) {
		rt.setSv(f, "old_eye_color", rt.gv(f, "eye_color", (HMN = rt.sv(f, "owner"))));
		if (truthy(rt.sv(f, "eye_color"))) {
			rt.setFv(f, "eye_color", live(HMN), rt.sv(f, "eye_color"));
			yield* g.callName(f, live(HMN), "regenerate_icons", []);
		} else {
			rt.setSv(f, "eye_color", rt.fv(f, "eye_color", live(HMN)));
		}
	}
	yield* g.callName(f, live(f.args[0]), "update_tint", []);
	yield* g.callName(f, rt.sv(f, "owner"), "update_sight", []);
	return f.dot;
}, true, { args: ["M", "special"] });

// /obj/item/organ/eyes/proc/Remove  (code/modules/surgery/organs/eyes.dm:33)  may sleep
rt.def("/obj/item/organ/eyes/proc/Remove", function* Remove(f: Frame) {
	let HMN: Value = null;
	f.vars = () => [HMN];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0)) && truthy(rt.sv(f, "eye_color")))) {
		rt.setFv(f, "eye_color", (HMN = live(f.args[0])), rt.sv(f, "old_eye_color"));
		yield* g.callName(f, live(HMN), "regenerate_icons", []);
	}
	yield* g.callName(f, live(f.args[0]), "update_tint", []);
	yield* g.callName(f, live(f.args[0]), "update_sight", []);
	return f.dot;
}, true, { args: ["M", "special"] });

rt.type(9477, "/obj/item/organ/eyes/night_vision", "/obj/item/organ/eyes", {
	night_vision: 1,
	see_in_dark: 8,
	lighting_alpha: 192,
	name: "shadow eyes",
	desc: "A spooky set of eyes that can see in the dark.",
	actions_types: null,
});

// /obj/item/organ/eyes/night_vision/proc/<init>  (code/modules/surgery/organs/eyes.dm:46)
rt.def("/obj/item/organ/eyes/night_vision/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/organ_action/use")));
	return f.dot;
});

// /obj/item/organ/eyes/night_vision/proc/ui_action_click  (code/modules/surgery/organs/eyes.dm:50)  may sleep
rt.def("/obj/item/organ/eyes/night_vision/proc/ui_action_click", function* ui_action_click(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "lighting_alpha");
	if ($0 === 255) {
		rt.setSv(f, "lighting_alpha", 192);
	} else if ($0 === 192) {
		rt.setSv(f, "lighting_alpha", 128);
	} else if ($0 === 128) {
		rt.setSv(f, "lighting_alpha", 0);
	} else {
		rt.setSv(f, "lighting_alpha", 255);
	}
	yield* g.callName(f, rt.sv(f, "owner"), "update_sight", []);
	return f.dot;
}, true);

rt.type(9480, "/obj/item/organ/eyes/robotic", "/obj/item/organ/eyes", {
	name: "robotic eyes",
	icon_state: "cybernetic_eyeballs",
	desc: "Your vision is augmented.",
	status: 2,
});

// /obj/item/organ/eyes/robotic/proc/emp_act  (code/modules/surgery/organs/eyes.dm:81)  may sleep
rt.def("/obj/item/organ/eyes/robotic/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	if (!truthy(rt.sv(f, "owner"))) {
		return live(f.dot);
	}
	if (rt.gt(live(severity), 1)) {
		if (truthy(rt.op(f, "Prob", [], [multiply(10, live(severity))]))) {
			return live(f.dot);
		}
	}
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='warning'>Static obfuscates your vision!</span>"]);
	yield* g.callName(f, rt.sv(f, "owner"), "flash_act", ["visual", 1], rt.Args.Named);
	return f.dot;
}, true);

rt.type(9483, "/obj/item/organ/eyes/robotic/flashlight", "/obj/item/organ/eyes/robotic", {
	eye: null,
	eye_color: "fee5a3",
	flash_protect: 2,
	tint: 1e+31,
	name: "flashlight eyes",
	desc: "It's two flashlights rigged together with some wire. Why would you put these in someones head?",
	icon: rt.rsc("icons/obj/lighting.dmi"),
	icon_state: "flashlight_eyes",
});

// /obj/item/organ/eyes/robotic/flashlight/proc/Insert  (code/modules/surgery/organs/eyes.dm:120)  may sleep
rt.def("/obj/item/organ/eyes/robotic/flashlight/proc/Insert", function* Insert(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "eye"))) {
		rt.setSv(f, "eye", (yield* g.new_(f, T("/obj/item/device/flashlight/eyelight"), [])));
	}
	rt.setFv(f, "on", rt.sv(f, "eye"), 1);
	yield* g.callName(f, rt.sv(f, "eye"), "forceMove", [live(f.args[0])]);
	yield* g.callName(f, rt.sv(f, "eye"), "update_brightness", [live(f.args[0])]);
	return f.dot;
}, true, { args: ["M", "special"] });

// /obj/item/organ/eyes/robotic/flashlight/proc/Remove  (code/modules/surgery/organs/eyes.dm:129)  may sleep
rt.def("/obj/item/organ/eyes/robotic/flashlight/proc/Remove", function* Remove(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	rt.setFv(f, "on", rt.sv(f, "eye"), 0);
	yield* g.callName(f, rt.sv(f, "eye"), "update_brightness", [live(f.args[0])]);
	yield* g.callName(f, rt.sv(f, "eye"), "forceMove", [live(f.src)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "special"] });

rt.type(9485, "/obj/item/organ/eyes/robotic/glow", "/obj/item/organ/eyes/robotic", {
	current_color_string: "#ffffff",
	active: 0,
	max_light_beam_distance: 5,
	light_beam_distance: 5,
	light_object_range: 1,
	light_object_power: 2,
	eye_lighting: null,
	on_mob: null,
	mob_overlay: null,
	eye_color: "000",
	name: "High Luminosity Eyes",
	desc: "Special glowing eyes, used by snowflakes who want to be special.",
	origin_tech: "materials=3;biotech=3;engineering=3;magnets=4",
	actions_types: null,
});

// /obj/item/organ/eyes/robotic/glow/proc/<init>  (code/modules/surgery/organs/eyes.dm:151)
rt.def("/obj/item/organ/eyes/robotic/glow/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/organ_action/use"), T("/datum/action/item_action/organ_action/toggle")));
	return f.dot;
});

// /obj/item/organ/eyes/robotic/glow/proc/Initialize  (code/modules/surgery/organs/eyes.dm:163)  may sleep
rt.def("/obj/item/organ/eyes/robotic/glow/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "mob_overlay", (yield* g.call(f, P("/proc/image"), null, [rt.rsc("icons/mob/human_face.dmi"), "eyes_glow_gs"])));
	return f.dot;
}, true);

// /obj/item/organ/eyes/robotic/glow/proc/Destroy  (code/modules/surgery/organs/eyes.dm:167)  may sleep
rt.def("/obj/item/organ/eyes/robotic/glow/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.srcCall(f, "terminate_effects");
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/item/organ/eyes/robotic/glow/proc/Remove  (code/modules/surgery/organs/eyes.dm:171)  may sleep
rt.def("/obj/item/organ/eyes/robotic/glow/proc/Remove", function* Remove(f: Frame) {
	yield* g.srcCall(f, "terminate_effects");
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/item/organ/eyes/robotic/glow/proc/terminate_effects  (code/modules/surgery/organs/eyes.dm:175)  may sleep
rt.def("/obj/item/organ/eyes/robotic/glow/proc/terminate_effects", function* terminate_effects(f: Frame) {
	if ((truthy(rt.sv(f, "owner")) && truthy(rt.sv(f, "active")))) {
		yield* g.srcCall(f, "deactivate");
	}
	rt.setSv(f, "active", 0);
	yield* g.srcCall(f, "clear_visuals", 1);
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), subtract));
	return f.dot;
}, true);

// /obj/item/organ/eyes/robotic/glow/proc/ui_action_click  (code/modules/surgery/organs/eyes.dm:182)  may sleep
rt.def("/obj/item/organ/eyes/robotic/glow/proc/ui_action_click", function* ui_action_click(f: Frame, owner: Value, action: Value) {
	f.vars = () => [owner, action];
	if (truthy((rt.istype(live(action), T("/datum/action/item_action/organ_action/toggle")) ? 1 : 0))) {
		yield* g.srcCall(f, "toggle_active");
	} else {
		if (!truthy((rt.istype(live(action), T("/datum/action/item_action/organ_action/use")) ? 1 : 0))) return f.dot;
		yield* g.srcCall(f, "prompt_for_controls", live(owner));
	}
	return f.dot;
}, true);

// /obj/item/organ/eyes/robotic/glow/proc/toggle_active  (code/modules/surgery/organs/eyes.dm:189)  may sleep
rt.def("/obj/item/organ/eyes/robotic/glow/proc/toggle_active", function* toggle_active(f: Frame) {
	if (truthy(rt.sv(f, "active"))) {
		yield* g.srcCall(f, "deactivate");
	} else {
		yield* g.srcCall(f, "activate");
	}
	return f.dot;
}, true);

// /obj/item/organ/eyes/robotic/glow/proc/prompt_for_controls  (code/modules/surgery/organs/eyes.dm:194)  may sleep
rt.def("/obj/item/organ/eyes/robotic/glow/proc/prompt_for_controls", function* prompt_for_controls(f: Frame, user: Value) {
	let C: Value = null, range: Value = null;
	f.vars = () => [user, C, range];
	if (((((!truthy((C = (yield* g.op(f, "Prompt", [257], ["#ffffff", "Select color", "Select Color", rt.sv(f, "owner"), null])))) || (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) || (!truthy(live(user)) || truthy(rt.fv(f, "gc_destroyed", live(user))))) || (!truthy(rt.sv(f, "owner")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "owner"))))) || !isEqual(rt.sv(f, "owner"), live(user)))) {
		return live(f.dot);
	}
	range = (yield* g.op(f, "Prompt", [33], [0, "Range Select", fmt("Enter range (0 - ＀)", [rt.sv(f, "max_light_beam_distance")]), live(user), null]));
	yield* g.srcCall(f, "set_distance", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [live(range), rt.sv(f, "max_light_beam_distance")]))])));
	yield* g.srcCall(f, "assume_rgb", live(C));
	return f.dot;
}, true);

// /obj/item/organ/eyes/robotic/glow/proc/assume_rgb  (code/modules/surgery/organs/eyes.dm:203)  may sleep
rt.def("/obj/item/organ/eyes/robotic/glow/proc/assume_rgb", function* assume_rgb(f: Frame, newcolor: Value) {
	f.vars = () => [newcolor];
	rt.setSv(f, "current_color_string", live(newcolor));
	rt.setSv(f, "eye_color", fmt("＀＀＀", [(yield* g.call(f, P("/proc/copytext"), null, [rt.sv(f, "current_color_string"), 2, 3])), (yield* g.call(f, P("/proc/copytext"), null, [rt.sv(f, "current_color_string"), 4, 5])), (yield* g.call(f, P("/proc/copytext"), null, [rt.sv(f, "current_color_string"), 6, 7]))]));
	yield* g.srcCall(f, "sync_light_effects");
	yield* g.srcCall(f, "cycle_mob_overlay");
	if (!(!(!truthy(rt.sv(f, "owner")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "owner")))) && truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living/carbon/human")) ? 1 : 0)))) return f.dot;
	yield* g.callName(f, rt.gv(f, "species", rt.fv(f, "dna", rt.sv(f, "owner"))), "handle_body", [rt.sv(f, "owner")]);
	return f.dot;
}, true);

// /obj/item/organ/eyes/robotic/glow/proc/cycle_mob_overlay  (code/modules/surgery/organs/eyes.dm:211)
rt.def("/obj/item/organ/eyes/robotic/glow/proc/cycle_mob_overlay", function cycle_mob_overlay(f: Frame) {
	rt.callSrc(f, "remove_mob_overlay", []);
	rt.setFv(f, "color", rt.sv(f, "mob_overlay"), rt.sv(f, "current_color_string"));
	rt.callSrc(f, "add_mob_overlay", []);
	return f.dot;
});

// /obj/item/organ/eyes/robotic/glow/proc/add_mob_overlay  (code/modules/surgery/organs/eyes.dm:216)
rt.def("/obj/item/organ/eyes/robotic/glow/proc/add_mob_overlay", function add_mob_overlay(f: Frame) {
	if (!truthy(rt.sv(f, "owner")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "owner")))) return f.dot;
	rt.callName(f, rt.sv(f, "owner"), "add_overlay", [rt.sv(f, "mob_overlay")]);
	return f.dot;
});

// /obj/item/organ/eyes/robotic/glow/proc/remove_mob_overlay  (code/modules/surgery/organs/eyes.dm:220)
rt.def("/obj/item/organ/eyes/robotic/glow/proc/remove_mob_overlay", function remove_mob_overlay(f: Frame) {
	if (!truthy(rt.sv(f, "owner")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "owner")))) return f.dot;
	rt.callName(f, rt.sv(f, "owner"), "cut_overlay", [rt.sv(f, "mob_overlay")]);
	return f.dot;
});

// /obj/item/organ/eyes/robotic/glow/proc/emp_act  (code/modules/surgery/organs/eyes.dm:225)  may sleep
rt.def("/obj/item/organ/eyes/robotic/glow/proc/emp_act", function* emp_act(f: Frame) {
	if (!truthy(rt.sv(f, "active"))) return f.dot;
	yield* g.callSrc(f, "deactivate", ["silent", 1], rt.Args.Named);
	return f.dot;
}, true);

// /obj/item/organ/eyes/robotic/glow/proc/on_mob_move  (code/modules/surgery/organs/eyes.dm:228)  may sleep
rt.def("/obj/item/organ/eyes/robotic/glow/proc/on_mob_move", function* on_mob_move(f: Frame) {
	if (((!truthy(rt.sv(f, "owner")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "owner")))) || !truthy(rt.sv(f, "active")))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "update_visuals");
	return f.dot;
}, true);

// /obj/item/organ/eyes/robotic/glow/proc/on_mob_turn  (code/modules/surgery/organs/eyes.dm:233)  may sleep
rt.def("/obj/item/organ/eyes/robotic/glow/proc/on_mob_turn", function* on_mob_turn(f: Frame) {
	if (((!truthy(rt.sv(f, "owner")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "owner")))) || !truthy(rt.sv(f, "active")))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "update_visuals");
	return f.dot;
}, true);

// /obj/item/organ/eyes/robotic/glow/proc/activate  (code/modules/surgery/organs/eyes.dm:238)  may sleep
rt.def("/obj/item/organ/eyes/robotic/glow/proc/activate", function* activate(f: Frame, silent: Value) {
	f.vars = () => [silent];
	if (live(silent) === null) {
		silent = 0;
	}
	yield* g.srcCall(f, "start_visuals");
	if (!truthy(live(silent))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), fmt("<span class='warning'>Your ＀ clicks and makes a whining noise, before shooting out a beam of light!</span>", [live(f.src)])]);
	}
	rt.setSv(f, "active", 1);
	yield* g.srcCall(f, "cycle_mob_overlay");
	return f.dot;
}, true);

// /obj/item/organ/eyes/robotic/glow/proc/deactivate  (code/modules/surgery/organs/eyes.dm:245)  may sleep
rt.def("/obj/item/organ/eyes/robotic/glow/proc/deactivate", function* deactivate(f: Frame, silent: Value) {
	f.vars = () => [silent];
	if (live(silent) === null) {
		silent = 0;
	}
	yield* g.srcCall(f, "clear_visuals");
	if (!truthy(live(silent))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), fmt("<span class='warning'>Your ＀ shuts off!</span>", [live(f.src)])]);
	}
	rt.setSv(f, "active", 0);
	yield* g.srcCall(f, "remove_mob_overlay");
	return f.dot;
}, true);

// /obj/item/organ/eyes/robotic/glow/proc/update_visuals  (code/modules/surgery/organs/eyes.dm:252)  may sleep
rt.def("/obj/item/organ/eyes/robotic/glow/proc/update_visuals", function* update_visuals(f: Frame) {
	let scanfrom: Value = null, scandir: Value = null, scanning: Value = null, stop: Value = null, i: Value = null, L: Value = null;
	let $0: any, $e: any;
	f.vars = () => [scanfrom, scandir, scanning, stop, i, L, $0, $e];
	if ((rt.lt(rt.length(rt.sv(f, "eye_lighting")), rt.sv(f, "light_beam_distance")) || !truthy(rt.sv(f, "on_mob")))) {
		yield* g.srcCall(f, "regenerate_light_effects");
	}
	scanfrom = rt.getStep(f, rt.sv(f, "owner"), 0);
	scandir = rt.fv(f, "dir", rt.sv(f, "owner"));
	if (!truthy((rt.istype(live(scanfrom), T("/turf")) ? 1 : 0))) {
		yield* g.srcCall(f, "clear_visuals");
	}
	scanning = live(scanfrom);
	stop = 0;
	yield* g.callName(f, rt.sv(f, "on_mob"), "forceMove", [live(scanning)]);
	i = null;
	rt.forRange(f, 0, 1, rt.sv(f, "light_beam_distance"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if ((truthy(rt.gv(f, "opacity", (scanning = rt.getStep(f, live(scanning), live(scandir))))) || truthy(rt.fv(f, "has_opaque_atom", live(scanning))))) {
			stop = 1;
		}
		if (truthy(rt.sv(f, "eye_lighting"))) {
			if (truthy((yield* g.call(f, P("/proc/isnum"), null, [live(i)])))) {
				if ((rt.gt(live(i), 0) && rt.le(live(i), rt.len(f, rt.sv(f, "eye_lighting"))))) {
					$0 = rt.index(rt.sv(f, "eye_lighting"), live(i));
				} else {
					$0 = null;
				}
			} else {
				$0 = rt.index(rt.sv(f, "eye_lighting"), live(i));
			}
		} else {
			$0 = null;
		}
		L = $0;
		if (truthy(live(stop))) {
			yield* g.callName(f, live(L), "forceMove", [live(f.src)]);
		} else {
			yield* g.callName(f, live(L), "forceMove", [live(scanning)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/organ/eyes/robotic/glow/proc/clear_visuals  (code/modules/surgery/organs/eyes.dm:273)  may sleep
rt.def("/obj/item/organ/eyes/robotic/glow/proc/clear_visuals", function* clear_visuals(f: Frame, delete_everything: Value) {
	let I: Value = null, i: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [delete_everything, I, i, L, $e];
	if (live(delete_everything) === null) {
		delete_everything = 0;
	}
	if (truthy(live(delete_everything))) {
		if (truthy(rt.sv(f, "eye_lighting"))) {
			I = null;
			rt.forList(f, 0, rt.sv(f, "eye_lighting"));
			while (($e = rt.next(f, 0)) !== undefined) {
				I = $e;
				yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
			}
			rt.endFor(f, 0);
			yield* g.callName(f, rt.sv(f, "eye_lighting"), "Cut", []);
		}
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "on_mob")]);
		rt.setSv(f, "on_mob", null);
	} else {
		i = null;
		rt.forList(f, 0, rt.sv(f, "eye_lighting"));
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			yield* g.callName(f, (L = live(i)), "forceMove", [live(f.src)]);
		}
		rt.endFor(f, 0);
		if (!truthy(rt.sv(f, "on_mob")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "on_mob")))) return f.dot;
		yield* g.callName(f, rt.sv(f, "on_mob"), "forceMove", [live(f.src)]);
	}
	return f.dot;
}, true);

// /obj/item/organ/eyes/robotic/glow/proc/start_visuals  (code/modules/surgery/organs/eyes.dm:283)  may sleep
rt.def("/obj/item/organ/eyes/robotic/glow/proc/start_visuals", function* start_visuals(f: Frame) {
	if (!truthy((rt.istype(rt.sv(f, "eye_lighting"), T("/list")) ? 1 : 0))) {
		yield* g.srcCall(f, "regenerate_light_effects");
	}
	if ((rt.lt(rt.len(f, rt.sv(f, "eye_lighting")), rt.sv(f, "light_beam_distance")) || !truthy(rt.sv(f, "on_mob")))) {
		yield* g.srcCall(f, "regenerate_light_effects");
	}
	yield* g.srcCall(f, "sync_light_effects");
	yield* g.srcCall(f, "update_visuals");
	return f.dot;
}, true);

// /obj/item/organ/eyes/robotic/glow/proc/set_distance  (code/modules/surgery/organs/eyes.dm:291)  may sleep
rt.def("/obj/item/organ/eyes/robotic/glow/proc/set_distance", function* set_distance(f: Frame, dist: Value) {
	f.vars = () => [dist];
	rt.setSv(f, "light_beam_distance", live(dist));
	yield* g.srcCall(f, "regenerate_light_effects");
	return f.dot;
}, true);

// /obj/item/organ/eyes/robotic/glow/proc/regenerate_light_effects  (code/modules/surgery/organs/eyes.dm:295)  may sleep
rt.def("/obj/item/organ/eyes/robotic/glow/proc/regenerate_light_effects", function* regenerate_light_effects(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.srcCall(f, "clear_visuals", 1);
	rt.setSv(f, "on_mob", (yield* g.new_(f, T("/obj/effect/abstract/eye_lighting"), [live(f.src)])));
	i = null;
	rt.forRange(f, 0, 1, rt.sv(f, "light_beam_distance"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!truthy(rt.sv(f, "eye_lighting"))) {
			rt.setSv(f, "eye_lighting", rt.list());
		}
		rt.modSrcVar(f, "eye_lighting", (yield* g.new_(f, T("/obj/effect/abstract/eye_lighting"), [live(f.src)])), add);
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "sync_light_effects");
	return f.dot;
}, true);

// /obj/item/organ/eyes/robotic/glow/proc/sync_light_effects  (code/modules/surgery/organs/eyes.dm:302)
rt.def("/obj/item/organ/eyes/robotic/glow/proc/sync_light_effects", function sync_light_effects(f: Frame) {
	let I: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [I, L, $e];
	I = null;
	rt.forList(f, 0, rt.sv(f, "eye_lighting"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		rt.callName(f, (L = live(I)), "set_light", [rt.sv(f, "light_object_range"), rt.sv(f, "light_object_power"), rt.sv(f, "current_color_string")]);
	}
	rt.endFor(f, 0);
	if (!truthy(rt.sv(f, "on_mob"))) return f.dot;
	rt.callName(f, rt.sv(f, "on_mob"), "set_light", [1, 1, rt.sv(f, "current_color_string")]);
	return f.dot;
});

rt.type(11809, "/obj/effect/abstract/eye_lighting", "/obj/effect/abstract", {
	parent: null,
});

// /obj/effect/abstract/eye_lighting/proc/Initialize  (code/modules/surgery/organs/eyes.dm:312)
rt.def("/obj/effect/abstract/eye_lighting/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "parent", rt.sv(f, "loc"));
	if (truthy((rt.istype(rt.sv(f, "parent"), T("/obj/item/organ/eyes/robotic/glow")) ? 1 : 0))) return f.dot;
	return 2;
});
