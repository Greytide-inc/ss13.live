// From code/modules/reagents/reagent_dispenser.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12524, "/obj/structure/reagent_dispensers", "/obj/structure", {
	tank_volume: 1000,
	reagent_id: "water",
	anchored: 0,
	container_type: 2048,
	pressure_resistance: 202.65,
	name: "Dispenser",
	desc: "...",
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "water",
	density: 1,
	obj_integrity: 300,
	max_integrity: 300,
});

// /obj/structure/reagent_dispensers/proc/take_damage  (code/modules/reagents/reagent_dispenser.dm:16)  may sleep
rt.def("/obj/structure/reagent_dispensers/proc/take_damage", function* take_damage(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = "brute";
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 1;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(live(f.dot)) && rt.gt(rt.sv(f, "obj_integrity"), 0))) return f.dot;
	if (!(truthy(rt.sv(f, "tank_volume")) && (isEqual(live(f.args[2]), "bullet") || isEqual(live(f.args[2]), "laser")))) return f.dot;
	yield* g.srcCall(f, "boom");
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "sound_effect", "attack_dir"] });

// /obj/structure/reagent_dispensers/proc/attackby  (code/modules/reagents/reagent_dispenser.dm:22)  may sleep
rt.def("/obj/structure/reagent_dispensers/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers")) ? 1 : 0))) {
		return 0;
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/structure/reagent_dispensers/proc/Initialize  (code/modules/reagents/reagent_dispenser.dm:28)  may sleep
rt.def("/obj/structure/reagent_dispensers/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.srcCall(f, "create_reagents", rt.sv(f, "tank_volume"));
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", [rt.sv(f, "reagent_id"), rt.sv(f, "tank_volume")]);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/structure/reagent_dispensers/proc/examine  (code/modules/reagents/reagent_dispenser.dm:33)
rt.def("/obj/structure/reagent_dispensers/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>It has ＀ units left.</span>", [rt.fv(f, "total_volume", rt.sv(f, "reagents"))])]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='danger'>It's empty.</span>"]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/reagent_dispensers/proc/boom  (code/modules/reagents/reagent_dispenser.dm:41)  may sleep
rt.def("/obj/structure/reagent_dispensers/proc/boom", function* boom(f: Frame) {
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＄！ ruptures!</span>", [live(f.src)]));
	yield* g.call(f, P("/proc/chem_splash"), null, [rt.sv(f, "loc"), 5, rt.list(rt.sv(f, "reagents"))]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/reagent_dispensers/proc/deconstruct  (code/modules/reagents/reagent_dispenser.dm:46)  may sleep
rt.def("/obj/structure/reagent_dispensers/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		if (!truthy(live(disassembled))) {
			yield* g.srcCall(f, "boom");
		}
	} else {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return f.dot;
}, true);

rt.type(12525, "/obj/structure/reagent_dispensers/fueltank", "/obj/structure/reagent_dispensers", {
	name: "fuel tank",
	desc: "A tank full of industrial welding fuel. Do not consume.",
	icon_state: "fuel",
	reagent_id: "welding_fuel",
});

// /obj/structure/reagent_dispensers/fueltank/proc/boom  (code/modules/reagents/reagent_dispenser.dm:70)  may sleep
rt.def("/obj/structure/reagent_dispensers/fueltank/proc/boom", function* boom(f: Frame) {
	yield* g.call(f, P("/proc/explosion"), null, [null, rt.getStep(f, live(f.src), 0), null, 0, null, 1, null, 5, "flame_range", 5], rt.Args.Named);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/reagent_dispensers/fueltank/proc/blob_act  (code/modules/reagents/reagent_dispenser.dm:74)  may sleep
rt.def("/obj/structure/reagent_dispensers/fueltank/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	f.vars = () => [B];
	yield* g.srcCall(f, "boom");
	return f.dot;
}, true);

// /obj/structure/reagent_dispensers/fueltank/proc/ex_act  (code/modules/reagents/reagent_dispenser.dm:77)  may sleep
rt.def("/obj/structure/reagent_dispensers/fueltank/proc/ex_act", function* ex_act(f: Frame) {
	yield* g.srcCall(f, "boom");
	return f.dot;
}, true, { waitfor: false });

// /obj/structure/reagent_dispensers/fueltank/proc/fire_act  (code/modules/reagents/reagent_dispenser.dm:80)  may sleep
rt.def("/obj/structure/reagent_dispensers/fueltank/proc/fire_act", function* fire_act(f: Frame, exposed_temperature: Value, exposed_volume: Value) {
	f.vars = () => [exposed_temperature, exposed_volume];
	yield* g.srcCall(f, "boom");
	return f.dot;
}, true);

// /obj/structure/reagent_dispensers/fueltank/proc/tesla_act  (code/modules/reagents/reagent_dispenser.dm:83)  may sleep
rt.def("/obj/structure/reagent_dispensers/fueltank/proc/tesla_act", function* tesla_act(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "boom");
	return f.dot;
}, true);

// /obj/structure/reagent_dispensers/fueltank/proc/bullet_act  (code/modules/reagents/reagent_dispenser.dm:87)  may sleep
rt.def("/obj/structure/reagent_dispensers/fueltank/proc/bullet_act", function* bullet_act(f: Frame) {
	let boom_message: Value = null, log_message: Value = null;
	f.vars = () => [boom_message, log_message];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) return f.dot;
	if (!(!truthy(rt.fv(f, "nodamage", live(f.args[0]))) && (isEqual(rt.fv(f, "damage_type", live(f.args[0])), "fire") || isEqual(rt.fv(f, "damage_type", live(f.args[0])), "brute")))) return f.dot;
	rt.modGl("bombers", (boom_message = fmt("＀ triggered a fueltank explosion via projectile.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [rt.fv(f, "firer", live(f.args[0]))]))])), add);
	yield* g.call(f, P("/proc/message_admins"), null, [live(boom_message)]);
	log_message = "triggered a fueltank explosion via projectile.";
	yield* g.callName(f, rt.fv(f, "firer", live(f.args[0])), "log_message", [live(log_message), "Attack log"]);
	yield* g.call(f, P("/proc/log_attack"), null, [fmt("＀ ＀", [(yield* g.call(f, P("/proc/key_name"), null, [rt.fv(f, "firer", live(f.args[0]))])), live(log_message)])]);
	yield* g.srcCall(f, "boom");
	return f.dot;
}, true, { args: ["P"] });

// /obj/structure/reagent_dispensers/fueltank/proc/attackby  (code/modules/reagents/reagent_dispenser.dm:99)  may sleep
rt.def("/obj/structure/reagent_dispensers/fueltank/proc/attackby", function* attackby(f: Frame) {
	let W: Value = null, message_admins: Value = null, message_log: Value = null;
	f.vars = () => [W, message_admins, message_log];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
		if (!truthy((yield* g.callName(f, rt.sv(f, "reagents"), "has_reagent", ["welding_fuel"])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ is out of fuel!</span>", [live(f.src)])]);
			return live(f.dot);
		}
		if (!truthy(rt.gv(f, "welding", (W = live(f.args[0]))))) {
			if (truthy((yield* g.callName(f, rt.fv(f, "reagents", live(W)), "has_reagent", ["welding_fuel", rt.fv(f, "max_fuel", live(W))])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>Your ＀ is already full!</span>", [rt.fv(f, "name", live(W))])]);
				return live(f.dot);
			}
			yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(W), rt.fv(f, "max_fuel", live(W))]);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ refills ＀ ＀.</span>", [live(f.args[1]), (yield* g.callName(f, live(f.args[1]), "p_their", [])), rt.fv(f, "name", live(W))]), fmt("<span class='notice'>You refill ＀.</span>", [live(W)])]);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/refill.ogg"), 50, 1]);
			yield* g.callName(f, live(W), "update_icon", []);
		} else {
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ catastrophically fails at refilling ＀ ＀!</span>", [live(f.args[1]), (yield* g.callName(f, live(f.args[1]), "p_their", [])), rt.fv(f, "name", live(W))]), "<span class='userdanger'>That was stupid of you.</span>"]);
			rt.modGl("bombers", (message_admins = fmt("＀ triggered a fueltank explosion via welding tool.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.args[1])]))])), add);
			yield* g.call(f, P("/proc/message_admins"), null, [live(message_admins)]);
			message_log = "triggered a fueltank explosion via welding tool.";
			yield* g.callName(f, live(f.args[1]), "log_message", [live(message_log), "Attack log"]);
			yield* g.call(f, P("/proc/log_attack"), null, [fmt("＀ ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.args[1])])), live(message_log)])]);
			yield* g.srcCall(f, "boom");
		}
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "params"] });

rt.type(12528, "/obj/structure/reagent_dispensers/peppertank", "/obj/structure/reagent_dispensers", {
	anchored: 1,
	reagent_id: "condensedcapsaicin",
	name: "pepper spray refiller",
	desc: "Contains condensed capsaicin for use in law \"enforcement.\"",
	icon_state: "pepper",
	density: 0,
});

// /obj/structure/reagent_dispensers/peppertank/proc/Initialize  (code/modules/reagents/reagent_dispenser.dm:134)  may sleep
rt.def("/obj/structure/reagent_dispensers/peppertank/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.op(f, "Prob", [], [1]))) return f.dot;
	rt.setSv(f, "desc", "IT'S PEPPER TIME, BITCH!");
	return f.dot;
}, true);

rt.type(12529, "/obj/structure/reagent_dispensers/water_cooler", "/obj/structure/reagent_dispensers", {
	paper_cups: 25,
	anchored: 1,
	tank_volume: 500,
	name: "liquid cooler",
	desc: "A machine that dispenses liquid to drink.",
	icon: rt.rsc("icons/obj/vending.dmi"),
	icon_state: "water_cooler",
});

// /obj/structure/reagent_dispensers/water_cooler/proc/examine  (code/modules/reagents/reagent_dispenser.dm:149)
rt.def("/obj/structure/reagent_dispensers/water_cooler/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = live(f.args[0]);
	if (truthy(rt.sv(f, "paper_cups"))) {
		$1 = rt.sv(f, "paper_cups");
	} else {
		$1 = "no";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("There are ＀ paper cups left.", [$1])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/reagent_dispensers/water_cooler/proc/attack_hand  (code/modules/reagents/reagent_dispenser.dm:153)  may sleep
rt.def("/obj/structure/reagent_dispensers/water_cooler/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let S: Value = null;
	f.vars = () => [user, S];
	if (!truthy(rt.sv(f, "paper_cups"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>There aren't any cups left!</span>"]);
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ takes a cup from ＀.</span>", [live(user), live(f.src)]), fmt("<span class='notice'>You take a paper cup from ＀.</span>", [live(f.src)])]);
	S = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/drinks/sillycup"), [rt.getStep(f, live(f.src), 0)]));
	yield* g.callName(f, live(user), "put_in_hands", [live(S)]);
	rt.incSrcVar(f, "paper_cups", -1, true);
	return f.dot;
}, true);

rt.type(12530, "/obj/structure/reagent_dispensers/beerkeg", "/obj/structure/reagent_dispensers", {
	reagent_id: "beer",
	name: "beer keg",
	desc: "Beer is liquid bread, it's good for you...",
	icon_state: "beer",
});

// /obj/structure/reagent_dispensers/beerkeg/proc/blob_act  (code/modules/reagents/reagent_dispenser.dm:169)  may sleep
rt.def("/obj/structure/reagent_dispensers/beerkeg/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	f.vars = () => [B];
	yield* g.call(f, P("/proc/explosion"), null, [rt.fv(f, "loc", live(f.src)), 0, 3, 5, 7, 10]);
	if (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
