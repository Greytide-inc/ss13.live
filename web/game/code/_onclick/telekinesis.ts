// Based on /tg/station's code/_onclick/telekinesis.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// telekinesis.dm:14
rt.def("/atom/proc/attack_tk", function* attack_tk(f: Frame, user: Value) {
	if (user.stat || !tkMaxRangeCheck(user, this)) {
		return f.dot;
	}
	yield* new_(T("/obj/effect/temp_visual/telekinesis"), this.loc);
	yield* user.UnarmedAttack(this, 0);
	return f.dot;
}, true);

// telekinesis.dm:21
rt.def("/obj/proc/attack_tk", function* attack_tk(f: Frame, user: Value) {
	if (user.stat) {
		return f.dot;
	}
	if (this.anchored) {
		return (yield* parent_proc());
	}
	yield* this.attack_tk_grab(user);
	return f.dot;
}, true);

// telekinesis.dm:28
rt.def("/obj/item/proc/attack_tk", function* attack_tk(f: Frame, user: Value) {
	if (user.stat) {
		return f.dot;
	}
	yield* this.attack_tk_grab(user);
	return f.dot;
}, true);

// telekinesis.dm:33
rt.def("/obj/proc/attack_tk_grab", function* attack_tk_grab(f: Frame, user: Value) {
	let O: Value = null;
	(O = (yield* new_(T("/obj/item/tk_grab"), this))).tk_user = user;
	if (!(yield* O.focus_object(this))) return f.dot;
	yield* user.put_in_active_hand(O);
	return f.dot;
}, true);

// telekinesis.dm:53
rt.def("/obj/item/proc/attack_self_tk", function* attack_self_tk(f: Frame, user: Value) {
	yield* this.attack_self(user);
	return f.dot;
}, true);

rt.type(7650, "/obj/item/tk_grab", "/obj/item", {
	focus: null,
	tk_user: null,
	flags: 16516,
	name: "Telekinetic Grab",
	desc: "Magic",
	icon: rt.rsc("icons/obj/magic.dmi"),
	icon_state: "2",
	w_class: 6,
	layer: 20,
	plane: 20,
});

// telekinesis.dm:79
rt.def("/obj/item/tk_grab/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSfastprocess.processing += this;
	return f.dot;
}, true);

// telekinesis.dm:83
rt.def("/obj/item/tk_grab/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSfastprocess.processing -= this;
	return (yield* parent_proc());
}, true);

// telekinesis.dm:87
rt.def("/obj/item/tk_grab/proc/process", function* process(f: Frame) {
	if (!(yield* this.check_if_focusable(this.focus))) return f.dot;
	yield* this.update_icon();
	return f.dot;
}, true, { waitfor: false });

// telekinesis.dm:91
rt.def("/obj/item/tk_grab/proc/dropped", function* dropped(f: Frame, user: Value) {
	if (this.focus && user && this.loc != user && this.loc != user.loc) {
		if (this.focus.Adjacent(this.loc)) {
			this.focus.loc = this.loc;
		}
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// telekinesis.dm:98
rt.def("/obj/item/tk_grab/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	if (slot == slot_hands) {
		return f.dot;
	}
	yield* qdel(this);
	return f.dot;
}, true);

// telekinesis.dm:107
rt.def("/obj/item/tk_grab/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (!this.focus) {
		return f.dot;
	}
	if (!this.focus || this.focus.gc_destroyed) {
		yield* qdel(this);
		return f.dot;
	}
	yield* this.focus.attack_self_tk(user);
	yield* this.update_icon();
	return f.dot;
}, true);

// telekinesis.dm:116
rt.def("/obj/item/tk_grab/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value, params: Value) {
	let I: Value = null;
	if (!target || !user) {
		return f.dot;
	}
	if (!this.focus) {
		yield* this.focus_object(target);
		return f.dot;
	} else if (!(yield* this.check_if_focusable(this.focus))) {
		return f.dot;
	}
	if (target == this.focus) {
		yield* target.attack_self_tk(user);
		yield* this.update_icon();
		return f.dot;
	}
	if (!isturf(target) && rt.istype(this.focus, T("/obj/item")) && target.Adjacent(this.focus)) {
		yield* this.apply_focus_overlay();
		yield* (I = this.focus).melee_attack_chain(this.tk_user, target, params);
		if (yield* this.check_if_focusable(this.focus)) {
			yield* this.focus.do_attack_animation(target, null, this.focus);
		}
	} else {
		yield* this.apply_focus_overlay();
		yield* this.focus.throw_at(target, 10, 1, user);
	}
	user.changeNext_move(8);
	yield* this.update_icon();
	return f.dot;
}, true);

// telekinesis.dm:144
rt.def("/proc/tkMaxRangeCheck", function tkMaxRangeCheck(f: Frame, user: Value, target: Value) {
	let d: Value = null;
	if ((d = get_dist(user, target)) > TK_MAXRANGE) {
		to_chat(user, "<span class ='warning'>Your mind won't reach that far.</span>");
		return f.dot;
	}
	return 1;
});

// telekinesis.dm:154
rt.def("/obj/item/tk_grab/proc/focus_object", function* focus_object(f: Frame, target: Value) {
	if (!(yield* this.check_if_focusable(target))) {
		return f.dot;
	}
	this.focus = target;
	yield* this.update_icon();
	yield* this.apply_focus_overlay();
	return 1;
}, true);

// telekinesis.dm:162
rt.def("/obj/item/tk_grab/proc/check_if_focusable", function* check_if_focusable(f: Frame, target: Value) {
	if (!this.tk_user || !rt.istype(this.tk_user, T("/mob/living/carbon")) || !target || target.gc_destroyed || !rt.istype(target, T("/obj")) || !this.tk_user.dna.check_mutation("Telekinesis")) {
		yield* qdel(this);
		return f.dot;
	}
	if (!tkMaxRangeCheck(this.tk_user, target) || target.anchored || !isturf(target.loc)) {
		yield* qdel(this);
		return f.dot;
	}
	return 1;
}, true);

// telekinesis.dm:171
rt.def("/obj/item/tk_grab/proc/apply_focus_overlay", function* apply_focus_overlay(f: Frame) {
	if (!this.focus) {
		return f.dot;
	}
	yield* new_(T("/obj/effect/temp_visual/telekinesis"), rt.getStep(f, this.focus, 0));
	return f.dot;
}, true);

// telekinesis.dm:176
rt.def("/obj/item/tk_grab/proc/update_icon", function update_icon(f: Frame) {
	this.cut_overlays();
	if (!this.focus) return f.dot;
	let old_layer: Value = this.focus.layer;
	let old_plane: Value = this.focus.plane;
	this.focus.layer = this.layer + 0.01;
	this.focus.plane = ABOVE_HUD_PLANE;
	this.add_overlay(this.focus);
	this.focus.layer = old_layer;
	this.focus.plane = old_plane;
	return f.dot;
});

// telekinesis.dm:187
rt.def("/obj/item/tk_grab/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is using ${user.p_their()} telekinesis to choke ${user.p_them()}self! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	return 8;
});
