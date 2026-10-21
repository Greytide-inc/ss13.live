// From code/modules/power/cell.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5707, "/obj/item/weapon/stock_parts/cell", "/obj/item/weapon/stock_parts", {
	charge: 0,
	maxcharge: 1000,
	rigged: 0,
	chargerate: 100,
	self_recharge: 0,
	ratingdesc: 1,
	grown_battery: 0,
	throw_speed: 2,
	throw_range: 5,
	name: "power cell",
	desc: "A rechargable electrochemical power cell.",
	icon: rt.rsc("icons/obj/power.dmi"),
	icon_state: "cell",
	item_state: "cell",
	origin_tech: "powerstorage=1",
	force: 5,
	throwforce: 5,
	w_class: 2,
	materials: null,
});

// /obj/item/weapon/stock_parts/cell/proc/<init>  (code/modules/power/cell.dm:15)
rt.def("/obj/item/weapon/stock_parts/cell/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 700, "$glass", 50]));
	return f.dot;
});

// /obj/item/weapon/stock_parts/cell/proc/New  (code/modules/power/cell.dm:26)  may sleep
rt.def("/obj/item/weapon/stock_parts/cell/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	}
	rt.setSv(f, "charge", rt.sv(f, "maxcharge"));
	if (truthy(rt.sv(f, "ratingdesc"))) {
		rt.modSrcVar(f, "desc", fmt(" This one has a power rating of ＀, and you should not swallow it.", [rt.sv(f, "maxcharge")]), add);
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/weapon/stock_parts/cell/proc/Destroy  (code/modules/power/cell.dm:34)  may sleep
rt.def("/obj/item/weapon/stock_parts/cell/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/weapon/stock_parts/cell/proc/vv_edit_var  (code/modules/power/cell.dm:38)  may sleep
rt.def("/obj/item/weapon/stock_parts/cell/proc/vv_edit_var", function* vv_edit_var(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(f.args[0]);
	if ($0 === "self_recharge") {
		if (truthy(live(f.args[1]))) {
			if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
				rt.setFv(f, "isprocessing", live(f.src), 1);
				rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
			}
		} else {
			rt.setFv(f, "isprocessing", live(f.src), 0);
			(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
		}
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["var_name", "var_value"] });

// /obj/item/weapon/stock_parts/cell/proc/process  (code/modules/power/cell.dm:48)  may sleep
rt.def("/obj/item/weapon/stock_parts/cell/proc/process", function* process(f: Frame) {
	if (truthy(rt.sv(f, "self_recharge"))) {
		yield* g.srcCall(f, "give", multiply(rt.sv(f, "chargerate"), 0.25));
	} else {
		return 26;
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/item/weapon/stock_parts/cell/proc/update_icon  (code/modules/power/cell.dm:53)
rt.def("/obj/item/weapon/stock_parts/cell/proc/update_icon", function update_icon(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.sv(f, "grown_battery"))) {
		rt.callSrc(f, "add_overlay", ["grown_wires"]);
	}
	if (rt.lt(rt.sv(f, "charge"), 0.009999999776482582)) {
		return live(f.dot);
	} else {
		if (rt.ge(divide(rt.sv(f, "charge"), rt.sv(f, "maxcharge")), 0.9950000047683716)) {
			rt.callSrc(f, "add_overlay", ["cell-o2"]);
		} else {
			rt.callSrc(f, "add_overlay", ["cell-o1"]);
		}
	}
	return f.dot;
});

// /obj/item/weapon/stock_parts/cell/proc/percent  (code/modules/power/cell.dm:64)
rt.def("/obj/item/weapon/stock_parts/cell/proc/percent", function percent(f: Frame) {
	return divide(multiply(100, rt.sv(f, "charge")), rt.sv(f, "maxcharge"));
});

// /obj/item/weapon/stock_parts/cell/proc/use  (code/modules/power/cell.dm:68)  may sleep
rt.def("/obj/item/weapon/stock_parts/cell/proc/use", function* use(f: Frame, amount: Value) {
	f.vars = () => [amount];
	if ((truthy(rt.sv(f, "rigged")) && rt.gt(live(amount), 0))) {
		yield* g.srcCall(f, "explode");
		return 0;
	}
	if (rt.lt(rt.sv(f, "charge"), live(amount))) {
		return 0;
	}
	rt.setSv(f, "charge", subtract(rt.sv(f, "charge"), live(amount)));
	return 1;
}, true);

// /obj/item/weapon/stock_parts/cell/proc/give  (code/modules/power/cell.dm:80)  may sleep
rt.def("/obj/item/weapon/stock_parts/cell/proc/give", function* give(f: Frame, amount: Value) {
	let power_used: Value = null;
	f.vars = () => [amount, power_used];
	if ((truthy(rt.sv(f, "rigged")) && rt.gt(live(amount), 0))) {
		yield* g.srcCall(f, "explode");
		return 0;
	}
	if (rt.lt(rt.sv(f, "maxcharge"), live(amount))) {
		amount = rt.sv(f, "maxcharge");
	}
	rt.modSrcVar(f, "charge", (power_used = (yield* g.call(f, P("/proc/min"), null, [subtract(rt.sv(f, "maxcharge"), rt.sv(f, "charge")), live(amount)]))), add);
	return live(power_used);
}, true);

// /obj/item/weapon/stock_parts/cell/proc/examine  (code/modules/power/cell.dm:90)
rt.def("/obj/item/weapon/stock_parts/cell/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "rigged"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='danger'>This power cell seems to be faulty!</span>"]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("The charge meter reads ＀%.", [rt.call(f, P("/proc/round"), null, [rt.callName(f, live(f.src), "percent", [])])])]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/stock_parts/cell/proc/suicide_act  (code/modules/power/cell.dm:97)
rt.def("/obj/item/weapon/stock_parts/cell/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is licking the electrodes of ＀! It looks like ＀ trying to commit suicide!</span>", [live(user), live(f.src), rt.callName(f, live(user), "p_theyre", [])])]);
	return 2;
});

// /obj/item/weapon/stock_parts/cell/proc/attackby  (code/modules/power/cell.dm:101)  may sleep
rt.def("/obj/item/weapon/stock_parts/cell/proc/attackby", function* attackby(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/syringe")) ? 1 : 0))) return f.dot;
	S = live(f.args[0]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You inject the solution into the power cell.</span>"]);
	if (truthy((yield* g.callName(f, rt.fv(f, "reagents", live(S)), "has_reagent", ["plasma", 5])))) {
		rt.setSv(f, "rigged", 1);
	}
	yield* g.callName(f, rt.fv(f, "reagents", live(S)), "clear_reagents", []);
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/weapon/stock_parts/cell/proc/explode  (code/modules/power/cell.dm:111)  may sleep
rt.def("/obj/item/weapon/stock_parts/cell/proc/explode", function* explode(f: Frame) {
	let _T: Value = null, devastation_range: Value = null, heavy_impact_range: Value = null, light_impact_range: Value = null, flash_range: Value = null;
	f.vars = () => [_T, devastation_range, heavy_impact_range, light_impact_range, flash_range];
	_T = rt.getStep(f, rt.fv(f, "loc", live(f.src)), 0);
	if (isEqual(rt.sv(f, "charge"), 0)) {
		return live(f.dot);
	}
	devastation_range = -1;
	heavy_impact_range = (yield* g.call(f, P("/proc/round"), null, [divide(rt.op(f, "Sqrt", [], [rt.sv(f, "charge")]), 60)]));
	light_impact_range = (yield* g.call(f, P("/proc/round"), null, [divide(rt.op(f, "Sqrt", [], [rt.sv(f, "charge")]), 30)]));
	flash_range = live(light_impact_range);
	if (isEqual(live(light_impact_range), 0)) {
		rt.setSv(f, "rigged", 0);
		yield* g.srcCall(f, "corrupt");
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/explosion"), null, [live(_T), live(devastation_range), live(heavy_impact_range), live(light_impact_range), live(flash_range)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/stock_parts/cell/proc/corrupt  (code/modules/power/cell.dm:133)
rt.def("/obj/item/weapon/stock_parts/cell/proc/corrupt", function corrupt(f: Frame) {
	(rt.modSrcVar(f, "charge", 2, divide));
	rt.setSv(f, "maxcharge", rt.call(f, P("/proc/max"), null, [divide(rt.sv(f, "maxcharge"), 2), rt.sv(f, "chargerate")]));
	if (!truthy(rt.op(f, "Prob", [], [10]))) return f.dot;
	rt.setSv(f, "rigged", 1);
	return f.dot;
});

// /obj/item/weapon/stock_parts/cell/proc/emp_act  (code/modules/power/cell.dm:139)  may sleep
rt.def("/obj/item/weapon/stock_parts/cell/proc/emp_act", function* emp_act(f: Frame) {
	(rt.modSrcVar(f, "charge", divide(1000, live(f.args[0])), subtract));
	if (rt.lt(rt.sv(f, "charge"), 0)) {
		rt.setSv(f, "charge", 0);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

// /obj/item/weapon/stock_parts/cell/proc/ex_act  (code/modules/power/cell.dm:145)
rt.def("/obj/item/weapon/stock_parts/cell/proc/ex_act", function ex_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) return f.dot;
	$0 = live(f.args[0]);
	if ($0 === 2) {
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			rt.callSrc(f, "corrupt", []);
		}
	} else if ($0 === 3) {
		if (!truthy(rt.op(f, "Prob", [], [25]))) return f.dot;
		rt.callSrc(f, "corrupt", []);
	}
	return f.dot;
}, false, { args: ["severity", "target"], waitfor: false });

// /obj/item/weapon/stock_parts/cell/proc/blob_act  (code/modules/power/cell.dm:157)
rt.def("/obj/item/weapon/stock_parts/cell/proc/blob_act", function blob_act(f: Frame, B: Value) {
	rt.callSrc(f, "ex_act", [1]);
	return f.dot;
});

// /obj/item/weapon/stock_parts/cell/proc/get_electrocute_damage  (code/modules/power/cell.dm:160)
rt.def("/obj/item/weapon/stock_parts/cell/proc/get_electrocute_damage", function get_electrocute_damage(f: Frame) {
	if (rt.ge(rt.sv(f, "charge"), 1000)) {
		return add(rt.call(f, P("/proc/max"), null, [10, rt.call(f, P("/proc/min"), null, [rt.call(f, P("/proc/round"), null, [divide(rt.sv(f, "charge"), 10000)]), 90])]), rt.call(f, P("/proc/rand"), null, [-5, 5]));
	}
	return 0;
});

rt.type(5713, "/obj/item/weapon/stock_parts/cell/crap", "/obj/item/weapon/stock_parts/cell", {
	maxcharge: 500,
	name: "１Nanotrasen brand rechargable AA battery",
	desc: "You can't top the plasma top.",
	materials: null,
	rating: 2,
});

// /obj/item/weapon/stock_parts/cell/crap/proc/<init>  (code/modules/power/cell.dm:170)
rt.def("/obj/item/weapon/stock_parts/cell/crap/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 40]));
	return f.dot;
});

rt.type(5714, "/obj/item/weapon/stock_parts/cell/crap/empty", "/obj/item/weapon/stock_parts/cell/crap", {});

// /obj/item/weapon/stock_parts/cell/crap/empty/proc/New  (code/modules/power/cell.dm:174)  may sleep
rt.def("/obj/item/weapon/stock_parts/cell/crap/empty/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "charge", 0);
	return f.dot;
}, true);

rt.type(5715, "/obj/item/weapon/stock_parts/cell/secborg", "/obj/item/weapon/stock_parts/cell", {
	maxcharge: 600,
	name: "security borg rechargable D battery",
	origin_tech: null,
	materials: null,
	rating: 2.5,
});

// /obj/item/weapon/stock_parts/cell/secborg/proc/<init>  (code/modules/power/cell.dm:181)
rt.def("/obj/item/weapon/stock_parts/cell/secborg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 40]));
	return f.dot;
});

rt.type(5716, "/obj/item/weapon/stock_parts/cell/secborg/empty", "/obj/item/weapon/stock_parts/cell/secborg", {});

// /obj/item/weapon/stock_parts/cell/secborg/empty/proc/New  (code/modules/power/cell.dm:185)  may sleep
rt.def("/obj/item/weapon/stock_parts/cell/secborg/empty/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "charge", 0);
	return f.dot;
}, true);

rt.type(5720, "/obj/item/weapon/stock_parts/cell/high", "/obj/item/weapon/stock_parts/cell", {
	maxcharge: 10000,
	chargerate: 1500,
	name: "high-capacity power cell",
	origin_tech: "powerstorage=2",
	icon_state: "hcell",
	materials: null,
	rating: 3,
});

// /obj/item/weapon/stock_parts/cell/high/proc/<init>  (code/modules/power/cell.dm:207)
rt.def("/obj/item/weapon/stock_parts/cell/high/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 60]));
	return f.dot;
});

rt.type(5722, "/obj/item/weapon/stock_parts/cell/high/empty", "/obj/item/weapon/stock_parts/cell/high", {});

// /obj/item/weapon/stock_parts/cell/high/empty/proc/New  (code/modules/power/cell.dm:219)  may sleep
rt.def("/obj/item/weapon/stock_parts/cell/high/empty/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "charge", 0);
	return f.dot;
}, true);

rt.type(5724, "/obj/item/weapon/stock_parts/cell/super", "/obj/item/weapon/stock_parts/cell", {
	maxcharge: 20000,
	chargerate: 2000,
	name: "super-capacity power cell",
	origin_tech: "powerstorage=3;materials=3",
	icon_state: "scell",
	materials: null,
	rating: 4,
});

// /obj/item/weapon/stock_parts/cell/super/proc/<init>  (code/modules/power/cell.dm:227)
rt.def("/obj/item/weapon/stock_parts/cell/super/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 300]));
	return f.dot;
});

rt.type(5725, "/obj/item/weapon/stock_parts/cell/super/empty", "/obj/item/weapon/stock_parts/cell/super", {});

// /obj/item/weapon/stock_parts/cell/super/empty/proc/New  (code/modules/power/cell.dm:232)  may sleep
rt.def("/obj/item/weapon/stock_parts/cell/super/empty/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "charge", 0);
	return f.dot;
}, true);

rt.type(5726, "/obj/item/weapon/stock_parts/cell/hyper", "/obj/item/weapon/stock_parts/cell", {
	maxcharge: 30000,
	chargerate: 3000,
	name: "hyper-capacity power cell",
	origin_tech: "powerstorage=4;engineering=4;materials=4",
	icon_state: "hpcell",
	materials: null,
	rating: 5,
});

// /obj/item/weapon/stock_parts/cell/hyper/proc/<init>  (code/modules/power/cell.dm:240)
rt.def("/obj/item/weapon/stock_parts/cell/hyper/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 400]));
	return f.dot;
});

rt.type(5727, "/obj/item/weapon/stock_parts/cell/hyper/empty", "/obj/item/weapon/stock_parts/cell/hyper", {});

// /obj/item/weapon/stock_parts/cell/hyper/empty/proc/New  (code/modules/power/cell.dm:245)  may sleep
rt.def("/obj/item/weapon/stock_parts/cell/hyper/empty/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "charge", 0);
	return f.dot;
}, true);

rt.type(5728, "/obj/item/weapon/stock_parts/cell/bluespace", "/obj/item/weapon/stock_parts/cell", {
	maxcharge: 40000,
	chargerate: 4000,
	name: "bluespace power cell",
	desc: "A rechargable transdimensional power cell.",
	origin_tech: "powerstorage=5;bluespace=4;materials=4;engineering=4",
	icon_state: "bscell",
	materials: null,
	rating: 6,
});

// /obj/item/weapon/stock_parts/cell/bluespace/proc/<init>  (code/modules/power/cell.dm:254)
rt.def("/obj/item/weapon/stock_parts/cell/bluespace/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 600]));
	return f.dot;
});

rt.type(5729, "/obj/item/weapon/stock_parts/cell/bluespace/empty", "/obj/item/weapon/stock_parts/cell/bluespace", {});

// /obj/item/weapon/stock_parts/cell/bluespace/empty/proc/New  (code/modules/power/cell.dm:259)  may sleep
rt.def("/obj/item/weapon/stock_parts/cell/bluespace/empty/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "charge", 0);
	return f.dot;
}, true);

rt.type(5730, "/obj/item/weapon/stock_parts/cell/infinite", "/obj/item/weapon/stock_parts/cell", {
	maxcharge: 30000,
	chargerate: 30000,
	name: "infinite-capacity power cell!",
	icon_state: "icell",
	origin_tech: "powerstorage=7",
	materials: null,
	rating: 6,
});

// /obj/item/weapon/stock_parts/cell/infinite/proc/<init>  (code/modules/power/cell.dm:267)
rt.def("/obj/item/weapon/stock_parts/cell/infinite/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 1000]));
	return f.dot;
});

rt.type(5732, "/obj/item/weapon/stock_parts/cell/potato", "/obj/item/weapon/stock_parts/cell", {
	charge: 100,
	maxcharge: 300,
	grown_battery: 1,
	name: "potato battery",
	desc: "A rechargable starch based power cell.",
	icon: rt.rsc("icons/obj/hydroponics/harvest.dmi"),
	icon_state: "potato",
	origin_tech: "powerstorage=1;biotech=1",
	materials: null,
	rating: 1,
});

// /obj/item/weapon/stock_parts/cell/potato/proc/<init>  (code/modules/power/cell.dm:296)
rt.def("/obj/item/weapon/stock_parts/cell/potato/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.list());
	return f.dot;
});

rt.type(5723, "/obj/item/weapon/stock_parts/cell/high/slime", "/obj/item/weapon/stock_parts/cell/high", {
	self_recharge: 1,
	name: "charged slime core",
	desc: "A yellow slime core infused with plasma, it crackles with power.",
	origin_tech: "powerstorage=5;biotech=4",
	icon: rt.rsc("icons/mob/slimes.dmi"),
	icon_state: "yellow slime extract",
	materials: null,
});

// /obj/item/weapon/stock_parts/cell/high/slime/proc/<init>  (code/modules/power/cell.dm:306)
rt.def("/obj/item/weapon/stock_parts/cell/high/slime/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.list());
	return f.dot;
});

rt.type(5734, "/obj/item/weapon/stock_parts/cell/emproof/empty", "/obj/item/weapon/stock_parts/cell/emproof", {});

// /obj/item/weapon/stock_parts/cell/emproof/empty/proc/New  (code/modules/power/cell.dm:316)  may sleep
rt.def("/obj/item/weapon/stock_parts/cell/emproof/empty/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "charge", 0);
	return f.dot;
}, true);

rt.type(5735, "/obj/item/weapon/stock_parts/cell/beam_rifle", "/obj/item/weapon/stock_parts/cell", {
	maxcharge: 50000,
	chargerate: 5000,
	name: "beam rifle capacitor",
	desc: "A high powered capacitor that can provide huge amounts of energy in an instant",
	rating: 4,
});

// /obj/item/weapon/stock_parts/cell/beam_rifle/proc/emp_act  (code/modules/power/cell.dm:336)
rt.def("/obj/item/weapon/stock_parts/cell/beam_rifle/proc/emp_act", function emp_act(f: Frame, severity: Value) {
	rt.setSv(f, "charge", rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [subtract(rt.sv(f, "charge"), divide(10000, live(severity))), rt.sv(f, "maxcharge")])]));
	return f.dot;
});
