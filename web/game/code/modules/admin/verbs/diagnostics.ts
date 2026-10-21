// From code/modules/admin/verbs/diagnostics.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /client/proc/air_status  (code/modules/admin/verbs/diagnostics.dm:5)
rt.def("/client/proc/air_status", function air_status(f: Frame, target: Value) {
	let GM: Value = null, GM_gases: Value = null, burning: Value = null, _T: Value = null, id: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $e: any;
	f.vars = () => [GM, GM_gases, burning, _T, id, $0, $1, $2, $3, $4, $5, $e];
	if (!truthy(rt.call(f, P("/proc/isturf"), null, [live(target)]))) {
		return live(f.dot);
	}
	GM = rt.callName(f, live(target), "return_air", []);
	GM_gases = null;
	burning = 0;
	if (truthy((rt.istype(live(target), T("/turf/open")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "active_hotspot", (_T = live(target))))) {
			burning = 1;
		}
	}
	$0 = live(f.usr);
	$1 = rt.fv(f, "x", live(target));
	$2 = rt.fv(f, "y", live(target));
	$3 = rt.fv(f, "temperature", live(GM));
	$4 = rt.callName(f, live(GM), "return_pressure", []);
	if (truthy(live(burning))) {
		$5 = " BURNING";
	} else {
		$5 = null;
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='adminnotice'>@＀,＀: ＀ Kelvin, ＀ kPa ＀</span>", [$1, $2, $3, $4, $5])]);
	id = null;
	rt.forList(f, 0, live(GM_gases));
	while (($e = rt.next(f, 0)) !== undefined) {
		id = $e;
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("＀: ＀", [rt.index(rt.index(rt.index(live(GM_gases), live(id)), 3), 2), rt.index(rt.index(live(GM_gases), live(id)), 1)])]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, false, { verb: { name: "Display Air Status", category: "Debug" }, argTypes: [{ path: "/turf" }] });

// /client/proc/fix_next_move  (code/modules/admin/verbs/diagnostics.dm:28)
rt.def("/client/proc/fix_next_move", function fix_next_move(f: Frame) {
	let largest_move_time: Value = null, largest_click_time: Value = null, largest_move_mob: Value = null, largest_click_mob: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [largest_move_time, largest_click_time, largest_move_mob, largest_click_mob, M, $e];
	largest_move_time = 0;
	largest_click_time = 0;
	largest_move_mob = null;
	largest_click_mob = null;
	M = null;
	rt.forList(f, 0, rt.world(), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (!truthy(rt.fv(f, "client", live(M)))) {
			continue;
		}
		if (rt.ge(rt.fv(f, "next_move", live(M)), live(largest_move_time))) {
			largest_move_mob = live(M);
			if (rt.gt(rt.fv(f, "next_move", live(M)), rt.worldTime(f))) {
				largest_move_time = subtract(rt.fv(f, "next_move", live(M)), rt.worldTime(f));
			} else {
				largest_move_time = 1;
			}
		}
		if (rt.ge(rt.fv(f, "next_click", live(M)), live(largest_click_time))) {
			largest_click_mob = live(M);
			if (rt.gt(rt.fv(f, "next_click", live(M)), rt.worldTime(f))) {
				largest_click_time = subtract(rt.fv(f, "next_click", live(M)), rt.worldTime(f));
			} else {
				largest_click_time = 0;
			}
		}
		rt.call(f, P("/proc/log_admin"), null, [fmt("DEBUG: ＀  next_move = ＀  lastDblClick = ＀  world.time = ＀", [rt.call(f, P("/proc/key_name"), null, [live(M)]), rt.fv(f, "next_move", live(M)), rt.fv(f, "next_click", live(M)), rt.worldTime(f)])]);
		rt.setFv(f, "next_move", live(M), 1);
		rt.setFv(f, "next_click", live(M), 0);
	}
	rt.endFor(f, 0);
	rt.call(f, P("/proc/message_admins"), null, [fmt("＀ had the largest move delay with ＀ frames / ＀ seconds!", [rt.call(f, P("/proc/key_name_admin"), null, [live(largest_move_mob)]), live(largest_move_time), divide(live(largest_move_time), 10)])]);
	rt.call(f, P("/proc/message_admins"), null, [fmt("＀ had the largest click delay with ＀ frames / ＀ seconds!", [rt.call(f, P("/proc/key_name_admin"), null, [live(largest_click_mob)]), live(largest_click_time), divide(live(largest_click_time), 10)])]);
	rt.call(f, P("/proc/message_admins"), null, [fmt("world.time = ＀", [rt.worldTime(f)])]);
	return live(f.dot);
}, false, { verb: { name: "Unfreeze Everyone", category: "Debug" } });

// /client/proc/radio_report  (code/modules/admin/verbs/diagnostics.dm:56)
rt.def("/client/proc/radio_report", function radio_report(f: Frame) {
	let filters: Value = null, output: Value = null, fq: Value = null, fqs: Value = null, filter: Value = null, _f: Value = null, device: Value = null;
	let $e: any;
	f.vars = () => [filters, output, fq, fqs, filter, _f, device, $e];
	filters = rt.alist(f, ["1", "GLOB.RADIO_TO_AIRALARM", "2", "GLOB.RADIO_FROM_AIRALARM", "3", "GLOB.RADIO_CHAT", "4", "GLOB.RADIO_ATMOSIA", "5", "GLOB.RADIO_NAVBEACONS", "6", "GLOB.RADIO_AIRLOCK", "7", "RADIO_SECBOT", "8", "RADIO_MULEBOT", "_default", "NO_FILTER"]);
	output = "<b>Radio Report</b><hr>";
	fq = null;
	rt.forList(f, 0, rt.fv(f, "frequencies", rt.gl("SSradio")));
	while (($e = rt.next(f, 0)) !== undefined) {
		fq = $e;
		output = rt.modify(live(output), fmt("<b>Freq: ＀</b><br>", [live(fq)]), add);
		if (!truthy((fqs = rt.index(rt.fv(f, "frequencies", rt.gl("SSradio")), live(fq))))) {
			output = rt.modify(live(output), "&nbsp;&nbsp;<b>ERROR</b><br>", add);
			continue;
		}
		filter = null;
		rt.forList(f, 1, rt.fv(f, "devices", live(fqs)));
		while (($e = rt.next(f, 1)) !== undefined) {
			filter = $e;
			if (!truthy((_f = rt.index(rt.fv(f, "devices", live(fqs)), live(filter))))) {
				output = rt.modify(live(output), fmt("&nbsp;&nbsp;＀: ERROR<br>", [rt.index(live(filters), live(filter))]), add);
				continue;
			}
			output = rt.modify(live(output), fmt("&nbsp;&nbsp;＀: ＀<br>", [rt.index(live(filters), live(filter)), rt.len(f, live(_f))]), add);
			device = null;
			rt.forList(f, 2, live(_f));
			while (($e = rt.next(f, 2)) !== undefined) {
				device = $e;
				if (truthy((rt.istype(live(device), T("/obj")) ? 1 : 0))) {
					output = rt.modify(live(output), fmt("&nbsp;&nbsp;&nbsp;&nbsp;＀ (＀,＀,＀ in area ＀)<br>", [live(device), rt.fv(f, "x", live(device)), rt.fv(f, "y", live(device)), rt.fv(f, "z", live(device)), rt.call(f, P("/proc/get_area"), null, [rt.fv(f, "loc", live(device))])]), add);
				} else {
					output = rt.modify(live(output), fmt("&nbsp;&nbsp;&nbsp;&nbsp;＀<br>", [live(device)]), add);
				}
			}
			rt.endFor(f, 2);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	rt.op(f, "Browse", [], [live(f.usr), live(output), "window=radioreport"], false);
	return f.dot;
}, false, { verb: { name: "Radio report", category: "Debug" } });

// /client/proc/reload_admins  (code/modules/admin/verbs/diagnostics.dm:93)  may sleep
rt.def("/client/proc/reload_admins", function* reload_admins(f: Frame) {
	let confirm: Value = null;
	f.vars = () => [confirm];
	if (!truthy(rt.fv(f, "holder", live(f.src)))) {
		return live(f.dot);
	}
	if (!isEqual((confirm = (yield* g.call(f, P("/proc/alert"), null, [live(f.src), "Are you sure you want to reload all admins?", "Confirm", "Yes", "No"]))), "Yes")) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/load_admins"), null, []);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ manually reloaded admins", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
	return f.dot;
}, true, { verb: { name: "Reload Admins", category: "Admin" } });
