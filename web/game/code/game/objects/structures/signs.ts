// Based on /tg/station's code/game/objects/structures/signs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(12570, "/obj/structure/sign", "/obj/structure", {
	buildable_sign: 1,
	anchored: 1,
	icon: rt.rsc("icons/obj/decals.dmi"),
	opacity: 0,
	density: 0,
	layer: 3.4,
	obj_integrity: 100,
	max_integrity: 100,
	armor: null,
});

// signs.dm:9
rt.def("/obj/structure/sign/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 50, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 50]);
	return f.dot;
});

// signs.dm:18
rt.def("/obj/structure/sign/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	damage_type ??= "brute";
	damage_flag ??= 0;
	if (damage_type === "brute") {
		if (damage_amount) {
			playsound(this.loc, rt.rsc("sound/weapons/slash.ogg"), 80, 1);
		} else {
			playsound(this.loc, rt.rsc("sound/weapons/tap.ogg"), 50, 1);
		}
	} else if (damage_type === "fire") {
		playsound(this.loc, rt.rsc("sound/items/welder.ogg"), 80, 1);
	}
	return f.dot;
});

// signs.dm:28
rt.def("/obj/structure/sign/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	let SB: Value = null, sign_types: Value = null, sign_type: Value = null, newsign: Value = null;
	if (rt.istype(O, T("/obj/item/weapon/wrench")) && this.buildable_sign) {
		user.visible_message(`<span class='notice'>${user} starts removing ${this}...</span>`, `<span class='notice'>You start unfastening ${this}.</span>`);
		playsound(this, O.usesound, 50, 1);
		if (!(yield* do_after(user, 30 * O.toolspeed, { target: this }))) {
			return f.dot;
		}
		playsound(this, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
		user.visible_message(`<span class='notice'>${user} unfastens ${this}.</span>`, `<span class='notice'>You unfasten ${this}.</span>`);
		(SB = (yield* new_(T("/obj/item/sign_backing"), rt.getStep(f, user, 0)))).icon_state = this.icon_state;
		SB.sign_path = this.type;
		yield* qdel(this);
	} else if (rt.istype(O, T("/obj/item/weapon/pen")) && this.buildable_sign) {
		sign_types = list("Secure Area", "Biohazard", "High Voltage", "Radiation", "Hard Vacuum Ahead", "Disposal: Leads To Space", "Danger: Fire", "No Smoking", "Medbay", "Science", "Chemistry", "Hydroponics", "Xenobiology");
		const subject = (yield* g.op(f, "Prompt", [1], [null, "Sign Customization", "Select a sign type.", user, sign_types]));
		if (subject === "Blank") {
			sign_type = T("/obj/structure/sign/basic");
		} else if (subject === "Secure Area") {
			sign_type = T("/obj/structure/sign/securearea");
		} else if (subject === "Biohazard") {
			sign_type = T("/obj/structure/sign/biohazard");
		} else if (subject === "High Voltage") {
			sign_type = T("/obj/structure/sign/electricshock");
		} else if (subject === "Radiation") {
			sign_type = T("/obj/structure/sign/radiation");
		} else if (subject === "Hard Vacuum Ahead") {
			sign_type = T("/obj/structure/sign/vacuum");
		} else if (subject === "Disposal: Leads To Space") {
			sign_type = T("/obj/structure/sign/deathsposal");
		} else if (subject === "Danger: Fire") {
			sign_type = T("/obj/structure/sign/fire");
		} else if (subject === "No Smoking") {
			sign_type = T("/obj/structure/sign/nosmoking_1");
		} else if (subject === "Medbay") {
			sign_type = T("/obj/structure/sign/bluecross_2");
		} else if (subject === "Science") {
			sign_type = T("/obj/structure/sign/science");
		} else if (subject === "Chemistry") {
			sign_type = T("/obj/structure/sign/chemistry");
		} else if (subject === "Hydroponics") {
			sign_type = T("/obj/structure/sign/botany");
		} else if (subject === "Xenobiology") {
			sign_type = T("/obj/structure/sign/xenobio");
		}
		if (!this.Adjacent(user)) {
			return f.dot;
		}
		if (!sign_type) {
			return f.dot;
		}
		(newsign = (yield* new_(sign_type, rt.getStep(f, this, 0)))).pixel_x = this.pixel_x;
		newsign.pixel_y = this.pixel_y;
		yield* qdel(this);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(9874, "/obj/item/sign_backing", "/obj/item", {
	sign_path: rt.typePath("/obj/structure/sign/basic"),
	w_class: 3,
	name: "sign backing",
	desc: "A sign with adhesive backing.",
	icon: rt.rsc("icons/obj/decals.dmi"),
	icon_state: "backing",
	resistance_flags: 4,
});

// signs.dm:102
rt.def("/obj/item/sign_backing/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let _T: Value = null;
	if (isturf(target) && proximity) {
		_T = target;
		user.visible_message(`<span class='notice'>${user} fastens ${this} to ${_T}.</span>`, `<span class='notice'>You attach the sign to ${_T}.</span>`);
		playsound(_T, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
		yield* new_(this.sign_path, _T);
		yield* user.drop_item();
		yield* qdel(this);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);
