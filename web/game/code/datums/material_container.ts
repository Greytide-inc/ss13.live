// From code/datums/material_container.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(574, "/datum/material_container", "/datum", {
	total_amount: 0,
	max_amount: null,
	sheet_type: null,
	owner: null,
	materials: null,
});

// /datum/material_container/proc/<init>  (code/datums/material_container.dm:17)
rt.def("/datum/material_container/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.list());
	return f.dot;
});

// /datum/material_container/proc/New  (code/datums/material_container.dm:22)  may sleep
rt.def("/datum/material_container/proc/New", function* New(f: Frame, O: Value, mat_list: Value, max_amt: Value) {
	let possible_mats: Value = null, mat_type: Value = null, MT: Value = null, id: Value = null, mat_path: Value = null;
	let $e: any;
	f.vars = () => [O, mat_list, max_amt, possible_mats, mat_type, MT, id, mat_path, $e];
	if (live(max_amt) === null) {
		max_amt = 0;
	}
	rt.setSv(f, "owner", live(O));
	rt.setSv(f, "max_amount", (yield* g.call(f, P("/proc/max"), null, [0, live(max_amt)])));
	possible_mats = rt.list();
	mat_type = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/material")])), T("/datum/material")));
	while (($e = rt.next(f, 0)) !== undefined) {
		mat_type = $e;
		MT = live(mat_type);
		rt.setAt(live(possible_mats), rt.initial(f, live(MT), "id"), live(mat_type));
	}
	rt.endFor(f, 0);
	id = null;
	rt.forList(f, 0, live(mat_list));
	while (($e = rt.next(f, 0)) !== undefined) {
		id = $e;
		if (truthy(rt.index(live(possible_mats), live(id)))) {
			mat_path = rt.index(live(possible_mats), live(id));
			rt.setAt(rt.sv(f, "materials"), live(id), (yield* g.new_(f, live(mat_path), [])));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/material_container/proc/Destroy  (code/datums/material_container.dm:36)  may sleep
rt.def("/datum/material_container/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "owner", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/material_container/proc/insert_amount  (code/datums/material_container.dm:40)
rt.def("/datum/material_container/proc/insert_amount", function insert_amount(f: Frame, amt: Value, id: Value) {
	let total_amount_saved: Value = null, M: Value = null, i: Value = null, M_2: Value = null;
	let $e: any;
	f.vars = () => [id, total_amount_saved, M, i, M_2, $e];
	if (live(id) === null) {
		id = null;
	}
	if ((rt.gt(live(amt), 0) && truthy(rt.callSrc(f, "has_space", [live(amt)])))) {
		total_amount_saved = rt.sv(f, "total_amount");
		if (truthy(live(id))) {
			if (truthy((M = rt.index(rt.sv(f, "materials"), live(id))))) {
				rt.modField(f, live(M), "amount", live(amt), add);
				rt.modSrcVar(f, "total_amount", live(amt), add);
			}
		} else {
			i = null;
			rt.forList(f, 0, rt.sv(f, "materials"));
			while (($e = rt.next(f, 0)) !== undefined) {
				i = $e;
				rt.modField(f, (M_2 = rt.index(rt.sv(f, "materials"), live(i))), "amount", live(amt), add);
				rt.modSrcVar(f, "total_amount", live(amt), add);
			}
			rt.endFor(f, 0);
		}
		return subtract(rt.sv(f, "total_amount"), live(total_amount_saved));
	}
	return 0;
});

// /datum/material_container/proc/insert_stack  (code/datums/material_container.dm:56)  may sleep
rt.def("/datum/material_container/proc/insert_stack", function* insert_stack(f: Frame, S: Value, amt: Value) {
	let material_amt: Value = null;
	f.vars = () => [S, amt, material_amt];
	if (live(amt) === null) {
		amt = 0;
	}
	if (rt.le(live(amt), 0)) {
		return 0;
	}
	if (rt.gt(live(amt), rt.fv(f, "amount", live(S)))) {
		amt = rt.fv(f, "amount", live(S));
	}
	if (!truthy((material_amt = (yield* g.srcCall(f, "get_item_material_amount", live(S)))))) {
		return 0;
	}
	if (!truthy((amt = (yield* g.call(f, P("/proc/min"), null, [live(amt), (yield* g.call(f, P("/proc/round"), null, [divide(subtract(rt.sv(f, "max_amount"), rt.sv(f, "total_amount")), live(material_amt))]))]))))) {
		return 0;
	}
	yield* g.srcCall(f, "insert_materials", live(S), live(amt));
	yield* g.callName(f, live(S), "use", [live(amt)]);
	return live(amt);
}, true);

// /datum/material_container/proc/insert_item  (code/datums/material_container.dm:74)  may sleep
rt.def("/datum/material_container/proc/insert_item", function* insert_item(f: Frame, I: Value, multiplier: Value) {
	let S: Value = null, material_amount: Value = null;
	f.vars = () => [I, multiplier, S, material_amount];
	if (live(multiplier) === null) {
		multiplier = 1;
	}
	if (!truthy(live(I))) {
		return 0;
	}
	if (truthy((rt.istype(live(I), T("/obj/item/stack")) ? 1 : 0))) {
		S = live(I);
		return (yield* g.srcCall(f, "insert_stack", live(I), rt.fv(f, "amount", live(S))));
	}
	if ((!truthy((material_amount = (yield* g.srcCall(f, "get_item_material_amount", live(I))))) || !truthy((yield* g.srcCall(f, "has_space", live(material_amount)))))) {
		return 0;
	}
	yield* g.srcCall(f, "insert_materials", live(I), live(multiplier));
	return live(material_amount);
}, true);

// /datum/material_container/proc/insert_materials  (code/datums/material_container.dm:89)
rt.def("/datum/material_container/proc/insert_materials", function insert_materials(f: Frame, I: Value, multiplier: Value) {
	let M: Value = null, MAT: Value = null;
	let $e: any;
	f.vars = () => [multiplier, M, MAT, $e];
	if (live(multiplier) === null) {
		multiplier = 1;
	}
	M = null;
	MAT = null;
	rt.forList(f, 0, rt.sv(f, "materials"));
	while (($e = rt.next(f, 0)) !== undefined) {
		MAT = $e;
		rt.modField(f, (M = rt.index(rt.sv(f, "materials"), live(MAT))), "amount", multiply(rt.index(rt.fv(f, "materials", live(I)), live(MAT)), live(multiplier)), add);
		rt.modSrcVar(f, "total_amount", multiply(rt.index(rt.fv(f, "materials", live(I)), live(MAT)), live(multiplier)), add);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/material_container/proc/use_amount  (code/datums/material_container.dm:97)
rt.def("/datum/material_container/proc/use_amount", function use_amount(f: Frame, mats: Value, multiplier: Value) {
	let M: Value = null, MAT: Value = null, total_amount_save: Value = null, MAT_2: Value = null;
	let $e: any;
	f.vars = () => [multiplier, M, MAT, total_amount_save, MAT_2, $e];
	if (live(multiplier) === null) {
		multiplier = 1;
	}
	if ((!truthy(live(mats)) || !truthy(rt.len(f, live(mats))))) {
		return 0;
	}
	M = null;
	MAT = null;
	rt.forList(f, 0, rt.sv(f, "materials"));
	while (($e = rt.next(f, 0)) !== undefined) {
		MAT = $e;
		if (rt.lt(rt.gv(f, "amount", (M = rt.index(rt.sv(f, "materials"), live(MAT)))), multiply(rt.index(live(mats), live(MAT)), live(multiplier)))) {
			return 0;
		}
	}
	rt.endFor(f, 0);
	total_amount_save = rt.sv(f, "total_amount");
	MAT_2 = null;
	rt.forList(f, 0, rt.sv(f, "materials"));
	while (($e = rt.next(f, 0)) !== undefined) {
		MAT_2 = $e;
		(rt.modField(f, (M = rt.index(rt.sv(f, "materials"), live(MAT_2))), "amount", multiply(rt.index(live(mats), live(MAT_2)), live(multiplier)), subtract));
		(rt.modSrcVar(f, "total_amount", multiply(rt.index(live(mats), live(MAT_2)), live(multiplier)), subtract));
	}
	rt.endFor(f, 0);
	return subtract(live(total_amount_save), rt.sv(f, "total_amount"));
});

// /datum/material_container/proc/use_amount_type  (code/datums/material_container.dm:116)
rt.def("/datum/material_container/proc/use_amount_type", function use_amount_type(f: Frame, amt: Value, id: Value) {
	let M: Value = null;
	f.vars = () => [M];
	if (truthy((M = rt.index(rt.sv(f, "materials"), live(id))))) {
		if (rt.ge(rt.fv(f, "amount", live(M)), live(amt))) {
			(rt.modField(f, live(M), "amount", live(amt), subtract));
			(rt.modSrcVar(f, "total_amount", live(amt), subtract));
			return live(amt);
		}
	}
	return 0;
});

// /datum/material_container/proc/can_use_amount  (code/datums/material_container.dm:125)
rt.def("/datum/material_container/proc/can_use_amount", function can_use_amount(f: Frame, amt: Value, id: Value, mats: Value) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	if ((truthy(live(amt)) && truthy(live(id)))) {
		if ((truthy((M = rt.index(rt.sv(f, "materials"), live(id)))) && rt.ge(rt.fv(f, "amount", live(M)), live(amt)))) {
			return 1;
		}
	} else {
		if (truthy((rt.istype(live(mats), T("/list")) ? 1 : 0))) {
			M = null;
			rt.forList(f, 0, live(mats));
			while (($e = rt.next(f, 0)) !== undefined) {
				M = $e;
				if ((truthy(rt.index(rt.sv(f, "materials"), live(M))) && rt.le(rt.index(live(mats), live(M)), rt.index(rt.sv(f, "materials"), live(M))))) {
					continue;
				}
				return 0;
			}
			rt.endFor(f, 0);
			return 1;
		}
	}
	return 0;
});

// /datum/material_container/proc/retrieve  (code/datums/material_container.dm:140)  may sleep
rt.def("/datum/material_container/proc/retrieve", function* retrieve(f: Frame, sheet_amt: Value, M: Value, target: Value) {
	let count: Value = null, s: Value = null;
	f.vars = () => [sheet_amt, M, target, count, s];
	if (live(target) === null) {
		target = null;
	}
	if (!truthy(rt.fv(f, "sheet_type", live(M)))) {
		return 0;
	}
	if (typeof sheet_amt === "number") sheet_amt = Math.floor(sheet_amt); // tg_js: whole sheets only (1.5 made a stack of 1.5); NaN and Infinity fall out below
	if (typeof sheet_amt === "number" && !Number.isFinite(sheet_amt) && sheet_amt > 0) sheet_amt = 1e9; // clamped to the stock just below
	if (rt.gt(live(sheet_amt), 0)) {
		if (rt.lt(rt.fv(f, "amount", live(M)), multiply(live(sheet_amt), 2000))) {
			sheet_amt = (yield* g.call(f, P("/proc/round"), null, [divide(rt.fv(f, "amount", live(M)), 2000)]));
		}
		count = 0;
		while (rt.gt(live(sheet_amt), 50)) {
			yield* g.new_(f, rt.fv(f, "sheet_type", live(M)), [rt.getStep(f, rt.sv(f, "owner"), 0), 50]);
			count = rt.modify(live(count), 50, add);
			yield* g.srcCall(f, "use_amount_type", 50 * 2000, rt.fv(f, "id", live(M))); // tg_js: charge the 50 handed out (it charged the whole remaining amount)
			(sheet_amt = rt.modify(live(sheet_amt), 50, subtract));
		}
		if (truthy((yield* g.call(f, P("/proc/round"), null, [divide(multiply(live(sheet_amt), 2000), 2000)])))) {
			s = (yield* g.new_(f, rt.fv(f, "sheet_type", live(M)), [rt.getStep(f, rt.sv(f, "owner"), 0), live(sheet_amt)]));
			if (truthy(live(target))) {
				yield* g.callName(f, live(s), "forceMove", [live(target)]);
			}
			count = rt.modify(live(count), live(sheet_amt), add);
			yield* g.srcCall(f, "use_amount_type", multiply(live(sheet_amt), 2000), rt.fv(f, "id", live(M)));
		}
		return live(count);
	}
	return 0;
}, true);

// /datum/material_container/proc/retrieve_sheets  (code/datums/material_container.dm:161)  may sleep
rt.def("/datum/material_container/proc/retrieve_sheets", function* retrieve_sheets(f: Frame, sheet_amt: Value, id: Value, target: Value) {
	f.vars = () => [sheet_amt, id, target];
	if (live(target) === null) {
		target = null;
	}
	if (truthy(rt.index(rt.sv(f, "materials"), live(id)))) {
		return (yield* g.srcCall(f, "retrieve", live(sheet_amt), rt.index(rt.sv(f, "materials"), live(id)), live(target)));
	}
	return 0;
}, true);

// /datum/material_container/proc/retrieve_amount  (code/datums/material_container.dm:166)  may sleep
rt.def("/datum/material_container/proc/retrieve_amount", function* retrieve_amount(f: Frame, amt: Value, id: Value, target: Value) {
	f.vars = () => [amt, id, target];
	return (yield* g.srcCall(f, "retrieve_sheets", (yield* g.srcCall(f, "amount2sheet", live(amt))), live(id), live(target)));
}, true);

// /datum/material_container/proc/retrieve_all  (code/datums/material_container.dm:171)  may sleep
rt.def("/datum/material_container/proc/retrieve_all", function* retrieve_all(f: Frame, target: Value) {
	let result: Value = null, M: Value = null, MAT: Value = null;
	let $e: any;
	f.vars = () => [target, result, M, MAT, $e];
	if (live(target) === null) {
		target = null;
	}
	result = 0;
	M = null;
	MAT = null;
	rt.forList(f, 0, rt.sv(f, "materials"));
	while (($e = rt.next(f, 0)) !== undefined) {
		MAT = $e;
		result = rt.modify(live(result), (yield* g.srcCall(f, "retrieve_sheets", (yield* g.srcCall(f, "amount2sheet", rt.gv(f, "amount", (M = rt.index(rt.sv(f, "materials"), live(MAT)))))), live(MAT), live(target))), add);
	}
	rt.endFor(f, 0);
	return live(result);
}, true);

// /datum/material_container/proc/has_space  (code/datums/material_container.dm:177)
rt.def("/datum/material_container/proc/has_space", function has_space(f: Frame, amt: Value) {
	f.vars = () => [amt];
	if (live(amt) === null) {
		amt = 0;
	}
	return (rt.le(add(rt.sv(f, "total_amount"), live(amt)), rt.sv(f, "max_amount")) ? 1 : 0);
});

// /datum/material_container/proc/has_materials  (code/datums/material_container.dm:180)
rt.def("/datum/material_container/proc/has_materials", function has_materials(f: Frame, mats: Value, multiplier: Value) {
	let M: Value = null, MAT: Value = null;
	let $e: any;
	f.vars = () => [multiplier, M, MAT, $e];
	if (live(multiplier) === null) {
		multiplier = 1;
	}
	if ((!truthy(live(mats)) || !truthy(rt.len(f, live(mats))))) {
		return 0;
	}
	M = null;
	MAT = null;
	rt.forList(f, 0, live(mats));
	while (($e = rt.next(f, 0)) !== undefined) {
		MAT = $e;
		if (rt.lt(rt.gv(f, "amount", (M = rt.index(rt.sv(f, "materials"), live(MAT)))), multiply(rt.index(live(mats), live(MAT)), live(multiplier)))) {
			return 0;
		}
	}
	rt.endFor(f, 0);
	return 1;
});

// /datum/material_container/proc/amount2sheet  (code/datums/material_container.dm:191)
rt.def("/datum/material_container/proc/amount2sheet", function amount2sheet(f: Frame, amt: Value) {
	if (rt.ge(live(amt), 2000)) {
		return rt.call(f, P("/proc/round"), null, [divide(live(amt), 2000)]);
	}
	return 0;
});

// /datum/material_container/proc/sheet2amount  (code/datums/material_container.dm:196)
rt.def("/datum/material_container/proc/sheet2amount", function sheet2amount(f: Frame, sheet_amt: Value) {
	if (rt.gt(live(sheet_amt), 0)) {
		return multiply(live(sheet_amt), 2000);
	}
	return 0;
});

// /datum/material_container/proc/amount  (code/datums/material_container.dm:201)
rt.def("/datum/material_container/proc/amount", function amount(f: Frame, id: Value) {
	let M: Value = null;
	let $0: any;
	f.vars = () => [M, $0];
	if (truthy((M = rt.index(rt.sv(f, "materials"), live(id))))) {
		$0 = rt.fv(f, "amount", live(M));
	} else {
		$0 = 0;
	}
	return $0;
});

// /datum/material_container/proc/get_item_material_amount  (code/datums/material_container.dm:207)
rt.def("/datum/material_container/proc/get_item_material_amount", function get_item_material_amount(f: Frame, I: Value) {
	let material_amount: Value = null, MAT: Value = null;
	let $e: any;
	f.vars = () => [material_amount, MAT, $e];
	if (!truthy((rt.istype(live(I), T("/obj/item")) ? 1 : 0))) {
		return 0;
	}
	material_amount = 0;
	MAT = null;
	rt.forList(f, 0, rt.sv(f, "materials"));
	while (($e = rt.next(f, 0)) !== undefined) {
		MAT = $e;
		material_amount = rt.modify(live(material_amount), rt.index(rt.fv(f, "materials", live(I)), live(MAT)), add);
	}
	rt.endFor(f, 0);
	return live(material_amount);
});
