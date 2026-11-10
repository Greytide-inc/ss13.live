// Based on /tg/station's code/game/objects/structures/ghost_role_spawners.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(11956, "/obj/effect/mob_spawn/human/seed_vault", "/obj/effect/mob_spawn/human", {
	name: "preserved terrarium",
	desc: "An ancient machine that seems to be used for storing plant matter. The glass is obstructed by a mat of vines.",
	mob_name: "a lifebringer",
	icon: rt.rsc("icons/obj/lavaland/spawners.dmi"),
	icon_state: "terrarium",
	density: 1,
	roundstart: 0,
	death: 0,
	mob_species: rt.typePath("/datum/species/pod"),
	flavour_text: "<font size=3><b>Y</b></font><b>ou are a sentient ecosystem - an example of the mastery over life that your creators possessed. Your masters, benevolent as they were, created uncounted seed vaults and spread them across the universe to every planet they could chart. You are in one such seed vault. Your goal is to cultivate and spread life wherever it will go while waiting for contact from your creators. Estimated time of last contact: Deployment, 5x10^3 millennia ago.</b>",
});

// ghost_role_spawners.dm:19
rt.def("/obj/effect/mob_spawn/human/seed_vault/proc/special", function* special(f: Frame, new_spawn: Value) {
	let H: Value = null;
	let plant_name: Value = pick("Tomato", "Potato", "Broccoli", "Carrot", "Ambrosia", "Pumpkin", "Ivy", "Kudzu", "Banana", "Moss", "Flower", "Bloom", "Root", "Bark", "Glowshroom", "Petal", "Leaf", "Venus", "Sprout", "Cocoa", "Strawberry", "Citrus", "Oak", "Cactus", "Pepper", "Juniper");
	new_spawn.real_name = plant_name;
	if (!rt.istype(new_spawn, T("/mob/living/carbon/human"))) return f.dot;
	(H = new_spawn).underwear = "Nude";
	yield* H.update_body();
	return f.dot;
}, true);

// ghost_role_spawners.dm:28
rt.def("/obj/effect/mob_spawn/human/seed_vault/proc/Destroy", function* Destroy(f: Frame) {
	yield* new_(T("/obj/structure/fluff/empty_terrarium"), rt.getStep(f, this, 0));
	return (yield* parent_proc());
}, true);

rt.type(11957, "/obj/effect/mob_spawn/human/ash_walker", "/obj/effect/mob_spawn/human", {
	anchored: 0,
	name: "ash walker egg",
	desc: "A man-sized yellow egg, spawned from some unfathomable creature. A humanoid silhouette lurks within.",
	mob_name: "an ash walker",
	icon: rt.rsc("icons/mob/lavaland/lavaland_monsters.dmi"),
	icon_state: "large_egg",
	mob_species: rt.typePath("/datum/species/lizard/ashwalker"),
	outfit: rt.typePath("/datum/outfit/ashwalker"),
	roundstart: 0,
	death: 0,
	density: 0,
	flavour_text: "<font size=3><b>Y</b></font><b>ou are an ash walker. Your tribe worships <span class='danger'>the Necropolis</span>. The wastes are sacred ground, its monsters a blessed bounty. You have seen lights in the distance... they foreshadow the arrival of outsiders that seek to tear apart the Necropolis and its domain. Fresh sacrifices for your nest.</b>",
});

// ghost_role_spawners.dm:49
rt.def("/obj/effect/mob_spawn/human/ash_walker/proc/special", function* special(f: Frame, new_spawn: Value) {
	let holder: Value = null, H: Value = null;
	new_spawn.real_name = random_unique_lizard_name(this.gender);
	to_chat(new_spawn, "<b>Drag the corpses of men and beasts to your nest. It will absorb them to create more of your kind. Glory to the Necropolis!</b>");
	yield* new_spawn.grant_language(T("/datum/language/draconic"));
	(holder = (yield* new_spawn.get_language_holder())).selected_default_language = T("/datum/language/draconic");
	if (!rt.istype(new_spawn, T("/mob/living/carbon/human"))) return f.dot;
	(H = new_spawn).underwear = "Nude";
	yield* H.update_body();
	return f.dot;
}, true);

// ghost_role_spawners.dm:62
rt.def("/obj/effect/mob_spawn/human/ash_walker/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	let A: Value = null;
	f.dot = (yield* parent_proc());
	if (!(A = get_area(this))) return f.dot;
	yield* notify_ghosts(fmt("An ash walker egg is ready to hatch in ％！.", [A.name]), { source: this, action: "attack", flashwindow: 0 });
	return f.dot;
}, true);

rt.type(11958, "/obj/effect/mob_spawn/human/exile", "/obj/effect/mob_spawn/human", {
	name: "timeless prison",
	desc: "Although this stasis pod looks medicinal, it seems as though it's meant to preserve something for a very long time.",
	mob_name: "a penitent exile",
	icon: rt.rsc("icons/obj/cryogenic2.dmi"),
	icon_state: "sleeper",
	roundstart: 0,
	death: 0,
	mob_species: rt.typePath("/datum/species/shadow"),
	flavour_text: "<font size=3><b>Y</b></font><b>ou are cursed. Years ago, you sacrificed the lives of your trusted friends and the humanity of yourself to reach the Wish Granter. Though you did so, it has come at a cost: your very body rejects the light, dooming you to wander endlessly in this horrible wasteland.</b>",
});

// ghost_role_spawners.dm:87
rt.def("/obj/effect/mob_spawn/human/exile/proc/Destroy", function* Destroy(f: Frame) {
	yield* new_(T("/obj/structure/fluff/empty_sleeper"), rt.getStep(f, this, 0));
	return (yield* parent_proc());
}, true);

// ghost_role_spawners.dm:91
rt.def("/obj/effect/mob_spawn/human/exile/proc/special", function special(f: Frame, new_spawn: Value) {
	let wish: Value = null;
	let $0: any, $1: any;
	new_spawn.real_name = `Wish Granter's Victim (${rand(0, 999)})`;
	const subject = (wish = rand(1, 4));
	if (subject === 1) {
		to_chat(new_spawn, "<b>You wished to kill, and kill you did. You've lost track of how many, but the spark of excitement that murder once held has winked out. You feel only regret.</b>");
	} else if (subject === 2) {
		to_chat(new_spawn, "<b>You wished for unending wealth, but no amount of money was worth this existence. Maybe charity might redeem your soul?</b>");
	} else if (subject === 3) {
		$0 = new_spawn;
		if (this.gender == "male") {
			$1 = "king";
		} else {
			$1 = "queen";
		}
		to_chat($0, `<b>You wished for power. Little good it did you, cast out of the light. You are the ${$1} of a hell that holds no subjects. You feel only remorse.</b>`);
	} else if (subject === 4) {
		to_chat(new_spawn, "<b>You wished for immortality, even as your friends lay dying behind you. No matter how many times you cast yourself into the lava, you awaken in this room again within a few days. There is no escape.</b>");
	}
	return f.dot;
});

rt.type(11959, "/obj/effect/mob_spawn/human/golem", "/obj/effect/mob_spawn/human", {
	has_owner: 0,
	can_transfer: 1,
	owner: null,
	anchored: 0,
	name: "inert free golem shell",
	desc: "A humanoid shape, empty, lifeless, and full of potential.",
	mob_name: "a free golem",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "construct",
	mob_species: rt.typePath("/datum/species/golem"),
	roundstart: 0,
	death: 0,
	density: 0,
	flavour_text: "<font size=3><b>Y</b></font><b>ou are a Free Golem. Your family worships <span class='danger'>The Liberator</span>. In his infinite and divine wisdom, he set your clan free to travel the stars with a single declaration: \"Yeah go do whatever.\" Though you are bound to the one who created you, it is customary in your society to repeat those same words to newborn golems, so that no golem may ever be forced to serve again.</b>",
});

// ghost_role_spawners.dm:123
rt.def("/obj/effect/mob_spawn/human/golem/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = null;
	}
	if (f.args[2] === null) {
		f.args[2] = null;
	}
	yield* parent_proc();
	if (f.args[1]) {
		this.name += ` (${rt.initial(f, f.args[1], "prefix")})`;
		this.mob_species = f.args[1];
	}
	let A: Value = get_area(this);
	if (!f.args[0] && A) {
		yield* notify_ghosts(fmt("＆！ golem shell has been completed in ％！.", [rt.initial(f, f.args[1], "prefix"), A.name]), { source: this, action: "attack", flashwindow: 0 });
	}
	if (!(this.has_owner && f.args[2])) return f.dot;
	this.flavour_text = `You are a golem. You move slowly, but are highly resistant to heat and cold as well as blunt trauma. You are unable to wear clothes, but can still use most tools. Serve ${f.args[2]}, and assist ${f.args[2].p_them()} in completing ${f.args[2].p_their()} goals at any cost.`;
	this.owner = f.args[2];
	return f.dot;
}, true, { args: ["mapload", "species", "creator"] });

// ghost_role_spawners.dm:136
rt.def("/obj/effect/mob_spawn/human/golem/proc/special", function* special(f: Frame, new_spawn: Value, name: Value) {
	let H: Value = null;
	let X: Value = this.mob_species;
	to_chat(new_spawn, `${rt.initial(f, X, "info_text")}`);
	if (!this.owner) {
		to_chat(new_spawn, "Build golem shells in the autolathe, and feed refined mineral sheets to the shells to bring them to life! You are generally a peaceful group unless provoked.");
	} else {
		new_spawn.mind.store_memory(`<b>Serve ${this.owner.real_name}, your creator.</b>`);
		yield* new_spawn.mind.enslave_mind_to_creator(this.owner);
		log_game(`${key_name(new_spawn)} possessed a golem shell enslaved to ${key_name(this.owner)}.`);
		log_admin(`${key_name(new_spawn)} possessed a golem shell enslaved to ${key_name(this.owner)}.`);
	}
	if (!rt.istype(new_spawn, T("/mob/living/carbon/human"))) return f.dot;
	yield* (H = new_spawn).set_cloned_appearance();
	if (!name) {
		if (this.has_owner) {
			H.real_name = `${rt.initial(f, X, "prefix")} Golem (${rand(1, 999)})`;
		} else {
			H.real_name = H.dna.species.random_name();
		}
	} else {
		H.real_name = name;
	}
	return f.dot;
}, true);

// ghost_role_spawners.dm:157
rt.def("/obj/effect/mob_spawn/human/golem/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let transfer_choice: Value = null;
	if (is_species(user, T("/datum/species/golem")) && this.can_transfer) {
		if ((transfer_choice = (yield* alert(`Transfer your soul to ${this}? (Warning, your old body will die!)`, null, "Yes", "No"))) != "Yes") {
			return f.dot;
		}
		if (!this || this.gc_destroyed || this.uses <= 0) {
			return f.dot;
		}
		log_game(`${user.ckey} golem-swapped into ${this}`);
		user.visible_message(`<span class='notice'>A faint light leaves ${user}, moving to ${this} and animating it!</span>`, `<span class='notice'>You leave your old body behind, and transfer into ${this}!</span>`);
		yield* this.create({ ckey: user.ckey, flavour: 0, name: user.real_name });
		yield* user.death();
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(11962, "/obj/effect/mob_spawn/human/hermit", "/obj/effect/mob_spawn/human", {
	name: "malfunctioning cryostasis sleeper",
	desc: "A humming sleeper with a silhouetted occupant inside. Its stasis function is broken and it's likely being used as a bed.",
	mob_name: "a stranded hermit",
	icon: rt.rsc("icons/obj/lavaland/spawners.dmi"),
	icon_state: "cryostasis_sleeper",
	roundstart: 0,
	death: 0,
	random: 1,
	mob_species: rt.typePath("/datum/species/human"),
	flavour_text: "<font size=3><b>Y</b></font><b>ou've been stranded in this godless prison of a planet for longer than you can remember. Each day you barely scrape by, and between the terrible conditions of your makeshift shelter, the hostile creatures, and the ash drakes swooping down from the cloudless skies, all you can wish for is the feel of soft grass between your toes and the fresh air of Earth. These thoughts are dispelled by yet another recollection of how you got here... ",
});

// ghost_role_spawners.dm:198
rt.def("/obj/effect/mob_spawn/human/hermit/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	let arrpee: Value = null;
	f.dot = (yield* parent_proc());
	const subject = (arrpee = rand(1, 4));
	if (subject === 1) {
		this.flavour_text += `you were a ${pick("arms dealer", "shipwright", "docking manager")}'s assistant on a small trading station several sectors from here. Raiders attacked, and there was only one pod left when you got to the escape bay. You took it and launched it alone, and the crowd of terrified faces crowding at the airlock door as your pod's engines burst to life and sent you to this hell are forever branded into your memory.</b>`;
		this.outfit.uniform = T("/obj/item/clothing/under/assistantformal");
		this.outfit.shoes = T("/obj/item/clothing/shoes/sneakers/black");
		this.outfit.back = T("/obj/item/weapon/storage/backpack");
	} else if (subject === 2) {
		this.flavour_text += "you're an exile from the Tiger Cooperative. Their technological fanaticism drove you to question the power and beliefs of the Exolitics, and they saw you as a heretic and subjected you to hours of horrible torture. You were hours away from execution when a high-ranking friend of yours in the Cooperative managed to secure you a pod, scrambled its destination's coordinates, and launched it. You awoke from stasis when you landed and have been surviving - barely - ever since.</b>";
		this.outfit.uniform = T("/obj/item/clothing/under/rank/prisoner");
		this.outfit.shoes = T("/obj/item/clothing/shoes/sneakers/orange");
		this.outfit.back = T("/obj/item/weapon/storage/backpack");
	} else if (subject === 3) {
		this.flavour_text += "you were a doctor on one of Nanotrasen's space stations, but you left behind that damn corporation's tyranny and everything it stood for. From a metaphorical hell to a literal one, you find yourself nonetheless missing the recycled air and warm floors of what you left behind... but you'd still rather be here than there.</b>";
		this.outfit.uniform = T("/obj/item/clothing/under/rank/medical");
		this.outfit.suit = T("/obj/item/clothing/suit/toggle/labcoat");
		this.outfit.back = T("/obj/item/weapon/storage/backpack/medic");
		this.outfit.shoes = T("/obj/item/clothing/shoes/sneakers/black");
	} else if (subject === 4) {
		this.flavour_text += "you were always joked about by your friends for \"not playing with a full deck\", as they so <i>kindly</i> put it. It seems that they were right when you, on a tour at one of Nanotrasen's state-of-the-art research facilities, were in one of the escape pods alone and saw the red button. It was big and shiny, and it caught your eye. You pressed it, and after a terrifying and fast ride for days, you landed here. You've had time to wisen up since then, and you think that your old friends wouldn't be laughing now.</b>";
		this.outfit.uniform = T("/obj/item/clothing/under/color/grey/glorf");
		this.outfit.shoes = T("/obj/item/clothing/shoes/sneakers/black");
		this.outfit.back = T("/obj/item/weapon/storage/backpack");
	}
	return f.dot;
}, true);

// ghost_role_spawners.dm:231
rt.def("/obj/effect/mob_spawn/human/hermit/proc/Destroy", function* Destroy(f: Frame) {
	yield* new_(T("/obj/structure/fluff/empty_cryostasis_sleeper"), rt.getStep(f, this, 0));
	return (yield* parent_proc());
}, true);

rt.type(11966, "/obj/effect/mob_spawn/human/prisoner_transport", "/obj/effect/mob_spawn/human", {
	name: "prisoner containment sleeper",
	desc: "A sleeper designed to put its occupant into a deep coma, unbreakable until the sleeper turns off. This one's glass is cracked and you can see a pale, sleeping face staring out.",
	mob_name: "an escaped prisoner",
	icon: rt.rsc("icons/obj/cryogenic2.dmi"),
	icon_state: "sleeper_s",
	outfit: rt.typePath("/datum/outfit/lavalandprisoner"),
	roundstart: 0,
	death: 0,
	flavour_text: "<font size=3><b>G</b></font><b>ood. It seems as though your ship crashed. You're a prisoner, sentenced to hard work in one of Nanotrasen's labor camps, but it seems as though fate has other plans for you. You remember that you were convicted of ",
});

// ghost_role_spawners.dm:257
rt.def("/obj/effect/mob_spawn/human/prisoner_transport/proc/special", function special(f: Frame, L: Value) {
	L.real_name = `NTP #LL-0${rand(111, 999)}`;
	L.name = L.real_name;
	return f.dot;
});

// ghost_role_spawners.dm:261
rt.def("/obj/effect/mob_spawn/human/prisoner_transport/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	let crimes: Value = null;
	f.dot = (yield* parent_proc());
	this.flavour_text += `${pick((crimes = list("murder", "larceny", "embezzlement", "unionization", "dereliction of duty", "kidnapping", "gross incompetence", "grand theft", "collaboration with the Syndicate", "worship of a forbidden deity", "interspecies relations", "mutiny")))}. but regardless of that, it seems like your crime doesn't matter now. You don't know where you are, but you know that it's out to kill you, and you're not going to lose this opportunity. Find a way to get out of this mess and back to where you rightfully belong - your ${pick("house", "apartment", "spaceship", "station")}</b>.`;
	return f.dot;
}, true);

// ghost_role_spawners.dm:276
rt.def("/obj/effect/mob_spawn/human/prisoner_transport/proc/Destroy", function* Destroy(f: Frame) {
	yield* new_(T("/obj/structure/fluff/empty_sleeper/syndicate"), rt.getStep(f, this, 0));
	return (yield* parent_proc());
}, true);

rt.type(624, "/datum/outfit/hotelstaff", "/datum/outfit", {
	name: "Hotel Staff",
	uniform: rt.typePath("/obj/item/clothing/under/assistantformal"),
	shoes: rt.typePath("/obj/item/clothing/shoes/laceup"),
	r_pocket: rt.typePath("/obj/item/device/radio/off"),
	back: rt.typePath("/obj/item/weapon/storage/backpack"),
	implants: null,
});

// ghost_role_spawners.dm:300
rt.def("/datum/outfit/hotelstaff/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.implants = list(T("/obj/item/weapon/implant/mindshield"));
	return f.dot;
});

rt.type(11967, "/obj/effect/mob_spawn/human/hotel_staff", "/obj/effect/mob_spawn/human", {
	name: "staff sleeper",
	desc: "A sleeper designed for long-term stasis between guest visits.",
	mob_name: "hotel staff member",
	icon: rt.rsc("icons/obj/cryogenic2.dmi"),
	icon_state: "sleeper_s",
	objectives: "Cater to visiting guests with your fellow staff. Do not leave your assigned hotel and always remember: The customer is always right!",
	death: 0,
	roundstart: 0,
	random: 1,
	outfit: rt.typePath("/datum/outfit/hotelstaff"),
	flavour_text: "You are a staff member of a top-of-the-line space hotel! Cater to guests and <font size=6><b>DON'T</b></font> leave the hotel, lest the manager fire you fordereliction of duty!",
});

// ghost_role_spawners.dm:320
rt.def("/obj/effect/mob_spawn/human/hotel_staff/proc/Destroy", function* Destroy(f: Frame) {
	yield* new_(T("/obj/structure/fluff/empty_sleeper/syndicate"), rt.getStep(f, this, 0));
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(11969, "/obj/effect/mob_spawn/human/demonic_friend", "/obj/effect/mob_spawn/human", {
	spell: null,
	owner: null,
	name: "Essence of friendship",
	desc: "Oh boy! Oh boy! A friend!",
	mob_name: "Demonic friend",
	icon: rt.rsc("icons/obj/cardboard_cutout.dmi"),
	icon_state: "cutout_basic",
	outfit: rt.typePath("/datum/outfit/demonic_friend"),
	death: 0,
	roundstart: 0,
	random: 1,
	id_job: "SuperFriend",
	id_access: "assistant",
});

// ghost_role_spawners.dm:339
rt.def("/obj/effect/mob_spawn/human/demonic_friend/proc/Initialize", function* Initialize(f: Frame, mapload: Value, owner_mind: Value, summoning_spell: Value) {
	f.dot = (yield* parent_proc());
	this.owner = owner_mind;
	this.flavour_text = `You have been given a reprieve from your eternity of torment, to be ${this.owner.name}'s friend for their short mortal coil.  Be aware that if you do not live up to ${this.owner.name}'s expectations, they can send you back to hell with a single thought.  ${this.owner.name}'s death will also return you to hell.`;
	let A: Value = get_area(this);
	if (!mapload && A) {
		yield* notify_ghosts(fmt("＆friendship shell has been completed in ％！.", [A.name]), { source: this, action: "attack", flashwindow: 0 });
	}
	this.objectives = `Be ${this.owner.name}'s friend, and keep ${this.owner.name} alive, so you don't get sent back to hell.`;
	this.spell = summoning_spell;
	return f.dot;
}, true);

// ghost_role_spawners.dm:350
rt.def("/obj/effect/mob_spawn/human/demonic_friend/proc/special", function* special(f: Frame, L: Value) {
	let H: Value = null, worn: Value = null, id: Value = null;
	if (!(!this.owner.current || this.owner.current.gc_destroyed) && this.owner.current.stat != 2) {
		L.real_name = `${this.owner.name}'s best friend`;
		L.name = L.real_name;
		yield* soullink(T("/datum/soullink/oneway"), this.owner.current, L);
		this.spell.friend = L;
		this.spell.charge_counter = this.spell.charge_max;
		L.mind.hasSoul = 0;
		H = L;
		worn = H.wear_id;
		(id = worn.GetID()).registered_name = L.real_name;
		id.update_label();
	} else {
		to_chat(L, "<span class='userdanger'>Your owner is already dead!  You will soon perish.</span>");
		yield* addtimer((yield* new_(T("/datum/callback"), L, P("/mob/proc/dust"), 150)));
	}
	return f.dot;
}, true);

rt.type(626, "/datum/outfit/demonic_friend", "/datum/outfit", {
	name: "Demonic Friend",
	uniform: rt.typePath("/obj/item/clothing/under/assistantformal"),
	shoes: rt.typePath("/obj/item/clothing/shoes/laceup"),
	r_pocket: rt.typePath("/obj/item/device/radio/off"),
	back: rt.typePath("/obj/item/weapon/storage/backpack"),
	implants: null,
	id: rt.typePath("/obj/item/weapon/card/id"),
});

// ghost_role_spawners.dm:372
rt.def("/datum/outfit/demonic_friend/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.implants = list(T("/obj/item/weapon/implant/mindshield"));
	return f.dot;
});

rt.type(11970, "/obj/effect/mob_spawn/human/syndicate", "/obj/effect/mob_spawn/human", {
	name: "Syndicate Operative",
	roundstart: 0,
	death: 0,
	icon: rt.rsc("icons/obj/cryogenic2.dmi"),
	icon_state: "sleeper_s",
	id_access_list: null,
	outfit: rt.typePath("/datum/outfit/syndicate_empty"),
});

// ghost_role_spawners.dm:381
rt.def("/obj/effect/mob_spawn/human/syndicate/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.id_access_list = list(150);
	return f.dot;
});

rt.type(627, "/datum/outfit/syndicate_empty", "/datum/outfit", {
	name: "Syndicate Operative Empty",
	uniform: rt.typePath("/obj/item/clothing/under/syndicate"),
	shoes: rt.typePath("/obj/item/clothing/shoes/combat"),
	gloves: rt.typePath("/obj/item/clothing/gloves/combat"),
	ears: rt.typePath("/obj/item/device/radio/headset/syndicate/alt"),
	back: rt.typePath("/obj/item/weapon/storage/backpack"),
	implants: null,
	id: rt.typePath("/obj/item/weapon/card/id"),
});

// ghost_role_spawners.dm:391
rt.def("/datum/outfit/syndicate_empty/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.implants = list(T("/obj/item/weapon/implant/weapons_auth"));
	return f.dot;
});

// ghost_role_spawners.dm:395
rt.def("/datum/outfit/syndicate_empty/proc/post_equip", function post_equip(f: Frame, H: Value) {
	(rt.modField(f, H, "faction", "syndicate", rt.bitOr));
	return f.dot;
});

rt.type(11974, "/obj/effect/mob_spawn/human/oldsec", "/obj/effect/mob_spawn/human", {
	name: "old cryogenics pod",
	desc: "A humming cryo pod. You can barely recognise a security uniform underneath the built up ice. The machine is attempting to wake up its occupant",
	mob_name: "a security officer",
	icon: rt.rsc("icons/obj/cryogenic2.dmi"),
	icon_state: "sleeper",
	roundstart: 0,
	death: 0,
	random: 1,
	mob_species: rt.typePath("/datum/species/human"),
	flavour_text: "<font size=3><b>Y</b></font><b>ou are a security officer working for NanoTrasen, stationed onboard a state of the art research station. You vaguely recall rushing into a cryogenics pod due to a oncoming radiation storm. The last thing you remember is the station's Artifical Program telling you that you would only be asleep for eight hours. As you open your eyes, everything seems rusted and broken, a dark feeling sweels in your gut as you climb out of your pod.",
	uniform: rt.typePath("/obj/item/clothing/under/rank/security"),
	shoes: rt.typePath("/obj/item/clothing/shoes/jackboots"),
	id: rt.typePath("/obj/item/weapon/card/id/away/old/sec"),
});

// ghost_role_spawners.dm:460
rt.def("/obj/effect/mob_spawn/human/oldsec/proc/Destroy", function* Destroy(f: Frame) {
	yield* new_(T("/obj/structure/showcase/oldpod"), rt.getStep(f, this, 0));
	return (yield* parent_proc());
}, true);

rt.type(11975, "/obj/effect/mob_spawn/human/oldeng", "/obj/effect/mob_spawn/human", {
	name: "old cryogenics pod",
	desc: "A humming cryo pod. You can barely recognise a engineering uniform underneath the built up ice. The machine is attempting to wake up its occupant",
	mob_name: "a engineer",
	icon: rt.rsc("icons/obj/cryogenic2.dmi"),
	icon_state: "sleeper",
	roundstart: 0,
	death: 0,
	random: 1,
	mob_species: rt.typePath("/datum/species/human"),
	flavour_text: "<font size=3><b>Y</b></font><b>ou are a engineer working for NanoTrasen, stationed onboard a state of the art research station. You vaguely recall rushing into a cryogenics pod due to a oncoming radiation storm. The last thing you remember is the station's Artifical Program telling you that you would only be asleep for eight hours. As you open your eyes, everything seems rusted and broken, a dark feeling sweels in your gut as you climb out of your pod.",
	uniform: rt.typePath("/obj/item/clothing/under/rank/engineer"),
	shoes: rt.typePath("/obj/item/clothing/shoes/workboots"),
	id: rt.typePath("/obj/item/weapon/card/id/away/old/eng"),
});

// ghost_role_spawners.dm:481
rt.def("/obj/effect/mob_spawn/human/oldeng/proc/Destroy", function* Destroy(f: Frame) {
	yield* new_(T("/obj/structure/showcase/oldpod"), rt.getStep(f, this, 0));
	return (yield* parent_proc());
}, true);

rt.type(11976, "/obj/effect/mob_spawn/human/oldsci", "/obj/effect/mob_spawn/human", {
	name: "old cryogenics pod",
	desc: "A humming cryo pod. You can barely recognise a science uniform underneath the built up ice. The machine is attempting to wake up its occupant",
	mob_name: "a scientist",
	icon: rt.rsc("icons/obj/cryogenic2.dmi"),
	icon_state: "sleeper",
	roundstart: 0,
	death: 0,
	random: 1,
	mob_species: rt.typePath("/datum/species/human"),
	flavour_text: "<font size=3><b>Y</b></font><b>ou are a scientist working for NanoTrasen, stationed onboard a state of the art research station. You vaguely recall rushing into a cryogenics pod due to a oncoming radiation storm. The last thing you remember is the station's Artifical Program telling you that you would only be asleep for eight hours. As you open your eyes, everything seems rusted and broken, a dark feeling sweels in your gut as you climb out of your pod.",
	uniform: rt.typePath("/obj/item/clothing/under/rank/scientist"),
	shoes: rt.typePath("/obj/item/clothing/shoes/laceup"),
	id: rt.typePath("/obj/item/weapon/card/id/away/old/sci"),
});

// ghost_role_spawners.dm:502
rt.def("/obj/effect/mob_spawn/human/oldsci/proc/Destroy", function* Destroy(f: Frame) {
	yield* new_(T("/obj/structure/showcase/oldpod"), rt.getStep(f, this, 0));
	return (yield* parent_proc());
}, true);
