// Based on /tg/station's code/game/objects/items/devices/flashlight.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(9121, "/obj/item/device/flashlight", "/obj/item/device", {
	on: 0,
	brightness_on: 4,
	flashlight_power: 1,
	flags: 64,
	name: "flashlight",
	desc: "A hand-held emergency light.",
	icon: rt.rsc("icons/obj/lighting.dmi"),
	icon_state: "flashlight",
	item_state: "flashlight",
	w_class: 2,
	slot_flags: 512,
	materials: null,
	actions_types: null,
});

// flashlight.dm:10
rt.def("/obj/item/device/flashlight/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 50, "$glass", 20]);

	this.actions_types = list(T("/datum/action/item_action/toggle_light"));
	return f.dot;
});

// flashlight.dm:17
rt.def("/obj/item/device/flashlight/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.update_brightness();
	return f.dot;
}, true);

// flashlight.dm:22
rt.def("/obj/item/device/flashlight/proc/update_brightness", function update_brightness(f: Frame, user: Value) {
	if (this.on) {
		this.icon_state = `${rt.initial(f, this, "icon_state")}-on`;
		if (this.flashlight_power) {
			this.set_light({ l_range: this.brightness_on, l_power: this.flashlight_power });
		} else {
			this.set_light(this.brightness_on);
		}
	} else {
		this.icon_state = rt.initial(f, this, "icon_state");
		this.set_light(0);
	}
	return f.dot;
});

// flashlight.dm:32
rt.def("/obj/item/device/flashlight/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let X: Value = null, A: Value = null;
	this.on = (!this.on ? 1 : 0);
	this.update_brightness(user);
	for (X of each(this.actions)) {
		yield* (A = X).UpdateButtonIcon();
	}
	return 1;
}, true);

// flashlight.dm:40
rt.def("/obj/item/device/flashlight/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is putting ${this} close to ${user.p_their()} eyes and turning it on! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	return 2;
});

// flashlight.dm:46
rt.def("/obj/item/device/flashlight/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let E: Value = null, their: Value = null, mouth_organs: Value = null, O: Value = null, organ_list: Value = null, organ_count: Value = null, I: Value = null, O_5: Value = null, pill_count: Value = null, AP: Value = null, can_use_mirror: Value = null, mirror: Value = null;
	let $0: any, $1: any, $e: any;
	yield* this.add_fingerprint(user);
	if (rt.isIn(f, (((rt.istype(M, T("/mob/living/carbon")) ? 1 : 0) && this.on) && user.zone_selected), list("eyes", "mouth"))) {
		if ((rt.bitAnd(user.disabilities, 256) || user.getBrainLoss() >= 60) && prob(50)) {
			return (yield* parent_proc());
		}
		if (!user.IsAdvancedToolUser()) {
			to_chat(user, "<span class='warning'>You don't have the dexterity to do this!</span>");
			return f.dot;
		}
		if (!M.get_bodypart("head")) {
			to_chat(user, `<span class='warning'>${M} doesn't have a head!</span>`);
			return f.dot;
		}
		if (this.flashlight_power < 1) {
			to_chat(user, fmt("<span class='warning'>＄！ isn't bright enough to see anything!</span> ", [this]));
			return f.dot;
		}
		if (user.zone_selected === "eyes") {
			if (M.head && rt.bitAnd(M.head.flags_cover, HEADCOVERSEYES) || M.wear_mask && rt.bitAnd(M.wear_mask.flags_cover, MASKCOVERSEYES) || M.glasses && rt.bitAnd(M.glasses.flags_cover, GLASSESCOVERSEYES)) {
				$0 = user;
				if (M.head && rt.bitAnd(M.head.flags_cover, HEADCOVERSEYES)) {
					$1 = "helmet";
				} else if (M.wear_mask && rt.bitAnd(M.wear_mask.flags_cover, MASKCOVERSEYES)) {
					$1 = "mask";
				} else {
					$1 = "glasses";
				}
				to_chat($0, `<span class='notice'>You're going to need to remove that ${$1} first.</span>`);
				return f.dot;
			}
			if (!(E = M.getorganslot("eye_sight"))) {
				to_chat(user, `<span class='danger'>${M} doesn't have any eyes!</span>`);
				return f.dot;
			}
			if (M == user) {
				if (yield* M.flash_act({ visual: GLASSESCOVERSEYES })) {
					M.visible_message(`${M} directs ${this} to ${M.p_their()} eyes.`, "<span class='notice'>You wave the light in front of your eyes! Trippy!</span>");
				} else {
					M.visible_message(`${M} directs ${this} to ${M.p_their()} eyes.`, "<span class='notice'>You wave the light in front of your eyes.</span>");
				}
			} else {
				user.visible_message(`<span class='warning'>${user} directs ${this} to ${M}'s eyes.</span>`, `<span class='danger'>You direct ${this} to ${M}'s eyes.</span>`);
				if (M.stat == MASKCOVERSEYES || rt.bitAnd(M.disabilities, 1) || !(yield* M.flash_act({ visual: 1 }))) {
					to_chat(user, `<span class='warning'>${M}'s pupils don't react to the light!</span>`);
				} else if (M.dna && M.dna.check_mutation("X Ray Vision")) {
					to_chat(user, `<span class='danger'>${M}'s pupils give an eerie glow!</span>`);
				} else {
					to_chat(user, `<span class='notice'>${M}'s pupils narrow.</span>`);
				}
			}
		} else if (user.zone_selected === "mouth") {
			if (M.head && rt.bitAnd(M.head.flags_cover, HEADCOVERSMOUTH) || M.wear_mask && rt.bitAnd(M.wear_mask.flags_cover, MASKCOVERSMOUTH)) {
				$0 = user;
				if (M.head && rt.bitAnd(M.head.flags_cover, HEADCOVERSMOUTH)) {
					$1 = "helmet";
				} else {
					$1 = "mask";
				}
				to_chat($0, `<span class='notice'>You're going to need to remove that ${$1} first.</span>`);
				return f.dot;
			}
			their = M.p_their();
			mouth_organs = (yield* new_(T("/list")));
			for (O of each(M.internal_organs, T("/obj/item/organ"))) {
				if (O.zone == "mouth") {
					mouth_organs.Add(O);
				}
			}
			organ_list = "";
			if (organ_count = rt.length(mouth_organs)) {
				rt.forRange(f, 0, 1, organ_count, 1);
				while (($e = rt.next(f, 0)) !== undefined) {
					I = $e;
					if (I > 1) {
						if (I == rt.len(f, mouth_organs)) {
							organ_list += ", and ";
						} else {
							organ_list += ", ";
						}
					}
					organ_list += (O_5 = rt.index(mouth_organs, I)).gender == "plural" ? O_5.name : fmt("＇！", [O_5.name]);
				}
				rt.endFor(f, 0);
			}
			pill_count = 0;
			for (AP of each(M.actions, T("/datum/action/item_action/hands_free/activate_pill"))) {
				pill_count++;
			}
			if (M == user) {
				can_use_mirror = 0;
				if (isturf(user.loc)) {
					if (mirror = rt.locateIn(f, T("/obj/structure/mirror"), user.loc)) {
						if (user.dir === 1) {
							can_use_mirror = (mirror.pixel_y > 0 ? 1 : 0);
						} else if (user.dir === 2) {
							can_use_mirror = (mirror.pixel_y < 0 ? 1 : 0);
						} else if (user.dir === 4) {
							can_use_mirror = (mirror.pixel_x > 0 ? 1 : 0);
						} else if (user.dir === 8) {
							can_use_mirror = (mirror.pixel_x < 0 ? 1 : 0);
						}
					}
				}
				M.visible_message(`${M} directs ${this} to ${their} mouth.`, `<span class='notice'>You point ${this} into your mouth.</span>`);
				if (!can_use_mirror) {
					to_chat(user, "<span class='notice'>You can't see anything without a mirror.</span>");
					return f.dot;
				}
				if (organ_count) {
					to_chat(user, `<span class='notice'>Inside your mouth ${organ_count > 1 ? "are" : "is"} ${organ_list}.</span>`);
				} else {
					to_chat(user, "<span class='notice'>There's nothing inside your mouth.</span>");
				}
				if (pill_count) {
					to_chat(user, `<span class='notice'>You have ${pill_count} implanted pill${pill_count > 1 ? "s" : ""}.</span>`);
				}
			} else {
				user.visible_message(`<span class='notice'>${user} directs ${this} to ${M}'s mouth.</span>`, `<span class='notice'>You direct ${this} to ${M}'s mouth.</span>`);
				if (organ_count) {
					to_chat(user, `<span class='notice'>Inside ${their} mouth ${organ_count > 1 ? "are" : "is"} ${organ_list}.</span>`);
				} else {
					to_chat(user, `<span class='notice'>${M} doesn't have any organs in ${their} mouth.</span>`);
				}
				if (pill_count) {
					to_chat(user, `<span class='notice'>${M} has ${pill_count} pill${pill_count > 1 ? "s" : ""} implanted in ${their} teeth.`);
				}
			}
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(9125, "/obj/item/device/flashlight/pen", "/obj/item/device/flashlight", {
	holo_cooldown: 0,
	flags: 64,
	brightness_on: 2,
	name: "penlight",
	desc: "A pen-sized light, used by medical staff. It can also be used to create a hologram to alert people of incoming medical assistance.",
	icon_state: "penlight",
	item_state: "",
});

// flashlight.dm:168
rt.def("/obj/item/device/flashlight/pen/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity_flag: Value) {
	let _T: Value = null;
	if (!proximity_flag) {
		if (this.holo_cooldown > rt.worldTime(f)) {
			to_chat(user, `<span class='warning'>${this} is not ready yet!</span>`);
			return f.dot;
		}
		_T = rt.getStep(f, target, 0);
		if (rt.locateIn(f, T("/mob/living"), _T)) {
			yield* new_(T("/obj/effect/temp_visual/medical_holosign"), _T, user);
			this.holo_cooldown = rt.worldTime(f) + 100;
			return f.dot;
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(11659, "/obj/effect/temp_visual/medical_holosign", "/obj/effect/temp_visual", {
	duration: 30,
	name: "medical holosign",
	desc: "A small holographic glow that indicates a medic is coming to treat a patient.",
	icon_state: "medi_holo",
});

// flashlight.dm:186
rt.def("/obj/effect/temp_visual/medical_holosign/proc/Initialize", function* Initialize(f: Frame, mapload: Value, creator: Value) {
	f.dot = (yield* parent_proc());
	playsound(this.loc, rt.rsc("sound/machines/ping.ogg"), 50, 0);
	if (!creator) return f.dot;
	this.visible_message(`<span class='danger'>${creator} created a medical hologram!</span>`);
	return f.dot;
}, true);

rt.type(9127, "/obj/item/device/flashlight/lamp", "/obj/item/device/flashlight", {
	brightness_on: 5,
	flags: 64,
	on: 1,
	name: "desk lamp",
	desc: "A desk lamp with an adjustable mount.",
	icon_state: "lamp",
	item_state: "lamp",
	w_class: 4,
	materials: null,
});

// flashlight.dm:210
rt.def("/obj/item/device/flashlight/lamp/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = list();
	return f.dot;
});

// flashlight.dm:227
rt.def("/obj/item/device/flashlight/lamp/verb/toggle_light", function* toggle_light(f: Frame) {
	if (f.usr.stat) return f.dot;
	yield* this.attack_self(f.usr);
	return f.dot;
}, true, { verb: { name: "Toggle light", category: "Object", src: 3, range: 1 } });

rt.type(9122, "/obj/item/device/flashlight/flare", "/obj/item/device/flashlight", {
	fuel: 0,
	on_damage: 7,
	produce_heat: 1500,
	light_color: "#FA644B",
	name: "flare",
	desc: "A red Nanotrasen issued flare. There are instructions on the side, it reads 'pull cord, make light'.",
	w_class: 2,
	brightness_on: 7,
	icon_state: "flare",
	item_state: "flare",
	actions_types: null,
	heat: 1000,
});

// flashlight.dm:246
rt.def("/obj/item/device/flashlight/flare/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list();
	return f.dot;
});

// flashlight.dm:254
rt.def("/obj/item/device/flashlight/flare/proc/New", function* New(f: Frame) {
	this.fuel = rand(800, 1000);
	yield* parent_proc();
	return f.dot;
}, true);

// flashlight.dm:258
rt.def("/obj/item/device/flashlight/flare/proc/process", function* process(f: Frame) {
	yield* this.open_flame(this.heat);
	this.fuel = max(this.fuel - 1, 0);
	if (!(!this.fuel || !this.on)) return f.dot;
	yield* this.turn_off();
	if (!this.fuel) {
		this.icon_state = `${rt.initial(f, this, "icon_state")}-empty`;
	}
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return f.dot;
}, true, { waitfor: false });

// flashlight.dm:267
rt.def("/obj/item/device/flashlight/flare/proc/ignition_effect", function ignition_effect(f: Frame, A: Value, user: Value) {
	if (this.fuel && this.on) {
		f.dot = `<span class='notice'>${user} lights ${A} with ${this} like a real badass.</span>`;
	} else {
		f.dot = "";
	}
	return f.dot;
});

// flashlight.dm:275
rt.def("/obj/item/device/flashlight/flare/proc/turn_off", function turn_off(f: Frame) {
	let U: Value = null;
	this.on = 0;
	this.force = rt.initial(f, this, "force");
	this.damtype = rt.initial(f, this, "damtype");
	if (ismob(this.loc)) {
		this.update_brightness((U = this.loc));
	} else {
		this.update_brightness(null);
	}
	return f.dot;
});

// flashlight.dm:284
rt.def("/obj/item/device/flashlight/flare/proc/update_brightness", function update_brightness(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = null;
	}
	parent_proc();
	if (this.on) {
		this.item_state = `${rt.initial(f, this, "item_state")}-on`;
	} else {
		this.item_state = `${rt.initial(f, this, "item_state")}`;
	}
	return f.dot;
}, false, { args: ["user"] });

// flashlight.dm:293
rt.def("/obj/item/device/flashlight/flare/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (!this.fuel) {
		to_chat(user, `<span class='warning'>${this} is out of fuel!</span>`);
		return f.dot;
	}
	if (this.on) {
		to_chat(user, `<span class='notice'>${this} is already on.</span>`);
		return f.dot;
	}
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	user.visible_message(fmt("<span class='notice'>＀ lights ％！.</span>", [user, this]), fmt("<span class='notice'>You light ％！!</span>", [this]));
	this.force = this.on_damage;
	this.damtype = "fire";
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// flashlight.dm:309
rt.def("/obj/item/device/flashlight/flare/proc/is_hot", function is_hot(f: Frame) {
	return this.on * this.heat;
});

rt.type(9131, "/obj/item/device/flashlight/slime", "/obj/item/device/flashlight", {
	brightness_on: 6,
	gender: "plural",
	name: "glowing slime extract",
	desc: "Extract from a yellow slime. It emits a strong light when squeezed.",
	icon: rt.rsc("icons/obj/lighting.dmi"),
	icon_state: "slime",
	item_state: "slime",
	w_class: 2,
	slot_flags: 512,
	materials: null,
});

// flashlight.dm:338
rt.def("/obj/item/device/flashlight/slime/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = list();
	return f.dot;
});

rt.type(9132, "/obj/item/device/flashlight/emp", "/obj/item/device/flashlight", {
	emp_max_charges: 4,
	emp_cur_charges: 4,
	charge_tick: 0,
	origin_tech: "magnets=3;syndicate=1",
});

// flashlight.dm:349
rt.def("/obj/item/device/flashlight/emp/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// flashlight.dm:353
rt.def("/obj/item/device/flashlight/emp/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// flashlight.dm:357
rt.def("/obj/item/device/flashlight/emp/proc/process", function process(f: Frame) {
	this.charge_tick++;
	if (this.charge_tick < 10) {
		return 0;
	}
	this.charge_tick = 0;
	this.emp_cur_charges = min(this.emp_cur_charges + 1, this.emp_max_charges);
	return 1;
}, false, { waitfor: false });

// flashlight.dm:365
rt.def("/obj/item/device/flashlight/emp/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	if (rt.isIn(f, (this.on && user.zone_selected), list("eyes", "mouth"))) {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// flashlight.dm:370
rt.def("/obj/item/device/flashlight/emp/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	let M: Value = null;
	if (!proximity) {
		return f.dot;
	}
	if (this.emp_cur_charges > 0) {
		this.emp_cur_charges -= 1;
		if (ismob(A)) {
			M = A;
			add_logs(user, M, "attacked", "EMP-light");
			M.visible_message(fmt("<span class='danger'>＀ blinks ％！ at ％！.", [user, this, A]), fmt("<span class='userdanger'>＀ blinks ％！ at you.", [user, this]));
		} else {
			A.visible_message(fmt("<span class='danger'>＀ blinks ％！ at ％！.", [user, this, A]));
		}
		to_chat(user, fmt("＄！ now has ＀ charge５.", [this, this.emp_cur_charges]));
		yield* A.emp_act(1);
	} else {
		to_chat(user, fmt("<span class='warning'>＄！ needs time to recharge!</span>", [this]));
	}
	return f.dot;
}, true);

rt.type(9133, "/obj/item/device/flashlight/glowstick", "/obj/item/device/flashlight", {
	fuel: 0,
	brightness_on: 4,
	name: "glowstick",
	desc: "A military-grade glowstick.",
	w_class: 2,
	color: "#64C864",
	icon_state: "glowstick",
	item_state: "glowstick",
});

// flashlight.dm:402
rt.def("/obj/item/device/flashlight/glowstick/proc/Initialize", function* Initialize(f: Frame) {
	this.fuel = rand(1600, 2000);
	this.light_color = this.color;
	yield* parent_proc();
	return f.dot;
}, true);

// flashlight.dm:407
rt.def("/obj/item/device/flashlight/glowstick/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// flashlight.dm:411
rt.def("/obj/item/device/flashlight/glowstick/proc/process", function process(f: Frame) {
	this.fuel = max(this.fuel - 1, 0);
	if (this.fuel) return f.dot;
	this.turn_off();
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	this.update_icon();
	return f.dot;
}, false, { waitfor: false });

// flashlight.dm:419
rt.def("/obj/item/device/flashlight/glowstick/proc/turn_off", function turn_off(f: Frame) {
	this.on = 0;
	this.update_icon();
	return f.dot;
});

// flashlight.dm:422
rt.def("/obj/item/device/flashlight/glowstick/proc/update_icon", function update_icon(f: Frame) {
	let glowstick_overlay: Value = null;
	this.item_state = "glowstick";
	this.overlays.Cut();
	if (!this.fuel) {
		this.icon_state = "glowstick-empty";
		this.cut_overlays();
		this.set_light(0);
	} else if (this.on) {
		(glowstick_overlay = mutable_appearance(this.icon, "glowstick-glow")).color = this.color;
		this.add_overlay(glowstick_overlay);
		this.item_state = "glowstick-on";
		this.set_light(this.brightness_on);
	} else {
		this.icon_state = "glowstick";
		this.cut_overlays();
	}
	return f.dot;
});

// flashlight.dm:439
rt.def("/obj/item/device/flashlight/glowstick/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (!this.fuel) {
		to_chat(user, `<span class='notice'>${this} is spent.</span>`);
		return f.dot;
	}
	if (this.on) {
		to_chat(user, `<span class='notice'>${this} is already lit.</span>`);
		return f.dot;
	}
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	user.visible_message(`<span class='notice'>${user} cracks and shakes ${this}.</span>`, `<span class='notice'>You crack and shake ${this}, turning it on!</span>`);
	yield* this.activate();
	return f.dot;
}, true);

// flashlight.dm:452
rt.def("/obj/item/device/flashlight/glowstick/proc/activate", function activate(f: Frame) {
	// Lit means on and burning. tg returned when `on` was already set, but attack_self's ..() sets it first, so the fuel never burned.
	this.on = 1;
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
});

rt.type(9140, "/obj/item/device/flashlight/glowstick/random", "/obj/item/device/flashlight/glowstick", {
	name: "random colored glowstick",
});

// flashlight.dm:484
rt.def("/obj/item/device/flashlight/glowstick/random/proc/Initialize", function* Initialize(f: Frame) {
	let glowtype: Value = null;
	let glowtypes: Value = typesof(T("/obj/item/device/flashlight/glowstick"));
	glowtypes -= T("/obj/item/device/flashlight/glowstick/random");
	this.name = rt.initial(f, (glowtype = pick(glowtypes)), "name");
	this.color = rt.initial(f, glowtype, "color");
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

rt.type(9143, "/obj/item/device/flashlight/eyelight", "/obj/item/device/flashlight", {
	brightness_on: 15,
	flashlight_power: 1,
	flags: 16448,
	name: "eyelight",
	desc: "This shouldn't exist outside of someone's head, how are you seeing this?",
	actions_types: null,
});

// flashlight.dm:522
rt.def("/obj/item/device/flashlight/eyelight/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list();
	return f.dot;
});
