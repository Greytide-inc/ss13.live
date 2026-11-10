// Based on /tg/station's code/game/objects/structures/crates_lockers/closets/secure/personal.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12384, "/obj/structure/closet/secure_closet/personal", "/obj/structure/closet/secure_closet", {
	registered_name: null,
	desc: "It's a secure locker for personnel. The first card swiped gains control.",
	name: "personal closet",
	req_access: null,
});

// personal.dm:4
rt.def("/obj/structure/closet/secure_closet/personal/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(21);
	return f.dot;
});

// personal.dm:8
rt.def("/obj/structure/closet/secure_closet/personal/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	if (prob(50)) {
		yield* new_(T("/obj/item/weapon/storage/backpack/duffelbag"), this);
	}
	if (prob(50)) {
		yield* new_(T("/obj/item/weapon/storage/backpack"), this);
	} else {
		yield* new_(T("/obj/item/weapon/storage/backpack/satchel"), this);
	}
	yield* new_(T("/obj/item/device/radio/headset"), this);
	return f.dot;
}, true);

rt.type(12385, "/obj/structure/closet/secure_closet/personal/patient", "/obj/structure/closet/secure_closet/personal", {
	name: "patient's closet",
});

// personal.dm:21
rt.def("/obj/structure/closet/secure_closet/personal/patient/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/clothing/under/color/white"), this);
	yield* new_(T("/obj/item/clothing/shoes/sneakers/white"), this);
	return f.dot;
}, true);

rt.type(12386, "/obj/structure/closet/secure_closet/personal/cabinet", "/obj/structure/closet/secure_closet/personal", {
	icon_state: "cabinet",
	resistance_flags: 4,
	obj_integrity: 70,
	max_integrity: 70,
});

// personal.dm:31
rt.def("/obj/structure/closet/secure_closet/personal/cabinet/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/storage/backpack/satchel/leather/withwallet"), this);
	yield* new_(T("/obj/item/device/radio/headset"), this);
	return f.dot;
}, true);

// personal.dm:35
rt.def("/obj/structure/closet/secure_closet/personal/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let I: Value = null;
	if (rt.istype((I = W.GetID()), T("/obj/item/weapon/card/id"))) {
		if (this.broken) {
			to_chat(user, "<span class='danger'>It appears to be broken.</span>");
			return f.dot;
		}
		if (!I || !I.registered_name) {
			return f.dot;
		}
		if ((yield* this.allowed(user)) || !this.registered_name || rt.istype(I, T("/obj/item/weapon/card/id")) && this.registered_name == I.registered_name) {
			this.locked = (!this.locked ? 1 : 0);
			yield* this.update_icon();
			if (!this.registered_name) {
				this.registered_name = I.registered_name;
				this.desc = `Owned by ${I.registered_name}.`;
			}
		} else {
			to_chat(user, "<span class='danger'>Access Denied.</span>");
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);
