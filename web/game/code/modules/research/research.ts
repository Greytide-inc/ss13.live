// From code/modules/research/research.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4181, "/datum/research", "/datum", {
	possible_tech: null,
	known_tech: null,
	possible_designs: null,
	known_designs: null,
});

// /datum/research/proc/<init>  (code/modules/research/research.dm:50)
rt.def("/datum/research/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_tech", rt.list());
	$0 = $0;
	rt.setSv(f, "known_tech", rt.list());
	$0 = $0;
	rt.setSv(f, "possible_designs", rt.list());
	$0 = $0;
	rt.setSv(f, "known_designs", rt.list());
	return f.dot;
});

// /datum/research/proc/New  (code/modules/research/research.dm:56)  may sleep
rt.def("/datum/research/proc/New", function* New(f: Frame) {
	let _T: Value = null, D: Value = null;
	let $e: any;
	f.vars = () => [_T, D, $e];
	_T = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/tech")])), T("/datum/tech")));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		rt.modSrcVar(f, "possible_tech", (yield* g.new_(f, live(_T), [live(f.src)])), add);
	}
	rt.endFor(f, 0);
	D = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/design")])), T("/datum/design")));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		rt.modSrcVar(f, "possible_designs", (yield* g.new_(f, live(D), [live(f.src)])), add);
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "RefreshResearch");
	return f.dot;
}, true);

// /datum/research/proc/TechHasReqs  (code/modules/research/research.dm:65)
rt.def("/datum/research/proc/TechHasReqs", function TechHasReqs(f: Frame, _T: Value) {
	let req: Value = null, known: Value = null;
	let $e: any;
	f.vars = () => [req, known, $e];
	if (isEqual(rt.getLen(f, rt.fv(f, "req_tech", live(_T))), 0)) {
		return 1;
	}
	req = null;
	rt.forList(f, 0, rt.fv(f, "req_tech", live(_T)));
	while (($e = rt.next(f, 0)) !== undefined) {
		req = $e;
		if ((!truthy((known = rt.index(rt.sv(f, "known_tech"), live(req)))) || rt.lt(rt.fv(f, "level", live(known)), rt.index(rt.fv(f, "req_tech", live(_T)), live(req))))) {
			return 0;
		}
	}
	rt.endFor(f, 0);
	return 1;
});

// /datum/research/proc/DesignHasReqs  (code/modules/research/research.dm:76)
rt.def("/datum/research/proc/DesignHasReqs", function DesignHasReqs(f: Frame, D: Value) {
	let req: Value = null, known: Value = null;
	let $e: any;
	f.vars = () => [req, known, $e];
	if (isEqual(rt.getLen(f, rt.fv(f, "req_tech", live(D))), 0)) {
		return 1;
	}
	req = null;
	rt.forList(f, 0, rt.fv(f, "req_tech", live(D)));
	while (($e = rt.next(f, 0)) !== undefined) {
		req = $e;
		if ((!truthy((known = rt.index(rt.sv(f, "known_tech"), live(req)))) || rt.lt(rt.fv(f, "level", live(known)), rt.index(rt.fv(f, "req_tech", live(D)), live(req))))) {
			return 0;
		}
	}
	rt.endFor(f, 0);
	return 1;
});

// /datum/research/proc/AddTech2Known  (code/modules/research/research.dm:87)  may sleep
rt.def("/datum/research/proc/AddTech2Known", function* AddTech2Known(f: Frame, _T: Value) {
	let known: Value = null;
	f.vars = () => [_T, known];
	if (!truthy(live(_T))) {
		return live(f.dot);
	}
	if (truthy(rt.index(rt.sv(f, "known_tech"), rt.fv(f, "id", live(_T))))) {
		known = rt.index(rt.sv(f, "known_tech"), rt.fv(f, "id", live(_T)));
		if (rt.gt(rt.fv(f, "level", live(_T)), rt.fv(f, "level", live(known)))) {
			rt.setFv(f, "level", live(known), rt.fv(f, "level", live(_T)));
		}
		return live(f.dot);
	}
	rt.setAt(rt.sv(f, "known_tech"), rt.fv(f, "id", live(_T)), (yield* g.callName(f, live(_T), "copy", [])));
	return f.dot;
}, true);

// /datum/research/proc/AddDesign2Known  (code/modules/research/research.dm:97)
rt.def("/datum/research/proc/AddDesign2Known", function AddDesign2Known(f: Frame, D: Value) {
	if (truthy(rt.index(rt.sv(f, "known_designs"), rt.fv(f, "id", live(D))))) {
		return live(f.dot);
	}
	rt.setAt(rt.sv(f, "known_designs"), rt.fv(f, "id", live(D)), live(D));
	return f.dot;
});

// /datum/research/proc/RefreshResearch  (code/modules/research/research.dm:104)  may sleep
rt.def("/datum/research/proc/RefreshResearch", function* RefreshResearch(f: Frame) {
	let PT: Value = null, PD: Value = null, v: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [PT, PD, v, _T, $e];
	PT = null;
	rt.forList(f, 0, rt.sv(f, "possible_tech"), T("/datum/tech"));
	while (($e = rt.next(f, 0)) !== undefined) {
		PT = $e;
		if (truthy((yield* g.srcCall(f, "TechHasReqs", live(PT))))) {
			yield* g.srcCall(f, "AddTech2Known", live(PT));
		}
	}
	rt.endFor(f, 0);
	PD = null;
	rt.forList(f, 0, rt.sv(f, "possible_designs"), T("/datum/design"));
	while (($e = rt.next(f, 0)) !== undefined) {
		PD = $e;
		if (truthy((yield* g.srcCall(f, "DesignHasReqs", live(PD))))) {
			yield* g.srcCall(f, "AddDesign2Known", live(PD));
		}
	}
	rt.endFor(f, 0);
	v = null;
	rt.forList(f, 0, rt.sv(f, "known_tech"));
	while (($e = rt.next(f, 0)) !== undefined) {
		v = $e;
		rt.setFv(f, "level", (_T = rt.index(rt.sv(f, "known_tech"), live(v))), (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [rt.fv(f, "level", live(_T)), 20]))])));
	}
	rt.endFor(f, 0);
	return live(f.dot);
}, true);

// /datum/research/proc/UpdateTech  (code/modules/research/research.dm:120)
rt.def("/datum/research/proc/UpdateTech", function UpdateTech(f: Frame, ID: Value, level: Value) {
	let KT: Value = null;
	f.vars = () => [KT];
	if (!(truthy((KT = rt.index(rt.sv(f, "known_tech"), live(ID)))) && rt.le(rt.fv(f, "level", live(KT)), live(level)))) return f.dot;
	rt.setFv(f, "level", live(KT), rt.call(f, P("/proc/max"), null, [add(rt.fv(f, "level", live(KT)), 1), live(level)]));
	return f.dot;
});

// /datum/research/proc/IsTechHigher  (code/modules/research/research.dm:127)
rt.def("/datum/research/proc/IsTechHigher", function IsTechHigher(f: Frame, ID: Value, level: Value) {
	let KT: Value = null;
	f.vars = () => [KT];
	if (!truthy((KT = rt.index(rt.sv(f, "known_tech"), live(ID))))) return f.dot;
	if (rt.le(rt.fv(f, "level", live(KT)), live(level))) {
		return 1;
	} else {
		return 0;
	}
	return f.dot;
});

// /datum/research/proc/FindDesignByID  (code/modules/research/research.dm:135)
rt.def("/datum/research/proc/FindDesignByID", function FindDesignByID(f: Frame, id: Value) {
	return rt.index(rt.sv(f, "known_designs"), live(id));
});

rt.type(4182, "/datum/research/autolathe", "/datum/research", {});

// /datum/research/autolathe/proc/New  (code/modules/research/research.dm:140)  may sleep
rt.def("/datum/research/autolathe/proc/New", function* New(f: Frame) {
	let _T: Value = null, path: Value = null, D: Value = null;
	let $e: any;
	f.vars = () => [_T, path, D, $e];
	_T = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/tech")])), T("/datum/tech")));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		rt.modSrcVar(f, "possible_tech", (yield* g.new_(f, live(_T), [live(f.src)])), add);
	}
	rt.endFor(f, 0);
	path = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/design")])), T("/datum/design")));
	while (($e = rt.next(f, 0)) !== undefined) {
		path = $e;
		rt.modSrcVar(f, "possible_designs", (D = (yield* g.new_(f, live(path), [live(f.src)]))), add);
		if ((truthy(rt.bitAnd(rt.fv(f, "build_type", live(D)), 4)) && truthy((rt.isIn(f, "initial", rt.fv(f, "category", live(D))) ? 1 : 0)))) {
			yield* g.srcCall(f, "AddDesign2Known", live(D));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(4183, "/datum/research/limbgrower", "/datum/research", {});

// /datum/research/limbgrower/proc/New  (code/modules/research/research.dm:150)  may sleep
rt.def("/datum/research/limbgrower/proc/New", function* New(f: Frame) {
	let _T: Value = null, path: Value = null, D: Value = null;
	let $e: any;
	f.vars = () => [_T, path, D, $e];
	_T = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/tech")])), T("/datum/tech")));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		rt.modSrcVar(f, "possible_tech", (yield* g.new_(f, live(_T), [live(f.src)])), add);
	}
	rt.endFor(f, 0);
	path = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/design")])), T("/datum/design")));
	while (($e = rt.next(f, 0)) !== undefined) {
		path = $e;
		rt.modSrcVar(f, "possible_designs", (D = (yield* g.new_(f, live(path), [live(f.src)]))), add);
		if ((truthy(rt.bitAnd(rt.fv(f, "build_type", live(D)), 64)) && truthy((rt.isIn(f, "initial", rt.fv(f, "category", live(D))) ? 1 : 0)))) {
			yield* g.srcCall(f, "AddDesign2Known", live(D));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/research/autolathe/proc/AddDesign2Known  (code/modules/research/research.dm:159)
rt.def("/datum/research/autolathe/proc/AddDesign2Known", function AddDesign2Known(f: Frame) {
	if (!truthy(rt.bitAnd(rt.fv(f, "build_type", live(f.args[0])), 4))) {
		return live(f.dot);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["D"] });

rt.type(4184, "/datum/research/biogenerator", "/datum/research", {});

// /datum/research/biogenerator/proc/New  (code/modules/research/research.dm:165)  may sleep
rt.def("/datum/research/biogenerator/proc/New", function* New(f: Frame) {
	let _T: Value = null, path: Value = null, D: Value = null;
	let $e: any;
	f.vars = () => [_T, path, D, $e];
	_T = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/tech")])), T("/datum/tech")));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		rt.modSrcVar(f, "possible_tech", (yield* g.new_(f, live(_T), [live(f.src)])), add);
	}
	rt.endFor(f, 0);
	path = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/design")])), T("/datum/design")));
	while (($e = rt.next(f, 0)) !== undefined) {
		path = $e;
		rt.modSrcVar(f, "possible_designs", (D = (yield* g.new_(f, live(path), [live(f.src)]))), add);
		if ((truthy(rt.bitAnd(rt.fv(f, "build_type", live(D)), 32)) && truthy((rt.isIn(f, "initial", rt.fv(f, "category", live(D))) ? 1 : 0)))) {
			yield* g.srcCall(f, "AddDesign2Known", live(D));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/research/biogenerator/proc/AddDesign2Known  (code/modules/research/research.dm:174)
rt.def("/datum/research/biogenerator/proc/AddDesign2Known", function AddDesign2Known(f: Frame) {
	if (!truthy(rt.bitAnd(rt.fv(f, "build_type", live(f.args[0])), 32))) {
		return live(f.dot);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["D"] });

rt.type(4185, "/datum/research/smelter", "/datum/research", {});

// /datum/research/smelter/proc/New  (code/modules/research/research.dm:180)  may sleep
rt.def("/datum/research/smelter/proc/New", function* New(f: Frame) {
	let _T: Value = null, path: Value = null, D: Value = null;
	let $e: any;
	f.vars = () => [_T, path, D, $e];
	_T = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/tech")])), T("/datum/tech")));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		rt.modSrcVar(f, "possible_tech", (yield* g.new_(f, live(_T), [live(f.src)])), add);
	}
	rt.endFor(f, 0);
	path = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/design")])), T("/datum/design")));
	while (($e = rt.next(f, 0)) !== undefined) {
		path = $e;
		rt.modSrcVar(f, "possible_designs", (D = (yield* g.new_(f, live(path), [live(f.src)]))), add);
		if ((truthy(rt.bitAnd(rt.fv(f, "build_type", live(D)), 128)) && truthy((rt.isIn(f, "initial", rt.fv(f, "category", live(D))) ? 1 : 0)))) {
			yield* g.srcCall(f, "AddDesign2Known", live(D));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/research/smelter/proc/AddDesign2Known  (code/modules/research/research.dm:189)
rt.def("/datum/research/smelter/proc/AddDesign2Known", function AddDesign2Known(f: Frame) {
	if (!truthy(rt.bitAnd(rt.fv(f, "build_type", live(f.args[0])), 128))) {
		return live(f.dot);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["D"] });

rt.type(4186, "/datum/tech", "/datum", {
	name: "name",
	desc: "description",
	id: "id",
	level: 1,
	rare: 1,
	req_tech: null,
});

// /datum/tech/proc/<init>  (code/modules/research/research.dm:205)
rt.def("/datum/tech/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.list());
	return f.dot;
});

// /datum/tech/proc/getCost  (code/modules/research/research.dm:304)
rt.def("/datum/tech/proc/getCost", function getCost(f: Frame, current_level: Value) {
	let cost: Value = null, i: Value = null;
	f.vars = () => [current_level, cost, i];
	if (live(current_level) === null) {
		current_level = null;
	}
	if (!truthy(live(current_level))) {
		current_level = rt.initial(f, live(f.src), "level");
	}
	if (rt.ge(live(current_level), rt.sv(f, "level"))) {
		return 0;
	}
	cost = 0;
	i = null;
	i = add(live(current_level), 1);
	while (rt.le(live(i), rt.sv(f, "level"))) {
		if (!isEqual(live(i), rt.initial(f, live(f.src), "level"))) {
			cost = rt.modify(live(cost), multiply(live(i), rt.sv(f, "rare")), add);
		}
		i = rt.inc(live(i), 1);
	}
	return live(cost);
});

// /datum/tech/proc/copy  (code/modules/research/research.dm:319)  may sleep
rt.def("/datum/tech/proc/copy", function* copy(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	rt.setFv(f, "level", (_T = (yield* g.new_(f, rt.sv(f, "type"), []))), rt.sv(f, "level"));
	return live(_T);
}, true);

rt.type(6684, "/obj/item/weapon/disk/tech_disk", "/obj/item/weapon/disk", {
	tech_stored: null,
	max_tech_stored: 1,
	name: "technology disk",
	desc: "A disk for storing technology data for further research.",
	icon_state: "datadisk0",
	materials: null,
});

// /obj/item/weapon/disk/tech_disk/proc/<init>  (code/modules/research/research.dm:328)
rt.def("/obj/item/weapon/disk/tech_disk/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tech_stored", rt.list());
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 300, "$glass", 100]));
	return f.dot;
});

// /obj/item/weapon/disk/tech_disk/proc/Initialize  (code/modules/research/research.dm:332)  may sleep
rt.def("/obj/item/weapon/disk/tech_disk/proc/Initialize", function* Initialize(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "pixel_x", (yield* g.call(f, P("/proc/rand"), null, [-5, 5])));
	rt.setSv(f, "pixel_y", (yield* g.call(f, P("/proc/rand"), null, [-5, 5])));
	i = null;
	rt.forRange(f, 0, 1, rt.sv(f, "max_tech_stored"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		rt.modSrcVar(f, "tech_stored", null, add);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(6685, "/obj/item/weapon/disk/tech_disk/adv", "/obj/item/weapon/disk/tech_disk", {
	max_tech_stored: 5,
	name: "advanced technology disk",
	desc: "A disk for storing technology data for further research. This one has extra storage space.",
	materials: null,
});

// /obj/item/weapon/disk/tech_disk/adv/proc/<init>  (code/modules/research/research.dm:342)
rt.def("/obj/item/weapon/disk/tech_disk/adv/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 300, "$glass", 100, "$silver", 50]));
	return f.dot;
});

rt.type(6686, "/obj/item/weapon/disk/tech_disk/super_adv", "/obj/item/weapon/disk/tech_disk", {
	max_tech_stored: 10,
	name: "quantum technology disk",
	desc: "A disk for storing technology data for further research. This one has extremely large storage space.",
	materials: null,
});

// /obj/item/weapon/disk/tech_disk/super_adv/proc/<init>  (code/modules/research/research.dm:348)
rt.def("/obj/item/weapon/disk/tech_disk/super_adv/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 300, "$glass", 100, "$silver", 100, "$gold", 100]));
	return f.dot;
});

rt.type(6687, "/obj/item/weapon/disk/tech_disk/debug", "/obj/item/weapon/disk/tech_disk", {
	max_tech_stored: 0,
	name: "centcomm technology disk",
	desc: "A debug item for research",
	materials: null,
});

// /obj/item/weapon/disk/tech_disk/debug/proc/<init>  (code/modules/research/research.dm:354)
rt.def("/obj/item/weapon/disk/tech_disk/debug/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.list());
	return f.dot;
});

// /obj/item/weapon/disk/tech_disk/debug/proc/Initialize  (code/modules/research/research.dm:358)  may sleep
rt.def("/obj/item/weapon/disk/tech_disk/debug/proc/Initialize", function* Initialize(f: Frame) {
	let techs: Value = null, V: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [techs, V, _T, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "max_tech_stored", rt.getLen(f, (techs = subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/tech")])), T("/datum/tech")))));
	V = null;
	rt.forList(f, 0, live(techs));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		rt.modSrcVar(f, "tech_stored", (_T = (yield* g.new_(f, live(V), []))), add);
		rt.setFv(f, "level", live(_T), 8);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
