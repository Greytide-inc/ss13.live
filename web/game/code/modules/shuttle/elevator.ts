// Based on /tg/station's code/modules/shuttle/elevator.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(13048, "/obj/docking_port/mobile/elevator", "/obj/docking_port/mobile", {
	name: "elevator",
	id: "elevator",
	dwidth: 3,
	width: 7,
	height: 7,
	knockdown: 0,
});

// elevator.dm:10
rt.def("/obj/docking_port/mobile/elevator/proc/request", function* request(f: Frame, S: Value) {
	yield* this.dock(S, 1);
	return f.dot;
}, true);
