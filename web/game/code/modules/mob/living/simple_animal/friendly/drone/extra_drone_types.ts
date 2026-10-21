// From code/modules/mob/living/simple_animal/friendly/drone/extra_drone_types.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4845, "/mob/living/simple_animal/drone/syndrone", "/mob/living/simple_animal/drone", {
	picked: 1,
	initial_language_holder: rt.typePath("/datum/language_holder/drone/syndicate"),
	heavy_emp_damage: 10,
	laws: "1. Interfere.\n2. Kill.\n3. Destroy.",
	seeStatic: 0,
	hacked: 1,
	flavortext: null,
	name: "Syndrone",
	desc: "A modified maintenance drone. This one brings with it the feeling of terror.",
	icon_state: "drone_synd",
	icon_living: "drone_synd",
	health: 30,
	maxHealth: 120,
	faction: null,
	speak_emote: null,
	bubble_icon: "syndibot",
	default_storage: rt.typePath("/obj/item/device/radio/uplink"),
	default_hatmask: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/syndi"),
});

// /mob/living/simple_animal/drone/syndrone/proc/<init>  (code/modules/mob/living/simple_animal/friendly/drone/extra_drone_types.dm:21)
rt.def("/mob/living/simple_animal/drone/syndrone/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "faction", rt.list("syndicate"));
	$0 = $0;
	rt.setSv(f, "speak_emote", rt.list("hisses"));
	return f.dot;
});

// /mob/living/simple_animal/drone/syndrone/proc/Initialize  (code/modules/mob/living/simple_animal/friendly/drone/extra_drone_types.dm:36)  may sleep
rt.def("/mob/living/simple_animal/drone/syndrone/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "telecrystals", rt.fv(f, "hidden_uplink", rt.sv(f, "internal_storage")), 10);
	return f.dot;
}, true);

// /mob/living/simple_animal/drone/syndrone/proc/Login  (code/modules/mob/living/simple_animal/friendly/drone/extra_drone_types.dm:40)  may sleep
rt.def("/mob/living/simple_animal/drone/syndrone/proc/Login", function* Login(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>You can kill and eat other drones to increase your health!</span>"]);
	return f.dot;
}, true);

rt.type(4846, "/mob/living/simple_animal/drone/syndrone/badass", "/mob/living/simple_animal/drone/syndrone", {
	name: "Badass Syndrone",
	default_hatmask: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/syndi/elite"),
	default_storage: rt.typePath("/obj/item/device/radio/uplink/nuclear"),
});

// /mob/living/simple_animal/drone/syndrone/badass/proc/Initialize  (code/modules/mob/living/simple_animal/friendly/drone/extra_drone_types.dm:49)  may sleep
rt.def("/mob/living/simple_animal/drone/syndrone/badass/proc/Initialize", function* Initialize(f: Frame) {
	let W: Value = null;
	f.vars = () => [W];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "telecrystals", rt.fv(f, "hidden_uplink", rt.sv(f, "internal_storage")), 30);
	yield* g.callName(f, (W = (yield* g.new_(f, T("/obj/item/weapon/implant/weapons_auth"), [live(f.src)]))), "implant", [live(f.src)]);
	return f.dot;
}, true);

rt.type(4847, "/mob/living/simple_animal/drone/snowflake", "/mob/living/simple_animal/drone", {
	default_hatmask: rt.typePath("/obj/item/clothing/head/chameleon/drone"),
});

// /mob/living/simple_animal/drone/snowflake/proc/Initialize  (code/modules/mob/living/simple_animal/friendly/drone/extra_drone_types.dm:58)  may sleep
rt.def("/mob/living/simple_animal/drone/snowflake/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "desc", " This drone appears to have a complex holoprojector built on its 'head'.", add);
	return f.dot;
}, true);

rt.type(4849, "/mob/living/simple_animal/drone/polymorphed", "/mob/living/simple_animal/drone", {
	default_hatmask: null,
	picked: 1,
	default_storage: null,
});

// /mob/living/simple_animal/drone/polymorphed/proc/Initialize  (code/modules/mob/living/simple_animal/friendly/drone/extra_drone_types.dm:82)  may sleep
rt.def("/mob/living/simple_animal/drone/polymorphed/proc/Initialize", function* Initialize(f: Frame) {
	let colour: Value = null;
	f.vars = () => [colour];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "liberate");
	rt.setSv(f, "visualAppearence", rt.op(f, "PickUnweighted", [3], ["drone_maint", "drone_repair", "drone_scout"]));
	if (isEqual(rt.sv(f, "visualAppearence"), "drone_maint")) {
		colour = rt.op(f, "PickUnweighted", [6], ["grey", "blue", "red", "green", "pink", "orange"]);
		rt.setSv(f, "icon_state", fmt("＀_＀", [rt.sv(f, "visualAppearence"), live(colour)]));
	} else {
		rt.setSv(f, "icon_state", rt.sv(f, "visualAppearence"));
	}
	rt.setSv(f, "icon_living", rt.sv(f, "icon_state"));
	rt.setSv(f, "icon_dead", fmt("＀_dead", [rt.sv(f, "visualAppearence")]));
	return f.dot;
}, true);

rt.type(4842, "/mob/living/simple_animal/drone/cogscarab", "/mob/living/simple_animal/drone", {
	pass_flags: 1,
	verb_ask: "requests",
	verb_exclaim: "proclaims",
	verb_whisper: "imparts",
	verb_yell: "harangues",
	initial_language_holder: rt.typePath("/datum/language_holder/clockmob"),
	light_color: "#E42742",
	name: "cogscarab",
	desc: "A strange, drone-like machine. It constantly emits the hum of gears.",
	icon_state: "drone_clock",
	icon_living: "drone_clock",
	icon_dead: "drone_clock_dead",
	picked: 1,
	health: 50,
	maxHealth: 50,
	harm_intent_damage: 5,
	density: 1,
	speed: 1,
	ventcrawler: 0,
	faction: null,
	speak_emote: null,
	bubble_icon: "clock",
	heavy_emp_damage: 0,
	laws: "0. Purge all untruths and honor Ratvar.",
	seeStatic: 0,
	hacked: 1,
	visualAppearence: "drone_clock",
	can_be_held: 0,
	flavortext: "<span class='heavy_brass'>You are a cogscarab</span><b>, a clockwork creation of Ratvar. As a cogscarab, you have low health, an inbuilt fabricator that can convert brass to power, a set of relatively fast tools, </b><span class='heavy_brass'>can communicate over the Hierophant Network with :b</span><b>, and are immune to extreme temperatures and pressures. \nYour goal is to serve the Justiciar and his servants by repairing and defending all they create.</b>",
	default_storage: rt.typePath("/obj/item/weapon/storage/toolbox/brass/prefilled"),
});

// /mob/living/simple_animal/drone/cogscarab/proc/Initialize  (code/modules/mob/living/simple_animal/friendly/drone/extra_drone_types.dm:144)  may sleep
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "set_light", 2, 0.5);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "access_card")]);
	rt.setSv(f, "access_card", null);
	(rt.modSrcVar(f, "verbs", P("/mob/living/simple_animal/drone/verb/check_laws"), subtract));
	(rt.modSrcVar(f, "verbs", P("/mob/living/simple_animal/drone/verb/toggle_light"), subtract));
	(rt.modSrcVar(f, "verbs", P("/mob/living/simple_animal/drone/verb/drone_ping"), subtract));
	return f.dot;
}, true);

// /mob/living/simple_animal/drone/cogscarab/proc/Login  (code/modules/mob/living/simple_animal/friendly/drone/extra_drone_types.dm:153)  may sleep
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/Login", function* Login(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/add_servant_of_ratvar"), null, [live(f.src), 1]);
	$0 = live(f.src);
	if (truthy(rt.gl("ratvar_awakens"))) {
		$1 = "";
	} else {
		$1 = ", <i>excluding a clockwork slab</i>";
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<b>You yourself are one of these servants, and will be able to utilize almost anything they can＀.</b>", [$1])]);
	return f.dot;
}, true);

// /mob/living/simple_animal/drone/cogscarab/proc/alert_drones  (code/modules/mob/living/simple_animal/friendly/drone/extra_drone_types.dm:161)
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/alert_drones", function alert_drones(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (isEqual(live(f.args[0]), fmt("<span class='notice'>DRONE NETWORK: ＀ connected.</span>", [rt.sv(f, "name")]))) {
		f.args[0] = fmt("<span class='brass'><i>Hierophant Network:</i> ＀ activated.</span>", [rt.sv(f, "name")]);
	} else {
		if (isEqual(live(f.args[0]), fmt("<span class='danger'>DRONE NETWORK: ＀ is not responding.</span>", [rt.sv(f, "name")]))) {
			f.args[0] = fmt("<span class='brass'><i>Hierophant Network:</i></span> <span class='alloy'>＀ disabled.</span>", [rt.sv(f, "name")]);
		}
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["msg", "dead_can_hear"] });

// /mob/living/simple_animal/drone/proc/attackby  (code/modules/mob/living/simple_animal/friendly/drone/extra_drone_types.dm:168)  may sleep
rt.def("/mob/living/simple_animal/drone/proc/attackby", function* attackby(f: Frame) {
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0)) && isEqual(rt.sv(f, "stat"), 2))) {
		yield* g.srcCall(f, "try_reactivate", live(f.args[1]));
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["I", "user"] });

// /mob/living/simple_animal/drone/cogscarab/proc/try_reactivate  (code/modules/mob/living/simple_animal/friendly/drone/extra_drone_types.dm:174)  may sleep
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/try_reactivate", function* try_reactivate(f: Frame) {
	if (!truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>You fiddle around with ＀ to no avail.</span>", [live(f.src)])]);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["user"] });

// /mob/living/simple_animal/drone/cogscarab/proc/get_armor_effectiveness  (code/modules/mob/living/simple_animal/friendly/drone/extra_drone_types.dm:185)
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/get_armor_effectiveness", function get_armor_effectiveness(f: Frame) {
	if (truthy(rt.gl("ratvar_awakens"))) {
		return 1;
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

// /mob/living/simple_animal/drone/cogscarab/proc/drone_chat  (code/modules/mob/living/simple_animal/friendly/drone/extra_drone_types.dm:197)
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/drone_chat", function drone_chat(f: Frame, msg: Value) {
	rt.call(f, P("/proc/titled_hierophant_message"), null, [live(f.src), live(msg), "nezbere", "brass", "Construct"]);
	return f.dot;
});

// /mob/living/simple_animal/drone/cogscarab/proc/ratvar_act  (code/modules/mob/living/simple_animal/friendly/drone/extra_drone_types.dm:200)  may sleep
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/ratvar_act", function* ratvar_act(f: Frame) {
	yield* g.srcCall(f, "fully_heal", 1);
	return f.dot;
}, true);

// /mob/living/simple_animal/drone/cogscarab/proc/update_icons  (code/modules/mob/living/simple_animal/friendly/drone/extra_drone_types.dm:203)
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/update_icons", function update_icons(f: Frame) {
	if (!isEqual(rt.sv(f, "stat"), 2)) {
		if (truthy(rt.callSrc(f, "incapacitated", []))) {
			rt.setSv(f, "icon_state", fmt("＀_flipped", [rt.sv(f, "visualAppearence")]));
		} else {
			rt.setSv(f, "icon_state", rt.sv(f, "visualAppearence"));
		}
	} else {
		rt.setSv(f, "icon_state", fmt("＀_dead", [rt.sv(f, "visualAppearence")]));
	}
	return f.dot;
});

// /mob/living/simple_animal/drone/cogscarab/proc/Stun  (code/modules/mob/living/simple_animal/friendly/drone/extra_drone_types.dm:212)  may sleep
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/Stun", function* Stun(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.srcCall(f, "update_icons");
	return f.dot;
}, true, { args: ["amount", "updating", "ignore_canstun"] });

// /mob/living/simple_animal/drone/cogscarab/proc/SetStun  (code/modules/mob/living/simple_animal/friendly/drone/extra_drone_types.dm:217)  may sleep
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/SetStun", function* SetStun(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.srcCall(f, "update_icons");
	return f.dot;
}, true, { args: ["amount", "updating", "ignore_canstun"] });

// /mob/living/simple_animal/drone/cogscarab/proc/AdjustStun  (code/modules/mob/living/simple_animal/friendly/drone/extra_drone_types.dm:222)  may sleep
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/AdjustStun", function* AdjustStun(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.srcCall(f, "update_icons");
	return f.dot;
}, true, { args: ["amount", "updating", "ignore_canstun"] });

// /mob/living/simple_animal/drone/cogscarab/proc/Knockdown  (code/modules/mob/living/simple_animal/friendly/drone/extra_drone_types.dm:227)  may sleep
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/Knockdown", function* Knockdown(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.srcCall(f, "update_icons");
	return f.dot;
}, true, { args: ["amount", "updating", "ignore_canknockdown"] });

// /mob/living/simple_animal/drone/cogscarab/proc/SetKnockdown  (code/modules/mob/living/simple_animal/friendly/drone/extra_drone_types.dm:232)  may sleep
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/SetKnockdown", function* SetKnockdown(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.srcCall(f, "update_icons");
	return f.dot;
}, true, { args: ["amount", "updating", "ignore_canknockdown"] });

// /mob/living/simple_animal/drone/cogscarab/proc/AdjustKnockdown  (code/modules/mob/living/simple_animal/friendly/drone/extra_drone_types.dm:237)  may sleep
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/AdjustKnockdown", function* AdjustKnockdown(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.srcCall(f, "update_icons");
	return f.dot;
}, true, { args: ["amount", "updating", "ignore_canknockdown"] });
