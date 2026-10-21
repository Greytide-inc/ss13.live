// From code/modules/paperwork/paperbin.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7621, "/obj/item/weapon/paper_bin", "/obj/item/weapon", {
	papertype: rt.typePath("/obj/item/weapon/paper"),
	total_paper: 30,
	papers: null,
	bin_pen: null,
	throw_speed: 3,
	throw_range: 7,
	pressure_resistance: 8,
	name: "paper bin",
	desc: "Contains all the paper you'll never need.",
	icon: rt.rsc("icons/obj/bureaucracy.dmi"),
	icon_state: "paper_bin1",
	item_state: "sheet-metal",
	throwforce: 0,
	w_class: 3,
});

// /obj/item/weapon/paper_bin/proc/<init>  (code/modules/paperwork/paperbin.dm:14)
rt.def("/obj/item/weapon/paper_bin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "papers", rt.list());
	return f.dot;
});

// /obj/item/weapon/paper_bin/proc/Initialize  (code/modules/paperwork/paperbin.dm:18)  may sleep
rt.def("/obj/item/weapon/paper_bin/proc/Initialize", function* Initialize(f: Frame) {
	let _P: Value = null;
	f.vars = () => [_P];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.args[0]))) {
		return live(f.dot);
	}
	if (!(truthy((_P = rt.locateIn(f, T("/obj/item/weapon/pen"), rt.fv(f, "loc", live(f.src))))) && !truthy(rt.sv(f, "bin_pen")))) return f.dot;
	rt.setFv(f, "loc", live(_P), live(f.src));
	rt.setSv(f, "bin_pen", live(_P));
	yield* g.srcCall(f, "update_icon");
	if (!(isEqual(rt.fv(f, "type", live(_P)), T("/obj/item/weapon/pen")) && !truthy(rt.gl("warned")))) return f.dot;
	yield* g.call(f, P("/proc/warning"), null, ["one or more paperbins ate a pen duing initialize()"]);
	rt.setGl("warned", 1);
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/item/weapon/paper_bin/proc/fire_act  (code/modules/paperwork/paperbin.dm:32)  may sleep
rt.def("/obj/item/weapon/paper_bin/proc/fire_act", function* fire_act(f: Frame) {
	if (!truthy(rt.sv(f, "total_paper"))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["exposed_temperature", "exposed_volume"] });

// /obj/item/weapon/paper_bin/proc/Destroy  (code/modules/paperwork/paperbin.dm:38)  may sleep
rt.def("/obj/item/weapon/paper_bin/proc/Destroy", function* Destroy(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	if (truthy(rt.sv(f, "papers"))) {
		i = null;
		rt.forList(f, 0, rt.sv(f, "papers"));
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			yield* g.call(f, P("/proc/qdel"), null, [live(i)]);
		}
		rt.endFor(f, 0);
		rt.setSv(f, "papers", null);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/item/weapon/paper_bin/proc/fire_act  (code/modules/paperwork/paperbin.dm:46)  may sleep
rt.def("/obj/item/weapon/paper_bin/proc/fire_act", function* fire_act(f: Frame) {
	if (truthy(rt.sv(f, "total_paper"))) {
		rt.setSv(f, "total_paper", 0);
		yield* g.srcCall(f, "update_icon");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["exposed_temperature", "exposed_volume"] });

// /obj/item/weapon/paper_bin/proc/MouseDrop  (code/modules/paperwork/paperbin.dm:50)  may sleep
rt.def("/obj/item/weapon/paper_bin/proc/MouseDrop", function* MouseDrop(f: Frame, over_object: Value) {
	let M: Value = null, H: Value = null;
	f.vars = () => [over_object, M, H];
	if (((!truthy((rt.istype((M = live(f.usr)), T("/mob/living")) ? 1 : 0)) || truthy((yield* g.callName(f, live(M), "incapacitated", [])))) || !truthy((yield* g.srcCall(f, "Adjacent", live(M)))))) {
		return live(f.dot);
	}
	if (isEqual(live(over_object), live(M))) {
		yield* g.callName(f, live(M), "put_in_hands", [live(f.src)]);
	} else {
		if (truthy((rt.istype(live(over_object), T("/obj/screen/inventory/hand")) ? 1 : 0))) {
			H = live(over_object);
			yield* g.callName(f, live(M), "putItemFromInventoryInHandIfPossible", [live(f.src), rt.fv(f, "held_index", live(H))]);
		}
	}
	yield* g.srcCall(f, "add_fingerprint", live(M));
	return f.dot;
}, true);

// /obj/item/weapon/paper_bin/proc/attack_paw  (code/modules/paperwork/paperbin.dm:65)  may sleep
rt.def("/obj/item/weapon/paper_bin/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /obj/item/weapon/paper_bin/proc/attack_hand  (code/modules/paperwork/paperbin.dm:69)  may sleep
rt.def("/obj/item/weapon/paper_bin/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let _P: Value = null;
	f.vars = () => [user, _P];
	if (truthy(rt.fv(f, "lying", live(user)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "changeNext_move", [8]);
	if (truthy(rt.sv(f, "bin_pen"))) {
		rt.setFv(f, "loc", (_P = rt.sv(f, "bin_pen")), rt.fv(f, "loc", live(user)));
		yield* g.callName(f, live(user), "put_in_hands", [live(_P)]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You take ＀ out of ％！.</span>", [live(_P), live(f.src)])]);
		rt.setSv(f, "bin_pen", null);
		yield* g.srcCall(f, "update_icon");
	} else {
		if (rt.ge(rt.sv(f, "total_paper"), 1)) {
			rt.incSrcVar(f, "total_paper", -1, true);
			yield* g.srcCall(f, "update_icon");
			_P = null;
			if (rt.gt(rt.len(f, rt.sv(f, "papers")), 0)) {
				_P = rt.index(rt.sv(f, "papers"), rt.len(f, rt.sv(f, "papers")));
				yield* g.callName(f, rt.sv(f, "papers"), "Remove", [live(_P)]);
			} else {
				_P = (yield* g.new_(f, rt.sv(f, "papertype"), [live(f.src)]));
				if ((truthy(rt.fv(f, "holidays", rt.gl("SSevents"))) && truthy(rt.index(rt.fv(f, "holidays", rt.gl("SSevents")), "April Fool's Day")))) {
					if (truthy(rt.op(f, "Prob", [], [30]))) {
						rt.setFv(f, "info", live(_P), fmt("<font face=\"＀\" color=\"red\"><b>HONK HONK HONK HONK HONK HONK HONK<br>HOOOOOOOOOOOOOOOOOOOOOONK<br>APRIL FOOLS</b></font>", ["Comic Sans MS"]));
						rt.setFv(f, "rigged", live(_P), 1);
						yield* g.callName(f, live(_P), "updateinfolinks", []);
					}
				}
			}
			rt.setFv(f, "loc", live(_P), rt.fv(f, "loc", live(user)));
			yield* g.callName(f, live(user), "put_in_hands", [live(_P)]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You take ＀ out of ％！.</span>", [live(_P), live(f.src)])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is empty!</span>", [live(f.src)])]);
		}
	}
	yield* g.srcCall(f, "add_fingerprint", live(user));
	return f.dot;
}, true);

// /obj/item/weapon/paper_bin/proc/attackby  (code/modules/paperwork/paperbin.dm:105)  may sleep
rt.def("/obj/item/weapon/paper_bin/proc/attackby", function* attackby(f: Frame) {
	let _P: Value = null;
	f.vars = () => [_P];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/paper")) ? 1 : 0))) {
		_P = live(f.args[0]);
		if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(_P), live(f.src)])))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You put ＀ in ＀.</span>", [live(_P), live(f.src)])]);
		yield* g.callName(f, rt.sv(f, "papers"), "Add", [live(_P)]);
		rt.incSrcVar(f, "total_paper", 1, true);
		yield* g.srcCall(f, "update_icon");
	} else {
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pen")) ? 1 : 0)) && !truthy(rt.sv(f, "bin_pen")))) {
			_P = live(f.args[0]);
			if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(_P), live(f.src)])))) {
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You put ＀ in ＀.</span>", [live(_P), live(f.src)])]);
			rt.setSv(f, "bin_pen", live(_P));
			yield* g.srcCall(f, "update_icon");
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/item/weapon/paper_bin/proc/examine  (code/modules/paperwork/paperbin.dm:124)
rt.def("/obj/item/weapon/paper_bin/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "total_paper"))) {
		$0 = live(f.args[0]);
		$1 = "It contains ";
		if (rt.gt(rt.sv(f, "total_paper"), 1)) {
			$2 = fmt("＀ papers", [rt.sv(f, "total_paper")]);
		} else {
			$2 = " one paper";
		}
		rt.call(f, P("/proc/to_chat"), null, [$0, add(add($1, $2), ".")]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "It doesn't contain anything."]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/paper_bin/proc/update_icon  (code/modules/paperwork/paperbin.dm:132)
rt.def("/obj/item/weapon/paper_bin/proc/update_icon", function update_icon(f: Frame) {
	if (rt.lt(rt.sv(f, "total_paper"), 1)) {
		rt.setSv(f, "icon_state", "paper_bin0");
	} else {
		rt.setSv(f, "icon_state", fmt("＀", [rt.initial(f, live(f.src), "icon_state")]));
	}
	rt.callSrc(f, "cut_overlays", []);
	if (!truthy(rt.sv(f, "bin_pen"))) return f.dot;
	rt.callSrc(f, "add_overlay", [rt.call(f, P("/proc/mutable_appearance"), null, [rt.fv(f, "icon", rt.sv(f, "bin_pen")), rt.fv(f, "icon_state", rt.sv(f, "bin_pen"))])]);
	return f.dot;
});

rt.type(7623, "/obj/item/weapon/paper_bin/bundlenatural", "/obj/item/weapon/paper_bin", {
	papertype: rt.typePath("/obj/item/weapon/paper/natural"),
	name: "natural paper bundle",
	desc: "A bundle of paper created using traditional methods.",
	icon_state: "paper_bundle",
	resistance_flags: 4,
});

// /obj/item/weapon/paper_bin/bundlenatural/proc/attack_hand  (code/modules/paperwork/paperbin.dm:153)  may sleep
rt.def("/obj/item/weapon/paper_bin/bundlenatural/proc/attack_hand", function* attack_hand(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!rt.lt(rt.sv(f, "total_paper"), 1)) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/paper_bin/bundlenatural/proc/fire_act  (code/modules/paperwork/paperbin.dm:157)  may sleep
rt.def("/obj/item/weapon/paper_bin/bundlenatural/proc/fire_act", function* fire_act(f: Frame, exposed_temperature: Value, exposed_volume: Value) {
	f.vars = () => [exposed_temperature, exposed_volume];
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/paper_bin/bundlenatural/proc/attackby  (code/modules/paperwork/paperbin.dm:159)  may sleep
rt.def("/obj/item/weapon/paper_bin/bundlenatural/proc/attackby", function* attackby(f: Frame) {
	let _T: Value = null, _P: Value = null;
	f.vars = () => [_T, _P];
	if (truthy((yield* g.callName(f, live(f.args[0]), "is_sharp", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You snip ％！, spilling paper everywhere.</span>", [live(f.src)])]);
		_T = rt.getStep(f, rt.fv(f, "loc", live(f.src)), 0);
		while (rt.gt(rt.sv(f, "total_paper"), 0)) {
			rt.incSrcVar(f, "total_paper", -1, true);
			_P = null;
			if (rt.gt(rt.len(f, rt.sv(f, "papers")), 0)) {
				(rt.modSrcVar(f, "papers", (_P = rt.index(rt.sv(f, "papers"), rt.len(f, rt.sv(f, "papers")))), subtract));
			} else {
				yield* g.callName(f, (_P = (yield* g.new_(f, rt.sv(f, "papertype"), []))), "forceMove", [live(_T)]);
			}
			if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
				yield* g.call(f, P("/proc/stoplag"), null, []);
			}
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["W", "user"] });
