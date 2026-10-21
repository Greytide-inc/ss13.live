// From code/game/objects/items/weapons/melee/energy.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5673, "/obj/item/weapon/melee/energy", "/obj/item/weapon/melee", {
	active: 0,
	force_on: 30,
	throwforce_on: 20,
	icon_state_on: "axe1",
	attack_verb_on: null,
	possible_colors: null,
	w_class_on: 4,
	brightness_on: 3,
	w_class: 2,
	sharpness: 1,
	heat: 3500,
	obj_integrity: 200,
	max_integrity: 200,
	armor: null,
	resistance_flags: 2,
});

// /obj/item/weapon/melee/energy/proc/<init>  (code/game/objects/items/weapons/melee/energy.dm:14)
rt.def("/obj/item/weapon/melee/energy/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb_on", rt.list("attacked", "slashed", "stabbed", "sliced", "torn", "ripped", "diced", "cut"));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 30]));
	return f.dot;
});

// /obj/item/weapon/melee/energy/proc/Initialize  (code/game/objects/items/weapons/melee/energy.dm:19)  may sleep
rt.def("/obj/item/weapon/melee/energy/proc/Initialize", function* Initialize(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.length(rt.sv(f, "possible_colors")))) {
		rt.setSv(f, "item_color", rt.op(f, "PickUnweighted", [1], [rt.sv(f, "possible_colors")]));
		$0 = rt.sv(f, "item_color");
		if ($0 === "red") {
			rt.setSv(f, "light_color", "#FA8282");
		} else if ($0 === "green") {
			rt.setSv(f, "light_color", "#64C864");
		} else if ($0 === "blue") {
			rt.setSv(f, "light_color", "#40CEFF");
		} else if ($0 === "purple") {
			rt.setSv(f, "light_color", "#9B51FF");
		}
	}
	if (!truthy(rt.sv(f, "active"))) return f.dot;
	yield* g.srcCall(f, "set_light", rt.sv(f, "brightness_on"));
	return f.dot;
}, true);

// /obj/item/weapon/melee/energy/proc/suicide_act  (code/game/objects/items/weapons/melee/energy.dm:35)
rt.def("/obj/item/weapon/melee/energy/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is ＀ ＀! It looks like ＀ trying to commit seppuku!</span>", [live(user), rt.op(f, "PickUnweighted", [2], [fmt("slitting ＀ stomach open with", [rt.callName(f, live(user), "p_their", [])]), "falling on"]), live(f.src), rt.callName(f, live(user), "p_theyre", [])])]);
	return 3;
});

// /obj/item/weapon/melee/energy/proc/is_sharp  (code/game/objects/items/weapons/melee/energy.dm:42)
rt.def("/obj/item/weapon/melee/energy/proc/is_sharp", function is_sharp(f: Frame) {
	return multiply(rt.sv(f, "active"), rt.sv(f, "sharpness"));
});

rt.type(5674, "/obj/item/weapon/melee/energy/axe", "/obj/item/weapon/melee/energy", {
	force_on: 150,
	throwforce_on: 30,
	throw_speed: 3,
	throw_range: 5,
	w_class_on: 5,
	flags: 64,
	attack_verb_on: null,
	light_color: "#40ceff",
	name: "energy axe",
	desc: "An energized battle axe.",
	icon_state: "axe0",
	force: 40,
	throwforce: 25,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	w_class: 3,
	armour_penetration: 100,
	origin_tech: "combat=4;magnets=3",
	attack_verb: null,
});

// /obj/item/weapon/melee/energy/axe/proc/<init>  (code/game/objects/items/weapons/melee/energy.dm:61)
rt.def("/obj/item/weapon/melee/energy/axe/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb_on", rt.list());
	rt.setSv(f, "attack_verb", rt.list("attacked", "chopped", "cleaved", "torn", "cut"));
	return f.dot;
});

// /obj/item/weapon/melee/energy/axe/proc/suicide_act  (code/game/objects/items/weapons/melee/energy.dm:65)
rt.def("/obj/item/weapon/melee/energy/axe/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ swings ＀ towards ＀ head! It looks like ＀ trying to commit suicide!</span>", [live(user), live(f.src), rt.callName(f, live(user), "p_their", []), rt.callName(f, live(user), "p_theyre", [])])]);
	return 3;
});

rt.type(5675, "/obj/item/weapon/melee/energy/sword", "/obj/item/weapon/melee/energy", {
	hacked: 0,
	throw_speed: 3,
	throw_range: 5,
	possible_colors: null,
	name: "energy sword",
	desc: "May the force be within you.",
	icon_state: "sword0",
	force: 3,
	throwforce: 5,
	hitsound: "swing_hit",
	sharpness: 1,
	embed_chance: 75,
	embedded_impact_pain_multiplier: 10,
	armour_penetration: 35,
	origin_tech: "combat=3;magnets=4;syndicate=4",
	block_chance: 50,
});

// /obj/item/weapon/melee/energy/sword/proc/Destroy  (code/game/objects/items/weapons/melee/energy.dm:87)  may sleep
rt.def("/obj/item/weapon/melee/energy/sword/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/item/weapon/melee/energy/sword/proc/process  (code/game/objects/items/weapons/melee/energy.dm:93)  may sleep
rt.def("/obj/item/weapon/melee/energy/sword/proc/process", function* process(f: Frame) {
	if (truthy(rt.sv(f, "active"))) {
		if (truthy(rt.sv(f, "hacked"))) {
			rt.setSv(f, "light_color", rt.op(f, "PickUnweighted", [4], ["#FA8282", "#64C864", "#40CEFF", "#9B51FF"]));
		}
		yield* g.srcCall(f, "open_flame");
	} else {
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/item/weapon/melee/energy/sword/proc/hit_reaction  (code/game/objects/items/weapons/melee/energy.dm:100)
rt.def("/obj/item/weapon/melee/energy/sword/proc/hit_reaction", function hit_reaction(f: Frame) {
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
	if (truthy(rt.sv(f, "active"))) {
		return rt.callSuper(f, [], rt.Args.Same);
	}
	return 0;
}, false, { args: ["owner", "hitby", "attack_text", "final_block_chance", "damage", "attack_type"] });

// /obj/item/weapon/melee/energy/proc/attack_self  (code/game/objects/items/weapons/melee/energy.dm:104)  may sleep
rt.def("/obj/item/weapon/melee/energy/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if ((truthy(rt.bitAnd(rt.fv(f, "disabilities", live(user)), 256)) && truthy(rt.op(f, "Prob", [], [50])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You accidentally cut yourself with ＀, like a doofus!</span>", [live(f.src)])]);
		yield* g.callName(f, live(user), "take_bodypart_damage", [5, 5]);
	}
	rt.setSv(f, "active", (!truthy(rt.sv(f, "active")) ? 1 : 0));
	if (truthy(rt.sv(f, "active"))) {
		rt.setSv(f, "force", rt.sv(f, "force_on"));
		rt.setSv(f, "throwforce", rt.sv(f, "throwforce_on"));
		rt.setSv(f, "hitsound", rt.rsc("sound/weapons/blade1.ogg"));
		rt.setSv(f, "throw_speed", 4);
		if (truthy(rt.len(f, rt.sv(f, "attack_verb_on")))) {
			rt.setSv(f, "attack_verb", rt.sv(f, "attack_verb_on"));
		}
		if (!truthy(rt.sv(f, "item_color"))) {
			rt.setSv(f, "icon_state", rt.sv(f, "icon_state_on"));
		} else {
			rt.setSv(f, "icon_state", fmt("sword＀", [rt.sv(f, "item_color")]));
		}
		rt.setSv(f, "w_class", rt.sv(f, "w_class_on"));
		yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/weapons/saberon.ogg"), 35, 1]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ is now active.</span>", [live(f.src)])]);
		if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
			rt.setFv(f, "isprocessing", live(f.src), 1);
			rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
		}
		yield* g.srcCall(f, "set_light", rt.sv(f, "brightness_on"));
	} else {
		rt.setSv(f, "force", rt.initial(f, live(f.src), "force"));
		rt.setSv(f, "throwforce", rt.initial(f, live(f.src), "throwforce"));
		rt.setSv(f, "hitsound", rt.initial(f, live(f.src), "hitsound"));
		rt.setSv(f, "throw_speed", rt.initial(f, live(f.src), "throw_speed"));
		if (truthy(rt.len(f, rt.sv(f, "attack_verb_on")))) {
			rt.setSv(f, "attack_verb", rt.list());
		}
		rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
		rt.setSv(f, "w_class", rt.initial(f, live(f.src), "w_class"));
		yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/weapons/saberoff.ogg"), 35, 1]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ can now be concealed.</span>", [live(f.src)])]);
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
		yield* g.srcCall(f, "set_light", 0);
	}
	yield* g.srcCall(f, "add_fingerprint", live(user));
	return f.dot;
}, true);

// /obj/item/weapon/melee/energy/proc/is_hot  (code/game/objects/items/weapons/melee/energy.dm:140)
rt.def("/obj/item/weapon/melee/energy/proc/is_hot", function is_hot(f: Frame) {
	return multiply(rt.sv(f, "active"), rt.sv(f, "heat"));
});

// /obj/item/weapon/melee/energy/proc/ignition_effect  (code/game/objects/items/weapons/melee/energy.dm:143)  may sleep
rt.def("/obj/item/weapon/melee/energy/proc/ignition_effect", function* ignition_effect(f: Frame, A: Value, user: Value) {
	let in_mouth: Value = null, C: Value = null;
	f.vars = () => [A, user, in_mouth, C];
	if (!truthy(rt.sv(f, "active"))) {
		return "";
	}
	in_mouth = "";
	if (truthy((rt.istype(live(user), T("/mob/living/carbon")) ? 1 : 0))) {
		if (isEqual(rt.gv(f, "wear_mask", (C = live(user))), live(f.src))) {
			in_mouth = ", barely missing their nose";
		}
	}
	f.dot = fmt("<span class='warning'>＀ swings their ＀＀. They light ＀ in the process.</span>", [live(user), live(f.src), live(in_mouth), live(A)]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.sv(f, "hitsound"), (yield* g.srcCall(f, "get_clamped_volume")), 1, -1]);
	yield* g.srcCall(f, "add_fingerprint", live(user));
	return f.dot;
}, true);

rt.type(5676, "/obj/item/weapon/melee/energy/sword/cyborg", "/obj/item/weapon/melee/energy/sword", {
	hitcost: 50,
});

// /obj/item/weapon/melee/energy/sword/cyborg/proc/attack  (code/game/objects/items/weapons/melee/energy.dm:160)  may sleep
rt.def("/obj/item/weapon/melee/energy/sword/cyborg/proc/attack", function* attack(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (truthy(rt.fv(f, "cell", live(f.args[1])))) {
		C = rt.fv(f, "cell", live(f.args[1]));
		if ((truthy(rt.sv(f, "active")) && !truthy((yield* g.callName(f, live(C), "use", [rt.sv(f, "hitcost")]))))) {
			yield* g.srcCall(f, "attack_self", live(f.args[1]));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>It's out of charge!</span>"]);
			return live(f.dot);
		}
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return live(f.dot);
}, true, { args: ["M", "R"] });

rt.type(5677, "/obj/item/weapon/melee/energy/sword/cyborg/saw", "/obj/item/weapon/melee/energy/sword/cyborg", {
	force_on: 30,
	icon_state_on: "esaw_1",
	hitcost: 75,
	light_color: "#40ceff",
	possible_colors: null,
	name: "energy saw",
	desc: "For heavy duty cutting. It has a carbon-fiber blade in addition to a toggleable hard-light edge to dramatically increase sharpness.",
	icon_state: "esaw_0",
	force: 18,
	hitsound: rt.rsc("sound/weapons/circsawhit.ogg"),
	icon: rt.rsc("icons/obj/surgery.dmi"),
	item_color: null,
	w_class: 3,
	sharpness: 1,
});

// /obj/item/weapon/melee/energy/sword/cyborg/saw/proc/<init>  (code/game/objects/items/weapons/melee/energy.dm:184)
rt.def("/obj/item/weapon/melee/energy/sword/cyborg/saw/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_colors", null);
	return f.dot;
});

// /obj/item/weapon/melee/energy/sword/cyborg/saw/proc/Initialize  (code/game/objects/items/weapons/melee/energy.dm:187)  may sleep
rt.def("/obj/item/weapon/melee/energy/sword/cyborg/saw/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "icon_state", "esaw_0");
	rt.setSv(f, "item_color", null);
	return f.dot;
}, true);

rt.type(5679, "/obj/item/weapon/melee/energy/sword/saber/blue", "/obj/item/weapon/melee/energy/sword/saber", {
	possible_colors: null,
});

// /obj/item/weapon/melee/energy/sword/saber/blue/proc/<init>  (code/game/objects/items/weapons/melee/energy.dm:197)
rt.def("/obj/item/weapon/melee/energy/sword/saber/blue/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_colors", rt.list("blue"));
	return f.dot;
});

rt.type(5680, "/obj/item/weapon/melee/energy/sword/saber/purple", "/obj/item/weapon/melee/energy/sword/saber", {
	possible_colors: null,
});

// /obj/item/weapon/melee/energy/sword/saber/purple/proc/<init>  (code/game/objects/items/weapons/melee/energy.dm:200)
rt.def("/obj/item/weapon/melee/energy/sword/saber/purple/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_colors", rt.list("purple"));
	return f.dot;
});

rt.type(5681, "/obj/item/weapon/melee/energy/sword/saber/green", "/obj/item/weapon/melee/energy/sword/saber", {
	possible_colors: null,
});

// /obj/item/weapon/melee/energy/sword/saber/green/proc/<init>  (code/game/objects/items/weapons/melee/energy.dm:203)
rt.def("/obj/item/weapon/melee/energy/sword/saber/green/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_colors", rt.list("green"));
	return f.dot;
});

rt.type(5682, "/obj/item/weapon/melee/energy/sword/saber/red", "/obj/item/weapon/melee/energy/sword/saber", {
	possible_colors: null,
});

// /obj/item/weapon/melee/energy/sword/saber/red/proc/<init>  (code/game/objects/items/weapons/melee/energy.dm:206)
rt.def("/obj/item/weapon/melee/energy/sword/saber/red/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_colors", rt.list("red"));
	return f.dot;
});

rt.type(5678, "/obj/item/weapon/melee/energy/sword/saber", "/obj/item/weapon/melee/energy/sword", {});

// /obj/item/weapon/melee/energy/sword/saber/proc/attackby  (code/game/objects/items/weapons/melee/energy.dm:210)  may sleep
rt.def("/obj/item/weapon/melee/energy/sword/saber/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/multitool")) ? 1 : 0))) {
		if (!truthy(rt.sv(f, "hacked"))) {
			rt.setSv(f, "hacked", 1);
			rt.setSv(f, "item_color", "rainbow");
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>RNBW_ENGAGE</span>"]);
			if (truthy(rt.sv(f, "active"))) {
				rt.setSv(f, "icon_state", "swordrainbow");
				yield* g.callName(f, live(f.args[1]), "update_inv_hands", []);
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>It's already fabulous!</span>"]);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

rt.type(5684, "/obj/item/weapon/melee/energy/blade", "/obj/item/weapon/melee/energy", {
	spark_system: null,
	active: 1,
	throw_speed: 3,
	throw_range: 1,
	name: "energy blade",
	desc: "A concentrated beam of energy in the shape of a blade. Very stylish... and lethal.",
	icon_state: "blade",
	force: 30,
	hitsound: rt.rsc("sound/weapons/blade1.ogg"),
	throwforce: 1,
	w_class: 4,
	sharpness: 1,
});

// /obj/item/weapon/melee/energy/blade/proc/Initialize  (code/game/objects/items/weapons/melee/energy.dm:247)  may sleep
rt.def("/obj/item/weapon/melee/energy/blade/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "spark_system", (yield* g.new_(f, T("/datum/effect_system/spark_spread"), [])));
	yield* g.callName(f, rt.sv(f, "spark_system"), "set_up", [5, 0, live(f.src)]);
	yield* g.callName(f, rt.sv(f, "spark_system"), "attach", [live(f.src)]);
	return f.dot;
}, true);
