// Based on /tg/station's code/modules/mining/lavaland/necropolis_chests.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


rt.type(12282, "/obj/structure/closet/crate/necropolis/tendril", "/obj/structure/closet/crate/necropolis", {
	desc: "It's watching you suspiciously.",
});

// necropolis_chests.dm:14
rt.def("/obj/structure/closet/crate/necropolis/tendril/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let loot: Value = null;
	const subject = (loot = rand(1, 28));
	if (subject === 1) {
		yield* new_(T("/obj/item/device/shared_storage/red"), this);
	} else if (subject === 2) {
		yield* new_(T("/obj/item/clothing/suit/space/hardsuit/cult"), this);
	} else if (subject === 3) {
		yield* new_(T("/obj/item/device/soulstone/anybody"), this);
	} else if (subject === 4) {
		yield* new_(T("/obj/item/weapon/katana/cursed"), this);
	} else if (subject === 5) {
		yield* new_(T("/obj/item/clothing/glasses/godeye"), this);
	} else if (subject === 6) {
		yield* new_(T("/obj/item/weapon/reagent_containers/glass/bottle/potion/flight"), this);
	} else if (subject === 7) {
		yield* new_(T("/obj/item/weapon/pickaxe/diamond"), this);
	} else if (subject === 8) {
		yield* new_(T("/obj/item/weapon/disk/design_disk/modkit_disc/resonator_blast"), this);
	} else if (subject === 9) {
		yield* new_(T("/obj/item/organ/brain/alien"), this);
	} else if (subject === 10) {
		yield* new_(T("/obj/item/organ/heart/cursed/wizard"), this);
	} else if (subject === 11) {
		yield* new_(T("/obj/item/ship_in_a_bottle"), this);
	} else if (subject === 12) {
		yield* new_(T("/obj/item/clothing/suit/space/hardsuit/ert/paranormal/beserker"), this);
	} else if (subject === 13) {
		yield* new_(T("/obj/item/weapon/disk/design_disk/modkit_disc/rapid_repeater"), this);
	} else if (subject === 14) {
		yield* new_(T("/obj/item/weapon/nullrod/scythe/talking"), this);
	} else if (subject === 15) {
		yield* new_(T("/obj/item/weapon/nullrod/armblade"), this);
	} else if (subject === 16) {
		yield* new_(T("/obj/item/weapon/guardiancreator"), this);
	} else if (subject === 17) {
		yield* new_(T("/obj/item/weapon/disk/design_disk/modkit_disc/mob_and_turf_aoe"), this);
	} else if (subject === 18) {
		yield* new_(T("/obj/item/device/warp_cube/red"), this);
	} else if (subject === 19) {
		yield* new_(T("/obj/item/device/wisp_lantern"), this);
	} else if (subject === 20) {
		yield* new_(T("/obj/item/device/immortality_talisman"), this);
	} else if (subject === 21) {
		yield* new_(T("/obj/item/weapon/gun/magic/hook"), this);
	} else if (subject === 22) {
		yield* new_(T("/obj/item/voodoo"), this);
	} else if (subject === 23) {
		yield* new_(T("/obj/item/weapon/grenade/clusterbuster/inferno"), this);
	} else if (subject === 24) {
		yield* new_(T("/obj/item/weapon/reagent_containers/food/drinks/bottle/holywater/hell"), this);
		yield* new_(T("/obj/item/clothing/suit/space/hardsuit/ert/paranormal/inquisitor"), this);
	} else if (subject === 25) {
		yield* new_(T("/obj/item/weapon/spellbook/oneuse/summonitem"), this);
	} else if (subject === 26) {
		yield* new_(T("/obj/item/book_of_babel"), this);
	} else if (subject === 27) {
		yield* new_(T("/obj/item/borg/upgrade/modkit/lifesteal"), this);
		yield* new_(T("/obj/item/weapon/bedsheet/cult"), this);
	} else if (subject === 28) {
		yield* new_(T("/obj/item/weapon/disk/design_disk/modkit_disc/bounty"), this);
	}
	return f.dot;
}, true);

rt.type(6677, "/obj/item/weapon/disk/design_disk/modkit_disc", "/obj/item/weapon/disk/design_disk", {
	modkit_design: rt.typePath("/datum/design/unique_modkit"),
	name: "KA Mod Disk",
	desc: "A design disc containing the design for a unique kinetic accelerator modkit.",
	icon_state: "datadisk1",
});

// necropolis_chests.dm:83
rt.def("/obj/item/weapon/disk/design_disk/modkit_disc/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	rt.setAt(this.blueprints, 1, (yield* new_(this.modkit_design)));
	return f.dot;
}, true);

rt.type(2806, "/datum/design/unique_modkit", "/datum/design", {
	category: null,
	req_tech: null,
	build_type: 18,
});

// necropolis_chests.dm:104
rt.def("/datum/design/unique_modkit/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.category = list("Mining Designs", "Cyborg Upgrade Modules");
	this.req_tech = rt.alist(f, ["materials", 12]);
	return f.dot;
});

rt.type(2807, "/datum/design/unique_modkit/offensive_turf_aoe", "/datum/design/unique_modkit", {
	name: "Kinetic Accelerator Offensive Mining Explosion Mod",
	desc: "A device which causes kinetic accelerators to fire AoE blasts that destroy rock and damage creatures.",
	id: "hyperaoemod",
	materials: null,
	build_path: rt.typePath("/obj/item/borg/upgrade/modkit/aoe/turfs/andmobs"),
});

// necropolis_chests.dm:111
rt.def("/datum/design/unique_modkit/offensive_turf_aoe/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 7000, "$glass", 3000, "$silver", 3000, "$gold", 3000, "$diamond", 4000]);
	return f.dot;
});

rt.type(2808, "/datum/design/unique_modkit/rapid_repeater", "/datum/design/unique_modkit", {
	name: "Kinetic Accelerator Rapid Repeater Mod",
	desc: "A device which greatly reduces a kinetic accelerator's cooldown on striking a living target or rock, but greatly increases its base cooldown.",
	id: "repeatermod",
	materials: null,
	build_path: rt.typePath("/obj/item/borg/upgrade/modkit/cooldown/repeater"),
});

// necropolis_chests.dm:118
rt.def("/datum/design/unique_modkit/rapid_repeater/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 5000, "$glass", 5000, "$uranium", 8000, "$bluespace", 2000]);
	return f.dot;
});

rt.type(2809, "/datum/design/unique_modkit/resonator_blast", "/datum/design/unique_modkit", {
	name: "Kinetic Accelerator Resonator Blast Mod",
	desc: "A device which causes kinetic accelerators to fire shots that leave and detonate resonator blasts.",
	id: "resonatormod",
	materials: null,
	build_path: rt.typePath("/obj/item/borg/upgrade/modkit/resonator_blasts"),
});

// necropolis_chests.dm:125
rt.def("/datum/design/unique_modkit/resonator_blast/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 5000, "$glass", 5000, "$silver", 5000, "$uranium", 5000]);
	return f.dot;
});

rt.type(2810, "/datum/design/unique_modkit/bounty", "/datum/design/unique_modkit", {
	name: "Kinetic Accelerator Death Syphon Mod",
	desc: "A device which causes kinetic accelerators to permenantly gain damage against creature types killed with it.",
	id: "bountymod",
	materials: null,
	reagents_list: null,
	build_path: rt.typePath("/obj/item/borg/upgrade/modkit/bounty"),
});

// necropolis_chests.dm:132
rt.def("/datum/design/unique_modkit/bounty/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 4000, "$silver", 4000, "$gold", 4000, "$bluespace", 4000]);
	this.reagents_list = rt.alist(f, ["blood", 40]);
	return f.dot;
});

rt.type(9403, "/obj/item/device/wisp_lantern", "/obj/item/device", {
	wisp: null,
	name: "spooky lantern",
	desc: "This lantern gives off no light, but is home to a friendly wisp.",
	icon: rt.rsc("icons/obj/lighting.dmi"),
	icon_state: "lantern-blue",
});

// necropolis_chests.dm:145
rt.def("/obj/item/device/wisp_lantern/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let A: Value = null, M: Value = null;
	if (!this.wisp) {
		to_chat(user, "<span class='warning'>The wisp has gone missing!</span>");
		return f.dot;
	}
	if (this.wisp.loc == this) {
		to_chat(user, "<span class='notice'>You release the wisp. It begins to bob around your head.</span>");
		(rt.modField(f, user, "sight", 4, rt.bitOr));
		this.icon_state = "lantern";
		yield* this.wisp.orbit(user, 20);
	} else {
		to_chat(user, "<span class='notice'>You return the wisp to the lantern.</span>");
		if (this.wisp.orbiting) {
			if (rt.istype((A = this.wisp.orbiting.orbiting), T("/mob/living"))) {
				(rt.modField(f, (M = A), "sight", 16777211, rt.bitAnd));
				to_chat(M, "<span class='notice'>Your vision returns to normal.</span>");
			}
		}
		yield* this.wisp.stop_orbit();
		this.wisp.loc = this;
		this.icon_state = "lantern-blue";
	}
	return f.dot;
}, true);

// necropolis_chests.dm:171
rt.def("/obj/item/device/wisp_lantern/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.wisp = (yield* new_(T("/obj/effect/wisp"), this));
	return f.dot;
}, true);

// necropolis_chests.dm:176
rt.def("/obj/item/device/wisp_lantern/proc/Destroy", function* Destroy(f: Frame) {
	if (this.wisp) {
		if (this.wisp.loc == this) {
			yield* qdel(this.wisp);
		} else {
			this.wisp.visible_message(`<span class='notice'>${this.wisp} has a sad feeling for a moment, then it passes.</span>`);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(9404, "/obj/item/device/warp_cube", "/obj/item/device", {
	linked: null,
	name: "blue cube",
	desc: "A mysterious blue cube.",
	icon: rt.rsc("icons/obj/lavaland/artefacts.dmi"),
	icon_state: "blue_cube",
});

// necropolis_chests.dm:202
rt.def("/obj/item/device/warp_cube/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (!this.linked) {
		to_chat(user, `${this} fizzles uselessly.`);
		return f.dot;
	}
	yield* new_(T("/obj/effect/particle_effect/smoke"), user.loc);
	yield* user.forceMove(rt.getStep(f, this.linked, 0));
	yield* new_(T("/obj/effect/particle_effect/smoke"), user.loc);
	return f.dot;
}, true);

rt.type(9405, "/obj/item/device/warp_cube/red", "/obj/item/device/warp_cube", {
	name: "red cube",
	desc: "A mysterious red cube.",
	icon_state: "red_cube",
});

// necropolis_chests.dm:216
rt.def("/obj/item/device/warp_cube/red/proc/Initialize", function* Initialize(f: Frame) {
	let blue: Value = null;
	yield* parent_proc();
	if (this.linked) return f.dot;
	this.linked = (blue = (yield* new_(T("/obj/item/device/warp_cube"), this.loc)));
	blue.linked = this;
	return f.dot;
}, true);

rt.type(8891, "/obj/item/projectile/hook", "/obj/item/projectile", {
	chain: null,
	pass_flags: 1,
	name: "hook",
	icon_state: "hook",
	icon: rt.rsc("icons/obj/lavaland/artefacts.dmi"),
	damage: 25,
	armour_penetration: 100,
	damage_type: "brute",
	hitsound: rt.rsc("sound/effects/splat.ogg"),
	knockdown: 30,
});

// necropolis_chests.dm:255
rt.def("/obj/item/projectile/hook/proc/fire", function* fire(f: Frame, setAngle: Value) {
	if (this.firer) {
		this.chain = (yield* this.firer.Beam(this, { icon_state: "chain", time: 1e+31, maxdistance: 1e+31 }));
	}
	yield* parent_proc();
	return f.dot;
}, true, { waitfor: false });

// necropolis_chests.dm:260
rt.def("/obj/item/projectile/hook/proc/on_hit", function* on_hit(f: Frame, target: Value) {
	let A: Value = null;
	f.dot = (yield* parent_proc());
	if (!rt.istype(target, T("/atom/movable"))) return f.dot;
	if ((A = target).anchored) {
		return f.dot;
	}
	A.visible_message(`<span class='danger'>${A} is snagged by ${this.firer}'s hook!</span>`);
	yield* new_(T("/datum/forced_movement"), A, rt.getStep(f, this.firer, 0), 5, 1);
	return f.dot;
}, true);

// necropolis_chests.dm:271
rt.def("/obj/item/projectile/hook/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.chain);
	return (yield* parent_proc());
}, true);

rt.type(9406, "/obj/item/device/immortality_talisman", "/obj/item/device", {
	cooldown: 0,
	name: "Immortality Talisman",
	desc: "A dread talisman that can render you completely invulnerable.",
	icon: rt.rsc("icons/obj/lavaland/artefacts.dmi"),
	icon_state: "talisman",
	actions_types: null,
});

// necropolis_chests.dm:281
rt.def("/obj/item/device/immortality_talisman/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/immortality"));
	return f.dot;
});

// necropolis_chests.dm:289
rt.def("/obj/item/device/immortality_talisman/proc/Destroy", function* Destroy(f: Frame, force: Value) {
	if (force) {
		f.dot = (yield* parent_proc());
	} else {
		return 1;
	}
	return f.dot;
}, true);

// necropolis_chests.dm:294
rt.def("/obj/item/device/immortality_talisman/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let Z: Value = null;
	if (!(this.cooldown < rt.worldTime(f))) return f.dot;
	this.cooldown = rt.worldTime(f) + 600;
	user.visible_message(`<span class='danger'>${user} vanishes from reality, leaving a a hole in ${user.p_their()} place!</span>`);
	(Z = (yield* new_(T("/obj/effect/immortality_talisman"), rt.getStep(f, this.loc, 0)))).name = "hole in reality";
	Z.desc = `It's shaped an awful lot like ${user.name}.`;
	yield* Z.setDir(user.dir);
	yield* user.forceMove(Z);
	user.notransform = 1;
	(rt.modField(f, user, "status_flags", 4096, rt.bitOr));
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/device/immortality_talisman/proc/return_to_reality"), user, Z)), 100);
	return f.dot;
}, true);

// necropolis_chests.dm:308
rt.def("/obj/item/device/immortality_talisman/proc/return_to_reality", function* return_to_reality(f: Frame, user: Value, Z: Value) {
	(rt.modField(f, user, "status_flags", 16773119, rt.bitAnd));
	user.notransform = 0;
	yield* user.forceMove(rt.getStep(f, Z, 0));
	user.visible_message(`<span class='danger'>${user} pops back into reality!</span>`);
	Z.can_destroy = 1;
	yield* qdel(Z);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob" }, { type: 4, path: "/obj/effect/immortality_talisman" }] });

rt.type(12084, "/obj/effect/immortality_talisman", "/obj/effect", {
	can_destroy: 0,
	icon_state: "blank",
	icon: rt.rsc("icons/effects/effects.dmi"),
});

// necropolis_chests.dm:330
rt.def("/obj/effect/immortality_talisman/proc/Destroy", function* Destroy(f: Frame, force: Value) {
	if (!this.can_destroy && !force) {
		return QDEL_HINT_LETMELIVE;
	} else {
		f.dot = (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(9408, "/obj/item/device/shared_storage/red", "/obj/item/device/shared_storage", {
	name: "paradox bag",
	desc: "Somehow, it's in two places at once.",
});

// necropolis_chests.dm:363
rt.def("/obj/item/device/shared_storage/red/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	if (this.bag) return f.dot;
	let S: Value = (yield* new_(T("/obj/item/weapon/storage/backpack/shared"), this));
	let blue: Value = (yield* new_(T("/obj/item/device/shared_storage"), this.loc));
	this.bag = S;
	blue.bag = S;
	return f.dot;
}, true);

rt.type(9407, "/obj/item/device/shared_storage", "/obj/item/device", {
	bag: null,
	name: "paradox bag",
	desc: "Somehow, it's in two places at once.",
	icon: rt.rsc("icons/obj/storage.dmi"),
	icon_state: "cultpack",
	slot_flags: 1024,
});

// necropolis_chests.dm:375
rt.def("/obj/item/device/shared_storage/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (!this.bag) return f.dot;
	this.bag.loc = user;
	yield* this.bag.attackby(W, user, params);
	return f.dot;
}, true);

// necropolis_chests.dm:379
rt.def("/obj/item/device/shared_storage/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (!rt.istype(user, T("/mob/living/carbon"))) {
		return f.dot;
	}
	if (this.loc == user && user.back && user.back == this) {
		if (this.bag) {
			this.bag.loc = user;
			yield* this.bag.attack_hand(user);
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// necropolis_chests.dm:390
rt.def("/obj/item/device/shared_storage/proc/MouseDrop", function* MouseDrop(f: Frame, over_object: Value) {
	let H: Value = null;
	if (!(rt.istype(f.usr, T("/mob/living/carbon")) || rt.istype(f.usr, T("/mob/living/simple_animal/drone")))) return f.dot;
	let M: Value = f.usr;
	if (!over_object) {
		return f.dot;
	}
	if (rt.istype(f.usr.loc, T("/obj/mecha"))) {
		return f.dot;
	}
	if (M.incapacitated()) return f.dot;
	playsound(this.loc, "rustle", 50, 1, -5);
	if (rt.istype(over_object, T("/obj/screen/inventory/hand"))) {
		H = over_object;
		yield* M.putItemFromInventoryInHandIfPossible(this, H.held_index);
	}
	yield* this.add_fingerprint(f.usr);
	return f.dot;
}, true);

rt.type(10116, "/obj/item/book_of_babel", "/obj/item", {
	w_class: 2,
	name: "Book of Babel",
	desc: "An ancient tome written in countless tongues.",
	icon: rt.rsc("icons/obj/library.dmi"),
	icon_state: "book1",
});

// necropolis_chests.dm:422
rt.def("/obj/item/book_of_babel/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	to_chat(user, "You flip through the pages of the book, quickly and conveniently learning every language in existence. Somewhat less conveniently, the aging book crumbles to dust in the process. Whoops.");
	yield* user.grant_all_languages({ omnitongue: 1 });
	yield* new_(T("/obj/effect/decal/cleanable/ash"), rt.getStep(f, user, 0));
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(13058, "/obj/vehicle/lavaboat", "/obj/vehicle", {
	resistance_flags: 3,
	name: "lava boat",
	desc: "A boat used for traversing lava.",
	icon_state: "goliath_boat",
	icon: rt.rsc("icons/obj/lavaland/dragonboat.dmi"),
});

// necropolis_chests.dm:438
rt.def("/obj/vehicle/lavaboat/proc/buckle_mob", function* buckle_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	f.dot = (yield* parent_proc());
	this.riding_datum = (yield* new_(T("/datum/riding/boat")));
	return f.dot;
}, true, { args: ["M", "force", "check_loc"] });

rt.type(1802, "/datum/crafting_recipe/oar", "/datum/crafting_recipe", {
	name: "goliath bone oar",
	time: 15,
	category: "Tribal",
	result: rt.typePath("/obj/item/weapon/oar"),
	reqs: null,
});

// necropolis_chests.dm:454
rt.def("/datum/crafting_recipe/oar/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/stack/sheet/bone"), 2]);
	return f.dot;
});

rt.type(1803, "/datum/crafting_recipe/boat", "/datum/crafting_recipe", {
	name: "goliath hide boat",
	time: 50,
	category: "Tribal",
	result: rt.typePath("/obj/vehicle/lavaboat"),
	reqs: null,
});

// necropolis_chests.dm:461
rt.def("/datum/crafting_recipe/boat/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/stack/sheet/animalhide/goliath_hide"), 3]);
	return f.dot;
});

rt.type(10117, "/obj/item/ship_in_a_bottle", "/obj/item", {
	name: "ship in a bottle",
	desc: "A tiny ship inside a bottle.",
	icon: rt.rsc("icons/obj/lavaland/artefacts.dmi"),
	icon_state: "ship_bottle",
});

// necropolis_chests.dm:475
rt.def("/obj/item/ship_in_a_bottle/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	to_chat(user, "You're not sure how they get the ships in these things, but you're pretty sure you know how to get it out.");
	playsound(user.loc, rt.rsc("sound/effects/glassbr1.ogg"), 100, 1);
	yield* new_(T("/obj/vehicle/lavaboat/dragon"), rt.getStep(f, this, 0));
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(13059, "/obj/vehicle/lavaboat/dragon", "/obj/vehicle/lavaboat", {
	name: "mysterious boat",
	desc: "This boat moves where you will it, without the need for an oar.",
	icon_state: "dragon_boat",
});

// necropolis_chests.dm:486
rt.def("/obj/vehicle/lavaboat/dragon/proc/buckle_mob", function* buckle_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	yield* parent_proc();
	this.riding_datum = (yield* new_(T("/datum/riding/boat/dragon")));
	return f.dot;
}, true, { args: ["M", "force", "check_loc"] });

rt.type(6403, "/obj/item/weapon/reagent_containers/glass/bottle/potion/flight", "/obj/item/weapon/reagent_containers/glass/bottle/potion", {
	name: "strange elixir",
	desc: "A flask with an almost-holy aura emitting from it. The label on the bottle says: 'erqo'hyy tvi'rf lbh jv'atf'.",
	list_reagents: null,
});

// necropolis_chests.dm:497
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/potion/flight/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["flightpotion", 5]);
	return f.dot;
});

rt.type(6402, "/obj/item/weapon/reagent_containers/glass/bottle/potion", "/obj/item/weapon/reagent_containers/glass/bottle", {
	icon: rt.rsc("icons/obj/lavaland/artefacts.dmi"),
	icon_state: "potionflask",
});

// necropolis_chests.dm:500
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/potion/proc/update_icon", function update_icon(f: Frame) {
	if (this.reagents.total_volume) {
		this.icon_state = "potionflask";
	} else {
		this.icon_state = "potionflask_empty";
	}
	return f.dot;
});

rt.type(3357, "/datum/reagent/flightpotion", "/datum/reagent", {
	name: "Flight Potion",
	id: "flightpotion",
	description: "Strange mutagenic compound of unknown origins.",
	reagent_state: 2,
	color: "#FFEBEB",
});

// necropolis_chests.dm:513
rt.def("/datum/reagent/flightpotion/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = TOUCH;
	}
	if (f.args[3] === null) {
		f.args[3] = 1;
	}
	if (rt.istype(f.args[0], T("/mob/living/carbon")) && f.args[0].stat != INGEST) {
		if (!is_species(f.args[0], T("/datum/species/human")) || f.args[2] < 5) {
			if (f.args[1] == INGEST && f.args[3]) {
				to_chat(f.args[0], "<span class='notice'><i>You feel nothing but a terrible aftertaste.</i></span>");
			}
			return (yield* parent_proc());
		}
		to_chat(f.args[0], "<span class='userdanger'>A terrible pain travels down your back as wings burst out!</span>");
		yield* f.args[0].set_species(T("/datum/species/angel"));
		playsound(f.args[0].loc, rt.rsc("sound/items/poster_ripped.ogg"), 50, 1, -1);
		yield* f.args[0].adjustBruteLoss(20);
		yield* f.args[0].emote("scream");
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message"] });

rt.type(5693, "/obj/item/weapon/melee/transforming/cleaving_saw", "/obj/item/weapon/melee/transforming", {
	transform_cooldown: null,
	swiping: 0,
	beast_force_bonus: 30,
	force_on: 20,
	throwforce_on: 20,
	icon_state_on: "cleaving_saw_open",
	attack_verb_off: null,
	attack_verb_on: null,
	hitsound_on: rt.rsc("sound/weapons/bladeslice.ogg"),
	name: "cleaving saw",
	desc: "This saw, effective at drawing the blood of beasts, transforms into a long cleaver that makes use of centrifugal force.",
	force: 12,
	throwforce: 20,
	icon: rt.rsc("icons/obj/lavaland/artefacts.dmi"),
	lefthand_file: rt.rsc("icons/mob/inhands/64x64_lefthand.dmi"),
	righthand_file: rt.rsc("icons/mob/inhands/64x64_righthand.dmi"),
	inhand_x_dimension: 64,
	inhand_y_dimension: 64,
	icon_state: "cleaving_saw",
	slot_flags: 512,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	w_class: 4,
	sharpness: 1,
});

// necropolis_chests.dm:559
rt.def("/obj/item/weapon/melee/transforming/cleaving_saw/proc/examine", function examine(f: Frame, user: Value) {
	let $1: any;
	parent_proc();
	let $0: any = user;
	if (this.active) {
		$1 = "open, and will cleave enemies in a wide arc";
	} else {
		$1 = "closed, and can be used for rapid consecutive attacks that cause beastly enemies to bleed";
	}
	to_chat($0, `<span class='notice'>It is ${$1}.<br>Both modes will build up existing bleed effects, doing a burst of high damage if the bleed is built up high enough.<br>Transforming it immediately after an attack causes the next attack to come out faster.</span>`);
	return f.dot;
}, false);

// necropolis_chests.dm:565
rt.def("/obj/item/weapon/melee/transforming/cleaving_saw/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	let $2: any;
	let $0: any = user;
	let $1: any = user;
	if (this.active) {
		$2 = `closing ${this} on ${user.p_their()} neck`;
	} else {
		$2 = `opening ${this} into ${user.p_their()} chest`;
	}
	$0.visible_message(`<span class='suicide'>${$1} is ${$2}! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	this.transform_cooldown = 0;
	yield* this.transform_weapon(user, 1);
	return 1;
}, true);

// necropolis_chests.dm:571
rt.def("/obj/item/weapon/melee/transforming/cleaving_saw/proc/transform_weapon", function* transform_weapon(f: Frame, user: Value, supress_message_text: Value) {
	if (this.transform_cooldown > rt.worldTime(f)) {
		return 0;
	}
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	this.transform_cooldown = rt.worldTime(f) + 4;
	user.changeNext_move(2);
	return f.dot;
}, true);

// necropolis_chests.dm:579
rt.def("/obj/item/weapon/melee/transforming/cleaving_saw/proc/transform_messages", function transform_messages(f: Frame, user: Value, supress_message_text: Value) {
	if (!supress_message_text) {
		if (this.active) {
			to_chat(user, `<span class='notice'>You open ${this}. It will now cleave enemies in a wide arc.</span>`);
		} else {
			to_chat(user, `<span class='notice'>You close ${this}. It will now attack rapidly and cause beastly enemies to bleed.</span>`);
		}
	}
	playsound(user, rt.rsc("sound/magic/clockwork/fellowship_armory.ogg"), 35, 1, { frequency: 90000 - this.active * 30000 });
	return f.dot;
});

// necropolis_chests.dm:587
rt.def("/obj/item/weapon/melee/transforming/cleaving_saw/proc/clumsy_transform_effect", function* clumsy_transform_effect(f: Frame, user: Value) {
	if (!(rt.bitAnd(user.disabilities, 256) && prob(50))) return f.dot;
	to_chat(user, `<span class='warning'>You accidentally cut yourself with ${this}, like a doofus!</span>`);
	yield* user.take_bodypart_damage(10);
	return f.dot;
}, true);

// necropolis_chests.dm:592
rt.def("/obj/item/weapon/melee/transforming/cleaving_saw/proc/melee_attack_chain", function* melee_attack_chain(f: Frame, user: Value, target: Value, params: Value) {
	yield* parent_proc();
	if (this.active) return f.dot;
	user.changeNext_move(4);
	return f.dot;
}, true);

// necropolis_chests.dm:597
rt.def("/obj/item/weapon/melee/transforming/cleaving_saw/proc/attack", function* attack(f: Frame, target: Value, user: Value) {
	let beast_bonus_active: Value = null, B: Value = null, i: Value = null, _T: Value = null, L: Value = null;
	let $e: any;
	if (!this.active || this.swiping || !target.density || rt.getStep(f, target, 0) == rt.getStep(f, user, 0)) {
		beast_bonus_active = 0;
		B = target.has_status_effect(T("/datum/status_effect/saw_bleed"));
		if (rt.istype(target, T("/mob/living/simple_animal/hostile/asteroid")) || rt.istype(target, T("/mob/living/simple_animal/hostile/megafauna"))) {
			if (!this.active) {
				if (!B) {
					yield* target.apply_status_effect(T("/datum/status_effect/saw_bleed"));
				} else {
					yield* B.add_bleed(B.bleed_buildup);
				}
			} else {
				this.force += this.beast_force_bonus;
				beast_bonus_active = 1;
			}
		}
		yield* parent_proc();
		if (beast_bonus_active) {
			if (B) {
				yield* B.add_bleed(B.bleed_buildup);
			}
			this.force -= this.beast_force_bonus;
		}
		return f.dot;
	}
	let user_turf: Value = rt.getStep(f, user, 0);
	let dir_to_target: Value = rt.getDir(f, user_turf, rt.getStep(f, target, 0));
	this.swiping = 1;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		_T = rt.getStep(f, user_turf, turn(dir_to_target, 90 - 45 * i));
		L = null;
		for (L of each(_T, T("/mob/living"))) {
			if (user.Adjacent(L) && L.density) {
				yield* this.melee_attack_chain(user, L);
			}
		}
	}
	rt.endFor(f, 0);
	this.swiping = 0;
	return f.dot;
}, true);

rt.type(12283, "/obj/structure/closet/crate/necropolis/dragon", "/obj/structure/closet/crate/necropolis", {
	name: "dragon chest",
});

// necropolis_chests.dm:631
rt.def("/obj/structure/closet/crate/necropolis/dragon/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let loot: Value = null;
	const subject = (loot = rand(1, 4));
	if (subject === 1) {
		yield* new_(T("/obj/item/weapon/melee/ghost_sword"), this);
	} else if (subject === 2) {
		yield* new_(T("/obj/item/weapon/lava_staff"), this);
	} else if (subject === 3) {
		yield* new_(T("/obj/item/weapon/spellbook/oneuse/sacredflame"), this);
		yield* new_(T("/obj/item/weapon/gun/magic/wand/fireball"), this);
	} else if (subject === 4) {
		yield* new_(T("/obj/item/weapon/dragons_blood"), this);
	}
	return f.dot;
}, true);

rt.type(12284, "/obj/structure/closet/crate/necropolis/dragon/crusher", "/obj/structure/closet/crate/necropolis/dragon", {
	name: "firey dragon chest",
});

// necropolis_chests.dm:647
rt.def("/obj/structure/closet/crate/necropolis/dragon/crusher/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/crusher_trophy/tail_spike"), this);
	return f.dot;
}, true);

rt.type(5695, "/obj/item/weapon/melee/ghost_sword", "/obj/item/weapon/melee", {
	summon_cooldown: 0,
	spirits: null,
	flags: 64,
	name: "１spectral blade",
	desc: "A rusted and dulled blade. It doesn't look like it'd do much damage. It glows weakly.",
	icon_state: "spectral",
	item_state: "spectral",
	sharpness: 1,
	w_class: 4,
	force: 1,
	throwforce: 1,
	hitsound: rt.rsc("sound/effects/ghost2.ogg"),
	attack_verb: null,
});

// necropolis_chests.dm:666
rt.def("/obj/item/weapon/melee/ghost_sword/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.spirits = list();
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSobj.processing += this;
	}
	(rt.modGl("poi_list", this, rt.bitOr));
	return f.dot;
}, true);

// necropolis_chests.dm:672
rt.def("/obj/item/weapon/melee/ghost_sword/proc/Destroy", function* Destroy(f: Frame) {
	let G: Value = null;
	for (G of each(this.spirits, T("/mob/dead/observer"))) {
		G.invisibility = GLOB.observer_default_invisibility;
	}
	this.spirits.Cut();
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	GLOB.poi_list -= this;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// necropolis_chests.dm:680
rt.def("/obj/item/weapon/melee/ghost_sword/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (this.summon_cooldown > rt.worldTime(f)) {
		to_chat(user, "You just recently called out for aid. You don't want to annoy the spirits.");
		return f.dot;
	}
	to_chat(user, "You call out for aid, attempting to summon spirits to your side.");
	yield* notify_ghosts(`${user} is raising ${user.p_their()} ${this}, calling for your help!`, { enter_link: fmt("<a href=?src=＃;orbit=1>(Click to help)</a>", [this]), source: user, action: "orbit" });
	this.summon_cooldown = rt.worldTime(f) + 600;
	return f.dot;
}, true);

// necropolis_chests.dm:692
rt.def("/obj/item/weapon/melee/ghost_sword/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let ghost: Value = null;
	if (!rt.at(href_list, "orbit")) return f.dot;
	if (!rt.istype((ghost = f.usr), T("/mob/dead/observer"))) return f.dot;
	yield* ghost.ManualFollow(this);
	return f.dot;
}, true);

// necropolis_chests.dm:698
rt.def("/obj/item/weapon/melee/ghost_sword/proc/process", function process(f: Frame) {
	this.ghost_check();
	return f.dot;
}, false, { waitfor: false });

// necropolis_chests.dm:702
rt.def("/obj/item/weapon/melee/ghost_sword/proc/ghost_check", function ghost_check(f: Frame) {
	let thing: Value = null, A: Value = null, O: Value = null, G: Value = null, G_5: Value = null;
	let ghost_counter: Value = 0;
	let _T: Value = rt.getStep(f, this, 0);
	let contents: Value = _T.GetAllContents();
	let current_spirits: Value = list();
	let orbiters: Value = list();
	for (thing of each(contents)) {
		if ((A = thing).orbiters) {
			orbiters += A.orbiters;
		}
	}
	thing = null;
	for (thing of each(orbiters)) {
		if (rt.istype((O = thing).orbiter, T("/mob/dead/observer"))) {
			G = O.orbiter;
			ghost_counter++;
			G.invisibility = 0;
			(current_spirits = rt.modify(current_spirits, G, rt.bitOr));
		}
	}
	for (G_5 of each(this.spirits - current_spirits, T("/mob/dead/observer"))) {
		G_5.invisibility = GLOB.observer_default_invisibility;
	}
	this.spirits = current_spirits;
	return ghost_counter;
});

// necropolis_chests.dm:728
rt.def("/obj/item/weapon/melee/ghost_sword/proc/attack", function* attack(f: Frame, target: Value, user: Value) {
	this.force = 0;
	let ghost_counter: Value = this.ghost_check();
	this.force = max(0, min(ghost_counter * 4, 75));
	user.visible_message(`<span class='danger'>${user} strikes with the force of ${ghost_counter} vengeful spirits!</span>`);
	yield* parent_proc();
	return f.dot;
}, true);

// necropolis_chests.dm:735
rt.def("/obj/item/weapon/melee/ghost_sword/proc/hit_reaction", function hit_reaction(f: Frame) {
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
	let ghost_counter: Value = this.ghost_check();
	f.args[3] += max(0, min(ghost_counter * 5, 75));
	f.args[0].visible_message(`<span class='danger'>${f.args[0]} is protected by a ring of ${ghost_counter} ghosts!</span>`);
	return parent_proc();
}, false, { args: ["owner", "hitby", "attack_text", "final_block_chance", "damage", "attack_type"] });

rt.type(7547, "/obj/item/weapon/dragons_blood", "/obj/item/weapon", {
	name: "bottle of dragons blood",
	desc: "You're not actually going to drink this, are you?",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "vial",
});

// necropolis_chests.dm:749
rt.def("/obj/item/weapon/dragons_blood/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let random: Value = null, D: Value = null;
	if (!rt.istype(user, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	let H: Value = user;
	const subject = (random = rand(1, 4));
	if (subject === 1) {
		to_chat(user, "<span class='danger'>Your appearence morphs to that of a very small humanoid ash dragon! You get to look like a freak without the cool abilities.</span>");
		H.dna.features = rt.alist(f, ["mcolor", "A02720", "tail_lizard", "Dark Tiger", "tail_human", "None", "snout", "Sharp", "horns", "Curled", "ears", "None", "wings", "None", "frills", "None", "spines", "Long", "body_markings", "Dark Tiger Body", "legs", "Digitigrade Legs"]);
		H.eye_color = "fee5a3";
		yield* H.set_species(T("/datum/species/lizard"));
	} else if (subject === 2) {
		to_chat(user, "<span class='danger'>Your flesh begins to melt! Miraculously, you seem fine otherwise.</span>");
		yield* H.set_species(T("/datum/species/skeleton"));
	} else if (subject === 3) {
		to_chat(user, "<span class='danger'>Power courses through you! You can now shift your form at will.");
		if (user.mind) {
			D = (yield* new_(T("/obj/effect/proc_holder/spell/targeted/shapeshift/dragon")));
			yield* user.mind.AddSpell(D);
		}
	} else if (subject === 4) {
		to_chat(user, "<span class='danger'>You feel like you could walk straight through lava now.</span>");
		(rt.modField(f, H, "weather_immunities", "lava", rt.bitOr));
	}
	playsound(user.loc, rt.rsc("sound/items/drink.ogg"), rand(10, 50), 1);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(969, "/datum/disease/transformation/dragon", "/datum/disease/transformation", {
	name: "dragon transformation",
	cure_text: "nothing",
	cures: null,
	agent: "dragon's blood",
	desc: "What do dragons have to do with Space Station 13?",
	stage_prob: 20,
	severity: "BIOHAZARD THREAT!",
	visibility_flags: 0,
	stage1: null,
	stage2: null,
	stage3: null,
	stage4: null,
	stage5: null,
	new_form: rt.typePath("/mob/living/simple_animal/hostile/megafauna/dragon/lesser"),
});

// necropolis_chests.dm:779
rt.def("/datum/disease/transformation/dragon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.cures = list("adminordrazine");

	this.stage1 = list("Your bones ache.");

	this.stage2 = list("Your skin feels scaley.");
	this.stage3 = list("<span class='danger'>You have an overwhelming urge to terrorize some peasants.</span>", "<span class='danger'>Your teeth feel sharper.</span>");

	this.stage4 = list("<span class='danger'>Your blood burns.</span>");

	this.stage5 = list("<span class='danger'>You're a fucking dragon. However, any previous allegiances you held still apply. It'd be incredibly rude to eat your still human friends for no reason.</span>");
	return f.dot;
});

rt.type(7548, "/obj/item/weapon/lava_staff", "/obj/item/weapon", {
	turf_type: rt.typePath("/turf/open/floor/plating/lava/smooth"),
	transform_string: "lava",
	reset_turf_type: rt.typePath("/turf/open/floor/plating/asteroid/basalt"),
	reset_string: "basalt",
	create_cooldown: 100,
	create_delay: 30,
	reset_cooldown: 50,
	timer: 0,
	banned_turfs: null,
	name: "staff of lava",
	desc: "The ability to fill the emergency shuttle with lava. What more could you want out of life?",
	icon_state: "staffofstorms",
	item_state: "staffofstorms",
	icon: rt.rsc("icons/obj/guns/magic.dmi"),
	slot_flags: 1024,
	w_class: 4,
	force: 25,
	damtype: "fire",
	resistance_flags: 35,
	hitsound: rt.rsc("sound/weapons/sear.ogg"),
});

// necropolis_chests.dm:818
rt.def("/obj/item/weapon/lava_staff/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.banned_turfs = typecacheof(list(T("/turf/open/space/transit"), T("/turf/closed")));
	return f.dot;
}, true);

// necropolis_chests.dm:822
rt.def("/obj/item/weapon/lava_staff/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity_flag: Value, click_parameters: Value) {
	let _T: Value = null, L: Value = null, old_name: Value = null, old_name_1: Value = null;
	let $0: any, $1: any, $2: any;
	yield* parent_proc();
	if (this.timer > rt.worldTime(f)) {
		return f.dot;
	}
	if (is_type_in_typecache(target, this.banned_turfs)) {
		return f.dot;
	}
	if (!rt.isIn(f, target, view(user.client.view, rt.getStep(f, user, 0)))) return f.dot;
	if (!rt.istype((_T = rt.getStep(f, target, 0)), T("/turf/open"))) {
		return f.dot;
	}
	if (!rt.op(f, "IsType", [], [_T, this.turf_type])) {
		(L = (yield* new_(T("/obj/effect/temp_visual/lavastaff"), _T))).alpha = 0;
		rt.op(f, "Animate", [2, 6], [null, L, "alpha", 255, "time", this.create_delay]);
		user.visible_message(`<span class='danger'>${user} points ${this} at ${_T}!</span>`);
		this.timer = rt.worldTime(f) + this.create_delay + 1;
		if (yield* do_after(user, this.create_delay, { target: _T })) {
			old_name = _T.name;
			if (yield* _T.TerraformTurf(this.turf_type)) {
				user.visible_message(fmt("<span class='danger'>＀ turns ％！ into ＀!</span>", [user, old_name, this.transform_string]));
				$0 = key_name_admin(user);
				$1 = get_area(target);
				if (_T) {
					$2 = `${`(${_T.x},${_T.y},${_T.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${_T.x};Y=${_T.y};Z=${_T.z}'>JMP</a>)`}`;
				} else {
					$2 = "nonexistent location";
				}
				message_admins(`${$0} fired the lava staff at ${$1}. ${`${$2}`}`);
				log_game(`${key_name(user)} fired the lava staff at ${get_area(target)} ${`(${_T.x},${_T.y},${_T.z})`}.`);
				this.timer = rt.worldTime(f) + this.create_cooldown;
				playsound(_T, rt.rsc("sound/magic/fireball.ogg"), 200, 1);
			}
		} else {
			this.timer = rt.worldTime(f);
		}
		yield* qdel(L);
	} else {
		old_name_1 = _T.name;
		if (!(yield* _T.TerraformTurf(this.reset_turf_type))) return f.dot;
		user.visible_message(fmt("<span class='danger'>＀ turns ％！ into ＀!</span>", [user, old_name_1, this.reset_string]));
		this.timer = rt.worldTime(f) + this.reset_cooldown;
		playsound(_T, rt.rsc("sound/magic/fireball.ogg"), 200, 1);
	}
	return f.dot;
}, true);

rt.type(12285, "/obj/structure/closet/crate/necropolis/bubblegum", "/obj/structure/closet/crate/necropolis", {
	name: "bubblegum chest",
});

// necropolis_chests.dm:867
rt.def("/obj/structure/closet/crate/necropolis/bubblegum/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let loot: Value = null;
	const subject = (loot = rand(1, 3));
	if (subject === 1) {
		yield* new_(T("/obj/item/mayhem"), this);
	} else if (subject === 2) {
		yield* new_(T("/obj/item/blood_contract"), this);
	} else if (subject === 3) {
		yield* new_(T("/obj/item/weapon/gun/magic/staff/spellblade"), this);
	}
	return f.dot;
}, true);

rt.type(12286, "/obj/structure/closet/crate/necropolis/bubblegum/crusher", "/obj/structure/closet/crate/necropolis/bubblegum", {
	name: "bloody bubblegum chest",
});

// necropolis_chests.dm:880
rt.def("/obj/structure/closet/crate/necropolis/bubblegum/crusher/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/crusher_trophy/demon_claws"), this);
	return f.dot;
}, true);

rt.type(10118, "/obj/item/mayhem", "/obj/item", {
	name: "mayhem in a bottle",
	desc: "A magically infused bottle of blood, the scent of which will drive anyone nearby into a murderous frenzy.",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "vial",
});

// necropolis_chests.dm:890
rt.def("/obj/item/mayhem/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let H: Value = null, B: Value = null;
	for (H of each(range(7, user), T("/mob/living/carbon/human"))) {
		yield* ImmediateInvokeAsync((B = (yield* new_(T("/obj/effect/mine/pickup/bloodbath"), H))), P("/obj/effect/mine/pickup/bloodbath/proc/mineEffect"), H);
	}
	to_chat(user, "<span class='notice'>You shatter the bottle!</span>");
	playsound(user.loc, rt.rsc("sound/effects/glassbr1.ogg"), 100, 1);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(10119, "/obj/item/blood_contract", "/obj/item", {
	used: 0,
	name: "blood contract",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "scroll2",
	color: "#FF0000",
	desc: "Mark your target for death. ",
});

// necropolis_chests.dm:909
rt.def("/obj/item/blood_contract/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let choice: Value = null, L: Value = null, survive: Value = null, B: Value = null, H: Value = null;
	if (this.used) {
		return f.dot;
	}
	this.used = 1;
	if (!rt.istype((choice = (yield* g.op(f, "Prompt", [1], [null, "Choose Your Victim", "Who do you want dead?", user, GLOB.player_list]))), T("/mob/living"))) {
		to_chat(user, `${choice} is already dead!`);
		this.used = 0;
		return f.dot;
	}
	if (choice == user) {
		to_chat(user, "You feel like writing your own name into a cursed death warrant would be unwise.");
		this.used = 0;
		return f.dot;
	} else {
		message_admins(`<span class='adminnotice'>${(L = choice)} has been marked for death!</span>`);
		(survive = (yield* new_(T("/datum/objective/survive")))).owner = L.mind;
		L.mind.objectives += survive;
		to_chat(L, "<span class='userdanger'>You've been marked for death! Don't let the demons get you!</span>");
		L.add_atom_colour("#FF0000", 1);
		yield* ImmediateInvokeAsync((B = (yield* new_(T("/obj/effect/mine/pickup/bloodbath"), L))), P("/obj/effect/mine/pickup/bloodbath/proc/mineEffect"), L);
		for (H of each(GLOB.player_list, T("/mob/living/carbon/human"))) {
			if (H == L) {
				continue;
			}
			to_chat(H, `<span class='userdanger'>You have an overwhelming desire to kill ${L}. ${L.p_they(1)} ${L.p_have()} been marked red! Go kill ${L.p_them()}!</span>`);
			yield* H.put_in_hands_or_del((yield* new_(T("/obj/item/weapon/kitchen/knife/butcher"), H)));
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(12287, "/obj/structure/closet/crate/necropolis/colossus", "/obj/structure/closet/crate/necropolis", {
	name: "colossus chest",
});

// necropolis_chests.dm:946
rt.def("/obj/structure/closet/crate/necropolis/colossus/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let choices: Value = typesof(T("/obj/machinery/anomalous_crystal")) - T("/obj/machinery/anomalous_crystal");
	let random_crystal: Value = pick(choices);
	yield* new_(random_crystal, this);
	yield* new_(T("/obj/item/organ/vocal_cords/colossus"), this);
	return f.dot;
}, true);

rt.type(12288, "/obj/structure/closet/crate/necropolis/colossus/crusher", "/obj/structure/closet/crate/necropolis/colossus", {
	name: "angelic colossus chest",
});

// necropolis_chests.dm:955
rt.def("/obj/structure/closet/crate/necropolis/colossus/crusher/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/crusher_trophy/blaster_tubes"), this);
	return f.dot;
}, true);

rt.type(7549, "/obj/item/weapon/hierophant_club", "/obj/item/weapon", {
	cooldown_time: 20,
	chaser_cooldown: 81,
	chaser_timer: 0,
	chaser_speed: 0.8,
	timer: 0,
	blast_range: 13,
	beacon: null,
	teleporting: 0,
	friendly_fire_check: 0,
	name: "hierophant club",
	desc: "The strange technology of this large club allows various nigh-magical feats. It used to beat you, but now you can set the beat.",
	icon_state: "hierophant_club_ready_beacon",
	item_state: "hierophant_club_ready_beacon",
	icon: rt.rsc("icons/obj/lavaland/artefacts.dmi"),
	lefthand_file: rt.rsc("icons/mob/inhands/64x64_lefthand.dmi"),
	righthand_file: rt.rsc("icons/mob/inhands/64x64_righthand.dmi"),
	inhand_x_dimension: 64,
	inhand_y_dimension: 64,
	slot_flags: 1024,
	w_class: 4,
	force: 15,
	hitsound: rt.rsc("sound/weapons/sonic_jackhammer.ogg"),
	actions_types: null,
});

// necropolis_chests.dm:973
rt.def("/obj/item/weapon/hierophant_club/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/vortex_recall"), T("/datum/action/item_action/toggle_unfriendly_fire"));
	return f.dot;
});

// necropolis_chests.dm:985
rt.def("/obj/item/weapon/hierophant_club/proc/examine", function examine(f: Frame, user: Value) {
	let $1: any;
	parent_proc();
	let $0: any = user;
	if (this.beacon) {
		$1 = " beacon is not currently";
	} else {
		$1 = "re is a beacon";
	}
	to_chat($0, `<span class='hierophant_warning'>The${$1} attached.</span>`);
	return f.dot;
}, false);

// necropolis_chests.dm:989
rt.def("/obj/item/weapon/hierophant_club/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity_flag: Value, click_parameters: Value) {
	let _T: Value = null, C: Value = null;
	yield* parent_proc();
	if (!(_T = rt.getStep(f, target, 0)) || this.timer > rt.worldTime(f)) {
		return f.dot;
	}
	this.calculate_anger_mod(user);
	this.timer = rt.worldTime(f) + 8;
	if (proximity_flag) {
		yield* ImmediateInvokeAsync(this, P("/obj/item/weapon/hierophant_club/proc/aoe_burst"), _T, user);
		add_logs(user, target, "fired 3x3 blast at", this);
	} else if (rt.istype(target, T("/turf/closed/mineral")) && get_dist(user, target) < 6) {
		yield* ImmediateInvokeAsync(this, P("/obj/item/weapon/hierophant_club/proc/cardinal_blasts"), _T, user);
		this.timer = rt.worldTime(f) + this.cooldown_time;
	} else if (rt.isIn(f, target, view(5, rt.getStep(f, user, 0)))) {
		this.timer = rt.worldTime(f) + this.cooldown_time;
		if (rt.istype(target, T("/mob/living")) && this.chaser_timer <= rt.worldTime(f)) {
			this.chaser_timer = rt.worldTime(f) + this.chaser_cooldown;
			(C = (yield* new_(T("/obj/effect/temp_visual/hierophant/chaser"), rt.getStep(f, user, 0), user, target, this.chaser_speed, this.friendly_fire_check))).damage = 30;
			C.monster_damage_boost = 0;
			add_logs(user, target, "fired a chaser at", this);
		} else {
			yield* ImmediateInvokeAsync(this, P("/obj/item/weapon/hierophant_club/proc/cardinal_blasts"), _T, user);
			add_logs(user, target, "fired cardinal blast at", this);
		}
	} else {
		to_chat(user, "<span class='warning'>That target is out of range!</span>");
		this.timer = rt.worldTime(f);
	}
	yield* ImmediateInvokeAsync(this, P("/obj/item/weapon/hierophant_club/proc/prepare_icon_update"));
	return f.dot;
}, true);

// necropolis_chests.dm:1019
rt.def("/obj/item/weapon/hierophant_club/proc/calculate_anger_mod", function calculate_anger_mod(f: Frame, user: Value) {
	let health_percent: Value = null;
	this.chaser_cooldown = rt.initial(f, this, "chaser_cooldown");
	this.cooldown_time = rt.initial(f, this, "cooldown_time");
	this.chaser_speed = rt.initial(f, this, "chaser_speed");
	this.blast_range = rt.initial(f, this, "blast_range");
	if (!rt.istype(user, T("/mob/living"))) return f.dot;
	let L: Value = user;
	this.chaser_cooldown += round((health_percent = L.health / L.maxHealth) * 20);
	this.cooldown_time += round(health_percent * 10);
	this.chaser_speed = max(this.chaser_speed + health_percent, 0.5);
	this.blast_range -= round(health_percent * 10);
	return f.dot;
});

// necropolis_chests.dm:1032
rt.def("/obj/item/weapon/hierophant_club/proc/update_icon", function* update_icon(f: Frame) {
	let M: Value = null;
	let $0: any;
	if (this.timer <= rt.worldTime(f)) {
		$0 = "_ready";
	} else {
		$0 = "";
	}
	this.icon_state = `hierophant_club${$0}${this.beacon && !(!this.beacon || this.beacon.gc_destroyed) ? "" : "_beacon"}`;
	this.item_state = this.icon_state;
	if (!ismob(this.loc)) return f.dot;
	yield* (M = this.loc).update_inv_hands();
	M.update_inv_back();
	return f.dot;
}, true);

// necropolis_chests.dm:1040
rt.def("/obj/item/weapon/hierophant_club/proc/prepare_icon_update", function* prepare_icon_update(f: Frame) {
	yield* this.update_icon();
	yield* sleep(this.timer - rt.worldTime(f));
	yield* this.update_icon();
	return f.dot;
}, true);

// necropolis_chests.dm:1045
rt.def("/obj/item/weapon/hierophant_club/proc/ui_action_click", function* ui_action_click(f: Frame, user: Value, action: Value) {
	let _T: Value = null, _T_2: Value = null, source: Value = null, t: Value = null, B: Value = null, L: Value = null;
	let $0: any, $1: any, $e: any;
	if (rt.istype(action, T("/datum/action/item_action/toggle_unfriendly_fire"))) {
		this.friendly_fire_check = (!this.friendly_fire_check ? 1 : 0);
		$0 = user;
		if (this.friendly_fire_check) {
			$1 = "off";
		} else {
			$1 = "on";
		}
		to_chat($0, `<span class='warning'>You toggle friendly fire ${$1}!</span>`);
		return f.dot;
	}
	if (this.timer > rt.worldTime(f)) {
		return f.dot;
	}
	if (!user.is_holding(this)) {
		$0 = user;
		if (this.beacon) {
			$1 = "teleport with it";
		} else {
			$1 = "detach the beacon";
		}
		to_chat($0, `<span class='warning'>You need to hold the club in your hands to ${$1}!</span>`);
		return f.dot;
	}
	if (!this.beacon || !this.beacon || this.beacon.gc_destroyed) {
		if (isturf(user.loc)) {
			user.visible_message(`<span class='hierophant_warning'>${user} starts fiddling with ${this}'s pommel...</span>`, "<span class='notice'>You start detaching the hierophant beacon...</span>");
			this.timer = rt.worldTime(f) + 51;
			yield* ImmediateInvokeAsync(this, P("/obj/item/weapon/hierophant_club/proc/prepare_icon_update"));
			if ((yield* do_after(user, 50, { target: user })) && !this.beacon) {
				playsound((_T = rt.getStep(f, user, 0)), rt.rsc("sound/magic/blind.ogg"), 200, 1, -4);
				yield* new_(T("/obj/effect/temp_visual/hierophant/telegraph/teleport"), _T, user);
				this.beacon = (yield* new_(T("/obj/effect/hierophant"), _T));
				yield* user.update_action_buttons_icon();
				user.visible_message(`<span class='hierophant_warning'>${user} places a strange machine beneath ${user.p_their()} feet!</span>`, "<span class='hierophant'>You detach the hierophant beacon, allowing you to teleport yourself and any allies to it at any time!</span>\n<span class='notice'>You can remove the beacon to place it again by striking it with the club.</span>");
			} else {
				this.timer = rt.worldTime(f);
				yield* ImmediateInvokeAsync(this, P("/obj/item/weapon/hierophant_club/proc/prepare_icon_update"));
			}
		} else {
			to_chat(user, "<span class='warning'>You need to be on solid ground to detach the beacon!</span>");
		}
		return f.dot;
	}
	if (get_dist(user, this.beacon) <= 2) {
		to_chat(user, "<span class='warning'>You are too close to the beacon to teleport to it!</span>");
		return f.dot;
	}
	if (is_blocked_turf(rt.getStep(f, this.beacon, 0), 1)) {
		to_chat(user, "<span class='warning'>The beacon is blocked by something, preventing teleportation!</span>");
		return f.dot;
	}
	if (!isturf(user.loc)) {
		to_chat(user, "<span class='warning'>You don't have enough space to teleport from here!</span>");
		return f.dot;
	}
	this.teleporting = 1;
	yield* user.update_action_buttons_icon();
	user.visible_message(`<span class='hierophant_warning'>${user} starts to glow faintly...</span>`);
	this.timer = rt.worldTime(f) + 50;
	yield* ImmediateInvokeAsync(this, P("/obj/item/weapon/hierophant_club/proc/prepare_icon_update"));
	this.beacon.icon_state = "hierophant_tele_on";
	let TE1: Value = (yield* new_(T("/obj/effect/temp_visual/hierophant/telegraph/edge"), user.loc));
	let TE2: Value = (yield* new_(T("/obj/effect/temp_visual/hierophant/telegraph/edge"), this.beacon.loc));
	if ((yield* do_after(user, 40, { target: user })) && user && this.beacon) {
		_T_2 = rt.getStep(f, this.beacon, 0);
		source = rt.getStep(f, user, 0);
		if (is_blocked_turf(_T_2, 1)) {
			this.teleporting = 0;
			to_chat(user, "<span class='warning'>The beacon is blocked by something, preventing teleportation!</span>");
			yield* user.update_action_buttons_icon();
			this.timer = rt.worldTime(f);
			yield* ImmediateInvokeAsync(this, P("/obj/item/weapon/hierophant_club/proc/prepare_icon_update"));
			this.beacon.icon_state = "hierophant_tele_off";
			return f.dot;
		}
		yield* new_(T("/obj/effect/temp_visual/hierophant/telegraph"), _T_2, user);
		yield* new_(T("/obj/effect/temp_visual/hierophant/telegraph"), source, user);
		playsound(_T_2, rt.rsc("sound/magic/wand_teleport.ogg"), 200, 1);
		playsound(source, rt.rsc("sound/machines/airlockopen.ogg"), 200, 1);
		if (!(yield* do_after(user, 3, { target: user })) || !user || !this.beacon || !this.beacon || this.beacon.gc_destroyed) {
			this.teleporting = 0;
			if (user) {
				yield* user.update_action_buttons_icon();
			}
			this.timer = rt.worldTime(f);
			yield* ImmediateInvokeAsync(this, P("/obj/item/weapon/hierophant_club/proc/prepare_icon_update"));
			if (this.beacon) {
				this.beacon.icon_state = "hierophant_tele_off";
			}
			return f.dot;
		}
		if (is_blocked_turf(_T_2, 1)) {
			this.teleporting = 0;
			to_chat(user, "<span class='warning'>The beacon is blocked by something, preventing teleportation!</span>");
			yield* user.update_action_buttons_icon();
			this.timer = rt.worldTime(f);
			yield* ImmediateInvokeAsync(this, P("/obj/item/weapon/hierophant_club/proc/prepare_icon_update"));
			this.beacon.icon_state = "hierophant_tele_off";
			return f.dot;
		}
		add_logs(user, this.beacon, `teleported self from (${source.x},${source.y},${source.z}) to`);
		yield* new_(T("/obj/effect/temp_visual/hierophant/telegraph/teleport"), _T_2, user);
		yield* new_(T("/obj/effect/temp_visual/hierophant/telegraph/teleport"), source, user);
		for (t of each(block(rt.locate(max(_T_2.x - 1, 1), max(_T_2.y - 1, 1), _T_2.z), rt.locate(min(_T_2.x + 1, rt.world().maxx), min(_T_2.y + 1, rt.world().maxy), _T_2.z)))) {
			(B = (yield* new_(T("/obj/effect/temp_visual/hierophant/blast"), t, user, 1))).damage = 30;
		}
		t = null;
		for (t of each(block(rt.locate(max(source.x - 1, 1), max(source.y - 1, 1), source.z), rt.locate(min(source.x + 1, rt.world().maxx), min(source.y + 1, rt.world().maxy), source.z)))) {
			(B = (yield* new_(T("/obj/effect/temp_visual/hierophant/blast"), t, user, 1))).damage = 30;
		}
		for (L of each(range(1, source), T("/mob/living"))) {
			yield* ImmediateInvokeAsync(this, P("/obj/item/weapon/hierophant_club/proc/teleport_mob"), source, L, _T_2, user);
		}
		yield* sleep(6);
		if (this.beacon) {
			this.beacon.icon_state = "hierophant_tele_off";
		}
	} else {
		yield* qdel(TE1);
		yield* qdel(TE2);
		this.timer = rt.worldTime(f);
		yield* ImmediateInvokeAsync(this, P("/obj/item/weapon/hierophant_club/proc/prepare_icon_update"));
	}
	if (this.beacon) {
		this.beacon.icon_state = "hierophant_tele_off";
	}
	this.teleporting = 0;
	if (!user) return f.dot;
	yield* user.update_action_buttons_icon();
	return f.dot;
}, true);

// necropolis_chests.dm:1150
rt.def("/obj/item/weapon/hierophant_club/proc/teleport_mob", function* teleport_mob(f: Frame, source: Value, M: Value, target: Value, user: Value) {
	let turf_to_teleport_to: Value = null;
	if (!(turf_to_teleport_to = rt.getStep(f, target, rt.getDir(f, source, M))) || is_blocked_turf(turf_to_teleport_to, 1)) {
		return f.dot;
	}
	rt.op(f, "Animate", [2, 8], [null, M, "alpha", 0, "time", 2, "easing", 128]);
	yield* sleep(1);
	if (!M) {
		return f.dot;
	}
	M.visible_message(`<span class='hierophant_warning'>${M} fades out!</span>`);
	yield* sleep(2);
	if (!M) {
		return f.dot;
	}
	yield* M.forceMove(turf_to_teleport_to);
	yield* sleep(1);
	if (!M) {
		return f.dot;
	}
	rt.op(f, "Animate", [2, 8], [null, M, "alpha", 255, "time", 2, "easing", 64]);
	yield* sleep(1);
	if (!M) {
		return f.dot;
	}
	M.visible_message(`<span class='hierophant_warning'>${M} fades in!</span>`);
	if (user == M) return f.dot;
	add_logs(user, M, "teleported", null, `from (${source.x},${source.y},${source.z})`);
	return f.dot;
}, true, { argTypes: [{ path: "/turf" }, { type: 8, path: "/mob" }, { path: "/turf" }, { type: 8, path: "/mob" }] });

// necropolis_chests.dm:1174
rt.def("/obj/item/weapon/hierophant_club/proc/cardinal_blasts", function* cardinal_blasts(f: Frame, _T: Value, user: Value) {
	let d: Value = null;
	if (!_T) {
		return f.dot;
	}
	yield* new_(T("/obj/effect/temp_visual/hierophant/telegraph/cardinal"), _T, user);
	playsound(_T, rt.rsc("sound/effects/bin_close.ogg"), 200, 1);
	yield* sleep(2);
	yield* new_(T("/obj/effect/temp_visual/hierophant/blast"), _T, user, this.friendly_fire_check);
	for (d of each(GLOB.cardinal)) {
		yield* ImmediateInvokeAsync(this, P("/obj/item/weapon/hierophant_club/proc/blast_wall"), _T, d, user);
	}
	return f.dot;
}, true, { argTypes: [{ path: "/turf" }, { type: 8, path: "/mob/living" }] });

// necropolis_chests.dm:1184
rt.def("/obj/item/weapon/hierophant_club/proc/blast_wall", function* blast_wall(f: Frame, _T: Value, dir: Value, user: Value) {
	let i: Value = null, B: Value = null;
	let $e: any;
	if (!_T) {
		return f.dot;
	}
	let range: Value = this.blast_range;
	let previousturf: Value = _T;
	let J: Value = rt.getStep(f, previousturf, dir);
	rt.forRange(f, 0, 1, range, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!J) {
			return f.dot;
		}
		(B = (yield* new_(T("/obj/effect/temp_visual/hierophant/blast"), J, user, this.friendly_fire_check))).damage = 30;
		B.monster_damage_boost = 0;
		J = rt.getStep(f, (previousturf = J), dir);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { argTypes: [{ path: "/turf" }, {  }, { type: 8, path: "/mob/living" }] });

// necropolis_chests.dm:1199
rt.def("/obj/item/weapon/hierophant_club/proc/aoe_burst", function* aoe_burst(f: Frame, _T: Value, user: Value) {
	let t: Value = null, B: Value = null;
	if (!_T) {
		return f.dot;
	}
	yield* new_(T("/obj/effect/temp_visual/hierophant/telegraph"), _T, user);
	playsound(_T, rt.rsc("sound/effects/bin_close.ogg"), 200, 1);
	yield* sleep(2);
	for (t of each(block(rt.locate(max(_T.x - 1, 1), max(_T.y - 1, 1), _T.z), rt.locate(min(_T.x + 1, rt.world().maxx), min(_T.y + 1, rt.world().maxy), _T.z)))) {
		(B = (yield* new_(T("/obj/effect/temp_visual/hierophant/blast"), t, user, this.friendly_fire_check))).damage = 15;
	}
	return f.dot;
}, true, { argTypes: [{ path: "/turf" }, { type: 8, path: "/mob/living" }] });
