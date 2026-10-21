// From code/game/machinery/robot_fabricator.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10818, "/obj/machinery/robotic_fabricator", "/obj/machinery", {
	metal_amount: 0,
	operating: 0,
	being_built: null,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 20,
	active_power_usage: 5000,
	name: "robotic fabricator",
	icon: rt.rsc("icons/obj/robotics.dmi"),
	icon_state: "fab-idle",
	density: 1,
});

// /obj/machinery/robotic_fabricator/proc/attackby  (code/game/machinery/robot_fabricator.dm:15)  may sleep
rt.def("/obj/machinery/robotic_fabricator/proc/attackby", function* attackby(f: Frame) {
	let count: Value = null;
	f.vars = () => [count];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/metal")) ? 1 : 0))) {
		if (rt.lt(rt.fv(f, "metal_amount", live(f.src)), 150000)) {
			count = 0;
			yield* g.callName(f, live(f.src), "add_overlay", ["fab-load-metal"]);
			rt.spawnTail(f, 15, "/obj/machinery/robotic_fabricator/proc/attackby: spawn at game/machinery/robot_fabricator.dm:19", count);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("＄！ is full.", [live(f.src)])]);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// a spawn(15) body of /obj/machinery/robotic_fabricator/proc/attackby, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/robotic_fabricator/proc/attackby: spawn at game/machinery/robot_fabricator.dm:19", function* (f: Frame, count: Value) {
	f.vars = () => [count];
	if (truthy(live(f.args[0]))) {
		if (!truthy(rt.fv(f, "amount", live(f.args[0])))) {
			return live(f.dot);
		}
		while (rt.lt(rt.sv(f, "metal_amount"), 150000) && truthy(rt.fv(f, "amount", live(f.args[0])))) {
			rt.modField(f, live(f.src), "metal_amount", rt.index(rt.fv(f, "materials", live(f.args[0])), "$metal"), add);
			rt.incField(f, live(f.args[0]), "amount", -1, true);
			count = rt.inc(live(count), 1);
		}
		if (rt.lt(rt.fv(f, "amount", live(f.args[0])), 1)) {
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You insert ＀ metal sheet５ into ％！.</span>", [live(count), live(f.src)])]);
		yield* g.srcCall(f, "cut_overlay", "fab-load-metal");
		yield* g.srcCall(f, "updateDialog");
	}
	return null;
});

// /obj/machinery/robotic_fabricator/proc/power_change  (code/game/machinery/robot_fabricator.dm:40)
rt.def("/obj/machinery/robotic_fabricator/proc/power_change", function power_change(f: Frame) {
	if (truthy(rt.callSrc(f, "powered", []))) {
		(rt.modSrcVar(f, "stat", 16777213, rt.bitAnd));
	} else {
		(rt.modSrcVar(f, "stat", 2, rt.bitOr));
	}
	return f.dot;
});

// /obj/machinery/robotic_fabricator/proc/attack_paw  (code/game/machinery/robot_fabricator.dm:46)  may sleep
rt.def("/obj/machinery/robotic_fabricator/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.callName(f, live(f.src), "attack_hand", [live(user)]));
}, true);

// /obj/machinery/robotic_fabricator/proc/attack_hand  (code/game/machinery/robot_fabricator.dm:50)  may sleep
rt.def("/obj/machinery/robotic_fabricator/proc/attack_hand", function* attack_hand(f: Frame) {
	let dat: Value = null;
	f.vars = () => [dat];
	dat = null;
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "operating", live(f.src)))) {
		dat = fmt("\n<TT>Building ＀.<BR>\nPlease wait until completion...</TT><BR>\n<BR>\n", [rt.gv(f, "name", rt.fv(f, "being_built", live(f.src)))]);
	} else {
		dat = fmt("\n<B>Metal Amount:</B> ＀ cm<sup>3</sup> (MAX: 150,000)<BR><HR>\n<BR>\n<A href='?src=＃;make=1'>Left Arm (25,000 cc metal.)<BR>\n<A href='?src=＃;make=2'>Right Arm (25,000 cc metal.)<BR>\n<A href='?src=＃;make=3'>Left Leg (25,000 cc metal.)<BR>\n<A href='?src=＃;make=4'>Right Leg (25,000 cc metal).<BR>\n<A href='?src=＃;make=5'>Chest (50,000 cc metal).<BR>\n<A href='?src=＃;make=6'>Head (50,000 cc metal).<BR>\n<A href='?src=＃;make=7'>Robot Frame (75,000 cc metal).<BR>\n", [(yield* g.call(f, P("/proc/min"), null, [150000, rt.fv(f, "metal_amount", live(f.src))])), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src)]);
	}
	rt.op(f, "Browse", [], [live(f.args[0]), fmt("<HEAD><TITLE>Robotic Fabricator Control Panel</TITLE></HEAD><TT>＀</TT>", [live(dat)]), "window=robot_fabricator"], false);
	yield* g.call(f, P("/proc/onclose"), null, [live(f.args[0]), "robot_fabricator"]);
	return live(f.dot);
}, true, { args: ["user"] });

// /obj/machinery/robotic_fabricator/proc/Topic  (code/game/machinery/robot_fabricator.dm:77)  may sleep
rt.def("/obj/machinery/robotic_fabricator/proc/Topic", function* Topic(f: Frame) {
	let part_type: Value = null, build_type: Value = null, build_time: Value = null, build_cost: Value = null, building: Value = null;
	let $0: any;
	f.vars = () => [part_type, build_type, build_time, build_cost, building, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(f.usr)]);
	if (truthy(rt.at(live(f.args[1]), "make"))) {
		if (!truthy(rt.fv(f, "operating", live(f.src)))) {
			part_type = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "make")]));
			build_type = "";
			build_time = 200;
			build_cost = 25000;
			$0 = live(part_type);
			if ($0 === 1) {
				build_type = "/obj/item/bodypart/l_arm/robot";
				build_time = 200;
				build_cost = 10000;
			} else if ($0 === 2) {
				build_type = "/obj/item/bodypart/r_arm/robot";
				build_time = 200;
				build_cost = 10000;
			} else if ($0 === 3) {
				build_type = "/obj/item/bodypart/l_leg/robot";
				build_time = 200;
				build_cost = 10000;
			} else if ($0 === 4) {
				build_type = "/obj/item/bodypart/r_leg/robot";
				build_time = 200;
				build_cost = 10000;
			} else if ($0 === 5) {
				build_type = "/obj/item/bodypart/chest/robot";
				build_time = 350;
				build_cost = 40000;
			} else if ($0 === 6) {
				build_type = "/obj/item/bodypart/head/robot";
				build_time = 350;
				build_cost = 5000;
			} else if ($0 === 7) {
				build_type = "/obj/item/robot_suit";
				build_time = 600;
				build_cost = 15000;
			}
			if ((building = (yield* g.call(f, P("/proc/text2path"), null, [live(build_type)]))) !== null) {
				if (rt.ge(rt.fv(f, "metal_amount", live(f.src)), live(build_cost))) {
					rt.setFv(f, "operating", live(f.src), 1);
					rt.setFv(f, "use_power", live(f.src), 2);
					rt.setFv(f, "metal_amount", live(f.src), (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.fv(f, "metal_amount", live(f.src)), live(build_cost))])));
					rt.setFv(f, "being_built", live(f.src), (yield* g.new_(f, live(building), [live(f.src)])));
					yield* g.callName(f, live(f.src), "add_overlay", ["fab-active"]);
					yield* g.callName(f, live(f.src), "updateUsrDialog", []);
					rt.spawnTail(f, live(build_time), "/obj/machinery/robotic_fabricator/proc/Topic: spawn at game/machinery/robot_fabricator.dm:140", part_type, build_type, build_time, build_cost, building);
				}
			}
		}
		return live(f.dot);
	}
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true, { args: ["href", "href_list"] });

// a spawn(live(build_time)) body of /obj/machinery/robotic_fabricator/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/robotic_fabricator/proc/Topic: spawn at game/machinery/robot_fabricator.dm:140", function* (f: Frame, part_type: Value, build_type: Value, build_time: Value, build_cost: Value, building: Value) {
	f.vars = () => [part_type, build_type, build_time, build_cost, building];
	if (rt.fv(f, "being_built", live(f.src)) !== null) {
		rt.setFv(f, "loc", rt.fv(f, "being_built", live(f.src)), rt.getStep(f, live(f.src), 0));
		rt.setFv(f, "being_built", live(f.src), null);
	}
	rt.setFv(f, "use_power", live(f.src), 1);
	rt.setFv(f, "operating", live(f.src), 0);
	yield* g.srcCall(f, "cut_overlay", "fab-active");
	return null;
});
