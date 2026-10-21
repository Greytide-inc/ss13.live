// From code/game/objects/items/weapons/airlock_painter.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7087, "/obj/item/weapon/airlock_painter", "/obj/item/weapon", {
	ink: null,
	flags: 68,
	name: "airlock painter",
	desc: "An advanced autopainter preprogrammed with several paintjobs for airlocks. Use it on an airlock during or after construction to change the paintjob.",
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "paint sprayer",
	item_state: "paint sprayer",
	w_class: 2,
	materials: null,
	origin_tech: "engineering=2",
	slot_flags: 512,
});

// /obj/item/weapon/airlock_painter/proc/<init>  (code/game/objects/items/weapons/airlock_painter.dm:10)
rt.def("/obj/item/weapon/airlock_painter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 50, "$glass", 50]));
	return f.dot;
});

// /obj/item/weapon/airlock_painter/proc/New  (code/game/objects/items/weapons/airlock_painter.dm:19)  may sleep
rt.def("/obj/item/weapon/airlock_painter/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "ink", (yield* g.new_(f, T("/obj/item/device/toner"), [live(f.src)])));
	return f.dot;
}, true);

// /obj/item/weapon/airlock_painter/proc/use  (code/game/objects/items/weapons/airlock_painter.dm:25)
rt.def("/obj/item/weapon/airlock_painter/proc/use", function use(f: Frame, user: Value) {
	if (truthy(rt.callSrc(f, "can_use", [live(user)]))) {
		rt.incField(f, rt.sv(f, "ink"), "charges", -1, true);
		rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/spray2.ogg"), 50, 1]);
		return 1;
	} else {
		return 0;
	}
	return f.dot;
});

// /obj/item/weapon/airlock_painter/proc/can_use  (code/game/objects/items/weapons/airlock_painter.dm:36)
rt.def("/obj/item/weapon/airlock_painter/proc/can_use", function can_use(f: Frame, user: Value) {
	if (!truthy(rt.sv(f, "ink"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>There is no toner cartridge installed in ＀!</span>", [live(f.src)])]);
		return 0;
	} else {
		if (rt.lt(rt.fv(f, "charges", rt.sv(f, "ink")), 1)) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ is out of ink!</span>", [live(f.src)])]);
			return 0;
		} else {
			return 1;
		}
	}
	return f.dot;
});

// /obj/item/weapon/airlock_painter/proc/suicide_act  (code/game/objects/items/weapons/airlock_painter.dm:46)  may sleep
rt.def("/obj/item/weapon/airlock_painter/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	let L: Value = null, _T: Value = null;
	f.vars = () => [user, L, _T];
	L = (yield* g.callName(f, live(user), "getorganslot", ["lungs"]));
	if ((truthy((yield* g.srcCall(f, "can_use", live(user)))) && truthy(live(L)))) {
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is inhaling toner from ＀! It looks like ＀ trying to commit suicide!</span>", [live(user), live(f.src), (yield* g.callName(f, live(user), "p_theyre", []))])]);
		yield* g.srcCall(f, "use", live(user));
		if (!truthy((rt.istype((_T = rt.getStep(f, rt.getStep(f, live(f.src), 0), rt.fv(f, "dir", live(user)))), T("/turf/open")) ? 1 : 0))) {
			_T = rt.getStep(f, live(f.src), 0);
		}
		if (!truthy(live(L))) {
			return 8;
		}
		yield* g.callName(f, live(L), "Remove", [live(user)]);
		yield* g.callName(f, live(L), "create_reagents", [10]);
		yield* g.callName(f, rt.fv(f, "reagents", live(L)), "add_reagent", ["colorful_reagent", 10]);
		yield* g.callName(f, rt.fv(f, "reagents", live(L)), "reaction", [live(L), 1, 1]);
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ vomits out their ＀!</span>", [live(user), live(L)])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(user)), rt.rsc("sound/effects/splat.ogg"), 50, 1]);
		yield* g.callName(f, live(L), "forceMove", [live(_T)]);
		return 12;
	} else {
		if ((truthy((yield* g.srcCall(f, "can_use", live(user)))) && !truthy(live(L)))) {
			yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is spraying toner on ＀self from ＀! It looks like ＀ trying to commit suicide.</span>", [live(user), (yield* g.callName(f, live(user), "p_them", [])), live(f.src), (yield* g.callName(f, live(user), "p_theyre", []))])]);
			yield* g.callName(f, rt.fv(f, "reagents", live(user)), "add_reagent", ["colorful_reagent", 1]);
			yield* g.callName(f, rt.fv(f, "reagents", live(user)), "reaction", [live(user), 1, 1]);
			return 4;
		} else {
			yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is trying to inhale toner from ＀! It might be a suicide attempt if ＀ had any toner.</span>", [live(user), live(f.src), live(f.src)])]);
			return 16;
		}
	}
	return f.dot;
}, true);

// /obj/item/weapon/airlock_painter/proc/examine  (code/game/objects/items/weapons/airlock_painter.dm:93)
rt.def("/obj/item/weapon/airlock_painter/proc/examine", function examine(f: Frame) {
	let ink_level: Value = null;
	f.vars = () => [ink_level];
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "ink"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>It doesn't have a toner cartridge installed.</span>"]);
		return live(f.dot);
	}
	ink_level = "high";
	if (rt.lt(rt.fv(f, "charges", rt.sv(f, "ink")), 1)) {
		ink_level = "empty";
	} else {
		if (rt.le(divide(rt.fv(f, "charges", rt.sv(f, "ink")), rt.fv(f, "max_charges", rt.sv(f, "ink"))), 0.25)) {
			ink_level = "low";
		} else {
			if (rt.gt(divide(rt.fv(f, "charges", rt.sv(f, "ink")), rt.fv(f, "max_charges", rt.sv(f, "ink"))), 1)) {
				ink_level = "dangerously high";
			}
		}
	}
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>Its ink levels look ＀.</span>", [live(ink_level)])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/airlock_painter/proc/attackby  (code/game/objects/items/weapons/airlock_painter.dm:108)  may sleep
rt.def("/obj/item/weapon/airlock_painter/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/toner")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "ink"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀ already contains ＇！.</span>", [live(f.src), rt.sv(f, "ink")])]);
			return live(f.dot);
		}
		if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You install ＀ into ＀.</span>", [live(f.args[0]), live(f.src)])]);
		rt.setSv(f, "ink", live(f.args[0]));
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/click.ogg"), 50, 1]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/weapon/airlock_painter/proc/attack_self  (code/game/objects/items/weapons/airlock_painter.dm:122)  may sleep
rt.def("/obj/item/weapon/airlock_painter/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy(rt.sv(f, "ink"))) return f.dot;
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/click.ogg"), 50, 1]);
	rt.setFv(f, "loc", rt.sv(f, "ink"), rt.fv(f, "loc", live(user)));
	yield* g.callName(f, live(user), "put_in_hands", [rt.sv(f, "ink")]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You remove ＀ from ＀.</span>", [rt.sv(f, "ink"), live(f.src)])]);
	rt.setSv(f, "ink", null);
	return f.dot;
}, true);
