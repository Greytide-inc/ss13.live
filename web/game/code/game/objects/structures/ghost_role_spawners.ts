// From code/game/objects/structures/ghost_role_spawners.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/effect/mob_spawn/human/seed_vault/proc/special  (code/game/objects/structures/ghost_role_spawners.dm:19)  may sleep
rt.def("/obj/effect/mob_spawn/human/seed_vault/proc/special", function* special(f: Frame, new_spawn: Value) {
	let plant_name: Value = null, H: Value = null;
	f.vars = () => [new_spawn, plant_name, H];
	plant_name = rt.op(f, "PickUnweighted", [26], ["Tomato", "Potato", "Broccoli", "Carrot", "Ambrosia", "Pumpkin", "Ivy", "Kudzu", "Banana", "Moss", "Flower", "Bloom", "Root", "Bark", "Glowshroom", "Petal", "Leaf", "Venus", "Sprout", "Cocoa", "Strawberry", "Citrus", "Oak", "Cactus", "Pepper", "Juniper"]);
	rt.setFv(f, "real_name", live(new_spawn), live(plant_name));
	if (!truthy((rt.istype(live(new_spawn), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	rt.setFv(f, "underwear", (H = live(new_spawn)), "Nude");
	yield* g.callName(f, live(H), "update_body", []);
	return f.dot;
}, true);

// /obj/effect/mob_spawn/human/seed_vault/proc/Destroy  (code/game/objects/structures/ghost_role_spawners.dm:28)  may sleep
rt.def("/obj/effect/mob_spawn/human/seed_vault/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.new_(f, T("/obj/structure/fluff/empty_terrarium"), [rt.getStep(f, live(f.src), 0)]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
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

// /obj/effect/mob_spawn/human/ash_walker/proc/special  (code/game/objects/structures/ghost_role_spawners.dm:49)  may sleep
rt.def("/obj/effect/mob_spawn/human/ash_walker/proc/special", function* special(f: Frame, new_spawn: Value) {
	let holder: Value = null, H: Value = null;
	f.vars = () => [new_spawn, holder, H];
	rt.setFv(f, "real_name", live(new_spawn), (yield* g.call(f, P("/proc/random_unique_lizard_name"), null, [rt.sv(f, "gender")])));
	yield* g.call(f, P("/proc/to_chat"), null, [live(new_spawn), "<b>Drag the corpses of men and beasts to your nest. It will absorb them to create more of your kind. Glory to the Necropolis!</b>"]);
	yield* g.callName(f, live(new_spawn), "grant_language", [T("/datum/language/draconic")]);
	rt.setFv(f, "selected_default_language", (holder = (yield* g.callName(f, live(new_spawn), "get_language_holder", []))), T("/datum/language/draconic"));
	if (!truthy((rt.istype(live(new_spawn), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	rt.setFv(f, "underwear", (H = live(new_spawn)), "Nude");
	yield* g.callName(f, live(H), "update_body", []);
	return f.dot;
}, true);

// /obj/effect/mob_spawn/human/ash_walker/proc/Initialize  (code/game/objects/structures/ghost_role_spawners.dm:62)  may sleep
rt.def("/obj/effect/mob_spawn/human/ash_walker/proc/Initialize", function* Initialize(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))))) return f.dot;
	yield* g.call(f, P("/proc/notify_ghosts"), null, [null, fmt("An ash walker egg is ready to hatch in ％！.", [rt.fv(f, "name", live(A))]), "source", live(f.src), "action", "attack", "flashwindow", 0], rt.Args.Named);
	return f.dot;
}, true, { args: ["mapload"] });

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

// /obj/effect/mob_spawn/human/exile/proc/Destroy  (code/game/objects/structures/ghost_role_spawners.dm:87)  may sleep
rt.def("/obj/effect/mob_spawn/human/exile/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.new_(f, T("/obj/structure/fluff/empty_sleeper"), [rt.getStep(f, live(f.src), 0)]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/effect/mob_spawn/human/exile/proc/special  (code/game/objects/structures/ghost_role_spawners.dm:91)
rt.def("/obj/effect/mob_spawn/human/exile/proc/special", function special(f: Frame, new_spawn: Value) {
	let wish: Value = null;
	let $0: any, $1: any;
	f.vars = () => [wish, $0, $1];
	rt.setFv(f, "real_name", live(new_spawn), fmt("Wish Granter's Victim (＀)", [rt.call(f, P("/proc/rand"), null, [0, 999])]));
	$0 = (wish = rt.call(f, P("/proc/rand"), null, [1, 4]));
	if ($0 === 1) {
		rt.call(f, P("/proc/to_chat"), null, [live(new_spawn), "<b>You wished to kill, and kill you did. You've lost track of how many, but the spark of excitement that murder once held has winked out. You feel only regret.</b>"]);
	} else if ($0 === 2) {
		rt.call(f, P("/proc/to_chat"), null, [live(new_spawn), "<b>You wished for unending wealth, but no amount of money was worth this existence. Maybe charity might redeem your soul?</b>"]);
	} else if ($0 === 3) {
		$0 = live(new_spawn);
		if (isEqual(rt.sv(f, "gender"), "male")) {
			$1 = "king";
		} else {
			$1 = "queen";
		}
		rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<b>You wished for power. Little good it did you, cast out of the light. You are the ＀ of a hell that holds no subjects. You feel only remorse.</b>", [$1])]);
	} else if ($0 === 4) {
		rt.call(f, P("/proc/to_chat"), null, [live(new_spawn), "<b>You wished for immortality, even as your friends lay dying behind you. No matter how many times you cast yourself into the lava, you awaken in this room again within a few days. There is no escape.</b>"]);
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

// /obj/effect/mob_spawn/human/golem/proc/Initialize  (code/game/objects/structures/ghost_role_spawners.dm:123)  may sleep
rt.def("/obj/effect/mob_spawn/human/golem/proc/Initialize", function* Initialize(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	if (live(f.args[1]) === null) {
		f.args[1] = null;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = null;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[1]))) {
		rt.modSrcVar(f, "name", fmt(" (＀)", [rt.initial(f, live(f.args[1]), "prefix")]), add);
		rt.setSv(f, "mob_species", live(f.args[1]));
	}
	A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]));
	if ((!truthy(live(f.args[0])) && truthy(live(A)))) {
		yield* g.call(f, P("/proc/notify_ghosts"), null, [null, fmt("＆！ golem shell has been completed in ％！.", [rt.initial(f, live(f.args[1]), "prefix"), rt.fv(f, "name", live(A))]), "source", live(f.src), "action", "attack", "flashwindow", 0], rt.Args.Named);
	}
	if (!(truthy(rt.sv(f, "has_owner")) && truthy(live(f.args[2])))) return f.dot;
	rt.setSv(f, "flavour_text", fmt("You are a golem. You move slowly, but are highly resistant to heat and cold as well as blunt trauma. You are unable to wear clothes, but can still use most tools. Serve ＀, and assist ＀ in completing ＀ goals at any cost.", [live(f.args[2]), (yield* g.callName(f, live(f.args[2]), "p_them", [])), (yield* g.callName(f, live(f.args[2]), "p_their", []))]));
	rt.setSv(f, "owner", live(f.args[2]));
	return f.dot;
}, true, { args: ["mapload", "species", "creator"] });

// /obj/effect/mob_spawn/human/golem/proc/special  (code/game/objects/structures/ghost_role_spawners.dm:136)  may sleep
rt.def("/obj/effect/mob_spawn/human/golem/proc/special", function* special(f: Frame, new_spawn: Value, name: Value) {
	let X: Value = null, H: Value = null;
	f.vars = () => [new_spawn, name, X, H];
	X = rt.sv(f, "mob_species");
	yield* g.call(f, P("/proc/to_chat"), null, [live(new_spawn), fmt("＀", [rt.initial(f, live(X), "info_text")])]);
	if (!truthy(rt.sv(f, "owner"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(new_spawn), "Build golem shells in the autolathe, and feed refined mineral sheets to the shells to bring them to life! You are generally a peaceful group unless provoked."]);
	} else {
		yield* g.callName(f, rt.fv(f, "mind", live(new_spawn)), "store_memory", [fmt("<b>Serve ＀, your creator.</b>", [rt.fv(f, "real_name", rt.sv(f, "owner"))])]);
		yield* g.callName(f, rt.fv(f, "mind", live(new_spawn)), "enslave_mind_to_creator", [rt.sv(f, "owner")]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ possessed a golem shell enslaved to ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(new_spawn)])), (yield* g.call(f, P("/proc/key_name"), null, [rt.sv(f, "owner")]))])]);
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ possessed a golem shell enslaved to ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(new_spawn)])), (yield* g.call(f, P("/proc/key_name"), null, [rt.sv(f, "owner")]))])]);
	}
	if (!truthy((rt.istype(live(new_spawn), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (H = live(new_spawn)), "set_cloned_appearance", []);
	if (!truthy(live(name))) {
		if (truthy(rt.sv(f, "has_owner"))) {
			rt.setFv(f, "real_name", live(H), fmt("＀ Golem (＀)", [rt.initial(f, live(X), "prefix"), (yield* g.call(f, P("/proc/rand"), null, [1, 999]))]));
		} else {
			rt.setFv(f, "real_name", live(H), (yield* g.callName(f, rt.gv(f, "species", rt.fv(f, "dna", live(H))), "random_name", [])));
		}
	} else {
		rt.setFv(f, "real_name", live(H), live(name));
	}
	return f.dot;
}, true);

// /obj/effect/mob_spawn/human/golem/proc/attack_hand  (code/game/objects/structures/ghost_role_spawners.dm:157)  may sleep
rt.def("/obj/effect/mob_spawn/human/golem/proc/attack_hand", function* attack_hand(f: Frame) {
	let transfer_choice: Value = null;
	f.vars = () => [transfer_choice];
	if ((truthy((yield* g.call(f, P("/proc/is_species"), null, [live(f.args[0]), T("/datum/species/golem")]))) && truthy(rt.sv(f, "can_transfer")))) {
		if (!isEqual((transfer_choice = (yield* g.call(f, P("/proc/alert"), null, [fmt("Transfer your soul to ＀? (Warning, your old body will die!)", [live(f.src)]), null, "Yes", "No"]))), "Yes")) {
			return live(f.dot);
		}
		if (((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) || rt.le(rt.sv(f, "uses"), 0))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ golem-swapped into ＀", [rt.fv(f, "ckey", live(f.args[0])), live(f.src)])]);
		yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='notice'>A faint light leaves ＀, moving to ＀ and animating it!</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='notice'>You leave your old body behind, and transfer into ＀!</span>", [live(f.src)])]);
		yield* g.callSrc(f, "create", ["ckey", rt.fv(f, "ckey", live(f.args[0])), "flavour", 0, "name", rt.fv(f, "real_name", live(f.args[0]))], rt.Args.Named);
		yield* g.callName(f, live(f.args[0]), "death", []);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

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

// /obj/effect/mob_spawn/human/hermit/proc/Initialize  (code/game/objects/structures/ghost_role_spawners.dm:198)  may sleep
rt.def("/obj/effect/mob_spawn/human/hermit/proc/Initialize", function* Initialize(f: Frame) {
	let arrpee: Value = null;
	let $0: any;
	f.vars = () => [arrpee, $0];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	$0 = (arrpee = (yield* g.call(f, P("/proc/rand"), null, [1, 4])));
	if ($0 === 1) {
		rt.modSrcVar(f, "flavour_text", fmt("you were a ＀'s assistant on a small trading station several sectors from here. Raiders attacked, and there was only one pod left when you got to the escape bay. You took it and launched it alone, and the crowd of terrified faces crowding at the airlock door as your pod's engines burst to life and sent you to this hell are forever branded into your memory.</b>", [rt.op(f, "PickUnweighted", [3], ["arms dealer", "shipwright", "docking manager"])]), add);
		rt.setFv(f, "uniform", rt.sv(f, "outfit"), T("/obj/item/clothing/under/assistantformal"));
		rt.setFv(f, "shoes", rt.sv(f, "outfit"), T("/obj/item/clothing/shoes/sneakers/black"));
		rt.setFv(f, "back", rt.sv(f, "outfit"), T("/obj/item/weapon/storage/backpack"));
	} else if ($0 === 2) {
		rt.modSrcVar(f, "flavour_text", "you're an exile from the Tiger Cooperative. Their technological fanaticism drove you to question the power and beliefs of the Exolitics, and they saw you as a heretic and subjected you to hours of horrible torture. You were hours away from execution when a high-ranking friend of yours in the Cooperative managed to secure you a pod, scrambled its destination's coordinates, and launched it. You awoke from stasis when you landed and have been surviving - barely - ever since.</b>", add);
		rt.setFv(f, "uniform", rt.sv(f, "outfit"), T("/obj/item/clothing/under/rank/prisoner"));
		rt.setFv(f, "shoes", rt.sv(f, "outfit"), T("/obj/item/clothing/shoes/sneakers/orange"));
		rt.setFv(f, "back", rt.sv(f, "outfit"), T("/obj/item/weapon/storage/backpack"));
	} else if ($0 === 3) {
		rt.modSrcVar(f, "flavour_text", "you were a doctor on one of Nanotrasen's space stations, but you left behind that damn corporation's tyranny and everything it stood for. From a metaphorical hell to a literal one, you find yourself nonetheless missing the recycled air and warm floors of what you left behind... but you'd still rather be here than there.</b>", add);
		rt.setFv(f, "uniform", rt.sv(f, "outfit"), T("/obj/item/clothing/under/rank/medical"));
		rt.setFv(f, "suit", rt.sv(f, "outfit"), T("/obj/item/clothing/suit/toggle/labcoat"));
		rt.setFv(f, "back", rt.sv(f, "outfit"), T("/obj/item/weapon/storage/backpack/medic"));
		rt.setFv(f, "shoes", rt.sv(f, "outfit"), T("/obj/item/clothing/shoes/sneakers/black"));
	} else if ($0 === 4) {
		rt.modSrcVar(f, "flavour_text", "you were always joked about by your friends for \"not playing with a full deck\", as they so <i>kindly</i> put it. It seems that they were right when you, on a tour at one of Nanotrasen's state-of-the-art research facilities, were in one of the escape pods alone and saw the red button. It was big and shiny, and it caught your eye. You pressed it, and after a terrifying and fast ride for days, you landed here. You've had time to wisen up since then, and you think that your old friends wouldn't be laughing now.</b>", add);
		rt.setFv(f, "uniform", rt.sv(f, "outfit"), T("/obj/item/clothing/under/color/grey/glorf"));
		rt.setFv(f, "shoes", rt.sv(f, "outfit"), T("/obj/item/clothing/shoes/sneakers/black"));
		rt.setFv(f, "back", rt.sv(f, "outfit"), T("/obj/item/weapon/storage/backpack"));
	}
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/effect/mob_spawn/human/hermit/proc/Destroy  (code/game/objects/structures/ghost_role_spawners.dm:231)  may sleep
rt.def("/obj/effect/mob_spawn/human/hermit/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.new_(f, T("/obj/structure/fluff/empty_cryostasis_sleeper"), [rt.getStep(f, live(f.src), 0)]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
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

// /obj/effect/mob_spawn/human/prisoner_transport/proc/special  (code/game/objects/structures/ghost_role_spawners.dm:257)
rt.def("/obj/effect/mob_spawn/human/prisoner_transport/proc/special", function special(f: Frame, L: Value) {
	rt.setFv(f, "real_name", live(L), fmt("NTP #LL-0＀", [rt.call(f, P("/proc/rand"), null, [111, 999])]));
	rt.setFv(f, "name", live(L), rt.fv(f, "real_name", live(L)));
	return f.dot;
});

// /obj/effect/mob_spawn/human/prisoner_transport/proc/Initialize  (code/game/objects/structures/ghost_role_spawners.dm:261)  may sleep
rt.def("/obj/effect/mob_spawn/human/prisoner_transport/proc/Initialize", function* Initialize(f: Frame) {
	let crimes: Value = null;
	f.vars = () => [crimes];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.modSrcVar(f, "flavour_text", fmt("＀. but regardless of that, it seems like your crime doesn't matter now. You don't know where you are, but you know that it's out to kill you, and you're not going to lose this opportunity. Find a way to get out of this mess and back to where you rightfully belong - your ＀</b>.", [rt.op(f, "PickUnweighted", [1], [(crimes = rt.list("murder", "larceny", "embezzlement", "unionization", "dereliction of duty", "kidnapping", "gross incompetence", "grand theft", "collaboration with the Syndicate", "worship of a forbidden deity", "interspecies relations", "mutiny"))]), rt.op(f, "PickUnweighted", [4], ["house", "apartment", "spaceship", "station"])]), add);
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/effect/mob_spawn/human/prisoner_transport/proc/Destroy  (code/game/objects/structures/ghost_role_spawners.dm:276)  may sleep
rt.def("/obj/effect/mob_spawn/human/prisoner_transport/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.new_(f, T("/obj/structure/fluff/empty_sleeper/syndicate"), [rt.getStep(f, live(f.src), 0)]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(624, "/datum/outfit/hotelstaff", "/datum/outfit", {
	name: "Hotel Staff",
	uniform: rt.typePath("/obj/item/clothing/under/assistantformal"),
	shoes: rt.typePath("/obj/item/clothing/shoes/laceup"),
	r_pocket: rt.typePath("/obj/item/device/radio/off"),
	back: rt.typePath("/obj/item/weapon/storage/backpack"),
	implants: null,
});

// /datum/outfit/hotelstaff/proc/<init>  (code/game/objects/structures/ghost_role_spawners.dm:300)
rt.def("/datum/outfit/hotelstaff/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "implants", rt.list(T("/obj/item/weapon/implant/mindshield")));
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

// /obj/effect/mob_spawn/human/hotel_staff/proc/Destroy  (code/game/objects/structures/ghost_role_spawners.dm:320)  may sleep
rt.def("/obj/effect/mob_spawn/human/hotel_staff/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.new_(f, T("/obj/structure/fluff/empty_sleeper/syndicate"), [rt.getStep(f, live(f.src), 0)]);
	yield* g.callSuper(f, [], rt.Args.Same);
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

// /obj/effect/mob_spawn/human/demonic_friend/proc/Initialize  (code/game/objects/structures/ghost_role_spawners.dm:339)  may sleep
rt.def("/obj/effect/mob_spawn/human/demonic_friend/proc/Initialize", function* Initialize(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "owner", live(f.args[1]));
	rt.setSv(f, "flavour_text", fmt("You have been given a reprieve from your eternity of torment, to be ＀'s friend for their short mortal coil.  Be aware that if you do not live up to ＀'s expectations, they can send you back to hell with a single thought.  ＀'s death will also return you to hell.", [rt.fv(f, "name", rt.sv(f, "owner")), rt.fv(f, "name", rt.sv(f, "owner")), rt.fv(f, "name", rt.sv(f, "owner"))]));
	A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]));
	if ((!truthy(live(f.args[0])) && truthy(live(A)))) {
		yield* g.call(f, P("/proc/notify_ghosts"), null, [null, fmt("＆friendship shell has been completed in ％！.", [rt.fv(f, "name", live(A))]), "source", live(f.src), "action", "attack", "flashwindow", 0], rt.Args.Named);
	}
	rt.setSv(f, "objectives", fmt("Be ＀'s friend, and keep ＀ alive, so you don't get sent back to hell.", [rt.fv(f, "name", rt.sv(f, "owner")), rt.fv(f, "name", rt.sv(f, "owner"))]));
	rt.setSv(f, "spell", live(f.args[2]));
	return f.dot;
}, true, { args: ["mapload", "owner_mind", "summoning_spell"] });

// /obj/effect/mob_spawn/human/demonic_friend/proc/special  (code/game/objects/structures/ghost_role_spawners.dm:350)  may sleep
rt.def("/obj/effect/mob_spawn/human/demonic_friend/proc/special", function* special(f: Frame, L: Value) {
	let H: Value = null, worn: Value = null, id: Value = null;
	f.vars = () => [L, H, worn, id];
	if ((!(!truthy(rt.fv(f, "current", rt.sv(f, "owner"))) || truthy(rt.gv(f, "gc_destroyed", rt.fv(f, "current", rt.sv(f, "owner"))))) && !isEqual(rt.gv(f, "stat", rt.fv(f, "current", rt.sv(f, "owner"))), 2))) {
		rt.setFv(f, "real_name", live(L), fmt("＀'s best friend", [rt.fv(f, "name", rt.sv(f, "owner"))]));
		rt.setFv(f, "name", live(L), rt.fv(f, "real_name", live(L)));
		yield* g.call(f, P("/proc/soullink"), null, [T("/datum/soullink/oneway"), rt.fv(f, "current", rt.sv(f, "owner")), live(L)]);
		rt.setFv(f, "friend", rt.sv(f, "spell"), live(L));
		rt.setFv(f, "charge_counter", rt.sv(f, "spell"), rt.fv(f, "charge_max", rt.sv(f, "spell")));
		rt.setFv(f, "hasSoul", rt.fv(f, "mind", live(L)), 0);
		H = live(L);
		worn = rt.fv(f, "wear_id", live(H));
		rt.setFv(f, "registered_name", (id = (yield* g.callName(f, live(worn), "GetID", []))), rt.fv(f, "real_name", live(L)));
		yield* g.callName(f, live(id), "update_label", []);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(L), "<span class='userdanger'>Your owner is already dead!  You will soon perish.</span>"]);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(L), P("/mob/proc/dust"), 150]))]);
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

// /datum/outfit/demonic_friend/proc/<init>  (code/game/objects/structures/ghost_role_spawners.dm:372)
rt.def("/datum/outfit/demonic_friend/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "implants", rt.list(T("/obj/item/weapon/implant/mindshield")));
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

// /obj/effect/mob_spawn/human/syndicate/proc/<init>  (code/game/objects/structures/ghost_role_spawners.dm:381)
rt.def("/obj/effect/mob_spawn/human/syndicate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "id_access_list", rt.list(150));
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

// /datum/outfit/syndicate_empty/proc/<init>  (code/game/objects/structures/ghost_role_spawners.dm:391)
rt.def("/datum/outfit/syndicate_empty/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "implants", rt.list(T("/obj/item/weapon/implant/weapons_auth")));
	return f.dot;
});

// /datum/outfit/syndicate_empty/proc/post_equip  (code/game/objects/structures/ghost_role_spawners.dm:395)
rt.def("/datum/outfit/syndicate_empty/proc/post_equip", function post_equip(f: Frame, H: Value) {
	(rt.modField(f, live(H), "faction", "syndicate", rt.bitOr));
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

// /obj/effect/mob_spawn/human/oldsec/proc/Destroy  (code/game/objects/structures/ghost_role_spawners.dm:460)  may sleep
rt.def("/obj/effect/mob_spawn/human/oldsec/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.new_(f, T("/obj/structure/showcase/oldpod"), [rt.getStep(f, live(f.src), 0)]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
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

// /obj/effect/mob_spawn/human/oldeng/proc/Destroy  (code/game/objects/structures/ghost_role_spawners.dm:481)  may sleep
rt.def("/obj/effect/mob_spawn/human/oldeng/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.new_(f, T("/obj/structure/showcase/oldpod"), [rt.getStep(f, live(f.src), 0)]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
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

// /obj/effect/mob_spawn/human/oldsci/proc/Destroy  (code/game/objects/structures/ghost_role_spawners.dm:502)  may sleep
rt.def("/obj/effect/mob_spawn/human/oldsci/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.new_(f, T("/obj/structure/showcase/oldpod"), [rt.getStep(f, live(f.src), 0)]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);
