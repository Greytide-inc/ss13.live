// From code/game/gamemodes/miniantags/bot_swarm/swarmer_event.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(273, "/datum/round_event/spawn_swarmer", "/datum/round_event", {});

// /datum/round_event/spawn_swarmer/proc/start  (code/game/gamemodes/miniantags/bot_swarm/swarmer_event.dm:14)  may sleep
rt.def("/datum/round_event/spawn_swarmer/proc/start", function* start(f: Frame) {
	let swarmer_report: Value = null;
	f.vars = () => [swarmer_report];
	if (truthy((yield* g.srcCall(f, "find_swarmer")))) {
		return 0;
	}
	if (!truthy(rt.gl("the_gateway"))) {
		return 0;
	}
	yield* g.new_(f, T("/obj/item/device/unactivated_swarmer"), [rt.getStep(f, rt.gl("the_gateway"), 0)]);
	if (!truthy(rt.op(f, "Prob", [], [25]))) return f.dot;
	swarmer_report = fmt("<font size=3><b>＀ High-Priority Update</b></span>", [(yield* g.call(f, P("/proc/command_name"), null, []))]);
	swarmer_report = rt.modify(live(swarmer_report), "<br><br>Our long-range sensors have detected an odd signal emanating from your station's gateway. We recommend immediate investigation of your gateway, as something may have come through.", add);
	yield* g.call(f, P("/proc/print_command_report"), null, [null, live(swarmer_report), "announce", 1], rt.Args.Named);
	return f.dot;
}, true);

// /datum/round_event/spawn_swarmer/proc/find_swarmer  (code/game/gamemodes/miniantags/bot_swarm/swarmer_event.dm:26)
rt.def("/datum/round_event/spawn_swarmer/proc/find_swarmer", function find_swarmer(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	M = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if ((truthy((rt.istype(live(M), T("/mob/living/simple_animal/hostile/swarmer")) ? 1 : 0)) && truthy(rt.fv(f, "client", live(M))))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return 0;
});
