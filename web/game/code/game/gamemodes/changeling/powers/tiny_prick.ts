// From code/game/gamemodes/changeling/powers/tiny_prick.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11253, "/obj/effect/proc_holder/changeling/sting", "/obj/effect/proc_holder/changeling", {
	sting_icon: null,
	name: "Tiny Prick",
	desc: "Stabby stabby",
});

// /obj/effect/proc_holder/changeling/sting/proc/Click  (code/game/gamemodes/changeling/powers/tiny_prick.dm:7)
rt.def("/obj/effect/proc_holder/changeling/sting/proc/Click", function Click(f: Frame) {
	let user: Value = null;
	f.vars = () => [user];
	if (((!truthy((user = live(f.usr))) || !truthy(rt.fv(f, "mind", live(user)))) || !truthy(rt.gv(f, "changeling", rt.fv(f, "mind", live(user)))))) {
		return live(f.dot);
	}
	if (!truthy(rt.gv(f, "chosen_sting", rt.gv(f, "changeling", rt.fv(f, "mind", live(user)))))) {
		rt.callSrc(f, "set_sting", [live(user)]);
	} else {
		rt.callSrc(f, "unset_sting", [live(user)]);
	}
	return live(f.dot);
});

// /obj/effect/proc_holder/changeling/sting/proc/set_sting  (code/game/gamemodes/changeling/powers/tiny_prick.dm:17)
rt.def("/obj/effect/proc_holder/changeling/sting/proc/set_sting", function set_sting(f: Frame, user: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>We prepare our sting, use alt+click or middle mouse button on target to sting them.</span>"]);
	rt.setFv(f, "chosen_sting", rt.gv(f, "changeling", rt.fv(f, "mind", live(user))), live(f.src));
	rt.setFv(f, "icon_state", rt.gv(f, "lingstingdisplay", rt.fv(f, "hud_used", live(user))), rt.sv(f, "sting_icon"));
	rt.setFv(f, "invisibility", rt.gv(f, "lingstingdisplay", rt.fv(f, "hud_used", live(user))), 0);
	return f.dot;
});

// /obj/effect/proc_holder/changeling/sting/proc/unset_sting  (code/game/gamemodes/changeling/powers/tiny_prick.dm:23)
rt.def("/obj/effect/proc_holder/changeling/sting/proc/unset_sting", function unset_sting(f: Frame, user: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>We retract our sting, we can't sting anyone for now.</span>"]);
	rt.setFv(f, "chosen_sting", rt.gv(f, "changeling", rt.fv(f, "mind", live(user))), null);
	rt.setFv(f, "icon_state", rt.gv(f, "lingstingdisplay", rt.fv(f, "hud_used", live(user))), null);
	rt.setFv(f, "invisibility", rt.gv(f, "lingstingdisplay", rt.fv(f, "hud_used", live(user))), 101);
	return f.dot;
});

// /mob/living/carbon/proc/unset_sting  (code/game/gamemodes/changeling/powers/tiny_prick.dm:29)
rt.def("/mob/living/carbon/proc/unset_sting", function unset_sting(f: Frame) {
	if (!((truthy(rt.sv(f, "mind")) && truthy(rt.fv(f, "changeling", rt.sv(f, "mind")))) && truthy(rt.gv(f, "chosen_sting", rt.fv(f, "changeling", rt.sv(f, "mind")))))) return f.dot;
	rt.callName(f, rt.gv(f, "chosen_sting", rt.gv(f, "changeling", rt.fv(f, "mind", live(f.src)))), "unset_sting", [live(f.src)]);
	return f.dot;
});

// /obj/effect/proc_holder/changeling/sting/proc/can_sting  (code/game/gamemodes/changeling/powers/tiny_prick.dm:33)  may sleep
rt.def("/obj/effect/proc_holder/changeling/sting/proc/can_sting", function* can_sting(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (!truthy(rt.gv(f, "chosen_sting", rt.gv(f, "changeling", rt.fv(f, "mind", live(f.args[0])))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "We haven't prepared our sting yet!"]);
	}
	if (!truthy((rt.istype(live(f.args[1]), T("/mob/living/carbon")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(f.args[0]))])))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/AStar"), null, [null, live(f.args[0]), null, rt.fv(f, "loc", live(f.args[1])), null, P("/turf/proc/Distance"), null, rt.gv(f, "sting_range", rt.gv(f, "changeling", rt.fv(f, "mind", live(f.args[0])))), "simulated_only", 0], rt.Args.Named)))) {
		return live(f.dot);
	}
	if ((truthy(rt.fv(f, "mind", live(f.args[1]))) && truthy(rt.gv(f, "changeling", rt.fv(f, "mind", live(f.args[1])))))) {
		yield* g.srcCall(f, "sting_feedback", live(f.args[0]), live(f.args[1]));
		(rt.modField(f, rt.gv(f, "changeling", rt.fv(f, "mind", live(f.args[0]))), "chem_charges", rt.sv(f, "chemical_cost"), subtract));
	}
	return 1;
}, true, { args: ["user", "target"] });

// /obj/effect/proc_holder/changeling/sting/proc/sting_feedback  (code/game/gamemodes/changeling/powers/tiny_prick.dm:49)
rt.def("/obj/effect/proc_holder/changeling/sting/proc/sting_feedback", function sting_feedback(f: Frame, user: Value, target: Value) {
	if (!truthy(live(target))) {
		return live(f.dot);
	}
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>We stealthily sting ＀.</span>", [rt.fv(f, "name", live(target))])]);
	if ((truthy(rt.fv(f, "mind", live(target))) && truthy(rt.gv(f, "changeling", rt.fv(f, "mind", live(target)))))) {
		rt.call(f, P("/proc/to_chat"), null, [live(target), "<span class='warning'>You feel a tiny prick.</span>"]);
	}
	return 1;
});

rt.type(11254, "/obj/effect/proc_holder/changeling/sting/transformation", "/obj/effect/proc_holder/changeling/sting", {
	selected_dna: null,
	helptext: "The victim will transform much like a changeling would. Does not provide a warning to others. Mutations will not be transferred, and monkeys will become human.",
	sting_icon: "sting_transform",
	chemical_cost: 50,
	dna_cost: 3,
	name: "Transformation Sting",
	desc: "We silently sting a human, injecting a retrovirus that forces them to transform.",
});

// /obj/effect/proc_holder/changeling/sting/transformation/proc/Click  (code/game/gamemodes/changeling/powers/tiny_prick.dm:67)  may sleep
rt.def("/obj/effect/proc_holder/changeling/sting/transformation/proc/Click", function* Click(f: Frame) {
	let user: Value = null, changeling: Value = null;
	f.vars = () => [user, changeling];
	user = live(f.usr);
	if (truthy(rt.gv(f, "chosen_sting", (changeling = rt.gv(f, "changeling", rt.fv(f, "mind", live(user))))))) {
		yield* g.srcCall(f, "unset_sting", live(user));
		return live(f.dot);
	}
	rt.setSv(f, "selected_dna", (yield* g.callName(f, live(changeling), "select_dna", ["Select the target DNA: ", "Target DNA"])));
	if (!truthy(rt.sv(f, "selected_dna"))) {
		return live(f.dot);
	}
	if (truthy((rt.isIn(f, 16, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", rt.sv(f, "selected_dna"))))) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class = 'notice'>That DNA is not compatible with changeling retrovirus!"]);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/effect/proc_holder/changeling/sting/transformation/proc/can_sting  (code/game/gamemodes/changeling/powers/tiny_prick.dm:81)  may sleep
rt.def("/obj/effect/proc_holder/changeling/sting/transformation/proc/can_sting", function* can_sting(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if ((truthy(rt.bitAnd(rt.fv(f, "disabilities", live(f.args[1])), 64)) || !truthy((yield* g.callName(f, live(f.args[1]), "has_dna", []))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>Our sting appears ineffective against its DNA.</span>"]);
		return 0;
	}
	return 1;
}, true, { args: ["user", "target"] });

// /obj/effect/proc_holder/changeling/sting/transformation/proc/sting_action  (code/game/gamemodes/changeling/powers/tiny_prick.dm:89)  may sleep
rt.def("/obj/effect/proc_holder/changeling/sting/transformation/proc/sting_action", function* sting_action(f: Frame, user: Value, target: Value) {
	let NewDNA: Value = null, C: Value = null;
	f.vars = () => [user, target, NewDNA, C];
	yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(target), "stung", "transformation sting", fmt(" new identity is ＀", [rt.gv(f, "real_name", rt.fv(f, "dna", rt.sv(f, "selected_dna")))])]);
	NewDNA = rt.fv(f, "dna", rt.sv(f, "selected_dna"));
	if (truthy((rt.istype(live(target), T("/mob/living/carbon/monkey")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>Our genes cry out as we sting ＀!</span>", [rt.fv(f, "name", live(target))])]);
	}
	C = live(target);
	f.dot = 1;
	if (!truthy((rt.istype(live(C), T("/mob/living/carbon")) ? 1 : 0))) return f.dot;
	rt.setFv(f, "real_name", live(C), rt.fv(f, "real_name", live(NewDNA)));
	yield* g.callName(f, live(NewDNA), "transfer_identity", [live(C)]);
	if (truthy((rt.istype(live(C), T("/mob/living/carbon/monkey")) ? 1 : 0))) {
		yield* g.callName(f, live(C), "humanize", [343]);
	}
	yield* g.callName(f, live(C), "updateappearance", ["mutcolor_update", 1], rt.Args.Named);
	return f.dot;
}, true);

rt.type(11255, "/obj/effect/proc_holder/changeling/sting/false_armblade", "/obj/effect/proc_holder/changeling/sting", {
	helptext: "The victim will form an armblade much like a changeling would, except the armblade is dull and useless.",
	sting_icon: "sting_armblade",
	chemical_cost: 20,
	dna_cost: 1,
	name: "False Armblade Sting",
	desc: "We silently sting a human, injecting a retrovirus that mutates their arm to temporarily appear as an armblade.",
});

// /obj/effect/proc_holder/changeling/sting/false_armblade/proc/can_sting  (code/game/gamemodes/changeling/powers/tiny_prick.dm:120)  may sleep
rt.def("/obj/effect/proc_holder/changeling/sting/false_armblade/proc/can_sting", function* can_sting(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if ((truthy(rt.bitAnd(rt.fv(f, "disabilities", live(f.args[1])), 64)) || !truthy((yield* g.callName(f, live(f.args[1]), "has_dna", []))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>Our sting appears ineffective against its DNA.</span>"]);
		return 0;
	}
	return 1;
}, true, { args: ["user", "target"] });

// /obj/effect/proc_holder/changeling/sting/false_armblade/proc/sting_action  (code/game/gamemodes/changeling/powers/tiny_prick.dm:128)  may sleep
rt.def("/obj/effect/proc_holder/changeling/sting/false_armblade/proc/sting_action", function* sting_action(f: Frame, user: Value, target: Value) {
	let blade: Value = null;
	f.vars = () => [user, target, blade];
	yield* g.call(f, P("/proc/add_logs"), null, [null, live(user), null, live(target), null, "stung", "object", "falso armblade sting"], rt.Args.Named);
	if (!truthy((yield* g.callName(f, live(target), "drop_item", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>The ＀ is stuck to their hand, you cannot grow a false armblade over it!</span>", [(yield* g.callName(f, live(target), "get_active_held_item", []))])]);
		return live(f.dot);
	}
	if (truthy((rt.istype(live(target), T("/mob/living/carbon/monkey")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>Our genes cry out as we sting ＀!</span>", [rt.fv(f, "name", live(target))])]);
	}
	blade = (yield* g.new_(f, T("/obj/item/weapon/melee/arm_blade/false"), [live(target), 1]));
	yield* g.callName(f, live(target), "put_in_hands", [live(blade)]);
	yield* g.callName(f, live(target), "visible_message", [fmt("<span class='warning'>A grotesque blade forms around ＀'s arm!</span>", [rt.fv(f, "name", live(target))]), "<span class='userdanger'>Your arm twists and mutates, transforming into a horrific monstrosity!</span>", "<span class='italics'>You hear organic matter ripping and tearing!</span>"]);
	yield* g.call(f, P("/proc/playsound"), null, [live(target), rt.rsc("sound/effects/blobattack.ogg"), 30, 1]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/effect/proc_holder/changeling/sting/false_armblade/proc/remove_fake"), live(target), live(blade)])), 600]);
	return 1;
}, true);

// /obj/effect/proc_holder/changeling/sting/false_armblade/proc/remove_fake  (code/game/gamemodes/changeling/powers/tiny_prick.dm:146)  may sleep
rt.def("/obj/effect/proc_holder/changeling/sting/false_armblade/proc/remove_fake", function* remove_fake(f: Frame, target: Value, blade: Value) {
	f.vars = () => [target, blade];
	yield* g.call(f, P("/proc/playsound"), null, [live(target), rt.rsc("sound/effects/blobattack.ogg"), 30, 1]);
	yield* g.callName(f, live(target), "visible_message", [fmt("<span class='warning'>With a sickening crunch, ＀ reforms their ＀ into an arm!</span>", [live(target), rt.fv(f, "name", live(blade))]), fmt("<span class='warning'>＀ reforms back to normal.</span>", [live(blade)]), "<span class='italics>You hear organic matter ripping and tearing!</span>"]);
	yield* g.call(f, P("/proc/qdel"), null, [live(blade)]);
	yield* g.callName(f, live(target), "update_inv_hands", []);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob" }, { type: 4, path: "/obj/item/weapon/melee/arm_blade/false" }] });

rt.type(11256, "/obj/effect/proc_holder/changeling/sting/extract_dna", "/obj/effect/proc_holder/changeling/sting", {
	helptext: "Will give you the DNA of your target, allowing you to transform into them.",
	sting_icon: "sting_extract",
	chemical_cost: 25,
	dna_cost: 0,
	name: "Extract DNA Sting",
	desc: "We stealthily sting a target and extract their DNA.",
});

// /obj/effect/proc_holder/changeling/sting/extract_dna/proc/can_sting  (code/game/gamemodes/changeling/powers/tiny_prick.dm:164)  may sleep
rt.def("/obj/effect/proc_holder/changeling/sting/extract_dna/proc/can_sting", function* can_sting(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	return (yield* g.callName(f, rt.gv(f, "changeling", rt.fv(f, "mind", live(f.args[0]))), "can_absorb_dna", [live(f.args[0]), live(f.args[1])]));
}, true, { args: ["user", "target"] });

// /obj/effect/proc_holder/changeling/sting/extract_dna/proc/sting_action  (code/game/gamemodes/changeling/powers/tiny_prick.dm:168)  may sleep
rt.def("/obj/effect/proc_holder/changeling/sting/extract_dna/proc/sting_action", function* sting_action(f: Frame, user: Value, target: Value) {
	f.vars = () => [user, target];
	yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(target), "stung", "extraction sting"]);
	if (!truthy((yield* g.callName(f, rt.gv(f, "changeling", rt.fv(f, "mind", live(user))), "has_dna", [rt.fv(f, "dna", live(target))])))) {
		yield* g.callName(f, rt.gv(f, "changeling", rt.fv(f, "mind", live(user))), "add_new_profile", [live(target), live(user)]);
	}
	return 1;
}, true);

rt.type(11257, "/obj/effect/proc_holder/changeling/sting/mute", "/obj/effect/proc_holder/changeling/sting", {
	helptext: "Does not provide a warning to the victim that they have been stung, until they try to speak and cannot.",
	sting_icon: "sting_mute",
	chemical_cost: 20,
	dna_cost: 2,
	name: "Mute Sting",
	desc: "We silently sting a human, completely silencing them for a short time.",
});

// /obj/effect/proc_holder/changeling/sting/mute/proc/sting_action  (code/game/gamemodes/changeling/powers/tiny_prick.dm:182)
rt.def("/obj/effect/proc_holder/changeling/sting/mute/proc/sting_action", function sting_action(f: Frame, user: Value, target: Value) {
	rt.call(f, P("/proc/add_logs"), null, [live(user), live(target), "stung", "mute sting"]);
	rt.modField(f, live(target), "silent", 30, add);
	return 1;
});

rt.type(11258, "/obj/effect/proc_holder/changeling/sting/blind", "/obj/effect/proc_holder/changeling/sting", {
	helptext: "This sting completely blinds a target for a short time.",
	sting_icon: "sting_blind",
	chemical_cost: 25,
	dna_cost: 1,
	name: "Blind Sting",
	desc: "Temporarily blinds the target.",
});

// /obj/effect/proc_holder/changeling/sting/blind/proc/sting_action  (code/game/gamemodes/changeling/powers/tiny_prick.dm:195)  may sleep
rt.def("/obj/effect/proc_holder/changeling/sting/blind/proc/sting_action", function* sting_action(f: Frame, user: Value, target: Value) {
	f.vars = () => [user, target];
	yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(target), "stung", "blind sting"]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(target), "<span class='danger'>Your eyes burn horrifically!</span>"]);
	yield* g.callName(f, live(target), "become_nearsighted", []);
	yield* g.callName(f, live(target), "blind_eyes", [20]);
	yield* g.callName(f, live(target), "blur_eyes", [40]);
	return 1;
}, true);

rt.type(11259, "/obj/effect/proc_holder/changeling/sting/LSD", "/obj/effect/proc_holder/changeling/sting", {
	helptext: "We evolve the ability to sting a target with a powerful hallucinogenic chemical. The target does not notice they have been stung, and the effect occurs after 30 to 60 seconds.",
	sting_icon: "sting_lsd",
	chemical_cost: 10,
	dna_cost: 1,
	name: "Hallucination Sting",
	desc: "Causes terror in the target.",
});

// /obj/effect/proc_holder/changeling/sting/LSD/proc/sting_action  (code/game/gamemodes/changeling/powers/tiny_prick.dm:211)  may sleep
rt.def("/obj/effect/proc_holder/changeling/sting/LSD/proc/sting_action", function* sting_action(f: Frame, user: Value, target: Value) {
	f.vars = () => [user, target];
	yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(target), "stung", "LSD sting"]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/effect/proc_holder/changeling/sting/LSD/proc/hallucination_time"), live(target)])), (yield* g.call(f, P("/proc/rand"), null, [300, 600]))]);
	return 1;
}, true);

// /obj/effect/proc_holder/changeling/sting/LSD/proc/hallucination_time  (code/game/gamemodes/changeling/powers/tiny_prick.dm:217)
rt.def("/obj/effect/proc_holder/changeling/sting/LSD/proc/hallucination_time", function hallucination_time(f: Frame, target: Value) {
	if (!truthy(live(target))) return f.dot;
	rt.setFv(f, "hallucination", live(target), rt.call(f, P("/proc/max"), null, [400, rt.fv(f, "hallucination", live(target))]));
	return f.dot;
}, false, { argTypes: [{ type: 8, path: "/mob/living/carbon" }] });

rt.type(11260, "/obj/effect/proc_holder/changeling/sting/cryo", "/obj/effect/proc_holder/changeling/sting", {
	helptext: "Does not provide a warning to the victim, though they will likely realize they are suddenly freezing.",
	sting_icon: "sting_cryo",
	chemical_cost: 15,
	dna_cost: 2,
	name: "Cryogenic Sting",
	desc: "We silently sting a human with a cocktail of chemicals that freeze them.",
});

// /obj/effect/proc_holder/changeling/sting/cryo/proc/sting_action  (code/game/gamemodes/changeling/powers/tiny_prick.dm:228)  may sleep
rt.def("/obj/effect/proc_holder/changeling/sting/cryo/proc/sting_action", function* sting_action(f: Frame, user: Value, target: Value) {
	f.vars = () => [user, target];
	yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(target), "stung", "cryo sting"]);
	if (truthy(rt.fv(f, "reagents", live(target)))) {
		yield* g.callName(f, rt.fv(f, "reagents", live(target)), "add_reagent", ["frostoil", 30]);
	}
	return 1;
}, true);
