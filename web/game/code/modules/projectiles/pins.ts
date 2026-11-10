// Based on /tg/station's code/modules/projectiles/pins.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9151, "/obj/item/device/firing_pin", "/obj/item/device", {
	emagged: 0,
	fail_message: "<span class='warning'>INVALID USER.</span>",
	selfdestruct: 0,
	force_replace: 0,
	pin_removeable: 0,
	gun: null,
	flags: 64,
	name: "electronic firing pin",
	desc: "A small authentication device, to be inserted into a firearm receiver to allow operation. NT safety regulations require all new designs to incorporate one.",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "firing_pin",
	item_state: "pen",
	origin_tech: "materials=2;combat=4",
	w_class: 1,
	attack_verb: null,
});

// pins.dm:10
rt.def("/obj/item/device/firing_pin/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.attack_verb = list("poked");
	return f.dot;
});

// pins.dm:20
rt.def("/obj/item/device/firing_pin/proc/New", function* New(f: Frame, newloc: Value) {
	yield* parent_proc();
	if (!rt.istype(newloc, T("/obj/item/weapon/gun"))) return f.dot;
	this.gun = newloc;
	return f.dot;
}, true);

// pins.dm:26
rt.def("/obj/item/device/firing_pin/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity_flag: Value) {
	let G: Value = null;
	if (!proximity_flag) return f.dot;
	if (!rt.istype(target, T("/obj/item/weapon/gun"))) return f.dot;
	if ((G = target).pin && (this.force_replace || G.pin.pin_removeable)) {
		G.pin.loc = rt.getStep(f, G, 0);
		G.pin.gun_remove(user);
		to_chat(user, `<span class ='notice'>You remove ${G}'s old pin.</span>`);
	}
	if (!G.pin) {
		if (!(yield* user.temporarilyRemoveItemFromInventory(this))) {
			return f.dot;
		}
		yield* this.gun_insert(user, G);
		to_chat(user, `<span class ='notice'>You insert ${this} into ${G}.</span>`);
	} else {
		to_chat(user, "<span class ='notice'>This firearm already has a firing pin installed.</span>");
	}
	return f.dot;
}, true);

// pins.dm:42
rt.def("/obj/item/device/firing_pin/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (this.emagged) return f.dot;
	this.emagged = 1;
	to_chat(user, "<span class='notice'>You override the authentication mechanism.</span>");
	return f.dot;
});

// pins.dm:47
rt.def("/obj/item/device/firing_pin/proc/gun_insert", function* gun_insert(f: Frame, user: Value, G: Value) {
	this.gun = G;
	yield* this.forceMove(this.gun);
	this.gun.pin = this;
	return f.dot;
}, true);

// pins.dm:53
rt.def("/obj/item/device/firing_pin/proc/gun_remove", function gun_remove(f: Frame, user: Value) {
	this.gun.pin = null;
	this.gun = null;
	return f.dot;
});

// pins.dm:61
rt.def("/obj/item/device/firing_pin/proc/auth_fail", function* auth_fail(f: Frame, user: Value) {
	user.show_message(this.fail_message, 1);
	if (!this.selfdestruct) return f.dot;
	user.show_message("<span class='danger'>SELF-DESTRUCTING...</span><br>", 1);
	to_chat(user, `<span class='userdanger'>${this.gun} explodes!</span>`);
	yield* explosion(rt.getStep(f, this.gun, 0), -1, 0, 2, 3);
	if (!this.gun) return f.dot;
	yield* qdel(this.gun);
	return f.dot;
}, true);

rt.type(9154, "/obj/item/device/firing_pin/test_range", "/obj/item/device/firing_pin", {
	fail_message: "<span class='warning'>TEST RANGE CHECK FAILED.</span>",
	pin_removeable: 1,
	name: "test-range firing pin",
	desc: "This safety firing pin allows weapons to be fired within proximity to a firing range.",
	origin_tech: "combat=2;materials=2",
});

// pins.dm:85
rt.def("/obj/item/device/firing_pin/test_range/proc/pin_auth", function pin_auth(f: Frame, user: Value) {
	let M: Value = null;
	for (M of each(range(user, 3), T("/obj/machinery/magnetic_controller"))) {
		return 1;
	}
	return 0;
});

rt.type(9155, "/obj/item/device/firing_pin/implant", "/obj/item/device/firing_pin", {
	req_implant: null,
	fail_message: "<span class='warning'>IMPLANT CHECK FAILED.</span>",
	name: "implant-keyed firing pin",
	desc: "This is a security firing pin which only authorizes users who are implanted with a certain device.",
});

// pins.dm:98
rt.def("/obj/item/device/firing_pin/implant/proc/pin_auth", function pin_auth(f: Frame, user: Value) {
	let I: Value = null;
	if (rt.istype(user, T("/mob/living"))) {
		for (I of each(user.implants, T("/obj/item/weapon/implant"))) {
			if (this.req_implant && I.type == this.req_implant) {
				return 1;
			}
		}
	}
	return 0;
});

rt.type(9158, "/obj/item/device/firing_pin/clown", "/obj/item/device/firing_pin", {
	fail_message: "<span class='warning'>HONK!</span>",
	force_replace: 1,
	name: "hilarious firing pin",
	desc: "Advanced clowntech that can convert any firearm into a far more useful object.",
	color: "#FFFF00",
});

// pins.dm:127
rt.def("/obj/item/device/firing_pin/clown/proc/pin_auth", function pin_auth(f: Frame, user: Value) {
	playsound(this.loc, rt.rsc("sound/items/bikehorn.ogg"), 50, 1);
	return 0;
});

rt.type(9159, "/obj/item/device/firing_pin/clown/ultra", "/obj/item/device/firing_pin/clown", {});

// pins.dm:133
rt.def("/obj/item/device/firing_pin/clown/ultra/proc/pin_auth", function pin_auth(f: Frame, user: Value) {
	playsound(this.loc, rt.rsc("sound/items/bikehorn.ogg"), 50, 1);
	if (!rt.bitAnd(user.disabilities, 256) && !(user.mind && user.mind.assigned_role == "Clown")) {
		return 0;
	}
	return 1;
});

// pins.dm:139
rt.def("/obj/item/device/firing_pin/clown/ultra/proc/gun_insert", function* gun_insert(f: Frame, user: Value, G: Value) {
	yield* parent_proc();
	G.clumsy_check = 0;
	return f.dot;
}, true);

// pins.dm:143
rt.def("/obj/item/device/firing_pin/clown/ultra/proc/gun_remove", function gun_remove(f: Frame, user: Value) {
	this.gun.clumsy_check = rt.initial(f, this.gun, "clumsy_check");
	parent_proc();
	return f.dot;
}, false);

rt.type(9161, "/obj/item/device/firing_pin/dna", "/obj/item/device/firing_pin", {
	unique_enzymes: null,
	fail_message: "<span class='warning'>DNA CHECK FAILED.</span>",
	name: "DNA-keyed firing pin",
	desc: "This is a DNA-locked firing pin which only authorizes one user. Attempt to fire once to DNA-link.",
	icon_state: "firing_pin_dna",
});

// pins.dm:162
rt.def("/obj/item/device/firing_pin/dna/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity_flag: Value) {
	let M: Value = null;
	yield* parent_proc();
	if (!(proximity_flag && rt.istype(target, T("/mob/living/carbon")))) return f.dot;
	if (!((M = target).dna && M.dna.unique_enzymes)) return f.dot;
	this.unique_enzymes = M.dna.unique_enzymes;
	to_chat(user, "<span class='notice'>DNA-LOCK SET.</span>");
	return f.dot;
}, true);

// pins.dm:170
rt.def("/obj/item/device/firing_pin/dna/proc/pin_auth", function pin_auth(f: Frame, user: Value) {
	if (rt.istype(user, T("/mob/living/carbon")) && user.dna && user.dna.unique_enzymes) {
		if (user.dna.unique_enzymes == this.unique_enzymes) {
			return 1;
		}
	}
	return 0;
});

// pins.dm:177
rt.def("/obj/item/device/firing_pin/dna/proc/auth_fail", function* auth_fail(f: Frame, user: Value) {
	if (!this.unique_enzymes) {
		if (rt.istype(user, T("/mob/living/carbon")) && user.dna && user.dna.unique_enzymes) {
			this.unique_enzymes = user.dna.unique_enzymes;
			to_chat(user, "<span class='notice'>DNA-LOCK SET.</span>");
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

rt.type(9163, "/obj/item/device/firing_pin/tag", "/obj/item/device/firing_pin", {
	suit_requirement: null,
	tagcolor: "",
	fail_message: "<span class='warning'>SUIT CHECK FAILED.</span>",
	name: "laser tag firing pin",
	desc: "A recreational firing pin, used in laser tag units to ensure users have their vests on.",
});

// pins.dm:198
rt.def("/obj/item/device/firing_pin/tag/proc/pin_auth", function pin_auth(f: Frame, user: Value) {
	let M: Value = null;
	if (rt.istype(user, T("/mob/living/carbon/human"))) {
		if (rt.op(f, "IsType", [], [(M = user).wear_suit, this.suit_requirement])) {
			return 1;
		}
	}
	to_chat(user, `<span class='warning'>You need to be wearing ${this.tagcolor} laser tag armor!</span>`);
	return 0;
});

// pins.dm:219
rt.def("/obj/item/device/firing_pin/proc/Destroy", function* Destroy(f: Frame) {
	if (this.gun) {
		this.gun.pin = null;
	}
	return (yield* parent_proc());
}, true);
