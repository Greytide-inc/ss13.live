// From code/datums/antagonists/antag_datum.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(895, "/datum/antagonist", "/datum", {
	name: "Antagonist",
	owner: null,
	silent: 0,
	can_coexist_with_others: 1,
	typecache_datum_blacklist: null,
	delete_on_death: 1,
});

// /datum/antagonist/proc/<init>  (code/datums/antagonists/antag_datum.dm:9)
rt.def("/datum/antagonist/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "typecache_datum_blacklist", rt.list());
	return f.dot;
});

// /datum/antagonist/proc/New  (code/datums/antagonists/antag_datum.dm:13)
rt.def("/datum/antagonist/proc/New", function New(f: Frame, new_owner: Value) {
	rt.setSv(f, "typecache_datum_blacklist", rt.call(f, P("/proc/typecacheof"), null, [rt.sv(f, "typecache_datum_blacklist")]));
	if (!truthy(live(new_owner))) return f.dot;
	rt.setSv(f, "owner", live(new_owner));
	return f.dot;
});

// /datum/antagonist/proc/Destroy  (code/datums/antagonists/antag_datum.dm:19)  may sleep
rt.def("/datum/antagonist/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "owner"))) {
		if (truthy(rt.fv(f, "antag_datums", rt.sv(f, "owner")))) {
			(rt.modField(f, rt.sv(f, "owner"), "antag_datums", live(f.src), subtract));
			if (!truthy(rt.getLen(f, rt.fv(f, "antag_datums", rt.sv(f, "owner"))))) {
				rt.setFv(f, "antag_datums", rt.sv(f, "owner"), null);
			}
		}
	}
	rt.setSv(f, "owner", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/antagonist/proc/can_be_owned  (code/datums/antagonists/antag_datum.dm:25)
rt.def("/datum/antagonist/proc/can_be_owned", function can_be_owned(f: Frame, new_owner: Value) {
	let i: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [i, A, $e];
	f.dot = 1;
	if (truthy(rt.callName(f, rt.sv(f, "owner"), "has_antag_datum", [rt.sv(f, "type")]))) {
		return 0;
	}
	i = null;
	rt.forList(f, 0, rt.fv(f, "antag_datums", rt.sv(f, "owner")));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		A = live(i);
		if (truthy(rt.call(f, P("/proc/is_type_in_typecache"), null, [live(f.src), rt.fv(f, "typecache_datum_blacklist", live(A))]))) {
			return 0;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/antagonist/proc/on_body_transfer  (code/datums/antagonists/antag_datum.dm:33)  may sleep
rt.def("/datum/antagonist/proc/on_body_transfer", function* on_body_transfer(f: Frame, old_body: Value, new_body: Value) {
	f.vars = () => [old_body, new_body];
	yield* g.srcCall(f, "remove_innate_effects", live(old_body));
	yield* g.srcCall(f, "apply_innate_effects", live(new_body));
	return f.dot;
}, true);

// /datum/antagonist/proc/on_gain  (code/datums/antagonists/antag_datum.dm:46)  may sleep
rt.def("/datum/antagonist/proc/on_gain", function* on_gain(f: Frame) {
	if (!(truthy(rt.sv(f, "owner")) && truthy(rt.fv(f, "current", rt.sv(f, "owner"))))) return f.dot;
	if (!truthy(rt.sv(f, "silent"))) {
		yield* g.srcCall(f, "greet");
	}
	yield* g.srcCall(f, "apply_innate_effects");
	return f.dot;
}, true);

// /datum/antagonist/proc/on_removal  (code/datums/antagonists/antag_datum.dm:52)  may sleep
rt.def("/datum/antagonist/proc/on_removal", function* on_removal(f: Frame) {
	yield* g.srcCall(f, "remove_innate_effects");
	if (truthy(rt.sv(f, "owner"))) {
		if (truthy(rt.fv(f, "antag_datums", rt.sv(f, "owner")))) {
			(rt.modField(f, rt.sv(f, "owner"), "antag_datums", live(f.src), subtract));
			if (!truthy(rt.getLen(f, rt.fv(f, "antag_datums", rt.sv(f, "owner"))))) {
				rt.setFv(f, "antag_datums", rt.sv(f, "owner"), null);
			}
		}
		if ((!truthy(rt.sv(f, "silent")) && truthy(rt.fv(f, "current", rt.sv(f, "owner"))))) {
			yield* g.srcCall(f, "farewell");
		}
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
