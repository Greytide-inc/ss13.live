// Based on /tg/station's code/game/objects/items/devices/camera_bug.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(9227, "/obj/item/device/camera_bug", "/obj/item/device", {
	current: null,
	last_net_update: 0,
	bugged_cameras: null,
	track_mode: 0,
	last_tracked: 0,
	refresh_interval: 50,
	tracked_name: null,
	tracking: null,
	last_found: null,
	last_seen: null,
	throw_speed: 4,
	throw_range: 20,
	flags: 4,
	name: "camera bug",
	desc: "For illicit snooping through the camera network.",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "camera_bug",
	w_class: 1,
	item_state: "camera_bug",
	origin_tech: "syndicate=1;engineering=3",
});

// camera_bug.dm:23
rt.def("/obj/item/device/camera_bug/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bugged_cameras = list();
	return f.dot;
});

// camera_bug.dm:36
rt.def("/obj/item/device/camera_bug/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// camera_bug.dm:40
rt.def("/obj/item/device/camera_bug/proc/Destroy", function* Destroy(f: Frame) {
	let cam_tag: Value = null, camera: Value = null;
	yield* this.get_cameras();
	for (cam_tag of each(this.bugged_cameras)) {
		if ((camera = rt.index(this.bugged_cameras, cam_tag)).bug == this) {
			camera.bug = null;
		}
	}
	this.bugged_cameras = list();
	if (this.tracking) {
		this.tracking = null;
	}
	return (yield* parent_proc());
}, true);

// camera_bug.dm:52
rt.def("/obj/item/device/camera_bug/proc/interact", function* interact(f: Frame, user: Value) {
	let popup: Value = null;
	user ??= f.usr;
	(popup = (yield* new_(T("/datum/browser"), user, "camerabug", "Camera Bug", { nref: this }))).set_content(this.menu((yield* this.get_cameras())));
	yield* popup.open();
	return f.dot;
}, true);

// camera_bug.dm:57
rt.def("/obj/item/device/camera_bug/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* user.set_machine(this);
	yield* this.interact(user);
	return f.dot;
}, true);

// camera_bug.dm:61
rt.def("/obj/item/device/camera_bug/proc/check_eye", function* check_eye(f: Frame, user: Value) {
	let _T: Value = null;
	if (this.loc != user || user.incapacitated() || user.eye_blind || !this.current) {
		yield* user.unset_machine();
		return 0;
	}
	if ((_T = rt.getStep(f, user.loc, 0)).z != this.current.z || !this.current.can_use()) {
		to_chat(user, `<span class='danger'>${this} has lost the signal.</span>`);
		this.current = null;
		yield* user.unset_machine();
		return 0;
	}
	return 1;
}, true);

// camera_bug.dm:72
rt.def("/obj/item/device/camera_bug/proc/on_unset_machine", function* on_unset_machine(f: Frame, user: Value) {
	yield* user.reset_perspective(null);
	return f.dot;
}, true);

// camera_bug.dm:75
rt.def("/obj/item/device/camera_bug/proc/get_cameras", function* get_cameras(f: Frame) {
	let camera: Value = null;
	if (rt.worldTime(f) > this.last_net_update + 100) {
		this.bugged_cameras = list();
		for (camera of each(GLOB.cameranet.cameras, T("/obj/machinery/camera"))) {
			if (camera.stat || !camera.can_use()) {
				continue;
			}
			if (rt.length(rt.bitAnd(list("SS13", "MINE"), camera.network))) {
				rt.setAt(this.bugged_cameras, camera.c_tag, camera);
			}
		}
	}
	yield* sortList(this.bugged_cameras);
	return this.bugged_cameras;
}, true);

// camera_bug.dm:87
rt.def("/obj/item/device/camera_bug/proc/menu", function menu(f: Frame, cameras: Value) {
	let html: Value = null, entry: Value = null, C: Value = null, functions: Value = null, time_diff: Value = null, outstring: Value = null, m: Value = null, s: Value = null;
	let $e: any;
	if (!cameras || !rt.len(f, cameras)) {
		return "No bugged cameras found.";
	}
	if (this.track_mode === 0) {
		html = fmt("<h3>Select a camera:</h3> <a href='?src=＃;view'>[Cancel camera view]</a><hr><table>", [this]);
		for (entry of each(cameras)) {
			C = rt.index(cameras, entry);
			functions = "";
			if (C.bug == this) {
				functions = fmt(" - <a href='?src=＃;monitor=＃'>[Monitor]</a> <a href='?src=＃;emp=＃'>[Disable]</a>", [this, C, this, C]);
			} else {
				functions = fmt(" - <a href='?src=＃;monitor=＃'>[Monitor]</a>", [this, C]);
			}
			html += fmt("<tr><td><a href='?src=＃;view=＃'>＀</a></td><td>＀</td></tr>", [this, C, entry, functions]);
		}
	} else if (this.track_mode === 1) {
		if (this.current) {
			html = fmt("Analyzing Camera '＀' <a href='?＃;mode=0'>[Select Camera]</a><br>", [this.current.c_tag, this]);
			html += this.camera_report();
		} else {
			this.track_mode = 0;
			return rt.callSelf(f, [cameras]);
		}
	} else if (this.track_mode === 2) {
		if (this.tracking) {
			html = fmt("Tracking '＀'  <a href='?＃;mode=0'>[Cancel Tracking]</a>  <a href='?src=＃;view'>[Cancel camera view]</a><br>", [this.tracked_name, this, this]);
			if (this.last_found) {
				time_diff = round((rt.worldTime(f) - this.last_seen) / 150);
				C = rt.index(this.bugged_cameras, this.last_found);
				if (C) {
					outstring = fmt("<a href='?＃;view=＃'>＀</a>", [this, C, this.last_found]);
				} else {
					outstring = this.last_found;
				}
				if (!time_diff) {
					html += `Last seen near ${outstring} (now)<br>`;
				} else {
					m = round(time_diff / 4);
					if (!(s = (time_diff - 4 * m) * 15)) {
						s = "00";
					}
					html += fmt("Last seen near ＀ (＀:＀ minute５ ago)<br>", [outstring, m, s]);
				}
				if (C && C.bug == this) {
					html += fmt("<a href='?src=＃;emp=＃'>[Disable]</a>", [this, C]);
				}
			} else {
				html += "Not yet seen.";
			}
		} else {
			this.track_mode = 0;
			return rt.callSelf(f, [cameras]);
		}
	}
	return html;
});

// camera_bug.dm:140
rt.def("/obj/item/device/camera_bug/proc/get_seens", function get_seens(f: Frame) {
	let seen: Value = null;
	if (!(this.current && this.current.can_use())) return f.dot;
	return (seen = this.current.can_see());
});

// camera_bug.dm:146
rt.def("/obj/item/device/camera_bug/proc/camera_report", function camera_report(f: Frame) {
	let seen: Value = null, names: Value = null, S: Value = null, stage: Value = null, M: Value = null;
	let dat: Value = "";
	if ((seen = this.get_seens()) && rt.len(f, seen) >= 1) {
		names = list();
		for (S of each(seen, T("/obj/singularity"))) {
			if (rt.isIn(f, S.name, names)) {
				rt.incAt(names, S.name, 1, true);
				dat += `${S.name} (${rt.index(names, S.name)})`;
			} else {
				rt.setAt(names, S.name, 1);
				dat += `${S.name}`;
			}
			dat += ` (Stage ${(stage = round(S.current_size / 2) + 1)})`;
			dat += fmt(" <a href='?＃;track=＃'>[Track]</a><br>", [this, S]);
		}
		for (M of each(seen, T("/obj/mecha"))) {
			if (rt.isIn(f, M.name, names)) {
				rt.incAt(names, M.name, 1, true);
				dat += `${M.name} (${rt.index(names, M.name)})`;
			} else {
				rt.setAt(names, M.name, 1);
				dat += `${M.name}`;
			}
			dat += fmt(" <a href='?＃;track=＃'>[Track]</a><br>", [this, M]);
		}
		M = null;
		for (M of each(seen, T("/mob/living"))) {
			if (rt.isIn(f, M.name, names)) {
				rt.incAt(names, M.name, 1, true);
				dat += `${M.name} (${rt.index(names, M.name)})`;
			} else {
				rt.setAt(names, M.name, 1);
				dat += `${M.name}`;
			}
			if (M.buckled && !M.lying) {
				dat += " (Sitting)";
			}
			if (M.lying) {
				dat += " (Laying down)";
			}
			dat += fmt(" <a href='?＃;track=＃'>[Track]</a><br>", [this, M]);
		}
		if (rt.length(dat) == 0) {
			dat += "No motion detected.";
		}
		return dat;
	} else {
		return "Camera Offline<br>";
	}
});

// camera_bug.dm:190
rt.def("/obj/item/device/camera_bug/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let cameras: Value = null, C: Value = null, seen: Value = null, A: Value = null, _T: Value = null;
	if (f.usr != this.loc) {
		yield* f.usr.unset_machine();
		rt.op(f, "Browse", [], [f.usr, null, "window=camerabug"], false);
		return f.dot;
	}
	yield* f.usr.set_machine(this);
	if (rt.isIn(f, "mode", href_list)) {
		this.track_mode = text2num(rt.at(href_list, "mode"));
	}
	if (rt.isIn(f, "monitor", href_list)) {
		cameras = flatten_list(this.bugged_cameras);
		if ((C = rt.locateIn(f, rt.at(href_list, "monitor"), cameras)) && rt.istype(C, T("/obj/machinery/camera"))) {
			this.track_mode = 1;
			this.current = C;
			yield* f.usr.reset_perspective(null);
			yield* this.interact();
		}
	}
	if (rt.isIn(f, "track", href_list)) {
		if ((seen = this.get_seens()) && rt.len(f, seen) >= 1) {
			if ((A = rt.locateIn(f, rt.at(href_list, "track"), seen)) && rt.istype(A, T("/atom"))) {
				this.tracking = A;
				this.tracked_name = A.name;
				this.last_found = this.current.c_tag;
				this.last_seen = rt.worldTime(f);
				this.track_mode = 2;
			}
		}
	}
	if (rt.isIn(f, "emp", href_list)) {
		cameras = flatten_list(this.bugged_cameras);
		if ((C = rt.locateIn(f, rt.at(href_list, "emp"), cameras)) && rt.istype(C, T("/obj/machinery/camera")) && C.bug == this) {
			yield* C.emp_act(1);
			C.bug = null;
			this.bugged_cameras -= C.c_tag;
		}
		yield* this.interact();
		return f.dot;
	}
	if (rt.isIn(f, "close", href_list)) {
		yield* f.usr.unset_machine();
		this.current = null;
		return f.dot;
	}
	if (rt.isIn(f, "view", href_list)) {
		cameras = flatten_list(this.bugged_cameras);
		if ((C = rt.locateIn(f, rt.at(href_list, "view"), cameras)) && rt.istype(C, T("/obj/machinery/camera"))) {
			if (!C.can_use()) {
				to_chat(f.usr, "<span class='warning'>Something's wrong with that camera!  You can't get a feed.</span>");
				return f.dot;
			}
			if (!(_T = rt.getStep(f, this.loc, 0)) || C.z != _T.z) {
				to_chat(f.usr, "<span class='warning'>You can't get a signal!</span>");
				return f.dot;
			}
			this.current = C;
			rt.spawnTail(f, 6, "/obj/item/device/camera_bug/proc/Topic: spawn at game/objects/items/devices/camera_bug.dm:243", href, href_list, cameras, C, seen, A, _T);
			return f.dot;
		} else {
			yield* f.usr.unset_machine();
		}
	}
	yield* this.interact();
	return f.dot;
}, true);

// a spawn(6) body of /obj/item/device/camera_bug/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/camera_bug/proc/Topic: spawn at game/objects/items/devices/camera_bug.dm:243", function* (f: Frame, href: Value, href_list: Value, cameras: Value, C: Value, seen: Value, A: Value, _T: Value) {
	if (yield* this.check_eye(f.usr)) {
		yield* f.usr.reset_perspective(C);
		yield* this.interact();
	} else {
		yield* f.usr.unset_machine();
		rt.op(f, "Browse", [], [f.usr, null, "window=camerabug"], false);
	}
	return null;
});

// camera_bug.dm:257
rt.def("/obj/item/device/camera_bug/proc/process", function* process(f: Frame) {
	let M: Value = null, tracking_cams: Value = null, b_cams: Value = null, entry: Value = null, target_region: Value = null, C: Value = null;
	if (this.track_mode == 0 || rt.worldTime(f) < this.last_tracked + this.refresh_interval) {
		return f.dot;
	}
	this.last_tracked = rt.worldTime(f);
	if (this.track_mode == 2) {
		if (!this.tracking) {
			yield* this.updateSelfDialog();
			return f.dot;
		}
		if (this.tracking.name != this.tracked_name) {
			if (rt.istype((M = this.tracking), T("/mob"))) {
				if (!(this.tracked_name == "Unknown" && findtext(this.tracking.name, "Unknown"))) {
					if (!(this.tracked_name == M.real_name && findtext(this.tracking.name, M.real_name))) {
						yield* this.updateSelfDialog();
						return f.dot;
					}
				}
			} else {
				yield* this.updateSelfDialog();
				return f.dot;
			}
		}
		tracking_cams = list();
		b_cams = (yield* this.get_cameras());
		for (entry of each(b_cams)) {
			tracking_cams += rt.index(b_cams, entry);
		}
		target_region = view(this.tracking);
		for (C of each(rt.bitAnd(target_region, tracking_cams), T("/obj/machinery/camera"))) {
			if (!can_see(C, this.tracking)) {
				continue;
			}
			if (C.can_use()) {
				this.last_found = C.c_tag;
				this.last_seen = rt.worldTime(f);
				break;
			}
		}
	}
	yield* this.updateSelfDialog();
	return f.dot;
}, true, { waitfor: false });
