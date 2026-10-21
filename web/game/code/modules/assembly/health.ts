// From code/modules/assembly/health.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9375, "/obj/item/device/assembly/health", "/obj/item/device/assembly", {
	scanning: 0,
	health_scan: null,
	alarm_health: 0,
	attachable: 1,
	secured: 0,
	name: "health sensor",
	desc: "Used for scanning and monitoring health.",
	icon_state: "health",
	materials: null,
	origin_tech: "magnets=1;biotech=1",
});

// /obj/item/device/assembly/health/proc/<init>  (code/modules/assembly/health.dm:5)
rt.def("/obj/item/device/assembly/health/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 800, "$glass", 200]));
	return f.dot;
});

// /obj/item/device/assembly/health/proc/examine  (code/modules/assembly/health.dm:15)
rt.def("/obj/item/device/assembly/health/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>Use a multitool to swap between \"detect death\" mode and \"detect critical state\" mode.</span>"]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/device/assembly/health/proc/activate  (code/modules/assembly/health.dm:19)
rt.def("/obj/item/device/assembly/health/proc/activate", function activate(f: Frame) {
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return 0;
	}
	rt.callSrc(f, "toggle_scan", []);
	return 0;
});

// /obj/item/device/assembly/health/proc/toggle_secure  (code/modules/assembly/health.dm:25)
rt.def("/obj/item/device/assembly/health/proc/toggle_secure", function toggle_secure(f: Frame) {
	rt.setSv(f, "secured", (!truthy(rt.sv(f, "secured")) ? 1 : 0));
	if ((truthy(rt.sv(f, "secured")) && truthy(rt.sv(f, "scanning")))) {
		if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
			rt.setFv(f, "isprocessing", live(f.src), 1);
			rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
		}
	} else {
		rt.setSv(f, "scanning", 0);
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	}
	rt.callSrc(f, "update_icon", []);
	return rt.sv(f, "secured");
});

// /obj/item/device/assembly/health/proc/attackby  (code/modules/assembly/health.dm:35)  may sleep
rt.def("/obj/item/device/assembly/health/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/multitool")) ? 1 : 0))) {
		if (isEqual(rt.sv(f, "alarm_health"), 0)) {
			rt.setSv(f, "alarm_health", -90);
			yield* g.callName(f, live(f.args[1]), "show_message", [fmt("You toggle ＀ to \"detect death\" mode.", [live(f.src)])]);
		} else {
			rt.setSv(f, "alarm_health", 0);
			yield* g.callName(f, live(f.args[1]), "show_message", [fmt("You toggle ＀ to \"detect critical state\" mode.", [live(f.src)])]);
		}
		return live(f.dot);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user"] });

// /obj/item/device/assembly/health/proc/process  (code/modules/assembly/health.dm:47)  may sleep
rt.def("/obj/item/device/assembly/health/proc/process", function* process(f: Frame) {
	let A: Value = null, M: Value = null;
	f.vars = () => [A, M];
	if ((!truthy(rt.sv(f, "scanning")) || !truthy(rt.sv(f, "secured")))) {
		return live(f.dot);
	}
	A = live(f.src);
	if ((truthy(rt.sv(f, "connected")) && truthy(rt.fv(f, "holder", rt.sv(f, "connected"))))) {
		A = rt.fv(f, "holder", rt.sv(f, "connected"));
	}
	live(A);
	while (truthy(live(A)) && !truthy((yield* g.call(f, P("/proc/ismob"), null, [live(A)])))) {
		A = rt.fv(f, "loc", live(A));
	}
	if (truthy((M = live(A)))) {
		rt.setSv(f, "health_scan", rt.fv(f, "health", live(M)));
		if (rt.le(rt.sv(f, "health_scan"), rt.sv(f, "alarm_health"))) {
			yield* g.srcCall(f, "pulse");
			yield* g.srcCall(f, "audible_message", fmt("＀ *beep* *beep*", [(yield* g.call(f, P("/proc/bicon"), null, [live(f.src)]))]), "*beep* *beep*");
			yield* g.srcCall(f, "toggle_scan");
		}
		return live(f.dot);
	}
	return live(f.dot);
}, true, { waitfor: false });

// /obj/item/device/assembly/health/proc/toggle_scan  (code/modules/assembly/health.dm:68)
rt.def("/obj/item/device/assembly/health/proc/toggle_scan", function toggle_scan(f: Frame) {
	if (!truthy(rt.sv(f, "secured"))) {
		return 0;
	}
	rt.setSv(f, "scanning", (!truthy(rt.sv(f, "scanning")) ? 1 : 0));
	if (truthy(rt.sv(f, "scanning"))) {
		if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
			rt.setFv(f, "isprocessing", live(f.src), 1);
			rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
		}
	} else {
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	}
	return live(f.dot);
});

// /obj/item/device/assembly/health/proc/interact  (code/modules/assembly/health.dm:78)
rt.def("/obj/item/device/assembly/health/proc/interact", function interact(f: Frame, user: Value) {
	let dat: Value = null;
	let $0: any, $1: any;
	f.vars = () => [dat, $0, $1];
	if (!truthy(rt.sv(f, "secured"))) {
		rt.callName(f, live(user), "show_message", [fmt("<span class='warning'>The ＀ is unsecured!</span>", [rt.sv(f, "name")])]);
		return 0;
	}
	$0 = live(f.src);
	if (truthy(rt.sv(f, "scanning"))) {
		$1 = "On";
	} else {
		$1 = "Off";
	}
	dat = fmt("<TT><B>Health Sensor</B> <A href='?src=＃;scanning=1'>＀</A>", [$0, $1]);
	if ((truthy(rt.sv(f, "scanning")) && truthy(rt.sv(f, "health_scan")))) {
		dat = rt.modify(live(dat), fmt("<BR>Health: ＀", [rt.sv(f, "health_scan")]), add);
	}
	rt.op(f, "Browse", [], [live(user), live(dat), "window=hscan"], false);
	rt.call(f, P("/proc/onclose"), null, [live(user), "hscan"]);
	return live(f.dot);
});

// /obj/item/device/assembly/health/proc/Topic  (code/modules/assembly/health.dm:90)  may sleep
rt.def("/obj/item/device/assembly/health/proc/Topic", function* Topic(f: Frame) {
	let user: Value = null;
	f.vars = () => [user];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [live(f.usr)])))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, (user = live(f.usr)), "canUseTopic", [live(f.src)])))) {
		rt.op(f, "Browse", [], [live(f.usr), null, "window=hscan"], false);
		yield* g.call(f, P("/proc/onclose"), null, [live(f.usr), "hscan"]);
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "scanning"))) {
		yield* g.srcCall(f, "toggle_scan");
	}
	if (truthy(rt.at(live(f.args[1]), "close"))) {
		rt.op(f, "Browse", [], [live(f.usr), null, "window=hscan"], false);
		return live(f.dot);
	}
	yield* g.srcCall(f, "attack_self", live(user));
	return live(f.dot);
}, true, { args: ["href", "href_list"] });
