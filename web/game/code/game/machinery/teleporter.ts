// Based on /tg/station's code/game/machinery/teleporter.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(10361, "/obj/machinery/computer/teleporter", "/obj/machinery/computer", {
	locked: null,
	regime_set: "Teleporter",
	id: null,
	power_station: null,
	calibrating: null,
	target: null,
	light_color: "#6496FA",
	name: "Teleporter Control Console",
	desc: "Used to control a linked teleportation Hub and Station.",
	icon_screen: "teleport",
	icon_keyboard: "teleport_key",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/teleporter"),
});

// teleporter.dm:18
rt.def("/obj/machinery/computer/teleporter/proc/New", function* New(f: Frame) {
	this.id = `${rand(1000, 9999)}`;
	yield* parent_proc();
	return f.dot;
}, true);

// teleporter.dm:22
rt.def("/obj/machinery/computer/teleporter/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.link_power_station();
	return f.dot;
}, true);

// teleporter.dm:27
rt.def("/obj/machinery/computer/teleporter/proc/Destroy", function* Destroy(f: Frame) {
	if (this.power_station) {
		this.power_station.teleporter_console = null;
		this.power_station = null;
	}
	return (yield* parent_proc());
}, true);

// teleporter.dm:34
rt.def("/obj/machinery/computer/teleporter/proc/link_power_station", function link_power_station(f: Frame) {
	let $e: any;
	if (this.power_station) {
		return f.dot;
	}
	rt.forList(f, 0, list(1, 4, 2, 8));
	while (($e = rt.next(f, 0)) !== undefined) {
		this.dir = $e;
		this.power_station = rt.locateIn(f, T("/obj/machinery/teleport/station"), rt.getStep(f, this, this.dir));
		if (this.power_station) {
			break;
		}
	}
	rt.endFor(f, 0);
	return this.power_station;
});

// teleporter.dm:41
rt.def("/obj/machinery/computer/teleporter/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let L: Value = null;
	if (rt.istype(I, T("/obj/item/device/gps"))) {
		if ((L = I).locked_location && !rt.bitAnd(this.stat, 3)) {
			if (!(yield* user.transferItemToLoc(L, this))) {
				to_chat(user, fmt("<span class='warning'>％！ is stuck to your hand, you cannot put it in ％！!</span>", [I, this]));
				return f.dot;
			}
			this.locked = L;
			to_chat(user, `<span class='caution'>You insert the GPS device into the ${this.name}'s slot.</span>`);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// teleporter.dm:53
rt.def("/obj/machinery/computer/teleporter/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	yield* this.attack_hand(user);
	return f.dot;
}, true);

// teleporter.dm:56
rt.def("/obj/machinery/computer/teleporter/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* this.interact(user);
	return f.dot;
}, true);

// teleporter.dm:61
rt.def("/obj/machinery/computer/teleporter/proc/interact", function* interact(f: Frame, user: Value) {
	let popup: Value = null;
	let $0: any;
	let data: Value = "<h3>Teleporter Status</h3>";
	if (!this.power_station) {
		data += "<div class='statusDisplay'>No power station linked.</div>";
	} else if (!this.power_station.teleporter_hub) {
		data += "<div class='statusDisplay'>No hub linked.</div>";
	} else {
		data += `<div class='statusDisplay'>Current regime: ${this.regime_set}<BR>`;
		if (!this.target) {
			$0 = "None";
		} else {
			$0 = get_area(this.target);
			$0 = `${$0} ${this.regime_set != "Gate" ? "" : "Teleporter"}`;
		}
		data += `Current target: ${$0}<BR>`;
		if (this.calibrating) {
			data += "Calibration: <font color='yellow'>In Progress</font>";
		} else if (this.power_station.teleporter_hub.calibrated || this.power_station.teleporter_hub.accurate >= 3) {
			data += "Calibration: <font color='green'>Optimal</font>";
		} else {
			data += "Calibration: <font color='red'>Sub-Optimal</font>";
		}
		data += "</div><BR>";
		data += fmt("<A href='?src=＃;regimeset=1'>Change regime</A><BR>", [this]);
		data += fmt("<A href='?src=＃;settarget=1'>Set target</A><BR>", [this]);
		if (this.locked) {
			data += fmt("<BR><A href='?src=＃;locked=1'>Get target from memory</A><BR>", [this]);
			data += fmt("<A href='?src=＃;eject=1'>Eject GPS device</A><BR>", [this]);
		} else {
			data += "<BR><span class='linkOff'>Get target from memory</span><BR>";
			data += "<span class='linkOff'>Eject GPS device</span><BR>";
		}
		data += fmt("<BR><A href='?src=＃;calibrate=1'>Calibrate Hub</A>", [this]);
	}
	(popup = (yield* new_(T("/datum/browser"), user, "teleporter", this.name, 400, 400))).set_content(data);
	yield* popup.open();
	return f.dot;
}, true);

// teleporter.dm:94
rt.def("/obj/machinery/computer/teleporter/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (rt.at(href_list, "eject")) {
		yield* this.eject();
		yield* this.updateDialog();
		return f.dot;
	}
	if (!this.check_hub_connection()) {
		yield* this.say("Error: Unable to detect hub.");
		return f.dot;
	}
	if (this.calibrating) {
		yield* this.say("Error: Calibration in progress. Stand by.");
		return f.dot;
	}
	if (rt.at(href_list, "regimeset")) {
		this.power_station.engaged = 0;
		yield* this.power_station.teleporter_hub.update_icon();
		this.power_station.teleporter_hub.calibrated = 0;
		this.reset_regime();
	}
	if (rt.at(href_list, "settarget")) {
		this.power_station.engaged = 0;
		yield* this.power_station.teleporter_hub.update_icon();
		this.power_station.teleporter_hub.calibrated = 0;
		yield* this.set_target(f.usr);
	}
	if (rt.at(href_list, "locked")) {
		this.power_station.engaged = 0;
		yield* this.power_station.teleporter_hub.update_icon();
		this.power_station.teleporter_hub.calibrated = 0;
		this.target = rt.getStep(f, this.locked.locked_location, 0);
	}
	if (rt.at(href_list, "calibrate")) {
		if (!this.target) {
			yield* this.say("Error: No target set to calibrate to.");
			return f.dot;
		}
		if (this.power_station.teleporter_hub.calibrated || this.power_station.teleporter_hub.accurate >= 3) {
			yield* this.say("Hub is already calibrated!");
			return f.dot;
		}
		yield* this.say("Processing hub calibration to target...");
		this.calibrating = 1;
		rt.spawnTail(f, 50 * (3 - this.power_station.teleporter_hub.accurate), "/obj/machinery/computer/teleporter/proc/Topic: spawn at game/machinery/teleporter.dm:131");
	}
	yield* this.updateDialog();
	return f.dot;
}, true);

// a spawn(multiply(50, subtract(3, rt.getI(f, rt.fieldI(f, rt.srcVarI(f, $ic[64]), $ic[65]), $ic[66])))) body of /obj/machinery/computer/teleporter/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/teleporter/proc/Topic: spawn at game/machinery/teleporter.dm:131", function* (f: Frame) {
	this.calibrating = 0;
	if (this.check_hub_connection()) {
		this.power_station.teleporter_hub.calibrated = 1;
		yield* this.say("Calibration complete.");
	} else {
		yield* this.say("Error: Unable to detect hub.");
	}
	yield* this.updateDialog();
	return null;
});

// teleporter.dm:146
rt.def("/obj/machinery/computer/teleporter/proc/check_hub_connection", function check_hub_connection(f: Frame) {
	if (!this.power_station) {
		return f.dot;
	}
	if (!this.power_station.teleporter_hub) {
		return f.dot;
	}
	return 1;
});

// teleporter.dm:154
rt.def("/obj/machinery/computer/teleporter/proc/reset_regime", function reset_regime(f: Frame) {
	this.target = null;
	if (this.regime_set == "Teleporter") {
		this.regime_set = "Gate";
	} else {
		this.regime_set = "Teleporter";
	}
	return f.dot;
});

// teleporter.dm:165
rt.def("/obj/machinery/computer/teleporter/proc/set_target", function* set_target(f: Frame, user: Value) {
	let R: Value = null, _T: Value = null, I: Value = null, M: Value = null, _T_4: Value = null, desc: Value = null, S: Value = null, R_3: Value = null, desc_3: Value = null, trg: Value = null;
	let L: Value = list();
	let areaindex: Value = list();
	if (this.regime_set == "Teleporter") {
		for (R of each(GLOB.teleportbeacons, T("/obj/item/device/radio/beacon"))) {
			if (!(_T = rt.getStep(f, R, 0))) {
				continue;
			}
			if (_T.z == ZLEVEL_CENTCOM || _T.z > ZLEVEL_SPACEMAX) {
				continue;
			}
			rt.setAt(L, avoid_assoc_duplicate_keys(_T.loc.name, areaindex), R);
		}
		for (I of each(GLOB.tracked_implants, T("/obj/item/weapon/implant/tracking"))) {
			if (!I.imp_in || !ismob(I.loc)) {
				continue;
			}
			if ((M = I.loc).stat == 2) {
				if (M.timeofdeath + 6000 < rt.worldTime(f)) {
					continue;
				}
			}
			if (!(_T_4 = rt.getStep(f, M, 0))) {
				continue;
			}
			if (_T_4.z == 1) {
				continue;
			}
			rt.setAt(L, avoid_assoc_duplicate_keys(M.real_name, areaindex), I);
		}
		desc = (yield* g.op(f, "Prompt", [1], [null, null, "Locking Computer", "Please select a location to lock in.", L]));
		this.target = rt.index(L, desc);
	} else {
		if (!rt.len(f, (S = this.power_station.linked_stations))) {
			to_chat(user, "<span class='alert'>No connected stations located.</span>");
			return f.dot;
		}
		for (R_3 of each(S, T("/obj/machinery/teleport/station"))) {
			if (!(_T_4 = rt.getStep(f, R_3, 0)) || !R_3.teleporter_hub || !R_3.teleporter_console) {
				continue;
			}
			if (_T_4.z == ZLEVEL_CENTCOM || _T_4.z > ZLEVEL_SPACEMAX) {
				continue;
			}
			rt.setAt(L, avoid_assoc_duplicate_keys(_T_4.loc.name, areaindex), R_3);
		}
		desc_3 = (yield* g.op(f, "Prompt", [ZLEVEL_CENTCOM], [null, null, "Locking Computer", "Please select a station to lock in.", L]));
		this.target = rt.index(L, desc_3);
		if (!this.target) return f.dot;
		(rt.modField(f, (trg = this.target), "linked_stations", this.power_station, rt.bitOr));
		(rt.modField(f, trg, "stat", 16777213, rt.bitAnd));
		if (trg.teleporter_hub) {
			(rt.modField(f, trg.teleporter_hub, "stat", 16777213, rt.bitAnd));
			yield* trg.teleporter_hub.update_icon();
		}
		if (!trg.teleporter_console) return f.dot;
		(rt.modField(f, trg.teleporter_console, "stat", 16777213, rt.bitAnd));
		yield* trg.teleporter_console.update_icon();
	}
	return f.dot;
}, true);

rt.type(10336, "/obj/machinery/teleport/hub", "/obj/machinery/teleport", {
	accurate: 0,
	power_station: null,
	calibrated: null,
	name: "teleporter hub",
	desc: "It's the hub of a teleporting machine.",
	icon_state: "tele0",
	use_power: 1,
	idle_power_usage: 10,
	active_power_usage: 2000,
});

// teleporter.dm:237
rt.def("/obj/machinery/teleport/hub/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/teleporter_hub"), null))).apply_default_parts(this);
	return f.dot;
}, true);

rt.type(6731, "/obj/item/weapon/circuitboard/machine/teleporter_hub", "/obj/item/weapon/circuitboard/machine", {
	name: "Teleporter Hub (Machine Board)",
	build_path: rt.typePath("/obj/machinery/teleport/hub"),
	origin_tech: "programming=3;engineering=4;bluespace=4;materials=4",
	req_components: null,
	def_components: null,
});

// teleporter.dm:245
rt.def("/obj/item/weapon/circuitboard/machine/teleporter_hub/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/ore/bluespace_crystal"), 3, T("/obj/item/weapon/stock_parts/matter_bin"), 1]);

	this.def_components = rt.alist(f, [T("/obj/item/weapon/ore/bluespace_crystal"), T("/obj/item/weapon/ore/bluespace_crystal/artificial")]);
	return f.dot;
});

// teleporter.dm:251
rt.def("/obj/machinery/teleport/hub/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.link_power_station();
	return f.dot;
}, true);

// teleporter.dm:256
rt.def("/obj/machinery/teleport/hub/proc/Destroy", function* Destroy(f: Frame) {
	if (this.power_station) {
		this.power_station.teleporter_hub = null;
		this.power_station = null;
	}
	return (yield* parent_proc());
}, true);

// teleporter.dm:262
rt.def("/obj/machinery/teleport/hub/proc/RefreshParts", function RefreshParts(f: Frame) {
	let M: Value = null;
	let A: Value = 0;
	for (M of each(this.component_parts, T("/obj/item/weapon/stock_parts/matter_bin"))) {
		A += M.rating;
	}
	this.accurate = A;
	return f.dot;
});

// teleporter.dm:269
rt.def("/obj/machinery/teleport/hub/proc/link_power_station", function link_power_station(f: Frame) {
	let $e: any;
	if (this.power_station) {
		return f.dot;
	}
	rt.forList(f, 0, list(1, 4, 2, 8));
	while (($e = rt.next(f, 0)) !== undefined) {
		this.dir = $e;
		this.power_station = rt.locateIn(f, T("/obj/machinery/teleport/station"), rt.getStep(f, this, this.dir));
		if (this.power_station) {
			break;
		}
	}
	rt.endFor(f, 0);
	return this.power_station;
});

// teleporter.dm:276
rt.def("/obj/machinery/teleport/hub/proc/Bumped", function* Bumped(f: Frame, M: Value) {
	if (this.z == ZLEVEL_CENTCOM) {
		to_chat(M, "You can't use this here.");
	}
	if (this.is_ready()) {
		yield* this.teleport(M);
		yield* this.use_power(5000);
	}
	return f.dot;
}, true);

// teleporter.dm:284
rt.def("/obj/machinery/teleport/hub/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (this.default_deconstruction_screwdriver(user, "tele-o", "tele0", W)) {
		if (this.power_station && this.power_station.engaged) {
			this.power_station.engaged = 0;
			yield* this.update_icon();
		}
		return f.dot;
	}
	if (yield* this.exchange_parts(user, W)) {
		return f.dot;
	}
	if (yield* this.default_deconstruction_crowbar(W)) {
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// teleporter.dm:297
rt.def("/obj/machinery/teleport/hub/proc/teleport", function* teleport(f: Frame, M: Value, _T: Value) {
	let com: Value = null, human: Value = null;
	if (!(com = this.power_station.teleporter_console)) {
		return f.dot;
	}
	if (!com.target) {
		this.visible_message("<span class='alert'>Cannot authenticate locked on coordinates. Please reinstate coordinate matrix.</span>");
		return f.dot;
	}
	if (rt.istype(M, T("/atom/movable"))) {
		if (yield* do_teleport(M, com.target)) {
			if (!this.calibrated && prob(30 - this.accurate * 10)) {
				if (rt.istype(M, T("/mob/living/carbon/human"))) {
					if ((human = M).dna && human.dna.species.id == "human") {
						to_chat(M, "<span class='italics'>You hear a buzzing in your ears.</span>");
						yield* human.set_species(T("/datum/species/fly"));
					}
					yield* human.apply_effect(rand(120 - this.accurate * 40, 180 - this.accurate * 60), "irradiate", 0);
				}
			}
			this.calibrated = 0;
		}
	}
	return f.dot;
}, true);

// teleporter.dm:317
rt.def("/obj/machinery/teleport/hub/proc/update_icon", function update_icon(f: Frame) {
	if (this.panel_open) {
		this.icon_state = "tele-o";
	} else if (this.is_ready()) {
		this.icon_state = "tele1";
	} else {
		this.icon_state = "tele0";
	}
	return f.dot;
});

// teleporter.dm:324
rt.def("/obj/machinery/teleport/hub/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	this.update_icon();
	return f.dot;
});

// teleporter.dm:328
rt.def("/obj/machinery/teleport/hub/proc/is_ready", function is_ready(f: Frame) {
	f.dot = (((((!this.panel_open ? 1 : 0) && (!rt.bitAnd(this.stat, 3) ? 1 : 0)) && this.power_station) && this.power_station.engaged) && (!rt.bitAnd(this.power_station.stat, 3) ? 1 : 0));
	return f.dot;
});

rt.type(10337, "/obj/machinery/teleport/hub/syndicate", "/obj/machinery/teleport/hub", {});

// teleporter.dm:331
rt.def("/obj/machinery/teleport/hub/syndicate/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.component_parts += (yield* new_(T("/obj/item/weapon/stock_parts/matter_bin/super"), null));
	yield* this.RefreshParts();
	return f.dot;
}, true);

rt.type(10338, "/obj/machinery/teleport/station", "/obj/machinery/teleport", {
	engaged: 0,
	teleporter_console: null,
	teleporter_hub: null,
	linked_stations: null,
	efficiency: 0,
	name: "station",
	desc: "The power control station for a bluespace teleporter. Used for toggling power, and can activate a test-fire to prevent malfunctions.",
	icon_state: "controller",
	use_power: 1,
	idle_power_usage: 10,
	active_power_usage: 2000,
});

// teleporter.dm:346
rt.def("/obj/machinery/teleport/station/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.linked_stations = list();
	return f.dot;
});

// teleporter.dm:350
rt.def("/obj/machinery/teleport/station/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/teleporter_station"), null))).apply_default_parts(this);
	return f.dot;
}, true);

rt.type(6732, "/obj/item/weapon/circuitboard/machine/teleporter_station", "/obj/item/weapon/circuitboard/machine", {
	name: "Teleporter Station (Machine Board)",
	build_path: rt.typePath("/obj/machinery/teleport/station"),
	origin_tech: "programming=4;engineering=4;bluespace=4;plasmatech=3",
	req_components: null,
	def_components: null,
});

// teleporter.dm:358
rt.def("/obj/item/weapon/circuitboard/machine/teleporter_station/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/ore/bluespace_crystal"), 2, T("/obj/item/weapon/stock_parts/capacitor"), 2, T("/obj/item/weapon/stock_parts/console_screen"), 1]);

	this.def_components = rt.alist(f, [T("/obj/item/weapon/ore/bluespace_crystal"), T("/obj/item/weapon/ore/bluespace_crystal/artificial")]);
	return f.dot;
});

// teleporter.dm:365
rt.def("/obj/machinery/teleport/station/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.link_console_and_hub();
	return f.dot;
}, true);

// teleporter.dm:370
rt.def("/obj/machinery/teleport/station/proc/RefreshParts", function RefreshParts(f: Frame) {
	let E: Value = null, C: Value = null;
	for (C of each(this.component_parts, T("/obj/item/weapon/stock_parts/capacitor"))) {
		E += C.rating;
	}
	this.efficiency = E - 1;
	return f.dot;
});

// teleporter.dm:375
rt.def("/obj/machinery/teleport/station/proc/link_console_and_hub", function link_console_and_hub(f: Frame) {
	let $e: any;
	rt.forList(f, 0, list(1, 4, 2, 8));
	while (($e = rt.next(f, 0)) !== undefined) {
		this.dir = $e;
		this.teleporter_hub = rt.locateIn(f, T("/obj/machinery/teleport/hub"), rt.getStep(f, this, this.dir));
		if (this.teleporter_hub) {
			this.teleporter_hub.link_power_station();
			break;
		}
	}
	rt.endFor(f, 0);
	rt.forList(f, 0, list(1, 4, 2, 8));
	while (($e = rt.next(f, 0)) !== undefined) {
		this.dir = $e;
		this.teleporter_console = rt.locateIn(f, T("/obj/machinery/computer/teleporter"), rt.getStep(f, this, this.dir));
		if (this.teleporter_console) {
			this.teleporter_console.link_power_station();
			break;
		}
	}
	rt.endFor(f, 0);
	return (this.teleporter_hub && this.teleporter_console);
});

// teleporter.dm:390
rt.def("/obj/machinery/teleport/station/proc/Destroy", function* Destroy(f: Frame) {
	if (this.teleporter_hub) {
		this.teleporter_hub.power_station = null;
		yield* this.teleporter_hub.update_icon();
		this.teleporter_hub = null;
	}
	if (this.teleporter_console) {
		this.teleporter_console.power_station = null;
		this.teleporter_console = null;
	}
	return (yield* parent_proc());
}, true);

// teleporter.dm:399
rt.def("/obj/machinery/teleport/station/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let M: Value = null;
	if (rt.istype(W, T("/obj/item/device/multitool"))) {
		M = W;
		if (this.panel_open) {
			M.buffer = this;
			to_chat(user, `<span class='caution'>You download the data to the ${W.name}'s buffer.</span>`);
		} else if (M.buffer && rt.istype(M.buffer, T("/obj/machinery/teleport/station")) && M.buffer != this) {
			if (rt.len(f, this.linked_stations) < this.efficiency) {
				this.linked_stations.Add(M.buffer);
				M.buffer = null;
				to_chat(user, `<span class='caution'>You upload the data from the ${W.name}'s buffer.</span>`);
			} else {
				to_chat(user, "<span class='alert'>This station can't hold more information, try to use better parts.</span>");
			}
		}
		return f.dot;
	} else if (this.default_deconstruction_screwdriver(user, "controller-o", "controller", W)) {
		yield* this.update_icon();
		return f.dot;
	} else if (yield* this.exchange_parts(user, W)) {
		return f.dot;
	} else if (yield* this.default_deconstruction_crowbar(W)) {
		return f.dot;
	} else if (rt.istype(W, T("/obj/item/weapon/wirecutters"))) {
		if (this.panel_open) {
			this.link_console_and_hub();
			to_chat(user, "<span class='caution'>You reconnect the station to nearby machinery.</span>");
			return f.dot;
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// teleporter.dm:432
rt.def("/obj/machinery/teleport/station/proc/attack_paw", function* attack_paw(f: Frame) {
	yield* this.attack_hand();
	return f.dot;
}, true);

// teleporter.dm:435
rt.def("/obj/machinery/teleport/station/proc/attack_ai", function* attack_ai(f: Frame) {
	yield* this.attack_hand();
	return f.dot;
}, true);

// teleporter.dm:438
rt.def("/obj/machinery/teleport/station/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.panel_open) return f.dot;
	yield* this.toggle(user);
	return f.dot;
}, true);

// teleporter.dm:442
rt.def("/obj/machinery/teleport/station/proc/toggle", function* toggle(f: Frame, user: Value) {
	if (rt.bitAnd(this.stat, 3) || !this.teleporter_hub || !this.teleporter_console) {
		return f.dot;
	}
	if (this.teleporter_console.target) {
		if (this.teleporter_hub.panel_open || rt.bitAnd(this.teleporter_hub.stat, 3)) {
			this.visible_message("<span class='alert'>The teleporter hub isn't responding.</span>");
		} else {
			this.engaged = (!this.engaged ? 1 : 0);
			yield* this.use_power(5000);
			this.visible_message(`<span class='notice'>Teleporter ${this.engaged ? "" : "dis"}engaged!</span>`);
		}
	} else {
		this.visible_message("<span class='alert'>No target detected.</span>");
		this.engaged = 0;
	}
	yield* this.teleporter_hub.update_icon();
	yield* this.add_fingerprint(user);
	return f.dot;
}, true);

// teleporter.dm:459
rt.def("/obj/machinery/teleport/station/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	this.update_icon();
	if (!this.teleporter_hub) return f.dot;
	this.teleporter_hub.update_icon();
	return f.dot;
});

// teleporter.dm:466
rt.def("/obj/machinery/teleport/station/proc/update_icon", function update_icon(f: Frame) {
	if (this.panel_open) {
		this.icon_state = "controller-o";
	} else if (rt.bitAnd(this.stat, 3)) {
		this.icon_state = "controller-p";
	} else {
		this.icon_state = "controller";
	}
	return f.dot;
});
