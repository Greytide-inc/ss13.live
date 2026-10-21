// From code/modules/power/generator.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10312, "/obj/machinery/power/generator", "/obj/machinery/power", {
	cold_circ: null,
	hot_circ: null,
	cold_dir: 8,
	hot_dir: 4,
	lastgen: 0,
	lastgenlev: -1,
	lastcirc: "00",
	anchored: 1,
	name: "thermoelectric generator",
	desc: "It's a high efficiency thermoelectric generator.",
	icon_state: "teg",
	density: 1,
	use_power: 0,
});

// /obj/machinery/power/generator/proc/Initialize  (code/modules/power/generator.dm:31)  may sleep
rt.def("/obj/machinery/power/generator/proc/Initialize", function* Initialize(f: Frame) {
	let circpath: Value = null;
	let $0: any;
	f.vars = () => [circpath, $0];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "cold_circ", rt.locateIn(f, (circpath = T("/obj/machinery/atmospherics/components/binary/circulator")), rt.getStep(f, live(f.src), rt.sv(f, "cold_dir"))));
	rt.setSv(f, "hot_circ", rt.locateIn(f, live(circpath), rt.getStep(f, live(f.src), rt.sv(f, "hot_dir"))));
	yield* g.srcCall(f, "connect_to_network");
	rt.modField(f, rt.gl("SSair"), "atmos_machinery", live(f.src), add);
	if (truthy(rt.sv(f, "cold_circ"))) {
		$0 = rt.sv(f, "cold_dir");
		if ($0 === 4) {
			rt.setFv(f, "side", rt.sv(f, "cold_circ"), 2);
		} else if ($0 === 8) {
			rt.setFv(f, "side", rt.sv(f, "cold_circ"), 1);
		}
		yield* g.callName(f, rt.sv(f, "cold_circ"), "update_icon", []);
	}
	if (truthy(rt.sv(f, "hot_circ"))) {
		$0 = rt.sv(f, "hot_dir");
		if ($0 === 4) {
			rt.setFv(f, "side", rt.sv(f, "hot_circ"), 2);
		} else if ($0 === 8) {
			rt.setFv(f, "side", rt.sv(f, "hot_circ"), 1);
		}
		yield* g.callName(f, rt.sv(f, "hot_circ"), "update_icon", []);
	}
	if ((!truthy(rt.sv(f, "cold_circ")) || !truthy(rt.sv(f, "hot_circ")))) {
		(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/machinery/power/generator/proc/Destroy  (code/modules/power/generator.dm:60)  may sleep
rt.def("/obj/machinery/power/generator/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modField(f, rt.gl("SSair"), "atmos_machinery", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/power/generator/proc/update_icon  (code/modules/power/generator.dm:65)
rt.def("/obj/machinery/power/generator/proc/update_icon", function update_icon(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		rt.callSrc(f, "cut_overlays", []);
	} else {
		rt.callSrc(f, "cut_overlays", []);
		if (!isEqual((L = rt.call(f, P("/proc/min"), null, [rt.call(f, P("/proc/round"), null, [divide(rt.sv(f, "lastgenlev"), 100000)]), 11])), 0)) {
			rt.callSrc(f, "add_overlay", [rt.call(f, P("/proc/image"), null, [rt.rsc("icons/obj/power.dmi"), fmt("teg-op＀", [live(L)])])]);
		}
		rt.callSrc(f, "add_overlay", [fmt("teg-oc＀", [rt.sv(f, "lastcirc")])]);
	}
	return f.dot;
});

// /obj/machinery/power/generator/proc/process_atmos  (code/modules/power/generator.dm:81)  may sleep
rt.def("/obj/machinery/power/generator/proc/process_atmos", function* process_atmos(f: Frame) {
	let cold_air: Value = null, hot_air: Value = null, cold_air_heat_capacity: Value = null, hot_air_heat_capacity: Value = null, delta_temperature: Value = null, efficiency: Value = null, energy_transfer: Value = null, heat: Value = null, hot_circ_air1: Value = null, cold_circ_air1: Value = null, circ: Value = null;
	let $0: any, $1: any;
	f.vars = () => [cold_air, hot_air, cold_air_heat_capacity, hot_air_heat_capacity, delta_temperature, efficiency, energy_transfer, heat, hot_circ_air1, cold_circ_air1, circ, $0, $1];
	if ((!truthy(rt.sv(f, "cold_circ")) || !truthy(rt.sv(f, "hot_circ")))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "powernet"))) {
		cold_air = (yield* g.callName(f, rt.sv(f, "cold_circ"), "return_transfer_air", []));
		hot_air = (yield* g.callName(f, rt.sv(f, "hot_circ"), "return_transfer_air", []));
		if ((truthy(live(cold_air)) && truthy(live(hot_air)))) {
			cold_air_heat_capacity = (yield* g.callName(f, live(cold_air), "heat_capacity", []));
			hot_air_heat_capacity = (yield* g.callName(f, live(hot_air), "heat_capacity", []));
			if (((rt.gt((delta_temperature = subtract(rt.fv(f, "temperature", live(hot_air)), rt.fv(f, "temperature", live(cold_air)))), 0) && rt.gt(live(cold_air_heat_capacity), 0)) && rt.gt(live(hot_air_heat_capacity), 0))) {
				efficiency = 0.6499999761581421;
				energy_transfer = divide(multiply(multiply(live(delta_temperature), live(hot_air_heat_capacity)), live(cold_air_heat_capacity)), add(live(hot_air_heat_capacity), live(cold_air_heat_capacity)));
				heat = multiply(live(energy_transfer), subtract(1, live(efficiency)));
				rt.modSrcVar(f, "lastgen", multiply(live(energy_transfer), live(efficiency)), add);
				rt.setFv(f, "temperature", live(hot_air), subtract(rt.fv(f, "temperature", live(hot_air)), divide(live(energy_transfer), live(hot_air_heat_capacity))));
				rt.setFv(f, "temperature", live(cold_air), add(rt.fv(f, "temperature", live(cold_air)), divide(live(heat), live(cold_air_heat_capacity))));
			}
		}
		if (truthy(live(hot_air))) {
			yield* g.callName(f, (hot_circ_air1 = rt.index(rt.fv(f, "airs", rt.sv(f, "hot_circ")), 1)), "merge", [live(hot_air)]);
		}
		if (truthy(live(cold_air))) {
			yield* g.callName(f, (cold_circ_air1 = rt.index(rt.fv(f, "airs", rt.sv(f, "cold_circ")), 1)), "merge", [live(cold_air)]);
		}
		yield* g.srcCall(f, "update_icon");
	}
	if ((truthy(rt.sv(f, "cold_circ")) && rt.gt(rt.fv(f, "last_pressure_delta", rt.sv(f, "cold_circ")), 0))) {
		$0 = "1";
	} else {
		$0 = "0";
	}
	if ((truthy(rt.sv(f, "hot_circ")) && rt.gt(rt.fv(f, "last_pressure_delta", rt.sv(f, "hot_circ")), 0))) {
		$1 = "1";
	} else {
		$1 = "0";
	}
	if (!isEqual((circ = fmt("＀＀", [$0, $1])), rt.sv(f, "lastcirc"))) {
		rt.setSv(f, "lastcirc", live(circ));
		yield* g.srcCall(f, "update_icon");
	}
	yield* g.callName(f, live(f.src), "updateDialog", []);
	return f.dot;
}, true);

// /obj/machinery/power/generator/proc/process  (code/modules/power/generator.dm:141)
rt.def("/obj/machinery/power/generator/proc/process", function process(f: Frame) {
	let power_output: Value = null;
	f.vars = () => [power_output];
	rt.callSrc(f, "add_avail", [(power_output = rt.call(f, P("/proc/round"), null, [divide(rt.sv(f, "lastgen"), 10)]))]);
	rt.setSv(f, "lastgenlev", live(power_output));
	(rt.modSrcVar(f, "lastgen", live(power_output), subtract));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { waitfor: false });

// /obj/machinery/power/generator/proc/attack_hand  (code/modules/power/generator.dm:148)  may sleep
rt.def("/obj/machinery/power/generator/proc/attack_hand", function* attack_hand(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		rt.op(f, "Browse", [], [live(f.args[0]), null, "window=teg"], false);
		return live(f.dot);
	}
	yield* g.srcCall(f, "interact", live(f.args[0]));
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/power/generator/proc/get_menu  (code/modules/power/generator.dm:154)
rt.def("/obj/machinery/power/generator/proc/get_menu", function get_menu(f: Frame, include_link: Value) {
	let t: Value = null, cold_circ_air1: Value = null, cold_circ_air2: Value = null, hot_circ_air1: Value = null, hot_circ_air2: Value = null, displaygen: Value = null;
	f.vars = () => [include_link, t, cold_circ_air1, cold_circ_air2, hot_circ_air1, hot_circ_air2, displaygen];
	if (live(include_link) === null) {
		include_link = 1;
	}
	t = "";
	if (!truthy(rt.sv(f, "powernet"))) {
		t = rt.modify(live(t), "<span class='bad'>Unable to connect to the power network!</span>", add);
	} else {
		if ((truthy(rt.sv(f, "cold_circ")) && truthy(rt.sv(f, "hot_circ")))) {
			cold_circ_air1 = rt.index(rt.fv(f, "airs", rt.sv(f, "cold_circ")), 1);
			cold_circ_air2 = rt.index(rt.fv(f, "airs", rt.sv(f, "cold_circ")), 2);
			hot_circ_air1 = rt.index(rt.fv(f, "airs", rt.sv(f, "hot_circ")), 1);
			hot_circ_air2 = rt.index(rt.fv(f, "airs", rt.sv(f, "hot_circ")), 2);
			t = rt.modify(live(t), "<div class='statusDisplay'>", add);
			if (rt.lt((displaygen = rt.sv(f, "lastgenlev")), 1000000)) {
				(displaygen = rt.modify(live(displaygen), 1000, divide));
				t = rt.modify(live(t), fmt("Output: ＀ kW", [rt.call(f, P("/proc/round"), null, [live(displaygen), 0.009999999776482582])]), add);
			} else {
				(displaygen = rt.modify(live(displaygen), 1000000, divide));
				t = rt.modify(live(t), fmt("Output: ＀ MW", [rt.call(f, P("/proc/round"), null, [live(displaygen), 0.009999999776482582])]), add);
			}
			t = rt.modify(live(t), "<BR>", add);
			t = rt.modify(live(t), "<B><font color='blue'>Cold loop</font></B><BR>", add);
			t = rt.modify(live(t), fmt("Temperature Inlet: ＀ K / Outlet: ＀ K<BR>", [rt.call(f, P("/proc/round"), null, [rt.fv(f, "temperature", live(cold_circ_air2)), 0.10000000149011612]), rt.call(f, P("/proc/round"), null, [rt.fv(f, "temperature", live(cold_circ_air1)), 0.10000000149011612])]), add);
			t = rt.modify(live(t), fmt("Pressure Inlet: ＀ kPa /  Outlet: ＀ kPa<BR>", [rt.call(f, P("/proc/round"), null, [rt.callName(f, live(cold_circ_air2), "return_pressure", []), 0.10000000149011612]), rt.call(f, P("/proc/round"), null, [rt.callName(f, live(cold_circ_air1), "return_pressure", []), 0.10000000149011612])]), add);
			t = rt.modify(live(t), "<B><font color='red'>Hot loop</font></B><BR>", add);
			t = rt.modify(live(t), fmt("Temperature Inlet: ＀ K / Outlet: ＀ K<BR>", [rt.call(f, P("/proc/round"), null, [rt.fv(f, "temperature", live(hot_circ_air2)), 0.10000000149011612]), rt.call(f, P("/proc/round"), null, [rt.fv(f, "temperature", live(hot_circ_air1)), 0.10000000149011612])]), add);
			t = rt.modify(live(t), fmt("Pressure Inlet: ＀ kPa / Outlet: ＀ kPa<BR>", [rt.call(f, P("/proc/round"), null, [rt.callName(f, live(hot_circ_air2), "return_pressure", []), 0.10000000149011612]), rt.call(f, P("/proc/round"), null, [rt.callName(f, live(hot_circ_air1), "return_pressure", []), 0.10000000149011612])]), add);
			t = rt.modify(live(t), "</div>", add);
		} else {
			t = rt.modify(live(t), "<span class='bad'>Unable to locate all parts!</span>", add);
		}
	}
	if (truthy(live(include_link))) {
		t = rt.modify(live(t), fmt("<BR><A href='?src=＃;close=1'>Close</A>", [live(f.src)]), add);
	}
	return live(t);
});

// /obj/machinery/power/generator/proc/interact  (code/modules/power/generator.dm:193)  may sleep
rt.def("/obj/machinery/power/generator/proc/interact", function* interact(f: Frame, user: Value) {
	let popup: Value = null;
	f.vars = () => [user, popup];
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "teg", "Thermo-Electric Generator", 460, 300]))), "set_content", [(yield* g.srcCall(f, "get_menu"))]);
	yield* g.callName(f, live(popup), "set_title_image", [(yield* g.callName(f, live(user), "browse_rsc_icon", [rt.fv(f, "icon", live(f.src)), rt.fv(f, "icon_state", live(f.src))]))]);
	yield* g.callName(f, live(popup), "open", []);
	return 1;
}, true);

// /obj/machinery/power/generator/proc/Topic  (code/modules/power/generator.dm:202)  may sleep
rt.def("/obj/machinery/power/generator/proc/Topic", function* Topic(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "close"))) {
		rt.op(f, "Browse", [], [live(f.usr), null, "window=teg"], false);
		yield* g.callName(f, live(f.usr), "unset_machine", []);
		return 0;
	}
	return 1;
}, true, { args: ["href", "href_list"] });

// /obj/machinery/power/generator/proc/power_change  (code/modules/power/generator.dm:212)
rt.def("/obj/machinery/power/generator/proc/power_change", function power_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});
