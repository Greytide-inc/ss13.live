// Based on /tg/station's code/game/machinery/computer/gulag_teleporter.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;


rt.type(10381, "/obj/machinery/computer/gulag_teleporter_computer", "/obj/machinery/computer", {
	default_goal: 200,
	id: null,
	teleporter: null,
	beacon: null,
	prisoner: null,
	temporary_record: null,
	icon_screen: "explosive",
	icon_keyboard: "security_key",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/gulag_teleporter_console"),
	light_color: "#FA8282",
	name: "labor camp teleporter console",
	desc: "Used to send criminals to the Labor Camp",
	req_access: null,
});

// gulag_teleporter.dm:7
rt.def("/obj/machinery/computer/gulag_teleporter_computer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(3);
	return f.dot;
});

// gulag_teleporter.dm:19
rt.def("/obj/machinery/computer/gulag_teleporter_computer/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/computer/gulag_teleporter_computer/proc/scan_machinery"))), 5);
	return f.dot;
}, true);

// gulag_teleporter.dm:24
rt.def("/obj/machinery/computer/gulag_teleporter_computer/proc/Destroy", function* Destroy(f: Frame) {
	if (this.id) {
		yield* this.id.forceMove(rt.getStep(f, this, 0));
	}
	return (yield* parent_proc());
}, true);

// gulag_teleporter.dm:28
rt.def("/obj/machinery/computer/gulag_teleporter_computer/proc/attackby", function* attackby(f: Frame, W: Value, user: Value) {
	if (rt.istype(W, T("/obj/item/weapon/card/id/prisoner"))) {
		if (!this.id) {
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			yield* W.forceMove(this);
			this.id = W;
			to_chat(user, `<span class='notice'>You insert ${W}.</span>`);
			return f.dot;
		} else {
			to_chat(user, "<span class='notice'>There's an ID inserted already.</span>");
		}
	}
	return (yield* parent_proc());
}, true);

// gulag_teleporter.dm:42
rt.def("/obj/machinery/computer/gulag_teleporter_computer/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "gulag_console", this.name, 455, 440, master_ui, state))).open();
	return f.dot;
}, true);

// gulag_teleporter.dm:48
rt.def("/obj/machinery/computer/gulag_teleporter_computer/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let r: Value = null, R: Value = null;
	let data: Value = list();
	let prisoner_list: Value = list();
	let can_teleport: Value = 0;
	if (this.teleporter && this.teleporter.occupant && rt.istype(this.teleporter.occupant, T("/mob/living/carbon/human"))) {
		this.prisoner = this.teleporter.occupant;
		rt.setAt(prisoner_list, "name", this.prisoner.real_name);
		if (this.id) {
			can_teleport = 1;
		}
		if (GLOB.data_core.general !== null) {
			for (r of each(GLOB.data_core.security)) {
				if (rt.index((R = r).fields, "name") == rt.at(prisoner_list, "name")) {
					this.temporary_record = R;
					rt.setAt(prisoner_list, "crimstat", rt.index(this.temporary_record.fields, "criminal"));
				}
			}
		}
	}
	rt.setAt(data, "prisoner", prisoner_list);
	if (this.teleporter) {
		rt.setAt(data, "teleporter", this.teleporter);
		rt.setAt(data, "teleporter_location", `(${this.teleporter.x}, ${this.teleporter.y}, ${this.teleporter.z})`);
		rt.setAt(data, "teleporter_lock", this.teleporter.locked);
		rt.setAt(data, "teleporter_state_open", this.teleporter.state_open);
	}
	if (this.beacon) {
		rt.setAt(data, "beacon", this.beacon);
		rt.setAt(data, "beacon_location", `(${this.beacon.x}, ${this.beacon.y}, ${this.beacon.z})`);
	}
	if (this.id) {
		rt.setAt(data, "id", this.id);
		rt.setAt(data, "id_name", this.id.registered_name);
		rt.setAt(data, "goal", this.id.goal);
	}
	rt.setAt(data, "can_teleport", can_teleport);
	return data;
});

// gulag_teleporter.dm:84
rt.def("/obj/machinery/computer/gulag_teleporter_computer/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let I: Value = null, new_goal: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (!(yield* this.allowed(f.usr))) {
		to_chat(f.usr, "<span class='warning'>Access denied.</span>");
		return f.dot;
	}
	if (action === "scan_teleporter") {
		this.teleporter = this.findteleporter();
	} else if (action === "scan_beacon") {
		this.beacon = this.findbeacon();
	} else if (action === "handle_id") {
		if (this.id) {
			if (!f.usr.get_active_held_item()) {
				yield* f.usr.put_in_hands(this.id);
				this.id = null;
			} else {
				yield* this.id.forceMove(rt.getStep(f, this, 0));
				this.id = null;
			}
		} else if (rt.istype((I = f.usr.get_active_held_item()), T("/obj/item/weapon/card/id/prisoner"))) {
			if (!(yield* f.usr.drop_item())) {
				return f.dot;
			}
			yield* I.forceMove(this);
			this.id = I;
		}
	} else if (action === "set_goal") {
		if (!isnum((new_goal = (yield* g.op(f, "Prompt", [33], [null, this.id.goal, "Points", "Set the amount of points:", null]))))) {
			return f.dot;
		}
		if (!new_goal) {
			new_goal = this.default_goal;
		}
		this.id.goal = max(0, min(new_goal, 1000));
	} else if (action === "toggle_open") {
		if (this.teleporter.locked) {
			to_chat(f.usr, "The teleporter is locked");
			return f.dot;
		}
		yield* this.teleporter.toggle_open();
	} else if (action === "teleporter_lock") {
		if (this.teleporter.state_open) {
			to_chat(f.usr, "Close the teleporter before locking!");
			return f.dot;
		}
		this.teleporter.locked = (!this.teleporter.locked ? 1 : 0);
	} else if (action === "teleport") {
		if (!this.teleporter || !this.beacon) {
			return f.dot;
		}
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/computer/gulag_teleporter_computer/proc/teleport"), f.usr)), 5);
	}
	return f.dot;
}, true);

// gulag_teleporter.dm:132
rt.def("/obj/machinery/computer/gulag_teleporter_computer/proc/scan_machinery", function scan_machinery(f: Frame) {
	this.teleporter = this.findteleporter();
	this.beacon = this.findbeacon();
	return f.dot;
});

// gulag_teleporter.dm:138
rt.def("/obj/machinery/computer/gulag_teleporter_computer/proc/findteleporter", function findteleporter(f: Frame) {
	let teleporterf: Value = null;
	let $e: any;
	rt.forList(f, 0, GLOB.cardinal);
	while (($e = rt.next(f, 0)) !== undefined) {
		this.dir = $e;
		if ((teleporterf = rt.locateIn(f, T("/obj/machinery/gulag_teleporter"), rt.getStep(f, this, this.dir))) && teleporterf.is_operational()) {
			return teleporterf;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// gulag_teleporter.dm:144
rt.def("/obj/machinery/computer/gulag_teleporter_computer/proc/findbeacon", function findbeacon(f: Frame) {
	return rt.locateIn(f, T("/obj/structure/gulag_beacon"), rt.world());
});

// gulag_teleporter.dm:147
rt.def("/obj/machinery/computer/gulag_teleporter_computer/proc/teleport", function* teleport(f: Frame, user: Value) {
	log_game(`${user}(${user.ckey} teleported ${this.prisoner}(${this.prisoner.ckey}) to the Labor Camp (${this.beacon.x}, ${this.beacon.y}, ${this.beacon.z}) for ${this.id.goal} points.`);
	yield* this.teleporter.handle_prisoner(this.id, this.temporary_record);
	playsound(this.loc, rt.rsc("sound/weapons/emitter.ogg"), 50, 1);
	yield* this.prisoner.forceMove(rt.getStep(f, this.beacon, 0));
	yield* this.prisoner.Knockdown(40);
	to_chat(this.prisoner, "<span class='warning'>The teleportation makes you a little dizzy.</span>");
	yield* new_(T("/obj/effect/particle_effect/sparks"), this.prisoner.loc);
	playsound(this.loc, "sparks", 50, 1);
	if (this.teleporter.locked) {
		this.teleporter.locked = 0;
	}
	yield* this.teleporter.toggle_open();
	this.id = null;
	this.temporary_record = null;
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob" }] });
