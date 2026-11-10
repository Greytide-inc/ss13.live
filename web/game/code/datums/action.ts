// Based on /tg/station's code/datums/action.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


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

// action.dm:22
rt.def("/datum/action/proc/New", function* New(f: Frame, Target: Value) {
	this.target = Target;
	this.button = (yield* new_(T("/obj/screen/movable/action_button")));
	this.button.linked_action = this;
	this.button.name = this.name;
	this.button.actiontooltipstyle = this.buttontooltipstyle;
	if (!this.desc) return f.dot;
	this.button.desc = this.desc;
	return f.dot;
}, true);

// action.dm:32
rt.def("/datum/action/proc/Destroy", function* Destroy(f: Frame) {
	if (this.owner) {
		yield* this.Remove(this.owner);
	}
	this.target = null;
	yield* qdel(this.button);
	this.button = null;
	return (yield* parent_proc());
}, true);

// action.dm:41
rt.def("/datum/action/proc/Grant", function* Grant(f: Frame, M: Value) {
	if (M) {
		if (this.owner) {
			if (this.owner == M) {
				return f.dot;
			}
			yield* this.Remove(this.owner);
		}
		this.owner = M;
		M.actions += this;
		if (M.client) {
			M.client.screen += this.button;
		}
		yield* M.update_action_buttons();
	} else {
		yield* this.Remove(this.owner);
	}
	return f.dot;
}, true);

// action.dm:54
rt.def("/datum/action/proc/Remove", function* Remove(f: Frame, M: Value) {
	if (M) {
		if (M.client) {
			M.client.screen -= this.button;
		}
		M.actions -= this;
		yield* M.update_action_buttons();
	}
	this.owner = null;
	this.button.moved = 0;
	return f.dot;
}, true);

// action.dm:62
rt.def("/datum/action/proc/Trigger", function* Trigger(f: Frame) {
	if (!(yield* this.IsAvailable())) {
		return 0;
	}
	return 1;
}, true);

// action.dm:70
rt.def("/datum/action/proc/IsAvailable", function IsAvailable(f: Frame) {
	if (!this.owner) {
		return 0;
	}
	if (rt.bitAnd(this.check_flags, AB_CHECK_RESTRAINED)) {
		if (this.owner.restrained()) {
			return 0;
		}
	}
	if (rt.bitAnd(this.check_flags, AB_CHECK_STUN)) {
		if (this.owner.IsKnockdown() || this.owner.IsStun()) {
			return 0;
		}
	}
	if (rt.bitAnd(this.check_flags, AB_CHECK_LYING)) {
		if (this.owner.lying) {
			return 0;
		}
	}
	if (rt.bitAnd(this.check_flags, AB_CHECK_CONSCIOUS)) {
		if (this.owner.stat) {
			return 0;
		}
	}
	return 1;
});

// action.dm:88
rt.def("/datum/action/proc/UpdateButtonIcon", function* UpdateButtonIcon(f: Frame, status_only: Value) {
	let settings: Value = null;
	status_only ??= 0;
	if (!this.button) return f.dot;
	if (!status_only) {
		this.button.name = this.name;
		this.button.desc = this.desc;
		if (this.owner && this.owner.hud_used && this.background_icon_state == "default") {
			settings = this.owner.hud_used.get_action_buttons_icons();
			if (this.button.icon != rt.at(settings, "bg_icon")) {
				this.button.icon = rt.at(settings, "bg_icon");
			}
			if (this.button.icon_state != rt.at(settings, "bg_state")) {
				this.button.icon_state = rt.at(settings, "bg_state");
			}
		} else {
			if (this.button.icon != this.button_icon) {
				this.button.icon = this.button_icon;
			}
			if (this.button.icon_state != this.background_icon_state) {
				this.button.icon_state = this.background_icon_state;
			}
		}
		this.ApplyIcon(this.button);
	}
	if (!(yield* this.IsAvailable())) {
		this.button.color = "#80000080";
	} else {
		this.button.color = "#ffffffff";
		return 1;
	}
	return f.dot;
}, true);

// action.dm:112
rt.def("/datum/action/proc/ApplyIcon", function ApplyIcon(f: Frame, current_button: Value) {
	if (!(this.icon_icon && this.button_icon_state && current_button.button_icon_state != this.button_icon_state)) return f.dot;
	current_button.cut_overlays(1);
	current_button.add_overlay(mutable_appearance(this.icon_icon, this.button_icon_state));
	current_button.button_icon_state = this.button_icon_state;
	return f.dot;
});

rt.type(176, "/datum/action/item_action", "/datum/action", {
	check_flags: 15,
	button_icon_state: null,
});

// action.dm:126
rt.def("/datum/action/item_action/proc/New", function* New(f: Frame, Target: Value) {
	let I: Value = null;
	yield* parent_proc();
	if (!(I = this.target).actions) {
		I.actions = list();
	}
	I.actions += this;
	return f.dot;
}, true);

// action.dm:132
rt.def("/datum/action/item_action/proc/Destroy", function* Destroy(f: Frame) {
	let I: Value = null;
	(I = this.target).actions -= this;
	if (I.actions && !rt.len(f, I.actions)) {
		I.actions = null;
	}
	return (yield* parent_proc());
}, true);

// action.dm:138
rt.def("/datum/action/item_action/proc/Trigger", function* Trigger(f: Frame) {
	let I: Value = null;
	if (!(yield* parent_proc())) {
		return 0;
	}
	if (this.target) {
		yield* (I = this.target).ui_action_click(this.owner, this);
	}
	return 1;
}, true);

// action.dm:146
rt.def("/datum/action/item_action/proc/ApplyIcon", function ApplyIcon(f: Frame, current_button: Value) {
	let I: Value = null, old_layer: Value = null, old_plane: Value = null;
	if (this.button_icon && this.button_icon_state) {
		parent_proc(current_button);
	} else {
		if (!(this.target && current_button.appearance_cache != this.target.appearance)) return f.dot;
		I = this.target;
		current_button.appearance_cache = I.appearance;
		old_layer = I.layer;
		old_plane = I.plane;
		I.layer = -1;
		I.plane = -32767;
		current_button.overlays = list(I);
		I.layer = old_layer;
		I.plane = old_plane;
	}
	return f.dot;
});

rt.type(186, "/datum/action/item_action/set_internals", "/datum/action/item_action", {
	name: "Set Internals",
});

// action.dm:192
rt.def("/datum/action/item_action/set_internals/proc/UpdateButtonIcon", function* UpdateButtonIcon(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	if (!(yield* parent_proc())) return f.dot;
	if (!rt.istype(this.owner, T("/mob/living/carbon"))) return f.dot;
	let C: Value = this.owner;
	if (this.target != C.internal) return f.dot;
	this.button.icon_state = "template_active";
	return f.dot;
}, true, { args: ["status_only"] });

rt.type(191, "/datum/action/item_action/toggle_unfriendly_fire", "/datum/action/item_action", {
	name: "Toggle Friendly Fire [ON]",
	desc: "Toggles if the club's blasts cause friendly fire.",
	button_icon_state: "vortex_ff_on",
});

// action.dm:216
rt.def("/datum/action/item_action/toggle_unfriendly_fire/proc/Trigger", function* Trigger(f: Frame) {
	if (!(yield* parent_proc())) return f.dot;
	yield* this.UpdateButtonIcon();
	return f.dot;
}, true);

// action.dm:220
rt.def("/datum/action/item_action/toggle_unfriendly_fire/proc/UpdateButtonIcon", function* UpdateButtonIcon(f: Frame) {
	let H: Value = null;
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	if (rt.istype(this.target, T("/obj/item/weapon/hierophant_club"))) {
		if ((H = this.target).friendly_fire_check) {
			this.button_icon_state = "vortex_ff_off";
			this.name = "Toggle Friendly Fire [OFF]";
		} else {
			this.button_icon_state = "vortex_ff_on";
			this.name = "Toggle Friendly Fire [ON]";
		}
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["status_only"] });

rt.type(192, "/datum/action/item_action/vortex_recall", "/datum/action/item_action", {
	name: "Vortex Recall",
	desc: "Recall yourself, and anyone nearby, to an attuned hierophant beacon at any time.<br>If the beacon is still attached, will detach it.",
	button_icon_state: "vortex_recall",
});

// action.dm:236
rt.def("/datum/action/item_action/vortex_recall/proc/IsAvailable", function IsAvailable(f: Frame) {
	let H: Value = null;
	if (rt.istype(this.target, T("/obj/item/weapon/hierophant_club"))) {
		if ((H = this.target).teleporting) {
			return 0;
		}
	}
	return parent_proc();
});

rt.type(193, "/datum/action/item_action/clock", "/datum/action/item_action", {
	background_icon_state: "bg_clock",
	buttontooltipstyle: "clockcult",
});

// action.dm:247
rt.def("/datum/action/item_action/clock/proc/IsAvailable", function IsAvailable(f: Frame) {
	if (!is_servant_of_ratvar(this.owner)) {
		return 0;
	}
	return parent_proc();
});

rt.type(194, "/datum/action/item_action/clock/toggle_visor", "/datum/action/item_action/clock", {
	name: "Create Judicial Marker",
	desc: "Allows you to create a stunning Judicial Marker at any location in view. Click again to disable.",
});

// action.dm:256
rt.def("/datum/action/item_action/clock/toggle_visor/proc/IsAvailable", function IsAvailable(f: Frame) {
	let V: Value = null;
	if (!is_servant_of_ratvar(this.owner)) {
		return 0;
	}
	if (rt.istype(this.target, T("/obj/item/clothing/glasses/judicial_visor"))) {
		if ((V = this.target).recharging) {
			return 0;
		}
	}
	return parent_proc();
});

rt.type(199, "/datum/action/item_action/toggle", "/datum/action/item_action", {});

// action.dm:283
rt.def("/datum/action/item_action/toggle/proc/New", function* New(f: Frame, Target: Value) {
	yield* parent_proc();
	this.name = `Toggle ${this.target.name}`;
	this.button.name = this.name;
	return f.dot;
}, true);

rt.type(203, "/datum/action/item_action/adjust", "/datum/action/item_action", {});

// action.dm:299
rt.def("/datum/action/item_action/adjust/proc/New", function* New(f: Frame, Target: Value) {
	yield* parent_proc();
	this.name = `Adjust ${this.target.name}`;
	this.button.name = this.name;
	return f.dot;
}, true);

rt.type(209, "/datum/action/item_action/jetpack_stabilization", "/datum/action/item_action", {
	name: "Toggle Jetpack Stabilization",
});

// action.dm:322
rt.def("/datum/action/item_action/jetpack_stabilization/proc/IsAvailable", function IsAvailable(f: Frame) {
	let J: Value = null;
	if (!rt.istype((J = this.target), T("/obj/item/weapon/tank/jetpack")) || !J.on) {
		return 0;
	}
	return parent_proc();
});

rt.type(215, "/datum/action/item_action/toggle_research_scanner", "/datum/action/item_action", {
	active: 0,
	name: "Toggle Research Scanner",
	button_icon_state: "scan_mode",
});

// action.dm:346
rt.def("/datum/action/item_action/toggle_research_scanner/proc/Trigger", function Trigger(f: Frame) {
	let $2: any;
	if (!this.IsAvailable()) return f.dot;
	this.active = (!this.active ? 1 : 0);
	if (this.active) {
		this.owner.research_scanner++;
	} else {
		this.owner.research_scanner--;
	}
	let $0: any = this.owner;
	let $1: any = this.target;
	if (this.active) {

		$2 = "activated";
	} else {
		$2 = "deactivated";
	}
	to_chat($0, `<span class='notice'>${$1} research scanner has been ${$2}.</span>`);
	return 1;
});

// action.dm:356
rt.def("/datum/action/item_action/toggle_research_scanner/proc/Remove", function* Remove(f: Frame, M: Value) {
	if (this.owner && this.active) {
		this.owner.research_scanner--;
		this.active = 0;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(226, "/datum/action/item_action/organ_action", "/datum/action/item_action", {
	check_flags: 8,
});

// action.dm:418
rt.def("/datum/action/item_action/organ_action/proc/IsAvailable", function IsAvailable(f: Frame) {
	let I: Value = null;
	if (!(I = this.target).owner) {
		return 0;
	}
	return parent_proc();
});

rt.type(227, "/datum/action/item_action/organ_action/toggle", "/datum/action/item_action/organ_action", {});

// action.dm:424
rt.def("/datum/action/item_action/organ_action/toggle/proc/New", function* New(f: Frame, Target: Value) {
	yield* parent_proc();
	this.name = `Toggle ${this.target.name}`;
	this.button.name = this.name;
	return f.dot;
}, true);

rt.type(228, "/datum/action/item_action/organ_action/use", "/datum/action/item_action/organ_action", {});

// action.dm:429
rt.def("/datum/action/item_action/organ_action/use/proc/New", function* New(f: Frame, Target: Value) {
	yield* parent_proc();
	this.name = `Use ${this.target.name}`;
	this.button.name = this.name;
	return f.dot;
}, true);

rt.type(252, "/datum/action/spell_action", "/datum/action", {
	check_flags: 0,
	background_icon_state: "bg_spell",
});

// action.dm:442
rt.def("/datum/action/spell_action/proc/New", function* New(f: Frame, Target: Value) {
	let S: Value = null;
	yield* parent_proc();
	(S = this.target).action = this;
	this.name = S.name;
	this.button_icon = S.action_icon;
	this.button_icon_state = S.action_icon_state;
	this.background_icon_state = S.action_background_icon_state;
	this.button.name = this.name;
	return f.dot;
}, true);

// action.dm:452
rt.def("/datum/action/spell_action/proc/Destroy", function* Destroy(f: Frame) {
	let S: Value = null;
	(S = this.target).action = null;
	return (yield* parent_proc());
}, true);

// action.dm:457
rt.def("/datum/action/spell_action/proc/Trigger", function* Trigger(f: Frame) {
	let spell: Value = null;
	if (!(yield* parent_proc())) {
		return 0;
	}
	if (!this.target) return f.dot;
	yield* (spell = this.target).Click();
	return 1;
}, true);

// action.dm:465
rt.def("/datum/action/spell_action/proc/IsAvailable", function IsAvailable(f: Frame) {
	if (!this.target) {
		return 0;
	}
	let spell: Value = this.target;
	if (this.owner) {
		return spell.can_cast(this.owner);
	}
	return 0;
});

rt.type(253, "/datum/action/spell_action/alien", "/datum/action/spell_action", {});

// action.dm:476
rt.def("/datum/action/spell_action/alien/proc/IsAvailable", function IsAvailable(f: Frame) {
	if (!this.target) {
		return 0;
	}
	let ab: Value = this.target;
	if (this.owner) {
		return ab.cost_check(ab.check_turf, this.owner, 1);
	}
	return 0;
});

rt.type(83, "/datum/action/innate", "/datum/action", {
	active: 0,
	check_flags: 0,
});

// action.dm:491
rt.def("/datum/action/innate/proc/Trigger", function* Trigger(f: Frame) {
	if (!(yield* parent_proc())) {
		return 0;
	}
	if (!this.active) {
		yield* this.Activate();
	} else {
		yield* this.Deactivate();
	}
	return 1;
}, true);

rt.type(254, "/datum/action/generic", "/datum/action", {
	procname: null,
	check_flags: 0,
});

// action.dm:511
rt.def("/datum/action/generic/proc/Trigger", function* Trigger(f: Frame) {
	if (!(yield* parent_proc())) {
		return 0;
	}
	if (this.target && this.procname) {
		yield* g.callDyn(f, this.target, this.procname, [f.usr]);
	}
	return 1;
}, true);

rt.type(257, "/datum/action/language_menu", "/datum/action", {
	name: "Language Menu",
	desc: "Open the language menu to review your languages, their keys, and select your default language.",
	button_icon_state: "language_menu",
	check_flags: 0,
});

// action.dm:536
rt.def("/datum/action/language_menu/proc/Trigger", function* Trigger(f: Frame) {
	let H: Value = null;
	if (!(yield* parent_proc())) {
		return 0;
	}
	if (!ismob(this.owner)) return f.dot;
	let M: Value = this.owner;
	yield* (H = (yield* M.get_language_holder())).open_language_menu(f.usr);
	return f.dot;
}, true);
