// Based on /tg/station's code/modules/vehicles/scooter.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(13065, "/obj/vehicle/scooter", "/obj/vehicle", {
	name: "scooter",
	desc: "A fun way to get around.",
	icon_state: "scooter",
});

// scooter.dm:7
rt.def("/obj/vehicle/scooter/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let H: Value = null;
	if (!rt.istype(I, T("/obj/item/weapon/wrench"))) return f.dot;
	to_chat(user, "<span class='notice'>You begin to remove the handlebars...</span>");
	playsound(rt.getStep(f, user, 0), rt.rsc("sound/items/ratchet.ogg"), 50, 1);
	if (!(yield* do_after(user, 40 * I.toolspeed, { target: this }))) return f.dot;
	let S: Value = (yield* new_(T("/obj/vehicle/scooter/skateboard"), rt.getStep(f, this, 0)));
	yield* new_(T("/obj/item/stack/rods"), rt.getStep(f, this, 0), 2);
	to_chat(user, `<span class='notice'>You remove the handlebars from ${this}.</span>`);
	if (this.has_buckled_mobs()) {
		yield* this.unbuckle_mob((H = rt.index(this.buckled_mobs, 1)));
		yield* S.buckle_mob(H);
	}
	yield* qdel(this);
	return f.dot;
}, true);

// scooter.dm:22
rt.def("/obj/vehicle/scooter/proc/buckle_mob", function* buckle_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	this.riding_datum = (yield* new_(T("/datum/riding/scooter")));
	if (!rt.istype(f.args[0], T("/mob/living"))) {
		return 0;
	}
	if (f.args[0].get_num_legs() < 2 && f.args[0].get_num_arms() <= 0) {
		to_chat(f.args[0], fmt("<span class='warning'>Your limbless body can't ride ％！.</span>", [this]));
		return 0;
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["M", "force", "check_loc"] });

// scooter.dm:31
rt.def("/obj/vehicle/scooter/proc/post_buckle_mob", function post_buckle_mob(f: Frame, M: Value) {
	this.riding_datum.account_limbs(M);
	return f.dot;
});

rt.type(13066, "/obj/vehicle/scooter/skateboard", "/obj/vehicle/scooter", {
	name: "skateboard",
	desc: "An unfinished scooter which can only barely be called a skateboard. It's still rideable, but probably unsafe. Looks like you'll need to add a few rods to make handlebars.",
	icon_state: "skateboard",
	density: 0,
});

// scooter.dm:41
rt.def("/obj/vehicle/scooter/skateboard/proc/buckle_mob", function* buckle_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	f.dot = (yield* parent_proc());
	this.riding_datum = (yield* new_(T("/datum/riding/scooter/skateboard")));
	return f.dot;
}, true, { args: ["M", "force", "check_loc"] });

// scooter.dm:45
rt.def("/obj/vehicle/scooter/skateboard/proc/post_buckle_mob", function post_buckle_mob(f: Frame, M: Value) {
	if (this.has_buckled_mobs()) {
		this.density = 1;
	} else {
		this.density = 0;
	}
	parent_proc();
	return f.dot;
}, false);

// scooter.dm:52
rt.def("/obj/vehicle/scooter/skateboard/proc/Bump", function* Bump(f: Frame, A: Value) {
	yield* parent_proc();
	if (!(A.density && this.has_buckled_mobs())) return f.dot;
	let H: Value = rt.index(this.buckled_mobs, 1);
	let throw_target: Value = get_edge_target_turf(H, pick(GLOB.cardinal));
	yield* this.unbuckle_mob(H);
	yield* H.throw_at(throw_target, 4, 3);
	yield* H.Knockdown(100);
	yield* H.adjustStaminaLoss(40);
	this.visible_message(`<span class='danger'>${this} crashes into ${A}, sending ${H} flying!</span>`);
	playsound(this, rt.rsc("sound/effects/bang.ogg"), 50, 1);
	return f.dot;
}, true);

// scooter.dm:64
rt.def("/obj/vehicle/scooter/skateboard/proc/MouseDrop", function* MouseDrop(f: Frame, over_object: Value) {
	let M: Value = null;
	if (!rt.istype((M = f.usr), T("/mob/living/carbon")) || M.incapacitated() || !this.Adjacent(M)) {
		return f.dot;
	}
	if (this.has_buckled_mobs() && over_object == M) {
		to_chat(M, "<span class='warning'>You can't lift this up when somebody's on it.</span>");
		return f.dot;
	}
	if (over_object != M) return f.dot;
	let board: Value = (yield* new_(T("/obj/item/weapon/melee/skateboard")));
	yield* M.put_in_hands(board);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(10206, "/obj/item/scooter_frame", "/obj/item", {
	w_class: 3,
	name: "scooter frame",
	desc: "A metal frame for building a scooter. Looks like you'll need to add some metal to make wheels.",
	icon: rt.rsc("icons/obj/vehicles.dmi"),
	icon_state: "scooter_frame",
});

// scooter.dm:84
rt.def("/obj/item/scooter_frame/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let M: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/wrench"))) {
		to_chat(user, `<span class='notice'>You deconstruct ${this}.</span>`);
		yield* new_(T("/obj/item/stack/rods"), rt.getStep(f, this, 0), 10);
		playsound(rt.getStep(f, user, 0), rt.rsc("sound/items/ratchet.ogg"), 50, 1);
		yield* qdel(this);
		return f.dot;
	} else {
		if (!rt.istype(I, T("/obj/item/stack/sheet/metal"))) return f.dot;
		if ((M = I).get_amount() < 5) {
			to_chat(user, "<span class='warning'>You need at least five metal sheets to make proper wheels!</span>");
			return f.dot;
		}
		to_chat(user, `<span class='notice'>You begin to add wheels to ${this}.</span>`);
		if (!(yield* do_after(user, 80, { target: this }))) return f.dot;
		if (!M || M.get_amount() < 5) {
			return f.dot;
		}
		yield* M.use(5);
		to_chat(user, `<span class='notice'>You finish making wheels for ${this}.</span>`);
		yield* new_(T("/obj/vehicle/scooter/skateboard"), user.loc);
		yield* qdel(this);
	}
	return f.dot;
}, true);

// scooter.dm:106
rt.def("/obj/vehicle/scooter/skateboard/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let H: Value = null, C: Value = null, S: Value = null, H_2: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/screwdriver"))) {
		to_chat(user, `<span class='notice'>You begin to deconstruct and remove the wheels on ${this}...</span>`);
		playsound(rt.getStep(f, user, 0), I.usesound, 50, 1);
		if (yield* do_after(user, 20, { target: this })) {
			to_chat(user, `<span class='notice'>You deconstruct the wheels on ${this}.</span>`);
			yield* new_(T("/obj/item/stack/sheet/metal"), rt.getStep(f, this, 0), 5);
			yield* new_(T("/obj/item/scooter_frame"), rt.getStep(f, this, 0));
			if (this.has_buckled_mobs()) {
				yield* this.unbuckle_mob((H = rt.index(this.buckled_mobs, 1)));
			}
			yield* qdel(this);
		}
	} else {
		if (!rt.istype(I, T("/obj/item/stack/rods"))) return f.dot;
		if ((C = I).get_amount() < 2) {
			to_chat(user, "<span class='warning'>You need at least two rods to make proper handlebars!</span>");
			return f.dot;
		}
		to_chat(user, `<span class='notice'>You begin making handlebars for ${this}.</span>`);
		if (!(yield* do_after(user, 25, { target: this }))) return f.dot;
		if (!C || C.get_amount() < 2) {
			return f.dot;
		}
		to_chat(user, `<span class='notice'>You add the rods to ${this}, creating handlebars.</span>`);
		yield* C.use(2);
		S = (yield* new_(T("/obj/vehicle/scooter"), rt.getStep(f, this, 0)));
		if (this.has_buckled_mobs()) {
			yield* this.unbuckle_mob((H_2 = rt.index(this.buckled_mobs, 1)));
			yield* S.buckle_mob(H_2);
		}
		yield* qdel(this);
	}
	return f.dot;
}, true);
