// Based on /tg/station's code/game/gamemodes/nuclear/nuclearbomb.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(10685, "/obj/machinery/nuclearbomb", "/obj/machinery", {
	timer_set: 90,
	default_timer_set: 90,
	minimum_timer_set: 90,
	maximum_timer_set: 3600,
	ui_style: "nanotrasen",
	numeric_input: "",
	timing: 0,
	exploding: 0,
	detonation_timer: null,
	r_code: "ADMIN",
	yes_code: 0,
	safety: 1,
	auth: null,
	previous_level: "",
	core: null,
	deconstruction_state: 5,
	lights: "",
	interior: "",
	countdown: null,
	name: "nuclear fission explosive",
	desc: "You probably shouldn't stick around to see if this is armed.",
	icon: rt.rsc("icons/obj/machines/nuke.dmi"),
	icon_state: "nuclearbomb_base",
	density: 1,
	resistance_flags: 115,
	use_power: 0,
}, { global: { bomb_set: 751 } });

// nuclearbomb.dm:46
rt.def("/obj/machinery/nuclearbomb/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.countdown = (yield* new_(T("/obj/effect/countdown/nuclearbomb"), this));
	GLOB.nuke_list += this;
	this.core = (yield* new_(T("/obj/item/nuke_core"), this));
	this.core.isprocessing = 0;
	GLOB.SSobj.processing -= this.core;
	yield* this.update_icon();
	(rt.modGl("poi_list", this, rt.bitOr));
	this.previous_level = get_security_level();
	return f.dot;
}, true);

// nuclearbomb.dm:57
rt.def("/obj/machinery/nuclearbomb/proc/Destroy", function* Destroy(f: Frame) {
	this.safety = 0;
	if (!this.exploding) {
		this.set_safety();
	}
	GLOB.poi_list -= this;
	GLOB.nuke_list -= this;
	if (this.countdown) {
		yield* qdel(this.countdown);
	}
	this.countdown = null;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// nuclearbomb.dm:68
rt.def("/obj/machinery/nuclearbomb/proc/examine", function examine(f: Frame, user: Value) {
	f.dot = parent_proc();
	if (this.exploding) {
		to_chat(user, "It is in the process of exploding. Perhaps reviewing your affairs is in order.");
	}
	if (!this.timing) return f.dot;
	to_chat(user, `There are ${this.get_time_left()} seconds until detonation.`);
	return f.dot;
}, false);

rt.type(10687, "/obj/machinery/nuclearbomb/syndicate", "/obj/machinery/nuclearbomb", {});

// nuclearbomb.dm:85
rt.def("/obj/machinery/nuclearbomb/syndicate/proc/Initialize", function* Initialize(f: Frame) {
	let existing: Value = null;
	f.dot = (yield* parent_proc());
	if (existing = rt.locateIn(f, "syndienuke", rt.world())) {
		yield* qdel(this);
		rt.throw_(f, (yield* new_(T("/exception"), `Attempted to spawn a syndicate nuke while one already exists at ${existing.loc.x},${existing.loc.y},${existing.loc.z}`, "code/game/gamemodes/nuclear/nuclearbomb.dm", 89)));
		return 0;
	}
	this.tag = "syndienuke";
	return f.dot;
}, true);

// nuclearbomb.dm:94
rt.def("/obj/machinery/nuclearbomb/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let welder: Value = null, core_box: Value = null, M: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/disk/nuclear"))) {
		if (!(yield* user.drop_item())) {
			return f.dot;
		}
		yield* I.forceMove(this);
		this.auth = I;
		yield* this.add_fingerprint(user);
		return f.dot;
	}
	if (this.deconstruction_state === NUKESTATE_INTACT) {
		if (rt.istype(I, T("/obj/item/weapon/screwdriver/nuke"))) {
			playsound(this.loc, I.usesound, 100, 1);
			to_chat(user, `<span class='notice'>You start removing ${this}'s front panel's screws...</span>`);
			if (yield* do_after(user, 60 * I.toolspeed, { target: this })) {
				this.deconstruction_state = NUKESTATE_UNSCREWED;
				to_chat(user, `<span class='notice'>You remove the screws from ${this}'s front panel.</span>`);
				yield* this.update_icon();
			}
			return f.dot;
		}
	} else if (this.deconstruction_state === NUKESTATE_UNSCREWED) {
		if (rt.istype(I, T("/obj/item/weapon/crowbar"))) {
			to_chat(user, `<span class='notice'>You start removing ${this}'s front panel...</span>`);
			playsound(this.loc, I.usesound, 100, 1);
			if (yield* do_after(user, 30 * I.toolspeed, { target: this })) {
				to_chat(user, `<span class='notice'>You remove ${this}'s front panel.</span>`);
				this.deconstruction_state = NUKESTATE_PANEL_REMOVED;
				yield* this.update_icon();
			}
			return f.dot;
		}
	} else if (this.deconstruction_state === NUKESTATE_PANEL_REMOVED) {
		if (rt.istype(I, T("/obj/item/weapon/weldingtool"))) {
			welder = I;
			playsound(this.loc, I.usesound, 100, 1);
			to_chat(user, `<span class='notice'>You start cutting ${this}'s inner plate...</span>`);
			if (yield* welder.remove_fuel(1, user)) {
				if (yield* do_after(user, 80 * I.toolspeed, { target: this })) {
					to_chat(user, `<span class='notice'>You cut ${this}'s inner plate.</span>`);
					this.deconstruction_state = NUKESTATE_WELDED;
					yield* this.update_icon();
				}
			}
			return f.dot;
		}
	} else if (this.deconstruction_state === NUKESTATE_WELDED) {
		if (rt.istype(I, T("/obj/item/weapon/crowbar"))) {
			to_chat(user, `<span class='notice'>You start prying off ${this}'s inner plate...</span>`);
			playsound(this.loc, I.usesound, 100, 1);
			if (yield* do_after(user, 50 * I.toolspeed, { target: this })) {
				to_chat(user, `<span class='notice'>You pry off ${this}'s inner plate. You can see the core's green glow!</span>`);
				this.deconstruction_state = NUKESTATE_CORE_EXPOSED;
				yield* this.update_icon();
				if (!this.core.isprocessing) {
					this.core.isprocessing = 1;
					GLOB.SSobj.processing += this.core;
				}
			}
			return f.dot;
		}
	} else if (this.deconstruction_state === NUKESTATE_CORE_EXPOSED) {
		if (rt.istype(I, T("/obj/item/nuke_core_container"))) {
			core_box = I;
			to_chat(user, `<span class='notice'>You start loading the plutonium core into ${core_box}...</span>`);
			if (yield* do_after(user, 50, { target: this })) {
				if (yield* core_box.load(this.core, user)) {
					to_chat(user, `<span class='notice'>You load the plutonium core into ${core_box}.</span>`);
					this.deconstruction_state = NUKESTATE_CORE_REMOVED;
					yield* this.update_icon();
					this.core = null;
				} else {
					to_chat(user, `<span class='warning'>You fail to load the plutonium core into ${core_box}. ${core_box} has already been used!</span>`);
				}
			}
			return f.dot;
		}
		if (rt.istype(I, T("/obj/item/stack/sheet/metal"))) {
			if ((M = I).amount >= 20) {
				to_chat(user, `<span class='notice'>You begin repairing ${this}'s inner metal plate...</span>`);
				if (yield* do_after(user, 100, { target: this })) {
					if (yield* M.use(20)) {
						to_chat(user, `<span class='notice'>You repair ${this}'s inner metal plate. The radiation is contained.</span>`);
						this.deconstruction_state = NUKESTATE_PANEL_REMOVED;
						this.core.isprocessing = 0;
						GLOB.SSobj.processing -= this.core;
						yield* this.update_icon();
					} else {
						to_chat(user, "<span class='warning'>You need more metal to do that!</span>");
					}
				}
			} else {
				to_chat(user, "<span class='warning'>You need more metal to do that!</span>");
			}
			return f.dot;
		}
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// nuclearbomb.dm:178
rt.def("/obj/machinery/nuclearbomb/proc/get_nuke_state", function get_nuke_state(f: Frame) {
	if (this.exploding) {
		return 3;
	}
	if (this.timing) {
		return 2;
	}
	if (this.safety) {
		return NUKE_OFF_LOCKED;
	} else {
		return 1;
	}
});

// nuclearbomb.dm:183
rt.def("/obj/machinery/nuclearbomb/proc/update_icon", function update_icon(f: Frame) {
	if (this.deconstruction_state == NUKESTATE_INTACT) {
		const nuke_state = this.get_nuke_state();
		if (nuke_state === NUKE_OFF_LOCKED || nuke_state === NUKE_OFF_UNLOCKED) {
			this.icon_state = "nuclearbomb_base";
			this.update_icon_interior();
			this.update_icon_lights();
		} else if (nuke_state === NUKE_ON_TIMING) {
			this.cut_overlays();
			this.icon_state = "nuclearbomb_timing";
		} else if (nuke_state === NUKE_ON_EXPLODING) {
			this.cut_overlays();
			this.icon_state = "nuclearbomb_exploding";
		}
	} else {
		this.icon_state = "nuclearbomb_base";
		this.update_icon_interior();
		this.update_icon_lights();
	}
	return f.dot;
});

// nuclearbomb.dm:201
rt.def("/obj/machinery/nuclearbomb/proc/update_icon_interior", function update_icon_interior(f: Frame) {
	this.cut_overlay(this.interior);
	if (this.deconstruction_state === NUKESTATE_UNSCREWED) {
		this.interior = "panel-unscrewed";
	} else if (this.deconstruction_state === NUKESTATE_PANEL_REMOVED) {
		this.interior = "panel-removed";
	} else if (this.deconstruction_state === NUKESTATE_WELDED) {
		this.interior = "plate-welded";
	} else if (this.deconstruction_state === NUKESTATE_CORE_EXPOSED) {
		this.interior = "plate-removed";
	} else if (this.deconstruction_state === NUKESTATE_CORE_REMOVED) {
		this.interior = "core-removed";
	} else if (this.deconstruction_state === NUKESTATE_INTACT) {
		return f.dot;
	}
	this.add_overlay(this.interior);
	return f.dot;
});

// nuclearbomb.dm:219
rt.def("/obj/machinery/nuclearbomb/proc/update_icon_lights", function update_icon_lights(f: Frame) {
	if (this.lights) {
		this.cut_overlay(this.lights);
	}
	const nuke_state = this.get_nuke_state();
	if (nuke_state === 0) {
		this.lights = "";
		return f.dot;
	} else if (nuke_state === 1) {
		this.lights = "lights-safety";
	} else if (nuke_state === 2) {
		this.lights = "lights-timing";
	} else if (nuke_state === 3) {
		this.lights = "lights-exploding";
	}
	this.add_overlay(this.lights);
	return f.dot;
});

// nuclearbomb.dm:233
rt.def("/obj/machinery/nuclearbomb/proc/process", function* process(f: Frame) {
	let volume: Value = null;
	if (!(this.timing && !this.exploding)) return f.dot;
	GLOB.bomb_set = 1;
	if (this.detonation_timer < rt.worldTime(f)) {
		yield* this.explode();
	} else {
		volume = this.get_time_left() <= 20 ? 30 : 5;
		playsound(this.loc, rt.rsc("sound/items/timer.ogg"), volume, 0);
	}
	return f.dot;
}, true, { waitfor: false });

// nuclearbomb.dm:242
rt.def("/obj/machinery/nuclearbomb/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// nuclearbomb.dm:245
rt.def("/obj/machinery/nuclearbomb/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	(ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "nuclear_bomb", this.name, 500, 600, master_ui, state))).set_style(this.ui_style);
	yield* ui.open();
	return f.dot;
}, true);

// nuclearbomb.dm:252
rt.def("/obj/machinery/nuclearbomb/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, first_status: Value = null;
	rt.setAt((data = list()), "disk_present", this.auth);
	rt.setAt(data, "code_approved", this.yes_code);
	if (this.auth) {
		if (this.yes_code) {
			first_status = this.timing ? "Func/Set" : "Functional";
		} else {
			first_status = "Auth S2.";
		}
	} else if (this.timing) {
		first_status = "Set";
	} else {
		first_status = "Auth S1.";
	}
	let second_status: Value = this.safety ? "Safe" : "Engaged";
	rt.setAt(data, "status1", first_status);
	rt.setAt(data, "status2", second_status);
	rt.setAt(data, "anchored", this.anchored);
	rt.setAt(data, "safety", this.safety);
	rt.setAt(data, "timing", this.timing);
	rt.setAt(data, "time_left", this.get_time_left());
	rt.setAt(data, "timer_set", this.timer_set);
	rt.setAt(data, "timer_is_not_default", (this.timer_set != this.default_timer_set ? 1 : 0));
	rt.setAt(data, "timer_is_not_min", (this.timer_set != this.minimum_timer_set ? 1 : 0));
	rt.setAt(data, "timer_is_not_max", (this.timer_set != this.maximum_timer_set ? 1 : 0));
	let message: Value = "AUTH";
	if (this.auth) {
		message = `${this.numeric_input}`;
		if (this.yes_code) {
			message = "*****";
		}
	}
	rt.setAt(data, "message", message);
	return data;
});

// nuclearbomb.dm:289
rt.def("/obj/machinery/nuclearbomb/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let I: Value = null, digit: Value = null, change: Value = null, user_input: Value = null, N: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "eject_disk") {
		if (this.auth && this.auth.loc == this) {
			yield* this.auth.forceMove(rt.getStep(f, this, 0));
			this.auth = null;
			f.dot = 1;
		}
	} else if (action === "insert_disk") {
		if (!this.auth) {
			if (rt.istype((I = f.usr.get_active_held_item()), T("/obj/item/weapon/disk/nuclear"))) {
				yield* f.usr.drop_item();
				yield* I.forceMove(this);
				this.auth = I;
				f.dot = 1;
			}
		}
	} else if (action === "keypad") {
		if (this.auth) {
			const subject = (digit = rt.at(params, "digit"));
			if (subject === "R") {
				this.numeric_input = "";
				this.yes_code = 0;
				f.dot = 1;
			} else if (subject === "E") {
				if (this.numeric_input == this.r_code) {
					this.numeric_input = "";
					this.yes_code = 1;
					f.dot = 1;
				} else {
					this.numeric_input = "ERROR";
				}
			} else if (subject === "0" || subject === "1" || subject === "2" || subject === "3" || subject === "4" || subject === "5" || subject === "6" || subject === "7" || subject === "8" || subject === "9") {
				if (this.numeric_input != "ERROR") {
					if (rt.length((this.numeric_input += digit)) > 5) {
						this.numeric_input = "ERROR";
					}
					f.dot = 1;
				}
			}
		}
	} else if (action === "timer") {
		if (this.auth && this.yes_code) {
			if ((change = rt.at(params, "change")) == "reset") {
				this.timer_set = this.default_timer_set;
			} else if (change == "decrease") {
				this.timer_set = max(this.minimum_timer_set, this.timer_set - 10);
			} else if (change == "increase") {
				this.timer_set = min(this.maximum_timer_set, this.timer_set + 10);
			} else if (change == "input") {
				if (!(user_input = (yield* g.op(f, "Prompt", [33], [null, this.name, "Set time to detonation.", f.usr, null])))) {
					return f.dot;
				}
				if (!(N = text2num(user_input))) {
					return f.dot;
				}
				this.timer_set = max(this.minimum_timer_set, min(N, this.maximum_timer_set));
			}
			f.dot = 1;
		}
	} else if (action === "safety") {
		if (this.auth && this.yes_code) {
			this.set_safety();
		}
	} else if (action === "anchor") {
		if (this.auth && this.yes_code) {
			this.set_anchor();
		}
	} else if (action === "toggle_timer") {
		if (!(this.auth && this.yes_code && !this.safety)) return f.dot;
		this.set_active();
	}
	return f.dot;
}, true);

// nuclearbomb.dm:356
rt.def("/obj/machinery/nuclearbomb/proc/set_anchor", function set_anchor(f: Frame) {
	if (!this.isinspace()) {
		this.anchored = (!this.anchored ? 1 : 0);
	} else {
		to_chat(f.usr, "<span class='warning'>There is nothing to anchor to!</span>");
	}
	return f.dot;
});

// nuclearbomb.dm:362
rt.def("/obj/machinery/nuclearbomb/proc/set_safety", function set_safety(f: Frame) {
	let S: Value = null;
	this.safety = (!this.safety ? 1 : 0);
	if (this.safety) {
		if (this.timing) {
			set_security_level(this.previous_level);
			for (S of each(GLOB.pinpointer_list, T("/obj/item/weapon/pinpointer/syndicate"))) {
				S.switch_mode_to(rt.initial(f, S, "mode"));
				S.nuke_warning = 0;
			}
		}
		this.timing = 0;
		GLOB.bomb_set = 1;
		this.detonation_timer = null;
		this.countdown.stop();
	}
	this.update_icon();
	return f.dot;
});

// nuclearbomb.dm:376
rt.def("/obj/machinery/nuclearbomb/proc/set_active", function set_active(f: Frame) {
	let S: Value = null;
	if (this.safety && !GLOB.bomb_set) {
		to_chat(f.usr, "<span class='danger'>The safety is still on.</span>");
		return f.dot;
	}
	this.timing = (!this.timing ? 1 : 0);
	if (this.timing) {
		this.previous_level = get_security_level();
		GLOB.bomb_set = 1;
		set_security_level("delta");
		this.detonation_timer = rt.worldTime(f) + this.timer_set * 10;
		for (S of each(GLOB.pinpointer_list, T("/obj/item/weapon/pinpointer/syndicate"))) {
			S.switch_mode_to(TRACK_INFILTRATOR);
		}
		this.countdown.start();
	} else {
		GLOB.bomb_set = 0;
		this.detonation_timer = null;
		set_security_level(this.previous_level);
		S = null;
		for (S of each(GLOB.pinpointer_list, T("/obj/item/weapon/pinpointer/syndicate"))) {
			S.switch_mode_to(rt.initial(f, S, "mode"));
			S.nuke_warning = 0;
		}
		this.countdown.stop();
	}
	this.update_icon();
	return f.dot;
});

// nuclearbomb.dm:400
rt.def("/obj/machinery/nuclearbomb/proc/get_time_left", function get_time_left(f: Frame) {
	if (this.timing) {
		f.dot = round(max(0, this.detonation_timer - rt.worldTime(f)) / 10, 1);
	} else {
		f.dot = this.timer_set;
	}
	return f.dot;
});

// nuclearbomb.dm:407
rt.def("/obj/machinery/nuclearbomb/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	if (this.exploding) {
		return f.dot;
	}
	yield* qdel(this);
	return f.dot;
}, true);

// nuclearbomb.dm:410
rt.def("/obj/machinery/nuclearbomb/proc/tesla_act", function* tesla_act(f: Frame, power: Value, explosive: Value) {
	yield* parent_proc();
	if (!explosive) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);

// nuclearbomb.dm:423
rt.def("/obj/machinery/nuclearbomb/proc/explode", function* explode(f: Frame) {
	let M: Value = null, Shuttle: Value = null, NM: Value = null, NM_3: Value = null;
	let $e: any;
	if (this.safety) {
		this.timing = 0;
		return f.dot;
	}
	this.exploding = 1;
	this.yes_code = 0;
	this.safety = 1;
	yield* this.update_icon();
	for (M of each(GLOB.player_list, T("/mob"))) {
		rt.op(f, "Output", [], [M, rt.rsc("sound/machines/alarm.ogg")], false);
	}
	if (GLOB.SSticker && GLOB.SSticker.mode) {
		GLOB.SSticker.mode.explosion_in_progress = 1;
	}
	yield* sleep(100);
	if (!this.core) {
		yield* GLOB.SSticker.station_explosion_cinematic(3, "no_core", this);
		GLOB.SSticker.mode.explosion_in_progress = 0;
		return f.dot;
	}
	GLOB.enter_allowed = 0;
	let off_station: Value = 0;
	let bomb_location: Value = rt.getStep(f, this, 0);
	let A: Value = get_area(bomb_location);
	if (bomb_location && bomb_location.z == ZLEVEL_STATION) {
		if (rt.istype(A, T("/area/space"))) {
			off_station = NUKE_MISS_STATION;
		}
		if (bomb_location.x < 1 || bomb_location.x > 255 || bomb_location.y < ZLEVEL_CENTCOM || bomb_location.y > 255) {
			off_station = NUKE_MISS_STATION;
		}
	} else if (rt.istype(A, T("/area/syndicate_mothership")) || rt.istype(A, T("/area/shuttle/syndicate")) && bomb_location.z == ZLEVEL_CENTCOM) {
		off_station = NUKE_SYNDICATE_BASE;
	} else {
		off_station = NUKE_NEAR_MISS;
	}
	if (rt.istype(GLOB.SSticker.mode, T("/datum/game_mode/nuclear"))) {
		Shuttle = GLOB.SSshuttle.getShuttle("syndicate");
		(NM = GLOB.SSticker.mode).syndies_didnt_escape = Shuttle && (Shuttle.z == ZLEVEL_CENTCOM || Shuttle.z == ZLEVEL_TRANSIT) ? 0 : 1;
		NM.nuke_off_station = off_station;
	}
	yield* GLOB.SSticker.station_explosion_cinematic(off_station, null, this);
	if (!GLOB.SSticker.mode) return f.dot;
	if (rt.istype(GLOB.SSticker.mode, T("/datum/game_mode/nuclear"))) {
		(NM_3 = GLOB.SSticker.mode).nukes_left--;
	}
	if (yield* GLOB.SSticker.mode.check_finished()) return f.dot;
	yield* GLOB.SSticker.Reboot("Station destroyed by Nuclear Device.", "nuke - unhandled ending");
	return f.dot;
}, true);

rt.type(10686, "/obj/machinery/nuclearbomb/selfdestruct", "/obj/machinery/nuclearbomb", {
	anchored: 1,
	name: "station self-destruct terminal",
	desc: "For when it all gets too much to bear. Do not taunt.",
	icon: rt.rsc("icons/obj/machines/nuke_terminal.dmi"),
	icon_state: "nuclearbomb_base",
});

// nuclearbomb.dm:473
rt.def("/obj/machinery/nuclearbomb/selfdestruct/proc/set_active", function set_active(f: Frame) {
	parent_proc();
	if (this.timing) {
		GLOB.SSmapping.add_nuke_threat(this);
	} else {
		GLOB.SSmapping.remove_nuke_threat(this);
	}
	return f.dot;
});

// nuclearbomb.dm:480
rt.def("/obj/machinery/nuclearbomb/selfdestruct/proc/set_safety", function set_safety(f: Frame) {
	parent_proc();
	if (this.timing) {
		GLOB.SSmapping.add_nuke_threat(this);
	} else {
		GLOB.SSmapping.remove_nuke_threat(this);
	}
	return f.dot;
});

rt.type(6672, "/obj/item/weapon/disk/nuclear", "/obj/item/weapon/disk", {
	name: "nuclear authentication disk",
	desc: "Better keep this safe.",
	icon_state: "nucleardisk",
	persistence_replacement: rt.typePath("/obj/item/weapon/disk/fakenucleardisk"),
	obj_integrity: 250,
	max_integrity: 250,
	armor: null,
	resistance_flags: 99,
});

// nuclearbomb.dm:500
rt.def("/obj/item/weapon/disk/nuclear/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 30, "bio", 0, "rad", 0, "fire", 100, "acid", 100]);
	return f.dot;
});

// nuclearbomb.dm:504
rt.def("/obj/item/weapon/disk/nuclear/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	(rt.modGl("poi_list", this, rt.bitOr));
	yield* this.set_stationloving(1, { inform_admins: 1 });
	return f.dot;
}, true);

// nuclearbomb.dm:509
rt.def("/obj/item/weapon/disk/nuclear/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let H: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/claymore/highlander"))) {
		if ((H = I).nuke_disk) {
			to_chat(user, "<span class='notice'>Wait... what?</span>");
			yield* qdel(H.nuke_disk);
			H.nuke_disk = null;
			return f.dot;
		}
		user.visible_message(`<span class='warning'>${user} captures ${this}!</span>`, "<span class='userdanger'>You've got the disk! Defend it with your life!</span>");
		this.loc = H;
		H.nuke_disk = this;
		return 1;
	}
	return (yield* parent_proc());
}, true);

// nuclearbomb.dm:525
rt.def("/obj/item/weapon/disk/nuclear/proc/Destroy", function* Destroy(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	if (f.args[0]) {
		GLOB.poi_list -= this;
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["force"] });

// nuclearbomb.dm:529
rt.def("/obj/item/weapon/disk/nuclear/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is going delta! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	playsound(user.loc, rt.rsc("sound/machines/alarm.ogg"), 50, -1, 1);
	let end_time: Value = rt.worldTime(f) + 100;
	let newcolor: Value = "#00FF00";
	while (rt.worldTime(f) < end_time) {
		if (!user) {
			return f.dot;
		}
		if (newcolor == "#FF0000") {
			newcolor = "#00FF00";
		} else {
			newcolor = "#FF0000";
		}
		user.add_atom_colour(newcolor, ADMIN_COLOUR_PRIORITY);
		yield* sleep(1);
	}
	user.remove_atom_colour(ADMIN_COLOUR_PRIORITY);
	user.visible_message(`<span class='suicide'>${user} was destroyed by the nuclear blast!</span>`);
	return 8;
}, true);
