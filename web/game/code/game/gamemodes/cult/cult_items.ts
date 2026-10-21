// From code/game/gamemodes/cult/cult_items.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/item/weapon/melee/cultblade/proc/attack  (code/game/gamemodes/cult/cult_items.dm:16)  may sleep
rt.def("/obj/item/weapon/melee/cultblade/proc/attack", function* attack(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (!truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(f.args[1])])))) {
		yield* g.callName(f, live(f.args[1]), "Knockdown", [100]);
		yield* g.callName(f, live(f.args[1]), "dropItemToGround", [live(f.src), 1]);
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>A powerful force shoves ＀ away from ＀!</span>", [live(f.args[1]), live(f.args[0])]), "<span class='cultlarge'>\"You shouldn't play with sharp things. You'll poke someone's eye out.\"</span>"]);
		if (truthy((rt.istype(live(f.args[1]), T("/mob/living/carbon/human")) ? 1 : 0))) {
			yield* g.callName(f, (H = live(f.args[1])), "apply_damage", [(yield* g.call(f, P("/proc/rand"), null, [divide(rt.sv(f, "force"), 2), rt.sv(f, "force")])), "brute", rt.op(f, "PickUnweighted", [2], ["l_arm", "r_arm"])]);
		} else {
			yield* g.callName(f, live(f.args[1]), "adjustBruteLoss", [(yield* g.call(f, P("/proc/rand"), null, [divide(rt.sv(f, "force"), 2), rt.sv(f, "force")]))]);
		}
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["target", "user"] });

// /obj/item/weapon/melee/cultblade/proc/pickup  (code/game/gamemodes/cult/cult_items.dm:35)  may sleep
rt.def("/obj/item/weapon/melee/cultblade/proc/pickup", function* pickup(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(f.args[0])])))) return f.dot;
	if (!truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='cultlarge'>\"I wouldn't advise that.\"</span>"]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>An overwhelming sense of nausea overpowers you!</span>"]);
		yield* g.callName(f, live(f.args[0]), "Dizzy", [120]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='cultlarge'>\"One of Ratvar's toys is trying to play with things ＀ shouldn't. Cute.\"</span>", [(yield* g.callName(f, live(f.args[0]), "p_they", []))])]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='userdanger'>A horrible force yanks at your arm!</span>"]);
		yield* g.callName(f, live(f.args[0]), "emote", ["scream"]);
		yield* g.callName(f, live(f.args[0]), "apply_damage", [30, "brute", rt.op(f, "PickUnweighted", [2], ["l_arm", "r_arm"])]);
		yield* g.callName(f, live(f.args[0]), "dropItemToGround", [live(f.src)]);
	}
	return f.dot;
}, true, { args: ["user"] });

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

// /obj/item/weapon/melee/cultblade/dagger/proc/attack  (code/game/gamemodes/cult/cult_items.dm:59)  may sleep
rt.def("/obj/item/weapon/melee/cultblade/dagger/proc/attack", function* attack(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (C = live(f.args[0])), "bleed", [50]);
	if (!(truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(C)]))) && truthy(rt.fv(f, "reagents", live(C))))) return f.dot;
	yield* g.callName(f, rt.fv(f, "reagents", live(C)), "add_reagent", ["heparin", 1]);
	return f.dot;
}, true, { args: ["target", "user"] });

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

// /obj/item/clothing/head/culthood/proc/<init>  (code/game/gamemodes/cult/cult_items.dm:81)
rt.def("/obj/item/clothing/head/culthood/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 10, "laser", 5, "energy", 5, "bomb", 0, "bio", 0, "rad", 0, "fire", 10, "acid", 10]));
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

// /obj/item/clothing/suit/cultrobes/proc/<init>  (code/game/gamemodes/cult/cult_items.dm:93)
rt.def("/obj/item/clothing/suit/cultrobes/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/tome"), T("/obj/item/weapon/melee/cultblade")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 50, "bullet", 30, "laser", 50, "energy", 20, "bomb", 25, "bio", 10, "rad", 0, "fire", 10, "acid", 10]));
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

// /obj/item/clothing/head/magus/proc/<init>  (code/game/gamemodes/cult/cult_items.dm:127)
rt.def("/obj/item/clothing/head/magus/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 30, "laser", 30, "energy", 20, "bomb", 0, "bio", 0, "rad", 0, "fire", 10, "acid", 10]));
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

// /obj/item/clothing/suit/magusred/proc/<init>  (code/game/gamemodes/cult/cult_items.dm:136)
rt.def("/obj/item/clothing/suit/magusred/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/tome"), T("/obj/item/weapon/melee/cultblade")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 50, "bullet", 30, "laser", 50, "energy", 20, "bomb", 25, "bio", 10, "rad", 0, "fire", 10, "acid", 10]));
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

// /obj/item/clothing/head/helmet/space/hardsuit/cult/proc/<init>  (code/game/gamemodes/cult/cult_items.dm:145)
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/cult/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 60, "bullet", 50, "laser", 30, "energy", 15, "bomb", 30, "bio", 30, "rad", 30, "fire", 40, "acid", 75]));
	$0 = $0;
	rt.setSv(f, "actions_types", rt.list());
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

// /obj/item/clothing/suit/space/hardsuit/cult/proc/<init>  (code/game/gamemodes/cult/cult_items.dm:155)
rt.def("/obj/item/clothing/suit/space/hardsuit/cult/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/tome"), T("/obj/item/weapon/melee/cultblade"), T("/obj/item/weapon/tank/internals")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 70, "bullet", 50, "laser", 30, "energy", 15, "bomb", 30, "bio", 30, "rad", 30, "fire", 40, "acid", 75]));
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

// /obj/item/clothing/suit/hooded/cultrobes/cult_shield/proc/<init>  (code/game/gamemodes/cult/cult_items.dm:173)
rt.def("/obj/item/clothing/suit/hooded/cultrobes/cult_shield/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 50, "bullet", 40, "laser", 50, "energy", 30, "bomb", 50, "bio", 30, "rad", 30, "fire", 50, "acid", 60]));
	$0 = $0;
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/tome"), T("/obj/item/weapon/melee/cultblade")));
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

// /obj/item/clothing/head/hooded/cult_hoodie/proc/<init>  (code/game/gamemodes/cult/cult_items.dm:183)
rt.def("/obj/item/clothing/head/hooded/cult_hoodie/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 50, "bullet", 40, "laser", 50, "energy", 30, "bomb", 50, "bio", 30, "rad", 30, "fire", 50, "acid", 50]));
	return f.dot;
});

// /obj/item/clothing/suit/hooded/cultrobes/cult_shield/proc/equipped  (code/game/gamemodes/cult/cult_items.dm:188)  may sleep
rt.def("/obj/item/clothing/suit/hooded/cultrobes/cult_shield/proc/equipped", function* equipped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(f.args[0])])))) return f.dot;
	if (!truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='cultlarge'>\"I wouldn't advise that.\"</span>"]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>An overwhelming sense of nausea overpowers you!</span>"]);
		yield* g.callName(f, live(f.args[0]), "dropItemToGround", [live(f.src), 1]);
		yield* g.callName(f, live(f.args[0]), "Dizzy", [30]);
		yield* g.callName(f, live(f.args[0]), "Knockdown", [100]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='cultlarge'>\"Trying to use things you don't own is bad, you know.\"</span>"]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='userdanger'>The armor squeezes at your body!</span>"]);
		yield* g.callName(f, live(f.args[0]), "emote", ["scream"]);
		yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [25]);
		yield* g.callName(f, live(f.args[0]), "dropItemToGround", [live(f.src), 1]);
	}
	return f.dot;
}, true, { args: ["user", "slot"] });

// /obj/item/clothing/suit/hooded/cultrobes/cult_shield/proc/hit_reaction  (code/game/gamemodes/cult/cult_items.dm:205)  may sleep
rt.def("/obj/item/clothing/suit/hooded/cultrobes/cult_shield/proc/hit_reaction", function* hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	f.vars = () => [owner, hitby, attack_text, final_block_chance, damage, attack_type];
	if (live(attack_text) === null) {
		attack_text = "the attack";
	}
	if (live(final_block_chance) === null) {
		final_block_chance = 0;
	}
	if (live(damage) === null) {
		damage = 0;
	}
	if (live(attack_type) === null) {
		attack_type = 1;
	}
	if (truthy(rt.sv(f, "current_charges"))) {
		yield* g.callName(f, live(owner), "visible_message", [fmt("<span class='danger'>＄！ is deflected in a burst of blood-red sparks!</span>", [live(attack_text)])]);
		rt.incSrcVar(f, "current_charges", -1, true);
		yield* g.new_(f, T("/obj/effect/temp_visual/cult/sparks"), [rt.getStep(f, live(owner), 0)]);
		if (!truthy(rt.sv(f, "current_charges"))) {
			yield* g.callName(f, live(owner), "visible_message", [fmt("<span class='danger'>The runed shield around ＀ suddenly disappears!</span>", [live(owner)])]);
			yield* g.callName(f, live(owner), "update_inv_wear_suit", []);
		}
		return 1;
	}
	return 0;
}, true);

// /obj/item/clothing/suit/hooded/cultrobes/cult_shield/proc/worn_overlays  (code/game/gamemodes/cult/cult_items.dm:215)
rt.def("/obj/item/clothing/suit/hooded/cultrobes/cult_shield/proc/worn_overlays", function worn_overlays(f: Frame, isinhands: Value) {
	f.dot = rt.list();
	if (!(!truthy(live(isinhands)) && truthy(rt.sv(f, "current_charges")))) return f.dot;
	f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/cult_effects.dmi"), "shield-cult", 4.010000228881836]), add);
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

// /obj/item/clothing/suit/hooded/cultrobes/berserker/proc/<init>  (code/game/gamemodes/cult/cult_items.dm:225)
rt.def("/obj/item/clothing/suit/hooded/cultrobes/berserker/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/tome"), T("/obj/item/weapon/melee/cultblade")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", -50, "bullet", -50, "laser", -50, "energy", -50, "bomb", -50, "bio", -50, "rad", -50, "fire", 0, "acid", 0]));
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

// /obj/item/clothing/head/hooded/berserkerhood/proc/<init>  (code/game/gamemodes/cult/cult_items.dm:237)
rt.def("/obj/item/clothing/head/hooded/berserkerhood/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", -50, "bullet", -50, "laser", -50, "energy", -50, "bomb", -50, "bio", -50, "rad", -50, "fire", 0, "acid", 0]));
	return f.dot;
});

// /obj/item/clothing/suit/hooded/cultrobes/berserker/proc/equipped  (code/game/gamemodes/cult/cult_items.dm:240)  may sleep
rt.def("/obj/item/clothing/suit/hooded/cultrobes/berserker/proc/equipped", function* equipped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(f.args[0])])))) return f.dot;
	if (!truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='cultlarge'>\"I wouldn't advise that.\"</span>"]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>An overwhelming sense of nausea overpowers you!</span>"]);
		yield* g.callName(f, live(f.args[0]), "dropItemToGround", [live(f.src), 1]);
		yield* g.callName(f, live(f.args[0]), "Dizzy", [30]);
		yield* g.callName(f, live(f.args[0]), "Knockdown", [100]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='cultlarge'>\"Trying to use things you don't own is bad, you know.\"</span>"]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='userdanger'>The robes squeeze at your body!</span>"]);
		yield* g.callName(f, live(f.args[0]), "emote", ["scream"]);
		yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [25]);
		yield* g.callName(f, live(f.args[0]), "dropItemToGround", [live(f.src), 1]);
	}
	return f.dot;
}, true, { args: ["user", "slot"] });

rt.type(8209, "/obj/item/clothing/glasses/night/cultblind", "/obj/item/clothing/glasses/night", {
	desc: "May nar-sie guide you through the darkness and shield you from the light.",
	name: "zealot's blindfold",
	icon_state: "blindfold",
	item_state: "blindfold",
	darkness_view: 8,
	flash_protect: 1,
});

// /obj/item/clothing/glasses/night/cultblind/proc/equipped  (code/game/gamemodes/cult/cult_items.dm:264)  may sleep
rt.def("/obj/item/clothing/glasses/night/cultblind/proc/equipped", function* equipped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(f.args[0])])))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='cultlarge'>\"You want to be blind, do you?\"</span>"]);
	yield* g.callName(f, live(f.args[0]), "dropItemToGround", [live(f.src), 1]);
	yield* g.callName(f, live(f.args[0]), "Dizzy", [30]);
	yield* g.callName(f, live(f.args[0]), "Knockdown", [100]);
	yield* g.callName(f, live(f.args[0]), "blind_eyes", [30]);
	return f.dot;
}, true, { args: ["user", "slot"] });

rt.type(5803, "/obj/item/weapon/reagent_containers/food/drinks/bottle/unholywater", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "flask of unholy water",
	desc: "Toxic to nonbelievers; reinvigorating to the faithful - this flask may be sipped or thrown.",
	icon_state: "holyflask",
	color: "#333333",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/bottle/unholywater/proc/<init>  (code/game/gamemodes/cult/cult_items.dm:277)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/unholywater/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["unholywater", 40]));
	return f.dot;
});

rt.type(9119, "/obj/item/device/shuttle_curse", "/obj/item/device", {
	name: "cursed orb",
	desc: "You peer within this smokey orb and glimpse terrible fates befalling the escape shuttle.",
	icon: rt.rsc("icons/obj/cult.dmi"),
	icon_state: "shuttlecurse",
}, { global: { curselimit: 736 } });

// /obj/item/device/shuttle_curse/proc/attack_self  (code/game/gamemodes/cult/cult_items.dm:287)  may sleep
rt.def("/obj/item/device/shuttle_curse/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let cursetime: Value = null, timer: Value = null, message: Value = null;
	f.vars = () => [user, cursetime, timer, message];
	if (!truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(user)])))) {
		yield* g.callName(f, live(user), "dropItemToGround", [live(f.src), 1]);
		yield* g.callName(f, live(user), "Knockdown", [100]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>A powerful force shoves you away from ＀!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if (rt.gt(rt.gl("curselimit"), 1)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>We have exhausted our ability to curse the shuttle.</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.locateIn(f, T("/obj/singularity/narsie"), rt.gl("poi_list")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Nar-Sie is already on this plane, there is no delaying the end of all things.</span>"]);
		return live(f.dot);
	}
	if (!isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "call")) return f.dot;
	cursetime = 1800;
	timer = add((yield* g.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "timeLeft", [1])), live(cursetime));
	yield* g.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "setTimer", [live(timer)]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>You shatter the orb! A dark essence spirals into the air, then disappears.</span>"]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(user)), rt.rsc("sound/effects/glassbr1.ogg"), 50, 1]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	yield* g.call(f, P("/proc/sleep"), null, [20]);
	if (!truthy(rt.gl("curses"))) {
		rt.setGl("curses", rt.list("A fuel technician just slit his own throat and begged for death. The shuttle will be delayed by three minutes.", "The shuttle's navigation programming was replaced by a file containing two words, IT COMES. The shuttle will be delayed by three minutes.", "The shuttle's custodian tore out his guts and began painting strange shapes on the floor. The shuttle will be delayed by three minutes.", "A shuttle engineer began screaming 'DEATH IS NOT THE END' and ripped out wires until an arc flash seared off her flesh. The shuttle will be delayed by three minutes.", "A shuttle inspector started laughing madly over the radio and then threw herself into an engine turbine. The shuttle will be delayed by three minutes.", "The shuttle dispatcher was found dead with bloody symbols carved into their flesh. The shuttle will be delayed by three minutes."));
	}
	yield* g.call(f, P("/proc/priority_announce"), null, [fmt("＀", [(message = (yield* g.call(f, P("/proc/pick_n_take"), null, [rt.gl("curses")])))]), "System Failure", rt.rsc("sound/misc/notice1.ogg")]);
	rt.incGl("curselimit", 1, true);
	return f.dot;
}, true);

rt.type(9120, "/obj/item/device/cult_shift", "/obj/item/device", {
	uses: 4,
	name: "veil shifter",
	desc: "This relic teleports you forward a medium distance.",
	icon: rt.rsc("icons/obj/cult.dmi"),
	icon_state: "shifter",
});

// /obj/item/device/cult_shift/proc/examine  (code/game/gamemodes/cult/cult_items.dm:327)
rt.def("/obj/item/device/cult_shift/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "uses"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='cult'>It has ＀ uses remaining.</span>", [rt.sv(f, "uses")])]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='cult'>It seems drained.</span>"]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/device/cult_shift/proc/handle_teleport_grab  (code/game/gamemodes/cult/cult_items.dm:334)  may sleep
rt.def("/obj/item/device/cult_shift/proc/handle_teleport_grab", function* handle_teleport_grab(f: Frame, _T: Value, user: Value) {
	let C: Value = null, pulled: Value = null;
	f.vars = () => [_T, user, C, pulled];
	if (!truthy(rt.gv(f, "pulling", (C = live(user))))) return f.dot;
	yield* g.callName(f, (pulled = rt.fv(f, "pulling", live(C))), "forceMove", [live(_T)]);
	f.dot = live(pulled);
	return f.dot;
}, true);

// /obj/item/device/cult_shift/proc/attack_self  (code/game/gamemodes/cult/cult_items.dm:341)  may sleep
rt.def("/obj/item/device/cult_shift/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let C: Value = null, mobloc: Value = null, destination: Value = null, pulled: Value = null;
	f.vars = () => [user, C, mobloc, destination, pulled];
	if ((!truthy(rt.sv(f, "uses")) || !truthy((rt.istype(live(user), T("/mob/living/carbon")) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＄！ is dull and unmoving in your hands.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(user)])))) {
		yield* g.callName(f, live(user), "dropItemToGround", [live(f.src), 1]);
		yield* g.call(f, P("/proc/step"), null, [live(f.src), rt.op(f, "PickUnweighted", [1], [rt.gl("alldirs")])]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＄！ flickers out of your hands, your connection to this dimension is too strong!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	C = live(user);
	mobloc = rt.getStep(f, live(C), 0);
	if (truthy((destination = (yield* g.call(f, P("/proc/get_teleport_loc"), null, [live(mobloc), live(C), 9, 1, 3, 1, 0, 1]))))) {
		rt.incSrcVar(f, "uses", -1, true);
		if (rt.le(rt.sv(f, "uses"), 0)) {
			rt.setSv(f, "icon_state", "shifter_drained");
		}
		yield* g.call(f, P("/proc/playsound"), null, [live(mobloc), "sparks", 50, 1]);
		yield* g.new_(f, T("/obj/effect/temp_visual/dir_setting/cult/phase/out"), [live(mobloc), rt.fv(f, "dir", live(C))]);
		pulled = (yield* g.srcCall(f, "handle_teleport_grab", live(destination), live(C)));
		yield* g.callName(f, live(C), "forceMove", [live(destination)]);
		if (truthy(live(pulled))) {
			yield* g.callName(f, live(C), "start_pulling", [live(pulled)]);
		}
		yield* g.new_(f, T("/obj/effect/temp_visual/dir_setting/cult/phase"), [live(destination), rt.fv(f, "dir", live(C))]);
		yield* g.call(f, P("/proc/playsound"), null, [live(destination), rt.rsc("sound/effects/phasein.ogg"), 25, 1]);
		yield* g.call(f, P("/proc/playsound"), null, [live(destination), "sparks", 50, 1]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(C), "<span class='danger'>The veil cannot be torn here!</span>"]);
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

// /obj/item/device/flashlight/flare/culttorch/proc/afterattack  (code/game/gamemodes/cult/cult_items.dm:387)  may sleep
rt.def("/obj/item/device/flashlight/flare/culttorch/proc/afterattack", function* afterattack(f: Frame) {
	let cultists: Value = null, M: Value = null, cultist_to_receive: Value = null;
	let $e: any;
	f.vars = () => [cultists, M, cultist_to_receive, $e];
	if (!truthy(live(f.args[2]))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item")) ? 1 : 0))) {
		cultists = rt.list();
		M = null;
		rt.forList(f, 0, rt.gv(f, "cult", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/mind"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			if ((truthy(rt.fv(f, "current", live(M))) && !isEqual(rt.gv(f, "stat", rt.fv(f, "current", live(M))), 2))) {
				(cultists = rt.modify(live(cultists), rt.fv(f, "current", live(M)), rt.bitOr));
			}
		}
		rt.endFor(f, 0);
		cultist_to_receive = (yield* g.op(f, "Prompt", [1], [null, "Followers of the Geometer", fmt("Who do you wish to call to ＀?", [live(f.src)]), live(f.args[1]), subtract(live(cultists), live(f.args[1]))]));
		if ((((!truthy((yield* g.srcCall(f, "Adjacent", live(f.args[1])))) || !truthy(live(f.src))) || (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) || truthy((yield* g.callName(f, live(f.args[1]), "incapacitated", []))))) {
			return live(f.dot);
		}
		if (!truthy(live(cultist_to_receive))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='cultitalic'>You require a destination!</span>"]);
			yield* g.call(f, P("/proc/log_game"), null, ["Void torch failed - no target"]);
			return live(f.dot);
		}
		if (isEqual(rt.fv(f, "stat", live(cultist_to_receive)), 2)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='cultitalic'>＀ has died!</span>", [live(cultist_to_receive)])]);
			yield* g.call(f, P("/proc/log_game"), null, ["Void torch failed  - target died"]);
			return live(f.dot);
		}
		if (!truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(cultist_to_receive)])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='cultitalic'>＀ is not a follower of the Geometer!</span>", [live(cultist_to_receive)])]);
			yield* g.call(f, P("/proc/log_game"), null, ["Void torch failed - target was deconverted"]);
			return live(f.dot);
		}
		if (truthy((rt.isIn(f, live(f.args[0]), (yield* g.callName(f, live(f.args[1]), "GetAllContents", []))) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='cultitalic'>＀ must be on a surface in order to teleport it!</span>", [live(f.args[0])])]);
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='cultitalic'>You ignite ＀ with ％！, turning it to ash, but through the torch's flames you see that ＀ has reached ＀!", [live(f.args[0]), live(f.src), live(f.args[0]), live(cultist_to_receive)])]);
		yield* g.callName(f, live(cultist_to_receive), "put_in_hands", [live(f.args[0])]);
		rt.incSrcVar(f, "charges", -1, true);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("＄！ now has ＀ charge５.", [live(f.src), rt.sv(f, "charges")])]);
		if (isEqual(rt.sv(f, "charges"), 0)) {
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		}
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＄！ can only transport items!</span>", [live(f.src)])]);
	}
	return f.dot;
}, true, { args: ["A", "user", "proximity"] });
