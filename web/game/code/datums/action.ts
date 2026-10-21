// From code/datums/action.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(82, "/datum/action", "/datum", {
	name: "Generic Action",
	desc: null,
	target: null,
	check_flags: 0,
	processing: 0,
	button: null,
	button_icon: rt.rsc("icons/mob/actions.dmi"),
	background_icon_state: "default",
	buttontooltipstyle: "",
	icon_icon: rt.rsc("icons/mob/actions.dmi"),
	button_icon_state: "default",
	owner: null,
});

// /datum/action/proc/New  (code/datums/action.dm:22)  may sleep
rt.def("/datum/action/proc/New", function* New(f: Frame, Target: Value) {
	f.vars = () => [Target];
	rt.setSv(f, "target", live(Target));
	rt.setSv(f, "button", (yield* g.new_(f, T("/obj/screen/movable/action_button"), [])));
	rt.setFv(f, "linked_action", rt.sv(f, "button"), live(f.src));
	rt.setFv(f, "name", rt.sv(f, "button"), rt.sv(f, "name"));
	rt.setFv(f, "actiontooltipstyle", rt.sv(f, "button"), rt.sv(f, "buttontooltipstyle"));
	if (!truthy(rt.sv(f, "desc"))) return f.dot;
	rt.setFv(f, "desc", rt.sv(f, "button"), rt.sv(f, "desc"));
	return f.dot;
}, true);

// /datum/action/proc/Destroy  (code/datums/action.dm:32)  may sleep
rt.def("/datum/action/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "owner"))) {
		yield* g.srcCall(f, "Remove", rt.sv(f, "owner"));
	}
	rt.setSv(f, "target", null);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "button")]);
	rt.setSv(f, "button", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/action/proc/Grant  (code/datums/action.dm:41)  may sleep
rt.def("/datum/action/proc/Grant", function* Grant(f: Frame, M: Value) {
	f.vars = () => [M];
	if (truthy(live(M))) {
		if (truthy(rt.sv(f, "owner"))) {
			if (isEqual(rt.sv(f, "owner"), live(M))) {
				return live(f.dot);
			}
			yield* g.srcCall(f, "Remove", rt.sv(f, "owner"));
		}
		rt.setSv(f, "owner", live(M));
		rt.modField(f, live(M), "actions", live(f.src), add);
		if (truthy(rt.fv(f, "client", live(M)))) {
			rt.modField(f, rt.fv(f, "client", live(M)), "screen", rt.sv(f, "button"), add);
		}
		yield* g.callName(f, live(M), "update_action_buttons", []);
	} else {
		yield* g.srcCall(f, "Remove", rt.sv(f, "owner"));
	}
	return f.dot;
}, true);

// /datum/action/proc/Remove  (code/datums/action.dm:54)  may sleep
rt.def("/datum/action/proc/Remove", function* Remove(f: Frame, M: Value) {
	f.vars = () => [M];
	if (truthy(live(M))) {
		if (truthy(rt.fv(f, "client", live(M)))) {
			(rt.modField(f, rt.fv(f, "client", live(M)), "screen", rt.sv(f, "button"), subtract));
		}
		(rt.modField(f, live(M), "actions", live(f.src), subtract));
		yield* g.callName(f, live(M), "update_action_buttons", []);
	}
	rt.setSv(f, "owner", null);
	rt.setFv(f, "moved", rt.sv(f, "button"), 0);
	return f.dot;
}, true);

// /datum/action/proc/Trigger  (code/datums/action.dm:62)  may sleep
rt.def("/datum/action/proc/Trigger", function* Trigger(f: Frame) {
	if (!truthy((yield* g.srcCall(f, "IsAvailable")))) {
		return 0;
	}
	return 1;
}, true);

// /datum/action/proc/IsAvailable  (code/datums/action.dm:70)
rt.def("/datum/action/proc/IsAvailable", function IsAvailable(f: Frame) {
	if (!truthy(rt.sv(f, "owner"))) {
		return 0;
	}
	if (truthy(rt.bitAnd(rt.sv(f, "check_flags"), 1))) {
		if (truthy(rt.callName(f, rt.sv(f, "owner"), "restrained", []))) {
			return 0;
		}
	}
	if (truthy(rt.bitAnd(rt.sv(f, "check_flags"), 2))) {
		if ((truthy(rt.callName(f, rt.sv(f, "owner"), "IsKnockdown", [])) || truthy(rt.callName(f, rt.sv(f, "owner"), "IsStun", [])))) {
			return 0;
		}
	}
	if (truthy(rt.bitAnd(rt.sv(f, "check_flags"), 4))) {
		if (truthy(rt.fv(f, "lying", rt.sv(f, "owner")))) {
			return 0;
		}
	}
	if (truthy(rt.bitAnd(rt.sv(f, "check_flags"), 8))) {
		if (truthy(rt.fv(f, "stat", rt.sv(f, "owner")))) {
			return 0;
		}
	}
	return 1;
});

// /datum/action/proc/UpdateButtonIcon  (code/datums/action.dm:88)  may sleep
rt.def("/datum/action/proc/UpdateButtonIcon", function* UpdateButtonIcon(f: Frame, status_only: Value) {
	let settings: Value = null;
	f.vars = () => [status_only, settings];
	if (live(status_only) === null) {
		status_only = 0;
	}
	if (!truthy(rt.sv(f, "button"))) return f.dot;
	if (!truthy(live(status_only))) {
		rt.setFv(f, "name", rt.sv(f, "button"), rt.sv(f, "name"));
		rt.setFv(f, "desc", rt.sv(f, "button"), rt.sv(f, "desc"));
		if (((truthy(rt.sv(f, "owner")) && truthy(rt.fv(f, "hud_used", rt.sv(f, "owner")))) && isEqual(rt.sv(f, "background_icon_state"), "default"))) {
			settings = (yield* g.callName(f, rt.fv(f, "hud_used", rt.sv(f, "owner")), "get_action_buttons_icons", []));
			if (!isEqual(rt.fv(f, "icon", rt.sv(f, "button")), rt.at(live(settings), "bg_icon"))) {
				rt.setFv(f, "icon", rt.sv(f, "button"), rt.at(live(settings), "bg_icon"));
			}
			if (!isEqual(rt.fv(f, "icon_state", rt.sv(f, "button")), rt.at(live(settings), "bg_state"))) {
				rt.setFv(f, "icon_state", rt.sv(f, "button"), rt.at(live(settings), "bg_state"));
			}
		} else {
			if (!isEqual(rt.fv(f, "icon", rt.sv(f, "button")), rt.sv(f, "button_icon"))) {
				rt.setFv(f, "icon", rt.sv(f, "button"), rt.sv(f, "button_icon"));
			}
			if (!isEqual(rt.fv(f, "icon_state", rt.sv(f, "button")), rt.sv(f, "background_icon_state"))) {
				rt.setFv(f, "icon_state", rt.sv(f, "button"), rt.sv(f, "background_icon_state"));
			}
		}
		yield* g.srcCall(f, "ApplyIcon", rt.sv(f, "button"));
	}
	if (!truthy((yield* g.srcCall(f, "IsAvailable")))) {
		rt.setFv(f, "color", rt.sv(f, "button"), "#80000080");
	} else {
		rt.setFv(f, "color", rt.sv(f, "button"), "#ffffffff");
		return 1;
	}
	return f.dot;
}, true);

// /datum/action/proc/ApplyIcon  (code/datums/action.dm:112)
rt.def("/datum/action/proc/ApplyIcon", function ApplyIcon(f: Frame, current_button: Value) {
	if (!((truthy(rt.sv(f, "icon_icon")) && truthy(rt.sv(f, "button_icon_state"))) && !isEqual(rt.fv(f, "button_icon_state", live(current_button)), rt.sv(f, "button_icon_state")))) return f.dot;
	rt.callName(f, live(current_button), "cut_overlays", [1]);
	rt.callName(f, live(current_button), "add_overlay", [rt.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon_icon"), rt.sv(f, "button_icon_state")])]);
	rt.setFv(f, "button_icon_state", live(current_button), rt.sv(f, "button_icon_state"));
	return f.dot;
});

rt.type(176, "/datum/action/item_action", "/datum/action", {
	check_flags: 15,
	button_icon_state: null,
});

// /datum/action/item_action/proc/New  (code/datums/action.dm:126)  may sleep
rt.def("/datum/action/item_action/proc/New", function* New(f: Frame) {
	let I: Value = null;
	f.vars = () => [I];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.gv(f, "actions", (I = rt.sv(f, "target"))))) {
		rt.setFv(f, "actions", live(I), rt.list());
	}
	rt.modField(f, live(I), "actions", live(f.src), add);
	return f.dot;
}, true, { args: ["Target"] });

// /datum/action/item_action/proc/Destroy  (code/datums/action.dm:132)  may sleep
rt.def("/datum/action/item_action/proc/Destroy", function* Destroy(f: Frame) {
	let I: Value = null;
	f.vars = () => [I];
	(rt.modField(f, (I = rt.sv(f, "target")), "actions", live(f.src), subtract));
	if ((truthy(rt.fv(f, "actions", live(I))) && !truthy(rt.getLen(f, rt.fv(f, "actions", live(I)))))) {
		rt.setFv(f, "actions", live(I), null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/action/item_action/proc/Trigger  (code/datums/action.dm:138)  may sleep
rt.def("/datum/action/item_action/proc/Trigger", function* Trigger(f: Frame) {
	let I: Value = null;
	f.vars = () => [I];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 0;
	}
	if (truthy(rt.sv(f, "target"))) {
		yield* g.callName(f, (I = rt.sv(f, "target")), "ui_action_click", [rt.sv(f, "owner"), live(f.src)]);
	}
	return 1;
}, true);

// /datum/action/item_action/proc/ApplyIcon  (code/datums/action.dm:146)
rt.def("/datum/action/item_action/proc/ApplyIcon", function ApplyIcon(f: Frame, current_button: Value) {
	let I: Value = null, old_layer: Value = null, old_plane: Value = null;
	f.vars = () => [I, old_layer, old_plane];
	if ((truthy(rt.sv(f, "button_icon")) && truthy(rt.sv(f, "button_icon_state")))) {
		rt.callSuper(f, [live(current_button)]);
	} else {
		if (!(truthy(rt.sv(f, "target")) && !isEqual(rt.fv(f, "appearance_cache", live(current_button)), rt.fv(f, "appearance", rt.sv(f, "target"))))) return f.dot;
		I = rt.sv(f, "target");
		rt.setFv(f, "appearance_cache", live(current_button), rt.fv(f, "appearance", live(I)));
		old_layer = rt.fv(f, "layer", live(I));
		old_plane = rt.fv(f, "plane", live(I));
		rt.setFv(f, "layer", live(I), -1);
		rt.setFv(f, "plane", live(I), -32767);
		rt.setFv(f, "overlays", live(current_button), rt.list(live(I)));
		rt.setFv(f, "layer", live(I), live(old_layer));
		rt.setFv(f, "plane", live(I), live(old_plane));
	}
	return f.dot;
});

rt.type(186, "/datum/action/item_action/set_internals", "/datum/action/item_action", {
	name: "Set Internals",
});

// /datum/action/item_action/set_internals/proc/UpdateButtonIcon  (code/datums/action.dm:192)  may sleep
rt.def("/datum/action/item_action/set_internals/proc/UpdateButtonIcon", function* UpdateButtonIcon(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	if (!truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living/carbon")) ? 1 : 0))) return f.dot;
	C = rt.sv(f, "owner");
	if (!isEqual(rt.sv(f, "target"), rt.fv(f, "internal", live(C)))) return f.dot;
	rt.setFv(f, "icon_state", rt.sv(f, "button"), "template_active");
	return f.dot;
}, true, { args: ["status_only"] });

rt.type(191, "/datum/action/item_action/toggle_unfriendly_fire", "/datum/action/item_action", {
	name: "Toggle Friendly Fire [ON]",
	desc: "Toggles if the club's blasts cause friendly fire.",
	button_icon_state: "vortex_ff_on",
});

// /datum/action/item_action/toggle_unfriendly_fire/proc/Trigger  (code/datums/action.dm:216)  may sleep
rt.def("/datum/action/item_action/toggle_unfriendly_fire/proc/Trigger", function* Trigger(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	yield* g.srcCall(f, "UpdateButtonIcon");
	return f.dot;
}, true);

// /datum/action/item_action/toggle_unfriendly_fire/proc/UpdateButtonIcon  (code/datums/action.dm:220)  may sleep
rt.def("/datum/action/item_action/toggle_unfriendly_fire/proc/UpdateButtonIcon", function* UpdateButtonIcon(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	if (truthy((rt.istype(rt.sv(f, "target"), T("/obj/item/weapon/hierophant_club")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "friendly_fire_check", (H = rt.sv(f, "target"))))) {
			rt.setSv(f, "button_icon_state", "vortex_ff_off");
			rt.setSv(f, "name", "Toggle Friendly Fire [OFF]");
		} else {
			rt.setSv(f, "button_icon_state", "vortex_ff_on");
			rt.setSv(f, "name", "Toggle Friendly Fire [ON]");
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["status_only"] });

rt.type(192, "/datum/action/item_action/vortex_recall", "/datum/action/item_action", {
	name: "Vortex Recall",
	desc: "Recall yourself, and anyone nearby, to an attuned hierophant beacon at any time.<br>If the beacon is still attached, will detach it.",
	button_icon_state: "vortex_recall",
});

// /datum/action/item_action/vortex_recall/proc/IsAvailable  (code/datums/action.dm:236)
rt.def("/datum/action/item_action/vortex_recall/proc/IsAvailable", function IsAvailable(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (truthy((rt.istype(rt.sv(f, "target"), T("/obj/item/weapon/hierophant_club")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "teleporting", (H = rt.sv(f, "target"))))) {
			return 0;
		}
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

rt.type(193, "/datum/action/item_action/clock", "/datum/action/item_action", {
	background_icon_state: "bg_clock",
	buttontooltipstyle: "clockcult",
});

// /datum/action/item_action/clock/proc/IsAvailable  (code/datums/action.dm:247)
rt.def("/datum/action/item_action/clock/proc/IsAvailable", function IsAvailable(f: Frame) {
	if (!truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [rt.sv(f, "owner")]))) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

rt.type(194, "/datum/action/item_action/clock/toggle_visor", "/datum/action/item_action/clock", {
	name: "Create Judicial Marker",
	desc: "Allows you to create a stunning Judicial Marker at any location in view. Click again to disable.",
});

// /datum/action/item_action/clock/toggle_visor/proc/IsAvailable  (code/datums/action.dm:256)
rt.def("/datum/action/item_action/clock/toggle_visor/proc/IsAvailable", function IsAvailable(f: Frame) {
	let V: Value = null;
	f.vars = () => [V];
	if (!truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [rt.sv(f, "owner")]))) {
		return 0;
	}
	if (truthy((rt.istype(rt.sv(f, "target"), T("/obj/item/clothing/glasses/judicial_visor")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "recharging", (V = rt.sv(f, "target"))))) {
			return 0;
		}
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

rt.type(199, "/datum/action/item_action/toggle", "/datum/action/item_action", {});

// /datum/action/item_action/toggle/proc/New  (code/datums/action.dm:283)  may sleep
rt.def("/datum/action/item_action/toggle/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "name", fmt("Toggle ＀", [rt.fv(f, "name", rt.sv(f, "target"))]));
	rt.setFv(f, "name", rt.sv(f, "button"), rt.sv(f, "name"));
	return f.dot;
}, true, { args: ["Target"] });

rt.type(203, "/datum/action/item_action/adjust", "/datum/action/item_action", {});

// /datum/action/item_action/adjust/proc/New  (code/datums/action.dm:299)  may sleep
rt.def("/datum/action/item_action/adjust/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "name", fmt("Adjust ＀", [rt.fv(f, "name", rt.sv(f, "target"))]));
	rt.setFv(f, "name", rt.sv(f, "button"), rt.sv(f, "name"));
	return f.dot;
}, true, { args: ["Target"] });

rt.type(209, "/datum/action/item_action/jetpack_stabilization", "/datum/action/item_action", {
	name: "Toggle Jetpack Stabilization",
});

// /datum/action/item_action/jetpack_stabilization/proc/IsAvailable  (code/datums/action.dm:322)
rt.def("/datum/action/item_action/jetpack_stabilization/proc/IsAvailable", function IsAvailable(f: Frame) {
	let J: Value = null;
	f.vars = () => [J];
	if ((!truthy((rt.istype((J = rt.sv(f, "target")), T("/obj/item/weapon/tank/jetpack")) ? 1 : 0)) || !truthy(rt.fv(f, "on", live(J))))) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

rt.type(215, "/datum/action/item_action/toggle_research_scanner", "/datum/action/item_action", {
	active: 0,
	name: "Toggle Research Scanner",
	button_icon_state: "scan_mode",
});

// /datum/action/item_action/toggle_research_scanner/proc/Trigger  (code/datums/action.dm:346)
rt.def("/datum/action/item_action/toggle_research_scanner/proc/Trigger", function Trigger(f: Frame) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	if (!truthy(rt.callSrc(f, "IsAvailable", []))) return f.dot;
	rt.setSv(f, "active", (!truthy(rt.sv(f, "active")) ? 1 : 0));
	if (truthy(rt.sv(f, "active"))) {
		rt.incField(f, rt.sv(f, "owner"), "research_scanner", 1, true);
	} else {
		rt.incField(f, rt.sv(f, "owner"), "research_scanner", -1, true);
	}
	$0 = rt.sv(f, "owner");
	$1 = rt.sv(f, "target");
	if (truthy(rt.sv(f, "active"))) {
		$1 = $1;
		$2 = "activated";
	} else {
		$2 = "deactivated";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>＀ research scanner has been ＀.</span>", [$1, $2])]);
	return 1;
});

// /datum/action/item_action/toggle_research_scanner/proc/Remove  (code/datums/action.dm:356)  may sleep
rt.def("/datum/action/item_action/toggle_research_scanner/proc/Remove", function* Remove(f: Frame) {
	if ((truthy(rt.sv(f, "owner")) && truthy(rt.sv(f, "active")))) {
		rt.incField(f, rt.sv(f, "owner"), "research_scanner", -1, true);
		rt.setSv(f, "active", 0);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(226, "/datum/action/item_action/organ_action", "/datum/action/item_action", {
	check_flags: 8,
});

// /datum/action/item_action/organ_action/proc/IsAvailable  (code/datums/action.dm:418)
rt.def("/datum/action/item_action/organ_action/proc/IsAvailable", function IsAvailable(f: Frame) {
	let I: Value = null;
	f.vars = () => [I];
	if (!truthy(rt.gv(f, "owner", (I = rt.sv(f, "target"))))) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

rt.type(227, "/datum/action/item_action/organ_action/toggle", "/datum/action/item_action/organ_action", {});

// /datum/action/item_action/organ_action/toggle/proc/New  (code/datums/action.dm:424)  may sleep
rt.def("/datum/action/item_action/organ_action/toggle/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "name", fmt("Toggle ＀", [rt.fv(f, "name", rt.sv(f, "target"))]));
	rt.setFv(f, "name", rt.sv(f, "button"), rt.sv(f, "name"));
	return f.dot;
}, true, { args: ["Target"] });

rt.type(228, "/datum/action/item_action/organ_action/use", "/datum/action/item_action/organ_action", {});

// /datum/action/item_action/organ_action/use/proc/New  (code/datums/action.dm:429)  may sleep
rt.def("/datum/action/item_action/organ_action/use/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "name", fmt("Use ＀", [rt.fv(f, "name", rt.sv(f, "target"))]));
	rt.setFv(f, "name", rt.sv(f, "button"), rt.sv(f, "name"));
	return f.dot;
}, true, { args: ["Target"] });

rt.type(252, "/datum/action/spell_action", "/datum/action", {
	check_flags: 0,
	background_icon_state: "bg_spell",
});

// /datum/action/spell_action/proc/New  (code/datums/action.dm:442)  may sleep
rt.def("/datum/action/spell_action/proc/New", function* New(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "action", (S = rt.sv(f, "target")), live(f.src));
	rt.setSv(f, "name", rt.fv(f, "name", live(S)));
	rt.setSv(f, "button_icon", rt.fv(f, "action_icon", live(S)));
	rt.setSv(f, "button_icon_state", rt.fv(f, "action_icon_state", live(S)));
	rt.setSv(f, "background_icon_state", rt.fv(f, "action_background_icon_state", live(S)));
	rt.setFv(f, "name", rt.sv(f, "button"), rt.sv(f, "name"));
	return f.dot;
}, true, { args: ["Target"] });

// /datum/action/spell_action/proc/Destroy  (code/datums/action.dm:452)  may sleep
rt.def("/datum/action/spell_action/proc/Destroy", function* Destroy(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	rt.setFv(f, "action", (S = rt.sv(f, "target")), null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/action/spell_action/proc/Trigger  (code/datums/action.dm:457)  may sleep
rt.def("/datum/action/spell_action/proc/Trigger", function* Trigger(f: Frame) {
	let spell: Value = null;
	f.vars = () => [spell];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 0;
	}
	if (!truthy(rt.sv(f, "target"))) return f.dot;
	yield* g.callName(f, (spell = rt.sv(f, "target")), "Click", []);
	return 1;
}, true);

// /datum/action/spell_action/proc/IsAvailable  (code/datums/action.dm:465)
rt.def("/datum/action/spell_action/proc/IsAvailable", function IsAvailable(f: Frame) {
	let spell: Value = null;
	f.vars = () => [spell];
	if (!truthy(rt.sv(f, "target"))) {
		return 0;
	}
	spell = rt.sv(f, "target");
	if (truthy(rt.sv(f, "owner"))) {
		return rt.callName(f, live(spell), "can_cast", [rt.sv(f, "owner")]);
	}
	return 0;
});

rt.type(253, "/datum/action/spell_action/alien", "/datum/action/spell_action", {});

// /datum/action/spell_action/alien/proc/IsAvailable  (code/datums/action.dm:476)
rt.def("/datum/action/spell_action/alien/proc/IsAvailable", function IsAvailable(f: Frame) {
	let ab: Value = null;
	f.vars = () => [ab];
	if (!truthy(rt.sv(f, "target"))) {
		return 0;
	}
	ab = rt.sv(f, "target");
	if (truthy(rt.sv(f, "owner"))) {
		return rt.callName(f, live(ab), "cost_check", [rt.fv(f, "check_turf", live(ab)), rt.sv(f, "owner"), 1]);
	}
	return 0;
});

rt.type(83, "/datum/action/innate", "/datum/action", {
	active: 0,
	check_flags: 0,
});

// /datum/action/innate/proc/Trigger  (code/datums/action.dm:491)  may sleep
rt.def("/datum/action/innate/proc/Trigger", function* Trigger(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 0;
	}
	if (!truthy(rt.sv(f, "active"))) {
		yield* g.srcCall(f, "Activate");
	} else {
		yield* g.srcCall(f, "Deactivate");
	}
	return 1;
}, true);

rt.type(254, "/datum/action/generic", "/datum/action", {
	procname: null,
	check_flags: 0,
});

// /datum/action/generic/proc/Trigger  (code/datums/action.dm:511)  may sleep
rt.def("/datum/action/generic/proc/Trigger", function* Trigger(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 0;
	}
	if ((truthy(rt.sv(f, "target")) && truthy(rt.sv(f, "procname")))) {
		yield* g.callDyn(f, rt.sv(f, "target"), rt.sv(f, "procname"), [live(f.usr)]);
	}
	return 1;
}, true);

rt.type(257, "/datum/action/language_menu", "/datum/action", {
	name: "Language Menu",
	desc: "Open the language menu to review your languages, their keys, and select your default language.",
	button_icon_state: "language_menu",
	check_flags: 0,
});

// /datum/action/language_menu/proc/Trigger  (code/datums/action.dm:536)  may sleep
rt.def("/datum/action/language_menu/proc/Trigger", function* Trigger(f: Frame) {
	let M: Value = null, H: Value = null;
	f.vars = () => [M, H];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 0;
	}
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "owner")])))) return f.dot;
	M = rt.sv(f, "owner");
	yield* g.callName(f, (H = (yield* g.callName(f, live(M), "get_language_holder", []))), "open_language_menu", [live(f.usr)]);
	return f.dot;
}, true);
