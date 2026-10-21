// From code/game/objects/effects/contraband.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6982, "/obj/item/weapon/poster", "/obj/item/weapon", {
	poster_type: null,
	poster_structure: null,
	name: "poorly coded poster",
	desc: "You probably shouldn't be holding this.",
	icon: rt.rsc("icons/obj/contraband.dmi"),
	force: 0,
	resistance_flags: 4,
});

// /obj/item/weapon/poster/proc/Initialize  (code/game/objects/effects/contraband.dm:16)  may sleep
rt.def("/obj/item/weapon/poster/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "poster_structure", live(f.args[1]));
	if ((!truthy(live(f.args[1])) && truthy(rt.sv(f, "poster_type")))) {
		rt.setSv(f, "poster_structure", (yield* g.new_(f, rt.sv(f, "poster_type"), [live(f.src)])));
	}
	if (!truthy(rt.sv(f, "poster_structure"))) return f.dot;
	rt.setSv(f, "name", rt.fv(f, "poster_item_name", rt.sv(f, "poster_structure")));
	rt.setSv(f, "desc", rt.fv(f, "poster_item_desc", rt.sv(f, "poster_structure")));
	rt.setSv(f, "icon_state", rt.fv(f, "poster_item_icon_state", rt.sv(f, "poster_structure")));
	rt.setSv(f, "name", fmt("＀ - ＀", [rt.sv(f, "name"), rt.fv(f, "original_name", rt.sv(f, "poster_structure"))]));
	return f.dot;
}, true, { args: ["mapload", "new_poster_structure"] });

// /obj/item/weapon/poster/proc/Destroy  (code/game/objects/effects/contraband.dm:32)  may sleep
rt.def("/obj/item/weapon/poster/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "poster_structure", null);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

rt.type(12571, "/obj/structure/sign/poster", "/obj/structure/sign", {
	original_name: null,
	ruined: 0,
	random_basetype: null,
	never_random: 0,
	poster_item_name: "hypothetical poster",
	poster_item_desc: "This hypothetical poster item should not exist, let's be honest here.",
	poster_item_icon_state: "rolled_poster",
	anchored: 1,
	name: "poster",
	desc: "A large piece of space-resistant printed paper.",
	icon: rt.rsc("icons/obj/contraband.dmi"),
});

// /obj/structure/sign/poster/proc/Initialize  (code/game/objects/effects/contraband.dm:62)
rt.def("/obj/structure/sign/poster/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "random_basetype"))) {
		rt.callSrc(f, "randomise", [rt.sv(f, "random_basetype")]);
	}
	if (truthy(rt.sv(f, "ruined"))) return f.dot;
	rt.setSv(f, "original_name", rt.sv(f, "name"));
	rt.setSv(f, "name", fmt("poster - ＀", [rt.sv(f, "name")]));
	rt.setSv(f, "desc", fmt("A large piece of space-resistant printed paper. ＀", [rt.sv(f, "desc")]));
	return f.dot;
});

// /obj/structure/sign/poster/proc/randomise  (code/game/objects/effects/contraband.dm:71)
rt.def("/obj/structure/sign/poster/proc/randomise", function randomise(f: Frame, base_type: Value) {
	let poster_types: Value = null, approved_types: Value = null, t: Value = null, _T: Value = null, selected: Value = null;
	let $e: any;
	f.vars = () => [poster_types, approved_types, t, _T, selected, $e];
	poster_types = subtract(rt.call(f, P("/proc/typesof"), null, [live(base_type)]), live(base_type));
	approved_types = rt.list();
	t = null;
	rt.forList(f, 0, live(poster_types));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		if ((truthy(rt.initial(f, (_T = live(t)), "icon_state")) && !truthy(rt.initial(f, live(_T), "never_random")))) {
			(approved_types = rt.modify(live(approved_types), live(_T), rt.bitOr));
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "name", rt.initial(f, (selected = rt.op(f, "PickUnweighted", [1], [live(approved_types)])), "name"));
	rt.setSv(f, "desc", rt.initial(f, live(selected), "desc"));
	rt.setSv(f, "icon_state", rt.initial(f, live(selected), "icon_state"));
	rt.setSv(f, "poster_item_name", rt.initial(f, live(selected), "poster_item_name"));
	rt.setSv(f, "poster_item_desc", rt.initial(f, live(selected), "poster_item_desc"));
	rt.setSv(f, "poster_item_icon_state", rt.initial(f, live(selected), "poster_item_icon_state"));
	rt.setSv(f, "ruined", rt.initial(f, live(selected), "ruined"));
	return f.dot;
});

// /obj/structure/sign/poster/proc/attackby  (code/game/objects/effects/contraband.dm:90)  may sleep
rt.def("/obj/structure/sign/poster/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	f.vars = () => [I, user, params];
	if (!truthy((rt.istype(live(I), T("/obj/item/weapon/wirecutters")) ? 1 : 0))) return f.dot;
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(I)), 100, 1]);
	if (truthy(rt.sv(f, "ruined"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You remove the remnants of the poster.</span>"]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You carefully remove the poster from the wall.</span>"]);
		yield* g.srcCall(f, "roll_and_drop", rt.fv(f, "loc", live(user)));
	}
	return f.dot;
}, true);

// /obj/structure/sign/poster/proc/attack_hand  (code/game/objects/effects/contraband.dm:102)  may sleep
rt.def("/obj/structure/sign/poster/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let R: Value = null;
	f.vars = () => [user, R];
	if (truthy(rt.sv(f, "ruined"))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "visible_message", fmt("＀ rips ＀ in a single, decisive motion!", [live(user), live(f.src)]));
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/poster_ripped.ogg"), 100, 1]);
	rt.setFv(f, "pixel_y", (R = (yield* g.new_(f, T("/obj/structure/sign/poster/ripped"), [rt.sv(f, "loc")]))), rt.sv(f, "pixel_y"));
	rt.setFv(f, "pixel_x", live(R), rt.sv(f, "pixel_x"));
	yield* g.callName(f, live(R), "add_fingerprint", [live(user)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/sign/poster/proc/roll_and_drop  (code/game/objects/effects/contraband.dm:114)  may sleep
rt.def("/obj/structure/sign/poster/proc/roll_and_drop", function* roll_and_drop(f: Frame, loc: Value) {
	let _P: Value = null;
	f.vars = () => [loc, _P];
	rt.setSv(f, "pixel_x", 0);
	rt.setSv(f, "pixel_y", 0);
	yield* g.srcCall(f, "forceMove", (_P = (yield* g.new_(f, T("/obj/item/weapon/poster"), [live(loc), live(f.src)]))));
	return live(_P);
}, true);

// /turf/closed/wall/proc/place_poster  (code/game/objects/effects/contraband.dm:120)  may sleep
rt.def("/turf/closed/wall/proc/place_poster", function* place_poster(f: Frame, _P: Value, user: Value) {
	let stuff_on_wall: Value = null, O: Value = null, D: Value = null, temp_loc: Value = null;
	let $e: any;
	f.vars = () => [_P, user, stuff_on_wall, O, D, temp_loc, $e];
	if (!truthy(rt.fv(f, "poster_structure", live(_P)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ has no poster... inside it? Inform a coder!</span>", [live(_P)])]);
		return live(f.dot);
	}
	stuff_on_wall = 0;
	O = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (truthy((rt.istype(live(O), T("/obj/structure/sign/poster")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The wall is far too cluttered to place a poster!</span>"]);
			return live(f.dot);
		}
		stuff_on_wall = rt.inc(live(stuff_on_wall), 1);
		if (isEqual(live(stuff_on_wall), 3)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The wall is far too cluttered to place a poster!</span>"]);
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You start placing the poster on the wall...</span>"]);
	D = rt.fv(f, "poster_structure", live(_P));
	temp_loc = rt.getStep(f, live(user), 0);
	yield* g.call(f, P("/proc/flick"), null, ["poster_being_set", live(D)]);
	yield* g.callName(f, live(D), "forceMove", [live(f.src)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(_P)]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(D)), rt.rsc("sound/items/poster_being_created.ogg"), 100, 1]);
	if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 37, "target", live(f.src)], rt.Args.Named)))) {
		if ((!truthy(live(D)) || (!truthy(live(D)) || truthy(rt.fv(f, "gc_destroyed", live(D)))))) {
			return live(f.dot);
		}
		if (((truthy((rt.istype(live(f.src), T("/turf/closed/wall")) ? 1 : 0)) && truthy(live(user))) && isEqual(rt.fv(f, "loc", live(user)), live(temp_loc)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You place the poster!</span>"]);
			return live(f.dot);
		}
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>The poster falls down!</span>"]);
	yield* g.callName(f, live(D), "roll_and_drop", [live(temp_loc)]);
	return f.dot;
}, true);
