// From code/game/objects/structures/safe.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12868, "/obj/structure/safe", "/obj/structure", {
	open: 0,
	tumbler_1_pos: null,
	tumbler_1_open: null,
	tumbler_2_pos: null,
	tumbler_2_open: null,
	dial: 0,
	space: 0,
	maxspace: 24,
	anchored: 1,
	name: "safe",
	desc: "A huge chunk of metal with a dial embedded in it. Fine print on the dial reads \"Scarborough Arms - 2 tumbler safe, guaranteed thermite resistant, explosion resistant, and assistant resistant.\"",
	icon: rt.rsc("icons/obj/structures.dmi"),
	icon_state: "safe",
	density: 1,
	resistance_flags: 99,
});

// /obj/structure/safe/proc/New  (code/game/objects/structures/safe.dm:27)  may sleep
rt.def("/obj/structure/safe/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "tumbler_1_pos", (yield* g.call(f, P("/proc/rand"), null, [0, 71])));
	rt.setSv(f, "tumbler_1_open", (yield* g.call(f, P("/proc/rand"), null, [0, 71])));
	rt.setSv(f, "tumbler_2_pos", (yield* g.call(f, P("/proc/rand"), null, [0, 71])));
	rt.setSv(f, "tumbler_2_open", (yield* g.call(f, P("/proc/rand"), null, [0, 71])));
	return f.dot;
}, true);

// /obj/structure/safe/proc/Initialize  (code/game/objects/structures/safe.dm:36)
rt.def("/obj/structure/safe/proc/Initialize", function Initialize(f: Frame) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [I, $e];
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.args[0]))) {
		return live(f.dot);
	}
	I = null;
	rt.forList(f, 0, rt.sv(f, "loc"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (rt.ge(rt.sv(f, "space"), rt.sv(f, "maxspace"))) {
			return live(f.dot);
		}
		if (rt.le(add(rt.fv(f, "w_class", live(I)), rt.sv(f, "space")), rt.sv(f, "maxspace"))) {
			rt.modSrcVar(f, "space", rt.fv(f, "w_class", live(I)), add);
			rt.setFv(f, "loc", live(I), live(f.src));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, false, { args: ["mapload"] });

// /obj/structure/safe/proc/check_unlocked  (code/game/objects/structures/safe.dm:50)
rt.def("/obj/structure/safe/proc/check_unlocked", function check_unlocked(f: Frame, user: Value, canhear: Value) {
	if ((truthy(live(user)) && truthy(live(canhear)))) {
		if (isEqual(rt.sv(f, "tumbler_1_pos"), rt.sv(f, "tumbler_1_open"))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='italics'>You hear a ＀ from ＀.</span>", [rt.op(f, "PickUnweighted", [3], ["tonk", "krunk", "plunk"]), live(f.src)])]);
		}
		if (isEqual(rt.sv(f, "tumbler_2_pos"), rt.sv(f, "tumbler_2_open"))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='italics'>You hear a ＀ from ＀.</span>", [rt.op(f, "PickUnweighted", [3], ["tink", "krink", "plink"]), live(f.src)])]);
		}
	}
	if ((isEqual(rt.sv(f, "tumbler_1_pos"), rt.sv(f, "tumbler_1_open")) && isEqual(rt.sv(f, "tumbler_2_pos"), rt.sv(f, "tumbler_2_open")))) {
		if (truthy(live(user))) {
			rt.callSrc(f, "visible_message", [fmt("<i><b>＀!</b></i>", [rt.op(f, "PickUnweighted", [5], ["Spring", "Sprang", "Sproing", "Clunk", "Krunk"])])]);
		}
		return 1;
	}
	return 0;
});

// /obj/structure/safe/proc/decrement  (code/game/objects/structures/safe.dm:62)
rt.def("/obj/structure/safe/proc/decrement", function decrement(f: Frame, num: Value) {
	f.vars = () => [num];
	(num = rt.modify(live(num), 1, subtract));
	if (rt.lt(live(num), 0)) {
		num = 71;
	}
	return live(num);
});

// /obj/structure/safe/proc/increment  (code/game/objects/structures/safe.dm:69)
rt.def("/obj/structure/safe/proc/increment", function increment(f: Frame, num: Value) {
	f.vars = () => [num];
	if (rt.gt((num = rt.modify(live(num), 1, add)), 71)) {
		num = 0;
	}
	return live(num);
});

// /obj/structure/safe/proc/update_icon  (code/game/objects/structures/safe.dm:77)
rt.def("/obj/structure/safe/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "open"))) {
		rt.setSv(f, "icon_state", fmt("＀-open", [rt.initial(f, live(f.src), "icon_state")]));
	} else {
		rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
	}
	return f.dot;
});

// /obj/structure/safe/proc/attack_hand  (code/game/objects/structures/safe.dm:83)  may sleep
rt.def("/obj/structure/safe/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let dat: Value = null, i: Value = null, _P: Value = null;
	let $0: any, $1: any;
	f.vars = () => [user, dat, i, _P, $0, $1];
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	dat = "<center>";
	$0 = live(f.src);
	if (truthy(rt.sv(f, "open"))) {
		$1 = "Close";
	} else {
		$1 = "Open";
	}
	dat = rt.modify(live(dat), fmt("<a href='?src=＃;open=1'>＀ ＀</a> | <a href='?src=＃;decrement=1'>-</a> ＀ <a href='?src=＃;increment=1'>+</a>", [$0, $1, live(f.src), live(f.src), multiply(rt.sv(f, "dial"), 5), live(f.src)]), add);
	if (truthy(rt.sv(f, "open"))) {
		dat = rt.modify(live(dat), "<table>", add);
		i = null;
		i = rt.len(f, rt.sv(f, "contents"));
		while (rt.ge(live(i), 1)) {
			_P = rt.index(rt.sv(f, "contents"), live(i));
			dat = rt.modify(live(dat), fmt("<tr><td><a href='?src=＃;retrieve=＃'>＀</a></td></tr>", [live(f.src), live(_P), rt.fv(f, "name", live(_P))]), add);
			i = rt.inc(live(i), -1);
		}
		dat = rt.modify(live(dat), "</table></center>", add);
	}
	rt.op(f, "Browse", [], [live(user), fmt("<html><head><title>＀</title></head><body>＀</body></html>", [rt.sv(f, "name"), live(dat)]), "window=safe;size=350x300"], false);
	return f.dot;
}, true);

// /obj/structure/safe/proc/Topic  (code/game/objects/structures/safe.dm:96)  may sleep
rt.def("/obj/structure/safe/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let user: Value = null, canhear: Value = null, _P: Value = null;
	let $0: any, $1: any;
	f.vars = () => [href, href_list, user, canhear, _P, $0, $1];
	if (!truthy((rt.istype(live(f.usr), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	// Safe-cracking and opening need you next to the safe (an href can name it from anywhere).
	if (!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1)) {
		return live(f.dot);
	}
	user = live(f.usr);
	canhear = 0;
	if (truthy((yield* g.callName(f, live(user), "is_holding_item_of_type", [T("/obj/item/clothing/neck/stethoscope")])))) {
		canhear = 1;
	}
	if (truthy(rt.at(live(href_list), "open"))) {
		if (truthy((yield* g.srcCall(f, "check_unlocked")))) {
			$0 = live(user);
			if (truthy(rt.sv(f, "open"))) {
				$1 = "close";
			} else {
				$1 = "open";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀ ＀.</span>", [$1, live(f.src)])]);
			rt.setSv(f, "open", (!truthy(rt.sv(f, "open")) ? 1 : 0));
			yield* g.srcCall(f, "update_icon");
			yield* g.srcCall(f, "updateUsrDialog");
			return live(f.dot);
		} else {
			$0 = live(user);
			if (truthy(rt.sv(f, "open"))) {
				$1 = "close";
			} else {
				$1 = "open";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='warning'>You can't ＀ ＀, the lock is engaged!</span>", [$1, live(f.src)])]);
			return live(f.dot);
		}
	}
	if (truthy(rt.at(live(href_list), "decrement"))) {
		rt.setSv(f, "dial", (yield* g.srcCall(f, "decrement", rt.sv(f, "dial"))));
		if ((isEqual(rt.sv(f, "dial"), add(rt.sv(f, "tumbler_1_pos"), 1)) || isEqual(rt.sv(f, "dial"), subtract(rt.sv(f, "tumbler_1_pos"), 71)))) {
			rt.setSv(f, "tumbler_1_pos", (yield* g.srcCall(f, "decrement", rt.sv(f, "tumbler_1_pos"))));
			if (truthy(live(canhear))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='italics'>You hear a ＀ from ＀.</span>", [rt.op(f, "PickUnweighted", [3], ["clack", "scrape", "clank"]), live(f.src)])]);
			}
			if ((isEqual(rt.sv(f, "tumbler_1_pos"), add(rt.sv(f, "tumbler_2_pos"), 37)) || isEqual(rt.sv(f, "tumbler_1_pos"), subtract(rt.sv(f, "tumbler_2_pos"), 35)))) {
				rt.setSv(f, "tumbler_2_pos", (yield* g.srcCall(f, "decrement", rt.sv(f, "tumbler_2_pos"))));
				if (truthy(live(canhear))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='italics'>You hear a ＀ from ＀.</span>", [rt.op(f, "PickUnweighted", [3], ["click", "chink", "clink"]), live(f.src)])]);
				}
			}
			yield* g.srcCall(f, "check_unlocked", live(user), live(canhear));
		}
		yield* g.srcCall(f, "updateUsrDialog");
		return live(f.dot);
	}
	if (truthy(rt.at(live(href_list), "increment"))) {
		rt.setSv(f, "dial", (yield* g.srcCall(f, "increment", rt.sv(f, "dial"))));
		if ((isEqual(rt.sv(f, "dial"), subtract(rt.sv(f, "tumbler_1_pos"), 1)) || isEqual(rt.sv(f, "dial"), add(rt.sv(f, "tumbler_1_pos"), 71)))) {
			rt.setSv(f, "tumbler_1_pos", (yield* g.srcCall(f, "increment", rt.sv(f, "tumbler_1_pos"))));
			if (truthy(live(canhear))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='italics'>You hear a ＀ from ＀.</span>", [rt.op(f, "PickUnweighted", [3], ["clack", "scrape", "clank"]), live(f.src)])]);
			}
			if ((isEqual(rt.sv(f, "tumbler_1_pos"), subtract(rt.sv(f, "tumbler_2_pos"), 37)) || isEqual(rt.sv(f, "tumbler_1_pos"), add(rt.sv(f, "tumbler_2_pos"), 35)))) {
				rt.setSv(f, "tumbler_2_pos", (yield* g.srcCall(f, "increment", rt.sv(f, "tumbler_2_pos"))));
				if (truthy(live(canhear))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='italics'>You hear a ＀ from ＀.</span>", [rt.op(f, "PickUnweighted", [3], ["click", "chink", "clink"]), live(f.src)])]);
				}
			}
			yield* g.srcCall(f, "check_unlocked", live(user), live(canhear));
		}
		yield* g.srcCall(f, "updateUsrDialog");
		return live(f.dot);
	}
	if (!truthy(rt.at(live(href_list), "retrieve"))) return f.dot;
	rt.op(f, "Browse", [], [live(user), "", "window=safe"], false);
	_P = rt.locateIn(f, rt.at(live(href_list), "retrieve"), live(f.src));
	if (!truthy(rt.sv(f, "open"))) return f.dot;
	if (!(truthy(live(_P)) && rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(user)])), 1))) return f.dot;
	yield* g.callName(f, live(user), "put_in_hands", [live(_P)]);
	(rt.modSrcVar(f, "space", rt.fv(f, "w_class", live(_P)), subtract));
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true);

// /obj/structure/safe/proc/attackby  (code/game/objects/structures/safe.dm:157)  may sleep
rt.def("/obj/structure/safe/proc/attackby", function* attackby(f: Frame) {
	if (truthy(rt.sv(f, "open"))) {
		f.dot = 1;
		if (rt.le(add(rt.fv(f, "w_class", live(f.args[0])), rt.sv(f, "space")), rt.sv(f, "maxspace"))) {
			rt.modSrcVar(f, "space", rt.fv(f, "w_class", live(f.args[0])), add);
			if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＄！ is stuck to your hand, you cannot put it in the safe!</span>", [live(f.args[0])])]);
				return live(f.dot);
			}
			yield* g.callName(f, live(f.args[0]), "forceMove", [live(f.src)]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You put ＀ in ＀.</span>", [live(f.args[0]), live(f.src)])]);
			yield* g.srcCall(f, "updateUsrDialog");
			return live(f.dot);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀ won't fit in ＀.</span>", [live(f.args[0]), live(f.src)])]);
			return live(f.dot);
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/clothing/neck/stethoscope")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>Hold ＀ in one of your hands while you manipulate the dial!</span>", [live(f.args[0])])]);
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/structure/safe/proc/handle_atom_del  (code/game/objects/structures/safe.dm:176)  may sleep
rt.def("/obj/structure/safe/proc/handle_atom_del", function* handle_atom_del(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true);

rt.type(12869, "/obj/structure/safe/floor", "/obj/structure/safe", {
	level: 1,
	name: "floor safe",
	icon_state: "floorsafe",
	density: 0,
	layer: 2.5,
});

// /obj/structure/safe/floor/proc/Initialize  (code/game/objects/structures/safe.dm:195)
rt.def("/obj/structure/safe/floor/proc/Initialize", function Initialize(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.args[0]))) return f.dot;
	rt.callSrc(f, "hide", [rt.gv(f, "intact", (_T = rt.sv(f, "loc")))]);
	return f.dot;
}, false, { args: ["mapload"] });

// /obj/structure/safe/floor/proc/hide  (code/game/objects/structures/safe.dm:202)
rt.def("/obj/structure/safe/floor/proc/hide", function hide(f: Frame, intact: Value) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(live(intact))) {
		$0 = 100;
	} else {
		$0 = 0;
	}
	rt.setSv(f, "invisibility", $0);
	return f.dot;
});
