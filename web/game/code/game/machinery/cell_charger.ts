// From code/game/machinery/cell_charger.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10784, "/obj/machinery/cell_charger", "/obj/machinery", {
	charging: null,
	chargelevel: -1,
	anchored: 1,
	name: "cell charger",
	desc: "It charges power cells.",
	icon: rt.rsc("icons/obj/power.dmi"),
	icon_state: "ccharger0",
	use_power: 1,
	idle_power_usage: 5,
	active_power_usage: 60,
	power_channel: 1,
});

// /obj/machinery/cell_charger/proc/updateicon  (code/game/machinery/cell_charger.dm:15)
rt.def("/obj/machinery/cell_charger/proc/updateicon", function updateicon(f: Frame) {
	let newlevel: Value = null;
	let $0: any;
	f.vars = () => [newlevel, $0];
	if (truthy(rt.sv(f, "charging"))) {
		$0 = 1;
	} else {
		$0 = 0;
	}
	rt.setSv(f, "icon_state", fmt("ccharger＀", [$0]));
	if ((truthy(rt.sv(f, "charging")) && !truthy(rt.bitAnd(rt.sv(f, "stat"), 3)))) {
		newlevel = rt.call(f, P("/proc/round"), null, [divide(multiply(rt.callName(f, rt.sv(f, "charging"), "percent", []), 4), 100)]);
		if (!isEqual(rt.sv(f, "chargelevel"), live(newlevel))) {
			rt.setSv(f, "chargelevel", live(newlevel));
			rt.callSrc(f, "cut_overlays", []);
			rt.callSrc(f, "add_overlay", [fmt("ccharger-o＀", [live(newlevel)])]);
		}
	} else {
		rt.callSrc(f, "cut_overlays", []);
	}
	return f.dot;
});

// /obj/machinery/cell_charger/proc/examine  (code/game/machinery/cell_charger.dm:30)
rt.def("/obj/machinery/cell_charger/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = live(f.args[0]);
	if (truthy(rt.sv(f, "charging"))) {
		$1 = "a";
	} else {
		$1 = "no";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("There's ＀ cell in the charger.", [$1])]);
	if (!truthy(rt.sv(f, "charging"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("Current charge: ＀%", [rt.call(f, P("/proc/round"), null, [rt.callName(f, rt.sv(f, "charging"), "percent", []), 1])])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/machinery/cell_charger/proc/attackby  (code/game/machinery/cell_charger.dm:36)  may sleep
rt.def("/obj/machinery/cell_charger/proc/attackby", function* attackby(f: Frame) {
	let a: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [a, $0, $1, $2];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/stock_parts/cell")) ? 1 : 0))) {
		if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ is broken!</span>", [live(f.src)])]);
			return live(f.dot);
		}
		if (!truthy(rt.sv(f, "anchored"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ isn't attached to the ground!</span>", [live(f.src)])]);
			return live(f.dot);
		}
		if (truthy(rt.sv(f, "charging"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There is already a cell in the charger!</span>"]);
			return live(f.dot);
		} else {
			if (!truthy((yield* g.call(f, P("/proc/isarea"), null, [(a = rt.fv(f, "loc", rt.sv(f, "loc")))])))) {
				return live(f.dot);
			}
			if (isEqual(rt.fv(f, "power_equip", live(a)), 0)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>The ＀ blinks red as you try to insert the cell!</span>", [rt.sv(f, "name")])]);
				return live(f.dot);
			}
			if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
				return live(f.dot);
			}
			rt.setFv(f, "loc", live(f.args[0]), live(f.src));
			rt.setSv(f, "charging", live(f.args[0]));
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ inserts a cell into the charger.", [live(f.args[1])]), "<span class='notice'>You insert a cell into the charger.</span>"]);
			rt.setSv(f, "chargelevel", -1);
			yield* g.srcCall(f, "updateicon");
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
			if (truthy(rt.sv(f, "charging"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Remove the cell first!</span>"]);
				return live(f.dot);
			}
			rt.setSv(f, "anchored", (!truthy(rt.sv(f, "anchored")) ? 1 : 0));
			$0 = live(f.args[1]);
			if (truthy(rt.sv(f, "anchored"))) {
				$1 = "attach";
			} else {
				$1 = "detach";
			}
			if (truthy(rt.sv(f, "anchored"))) {
				$2 = "to";
			} else {
				$2 = "from";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀ the cell charger ＀ the ground</span>", [$1, $2])]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 75, 1]);
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/cell_charger/proc/removecell  (code/game/machinery/cell_charger.dm:74)
rt.def("/obj/machinery/cell_charger/proc/removecell", function removecell(f: Frame) {
	rt.callName(f, rt.sv(f, "charging"), "update_icon", []);
	rt.setSv(f, "charging", null);
	rt.setSv(f, "chargelevel", -1);
	rt.callSrc(f, "updateicon", []);
	return f.dot;
});

// /obj/machinery/cell_charger/proc/attack_hand  (code/game/machinery/cell_charger.dm:80)  may sleep
rt.def("/obj/machinery/cell_charger/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy(rt.sv(f, "charging"))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "put_in_hands", [rt.sv(f, "charging")]);
	yield* g.callName(f, rt.sv(f, "charging"), "add_fingerprint", [live(user)]);
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ removes the cell from the charger.", [live(user)]), "<span class='notice'>You remove the cell from the charger.</span>"]);
	yield* g.srcCall(f, "removecell");
	return f.dot;
}, true);

// /obj/machinery/cell_charger/proc/attack_tk  (code/game/machinery/cell_charger.dm:91)  may sleep
rt.def("/obj/machinery/cell_charger/proc/attack_tk", function* attack_tk(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy(rt.sv(f, "charging"))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "charging"), "forceMove", [rt.sv(f, "loc")]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You telekinetically remove ＀ from ＀.</span>", [rt.sv(f, "charging"), live(f.src)])]);
	yield* g.srcCall(f, "removecell");
	return f.dot;
}, true);

// /obj/machinery/cell_charger/proc/emp_act  (code/game/machinery/cell_charger.dm:103)  may sleep
rt.def("/obj/machinery/cell_charger/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "charging"))) {
		yield* g.callName(f, rt.sv(f, "charging"), "emp_act", [live(severity)]);
	}
	yield* g.callSuper(f, [live(severity)]);
	return f.dot;
}, true);

// /obj/machinery/cell_charger/proc/process  (code/game/machinery/cell_charger.dm:113)  may sleep
rt.def("/obj/machinery/cell_charger/proc/process", function* process(f: Frame) {
	if (((!truthy(rt.sv(f, "charging")) || !truthy(rt.sv(f, "anchored"))) || truthy(rt.bitAnd(rt.sv(f, "stat"), 3)))) {
		return live(f.dot);
	}
	if (rt.ge((yield* g.callName(f, rt.sv(f, "charging"), "percent", [])), 100)) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "use_power", 200);
	yield* g.callName(f, rt.sv(f, "charging"), "give", [175]);
	yield* g.srcCall(f, "updateicon");
	return f.dot;
}, true, { waitfor: false });
