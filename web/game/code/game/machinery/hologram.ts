// Based on /tg/station's code/game/machinery/hologram.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, add, fmt } = rt;


rt.type(10796, "/obj/machinery/holopad", "/obj/machinery", {
	masters: null,
	last_request: 0,
	holo_range: 5,
	temp: "",
	holo_calls: null,
	outgoing_call: null,
	flags: 16,
	anchored: 1,
	name: "holopad",
	desc: "It's a floor-mounted device for projecting holographic images.",
	icon_state: "holopad0",
	layer: 2.5,
	use_power: 1,
	idle_power_usage: 5,
	active_power_usage: 100,
	obj_integrity: 300,
	max_integrity: 300,
	armor: null,
}, { global: { force_answer_call: 757, holopads: 758 } });

// hologram.dm:44
rt.def("/obj/machinery/holopad/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.masters = list();
	this.armor = rt.alist(f, ["melee", 50, "bullet", 20, "laser", 20, "energy", 20, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 0]);
	return f.dot;
});

// hologram.dm:54
rt.def("/obj/machinery/holopad/proc/Initialize", function* Initialize(f: Frame) {
	let B: Value = null;
	f.dot = (yield* parent_proc());
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/holopad"), null))).apply_default_parts(this);
	GLOB.holopads += this;
	return f.dot;
}, true);

// hologram.dm:61
rt.def("/obj/machinery/holopad/proc/Destroy", function* Destroy(f: Frame) {
	let I: Value = null, HC: Value = null;
	if (this.outgoing_call) {
		yield* this.outgoing_call.ConnectionFailure(this);
	}
	for (I of each(this.holo_calls)) {
		yield* (HC = I).ConnectionFailure(this);
	}
	I = null;
	for (I of each(this.masters)) {
		yield* this.clear_holo(I);
	}
	GLOB.holopads -= this;
	return (yield* parent_proc());
}, true);

// hologram.dm:73
rt.def("/obj/machinery/holopad/proc/power_change", function* power_change(f: Frame) {
	if (this.powered()) {
		(rt.modSrcVar(f, "stat", 16777213, rt.bitAnd));
	} else {
		(rt.modSrcVar(f, "stat", 2, rt.bitOr));
		if (!this.outgoing_call) return f.dot;
		yield* this.outgoing_call.ConnectionFailure(this);
	}
	return f.dot;
}, true);

// hologram.dm:81
rt.def("/obj/machinery/holopad/proc/obj_break", function* obj_break(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!this.outgoing_call) return f.dot;
	yield* this.outgoing_call.ConnectionFailure(this);
	return f.dot;
}, true);

// hologram.dm:87
rt.def("/obj/machinery/holopad/proc/RefreshParts", function RefreshParts(f: Frame) {
	let B: Value = null;
	let holograph_range: Value = 4;
	for (B of each(this.component_parts, T("/obj/item/weapon/stock_parts/capacitor"))) {
		holograph_range += 1 * B.rating;
	}
	this.holo_range = holograph_range;
	return f.dot;
});

// hologram.dm:92
rt.def("/obj/machinery/holopad/proc/attackby", function* attackby(f: Frame, P: Value, user: Value, params: Value) {
	if (this.default_deconstruction_screwdriver(user, "holopad_open", "holopad0", P)) {
		return f.dot;
	}
	if (yield* this.exchange_parts(user, P)) {
		return f.dot;
	}
	if (yield* this.default_pry_open(P)) {
		return f.dot;
	}
	if (yield* this.default_unfasten_wrench(user, P)) {
		return f.dot;
	}
	if (yield* this.default_deconstruction_crowbar(P)) {
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// hologram.dm:109
rt.def("/obj/machinery/holopad/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	if (!rt.istype(user, T("/mob/living/silicon/ai"))) return f.dot;
	yield* this.hangup_all_calls();
	return f.dot;
}, true);

// hologram.dm:114
rt.def("/obj/machinery/holopad/proc/interact", function* interact(f: Frame, user: Value) {
	let dat: Value = null, one_answered_call: Value = null, one_unanswered_call: Value = null, I: Value = null, HC: Value = null, popup: Value = null;
	if (!rt.istype(user, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	if (this.outgoing_call || user.incapacitated() || !this.is_operational()) {
		return f.dot;
	}
	yield* user.set_machine(this);
	if (this.temp) {
		dat = this.temp;
	} else {
		dat = fmt("<a href='?src=＃;AIrequest=1'>Request an AI's presence.</a><br>", [this]);
		dat += fmt("<a href='?src=＃;Holocall=1'>Call another holopad.</a><br>", [this]);
		if (rt.length(this.holo_calls)) {
			dat += "=====================================================<br>";
		}
		one_answered_call = 0;
		one_unanswered_call = 0;
		for (I of each(this.holo_calls)) {
			if ((HC = I).connected_holopad != this) {
				dat += fmt("<a href='?src=＃;connectcall=＃'>Answer call from ＀.</a><br>", [this, HC, get_area(HC.calling_holopad)]);
				one_unanswered_call = 1;
			} else {
				one_answered_call = 1;
			}
		}
		if (one_answered_call && one_unanswered_call) {
			dat += "=====================================================<br>";
		}
		I = null;
		for (I of each(this.holo_calls)) {
			if ((HC = I).connected_holopad == this) {
				dat += fmt("<a href='?src=＃;disconnectcall=＃'>Disconnect call from ＀.</a><br>", [this, HC, HC.user]);
			}
		}
	}
	(popup = (yield* new_(T("/datum/browser"), user, "holopad", this.name, 300, 130))).set_content(dat);
	popup.set_title_image(user.browse_rsc_icon(this.icon, this.icon_state));
	yield* popup.open();
	return f.dot;
}, true);

// hologram.dm:157
rt.def("/obj/machinery/holopad/proc/hangup_all_calls", function* hangup_all_calls(f: Frame) {
	let I: Value = null, HC: Value = null;
	for (I of each(this.holo_calls)) {
		yield* (HC = I).Disconnect(this);
	}
	return f.dot;
}, true);

// hologram.dm:162
rt.def("/obj/machinery/holopad/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let area: Value = null, AI: Value = null, callnames: Value = null, I: Value = null, A: Value = null, result: Value = null, call_to_connect: Value = null, call_to_disconnect: Value = null;
	if ((yield* parent_proc()) || rt.istype(f.usr, T("/mob/living/silicon/ai"))) {
		return f.dot;
	}
	yield* this.add_fingerprint(f.usr);
	if (!this.is_operational()) {
		return f.dot;
	}
	if (rt.at(href_list, "AIrequest")) {
		if (this.last_request + 200 < rt.worldTime(f)) {
			this.last_request = rt.worldTime(f);
			this.temp = "You requested an AI's presence.<BR>";
			this.temp += fmt("<A href='?src=＃;mainmenu=1'>Main Menu</A>", [this]);
			area = get_area(this);
			for (AI of each(GLOB.silicon_mobs, T("/mob/living/silicon/ai"))) {
				if (!AI.client) {
					continue;
				}
				to_chat(AI, fmt("<span class='info'>Your presence is requested at <a href='?src=＃;jumptoholopad=＃'>％！</a>.</span>", [AI, this, area]));
			}
		} else {
			this.temp = "A request for AI presence was already sent recently.<BR>";
			this.temp += fmt("<A href='?src=＃;mainmenu=1'>Main Menu</A>", [this]);
		}
	} else if (rt.at(href_list, "Holocall")) {
		if (this.outgoing_call) {
			return f.dot;
		}
		this.temp = "You must stand on the holopad to make a call!<br>";
		this.temp += fmt("<A href='?src=＃;mainmenu=1'>Main Menu</A>", [this]);
		if (f.usr.loc == this.loc) {
			callnames = list();
			for (I of each(GLOB.holopads)) {
				if (A = get_area(I)) {
					if (!rt.index(callnames, A)) {
						rt.setAt(callnames, A, list());
					}
					rt.modAt(callnames, A, I, add);
				}
			}
			callnames -= get_area(this);
			result = (yield* g.op(f, "Prompt", [1], [null, "Holocall", "Choose an area to call", f.usr, callnames]));
			if (!f.usr || f.usr.gc_destroyed || !result || this.outgoing_call) {
				return f.dot;
			}
			if (f.usr.loc == this.loc) {
				this.temp = "Dialing...<br>";
				this.temp += fmt("<A href='?src=＃;mainmenu=1'>Main Menu</A>", [this]);
				yield* new_(T("/datum/holocall"), f.usr, this, rt.index(callnames, result));
			}
		}
	} else if (rt.at(href_list, "connectcall")) {
		if (!(!(call_to_connect = rt.locateIn(f, rt.at(href_list, "connectcall"), rt.world())) || call_to_connect.gc_destroyed)) {
			yield* call_to_connect.Answer(this);
		}
		this.temp = "";
	} else if (rt.at(href_list, "disconnectcall")) {
		if (!(!(call_to_disconnect = rt.locateIn(f, rt.at(href_list, "disconnectcall"), rt.world())) || call_to_disconnect.gc_destroyed)) {
			yield* call_to_disconnect.Disconnect(this);
		}
		this.temp = "";
	} else if (rt.at(href_list, "mainmenu")) {
		this.temp = "";
		if (this.outgoing_call) {
			yield* this.outgoing_call.Disconnect();
		}
	}
	yield* this.updateDialog();
	return f.dot;
}, true);

// hologram.dm:225
rt.def("/obj/machinery/holopad/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	if (!rt.istype(user, T("/mob/living/silicon/ai"))) {
		return f.dot;
	}
	if (user.eyeobj.loc != this.loc) {
		yield* user.eyeobj.setLoc(rt.getStep(f, this, 0));
	} else if (!rt.index(this.masters, user)) {
		yield* this.activate_holo(user);
	} else {
		yield* this.clear_holo(user);
	}
	return f.dot;
}, true);

// hologram.dm:238
rt.def("/obj/machinery/holopad/proc/process", function* process(f: Frame) {
	let I: Value = null, master: Value = null, AI: Value = null, pad_close: Value = null, h: Value = null, HC: Value = null;
	for (I of each(this.masters)) {
		master = I;
		if (!rt.istype((AI = master), T("/mob/living/silicon/ai"))) {
			AI = null;
		}
		if (!(!master || master.gc_destroyed) && !master.incapacitated() && master.client && (!AI || AI.eyeobj)) {
			if (this.is_operational()) {
				if (AI) {
					if (get_dist(AI.eyeobj, this) <= this.holo_range) {
						continue;
					}
					if (get_dist((pad_close = get_closest_atom(T("/obj/machinery/holopad"), GLOB.holopads, AI.eyeobj)), AI.eyeobj) <= this.holo_range) {
						h = rt.index(this.masters, master);
						this.unset_holo(master);
						pad_close.set_holo(master, h);
						continue;
					}
				} else {
					continue;
				}
			}
		}
		yield* this.clear_holo(master);
	}
	if (this.outgoing_call) {
		yield* this.outgoing_call.Check();
	}
	I = null;
	for (I of each(this.holo_calls)) {
		if ((HC = I).connected_holopad != this) {
			if (GLOB.force_answer_call && rt.worldTime(f) > HC.call_start_time + 100) {
				yield* HC.Answer(this);
				break;
			}
			if (this.outgoing_call) {
				yield* HC.Disconnect(this);
			} else {
				playsound(this, rt.rsc("sound/machines/twobeep.ogg"), 100);
			}
		}
	}
	return f.dot;
}, true, { waitfor: false });

// hologram.dm:275
rt.def("/obj/machinery/holopad/proc/activate_holo", function* activate_holo(f: Frame, user: Value) {
	let AI: Value = null, Hologram: Value = null;
	if (!rt.istype((AI = user), T("/mob/living/silicon/ai"))) {
		AI = null;
	}
	if (this.is_operational() && (!AI || AI.eyeobj.loc == this.loc)) {
		if (AI && rt.istype(AI.current, T("/obj/machinery/holopad"))) {
			to_chat(user, "<span class='danger'>ERROR:</span>  Image feed in progress.");
			return f.dot;
		}
		Hologram = (yield* new_(T("/obj/effect/overlay/holo_pad_hologram"), this.loc));
		if (AI) {
			Hologram.icon = AI.holo_icon;
		} else {
			Hologram.icon = user.icon;
			Hologram.icon_state = user.icon_state;
			Hologram.copy_overlays(user, 1);
			Hologram.alpha = 100;
			Hologram.add_atom_colour("#77abff", FIXED_COLOUR_PRIORITY);
			Hologram.Impersonation = user;
		}
		yield* Hologram.copy_known_languages_from(user, { replace: 1 });
		Hologram.mouse_opacity = 0;
		Hologram.layer = 5;
		Hologram.anchored = 1;
		Hologram.name = `${user.name} (Hologram)`;
		Hologram.set_light(2);
		this.set_holo(user, Hologram);
		this.visible_message(`<span class='notice'>A holographic image of ${user} flickers to life before your eyes!</span>`);
		return Hologram;
	} else {
		to_chat(user, "<span class='danger'>ERROR:</span> Unable to project hologram.");
	}
	return f.dot;
}, true);

// hologram.dm:313
rt.def("/obj/machinery/holopad/proc/Hear", function* Hear(f: Frame, message: Value, speaker: Value, message_language: Value, raw_message: Value, radio_freq: Value, spans: Value, message_mode: Value) {
	let master: Value = null, I: Value = null, HC: Value = null;
	if (speaker && rt.len(f, this.masters) && !radio_freq) {
		for (master of each(this.masters, T("/mob/living/silicon/ai"))) {
			if (rt.index(this.masters, master) && speaker != master) {
				yield* master.relay_speech(message, speaker, message_language, raw_message, radio_freq, spans, message_mode);
			}
		}
	}
	for (I of each(this.holo_calls)) {
		if ((HC = I).connected_holopad == this && speaker != HC.hologram) {
			yield* HC.user.Hear(message, speaker, message_language, raw_message, radio_freq, spans, message_mode);
		}
	}
	if (!(this.outgoing_call && speaker == this.outgoing_call.user)) return f.dot;
	yield* this.outgoing_call.hologram.say(raw_message);
	return f.dot;
}, true);

// hologram.dm:327
rt.def("/obj/machinery/holopad/proc/SetLightsAndPower", function SetLightsAndPower(f: Frame) {
	let total_users: Value = null;
	this.use_power = (total_users = rt.len(f, this.masters) + rt.length(this.holo_calls)) > 0 ? 2 : 1;
	this.active_power_usage = 1 + 2 * total_users;
	if (total_users) {
		this.set_light(2);
		this.icon_state = "holopad1";
	} else {
		this.set_light(0);
		this.icon_state = "holopad0";
	}
	return f.dot;
});

// hologram.dm:339
rt.def("/obj/machinery/holopad/proc/set_holo", function set_holo(f: Frame, user: Value, h: Value) {
	let AI: Value = null;
	rt.setAt(this.masters, user, h);
	if (rt.istype((AI = user), T("/mob/living/silicon/ai"))) {
		AI.current = this;
	}
	this.SetLightsAndPower();
	return 1;
});

// hologram.dm:346
rt.def("/obj/machinery/holopad/proc/clear_holo", function* clear_holo(f: Frame, user: Value) {
	yield* qdel(rt.index(this.masters, user));
	this.unset_holo(user);
	return 1;
}, true);

// hologram.dm:351
rt.def("/obj/machinery/holopad/proc/unset_holo", function unset_holo(f: Frame, user: Value) {
	let AI: Value = null;
	if (rt.istype((AI = user), T("/mob/living/silicon/ai")) && AI.current == this) {
		AI.current = null;
	}
	this.masters -= user;
	this.SetLightsAndPower();
	return 1;
});

// hologram.dm:359
rt.def("/obj/machinery/holopad/proc/move_hologram", function* move_hologram(f: Frame, user: Value, new_turf: Value) {
	let H: Value = null, holo_area: Value = null, eye_area: Value = null;
	if (rt.index(this.masters, user)) {
		yield* step_to((H = rt.index(this.masters, user)), new_turf);
		H.loc = new_turf;
		holo_area = get_area(this);
		if (!rt.isIn(f, (eye_area = new_turf.loc), holo_area.related)) {
			yield* this.clear_holo(user);
		}
	}
	return 1;
}, true);

rt.type(11775, "/obj/effect/overlay/holo_pad_hologram", "/obj/effect/overlay", {
	Impersonation: null,
	HC: null,
});

// hologram.dm:377
rt.def("/obj/effect/overlay/holo_pad_hologram/proc/Destroy", function* Destroy(f: Frame) {
	this.Impersonation = null;
	if (this.HC) {
		yield* this.HC.Disconnect(this.HC.calling_holopad);
	}
	return (yield* parent_proc());
}, true);

// hologram.dm:385
rt.def("/obj/effect/overlay/holo_pad_hologram/proc/examine", function* examine(f: Frame, user: Value) {
	if (this.Impersonation) {
		return (yield* this.Impersonation.examine(user));
	}
	return (yield* parent_proc());
}, true);

rt.type(6722, "/obj/item/weapon/circuitboard/machine/holopad", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "AI Holopad (Machine Board)",
	build_path: rt.typePath("/obj/machinery/holopad"),
	origin_tech: "programming=1",
});

// hologram.dm:392
rt.def("/obj/item/weapon/circuitboard/machine/holopad/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/capacitor"), 1]);
	return f.dot;
});
