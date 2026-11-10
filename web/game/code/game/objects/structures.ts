// Based on /tg/station's code/game/objects/structures.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12124, "/obj/structure", "/obj", {
	climb_time: 20,
	climb_stun: 20,
	climbable: 0,
	structureclimber: null,
	broken: 0,
	pressure_resistance: 8,
	icon: rt.rsc("icons/obj/structures.dmi"),
	obj_integrity: 300,
	max_integrity: 300,
});

// structures.dm:13
rt.def("/obj/structure/proc/Initialize", function Initialize(f: Frame) {
	if (!this.armor) {
		this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 50]);
	}
	f.dot = parent_proc();
	if (this.smooth) {
		queue_smooth(this);
		queue_smooth_neighbors(this);
		this.icon_state = "";
	}
	if (!GLOB.SSticker) return f.dot;
	GLOB.cameranet.updateVisibility(this);
	return f.dot;
});

// structures.dm:25
rt.def("/obj/structure/proc/Destroy", function* Destroy(f: Frame) {
	if (GLOB.SSticker) {
		GLOB.cameranet.updateVisibility(this);
	}
	if (this.smooth) {
		queue_smooth_neighbors(this);
	}
	return (yield* parent_proc());
}, true);

// structures.dm:31
rt.def("/obj/structure/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.dot = (yield* parent_proc());
	yield* this.add_fingerprint(user);
	if (this.structureclimber && this.structureclimber != user) {
		user.changeNext_move(8);
		yield* user.do_attack_animation(this);
		yield* this.structureclimber.Knockdown(40);
		this.structureclimber.visible_message(`<span class='warning'>${this.structureclimber.name} has been knocked off the ${this}`, `You're knocked off the ${this}!`, `You see ${this.structureclimber.name} get knocked off the ${this}</span>`);
	}
	yield* this.interact(user);
	return f.dot;
}, true);

// structures.dm:41
rt.def("/obj/structure/proc/interact", function* interact(f: Frame, user: Value) {
	yield* this.ui_interact(user);
	return f.dot;
}, true);

// structures.dm:44
rt.def("/obj/structure/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	yield* parent_proc();
	yield* this.add_fingerprint(f.usr);
	return f.dot;
}, true);

// structures.dm:48
rt.def("/obj/structure/proc/MouseDrop_T", function* MouseDrop_T(f: Frame, O: Value, user: Value) {
	f.dot = (yield* parent_proc());
	if (!this.climbable) {
		return f.dot;
	}
	if (user == O && rt.istype(O, T("/mob/living/carbon"))) {
		if (user.canmove) {
			yield* this.climb_structure(user);
			return f.dot;
		}
	}
	if (!rt.istype(O, T("/obj/item/weapon")) || user.get_active_held_item() != O) {
		return f.dot;
	}
	if (rt.istype(user, T("/mob/living/silicon/robot"))) {
		return f.dot;
	}
	if (!(yield* user.drop_item())) {
		return f.dot;
	}
	if (O.loc != this.loc) {
		yield* step(O, rt.getDir(f, O, this));
	}
	return f.dot;
}, true);

// structures.dm:68
rt.def("/obj/structure/proc/do_climb", function* do_climb(f: Frame, A: Value) {
	if (!this.climbable) return f.dot;
	this.density = 0;
	f.dot = (yield* step(A, rt.getDir(f, A, this.loc)));
	this.density = 1;
	return f.dot;
}, true);

// structures.dm:72
rt.def("/obj/structure/proc/climb_structure", function* climb_structure(f: Frame, user: Value) {
	yield* this.add_fingerprint(user);
	user.visible_message(`<span class='warning'>${user} starts climbing onto ${this}.</span>`, `<span class='notice'>You start climbing onto ${this}...</span>`);
	let adjusted_climb_time: Value = this.climb_time;
	if (user.restrained()) {
		adjusted_climb_time *= 2;
	}
	if (rt.istype(user, T("/mob/living/carbon/alien"))) {
		adjusted_climb_time *= 0.25;
	}
	this.structureclimber = user;
	if (yield* do_mob(user, user, adjusted_climb_time)) {
		if (this.loc) {
			if (yield* this.do_climb(user)) {
				user.visible_message(`<span class='warning'>${user} climbs onto ${this}.</span>`, `<span class='notice'>You climb onto ${this}.</span>`);
				add_logs(user, this, "climbed onto");
				if (this.climb_stun) {
					yield* user.Stun(this.climb_stun);
				}
				f.dot = 1;
			} else {
				to_chat(user, `<span class='warning'>You fail to climb onto ${this}.</span>`);
			}
		}
	}
	this.structureclimber = null;
	return f.dot;
}, true);

// structures.dm:95
rt.def("/obj/structure/proc/examine", function examine(f: Frame, user: Value) {
	let examine_status: Value = null;
	parent_proc();
	if (rt.bitAnd(this.resistance_flags, INDESTRUCTIBLE)) return f.dot;
	if (rt.bitAnd(this.resistance_flags, 8)) {
		to_chat(user, "<span class='warning'>It's on fire!</span>");
	}
	if (this.broken) {
		to_chat(user, "<span class='notice'>It appears to be broken.</span>");
	}
	if (!(examine_status = this.examine_status(user))) return f.dot;
	to_chat(user, examine_status);
	return f.dot;
}, false);

// structures.dm:106
rt.def("/obj/structure/proc/examine_status", function examine_status(f: Frame, user: Value) {
	let healthpercent: Value = null;
	const subject = (healthpercent = this.obj_integrity / this.max_integrity * 100);
	if (rt.inRange(subject, 50, 99)) {
		return "It looks slightly damaged.";
	} else if (rt.inRange(subject, 25, 50)) {
		return "It appears heavily damaged.";
	} else if (rt.inRange(subject, 0, 25)) {
		if (this.broken) return f.dot;
		return "<span class='warning'>It's falling apart!</span>";
	}
	return f.dot;
});
