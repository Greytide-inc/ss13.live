// Based on /tg/station's code/game/objects/items/weapons/cigs_lighters.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(7128, "/obj/item/weapon/match", "/obj/item/weapon", {
	lit: 0,
	burnt: 0,
	smoketime: 5,
	name: "match",
	desc: "A simple match stick, used for lighting fine smokables.",
	icon: rt.rsc("icons/obj/cigarettes.dmi"),
	icon_state: "match_unlit",
	w_class: 1,
	origin_tech: "materials=1",
	heat: 1000,
});

// cigs_lighters.dm:31
rt.def("/obj/item/weapon/match/proc/process", function* process(f: Frame) {
	this.smoketime--;
	if (this.smoketime < 1) {
		this.matchburnout();
	} else {
		yield* this.open_flame(this.heat);
	}
	return f.dot;
}, true, { waitfor: false });

// cigs_lighters.dm:38
rt.def("/obj/item/weapon/match/proc/fire_act", function fire_act(f: Frame, exposed_temperature: Value, exposed_volume: Value) {
	this.matchignite();
	return f.dot;
});

// cigs_lighters.dm:41
rt.def("/obj/item/weapon/match/proc/matchignite", function matchignite(f: Frame) {
	if (!(!this.lit && !this.burnt)) return f.dot;
	this.lit = 1;
	this.icon_state = "match_lit";
	this.damtype = "fire";
	this.force = 3;
	this.hitsound = rt.rsc("sound/items/welder.ogg");
	this.item_state = "cigon";
	this.name = "lit match";
	this.desc = "A match. This one is lit.";
	this.attack_verb = list("burnt", "singed");
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSobj.processing += this;
	}
	this.update_icon();
	return f.dot;
});

// cigs_lighters.dm:58
rt.def("/obj/item/weapon/match/proc/matchburnout", function matchburnout(f: Frame) {
	if (!this.lit) return f.dot;
	this.lit = 0;
	this.burnt = 1;
	this.damtype = "brute";
	this.force = rt.initial(f, this, "force");
	this.icon_state = "match_burnt";
	this.item_state = "cigoff";
	this.name = "burnt match";
	this.desc = "A match. This one has seen better days.";
	this.attack_verb = list("flicked");
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return f.dot;
});

// cigs_lighters.dm:68
rt.def("/obj/item/weapon/match/proc/dropped", function* dropped(f: Frame, user: Value) {
	this.matchburnout();
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// cigs_lighters.dm:72
rt.def("/obj/item/weapon/match/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	if (!rt.istype(M, T("/mob/living"))) {
		return f.dot;
	}
	if (this.lit && (yield* M.IgniteMob())) {
		message_admins(`${key_name_admin(user)} set ${key_name_admin(M)} on fire`);
		log_game(`${key_name(user)} set ${key_name(M)} on fire`);
	}
	let cig: Value = this.help_light_cig(M);
	if (this.lit && cig && user.a_intent == "help") {
		if (cig.lit) {
			to_chat(user, `<span class='notice'>The ${cig.name} is already lit.</span>`);
		}
		if (M == user) {
			yield* cig.attackby(this, user);
		} else {
			yield* cig.light(`<span class='notice'>${user} holds the ${this.name} out for ${M}, and lights the ${cig.name}.</span>`);
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// cigs_lighters.dm:89
rt.def("/obj/item/proc/help_light_cig", function help_light_cig(f: Frame, M: Value) {
	let mask_item: Value = null;
	if (!rt.istype((mask_item = M.get_item_by_slot(slot_wear_mask)), T("/obj/item/clothing/mask/cigarette"))) return f.dot;
	return mask_item;
});

// cigs_lighters.dm:94
rt.def("/obj/item/weapon/match/proc/is_hot", function is_hot(f: Frame) {
	return this.lit * this.heat;
});

rt.type(8518, "/obj/item/clothing/mask/cigarette", "/obj/item/clothing/mask", {
	lit: 0,
	starts_lit: 0,
	icon_on: "cigon",
	icon_off: "cigoff",
	type_butt: rt.typePath("/obj/item/weapon/cigbutt"),
	lastHolder: null,
	smoketime: 300,
	chem_volume: 30,
	list_reagents: null,
	throw_speed: 0.5,
	container_type: 1024,
	name: "cigarette",
	desc: "A roll of tobacco and nicotine.",
	icon_state: "cigoff",
	item_state: "cigoff",
	w_class: 1,
	body_parts_covered: null,
	heat: 1000,
});

// cigs_lighters.dm:116
rt.def("/obj/item/clothing/mask/cigarette/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["nicotine", 15]);
	return f.dot;
});

// cigs_lighters.dm:120
rt.def("/obj/item/clothing/mask/cigarette/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is huffing ${this} as quickly as ${user.p_they()} can! It looks like ${user.p_theyre()} trying to give ${user.p_them()}self cancer.</span>`);
	return 12;
});

// cigs_lighters.dm:124
rt.def("/obj/item/clothing/mask/cigarette/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	yield* this.create_reagents(this.chem_volume);
	this.reagents.set_reacting(0);
	if (this.list_reagents) {
		yield* this.reagents.add_reagent_list(this.list_reagents);
	}
	if (!this.starts_lit) return f.dot;
	yield* this.light();
	return f.dot;
}, true);

// cigs_lighters.dm:133
rt.def("/obj/item/clothing/mask/cigarette/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// cigs_lighters.dm:137
rt.def("/obj/item/clothing/mask/cigarette/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let lighting_text: Value = null;
	if (!this.lit && this.smoketime > 0) {
		if (lighting_text = (yield* W.ignition_effect(this, user))) {
			yield* this.light(lighting_text);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// cigs_lighters.dm:145
rt.def("/obj/item/clothing/mask/cigarette/proc/afterattack", function* afterattack(f: Frame, glass: Value, user: Value, proximity: Value) {
	if (!proximity || this.lit) {
		return f.dot;
	}
	if (!rt.istype(glass, T("/obj/item/weapon/reagent_containers/glass"))) return f.dot;
	if (yield* glass.reagents.trans_to(this, this.chem_volume)) {
		to_chat(user, fmt("<span class='notice'>You dip ％！ into ％！.</span>", [this, glass]));
	} else if (!glass.reagents.total_volume) {
		to_chat(user, `<span class='notice'>${glass} is empty.</span>`);
	} else {
		to_chat(user, `<span class='notice'>${this} is full.</span>`);
	}
	return f.dot;
}, true);

// cigs_lighters.dm:162
rt.def("/obj/item/clothing/mask/cigarette/proc/light", function* light(f: Frame, flavor_text: Value) {
	let e: Value = null, _T: Value = null, M: Value = null;
	if (this.lit) {
		return f.dot;
	}
	this.lit = 1;
	this.name = `lit ${this.name}`;
	this.attack_verb = list("burnt", "singed");
	this.hitsound = rt.rsc("sound/items/welder.ogg");
	this.damtype = "fire";
	this.force = 4;
	if (this.reagents.get_reagent_amount("plasma")) {
		yield* (e = (yield* new_(T("/datum/effect_system/reagents_explosion")))).set_up(round(this.reagents.get_reagent_amount("plasma") / 2.5, 1), rt.getStep(f, this, 0), 0, 0);
		yield* e.start();
		yield* qdel(this);
		return f.dot;
	}
	if (this.reagents.get_reagent_amount("welding_fuel")) {
		yield* (e = (yield* new_(T("/datum/effect_system/reagents_explosion")))).set_up(round(this.reagents.get_reagent_amount("welding_fuel") / 5, 1), rt.getStep(f, this, 0), 0, 0);
		yield* e.start();
		yield* qdel(this);
		return f.dot;
	}
	this.reagents.set_reacting(1);
	yield* this.reagents.handle_reactions();
	this.icon_state = this.icon_on;
	this.item_state = this.icon_on;
	if (flavor_text) {
		(_T = rt.getStep(f, this, 0)).visible_message(flavor_text);
	}
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSobj.processing += this;
	}
	if (!ismob(this.loc)) return f.dot;
	yield* (M = this.loc).update_inv_wear_mask();
	yield* M.update_inv_hands();
	return f.dot;
}, true);

// cigs_lighters.dm:197
rt.def("/obj/item/clothing/mask/cigarette/proc/handle_reagents", function* handle_reagents(f: Frame) {
	let C: Value = null, fraction: Value = null;
	if (!this.reagents.total_volume) return f.dot;
	if (rt.istype(this.loc, T("/mob/living/carbon"))) {
		C = this.loc;
		if (this == C.wear_mask) {
			if (prob(15)) {
				fraction = min(REAGENTS_METABOLISM / this.reagents.total_volume, 1);
				yield* this.reagents.reaction(C, INGEST, fraction);
			}
			if (!(yield* this.reagents.trans_to(C, REAGENTS_METABOLISM))) {
				yield* this.reagents.remove_any(REAGENTS_METABOLISM);
			}
			return f.dot;
		}
	}
	yield* this.reagents.remove_any(REAGENTS_METABOLISM);
	return f.dot;
}, true);

// cigs_lighters.dm:211
rt.def("/obj/item/clothing/mask/cigarette/proc/process", function* process(f: Frame) {
	let location: Value = rt.getStep(f, this, 0);
	let M: Value = this.loc;
	if (rt.istype(this.loc, T("/mob/living"))) {
		yield* M.IgniteMob();
	}
	this.smoketime--;
	if (this.smoketime < 1) {
		yield* new_(this.type_butt, location);
		if (ismob(this.loc)) {
			to_chat(M, `<span class='notice'>Your ${this.name} goes out.</span>`);
		}
		yield* qdel(this);
		return f.dot;
	}
	yield* this.open_flame();
	if (!(this.reagents && this.reagents.total_volume)) return f.dot;
	yield* this.handle_reagents();
	return f.dot;
}, true, { waitfor: false });

// cigs_lighters.dm:228
rt.def("/obj/item/clothing/mask/cigarette/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (this.lit) {
		user.visible_message(fmt("<span class='notice'>＀ calmly drops and treads on ％！, putting it out instantly.</span>", [user, this]));
		yield* new_(this.type_butt, user.loc);
		yield* new_(T("/obj/effect/decal/cleanable/ash"), user.loc);
		yield* qdel(this);
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// cigs_lighters.dm:235
rt.def("/obj/item/clothing/mask/cigarette/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	if (!rt.istype(M, T("/mob/living/carbon"))) {
		return (yield* parent_proc());
	}
	let cig: Value = this.help_light_cig(M);
	if (this.lit && cig && user.a_intent == "help") {
		if (cig.lit) {
			to_chat(user, `<span class='notice'>The ${cig.name} is already lit.</span>`);
		}
		if (M == user) {
			yield* cig.attackby(this, user);
		} else {
			yield* cig.light(`<span class='notice'>${user} holds the ${this.name} out for ${M}, and lights the ${cig.name}.</span>`);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// cigs_lighters.dm:249
rt.def("/obj/item/clothing/mask/cigarette/proc/fire_act", function* fire_act(f: Frame, exposed_temperature: Value, exposed_volume: Value) {
	yield* this.light();
	return f.dot;
}, true);

// cigs_lighters.dm:252
rt.def("/obj/item/clothing/mask/cigarette/proc/is_hot", function is_hot(f: Frame) {
	return this.lit * this.heat;
});

rt.type(8521, "/obj/item/clothing/mask/cigarette/uplift", "/obj/item/clothing/mask/cigarette", {
	list_reagents: null,
	desc: "An Uplift Smooth brand cigarette.",
});

// cigs_lighters.dm:264
rt.def("/obj/item/clothing/mask/cigarette/uplift/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["nicotine", 7.5, "menthol", 7.5]);
	return f.dot;
});

rt.type(8523, "/obj/item/clothing/mask/cigarette/robustgold", "/obj/item/clothing/mask/cigarette", {
	list_reagents: null,
	desc: "A Robust Gold brand cigarette.",
});

// cigs_lighters.dm:271
rt.def("/obj/item/clothing/mask/cigarette/robustgold/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["nicotine", 15, "gold", 1]);
	return f.dot;
});

rt.type(8525, "/obj/item/clothing/mask/cigarette/syndicate", "/obj/item/clothing/mask/cigarette", {
	list_reagents: null,
	desc: "An unknown brand cigarette.",
});

// cigs_lighters.dm:278
rt.def("/obj/item/clothing/mask/cigarette/syndicate/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["nicotine", 15, "omnizine", 15]);
	return f.dot;
});

rt.type(8526, "/obj/item/clothing/mask/cigarette/shadyjims", "/obj/item/clothing/mask/cigarette", {
	list_reagents: null,
	desc: "A Shady Jim's Super Slims cigarette.",
});

// cigs_lighters.dm:282
rt.def("/obj/item/clothing/mask/cigarette/shadyjims/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["nicotine", 15, "lipolicide", 4, "ammonia", 2, "plantbgone", 1, "toxin", 1.5]);
	return f.dot;
});

rt.type(8527, "/obj/item/clothing/mask/cigarette/rollie", "/obj/item/clothing/mask/cigarette", {
	icon_on: "spliffon",
	icon_off: "spliffoff",
	type_butt: rt.typePath("/obj/item/weapon/cigbutt/roach"),
	throw_speed: 0.5,
	smoketime: 180,
	chem_volume: 50,
	name: "rollie",
	desc: "A roll of dried plant matter wrapped in thin paper.",
	icon_state: "spliffoff",
	item_state: "spliffoff",
});

// cigs_lighters.dm:299
rt.def("/obj/item/clothing/mask/cigarette/rollie/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.pixel_x = rand(-5, 5);
	this.pixel_y = rand(-5, 5);
	return f.dot;
}, true);

rt.type(8528, "/obj/item/clothing/mask/cigarette/rollie/trippy", "/obj/item/clothing/mask/cigarette/rollie", {
	list_reagents: null,
	starts_lit: 1,
});

// cigs_lighters.dm:304
rt.def("/obj/item/clothing/mask/cigarette/rollie/trippy/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["nicotine", 15, "mushroomhallucinogen", 35]);
	return f.dot;
});

rt.type(7130, "/obj/item/weapon/cigbutt/roach", "/obj/item/weapon/cigbutt", {
	name: "roach",
	desc: "A manky old roach, or for non-stoners, a used rollup.",
	icon_state: "roach",
});

// cigs_lighters.dm:313
rt.def("/obj/item/weapon/cigbutt/roach/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.pixel_x = rand(-5, 5);
	this.pixel_y = rand(-5, 5);
	return f.dot;
}, true);

rt.type(8532, "/obj/item/clothing/mask/cigarette/pipe", "/obj/item/clothing/mask/cigarette", {
	packeditem: 0,
	icon_on: "pipeon",
	icon_off: "pipeoff",
	smoketime: 0,
	chem_volume: 100,
	list_reagents: null,
	name: "smoking pipe",
	desc: "A pipe, for smoking. Probably made of meershaum or something.",
	icon_state: "pipeoff",
	item_state: "pipeoff",
});

// cigs_lighters.dm:377
rt.def("/obj/item/clothing/mask/cigarette/pipe/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = null;
	return f.dot;
});

// cigs_lighters.dm:381
rt.def("/obj/item/clothing/mask/cigarette/pipe/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.name = `empty ${rt.initial(f, this, "name")}`;
	return f.dot;
}, true);

// cigs_lighters.dm:385
rt.def("/obj/item/clothing/mask/cigarette/pipe/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// cigs_lighters.dm:389
rt.def("/obj/item/clothing/mask/cigarette/pipe/proc/process", function* process(f: Frame) {
	let M: Value = null;
	let location: Value = rt.getStep(f, this, 0);
	this.smoketime--;
	if (this.smoketime < 1) {
		yield* new_(T("/obj/effect/decal/cleanable/ash"), location);
		if (ismob(this.loc)) {
			to_chat((M = this.loc), `<span class='notice'>Your ${this.name} goes out.</span>`);
			this.lit = 0;
			this.icon_state = this.icon_off;
			this.item_state = this.icon_off;
			yield* M.update_inv_wear_mask();
			this.packeditem = 0;
			this.name = `empty ${rt.initial(f, this, "name")}`;
		}
		this.isprocessing = 0;
		GLOB.SSobj.processing -= this;
		return f.dot;
	}
	yield* this.open_flame();
	if (!(this.reagents && this.reagents.total_volume)) return f.dot;
	yield* this.handle_reagents();
	return f.dot;
}, true, { waitfor: false });

// cigs_lighters.dm:410
rt.def("/obj/item/clothing/mask/cigarette/pipe/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	let G: Value = null, lighting_text: Value = null;
	if (rt.istype(O, T("/obj/item/weapon/reagent_containers/food/snacks/grown"))) {
		G = O;
		if (!this.packeditem) {
			if (G.dry == 1) {
				to_chat(user, `<span class='notice'>You stuff ${O} into ${this}.</span>`);
				this.smoketime = 400;
				this.packeditem = 1;
				this.name = `${O.name}-packed ${rt.initial(f, this, "name")}`;
				if (O.reagents) {
					yield* O.reagents.trans_to(this, O.reagents.total_volume);
				}
				yield* qdel(O);
			} else {
				to_chat(user, "<span class='warning'>It has to be dried first!</span>");
			}
		} else {
			to_chat(user, "<span class='warning'>It is already packed!</span>");
		}
	} else if (lighting_text = (yield* O.ignition_effect(this, user))) {
		if (this.smoketime > 0) {
			yield* this.light(lighting_text);
		} else {
			to_chat(user, "<span class='warning'>There is nothing to smoke!</span>");
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// cigs_lighters.dm:436
rt.def("/obj/item/clothing/mask/cigarette/pipe/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let location: Value = rt.getStep(f, user, 0);
	if (this.lit) {
		user.visible_message(`<span class='notice'>${user} puts out ${this}.</span>`, `<span class='notice'>You put out ${this}.</span>`);
		this.lit = 0;
		this.icon_state = this.icon_off;
		this.item_state = this.icon_off;
		this.isprocessing = 0;
		GLOB.SSobj.processing -= this;
		return f.dot;
	}
	if (!this.lit && this.smoketime > 0) {
		to_chat(user, `<span class='notice'>You empty ${this} onto ${location}.</span>`);
		yield* new_(T("/obj/effect/decal/cleanable/ash"), location);
		this.packeditem = 0;
		this.smoketime = 0;
		yield* this.reagents.clear_reagents();
		this.name = `empty ${rt.initial(f, this, "name")}`;
	}
	return f.dot;
}, true);

rt.type(7132, "/obj/item/weapon/lighter", "/obj/item/weapon", {
	lit: 0,
	fancy: 1,
	flags: 64,
	light_color: "#FAA019",
	name: "１Zippo lighter",
	desc: "The zippo.",
	icon: rt.rsc("icons/obj/cigarettes.dmi"),
	icon_state: "zippo",
	item_state: "zippo",
	w_class: 1,
	slot_flags: 512,
	heat: 1500,
	resistance_flags: 2,
});

// cigs_lighters.dm:483
rt.def("/obj/item/weapon/lighter/proc/update_icon", function update_icon(f: Frame) {
	if (this.lit) {
		this.icon_state = `${rt.initial(f, this, "icon_state")}_on`;
	} else {
		this.icon_state = `${rt.initial(f, this, "icon_state")}`;
	}
	return f.dot;
});

// cigs_lighters.dm:488
rt.def("/obj/item/weapon/lighter/proc/ignition_effect", function ignition_effect(f: Frame, A: Value, user: Value) {
	if (!this.is_hot()) return f.dot;
	f.dot = `<span class='rose'>With a single flick of their wrist, ${user} smoothly lights ${A} with ${this}. Damn ${user.p_theyre()} cool.</span>`;
	return f.dot;
});

// cigs_lighters.dm:492
rt.def("/obj/item/weapon/lighter/proc/set_lit", function set_lit(f: Frame, new_lit: Value) {
	this.lit = new_lit;
	if (this.lit) {
		this.force = 5;
		this.damtype = "fire";
		this.hitsound = rt.rsc("sound/items/welder.ogg");
		this.attack_verb = list("burnt", "singed");
		this.set_light(1);
		if (!this.isprocessing) {
			this.isprocessing = 1;
			GLOB.SSobj.processing += this;
		}
	} else {
		this.hitsound = "swing_hit";
		this.force = 0;
		this.attack_verb = null;
		this.set_light(0);
		this.isprocessing = 0;
		GLOB.SSobj.processing -= this;
	}
	this.update_icon();
	return f.dot;
});

// cigs_lighters.dm:509
rt.def("/obj/item/weapon/lighter/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let prot: Value = null, H: Value = null, G: Value = null, hitzone: Value = null;
	if (user.is_holding(this)) {
		if (!this.lit) {
			this.set_lit(1);
			if (this.fancy) {
				user.visible_message(`Without even breaking stride, ${user} flips open and lights ${this} in one smooth movement.`, `<span class='notice'>Without even breaking stride, you flip open and lights ${this} in one smooth movement.</span>`);
			} else {
				prot = 0;
				if (rt.istype((H = user), T("/mob/living/carbon/human")) && H.gloves) {
					if ((G = H.gloves).max_heat_protection_temperature) {
						prot = (G.max_heat_protection_temperature > 360 ? 1 : 0);
					}
				} else {
					prot = 1;
				}
				if (prot || prob(75)) {
					user.visible_message(`After a few attempts, ${user} manages to light ${this}.`, `<span class='notice'>After a few attempts, you manage to light ${this}.</span>`);
				} else {
					hitzone = user.held_index_to_dir(user.active_hand_index) == "r" ? "r_hand" : "l_hand";
					yield* user.apply_damage(5, "fire", hitzone);
					user.visible_message(`<span class='warning'>After a few attempts, ${user} manages to light ${this} - however, ${user.p_they()} burn their finger in the process.</span>`, "<span class='warning'>You burn yourself while lighting the lighter!</span>");
				}
			}
		} else {
			this.set_lit(0);
			if (this.fancy) {
				user.visible_message(`You hear a quiet click, as ${user} shuts off ${this} without even looking at what ${user.p_theyre()} doing. Wow.`, `<span class='notice'>You quietly shut off ${this} without even looking at what you're doing. Wow.</span>`);
			} else {
				user.visible_message(`${user} quietly shuts off ${this}.`, `<span class='notice'>You quietly shut off ${this}.`);
			}
		}
	} else {
		f.dot = (yield* parent_proc());
	}
	return f.dot;
}, true);

// cigs_lighters.dm:542
rt.def("/obj/item/weapon/lighter/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	if (this.lit && (yield* M.IgniteMob())) {
		message_admins(`${key_name_admin(user)} set ${key_name_admin(M)} on fire`);
		log_game(`${key_name(user)} set ${key_name(M)} on fire`);
	}
	let cig: Value = this.help_light_cig(M);
	if (this.lit && cig && user.a_intent == "help") {
		if (cig.lit) {
			to_chat(user, `<span class='notice'>The ${cig.name} is already lit.</span>`);
		}
		if (M == user) {
			yield* cig.attackby(this, user);
		} else if (this.fancy) {
			yield* cig.light(fmt("<span class='rose'>＀ whips the ＀ out and holds it for ＀. ＀ arm is as steady as the unflickering flame they light ％！ with.</span>", [user, this.name, M, user.p_their(1), cig]));
		} else {
			yield* cig.light(`<span class='notice'>${user} holds the ${this.name} out for ${M}, and lights the ${cig.name}.</span>`);
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// cigs_lighters.dm:560
rt.def("/obj/item/weapon/lighter/proc/process", function* process(f: Frame) {
	yield* this.open_flame();
	return f.dot;
}, true, { waitfor: false });

// cigs_lighters.dm:563
rt.def("/obj/item/weapon/lighter/proc/is_hot", function is_hot(f: Frame) {
	return this.lit * this.heat;
});

rt.type(7133, "/obj/item/weapon/lighter/greyscale", "/obj/item/weapon/lighter", {
	fancy: 0,
	name: "cheap lighter",
	desc: "A cheap-as-free lighter.",
	icon_state: "lighter",
});

// cigs_lighters.dm:573
rt.def("/obj/item/weapon/lighter/greyscale/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.add_atom_colour(color2hex(randomColor(1)), FIXED_COLOUR_PRIORITY);
	yield* this.update_icon();
	return f.dot;
}, true);

// cigs_lighters.dm:578
rt.def("/obj/item/weapon/lighter/greyscale/proc/update_icon", function update_icon(f: Frame) {
	let base_overlay: Value = null;
	this.cut_overlays();
	(base_overlay = mutable_appearance(this.icon, `${rt.initial(f, this, "icon_state")}_base`)).appearance_flags = 2;
	if (this.lit) {
		base_overlay.icon_state = `${rt.initial(f, this, "icon_state")}_on`;
	}
	this.add_overlay(base_overlay);
	return f.dot;
});

// cigs_lighters.dm:586
rt.def("/obj/item/weapon/lighter/greyscale/proc/ignition_effect", function ignition_effect(f: Frame, A: Value, user: Value) {
	if (!this.is_hot()) return f.dot;
	f.dot = `<span class='notice'>After some fiddling, ${user} manages to light ${A} with ${this}.</span>`;
	return f.dot;
});

rt.type(7134, "/obj/item/weapon/rollingpaper", "/obj/item/weapon", {
	name: "rolling paper",
	desc: "A thin piece of paper used to make fine smokeables.",
	icon: rt.rsc("icons/obj/cigarettes.dmi"),
	icon_state: "cig_paper",
	w_class: 1,
});

// cigs_lighters.dm:601
rt.def("/obj/item/weapon/rollingpaper/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let O: Value = null, R: Value = null;
	if (!proximity) {
		return f.dot;
	}
	if (rt.istype(target, T("/obj/item/weapon/reagent_containers/food/snacks/grown"))) {
		if ((O = target).dry) {
			(R = (yield* new_(T("/obj/item/clothing/mask/cigarette/rollie"), user.loc))).chem_volume = target.reagents.total_volume;
			yield* target.reagents.trans_to(R, R.chem_volume);
			yield* qdel(target);
			yield* qdel(this);
			yield* user.put_in_active_hand(R);
			to_chat(user, `<span class='notice'>You roll the ${target.name} into a rolling paper.</span>`);
			R.desc = `Dried ${target.name} rolled up in a thin piece of paper.`;
		} else {
			to_chat(user, "<span class='warning'>You need to dry this first!</span>");
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

rt.type(8534, "/obj/item/clothing/mask/vape", "/obj/item/clothing/mask", {
	chem_volume: 100,
	vapetime: 0,
	screw: 0,
	super: 0,
	emagged: 0,
	name: "E-Cigarette",
	desc: "A classy and highly sophisticated electronic cigarette, for classy and dignified gentlemen. A warning label reads \"Warning: Do not fill with flammable materials.\"",
	icon: rt.rsc("icons/obj/clothing/masks.dmi"),
	icon_state: null,
	item_state: null,
	w_class: 1,
});

// cigs_lighters.dm:636
rt.def("/obj/item/clothing/mask/vape/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is puffin hard on dat vape, ${user.p_they()} trying to join the vape life on a whole notha plane!`);
	return 12;
});

// cigs_lighters.dm:641
rt.def("/obj/item/clothing/mask/vape/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.create_reagents(this.chem_volume);
	this.reagents.set_reacting(0);
	yield* this.reagents.add_reagent("nicotine", 50);
	if (this.icon_state) return f.dot;
	if (!f.args[1]) {
		f.args[1] = pick("red", "blue", "black", "white", "green", "purple", "yellow", "orange");
	}
	this.icon_state = `${f.args[1]}_vape`;
	this.item_state = `${f.args[1]}_vape`;
	return f.dot;
}, true, { args: ["mapload", "param_color"] });

// cigs_lighters.dm:652
rt.def("/obj/item/clothing/mask/vape/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	if (rt.istype(O, T("/obj/item/weapon/reagent_containers")) && rt.bitAnd(O.container_type, OPENCONTAINER)) {
		if (this.reagents.total_volume < this.chem_volume) {
			if (O.reagents.total_volume > 0) {
				yield* O.reagents.trans_to(this, 25);
				to_chat(user, `<span class='notice'>You add the contents of ${O} to the ${this}</span>`);
			} else {
				to_chat(user, `<span class='warning'>The ${O} is empty!</span>`);
			}
		} else {
			to_chat(user, `<span class='warning'>${this} can't hold anymore reagents!</span>`);
		}
	}
	if (rt.istype(O, T("/obj/item/weapon/screwdriver"))) {
		if (!this.screw) {
			this.screw = 1;
			to_chat(user, `<span class='notice'>You open the cap on the ${this}</span>`);
			if (this.super) {
				this.add_overlay("vapeopen_med");
			} else {
				this.add_overlay("vapeopen_low");
			}
		} else {
			this.screw = 0;
			to_chat(user, `<span class='notice'>You close the cap on the ${this}</span>`);
			this.cut_overlays();
		}
	}
	if (!rt.istype(O, T("/obj/item/device/multitool"))) return f.dot;
	if (this.screw && !this.emagged) {
		if (!this.super) {
			this.cut_overlays();
			this.super = 1;
			to_chat(user, `<span class='notice'>You increase the voltage in the ${this}</span>`);
			this.add_overlay("vapeopen_med");
		} else {
			this.cut_overlays();
			this.super = 0;
			to_chat(user, `<span class='notice'>You decrease the voltage in the ${this}</span>`);
			this.add_overlay("vapeopen_low");
		}
	}
	if (!(this.screw && this.emagged)) return f.dot;
	to_chat(user, `<span class='notice'>The ${this.name} can't be modified!</span>`);
	return f.dot;
}, true);

// cigs_lighters.dm:694
rt.def("/obj/item/clothing/mask/vape/proc/emag_act", function emag_act(f: Frame, user: Value) {
	let sp: Value = null;
	if (this.screw) {
		if (!this.emagged) {
			this.cut_overlays();
			this.emagged = 1;
			this.super = 0;
			to_chat(user, `<span class='warning'>You maximize the voltage in the ${this}</span>`);
			this.add_overlay("vapeopen_high");
			(sp = new_(T("/datum/effect_system/spark_spread"))).set_up(5, 1, this);
			sp.start();
		} else {
			to_chat(user, `<span class='warning'>The ${this.name} is already emagged!</span>`);
		}
	} else {
		to_chat(user, "<span class='notice'>You need to open the cap to do that</span>");
	}
	return f.dot;
});

// cigs_lighters.dm:709
rt.def("/obj/item/clothing/mask/vape/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (this.reagents.total_volume > 0) {
		to_chat(user, `<span class='notice'>you empty ${this} of all reagents.</span>`);
		yield* this.reagents.clear_reagents();
	}
	return f.dot;
}, true);

// cigs_lighters.dm:715
rt.def("/obj/item/clothing/mask/vape/proc/equipped", function equipped(f: Frame, user: Value, slot: Value) {
	if (slot != slot_wear_mask) return f.dot;
	if (!this.screw) {
		to_chat(user, "<span class='notice'>You start puffing on the vape.</span>");
		this.reagents.set_reacting(1);
		if (!this.isprocessing) {
			this.isprocessing = 1;
			GLOB.SSobj.processing += this;
		}
	} else {
		to_chat(user, "<span class='warning'>You need to close the cap first!</span>");
	}
	return f.dot;
});

// cigs_lighters.dm:724
rt.def("/obj/item/clothing/mask/vape/proc/dropped", function dropped(f: Frame, user: Value) {
	let C: Value = null;
	if ((C = user).get_item_by_slot(slot_wear_mask) != this) return f.dot;
	this.reagents.set_reacting(0);
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return f.dot;
});

// cigs_lighters.dm:730
rt.def("/obj/item/clothing/mask/vape/proc/hand_reagents", function* hand_reagents(f: Frame) {
	let C: Value = null, fraction: Value = null, e: Value = null;
	if (!this.reagents.total_volume) return f.dot;
	if (rt.istype(this.loc, T("/mob/living/carbon"))) {
		C = this.loc;
		if (this == C.wear_mask) {
			fraction = min(REAGENTS_METABOLISM / this.reagents.total_volume, 1);
			yield* this.reagents.reaction(C, INGEST, fraction);
			if (!(yield* this.reagents.trans_to(C, REAGENTS_METABOLISM))) {
				yield* this.reagents.remove_any(REAGENTS_METABOLISM);
			}
			if (this.reagents.get_reagent_amount("welding_fuel")) {
				C.fire_stacks = 2;
				yield* C.IgniteMob();
			}
			if (this.reagents.get_reagent_amount("plasma")) {
				yield* (e = (yield* new_(T("/datum/effect_system/reagents_explosion")))).set_up(round(this.reagents.get_reagent_amount("plasma") / 2.5, 1), rt.getStep(f, this, 0), 0, 0);
				yield* e.start();
				yield* qdel(this);
			}
			return f.dot;
		}
	}
	yield* this.reagents.remove_any(REAGENTS_METABOLISM);
	return f.dot;
}, true);

// cigs_lighters.dm:752
rt.def("/obj/item/clothing/mask/vape/proc/process", function* process(f: Frame) {
	let s: Value = null, sp: Value = null;
	let M: Value = this.loc;
	if (rt.istype(this.loc, T("/mob/living"))) {
		yield* M.IgniteMob();
	}
	this.vapetime++;
	if (!this.reagents.total_volume) {
		if (ismob(this.loc)) {
			to_chat(M, `<span class='notice'>The ${this.name} is empty!</span>`);
			this.isprocessing = 0;
			GLOB.SSobj.processing -= this;
		}
		return f.dot;
	}
	if (this.super && this.vapetime > 3) {
		yield* (s = (yield* new_(T("/datum/effect_system/smoke_spread/chem")))).set_up(this.reagents, 1, this.loc, { silent: 1 });
		yield* s.start();
		this.vapetime = 0;
	}
	if (this.emagged && this.vapetime > 3) {
		yield* (s = (yield* new_(T("/datum/effect_system/smoke_spread/chem")))).set_up(this.reagents, 4, this.loc, { silent: 1 });
		yield* s.start();
		this.vapetime = 0;
		if (prob(5)) {
			playsound(rt.getStep(f, this, 0), rt.rsc("sound/effects/pop_expl.ogg"), 50, 0);
			yield* M.apply_damage(20, "fire", "head");
			yield* M.Knockdown(300, 1, 0);
			yield* (sp = (yield* new_(T("/datum/effect_system/spark_spread")))).set_up(5, 1, this);
			yield* sp.start();
			to_chat(M, `<span class='userdanger'>The ${this.name} suddenly explodes in your mouth!</span>`);
			yield* qdel(this);
			return f.dot;
		}
	}
	if (!(this.reagents && this.reagents.total_volume)) return f.dot;
	yield* this.hand_reagents();
	return f.dot;
}, true, { waitfor: false });
