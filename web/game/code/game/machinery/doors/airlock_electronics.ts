// From code/game/machinery/doors/airlock_electronics.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6935, "/obj/item/weapon/electronics/airlock", "/obj/item/weapon/electronics", {
	accesses: null,
	one_access: 0,
	name: "airlock electronics",
	req_access: null,
});

// /obj/item/weapon/electronics/airlock/proc/<init>  (code/game/machinery/doors/airlock_electronics.dm:5)
rt.def("/obj/item/weapon/electronics/airlock/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "accesses", rt.list());
	$0 = $0;
	rt.setSv(f, "req_access", rt.list(12));
	return f.dot;
});

// /obj/item/weapon/electronics/airlock/proc/ui_interact  (code/game/machinery/doors/airlock_electronics.dm:10)  may sleep
rt.def("/obj/item/weapon/electronics/airlock/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(ui) === null) {
		ui = null;
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(master_ui) === null) {
		master_ui = null;
	}
	if (live(state) === null) {
		state = rt.gl("hands_state");
	}
	yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]);
	if (truthy(live(ui))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "airlock_electronics", rt.sv(f, "name"), 975, 420, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/item/weapon/electronics/airlock/proc/ui_data  (code/game/machinery/doors/airlock_electronics.dm:16)
rt.def("/obj/item/weapon/electronics/airlock/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null, regions: Value = null, i: Value = null, region: Value = null, accesses: Value = null, j: Value = null, access: Value = null;
	let $e: any;
	f.vars = () => [data, regions, i, region, accesses, j, access, $e];
	data = rt.list();
	regions = rt.list();
	i = null;
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		region = rt.list();
		accesses = rt.list();
		j = null;
		rt.forList(f, 1, rt.call(f, P("/proc/get_region_accesses"), null, [live(i)]));
		while (($e = rt.next(f, 1)) !== undefined) {
			j = $e;
			rt.setAt((access = rt.list()), "name", rt.call(f, P("/proc/get_access_desc"), null, [live(j)]));
			rt.setAt(live(access), "id", live(j));
			rt.setAt(live(access), "req", (rt.isIn(f, live(j), rt.fv(f, "accesses", live(f.src))) ? 1 : 0));
			rt.setAt(live(accesses), rt.incField(f, live(accesses), "len", 1, false), live(access));
		}
		rt.endFor(f, 1);
		rt.setAt(live(region), "name", rt.call(f, P("/proc/get_region_accesses_name"), null, [live(i)]));
		rt.setAt(live(region), "accesses", live(accesses));
		rt.setAt(live(regions), rt.incField(f, live(regions), "len", 1, false), live(region));
	}
	rt.endFor(f, 0);
	rt.setAt(live(data), "regions", live(regions));
	rt.setAt(live(data), "oneAccess", rt.sv(f, "one_access"));
	return live(data);
});

// /obj/item/weapon/electronics/airlock/proc/ui_act  (code/game/machinery/doors/airlock_electronics.dm:37)  may sleep
rt.def("/obj/item/weapon/electronics/airlock/proc/ui_act", function* ui_act(f: Frame) {
	let access: Value = null;
	let $0: any;
	f.vars = () => [access, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "clear") {
		rt.setSv(f, "accesses", rt.list());
		rt.setSv(f, "one_access", 0);
		f.dot = 1;
	} else if ($0 === "one_access") {
		rt.setSv(f, "one_access", (!truthy(rt.sv(f, "one_access")) ? 1 : 0));
		f.dot = 1;
	} else if ($0 === "set") {
		if (!truthy((rt.isIn(f, (access = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "access")]))), rt.sv(f, "accesses")) ? 1 : 0))) {
			rt.modSrcVar(f, "accesses", live(access), add);
		} else {
			(rt.modSrcVar(f, "accesses", live(access), subtract));
		}
		f.dot = 1;
	}
	return f.dot;
}, true, { args: ["action", "params"] });
