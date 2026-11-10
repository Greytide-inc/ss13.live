// Based on /tg/station's code/modules/admin/verbs/atmosdebug.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// atmosdebug.dm:4
rt.def("/client/proc/atmosscan", function atmosscan(f: Frame) {
	let plumbing: Value = null, pipe: Value = null;
	if (!this.holder) {
		to_chat(this, "Only administrators may use this command.");
		return f.dot;
	}
	for (plumbing of each(GLOB.machines, T("/obj/machinery/atmospherics"))) {
		if (plumbing.nodealert) {
			to_chat(f.usr, `Unconnected ${plumbing.name} located at ${plumbing.x},${plumbing.y},${plumbing.z} (${get_area(plumbing.loc)})`);
		}
	}
	for (pipe of each(GLOB.machines, T("/obj/machinery/atmospherics/pipe/manifold"))) {
		if (!rt.index(pipe.nodes, 1) || !rt.index(pipe.nodes, 2) || !rt.index(pipe.nodes, 3)) {
			to_chat(f.usr, `Unconnected ${pipe.name} located at ${pipe.x},${pipe.y},${pipe.z} (${get_area(pipe.loc)})`);
		}
	}
	pipe = null;
	for (pipe of each(GLOB.machines, T("/obj/machinery/atmospherics/pipe/simple"))) {
		if (!rt.index(pipe.nodes, 1) || !rt.index(pipe.nodes, 2)) {
			to_chat(f.usr, `Unconnected ${pipe.name} located at ${pipe.x},${pipe.y},${pipe.z} (${get_area(pipe.loc)})`);
		}
	}
	return f.dot;
}, false, { verb: { name: "Check Plumbing", category: "Mapping" } });

// atmosdebug.dm:27
rt.def("/client/proc/powerdebug", function powerdebug(f: Frame) {
	let PN: Value = null, C: Value = null;
	if (!this.holder) {
		to_chat(this, "Only administrators may use this command.");
		return f.dot;
	}
	for (PN of each(GLOB.powernets, T("/datum/powernet"))) {
		if (!PN.nodes || !rt.len(f, PN.nodes)) {
			if (PN.cables && rt.len(f, PN.cables) > 1) {
				C = rt.index(PN.cables, 1);
				to_chat(f.usr, `Powernet with no nodes! (number ${PN.number}) - example cable at ${C.x}, ${C.y}, ${C.z} in area ${get_area(C.loc)}`);
			}
		}
		if (!PN.cables || rt.len(f, PN.cables) < 10) {
			if (PN.cables && rt.len(f, PN.cables) > 1) {
				C = rt.index(PN.cables, 1);
				to_chat(f.usr, `Powernet with fewer than 10 cables! (number ${PN.number}) - example cable at ${C.x}, ${C.y}, ${C.z} in area ${get_area(C.loc)}`);
			}
		}
	}
	return f.dot;
}, false, { verb: { name: "Check Power", category: "Mapping" } });
