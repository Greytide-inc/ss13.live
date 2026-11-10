// Based on /tg/station's code/modules/research/rdmachines.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10965, "/obj/machinery/r_n_d", "/obj/machinery", {
	busy: 0,
	hacked: 0,
	disabled: 0,
	shocked: 0,
	linked_console: null,
	loaded_item: null,
	anchored: 1,
	use_power: 1,
	name: "R&D Device",
	icon: rt.rsc("icons/obj/machines/research.dmi"),
	density: 1,
});

// rdmachines.dm:20
rt.def("/obj/machinery/r_n_d/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.wires = (yield* new_(T("/datum/wires/r_n_d"), this));
	return f.dot;
}, true);

// rdmachines.dm:24
rt.def("/obj/machinery/r_n_d/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.wires);
	this.wires = null;
	return (yield* parent_proc());
}, true);

// rdmachines.dm:29
rt.def("/obj/machinery/r_n_d/proc/shock", function* shock(f: Frame, user: Value, prb: Value) {
	if (rt.bitAnd(this.stat, 3)) {
		return 0;
	}
	if (!prob(prb)) {
		return 0;
	}
	yield* do_sparks(5, 1, this);
	if (yield* electrocute_mob(user, get_area(this), this, 0.7, 1)) {
		return 1;
	} else {
		return 0;
	}
}, true);

// rdmachines.dm:41
rt.def("/obj/machinery/r_n_d/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.shocked) {
		if (yield* this.shock(user, 50)) {
			return f.dot;
		}
	}
	if (!this.panel_open) return f.dot;
	yield* this.wires.interact(user);
	return f.dot;
}, true);

// rdmachines.dm:50
rt.def("/obj/machinery/r_n_d/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	if (this.shocked) {
		if (yield* this.shock(user, 50)) {
			return 1;
		}
	}
	if (this.default_deconstruction_screwdriver(user, `${rt.initial(f, this, "icon_state")}_t`, rt.initial(f, this, "icon_state"), O)) {
		if (this.linked_console) {
			this.disconnect_console();
		}
		return f.dot;
	}
	if (yield* this.exchange_parts(user, O)) {
		return f.dot;
	}
	if (yield* this.default_deconstruction_crowbar(O)) {
		return f.dot;
	}
	if (this.is_open_container() && O.is_open_container()) {
		return 0;
	}
	if (yield* this.Insert_Item(O, user)) {
		return 1;
	} else {
		return (yield* parent_proc());
	}
}, true);

// rdmachines.dm:69
rt.def("/obj/machinery/r_n_d/proc/disconnect_console", function disconnect_console(f: Frame) {
	this.linked_console = null;
	return f.dot;
});

// rdmachines.dm:78
rt.def("/obj/machinery/r_n_d/proc/is_insertion_ready", function is_insertion_ready(f: Frame, user: Value) {
	let console: Value = null;
	if (this.panel_open) {
		to_chat(user, `<span class='warning'>You can't load the ${this.name} while it's opened!</span>`);
		return f.dot;
	}
	if (this.disabled) {
		return f.dot;
	}
	if (!this.linked_console) {
		for (console of each(oview(3, this), T("/obj/machinery/computer/rdconsole"))) {
			if (console.first_use) {
				console.SyncRDevices();
			}
		}
		if (!this.linked_console) {
			to_chat(user, `<span class='warning'>The ${this.name} must be linked to an R&D console first!</span>`);
			return f.dot;
		}
	}
	if (this.busy) {
		to_chat(user, `<span class='warning'>The ${this.name} is busy right now.</span>`);
		return f.dot;
	}
	if (rt.bitAnd(this.stat, 1)) {
		to_chat(user, `<span class='warning'>The ${this.name} is broken.</span>`);
		return f.dot;
	}
	if (rt.bitAnd(this.stat, 2)) {
		to_chat(user, `<span class='warning'>The ${this.name} has no power.</span>`);
		return f.dot;
	}
	if (this.loaded_item) {
		to_chat(user, `<span class='warning'>The ${this} is already loaded.</span>`);
		return f.dot;
	}
	return 1;
});

// rdmachines.dm:108
rt.def("/obj/machinery/r_n_d/proc/on_deconstruction", function* on_deconstruction(f: Frame) {
	if (this.loaded_item) {
		yield* this.loaded_item.forceMove(this.loc);
	}
	yield* parent_proc();
	return f.dot;
}, true);
