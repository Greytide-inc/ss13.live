// Based on /tg/station's code/modules/shuttle/assault_pod.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(13047, "/obj/docking_port/mobile/assault_pod", "/obj/docking_port/mobile", {
	name: "assault pod",
	id: "steel_rain",
	dwidth: 3,
	width: 7,
	height: 7,
});

// assault_pod.dm:9
rt.def("/obj/docking_port/mobile/assault_pod/proc/request", function request(f: Frame) {
	if (this.z != rt.initial(f, this, "z")) return f.dot;
	return parent_proc();
});

// assault_pod.dm:14
rt.def("/obj/docking_port/mobile/assault_pod/proc/dock", function* dock(f: Frame, S1: Value) {
	yield* parent_proc();
	if (rt.istype(S1, T("/obj/docking_port/stationary/transit"))) return f.dot;
	playsound(rt.getStep(f, this.loc, 0), rt.rsc("sound/effects/explosion1.ogg"), 50, 1);
	return f.dot;
}, true);

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

// assault_pod.dm:35
rt.def("/obj/item/device/assault_pod/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let target_area: Value = null, _T: Value = null, landing_zone: Value = null, S: Value = null;
	target_area = (yield* g.op(f, "Prompt", [0], [null, target_area, "Select a Landing Zone", "Area to land", GLOB.teleportlocs]));
	let picked_area: Value = rt.index(GLOB.teleportlocs, target_area);
	if (!this || !this || this.gc_destroyed) {
		return f.dot;
	}
	if (!(_T = safepick(get_area_turfs(picked_area)))) {
		return f.dot;
	}
	(landing_zone = (yield* new_(T("/obj/docking_port/stationary"), _T))).id = fmt("assault_pod(＃)", [this]);
	landing_zone.name = "Landing Zone";
	landing_zone.dwidth = this.dwidth;
	landing_zone.dheight = this.dheight;
	landing_zone.width = this.width;
	landing_zone.height = this.height;
	yield* landing_zone.setDir(this.lz_dir);
	for (S of each(GLOB.machines, T("/obj/machinery/computer/shuttle"))) {
		if (S.shuttleId == this.shuttle_id) {
			S.possible_destinations = `${landing_zone.id}`;
		}
	}
	to_chat(user, "Landing zone set.");
	yield* qdel(this);
	return f.dot;
}, true);
