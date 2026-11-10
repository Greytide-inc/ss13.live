// Based on /tg/station's code/modules/admin/verbs/diagnostics.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// diagnostics.dm:5
rt.def("/client/proc/air_status", function air_status(f: Frame, target: Value) {
	let GM_gases: Value = null, _T: Value = null, id: Value = null;
	let $e: any;
	if (!isturf(target)) {
		return f.dot;
	}
	let GM: Value = target.return_air();
	let burning: Value = 0;
	if (rt.istype(target, T("/turf/open"))) {
		if ((_T = target).active_hotspot) {
			burning = 1;
		}
	}
	let $0: any = f.usr;
	let $1: any = target.x;
	let $2: any = target.y;
	let $3: any = GM.temperature;
	let $4: any = GM.return_pressure();
	to_chat($0, `<span class='adminnotice'>@${$1},${$2}: ${$3} Kelvin, ${$4} kPa ${burning ? " BURNING" : null}</span>`);
	for (id of each(GM_gases)) {
		to_chat(f.usr, `${rt.index(rt.index(rt.index(GM_gases, id), 3), 2)}: ${rt.index(rt.index(GM_gases, id), 1)}`);
	}
	return f.dot;
}, false, { verb: { name: "Display Air Status", category: "Debug" }, argTypes: [{ path: "/turf" }] });

// diagnostics.dm:28
rt.def("/client/proc/fix_next_move", function fix_next_move(f: Frame) {
	let largest_move_mob: Value = null, largest_click_mob: Value = null, M: Value = null;
	let largest_move_time: Value = 0;
	let largest_click_time: Value = 0;
	for (M of each(rt.world(), T("/mob"))) {
		if (!M.client) {
			continue;
		}
		if (M.next_move >= largest_move_time) {
			largest_move_mob = M;
			if (M.next_move > rt.worldTime(f)) {
				largest_move_time = M.next_move - rt.worldTime(f);
			} else {
				largest_move_time = 1;
			}
		}
		if (M.next_click >= largest_click_time) {
			largest_click_mob = M;
			if (M.next_click > rt.worldTime(f)) {
				largest_click_time = M.next_click - rt.worldTime(f);
			} else {
				largest_click_time = 0;
			}
		}
		log_admin(`DEBUG: ${key_name(M)}  next_move = ${M.next_move}  lastDblClick = ${M.next_click}  world.time = ${rt.worldTime(f)}`);
		M.next_move = 1;
		M.next_click = 0;
	}
	message_admins(`${key_name_admin(largest_move_mob)} had the largest move delay with ${largest_move_time} frames / ${largest_move_time / 10} seconds!`);
	message_admins(`${key_name_admin(largest_click_mob)} had the largest click delay with ${largest_click_time} frames / ${largest_click_time / 10} seconds!`);
	message_admins(`world.time = ${rt.worldTime(f)}`);
	return f.dot;
}, false, { verb: { name: "Unfreeze Everyone", category: "Debug" } });

// diagnostics.dm:56
rt.def("/client/proc/radio_report", function radio_report(f: Frame) {
	let fq: Value = null, fqs: Value = null, filter: Value = null, _f: Value = null, device: Value = null;
	let filters: Value = rt.alist(f, ["1", "GLOB.RADIO_TO_AIRALARM", "2", "GLOB.RADIO_FROM_AIRALARM", "3", "GLOB.RADIO_CHAT", "4", "GLOB.RADIO_ATMOSIA", "5", "GLOB.RADIO_NAVBEACONS", "6", "GLOB.RADIO_AIRLOCK", "7", "RADIO_SECBOT", "8", "RADIO_MULEBOT", "_default", "NO_FILTER"]);
	let output: Value = "<b>Radio Report</b><hr>";
	for (fq of each(GLOB.SSradio.frequencies)) {
		output += `<b>Freq: ${fq}</b><br>`;
		if (!(fqs = rt.index(GLOB.SSradio.frequencies, fq))) {
			output += "&nbsp;&nbsp;<b>ERROR</b><br>";
			continue;
		}
		filter = null;
		for (filter of each(fqs.devices)) {
			if (!(_f = rt.index(fqs.devices, filter))) {
				output += `&nbsp;&nbsp;${rt.index(filters, filter)}: ERROR<br>`;
				continue;
			}
			output += `&nbsp;&nbsp;${rt.index(filters, filter)}: ${rt.len(f, _f)}<br>`;
			device = null;
			for (device of each(_f)) {
				if (rt.istype(device, T("/obj"))) {
					output += `&nbsp;&nbsp;&nbsp;&nbsp;${device} (${device.x},${device.y},${device.z} in area ${get_area(device.loc)})<br>`;
				} else {
					output += `&nbsp;&nbsp;&nbsp;&nbsp;${device}<br>`;
				}
			}
		}
	}
	rt.op(f, "Browse", [], [f.usr, output, "window=radioreport"], false);
	return f.dot;
}, false, { verb: { name: "Radio report", category: "Debug" } });

// diagnostics.dm:93
rt.def("/client/proc/reload_admins", function* reload_admins(f: Frame) {
	let confirm: Value = null;
	if (!this.holder) {
		return f.dot;
	}
	if ((confirm = (yield* alert(this, "Are you sure you want to reload all admins?", "Confirm", "Yes", "No"))) != "Yes") {
		return f.dot;
	}
	yield* load_admins();
	message_admins(`${key_name_admin(f.usr)} manually reloaded admins`);
	return f.dot;
}, true, { verb: { name: "Reload Admins", category: "Admin" } });
