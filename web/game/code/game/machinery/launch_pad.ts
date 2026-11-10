// Based on /tg/station's code/game/machinery/launch_pad.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10800, "/obj/machinery/launchpad", "/obj/machinery", {
	icon_teleport: "lpad-beam",
	stationary: 1,
	display_name: "Launchpad",
	teleport_speed: 35,
	range: 5,
	teleporting: 0,
	power_efficiency: 1,
	x_offset: 0,
	y_offset: 0,
	anchored: 1,
	name: "bluespace launchpad",
	desc: "A bluespace pad able to thrust matter through bluespace, teleporting it to or from nearby locations.",
	icon: rt.rsc("icons/obj/telescience.dmi"),
	icon_state: "lpad-idle",
	use_power: 1,
	idle_power_usage: 200,
	active_power_usage: 2500,
});

// launch_pad.dm:21
rt.def("/obj/machinery/launchpad/proc/Initialize", function* Initialize(f: Frame) {
	let B: Value = null;
	f.dot = (yield* parent_proc());
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/launchpad")))).apply_default_parts(this);
	return f.dot;
}, true);

rt.type(6723, "/obj/item/weapon/circuitboard/machine/launchpad", "/obj/item/weapon/circuitboard/machine", {
	name: "Bluespace Launchpad (Machine Board)",
	build_path: rt.typePath("/obj/machinery/launchpad"),
	origin_tech: "programming=3;engineering=3;plasmatech=2;bluespace=3",
	req_components: null,
	def_components: null,
});

// launch_pad.dm:29
rt.def("/obj/item/weapon/circuitboard/machine/launchpad/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/ore/bluespace_crystal"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 1]);

	this.def_components = rt.alist(f, [T("/obj/item/weapon/ore/bluespace_crystal"), T("/obj/item/weapon/ore/bluespace_crystal/artificial")]);
	return f.dot;
});

// launch_pad.dm:36
rt.def("/obj/machinery/launchpad/proc/RefreshParts", function RefreshParts(f: Frame) {
	let M: Value = null;
	let E: Value = -1;
	for (M of each(this.component_parts, T("/obj/item/weapon/stock_parts/manipulator"))) {
		E += M.rating;
	}
	this.range = rt.initial(f, this, "range");
	this.range += E;
	return f.dot;
});

// launch_pad.dm:43
rt.def("/obj/machinery/launchpad/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let M: Value = null;
	if (this.stationary) {
		if (this.default_deconstruction_screwdriver(user, "lpad-idle-o", "lpad-idle", I)) {
			return f.dot;
		}
		if (this.panel_open) {
			if (rt.istype(I, T("/obj/item/device/multitool"))) {
				(M = I).buffer = this;
				to_chat(user, `<span class='notice'>You save the data in the ${I.name}'s buffer.</span>`);
				return 1;
			}
		}
		if (yield* this.exchange_parts(user, I)) {
			return f.dot;
		}
		if (yield* this.default_deconstruction_crowbar(I)) {
			return f.dot;
		}
	}
	return (yield* parent_proc());
}, true);

// launch_pad.dm:62
rt.def("/obj/machinery/launchpad/proc/isAvailable", function isAvailable(f: Frame) {
	if (rt.bitAnd(this.stat, 2)) {
		return 0;
	}
	if (this.panel_open) {
		return 0;
	}
	return 1;
});

// launch_pad.dm:70
rt.def("/obj/machinery/launchpad/proc/doteleport", function* doteleport(f: Frame, user: Value, sending: Value) {
	let ROI: Value = null, L: Value = null, _T: Value = null, C: Value = null, Q: Value = null;
	let $0: any, $e: any;
	if (this.teleporting) {
		to_chat(user, "<span class='warning'>ERROR: Launchpad busy.</span>");
		return f.dot;
	}
	let target_x: Value = this.x + this.x_offset;
	let target_y: Value = this.y + this.y_offset;
	let target: Value = rt.locate(target_x, target_y, this.z);
	let A: Value = get_area(target);
	flick(this.icon_teleport, this);
	playsound(rt.getStep(f, this, 0), rt.rsc("sound/weapons/flash.ogg"), 25, 1);
	this.teleporting = 1;
	yield* sleep(this.teleport_speed);
	if (!this || this.gc_destroyed || !this.isAvailable()) {
		return f.dot;
	}
	this.teleporting = 0;
	yield* this.use_power(1000);
	let source: Value = target;
	let dest: Value = rt.getStep(f, this, 0);
	let log_msg: Value = list();
	log_msg += `: ${key_name(user)} has teleported `;
	if (sending) {
		source = dest;
		dest = target;
	}
	playsound(rt.getStep(f, this, 0), rt.rsc("sound/weapons/emitter2.ogg"), 25, 1);
	for (ROI of each(source, T("/atom/movable"))) {
		if (ROI == this) {
			continue;
		}
		if (ROI.anchored) {
			if (rt.istype(ROI, T("/mob/living"))) {
				if ((L = ROI).buckled) {
					if (L.buckled.anchored) {
						continue;
					}
					log_msg += `${key_name(L)} (on a chair), `;
				} else {
					continue;
				}
			} else if (!rt.istype(ROI, T("/mob/dead/observer"))) {
				continue;
			}
		}
		if (ismob(ROI)) {
			log_msg += `${key_name((_T = ROI))}, `;
		} else {
			log_msg += `${ROI.name}`;
			if (rt.istype(ROI, T("/obj/structure/closet"))) {
				C = ROI;
				log_msg += " (";
				Q = null;
				for (Q of each(C)) {
					if (!(rt.istype(Q, T("/obj")) || rt.istype(Q, T("/mob")))) {
						continue;
					}
					if (ismob(Q)) {
						log_msg += `${key_name(Q)}, `;
					} else {
						log_msg += `${Q.name}, `;
					}
				}
				if (dd_hassuffix(log_msg, "(")) {
					log_msg += "empty)";
				} else {
					log_msg = dd_limittext(log_msg, rt.length(log_msg) - 2);
					log_msg += ")";
				}
			}
			log_msg += ", ";
		}
		yield* do_teleport(ROI, dest);
	}
	if (dd_hassuffix(log_msg, ", ")) {
		log_msg = dd_limittext(log_msg, rt.length(log_msg) - 2);
	} else {
		log_msg += "nothing";
	}
	if (sending) {
		$0 = "to";
	} else {
		$0 = "from";
	}
	let $1: any = target_x;
	let $2: any = target_y;
	let $3: any = this.z;
	this.investigate_log((log_msg += ` ${$0} ${$1}, ${$2}, ${$3} (${A ? A.name : "null area"})`).Join(), "telesci");
	yield* this.updateDialog();
	return f.dot;
}, true);

rt.type(10801, "/obj/machinery/launchpad/briefcase", "/obj/machinery/launchpad", {
	closed: 1,
	briefcase: null,
	icon_teleport: "blpad-beam",
	anchored: 0,
	teleport_speed: 20,
	range: 3,
	stationary: 0,
	name: "briefcase launchpad",
	desc: "A portable bluespace pad able to thrust matter through bluespace, teleporting it to or from nearby locations. Controlled via remote.",
	icon_state: "blpad-idle",
	use_power: 0,
	idle_power_usage: 0,
	active_power_usage: 0,
});

// launch_pad.dm:166
rt.def("/obj/machinery/launchpad/briefcase/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (rt.istype(this.loc, T("/obj/item/briefcase_launchpad"))) {
		this.briefcase = this.loc;
	} else {
		log_game(`${this} has been spawned without a briefcase.`);
		yield* qdel(this);
	}
	return f.dot;
}, true);

// launch_pad.dm:174
rt.def("/obj/machinery/launchpad/briefcase/proc/Destroy", function* Destroy(f: Frame) {
	if (!(!this.briefcase || this.briefcase.gc_destroyed)) {
		yield* qdel(this.briefcase);
	}
	this.briefcase = null;
	return (yield* parent_proc());
}, true);

// launch_pad.dm:182
rt.def("/obj/machinery/launchpad/briefcase/proc/isAvailable", function isAvailable(f: Frame) {
	if (this.closed) {
		return 0;
	}
	return parent_proc();
});

// launch_pad.dm:185
rt.def("/obj/machinery/launchpad/briefcase/proc/MouseDrop", function* MouseDrop(f: Frame, over_object: Value, src_location: Value, over_location: Value) {
	f.dot = (yield* parent_proc());
	if (!(over_object == f.usr && this.Adjacent(f.usr))) return f.dot;
	if (!this.briefcase || !f.usr.can_hold_items()) {
		return f.dot;
	}
	if (f.usr.incapacitated()) {
		to_chat(f.usr, "<span class='warning'>You can't do that right now!</span>");
		return f.dot;
	}
	f.usr.visible_message(`<span class='notice'>${f.usr} starts closing ${this}...</span>`, `<span class='notice'>You start closing ${this}...</span>`);
	if (!(yield* do_after(f.usr, 30, { target: f.usr }))) return f.dot;
	yield* f.usr.put_in_hands(this.briefcase);
	yield* this.forceMove(this.briefcase);
	this.closed = 1;
	return f.dot;
}, true);

// launch_pad.dm:199
rt.def("/obj/machinery/launchpad/briefcase/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let L: Value = null;
	if (rt.istype(I, T("/obj/item/device/launchpad_remote"))) {
		(L = I).pad = this;
		to_chat(user, `<span class='notice'>You link ${this} to ${L}.</span>`);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(9553, "/obj/item/briefcase_launchpad", "/obj/item", {
	pad: null,
	flags: 64,
	throw_speed: 2,
	throw_range: 4,
	name: "briefcase",
	desc: "It's made of AUTHENTIC faux-leather and has a price-tag still attached. Its owner must be a real professional.",
	icon: rt.rsc("icons/obj/storage.dmi"),
	icon_state: "briefcase",
	force: 8,
	hitsound: "swing_hit",
	w_class: 4,
	attack_verb: null,
	resistance_flags: 4,
	obj_integrity: 150,
	max_integrity: 150,
});

// launch_pad.dm:225
rt.def("/obj/item/briefcase_launchpad/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.pad = (yield* new_(T("/obj/machinery/launchpad/briefcase"), this));
	return f.dot;
}, true);

// launch_pad.dm:229
rt.def("/obj/item/briefcase_launchpad/proc/Destroy", function* Destroy(f: Frame) {
	if (!(!this.pad || this.pad.gc_destroyed)) {
		yield* qdel(this.pad);
	}
	this.pad = null;
	return (yield* parent_proc());
}, true);

// launch_pad.dm:235
rt.def("/obj/item/briefcase_launchpad/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (!isturf(user.loc)) {
		return f.dot;
	}
	yield* this.add_fingerprint(user);
	user.visible_message(`<span class='notice'>${user} starts setting down ${this}...`, `You start setting up ${this.pad}...`);
	if (!(yield* do_after(user, 30, { target: user }))) return f.dot;
	yield* this.pad.forceMove(rt.getStep(f, this, 0));
	this.pad.closed = 0;
	yield* user.transferItemToLoc(this, this.pad, 1);
	return f.dot;
}, true);

// launch_pad.dm:245
rt.def("/obj/item/briefcase_launchpad/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let L: Value = null;
	if (rt.istype(I, T("/obj/item/device/launchpad_remote"))) {
		(L = I).pad = this.pad;
		to_chat(user, `<span class='notice'>You link ${this.pad} to ${L}.</span>`);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(9221, "/obj/item/device/launchpad_remote", "/obj/item/device", {
	sending: 1,
	pad: null,
	name: "１Launchpad Control Remote",
	desc: "Used to teleport objects to and from a portable launchpad.",
	icon: rt.rsc("icons/obj/telescience.dmi"),
	icon_state: "blpad-remote",
	w_class: 2,
	slot_flags: 512,
	origin_tech: "materials=3;magnets=2;bluespace=4;syndicate=3",
});

// launch_pad.dm:264
rt.def("/obj/item/device/launchpad_remote/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "launchpad_remote";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (!(ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open)))) {
		(ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "launchpad_remote", "Briefcase Launchpad Remote", 550, 400, master_ui, state))).set_style("syndicate");
		yield* ui.open();
	}
	ui.set_autoupdate(1);
	return f.dot;
}, true);

// launch_pad.dm:273
rt.def("/obj/item/device/launchpad_remote/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null;
	let $0: any = (data = list());
	let $1: any = "has_pad";
	rt.setAt($0, $1, this.pad ? 1 : 0);
	if (this.pad) {
		rt.setAt(data, "pad_closed", this.pad.closed);
	}
	if (!this.pad || this.pad.closed) {
		return data;
	}
	rt.setAt(data, "pad_name", this.pad.display_name);
	rt.setAt(data, "abs_x", rt.op(f, "Abs", [], [this.pad.x_offset]));
	rt.setAt(data, "abs_y", rt.op(f, "Abs", [], [this.pad.y_offset]));
	rt.setAt(data, "north_south", this.pad.y_offset > 0 ? "N" : "S");
	rt.setAt(data, "east_west", this.pad.x_offset > 0 ? "E" : "W");
	return data;
});

// launch_pad.dm:288
rt.def("/obj/item/device/launchpad_remote/proc/teleport", function* teleport(f: Frame, user: Value, pad: Value) {
	if (!pad || pad.gc_destroyed) {
		to_chat(user, "<span class='warning'>ERROR: Launchpad not responding. Check launchpad integrity.</span>");
		return f.dot;
	}
	if (!pad.isAvailable()) {
		to_chat(user, "<span class='warning'>ERROR: Launchpad not operative. Make sure the launchpad is ready and powered.</span>");
		return f.dot;
	}
	yield* pad.doteleport(user, this.sending);
	return f.dot;
}, true);

// launch_pad.dm:297
rt.def("/obj/item/device/launchpad_remote/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let new_name: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "right") {
		if (this.pad.x_offset < this.pad.range) {
			this.pad.x_offset++;
		}
		f.dot = 1;
	} else if (action === "left") {
		if (this.pad.x_offset > this.pad.range * -1) {
			this.pad.x_offset--;
		}
		f.dot = 1;
	} else if (action === "up") {
		if (this.pad.y_offset < this.pad.range) {
			this.pad.y_offset++;
		}
		f.dot = 1;
	} else if (action === "down") {
		if (this.pad.y_offset > this.pad.range * -1) {
			this.pad.y_offset--;
		}
		f.dot = 1;
	} else if (action === "up-right") {
		if (this.pad.y_offset < this.pad.range) {
			this.pad.y_offset++;
		}
		if (this.pad.x_offset < this.pad.range) {
			this.pad.x_offset++;
		}
		f.dot = 1;
	} else if (action === "up-left") {
		if (this.pad.y_offset < this.pad.range) {
			this.pad.y_offset++;
		}
		if (this.pad.x_offset > this.pad.range * -1) {
			this.pad.x_offset--;
		}
		f.dot = 1;
	} else if (action === "down-right") {
		if (this.pad.y_offset > this.pad.range * -1) {
			this.pad.y_offset--;
		}
		if (this.pad.x_offset < this.pad.range) {
			this.pad.x_offset++;
		}
		f.dot = 1;
	} else if (action === "down-left") {
		if (this.pad.y_offset > this.pad.range * -1) {
			this.pad.y_offset--;
		}
		if (this.pad.x_offset > this.pad.range * -1) {
			this.pad.x_offset--;
		}
		f.dot = 1;
	} else if (action === "reset") {
		this.pad.y_offset = 0;
		this.pad.x_offset = 0;
		f.dot = 1;
	} else if (action === "rename") {
		f.dot = 1;
		if (!(new_name = (yield* stripped_input(f.usr, "How do you want to rename the launchpad?", "Launchpad", this.pad.display_name, 15)))) {
			return f.dot;
		}
		this.pad.display_name = new_name;
	} else if (action === "remove") {
		f.dot = 1;
		if (f.usr && (yield* alert(f.usr, "Are you sure?", "Unlink Launchpad", "I'm Sure", "Abort")) != "Abort") {
			this.pad = null;
		}
	} else if (action === "launch") {
		this.sending = 1;
		yield* this.teleport(f.usr, this.pad);
		f.dot = 1;
	} else if (action === "pull") {
		this.sending = 0;
		yield* this.teleport(f.usr, this.pad);
		f.dot = 1;
	}
	return f.dot;
}, true);
