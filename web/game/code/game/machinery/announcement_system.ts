// Based on /tg/station's code/game/machinery/announcement_system.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// announcement_system.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobalannouncement_systems", function InitGlobalannouncement_systems(f: Frame) {
	GLOB.announcement_systems = list();
	this.gvars_datum_init_order += "announcement_systems";
	return f.dot;
});

rt.type(10775, "/obj/machinery/announcement_system", "/obj/machinery", {
	radio: null,
	arrival: "%PERSON has signed up as %RANK",
	arrivalToggle: 1,
	newhead: "%PERSON, %RANK, is the department head.",
	newheadToggle: 1,
	greenlight: "Light_Green",
	pinklight: "Light_Pink",
	errorlight: "Error_Red",
	anchored: 1,
	verb_say: "coldly states",
	verb_ask: "queries",
	verb_exclaim: "alarms",
	density: 1,
	name: "１Automated Announcement System",
	desc: "An automated announcement system that handles minor announcements over the radio.",
	icon: rt.rsc("icons/obj/machines/telecomms.dmi"),
	icon_state: "AAS_On",
	idle_power_usage: 20,
	active_power_usage: 50,
});

// announcement_system.dm:29
rt.def("/obj/machinery/announcement_system/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	GLOB.announcement_systems += this;
	this.radio = (yield* new_(T("/obj/item/device/radio/headset/ai"), this));
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/announcement_system"), null))).apply_default_parts(this);
	yield* this.update_icon();
	return f.dot;
}, true);

rt.type(6714, "/obj/item/weapon/circuitboard/machine/announcement_system", "/obj/item/weapon/circuitboard/machine", {
	name: "Announcement System (Machine Board)",
	build_path: rt.typePath("/obj/machinery/announcement_system"),
	origin_tech: "programming=3;bluespace=3;magnets=2",
	req_components: null,
});

// announcement_system.dm:42
rt.def("/obj/item/weapon/circuitboard/machine/announcement_system/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/stack/cable_coil"), 2, T("/obj/item/weapon/stock_parts/console_screen"), 1]);
	return f.dot;
});

// announcement_system.dm:47
rt.def("/obj/machinery/announcement_system/proc/update_icon", function update_icon(f: Frame) {
	if (this.is_operational()) {
		this.icon_state = this.panel_open ? "AAS_On_Open" : "AAS_On";
	} else {
		this.icon_state = this.panel_open ? "AAS_Off_Open" : "AAS_Off";
	}
	this.cut_overlays();
	if (this.arrivalToggle) {
		this.add_overlay(this.greenlight);
	}
	if (this.newheadToggle) {
		this.add_overlay(this.pinklight);
	}
	if (!rt.bitAnd(this.stat, 1)) return f.dot;
	this.add_overlay(this.errorlight);
	return f.dot;
});

// announcement_system.dm:64
rt.def("/obj/machinery/announcement_system/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.radio);
	this.radio = null;
	GLOB.announcement_systems -= this;
	return (yield* parent_proc());
}, true);

// announcement_system.dm:69
rt.def("/obj/machinery/announcement_system/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	this.update_icon();
	return f.dot;
});

// announcement_system.dm:73
rt.def("/obj/machinery/announcement_system/proc/attackby", function* attackby(f: Frame) {
	let $0: any, $1: any;
	if (rt.istype(f.args[0], T("/obj/item/weapon/screwdriver"))) {
		playsound(this.loc, f.args[0].usesound, 50, 1);
		this.panel_open = (!this.panel_open ? 1 : 0);
		$0 = f.args[1];
		if (this.panel_open) {
			$1 = "open";
		} else {
			$1 = "close";
		}
		to_chat($0, `<span class='notice'>You ${$1} the maintenance hatch of ${this}.</span>`);
		yield* this.update_icon();
	} else if (yield* this.default_deconstruction_crowbar(f.args[0])) {
		return f.dot;
	} else if (rt.istype(f.args[0], T("/obj/item/device/multitool")) && this.panel_open && rt.bitAnd(this.stat, 1)) {
		to_chat(f.args[1], `<span class='notice'>You reset ${this}'s firmware.</span>`);
		(rt.modSrcVar(f, "stat", 16777214, rt.bitAnd));
		yield* this.update_icon();
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true, { args: ["P", "user", "params"] });

// announcement_system.dm:88
rt.def("/obj/machinery/announcement_system/proc/CompileText", function CompileText(f: Frame, str: Value, user: Value, rank: Value) {
	return (str = replacetext((str = replacetext(str, "%PERSON", `${user}`)), "%RANK", `${rank}`));
});

// announcement_system.dm:93
rt.def("/obj/machinery/announcement_system/proc/announce", function* announce(f: Frame, message_type: Value, user: Value, rank: Value, channels: Value) {
	let message: Value = null, channel: Value = null;
	if (!this.is_operational()) {
		return f.dot;
	}
	if (message_type == "ARRIVAL" && this.arrivalToggle) {
		message = this.CompileText(this.arrival, user, rank);
	} else if (message_type == "NEWHEAD" && this.newheadToggle) {
		message = this.CompileText(this.newhead, user, rank);
	} else if (message_type == "ARRIVALS_BROKEN") {
		message = "The arrivals shuttle has been damaged. Docking for repairs...";
	}
	if (rt.len(f, channels) == 0) {
		yield* this.radio.talk_into(this, message, null, list("robot"), (yield* this.get_default_language()));
	} else {
		for (channel of each(channels)) {
			yield* this.radio.talk_into(this, message, channel, list("robot"), (yield* this.get_default_language()));
		}
	}
	return f.dot;
}, true, { argTypes: [{  }, {  }, {  }, { path: "/list" }] });

// announcement_system.dm:114
rt.def("/obj/machinery/announcement_system/proc/interact", function* interact(f: Frame, user: Value) {
	let popup: Value = null;
	let $1: any;
	if (rt.bitAnd(this.stat, 1)) {
		this.visible_message(`<span class='warning'>${this} buzzes.</span>`, "<span class='italics'>You hear a faint buzz.</span>");
		playsound(this.loc, rt.rsc("sound/machines/buzz-two.ogg"), 50, 1);
		return f.dot;
	}
	let $0: any = this;
	if (this.arrivalToggle) {
		$1 = "On";
	} else {
		$1 = "Off";
	}
	let contents: Value = fmt("Arrival Announcement:  <A href='?src=＃;ArrivalT-Topic=1'>(＀)</a><br>\n<A href='?src=＃;ArrivalTopic=1'>＀</a><br><br>\n", [$0, $1, this, this.arrival]);
	$0 = this;
	if (this.newheadToggle) {
		$1 = "On";
	} else {
		$1 = "Off";
	}
	contents += fmt("Departmental Head Announcement:  <A href='?src=＃;NewheadT-Topic=1'>(＀)</a><br>\n<A href='?src=＃;NewheadTopic=1'>＀</a><br><br>\n", [$0, $1, this, this.newhead]);
	(popup = (yield* new_(T("/datum/browser"), user, "announcement_config", "Automated Announcement Configuration", 370, 220))).set_content(contents);
	yield* popup.open();
	return f.dot;
}, true);

// announcement_system.dm:128
rt.def("/obj/machinery/announcement_system/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let NewMessage: Value = null;
	if (rt.bitAnd(this.stat, 1)) {
		this.visible_message(`<span class='warning'>${this} buzzes.</span>`, "<span class='italics'>You hear a faint buzz.</span>");
		playsound(this.loc, rt.rsc("sound/machines/buzz-two.ogg"), 50, 1);
		return f.dot;
	}
	if (rt.at(href_list, "ArrivalTopic")) {
		NewMessage = (yield* stripped_input(f.usr, "Enter in the arrivals announcement configuration.", "Arrivals Announcement Config", this.arrival));
		if (!(get_dist(this, f.usr) <= 1) && this.loc != f.usr && !rt.istype(f.usr, T("/mob/living/silicon/ai")) && !IsAdminGhost(f.usr)) {
			return f.dot;
		}
		if (NewMessage) {
			this.arrival = NewMessage;
		}
	} else if (rt.at(href_list, "NewheadTopic")) {
		NewMessage = (yield* stripped_input(f.usr, "Enter in the departmental head announcement configuration.", "Head Departmental Announcement Config", this.newhead));
		if (!(get_dist(this, f.usr) <= 1) && this.loc != f.usr && !rt.istype(f.usr, T("/mob/living/silicon/ai")) && !IsAdminGhost(f.usr)) {
			return f.dot;
		}
		if (NewMessage) {
			this.newhead = NewMessage;
		}
	} else if (rt.at(href_list, "NewheadT-Topic")) {
		this.newheadToggle = (!this.newheadToggle ? 1 : 0);
		yield* this.update_icon();
	} else if (rt.at(href_list, "ArrivalT-Topic")) {
		this.arrivalToggle = (!this.arrivalToggle ? 1 : 0);
		yield* this.update_icon();
	}
	yield* this.add_fingerprint(f.usr);
	yield* this.interact(f.usr);
	return f.dot;
}, true);

// announcement_system.dm:157
rt.def("/obj/machinery/announcement_system/proc/attack_robot", function* attack_robot(f: Frame, user: Value) {
	f.dot = (yield* this.attack_ai(user));
	return f.dot;
}, true);

// announcement_system.dm:160
rt.def("/obj/machinery/announcement_system/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	if (!rt.istype(user, T("/mob/living/silicon")) && !IsAdminGhost(user)) {
		return f.dot;
	}
	if (rt.bitAnd(this.stat, 1)) {
		to_chat(user, `<span class='warning'>${this}'s firmware appears to be malfunctioning!</span>`);
		return f.dot;
	}
	yield* this.interact(user);
	return f.dot;
}, true);

// announcement_system.dm:168
rt.def("/obj/machinery/announcement_system/proc/act_up", function act_up(f: Frame) {
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	this.update_icon();
	this.arrival = pick("#!@%ERR-34%2 CANNOT LOCAT@# JO# F*LE!", "CRITICAL ERROR 99.", "ERR)#: DA#AB@#E NOT F(*ND!");
	this.newhead = pick("OV#RL()D: [UNKNOWN??] DET*#CT)D!", "ER)#R - B*@ TEXT F*O(ND!", "AAS.exe is not responding. NanoOS is searching for a solution to the problem.");
	return f.dot;
});

// announcement_system.dm:175
rt.def("/obj/machinery/announcement_system/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (!rt.bitAnd(this.stat, 3)) {
		this.act_up();
	}
	yield* parent_proc(severity);
	return f.dot;
}, true);

// announcement_system.dm:180
rt.def("/obj/machinery/announcement_system/proc/emag_act", function emag_act(f: Frame) {
	if (this.emagged) return f.dot;
	this.emagged = 1;
	this.act_up();
	return f.dot;
});
