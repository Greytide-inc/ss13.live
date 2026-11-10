// Based on /tg/station's code/game/objects/items/weapons/tools.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(7347, "/obj/item/weapon/wrench", "/obj/item/weapon", {
	flags: 64,
	name: "wrench",
	desc: "A wrench with common uses. Can be found in your hand.",
	icon: rt.rsc("icons/obj/tools.dmi"),
	icon_state: "wrench",
	slot_flags: 512,
	force: 5,
	throwforce: 7,
	w_class: 2,
	usesound: rt.rsc("sound/items/ratchet.ogg"),
	materials: null,
	origin_tech: "materials=1;engineering=1",
	attack_verb: null,
	toolspeed: 1,
	armor: null,
});

// tools.dm:28
rt.def("/obj/item/weapon/wrench/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 150]);
	this.attack_verb = list("bashed", "battered", "bludgeoned", "whacked");
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 30]);
	return f.dot;
});

// tools.dm:35
rt.def("/obj/item/weapon/wrench/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is beating ${user.p_them()}self to death with ${this}! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	playsound(this.loc, rt.rsc("sound/weapons/genhit.ogg"), 50, 1, -1);
	return 1;
});

rt.type(7351, "/obj/item/weapon/wrench/power", "/obj/item/weapon/wrench", {
	name: "hand drill",
	desc: "A simple powered hand drill. It's fitted with a bolt bit.",
	icon_state: "drill_bolt",
	item_state: "drill",
	usesound: rt.rsc("sound/items/drill_use.ogg"),
	materials: null,
	origin_tech: "materials=2;engineering=2",
	force: 8,
	w_class: 2,
	throwforce: 8,
	attack_verb: null,
	toolspeed: 0.25,
});

// tools.dm:66
rt.def("/obj/item/weapon/wrench/power/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 150, "$silver", 50, "$titanium", 25]);
	this.attack_verb = list("drilled", "screwed", "jabbed");
	return f.dot;
});

// tools.dm:75
rt.def("/obj/item/weapon/wrench/power/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	playsound(rt.getStep(f, user, 0), rt.rsc("sound/items/change_drill.ogg"), 50, 1);
	let s_drill: Value = (yield* new_(T("/obj/item/weapon/screwdriver/power")));
	to_chat(user, `<span class='notice'>You attach the screw driver bit to ${this}.</span>`);
	yield* qdel(this);
	yield* user.put_in_active_hand(s_drill);
	return f.dot;
}, true);

// tools.dm:82
rt.def("/obj/item/weapon/wrench/power/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is pressing ${this} against ${user.p_their()} head! It looks like ${user.p_theyre()} trying to commit suicide!`);
	return 1;
});

rt.type(7352, "/obj/item/weapon/wrench/medical", "/obj/item/weapon/wrench", {
	name: "medical wrench",
	desc: "A medical wrench with common(medical?) uses. Can be found in your hand.",
	icon_state: "wrench_medical",
	force: 2,
	throwforce: 4,
	origin_tech: "materials=1;engineering=1;biotech=3",
	attack_verb: null,
});

// tools.dm:95
rt.def("/obj/item/weapon/wrench/medical/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	let W: Value = null;
	user.visible_message(`<span class='suicide'>${user} is praying to the medical wrench to take ${user.p_their()} soul. It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	yield* user.Stun(100, { ignore_canstun: 1 });
	playsound(this.loc, rt.rsc("sound/effects/pray.ogg"), 50, 1, -1);
	yield* sleep(20);
	if (!user) {
		return f.dot;
	}
	for (W of each(user, T("/obj/item"))) {
		yield* user.dropItemToGround(W);
	}
	yield* (W = (yield* new_(T("/obj/item/weapon/wrench/medical"), this.loc))).add_fingerprint(user);
	W.desc += ` For some reason, it reminds you of ${user.name}.`;
	if (!user) {
		return f.dot;
	}
	yield* user.dust();
	return 8;
}, true);

rt.type(7004, "/obj/item/weapon/screwdriver", "/obj/item/weapon", {
	flags: 64,
	throw_speed: 3,
	throw_range: 5,
	name: "screwdriver",
	desc: "You can be totally screwy with this.",
	icon: rt.rsc("icons/obj/tools.dmi"),
	icon_state: null,
	slot_flags: 512,
	force: 5,
	w_class: 1,
	throwforce: 5,
	materials: null,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	usesound: rt.rsc("sound/items/screwdriver.ogg"),
	toolspeed: 1,
	armor: null,
});

// tools.dm:138
rt.def("/obj/item/weapon/screwdriver/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 75]);

	this.attack_verb = list("stabbed");
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 30]);
	return f.dot;
});

// tools.dm:146
rt.def("/obj/item/weapon/screwdriver/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is stabbing ${this} into ${user.p_their()} ${pick("temple", "heart")}! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	return 1;
});

// tools.dm:150
rt.def("/obj/item/weapon/screwdriver/proc/New", function* New(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = null;
	}
	yield* parent_proc();
	if (!this.icon_state) {
		if (!f.args[1]) {
			f.args[1] = pick("red", "blue", "pink", "brown", "green", "cyan", "yellow");
		}
		this.icon_state = `screwdriver_${f.args[1]}`;
	}
	if (prob(75)) {
		this.pixel_y = rand(0, 16);
	}
	return f.dot;
}, true, { args: ["loc", "param_color"] });

// tools.dm:161
rt.def("/obj/item/weapon/screwdriver/proc/attack", function* attack(f: Frame) {
	if (!rt.istype(f.args[0], T("/mob/living/carbon"))) {
		return (yield* parent_proc());
	}
	if (f.args[1].zone_selected != "eyes" && f.args[1].zone_selected != "head") {
		return (yield* parent_proc());
	}
	if (rt.bitAnd(f.args[1].disabilities, 256) && prob(50)) {
		f.args[0] = f.args[1];
	}
	return (yield* this.eyestab(f.args[0], f.args[1]));
}, true, { args: ["M", "user"] });

rt.type(7008, "/obj/item/weapon/screwdriver/power", "/obj/item/weapon/screwdriver", {
	throw_speed: 2,
	throw_range: 3,
	name: "hand drill",
	desc: "A simple powered hand drill. It's fitted with a screw bit.",
	icon_state: "drill_screw",
	item_state: "drill",
	materials: null,
	origin_tech: "materials=2;engineering=2",
	force: 8,
	w_class: 2,
	throwforce: 8,
	attack_verb: null,
	hitsound: rt.rsc("sound/items/drill_hit.ogg"),
	usesound: rt.rsc("sound/items/drill_use.ogg"),
	toolspeed: 0.25,
});

// tools.dm:189
rt.def("/obj/item/weapon/screwdriver/power/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 150, "$silver", 50, "$titanium", 25]);
	this.attack_verb = list("drilled", "screwed", "jabbed", "whacked");
	return f.dot;
});

// tools.dm:202
rt.def("/obj/item/weapon/screwdriver/power/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is putting ${this} to ${user.p_their()} temple. It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	return 1;
});

// tools.dm:206
rt.def("/obj/item/weapon/screwdriver/power/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	playsound(rt.getStep(f, user, 0), rt.rsc("sound/items/change_drill.ogg"), 50, 1);
	let b_drill: Value = (yield* new_(T("/obj/item/weapon/wrench/power")));
	to_chat(user, `<span class='notice'>You attach the bolt driver bit to ${this}.</span>`);
	yield* qdel(this);
	yield* user.put_in_active_hand(b_drill);
	return f.dot;
}, true);

rt.type(7353, "/obj/item/weapon/wirecutters", "/obj/item/weapon", {
	flags: 64,
	throw_speed: 3,
	throw_range: 7,
	name: "wirecutters",
	desc: "This cuts wires.",
	icon: rt.rsc("icons/obj/tools.dmi"),
	icon_state: null,
	slot_flags: 512,
	force: 6,
	w_class: 2,
	materials: null,
	attack_verb: null,
	hitsound: rt.rsc("sound/items/wirecutter.ogg"),
	usesound: rt.rsc("sound/items/wirecutter.ogg"),
	origin_tech: "materials=1;engineering=1",
	toolspeed: 1,
	armor: null,
});

// tools.dm:232
rt.def("/obj/item/weapon/wirecutters/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 80]);
	this.attack_verb = list("pinched", "nipped");
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 30]);
	return f.dot;
});

// tools.dm:242
rt.def("/obj/item/weapon/wirecutters/proc/New", function* New(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = null;
	}
	yield* parent_proc();
	if (this.icon_state) return f.dot;
	if (!f.args[1]) {
		f.args[1] = pick("yellow", "red");
	}
	this.icon_state = `cutters_${f.args[1]}`;
	return f.dot;
}, true, { args: ["loc", "param_color"] });

// tools.dm:249
rt.def("/obj/item/weapon/wirecutters/proc/attack", function* attack(f: Frame, C: Value, user: Value) {
	if (rt.istype(C, T("/mob/living/carbon")) && C.handcuffed && rt.istype(C.handcuffed, T("/obj/item/weapon/restraints/handcuffs/cable"))) {
		user.visible_message(`<span class='notice'>${user} cuts ${C}'s restraints with ${this}!</span>`);
		yield* qdel(C.handcuffed);
		C.handcuffed = null;
		if (C.buckled && C.buckled.buckle_requires_restraints) {
			yield* C.buckled.unbuckle_mob(C);
		}
		yield* C.update_handcuffed();
		return f.dot;
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// tools.dm:261
rt.def("/obj/item/weapon/wirecutters/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is cutting at ${user.p_their()} arteries with ${this}! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	playsound(this.loc, this.usesound, 50, 1, -1);
	return 1;
});

rt.type(7357, "/obj/item/weapon/wirecutters/power", "/obj/item/weapon/wirecutters", {
	name: "jaws of life",
	desc: "A set of jaws of life, compressed through the magic of science. It's fitted with a cutting head.",
	icon_state: "jaws_cutter",
	item_state: "jawsoflife",
	origin_tech: "materials=2;engineering=2",
	materials: null,
	usesound: rt.rsc("sound/items/jaws_cut.ogg"),
	toolspeed: 0.25,
});

// tools.dm:291
rt.def("/obj/item/weapon/wirecutters/power/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 150, "$silver", 50, "$titanium", 25]);
	return f.dot;
});

// tools.dm:296
rt.def("/obj/item/weapon/wirecutters/power/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	let C: Value = null, BP: Value = null;
	user.visible_message(fmt("<span class='suicide'>＀ is wrapping ％！ around ＀ neck. It looks like ＀ trying to rip ＀ head off!</span>", [user, this, user.p_their(), user.p_theyre(), user.p_their()]));
	playsound(this.loc, rt.rsc("sound/items/jaws_cut.ogg"), 50, 1, -1);
	if (rt.istype(user, T("/mob/living/carbon"))) {
		C = user;
		if (BP = C.get_bodypart("head")) {
			yield* BP.drop_limb();
			playsound(this.loc, pick(rt.rsc("sound/misc/desceration-01.ogg"), rt.rsc("sound/misc/desceration-02.ogg"), rt.rsc("sound/misc/desceration-01.ogg")), 50, 1, -1);
		}
	}
	return 1;
}, true);

// tools.dm:307
rt.def("/obj/item/weapon/wirecutters/power/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	playsound(rt.getStep(f, user, 0), rt.rsc("sound/items/change_jaws.ogg"), 50, 1);
	let pryjaws: Value = (yield* new_(T("/obj/item/weapon/crowbar/power")));
	to_chat(user, `<span class='notice'>You attach the pry jaws to ${this}.</span>`);
	yield* qdel(this);
	yield* user.put_in_active_hand(pryjaws);
	return f.dot;
}, true);

rt.type(7358, "/obj/item/weapon/weldingtool", "/obj/item/weapon", {
	acti_sound: rt.rsc("sound/items/welderactivate.ogg"),
	deac_sound: rt.rsc("sound/items/welderdeactivate.ogg"),
	welding: 0,
	status: 1,
	max_fuel: 20,
	change_icons: 1,
	can_off_process: 0,
	light_intensity: 2,
	burned_fuel_for: 0,
	flags: 64,
	throw_speed: 3,
	throw_range: 5,
	name: "welding tool",
	desc: "A standard edition welder provided by NanoTrasen.",
	icon: rt.rsc("icons/obj/tools.dmi"),
	icon_state: "welder",
	item_state: "welder",
	slot_flags: 512,
	force: 3,
	throwforce: 5,
	hitsound: "swing_hit",
	usesound: rt.rsc("sound/items/welder.ogg"),
	w_class: 2,
	armor: null,
	resistance_flags: 2,
	materials: null,
	origin_tech: "engineering=1;plasmatech=1",
	heat: 3800,
	toolspeed: 1,
});

// tools.dm:332
rt.def("/obj/item/weapon/weldingtool/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 30]);
	this.materials = rt.alist(f, ["$metal", 70, "$glass", 30]);
	return f.dot;
});

// tools.dm:348
rt.def("/obj/item/weapon/weldingtool/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* this.create_reagents(this.max_fuel);
	yield* this.reagents.add_reagent("welding_fuel", this.max_fuel);
	yield* this.update_icon();
	return f.dot;
}, true);

// tools.dm:356
rt.def("/obj/item/weapon/weldingtool/proc/update_torch", function update_torch(f: Frame) {
	this.cut_overlays();
	if (this.welding) {
		this.add_overlay(`${rt.initial(f, this, "icon_state")}-on`);
		this.item_state = `${rt.initial(f, this, "item_state")}1`;
	} else {
		this.item_state = `${rt.initial(f, this, "item_state")}`;
	}
	return f.dot;
});

// tools.dm:366
rt.def("/obj/item/weapon/weldingtool/proc/update_icon", function update_icon(f: Frame) {
	let ratio: Value = null;
	if (this.change_icons) {
		if ((ratio = Ceiling((ratio = this.get_fuel() / this.max_fuel) * 4) * 25) == 100) {
			this.icon_state = rt.initial(f, this, "icon_state");
		} else {
			this.icon_state = `${rt.initial(f, this, "icon_state")}${ratio}`;
		}
	}
	this.update_torch();
	return f.dot;
});

// tools.dm:377
rt.def("/obj/item/weapon/weldingtool/proc/process", function* process(f: Frame) {
	if (this.welding === 0) {
		this.force = 3;
		this.damtype = "brute";
		yield* this.update_icon();
		if (!this.can_off_process) {
			this.isprocessing = 0;
			GLOB.SSobj.processing -= this;
		}
		return f.dot;
	} else if (this.welding === 1) {
		this.force = 15;
		this.damtype = "fire";
		++this.burned_fuel_for;
		if (this.burned_fuel_for >= 13) {
			yield* this.remove_fuel(1);
		}
		yield* this.update_icon();
	}
	yield* this.open_flame();
	return f.dot;
}, true, { waitfor: false });

// tools.dm:399
rt.def("/obj/item/weapon/weldingtool/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} welds ${user.p_their()} every orifice closed! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	return 2;
});

// tools.dm:404
rt.def("/obj/item/weapon/weldingtool/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/weapon/screwdriver"))) {
		yield* this.flamethrower_screwdriver(I, user);
	} else if (rt.istype(I, T("/obj/item/stack/rods"))) {
		yield* this.flamethrower_rods(I, user);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// tools.dm:413
rt.def("/obj/item/weapon/weldingtool/proc/attack", function* attack(f: Frame, H: Value, user: Value) {
	let affecting: Value = null;
	if (!rt.istype(H, T("/mob/living/carbon/human"))) {
		return (yield* parent_proc());
	}
	if ((affecting = H.get_bodypart(check_zone(user.zone_selected))) && affecting.status == BODYPART_ROBOTIC && user.a_intent != "harm") {
		if (yield* this.remove_fuel(1)) {
			playsound(this.loc, this.usesound, 50, 1);
			if (user == H) {
				user.visible_message(`<span class='notice'>${user} starts to fix some of the dents on ${H}'s ${affecting.name}.</span>`, `<span class='notice'>You start fixing some of the dents on ${H}'s ${affecting.name}.</span>`);
				if (!(yield* do_mob(user, H, 50))) {
					return f.dot;
				}
			}
			yield* item_heal_robotic(H, user, 15, 0);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// tools.dm:431
rt.def("/obj/item/weapon/weldingtool/proc/afterattack", function* afterattack(f: Frame, O: Value, user: Value, proximity: Value) {
	let location: Value = null, L: Value = null;
	if (!proximity) {
		return f.dot;
	}
	if (!this.welding) return f.dot;
	yield* this.remove_fuel(1);
	yield* (location = rt.getStep(f, user, 0)).hotspot_expose(700, 50, 1);
	if (this.get_fuel() <= 0) {
		this.set_light(0);
	}
	if (!rt.istype(O, T("/mob/living"))) return f.dot;
	if (!(yield* (L = O).IgniteMob())) return f.dot;
	message_admins(`${key_name_admin(user)} set ${key_name_admin(L)} on fire`);
	log_game(`${key_name(user)} set ${key_name(L)} on fire`);
	return f.dot;
}, true);

// tools.dm:448
rt.def("/obj/item/weapon/weldingtool/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* this.switched_on(user);
	if (this.welding) {
		this.set_light(this.light_intensity);
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// tools.dm:457
rt.def("/obj/item/weapon/weldingtool/proc/get_fuel", function get_fuel(f: Frame) {
	return this.reagents.get_reagent_amount("welding_fuel");
});

// tools.dm:462
rt.def("/obj/item/weapon/weldingtool/proc/remove_fuel", function* remove_fuel(f: Frame, amount: Value, M: Value) {
	amount ??= 1;
	if (!this.welding || !(yield* this.check_fuel())) {
		return 0;
	}
	if (amount) {
		this.burned_fuel_for = 0;
	}
	if (this.get_fuel() >= amount) {
		yield* this.reagents.remove_reagent("welding_fuel", amount);
		yield* this.check_fuel();
		if (M) {
			yield* M.flash_act(this.light_intensity);
		}
		return 1;
	} else {
		if (M) {
			to_chat(M, "<span class='warning'>You need more welding fuel to complete this task!</span>");
		}
		return 0;
	}
}, true);

// tools.dm:480
rt.def("/obj/item/weapon/weldingtool/proc/check_fuel", function* check_fuel(f: Frame, user: Value) {
	let M: Value = null;
	if (this.get_fuel() <= 0 && this.welding) {
		yield* this.switched_on(user);
		yield* this.update_icon();
		if (ismob(this.loc)) {
			yield* (M = this.loc).update_inv_hands(0);
		}
		return 0;
	}
	return 1;
}, true);

// tools.dm:493
rt.def("/obj/item/weapon/weldingtool/proc/switched_on", function* switched_on(f: Frame, user: Value) {
	if (!this.status) {
		to_chat(user, `<span class='warning'>${this} can't be turned on while unsecured!</span>`);
		yield* this.balloon_alert(user, "unsecured!");
		return f.dot;
	}
	this.welding = (!this.welding ? 1 : 0);
	if (this.welding) {
		if (this.get_fuel() >= 1) {
			to_chat(user, `<span class='notice'>You switch ${this} on.</span>`);
			yield* this.balloon_alert(user, "welder on");
			playsound(this.loc, this.acti_sound, 50, 1);
			this.force = 15;
			this.damtype = "fire";
			this.hitsound = rt.rsc("sound/items/welder.ogg");
			yield* this.update_icon();
			if (!this.isprocessing) {
				this.isprocessing = 1;
				GLOB.SSobj.processing += this;
			}
		} else {
			to_chat(user, "<span class='warning'>You need more fuel!</span>");
			yield* this.balloon_alert(user, "no fuel!");
			this.switched_off(user);
		}
	} else {
		to_chat(user, `<span class='notice'>You switch ${this} off.</span>`);
		yield* this.balloon_alert(user, "welder off");
		playsound(this.loc, this.deac_sound, 50, 1);
		this.switched_off(user);
	}
	return f.dot;
}, true);

// tools.dm:521
rt.def("/obj/item/weapon/weldingtool/proc/switched_off", function switched_off(f: Frame, user: Value) {
	this.welding = 0;
	this.set_light(0);
	this.force = 3;
	this.damtype = "brute";
	this.hitsound = "swing_hit";
	this.update_icon();
	return f.dot;
});

// tools.dm:530
rt.def("/obj/item/weapon/weldingtool/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, fmt("It contains ＀ unit５ of fuel out of ＀.", [this.get_fuel(), this.max_fuel]));
	return f.dot;
}, false);

// tools.dm:534
rt.def("/obj/item/weapon/weldingtool/proc/is_hot", function is_hot(f: Frame) {
	return this.welding * this.heat;
});

// tools.dm:543
rt.def("/obj/item/weapon/weldingtool/proc/flamethrower_screwdriver", function* flamethrower_screwdriver(f: Frame, I: Value, user: Value) {
	if (this.welding) {
		to_chat(user, "<span class='warning'>Turn it off first!</span>");
		return f.dot;
	}
	this.status = (!this.status ? 1 : 0);
	if (this.status) {
		to_chat(user, `<span class='notice'>You resecure ${this}.</span>`);
	} else {
		to_chat(user, `<span class='notice'>${this} can now be attached and modified.</span>`);
	}
	yield* this.add_fingerprint(user);
	return f.dot;
}, true);

// tools.dm:553
rt.def("/obj/item/weapon/weldingtool/proc/flamethrower_rods", function* flamethrower_rods(f: Frame, I: Value, user: Value) {
	let R: Value = null, F: Value = null;
	if (this.status) return f.dot;
	if (yield* (R = I).use(1)) {
		if (!(yield* this.remove_item_from_storage((F = (yield* new_(T("/obj/item/weapon/flamethrower"), user.loc)))))) {
			yield* user.transferItemToLoc(this, F, 1);
		}
		F.weldtool = this;
		yield* this.add_fingerprint(user);
		to_chat(user, "<span class='notice'>You add a rod to a welder, starting to build a flamethrower.</span>");
		yield* user.put_in_hands(F);
	} else {
		to_chat(user, "<span class='warning'>You need one rod to start building a flamethrower!</span>");
	}
	return f.dot;
}, true);

// tools.dm:567
rt.def("/obj/item/weapon/weldingtool/proc/ignition_effect", function* ignition_effect(f: Frame, A: Value, user: Value) {
	if (this.welding && (yield* this.remove_fuel(1, user))) {
		f.dot = `<span class='notice'>${user} casually lights ${A} with ${this}, what a badass.</span>`;
	} else {
		f.dot = "";
	}
	return f.dot;
}, true);

rt.type(7359, "/obj/item/weapon/weldingtool/largetank", "/obj/item/weapon/weldingtool", {
	max_fuel: 40,
	name: "industrial welding tool",
	desc: "A slightly larger welder with a larger tank.",
	icon_state: "indwelder",
	materials: null,
	origin_tech: "engineering=2;plasmatech=2",
});

// tools.dm:577
rt.def("/obj/item/weapon/weldingtool/largetank/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$glass", 60]);
	return f.dot;
});

rt.type(7361, "/obj/item/weapon/weldingtool/mini", "/obj/item/weapon/weldingtool", {
	max_fuel: 10,
	change_icons: 0,
	name: "emergency welding tool",
	desc: "A miniature welder used during emergencies.",
	icon_state: "miniwelder",
	w_class: 1,
	materials: null,
});

// tools.dm:595
rt.def("/obj/item/weapon/weldingtool/mini/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 30, "$glass", 10]);
	return f.dot;
});

rt.type(7362, "/obj/item/weapon/weldingtool/abductor", "/obj/item/weapon/weldingtool", {
	light_intensity: 0,
	change_icons: 0,
	name: "alien welding tool",
	desc: "An alien welding tool. Whatever fuel it uses, it never runs out.",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "welder",
	toolspeed: 0.1,
	origin_tech: "plasmatech=5;engineering=5;abductor=3",
});

// tools.dm:612
rt.def("/obj/item/weapon/weldingtool/abductor/proc/process", function* process(f: Frame) {
	if (this.get_fuel() <= this.max_fuel) {
		yield* this.reagents.add_reagent("welding_fuel", 1);
	}
	yield* parent_proc();
	return f.dot;
}, true, { waitfor: false });

rt.type(7363, "/obj/item/weapon/weldingtool/hugetank", "/obj/item/weapon/weldingtool", {
	max_fuel: 80,
	name: "upgraded industrial welding tool",
	desc: "An upgraded welder based of the industrial welder.",
	icon_state: "upindwelder",
	item_state: "upindwelder",
	materials: null,
	origin_tech: "engineering=3;plasmatech=2",
});

// tools.dm:622
rt.def("/obj/item/weapon/weldingtool/hugetank/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 70, "$glass", 120]);
	return f.dot;
});

rt.type(7364, "/obj/item/weapon/weldingtool/experimental", "/obj/item/weapon/weldingtool", {
	last_gen: 0,
	nextrefueltick: 0,
	max_fuel: 40,
	change_icons: 0,
	can_off_process: 1,
	light_intensity: 1,
	name: "experimental welding tool",
	desc: "An experimental welder capable of self-fuel generation and less harmful to the eyes.",
	icon_state: "exwelder",
	item_state: "exwelder",
	materials: null,
	origin_tech: "materials=4;engineering=4;bluespace=3;plasmatech=4",
	toolspeed: 0.5,
});

// tools.dm:631
rt.def("/obj/item/weapon/weldingtool/experimental/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 70, "$glass", 120]);
	return f.dot;
});

// tools.dm:649
rt.def("/obj/item/weapon/weldingtool/experimental/proc/process", function* process(f: Frame) {
	yield* parent_proc();
	if (!(this.get_fuel() < this.max_fuel && this.nextrefueltick < rt.worldTime(f))) return f.dot;
	this.nextrefueltick = rt.worldTime(f) + 10;
	yield* this.reagents.add_reagent("welding_fuel", 1);
	return f.dot;
}, true, { waitfor: false });

rt.type(7366, "/obj/item/weapon/crowbar", "/obj/item/weapon", {
	flags: 64,
	name: "pocket crowbar",
	desc: "A small crowbar. This handy tool is useful for lots of things, such as prying floor tiles or opening unpowered doors.",
	icon: rt.rsc("icons/obj/tools.dmi"),
	icon_state: "crowbar",
	usesound: rt.rsc("sound/items/crowbar.ogg"),
	slot_flags: 512,
	force: 5,
	throwforce: 7,
	w_class: 2,
	materials: null,
	origin_tech: "engineering=1;combat=1",
	attack_verb: null,
	toolspeed: 1,
	armor: null,
});

// tools.dm:670
rt.def("/obj/item/weapon/crowbar/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 50]);
	this.attack_verb = list("attacked", "bashed", "battered", "bludgeoned", "whacked");
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 30]);
	return f.dot;
});

// tools.dm:677
rt.def("/obj/item/weapon/crowbar/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is beating ${user.p_them()}self to death with ${this}! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	playsound(this.loc, rt.rsc("sound/weapons/genhit.ogg"), 50, 1, -1);
	return 1;
});

rt.type(7370, "/obj/item/weapon/crowbar/large", "/obj/item/weapon/crowbar", {
	throw_speed: 3,
	throw_range: 3,
	name: "crowbar",
	desc: "It's a big crowbar. It doesn't fit in your pockets, because it's big.",
	force: 12,
	w_class: 3,
	materials: null,
	icon_state: "crowbar_large",
	item_state: "crowbar",
	toolspeed: 0.5,
});

// tools.dm:708
rt.def("/obj/item/weapon/crowbar/large/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 70]);
	return f.dot;
});

rt.type(7372, "/obj/item/weapon/crowbar/power", "/obj/item/weapon/crowbar", {
	name: "jaws of life",
	desc: "A set of jaws of life, compressed through the magic of science. It's fitted with a prying head.",
	icon_state: "jaws_pry",
	item_state: "jawsoflife",
	materials: null,
	origin_tech: "materials=2;engineering=2",
	usesound: rt.rsc("sound/items/jaws_pry.ogg"),
	force: 15,
	toolspeed: 0.25,
});

// tools.dm:725
rt.def("/obj/item/weapon/crowbar/power/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 150, "$silver", 50, "$titanium", 25]);
	return f.dot;
});

// tools.dm:732
rt.def("/obj/item/weapon/crowbar/power/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is putting ${user.p_their()} head in ${this}, it looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	playsound(this.loc, rt.rsc("sound/items/jaws_pry.ogg"), 50, 1, -1);
	return 1;
});

// tools.dm:737
rt.def("/obj/item/weapon/crowbar/power/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	playsound(rt.getStep(f, user, 0), rt.rsc("sound/items/change_jaws.ogg"), 50, 1);
	let cutjaws: Value = (yield* new_(T("/obj/item/weapon/wirecutters/power")));
	to_chat(user, `<span class='notice'>You attach the cutting jaws to ${this}.</span>`);
	yield* qdel(this);
	yield* user.put_in_active_hand(cutjaws);
	return f.dot;
}, true);
