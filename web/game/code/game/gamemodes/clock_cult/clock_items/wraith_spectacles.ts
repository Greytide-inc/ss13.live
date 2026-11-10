// Based on /tg/station's code/game/gamemodes/clock_cult/clock_items/wraith_spectacles.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(8207, "/obj/item/clothing/glasses/wraith_spectacles", "/obj/item/clothing/glasses", {
	name: "antique spectacles",
	desc: "Unnerving glasses with opaque yellow lenses.",
	icon: rt.rsc("icons/obj/clothing/clockwork_garb.dmi"),
	icon_state: "wraith_specs",
	item_state: "glasses",
	actions_types: null,
	resistance_flags: 34,
	flags_cover: 1,
	visor_flags_inv: 64,
	visor_vars_to_toggle: 0,
	tint: 3,
});

// wraith_spectacles.dm:8
rt.def("/obj/item/clothing/glasses/wraith_spectacles/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/toggle"));
	return f.dot;
});

// wraith_spectacles.dm:16
rt.def("/obj/item/clothing/glasses/wraith_spectacles/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	GLOB.all_clockwork_objects += this;
	return f.dot;
}, true);

// wraith_spectacles.dm:20
rt.def("/obj/item/clothing/glasses/wraith_spectacles/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.all_clockwork_objects -= this;
	return (yield* parent_proc());
}, true);

// wraith_spectacles.dm:24
rt.def("/obj/item/clothing/glasses/wraith_spectacles/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* this.weldingvisortoggle(user);
	return f.dot;
}, true);

// wraith_spectacles.dm:27
rt.def("/obj/item/clothing/glasses/wraith_spectacles/proc/visor_toggling", function* visor_toggling(f: Frame) {
	yield* parent_proc();
	yield* this.set_vision_vars(0);
	return f.dot;
}, true);

// wraith_spectacles.dm:31
rt.def("/obj/item/clothing/glasses/wraith_spectacles/proc/weldingvisortoggle", function* weldingvisortoggle(f: Frame, user: Value) {
	let WS: Value = null;
	let $0: any, $1: any;
	f.dot = (yield* parent_proc());
	if (!rt.istype(this.loc, T("/mob/living/carbon/human"))) return f.dot;
	let H: Value = this.loc;
	if (!(this == H.glasses && !this.up)) return f.dot;
	if (rt.bitAnd(H.disabilities, 1)) {
		to_chat(H, "<span class='heavy_brass'>\"You're blind, idiot. Stop embarrassing yourself.\"</span>");
		return f.dot;
	}
	if (yield* this.blind_cultist(H)) {
		return f.dot;
	}
	if (is_servant_of_ratvar(H)) {
		$0 = H;
		if (GLOB.ratvar_awakens) {
			$1 = "";
		} else {
			$1 = " Your eyes begin to itch - you cannot do this for long.";
		}
		to_chat($0, `<span class='heavy_brass'>You push the spectacles down, and all is revealed to you.${$1}</span>`);
		if (WS = H.has_status_effect(T("/datum/status_effect/wraith_spectacles"))) {
			yield* WS.apply_eye_damage(H);
		}
		yield* H.apply_status_effect(T("/datum/status_effect/wraith_spectacles"));
	} else {
		to_chat(H, "<span class='heavy_brass'>You push the spectacles down, but you can't see through the glass.</span>");
	}
	return f.dot;
}, true);

// wraith_spectacles.dm:50
rt.def("/obj/item/clothing/glasses/wraith_spectacles/proc/blind_cultist", function* blind_cultist(f: Frame, victim: Value) {
	if (!iscultist(victim)) return f.dot;
	to_chat(victim, "<span class='heavy_brass'>\"It looks like Nar-Sie's dogs really don't value their eyes.\"</span>");
	to_chat(victim, "<span class='userdanger'>Your eyes explode with horrific pain!</span>");
	yield* victim.emote("scream");
	yield* victim.become_blind();
	yield* victim.adjust_blurriness(30);
	yield* victim.adjust_blindness(30);
	return 1;
}, true);

// wraith_spectacles.dm:64
rt.def("/obj/item/clothing/glasses/wraith_spectacles/proc/set_vision_vars", function* set_vision_vars(f: Frame, update_vision: Value) {
	let C: Value = null;
	this.lighting_alpha = null;
	this.tint = 0;
	this.vision_flags = 0;
	this.darkness_view = 2;
	if (!this.up) {
		if (is_servant_of_ratvar(this.loc)) {
			this.lighting_alpha = LIGHTING_PLANE_ALPHA_MOSTLY_INVISIBLE;
			this.vision_flags = 28;
			this.darkness_view = 3;
		} else {
			this.tint = 3;
		}
	}
	if (!(update_vision && rt.istype(this.loc, T("/mob/living/carbon")))) return f.dot;
	yield* (C = this.loc).head_update(this, { forced: 1 });
	return f.dot;
}, true);

// wraith_spectacles.dm:76
rt.def("/obj/item/clothing/glasses/wraith_spectacles/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	let WS: Value = null;
	let $0: any, $1: any;
	yield* parent_proc();
	if (slot != slot_glasses || this.up) {
		return f.dot;
	}
	if (rt.bitAnd(user.disabilities, 1)) {
		to_chat(user, "<span class='heavy_brass'>\"You're blind, idiot. Stop embarrassing yourself.\"</span>");
		return f.dot;
	}
	if (yield* this.blind_cultist(user)) {
		return f.dot;
	}
	yield* this.set_vision_vars(1);
	if (is_servant_of_ratvar(user)) {
		$0 = user;
		if (GLOB.ratvar_awakens) {
			$1 = "";
		} else {
			$1 = " Your eyes begin to itch - you cannot do this for long.";
		}
		to_chat($0, `<span class='heavy_brass'>As you put on the spectacles, all is revealed to you.${$1}</span>`);
		if (WS = user.has_status_effect(T("/datum/status_effect/wraith_spectacles"))) {
			yield* WS.apply_eye_damage(user);
		}
		yield* user.apply_status_effect(T("/datum/status_effect/wraith_spectacles"));
	} else {
		to_chat(user, "<span class='heavy_brass'>You put on the spectacles, but you can't see through the glass.</span>");
	}
	return f.dot;
}, true);

rt.type(11080, "/obj/screen/alert/status_effect/wraith_spectacles", "/obj/screen/alert/status_effect", {
	alerttooltipstyle: "clockcult",
	name: "Wraith Spectacles",
	desc: "You shouldn't actually see this, as it should be procedurally generated.",
	icon_state: "wraithspecs",
});

// wraith_spectacles.dm:111
rt.def("/obj/screen/alert/status_effect/wraith_spectacles/proc/MouseEntered", function MouseEntered(f: Frame, location: Value, control: Value, params: Value) {
	let L: Value = null, W: Value = null, glasses_right: Value = null, WS: Value = null;
	let $0: any, $1: any, $2: any;
	if (rt.istype((L = f.usr), T("/mob/living/carbon/human"))) {
		W = this.attached_effect;
		glasses_right = (rt.istype(L.glasses, T("/obj/item/clothing/glasses/wraith_spectacles")) ? 1 : 0);
		WS = L.glasses;
		if (glasses_right && !WS.up) {
			$0 = "<font color=#DAAA18><b>";
		} else {
			$0 = "";
		}
		if (glasses_right) {
			$1 = "";
		} else {
			$1 = "not ";
		}
		if (glasses_right && !WS.up) {
			$2 = "!</b></font>";
		} else {
			$2 = ".";
		}
		this.desc = `${$0}You are ${$1}wearing wraith spectacles${$2}<br>You have taken <font color=#DAAA18><b>${W.eye_damage_done}</b></font> eye damage from them.<br>`;
		if (rt.bitAnd(L.disabilities, 8)) {
			this.desc += "<font color=#DAAA18><b>You are nearsighted!</b></font><br>";
		} else if (glasses_right && !WS.up) {
			this.desc += `You will become nearsighted at <font color=#DAAA18><b>${W.nearsight_breakpoint}</b></font> eye damage.<br>`;
		}
		if (rt.bitAnd(L.disabilities, 1)) {
			this.desc += "<font color=#DAAA18><b>You are blind!</b></font>";
		} else if (glasses_right && !WS.up) {
			this.desc += `You will become blind at <font color=#DAAA18><b>${W.blind_breakpoint}</b></font> eye damage.`;
		}
	}
	parent_proc();
	return f.dot;
}, false);

rt.type(943, "/datum/status_effect/wraith_spectacles", "/datum/status_effect", {
	eye_damage_done: 0,
	nearsight_breakpoint: 30,
	blind_breakpoint: 45,
	id: "wraith_spectacles",
	duration: -1,
	tick_interval: 20,
	alert_type: rt.typePath("/obj/screen/alert/status_effect/wraith_spectacles"),
});

// wraith_spectacles.dm:129
rt.def("/datum/status_effect/wraith_spectacles/proc/on_apply", function* on_apply(f: Frame) {
	let H: Value = null;
	if (!rt.istype(this.owner, T("/mob/living/carbon/human"))) return f.dot;
	yield* this.apply_eye_damage((H = this.owner));
	return (yield* parent_proc());
}, true);

// wraith_spectacles.dm:135
rt.def("/datum/status_effect/wraith_spectacles/proc/tick", function* tick(f: Frame) {
	if (!rt.istype(this.owner, T("/mob/living/carbon/human"))) {
		yield* qdel(this);
		return f.dot;
	}
	let H: Value = this.owner;
	let glasses_right: Value = (rt.istype(H.glasses, T("/obj/item/clothing/glasses/wraith_spectacles")) ? 1 : 0);
	let WS: Value = H.glasses;
	if (glasses_right && !WS.up && !GLOB.ratvar_awakens) {
		yield* this.apply_eye_damage(H);
	} else {
		if (GLOB.ratvar_awakens) {
			yield* H.cure_nearsighted();
			yield* H.cure_blind();
			yield* H.adjust_eye_damage(-this.eye_damage_done);
			this.eye_damage_done = 0;
		} else if (prob(50) && this.eye_damage_done) {
			yield* H.adjust_eye_damage(-1);
			this.eye_damage_done--;
		}
		if (this.eye_damage_done) return f.dot;
		yield* qdel(this);
	}
	return f.dot;
}, true);

// wraith_spectacles.dm:156
rt.def("/datum/status_effect/wraith_spectacles/proc/apply_eye_damage", function* apply_eye_damage(f: Frame, H: Value) {
	if (rt.bitAnd(H.disabilities, 1)) {
		return f.dot;
	}
	yield* H.adjust_eye_damage(1);
	this.eye_damage_done++;
	if (this.eye_damage_done >= 20) {
		yield* H.adjust_blurriness(2);
	}
	if (this.eye_damage_done >= this.nearsight_breakpoint) {
		if (yield* H.become_nearsighted()) {
			to_chat(H, "<span class='nzcrentr'>Your vision doubles, then trebles. Darkness begins to close in. You can't keep this up!</span>");
		}
	}
	if (this.eye_damage_done >= this.blind_breakpoint) {
		if (yield* H.become_blind()) {
			to_chat(H, "<span class='nzcrentr_large'>A piercing white light floods your vision. Suddenly, all goes dark!</span>");
		}
	}
	if (!prob(min(20, 5 + this.eye_damage_done))) return f.dot;
	to_chat(H, "<span class='nzcrentr_small'><i>Your eyes continue to burn.</i></span>");
	return f.dot;
}, true);
