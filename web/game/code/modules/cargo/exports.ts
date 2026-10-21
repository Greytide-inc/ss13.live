// From code/modules/cargo/exports.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/export_item_and_contents  (code/modules/cargo/exports.dm:30)  may sleep
rt.def("/proc/export_item_and_contents", function* export_item_and_contents(f: Frame, AM: Value, contraband: Value, emagged: Value, dry_run: Value) {
	let sold_str: Value = null, cost: Value = null, contents: Value = null, i: Value = null, thing: Value = null, E: Value = null;
	let $e: any;
	f.vars = () => [AM, contraband, emagged, dry_run, sold_str, cost, contents, i, thing, E, $e];
	if (live(dry_run) === null) {
		dry_run = 0;
	}
	if (!truthy(rt.len(f, rt.gl("exports_list")))) {
		yield* g.call(f, P("/proc/setupExports"), null, []);
	}
	sold_str = "";
	cost = 0;
	contents = (yield* g.callName(f, live(AM), "GetAllContents", []));
	i = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/reverseRange"), null, [live(contents)])));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		thing = live(i);
		E = null;
		rt.forList(f, 1, rt.gl("exports_list"), T("/datum/export"));
		while (($e = rt.next(f, 1)) !== undefined) {
			E = $e;
			if (!truthy(live(E))) {
				continue;
			}
			if (truthy((yield* g.callName(f, live(E), "applies_to", [live(thing), live(contraband), live(emagged)])))) {
				if (truthy(live(dry_run))) {
					cost = rt.modify(live(cost), (yield* g.callName(f, live(E), "get_cost", [live(thing), live(contraband), live(emagged)])), add);
				} else {
					yield* g.callName(f, live(E), "sell_object", [live(thing), live(contraband), live(emagged)]);
					sold_str = rt.modify(live(sold_str), fmt(" ＀", [rt.fv(f, "name", live(thing))]), add);
				}
				break;
			}
		}
		rt.endFor(f, 1);
		if (!truthy(live(dry_run))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(thing)]);
		}
	}
	rt.endFor(f, 0);
	if (truthy(live(dry_run))) {
		return live(cost);
	} else {
		return live(sold_str);
	}
	return f.dot;
}, true);

rt.type(1944, "/datum/export", "/datum", {
	unit_name: "",
	message: "",
	cost: 100,
	k_elasticity: 0.033333335,
	contraband: 0,
	emagged: 0,
	export_types: null,
	include_subtypes: 1,
	exclude_types: null,
	total_cost: 0,
	total_amount: 0,
	init_cost: null,
});

// /datum/export/proc/<init>  (code/modules/cargo/exports.dm:66)
rt.def("/datum/export/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list());
	$0 = $0;
	rt.setSv(f, "exclude_types", rt.list());
	return f.dot;
});

// /datum/export/proc/New  (code/modules/cargo/exports.dm:76)
rt.def("/datum/export/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modField(f, rt.gl("SSprocessing"), "processing", live(f.src), add);
	rt.setSv(f, "init_cost", rt.sv(f, "cost"));
	rt.setSv(f, "export_types", rt.call(f, P("/proc/typecacheof"), null, [rt.sv(f, "export_types")]));
	rt.setSv(f, "exclude_types", rt.call(f, P("/proc/typecacheof"), null, [rt.sv(f, "exclude_types")]));
	return f.dot;
});

// /datum/export/proc/Destroy  (code/modules/cargo/exports.dm:84)  may sleep
rt.def("/datum/export/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modField(f, rt.gl("SSprocessing"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/export/proc/process  (code/modules/cargo/exports.dm:88)
rt.def("/datum/export/proc/process", function process(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	(rt.modSrcVar(f, "cost", rt.power(rt.gl("E"), multiply(rt.sv(f, "k_elasticity"), 0.03333333507180214)), multiply));
	if (!rt.gt(rt.sv(f, "cost"), rt.sv(f, "init_cost"))) return f.dot;
	rt.setSv(f, "cost", rt.sv(f, "init_cost"));
	return f.dot;
}, false, { waitfor: false });

// /datum/export/proc/get_cost  (code/modules/cargo/exports.dm:95)
rt.def("/datum/export/proc/get_cost", function get_cost(f: Frame, O: Value, contr: Value, emag: Value) {
	let amount: Value = null;
	f.vars = () => [contr, emag, amount];
	if (live(contr) === null) {
		contr = 0;
	}
	if (live(emag) === null) {
		emag = 0;
	}
	amount = rt.callSrc(f, "get_amount", [live(O), live(contr), live(emag)]);
	if (!isEqual(rt.sv(f, "k_elasticity"), 0)) {
		return rt.call(f, P("/proc/round"), null, [multiply(divide(rt.sv(f, "cost"), rt.sv(f, "k_elasticity")), subtract(1, rt.power(rt.gl("E"), multiply(multiply(-1, rt.sv(f, "k_elasticity")), live(amount)))))]);
	}
	return rt.call(f, P("/proc/round"), null, [multiply(rt.sv(f, "cost"), live(amount))]);
});

// /datum/export/proc/applies_to  (code/modules/cargo/exports.dm:108)
rt.def("/datum/export/proc/applies_to", function applies_to(f: Frame, O: Value, contr: Value, emag: Value) {
	let $0: any;
	f.vars = () => [contr, emag, $0];
	if (live(contr) === null) {
		contr = 0;
	}
	if (live(emag) === null) {
		emag = 0;
	}
	if ((truthy(rt.sv(f, "contraband")) && !truthy(live(contr)))) {
		return 0;
	}
	if ((truthy(rt.sv(f, "emagged")) && !truthy(live(emag)))) {
		return 0;
	}
	if ((!truthy(rt.sv(f, "include_subtypes")) && !truthy((rt.isIn(f, rt.fv(f, "type", live(O)), rt.sv(f, "export_types")) ? 1 : 0)))) {
		return 0;
	}
	if ((truthy(rt.sv(f, "include_subtypes")) && (!truthy(rt.call(f, P("/proc/is_type_in_typecache"), null, [live(O), rt.sv(f, "export_types")])) || truthy(rt.call(f, P("/proc/is_type_in_typecache"), null, [live(O), rt.sv(f, "exclude_types")]))))) {
		return 0;
	}
	if (!truthy(rt.callSrc(f, "get_cost", [live(O), live(contr), live(emag)]))) {
		return 0;
	}
	if (truthy(rt.fv(f, "secondary_flags", live(O)))) {
		$0 = rt.index(rt.fv(f, "secondary_flags", live(O)), "hologram");
	} else {
		$0 = 0;
	}
	if (truthy($0)) {
		return 0;
	}
	return 1;
});

// /datum/export/proc/sell_object  (code/modules/cargo/exports.dm:126)
rt.def("/datum/export/proc/sell_object", function sell_object(f: Frame, O: Value, contr: Value, emag: Value) {
	let the_cost: Value = null, amount: Value = null;
	f.vars = () => [contr, emag, the_cost, amount];
	if (live(contr) === null) {
		contr = 0;
	}
	if (live(emag) === null) {
		emag = 0;
	}
	the_cost = rt.callSrc(f, "get_cost", [live(O)]);
	amount = rt.callSrc(f, "get_amount", [live(O)]);
	rt.modSrcVar(f, "total_cost", live(the_cost), add);
	if (truthy((rt.istype(live(O), T("/datum/export/material")) ? 1 : 0))) {
		rt.modSrcVar(f, "total_amount", multiply(live(amount), 2000), add);
	} else {
		rt.modSrcVar(f, "total_amount", live(amount), add);
	}
	(rt.modSrcVar(f, "cost", rt.power(rt.gl("E"), multiply(multiply(-1, rt.sv(f, "k_elasticity")), live(amount))), multiply));
	return f.dot;
});

// /datum/export/proc/total_printout  (code/modules/cargo/exports.dm:142)
rt.def("/datum/export/proc/total_printout", function total_printout(f: Frame, contr: Value, emag: Value) {
	let msg: Value = null;
	f.vars = () => [contr, emag, msg];
	if (live(contr) === null) {
		contr = 0;
	}
	if (live(emag) === null) {
		emag = 0;
	}
	if ((!truthy(rt.sv(f, "total_cost")) && !truthy(rt.sv(f, "total_amount")))) {
		return "";
	}
	msg = fmt("＀ credits: Received ＀ ", [rt.sv(f, "total_cost"), rt.sv(f, "total_amount")]);
	if (rt.gt(rt.sv(f, "total_cost"), 0)) {
		msg = add("+", live(msg));
	}
	if (truthy(rt.sv(f, "unit_name"))) {
		msg = rt.modify(live(msg), rt.sv(f, "unit_name"), add);
		if (rt.gt(rt.sv(f, "total_amount"), 1)) {
			msg = rt.modify(live(msg), "s", add);
		}
		if (truthy(rt.sv(f, "message"))) {
			msg = rt.modify(live(msg), " ", add);
		}
	}
	if (truthy(rt.sv(f, "message"))) {
		msg = rt.modify(live(msg), rt.sv(f, "message"), add);
	}
	return (msg = rt.modify(live(msg), ".", add));
});

// /datum/controller/global_vars/proc/InitGlobalexports_list  (code/modules/cargo/exports.dm:166)
rt.def("/datum/controller/global_vars/proc/InitGlobalexports_list", function InitGlobalexports_list(f: Frame) {
	rt.setGl("exports_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "exports_list", add);
	return f.dot;
});

// /proc/setupExports  (code/modules/cargo/exports.dm:169)  may sleep
rt.def("/proc/setupExports", function* setupExports(f: Frame) {
	let subtype: Value = null, E: Value = null;
	let $e: any;
	f.vars = () => [subtype, E, $e];
	subtype = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/export")])), T("/datum/export")));
	while (($e = rt.next(f, 0)) !== undefined) {
		subtype = $e;
		if ((truthy(rt.gv(f, "export_types", (E = (yield* g.new_(f, live(subtype), []))))) && truthy(rt.getLen(f, rt.fv(f, "export_types", live(E)))))) {
			rt.modGl("exports_list", live(E), add);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
