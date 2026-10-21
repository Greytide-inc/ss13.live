// From code/game/objects/items/weapons/holy_weapons.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/item/weapon/nullrod/proc/suicide_act  (code/game/objects/items/weapons/holy_weapons.dm:14)
rt.def("/obj/item/weapon/nullrod/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is killing ＀self with ＀! It looks like ＀ trying to get closer to god!</span>", [live(user), rt.callName(f, live(user), "p_them", []), live(f.src), rt.callName(f, live(user), "p_theyre", [])])]);
	return 3;
});

// /obj/item/weapon/nullrod/proc/attack_self  (code/game/objects/items/weapons/holy_weapons.dm:18)  may sleep
rt.def("/obj/item/weapon/nullrod/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!((truthy(rt.fv(f, "mind", live(user))) && truthy(rt.gv(f, "isholy", rt.fv(f, "mind", live(user))))) && !truthy(rt.sv(f, "reskinned")))) return f.dot;
	yield* g.srcCall(f, "reskin_holy_weapon", live(user));
	return f.dot;
}, true);

// /obj/item/weapon/nullrod/proc/reskin_holy_weapon  (code/game/objects/items/weapons/holy_weapons.dm:22)  may sleep
rt.def("/obj/item/weapon/nullrod/proc/reskin_holy_weapon", function* reskin_holy_weapon(f: Frame, M: Value) {
	let holy_weapon: Value = null, holy_weapons_list: Value = null, display_names: Value = null, V: Value = null, A: Value = null, choice: Value = null, index: Value = null, A_5: Value = null;
	let $e: any;
	f.vars = () => [M, holy_weapon, holy_weapons_list, display_names, V, A, choice, index, A_5, $e];
	if (truthy(rt.fv(f, "holy_weapon_type", rt.gl("SSreligion")))) {
		return live(f.dot);
	}
	holy_weapon = null;
	holy_weapons_list = (yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/weapon/nullrod")]));
	display_names = rt.list();
	V = null;
	rt.forList(f, 0, live(holy_weapons_list));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		display_names = rt.modify(live(display_names), rt.initial(f, (A = live(V)), "name"), add);
	}
	rt.endFor(f, 0);
	choice = (yield* g.op(f, "Prompt", [1], [null, "Holy Weapon Theme", "What theme would you like for your holy weapon?", live(M), live(display_names)]));
	if ((((((((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) || !truthy(live(choice))) || truthy(rt.fv(f, "stat", live(M)))) || !rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(M), live(f.src)])), 1)) || truthy((yield* g.callName(f, live(M), "restrained", [])))) || !truthy(rt.fv(f, "canmove", live(M)))) || truthy(rt.sv(f, "reskinned")))) {
		return live(f.dot);
	}
	index = (yield* g.callName(f, live(display_names), "Find", [live(choice)]));
	A_5 = rt.index(live(holy_weapons_list), live(index));
	holy_weapon = (yield* g.new_(f, live(A_5), []));
	rt.setFv(f, "holy_weapon_type", rt.gl("SSreligion"), rt.fv(f, "type", live(holy_weapon)));
	if (!truthy(live(holy_weapon))) return f.dot;
	rt.setFv(f, "reskinned", live(holy_weapon), 1);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	yield* g.callName(f, live(M), "put_in_active_hand", [live(holy_weapon)]);
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

// /obj/item/weapon/nullrod/staff/proc/worn_overlays  (code/game/objects/items/weapons/holy_weapons.dm:72)
rt.def("/obj/item/weapon/nullrod/staff/proc/worn_overlays", function worn_overlays(f: Frame, isinhands: Value) {
	f.dot = rt.list();
	if (!truthy(live(isinhands))) return f.dot;
	f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/effects.dmi"), rt.sv(f, "shield_icon"), 4.010000228881836]), add);
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

// /obj/item/weapon/nullrod/claymore/proc/hit_reaction  (code/game/objects/items/weapons/holy_weapons.dm:95)
rt.def("/obj/item/weapon/nullrod/claymore/proc/hit_reaction", function hit_reaction(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = "the attack";
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 0;
	}
	if (live(f.args[4]) === null) {
		f.args[4] = 0;
	}
	if (live(f.args[5]) === null) {
		f.args[5] = 1;
	}
	if (isEqual(live(f.args[5]), 3)) {
		f.args[3] = 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["owner", "hitby", "attack_text", "final_block_chance", "damage", "attack_type"] });

rt.type(7248, "/obj/item/weapon/nullrod/claymore/multiverse", "/obj/item/weapon/nullrod/claymore", {
	name: "extradimensional blade",
	desc: "Once the harbinger of an interdimensional war, its sharpness fluctuates wildly.",
	icon_state: "multiverse",
	item_state: "multiverse",
	slot_flags: 512,
});

// /obj/item/weapon/nullrod/claymore/multiverse/proc/attack  (code/game/objects/items/weapons/holy_weapons.dm:138)  may sleep
rt.def("/obj/item/weapon/nullrod/claymore/multiverse/proc/attack", function* attack(f: Frame) {
	rt.setSv(f, "force", (yield* g.call(f, P("/proc/rand"), null, [1, 30])));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "user"] });

rt.type(7257, "/obj/item/weapon/nullrod/scythe/talking", "/obj/item/weapon/nullrod/scythe", {
	possessed: 0,
	icon_state: "talking_sword",
	item_state: "talking_sword",
	name: "possessed blade",
	desc: "When the station falls into chaos, it's nice to have a friend by your side.",
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/rapierhit.ogg"),
});

// /obj/item/weapon/nullrod/scythe/talking/proc/attack_self  (code/game/objects/items/weapons/holy_weapons.dm:213)  may sleep
rt.def("/obj/item/weapon/nullrod/scythe/talking/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let candidates: Value = null, theghost: Value = null, S: Value = null, input: Value = null;
	f.vars = () => [user, candidates, theghost, S, input];
	if (truthy(rt.sv(f, "possessed"))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "You attempt to wake the spirit of the blade..."]);
	rt.setSv(f, "possessed", 1);
	candidates = (yield* g.call(f, P("/proc/pollGhostCandidates"), null, [fmt("Do you want to play as the spirit of ＀'s blade?", [rt.fv(f, "real_name", live(user))]), "pAI", null, 0, 100, "possessed_blade"]));
	theghost = null;
	if (truthy(rt.length(live(candidates)))) {
		theghost = rt.op(f, "PickUnweighted", [1], [live(candidates)]);
		rt.setFv(f, "real_name", (S = (yield* g.new_(f, T("/mob/living/simple_animal/shade"), [live(f.src)]))), rt.sv(f, "name"));
		rt.setFv(f, "name", live(S), rt.sv(f, "name"));
		rt.setFv(f, "ckey", live(S), rt.fv(f, "ckey", live(theghost)));
		(rt.modField(f, live(S), "status_flags", 4096, rt.bitOr));
		input = (yield* g.call(f, P("/proc/stripped_input"), null, [live(S), "What are you named?", null, "", 42]));
		if ((truthy(live(f.src)) && truthy(live(input)))) {
			rt.setSv(f, "name", live(input));
			rt.setFv(f, "real_name", live(S), live(input));
			rt.setFv(f, "name", live(S), live(input));
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "The blade is dormant. Maybe you can try again later."]);
		rt.setSv(f, "possessed", 0);
	}
	return f.dot;
}, true);

// /obj/item/weapon/nullrod/scythe/talking/proc/Destroy  (code/game/objects/items/weapons/holy_weapons.dm:238)  may sleep
rt.def("/obj/item/weapon/nullrod/scythe/talking/proc/Destroy", function* Destroy(f: Frame) {
	let S: Value = null;
	let $e: any;
	f.vars = () => [S, $e];
	S = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/mob/living/simple_animal/shade"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		yield* g.call(f, P("/proc/to_chat"), null, [live(S), "You were destroyed!"]);
		yield* g.call(f, P("/proc/qdel"), null, [live(S)]);
	}
	rt.endFor(f, 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
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

// /obj/item/weapon/nullrod/carp/proc/attack_self  (code/game/objects/items/weapons/holy_weapons.dm:317)
rt.def("/obj/item/weapon/nullrod/carp/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (!truthy(rt.sv(f, "used_blessing"))) {
		if (!(truthy(rt.fv(f, "mind", live(user))) && truthy(rt.gv(f, "isholy", rt.fv(f, "mind", live(user)))))) return f.dot;
		rt.call(f, P("/proc/to_chat"), null, [live(user), "You are blessed by Carp-Sie. Wild space carp will no longer attack you."]);
		(rt.modField(f, live(user), "faction", "carp", rt.bitOr));
		rt.setSv(f, "used_blessing", 1);
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

// /obj/item/weapon/nullrod/tribal_knife/proc/Initialize  (code/game/objects/items/weapons/holy_weapons.dm:349)  may sleep
rt.def("/obj/item/weapon/nullrod/tribal_knife/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.fv(f, "secondary_flags", live(f.src)))) {
		rt.setFv(f, "secondary_flags", live(f.src), rt.list());
	}
	rt.setAt(rt.fv(f, "secondary_flags", live(f.src)), "slows_while_in_hand", 1);
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/item/weapon/nullrod/tribal_knife/proc/New  (code/game/objects/items/weapons/holy_weapons.dm:353)  may sleep
rt.def("/obj/item/weapon/nullrod/tribal_knife/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/weapon/nullrod/tribal_knife/proc/Destroy  (code/game/objects/items/weapons/holy_weapons.dm:357)  may sleep
rt.def("/obj/item/weapon/nullrod/tribal_knife/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/item/weapon/nullrod/tribal_knife/proc/process  (code/game/objects/items/weapons/holy_weapons.dm:361)
rt.def("/obj/item/weapon/nullrod/tribal_knife/proc/process", function process(f: Frame) {
	rt.setSv(f, "slowdown", rt.call(f, P("/proc/rand"), null, [-2, 2]));
	return f.dot;
}, false, { waitfor: false });
