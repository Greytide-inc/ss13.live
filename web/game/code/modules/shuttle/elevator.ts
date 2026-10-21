// From code/modules/shuttle/elevator.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(13048, "/obj/docking_port/mobile/elevator", "/obj/docking_port/mobile", {
	name: "elevator",
	id: "elevator",
	dwidth: 3,
	width: 7,
	height: 7,
	knockdown: 0,
});

// /obj/docking_port/mobile/elevator/proc/request  (code/modules/shuttle/elevator.dm:10)  may sleep
rt.def("/obj/docking_port/mobile/elevator/proc/request", function* request(f: Frame, S: Value) {
	f.vars = () => [S];
	yield* g.srcCall(f, "dock", live(S), 1);
	return f.dot;
}, true);
