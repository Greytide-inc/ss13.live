// Based on /tg/station's code/game/gamemodes/miniantags/bot_swarm/swarmer_event.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(273, "/datum/round_event/spawn_swarmer", "/datum/round_event", {});

// swarmer_event.dm:14
rt.def("/datum/round_event/spawn_swarmer/proc/start", function* start(f: Frame) {
	if (this.find_swarmer()) {
		return 0;
	}
	if (!GLOB.the_gateway) {
		return 0;
	}
	yield* new_(T("/obj/item/device/unactivated_swarmer"), rt.getStep(f, GLOB.the_gateway, 0));
	if (!prob(25)) return f.dot;
	let swarmer_report: Value = `<font size=3><b>${command_name()} High-Priority Update</b></span>`;
	swarmer_report += "<br><br>Our long-range sensors have detected an odd signal emanating from your station's gateway. We recommend immediate investigation of your gateway, as something may have come through.";
	yield* print_command_report(swarmer_report, { announce: 1 });
	return f.dot;
}, true);

// swarmer_event.dm:26
rt.def("/datum/round_event/spawn_swarmer/proc/find_swarmer", function find_swarmer(f: Frame) {
	let M: Value = null;
	for (M of each(GLOB.mob_list, T("/mob/living"))) {
		if (rt.istype(M, T("/mob/living/simple_animal/hostile/swarmer")) && M.client) {
			return 1;
		}
	}
	return 0;
});
