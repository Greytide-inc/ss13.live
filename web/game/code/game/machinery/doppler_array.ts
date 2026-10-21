// From code/game/machinery/doppler_array.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobaldoppler_arrays  (code/game/machinery/doppler_array.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobaldoppler_arrays", function InitGlobaldoppler_arrays(f: Frame) {
	rt.setGl("doppler_arrays", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "doppler_arrays", add);
	return f.dot;
});

rt.type(10788, "/obj/machinery/doppler_array", "/obj/machinery", {
	integrated: 0,
	max_dist: 100,
	anchored: 1,
	verb_say: "states coldly",
	name: "tachyon-doppler array",
	desc: "A highly precise directional sensor array which measures the release of quants from decaying tachyons. The doppler shifting of the mirror-image formed by these quants can reveal the size, location and temporal affects of energetic disturbances within a large radius ahead of the array.\n<span class='notice'>Alt-click to rotate it clockwise.</span>",
	icon: rt.rsc("icons/obj/machines/research.dmi"),
	icon_state: "tdoppler",
	density: 1,
});

// /obj/machinery/doppler_array/proc/New  (code/game/machinery/doppler_array.dm:15)  may sleep
rt.def("/obj/machinery/doppler_array/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modGl("doppler_arrays", live(f.src), add);
	return f.dot;
}, true);

// /obj/machinery/doppler_array/proc/Destroy  (code/game/machinery/doppler_array.dm:19)  may sleep
rt.def("/obj/machinery/doppler_array/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("doppler_arrays", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/doppler_array/proc/attackby  (code/game/machinery/doppler_array.dm:26)  may sleep
rt.def("/obj/machinery/doppler_array/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
		if ((!truthy(rt.sv(f, "anchored")) && !truthy((yield* g.srcCall(f, "isinspace"))))) {
			rt.setSv(f, "anchored", 1);
			yield* g.srcCall(f, "power_change");
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You fasten ＀.</span>", [live(f.src)])]);
		} else {
			if (truthy(rt.sv(f, "anchored"))) {
				rt.setSv(f, "anchored", 0);
				yield* g.srcCall(f, "power_change");
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You unfasten ＀.</span>", [live(f.src)])]);
			}
		}
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// /obj/machinery/doppler_array/verb/rotate  (code/game/machinery/doppler_array.dm:44)
rt.def("/obj/machinery/doppler_array/verb/rotate", function rotate(f: Frame) {
	if ((!truthy(live(f.usr)) || !truthy(rt.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(f.usr))])))) {
		return live(f.dot);
	}
	if (((truthy(rt.fv(f, "stat", live(f.usr))) || truthy(rt.callName(f, live(f.usr), "restrained", []))) || !truthy(rt.fv(f, "canmove", live(f.usr))))) {
		return live(f.dot);
	}
	rt.callName(f, live(f.src), "setDir", [rt.call(f, P("/proc/turn"), null, [rt.fv(f, "dir", live(f.src)), 90])]);
	return live(f.dot);
}, false, { verb: { name: "Rotate Tachyon-doppler Dish", category: "Object", src: 3, range: 1 } });

// /obj/machinery/doppler_array/proc/AltClick  (code/game/machinery/doppler_array.dm:52)
rt.def("/obj/machinery/doppler_array/proc/AltClick", function AltClick(f: Frame, user: Value) {
	if ((!truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0)) || truthy(rt.callName(f, live(user), "incapacitated", [])))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You can't do that right now!</span>"]);
		return live(f.dot);
	}
	if (!rt.le(rt.call(f, P("/proc/get_dist"), null, [live(f.src), live(user)]), 1)) {
		return live(f.dot);
	} else {
		rt.callSrc(f, "rotate", []);
	}
	return f.dot;
});

// /obj/machinery/doppler_array/proc/sense_explosion  (code/game/machinery/doppler_array.dm:62)  may sleep
rt.def("/obj/machinery/doppler_array/proc/sense_explosion", function* sense_explosion(f: Frame, epicenter: Value, devastation_range: Value, heavy_impact_range: Value, light_impact_range: Value, took: Value, orig_dev_range: Value, orig_heavy_range: Value, orig_light_range: Value) {
	let zone: Value = null, distance: Value = null, direct: Value = null, messages: Value = null, helm: Value = null, message: Value = null;
	let $e: any;
	f.vars = () => [epicenter, devastation_range, heavy_impact_range, light_impact_range, took, orig_dev_range, orig_heavy_range, orig_light_range, zone, distance, direct, messages, helm, message, $e];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
		return live(f.dot);
	}
	if (!isEqual(rt.gv(f, "z", (zone = rt.getStep(f, live(f.src), 0))), rt.fv(f, "z", live(epicenter)))) {
		return live(f.dot);
	}
	distance = (yield* g.call(f, P("/proc/get_dist"), null, [live(epicenter), live(zone)]));
	direct = rt.getDir(f, live(zone), live(epicenter));
	if (rt.gt(live(distance), rt.sv(f, "max_dist"))) {
		return live(f.dot);
	}
	if ((!truthy(rt.bitAnd(live(direct), rt.sv(f, "dir"))) && !truthy(rt.sv(f, "integrated")))) {
		return live(f.dot);
	}
	messages = rt.list("Explosive disturbance detected.", fmt("Epicenter at: grid (＀,＀). Temporal displacement of tachyons: ＀ seconds.", [rt.fv(f, "x", live(epicenter)), rt.fv(f, "y", live(epicenter)), live(took)]), fmt("Factual: Epicenter radius: ＀. Outer radius: ＀. Shockwave radius: ＀.", [live(devastation_range), live(heavy_impact_range), live(light_impact_range)]));
	if (((rt.lt(live(devastation_range), live(orig_dev_range)) || rt.lt(live(heavy_impact_range), live(orig_heavy_range))) || rt.lt(live(light_impact_range), live(orig_light_range)))) {
		messages = rt.modify(live(messages), fmt("Theoretical: Epicenter radius: ＀. Outer radius: ＀. Shockwave radius: ＀.", [live(orig_dev_range), live(orig_heavy_range), live(orig_light_range)]), add);
	}
	if (truthy(rt.sv(f, "integrated"))) {
		if ((!truthy((helm = rt.sv(f, "loc"))) || !truthy((rt.istype(live(helm), T("/obj/item/clothing/head/helmet/space/hardsuit")) ? 1 : 0)))) {
			return live(f.dot);
		}
		yield* g.callName(f, live(helm), "display_visor_message", [fmt("Explosion detected! Epicenter: ＀, Outer: ＀, Shock: ＀", [live(devastation_range), live(heavy_impact_range), live(light_impact_range)])]);
	} else {
		message = null;
		rt.forList(f, 0, live(messages));
		while (($e = rt.next(f, 0)) !== undefined) {
			message = $e;
			yield* g.srcCall(f, "say", live(message));
		}
		rt.endFor(f, 0);
	}
	return f.dot;
}, true);

// /obj/machinery/doppler_array/proc/power_change  (code/game/machinery/doppler_array.dm:96)
rt.def("/obj/machinery/doppler_array/proc/power_change", function power_change(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		rt.setSv(f, "icon_state", fmt("＀-broken", [rt.initial(f, live(f.src), "icon_state")]));
	} else {
		if ((truthy(rt.callSrc(f, "powered", [])) && truthy(rt.sv(f, "anchored")))) {
			rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
			(rt.modSrcVar(f, "stat", 16777213, rt.bitAnd));
		} else {
			rt.setSv(f, "icon_state", fmt("＀-off", [rt.initial(f, live(f.src), "icon_state")]));
			(rt.modSrcVar(f, "stat", 2, rt.bitOr));
		}
	}
	return f.dot;
});
