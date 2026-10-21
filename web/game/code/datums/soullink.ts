// From code/datums/soullink.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/proc/Destroy  (code/datums/soullink.dm:8)  may sleep
rt.def("/mob/living/proc/Destroy", function* Destroy(f: Frame) {
	let s: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [s, S, $e];
	s = null;
	rt.forList(f, 0, rt.sv(f, "ownedSoullinks"));
	while (($e = rt.next(f, 0)) !== undefined) {
		s = $e;
		yield* g.callName(f, (S = live(s)), "ownerDies", [0]);
		yield* g.call(f, P("/proc/qdel"), null, [live(s)]);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "ownedSoullinks", null);
	s = null;
	rt.forList(f, 0, rt.sv(f, "sharedSoullinks"));
	while (($e = rt.next(f, 0)) !== undefined) {
		s = $e;
		yield* g.callName(f, (S = live(s)), "sharerDies", [0]);
		yield* g.callName(f, live(S), "removeSoulsharer", [live(f.src)]);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "sharedSoullinks", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(862, "/datum/soullink", "/datum", {
	soulowner: null,
	soulsharer: null,
	id: null,
});

// /datum/soullink/proc/ownerDies  empty
rt.def("/datum/soullink/proc/ownerDies", undefined, false, { args: ["gibbed", "owner"] });

// /datum/soullink/proc/sharerDies  empty
rt.def("/datum/soullink/proc/sharerDies", undefined, false, { args: ["gibbed", "owner"] });

// /datum/soullink/proc/Destroy  (code/datums/soullink.dm:34)  may sleep
rt.def("/datum/soullink/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "soulowner"))) {
		if (truthy(rt.fv(f, "ownedSoullinks", rt.sv(f, "soulowner")))) {
			(rt.modField(f, rt.sv(f, "soulowner"), "ownedSoullinks", live(f.src), subtract));
			if (!truthy(rt.getLen(f, rt.fv(f, "ownedSoullinks", rt.sv(f, "soulowner"))))) {
				rt.setFv(f, "ownedSoullinks", rt.sv(f, "soulowner"), null);
			}
		}
		rt.setSv(f, "soulowner", null);
	}
	if (truthy(rt.sv(f, "soulsharer"))) {
		if (truthy(rt.fv(f, "sharedSoullinks", rt.sv(f, "soulsharer")))) {
			(rt.modField(f, rt.sv(f, "soulsharer"), "sharedSoullinks", live(f.src), subtract));
			if (!truthy(rt.getLen(f, rt.fv(f, "sharedSoullinks", rt.sv(f, "soulsharer"))))) {
				rt.setFv(f, "sharedSoullinks", rt.sv(f, "soulsharer"), null);
			}
		}
		rt.setSv(f, "soulsharer", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/soullink/proc/removeSoulsharer  (code/datums/soullink.dm:42)
rt.def("/datum/soullink/proc/removeSoulsharer", function removeSoulsharer(f: Frame, sharer: Value) {
	if (!isEqual(rt.sv(f, "soulsharer"), live(sharer))) return f.dot;
	rt.setSv(f, "soulsharer", null);
	if (!truthy(rt.fv(f, "sharedSoullinks", live(sharer)))) return f.dot;
	(rt.modField(f, live(sharer), "sharedSoullinks", live(f.src), subtract));
	if (truthy(rt.getLen(f, rt.fv(f, "sharedSoullinks", live(sharer))))) return f.dot;
	rt.setFv(f, "sharedSoullinks", live(sharer), null);
	return f.dot;
});

// /datum/soullink/proc/parseArgs  (code/datums/soullink.dm:50)
rt.def("/datum/soullink/proc/parseArgs", function parseArgs(f: Frame, owner: Value, sharer: Value) {
	if ((!truthy(live(owner)) || !truthy(live(sharer)))) {
		return 0;
	}
	rt.setSv(f, "soulowner", live(owner));
	rt.setSv(f, "soulsharer", live(sharer));
	if (!truthy(rt.fv(f, "ownedSoullinks", live(owner)))) {
		rt.setFv(f, "ownedSoullinks", live(owner), rt.list());
	}
	rt.modField(f, live(owner), "ownedSoullinks", live(f.src), add);
	if (!truthy(rt.fv(f, "sharedSoullinks", live(sharer)))) {
		rt.setFv(f, "sharedSoullinks", live(sharer), rt.list());
	}
	rt.modField(f, live(sharer), "sharedSoullinks", live(f.src), add);
	return 1;
});

// /proc/soullink  (code/datums/soullink.dm:68)  may sleep
rt.def("/proc/soullink", function* soullink(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	if (!truthy((yield* g.callName(f, (S = (yield* g.new_(f, live(f.args[0]), []))), "parseArgs", [(yield* g.callName(f, f.argsList, "Copy", [2, 0]))], rt.Args.List)))) return f.dot;
	return live(S);
}, true, { args: ["typepath"] });

rt.type(863, "/datum/soullink/multisharer", "/datum/soullink", {
	soulsharers: null,
});

// /datum/soullink/multisharer/proc/parseArgs  (code/datums/soullink.dm:82)
rt.def("/datum/soullink/multisharer/proc/parseArgs", function parseArgs(f: Frame, owner: Value, sharers: Value) {
	let l: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [l, L, $e];
	if ((!truthy(live(owner)) || !truthy(rt.length(live(sharers))))) {
		return 0;
	}
	rt.setSv(f, "soulowner", live(owner));
	rt.setSv(f, "soulsharers", live(sharers));
	if (!truthy(rt.fv(f, "ownedSoullinks", live(owner)))) {
		rt.setFv(f, "ownedSoullinks", live(owner), rt.list());
	}
	rt.modField(f, live(owner), "ownedSoullinks", live(f.src), add);
	l = null;
	rt.forList(f, 0, live(sharers));
	while (($e = rt.next(f, 0)) !== undefined) {
		l = $e;
		if (!truthy(rt.gv(f, "sharedSoullinks", (L = live(l))))) {
			rt.setFv(f, "sharedSoullinks", live(L), rt.list());
		}
		rt.modField(f, live(L), "sharedSoullinks", live(f.src), add);
	}
	rt.endFor(f, 0);
	return 1;
});

// /datum/soullink/multisharer/proc/removeSoulsharer  (code/datums/soullink.dm:93)
rt.def("/datum/soullink/multisharer/proc/removeSoulsharer", function removeSoulsharer(f: Frame, sharer: Value) {
	if (!truthy(rt.sv(f, "soulsharers"))) return f.dot;
	(rt.modSrcVar(f, "soulsharers", live(sharer), subtract));
	if (truthy(rt.len(f, rt.sv(f, "soulsharers")))) return f.dot;
	rt.setSv(f, "soulsharers", null);
	return f.dot;
});

rt.type(865, "/datum/soullink/sharedfate", "/datum/soullink", {});

// /datum/soullink/sharedfate/proc/ownerDies  (code/datums/soullink.dm:105)  may sleep
rt.def("/datum/soullink/sharedfate/proc/ownerDies", function* ownerDies(f: Frame, gibbed: Value, owner: Value) {
	f.vars = () => [gibbed, owner];
	if (!truthy(rt.sv(f, "soulsharer"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "soulsharer"), "death", [live(gibbed)]);
	return f.dot;
}, true);

// /datum/soullink/sharedfate/proc/sharerDies  (code/datums/soullink.dm:109)  may sleep
rt.def("/datum/soullink/sharedfate/proc/sharerDies", function* sharerDies(f: Frame, gibbed: Value, sharer: Value) {
	f.vars = () => [gibbed, sharer];
	if (!truthy(rt.sv(f, "soulowner"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "soulowner"), "death", [live(gibbed)]);
	return f.dot;
}, true);

rt.type(866, "/datum/soullink/oneway", "/datum/soullink", {});

// /datum/soullink/oneway/proc/ownerDies  (code/datums/soullink.dm:119)  may sleep
rt.def("/datum/soullink/oneway/proc/ownerDies", function* ownerDies(f: Frame, gibbed: Value, owner: Value) {
	f.vars = () => [gibbed, owner];
	if (!truthy(rt.sv(f, "soulsharer"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "soulsharer"), "dust", [0]);
	return f.dot;
}, true);

rt.type(867, "/datum/soullink/sharedbody", "/datum/soullink", {});

// /datum/soullink/sharedbody/proc/ownerDies  (code/datums/soullink.dm:130)  may sleep
rt.def("/datum/soullink/sharedbody/proc/ownerDies", function* ownerDies(f: Frame, gibbed: Value, owner: Value) {
	f.vars = () => [gibbed, owner];
	if (!(truthy(rt.sv(f, "soulowner")) && truthy(rt.sv(f, "soulsharer")))) return f.dot;
	if (truthy(rt.fv(f, "mind", rt.sv(f, "soulsharer")))) {
		yield* g.callName(f, rt.fv(f, "mind", rt.sv(f, "soulsharer")), "transfer_to", [rt.sv(f, "soulowner")]);
	}
	yield* g.callName(f, rt.sv(f, "soulsharer"), "death", [live(gibbed)]);
	return f.dot;
}, true);

// /datum/soullink/sharedbody/proc/sharerDies  (code/datums/soullink.dm:136)  may sleep
rt.def("/datum/soullink/sharedbody/proc/sharerDies", function* sharerDies(f: Frame, gibbed: Value, sharer: Value) {
	f.vars = () => [gibbed, sharer];
	if (!((truthy(rt.sv(f, "soulowner")) && truthy(rt.sv(f, "soulsharer"))) && truthy(rt.fv(f, "mind", rt.sv(f, "soulsharer"))))) return f.dot;
	yield* g.callName(f, rt.fv(f, "mind", rt.sv(f, "soulsharer")), "transfer_to", [rt.sv(f, "soulowner")]);
	return f.dot;
}, true);

rt.type(864, "/datum/soullink/multisharer/replacementpool", "/datum/soullink/multisharer", {});

// /datum/soullink/multisharer/replacementpool/proc/ownerDies  (code/datums/soullink.dm:149)  may sleep
rt.def("/datum/soullink/multisharer/replacementpool/proc/ownerDies", function* ownerDies(f: Frame, gibbed: Value, owner: Value) {
	let souls: Value = null, l: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [gibbed, owner, souls, l, L, $e];
	if (!(truthy(rt.length(rt.sv(f, "soulsharers"))) && !truthy(live(gibbed)))) return f.dot;
	souls = (yield* g.call(f, P("/proc/shuffle"), null, [(yield* g.callName(f, rt.sv(f, "soulsharers"), "Copy", []))]));
	l = null;
	rt.forList(f, 0, live(souls));
	while (($e = rt.next(f, 0)) !== undefined) {
		l = $e;
		if ((!isEqual(rt.gv(f, "stat", (L = live(l))), 2) && truthy(rt.fv(f, "mind", live(L))))) {
			yield* g.callName(f, rt.fv(f, "mind", live(L)), "transfer_to", [rt.sv(f, "soulowner")]);
			yield* g.callName(f, rt.sv(f, "soulowner"), "revive", [1, 1]);
			yield* g.callName(f, live(L), "death", [0]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/soullink/multisharer/replacementpool/proc/sharerDies  (code/datums/soullink.dm:160)
rt.def("/datum/soullink/multisharer/replacementpool/proc/sharerDies", function sharerDies(f: Frame, gibbed: Value, sharer: Value) {
	rt.callSrc(f, "removeSoulsharer", [live(sharer)]);
	return f.dot;
});
