// From code/game/objects/items/weapons/cigs_lighters.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/item/weapon/match/proc/process  (code/game/objects/items/weapons/cigs_lighters.dm:31)  may sleep
rt.def("/obj/item/weapon/match/proc/process", function* process(f: Frame) {
	rt.incSrcVar(f, "smoketime", -1, true);
	if (rt.lt(rt.sv(f, "smoketime"), 1)) {
		yield* g.srcCall(f, "matchburnout");
	} else {
		yield* g.srcCall(f, "open_flame", rt.sv(f, "heat"));
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/item/weapon/match/proc/fire_act  (code/game/objects/items/weapons/cigs_lighters.dm:38)
rt.def("/obj/item/weapon/match/proc/fire_act", function fire_act(f: Frame, exposed_temperature: Value, exposed_volume: Value) {
	rt.callSrc(f, "matchignite", []);
	return f.dot;
});

// /obj/item/weapon/match/proc/matchignite  (code/game/objects/items/weapons/cigs_lighters.dm:41)
rt.def("/obj/item/weapon/match/proc/matchignite", function matchignite(f: Frame) {
	if (!(!truthy(rt.sv(f, "lit")) && !truthy(rt.sv(f, "burnt")))) return f.dot;
	rt.setSv(f, "lit", 1);
	rt.setSv(f, "icon_state", "match_lit");
	rt.setSv(f, "damtype", "fire");
	rt.setSv(f, "force", 3);
	rt.setSv(f, "hitsound", rt.rsc("sound/items/welder.ogg"));
	rt.setSv(f, "item_state", "cigon");
	rt.setSv(f, "name", "lit match");
	rt.setSv(f, "desc", "A match. This one is lit.");
	rt.setSv(f, "attack_verb", rt.list("burnt", "singed"));
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	}
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/item/weapon/match/proc/matchburnout  (code/game/objects/items/weapons/cigs_lighters.dm:58)
rt.def("/obj/item/weapon/match/proc/matchburnout", function matchburnout(f: Frame) {
	if (!truthy(rt.sv(f, "lit"))) return f.dot;
	rt.setSv(f, "lit", 0);
	rt.setSv(f, "burnt", 1);
	rt.setSv(f, "damtype", "brute");
	rt.setSv(f, "force", rt.initial(f, live(f.src), "force"));
	rt.setSv(f, "icon_state", "match_burnt");
	rt.setSv(f, "item_state", "cigoff");
	rt.setSv(f, "name", "burnt match");
	rt.setSv(f, "desc", "A match. This one has seen better days.");
	rt.setSv(f, "attack_verb", rt.list("flicked"));
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return f.dot;
});

// /obj/item/weapon/match/proc/dropped  (code/game/objects/items/weapons/cigs_lighters.dm:68)  may sleep
rt.def("/obj/item/weapon/match/proc/dropped", function* dropped(f: Frame) {
	yield* g.srcCall(f, "matchburnout");
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/match/proc/attack  (code/game/objects/items/weapons/cigs_lighters.dm:72)  may sleep
rt.def("/obj/item/weapon/match/proc/attack", function* attack(f: Frame) {
	let cig: Value = null;
	f.vars = () => [cig];
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "lit")) && truthy((yield* g.callName(f, live(f.args[0]), "IgniteMob", []))))) {
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ set ＀ on fire", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.args[1])])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.args[0])]))])]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ set ＀ on fire", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.args[1])])), (yield* g.call(f, P("/proc/key_name"), null, [live(f.args[0])]))])]);
	}
	cig = (yield* g.srcCall(f, "help_light_cig", live(f.args[0])));
	if (((truthy(rt.sv(f, "lit")) && truthy(live(cig))) && isEqual(rt.fv(f, "a_intent", live(f.args[1])), "help"))) {
		if (truthy(rt.fv(f, "lit", live(cig)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>The ＀ is already lit.</span>", [rt.fv(f, "name", live(cig))])]);
		}
		if (isEqual(live(f.args[0]), live(f.args[1]))) {
			yield* g.callName(f, live(cig), "attackby", [live(f.src), live(f.args[1])]);
		} else {
			yield* g.callName(f, live(cig), "light", [fmt("<span class='notice'>＀ holds the ＀ out for ＀, and lights the ＀.</span>", [live(f.args[1]), rt.sv(f, "name"), live(f.args[0]), rt.fv(f, "name", live(cig))])]);
		}
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["M", "user"] });

// /obj/item/proc/help_light_cig  (code/game/objects/items/weapons/cigs_lighters.dm:89)
rt.def("/obj/item/proc/help_light_cig", function help_light_cig(f: Frame, M: Value) {
	let mask_item: Value = null;
	f.vars = () => [mask_item];
	if (!truthy((rt.istype((mask_item = rt.callName(f, live(M), "get_item_by_slot", [2])), T("/obj/item/clothing/mask/cigarette")) ? 1 : 0))) return f.dot;
	return live(mask_item);
});

// /obj/item/weapon/match/proc/is_hot  (code/game/objects/items/weapons/cigs_lighters.dm:94)
rt.def("/obj/item/weapon/match/proc/is_hot", function is_hot(f: Frame) {
	return multiply(rt.sv(f, "lit"), rt.sv(f, "heat"));
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

// /obj/item/clothing/mask/cigarette/proc/<init>  (code/game/objects/items/weapons/cigs_lighters.dm:116)
rt.def("/obj/item/clothing/mask/cigarette/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["nicotine", 15]));
	return f.dot;
});

// /obj/item/clothing/mask/cigarette/proc/suicide_act  (code/game/objects/items/weapons/cigs_lighters.dm:120)
rt.def("/obj/item/clothing/mask/cigarette/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is huffing ＀ as quickly as ＀ can! It looks like ＀ trying to give ＀self cancer.</span>", [live(user), live(f.src), rt.callName(f, live(user), "p_they", []), rt.callName(f, live(user), "p_theyre", []), rt.callName(f, live(user), "p_them", [])])]);
	return 12;
});

// /obj/item/clothing/mask/cigarette/proc/Initialize  (code/game/objects/items/weapons/cigs_lighters.dm:124)  may sleep
rt.def("/obj/item/clothing/mask/cigarette/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "create_reagents", rt.sv(f, "chem_volume"));
	yield* g.callName(f, rt.sv(f, "reagents"), "set_reacting", [0]);
	if (truthy(rt.sv(f, "list_reagents"))) {
		yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent_list", [rt.sv(f, "list_reagents")]);
	}
	if (!truthy(rt.sv(f, "starts_lit"))) return f.dot;
	yield* g.srcCall(f, "light");
	return f.dot;
}, true);

// /obj/item/clothing/mask/cigarette/proc/Destroy  (code/game/objects/items/weapons/cigs_lighters.dm:133)  may sleep
rt.def("/obj/item/clothing/mask/cigarette/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/item/clothing/mask/cigarette/proc/attackby  (code/game/objects/items/weapons/cigs_lighters.dm:137)  may sleep
rt.def("/obj/item/clothing/mask/cigarette/proc/attackby", function* attackby(f: Frame) {
	let lighting_text: Value = null;
	f.vars = () => [lighting_text];
	if ((!truthy(rt.sv(f, "lit")) && rt.gt(rt.sv(f, "smoketime"), 0))) {
		if (truthy((lighting_text = (yield* g.callName(f, live(f.args[0]), "ignition_effect", [live(f.src), live(f.args[1])]))))) {
			yield* g.srcCall(f, "light", live(lighting_text));
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/clothing/mask/cigarette/proc/afterattack  (code/game/objects/items/weapons/cigs_lighters.dm:145)  may sleep
rt.def("/obj/item/clothing/mask/cigarette/proc/afterattack", function* afterattack(f: Frame, glass: Value, user: Value, proximity: Value) {
	f.vars = () => [glass, user, proximity];
	if ((!truthy(live(proximity)) || truthy(rt.sv(f, "lit")))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(glass), T("/obj/item/weapon/reagent_containers/glass")) ? 1 : 0))) return f.dot;
	if (truthy((yield* g.callName(f, rt.fv(f, "reagents", live(glass)), "trans_to", [live(f.src), rt.sv(f, "chem_volume")])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You dip ％！ into ％！.</span>", [live(f.src), live(glass)])]);
	} else {
		if (!truthy(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(glass))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ is empty.</span>", [live(glass)])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ is full.</span>", [live(f.src)])]);
		}
	}
	return f.dot;
}, true);

// /obj/item/clothing/mask/cigarette/proc/light  (code/game/objects/items/weapons/cigs_lighters.dm:162)  may sleep
rt.def("/obj/item/clothing/mask/cigarette/proc/light", function* light(f: Frame, flavor_text: Value) {
	let e: Value = null, _T: Value = null, M: Value = null;
	f.vars = () => [flavor_text, e, _T, M];
	if (live(flavor_text) === null) {
		flavor_text = null;
	}
	if (truthy(rt.sv(f, "lit"))) {
		return live(f.dot);
	}
	rt.setSv(f, "lit", 1);
	rt.setSv(f, "name", fmt("lit ＀", [rt.sv(f, "name")]));
	rt.setSv(f, "attack_verb", rt.list("burnt", "singed"));
	rt.setSv(f, "hitsound", rt.rsc("sound/items/welder.ogg"));
	rt.setSv(f, "damtype", "fire");
	rt.setSv(f, "force", 4);
	if (truthy((yield* g.callName(f, rt.sv(f, "reagents"), "get_reagent_amount", ["plasma"])))) {
		yield* g.callName(f, (e = (yield* g.new_(f, T("/datum/effect_system/reagents_explosion"), []))), "set_up", [(yield* g.call(f, P("/proc/round"), null, [divide((yield* g.callName(f, rt.sv(f, "reagents"), "get_reagent_amount", ["plasma"])), 2.5), 1])), rt.getStep(f, live(f.src), 0), 0, 0]);
		yield* g.callName(f, live(e), "start", []);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, rt.sv(f, "reagents"), "get_reagent_amount", ["welding_fuel"])))) {
		yield* g.callName(f, (e = (yield* g.new_(f, T("/datum/effect_system/reagents_explosion"), []))), "set_up", [(yield* g.call(f, P("/proc/round"), null, [divide((yield* g.callName(f, rt.sv(f, "reagents"), "get_reagent_amount", ["welding_fuel"])), 5), 1])), rt.getStep(f, live(f.src), 0), 0, 0]);
		yield* g.callName(f, live(e), "start", []);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "reagents"), "set_reacting", [1]);
	yield* g.callName(f, rt.sv(f, "reagents"), "handle_reactions", []);
	rt.setSv(f, "icon_state", rt.sv(f, "icon_on"));
	rt.setSv(f, "item_state", rt.sv(f, "icon_on"));
	if (truthy(live(flavor_text))) {
		yield* g.callName(f, (_T = rt.getStep(f, live(f.src), 0)), "visible_message", [live(flavor_text)]);
	}
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	}
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) return f.dot;
	yield* g.callName(f, (M = rt.sv(f, "loc")), "update_inv_wear_mask", []);
	yield* g.callName(f, live(M), "update_inv_hands", []);
	return f.dot;
}, true);

// /obj/item/clothing/mask/cigarette/proc/handle_reagents  (code/game/objects/items/weapons/cigs_lighters.dm:197)  may sleep
rt.def("/obj/item/clothing/mask/cigarette/proc/handle_reagents", function* handle_reagents(f: Frame) {
	let C: Value = null, fraction: Value = null;
	f.vars = () => [C, fraction];
	if (!truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) return f.dot;
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living/carbon")) ? 1 : 0))) {
		C = rt.sv(f, "loc");
		if (isEqual(live(f.src), rt.fv(f, "wear_mask", live(C)))) {
			if (truthy(rt.op(f, "Prob", [], [15]))) {
				fraction = (yield* g.call(f, P("/proc/min"), null, [divide(0.4000000059604645, rt.fv(f, "total_volume", rt.sv(f, "reagents"))), 1]));
				yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(C), 2, live(fraction)]);
			}
			if (!truthy((yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(C), 0.4000000059604645])))) {
				yield* g.callName(f, rt.sv(f, "reagents"), "remove_any", [0.4000000059604645]);
			}
			return live(f.dot);
		}
	}
	yield* g.callName(f, rt.sv(f, "reagents"), "remove_any", [0.4000000059604645]);
	return f.dot;
}, true);

// /obj/item/clothing/mask/cigarette/proc/process  (code/game/objects/items/weapons/cigs_lighters.dm:211)  may sleep
rt.def("/obj/item/clothing/mask/cigarette/proc/process", function* process(f: Frame) {
	let location: Value = null, M: Value = null;
	f.vars = () => [location, M];
	location = rt.getStep(f, live(f.src), 0);
	M = rt.sv(f, "loc");
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living")) ? 1 : 0))) {
		yield* g.callName(f, live(M), "IgniteMob", []);
	}
	rt.incSrcVar(f, "smoketime", -1, true);
	if (rt.lt(rt.sv(f, "smoketime"), 1)) {
		yield* g.new_(f, rt.sv(f, "type_butt"), [live(location)]);
		if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='notice'>Your ＀ goes out.</span>", [rt.sv(f, "name")])]);
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "open_flame");
	if (!(truthy(rt.sv(f, "reagents")) && truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents"))))) return f.dot;
	yield* g.srcCall(f, "handle_reagents");
	return f.dot;
}, true, { waitfor: false });

// /obj/item/clothing/mask/cigarette/proc/attack_self  (code/game/objects/items/weapons/cigs_lighters.dm:228)  may sleep
rt.def("/obj/item/clothing/mask/cigarette/proc/attack_self", function* attack_self(f: Frame) {
	if (truthy(rt.sv(f, "lit"))) {
		yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='notice'>＀ calmly drops and treads on ％！, putting it out instantly.</span>", [live(f.args[0]), live(f.src)])]);
		yield* g.new_(f, rt.sv(f, "type_butt"), [rt.fv(f, "loc", live(f.args[0]))]);
		yield* g.new_(f, T("/obj/effect/decal/cleanable/ash"), [rt.fv(f, "loc", live(f.args[0]))]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/clothing/mask/cigarette/proc/attack  (code/game/objects/items/weapons/cigs_lighters.dm:235)  may sleep
rt.def("/obj/item/clothing/mask/cigarette/proc/attack", function* attack(f: Frame) {
	let cig: Value = null;
	f.vars = () => [cig];
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	cig = (yield* g.srcCall(f, "help_light_cig", live(f.args[0])));
	if (((truthy(rt.sv(f, "lit")) && truthy(live(cig))) && isEqual(rt.fv(f, "a_intent", live(f.args[1])), "help"))) {
		if (truthy(rt.fv(f, "lit", live(cig)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>The ＀ is already lit.</span>", [rt.fv(f, "name", live(cig))])]);
		}
		if (isEqual(live(f.args[0]), live(f.args[1]))) {
			yield* g.callName(f, live(cig), "attackby", [live(f.src), live(f.args[1])]);
		} else {
			yield* g.callName(f, live(cig), "light", [fmt("<span class='notice'>＀ holds the ＀ out for ＀, and lights the ＀.</span>", [live(f.args[1]), rt.sv(f, "name"), live(f.args[0]), rt.fv(f, "name", live(cig))])]);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["M", "user"] });

// /obj/item/clothing/mask/cigarette/proc/fire_act  (code/game/objects/items/weapons/cigs_lighters.dm:249)  may sleep
rt.def("/obj/item/clothing/mask/cigarette/proc/fire_act", function* fire_act(f: Frame, exposed_temperature: Value, exposed_volume: Value) {
	f.vars = () => [exposed_temperature, exposed_volume];
	yield* g.srcCall(f, "light");
	return f.dot;
}, true);

// /obj/item/clothing/mask/cigarette/proc/is_hot  (code/game/objects/items/weapons/cigs_lighters.dm:252)
rt.def("/obj/item/clothing/mask/cigarette/proc/is_hot", function is_hot(f: Frame) {
	return multiply(rt.sv(f, "lit"), rt.sv(f, "heat"));
});

rt.type(8521, "/obj/item/clothing/mask/cigarette/uplift", "/obj/item/clothing/mask/cigarette", {
	list_reagents: null,
	desc: "An Uplift Smooth brand cigarette.",
});

// /obj/item/clothing/mask/cigarette/uplift/proc/<init>  (code/game/objects/items/weapons/cigs_lighters.dm:264)
rt.def("/obj/item/clothing/mask/cigarette/uplift/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["nicotine", 7.5, "menthol", 7.5]));
	return f.dot;
});

rt.type(8523, "/obj/item/clothing/mask/cigarette/robustgold", "/obj/item/clothing/mask/cigarette", {
	list_reagents: null,
	desc: "A Robust Gold brand cigarette.",
});

// /obj/item/clothing/mask/cigarette/robustgold/proc/<init>  (code/game/objects/items/weapons/cigs_lighters.dm:271)
rt.def("/obj/item/clothing/mask/cigarette/robustgold/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["nicotine", 15, "gold", 1]));
	return f.dot;
});

rt.type(8525, "/obj/item/clothing/mask/cigarette/syndicate", "/obj/item/clothing/mask/cigarette", {
	list_reagents: null,
	desc: "An unknown brand cigarette.",
});

// /obj/item/clothing/mask/cigarette/syndicate/proc/<init>  (code/game/objects/items/weapons/cigs_lighters.dm:278)
rt.def("/obj/item/clothing/mask/cigarette/syndicate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["nicotine", 15, "omnizine", 15]));
	return f.dot;
});

rt.type(8526, "/obj/item/clothing/mask/cigarette/shadyjims", "/obj/item/clothing/mask/cigarette", {
	list_reagents: null,
	desc: "A Shady Jim's Super Slims cigarette.",
});

// /obj/item/clothing/mask/cigarette/shadyjims/proc/<init>  (code/game/objects/items/weapons/cigs_lighters.dm:282)
rt.def("/obj/item/clothing/mask/cigarette/shadyjims/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["nicotine", 15, "lipolicide", 4, "ammonia", 2, "plantbgone", 1, "toxin", 1.5]));
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

// /obj/item/clothing/mask/cigarette/rollie/proc/New  (code/game/objects/items/weapons/cigs_lighters.dm:299)  may sleep
rt.def("/obj/item/clothing/mask/cigarette/rollie/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "pixel_x", live(f.src), (yield* g.call(f, P("/proc/rand"), null, [-5, 5])));
	rt.setFv(f, "pixel_y", live(f.src), (yield* g.call(f, P("/proc/rand"), null, [-5, 5])));
	return f.dot;
}, true);

rt.type(8528, "/obj/item/clothing/mask/cigarette/rollie/trippy", "/obj/item/clothing/mask/cigarette/rollie", {
	list_reagents: null,
	starts_lit: 1,
});

// /obj/item/clothing/mask/cigarette/rollie/trippy/proc/<init>  (code/game/objects/items/weapons/cigs_lighters.dm:304)
rt.def("/obj/item/clothing/mask/cigarette/rollie/trippy/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["nicotine", 15, "mushroomhallucinogen", 35]));
	return f.dot;
});

rt.type(7130, "/obj/item/weapon/cigbutt/roach", "/obj/item/weapon/cigbutt", {
	name: "roach",
	desc: "A manky old roach, or for non-stoners, a used rollup.",
	icon_state: "roach",
});

// /obj/item/weapon/cigbutt/roach/proc/New  (code/game/objects/items/weapons/cigs_lighters.dm:313)  may sleep
rt.def("/obj/item/weapon/cigbutt/roach/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "pixel_x", live(f.src), (yield* g.call(f, P("/proc/rand"), null, [-5, 5])));
	rt.setFv(f, "pixel_y", live(f.src), (yield* g.call(f, P("/proc/rand"), null, [-5, 5])));
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

// /obj/item/clothing/mask/cigarette/pipe/proc/<init>  (code/game/objects/items/weapons/cigs_lighters.dm:377)
rt.def("/obj/item/clothing/mask/cigarette/pipe/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", null);
	return f.dot;
});

// /obj/item/clothing/mask/cigarette/pipe/proc/Initialize  (code/game/objects/items/weapons/cigs_lighters.dm:381)  may sleep
rt.def("/obj/item/clothing/mask/cigarette/pipe/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "name", fmt("empty ＀", [rt.initial(f, live(f.src), "name")]));
	return f.dot;
}, true);

// /obj/item/clothing/mask/cigarette/pipe/proc/Destroy  (code/game/objects/items/weapons/cigs_lighters.dm:385)  may sleep
rt.def("/obj/item/clothing/mask/cigarette/pipe/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/item/clothing/mask/cigarette/pipe/proc/process  (code/game/objects/items/weapons/cigs_lighters.dm:389)  may sleep
rt.def("/obj/item/clothing/mask/cigarette/pipe/proc/process", function* process(f: Frame) {
	let location: Value = null, M: Value = null;
	f.vars = () => [location, M];
	location = rt.getStep(f, live(f.src), 0);
	rt.incSrcVar(f, "smoketime", -1, true);
	if (rt.lt(rt.sv(f, "smoketime"), 1)) {
		yield* g.new_(f, T("/obj/effect/decal/cleanable/ash"), [live(location)]);
		if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [(M = rt.sv(f, "loc")), fmt("<span class='notice'>Your ＀ goes out.</span>", [rt.sv(f, "name")])]);
			rt.setSv(f, "lit", 0);
			rt.setSv(f, "icon_state", rt.sv(f, "icon_off"));
			rt.setSv(f, "item_state", rt.sv(f, "icon_off"));
			yield* g.callName(f, live(M), "update_inv_wear_mask", []);
			rt.setSv(f, "packeditem", 0);
			rt.setSv(f, "name", fmt("empty ＀", [rt.initial(f, live(f.src), "name")]));
		}
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
		return live(f.dot);
	}
	yield* g.srcCall(f, "open_flame");
	if (!(truthy(rt.sv(f, "reagents")) && truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents"))))) return f.dot;
	yield* g.srcCall(f, "handle_reagents");
	return f.dot;
}, true, { waitfor: false });

// /obj/item/clothing/mask/cigarette/pipe/proc/attackby  (code/game/objects/items/weapons/cigs_lighters.dm:410)  may sleep
rt.def("/obj/item/clothing/mask/cigarette/pipe/proc/attackby", function* attackby(f: Frame) {
	let G: Value = null, lighting_text: Value = null;
	f.vars = () => [G, lighting_text];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/food/snacks/grown")) ? 1 : 0))) {
		G = live(f.args[0]);
		if (!truthy(rt.sv(f, "packeditem"))) {
			if (isEqual(rt.fv(f, "dry", live(G)), 1)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You stuff ＀ into ＀.</span>", [live(f.args[0]), live(f.src)])]);
				rt.setSv(f, "smoketime", 400);
				rt.setSv(f, "packeditem", 1);
				rt.setSv(f, "name", fmt("＀-packed ＀", [rt.fv(f, "name", live(f.args[0])), rt.initial(f, live(f.src), "name")]));
				if (truthy(rt.fv(f, "reagents", live(f.args[0])))) {
					yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "trans_to", [live(f.src), rt.gv(f, "total_volume", rt.fv(f, "reagents", live(f.args[0])))]);
				}
				yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>It has to be dried first!</span>"]);
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>It is already packed!</span>"]);
		}
	} else {
		if (truthy((lighting_text = (yield* g.callName(f, live(f.args[0]), "ignition_effect", [live(f.src), live(f.args[1])]))))) {
			if (rt.gt(rt.sv(f, "smoketime"), 0)) {
				yield* g.srcCall(f, "light", live(lighting_text));
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There is nothing to smoke!</span>"]);
			}
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// /obj/item/clothing/mask/cigarette/pipe/proc/attack_self  (code/game/objects/items/weapons/cigs_lighters.dm:436)  may sleep
rt.def("/obj/item/clothing/mask/cigarette/pipe/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let location: Value = null;
	f.vars = () => [user, location];
	location = rt.getStep(f, live(user), 0);
	if (truthy(rt.sv(f, "lit"))) {
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ puts out ＀.</span>", [live(user), live(f.src)]), fmt("<span class='notice'>You put out ＀.</span>", [live(f.src)])]);
		rt.setSv(f, "lit", 0);
		rt.setSv(f, "icon_state", rt.sv(f, "icon_off"));
		rt.setSv(f, "item_state", rt.sv(f, "icon_off"));
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "lit")) && rt.gt(rt.sv(f, "smoketime"), 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You empty ＀ onto ＀.</span>", [live(f.src), live(location)])]);
		yield* g.new_(f, T("/obj/effect/decal/cleanable/ash"), [live(location)]);
		rt.setSv(f, "packeditem", 0);
		rt.setSv(f, "smoketime", 0);
		yield* g.callName(f, rt.sv(f, "reagents"), "clear_reagents", []);
		rt.setSv(f, "name", fmt("empty ＀", [rt.initial(f, live(f.src), "name")]));
	}
	return live(f.dot);
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

// /obj/item/weapon/lighter/proc/update_icon  (code/game/objects/items/weapons/cigs_lighters.dm:483)
rt.def("/obj/item/weapon/lighter/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "lit"))) {
		rt.setSv(f, "icon_state", fmt("＀_on", [rt.initial(f, live(f.src), "icon_state")]));
	} else {
		rt.setSv(f, "icon_state", fmt("＀", [rt.initial(f, live(f.src), "icon_state")]));
	}
	return f.dot;
});

// /obj/item/weapon/lighter/proc/ignition_effect  (code/game/objects/items/weapons/cigs_lighters.dm:488)
rt.def("/obj/item/weapon/lighter/proc/ignition_effect", function ignition_effect(f: Frame, A: Value, user: Value) {
	if (!truthy(rt.callSrc(f, "is_hot", []))) return f.dot;
	f.dot = fmt("<span class='rose'>With a single flick of their wrist, ＀ smoothly lights ＀ with ＀. Damn ＀ cool.</span>", [live(user), live(A), live(f.src), rt.callName(f, live(user), "p_theyre", [])]);
	return f.dot;
});

// /obj/item/weapon/lighter/proc/set_lit  (code/game/objects/items/weapons/cigs_lighters.dm:492)
rt.def("/obj/item/weapon/lighter/proc/set_lit", function set_lit(f: Frame, new_lit: Value) {
	rt.setSv(f, "lit", live(new_lit));
	if (truthy(rt.sv(f, "lit"))) {
		rt.setSv(f, "force", 5);
		rt.setSv(f, "damtype", "fire");
		rt.setSv(f, "hitsound", rt.rsc("sound/items/welder.ogg"));
		rt.setSv(f, "attack_verb", rt.list("burnt", "singed"));
		rt.callSrc(f, "set_light", [1]);
		if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
			rt.setFv(f, "isprocessing", live(f.src), 1);
			rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
		}
	} else {
		rt.setSv(f, "hitsound", "swing_hit");
		rt.setSv(f, "force", 0);
		rt.setSv(f, "attack_verb", null);
		rt.callSrc(f, "set_light", [0]);
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	}
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/item/weapon/lighter/proc/attack_self  (code/game/objects/items/weapons/cigs_lighters.dm:509)  may sleep
rt.def("/obj/item/weapon/lighter/proc/attack_self", function* attack_self(f: Frame) {
	let prot: Value = null, H: Value = null, G: Value = null, hitzone: Value = null;
	let $0: any;
	f.vars = () => [prot, H, G, hitzone, $0];
	if (truthy((yield* g.callName(f, live(f.args[0]), "is_holding", [live(f.src)])))) {
		if (!truthy(rt.sv(f, "lit"))) {
			yield* g.srcCall(f, "set_lit", 1);
			if (truthy(rt.sv(f, "fancy"))) {
				yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("Without even breaking stride, ＀ flips open and lights ＀ in one smooth movement.", [live(f.args[0]), live(f.src)]), fmt("<span class='notice'>Without even breaking stride, you flip open and lights ＀ in one smooth movement.</span>", [live(f.src)])]);
			} else {
				prot = 0;
				if ((truthy((rt.istype((H = live(f.args[0])), T("/mob/living/carbon/human")) ? 1 : 0)) && truthy(rt.fv(f, "gloves", live(H))))) {
					if (truthy(rt.gv(f, "max_heat_protection_temperature", (G = rt.fv(f, "gloves", live(H)))))) {
						prot = (rt.gt(rt.fv(f, "max_heat_protection_temperature", live(G)), 360) ? 1 : 0);
					}
				} else {
					prot = 1;
				}
				if ((truthy(live(prot)) || truthy(rt.op(f, "Prob", [], [75])))) {
					yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("After a few attempts, ＀ manages to light ＀.", [live(f.args[0]), live(f.src)]), fmt("<span class='notice'>After a few attempts, you manage to light ＀.</span>", [live(f.src)])]);
				} else {
					if (isEqual((yield* g.callName(f, live(f.args[0]), "held_index_to_dir", [rt.fv(f, "active_hand_index", live(f.args[0]))])), "r")) {
						$0 = "r_hand";
					} else {
						$0 = "l_hand";
					}
					hitzone = $0;
					yield* g.callName(f, live(f.args[0]), "apply_damage", [5, "fire", live(hitzone)]);
					yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='warning'>After a few attempts, ＀ manages to light ＀ - however, ＀ burn their finger in the process.</span>", [live(f.args[0]), live(f.src), (yield* g.callName(f, live(f.args[0]), "p_they", []))]), "<span class='warning'>You burn yourself while lighting the lighter!</span>"]);
				}
			}
		} else {
			yield* g.srcCall(f, "set_lit", 0);
			if (truthy(rt.sv(f, "fancy"))) {
				yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("You hear a quiet click, as ＀ shuts off ＀ without even looking at what ＀ doing. Wow.", [live(f.args[0]), live(f.src), (yield* g.callName(f, live(f.args[0]), "p_theyre", []))]), fmt("<span class='notice'>You quietly shut off ＀ without even looking at what you're doing. Wow.</span>", [live(f.src)])]);
			} else {
				yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("＀ quietly shuts off ＀.", [live(f.args[0]), live(f.src)]), fmt("<span class='notice'>You quietly shut off ＀.", [live(f.src)])]);
			}
		}
	} else {
		f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/lighter/proc/attack  (code/game/objects/items/weapons/cigs_lighters.dm:542)  may sleep
rt.def("/obj/item/weapon/lighter/proc/attack", function* attack(f: Frame) {
	let cig: Value = null;
	f.vars = () => [cig];
	if ((truthy(rt.sv(f, "lit")) && truthy((yield* g.callName(f, live(f.args[0]), "IgniteMob", []))))) {
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ set ＀ on fire", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.args[1])])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.args[0])]))])]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ set ＀ on fire", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.args[1])])), (yield* g.call(f, P("/proc/key_name"), null, [live(f.args[0])]))])]);
	}
	cig = (yield* g.srcCall(f, "help_light_cig", live(f.args[0])));
	if (((truthy(rt.sv(f, "lit")) && truthy(live(cig))) && isEqual(rt.fv(f, "a_intent", live(f.args[1])), "help"))) {
		if (truthy(rt.fv(f, "lit", live(cig)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>The ＀ is already lit.</span>", [rt.fv(f, "name", live(cig))])]);
		}
		if (isEqual(live(f.args[0]), live(f.args[1]))) {
			yield* g.callName(f, live(cig), "attackby", [live(f.src), live(f.args[1])]);
		} else {
			if (truthy(rt.sv(f, "fancy"))) {
				yield* g.callName(f, live(cig), "light", [fmt("<span class='rose'>＀ whips the ＀ out and holds it for ＀. ＀ arm is as steady as the unflickering flame they light ％！ with.</span>", [live(f.args[1]), rt.sv(f, "name"), live(f.args[0]), (yield* g.callName(f, live(f.args[1]), "p_their", [1])), live(cig)])]);
			} else {
				yield* g.callName(f, live(cig), "light", [fmt("<span class='notice'>＀ holds the ＀ out for ＀, and lights the ＀.</span>", [live(f.args[1]), rt.sv(f, "name"), live(f.args[0]), rt.fv(f, "name", live(cig))])]);
			}
		}
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["M", "user"] });

// /obj/item/weapon/lighter/proc/process  (code/game/objects/items/weapons/cigs_lighters.dm:560)  may sleep
rt.def("/obj/item/weapon/lighter/proc/process", function* process(f: Frame) {
	yield* g.srcCall(f, "open_flame");
	return f.dot;
}, true, { waitfor: false });

// /obj/item/weapon/lighter/proc/is_hot  (code/game/objects/items/weapons/cigs_lighters.dm:563)
rt.def("/obj/item/weapon/lighter/proc/is_hot", function is_hot(f: Frame) {
	return multiply(rt.sv(f, "lit"), rt.sv(f, "heat"));
});

rt.type(7133, "/obj/item/weapon/lighter/greyscale", "/obj/item/weapon/lighter", {
	fancy: 0,
	name: "cheap lighter",
	desc: "A cheap-as-free lighter.",
	icon_state: "lighter",
});

// /obj/item/weapon/lighter/greyscale/proc/Initialize  (code/game/objects/items/weapons/cigs_lighters.dm:573)  may sleep
rt.def("/obj/item/weapon/lighter/greyscale/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "add_atom_colour", (yield* g.call(f, P("/proc/color2hex"), null, [(yield* g.call(f, P("/proc/randomColor"), null, [1]))])), 4);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/weapon/lighter/greyscale/proc/update_icon  (code/game/objects/items/weapons/cigs_lighters.dm:578)
rt.def("/obj/item/weapon/lighter/greyscale/proc/update_icon", function update_icon(f: Frame) {
	let base_overlay: Value = null;
	f.vars = () => [base_overlay];
	rt.callSrc(f, "cut_overlays", []);
	rt.setFv(f, "appearance_flags", (base_overlay = rt.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), fmt("＀_base", [rt.initial(f, live(f.src), "icon_state")])])), 2);
	if (truthy(rt.sv(f, "lit"))) {
		rt.setFv(f, "icon_state", live(base_overlay), fmt("＀_on", [rt.initial(f, live(f.src), "icon_state")]));
	}
	rt.callSrc(f, "add_overlay", [live(base_overlay)]);
	return f.dot;
});

// /obj/item/weapon/lighter/greyscale/proc/ignition_effect  (code/game/objects/items/weapons/cigs_lighters.dm:586)
rt.def("/obj/item/weapon/lighter/greyscale/proc/ignition_effect", function ignition_effect(f: Frame, A: Value, user: Value) {
	if (!truthy(rt.callSrc(f, "is_hot", []))) return f.dot;
	f.dot = fmt("<span class='notice'>After some fiddling, ＀ manages to light ＀ with ＀.</span>", [live(user), live(A), live(f.src)]);
	return f.dot;
});

rt.type(7134, "/obj/item/weapon/rollingpaper", "/obj/item/weapon", {
	name: "rolling paper",
	desc: "A thin piece of paper used to make fine smokeables.",
	icon: rt.rsc("icons/obj/cigarettes.dmi"),
	icon_state: "cig_paper",
	w_class: 1,
});

// /obj/item/weapon/rollingpaper/proc/afterattack  (code/game/objects/items/weapons/cigs_lighters.dm:601)  may sleep
rt.def("/obj/item/weapon/rollingpaper/proc/afterattack", function* afterattack(f: Frame) {
	let O: Value = null, R: Value = null;
	f.vars = () => [O, R];
	if (!truthy(live(f.args[2]))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/food/snacks/grown")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "dry", (O = live(f.args[0]))))) {
			rt.setFv(f, "chem_volume", (R = (yield* g.new_(f, T("/obj/item/clothing/mask/cigarette/rollie"), [rt.fv(f, "loc", live(f.args[1]))]))), rt.gv(f, "total_volume", rt.fv(f, "reagents", live(f.args[0]))));
			yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "trans_to", [live(R), rt.fv(f, "chem_volume", live(R))]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			yield* g.callName(f, live(f.args[1]), "put_in_active_hand", [live(R)]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You roll the ＀ into a rolling paper.</span>", [rt.fv(f, "name", live(f.args[0]))])]);
			rt.setFv(f, "desc", live(R), fmt("Dried ＀ rolled up in a thin piece of paper.", [rt.fv(f, "name", live(f.args[0]))]));
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need to dry this first!</span>"]);
		}
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["target", "user", "proximity"] });

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

// /obj/item/clothing/mask/vape/proc/suicide_act  (code/game/objects/items/weapons/cigs_lighters.dm:636)
rt.def("/obj/item/clothing/mask/vape/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is puffin hard on dat vape, ＀ trying to join the vape life on a whole notha plane!", [live(user), rt.callName(f, live(user), "p_they", [])])]);
	return 12;
});

// /obj/item/clothing/mask/vape/proc/Initialize  (code/game/objects/items/weapons/cigs_lighters.dm:641)  may sleep
rt.def("/obj/item/clothing/mask/vape/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "create_reagents", rt.sv(f, "chem_volume"));
	yield* g.callName(f, rt.sv(f, "reagents"), "set_reacting", [0]);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["nicotine", 50]);
	if (truthy(rt.sv(f, "icon_state"))) return f.dot;
	if (!truthy(live(f.args[1]))) {
		f.args[1] = rt.op(f, "PickUnweighted", [8], ["red", "blue", "black", "white", "green", "purple", "yellow", "orange"]);
	}
	rt.setSv(f, "icon_state", fmt("＀_vape", [live(f.args[1])]));
	rt.setSv(f, "item_state", fmt("＀_vape", [live(f.args[1])]));
	return f.dot;
}, true, { args: ["mapload", "param_color"] });

// /obj/item/clothing/mask/vape/proc/attackby  (code/game/objects/items/weapons/cigs_lighters.dm:652)  may sleep
rt.def("/obj/item/clothing/mask/vape/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	f.vars = () => [O, user, params];
	if ((truthy((rt.istype(live(O), T("/obj/item/weapon/reagent_containers")) ? 1 : 0)) && truthy(rt.bitAnd(rt.fv(f, "container_type", live(O)), 4096)))) {
		if (rt.lt(rt.fv(f, "total_volume", rt.sv(f, "reagents")), rt.sv(f, "chem_volume"))) {
			if (rt.gt(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(O))), 0)) {
				yield* g.callName(f, rt.fv(f, "reagents", live(O)), "trans_to", [live(f.src), 25]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You add the contents of ＀ to the ＀</span>", [live(O), live(f.src)])]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>The ＀ is empty!</span>", [live(O)])]);
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ can't hold anymore reagents!</span>", [live(f.src)])]);
		}
	}
	if (truthy((rt.istype(live(O), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		if (!truthy(rt.sv(f, "screw"))) {
			rt.setSv(f, "screw", 1);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You open the cap on the ＀</span>", [live(f.src)])]);
			if (truthy(rt.sv(f, "super"))) {
				yield* g.srcCall(f, "add_overlay", "vapeopen_med");
			} else {
				yield* g.srcCall(f, "add_overlay", "vapeopen_low");
			}
		} else {
			rt.setSv(f, "screw", 0);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You close the cap on the ＀</span>", [live(f.src)])]);
			yield* g.srcCall(f, "cut_overlays");
		}
	}
	if (!truthy((rt.istype(live(O), T("/obj/item/device/multitool")) ? 1 : 0))) return f.dot;
	if ((truthy(rt.sv(f, "screw")) && !truthy(rt.sv(f, "emagged")))) {
		if (!truthy(rt.sv(f, "super"))) {
			yield* g.srcCall(f, "cut_overlays");
			rt.setSv(f, "super", 1);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You increase the voltage in the ＀</span>", [live(f.src)])]);
			yield* g.srcCall(f, "add_overlay", "vapeopen_med");
		} else {
			yield* g.srcCall(f, "cut_overlays");
			rt.setSv(f, "super", 0);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You decrease the voltage in the ＀</span>", [live(f.src)])]);
			yield* g.srcCall(f, "add_overlay", "vapeopen_low");
		}
	}
	if (!(truthy(rt.sv(f, "screw")) && truthy(rt.sv(f, "emagged")))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>The ＀ can't be modified!</span>", [rt.sv(f, "name")])]);
	return f.dot;
}, true);

// /obj/item/clothing/mask/vape/proc/emag_act  (code/game/objects/items/weapons/cigs_lighters.dm:694)
rt.def("/obj/item/clothing/mask/vape/proc/emag_act", function emag_act(f: Frame, user: Value) {
	let sp: Value = null;
	f.vars = () => [sp];
	if (truthy(rt.sv(f, "screw"))) {
		if (!truthy(rt.sv(f, "emagged"))) {
			rt.callSrc(f, "cut_overlays", []);
			rt.setSv(f, "emagged", 1);
			rt.setSv(f, "super", 0);
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You maximize the voltage in the ＀</span>", [live(f.src)])]);
			rt.callSrc(f, "add_overlay", ["vapeopen_high"]);
			rt.callName(f, (sp = rt.new_(f, T("/datum/effect_system/spark_spread"), [])), "set_up", [5, 1, live(f.src)]);
			rt.callName(f, live(sp), "start", []);
		} else {
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>The ＀ is already emagged!</span>", [rt.sv(f, "name")])]);
		}
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You need to open the cap to do that</span>"]);
	}
	return f.dot;
});

// /obj/item/clothing/mask/vape/proc/attack_self  (code/game/objects/items/weapons/cigs_lighters.dm:709)  may sleep
rt.def("/obj/item/clothing/mask/vape/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if (rt.gt(rt.fv(f, "total_volume", rt.sv(f, "reagents")), 0)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>you empty ＀ of all reagents.</span>", [live(f.src)])]);
		yield* g.callName(f, rt.sv(f, "reagents"), "clear_reagents", []);
	}
	return live(f.dot);
}, true);

// /obj/item/clothing/mask/vape/proc/equipped  (code/game/objects/items/weapons/cigs_lighters.dm:715)
rt.def("/obj/item/clothing/mask/vape/proc/equipped", function equipped(f: Frame, user: Value, slot: Value) {
	if (!isEqual(live(slot), 2)) return f.dot;
	if (!truthy(rt.sv(f, "screw"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You start puffing on the vape.</span>"]);
		rt.callName(f, rt.sv(f, "reagents"), "set_reacting", [1]);
		if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
			rt.setFv(f, "isprocessing", live(f.src), 1);
			rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
		}
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You need to close the cap first!</span>"]);
	}
	return f.dot;
});

// /obj/item/clothing/mask/vape/proc/dropped  (code/game/objects/items/weapons/cigs_lighters.dm:724)
rt.def("/obj/item/clothing/mask/vape/proc/dropped", function dropped(f: Frame, user: Value) {
	let C: Value = null;
	f.vars = () => [C];
	if (!isEqual(rt.callName(f, (C = live(user)), "get_item_by_slot", [2]), live(f.src))) return f.dot;
	rt.callName(f, rt.sv(f, "reagents"), "set_reacting", [0]);
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return f.dot;
});

// /obj/item/clothing/mask/vape/proc/hand_reagents  (code/game/objects/items/weapons/cigs_lighters.dm:730)  may sleep
rt.def("/obj/item/clothing/mask/vape/proc/hand_reagents", function* hand_reagents(f: Frame) {
	let C: Value = null, fraction: Value = null, e: Value = null;
	f.vars = () => [C, fraction, e];
	if (!truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) return f.dot;
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living/carbon")) ? 1 : 0))) {
		C = rt.sv(f, "loc");
		if (isEqual(live(f.src), rt.fv(f, "wear_mask", live(C)))) {
			fraction = (yield* g.call(f, P("/proc/min"), null, [divide(0.4000000059604645, rt.fv(f, "total_volume", rt.sv(f, "reagents"))), 1]));
			yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(C), 2, live(fraction)]);
			if (!truthy((yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(C), 0.4000000059604645])))) {
				yield* g.callName(f, rt.sv(f, "reagents"), "remove_any", [0.4000000059604645]);
			}
			if (truthy((yield* g.callName(f, rt.sv(f, "reagents"), "get_reagent_amount", ["welding_fuel"])))) {
				rt.setFv(f, "fire_stacks", live(C), 2);
				yield* g.callName(f, live(C), "IgniteMob", []);
			}
			if (truthy((yield* g.callName(f, rt.sv(f, "reagents"), "get_reagent_amount", ["plasma"])))) {
				yield* g.callName(f, (e = (yield* g.new_(f, T("/datum/effect_system/reagents_explosion"), []))), "set_up", [(yield* g.call(f, P("/proc/round"), null, [divide((yield* g.callName(f, rt.sv(f, "reagents"), "get_reagent_amount", ["plasma"])), 2.5), 1])), rt.getStep(f, live(f.src), 0), 0, 0]);
				yield* g.callName(f, live(e), "start", []);
				yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			}
			return live(f.dot);
		}
	}
	yield* g.callName(f, rt.sv(f, "reagents"), "remove_any", [0.4000000059604645]);
	return f.dot;
}, true);

// /obj/item/clothing/mask/vape/proc/process  (code/game/objects/items/weapons/cigs_lighters.dm:752)  may sleep
rt.def("/obj/item/clothing/mask/vape/proc/process", function* process(f: Frame) {
	let M: Value = null, s: Value = null, sp: Value = null;
	f.vars = () => [M, s, sp];
	M = rt.sv(f, "loc");
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living")) ? 1 : 0))) {
		yield* g.callName(f, live(M), "IgniteMob", []);
	}
	rt.incSrcVar(f, "vapetime", 1, true);
	if (!truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) {
		if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='notice'>The ＀ is empty!</span>", [rt.sv(f, "name")])]);
			rt.setFv(f, "isprocessing", live(f.src), 0);
			(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
		}
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "super")) && rt.gt(rt.sv(f, "vapetime"), 3))) {
		yield* g.callName(f, (s = (yield* g.new_(f, T("/datum/effect_system/smoke_spread/chem"), []))), "set_up", [null, rt.sv(f, "reagents"), null, 1, null, rt.sv(f, "loc"), "silent", 1], rt.Args.Named);
		yield* g.callName(f, live(s), "start", []);
		rt.setSv(f, "vapetime", 0);
	}
	if ((truthy(rt.sv(f, "emagged")) && rt.gt(rt.sv(f, "vapetime"), 3))) {
		yield* g.callName(f, (s = (yield* g.new_(f, T("/datum/effect_system/smoke_spread/chem"), []))), "set_up", [null, rt.sv(f, "reagents"), null, 4, null, rt.sv(f, "loc"), "silent", 1], rt.Args.Named);
		yield* g.callName(f, live(s), "start", []);
		rt.setSv(f, "vapetime", 0);
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/effects/pop_expl.ogg"), 50, 0]);
			yield* g.callName(f, live(M), "apply_damage", [20, "fire", "head"]);
			yield* g.callName(f, live(M), "Knockdown", [300, 1, 0]);
			yield* g.callName(f, (sp = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "set_up", [5, 1, live(f.src)]);
			yield* g.callName(f, live(sp), "start", []);
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='userdanger'>The ＀ suddenly explodes in your mouth!</span>", [rt.sv(f, "name")])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			return live(f.dot);
		}
	}
	if (!(truthy(rt.sv(f, "reagents")) && truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents"))))) return f.dot;
	yield* g.srcCall(f, "hand_reagents");
	return f.dot;
}, true, { waitfor: false });
