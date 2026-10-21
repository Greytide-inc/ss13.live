// From code/game/area/areas/holodeck.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(13594, "/area/holodeck", "/area", {
	linked: null,
	restricted: 0,
	flags: 0,
	hidden: 1,
	name: "Holodeck",
	icon_state: "Holodeck",
	dynamic_lighting: 0,
});

// /area/holodeck/proc/powered  (code/game/area/areas/holodeck.dm:17)
rt.def("/area/holodeck/proc/powered", function powered(f: Frame, chan: Value) {
	let A: Value = null;
	let $0: any;
	f.vars = () => [A, $0];
	if (!truthy(rt.sv(f, "requires_power"))) {
		return 1;
	}
	if (truthy(rt.sv(f, "always_unpowered"))) {
		return 0;
	}
	if (!truthy(rt.sv(f, "linked"))) {
		return 0;
	}
	if (!truthy((rt.istype((A = rt.call(f, P("/proc/get_area"), null, [rt.sv(f, "linked")])), T("/area/holodeck")) ? 1 : 0))) {
		$0 = null;
	} else {
		$0 = rt.call(f, P("/proc/CRASH"), null, ["Assertion Failed: !istype(A,/area/holodeck)"]);
	}
	return rt.callName(f, live(A), "powered", [live(chan)]);
});

// /area/holodeck/proc/usage  (code/game/area/areas/holodeck.dm:28)
rt.def("/area/holodeck/proc/usage", function usage(f: Frame, chan: Value) {
	let A: Value = null;
	let $0: any;
	f.vars = () => [A, $0];
	if (!truthy(rt.sv(f, "linked"))) {
		return 0;
	}
	if (!truthy((rt.istype((A = rt.call(f, P("/proc/get_area"), null, [rt.sv(f, "linked")])), T("/area/holodeck")) ? 1 : 0))) {
		$0 = null;
	} else {
		$0 = rt.call(f, P("/proc/CRASH"), null, ["Assertion Failed: !istype(A,/area/holodeck)"]);
	}
	return rt.callName(f, live(A), "usage", [live(chan)]);
});

// /area/holodeck/proc/addStaticPower  (code/game/area/areas/holodeck.dm:35)
rt.def("/area/holodeck/proc/addStaticPower", function addStaticPower(f: Frame, value: Value, powerchannel: Value) {
	let A: Value = null;
	let $0: any;
	f.vars = () => [A, $0];
	if (!truthy(rt.sv(f, "linked"))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype((A = rt.call(f, P("/proc/get_area"), null, [rt.sv(f, "linked")])), T("/area/holodeck")) ? 1 : 0))) {
		$0 = null;
	} else {
		$0 = rt.call(f, P("/proc/CRASH"), null, ["Assertion Failed: !istype(A,/area/holodeck)"]);
	}
	return rt.callName(f, live(A), "addStaticPower", [live(value), live(powerchannel)]);
});

// /area/holodeck/proc/use_power  (code/game/area/areas/holodeck.dm:42)
rt.def("/area/holodeck/proc/use_power", function use_power(f: Frame, amount: Value, chan: Value) {
	let A: Value = null;
	let $0: any;
	f.vars = () => [A, $0];
	if (!truthy(rt.sv(f, "linked"))) {
		return 0;
	}
	if (!truthy((rt.istype((A = rt.call(f, P("/proc/get_area"), null, [rt.sv(f, "linked")])), T("/area/holodeck")) ? 1 : 0))) {
		$0 = null;
	} else {
		$0 = rt.call(f, P("/proc/CRASH"), null, ["Assertion Failed: !istype(A,/area/holodeck)"]);
	}
	return rt.callName(f, live(A), "use_power", [live(amount), live(chan)]);
});
