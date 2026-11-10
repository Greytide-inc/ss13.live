// Based on /tg/station's code/modules/power/singularity/particle_accelerator/particle_control.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(10630, "/obj/machinery/particle_accelerator/control_box", "/obj/machinery/particle_accelerator", {
	strength_upper_limit: 2,
	interface_control: 1,
	connected_parts: null,
	assembled: 0,
	construction_state: 0,
	active: 0,
	strength: 0,
	powered: 0,
	anchored: 0,
	name: "Particle Accelerator Control Console",
	desc: "This controls the density of the particles.",
	icon: rt.rsc("icons/obj/machines/particle_accelerator.dmi"),
	icon_state: "control_box",
	density: 1,
	use_power: 0,
	idle_power_usage: 500,
	active_power_usage: 10000,
	dir: 1,
	mouse_opacity: 2,
});

// particle_control.dm:23
rt.def("/obj/machinery/particle_accelerator/control_box/proc/New", function* New(f: Frame) {
	this.wires = (yield* new_(T("/datum/wires/particle_accelerator/control_box"), this));
	this.connected_parts = list();
	yield* parent_proc();
	return f.dot;
}, true);

// particle_control.dm:29
rt.def("/obj/machinery/particle_accelerator/control_box/proc/Destroy", function* Destroy(f: Frame) {
	let CP: Value = null, part: Value = null;
	if (this.active) {
		yield* this.toggle_power();
	}
	for (CP of each(this.connected_parts)) {
		(part = CP).master = null;
	}
	this.connected_parts.Cut();
	yield* qdel(this.wires);
	this.wires = null;
	return (yield* parent_proc());
}, true);

// particle_control.dm:39
rt.def("/obj/machinery/particle_accelerator/control_box/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.construction_state == 3) {
		yield* this.interact(user);
	} else {
		if (this.construction_state != 2) return f.dot;
		yield* this.wires.interact(user);
	}
	return f.dot;
}, true);

// particle_control.dm:45
rt.def("/obj/machinery/particle_accelerator/control_box/proc/update_state", function update_state(f: Frame) {
	let CP: Value = null, part: Value = null;
	if (this.construction_state < 3) {
		this.use_power = 0;
		this.assembled = 0;
		this.active = 0;
		for (CP of each(this.connected_parts)) {
			(part = CP).strength = null;
			part.powered = 0;
			part.update_icon();
		}
		this.connected_parts.Cut();
		return f.dot;
	}
	if (this.part_scan()) return f.dot;
	this.use_power = 1;
	this.active = 0;
	this.connected_parts.Cut();
	return f.dot;
});

// particle_control.dm:63
rt.def("/obj/machinery/particle_accelerator/control_box/proc/update_icon", function update_icon(f: Frame) {
	if (this.active) {
		this.icon_state = "control_boxp1";
	} else if (this.use_power) {
		if (this.assembled) {
			this.icon_state = "control_boxp";
		} else {
			this.icon_state = "ucontrol_boxp";
		}
	} else if (this.construction_state === 0 || this.construction_state === 1) {
		this.icon_state = "control_box";
	} else if (this.construction_state === 2) {
		this.icon_state = "control_boxw";
	} else {
		this.icon_state = "control_boxc";
	}
	return f.dot;
});

// particle_control.dm:80
rt.def("/obj/machinery/particle_accelerator/control_box/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (!this.interface_control) {
		to_chat(f.usr, "<span class='error'>ERROR: Request timed out. Check wire contacts.</span>");
		return f.dot;
	}
	if (rt.at(href_list, "close")) {
		rt.op(f, "Browse", [], [f.usr, null, "window=pacontrol"], false);
		yield* f.usr.unset_machine();
		return f.dot;
	}
	if (rt.at(href_list, "togglep")) {
		if (!this.wires.is_cut("Power")) {
			yield* this.toggle_power();
		}
	} else if (rt.at(href_list, "scan")) {
		this.part_scan();
	} else if (rt.at(href_list, "strengthup")) {
		if (!this.wires.is_cut("Strength")) {
			this.add_strength();
		}
	} else if (rt.at(href_list, "strengthdown")) {
		if (!this.wires.is_cut("Strength")) {
			this.remove_strength();
		}
	}
	yield* this.updateDialog();
	yield* this.update_icon();
	return f.dot;
}, true);

// particle_control.dm:110
rt.def("/obj/machinery/particle_accelerator/control_box/proc/strength_change", function strength_change(f: Frame) {
	let CP: Value = null, part: Value = null;
	for (CP of each(this.connected_parts)) {
		(part = CP).strength = this.strength;
		part.update_icon();
	}
	return f.dot;
});

// particle_control.dm:116
rt.def("/obj/machinery/particle_accelerator/control_box/proc/add_strength", function add_strength(f: Frame, s: Value) {
	let $2: any;
	if (!(this.assembled && this.strength < this.strength_upper_limit)) return f.dot;
	this.strength++;
	this.strength_change();
	let $0: any = this.strength;
	let $1: any = `${key_name_admin(f.usr)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [f.usr])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [f.usr])}`;
	if (this) {
		$2 = `${`(${this.x},${this.y},${this.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${this.x};Y=${this.y};Z=${this.z}'>JMP</a>)`}`;
	} else {
		$2 = "nonexistent location";
	}
	message_admins(`PA Control Computer increased to ${$0} by ${$1} in ${`${$2}`}`, 0, 1);
	log_game(`PA Control Computer increased to ${this.strength} by ${key_name(f.usr)} in ${`(${this.x},${this.y},${this.z})`}`);
	this.investigate_log(`increased to <font color='red'>${this.strength}</font> by ${key_name(f.usr)}`, "singulo");
	return f.dot;
});

// particle_control.dm:126
rt.def("/obj/machinery/particle_accelerator/control_box/proc/remove_strength", function remove_strength(f: Frame, s: Value) {
	let $2: any;
	if (!(this.assembled && this.strength > 0)) return f.dot;
	this.strength--;
	this.strength_change();
	let $0: any = this.strength;
	let $1: any = `${key_name_admin(f.usr)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [f.usr])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [f.usr])}`;
	if (this) {
		$2 = `${`(${this.x},${this.y},${this.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${this.x};Y=${this.y};Z=${this.z}'>JMP</a>)`}`;
	} else {
		$2 = "nonexistent location";
	}
	message_admins(`PA Control Computer decreased to ${$0} by ${$1} in ${`${$2}`}`, 0, 1);
	log_game(`PA Control Computer decreased to ${this.strength} by ${key_name(f.usr)} in ${`(${this.x},${this.y},${this.z})`}`);
	this.investigate_log(`decreased to <font color='green'>${this.strength}</font> by ${key_name(f.usr)}`, "singulo");
	return f.dot;
});

// particle_control.dm:136
rt.def("/obj/machinery/particle_accelerator/control_box/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	if (rt.bitAnd(this.stat, 2)) {
		this.active = 0;
		this.use_power = 0;
	} else {
		if (!(!this.stat && this.construction_state == 3)) return f.dot;
		this.use_power = 1;
	}
	return f.dot;
});

// particle_control.dm:146
rt.def("/obj/machinery/particle_accelerator/control_box/proc/process", function* process(f: Frame) {
	let PE: Value = null;
	if (!this.active) return f.dot;
	if (rt.len(f, this.connected_parts) < 6) {
		this.investigate_log("lost a connected part; It <font color='red'>powered down</font>.", "singulo");
		yield* this.toggle_power();
		yield* this.update_icon();
		return f.dot;
	}
	for (PE of each(this.connected_parts, T("/obj/structure/particle_accelerator/particle_emitter"))) {
		yield* PE.emit_particle(this.strength);
	}
	return f.dot;
}, true, { waitfor: false });

// particle_control.dm:156
rt.def("/obj/machinery/particle_accelerator/control_box/proc/part_scan", function part_scan(f: Frame) {
	let F: Value = null;
	let ldir: Value = turn(this.dir, -90);
	let rdir: Value = turn(this.dir, 90);
	let odir: Value = turn(this.dir, 180);
	let _T: Value = this.loc;
	this.assembled = 0;
	this.critical_machine = 0;
	if (!(F = rt.locateIn(f, T("/obj/structure/particle_accelerator/fuel_chamber"), orange(1, this)))) {
		return 0;
	}
	this.setDir(F.dir);
	this.connected_parts.Cut();
	if (!this.check_part((_T = rt.getStep(f, _T, rdir)), T("/obj/structure/particle_accelerator/fuel_chamber"))) {
		return 0;
	}
	if (!this.check_part((_T = rt.getStep(f, _T, odir)), T("/obj/structure/particle_accelerator/end_cap"))) {
		return 0;
	}
	if (!this.check_part((_T = rt.getStep(f, (_T = rt.getStep(f, _T, this.dir)), this.dir)), T("/obj/structure/particle_accelerator/power_box"))) {
		return 0;
	}
	if (!this.check_part((_T = rt.getStep(f, _T, this.dir)), T("/obj/structure/particle_accelerator/particle_emitter/center"))) {
		return 0;
	}
	if (!this.check_part((_T = rt.getStep(f, _T, ldir)), T("/obj/structure/particle_accelerator/particle_emitter/left"))) {
		return 0;
	}
	if (!this.check_part((_T = rt.getStep(f, (_T = rt.getStep(f, _T, rdir)), rdir)), T("/obj/structure/particle_accelerator/particle_emitter/right"))) {
		return 0;
	}
	this.assembled = 1;
	this.critical_machine = 1;
	return 1;
});

// particle_control.dm:197
rt.def("/obj/machinery/particle_accelerator/control_box/proc/check_part", function check_part(f: Frame, _T: Value, type: Value) {
	let PA: Value = null;
	if (rt.op(f, "IsType", [], [(PA = rt.locateIn(f, T("/obj/structure/particle_accelerator"), _T)), type]) && PA.construction_state == 3) {
		if (PA.connect_master(this)) {
			this.connected_parts.Add(PA);
			return 1;
		}
	}
	return 0;
});

// particle_control.dm:206
rt.def("/obj/machinery/particle_accelerator/control_box/proc/toggle_power", function toggle_power(f: Frame) {
	let CP: Value = null, part: Value = null;
	let $0: any, $1: any, $e: any;
	this.active = (!this.active ? 1 : 0);
	if (this.active) {
		$0 = "<font color='green'>ON</font>";
	} else {
		$0 = "<font color='red'>OFF</font>";
	}
	if (f.usr) {
		$1 = key_name(f.usr);
	} else {
		$1 = "outside forces";
	}
	this.investigate_log(`turned ${$0} by ${$1}`, "singulo");
	if (this.active) {
		$0 = "ON";
	} else {
		$0 = "OFF";
	}
	if (f.usr) {
		$1 = key_name_admin(f.usr);
	} else {
		$1 = "outside forces";
	}
	message_admins(fmt("PA Control Computer turned ＀ by ＀(<A HREF='?_src_=holder;adminmoreinfo=＃'>?</A>) (<A HREF='?_src_=holder;adminplayerobservefollow=＃'>FLW</A>) in (＀,＀,＀ - <A HREF='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [$0, $1, f.usr, f.usr, this.x, this.y, this.z, this.x, this.y, this.z]), 0, 1);
	if (this.active) {
		$0 = "ON";
	} else {
		$0 = "OFF";
	}
	if (f.usr) {
		$1 = `${key_name(f.usr)}`;
	} else {
		$1 = "outside forces";
	}
	log_game(`PA Control Computer turned ${$0} by ${$1} in (${this.x},${this.y},${this.z})`);
	if (this.active) {
		this.use_power = 2;
		for (CP of each(this.connected_parts)) {
			(part = CP).strength = this.strength;
			part.powered = 1;
			part.update_icon();
		}
	} else {
		this.use_power = 1;
		CP = null;
		for (CP of each(this.connected_parts)) {
			(part = CP).strength = null;
			part.powered = 0;
			part.update_icon();
		}
	}
	return 1;
});

// particle_control.dm:228
rt.def("/obj/machinery/particle_accelerator/control_box/proc/interact", function* interact(f: Frame, user: Value) {
	let popup: Value = null;
	if (get_dist(this, user) > 1 || rt.bitAnd(this.stat, 3)) {
		if (!rt.istype(user, T("/mob/living/silicon"))) {
			yield* user.unset_machine();
			rt.op(f, "Browse", [], [user, null, "window=pacontrol"], false);
			return f.dot;
		}
	}
	yield* user.set_machine(this);
	let dat: Value = "";
	dat += fmt("<A href='?src=＃;close=1'>Close</A><BR><BR>", [this]);
	dat += "<h3>Status</h3>";
	if (!this.assembled) {
		dat += "Unable to detect all parts!<BR>";
		dat += fmt("<A href='?src=＃;scan=1'>Run Scan</A><BR><BR>", [this]);
	} else {
		dat += "All parts in place.<BR><BR>";
		dat += "Power:";
		if (this.active) {
			dat += "On<BR>";
		} else {
			dat += "Off <BR>";
		}
		dat += fmt("<A href='?src=＃;togglep=1'>Toggle Power</A><BR><BR>", [this]);
		dat += `Particle Strength: ${this.strength} `;
		dat += fmt("<A href='?src=＃;strengthdown=1'>--</A>|<A href='?src=＃;strengthup=1'>++</A><BR><BR>", [this, this]);
	}
	(popup = (yield* new_(T("/datum/browser"), user, "pacontrol", this.name, 420, 300))).set_content(dat);
	popup.set_title_image(user.browse_rsc_icon(this.icon, this.icon_state));
	yield* popup.open();
	return f.dot;
}, true);

// particle_control.dm:258
rt.def("/obj/machinery/particle_accelerator/control_box/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.construction_state === 0) {
		to_chat(user, "Looks like it's not attached to the flooring");
	} else if (this.construction_state === 1) {
		to_chat(user, "It is missing some cables");
	} else if (this.construction_state === 2) {
		to_chat(user, "The panel is open");
	}
	return f.dot;
}, false);

// particle_control.dm:271
rt.def("/obj/machinery/particle_accelerator/control_box/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let CC: Value = null;
	let did_something: Value = 0;
	if (this.construction_state === 0) {
		if (rt.istype(W, T("/obj/item/weapon/wrench")) && !this.isinspace()) {
			playsound(this.loc, W.usesound, 75, 1);
			this.anchored = 1;
			user.visible_message(`${user.name} secures the ${this.name} to the floor.`, "You secure the external bolts.");
			this.construction_state = 1;
			did_something = 1;
		}
	} else if (this.construction_state === 1) {
		if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
			playsound(this.loc, W.usesound, 75, 1);
			this.anchored = 0;
			user.visible_message(`${user.name} detaches the ${this.name} from the floor.`, "You remove the external bolts.");
			this.construction_state = 0;
			did_something = 1;
		} else if (rt.istype(W, T("/obj/item/stack/cable_coil"))) {
			if (yield* (CC = W).use(1)) {
				user.visible_message(`${user.name} adds wires to the ${this.name}.`, "You add some wires.");
				this.construction_state = 2;
				did_something = 1;
			}
		}
	} else if (this.construction_state === 2) {
		if (rt.istype(W, T("/obj/item/weapon/wirecutters"))) {
			user.visible_message(`${user.name} removes some wires from the ${this.name}.`, "You remove some wires.");
			this.construction_state = 1;
			did_something = 1;
		} else if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
			user.visible_message(`${user.name} closes the ${this.name}'s access panel.`, "You close the access panel.");
			this.construction_state = 3;
			did_something = 1;
		}
	} else if (this.construction_state === 3) {
		if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
			user.visible_message(`${user.name} opens the ${this.name}'s access panel.`, "You open the access panel.");
			this.construction_state = 2;
			did_something = 1;
		}
	}
	if (did_something) {
		user.changeNext_move(8);
		yield* this.update_state();
		yield* this.update_icon();
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// particle_control.dm:322
rt.def("/obj/machinery/particle_accelerator/control_box/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	if (!prob(50)) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);
