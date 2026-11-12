// Based on /tg/station's code/game/gamemodes/cult/cult_items.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(5657, "/obj/item/weapon/melee/cultblade", "/obj/item/weapon/melee", {
	flags: 64,
	name: "eldritch longsword",
	desc: "A sword humming with unholy energy. It glows with a dim red light.",
	icon_state: "cultblade",
	item_state: "cultblade",
	sharpness: 1,
	w_class: 4,
	force: 30,
	throwforce: 10,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	attack_verb: null,
});

// cult_items.dm:16
rt.def("/obj/item/weapon/melee/cultblade/proc/attack", function* attack(f: Frame, target: Value, user: Value) {
	let H: Value = null;
	if (!iscultist(user)) {
		yield* user.Knockdown(100);
		yield* user.dropItemToGround(this, 1);
		user.visible_message(`<span class='warning'>A powerful force shoves ${user} away from ${target}!</span>`, "<span class='cultlarge'>\"You shouldn't play with sharp things. You'll poke someone's eye out.\"</span>");
		if (rt.istype(user, T("/mob/living/carbon/human"))) {
			yield* (H = user).apply_damage(rand(this.force / 2, this.force), "brute", pick("l_arm", "r_arm"));
		} else {
			yield* user.adjustBruteLoss(rand(this.force / 2, this.force));
		}
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// cult_items.dm:35
rt.def("/obj/item/weapon/melee/cultblade/proc/pickup", function* pickup(f: Frame, user: Value) {
	yield* parent_proc();
	if (iscultist(user)) return f.dot;
	if (!is_servant_of_ratvar(user)) {
		to_chat(user, "<span class='cultlarge'>\"I wouldn't advise that.\"</span>");
		to_chat(user, "<span class='warning'>An overwhelming sense of nausea overpowers you!</span>");
		user.Dizzy(120);
	} else {
		to_chat(user, `<span class='cultlarge'>"One of Ratvar's toys is trying to play with things ${user.p_they()} shouldn't. Cute."</span>`);
		to_chat(user, "<span class='userdanger'>A horrible force yanks at your arm!</span>");
		yield* user.emote("scream");
		yield* user.apply_damage(30, "brute", pick("l_arm", "r_arm"));
		yield* user.dropItemToGround(this);
	}
	return f.dot;
}, true);

rt.type(5659, "/obj/item/weapon/melee/cultblade/dagger", "/obj/item/weapon/melee/cultblade", {
	name: "sacrificial dagger",
	desc: "A strange dagger said to be used by sinister groups for \"preparing\" a corpse before sacrificing it to their dark gods.",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "render",
	w_class: 2,
	force: 15,
	throwforce: 25,
	embed_chance: 75,
});

// cult_items.dm:59
rt.def("/obj/item/weapon/melee/cultblade/dagger/proc/attack", function* attack(f: Frame, target: Value, user: Value) {
	let C: Value = null;
	yield* parent_proc();
	if (!rt.istype(target, T("/mob/living/carbon"))) return f.dot;
	yield* (C = target).bleed(50);
	if (!(is_servant_of_ratvar(C) && C.reagents)) return f.dot;
	yield* C.reagents.add_reagent("heparin", 1);
	return f.dot;
}, true);

rt.type(8025, "/obj/item/clothing/head/culthood", "/obj/item/clothing/head", {
	name: "ancient cultist hood",
	icon_state: "culthood",
	desc: "A torn, dust-caked hood. Strange letters line the inside.",
	flags_inv: 416,
	flags_cover: 4,
	armor: null,
	cold_protection: 1,
	min_cold_protection_temperature: 160,
	heat_protection: 1,
	max_heat_protection_temperature: 600,
});

// cult_items.dm:81
rt.def("/obj/item/clothing/head/culthood/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 30, "bullet", 10, "laser", 5, "energy", 5, "bomb", 0, "bio", 0, "rad", 0, "fire", 10, "acid", 10]);
	return f.dot;
});

rt.type(7805, "/obj/item/clothing/suit/cultrobes", "/obj/item/clothing/suit", {
	name: "ancient cultist robes",
	desc: "A ragged, dusty set of robes. Strange letters line the inside.",
	icon_state: "cultrobes",
	item_state: "cultrobes",
	body_parts_covered: 414,
	allowed: null,
	armor: null,
	flags_inv: 4,
	cold_protection: 414,
	min_cold_protection_temperature: 160,
	heat_protection: 414,
	max_heat_protection_temperature: 600,
});

// cult_items.dm:93
rt.def("/obj/item/clothing/suit/cultrobes/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.allowed = list(T("/obj/item/weapon/tome"), T("/obj/item/weapon/melee/cultblade"));
	this.armor = rt.alist(f, ["melee", 50, "bullet", 30, "laser", 50, "energy", 20, "bomb", 25, "bio", 10, "rad", 0, "fire", 10, "acid", 10]);
	return f.dot;
});

rt.type(8028, "/obj/item/clothing/head/magus", "/obj/item/clothing/head", {
	name: "magus helm",
	icon_state: "magus",
	item_state: "magus",
	desc: "A helm worn by the followers of Nar-Sie.",
	flags_inv: 992,
	armor: null,
	flags_cover: 20,
});

// cult_items.dm:127
rt.def("/obj/item/clothing/head/magus/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 30, "bullet", 30, "laser", 30, "energy", 20, "bomb", 0, "bio", 0, "rad", 0, "fire", 10, "acid", 10]);
	return f.dot;
});

rt.type(7808, "/obj/item/clothing/suit/magusred", "/obj/item/clothing/suit", {
	name: "magus robes",
	desc: "A set of armored robes worn by the followers of Nar-Sie",
	icon_state: "magusred",
	item_state: "magusred",
	body_parts_covered: 414,
	allowed: null,
	armor: null,
	flags_inv: 13,
});

// cult_items.dm:136
rt.def("/obj/item/clothing/suit/magusred/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.allowed = list(T("/obj/item/weapon/tome"), T("/obj/item/weapon/melee/cultblade"));
	this.armor = rt.alist(f, ["melee", 50, "bullet", 30, "laser", 50, "energy", 20, "bomb", 25, "bio", 10, "rad", 0, "fire", 10, "acid", 10]);
	return f.dot;
});

rt.type(7936, "/obj/item/clothing/head/helmet/space/hardsuit/cult", "/obj/item/clothing/head/helmet/space/hardsuit", {
	name: "nar-sien hardened helmet",
	desc: "A heavily-armored helmet worn by warriors of the Nar-Sien cult. It can withstand hard vacuum.",
	icon_state: "cult_helmet",
	item_state: "cult_helmet",
	armor: null,
	brightness_on: 0,
	actions_types: null,
});

// cult_items.dm:145
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/cult/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 60, "bullet", 50, "laser", 30, "energy", 15, "bomb", 30, "bio", 30, "rad", 30, "fire", 40, "acid", 75]);

	this.actions_types = list();
	return f.dot;
});

rt.type(7703, "/obj/item/clothing/suit/space/hardsuit/cult", "/obj/item/clothing/suit/space/hardsuit", {
	name: "nar-sien hardened armor",
	icon_state: "cult_armor",
	item_state: "cult_armor",
	desc: "A heavily-armored exosuit worn by warriors of the Nar-Sien cult. It can withstand hard vacuum.",
	w_class: 2,
	allowed: null,
	armor: null,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/cult"),
});

// cult_items.dm:155
rt.def("/obj/item/clothing/suit/space/hardsuit/cult/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.allowed = list(T("/obj/item/weapon/tome"), T("/obj/item/weapon/melee/cultblade"), T("/obj/item/weapon/tank/internals"));
	this.armor = rt.alist(f, ["melee", 70, "bullet", 50, "laser", 30, "energy", 15, "bomb", 30, "bio", 30, "rad", 30, "fire", 40, "acid", 75]);
	return f.dot;
});

rt.type(7811, "/obj/item/clothing/suit/hooded/cultrobes/cult_shield", "/obj/item/clothing/suit/hooded/cultrobes", {
	current_charges: 3,
	name: "empowered cultist armor",
	desc: "Empowered garb which creates a powerful shield around the user.",
	icon_state: "cult_armor",
	item_state: "cult_armor",
	w_class: 4,
	armor: null,
	body_parts_covered: 414,
	allowed: null,
	hoodtype: rt.typePath("/obj/item/clothing/head/hooded/cult_hoodie"),
});

// cult_items.dm:173
rt.def("/obj/item/clothing/suit/hooded/cultrobes/cult_shield/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 50, "bullet", 40, "laser", 50, "energy", 30, "bomb", 50, "bio", 30, "rad", 30, "fire", 50, "acid", 60]);

	this.allowed = list(T("/obj/item/weapon/tome"), T("/obj/item/weapon/melee/cultblade"));
	return f.dot;
});

rt.type(8030, "/obj/item/clothing/head/hooded/cult_hoodie", "/obj/item/clothing/head/hooded", {
	name: "empowered cultist armor",
	desc: "Empowered garb which creates a powerful shield around the user.",
	icon_state: "cult_hoodalt",
	armor: null,
	body_parts_covered: 1,
	flags_inv: 416,
});

// cult_items.dm:183
rt.def("/obj/item/clothing/head/hooded/cult_hoodie/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 50, "bullet", 40, "laser", 50, "energy", 30, "bomb", 50, "bio", 30, "rad", 30, "fire", 50, "acid", 50]);
	return f.dot;
});

// cult_items.dm:188
rt.def("/obj/item/clothing/suit/hooded/cultrobes/cult_shield/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	yield* parent_proc();
	if (iscultist(user)) return f.dot;
	if (!is_servant_of_ratvar(user)) {
		to_chat(user, "<span class='cultlarge'>\"I wouldn't advise that.\"</span>");
		to_chat(user, "<span class='warning'>An overwhelming sense of nausea overpowers you!</span>");
		yield* user.dropItemToGround(this, 1);
		user.Dizzy(30);
		yield* user.Knockdown(100);
	} else {
		to_chat(user, "<span class='cultlarge'>\"Trying to use things you don't own is bad, you know.\"</span>");
		to_chat(user, "<span class='userdanger'>The armor squeezes at your body!</span>");
		yield* user.emote("scream");
		yield* user.adjustBruteLoss(25);
		yield* user.dropItemToGround(this, 1);
	}
	return f.dot;
}, true);

// cult_items.dm:205
rt.def("/obj/item/clothing/suit/hooded/cultrobes/cult_shield/proc/hit_reaction", function* hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	attack_text ??= "the attack";
	final_block_chance ??= 0;
	damage ??= 0;
	attack_type ??= 1;
	if (this.current_charges) {
		owner.visible_message(fmt("<span class='danger'>＄！ is deflected in a burst of blood-red sparks!</span>", [attack_text]));
		this.current_charges--;
		yield* new_(T("/obj/effect/temp_visual/cult/sparks"), rt.getStep(f, owner, 0));
		if (!this.current_charges) {
			owner.visible_message(`<span class='danger'>The runed shield around ${owner} suddenly disappears!</span>`);
			yield* owner.update_inv_wear_suit();
		}
		return 1;
	}
	return 0;
}, true);

// cult_items.dm:215
rt.def("/obj/item/clothing/suit/hooded/cultrobes/cult_shield/proc/worn_overlays", function worn_overlays(f: Frame, isinhands: Value) {
	f.dot = list();
	if (!(!isinhands && this.current_charges)) return f.dot;
	f.dot += mutable_appearance(rt.rsc("icons/effects/cult_effects.dmi"), "shield-cult", 4.01);
	return f.dot;
});

rt.type(7812, "/obj/item/clothing/suit/hooded/cultrobes/berserker", "/obj/item/clothing/suit/hooded/cultrobes", {
	name: "flagellant's robes",
	desc: "Blood-soaked robes infused with dark magic; allows the user to move at inhuman speeds, but at the cost of increased damage.",
	icon_state: "cultrobes",
	item_state: "cultrobes",
	flags_inv: 4,
	allowed: null,
	body_parts_covered: 414,
	armor: null,
	slowdown: -1,
	hoodtype: rt.typePath("/obj/item/clothing/head/hooded/berserkerhood"),
});

// cult_items.dm:225
rt.def("/obj/item/clothing/suit/hooded/cultrobes/berserker/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.allowed = list(T("/obj/item/weapon/tome"), T("/obj/item/weapon/melee/cultblade"));
	this.armor = rt.alist(f, ["melee", -50, "bullet", -50, "laser", -50, "energy", -50, "bomb", -50, "bio", -50, "rad", -50, "fire", 0, "acid", 0]);
	return f.dot;
});

rt.type(8031, "/obj/item/clothing/head/hooded/berserkerhood", "/obj/item/clothing/head/hooded", {
	name: "flagellant's robes",
	desc: "Blood-soaked garb infused with dark magic; allows the user to move at inhuman speeds, but at the cost of increased damage.",
	icon_state: "culthood",
	body_parts_covered: 1,
	flags_inv: 416,
	armor: null,
});

// cult_items.dm:237
rt.def("/obj/item/clothing/head/hooded/berserkerhood/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", -50, "bullet", -50, "laser", -50, "energy", -50, "bomb", -50, "bio", -50, "rad", -50, "fire", 0, "acid", 0]);
	return f.dot;
});

// cult_items.dm:240
rt.def("/obj/item/clothing/suit/hooded/cultrobes/berserker/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	yield* parent_proc();
	if (iscultist(user)) return f.dot;
	if (!is_servant_of_ratvar(user)) {
		to_chat(user, "<span class='cultlarge'>\"I wouldn't advise that.\"</span>");
		to_chat(user, "<span class='warning'>An overwhelming sense of nausea overpowers you!</span>");
		yield* user.dropItemToGround(this, 1);
		user.Dizzy(30);
		yield* user.Knockdown(100);
	} else {
		to_chat(user, "<span class='cultlarge'>\"Trying to use things you don't own is bad, you know.\"</span>");
		to_chat(user, "<span class='userdanger'>The robes squeeze at your body!</span>");
		yield* user.emote("scream");
		yield* user.adjustBruteLoss(25);
		yield* user.dropItemToGround(this, 1);
	}
	return f.dot;
}, true);

rt.type(8209, "/obj/item/clothing/glasses/night/cultblind", "/obj/item/clothing/glasses/night", {
	desc: "May nar-sie guide you through the darkness and shield you from the light.",
	name: "zealot's blindfold",
	icon_state: "blindfold",
	item_state: "blindfold",
	darkness_view: 8,
	flash_protect: 1,
});

// cult_items.dm:264
rt.def("/obj/item/clothing/glasses/night/cultblind/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	yield* parent_proc();
	if (iscultist(user)) return f.dot;
	to_chat(user, "<span class='cultlarge'>\"You want to be blind, do you?\"</span>");
	yield* user.dropItemToGround(this, 1);
	user.Dizzy(30);
	yield* user.Knockdown(100);
	yield* user.blind_eyes(30);
	return f.dot;
}, true);

rt.type(5803, "/obj/item/weapon/reagent_containers/food/drinks/bottle/unholywater", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "flask of unholy water",
	desc: "Toxic to nonbelievers; reinvigorating to the faithful - this flask may be sipped or thrown.",
	icon_state: "holyflask",
	color: "#333333",
	list_reagents: null,
});

// cult_items.dm:277
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/unholywater/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["unholywater", 40]);
	return f.dot;
});

rt.type(9119, "/obj/item/device/shuttle_curse", "/obj/item/device", {
	name: "cursed orb",
	desc: "You peer within this smokey orb and glimpse terrible fates befalling the escape shuttle.",
	icon: rt.rsc("icons/obj/cult.dmi"),
	icon_state: "shuttlecurse",
}, { global: { curselimit: 736 } });

// cult_items.dm:287
rt.def("/obj/item/device/shuttle_curse/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let message: Value = null;
	if (!iscultist(user)) {
		yield* user.dropItemToGround(this, 1);
		yield* user.Knockdown(100);
		to_chat(user, `<span class='warning'>A powerful force shoves you away from ${this}!</span>`);
		return f.dot;
	}
	if (GLOB.curselimit > 1) {
		to_chat(user, "<span class='notice'>We have exhausted our ability to curse the shuttle.</span>");
		return f.dot;
	}
	if (rt.locateIn(f, T("/obj/singularity/narsie"), GLOB.poi_list)) {
		to_chat(user, "<span class='warning'>Nar-Sie is already on this plane, there is no delaying the end of all things.</span>");
		return f.dot;
	}
	if (GLOB.SSshuttle.emergency.mode != "call") return f.dot;
	// tg_js: a curse counts against the limit the moment it delays the shuttle (tg counted it after the 2 s wait below,
	// so orbs broken in that wait all got past the limit).
	GLOB.curselimit++;
	let cursetime: Value = 1800;
	let timer: Value = GLOB.SSshuttle.emergency.timeLeft(1) + cursetime;
	GLOB.SSshuttle.emergency.setTimer(timer);
	to_chat(user, "<span class='danger'>You shatter the orb! A dark essence spirals into the air, then disappears.</span>");
	playsound(user.loc, rt.rsc("sound/effects/glassbr1.ogg"), 50, 1);
	yield* qdel(this);
	yield* sleep(20);
	if (!GLOB.curses) {
		GLOB.curses = list("A fuel technician just slit his own throat and begged for death. The shuttle will be delayed by three minutes.", "The shuttle's navigation programming was replaced by a file containing two words, IT COMES. The shuttle will be delayed by three minutes.", "The shuttle's custodian tore out his guts and began painting strange shapes on the floor. The shuttle will be delayed by three minutes.", "A shuttle engineer began screaming 'DEATH IS NOT THE END' and ripped out wires until an arc flash seared off her flesh. The shuttle will be delayed by three minutes.", "A shuttle inspector started laughing madly over the radio and then threw herself into an engine turbine. The shuttle will be delayed by three minutes.", "The shuttle dispatcher was found dead with bloody symbols carved into their flesh. The shuttle will be delayed by three minutes.");
	}
	yield* priority_announce(`${(message = pick_n_take(GLOB.curses))}`, "System Failure", rt.rsc("sound/misc/notice1.ogg"));
	return f.dot;
}, true);

rt.type(9120, "/obj/item/device/cult_shift", "/obj/item/device", {
	uses: 4,
	name: "veil shifter",
	desc: "This relic teleports you forward a medium distance.",
	icon: rt.rsc("icons/obj/cult.dmi"),
	icon_state: "shifter",
});

// cult_items.dm:327
rt.def("/obj/item/device/cult_shift/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.uses) {
		to_chat(user, `<span class='cult'>It has ${this.uses} uses remaining.</span>`);
	} else {
		to_chat(user, "<span class='cult'>It seems drained.</span>");
	}
	return f.dot;
}, false);

// cult_items.dm:334
rt.def("/obj/item/device/cult_shift/proc/handle_teleport_grab", function* handle_teleport_grab(f: Frame, _T: Value, user: Value) {
	let C: Value = null, pulled: Value = null;
	if (!(C = user).pulling) return f.dot;
	yield* (pulled = C.pulling).forceMove(_T);
	f.dot = pulled;
	return f.dot;
}, true);

// cult_items.dm:341
rt.def("/obj/item/device/cult_shift/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let destination: Value = null, pulled: Value = null;
	if (!this.uses || !rt.istype(user, T("/mob/living/carbon"))) {
		to_chat(user, fmt("<span class='warning'>＄！ is dull and unmoving in your hands.</span>", [this]));
		return f.dot;
	}
	if (!iscultist(user)) {
		yield* user.dropItemToGround(this, 1);
		yield* step(this, pick(GLOB.alldirs));
		to_chat(user, fmt("<span class='warning'>＄！ flickers out of your hands, your connection to this dimension is too strong!</span>", [this]));
		return f.dot;
	}
	let C: Value = user;
	let mobloc: Value = rt.getStep(f, C, 0);
	if (destination = get_teleport_loc(mobloc, C, 9, 1, 3, 1, 0, 1)) {
		this.uses--;
		if (this.uses <= 0) {
			this.icon_state = "shifter_drained";
		}
		playsound(mobloc, "sparks", 50, 1);
		yield* new_(T("/obj/effect/temp_visual/dir_setting/cult/phase/out"), mobloc, C.dir);
		pulled = (yield* this.handle_teleport_grab(destination, C));
		yield* C.forceMove(destination);
		if (pulled) {
			yield* C.start_pulling(pulled);
		}
		yield* new_(T("/obj/effect/temp_visual/dir_setting/cult/phase"), destination, C.dir);
		playsound(destination, rt.rsc("sound/effects/phasein.ogg"), 25, 1);
		playsound(destination, "sparks", 50, 1);
	} else {
		to_chat(C, "<span class='danger'>The veil cannot be torn here!</span>");
	}
	return f.dot;
}, true);

rt.type(9123, "/obj/item/device/flashlight/flare/culttorch", "/obj/item/device/flashlight/flare", {
	charges: 5,
	name: "void torch",
	desc: "Used by veteran cultists to instantly transport items to their needful bretheren.",
	w_class: 2,
	brightness_on: 1,
	icon_state: "torch",
	item_state: "torch",
	color: "#ff0000",
	on_damage: 15,
	slot_flags: null,
	on: 1,
});

// cult_items.dm:387
rt.def("/obj/item/device/flashlight/flare/culttorch/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	let cultists: Value = null, M: Value = null, cultist_to_receive: Value = null;
	if (!proximity) {
		return f.dot;
	}
	if (rt.istype(A, T("/obj/item"))) {
		cultists = list();
		for (M of each(GLOB.SSticker.mode.cult, T("/datum/mind"))) {
			if (M.current && M.current.stat != 2) {
				(cultists = rt.modify(cultists, M.current, rt.bitOr));
			}
		}
		cultist_to_receive = (yield* g.op(f, "Prompt", [1], [null, "Followers of the Geometer", `Who do you wish to call to ${this}?`, user, cultists - user]));
		if (!this.Adjacent(user) || !this || !this || this.gc_destroyed || user.incapacitated()) {
			return f.dot;
		}
		if (!cultist_to_receive) {
			to_chat(user, "<span class='cultitalic'>You require a destination!</span>");
			log_game("Void torch failed - no target");
			return f.dot;
		}
		if (cultist_to_receive.stat == 2) {
			to_chat(user, `<span class='cultitalic'>${cultist_to_receive} has died!</span>`);
			log_game("Void torch failed  - target died");
			return f.dot;
		}
		if (!iscultist(cultist_to_receive)) {
			to_chat(user, `<span class='cultitalic'>${cultist_to_receive} is not a follower of the Geometer!</span>`);
			log_game("Void torch failed - target was deconverted");
			return f.dot;
		}
		if (rt.isIn(f, A, user.GetAllContents())) {
			to_chat(user, `<span class='cultitalic'>${A} must be on a surface in order to teleport it!</span>`);
			return f.dot;
		}
		to_chat(user, fmt("<span class='cultitalic'>You ignite ＀ with ％！, turning it to ash, but through the torch's flames you see that ＀ has reached ＀!", [A, this, A, cultist_to_receive]));
		yield* cultist_to_receive.put_in_hands(A);
		this.charges--;
		to_chat(user, fmt("＄！ now has ＀ charge５.", [this, this.charges]));
		if (this.charges == 0) {
			yield* qdel(this);
		}
	} else {
		yield* parent_proc();
		to_chat(user, fmt("<span class='warning'>＄！ can only transport items!</span>", [this]));
	}
	return f.dot;
}, true);
