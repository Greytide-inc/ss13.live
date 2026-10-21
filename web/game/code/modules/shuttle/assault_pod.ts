// From code/modules/shuttle/assault_pod.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(13047, "/obj/docking_port/mobile/assault_pod", "/obj/docking_port/mobile", {
	name: "assault pod",
	id: "steel_rain",
	dwidth: 3,
	width: 7,
	height: 7,
});

// /obj/docking_port/mobile/assault_pod/proc/request  (code/modules/shuttle/assault_pod.dm:9)
rt.def("/obj/docking_port/mobile/assault_pod/proc/request", function request(f: Frame) {
	if (!isEqual(rt.sv(f, "z"), rt.initial(f, live(f.src), "z"))) return f.dot;
	return rt.callSuper(f, [], rt.Args.Same);
});

// /obj/docking_port/mobile/assault_pod/proc/dock  (code/modules/shuttle/assault_pod.dm:14)  may sleep
rt.def("/obj/docking_port/mobile/assault_pod/proc/dock", function* dock(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.istype(live(f.args[0]), T("/obj/docking_port/stationary/transit")) ? 1 : 0))) return f.dot;
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, rt.fv(f, "loc", live(f.src)), 0), rt.rsc("sound/effects/explosion1.ogg"), 50, 1]);
	return f.dot;
}, true, { args: ["S1"] });

rt.type(9394, "/obj/item/device/assault_pod", "/obj/item/device", {
	shuttle_id: "steel_rain",
	dwidth: 3,
	dheight: 0,
	width: 7,
	height: 7,
	lz_dir: 1,
	name: "Assault Pod Targetting Device",
	icon_state: "gangtool-red",
	item_state: "walkietalkie",
	desc: "Used to select a landing zone for assault pods.",
});

// /obj/item/device/assault_pod/proc/attack_self  (code/modules/shuttle/assault_pod.dm:35)  may sleep
rt.def("/obj/item/device/assault_pod/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let target_area: Value = null, picked_area: Value = null, _T: Value = null, landing_zone: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [user, target_area, picked_area, _T, landing_zone, S, $e];
	target_area = null;
	target_area = (yield* g.op(f, "Prompt", [0], [null, live(target_area), "Select a Landing Zone", "Area to land", rt.gl("teleportlocs")]));
	picked_area = rt.index(rt.gl("teleportlocs"), live(target_area));
	if ((!truthy(live(f.src)) || (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))))) {
		return live(f.dot);
	}
	if (!truthy((_T = (yield* g.call(f, P("/proc/safepick"), null, [(yield* g.call(f, P("/proc/get_area_turfs"), null, [live(picked_area)]))]))))) {
		return live(f.dot);
	}
	rt.setFv(f, "id", (landing_zone = (yield* g.new_(f, T("/obj/docking_port/stationary"), [live(_T)]))), fmt("assault_pod(＃)", [live(f.src)]));
	rt.setFv(f, "name", live(landing_zone), "Landing Zone");
	rt.setFv(f, "dwidth", live(landing_zone), rt.sv(f, "dwidth"));
	rt.setFv(f, "dheight", live(landing_zone), rt.sv(f, "dheight"));
	rt.setFv(f, "width", live(landing_zone), rt.sv(f, "width"));
	rt.setFv(f, "height", live(landing_zone), rt.sv(f, "height"));
	yield* g.callName(f, live(landing_zone), "setDir", [rt.sv(f, "lz_dir")]);
	S = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/computer/shuttle"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		if (isEqual(rt.fv(f, "shuttleId", live(S)), rt.sv(f, "shuttle_id"))) {
			rt.setFv(f, "possible_destinations", live(S), fmt("＀", [rt.fv(f, "id", live(landing_zone))]));
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Landing zone set."]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
