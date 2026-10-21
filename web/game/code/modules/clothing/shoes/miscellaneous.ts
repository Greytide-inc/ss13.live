// From code/modules/clothing/shoes/miscellaneous.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/item/clothing/shoes/proc/suicide_act  (code/modules/clothing/shoes/miscellaneous.dm:4)  may sleep
rt.def("/obj/item/clothing/shoes/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	let i: Value = null;
	f.vars = () => [user, i];
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is bashing ＀ own head in with ＀! Ain't that a kick in the head?</span>", [live(user), (yield* g.callName(f, live(user), "p_their", [])), live(f.src)])]);
	i = null;
	i = 0;
	while (rt.lt(live(i), 3)) {
		yield* g.call(f, P("/proc/sleep"), null, [3]);
		yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/weapons/genhit2.ogg"), 50, 1]);
		i = rt.inc(live(i), 1);
	}
	return 1;
}, true);

rt.type(8460, "/obj/item/clothing/shoes/combat", "/obj/item/clothing/shoes", {
	name: "combat boots",
	desc: "High speed, low drag combat boots.",
	icon_state: "jackboots",
	item_state: "jackboots",
	armor: null,
	strip_delay: 70,
	resistance_flags: 0,
	pockets: rt.typePath("/obj/item/weapon/storage/internal/pocket/shoes"),
});

// /obj/item/clothing/shoes/combat/proc/<init>  (code/modules/clothing/shoes/miscellaneous.dm:20)
rt.def("/obj/item/clothing/shoes/combat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 25, "bullet", 25, "laser", 25, "energy", 25, "bomb", 50, "bio", 10, "rad", 0, "fire", 70, "acid", 50]));
	return f.dot;
});

rt.type(8463, "/obj/item/clothing/shoes/combat/swat", "/obj/item/clothing/shoes/combat", {
	flags: 1024,
	name: "１SWAT boots",
	desc: "High speed, no drag combat boots.",
	permeability_coefficient: 0.01,
	armor: null,
});

// /obj/item/clothing/shoes/combat/swat/proc/<init>  (code/modules/clothing/shoes/miscellaneous.dm:30)
rt.def("/obj/item/clothing/shoes/combat/swat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 40, "bullet", 30, "laser", 25, "energy", 25, "bomb", 50, "bio", 30, "rad", 30, "fire", 90, "acid", 50]));
	return f.dot;
});

rt.type(8495, "/obj/item/clothing/shoes/galoshes", "/obj/item/clothing/shoes", {
	flags: 1024,
	desc: "A pair of yellow rubber boots, designed to prevent slipping on wet surfaces.",
	name: "galoshes",
	icon_state: "galoshes",
	permeability_coefficient: 0.05,
	slowdown: 1,
	strip_delay: 50,
	equip_delay_other: 50,
	resistance_flags: 0,
	armor: null,
});

// /obj/item/clothing/shoes/galoshes/proc/<init>  (code/modules/clothing/shoes/miscellaneous.dm:60)
rt.def("/obj/item/clothing/shoes/galoshes/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 40, "acid", 75]));
	return f.dot;
});

rt.type(8496, "/obj/item/clothing/shoes/galoshes/dry", "/obj/item/clothing/shoes/galoshes", {
	name: "absorbent galoshes",
	desc: "A pair of orange rubber boots, designed to prevent slipping on wet surfaces while also drying them.",
	icon_state: "galoshes_dry",
});

// /obj/item/clothing/shoes/galoshes/dry/proc/step_action  (code/modules/clothing/shoes/miscellaneous.dm:68)
rt.def("/obj/item/clothing/shoes/galoshes/dry/proc/step_action", function step_action(f: Frame) {
	let t_loc: Value = null;
	f.vars = () => [t_loc];
	if (!(truthy((rt.istype((t_loc = rt.getStep(f, live(f.src), 0)), T("/turf/open")) ? 1 : 0)) && truthy(rt.fv(f, "wet", live(t_loc))))) return f.dot;
	rt.callName(f, live(t_loc), "MakeDry", [1]);
	rt.setFv(f, "wet_time", live(t_loc), 0);
	return f.dot;
});

rt.type(8487, "/obj/item/clothing/shoes/clown_shoes", "/obj/item/clothing/shoes", {
	footstep: 1,
	desc: "The prankster's standard-issue clowning shoes. Damn, they're huge!",
	name: "clown shoes",
	icon_state: "clown",
	item_state: "clown_shoes",
	slowdown: 1,
	item_color: "clown",
	pockets: rt.typePath("/obj/item/weapon/storage/internal/pocket/shoes/clown"),
});

// /obj/item/clothing/shoes/clown_shoes/proc/step_action  (code/modules/clothing/shoes/miscellaneous.dm:84)
rt.def("/obj/item/clothing/shoes/clown_shoes/proc/step_action", function step_action(f: Frame) {
	if (rt.gt(rt.sv(f, "footstep"), 1)) {
		rt.call(f, P("/proc/playsound"), null, [live(f.src), "clownstep", 50, 1]);
		rt.setSv(f, "footstep", 0);
	} else {
		rt.incSrcVar(f, "footstep", 1, true);
	}
	return f.dot;
});

rt.type(8509, "/obj/item/clothing/shoes/bhop", "/obj/item/clothing/shoes", {
	jumpdistance: 5,
	jumpspeed: 3,
	recharging_rate: 60,
	recharging_time: 0,
	jumping: 0,
	name: "jump boots",
	desc: "A specialized pair of combat boots with a built-in propulsion system for rapid foward movement.",
	icon_state: "jetboots",
	item_state: "jetboots",
	item_color: "hosred",
	resistance_flags: 2,
	pockets: rt.typePath("/obj/item/weapon/storage/internal/pocket/shoes"),
	actions_types: null,
});

// /obj/item/clothing/shoes/bhop/proc/<init>  (code/modules/clothing/shoes/miscellaneous.dm:182)
rt.def("/obj/item/clothing/shoes/bhop/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/bhop")));
	return f.dot;
});

// /obj/item/clothing/shoes/bhop/proc/ui_action_click  (code/modules/clothing/shoes/miscellaneous.dm:190)  may sleep
rt.def("/obj/item/clothing/shoes/bhop/proc/ui_action_click", function* ui_action_click(f: Frame, user: Value, action: Value) {
	let target: Value = null;
	f.vars = () => [user, action, target];
	if (!truthy((rt.istype(live(f.usr), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "jumping"))) {
		return live(f.dot);
	}
	if (rt.gt(rt.sv(f, "recharging_time"), rt.worldTime(f))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>The boot's internal propulsion needs to recharge still!</span>"]);
		return live(f.dot);
	}
	target = (yield* g.call(f, P("/proc/get_edge_target_turf"), null, [live(f.usr), rt.fv(f, "dir", live(f.usr))]));
	rt.setSv(f, "jumping", 1);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/stealthoff.ogg"), 50, 1, 1]);
	yield* g.callName(f, live(f.usr), "visible_message", [fmt("<span class='warning'>＀ dashes foward into the air!</span>", [live(f.usr)])]);
	yield* g.callName(f, live(f.usr), "throw_at", [null, live(target), null, rt.sv(f, "jumpdistance"), null, rt.sv(f, "jumpspeed"), "spin", 0, "diagonals_first", 1, "callback", (yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/clothing/shoes/bhop/proc/hop_end")]))], rt.Args.Named);
	return f.dot;
}, true);

// /obj/item/clothing/shoes/bhop/proc/hop_end  (code/modules/clothing/shoes/miscellaneous.dm:209)
rt.def("/obj/item/clothing/shoes/bhop/proc/hop_end", function hop_end(f: Frame) {
	rt.setSv(f, "jumping", 0);
	rt.setSv(f, "recharging_time", add(rt.worldTime(f), rt.sv(f, "recharging_rate")));
	return f.dot;
});
