// From code/game/gamemodes/blob/blobs/blob_mobs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4855, "/mob/living/simple_animal/hostile/blob", "/mob/living/simple_animal/hostile", {
	overmind: null,
	factory: null,
	pass_flags: 8,
	icon: rt.rsc("icons/mob/blob.dmi"),
	faction: null,
	bubble_icon: "blob",
	speak_emote: null,
	atmos_requirements: null,
	minbodytemp: 0,
	maxbodytemp: 360,
	unique_name: 1,
	a_intent: "harm",
});

// /mob/living/simple_animal/hostile/blob/proc/<init>  (code/game/gamemodes/blob/blobs/blob_mobs.dm:10)
rt.def("/mob/living/simple_animal/hostile/blob/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "faction", rt.list("blob"));
	rt.setSv(f, "speak_emote", null);
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	return f.dot;
});

// /mob/living/simple_animal/hostile/blob/proc/update_icons  (code/game/gamemodes/blob/blobs/blob_mobs.dm:23)
rt.def("/mob/living/simple_animal/hostile/blob/proc/update_icons", function update_icons(f: Frame) {
	if (truthy(rt.sv(f, "overmind"))) {
		rt.callSrc(f, "add_atom_colour", [rt.gv(f, "color", rt.fv(f, "blob_reagent_datum", rt.sv(f, "overmind"))), 4]);
	} else {
		rt.callSrc(f, "remove_atom_colour", [4]);
	}
	return f.dot;
});

// /mob/living/simple_animal/hostile/blob/proc/Destroy  (code/game/gamemodes/blob/blobs/blob_mobs.dm:29)  may sleep
rt.def("/mob/living/simple_animal/hostile/blob/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "overmind"))) {
		(rt.modField(f, rt.sv(f, "overmind"), "blob_mobs", live(f.src), subtract));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/simple_animal/hostile/blob/proc/blob_act  (code/game/gamemodes/blob/blobs/blob_mobs.dm:33)  may sleep
rt.def("/mob/living/simple_animal/hostile/blob/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	let i: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [B, i, H, $e];
	if (!(!isEqual(rt.sv(f, "stat"), 2) && rt.lt(rt.sv(f, "health"), rt.sv(f, "maxHealth")))) return f.dot;
	i = null;
	rt.forRange(f, 0, 1, 2, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		H = (yield* g.new_(f, T("/obj/effect/temp_visual/heal"), [rt.getStep(f, live(f.src), 0)]));
		if (truthy(rt.sv(f, "overmind"))) {
			rt.setFv(f, "color", live(H), rt.gv(f, "complementary_color", rt.fv(f, "blob_reagent_datum", rt.sv(f, "overmind"))));
		} else {
			rt.setFv(f, "color", live(H), "#000000");
		}
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "adjustHealth", multiply(rt.neg(rt.sv(f, "maxHealth")), 0.012500000186264515));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/blob/proc/fire_act  (code/game/gamemodes/blob/blobs/blob_mobs.dm:43)  may sleep
rt.def("/mob/living/simple_animal/hostile/blob/proc/fire_act", function* fire_act(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[0]))) {
		yield* g.srcCall(f, "adjustFireLoss", (yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/min"), null, [multiply(0.009999999776482582, live(f.args[0])), 5]))])));
	} else {
		yield* g.srcCall(f, "adjustFireLoss", 5);
	}
	return f.dot;
}, true, { args: ["exposed_temperature", "exposed_volume"] });

// /mob/living/simple_animal/hostile/blob/proc/CanPass  (code/game/gamemodes/blob/blobs/blob_mobs.dm:50)
rt.def("/mob/living/simple_animal/hostile/blob/proc/CanPass", function CanPass(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/structure/blob")) ? 1 : 0))) {
		return 1;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["mover", "target", "height"] });

// /mob/living/simple_animal/hostile/blob/proc/Process_Spacemove  (code/game/gamemodes/blob/blobs/blob_mobs.dm:55)  may sleep
rt.def("/mob/living/simple_animal/hostile/blob/proc/Process_Spacemove", function* Process_Spacemove(f: Frame) {
	let B: Value = null;
	let $e: any;
	f.vars = () => [B, $e];
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	B = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, live(f.src)])), T("/obj/structure/blob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		return 1;
	}
	rt.endFor(f, 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["movement_dir"] });

// /mob/living/simple_animal/hostile/blob/proc/handle_inherent_channels  (code/game/gamemodes/blob/blobs/blob_mobs.dm:60)  may sleep
rt.def("/mob/living/simple_animal/hostile/blob/proc/handle_inherent_channels", function* handle_inherent_channels(f: Frame) {
	if (isEqual(live(f.args[1]), "binary")) {
		yield* g.srcCall(f, "blob_chat", live(f.args[0]));
		return 1;
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["message", "message_mode"] });

// /mob/living/simple_animal/hostile/blob/proc/blob_chat  (code/game/gamemodes/blob/blobs/blob_mobs.dm:67)
rt.def("/mob/living/simple_animal/hostile/blob/proc/blob_chat", function blob_chat(f: Frame, msg: Value) {
	let spanned_message: Value = null, rendered: Value = null, M: Value = null, link: Value = null;
	let $e: any;
	f.vars = () => [spanned_message, rendered, M, link, $e];
	spanned_message = rt.callSrc(f, "say_quote", [live(msg), rt.callSrc(f, "get_spans", [])]);
	rendered = fmt("<font color=\"#EE4000\"><b>[Blob Telepathy] ＀</b> ＀</font>", [rt.sv(f, "real_name"), live(spanned_message)]);
	M = null;
	rt.forList(f, 0, rt.gl("mob_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if ((truthy((rt.istype(live(M), T("/mob/camera/blob")) ? 1 : 0)) || truthy((rt.istype(live(M), T("/mob/living/simple_animal/hostile/blob")) ? 1 : 0)))) {
			rt.call(f, P("/proc/to_chat"), null, [live(M), live(rendered)]);
		}
		if (truthy((rt.istype(live(M), T("/mob/dead/observer")) ? 1 : 0))) {
			link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [live(M), live(f.src)]);
			rt.call(f, P("/proc/to_chat"), null, [live(M), fmt("＀ ＀", [live(link), live(rendered)])]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

rt.type(4858, "/mob/living/simple_animal/hostile/blob/blobspore", "/mob/living/simple_animal/hostile/blob", {
	death_cloud_size: 1,
	oldguy: null,
	is_zombie: 0,
	verb_say: "psychically pulses",
	verb_ask: "psychically probes",
	verb_exclaim: "psychically yells",
	verb_yell: "psychically screams",
	name: "blob spore",
	desc: "A floating, fragile spore.",
	icon_state: "blobpod",
	icon_living: "blobpod",
	health: 30,
	maxHealth: 30,
	melee_damage_lower: 2,
	melee_damage_upper: 4,
	obj_damage: 20,
	environment_smash: 1,
	attacktext: "hits",
	attack_sound: rt.rsc("sound/weapons/genhit1.ogg"),
	movement_type: 2,
	del_on_death: 1,
	deathmessage: "explodes into a cloud of gas!",
	gold_core_spawnable: 1,
});

// /mob/living/simple_animal/hostile/blob/blobspore/proc/Initialize  (code/game/gamemodes/blob/blobs/blob_mobs.dm:106)  may sleep
rt.def("/mob/living/simple_animal/hostile/blob/blobspore/proc/Initialize", function* Initialize(f: Frame) {
	if (truthy((rt.istype(live(f.args[1]), T("/obj/structure/blob/factory")) ? 1 : 0))) {
		rt.setSv(f, "factory", live(f.args[1]));
		rt.modField(f, rt.sv(f, "factory"), "spores", live(f.src), add);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["mapload", "linked_node"] });

// /mob/living/simple_animal/hostile/blob/blobspore/proc/Life  (code/game/gamemodes/blob/blobs/blob_mobs.dm:112)  may sleep
rt.def("/mob/living/simple_animal/hostile/blob/blobspore/proc/Life", function* Life(f: Frame) {
	let H: Value = null;
	let $e: any;
	f.vars = () => [H, $e];
	if ((!truthy(rt.sv(f, "is_zombie")) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(f.src))]))))) {
		H = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [live(f.src), 1])), T("/mob/living/carbon/human"));
		while (($e = rt.next(f, 0)) !== undefined) {
			H = $e;
			if (isEqual(rt.fv(f, "stat", live(H)), 2)) {
				yield* g.srcCall(f, "Zombify", live(H));
				break;
			}
		}
		rt.endFor(f, 0);
	}
	if ((truthy(rt.sv(f, "factory")) && !isEqual(rt.sv(f, "z"), rt.fv(f, "z", rt.sv(f, "factory"))))) {
		yield* g.srcCall(f, "death");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/hostile/blob/blobspore/proc/Zombify  (code/game/gamemodes/blob/blobs/blob_mobs.dm:123)  may sleep
rt.def("/mob/living/simple_animal/hostile/blob/blobspore/proc/Zombify", function* Zombify(f: Frame, H: Value) {
	let A: Value = null;
	f.vars = () => [H, A];
	rt.setSv(f, "is_zombie", 1);
	if (truthy(rt.fv(f, "wear_suit", live(H)))) {
		if ((truthy(rt.gv(f, "armor", (A = rt.fv(f, "wear_suit", live(H))))) && truthy(rt.index(rt.fv(f, "armor", live(A)), "melee")))) {
			rt.modSrcVar(f, "maxHealth", rt.index(rt.fv(f, "armor", live(A)), "melee"), add);
		}
	}
	rt.setSv(f, "health", (rt.modSrcVar(f, "maxHealth", 40, add)));
	rt.setSv(f, "name", "blob zombie");
	rt.setSv(f, "desc", "A shambling corpse animated by the blob.");
	rt.modSrcVar(f, "melee_damage_lower", 8, add);
	rt.modSrcVar(f, "melee_damage_upper", 11, add);
	rt.setSv(f, "movement_type", 1);
	rt.setSv(f, "death_cloud_size", 0);
	rt.setSv(f, "icon", rt.fv(f, "icon", live(H)));
	rt.setSv(f, "icon_state", "zombie");
	rt.setFv(f, "hair_style", live(H), null);
	yield* g.callName(f, live(H), "update_hair", []);
	yield* g.callName(f, live(H), "forceMove", [live(f.src)]);
	rt.setSv(f, "oldguy", live(H));
	yield* g.srcCall(f, "update_icons");
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>The corpse of ＀ suddenly rises!</span>", [rt.fv(f, "name", live(H))]));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/blob/blobspore/proc/death  (code/game/gamemodes/blob/blobs/blob_mobs.dm:146)  may sleep
rt.def("/mob/living/simple_animal/hostile/blob/blobspore/proc/death", function* death(f: Frame) {
	let S: Value = null, location: Value = null;
	f.vars = () => [S, location];
	S = (yield* g.new_(f, T("/datum/effect_system/smoke_spread/chem"), []));
	location = rt.getStep(f, live(f.src), 0);
	yield* g.srcCall(f, "create_reagents", 10);
	if ((truthy(rt.sv(f, "overmind")) && truthy(rt.fv(f, "blob_reagent_datum", rt.sv(f, "overmind"))))) {
		yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", [rt.gv(f, "id", rt.fv(f, "blob_reagent_datum", rt.sv(f, "overmind"))), 10]);
	} else {
		yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["spore", 10]);
	}
	yield* g.callName(f, live(S), "attach", [live(location)]);
	yield* g.callName(f, live(S), "set_up", [null, rt.sv(f, "reagents"), null, rt.sv(f, "death_cloud_size"), null, live(location), "silent", 1], rt.Args.Named);
	yield* g.callName(f, live(S), "start", []);
	if (truthy(rt.sv(f, "factory"))) {
		rt.setFv(f, "spore_delay", rt.sv(f, "factory"), add(rt.worldTime(f), rt.fv(f, "spore_cooldown", rt.sv(f, "factory"))));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["gibbed"] });

// /mob/living/simple_animal/hostile/blob/blobspore/proc/Destroy  (code/game/gamemodes/blob/blobs/blob_mobs.dm:168)  may sleep
rt.def("/mob/living/simple_animal/hostile/blob/blobspore/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "factory"))) {
		(rt.modField(f, rt.sv(f, "factory"), "spores", live(f.src), subtract));
	}
	rt.setSv(f, "factory", null);
	if (truthy(rt.sv(f, "oldguy"))) {
		yield* g.callName(f, rt.sv(f, "oldguy"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
		rt.setSv(f, "oldguy", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/simple_animal/hostile/blob/blobspore/proc/update_icons  (code/game/gamemodes/blob/blobs/blob_mobs.dm:177)
rt.def("/mob/living/simple_animal/hostile/blob/blobspore/proc/update_icons", function update_icons(f: Frame) {
	let blob_head_overlay: Value = null;
	f.vars = () => [blob_head_overlay];
	if (truthy(rt.sv(f, "overmind"))) {
		rt.callSrc(f, "add_atom_colour", [rt.gv(f, "complementary_color", rt.fv(f, "blob_reagent_datum", rt.sv(f, "overmind"))), 4]);
	} else {
		rt.callSrc(f, "remove_atom_colour", [4]);
	}
	if (!truthy(rt.sv(f, "is_zombie"))) return f.dot;
	rt.callSrc(f, "copy_overlays", [rt.sv(f, "oldguy"), 1]);
	blob_head_overlay = rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/mob/blob.dmi"), "blob_head"]);
	if (truthy(rt.sv(f, "overmind"))) {
		rt.setFv(f, "color", live(blob_head_overlay), rt.gv(f, "complementary_color", rt.fv(f, "blob_reagent_datum", rt.sv(f, "overmind"))));
	}
	rt.setSv(f, "color", rt.initial(f, live(f.src), "color"));
	rt.callSrc(f, "add_overlay", [live(blob_head_overlay)]);
	return f.dot;
});

rt.type(4856, "/mob/living/simple_animal/hostile/blob/blobbernaut", "/mob/living/simple_animal/hostile/blob", {
	independent: 0,
	verb_say: "gurgles",
	verb_ask: "demands",
	verb_exclaim: "roars",
	verb_yell: "bellows",
	pressure_resistance: 50,
	name: "blobbernaut",
	desc: "A hulking, mobile chunk of blobmass.",
	icon_state: "blobbernaut",
	icon_living: "blobbernaut",
	icon_dead: "blobbernaut_dead",
	health: 200,
	maxHealth: 200,
	damage_coeff: null,
	melee_damage_lower: 20,
	melee_damage_upper: 20,
	obj_damage: 60,
	attacktext: "slams",
	attack_sound: rt.rsc("sound/effects/blobattack.ogg"),
	force_threshold: 10,
	mob_size: 3,
	see_in_dark: 8,
	lighting_alpha: 128,
});

// /mob/living/simple_animal/hostile/blob/blobbernaut/proc/<init>  (code/game/gamemodes/blob/blobs/blob_mobs.dm:208)
rt.def("/mob/living/simple_animal/hostile/blob/blobbernaut/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "damage_coeff", rt.alist(f, ["brute", 0.5, "fire", 1, "tox", 1, "clone", 1, "stamina", 0, "oxy", 1]));
	return f.dot;
});

// /mob/living/simple_animal/hostile/blob/blobbernaut/proc/Initialize  (code/game/gamemodes/blob/blobs/blob_mobs.dm:226)  may sleep
rt.def("/mob/living/simple_animal/hostile/blob/blobbernaut/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "independent"))) return f.dot;
	(rt.modSrcVar(f, "verbs", P("/mob/living/verb/pulled"), subtract));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/blob/blobbernaut/proc/Life  (code/game/gamemodes/blob/blobs/blob_mobs.dm:231)  may sleep
rt.def("/mob/living/simple_animal/hostile/blob/blobbernaut/proc/Life", function* Life(f: Frame) {
	let damagesources: Value = null, i: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [damagesources, i, I, $e];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	if (truthy(rt.sv(f, "independent"))) {
		return live(f.dot);
	}
	damagesources = 0;
	if (!truthy(rt.locateIn(f, T("/obj/structure/blob"), (yield* g.call(f, P("/proc/range"), null, [2, live(f.src)]))))) {
		damagesources = rt.inc(live(damagesources), 1);
	}
	if (!truthy(rt.sv(f, "factory"))) {
		damagesources = rt.inc(live(damagesources), 1);
	}
	if (!truthy(live(damagesources))) return f.dot;
	i = null;
	rt.forRange(f, 0, 1, live(damagesources), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.srcCall(f, "adjustHealth", multiply(rt.sv(f, "maxHealth"), 0.02500000037252903));
	}
	rt.endFor(f, 0);
	rt.setFv(f, "appearance_flags", (I = (yield* g.new_(f, T("/image"), [rt.rsc("icons/mob/blob.dmi"), live(f.src), "nautdamage", 4.010000228881836]))), 2);
	if (truthy(rt.sv(f, "overmind"))) {
		rt.setFv(f, "color", live(I), rt.gv(f, "complementary_color", rt.fv(f, "blob_reagent_datum", rt.sv(f, "overmind"))));
	}
	yield* g.call(f, P("/proc/flick_overlay_view"), null, [live(I), live(f.src), 8]);
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/hostile/blob/blobbernaut/proc/adjustHealth  (code/game/gamemodes/blob/blobs/blob_mobs.dm:249)  may sleep
rt.def("/mob/living/simple_animal/hostile/blob/blobbernaut/proc/adjustHealth", function* adjustHealth(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.args[1]))) return f.dot;
	yield* g.srcCall(f, "update_health_hud");
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });

// /mob/living/simple_animal/hostile/blob/blobbernaut/proc/update_health_hud  (code/game/gamemodes/blob/blobs/blob_mobs.dm:255)
rt.def("/mob/living/simple_animal/hostile/blob/blobbernaut/proc/update_health_hud", function update_health_hud(f: Frame) {
	if (!truthy(rt.sv(f, "hud_used"))) return f.dot;
	rt.setFv(f, "maptext", rt.fv(f, "healths", rt.sv(f, "hud_used")), fmt("<div align='center' valign='middle' style='position:relative; top:0px; left:6px'><font color='#e36600'>＀%</font></div>", [rt.call(f, P("/proc/round"), null, [multiply(divide(rt.sv(f, "health"), rt.sv(f, "maxHealth")), 100), 0.5])]));
	return f.dot;
});

// /mob/living/simple_animal/hostile/blob/blobbernaut/proc/AttackingTarget  (code/game/gamemodes/blob/blobs/blob_mobs.dm:258)  may sleep
rt.def("/mob/living/simple_animal/hostile/blob/blobbernaut/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let L: Value = null, mob_protection: Value = null;
	f.vars = () => [L, mob_protection];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!((truthy(live(f.dot)) && truthy((rt.istype(rt.sv(f, "target"), T("/mob/living")) ? 1 : 0))) && truthy(rt.sv(f, "overmind")))) return f.dot;
	L = rt.sv(f, "target");
	mob_protection = (yield* g.callName(f, live(L), "get_permeability_protection", []));
	yield* g.callName(f, rt.fv(f, "blob_reagent_datum", rt.sv(f, "overmind")), "reaction_mob", [live(L), 3, 20, 0, live(mob_protection), rt.sv(f, "overmind")]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/blob/blobbernaut/proc/update_icons  (code/game/gamemodes/blob/blobs/blob_mobs.dm:265)
rt.def("/mob/living/simple_animal/hostile/blob/blobbernaut/proc/update_icons", function update_icons(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "overmind"))) {
		rt.setSv(f, "melee_damage_lower", 4);
		rt.setSv(f, "melee_damage_upper", 4);
		rt.setSv(f, "attacktext", rt.gv(f, "blobbernaut_message", rt.fv(f, "blob_reagent_datum", rt.sv(f, "overmind"))));
	} else {
		rt.setSv(f, "melee_damage_lower", rt.initial(f, live(f.src), "melee_damage_lower"));
		rt.setSv(f, "melee_damage_upper", rt.initial(f, live(f.src), "melee_damage_upper"));
		rt.setSv(f, "attacktext", rt.initial(f, live(f.src), "attacktext"));
	}
	return f.dot;
});

// /mob/living/simple_animal/hostile/blob/blobbernaut/proc/death  (code/game/gamemodes/blob/blobs/blob_mobs.dm:276)  may sleep
rt.def("/mob/living/simple_animal/hostile/blob/blobbernaut/proc/death", function* death(f: Frame, gibbed: Value) {
	f.vars = () => [gibbed];
	yield* g.callSuper(f, [live(gibbed)]);
	if (truthy(rt.sv(f, "factory"))) {
		rt.setFv(f, "naut", rt.sv(f, "factory"), null);
		rt.setFv(f, "max_integrity", rt.sv(f, "factory"), rt.initial(f, rt.sv(f, "factory"), "max_integrity"));
	}
	yield* g.call(f, P("/proc/flick"), null, ["blobbernaut_death", live(f.src)]);
	return f.dot;
}, true);
