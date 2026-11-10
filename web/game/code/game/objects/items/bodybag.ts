// Based on /tg/station's code/game/objects/items/bodybag.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9655, "/obj/item/bodybag", "/obj/item", {
	unfoldedbag_path: rt.typePath("/obj/structure/closet/body_bag"),
	w_class: 2,
	name: "body bag",
	desc: "A folded bag designed for the storage and transportation of cadavers.",
	icon: rt.rsc("icons/obj/bodybag.dmi"),
	icon_state: "bodybag_folded",
});

// bodybag.dm:11
rt.def("/obj/item/bodybag/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* this.deploy_bodybag(user, user.loc);
	return f.dot;
}, true);

// bodybag.dm:15
rt.def("/obj/item/bodybag/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	if (!proximity) return f.dot;
	if (!rt.istype(target, T("/turf/open"))) return f.dot;
	yield* this.deploy_bodybag(user, target);
	return f.dot;
}, true);

// bodybag.dm:19
rt.def("/obj/item/bodybag/proc/deploy_bodybag", function* deploy_bodybag(f: Frame, user: Value, location: Value) {
	let R: Value = null;
	yield* (R = (yield* new_(this.unfoldedbag_path, location))).open(user);
	yield* R.add_fingerprint(user);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(9656, "/obj/item/bodybag/bluespace", "/obj/item/bodybag", {
	w_class: 2,
	origin_tech: "bluespace=4;materials=4;plasmatech=4",
	name: "bluespace body bag",
	desc: "A folded bluespace body bag designed for the storage and transportation of cadavers.",
	icon: rt.rsc("icons/obj/bodybag.dmi"),
	icon_state: "bluebodybag_folded",
	unfoldedbag_path: rt.typePath("/obj/structure/closet/body_bag/bluespace"),
});

// bodybag.dm:37
rt.def("/obj/item/bodybag/bluespace/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!rt.len(f, this.contents)) return f.dot;
	to_chat(user, `<span class='notice'>You can make out the shapes of ${rt.len(f, this.contents)} objects through the fabric.</span>`);
	return f.dot;
}, false);

// bodybag.dm:42
rt.def("/obj/item/bodybag/bluespace/proc/Destroy", function* Destroy(f: Frame) {
	let A: Value = null;
	for (A of each(this.contents, T("/atom/movable"))) {
		yield* A.forceMove(rt.getStep(f, this, 0));
		if (rt.istype(A, T("/mob/living"))) {
			to_chat(A, "<span class='notice'>You suddenly feel the space around you torn apart! You're free!</span>");
		}
	}
	return (yield* parent_proc());
}, true);

// bodybag.dm:49
rt.def("/obj/item/bodybag/bluespace/proc/deploy_bodybag", function* deploy_bodybag(f: Frame, user: Value, location: Value) {
	let A: Value = null;
	let R: Value = (yield* new_(this.unfoldedbag_path, location));
	for (A of each(this.contents, T("/atom/movable"))) {
		yield* A.forceMove(R);
		if (rt.istype(A, T("/mob/living"))) {
			to_chat(A, "<span class='notice'>You suddenly feel air around you! You're free!</span>");
		}
	}
	yield* R.open(user);
	yield* R.add_fingerprint(user);
	yield* qdel(this);
	return f.dot;
}, true);

// bodybag.dm:59
rt.def("/obj/item/bodybag/bluespace/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	if (user.incapacitated()) {
		to_chat(user, "<span class='warning'>You can't get out while you're restrained like this!</span>");
		return f.dot;
	}
	user.changeNext_move(100);
	user.last_special = rt.worldTime(f) + 100;
	to_chat(user, `<span class='notice'>You claw at the fabric of ${this}, trying to tear it open...</span>`);
	to_chat(this.loc, `<span class='warning'>Someone starts trying to break free of ${this}!</span>`);
	if (!(yield* do_after(user, 200, { target: this }))) {
		to_chat(this.loc, "<span class='warning'>The pressure subsides. It seems that they've stopped resisting...</span>");
		return f.dot;
	}
	this.loc.visible_message(`<span class='warning'>${user} suddenly appears in front of ${this.loc}!</span>`, `<span class='userdanger'>${user} breaks free of ${this}!</span>`);
	yield* qdel(this);
	return f.dot;
}, true);
