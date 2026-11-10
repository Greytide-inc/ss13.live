// Based on /tg/station's code/modules/paperwork/paperplane.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(7624, "/obj/item/weapon/paperplane", "/obj/item/weapon", {
	internalPaper: null,
	throw_range: 7,
	throw_speed: 1,
	name: "paper plane",
	desc: "Paper, folded in the shape of a plane",
	icon: rt.rsc("icons/obj/bureaucracy.dmi"),
	icon_state: "paperplane",
	throwforce: 0,
	w_class: 1,
	resistance_flags: 4,
	obj_integrity: 50,
	max_integrity: 50,
});

// paperplane.dm:17
rt.def("/obj/item/weapon/paperplane/proc/Initialize", function* Initialize(f: Frame, mapload: Value, newPaper: Value) {
	f.dot = (yield* parent_proc());
	this.pixel_y = rand(-8, 8);
	this.pixel_x = rand(-9, 9);
	if (newPaper) {
		this.internalPaper = newPaper;
		this.flags = newPaper.flags;
		this.color = newPaper.color;
		yield* newPaper.forceMove(this);
	} else {
		this.internalPaper = (yield* new_(T("/obj/item/weapon/paper"), this));
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// paperplane.dm:31
rt.def("/obj/item/weapon/paperplane/proc/Destroy", function* Destroy(f: Frame) {
	if (this.internalPaper) {
		yield* qdel(this.internalPaper);
		this.internalPaper = null;
	}
	return (yield* parent_proc());
}, true);

// paperplane.dm:36
rt.def("/obj/item/weapon/paperplane/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	yield* user.Stun(200);
	user.visible_message(`<span class='suicide'>${user} jams the ${this} in ${user.p_their()} nose. It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	yield* user.adjust_blurriness(6);
	yield* user.adjust_eye_damage(rand(6, 8));
	yield* sleep(10);
	return 1;
}, true);

// paperplane.dm:44
rt.def("/obj/item/weapon/paperplane/proc/update_icon", function update_icon(f: Frame) {
	let stamped: Value = null, S: Value = null;
	this.cut_overlays();
	if (!(stamped = this.internalPaper.stamped)) return f.dot;
	for (S of each(stamped)) {
		this.add_overlay(`paperplane_${S}`);
	}
	return f.dot;
});

// paperplane.dm:51
rt.def("/obj/item/weapon/paperplane/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let internal_paper_tmp: Value = null;
	to_chat(user, `<span class='notice'>You unfold ${this}.</span>`);
	yield* (internal_paper_tmp = this.internalPaper).forceMove(this.loc);
	this.internalPaper = null;
	yield* qdel(this);
	yield* user.put_in_hands(internal_paper_tmp);
	return f.dot;
}, true);

// paperplane.dm:59
rt.def("/obj/item/weapon/paperplane/proc/attackby", function* attackby(f: Frame) {
	yield* parent_proc();
	if (rt.istype(f.args[0], T("/obj/item/weapon/pen")) || rt.istype(f.args[0], T("/obj/item/toy/crayon"))) {
		to_chat(f.args[1], `<span class='notice'>You should unfold ${this} before changing it.</span>`);
		return f.dot;
	} else if (rt.istype(f.args[0], T("/obj/item/weapon/stamp"))) {
		yield* this.internalPaper.attackby(f.args[0], f.args[1]);
		yield* this.update_icon();
	} else if (f.args[0].is_hot()) {
		if (rt.bitAnd(f.args[1].disabilities, 256) && prob(10)) {
			f.args[1].visible_message(`<span class='warning'>${f.args[1]} accidentally ignites themselves!</span>`, `<span class='userdanger'>You miss the ${this} and accidentally light yourself on fire!</span>`);
			yield* f.args[1].dropItemToGround(f.args[0]);
			yield* f.args[1].adjust_fire_stacks(1);
			yield* f.args[1].IgniteMob();
			return f.dot;
		}
		if (!(get_dist(f.args[1], this) <= 1)) {
			return f.dot;
		}
		yield* f.args[1].dropItemToGround(this);
		f.args[1].visible_message(`<span class='danger'>${f.args[1]} lights ${this} ablaze with ${f.args[0]}!</span>`, `<span class='danger'>You light ${this} on fire!</span>`);
		yield* this.fire_act();
	}
	yield* this.add_fingerprint(f.args[1]);
	return f.dot;
}, true, { args: ["P", "user", "params"] });

// paperplane.dm:87
rt.def("/obj/item/weapon/paperplane/proc/throw_at", function* throw_at(f: Frame, target: Value, range: Value, speed: Value, thrower: Value, spin: Value, diagonals_first: Value, callback: Value) {
	spin ??= 0;
	diagonals_first ??= 0;
	f.dot = (yield* parent_proc(target, range, speed, thrower, 0, diagonals_first, callback));
	return f.dot;
}, true);

// paperplane.dm:90
rt.def("/obj/item/weapon/paperplane/proc/throw_impact", function* throw_impact(f: Frame, hit_atom: Value) {
	if ((yield* parent_proc()) || !rt.istype(hit_atom, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	let H: Value = hit_atom;
	if (!prob(2)) return f.dot;
	if (H.head && rt.bitAnd(H.head.flags_cover, HEADCOVERSEYES) || H.wear_mask && rt.bitAnd(H.wear_mask.flags_cover, MASKCOVERSEYES) || H.glasses && rt.bitAnd(H.glasses.flags_cover, GLASSESCOVERSEYES)) {
		return f.dot;
	}
	this.visible_message(fmt("<span class='danger'>＄！ hits ＀ in the eye!</span>", [this, H]));
	yield* H.adjust_blurriness(6);
	yield* H.adjust_eye_damage(rand(6, 8));
	yield* H.Knockdown(40);
	yield* H.emote("scream");
	return f.dot;
}, true, { waitfor: false });

// paperplane.dm:103
rt.def("/obj/item/weapon/paper/proc/AltClick", function* AltClick(f: Frame, user: Value, I: Value) {
	if (rt.istype(user, T("/mob/living/carbon"))) {
		if (!(get_dist(this, user) <= 1) || user.stat || user.restrained()) {
			return f.dot;
		}
		to_chat(user, `<span class='notice'>You fold ${this} into the shape of a plane!</span>`);
		yield* user.temporarilyRemoveItemFromInventory(this);
		I = (yield* new_(T("/obj/item/weapon/paperplane"), user, this));
		yield* user.put_in_hands(I);
	} else {
		to_chat(user, fmt("<span class='notice'> You lack the dexterity to fold ％！. </span>", [this]));
	}
	return f.dot;
}, true);
