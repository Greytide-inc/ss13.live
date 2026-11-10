// Based on /tg/station's code/game/objects/items/weapons/holy_weapons.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(7239, "/obj/item/weapon/nullrod", "/obj/item/weapon", {
	reskinned: 0,
	throw_speed: 3,
	throw_range: 4,
	name: "null rod",
	desc: "A rod of pure obsidian, its very presence disrupts and dampens the powers of Nar-Sie's followers.",
	icon_state: "nullrod",
	item_state: "nullrod",
	force: 18,
	throwforce: 10,
	w_class: 1,
});

// holy_weapons.dm:14
rt.def("/obj/item/weapon/nullrod/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is killing ${user.p_them()}self with ${this}! It looks like ${user.p_theyre()} trying to get closer to god!</span>`);
	return 3;
});

// holy_weapons.dm:18
rt.def("/obj/item/weapon/nullrod/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (!(user.mind && user.mind.isholy && !this.reskinned)) return f.dot;
	yield* this.reskin_holy_weapon(user);
	return f.dot;
}, true);

// holy_weapons.dm:22
rt.def("/obj/item/weapon/nullrod/proc/reskin_holy_weapon", function* reskin_holy_weapon(f: Frame, M: Value) {
	let V: Value = null, A: Value = null;
	if (GLOB.SSreligion.holy_weapon_type) {
		return f.dot;
	}
	let holy_weapons_list: Value = typesof(T("/obj/item/weapon/nullrod"));
	let display_names: Value = list();
	for (V of each(holy_weapons_list)) {
		display_names += rt.initial(f, (A = V), "name");
	}
	let choice: Value = (yield* g.op(f, "Prompt", [1], [null, "Holy Weapon Theme", "What theme would you like for your holy weapon?", M, display_names]));
	if (!this || this.gc_destroyed || !choice || M.stat || !(get_dist(M, this) <= 1) || M.restrained() || !M.canmove || this.reskinned) {
		return f.dot;
	}
	let index: Value = display_names.Find(choice);
	let A_5: Value = rt.index(holy_weapons_list, index);
	let holy_weapon: Value = (yield* new_(A_5));
	GLOB.SSreligion.holy_weapon_type = holy_weapon.type;
	if (!holy_weapon) return f.dot;
	holy_weapon.reskinned = 1;
	yield* qdel(this);
	yield* M.put_in_active_hand(holy_weapon);
	return f.dot;
}, true);

rt.type(7241, "/obj/item/weapon/nullrod/staff", "/obj/item/weapon/nullrod", {
	shield_icon: "shield-red",
	icon_state: "godstaff-red",
	item_state: "godstaff-red",
	name: "red holy staff",
	desc: "It has a mysterious, protective aura.",
	w_class: 5,
	force: 5,
	slot_flags: 1024,
	block_chance: 50,
});

// holy_weapons.dm:72
rt.def("/obj/item/weapon/nullrod/staff/proc/worn_overlays", function worn_overlays(f: Frame, isinhands: Value) {
	f.dot = list();
	if (!isinhands) return f.dot;
	f.dot += mutable_appearance(rt.rsc("icons/effects/effects.dmi"), this.shield_icon, 4.01);
	return f.dot;
});

rt.type(7243, "/obj/item/weapon/nullrod/claymore", "/obj/item/weapon/nullrod", {
	icon_state: "claymore",
	item_state: "claymore",
	name: "holy claymore",
	desc: "A weapon fit for a crusade!",
	w_class: 5,
	slot_flags: 1536,
	block_chance: 30,
	sharpness: 1,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	attack_verb: null,
});

// holy_weapons.dm:95
rt.def("/obj/item/weapon/nullrod/claymore/proc/hit_reaction", function hit_reaction(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = "the attack";
	}
	if (f.args[3] === null) {
		f.args[3] = 0;
	}
	if (f.args[4] === null) {
		f.args[4] = 0;
	}
	if (f.args[5] === null) {
		f.args[5] = 1;
	}
	if (f.args[5] == 3) {
		f.args[3] = 0;
	}
	return parent_proc();
}, false, { args: ["owner", "hitby", "attack_text", "final_block_chance", "damage", "attack_type"] });

rt.type(7248, "/obj/item/weapon/nullrod/claymore/multiverse", "/obj/item/weapon/nullrod/claymore", {
	name: "extradimensional blade",
	desc: "Once the harbinger of an interdimensional war, its sharpness fluctuates wildly.",
	icon_state: "multiverse",
	item_state: "multiverse",
	slot_flags: 512,
});

// holy_weapons.dm:138
rt.def("/obj/item/weapon/nullrod/claymore/multiverse/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	this.force = rand(1, 30);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(7257, "/obj/item/weapon/nullrod/scythe/talking", "/obj/item/weapon/nullrod/scythe", {
	possessed: 0,
	icon_state: "talking_sword",
	item_state: "talking_sword",
	name: "possessed blade",
	desc: "When the station falls into chaos, it's nice to have a friend by your side.",
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/rapierhit.ogg"),
});

// holy_weapons.dm:213
rt.def("/obj/item/weapon/nullrod/scythe/talking/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let theghost: Value = null, S: Value = null, input: Value = null;
	if (this.possessed) {
		return f.dot;
	}
	to_chat(user, "You attempt to wake the spirit of the blade...");
	this.possessed = 1;
	let candidates: Value = (yield* pollGhostCandidates(`Do you want to play as the spirit of ${user.real_name}'s blade?`, "pAI", null, 0, 100, "possessed_blade"));
	if (rt.length(candidates)) {
		theghost = pick(candidates);
		(S = (yield* new_(T("/mob/living/simple_animal/shade"), this))).real_name = this.name;
		S.name = this.name;
		S.ckey = theghost.ckey;
		(rt.modField(f, S, "status_flags", 4096, rt.bitOr));
		input = (yield* stripped_input(S, "What are you named?", null, "", 42));
		if (this && input) {
			this.name = input;
			S.real_name = input;
			S.name = input;
		}
	} else {
		to_chat(user, "The blade is dormant. Maybe you can try again later.");
		this.possessed = 0;
	}
	return f.dot;
}, true);

// holy_weapons.dm:238
rt.def("/obj/item/weapon/nullrod/scythe/talking/proc/Destroy", function* Destroy(f: Frame) {
	let S: Value = null;
	for (S of each(this.contents, T("/mob/living/simple_animal/shade"))) {
		to_chat(S, "You were destroyed!");
		yield* qdel(S);
	}
	return (yield* parent_proc());
}, true);

rt.type(7264, "/obj/item/weapon/nullrod/carp", "/obj/item/weapon/nullrod", {
	used_blessing: 0,
	name: "carp-sie plushie",
	desc: "An adorable stuffed toy that resembles the god of all carp. The teeth look pretty sharp. Activate it to receive the blessing of Carp-Sie.",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "carpplushie",
	item_state: "carp_plushie",
	force: 15,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/bite.ogg"),
});

// holy_weapons.dm:317
rt.def("/obj/item/weapon/nullrod/carp/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (!this.used_blessing) {
		if (!(user.mind && user.mind.isholy)) return f.dot;
		to_chat(user, "You are blessed by Carp-Sie. Wild space carp will no longer attack you.");
		(rt.modField(f, user, "faction", "carp", rt.bitOr));
		this.used_blessing = 1;
	}
	return f.dot;
});

rt.type(7265, "/obj/item/weapon/nullrod/tribal_knife", "/obj/item/weapon/nullrod", {
	icon_state: "crysknife",
	item_state: "crysknife",
	name: "arrhythmic knife",
	w_class: 5,
	desc: "They say fear is the true mind killer, but stabbing them in the head works too. Honour compels you to not sheathe it once drawn.",
	sharpness: 1,
	slot_flags: null,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	attack_verb: null,
});

// holy_weapons.dm:349
rt.def("/obj/item/weapon/nullrod/tribal_knife/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	if (!this.secondary_flags) {
		this.secondary_flags = list();
	}
	rt.setAt(this.secondary_flags, "slows_while_in_hand", 1);
	return f.dot;
}, true);

// holy_weapons.dm:353
rt.def("/obj/item/weapon/nullrod/tribal_knife/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// holy_weapons.dm:357
rt.def("/obj/item/weapon/nullrod/tribal_knife/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// holy_weapons.dm:361
rt.def("/obj/item/weapon/nullrod/tribal_knife/proc/process", function process(f: Frame) {
	this.slowdown = rand(-2, 2);
	return f.dot;
}, false, { waitfor: false });
