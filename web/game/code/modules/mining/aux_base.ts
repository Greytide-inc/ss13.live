// Based on /tg/station's code/modules/mining/aux_base.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(10424, "/obj/machinery/computer/auxillary_base", "/obj/machinery/computer", {
	shuttleId: "colony_drop",
	launch_warning: 1,
	turrets: null,
	possible_destinations: null,
	locator: null,
	clockwork: 1,
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/auxillary_base"),
	name: "auxillary base management console",
	icon: rt.rsc("icons/obj/terminals.dmi"),
	icon_state: "dorm_available",
	desc: "Allows a deployable expedition base to be dropped from the station to a designated mining location. It can also interface with the mining shuttle at the landing site if a mobile beacon is also deployed.",
	req_one_access: null,
});

// aux_base.dm:21
rt.def("/obj/machinery/computer/auxillary_base/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.turrets = list();
	this.req_one_access = list(31, 32, 19, 47);
	return f.dot;
});

// aux_base.dm:30
rt.def("/obj/machinery/computer/auxillary_base/proc/New", function* New(f: Frame, location: Value, C: Value) {
	yield* parent_proc();
	this.locator = (yield* new_(T("/obj/item/device/gps/internal/base"), this));
	return f.dot;
}, true);

// aux_base.dm:35
rt.def("/obj/machinery/computer/auxillary_base/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let destination_found: Value = null, S: Value = null, PDT: Value = null, _T: Value = null, integrity: Value = null, status: Value = null, popup: Value = null;
	let $0: any, $e: any;
	if (yield* parent_proc(user)) {
		return f.dot;
	}
	yield* this.add_fingerprint(f.usr);
	let options: Value = params2list(this.possible_destinations);
	let M: Value = GLOB.SSshuttle.getShuttle(this.shuttleId);
	if (this.z == ZLEVEL_STATION) {
		$0 = "Docking clamps engaged. Standing by.";
	} else {
		if (M) {
			$0 = M.getStatusText();
		} else {
			$0 = "*OFFLINE*";
		}
		$0 = `Mining Shuttle Uplink: ${$0}`;
	}
	let dat: Value = `${$0}<br>`;
	if (M) {
		for (S of each(GLOB.SSshuttle.stationary, T("/obj/docking_port/stationary"))) {
			if (!options.Find(S.id)) {
				continue;
			}
			if (!M.check_dock(S)) {
				continue;
			}
			destination_found = 1;
			dat += fmt("<A href='?src=＃;move=＀'>Send to ＀</A><br>", [this, S.id, S.name]);
		}
		if (!destination_found && this.z == ZLEVEL_STATION) {
			dat += fmt("<A href='?src=＃;random=1'>Prepare for blind drop? (Dangerous)</A><br>", [this]);
		}
	}
	if (rt.length(this.turrets)) {
		dat += fmt("<br><b>Perimeter Defense System:</b> <A href='?src=＃;turrets_power=on'>Enable All</A> / <A href='?src=＃;turrets_power=off'>Disable All</A><br> Units connected: ＀<br>Unit | Condition | Status | Direction | Distance<br>", [this, this, rt.length(this.turrets)]);
		for (PDT of each(this.turrets)) {
			_T = PDT;
			integrity = max((_T.obj_integrity - _T.integrity_failure) / (_T.max_integrity - _T.integrity_failure) * 100, 0);
			status = null;
			if (rt.bitAnd(_T.stat, 1)) {
				status = "<span class='bad'>ERROR</span>";
			} else if (!_T.on) {
				status = "Disabled";
			} else if (_T.raised) {
				status = "<span class='average'><b>Firing</b></span>";
			} else {
				status = "<span class='good'>All Clear</span>";
			}
			dat += fmt("＀ | ＀% | ＀ | ＀ | ＀m <A href='?src=＃;single_turret_power=＃'>Toggle Power</A><br>", [_T.name, integrity, status, dir2text(rt.getDir(f, this, _T)), get_dist(this, _T), this, _T]);
		}
	}
	dat += fmt("<a href='?src=＃;mach_close=computer'>Close</a>", [user]);
	(popup = (yield* new_(T("/datum/browser"), user, "computer", "base management", 550, 300))).set_content(`<center>${dat}</center>`);
	popup.set_title_image(f.usr.browse_rsc_icon(this.icon, this.icon_state));
	yield* popup.open();
	return f.dot;
}, true);

// aux_base.dm:81
rt.def("/obj/machinery/computer/auxillary_base/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let shuttle_error: Value = null, LZ: Value = null, _T: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* f.usr.set_machine(this);
	yield* this.add_fingerprint(f.usr);
	if (!(yield* this.allowed(f.usr))) {
		to_chat(f.usr, "<span class='danger'>Access denied.</span>");
		return f.dot;
	}
	if (rt.at(href_list, "move")) {
		if (this.z != ZLEVEL_STATION && this.shuttleId == "colony_drop") {
			to_chat(f.usr, "<span class='warning'>You can't move the base again!</span>");
			return f.dot;
		}
		shuttle_error = (yield* GLOB.SSshuttle.moveShuttle(this.shuttleId, rt.at(href_list, "move"), 1));
		if (this.launch_warning) {
			yield* this.say("<span class='danger'>Launch sequence activated! Prepare for drop!!</span>");
			playsound(this.loc, rt.rsc("sound/machines/warning-buzzer.ogg"), 70, 0);
			this.launch_warning = 0;
		} else if (!shuttle_error) {
			yield* this.say("Shuttle request uploaded. Please stand away from the doors.");
		} else {
			yield* this.say("Shuttle interface failed.");
		}
	}
	if (rt.at(href_list, "random") && !this.possible_destinations) {
		f.usr.changeNext_move(2);
		if (!rt.istype((LZ = safepick(block(rt.locate(1, 1, 5), rt.locate(rt.world().maxx, rt.world().maxy, 5)))), T("/turf/closed/mineral")) && !rt.istype(LZ, T("/turf/open/floor/plating/asteroid"))) {
			to_chat(f.usr, "<span class='warning'>Landing zone scan failed. Please try again.</span>");
			yield* this.updateUsrDialog();
			return f.dot;
		}
		if ((yield* this.set_landing_zone(LZ, f.usr)) != ZONE_SET) {
			to_chat(f.usr, "<span class='warning'>Landing zone unsuitable. Please recalculate.</span>");
			yield* this.updateUsrDialog();
			return f.dot;
		}
	}
	if (rt.length(this.turrets)) {
		if (rt.at(href_list, "turrets_power")) {
			for (_T of each(this.turrets, T("/obj/machinery/porta_turret/aux_base"))) {
				if (rt.at(href_list, "turrets_power") == "on") {
					_T.on = 1;
				} else {
					_T.on = 0;
				}
			}
		}
		if (rt.at(href_list, "single_turret_power")) {
			if (rt.istype((_T = rt.locateIn(f, rt.at(href_list, "single_turret_power"), this.turrets)), T("/obj/machinery/porta_turret/aux_base"))) {
				_T.on = (!_T.on ? 1 : 0);
			}
		}
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// aux_base.dm:133
rt.def("/obj/machinery/computer/auxillary_base/proc/onShuttleMove", function* onShuttleMove(f: Frame, T1: Value, rotation: Value) {
	yield* parent_proc();
	if (this.z != ZLEVEL_MINING) return f.dot;
	return f.dot;
}, true);

// aux_base.dm:138
rt.def("/obj/machinery/computer/auxillary_base/proc/set_mining_mode", function set_mining_mode(f: Frame) {
	if (this.z != ZLEVEL_MINING) return f.dot;
	this.req_one_access = list();
	this.shuttleId = "mining";
	this.possible_destinations = "mining_home;mining_away;landing_zone_dock;mining_public";
	return f.dot;
});

// aux_base.dm:145
rt.def("/obj/machinery/computer/auxillary_base/proc/set_landing_zone", function* set_landing_zone(f: Frame, _T: Value, user: Value, no_restrictions: Value) {
	let base_dock: Value = null, colony_radius: Value = null, area_counter: Value = null, landing_zone: Value = null;
	if (!(base_dock = rt.locateIn(f, T("/obj/docking_port/mobile/auxillary_base"), GLOB.SSshuttle.mobile))) {
		to_chat(user, "<span class='warning'>This station is not equipped with an auxillary base. Please contact your Nanotrasen contractor.</span>");
		return f.dot;
	}
	if (!no_restrictions) {
		if (_T.z != ZLEVEL_MINING) {
			return BAD_ZLEVEL;
		}
		colony_radius = max(base_dock.width, base_dock.height) * 0.5;
		if (_T.x - colony_radius < 1 || _T.x + colony_radius >= rt.world().maxx || _T.y - colony_radius < 1 || _T.y + colony_radius >= rt.world().maxx) {
			return BAD_COORDS;
		}
		if (rt.len(f, (area_counter = get_areas_in_range(colony_radius, _T))) > 1) {
			return BAD_AREA;
		}
	}
	let A: Value = get_area(_T);
	(landing_zone = (yield* new_(T("/obj/docking_port/stationary"), _T))).id = fmt("colony_drop(＃)", [this]);
	landing_zone.name = `Landing Zone (${_T.x}, ${_T.y})`;
	landing_zone.dwidth = base_dock.dwidth;
	landing_zone.dheight = base_dock.dheight;
	landing_zone.width = base_dock.width;
	landing_zone.height = base_dock.height;
	yield* landing_zone.setDir(base_dock.dir);
	landing_zone.turf_type = _T.type;
	landing_zone.area_type = A.type;
	this.possible_destinations += `${landing_zone.id};`;
	minor_announce(`Auxiliary base landing zone coordinates locked in for ${A}. Launch command now available!`);
	to_chat(user, "<span class='notice'>Landing zone set.</span>");
	return ZONE_SET;
}, true);

rt.type(9395, "/obj/item/device/assault_pod/mining", "/obj/item/device/assault_pod", {
	setting: 0,
	no_restrictions: 0,
	name: "Landing Field Designator",
	icon_state: "gangtool-purple",
	item_state: "electronic",
	icon: rt.rsc("icons/obj/device.dmi"),
	desc: "Deploy to designate the landing zone of the auxillary base.",
	w_class: 2,
	shuttle_id: "colony_drop",
});

// aux_base.dm:197
rt.def("/obj/item/device/assault_pod/mining/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let AB: Value = null, A: Value = null;
	let $e: any;
	if (this.setting) {
		return f.dot;
	}
	to_chat(user, "<span class='notice'>You begin setting the landing zone parameters...</span>");
	this.setting = 1;
	if (!(yield* do_after(user, 50, { target: user }))) {
		this.setting = 0;
		return f.dot;
	}
	this.setting = 0;
	let _T: Value = rt.getStep(f, user, 0);
	for (A of each(GLOB.machines, T("/obj/machinery/computer/auxillary_base"))) {
		if (A.z == ZLEVEL_STATION) {
			AB = A;
			break;
		}
	}
	if (!AB) {
		to_chat(user, "<span class='warning'>No auxillary base console detected.</span>");
		return f.dot;
	}
	const subject = (yield* AB.set_landing_zone(_T, user, this.no_restrictions));
	if (subject === BAD_ZLEVEL) {
		to_chat(user, "<span class='warning'>This uplink can only be used in a designed mining zone.</span>");
	} else if (subject === BAD_AREA) {
		to_chat(user, "<span class='warning'>Unable to acquire a targeting lock. Find an area clear of stuctures or entirely within one.</span>");
	} else if (subject === BAD_COORDS) {
		to_chat(user, "<span class='warning'>Location is too close to the edge of the station's scanning range. Move several paces away and try again.</span>");
	} else if (subject === ZONE_SET) {
		yield* qdel(this);
	}
	return f.dot;
}, true);

rt.type(13054, "/obj/docking_port/stationary/public_mining_dock", "/obj/docking_port/stationary", {
	name: "public mining base dock",
	id: "disabled",
	dwidth: 3,
	width: 7,
	height: 5,
});

// aux_base.dm:249
rt.def("/obj/docking_port/stationary/public_mining_dock/proc/onShuttleMove", function onShuttleMove(f: Frame) {
	this.id = "mining_public";
	return 0;
});

rt.type(12954, "/obj/structure/mining_shuttle_beacon", "/obj/structure", {
	shuttle_ID: "landing_zone_dock",
	Mport: null,
	anti_spam_cd: 0,
	console_range: 15,
	anchored: 0,
	pressure_resistance: 200,
	name: "mining shuttle beacon",
	desc: "A bluespace beacon calibrated to mark a landing spot for the mining shuttle when deployed near the auxillary mining base.",
	density: 0,
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "miningbeacon",
});

// aux_base.dm:268
rt.def("/obj/structure/mining_shuttle_beacon/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let landing_spot: Value = null, aux_base_console: Value = null, ABC: Value = null, S: Value = null, SM: Value = null, A: Value = null, mining_shuttle: Value = null, S_4: Value = null, MS: Value = null, L: Value = null;
	if (this.anchored) {
		to_chat(user, "<span class='warning'>Landing zone already set.</span>");
		return f.dot;
	}
	if (this.anti_spam_cd) {
		to_chat(user, `<span class='warning'>${this} is currently recalibrating. Please wait.</span>`);
		return f.dot;
	}
	this.anti_spam_cd = 1;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/structure/mining_shuttle_beacon/proc/clear_cooldown"))), 50);
	if ((landing_spot = rt.getStep(f, this, 0)).z != 5) {
		to_chat(user, "<span class='warning'>This device is only to be used in a mining zone.</span>");
		return f.dot;
	}
	for (ABC of each(GLOB.machines, T("/obj/machinery/computer/auxillary_base"))) {
		if (get_dist(landing_spot, ABC) <= this.console_range) {
			aux_base_console = ABC;
			break;
		}
	}
	if (!aux_base_console) {
		to_chat(user, `<span class='warning'>The auxillary base's console must be within ${this.console_range} meters in order to interface.</span>`);
		return f.dot;
	}
	for (S of each(GLOB.SSshuttle.stationary)) {
		if ((SM = S).id == "mining_home" || SM.id == "mining_away") {
			A = get_area(landing_spot);
			this.Mport = (yield* new_(T("/obj/docking_port/stationary"), landing_spot));
			this.Mport.id = "landing_zone_dock";
			this.Mport.name = "auxillary base landing site";
			this.Mport.dwidth = SM.dwidth;
			this.Mport.dheight = SM.dheight;
			this.Mport.width = SM.width;
			this.Mport.height = SM.height;
			yield* this.Mport.setDir(this.dir);
			this.Mport.turf_type = landing_spot.type;
			this.Mport.area_type = A.type;
			break;
		}
	}
	if (!this.Mport) {
		to_chat(user, "<span class='warning'>This station is not equipped with an approprite mining shuttle. Please contact Nanotrasen Support.</span>");
		return f.dot;
	}
	let landing_turfs: Value = list();
	for (S_4 of each(GLOB.SSshuttle.mobile)) {
		if ((MS = S_4).id != "mining") {
			continue;
		}
		landing_turfs = (mining_shuttle = MS).return_ordered_turfs(this.x, this.y, this.z, this.dir);
		break;
	}
	if (!mining_shuttle) {
		to_chat(user, "<span class='warning'>No mining shuttle signal detected. Please contact Nanotrasen Support.</span>");
		yield* GLOB.SSshuttle.stationary.Remove(this.Mport);
		yield* qdel(this.Mport);
		return f.dot;
	}
	for (L of each(landing_turfs)) {
		if (rt.istype(get_area(L), T("/area/shuttle/auxillary_base"))) {
			to_chat(user, "<span class='warning'>The mining shuttle must not land within the mining base itself.</span>");
			yield* GLOB.SSshuttle.stationary.Remove(this.Mport);
			yield* qdel(this.Mport);
			return f.dot;
		}
	}
	if (!mining_shuttle.canDock(this.Mport)) {
		to_chat(user, "<span class='warning'>Unable to secure a valid docking zone. Please try again in an open area near, but not within the aux. mining base.</span>");
		yield* GLOB.SSshuttle.stationary.Remove(this.Mport);
		yield* qdel(this.Mport);
		return f.dot;
	}
	aux_base_console.set_mining_mode();
	to_chat(user, "<span class='notice'>Mining shuttle calibration successful! Shuttle interface available at base console.</span>");
	this.anchored = 1;
	playsound(this.loc, rt.rsc("sound/machines/ping.ogg"), 50, 0);
	return f.dot;
}, true);

// aux_base.dm:353
rt.def("/obj/structure/mining_shuttle_beacon/proc/attack_robot", function* attack_robot(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);
