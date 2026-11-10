// Based on /tg/station's code/modules/client/client_colour.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


// client_colour.dm:30
rt.def("/mob/proc/add_client_colour", function* add_client_colour(f: Frame, colour_type: Value) {
	let CC: Value = null;
	if (!ispath(colour_type, T("/datum/client_colour"))) {
		return f.dot;
	}
	(rt.modSrcVar(f, "client_colours", (CC = (yield* new_(colour_type))), rt.bitOr));
	yield* sortTim(this.client_colours, P("/proc/cmp_clientcolour_priority"));
	this.update_client_colour();
	return f.dot;
}, true);

// client_colour.dm:44
rt.def("/mob/proc/remove_client_colour", function* remove_client_colour(f: Frame, colour_type: Value) {
	let cc: Value = null, CC: Value = null;
	if (!ispath(colour_type, T("/datum/client_colour"))) {
		return f.dot;
	}
	for (cc of each(this.client_colours)) {
		if ((CC = cc).type == colour_type) {
			this.client_colours -= CC;
			yield* qdel(CC);
			break;
		}
	}
	this.update_client_colour();
	return f.dot;
}, true);

// client_colour.dm:61
rt.def("/mob/proc/update_client_colour", function update_client_colour(f: Frame) {
	let CC: Value = null;
	if (!this.client) {
		return f.dot;
	}
	this.client.color = "";
	if (!rt.len(f, this.client_colours)) {
		return f.dot;
	}
	if (!(CC = rt.index(this.client_colours, 1))) return f.dot;
	this.client.color = CC.colour;
	return f.dot;
});
