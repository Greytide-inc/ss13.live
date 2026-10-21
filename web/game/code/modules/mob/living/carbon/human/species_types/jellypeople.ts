// From code/modules/mob/living/carbon/human/species_types/jellypeople.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4101, "/datum/species/jelly", "/datum/species", {
	regenerate_limbs: null,
	name: "Xenobiological Jelly Entity",
	id: "jelly",
	default_color: "00FF90",
	say_mod: "chirps",
	species_traits: null,
	exotic_blood: "slimejelly",
	damage_overlay_type: "",
	meat: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/slime"),
});

// /datum/species/jelly/proc/on_species_loss  (code/modules/mob/living/carbon/human/species_types/jellypeople.dm:15)  may sleep
rt.def("/datum/species/jelly/proc/on_species_loss", function* on_species_loss(f: Frame) {
	if (truthy(rt.sv(f, "regenerate_limbs"))) {
		yield* g.callName(f, rt.sv(f, "regenerate_limbs"), "Remove", [live(f.args[0])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["C"] });

// /datum/species/jelly/proc/on_species_gain  (code/modules/mob/living/carbon/human/species_types/jellypeople.dm:19)  may sleep
rt.def("/datum/species/jelly/proc/on_species_gain", function* on_species_gain(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	rt.setSv(f, "regenerate_limbs", (yield* g.new_(f, T("/datum/action/innate/regenerate_limbs"), [])));
	yield* g.callName(f, rt.sv(f, "regenerate_limbs"), "Grant", [live(f.args[0])]);
	return f.dot;
}, true, { args: ["C", "old_species"] });

// /datum/species/jelly/proc/spec_life  (code/modules/mob/living/carbon/human/species_types/jellypeople.dm:25)  may sleep
rt.def("/datum/species/jelly/proc/spec_life", function* spec_life(f: Frame, H: Value) {
	f.vars = () => [H];
	if (isEqual(rt.fv(f, "stat", live(H)), 2)) {
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "blood_volume", live(H)))) {
		rt.modField(f, live(H), "blood_volume", 5, add);
		yield* g.callName(f, live(H), "adjustBruteLoss", [5]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='danger'>You feel empty!</span>"]);
	}
	if (rt.lt(rt.fv(f, "blood_volume", live(H)), 560)) {
		if (rt.ge(rt.fv(f, "nutrition", live(H)), 150)) {
			rt.modField(f, live(H), "blood_volume", 3, add);
			(rt.modField(f, live(H), "nutrition", 2.5, subtract));
		}
	}
	if (rt.lt(rt.fv(f, "blood_volume", live(H)), 336)) {
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='danger'>You feel drained!</span>"]);
		}
	}
	if (rt.lt(rt.fv(f, "blood_volume", live(H)), 224)) {
		yield* g.srcCall(f, "Cannibalize_Body", live(H));
	}
	yield* g.callName(f, live(H), "update_action_buttons_icon", []);
	return f.dot;
}, true);

// /datum/species/jelly/proc/Cannibalize_Body  (code/modules/mob/living/carbon/human/species_types/jellypeople.dm:44)  may sleep
rt.def("/datum/species/jelly/proc/Cannibalize_Body", function* Cannibalize_Body(f: Frame, H: Value) {
	let limbs_to_consume: Value = null, consumed_limb: Value = null;
	f.vars = () => [H, limbs_to_consume, consumed_limb];
	limbs_to_consume = subtract(rt.list("r_arm", "l_arm", "r_leg", "l_leg"), (yield* g.callName(f, live(H), "get_missing_limbs", [])));
	consumed_limb = null;
	if (!truthy(rt.len(f, live(limbs_to_consume)))) {
		rt.incField(f, live(H), "losebreath", 1, true);
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, live(H), "get_num_legs", [])))) {
		(limbs_to_consume = rt.modify(live(limbs_to_consume), rt.list("r_arm", "l_arm"), subtract));
	}
	yield* g.callName(f, (consumed_limb = (yield* g.callName(f, live(H), "get_bodypart", [rt.op(f, "PickUnweighted", [1], [live(limbs_to_consume)])]))), "drop_limb", []);
	yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='userdanger'>Your ＀ is drawn back into your body, unable to maintain its shape!</span>", [live(consumed_limb)])]);
	yield* g.call(f, P("/proc/qdel"), null, [live(consumed_limb)]);
	rt.modField(f, live(H), "blood_volume", 20, add);
	return f.dot;
}, true);

rt.type(152, "/datum/action/innate/regenerate_limbs", "/datum/action/innate", {
	name: "Regenerate Limbs",
	check_flags: 8,
	button_icon_state: "slimeheal",
	background_icon_state: "bg_alien",
});

// /datum/action/innate/regenerate_limbs/proc/IsAvailable  (code/modules/mob/living/carbon/human/species_types/jellypeople.dm:64)
rt.def("/datum/action/innate/regenerate_limbs/proc/IsAvailable", function IsAvailable(f: Frame) {
	let H: Value = null, limbs_to_heal: Value = null;
	f.vars = () => [H, limbs_to_heal];
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) return f.dot;
	H = rt.sv(f, "owner");
	if (rt.lt(rt.getLen(f, (limbs_to_heal = rt.callName(f, live(H), "get_missing_limbs", []))), 1)) {
		return 0;
	}
	if (rt.ge(rt.fv(f, "blood_volume", live(H)), 376)) {
		return 1;
	}
	return 0;
});

// /datum/action/innate/regenerate_limbs/proc/Activate  (code/modules/mob/living/carbon/human/species_types/jellypeople.dm:74)  may sleep
rt.def("/datum/action/innate/regenerate_limbs/proc/Activate", function* Activate(f: Frame) {
	let H: Value = null, limbs_to_heal: Value = null, healed_limb: Value = null;
	let $0: any, $1: any;
	f.vars = () => [H, limbs_to_heal, healed_limb, $0, $1];
	H = rt.sv(f, "owner");
	if (rt.lt(rt.getLen(f, (limbs_to_heal = (yield* g.callName(f, live(H), "get_missing_limbs", [])))), 1)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>You feel intact enough as it is.</span>"]);
		return live(f.dot);
	}
	$0 = live(H);
	if (rt.ge(rt.len(f, live(limbs_to_heal)), 2)) {
		$1 = "limbs";
	} else {
		$1 = "limb";
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You focus intently on your missing ＀...</span>", [$1])]);
	if (rt.ge(rt.fv(f, "blood_volume", live(H)), add(multiply(40, rt.len(f, live(limbs_to_heal))), 336))) {
		yield* g.callName(f, live(H), "regenerate_limbs", []);
		(rt.modField(f, live(H), "blood_volume", multiply(40, rt.len(f, live(limbs_to_heal))), subtract));
		yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>...and after a moment you finish reforming!</span>"]);
		return live(f.dot);
	} else {
		if (rt.ge(rt.fv(f, "blood_volume", live(H)), 40)) {
			while (rt.ge(rt.fv(f, "blood_volume", live(H)), 376)) {
				healed_limb = rt.op(f, "PickUnweighted", [1], [live(limbs_to_heal)]);
				yield* g.callName(f, live(H), "regenerate_limb", [live(healed_limb)]);
				(limbs_to_heal = rt.modify(live(limbs_to_heal), live(healed_limb), subtract));
				(rt.modField(f, live(H), "blood_volume", 40, subtract));
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='warning'>...but there is not enough of you to fix everything! You must attain more mass to heal completely!</span>"]);
			return live(f.dot);
		}
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='warning'>...but there is not enough of you to go around! You must attain more mass to heal!</span>"]);
	return f.dot;
}, true);

rt.type(4102, "/datum/species/jelly/slime", "/datum/species/jelly", {
	slime_split: null,
	bodies: null,
	swap_body: null,
	name: "Slimeperson",
	id: "slime",
	default_color: "00FFFF",
	species_traits: null,
	say_mod: "says",
	hair_color: "mutcolor",
	hair_alpha: 150,
	burnmod: 0.5,
	coldmod: 2,
	heatmod: 0.5,
	ignored_by: null,
});

// /datum/species/jelly/slime/proc/<init>  (code/modules/mob/living/carbon/human/species_types/jellypeople.dm:106)
rt.def("/datum/species/jelly/slime/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "species_traits", rt.list(1, 4, 2, 3, 12, 14, 24));
	$0 = $0;
	rt.setSv(f, "ignored_by", rt.list(T("/mob/living/simple_animal/slime")));
	return f.dot;
});

// /datum/species/jelly/slime/proc/on_species_loss  (code/modules/mob/living/carbon/human/species_types/jellypeople.dm:116)  may sleep
rt.def("/datum/species/jelly/slime/proc/on_species_loss", function* on_species_loss(f: Frame) {
	if (truthy(rt.sv(f, "slime_split"))) {
		yield* g.callName(f, rt.sv(f, "slime_split"), "Remove", [live(f.args[0])]);
	}
	if (truthy(rt.sv(f, "swap_body"))) {
		yield* g.callName(f, rt.sv(f, "swap_body"), "Remove", [live(f.args[0])]);
	}
	(rt.modSrcVar(f, "bodies", live(f.args[0]), subtract));
	rt.setSv(f, "bodies", null);
	(rt.modField(f, live(f.args[0]), "faction", "slime", subtract));
	rt.setFv(f, "blood_volume", live(f.args[0]), (yield* g.call(f, P("/proc/min"), null, [rt.fv(f, "blood_volume", live(f.args[0])), 560])));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["C"] });

// /datum/species/jelly/slime/proc/on_species_gain  (code/modules/mob/living/carbon/human/species_types/jellypeople.dm:127)  may sleep
rt.def("/datum/species/jelly/slime/proc/on_species_gain", function* on_species_gain(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		rt.setSv(f, "slime_split", (yield* g.new_(f, T("/datum/action/innate/split_body"), [])));
		yield* g.callName(f, rt.sv(f, "slime_split"), "Grant", [live(f.args[0])]);
		rt.setSv(f, "swap_body", (yield* g.new_(f, T("/datum/action/innate/swap_body"), [])));
		yield* g.callName(f, rt.sv(f, "swap_body"), "Grant", [live(f.args[0])]);
		if ((!truthy(rt.sv(f, "bodies")) || !truthy(rt.len(f, rt.sv(f, "bodies"))))) {
			rt.setSv(f, "bodies", rt.list(live(f.args[0])));
		} else {
			(rt.modSrcVar(f, "bodies", live(f.args[0]), rt.bitOr));
		}
	}
	(rt.modField(f, live(f.args[0]), "faction", "slime", rt.bitOr));
	return f.dot;
}, true, { args: ["C", "old_species"] });

// /datum/species/jelly/slime/proc/spec_life  (code/modules/mob/living/carbon/human/species_types/jellypeople.dm:142)  may sleep
rt.def("/datum/species/jelly/slime/proc/spec_life", function* spec_life(f: Frame) {
	if (rt.ge(rt.fv(f, "blood_volume", live(f.args[0])), 1120)) {
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>You feel very bloated!</span>"]);
		}
	} else {
		if (rt.ge(rt.fv(f, "nutrition", live(f.args[0])), 450)) {
			rt.modField(f, live(f.args[0]), "blood_volume", 3, add);
			(rt.modField(f, live(f.args[0]), "nutrition", 2.5, subtract));
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["H"] });

rt.type(153, "/datum/action/innate/split_body", "/datum/action/innate", {
	name: "Split Body",
	check_flags: 8,
	button_icon_state: "slimesplit",
	background_icon_state: "bg_alien",
});

// /datum/action/innate/split_body/proc/IsAvailable  (code/modules/mob/living/carbon/human/species_types/jellypeople.dm:158)
rt.def("/datum/action/innate/split_body/proc/IsAvailable", function IsAvailable(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) return f.dot;
	if (rt.ge(rt.gv(f, "blood_volume", (H = rt.sv(f, "owner"))), 1120)) {
		return 1;
	}
	return 0;
});

// /datum/action/innate/split_body/proc/Activate  (code/modules/mob/living/carbon/human/species_types/jellypeople.dm:165)  may sleep
rt.def("/datum/action/innate/split_body/proc/Activate", function* Activate(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (!truthy((yield* g.call(f, P("/proc/is_species"), null, [(H = rt.sv(f, "owner")), T("/datum/species/jelly/slime")])))) {
		return live(f.dot);
	}
	if ((!truthy(rt.fv(f, "dna", live(H))) || !truthy(rt.gv(f, "species", rt.fv(f, "dna", live(H)))))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(H), "visible_message", [fmt("<span class='notice'>＀ gains a look of concentration while standing perfectly still.</span>", [rt.sv(f, "owner")]), "<span class='notice'>You focus intently on moving your body while standing perfectly still...</span>"]);
	rt.setFv(f, "notransform", live(H), 1);
	if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, rt.sv(f, "owner"), "delay", 60, "needhand", 0, "target", rt.sv(f, "owner"), "progress", 1], rt.Args.Named)))) {
		if (rt.ge(rt.fv(f, "blood_volume", live(H)), 1120)) {
			yield* g.srcCall(f, "make_dupe");
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='warning'>...but there is not enough of you to go around! You must attain more mass to split!</span>"]);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='warning'>...but fail to stand perfectly still!</span>"]);
	}
	rt.setFv(f, "notransform", live(H), 0);
	return f.dot;
}, true);

// /datum/action/innate/split_body/proc/make_dupe  (code/modules/mob/living/carbon/human/species_types/jellypeople.dm:187)  may sleep
rt.def("/datum/action/innate/split_body/proc/make_dupe", function* make_dupe(f: Frame) {
	let H: Value = null, spare: Value = null, origin_datum: Value = null, spare_datum: Value = null;
	f.vars = () => [H, spare, origin_datum, spare_datum];
	if ((!truthy(rt.gv(f, "dna", (H = rt.sv(f, "owner")))) || !truthy(rt.gv(f, "species", rt.fv(f, "dna", live(H)))))) {
		return live(f.dot);
	}
	rt.setFv(f, "underwear", (spare = (yield* g.new_(f, T("/mob/living/carbon/human"), [rt.fv(f, "loc", live(H))]))), "Nude");
	yield* g.callName(f, rt.fv(f, "dna", live(H)), "transfer_identity", [null, live(spare), "transfer_SE", 1], rt.Args.Named);
	rt.setAt(rt.gv(f, "features", rt.fv(f, "dna", live(spare))), "mcolor", rt.op(f, "PickUnweighted", [8], ["FFFFFF", "7F7F7F", "7FFF7F", "7F7FFF", "FF7F7F", "7FFFFF", "FF7FFF", "FFFF7F"]));
	rt.setFv(f, "real_name", live(spare), rt.gv(f, "real_name", rt.fv(f, "dna", live(spare))));
	rt.setFv(f, "name", live(spare), rt.gv(f, "real_name", rt.fv(f, "dna", live(spare))));
	yield* g.callName(f, live(spare), "updateappearance", ["mutcolor_update", 1], rt.Args.Named);
	yield* g.callName(f, live(spare), "domutcheck", []);
	yield* g.callName(f, live(spare), "Move", [rt.getStep(f, rt.fv(f, "loc", live(H)), rt.op(f, "PickUnweighted", [4], [1, 2, 4, 8]))]);
	rt.setFv(f, "blood_volume", live(H), 475);
	rt.setFv(f, "notransform", live(H), 0);
	(rt.modField(f, (origin_datum = rt.gv(f, "species", rt.fv(f, "dna", live(H)))), "bodies", live(spare), rt.bitOr));
	rt.setFv(f, "bodies", (spare_datum = rt.gv(f, "species", rt.fv(f, "dna", live(spare)))), rt.fv(f, "bodies", live(origin_datum)));
	yield* g.callName(f, rt.fv(f, "mind", live(H)), "transfer_to", [live(spare)]);
	yield* g.callName(f, live(spare), "visible_message", [fmt("<span class='warning'>＀ distorts as a new body \"steps out\" of them.</span>", [live(H)]), "<span class='notice'>...and after a moment of disorentation, you're besides yourself!</span>"]);
	return f.dot;
}, true);

rt.type(154, "/datum/action/innate/swap_body", "/datum/action/innate", {
	name: "Swap Body",
	check_flags: 8,
	button_icon_state: "slimeswap",
	background_icon_state: "bg_alien",
});

// /datum/action/innate/swap_body/proc/Activate  (code/modules/mob/living/carbon/human/species_types/jellypeople.dm:224)  may sleep
rt.def("/datum/action/innate/swap_body/proc/Activate", function* Activate(f: Frame) {
	if (!truthy((yield* g.call(f, P("/proc/is_species"), null, [rt.sv(f, "owner"), T("/datum/species/jelly/slime")])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='warning'>You are not a slimeperson.</span>"]);
		yield* g.srcCall(f, "Remove", rt.sv(f, "owner"));
	} else {
		yield* g.srcCall(f, "ui_interact", rt.sv(f, "owner"));
	}
	return f.dot;
}, true);

// /datum/action/innate/swap_body/proc/ui_interact  (code/modules/mob/living/carbon/human/species_types/jellypeople.dm:232)  may sleep
rt.def("/datum/action/innate/swap_body/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(ui) === null) {
		ui = null;
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(master_ui) === null) {
		master_ui = null;
	}
	if (live(state) === null) {
		state = rt.gl("conscious_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "slime_swap_body", rt.sv(f, "name"), 400, 400, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /datum/action/innate/swap_body/proc/ui_data  (code/modules/mob/living/carbon/human/species_types/jellypeople.dm:238)
rt.def("/datum/action/innate/swap_body/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let H: Value = null, SS: Value = null, data: Value = null, b: Value = null, body: Value = null, L: Value = null, A: Value = null, stat: Value = null, current: Value = null, is_conscious: Value = null, button: Value = null;
	let $0: any, $e: any;
	f.vars = () => [H, SS, data, b, body, L, A, stat, current, is_conscious, button, $0, $e];
	if (!truthy(rt.call(f, P("/proc/is_species"), null, [(H = rt.sv(f, "owner")), T("/datum/species/jelly/slime")]))) {
		return live(f.dot);
	}
	SS = rt.gv(f, "species", rt.fv(f, "dna", live(H)));
	rt.setAt((data = rt.list()), "bodies", rt.list());
	b = null;
	rt.forList(f, 0, rt.fv(f, "bodies", live(SS)));
	while (($e = rt.next(f, 0)) !== undefined) {
		b = $e;
		if (((!truthy((body = live(b))) || (!truthy(live(body)) || truthy(rt.fv(f, "gc_destroyed", live(body))))) || !truthy(rt.call(f, P("/proc/is_species"), null, [live(body), T("/datum/species/jelly/slime")])))) {
			(rt.modField(f, live(SS), "bodies", live(b), subtract));
			continue;
		}
		rt.setAt((L = rt.list()), "htmlcolor", fmt("#＀", [rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(body))), "mcolor")]));
		A = rt.call(f, P("/proc/get_area"), null, [live(body)]);
		rt.setAt(live(L), "area", rt.fv(f, "name", live(A)));
		stat = "error";
		$0 = rt.fv(f, "stat", live(body));
		if ($0 === 0) {
			stat = "Conscious";
		} else if ($0 === 1) {
			stat = "Unconscious";
		} else if ($0 === 2) {
			stat = "Dead";
		}
		current = rt.fv(f, "mind", live(body));
		is_conscious = (isEqual(rt.fv(f, "stat", live(body)), 0) ? 1 : 0);
		rt.setAt(live(L), "status", live(stat));
		rt.setAt(live(L), "exoticblood", rt.fv(f, "blood_volume", live(body)));
		rt.setAt(live(L), "name", rt.fv(f, "name", live(body)));
		rt.setAt(live(L), "ref", fmt("＃", [live(body)]));
		rt.setAt(live(L), "is_current", live(current));
		button = null;
		if (truthy(live(current))) {
			button = "selected";
		} else {
			if (truthy(live(is_conscious))) {
				button = null;
			} else {
				button = "disabled";
			}
		}
		rt.setAt(live(L), "swap_button_state", live(button));
		rt.setAt(live(L), "swappable", ((!truthy(live(current)) ? 1 : 0) && live(is_conscious)));
		rt.modAt(live(data), "bodies", rt.list(live(L)), add);
	}
	rt.endFor(f, 0);
	return live(data);
});

// /datum/action/innate/swap_body/proc/ui_act  (code/modules/mob/living/carbon/human/species_types/jellypeople.dm:289)  may sleep
rt.def("/datum/action/innate/swap_body/proc/ui_act", function* ui_act(f: Frame) {
	let H: Value = null, SS: Value = null, M: Value = null, L: Value = null, selected: Value = null;
	let $0: any, $e: any;
	f.vars = () => [H, SS, M, L, selected, $0, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	H = rt.sv(f, "owner");
	if (!truthy((yield* g.call(f, P("/proc/is_species"), null, [rt.sv(f, "owner"), T("/datum/species/jelly/slime")])))) {
		return live(f.dot);
	}
	SS = rt.gv(f, "species", rt.fv(f, "dna", live(H)));
	M = null;
	L = null;
	rt.forList(f, 0, rt.fv(f, "bodies", live(SS)), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if ((truthy(rt.fv(f, "mind", live(L))) && truthy(rt.gv(f, "active", rt.fv(f, "mind", live(L)))))) {
			M = rt.fv(f, "mind", live(L));
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(M))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/is_species"), null, [rt.fv(f, "current", live(M)), T("/datum/species/jelly/slime")])))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "swap") {
		if (!truthy((rt.isIn(f, (selected = rt.locateIn(f, rt.at(live(f.args[1]), "ref"), rt.world())), rt.fv(f, "bodies", live(SS))) ? 1 : 0))) {
			return live(f.dot);
		}
		if (((!truthy(live(selected)) || (!truthy(live(selected)) || truthy(rt.fv(f, "gc_destroyed", live(selected))))) || !truthy((yield* g.call(f, P("/proc/is_species"), null, [live(selected), T("/datum/species/jelly/slime")]))))) {
			(rt.modField(f, live(SS), "bodies", live(selected), subtract));
			return live(f.dot);
		}
		if (isEqual(rt.fv(f, "current", live(M)), live(selected))) {
			return live(f.dot);
		}
		if (!isEqual(rt.fv(f, "stat", live(selected)), 0)) {
			return live(f.dot);
		}
		yield* g.srcCall(f, "swap_to_dupe", live(M), live(selected));
	}
	return f.dot;
}, true, { args: ["action", "params"] });

// /datum/action/innate/swap_body/proc/swap_to_dupe  (code/modules/mob/living/carbon/human/species_types/jellypeople.dm:321)  may sleep
rt.def("/datum/action/innate/swap_body/proc/swap_to_dupe", function* swap_to_dupe(f: Frame, M: Value, dupe: Value) {
	f.vars = () => [M, dupe];
	yield* g.callName(f, rt.fv(f, "current", live(M)), "visible_message", [fmt("<span class='notice'>＀ stops moving and starts staring vacantly into space.</span>", [rt.fv(f, "current", live(M))]), "<span class='notice'>You stop moving this body...</span>"]);
	yield* g.callName(f, live(M), "transfer_to", [live(dupe)]);
	yield* g.callName(f, live(dupe), "visible_message", [fmt("<span class='notice'>＀ blinks and looks around.</span>", [live(dupe)]), "<span class='notice'>...and move this one instead.</span>"]);
	return f.dot;
}, true);
