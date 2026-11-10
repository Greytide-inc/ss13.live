// Based on /tg/station's code/game/area/areas/holodeck.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(13594, "/area/holodeck", "/area", {
	linked: null,
	restricted: 0,
	flags: 0,
	hidden: 1,
	name: "Holodeck",
	icon_state: "Holodeck",
	dynamic_lighting: 0,
});

// holodeck.dm:17
rt.def("/area/holodeck/proc/powered", function powered(f: Frame, chan: Value) {
	let A: Value = null;
	if (!this.requires_power) {
		return 1;
	}
	if (this.always_unpowered) {
		return 0;
	}
	if (!this.linked) {
		return 0;
	}
	if (!rt.istype((A = get_area(this.linked)), T("/area/holodeck"))) {
	} else {
		CRASH("Assertion Failed: !istype(A,/area/holodeck)");
	}
	return A.powered(chan);
});

// holodeck.dm:28
rt.def("/area/holodeck/proc/usage", function usage(f: Frame, chan: Value) {
	let A: Value = null;
	if (!this.linked) {
		return 0;
	}
	if (!rt.istype((A = get_area(this.linked)), T("/area/holodeck"))) {
	} else {
		CRASH("Assertion Failed: !istype(A,/area/holodeck)");
	}
	return A.usage(chan);
});

// holodeck.dm:35
rt.def("/area/holodeck/proc/addStaticPower", function addStaticPower(f: Frame, value: Value, powerchannel: Value) {
	let A: Value = null;
	if (!this.linked) {
		return f.dot;
	}
	if (!rt.istype((A = get_area(this.linked)), T("/area/holodeck"))) {
	} else {
		CRASH("Assertion Failed: !istype(A,/area/holodeck)");
	}
	return A.addStaticPower(value, powerchannel);
});

// holodeck.dm:42
rt.def("/area/holodeck/proc/use_power", function use_power(f: Frame, amount: Value, chan: Value) {
	let A: Value = null;
	if (!this.linked) {
		return 0;
	}
	if (!rt.istype((A = get_area(this.linked)), T("/area/holodeck"))) {
	} else {
		CRASH("Assertion Failed: !istype(A,/area/holodeck)");
	}
	return A.use_power(amount, chan);
});
