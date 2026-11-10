// Based on /tg/station's code/modules/mining/laborcamp/laborstacker.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(10939, "/obj/machinery/mineral/labor_claim_console", "/obj/machinery/mineral", {
	stacking_machine: null,
	machinedir: 2,
	inserted_id: null,
	release_door: null,
	door_tag: "prisonshuttle",
	Radio: null,
	anchored: 1,
	name: "point claim console",
	desc: "A stacking console with an electromagnetic writer, used to track ore mined by prisoners.",
	icon: rt.rsc("icons/obj/machines/mining_machines.dmi"),
	icon_state: "console",
	density: 0,
});

// laborstacker.dm:19
rt.def("/obj/machinery/mineral/labor_claim_console/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.Radio = (yield* new_(T("/obj/item/device/radio"), this));
	this.Radio.listening = 0;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/mineral/labor_claim_console/proc/locate_stacking_machine"))), 7);
	return f.dot;
}, true);

// laborstacker.dm:25
rt.def("/obj/machinery/mineral/labor_claim_console/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/weapon/card/id/prisoner"))) {
		if (!this.inserted_id) {
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			yield* I.forceMove(this);
			this.inserted_id = I;
			to_chat(user, `<span class='notice'>You insert ${I}.</span>`);
			return f.dot;
		} else {
			to_chat(user, "<span class='notice'>There's an ID inserted already.</span>");
		}
	}
	return (yield* parent_proc());
}, true);

// laborstacker.dm:39
rt.def("/obj/machinery/mineral/labor_claim_console/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "labor_claim_console", this.name, 450, 475, master_ui, state))).open();
	return f.dot;
}, true);

// laborstacker.dm:45
rt.def("/obj/machinery/mineral/labor_claim_console/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let ore: Value = null, O: Value = null;
	let data: Value = list();
	let can_go_home: Value = 0;
	rt.setAt(data, "emagged", this.emagged);
	if (this.inserted_id) {
		rt.setAt(data, "id", this.inserted_id);
		rt.setAt(data, "id_name", this.inserted_id.registered_name);
		rt.setAt(data, "points", this.inserted_id.points);
		rt.setAt(data, "goal", this.inserted_id.goal);
	}
	if (this.check_auth()) {
		can_go_home = 1;
	}
	let ores: Value = list();
	if (this.stacking_machine) {
		rt.setAt(data, "unclaimed_points", this.stacking_machine.points);
		for (ore of each(this.stacking_machine.ore_values)) {
			rt.setAt((O = list()), "ore", ore);
			rt.setAt(O, "value", rt.index(this.stacking_machine.ore_values, ore));
			ores += list(O);
		}
	}
	rt.setAt(data, "ores", ores);
	rt.setAt(data, "can_go_home", can_go_home);
	return data;
});

// laborstacker.dm:72
rt.def("/obj/machinery/mineral/labor_claim_console/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let I: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "handle_id") {
		if (this.inserted_id) {
			if (!f.usr.get_active_held_item()) {
				yield* f.usr.put_in_hands(this.inserted_id);
				this.inserted_id = null;
			} else {
				yield* this.inserted_id.forceMove(rt.getStep(f, this, 0));
				this.inserted_id = null;
			}
		} else if (rt.istype((I = f.usr.get_active_held_item()), T("/obj/item/weapon/card/id/prisoner"))) {
			if (!(yield* f.usr.drop_item())) {
				return f.dot;
			}
			yield* I.forceMove(this);
			this.inserted_id = I;
		}
	} else if (action === "claim_points") {
		this.inserted_id.points += this.stacking_machine.points;
		this.stacking_machine.points = 0;
		to_chat(f.usr, "Points transferred.");
	} else if (action === "move_shuttle") {
		if (!alone_in_area(get_area(this), f.usr)) {
			to_chat(f.usr, "<span class='warning'>Prisoners are only allowed to be released while alone.</span>");
		} else {
			const subject = (yield* GLOB.SSshuttle.moveShuttle("laborcamp", "laborcamp_home"));
			if (subject === 1) {
				to_chat(f.usr, "<span class='notice'>Shuttle not found</span>");
			} else if (subject === 2) {
				to_chat(f.usr, "<span class='notice'>Shuttle already at station</span>");
			} else if (subject === 3) {
				to_chat(f.usr, "<span class='notice'>No permission to dock could be granted.</span>");
			} else {
				if (!this.emagged) {
					yield* this.Radio.set_frequency(1359);
					yield* this.Radio.talk_into(this, `${this.inserted_id.registered_name} has returned to the station. Minerals and Prisoner ID card ready for retrieval.`, 1359, this.get_spans(), (yield* this.get_default_language()));
				}
				to_chat(f.usr, "<span class='notice'>Shuttle received message and will be sent shortly.</span>");
			}
		}
	}
	return f.dot;
}, true);

// laborstacker.dm:114
rt.def("/obj/machinery/mineral/labor_claim_console/proc/check_auth", function check_auth(f: Frame) {
	if (this.emagged) {
		return 1;
	}
	return ((rt.istype(this.inserted_id, T("/obj/item/weapon/card/id/prisoner")) ? 1 : 0) && (this.inserted_id.points >= this.inserted_id.goal ? 1 : 0));
});

// laborstacker.dm:117
rt.def("/obj/machinery/mineral/labor_claim_console/proc/locate_stacking_machine", function* locate_stacking_machine(f: Frame) {
	this.stacking_machine = rt.locateIn(f, T("/obj/machinery/mineral/stacking_machine"), rt.getStep(f, this, this.machinedir));
	if (this.stacking_machine) {
		this.stacking_machine.CONSOLE = this;
	} else {
		yield* qdel(this);
	}
	return f.dot;
}, true);

// laborstacker.dm:124
rt.def("/obj/machinery/mineral/labor_claim_console/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (this.emagged) return f.dot;
	this.emagged = 1;
	to_chat(user, "<span class='warning'>PZZTTPFFFT</span>");
	return f.dot;
});

rt.type(10934, "/obj/machinery/mineral/stacking_machine/laborstacker", "/obj/machinery/mineral/stacking_machine", {
	points: 0,
	ore_values: null,
});

// laborstacker.dm:134
rt.def("/obj/machinery/mineral/stacking_machine/laborstacker/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ore_values = rt.alist(f, ["glass", 1, "metal", 2, "solid plasma", 20, "plasteel", 23, "reinforced glass", 4, "gold", 20, "silver", 20, "uranium", 20, "diamond", 25, "bananium", 50]);
	return f.dot;
});

// laborstacker.dm:137
rt.def("/obj/machinery/mineral/stacking_machine/laborstacker/proc/process_sheet", function* process_sheet(f: Frame, inp: Value) {
	let n: Value = null, a: Value = null;
	if (rt.istype(inp, T("/obj/item/stack/sheet"))) {
		n = inp.name;
		a = inp.amount;
		if (rt.isIn(f, n, this.ore_values)) {
			this.points += rt.index(this.ore_values, n) * a;
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(10940, "/obj/machinery/mineral/labor_points_checker", "/obj/machinery/mineral", {
	anchored: 1,
	name: "points checking console",
	desc: "A console used by prisoners to check the progress on their quotas. Simply swipe a prisoner ID.",
	icon: rt.rsc("icons/obj/machines/mining_machines.dmi"),
	icon_state: "console",
	density: 0,
});

// laborstacker.dm:155
rt.def("/obj/machinery/mineral/labor_points_checker/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* user.examinate(this);
	return f.dot;
}, true);

// laborstacker.dm:158
rt.def("/obj/machinery/mineral/labor_points_checker/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let prisoner_id: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/card/id"))) {
		if (rt.istype(I, T("/obj/item/weapon/card/id/prisoner"))) {
			prisoner_id = I;
			to_chat(user, `<span class='notice'><B>ID: ${prisoner_id.registered_name}</B></span>`);
			to_chat(user, `<span class='notice'>Points Collected:${prisoner_id.points}</span>`);
			to_chat(user, `<span class='notice'>Point Quota: ${prisoner_id.goal}</span>`);
			to_chat(user, "<span class='notice'>Collect points by bringing smelted minerals to the Labor Shuttle stacking machine. Reach your quota to earn your release.</span>");
		} else {
			to_chat(user, "<span class='warning'>Error: Invalid ID</span>");
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);
