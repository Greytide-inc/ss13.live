// From code/modules/atmospherics/machinery/portable/portable_atmospherics.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10688, "/obj/machinery/portable_atmospherics", "/obj/machinery", {
	air_contents: null,
	connected_port: null,
	holding: null,
	volume: 0,
	maximum_pressure: 9119.25,
	name: "portable_atmospherics",
	icon: rt.rsc("icons/obj/atmos.dmi"),
	use_power: 0,
	obj_integrity: 250,
	max_integrity: 250,
	armor: null,
});

// /obj/machinery/portable_atmospherics/proc/<init>  (code/modules/atmospherics/machinery/portable/portable_atmospherics.dm:7)
rt.def("/obj/machinery/portable_atmospherics/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 100, "bomb", 0, "bio", 100, "rad", 100, "fire", 60, "acid", 30]));
	return f.dot;
});

// /obj/machinery/portable_atmospherics/proc/New  (code/modules/atmospherics/machinery/portable/portable_atmospherics.dm:19)  may sleep
rt.def("/obj/machinery/portable_atmospherics/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modField(f, rt.gl("SSair"), "atmos_machinery", live(f.src), add);
	rt.setSv(f, "air_contents", (yield* g.new_(f, T("/datum/gas_mixture"), [])));
	rt.setFv(f, "volume", rt.sv(f, "air_contents"), rt.sv(f, "volume"));
	rt.setFv(f, "temperature", rt.sv(f, "air_contents"), 293.1499938964844);
	return 1;
}, true);

// /obj/machinery/portable_atmospherics/proc/Destroy  (code/modules/atmospherics/machinery/portable/portable_atmospherics.dm:29)  may sleep
rt.def("/obj/machinery/portable_atmospherics/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modField(f, rt.gl("SSair"), "atmos_machinery", live(f.src), subtract));
	yield* g.srcCall(f, "disconnect");
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "air_contents")]);
	rt.setSv(f, "air_contents", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/portable_atmospherics/proc/process_atmos  (code/modules/atmospherics/machinery/portable/portable_atmospherics.dm:38)  may sleep
rt.def("/obj/machinery/portable_atmospherics/proc/process_atmos", function* process_atmos(f: Frame) {
	if (!truthy(rt.sv(f, "connected_port"))) {
		yield* g.callName(f, rt.sv(f, "air_contents"), "react", []);
	} else {
		yield* g.srcCall(f, "update_icon");
	}
	return f.dot;
}, true);

// /obj/machinery/portable_atmospherics/proc/connect  (code/modules/atmospherics/machinery/portable/portable_atmospherics.dm:48)
rt.def("/obj/machinery/portable_atmospherics/proc/connect", function connect(f: Frame, new_port: Value) {
	let connected_port_parent: Value = null;
	f.vars = () => [connected_port_parent];
	if (((truthy(rt.sv(f, "connected_port")) || !truthy(live(new_port))) || truthy(rt.fv(f, "connected_device", live(new_port))))) {
		return 0;
	}
	if (!isEqual(rt.fv(f, "loc", live(new_port)), rt.sv(f, "loc"))) {
		return 0;
	}
	rt.setSv(f, "connected_port", live(new_port));
	rt.setFv(f, "connected_device", rt.sv(f, "connected_port"), live(f.src));
	rt.callName(f, (connected_port_parent = rt.index(rt.fv(f, "parents", rt.sv(f, "connected_port")), 1)), "reconcile_air", []);
	rt.setSv(f, "anchored", 1);
	return 1;
});

// /obj/machinery/portable_atmospherics/proc/Move  (code/modules/atmospherics/machinery/portable/portable_atmospherics.dm:65)  may sleep
rt.def("/obj/machinery/portable_atmospherics/proc/Move", function* Move(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.srcCall(f, "disconnect");
	return f.dot;
}, true);

// /obj/machinery/portable_atmospherics/proc/disconnect  (code/modules/atmospherics/machinery/portable/portable_atmospherics.dm:70)
rt.def("/obj/machinery/portable_atmospherics/proc/disconnect", function disconnect(f: Frame) {
	if (!truthy(rt.sv(f, "connected_port"))) {
		return 0;
	}
	rt.setSv(f, "anchored", 0);
	rt.setFv(f, "connected_device", rt.sv(f, "connected_port"), null);
	rt.setSv(f, "connected_port", null);
	return 1;
});

// /obj/machinery/portable_atmospherics/proc/attackby  (code/modules/atmospherics/machinery/portable/portable_atmospherics.dm:81)  may sleep
rt.def("/obj/machinery/portable_atmospherics/proc/attackby", function* attackby(f: Frame) {
	let _T: Value = null, possible_port: Value = null;
	f.vars = () => [_T, possible_port];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/tank")) ? 1 : 0))) {
		if (!truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
			_T = live(f.args[0]);
			if ((truthy(rt.sv(f, "holding")) || !truthy((yield* g.callName(f, live(f.args[1]), "drop_item", []))))) {
				return live(f.dot);
			}
			rt.setFv(f, "loc", live(_T), live(f.src));
			rt.setSv(f, "holding", live(_T));
			yield* g.srcCall(f, "update_icon");
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
			if (!truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
				if (truthy(rt.sv(f, "connected_port"))) {
					yield* g.srcCall(f, "disconnect");
					yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ disconnects ＀.", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You unfasten ＀ from the port.</span>", [live(f.src)]), "<span class='italics'>You hear a ratchet.</span>"]);
					yield* g.srcCall(f, "update_icon");
					return live(f.dot);
				} else {
					if (!truthy((possible_port = rt.locateIn(f, T("/obj/machinery/atmospherics/components/unary/portables_connector"), rt.sv(f, "loc"))))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>Nothing happens.</span>"]);
						return live(f.dot);
					}
					if (!truthy((yield* g.srcCall(f, "connect", live(possible_port))))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀ failed to connect to the port.</span>", [rt.sv(f, "name")])]);
						return live(f.dot);
					}
					yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ connects ＀.", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You fasten ＀ to the port.</span>", [live(f.src)]), "<span class='italics'>You hear a ratchet.</span>"]);
					yield* g.srcCall(f, "update_icon");
				}
			}
		} else {
			if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/device/analyzer")) ? 1 : 0)) && truthy((yield* g.srcCall(f, "Adjacent", live(f.args[1])))))) {
				yield* g.srcCall(f, "atmosanalyzer_scan", rt.sv(f, "air_contents"), live(f.args[1]));
			} else {
				return (yield* g.callSuper(f, [], rt.Args.Same));
			}
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/portable_atmospherics/proc/attacked_by  (code/modules/atmospherics/machinery/portable/portable_atmospherics.dm:120)  may sleep
rt.def("/obj/machinery/portable_atmospherics/proc/attacked_by", function* attacked_by(f: Frame) {
	if ((rt.lt(rt.fv(f, "force", live(f.args[0])), 10) && !truthy(rt.bitAnd(rt.sv(f, "stat"), 1)))) {
		yield* g.srcCall(f, "take_damage", 0);
	} else {
		yield* g.srcCall(f, "investigate_log", fmt("was smacked with ＇！ by ＀.", [live(f.args[0]), (yield* g.call(f, P("/proc/key_name"), null, [live(f.args[1])]))]), "atmos");
		yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["I", "user"] });
