// From code/game/objects/items/weapons/mop.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7309, "/obj/item/weapon/mop", "/obj/item/weapon", {
	mopping: 0,
	mopcount: 0,
	mopcap: 5,
	mopspeed: 30,
	throw_speed: 3,
	throw_range: 7,
	desc: "The world of janitalia wouldn't be complete without a mop.",
	name: "mop",
	icon: rt.rsc("icons/obj/janitor.dmi"),
	icon_state: "mop",
	force: 3,
	throwforce: 5,
	w_class: 3,
	attack_verb: null,
	resistance_flags: 4,
	force_string: "robust... against germs",
});

// /obj/item/weapon/mop/proc/New  (code/game/objects/items/weapons/mop.dm:20)  may sleep
rt.def("/obj/item/weapon/mop/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "create_reagents", rt.sv(f, "mopcap"));
	return f.dot;
}, true);

// /obj/item/weapon/mop/proc/clean  (code/game/objects/items/weapons/mop.dm:25)  may sleep
rt.def("/obj/item/weapon/mop/proc/clean", function* clean(f: Frame, A: Value) {
	let O: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [A, O, C, $e];
	if ((((truthy((yield* g.callName(f, rt.sv(f, "reagents"), "has_reagent", ["water", 1]))) || truthy((yield* g.callName(f, rt.sv(f, "reagents"), "has_reagent", ["holywater", 1])))) || truthy((yield* g.callName(f, rt.sv(f, "reagents"), "has_reagent", ["vodka", 1])))) || truthy((yield* g.callName(f, rt.sv(f, "reagents"), "has_reagent", ["cleaner", 1]))))) {
		yield* g.callName(f, live(A), "clean_blood", []);
		O = null;
		rt.forList(f, 0, live(A), T("/obj/effect"));
		while (($e = rt.next(f, 0)) !== undefined) {
			O = $e;
			if ((truthy((rt.istype(live(O), T("/obj/effect/decal/cleanable")) ? 1 : 0)) || truthy((rt.istype(live(O), T("/obj/effect/rune")) ? 1 : 0)))) {
				yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
			}
		}
		rt.endFor(f, 0);
		if (truthy((rt.istype(live(A), T("/turf/closed")) ? 1 : 0))) {
			rt.setFv(f, "thermite", (C = live(A)), 0);
		}
	}
	yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(A), 1, 10]);
	yield* g.callName(f, rt.sv(f, "reagents"), "remove_any", [1]);
	return f.dot;
}, true);

// /obj/item/weapon/mop/proc/afterattack  (code/game/objects/items/weapons/mop.dm:38)  may sleep
rt.def("/obj/item/weapon/mop/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	let _T: Value = null;
	f.vars = () => [A, user, proximity, _T];
	if (!truthy(live(proximity))) {
		return live(f.dot);
	}
	if (rt.lt(rt.fv(f, "total_volume", rt.sv(f, "reagents")), 1)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Your mop is dry!</span>"]);
		return live(f.dot);
	}
	_T = rt.getStep(f, live(A), 0);
	if ((truthy((rt.istype(live(A), T("/obj/item/weapon/reagent_containers/glass/bucket")) ? 1 : 0)) || truthy((rt.istype(live(A), T("/obj/structure/janitorialcart")) ? 1 : 0)))) {
		return live(f.dot);
	}
	if (!truthy(live(_T))) return f.dot;
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ begins to clean ％！ with ＀.", [live(user), live(_T), live(f.src)]), fmt("<span class='notice'>You begin to clean ％！ with ＀...</span>", [live(_T), live(f.src)])]);
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, rt.fv(f, "mopspeed", live(f.src)), "target", live(_T)], rt.Args.Named)))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You finish mopping.</span>"]);
	yield* g.srcCall(f, "clean", live(_T));
	return f.dot;
}, true);

// /obj/effect/proc/attackby  (code/game/objects/items/weapons/mop.dm:58)
rt.def("/obj/effect/proc/attackby", function attackby(f: Frame) {
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/mop")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/soap")) ? 1 : 0)))) {
		return live(f.dot);
	} else {
		return rt.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, false, { args: ["I", "user", "params"] });

// /obj/item/weapon/mop/proc/janicart_insert  (code/game/objects/items/weapons/mop.dm:65)  may sleep
rt.def("/obj/item/weapon/mop/proc/janicart_insert", function* janicart_insert(f: Frame, user: Value, J: Value) {
	f.vars = () => [user, J];
	yield* g.callName(f, live(J), "put_in_cart", [live(f.src), live(user)]);
	rt.setFv(f, "mymop", live(J), live(f.src));
	yield* g.callName(f, live(J), "update_icon", []);
	return f.dot;
}, true);

rt.type(7311, "/obj/item/weapon/mop/advanced", "/obj/item/weapon/mop", {
	refill_enabled: 1,
	refill_rate: 1,
	refill_reagent: "water",
	mopcap: 10,
	throw_range: 4,
	mopspeed: 20,
	desc: "The most advanced tool in a custodian's arsenal, complete with a condenser for self-wetting! Just think of all the viscera you will clean up with this!",
	name: "advanced mop",
	icon_state: "advmop",
	item_state: "mop",
	origin_tech: "materials=3;engineering=3",
	force: 6,
	throwforce: 8,
});

// /obj/item/weapon/mop/advanced/proc/New  (code/game/objects/items/weapons/mop.dm:90)  may sleep
rt.def("/obj/item/weapon/mop/advanced/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/weapon/mop/advanced/proc/attack_self  (code/game/objects/items/weapons/mop.dm:94)
rt.def("/obj/item/weapon/mop/advanced/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.setSv(f, "refill_enabled", (!truthy(rt.sv(f, "refill_enabled")) ? 1 : 0));
	if (truthy(rt.sv(f, "refill_enabled"))) {
		if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
			rt.setFv(f, "isprocessing", live(f.src), 1);
			rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
		}
	} else {
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	}
	$0 = live(user);
	if (truthy(rt.sv(f, "refill_enabled"))) {
		$1 = "ON";
	} else {
		$1 = "OFF";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You set the condenser switch to the '＀' position.</span>", [$1])]);
	rt.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/machines/click.ogg"), 30, 1]);
	return f.dot;
});

// /obj/item/weapon/mop/advanced/proc/process  (code/game/objects/items/weapons/mop.dm:104)  may sleep
rt.def("/obj/item/weapon/mop/advanced/proc/process", function* process(f: Frame) {
	if (!rt.lt(rt.fv(f, "total_volume", rt.sv(f, "reagents")), rt.sv(f, "mopcap"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", [rt.sv(f, "refill_reagent"), rt.sv(f, "refill_rate")]);
	return f.dot;
}, true, { waitfor: false });

// /obj/item/weapon/mop/advanced/proc/examine  (code/game/objects/items/weapons/mop.dm:108)
rt.def("/obj/item/weapon/mop/advanced/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = live(f.args[0]);
	if (truthy(rt.sv(f, "refill_enabled"))) {
		$1 = "ON";
	} else {
		$1 = "OFF";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>The condenser switch is set to <b>＀</b>.</span>", [$1])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/mop/advanced/proc/Destroy  (code/game/objects/items/weapons/mop.dm:113)  may sleep
rt.def("/obj/item/weapon/mop/advanced/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "refill_enabled"))) {
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);
