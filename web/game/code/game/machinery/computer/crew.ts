// Based on /tg/station's code/game/machinery/computer/crew.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(10379, "/obj/machinery/computer/crew", "/obj/machinery/computer", {
	icon_screen: "crew",
	icon_keyboard: "med_key",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/crew"),
	light_color: "#6496FA",
	name: "crew monitoring console",
	desc: "Used to monitor active health sensors built into most of the crew's uniforms.",
	use_power: 1,
	idle_power_usage: 250,
	active_power_usage: 500,
});

// crew.dm:14
rt.def("/obj/machinery/computer/crew/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	yield* GLOB.crewmonitor.show(user);
	return f.dot;
}, true);

// crew.dm:19
rt.def("/obj/machinery/computer/crew/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	yield* GLOB.crewmonitor.show(user);
	return f.dot;
}, true);

// crew.dm:25
rt.def("/datum/controller/global_vars/proc/InitGlobalcrewmonitor", function InitGlobalcrewmonitor(f: Frame) {
	GLOB.crewmonitor = new_(T("/datum/crewmonitor"));
	this.gvars_datum_init_order += "crewmonitor";
	return f.dot;
});

rt.type(1499, "/datum/crewmonitor", "/datum", {
	jobs: null,
	interfaces: null,
	data: null,
});

// crew.dm:33
rt.def("/datum/crewmonitor/proc/New", function New(f: Frame) {
	let jobs: Value = null;
	f.dot = parent_proc();
	rt.setAt((jobs = new_(T("/list"))), "Captain", 0);
	rt.setAt(jobs, "Head of Personnel", 50);
	rt.setAt(jobs, "Head of Security", 10);
	rt.setAt(jobs, "Warden", 11);
	rt.setAt(jobs, "Security Officer", 12);
	rt.setAt(jobs, "Detective", 13);
	rt.setAt(jobs, "Chief Medical Officer", 20);
	rt.setAt(jobs, "Chemist", 21);
	rt.setAt(jobs, "Geneticist", 22);
	rt.setAt(jobs, "Virologist", 23);
	rt.setAt(jobs, "Medical Doctor", 24);
	rt.setAt(jobs, "Research Director", 30);
	rt.setAt(jobs, "Scientist", 31);
	rt.setAt(jobs, "Roboticist", 32);
	rt.setAt(jobs, "Chief Engineer", 40);
	rt.setAt(jobs, "Station Engineer", 41);
	rt.setAt(jobs, "Atmospheric Technician", 42);
	rt.setAt(jobs, "Quartermaster", 51);
	rt.setAt(jobs, "Shaft Miner", 52);
	rt.setAt(jobs, "Cargo Technician", 53);
	rt.setAt(jobs, "Bartender", 61);
	rt.setAt(jobs, "Cook", 62);
	rt.setAt(jobs, "Botanist", 63);
	rt.setAt(jobs, "Curator", 64);
	rt.setAt(jobs, "Chaplain", 65);
	rt.setAt(jobs, "Clown", 66);
	rt.setAt(jobs, "Mime", 67);
	rt.setAt(jobs, "Janitor", 68);
	rt.setAt(jobs, "Lawyer", 69);
	rt.setAt(jobs, "Admiral", 200);
	rt.setAt(jobs, "Centcom Commander", 210);
	rt.setAt(jobs, "Custodian", 211);
	rt.setAt(jobs, "Medical Officer", 212);
	rt.setAt(jobs, "Research Officer", 213);
	rt.setAt(jobs, "Emergency Response Team Commander", 220);
	rt.setAt(jobs, "Security Response Officer", 221);
	rt.setAt(jobs, "Engineer Response Officer", 222);
	rt.setAt(jobs, "Medical Response Officer", 223);
	rt.setAt(jobs, "Assistant", 999);
	this.jobs = jobs;
	this.interfaces = list();
	this.data = list();
	register_asset("crewmonitor.js", rt.rsc("code/game/machinery/computer/crew.js"));
	register_asset("crewmonitor.css", rt.rsc("code/game/machinery/computer/crew.css"));
	return f.dot;
});

// crew.dm:83
rt.def("/datum/crewmonitor/proc/Destroy", function* Destroy(f: Frame) {
	let hi: Value = null;
	if (this.interfaces) {
		for (hi of each(this.interfaces, T("/datum/html_interface"))) {
			yield* qdel(hi);
		}
		this.interfaces = null;
	}
	return (yield* parent_proc());
}, true);

// crew.dm:91
rt.def("/datum/crewmonitor/proc/show", function* show(f: Frame, mob: Value, z: Value) {
	let hi: Value = null;
	if (mob.client) {
		yield* this.sendResources(mob.client);
	}
	if (!z) {
		z = mob.z;
	}
	if (!(z > 0 && this.interfaces)) return f.dot;
	if (!rt.index(this.interfaces, `${z}`)) {
		rt.setAt(this.interfaces, `${z}`, (yield* new_(T("/datum/html_interface/nanotrasen"), this, "Crew Monitoring", 900, 540, `<link rel="stylesheet" type="text/css" href="crewmonitor.css" /><script type="text/javascript">var z = ${z}; var tile_size = ${rt.world().icon_size}; var maxx = ${rt.world().maxx}; var maxy = ${rt.world().maxy};</script><script type="text/javascript" src="crewmonitor.js"></script>`)));
		yield* (hi = rt.index(this.interfaces, `${z}`)).updateContent("content", "<div id=\"minimap\"><a href=\"javascript:zoomIn();\" class=\"zoom in\">+</a><a href=\"javascript:zoomOut();\" class=\"zoom\">-</a></div><div id=\"textbased\"></div>");
		yield* this.update(z, 1);
	} else {
		hi = rt.index(this.interfaces, `${z}`);
		yield* this.update(z, 1);
	}
	rt.op(f, "BrowseResource", [], [mob, file("code/game/machinery/computer/crew.js"), "crew.js"], false);
	rt.op(f, "BrowseResource", [], [mob, file("code/game/machinery/computer/crew.css"), "crew.css"], false);
	yield* (hi = rt.index(this.interfaces, `${z}`)).show(mob);
	yield* this.updateFor(mob, hi, z);
	return f.dot;
}, true);

// crew.dm:121
rt.def("/datum/crewmonitor/proc/updateFor", function* updateFor(f: Frame, hclient_or_mob: Value, hi: Value, z: Value) {
	let L: Value = null;
	yield* hi.callJavaScript("clearAll", null, hclient_or_mob);
	for (L of each(this.data, T("/list"))) {
		yield* hi.callJavaScript("add", L, hclient_or_mob);
	}
	yield* hi.callJavaScript("onAfterUpdate", null, hclient_or_mob);
	return f.dot;
}, true);

// crew.dm:129
rt.def("/datum/crewmonitor/proc/update", function* update(f: Frame, z: Value, ignore_unused: Value) {
	let U: Value = null, I: Value = null, pos: Value = null, ijob: Value = null, name: Value = null, assignment: Value = null, dam1: Value = null, dam2: Value = null, dam3: Value = null, dam4: Value = null, area: Value = null, pos_x: Value = null, pos_y: Value = null, life_status: Value = null, H: Value = null, player_area: Value = null;
	let $0: any, $e: any;
	ignore_unused ??= 0;
	if (!rt.index(this.interfaces, `${z}`)) return f.dot;
	let hi: Value = rt.index(this.interfaces, `${z}`);
	if (!(ignore_unused || (yield* hi.isUsed()))) return f.dot;
	let results: Value = list();
	for (H of each(GLOB.mob_list, T("/mob/living/carbon/human"))) {
		if ((H.z == 0 || H.z == z) && rt.istype(H.w_uniform, T("/obj/item/clothing/under"))) {
			if ((U = H.w_uniform).has_sensor > 0 && U.sensor_mode) {
				if (H.z == 0 || U.sensor_mode == SENSOR_COORDS) {
					$0 = rt.getStep(f, H, 0);
				} else {
					$0 = null;
				}
				pos = $0;
				if (H.z == 0 && (!pos || pos.z != z)) {
					continue;
				}
				if (H.wear_id) {
					$0 = H.wear_id.GetID();
				} else {
					$0 = null;
				}
				if (I = $0) {
					name = I.registered_name;
					assignment = I.assignment;
					ijob = rt.index(this.jobs, I.assignment);
				} else {
					name = "<i>Unknown</i>";
					assignment = "";
					ijob = 80;
				}
				if (U.sensor_mode >= SENSOR_LIVING) {
					if (!H.stat) {
						$0 = "true";
					} else {
						$0 = "false";
					}
					life_status = $0;
				} else {
					life_status = null;
				}
				if (U.sensor_mode >= SENSOR_VITALS) {
					dam1 = round(H.getOxyLoss(), 1);
					dam2 = round(H.getToxLoss(), 1);
					dam3 = round(H.getFireLoss(), 1);
					dam4 = round(H.getBruteLoss(), 1);
				} else {
					dam1 = null;
					dam2 = null;
					dam3 = null;
					dam4 = null;
				}
				if (U.sensor_mode >= SENSOR_COORDS) {
					if (!pos) {
						pos = rt.getStep(f, H, 0);
					}
					area = format_text((player_area = get_area(H)).name);
					pos_x = pos.x;
					pos_y = pos.y;
				} else {
					area = null;
					pos_x = null;
					pos_y = null;
				}
				rt.setAt(results, ++results.len, list(name, assignment, ijob, life_status, dam1, dam2, dam3, dam4, area, pos_x, pos_y, H.can_track(null)));
			}
		}
	}
	this.data = results;
	yield* this.updateFor(null, hi, z);
	return f.dot;
}, true);

// crew.dm:205
rt.def("/datum/crewmonitor/proc/hiIsValidClient", function hiIsValidClient(f: Frame, hclient: Value, hi: Value) {
	let z: Value = "";
	for (z of each(this.interfaces)) {
		if (rt.index(this.interfaces, z) == hi) {
			break;
		}
	}
	if (hclient.client.mob && IsAdminGhost(hclient.client.mob)) {
		return 1;
	}
	if (hclient.client.mob && hclient.client.mob.stat == 0 && hclient.client.mob.z == text2num(z)) {
		if (rt.istype(hclient.client.mob, T("/mob/living/silicon/ai"))) {
			return 1;
		} else {
			if (rt.istype(hclient.client.mob, T("/mob/living/silicon/robot"))) {
				return (rt.locateIn(f, T("/obj/machinery/computer/crew"), range(rt.world().view, hclient.client.mob)) || rt.locateIn(f, T("/obj/item/device/sensor_device"), hclient.client.mob.contents));
			}
			return (rt.locateIn(f, T("/obj/machinery/computer/crew"), range(1, hclient.client.mob)) || rt.locateIn(f, T("/obj/item/device/sensor_device"), hclient.client.mob.contents));
		}
	} else {
		return 0;
	}
});

// crew.dm:223
rt.def("/datum/crewmonitor/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value, hclient: Value) {
	let x: Value = null, y: Value = null, tile: Value = null, C: Value = null;
	if (!rt.istype(hclient, T("/datum/html_interface_client"))) return f.dot;
	if (!(hclient && hclient.client && hclient.client.mob && rt.istype(hclient.client.mob, T("/mob/living/silicon/ai")))) return f.dot;
	let AI: Value = hclient.client.mob;
	const item = rt.at(href_list, "action");
	if (item === "select_person") {
		AI.ai_camera_track(rt.at(href_list, "name"));
	} else if (item === "select_position") {
		x = text2num(rt.at(href_list, "x"));
		y = text2num(rt.at(href_list, "y"));
		tile = rt.locate(x, y, AI.z);
		if (!(C = rt.locateIn(f, T("/obj/machinery/camera"), range(5, tile)))) {
			C = rt.locateIn(f, T("/obj/machinery/camera"), urange(10, tile));
		}
		if (!C) {
			C = rt.locateIn(f, T("/obj/machinery/camera"), urange(15, tile));
		}
		if (!C) return f.dot;
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/crewmonitor/proc/update_ai"), AI, C, AI.eyeobj.loc)), min(30, get_dist(rt.getStep(f, C, 0), AI.eyeobj) / 4));
	}
	return f.dot;
}, true);

// crew.dm:245
rt.def("/datum/crewmonitor/proc/update_ai", function* update_ai(f: Frame, AI: Value, C: Value, current_loc: Value) {
	if (!(AI && AI.eyeobj && current_loc == AI.eyeobj.loc)) return f.dot;
	yield* AI.switchCamera(C);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/silicon/ai" }, { type: 4, path: "/obj/machinery/camera" }, { path: "/turf" }] });

// crew.dm:249
rt.def("/mob/living/carbon/human/proc/Move", function* Move(f: Frame) {
	let old_z: Value = null;
	if (this.w_uniform) {
		old_z = this.z;
		f.dot = (yield* parent_proc());
		if (old_z != this.z) {
			yield* GLOB.crewmonitor.queueUpdate(old_z);
		}
		yield* GLOB.crewmonitor.queueUpdate(this.z);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// crew.dm:260
rt.def("/datum/crewmonitor/proc/queueUpdate", function* queueUpdate(f: Frame, z: Value) {
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/crewmonitor/proc/update"), z)), 5, 1);
	return f.dot;
}, true);

// crew.dm:263
rt.def("/datum/crewmonitor/proc/sendResources", function* sendResources(f: Frame, client: Value) {
	yield* send_asset(client, "crewmonitor.js");
	yield* send_asset(client, "crewmonitor.css");
	yield* GLOB.SSminimap.send(client);
	return f.dot;
}, true);
