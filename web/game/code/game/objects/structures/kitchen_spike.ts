// Based on /tg/station's code/game/objects/structures/kitchen_spike.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(12789, "/obj/structure/kitchenspike_frame", "/obj/structure", {
	anchored: 0,
	name: "meatspike frame",
	icon: rt.rsc("icons/obj/kitchen.dmi"),
	icon_state: "spikeframe",
	desc: "The frame of a meat spike.",
	density: 1,
	obj_integrity: 200,
	max_integrity: 200,
});

// kitchen_spike.dm:15
rt.def("/obj/structure/kitchenspike_frame/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let R: Value = null, F: Value = null, WT: Value = null;
	yield* this.add_fingerprint(user);
	if (yield* this.default_unfasten_wrench(user, I)) {
		return f.dot;
	} else if (rt.istype(I, T("/obj/item/stack/rods"))) {
		if ((R = I).get_amount() >= 4) {
			yield* R.use(4);
			to_chat(user, "<span class='notice'>You add spikes to the frame.</span>");
			this.transfer_fingerprints_to((F = (yield* new_(T("/obj/structure/kitchenspike"), this.loc))));
			yield* qdel(this);
		}
	} else if (rt.istype(I, T("/obj/item/weapon/weldingtool"))) {
		if (!(yield* (WT = I).remove_fuel(0, user))) {
			return f.dot;
		}
		to_chat(user, fmt("<span class='notice'>You begin cutting ％！ apart...</span>", [this]));
		playsound(this.loc, WT.usesound, 40, 1);
		if (yield* do_after(user, 40 * WT.toolspeed, 1, { target: this })) {
			if (!WT.isOn()) {
				return f.dot;
			}
			playsound(this.loc, WT.usesound, 50, 1);
			this.visible_message(fmt("<span class='notice'>＀ slices apart ％！.</span>", [user, this]), fmt("<span class='notice'>You cut ％！ apart with ％！.</span>", [this, WT]), "<span class='italics'>You hear welding.</span>");
			yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, 4);
			yield* qdel(this);
		}
		return f.dot;
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(12790, "/obj/structure/kitchenspike", "/obj/structure", {
	anchored: 1,
	buckle_lying: 0,
	can_buckle: 1,
	name: "meat spike",
	icon: rt.rsc("icons/obj/kitchen.dmi"),
	icon_state: "spike",
	desc: "A spike for collecting meat from animals",
	density: 1,
	obj_integrity: 250,
	max_integrity: 250,
});

// kitchen_spike.dm:59
rt.def("/obj/structure/kitchenspike/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(f.usr));
}, true);

// kitchen_spike.dm:63
rt.def("/obj/structure/kitchenspike/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/weapon/crowbar"))) {
		if (!this.has_buckled_mobs()) {
			playsound(this.loc, I.usesound, 100, 1);
			if (yield* do_after(user, 20 * I.toolspeed, { target: this })) {
				to_chat(user, "<span class='notice'>You pry the spikes out of the frame.</span>");
				yield* this.deconstruct(1);
			}
		} else {
			to_chat(user, "<span class='notice'>You can't do that while something's on the spike!</span>");
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// kitchen_spike.dm:75
rt.def("/obj/structure/kitchenspike/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let L: Value = null, m180: Value = null;
	if (rt.istype(user.pulling, T("/mob/living")) && !rt.istype(user.pulling, T("/mob/living/silicon")) && !rt.istype(user.pulling, T("/mob/living/simple_animal/bot")) && user.a_intent == "grab" && !this.has_buckled_mobs()) {
		L = user.pulling;
		if (yield* do_mob(user, this, 120)) {
			if (this.has_buckled_mobs()) {
				return f.dot;
			}
			if (L.buckled) {
				return f.dot;
			}
			if (user.pulling != L) {
				return f.dot;
			}
			playsound(this.loc, rt.rsc("sound/effects/splat.ogg"), 25, 1);
			L.visible_message(`<span class='danger'>${user} slams ${L} onto the meat spike!</span>`, `<span class='userdanger'>${user} slams you onto the meat spike!</span>`, "<span class='italics'>You hear a squishy wet noise.</span>");
			L.loc = this.loc;
			yield* L.emote("scream");
			yield* L.add_splatter_floor();
			yield* L.adjustBruteLoss(30);
			yield* L.setDir(2);
			yield* this.buckle_mob(L, { force: 1 });
			(m180 = matrix(L.transform)).Turn(180);
			rt.op(f, "Animate", [2, 6], [null, L, "transform", m180, "time", 3]);
			L.pixel_y = L.get_standard_pixel_y_offset(180);
		}
	} else if (this.has_buckled_mobs()) {
		L = null;
		for (L of each(this.buckled_mobs, T("/mob/living"))) {
			yield* this.user_unbuckle_mob(L, user);
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// kitchen_spike.dm:109
rt.def("/obj/structure/kitchenspike/proc/user_unbuckle_mob", function* user_unbuckle_mob(f: Frame, buckled_mob: Value, user: Value) {
	let M: Value = null, m180: Value = null;
	if (!buckled_mob) return f.dot;
	if ((M = buckled_mob) != user) {
		M.visible_message(`${user.name} tries to pull ${M.name} free of the ${this}!`, `<span class='notice'>${user.name} is trying to pull you off the ${this}, opening up fresh wounds!</span>`, "<span class='italics'>You hear a squishy wet noise.</span>");
		if (!(yield* do_after(user, 300, { target: this }))) {
			if (M && M.buckled) {
				M.visible_message(`${user.name} fails to free ${M.name}!`, `<span class='notice'>${user.name} fails to pull you off of the ${this}.</span>`);
			}
			return f.dot;
		}
	} else {
		M.visible_message(`<span class='warning'>${M.name} struggles to break free from the ${this}!</span>`, `<span class='notice'>You struggle to break free from the ${this}, exacerbating your wounds! (Stay still for two minutes.)</span>`, "<span class='italics'>You hear a wet squishing noise..</span>");
		yield* M.adjustBruteLoss(30);
		if (!(yield* do_after(M, 1200, { target: this }))) {
			if (M && M.buckled) {
				to_chat(M, "<span class='warning'>You fail to free yourself!</span>");
			}
			return f.dot;
		}
	}
	if (!M.buckled) {
		return f.dot;
	}
	(m180 = matrix(M.transform)).Turn(180);
	rt.op(f, "Animate", [2, 6], [null, M, "transform", m180, "time", 3]);
	M.pixel_y = M.get_standard_pixel_y_offset(180);
	yield* M.adjustBruteLoss(30);
	this.visible_message(`<span class='danger'>${M} falls free of the ${this}!</span>`);
	yield* this.unbuckle_mob(M, { force: 1 });
	yield* M.emote("scream");
	yield* M.AdjustKnockdown(20);
	return f.dot;
}, true);

// kitchen_spike.dm:146
rt.def("/obj/structure/kitchenspike/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let F: Value = null;
	disassembled ??= 1;
	if (disassembled) {
		this.transfer_fingerprints_to((F = (yield* new_(T("/obj/structure/kitchenspike_frame"), this.loc))));
	} else {
		yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, 4);
	}
	yield* new_(T("/obj/item/stack/rods"), this.loc, 4);
	yield* qdel(this);
	return f.dot;
}, true);
