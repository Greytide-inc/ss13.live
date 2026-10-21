// From code/game/gamemodes/clock_cult/clock_helpers/clock_powerdrain.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/machinery/power/apc/proc/power_drain  (code/game/gamemodes/clock_cult/clock_helpers/clock_powerdrain.dm:6)  may sleep
rt.def("/obj/machinery/power/apc/proc/power_drain", function* power_drain(f: Frame, clockcult_user: Value) {
	f.vars = () => [clockcult_user];
	if (!(truthy(rt.sv(f, "cell")) && truthy(rt.fv(f, "charge", rt.sv(f, "cell"))))) return f.dot;
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), "sparks", 50, 1]);
	yield* g.call(f, P("/proc/flick"), null, ["apc-spark", live(f.src)]);
	f.dot = (yield* g.call(f, P("/proc/min"), null, [rt.fv(f, "charge", rt.sv(f, "cell")), 250]));
	yield* g.callName(f, rt.sv(f, "cell"), "use", [live(f.dot)]);
	if ((!truthy(rt.fv(f, "charge", rt.sv(f, "cell"))) && !truthy(rt.sv(f, "shorted")))) {
		rt.setSv(f, "shorted", 1);
		yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>The ＀'s screen blurs with static.</span>", [rt.sv(f, "name")]));
	}
	yield* g.srcCall(f, "update");
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/power/smes/proc/power_drain  (code/game/gamemodes/clock_cult/clock_helpers/clock_powerdrain.dm:19)  may sleep
rt.def("/obj/machinery/power/smes/proc/power_drain", function* power_drain(f: Frame, clockcult_user: Value) {
	f.vars = () => [clockcult_user];
	if (!truthy(rt.sv(f, "charge"))) return f.dot;
	f.dot = (yield* g.call(f, P("/proc/min"), null, [rt.sv(f, "charge"), 250]));
	(rt.modSrcVar(f, "charge", multiply(live(f.dot), 50), subtract));
	if ((!truthy(rt.sv(f, "charge")) && !truthy(rt.sv(f, "panel_open")))) {
		rt.setSv(f, "panel_open", 1);
		rt.setSv(f, "icon_state", fmt("＀-o", [rt.initial(f, live(f.src), "icon_state")]));
		yield* g.call(f, P("/proc/do_sparks"), null, [10, 0, live(f.src)]);
		yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀'s panel flies open with a flurry of sparks!</span>", [live(f.src)]));
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/weapon/stock_parts/cell/proc/power_drain  (code/game/gamemodes/clock_cult/clock_helpers/clock_powerdrain.dm:30)  may sleep
rt.def("/obj/item/weapon/stock_parts/cell/proc/power_drain", function* power_drain(f: Frame, clockcult_user: Value) {
	f.vars = () => [clockcult_user];
	if (!truthy(rt.sv(f, "charge"))) return f.dot;
	f.dot = (yield* g.call(f, P("/proc/min"), null, [rt.sv(f, "charge"), 250]));
	rt.setSv(f, "charge", (yield* g.srcCall(f, "use", live(f.dot))));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/light/proc/power_drain  (code/game/gamemodes/clock_cult/clock_helpers/clock_powerdrain.dm:36)
rt.def("/obj/machinery/light/proc/power_drain", function power_drain(f: Frame, clockcult_user: Value) {
	if (!truthy(rt.sv(f, "on"))) return f.dot;
	rt.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/light_flicker.ogg"), 50, 1]);
	f.dot = 250;
	if (!truthy(rt.op(f, "Prob", [], [50]))) return f.dot;
	rt.callSrc(f, "burn_out", []);
	return f.dot;
});

// /mob/living/silicon/robot/proc/power_drain  (code/game/gamemodes/clock_cult/clock_helpers/clock_powerdrain.dm:42)  may sleep
rt.def("/mob/living/silicon/robot/proc/power_drain", function* power_drain(f: Frame, clockcult_user: Value) {
	f.vars = () => [clockcult_user];
	if (!(((!truthy(live(clockcult_user)) || !truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.src)])))) && truthy(rt.sv(f, "cell"))) && truthy(rt.fv(f, "charge", rt.sv(f, "cell"))))) return f.dot;
	f.dot = (yield* g.call(f, P("/proc/min"), null, [rt.fv(f, "charge", rt.sv(f, "cell")), 250]));
	yield* g.callName(f, rt.sv(f, "cell"), "use", [live(f.dot)]);
	if (truthy(rt.op(f, "Prob", [], [20]))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='userdanger'>ERROR: Power loss detected!</span>"]);
	}
	yield* g.callName(f, rt.sv(f, "spark_system"), "start", []);
	return f.dot;
}, true);

// /obj/mecha/proc/power_drain  (code/game/gamemodes/clock_cult/clock_helpers/clock_powerdrain.dm:50)  may sleep
rt.def("/obj/mecha/proc/power_drain", function* power_drain(f: Frame, clockcult_user: Value) {
	f.vars = () => [clockcult_user];
	if (!((((!truthy(live(clockcult_user)) || !truthy(rt.sv(f, "occupant"))) || (truthy(rt.sv(f, "occupant")) && !truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [rt.sv(f, "occupant")]))))) && truthy(rt.sv(f, "cell"))) && truthy(rt.fv(f, "charge", rt.sv(f, "cell"))))) return f.dot;
	f.dot = (yield* g.call(f, P("/proc/min"), null, [rt.fv(f, "charge", rt.sv(f, "cell")), 250]));
	yield* g.callName(f, rt.sv(f, "cell"), "use", [live(f.dot)]);
	if (truthy(rt.op(f, "Prob", [], [20]))) {
		yield* g.srcCall(f, "occupant_message", "<span class='userdanger'>Power loss detected!</span>");
	}
	yield* g.callName(f, rt.sv(f, "spark_system"), "start", []);
	return f.dot;
}, true);
