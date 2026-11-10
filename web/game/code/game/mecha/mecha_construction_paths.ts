// Based on /tg/station's code/game/mecha/mecha_construction_paths.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(1036, "/datum/construction/mecha", "/datum/construction", {});

// mecha_construction_paths.dm:6
rt.def("/datum/construction/mecha/proc/custom_action", function* custom_action(f: Frame, step: Value, used_atom: Value, user: Value) {
	let W: Value = null, C: Value = null, S: Value = null;
	if (rt.istype(used_atom, T("/obj/item/weapon/weldingtool"))) {
		if (yield* (W = used_atom).remove_fuel(0, user)) {
			playsound(this.holder, rt.rsc("sound/items/welder2.ogg"), 50, 1);
		} else {
			return 0;
		}
	} else if (rt.istype(used_atom, T("/obj/item/weapon/wrench"))) {
		W = used_atom;
		playsound(this.holder, W.usesound, 50, 1);
	} else if (rt.istype(used_atom, T("/obj/item/weapon/screwdriver"))) {
		W = used_atom;
		playsound(this.holder, W.usesound, 50, 1);
	} else if (rt.istype(used_atom, T("/obj/item/weapon/wirecutters"))) {
		W = used_atom;
		playsound(this.holder, W.usesound, 50, 1);
	} else if (rt.istype(used_atom, T("/obj/item/stack/cable_coil"))) {
		if (yield* (C = used_atom).use(4)) {
			playsound(this.holder, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
		} else {
			to_chat(user, "<span class='warning'>There's not enough cable to finish the task!</span>");
			return 0;
		}
	} else if (rt.istype(used_atom, T("/obj/item/stack"))) {
		if ((S = used_atom).get_amount() < 5) {
			to_chat(user, "<span class='warning'>There's not enough material in this stack!</span>");
			return 0;
		} else {
			yield* S.use(5);
		}
	}
	return 1;
}, true);

rt.type(1029, "/datum/construction/reversible/mecha", "/datum/construction/reversible", {});

// mecha_construction_paths.dm:41
rt.def("/datum/construction/reversible/mecha/proc/custom_action", function* custom_action(f: Frame, index: Value, diff: Value, used_atom: Value, user: Value) {
	let W: Value = null, C: Value = null, S: Value = null;
	if (rt.istype(used_atom, T("/obj/item/weapon/weldingtool"))) {
		if (yield* (W = used_atom).remove_fuel(0, user)) {
			playsound(this.holder, rt.rsc("sound/items/welder2.ogg"), 50, 1);
		} else {
			return 0;
		}
	} else if (rt.istype(used_atom, T("/obj/item/weapon/wrench"))) {
		W = used_atom;
		playsound(this.holder, W.usesound, 50, 1);
	} else if (rt.istype(used_atom, T("/obj/item/weapon/screwdriver"))) {
		W = used_atom;
		playsound(this.holder, W.usesound, 50, 1);
	} else if (rt.istype(used_atom, T("/obj/item/weapon/wirecutters"))) {
		W = used_atom;
		playsound(this.holder, W.usesound, 50, 1);
	} else if (rt.istype(used_atom, T("/obj/item/stack/cable_coil"))) {
		if (yield* (C = used_atom).use(4)) {
			playsound(this.holder, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
		} else {
			to_chat(user, "<span class='warning'>There's not enough cable to finish the task!</span>");
			return 0;
		}
	} else if (rt.istype(used_atom, T("/obj/item/stack"))) {
		if ((S = used_atom).get_amount() < 5) {
			to_chat(user, "<span class='warning'>There's not enough material in this stack!</span>");
			return 0;
		} else {
			yield* S.use(5);
		}
	}
	return 1;
}, true);

rt.type(1037, "/datum/construction/mecha/ripley_chassis", "/datum/construction/mecha", {
	steps: null,
});

// mecha_construction_paths.dm:77
rt.def("/datum/construction/mecha/ripley_chassis/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.steps = list(rt.alist(f, ["key", T("/obj/item/mecha_parts/part/ripley_torso")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/ripley_left_arm")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/ripley_right_arm")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/ripley_left_leg")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/ripley_right_leg")]));
	return f.dot;
});

// mecha_construction_paths.dm:85
rt.def("/datum/construction/mecha/ripley_chassis/proc/custom_action", function* custom_action(f: Frame, step: Value, used_atom: Value, user: Value) {
	user.visible_message(`${user} has connected ${used_atom} to the ${this.holder}.`, `<span class='notice'>You connect ${used_atom} to the ${this.holder}.</span>`);
	this.holder.add_overlay(used_atom.icon_state + "+o");
	yield* qdel(used_atom);
	return 1;
}, true);

// mecha_construction_paths.dm:91
rt.def("/datum/construction/mecha/ripley_chassis/proc/action", function* action(f: Frame, used_atom: Value, user: Value) {
	return (yield* this.check_all_steps(used_atom, user));
}, true);

// mecha_construction_paths.dm:94
rt.def("/datum/construction/mecha/ripley_chassis/proc/spawn_result", function* spawn_result(f: Frame) {
	let const_holder: Value = null;
	(const_holder = this.holder).construct = (yield* new_(T("/datum/construction/reversible/mecha/ripley"), const_holder));
	const_holder.icon = rt.rsc("icons/mecha/mech_construction.dmi");
	const_holder.icon_state = "ripley0";
	const_holder.density = 1;
	const_holder.cut_overlays(1);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(1030, "/datum/construction/reversible/mecha/ripley", "/datum/construction/reversible/mecha", {
	result: "/obj/mecha/working/ripley",
	steps: null,
});

// mecha_construction_paths.dm:106
rt.def("/datum/construction/reversible/mecha/ripley/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.steps = list(rt.alist(f, ["key", T("/obj/item/weapon/weldingtool"), "backkey", T("/obj/item/weapon/wrench"), "desc", "External armor is wrenched."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "External armor is installed."]), rt.alist(f, ["key", T("/obj/item/stack/sheet/plasteel"), "backkey", T("/obj/item/weapon/weldingtool"), "desc", "Internal armor is welded."]), rt.alist(f, ["key", T("/obj/item/weapon/weldingtool"), "backkey", T("/obj/item/weapon/wrench"), "desc", "Internal armor is wrenched."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Internal armor is installed."]), rt.alist(f, ["key", T("/obj/item/stack/sheet/metal"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Peripherals control module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Peripherals control module is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/ripley/peripherals"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Central control module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Central control module is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/ripley/main"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The wiring is adjusted."]), rt.alist(f, ["key", T("/obj/item/weapon/wirecutters"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The wiring is added."]), rt.alist(f, ["key", T("/obj/item/stack/cable_coil"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The hydraulic systems are active."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/wrench"), "desc", "The hydraulic systems are connected."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "desc", "The hydraulic systems are disconnected."]));
	return f.dot;
});

// mecha_construction_paths.dm:165
rt.def("/datum/construction/reversible/mecha/ripley/proc/action", function* action(f: Frame, used_atom: Value, user: Value) {
	return (yield* this.check_step(used_atom, user));
}, true);

// mecha_construction_paths.dm:168
rt.def("/datum/construction/reversible/mecha/ripley/proc/custom_action", function* custom_action(f: Frame, index: Value, diff: Value, used_atom: Value, user: Value) {
	let coil: Value = null, MS: Value = null;
	if (!(yield* parent_proc())) {
		return 0;
	}
	if (index === 14) {
		user.visible_message(`${user} connects the ${this.holder} hydraulic systems`, `<span class='notice'>You connect the ${this.holder} hydraulic systems.</span>`);
		this.holder.icon_state = "ripley1";
	} else if (index === 13) {
		if (diff == -1) {
			user.visible_message(`${user} activates the ${this.holder} hydraulic systems.`, `<span class='notice'>You activate the ${this.holder} hydraulic systems.</span>`);
			this.holder.icon_state = "ripley2";
		} else {
			user.visible_message(`${user} disconnects the ${this.holder} hydraulic systems`, `<span class='notice'>You disconnect the ${this.holder} hydraulic systems.</span>`);
			this.holder.icon_state = "ripley0";
		}
	} else if (index === 12) {
		if (diff == -1) {
			user.visible_message(`${user} adds the wiring to the ${this.holder}.`, `<span class='notice'>You add the wiring to the ${this.holder}.</span>`);
			this.holder.icon_state = "ripley3";
		} else {
			user.visible_message(`${user} deactivates the ${this.holder} hydraulic systems.`, `<span class='notice'>You deactivate the ${this.holder} hydraulic systems.</span>`);
			this.holder.icon_state = "ripley1";
		}
	} else if (index === 11) {
		if (diff == -1) {
			user.visible_message(`${user} adjusts the wiring of the ${this.holder}.`, `<span class='notice'>You adjust the wiring of the ${this.holder}.</span>`);
			this.holder.icon_state = "ripley4";
		} else {
			user.visible_message(`${user} removes the wiring from the ${this.holder}.`, `<span class='notice'>You remove the wiring from the ${this.holder}.</span>`);
			(coil = (yield* new_(T("/obj/item/stack/cable_coil"), rt.getStep(f, this.holder, 0)))).amount = 4;
			this.holder.icon_state = "ripley2";
		}
	} else if (index === 10) {
		if (diff == -1) {
			user.visible_message(`${user} installs the central control module into the ${this.holder}.`, `<span class='notice'>You install the central computer mainboard into the ${this.holder}.</span>`);
			yield* qdel(used_atom);
			this.holder.icon_state = "ripley5";
		} else {
			user.visible_message(`${user} disconnects the wiring of the ${this.holder}.`, `<span class='notice'>You disconnect the wiring of the ${this.holder}.</span>`);
			this.holder.icon_state = "ripley3";
		}
	} else if (index === 9) {
		if (diff == -1) {
			user.visible_message(`${user} secures the mainboard.`, "<span class='notice'>You secure the mainboard.</span>");
			this.holder.icon_state = "ripley6";
		} else {
			user.visible_message(`${user} removes the central control module from the ${this.holder}.`, `<span class='notice'>You remove the central computer mainboard from the ${this.holder}.</span>`);
			yield* new_(T("/obj/item/weapon/circuitboard/mecha/ripley/main"), rt.getStep(f, this.holder, 0));
			this.holder.icon_state = "ripley4";
		}
	} else if (index === 8) {
		if (diff == -1) {
			user.visible_message(`${user} installs the peripherals control module into the ${this.holder}.`, `<span class='notice'>You install the peripherals control module into the ${this.holder}.</span>`);
			yield* qdel(used_atom);
			this.holder.icon_state = "ripley7";
		} else {
			user.visible_message(`${user} unfastens the mainboard.`, "<span class='notice'>You unfasten the mainboard.</span>");
			this.holder.icon_state = "ripley5";
		}
	} else if (index === 7) {
		if (diff == -1) {
			user.visible_message(`${user} secures the peripherals control module.`, "<span class='notice'>You secure the peripherals control module.</span>");
			this.holder.icon_state = "ripley8";
		} else {
			user.visible_message(`${user} removes the peripherals control module from the ${this.holder}.`, `<span class='notice'>You remove the peripherals control module from the ${this.holder}.</span>`);
			yield* new_(T("/obj/item/weapon/circuitboard/mecha/ripley/peripherals"), rt.getStep(f, this.holder, 0));
			this.holder.icon_state = "ripley6";
		}
	} else if (index === 6) {
		if (diff == -1) {
			user.visible_message(`${user} installs the internal armor layer to the ${this.holder}.`, `<span class='notice'>You install the internal armor layer to the ${this.holder}.</span>`);
			this.holder.icon_state = "ripley9";
		} else {
			user.visible_message(`${user} unfastens the peripherals control module.`, "<span class='notice'>You unfasten the peripherals control module.</span>");
			this.holder.icon_state = "ripley7";
		}
	} else if (index === 5) {
		if (diff == -1) {
			user.visible_message(`${user} secures the internal armor layer.`, "<span class='notice'>You secure the internal armor layer.</span>");
			this.holder.icon_state = "ripley10";
		} else {
			user.visible_message(`${user} pries internal armor layer from the ${this.holder}.`, `<span class='notice'>You pry internal armor layer from the ${this.holder}.</span>`);
			(MS = (yield* new_(T("/obj/item/stack/sheet/metal"), rt.getStep(f, this.holder, 0)))).amount = 5;
			this.holder.icon_state = "ripley8";
		}
	} else if (index === 4) {
		if (diff == -1) {
			user.visible_message(`${user} welds the internal armor layer to the ${this.holder}.`, `<span class='notice'>You weld the internal armor layer to the ${this.holder}.</span>`);
			this.holder.icon_state = "ripley11";
		} else {
			user.visible_message(`${user} unfastens the internal armor layer.`, "<span class='notice'>You unfasten the internal armor layer.</span>");
			this.holder.icon_state = "ripley9";
		}
	} else if (index === 3) {
		if (diff == -1) {
			user.visible_message(`${user} installs the external reinforced armor layer to the ${this.holder}.`, `<span class='notice'>You install the external reinforced armor layer to the ${this.holder}.</span>`);
			this.holder.icon_state = "ripley12";
		} else {
			user.visible_message(`${user} cuts the internal armor layer from the ${this.holder}.`, `<span class='notice'>You cut the internal armor layer from the ${this.holder}.</span>`);
			this.holder.icon_state = "ripley10";
		}
	} else if (index === 2) {
		if (diff == -1) {
			user.visible_message(`${user} secures the external armor layer.`, "<span class='notice'>You secure the external reinforced armor layer.</span>");
			this.holder.icon_state = "ripley13";
		} else {
			user.visible_message(`${user} pries external armor layer from the ${this.holder}.`, `<span class='notice'>You pry external armor layer from the ${this.holder}.</span>`);
			(MS = (yield* new_(T("/obj/item/stack/sheet/plasteel"), rt.getStep(f, this.holder, 0)))).amount = 5;
			this.holder.icon_state = "ripley11";
		}
	} else if (index === 1) {
		if (diff == -1) {
			user.visible_message(`${user} welds the external armor layer to the ${this.holder}.`, `<span class='notice'>You weld the external armor layer to the ${this.holder}.</span>`);
		} else {
			user.visible_message(`${user} unfastens the external armor layer.`, "<span class='notice'>You unfasten the external armor layer.</span>");
			this.holder.icon_state = "ripley12";
		}
	}
	return 1;
}, true);

// mecha_construction_paths.dm:279
rt.def("/datum/construction/reversible/mecha/ripley/proc/spawn_result", function* spawn_result(f: Frame) {
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(1038, "/datum/construction/mecha/gygax_chassis", "/datum/construction/mecha", {
	steps: null,
});

// mecha_construction_paths.dm:286
rt.def("/datum/construction/mecha/gygax_chassis/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.steps = list(rt.alist(f, ["key", T("/obj/item/mecha_parts/part/gygax_torso")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/gygax_left_arm")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/gygax_right_arm")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/gygax_left_leg")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/gygax_right_leg")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/gygax_head")]));
	return f.dot;
});

// mecha_construction_paths.dm:295
rt.def("/datum/construction/mecha/gygax_chassis/proc/custom_action", function* custom_action(f: Frame, step: Value, used_atom: Value, user: Value) {
	user.visible_message(`${user} has connected ${used_atom} to the ${this.holder}.`, `<span class='notice'>You connect ${used_atom} to the ${this.holder}.</span>`);
	this.holder.add_overlay(used_atom.icon_state + "+o");
	yield* qdel(used_atom);
	return 1;
}, true);

// mecha_construction_paths.dm:301
rt.def("/datum/construction/mecha/gygax_chassis/proc/action", function* action(f: Frame, used_atom: Value, user: Value) {
	return (yield* this.check_all_steps(used_atom, user));
}, true);

// mecha_construction_paths.dm:304
rt.def("/datum/construction/mecha/gygax_chassis/proc/spawn_result", function* spawn_result(f: Frame) {
	let const_holder: Value = null;
	(const_holder = this.holder).construct = (yield* new_(T("/datum/construction/reversible/mecha/gygax"), const_holder));
	const_holder.icon = rt.rsc("icons/mecha/mech_construction.dmi");
	const_holder.icon_state = "gygax0";
	const_holder.density = 1;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(1031, "/datum/construction/reversible/mecha/gygax", "/datum/construction/reversible/mecha", {
	result: "/obj/mecha/combat/gygax",
	steps: null,
});

// mecha_construction_paths.dm:315
rt.def("/datum/construction/reversible/mecha/gygax/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.steps = list(rt.alist(f, ["key", T("/obj/item/weapon/weldingtool"), "backkey", T("/obj/item/weapon/wrench"), "desc", "External armor is wrenched."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "External armor is installed."]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/gygax_armor"), "backkey", T("/obj/item/weapon/weldingtool"), "desc", "Internal armor is welded."]), rt.alist(f, ["key", T("/obj/item/weapon/weldingtool"), "backkey", T("/obj/item/weapon/wrench"), "desc", "Internal armor is wrenched."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Internal armor is installed."]), rt.alist(f, ["key", T("/obj/item/stack/sheet/metal"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Advanced capacitor is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Advanced capacitor is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/stock_parts/capacitor"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Advanced scanner module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Advanced scanner module is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/stock_parts/scanning_module"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Weapon control module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Weapon control module is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/gygax/targeting"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Peripherals control module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Peripherals control module is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/gygax/peripherals"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Central control module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Central control module is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/gygax/main"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The wiring is adjusted."]), rt.alist(f, ["key", T("/obj/item/weapon/wirecutters"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The wiring is added."]), rt.alist(f, ["key", T("/obj/item/stack/cable_coil"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The hydraulic systems are active."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/wrench"), "desc", "The hydraulic systems are connected."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "desc", "The hydraulic systems are disconnected."]));
	return f.dot;
});

// mecha_construction_paths.dm:398
rt.def("/datum/construction/reversible/mecha/gygax/proc/action", function* action(f: Frame, used_atom: Value, user: Value) {
	return (yield* this.check_step(used_atom, user));
}, true);

// mecha_construction_paths.dm:401
rt.def("/datum/construction/reversible/mecha/gygax/proc/custom_action", function* custom_action(f: Frame, index: Value, diff: Value, used_atom: Value, user: Value) {
	let coil: Value = null, I: Value = null, MS: Value = null;
	if (!(yield* parent_proc())) {
		return 0;
	}
	if (index === 20) {
		user.visible_message(`${user} connects the ${this.holder} hydraulic systems`, `<span class='notice'>You connect the ${this.holder} hydraulic systems.</span>`);
		this.holder.icon_state = "gygax1";
	} else if (index === 19) {
		if (diff == -1) {
			user.visible_message(`${user} activates the ${this.holder} hydraulic systems.`, `<span class='notice'>You activate the ${this.holder} hydraulic systems.</span>`);
			this.holder.icon_state = "gygax2";
		} else {
			user.visible_message(`${user} disconnects the ${this.holder} hydraulic systems`, `<span class='notice'>You disconnect the ${this.holder} hydraulic systems.</span>`);
			this.holder.icon_state = "gygax0";
		}
	} else if (index === 18) {
		if (diff == -1) {
			user.visible_message(`${user} adds the wiring to the ${this.holder}.`, `<span class='notice'>You add the wiring to the ${this.holder}.</span>`);
			this.holder.icon_state = "gygax3";
		} else {
			user.visible_message(`${user} deactivates the ${this.holder} hydraulic systems.`, `<span class='notice'>You deactivate the ${this.holder} hydraulic systems.</span>`);
			this.holder.icon_state = "gygax1";
		}
	} else if (index === 17) {
		if (diff == -1) {
			user.visible_message(`${user} adjusts the wiring of the ${this.holder}.`, `<span class='notice'>You adjust the wiring of the ${this.holder}.</span>`);
			this.holder.icon_state = "gygax4";
		} else {
			user.visible_message(`${user} removes the wiring from the ${this.holder}.`, `<span class='notice'>You remove the wiring from the ${this.holder}.</span>`);
			(coil = (yield* new_(T("/obj/item/stack/cable_coil"), rt.getStep(f, this.holder, 0)))).amount = 4;
			this.holder.icon_state = "gygax2";
		}
	} else if (index === 16) {
		if (diff == -1) {
			user.visible_message(`${user} installs the central control module into the ${this.holder}.`, `<span class='notice'>You install the central computer mainboard into the ${this.holder}.</span>`);
			yield* qdel(used_atom);
			this.holder.icon_state = "gygax5";
		} else {
			user.visible_message(`${user} disconnects the wiring of the ${this.holder}.`, `<span class='notice'>You disconnect the wiring of the ${this.holder}.</span>`);
			this.holder.icon_state = "gygax3";
		}
	} else if (index === 15) {
		if (diff == -1) {
			user.visible_message(`${user} secures the mainboard.`, "<span class='notice'>You secure the mainboard.</span>");
			this.holder.icon_state = "gygax6";
		} else {
			user.visible_message(`${user} removes the central control module from the ${this.holder}.`, `<span class='notice'>You remove the central computer mainboard from the ${this.holder}.</span>`);
			yield* new_(T("/obj/item/weapon/circuitboard/mecha/gygax/main"), rt.getStep(f, this.holder, 0));
			this.holder.icon_state = "gygax4";
		}
	} else if (index === 14) {
		if (diff == -1) {
			user.visible_message(`${user} installs the peripherals control module into the ${this.holder}.`, `<span class='notice'>You install the peripherals control module into the ${this.holder}.</span>`);
			yield* qdel(used_atom);
			this.holder.icon_state = "gygax7";
		} else {
			user.visible_message(`${user} unfastens the mainboard.`, "<span class='notice'>You unfasten the mainboard.</span>");
			this.holder.icon_state = "gygax5";
		}
	} else if (index === 13) {
		if (diff == -1) {
			user.visible_message(`${user} secures the peripherals control module.`, "<span class='notice'>You secure the peripherals control module.</span>");
			this.holder.icon_state = "gygax8";
		} else {
			user.visible_message(`${user} removes the peripherals control module from the ${this.holder}.`, `<span class='notice'>You remove the peripherals control module from the ${this.holder}.</span>`);
			yield* new_(T("/obj/item/weapon/circuitboard/mecha/gygax/peripherals"), rt.getStep(f, this.holder, 0));
			this.holder.icon_state = "gygax6";
		}
	} else if (index === 12) {
		if (diff == -1) {
			user.visible_message(`${user} installs the weapon control module into the ${this.holder}.`, `<span class='notice'>You install the weapon control module into the ${this.holder}.</span>`);
			yield* qdel(used_atom);
			this.holder.icon_state = "gygax9";
		} else {
			user.visible_message(`${user} unfastens the peripherals control module.`, "<span class='notice'>You unfasten the peripherals control module.</span>");
			this.holder.icon_state = "gygax7";
		}
	} else if (index === 11) {
		if (diff == -1) {
			user.visible_message(`${user} secures the weapon control module.`, "<span class='notice'>You secure the weapon control module.</span>");
			this.holder.icon_state = "gygax10";
		} else {
			user.visible_message(`${user} removes the weapon control module from the ${this.holder}.`, `<span class='notice'>You remove the weapon control module from the ${this.holder}.</span>`);
			yield* new_(T("/obj/item/weapon/circuitboard/mecha/gygax/targeting"), rt.getStep(f, this.holder, 0));
			this.holder.icon_state = "gygax8";
		}
	} else if (index === 10) {
		if (diff == -1) {
			user.visible_message(`${user} installs scanner module to the ${this.holder}.`, `<span class='notice'>You install scanner module to the ${this.holder}.</span>`);
			I = used_atom;
			yield* user.transferItemToLoc(I, this.holder, 1);
			this.holder.icon_state = "gygax11";
		} else {
			user.visible_message(`${user} unfastens the weapon control module.`, "<span class='notice'>You unfasten the weapon control module.</span>");
			this.holder.icon_state = "gygax9";
		}
	} else if (index === 9) {
		if (diff == -1) {
			user.visible_message(`${user} secures the advanced scanner module.`, "<span class='notice'>You secure the scanner module.</span>");
			this.holder.icon_state = "gygax12";
		} else {
			user.visible_message(`${user} removes the advanced scanner module from the ${this.holder}.`, `<span class='notice'>You remove the scanner module from the ${this.holder}.</span>`);
			(I = rt.locateIn(f, T("/obj/item/weapon/stock_parts/scanning_module"), this.holder)).loc = rt.getStep(f, this.holder, 0);
			this.holder.icon_state = "gygax10";
		}
	} else if (index === 8) {
		if (diff == -1) {
			user.visible_message(`${user} installs capacitor to the ${this.holder}.`, `<span class='notice'>You install capacitor to the ${this.holder}.</span>`);
			I = used_atom;
			yield* user.transferItemToLoc(I, this.holder, 1);
			this.holder.icon_state = "gygax13";
		} else {
			user.visible_message(`${user} unfastens the  scanner module.`, "<span class='notice'>You unfasten the scanner module.</span>");
			this.holder.icon_state = "gygax11";
		}
	} else if (index === 7) {
		if (diff == -1) {
			user.visible_message(`${user} secures the  capacitor.`, "<span class='notice'>You secure the capacitor.</span>");
			this.holder.icon_state = "gygax14";
		} else {
			user.visible_message(`${user} removes the  capacitor from the ${this.holder}.`, `<span class='notice'>You remove the capacitor from the ${this.holder}.</span>`);
			(I = rt.locateIn(f, T("/obj/item/weapon/stock_parts/capacitor"), this.holder)).loc = rt.getStep(f, this.holder, 0);
			this.holder.icon_state = "gygax12";
		}
	} else if (index === 6) {
		if (diff == -1) {
			user.visible_message(`${user} installs the internal armor layer to the ${this.holder}.`, `<span class='notice'>You install the internal armor layer to the ${this.holder}.</span>`);
			this.holder.icon_state = "gygax15";
		} else {
			user.visible_message(`${user} unfastens the capacitor.`, "<span class='notice'>You unfasten the capacitor.</span>");
			this.holder.icon_state = "gygax13";
		}
	} else if (index === 5) {
		if (diff == -1) {
			user.visible_message(`${user} secures the internal armor layer.`, "<span class='notice'>You secure the internal armor layer.</span>");
			this.holder.icon_state = "gygax16";
		} else {
			user.visible_message(`${user} pries internal armor layer from the ${this.holder}.`, `<span class='notice'>You pry internal armor layer from the ${this.holder}.</span>`);
			(MS = (yield* new_(T("/obj/item/stack/sheet/metal"), rt.getStep(f, this.holder, 0)))).amount = 5;
			this.holder.icon_state = "gygax14";
		}
	} else if (index === 4) {
		if (diff == -1) {
			user.visible_message(`${user} welds the internal armor layer to the ${this.holder}.`, `<span class='notice'>You weld the internal armor layer to the ${this.holder}.</span>`);
			this.holder.icon_state = "gygax17";
		} else {
			user.visible_message(`${user} unfastens the internal armor layer.`, "<span class='notice'>You unfasten the internal armor layer.</span>");
			this.holder.icon_state = "gygax15";
		}
	} else if (index === 3) {
		if (diff == -1) {
			user.visible_message(`${user} installs Gygax Armor Plates to the ${this.holder}.`, `<span class='notice'>You install Gygax Armor Plates to the ${this.holder}.</span>`);
			yield* qdel(used_atom);
			this.holder.icon_state = "gygax18";
		} else {
			user.visible_message(`${user} cuts the internal armor layer from the ${this.holder}.`, `<span class='notice'>You cut the internal armor layer from the ${this.holder}.</span>`);
			this.holder.icon_state = "gygax16";
		}
	} else if (index === 2) {
		if (diff == -1) {
			user.visible_message(`${user} secures Gygax Armor Plates.`, "<span class='notice'>You secure Gygax Armor Plates.</span>");
			this.holder.icon_state = "gygax19";
		} else {
			user.visible_message(`${user} pries Gygax Armor Plates from the ${this.holder}.`, `<span class='notice'>You pry Gygax Armor Plates from the ${this.holder}.</span>`);
			yield* new_(T("/obj/item/mecha_parts/part/gygax_armor"), rt.getStep(f, this.holder, 0));
			this.holder.icon_state = "gygax17";
		}
	} else if (index === 1) {
		if (diff == -1) {
			user.visible_message(`${user} welds Gygax Armor Plates to the ${this.holder}.`, `<span class='notice'>You weld Gygax Armor Plates to the ${this.holder}.</span>`);
		} else {
			user.visible_message(`${user} unfastens Gygax Armor Plates.`, "<span class='notice'>You unfasten Gygax Armor Plates.</span>");
			this.holder.icon_state = "gygax18";
		}
	}
	return 1;
}, true);

// mecha_construction_paths.dm:564
rt.def("/datum/construction/reversible/mecha/gygax/proc/spawn_result", function* spawn_result(f: Frame) {
	let M: Value = null;
	yield* (M = (yield* new_(this.result, rt.getStep(f, this.holder, 0)))).CheckParts(this.holder.contents);
	yield* qdel(this.holder);
	return f.dot;
}, true);

rt.type(1039, "/datum/construction/mecha/firefighter_chassis", "/datum/construction/mecha", {
	steps: null,
});

// mecha_construction_paths.dm:571
rt.def("/datum/construction/mecha/firefighter_chassis/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.steps = list(rt.alist(f, ["key", T("/obj/item/mecha_parts/part/ripley_torso")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/ripley_left_arm")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/ripley_right_arm")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/ripley_left_leg")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/ripley_right_leg")]), rt.alist(f, ["key", T("/obj/item/clothing/suit/fire")]));
	return f.dot;
});

// mecha_construction_paths.dm:580
rt.def("/datum/construction/mecha/firefighter_chassis/proc/custom_action", function* custom_action(f: Frame, step: Value, used_atom: Value, user: Value) {
	user.visible_message(`${user} has connected ${used_atom} to the ${this.holder}.`, `<span class='notice'>You connect ${used_atom} to the ${this.holder}.</span>`);
	this.holder.add_overlay(used_atom.icon_state + "+o");
	yield* qdel(used_atom);
	return 1;
}, true);

// mecha_construction_paths.dm:586
rt.def("/datum/construction/mecha/firefighter_chassis/proc/action", function* action(f: Frame, used_atom: Value, user: Value) {
	return (yield* this.check_all_steps(used_atom, user));
}, true);

// mecha_construction_paths.dm:589
rt.def("/datum/construction/mecha/firefighter_chassis/proc/spawn_result", function* spawn_result(f: Frame) {
	let const_holder: Value = null;
	(const_holder = this.holder).construct = (yield* new_(T("/datum/construction/reversible/mecha/firefighter"), const_holder));
	const_holder.icon = rt.rsc("icons/mecha/mech_construction.dmi");
	const_holder.icon_state = "fireripley0";
	const_holder.density = 1;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(1032, "/datum/construction/reversible/mecha/firefighter", "/datum/construction/reversible/mecha", {
	result: "/obj/mecha/working/ripley/firefighter",
	steps: null,
});

// mecha_construction_paths.dm:600
rt.def("/datum/construction/reversible/mecha/firefighter/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.steps = list(rt.alist(f, ["key", T("/obj/item/weapon/weldingtool"), "backkey", T("/obj/item/weapon/wrench"), "desc", "External armor is wrenched."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "External armor is installed."]), rt.alist(f, ["key", T("/obj/item/stack/sheet/plasteel"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "External armor is being installed."]), rt.alist(f, ["key", T("/obj/item/stack/sheet/plasteel"), "backkey", T("/obj/item/weapon/weldingtool"), "desc", "Internal armor is welded."]), rt.alist(f, ["key", T("/obj/item/weapon/weldingtool"), "backkey", T("/obj/item/weapon/wrench"), "desc", "Internal armor is wrenched."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Internal armor is installed."]), rt.alist(f, ["key", T("/obj/item/stack/sheet/plasteel"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Peripherals control module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Peripherals control module is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/ripley/peripherals"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Central control module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Central control module is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/ripley/main"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The wiring is adjusted."]), rt.alist(f, ["key", T("/obj/item/weapon/wirecutters"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The wiring is added."]), rt.alist(f, ["key", T("/obj/item/stack/cable_coil"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The hydraulic systems are active."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/wrench"), "desc", "The hydraulic systems are connected."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "desc", "The hydraulic systems are disconnected."]));
	return f.dot;
});

// mecha_construction_paths.dm:664
rt.def("/datum/construction/reversible/mecha/firefighter/proc/action", function* action(f: Frame, used_atom: Value, user: Value) {
	return (yield* this.check_step(used_atom, user));
}, true);

// mecha_construction_paths.dm:667
rt.def("/datum/construction/reversible/mecha/firefighter/proc/custom_action", function* custom_action(f: Frame, index: Value, diff: Value, used_atom: Value, user: Value) {
	let coil: Value = null, MS: Value = null;
	if (!(yield* parent_proc())) {
		return 0;
	}
	if (index === 15) {
		user.visible_message(`${user} connects the ${this.holder} hydraulic systems`, `<span class='notice'>You connect the ${this.holder} hydraulic systems.</span>`);
		this.holder.icon_state = "fireripley1";
	} else if (index === 14) {
		if (diff == -1) {
			user.visible_message(`${user} activates the ${this.holder} hydraulic systems.`, `<span class='notice'>You activate the ${this.holder} hydraulic systems.</span>`);
			this.holder.icon_state = "fireripley2";
		} else {
			user.visible_message(`${user} disconnects the ${this.holder} hydraulic systems`, `<span class='notice'>You disconnect the ${this.holder} hydraulic systems.</span>`);
			this.holder.icon_state = "fireripley0";
		}
	} else if (index === 13) {
		if (diff == -1) {
			user.visible_message(`${user} adds the wiring to the ${this.holder}.`, `<span class='notice'>You add the wiring to the ${this.holder}.</span>`);
			this.holder.icon_state = "fireripley3";
		} else {
			user.visible_message(`${user} deactivates the ${this.holder} hydraulic systems.`, `<span class='notice'>You deactivate the ${this.holder} hydraulic systems.</span>`);
			this.holder.icon_state = "fireripley1";
		}
	} else if (index === 12) {
		if (diff == -1) {
			user.visible_message(`${user} adjusts the wiring of the ${this.holder}.`, `<span class='notice'>You adjust the wiring of the ${this.holder}.</span>`);
			this.holder.icon_state = "fireripley4";
		} else {
			user.visible_message(`${user} removes the wiring from the ${this.holder}.`, `<span class='notice'>You remove the wiring from the ${this.holder}.</span>`);
			(coil = (yield* new_(T("/obj/item/stack/cable_coil"), rt.getStep(f, this.holder, 0)))).amount = 4;
			this.holder.icon_state = "fireripley2";
		}
	} else if (index === 11) {
		if (diff == -1) {
			user.visible_message(`${user} installs the central control module into the ${this.holder}.`, `<span class='notice'>You install the central computer mainboard into the ${this.holder}.</span>`);
			yield* qdel(used_atom);
			this.holder.icon_state = "fireripley5";
		} else {
			user.visible_message(`${user} disconnects the wiring of the ${this.holder}.`, `<span class='notice'>You disconnect the wiring of the ${this.holder}.</span>`);
			this.holder.icon_state = "fireripley3";
		}
	} else if (index === 10) {
		if (diff == -1) {
			user.visible_message(`${user} secures the mainboard.`, "<span class='notice'>You secure the mainboard.</span>");
			this.holder.icon_state = "fireripley6";
		} else {
			user.visible_message(`${user} removes the central control module from the ${this.holder}.`, `<span class='notice'>You remove the central computer mainboard from the ${this.holder}.</span>`);
			yield* new_(T("/obj/item/weapon/circuitboard/mecha/ripley/main"), rt.getStep(f, this.holder, 0));
			this.holder.icon_state = "fireripley4";
		}
	} else if (index === 9) {
		if (diff == -1) {
			user.visible_message(`${user} installs the peripherals control module into the ${this.holder}.`, `<span class='notice'>You install the peripherals control module into the ${this.holder}.</span>`);
			yield* qdel(used_atom);
			this.holder.icon_state = "fireripley7";
		} else {
			user.visible_message(`${user} unfastens the mainboard.`, "<span class='notice'>You unfasten the mainboard.</span>");
			this.holder.icon_state = "fireripley5";
		}
	} else if (index === 8) {
		if (diff == -1) {
			user.visible_message(`${user} secures the peripherals control module.`, "<span class='notice'>You secure the peripherals control module.</span>");
			this.holder.icon_state = "fireripley8";
		} else {
			user.visible_message(`${user} removes the peripherals control module from the ${this.holder}.`, `<span class='notice'>You remove the peripherals control module from the ${this.holder}.</span>`);
			yield* new_(T("/obj/item/weapon/circuitboard/mecha/ripley/peripherals"), rt.getStep(f, this.holder, 0));
			this.holder.icon_state = "fireripley6";
		}
	} else if (index === 7) {
		if (diff == -1) {
			user.visible_message(`${user} installs the internal armor layer to the ${this.holder}.`, `<span class='notice'>You install the internal armor layer to the ${this.holder}.</span>`);
			this.holder.icon_state = "fireripley9";
		} else {
			user.visible_message(`${user} unfastens the peripherals control module.`, "<span class='notice'>You unfasten the peripherals control module.</span>");
			this.holder.icon_state = "fireripley7";
		}
	} else if (index === 6) {
		if (diff == -1) {
			user.visible_message(`${user} secures the internal armor layer.`, "<span class='notice'>You secure the internal armor layer.</span>");
			this.holder.icon_state = "fireripley10";
		} else {
			user.visible_message(`${user} pries internal armor layer from the ${this.holder}.`, `<span class='notice'>You pry internal armor layer from the ${this.holder}.</span>`);
			(MS = (yield* new_(T("/obj/item/stack/sheet/plasteel"), rt.getStep(f, this.holder, 0)))).amount = 5;
			this.holder.icon_state = "fireripley8";
		}
	} else if (index === 5) {
		if (diff == -1) {
			user.visible_message(`${user} welds the internal armor layer to the ${this.holder}.`, `<span class='notice'>You weld the internal armor layer to the ${this.holder}.</span>`);
			this.holder.icon_state = "fireripley11";
		} else {
			user.visible_message(`${user} unfastens the internal armor layer.`, "<span class='notice'>You unfasten the internal armor layer.</span>");
			this.holder.icon_state = "fireripley9";
		}
	} else if (index === 4) {
		if (diff == -1) {
			user.visible_message(`${user} starts to install the external armor layer to the ${this.holder}.`, `<span class='notice'>You install the external armor layer to the ${this.holder}.</span>`);
			this.holder.icon_state = "fireripley12";
		} else {
			user.visible_message(`${user} cuts the internal armor layer from the ${this.holder}.`, `<span class='notice'>You cut the internal armor layer from the ${this.holder}.</span>`);
			this.holder.icon_state = "fireripley10";
		}
	} else if (index === 3) {
		if (diff == -1) {
			user.visible_message(`${user} installs the external reinforced armor layer to the ${this.holder}.`, `<span class='notice'>You install the external reinforced armor layer to the ${this.holder}.</span>`);
			this.holder.icon_state = "fireripley13";
		} else {
			user.visible_message(`${user} removes the external armor from the ${this.holder}.`, `<span class='notice'>You remove the external armor from the ${this.holder}.</span>`);
			(MS = (yield* new_(T("/obj/item/stack/sheet/plasteel"), rt.getStep(f, this.holder, 0)))).amount = 5;
			this.holder.icon_state = "fireripley11";
		}
	} else if (index === 2) {
		if (diff == -1) {
			user.visible_message(`${user} secures the external armor layer.`, "<span class='notice'>You secure the external reinforced armor layer.</span>");
			this.holder.icon_state = "fireripley14";
		} else {
			user.visible_message(`${user} pries external armor layer from the ${this.holder}.`, `<span class='notice'>You pry external armor layer from the ${this.holder}.</span>`);
			(MS = (yield* new_(T("/obj/item/stack/sheet/plasteel"), rt.getStep(f, this.holder, 0)))).amount = 5;
			this.holder.icon_state = "fireripley12";
		}
	} else if (index === 1) {
		if (diff == -1) {
			user.visible_message(`${user} welds the external armor layer to the ${this.holder}.`, `<span class='notice'>You weld the external armor layer to the ${this.holder}.</span>`);
		} else {
			user.visible_message(`${user} unfastens the external armor layer.`, "<span class='notice'>You unfasten the external armor layer.</span>");
			this.holder.icon_state = "fireripley13";
		}
	}
	return 1;
}, true);

// mecha_construction_paths.dm:788
rt.def("/datum/construction/reversible/mecha/firefighter/proc/spawn_result", function* spawn_result(f: Frame) {
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(1040, "/datum/construction/mecha/honker_chassis", "/datum/construction/mecha", {
	steps: null,
});

// mecha_construction_paths.dm:795
rt.def("/datum/construction/mecha/honker_chassis/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.steps = list(rt.alist(f, ["key", T("/obj/item/mecha_parts/part/honker_torso")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/honker_left_arm")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/honker_right_arm")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/honker_left_leg")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/honker_right_leg")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/honker_head")]));
	return f.dot;
});

// mecha_construction_paths.dm:804
rt.def("/datum/construction/mecha/honker_chassis/proc/action", function* action(f: Frame, used_atom: Value, user: Value) {
	return (yield* this.check_all_steps(used_atom, user));
}, true);

// mecha_construction_paths.dm:807
rt.def("/datum/construction/mecha/honker_chassis/proc/custom_action", function* custom_action(f: Frame, step: Value, used_atom: Value, user: Value) {
	user.visible_message(`${user} has connected ${used_atom} to the ${this.holder}.`, `<span class='notice'>You connect ${used_atom} to the ${this.holder}.</span>`);
	this.holder.add_overlay(used_atom.icon_state + "+o");
	yield* qdel(used_atom);
	return 1;
}, true);

// mecha_construction_paths.dm:813
rt.def("/datum/construction/mecha/honker_chassis/proc/spawn_result", function* spawn_result(f: Frame) {
	let const_holder: Value = null;
	(const_holder = this.holder).construct = (yield* new_(T("/datum/construction/mecha/honker"), const_holder));
	const_holder.density = 1;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(1041, "/datum/construction/mecha/honker", "/datum/construction/mecha", {
	result: "/obj/mecha/combat/honker",
	steps: null,
});

// mecha_construction_paths.dm:822
rt.def("/datum/construction/mecha/honker/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.steps = list(rt.alist(f, ["key", T("/obj/item/weapon/bikehorn")]), rt.alist(f, ["key", T("/obj/item/clothing/shoes/clown_shoes")]), rt.alist(f, ["key", T("/obj/item/weapon/bikehorn")]), rt.alist(f, ["key", T("/obj/item/clothing/mask/gas/clown_hat")]), rt.alist(f, ["key", T("/obj/item/weapon/bikehorn")]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/honker/targeting")]), rt.alist(f, ["key", T("/obj/item/weapon/bikehorn")]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/honker/peripherals")]), rt.alist(f, ["key", T("/obj/item/weapon/bikehorn")]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/honker/main")]), rt.alist(f, ["key", T("/obj/item/weapon/bikehorn")]));
	return f.dot;
});

// mecha_construction_paths.dm:836
rt.def("/datum/construction/mecha/honker/proc/action", function* action(f: Frame, used_atom: Value, user: Value) {
	return (yield* this.check_step(used_atom, user));
}, true);

// mecha_construction_paths.dm:839
rt.def("/datum/construction/mecha/honker/proc/custom_action", function* custom_action(f: Frame, step: Value, used_atom: Value, user: Value) {
	if (!(yield* parent_proc())) {
		return 0;
	}
	if (rt.istype(used_atom, T("/obj/item/weapon/bikehorn"))) {
		playsound(this.holder, rt.rsc("sound/items/bikehorn.ogg"), 50, 1);
		user.visible_message("HONK!");
	}
	if (step === 10) {
		user.visible_message(`${user} installs the central control module into the ${this.holder}.`, `<span class='notice'>You install the central control module into the ${this.holder}.</span>`);
		yield* qdel(used_atom);
	} else if (step === 8) {
		user.visible_message(`${user} installs the peripherals control module into the ${this.holder}.`, `<span class='notice'>You install the peripherals control module into the ${this.holder}.</span>`);
		yield* qdel(used_atom);
	} else if (step === 6) {
		user.visible_message(`${user} installs the weapon control module into the ${this.holder}.`, `<span class='notice'>You install the weapon control module into the ${this.holder}.</span>`);
		yield* qdel(used_atom);
	} else if (step === 4) {
		user.visible_message(`${user} puts clown wig and mask on the ${this.holder}.`, `<span class='notice'>You put clown wig and mask on the ${this.holder}.</span>`);
		yield* qdel(used_atom);
	} else if (step === 2) {
		user.visible_message(`${user} puts clown boots on the ${this.holder}.`, `<span class='notice'>You put clown boots on the ${this.holder}.</span>`);
		yield* qdel(used_atom);
	}
	return 1;
}, true);

// mecha_construction_paths.dm:866
rt.def("/datum/construction/mecha/honker/proc/spawn_result", function* spawn_result(f: Frame) {
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(1042, "/datum/construction/mecha/durand_chassis", "/datum/construction/mecha", {
	steps: null,
});

// mecha_construction_paths.dm:871
rt.def("/datum/construction/mecha/durand_chassis/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.steps = list(rt.alist(f, ["key", T("/obj/item/mecha_parts/part/durand_torso")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/durand_left_arm")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/durand_right_arm")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/durand_left_leg")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/durand_right_leg")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/durand_head")]));
	return f.dot;
});

// mecha_construction_paths.dm:880
rt.def("/datum/construction/mecha/durand_chassis/proc/custom_action", function* custom_action(f: Frame, step: Value, used_atom: Value, user: Value) {
	user.visible_message(`${user} has connected ${used_atom} to the ${this.holder}.`, `You connect ${used_atom} to the ${this.holder}`);
	this.holder.add_overlay(used_atom.icon_state + "+o");
	yield* qdel(used_atom);
	return 1;
}, true);

// mecha_construction_paths.dm:886
rt.def("/datum/construction/mecha/durand_chassis/proc/action", function* action(f: Frame, used_atom: Value, user: Value) {
	return (yield* this.check_all_steps(used_atom, user));
}, true);

// mecha_construction_paths.dm:889
rt.def("/datum/construction/mecha/durand_chassis/proc/spawn_result", function* spawn_result(f: Frame) {
	let const_holder: Value = null;
	(const_holder = this.holder).construct = (yield* new_(T("/datum/construction/reversible/mecha/durand"), const_holder));
	const_holder.icon = rt.rsc("icons/mecha/mech_construction.dmi");
	const_holder.icon_state = "durand0";
	const_holder.density = 1;
	yield* g.del(f, this);
	return f.dot;
}, true);

rt.type(1033, "/datum/construction/reversible/mecha/durand", "/datum/construction/reversible/mecha", {
	result: "/obj/mecha/combat/durand",
	steps: null,
});

// mecha_construction_paths.dm:899
rt.def("/datum/construction/reversible/mecha/durand/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.steps = list(rt.alist(f, ["key", T("/obj/item/weapon/weldingtool"), "backkey", T("/obj/item/weapon/wrench"), "desc", "External armor is wrenched."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "External armor is installed."]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/durand_armor"), "backkey", T("/obj/item/weapon/weldingtool"), "desc", "Internal armor is welded."]), rt.alist(f, ["key", T("/obj/item/weapon/weldingtool"), "backkey", T("/obj/item/weapon/wrench"), "desc", "Internal armor is wrenched."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Internal armor is installed."]), rt.alist(f, ["key", T("/obj/item/stack/sheet/metal"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Super capacitor is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Super capacitor is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/stock_parts/capacitor"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Phasic scanner module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Phasic scanner module is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/stock_parts/scanning_module"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Weapon control module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Weapon control module is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/durand/targeting"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Peripherals control module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Peripherals control module is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/durand/peripherals"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Central control module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Central control module is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/durand/main"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The wiring is adjusted."]), rt.alist(f, ["key", T("/obj/item/weapon/wirecutters"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The wiring is added."]), rt.alist(f, ["key", T("/obj/item/stack/cable_coil"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The hydraulic systems are active."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/wrench"), "desc", "The hydraulic systems are connected."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "desc", "The hydraulic systems are disconnected."]));
	return f.dot;
});

// mecha_construction_paths.dm:983
rt.def("/datum/construction/reversible/mecha/durand/proc/action", function* action(f: Frame, used_atom: Value, user: Value) {
	return (yield* this.check_step(used_atom, user));
}, true);

// mecha_construction_paths.dm:986
rt.def("/datum/construction/reversible/mecha/durand/proc/custom_action", function* custom_action(f: Frame, index: Value, diff: Value, used_atom: Value, user: Value) {
	let coil: Value = null, I: Value = null, MS: Value = null;
	if (!(yield* parent_proc())) {
		return 0;
	}
	if (index === 20) {
		user.visible_message(`${user} connects the ${this.holder} hydraulic systems`, `<span class='notice'>You connect the ${this.holder} hydraulic systems.</span>`);
		this.holder.icon_state = "durand1";
	} else if (index === 19) {
		if (diff == -1) {
			user.visible_message(`${user} activates the ${this.holder} hydraulic systems.`, `<span class='notice'>You activate the ${this.holder} hydraulic systems.</span>`);
			this.holder.icon_state = "durand2";
		} else {
			user.visible_message(`${user} disconnects the ${this.holder} hydraulic systems`, `<span class='notice'>You disconnect the ${this.holder} hydraulic systems.</span>`);
			this.holder.icon_state = "durand0";
		}
	} else if (index === 18) {
		if (diff == -1) {
			user.visible_message(`${user} adds the wiring to the ${this.holder}.`, `<span class='notice'>You add the wiring to the ${this.holder}.</span>`);
			this.holder.icon_state = "durand3";
		} else {
			user.visible_message(`${user} deactivates the ${this.holder} hydraulic systems.`, `<span class='notice'>You deactivate the ${this.holder} hydraulic systems.</span>`);
			this.holder.icon_state = "durand1";
		}
	} else if (index === 17) {
		if (diff == -1) {
			user.visible_message(`${user} adjusts the wiring of the ${this.holder}.`, `<span class='notice'>You adjust the wiring of the ${this.holder}.</span>`);
			this.holder.icon_state = "durand4";
		} else {
			user.visible_message(`${user} removes the wiring from the ${this.holder}.`, `<span class='notice'>You remove the wiring from the ${this.holder}.</span>`);
			(coil = (yield* new_(T("/obj/item/stack/cable_coil"), rt.getStep(f, this.holder, 0)))).amount = 4;
			this.holder.icon_state = "durand2";
		}
	} else if (index === 16) {
		if (diff == -1) {
			user.visible_message(`${user} installs the central control module into the ${this.holder}.`, `<span class='notice'>You install the central computer mainboard into the ${this.holder}.</span>`);
			yield* qdel(used_atom);
			this.holder.icon_state = "durand5";
		} else {
			user.visible_message(`${user} disconnects the wiring of the ${this.holder}.`, `<span class='notice'>You disconnect the wiring of the ${this.holder}.</span>`);
			this.holder.icon_state = "durand3";
		}
	} else if (index === 15) {
		if (diff == -1) {
			user.visible_message(`${user} secures the mainboard.`, "<span class='notice'>You secure the mainboard.</span>");
			this.holder.icon_state = "durand6";
		} else {
			user.visible_message(`${user} removes the central control module from the ${this.holder}.`, `<span class='notice'>You remove the central computer mainboard from the ${this.holder}.</span>`);
			yield* new_(T("/obj/item/weapon/circuitboard/mecha/durand/main"), rt.getStep(f, this.holder, 0));
			this.holder.icon_state = "durand4";
		}
	} else if (index === 14) {
		if (diff == -1) {
			user.visible_message(`${user} installs the peripherals control module into the ${this.holder}.`, `<span class='notice'>You install the peripherals control module into the ${this.holder}.</span>`);
			yield* qdel(used_atom);
			this.holder.icon_state = "durand7";
		} else {
			user.visible_message(`${user} unfastens the mainboard.`, "<span class='notice'>You unfasten the mainboard.</span>");
			this.holder.icon_state = "durand5";
		}
	} else if (index === 13) {
		if (diff == -1) {
			user.visible_message(`${user} secures the peripherals control module.`, "<span class='notice'>You secure the peripherals control module.</span>");
			this.holder.icon_state = "durand8";
		} else {
			user.visible_message(`${user} removes the peripherals control module from the ${this.holder}.`, `<span class='notice'>You remove the peripherals control module from the ${this.holder}.</span>`);
			yield* new_(T("/obj/item/weapon/circuitboard/mecha/durand/peripherals"), rt.getStep(f, this.holder, 0));
			this.holder.icon_state = "durand6";
		}
	} else if (index === 12) {
		if (diff == -1) {
			user.visible_message(`${user} installs the weapon control module into the ${this.holder}.`, `<span class='notice'>You install the weapon control module into the ${this.holder}.</span>`);
			yield* qdel(used_atom);
			this.holder.icon_state = "durand9";
		} else {
			user.visible_message(`${user} unfastens the peripherals control module.`, "<span class='notice'>You unfasten the peripherals control module.</span>");
			this.holder.icon_state = "durand7";
		}
	} else if (index === 11) {
		if (diff == -1) {
			user.visible_message(`${user} secures the weapon control module.`, "<span class='notice'>You secure the weapon control module.</span>");
			this.holder.icon_state = "durand10";
		} else {
			user.visible_message(`${user} removes the weapon control module from the ${this.holder}.`, `<span class='notice'>You remove the weapon control module from the ${this.holder}.</span>`);
			yield* new_(T("/obj/item/weapon/circuitboard/mecha/durand/targeting"), rt.getStep(f, this.holder, 0));
			this.holder.icon_state = "durand8";
		}
	} else if (index === 10) {
		if (diff == -1) {
			user.visible_message(`${user} installs scanner module to the ${this.holder}.`, `<span class='notice'>You install phasic scanner module to the ${this.holder}.</span>`);
			I = used_atom;
			yield* user.transferItemToLoc(I, this.holder, 1);
			this.holder.icon_state = "durand11";
		} else {
			user.visible_message(`${user} unfastens the weapon control module.`, "<span class='notice'>You unfasten the weapon control module.</span>");
			this.holder.icon_state = "durand9";
		}
	} else if (index === 9) {
		if (diff == -1) {
			user.visible_message(`${user} secures the scanner module.`, "<span class='notice'>You secure the scanner module.</span>");
			this.holder.icon_state = "durand12";
		} else {
			user.visible_message(`${user} removes the scanner module from the ${this.holder}.`, `<span class='notice'>You remove the scanner module from the ${this.holder}.</span>`);
			(I = rt.locateIn(f, T("/obj/item/weapon/stock_parts/scanning_module"), this.holder)).loc = rt.getStep(f, this.holder, 0);
			this.holder.icon_state = "durand10";
		}
	} else if (index === 8) {
		if (diff == -1) {
			user.visible_message(`${user} installs capacitor to the ${this.holder}.`, `<span class='notice'>You install capacitor to the ${this.holder}.</span>`);
			I = used_atom;
			yield* user.transferItemToLoc(I, this.holder, 1);
			this.holder.icon_state = "durand13";
		} else {
			user.visible_message(`${user} unfastens the scanner module.`, "<span class='notice'>You unfasten the scanner module.</span>");
			this.holder.icon_state = "durand11";
		}
	} else if (index === 7) {
		if (diff == -1) {
			user.visible_message(`${user} secures the capacitor.`, "<span class='notice'>You secure the capacitor.</span>");
			this.holder.icon_state = "durand14";
		} else {
			user.visible_message(`${user} removes the super capacitor from the ${this.holder}.`, `<span class='notice'>You remove the capacitor from the ${this.holder}.</span>`);
			(I = rt.locateIn(f, T("/obj/item/weapon/stock_parts/capacitor"), this.holder)).loc = rt.getStep(f, this.holder, 0);
			this.holder.icon_state = "durand12";
		}
	} else if (index === 6) {
		if (diff == -1) {
			user.visible_message(`${user} installs the internal armor layer to the ${this.holder}.`, `<span class='notice'>You install the internal armor layer to the ${this.holder}.</span>`);
			this.holder.icon_state = "durand15";
		} else {
			user.visible_message(`${user} unfastens the super capacitor.`, "<span class='notice'>You unfasten the capacitor.</span>");
			this.holder.icon_state = "durand13";
		}
	} else if (index === 5) {
		if (diff == -1) {
			user.visible_message(`${user} secures the internal armor layer.`, "<span class='notice'>You secure the internal armor layer.</span>");
			this.holder.icon_state = "durand16";
		} else {
			user.visible_message(`${user} pries internal armor layer from the ${this.holder}.`, `<span class='notice'>You pry internal armor layer from the ${this.holder}.</span>`);
			(MS = (yield* new_(T("/obj/item/stack/sheet/metal"), rt.getStep(f, this.holder, 0)))).amount = 5;
			this.holder.icon_state = "durand14";
		}
	} else if (index === 4) {
		if (diff == -1) {
			user.visible_message(`${user} welds the internal armor layer to the ${this.holder}.`, `<span class='notice'>You weld the internal armor layer to the ${this.holder}.</span>`);
			this.holder.icon_state = "durand17";
		} else {
			user.visible_message(`${user} unfastens the internal armor layer.`, "<span class='notice'>You unfasten the internal armor layer.</span>");
			this.holder.icon_state = "durand15";
		}
	} else if (index === 3) {
		if (diff == -1) {
			user.visible_message(`${user} installs Durand Armor Plates to the ${this.holder}.`, `<span class='notice'>You install Durand Armor Plates to the ${this.holder}.</span>`);
			yield* qdel(used_atom);
			this.holder.icon_state = "durand18";
		} else {
			user.visible_message(`${user} cuts the internal armor layer from the ${this.holder}.`, `<span class='notice'>You cut the internal armor layer from the ${this.holder}.</span>`);
			this.holder.icon_state = "durand16";
		}
	} else if (index === 2) {
		if (diff == -1) {
			user.visible_message(`${user} secures Durand Armor Plates.`, "<span class='notice'>You secure Durand Armor Plates.</span>");
			this.holder.icon_state = "durand19";
		} else {
			user.visible_message(`${user} pries Durand Armor Plates from the ${this.holder}.`, `<span class='notice'>You pry Durand Armor Plates from the ${this.holder}.</span>`);
			yield* new_(T("/obj/item/mecha_parts/part/durand_armor"), rt.getStep(f, this.holder, 0));
			this.holder.icon_state = "durand17";
		}
	} else if (index === 1) {
		if (diff == -1) {
			user.visible_message(`${user} welds Durand Armor Plates to the ${this.holder}.`, `<span class='notice'>You weld Durand Armor Plates to the ${this.holder}.</span>`);
		} else {
			user.visible_message(`${user} unfastens Durand Armor Plates.`, "<span class='notice'>You unfasten Durand Armor Plates.</span>");
			this.holder.icon_state = "durand18";
		}
	}
	return 1;
}, true);

// mecha_construction_paths.dm:1149
rt.def("/datum/construction/reversible/mecha/durand/proc/spawn_result", function* spawn_result(f: Frame) {
	let M: Value = null;
	yield* (M = (yield* new_(this.result, rt.getStep(f, this.holder, 0)))).CheckParts(this.holder.contents);
	yield* qdel(this.holder);
	return f.dot;
}, true);

rt.type(1043, "/datum/construction/mecha/phazon_chassis", "/datum/construction/mecha", {
	result: "/obj/mecha/combat/phazon",
	steps: null,
});

// mecha_construction_paths.dm:1159
rt.def("/datum/construction/mecha/phazon_chassis/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.steps = list(rt.alist(f, ["key", T("/obj/item/mecha_parts/part/phazon_torso")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/phazon_left_arm")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/phazon_right_arm")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/phazon_left_leg")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/phazon_right_leg")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/phazon_head")]));
	return f.dot;
});

// mecha_construction_paths.dm:1168
rt.def("/datum/construction/mecha/phazon_chassis/proc/custom_action", function* custom_action(f: Frame, step: Value, used_atom: Value, user: Value) {
	user.visible_message(`${user} has connected ${used_atom} to the ${this.holder}.`, `<span class='notice'>You connect ${used_atom} to the ${this.holder}.</span>`);
	this.holder.add_overlay(used_atom.icon_state + "+o");
	yield* qdel(used_atom);
	return 1;
}, true);

// mecha_construction_paths.dm:1174
rt.def("/datum/construction/mecha/phazon_chassis/proc/action", function* action(f: Frame, used_atom: Value, user: Value) {
	return (yield* this.check_all_steps(used_atom, user));
}, true);

// mecha_construction_paths.dm:1177
rt.def("/datum/construction/mecha/phazon_chassis/proc/spawn_result", function* spawn_result(f: Frame) {
	let const_holder: Value = null;
	(const_holder = this.holder).construct = (yield* new_(T("/datum/construction/reversible/mecha/phazon"), const_holder));
	const_holder.icon = rt.rsc("icons/mecha/mech_construction.dmi");
	const_holder.icon_state = "phazon0";
	const_holder.density = 1;
	yield* g.del(f, this);
	return f.dot;
}, true);

rt.type(1034, "/datum/construction/reversible/mecha/phazon", "/datum/construction/reversible/mecha", {
	result: "/obj/mecha/combat/phazon",
	steps: null,
});

// mecha_construction_paths.dm:1187
rt.def("/datum/construction/reversible/mecha/phazon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.steps = list(rt.alist(f, ["key", T("/obj/item/device/assembly/signaler/anomaly"), "backkey", null, "desc", "Anomaly core socket is open and awaiting connection."]), rt.alist(f, ["key", T("/obj/item/weapon/weldingtool"), "backkey", T("/obj/item/weapon/wrench"), "desc", "External armor is wrenched."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "External armor is installed."]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/phazon_armor"), "backkey", T("/obj/item/weapon/weldingtool"), "desc", "Phase armor is welded."]), rt.alist(f, ["key", T("/obj/item/weapon/weldingtool"), "backkey", T("/obj/item/weapon/wrench"), "desc", "Phase armor is wrenched."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Phase armor is installed."]), rt.alist(f, ["key", T("/obj/item/stack/sheet/plasteel"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The bluespace crystal is engaged."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/wirecutters"), "desc", "The bluespace crystal is connected."]), rt.alist(f, ["key", T("/obj/item/stack/cable_coil"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "The bluespace crystal is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/ore/bluespace_crystal"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Super capacitor is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Super capacitor is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/stock_parts/capacitor"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Phasic scanner module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Phasic scanner module is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/stock_parts/scanning_module"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Weapon control module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Weapon control is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/phazon/targeting"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Peripherals control module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Peripherals control module is installed"]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/phazon/peripherals"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Central control module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Central control module is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/phazon/main"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The wiring is adjusted."]), rt.alist(f, ["key", T("/obj/item/weapon/wirecutters"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The wiring is added."]), rt.alist(f, ["key", T("/obj/item/stack/cable_coil"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The hydraulic systems are active."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/wrench"), "desc", "The hydraulic systems are connected."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "desc", "The hydraulic systems are disconnected."]));
	return f.dot;
});

// mecha_construction_paths.dm:1288
rt.def("/datum/construction/reversible/mecha/phazon/proc/action", function* action(f: Frame, used_atom: Value, user: Value) {
	return (yield* this.check_step(used_atom, user));
}, true);

// mecha_construction_paths.dm:1291
rt.def("/datum/construction/reversible/mecha/phazon/proc/custom_action", function* custom_action(f: Frame, index: Value, diff: Value, used_atom: Value, user: Value) {
	let coil: Value = null, I: Value = null, MS: Value = null;
	if (!(yield* parent_proc())) {
		return 0;
	}
	if (index === 24) {
		user.visible_message(`${user} connects the ${this.holder} hydraulic systems`, `<span class='notice'>You connect the ${this.holder} hydraulic systems.</span>`);
		this.holder.icon_state = "phazon1";
	} else if (index === 23) {
		if (diff == -1) {
			user.visible_message(`${user} activates the ${this.holder} hydraulic systems.`, `<span class='notice'>You activate the ${this.holder} hydraulic systems.</span>`);
			this.holder.icon_state = "phazon2";
		} else {
			user.visible_message(`${user} disconnects the ${this.holder} hydraulic systems`, `<span class='notice'>You disconnect the ${this.holder} hydraulic systems.</span>`);
			this.holder.icon_state = "phazon0";
		}
	} else if (index === 22) {
		if (diff == -1) {
			user.visible_message(`${user} adds the wiring to the ${this.holder}.`, `<span class='notice'>You add the wiring to the ${this.holder}.</span>`);
			this.holder.icon_state = "phazon3";
		} else {
			user.visible_message(`${user} deactivates the ${this.holder} hydraulic systems.`, `<span class='notice'>You deactivate the ${this.holder} hydraulic systems.</span>`);
			this.holder.icon_state = "phazon1";
		}
	} else if (index === 21) {
		if (diff == -1) {
			user.visible_message(`${user} adjusts the wiring of the ${this.holder}.`, `<span class='notice'>You adjust the wiring of the ${this.holder}.</span>`);
			this.holder.icon_state = "phazon4";
		} else {
			user.visible_message(`${user} removes the wiring from the ${this.holder}.`, `<span class='notice'>You remove the wiring from the ${this.holder}.</span>`);
			(coil = (yield* new_(T("/obj/item/stack/cable_coil"), rt.getStep(f, this.holder, 0)))).amount = 4;
			this.holder.icon_state = "phazon2";
		}
	} else if (index === 20) {
		if (diff == -1) {
			user.visible_message(`${user} installs the central control module into the ${this.holder}.`, `<span class='notice'>You install the central computer mainboard into the ${this.holder}.</span>`);
			yield* qdel(used_atom);
			this.holder.icon_state = "phazon5";
		} else {
			user.visible_message(`${user} disconnects the wiring of the ${this.holder}.`, `<span class='notice'>You disconnect the wiring of the ${this.holder}.</span>`);
			this.holder.icon_state = "phazon3";
		}
	} else if (index === 19) {
		if (diff == -1) {
			user.visible_message(`${user} secures the mainboard.`, "<span class='notice'>You secure the mainboard.</span>");
			this.holder.icon_state = "phazon6";
		} else {
			user.visible_message(`${user} removes the central control module from the ${this.holder}.`, `<span class='notice'>You remove the central computer mainboard from the ${this.holder}.</span>`);
			yield* new_(T("/obj/item/weapon/circuitboard/mecha/phazon/main"), rt.getStep(f, this.holder, 0));
			this.holder.icon_state = "phazon4";
		}
	} else if (index === 18) {
		if (diff == -1) {
			user.visible_message(`${user} installs the peripherals control module into the ${this.holder}.`, `<span class='notice'>You install the peripherals control module into the ${this.holder}.</span>`);
			yield* qdel(used_atom);
			this.holder.icon_state = "phazon7";
		} else {
			user.visible_message(`${user} unfastens the mainboard.`, "<span class='notice'>You unfasten the mainboard.</span>");
			this.holder.icon_state = "phazon5";
		}
	} else if (index === 17) {
		if (diff == -1) {
			user.visible_message(`${user} secures the peripherals control module.`, "<span class='notice'>You secure the peripherals control module.</span>");
			this.holder.icon_state = "phazon8";
		} else {
			user.visible_message(`${user} removes the peripherals control module from the ${this.holder}.`, `<span class='notice'>You remove the peripherals control module from the ${this.holder}.</span>`);
			yield* new_(T("/obj/item/weapon/circuitboard/mecha/phazon/peripherals"), rt.getStep(f, this.holder, 0));
			this.holder.icon_state = "phazon6";
		}
	} else if (index === 16) {
		if (diff == -1) {
			user.visible_message(`${user} installs the weapon control module into the ${this.holder}.`, `<span class='notice'>You install the weapon control module into the ${this.holder}.</span>`);
			yield* qdel(used_atom);
			this.holder.icon_state = "phazon9";
		} else {
			user.visible_message(`${user} unfastens the peripherals control module.`, "<span class='notice'>You unfasten the peripherals control module.</span>");
			this.holder.icon_state = "phazon7";
		}
	} else if (index === 15) {
		if (diff == -1) {
			user.visible_message(`${user} secures the weapon control module.`, "<span class='notice'>You secure the weapon control module.</span>");
			this.holder.icon_state = "phazon10";
		} else {
			user.visible_message(`${user} removes the weapon control module from the ${this.holder}.`, `<span class='notice'>You remove the weapon control module from the ${this.holder}.</span>`);
			yield* new_(T("/obj/item/weapon/circuitboard/mecha/phazon/targeting"), rt.getStep(f, this.holder, 0));
			this.holder.icon_state = "phazon8";
		}
	} else if (index === 14) {
		if (diff == -1) {
			user.visible_message(`${user} installs phasic scanner module to the ${this.holder}.`, `<span class='notice'>You install scanner module to the ${this.holder}.</span>`);
			I = used_atom;
			yield* user.transferItemToLoc(I, this.holder, 1);
			this.holder.icon_state = "phazon11";
		} else {
			user.visible_message(`${user} unfastens the weapon control module.`, "<span class='notice'>You unfasten the weapon control module.</span>");
			this.holder.icon_state = "phazon9";
		}
	} else if (index === 13) {
		if (diff == -1) {
			user.visible_message(`${user} secures the phasic scanner module.`, "<span class='notice'>You secure the scanner module.</span>");
			this.holder.icon_state = "phazon12";
		} else {
			user.visible_message(`${user} removes the phasic scanner module from the ${this.holder}.`, `<span class='notice'>You remove the scanner module from the ${this.holder}.</span>`);
			(I = rt.locateIn(f, T("/obj/item/weapon/stock_parts/scanning_module"), this.holder)).loc = rt.getStep(f, this.holder, 0);
			this.holder.icon_state = "phazon10";
		}
	} else if (index === 12) {
		if (diff == -1) {
			user.visible_message(`${user} installs super capacitor to the ${this.holder}.`, `<span class='notice'>You install capacitor to the ${this.holder}.</span>`);
			I = used_atom;
			yield* user.transferItemToLoc(I, this.holder, 1);
			this.holder.icon_state = "phazon13";
		} else {
			user.visible_message(`${user} unfastens the phasic scanner module.`, "<span class='notice'>You unfasten the scanner module.</span>");
			this.holder.icon_state = "phazon11";
		}
	} else if (index === 11) {
		if (diff == -1) {
			user.visible_message(`${user} secures the super capacitor.`, "<span class='notice'>You secure the capacitor.</span>");
			this.holder.icon_state = "phazon14";
		} else {
			user.visible_message(`${user} removes the super capacitor from the ${this.holder}.`, `<span class='notice'>You remove the capacitor from the ${this.holder}.</span>`);
			(I = rt.locateIn(f, T("/obj/item/weapon/stock_parts/capacitor"), this.holder)).loc = rt.getStep(f, this.holder, 0);
			this.holder.icon_state = "phazon12";
		}
	} else if (index === 10) {
		if (diff == -1) {
			user.visible_message(`${user} installs the bluespace crystal.`, "<span class='notice'>You install the bluespace crystal.</span>");
			yield* qdel(used_atom);
			this.holder.icon_state = "phazon15";
		} else {
			user.visible_message(`${user} unsecures the super capacitor from the ${this.holder}.`, `<span class='notice'>You unsecure the capacitor from the ${this.holder}.</span>`);
			this.holder.icon_state = "phazon13";
		}
	} else if (index === 9) {
		if (diff == -1) {
			user.visible_message(`${user} connects the bluespace crystal.`, "<span class='notice'>You connect the bluespace crystal.</span>");
			this.holder.icon_state = "phazon16";
		} else {
			user.visible_message(`${user} removes the bluespace crystal from the ${this.holder}.`, `<span class='notice'>You remove the bluespace crystal from the ${this.holder}.</span>`);
			yield* new_(T("/obj/item/weapon/ore/bluespace_crystal"), rt.getStep(f, this.holder, 0));
			this.holder.icon_state = "phazon14";
		}
	} else if (index === 8) {
		if (diff == -1) {
			user.visible_message(`${user} engages the bluespace crystal.`, "<span class='notice'>You engage the bluespace crystal.</span>");
			this.holder.icon_state = "phazon17";
		} else {
			user.visible_message(`${user} disconnects the bluespace crystal from the ${this.holder}.`, `<span class='notice'>You disconnect the bluespace crystal from the ${this.holder}.</span>`);
			this.holder.icon_state = "phazon15";
		}
	} else if (index === 7) {
		if (diff == -1) {
			user.visible_message(`${user} installs the phase armor layer to the ${this.holder}.`, `<span class='notice'>You install the phase armor layer to the ${this.holder}.</span>`);
			this.holder.icon_state = "phazon18";
		} else {
			user.visible_message(`${user} disengages the bluespace crystal.`, "<span class='notice'>You disengage the bluespace crystal.</span>");
			this.holder.icon_state = "phazon16";
		}
	} else if (index === 6) {
		if (diff == -1) {
			user.visible_message(`${user} secures the phase armor layer.`, "<span class='notice'>You secure the phase armor layer.</span>");
			this.holder.icon_state = "phazon19";
		} else {
			user.visible_message(`${user} pries the phase armor layer from the ${this.holder}.`, `<span class='notice'>You pry the phase armor layer from the ${this.holder}.</span>`);
			(MS = (yield* new_(T("/obj/item/stack/sheet/plasteel"), rt.getStep(f, this.holder, 0)))).amount = 5;
			this.holder.icon_state = "phazon17";
		}
	} else if (index === 5) {
		if (diff == -1) {
			user.visible_message(`${user} welds the phase armor layer to the ${this.holder}.`, `<span class='notice'>You weld the phase armor layer to the ${this.holder}.</span>`);
			this.holder.icon_state = "phazon20";
		} else {
			user.visible_message(`${user} unfastens the phase armor layer.`, "<span class='notice'>You unfasten the phase armor layer.</span>");
			this.holder.icon_state = "phazon18";
		}
	} else if (index === 4) {
		if (diff == -1) {
			user.visible_message(`${user} installs Phazon Armor Plates to the ${this.holder}.`, `<span class='notice'>You install Phazon Armor Plates to the ${this.holder}.</span>`);
			yield* qdel(used_atom);
			this.holder.icon_state = "phazon21";
		} else {
			user.visible_message(`${user} cuts phase armor layer from the ${this.holder}.`, `<span class='notice'>You cut the phase armor layer from the ${this.holder}.</span>`);
			this.holder.icon_state = "phazon19";
		}
	} else if (index === 3) {
		if (diff == -1) {
			user.visible_message(`${user} secures Phazon Armor Plates.`, "<span class='notice'>You secure Phazon Armor Plates.</span>");
			this.holder.icon_state = "phazon22";
		} else {
			user.visible_message(`${user} pries Phazon Armor Plates from the ${this.holder}.`, `<span class='notice'>You pry Phazon Armor Plates from the ${this.holder}.</span>`);
			yield* new_(T("/obj/item/mecha_parts/part/phazon_armor"), rt.getStep(f, this.holder, 0));
			this.holder.icon_state = "phazon20";
		}
	} else if (index === 2) {
		if (diff == -1) {
			user.visible_message(`${user} welds Phazon Armor Plates to the ${this.holder}.`, `<span class='notice'>You weld Phazon Armor Plates to the ${this.holder}.</span>`);
		} else {
			user.visible_message(`${user} unfastens Phazon Armor Plates.`, "<span class='notice'>You unfasten Phazon Armor Plates.</span>");
			this.holder.icon_state = "phazon21";
		}
	} else if (index === 1) {
		if (diff == -1) {
			user.visible_message(fmt("＀ carefully inserts the anomaly core into ％！ and secures it.", [user, this.holder]), "<span class='notice'>You slowly place the anomaly core into its socket and close its chamber.</span>");
			yield* qdel(used_atom);
		}
	}
	return 1;
}, true);

// mecha_construction_paths.dm:1481
rt.def("/datum/construction/reversible/mecha/phazon/proc/spawn_result", function* spawn_result(f: Frame) {
	let M: Value = null;
	yield* (M = (yield* new_(this.result, rt.getStep(f, this.holder, 0)))).CheckParts(this.holder.contents);
	yield* qdel(this.holder);
	return f.dot;
}, true);

rt.type(1044, "/datum/construction/mecha/odysseus_chassis", "/datum/construction/mecha", {
	steps: null,
});

// mecha_construction_paths.dm:1490
rt.def("/datum/construction/mecha/odysseus_chassis/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.steps = list(rt.alist(f, ["key", T("/obj/item/mecha_parts/part/odysseus_torso")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/odysseus_head")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/odysseus_left_arm")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/odysseus_right_arm")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/odysseus_left_leg")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/odysseus_right_leg")]));
	return f.dot;
});

// mecha_construction_paths.dm:1499
rt.def("/datum/construction/mecha/odysseus_chassis/proc/custom_action", function* custom_action(f: Frame, step: Value, used_atom: Value, user: Value) {
	user.visible_message(`${user} has connected ${used_atom} to the ${this.holder}.`, `<span class='notice'>You connect ${used_atom} to the ${this.holder}.</span>`);
	this.holder.add_overlay(used_atom.icon_state + "+o");
	yield* qdel(used_atom);
	return 1;
}, true);

// mecha_construction_paths.dm:1505
rt.def("/datum/construction/mecha/odysseus_chassis/proc/action", function* action(f: Frame, used_atom: Value, user: Value) {
	return (yield* this.check_all_steps(used_atom, user));
}, true);

// mecha_construction_paths.dm:1508
rt.def("/datum/construction/mecha/odysseus_chassis/proc/spawn_result", function* spawn_result(f: Frame) {
	let const_holder: Value = null;
	(const_holder = this.holder).construct = (yield* new_(T("/datum/construction/reversible/mecha/odysseus"), const_holder));
	const_holder.icon = rt.rsc("icons/mecha/mech_construction.dmi");
	const_holder.icon_state = "odysseus0";
	const_holder.density = 1;
	yield* g.del(f, this);
	return f.dot;
}, true);

rt.type(1035, "/datum/construction/reversible/mecha/odysseus", "/datum/construction/reversible/mecha", {
	result: "/obj/mecha/medical/odysseus",
	steps: null,
});

// mecha_construction_paths.dm:1519
rt.def("/datum/construction/reversible/mecha/odysseus/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.steps = list(rt.alist(f, ["key", T("/obj/item/weapon/weldingtool"), "backkey", T("/obj/item/weapon/wrench"), "desc", "External armor is wrenched."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "External armor is installed."]), rt.alist(f, ["key", T("/obj/item/stack/sheet/plasteel"), "backkey", T("/obj/item/weapon/weldingtool"), "desc", "Internal armor is welded."]), rt.alist(f, ["key", T("/obj/item/weapon/weldingtool"), "backkey", T("/obj/item/weapon/wrench"), "desc", "Internal armor is wrenched."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Internal armor is installed."]), rt.alist(f, ["key", T("/obj/item/stack/sheet/metal"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Peripherals control module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Peripherals control module is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/odysseus/peripherals"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Central control module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Central control module is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/odysseus/main"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The wiring is adjusted."]), rt.alist(f, ["key", T("/obj/item/weapon/wirecutters"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The wiring is added."]), rt.alist(f, ["key", T("/obj/item/stack/cable_coil"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The hydraulic systems are active."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/wrench"), "desc", "The hydraulic systems are connected."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "desc", "The hydraulic systems are disconnected."]));
	return f.dot;
});

// mecha_construction_paths.dm:1578
rt.def("/datum/construction/reversible/mecha/odysseus/proc/action", function* action(f: Frame, used_atom: Value, user: Value) {
	return (yield* this.check_step(used_atom, user));
}, true);

// mecha_construction_paths.dm:1581
rt.def("/datum/construction/reversible/mecha/odysseus/proc/custom_action", function* custom_action(f: Frame, index: Value, diff: Value, used_atom: Value, user: Value) {
	let coil: Value = null, MS: Value = null;
	if (!(yield* parent_proc())) {
		return 0;
	}
	if (index === 14) {
		user.visible_message(`${user} connects the ${this.holder} hydraulic systems`, `<span class='notice'>You connect the ${this.holder} hydraulic systems.</span>`);
		this.holder.icon_state = "odysseus1";
	} else if (index === 13) {
		if (diff == -1) {
			user.visible_message(`${user} activates the ${this.holder} hydraulic systems.`, `<span class='notice'>You activate the ${this.holder} hydraulic systems.</span>`);
			this.holder.icon_state = "odysseus2";
		} else {
			user.visible_message(`${user} disconnects the ${this.holder} hydraulic systems`, `<span class='notice'>You disconnect the ${this.holder} hydraulic systems.</span>`);
			this.holder.icon_state = "odysseus0";
		}
	} else if (index === 12) {
		if (diff == -1) {
			user.visible_message(`${user} adds the wiring to the ${this.holder}.`, `<span class='notice'>You add the wiring to the ${this.holder}.</span>`);
			this.holder.icon_state = "odysseus3";
		} else {
			user.visible_message(`${user} deactivates the ${this.holder} hydraulic systems.`, `<span class='notice'>You deactivate the ${this.holder} hydraulic systems.</span>`);
			this.holder.icon_state = "odysseus1";
		}
	} else if (index === 11) {
		if (diff == -1) {
			user.visible_message(`${user} adjusts the wiring of the ${this.holder}.`, `<span class='notice'>You adjust the wiring of the ${this.holder}.</span>`);
			this.holder.icon_state = "odysseus4";
		} else {
			user.visible_message(`${user} removes the wiring from the ${this.holder}.`, `<span class='notice'>You remove the wiring from the ${this.holder}.</span>`);
			(coil = (yield* new_(T("/obj/item/stack/cable_coil"), rt.getStep(f, this.holder, 0)))).amount = 4;
			this.holder.icon_state = "odysseus2";
		}
	} else if (index === 10) {
		if (diff == -1) {
			user.visible_message(`${user} installs the central control module into the ${this.holder}.`, `<span class='notice'>You install the central computer mainboard into the ${this.holder}.</span>`);
			yield* qdel(used_atom);
			this.holder.icon_state = "odysseus5";
		} else {
			user.visible_message(`${user} disconnects the wiring of the ${this.holder}.`, `<span class='notice'>You disconnect the wiring of the ${this.holder}.</span>`);
			this.holder.icon_state = "odysseus3";
		}
	} else if (index === 9) {
		if (diff == -1) {
			user.visible_message(`${user} secures the mainboard.`, "<span class='notice'>You secure the mainboard.</span>");
			this.holder.icon_state = "odysseus6";
		} else {
			user.visible_message(`${user} removes the central control module from the ${this.holder}.`, `<span class='notice'>You remove the central computer mainboard from the ${this.holder}.</span>`);
			yield* new_(T("/obj/item/weapon/circuitboard/mecha/odysseus/main"), rt.getStep(f, this.holder, 0));
			this.holder.icon_state = "odysseus4";
		}
	} else if (index === 8) {
		if (diff == -1) {
			user.visible_message(`${user} installs the peripherals control module into the ${this.holder}.`, `<span class='notice'>You install the peripherals control module into the ${this.holder}.</span>`);
			yield* qdel(used_atom);
			this.holder.icon_state = "odysseus7";
		} else {
			user.visible_message(`${user} unfastens the mainboard.`, "<span class='notice'>You unfasten the mainboard.</span>");
			this.holder.icon_state = "odysseus5";
		}
	} else if (index === 7) {
		if (diff == -1) {
			user.visible_message(`${user} secures the peripherals control module.`, "<span class='notice'>You secure the peripherals control module.</span>");
			this.holder.icon_state = "odysseus8";
		} else {
			user.visible_message(`${user} removes the peripherals control module from the ${this.holder}.`, `<span class='notice'>You remove the peripherals control module from the ${this.holder}.</span>`);
			yield* new_(T("/obj/item/weapon/circuitboard/mecha/odysseus/peripherals"), rt.getStep(f, this.holder, 0));
			this.holder.icon_state = "odysseus6";
		}
	} else if (index === 6) {
		if (diff == -1) {
			user.visible_message(`${user} installs the internal armor layer to the ${this.holder}.`, `<span class='notice'>You install the internal armor layer to the ${this.holder}.</span>`);
			this.holder.icon_state = "odysseus9";
		} else {
			user.visible_message(`${user} unfastens the peripherals control module.`, "<span class='notice'>You unfasten the peripherals control module.</span>");
			this.holder.icon_state = "odysseus7";
		}
	} else if (index === 5) {
		if (diff == -1) {
			user.visible_message(`${user} secures the internal armor layer.`, "<span class='notice'>You secure the internal armor layer.</span>");
			this.holder.icon_state = "odysseus10";
		} else {
			user.visible_message(`${user} pries internal armor layer from the ${this.holder}.`, `<span class='notice'>You pry internal armor layer from the ${this.holder}.</span>`);
			(MS = (yield* new_(T("/obj/item/stack/sheet/metal"), rt.getStep(f, this.holder, 0)))).amount = 5;
			this.holder.icon_state = "odysseus8";
		}
	} else if (index === 4) {
		if (diff == -1) {
			user.visible_message(`${user} welds the internal armor layer to the ${this.holder}.`, `<span class='notice'>You weld the internal armor layer to the ${this.holder}.</span>`);
			this.holder.icon_state = "odysseus11";
		} else {
			user.visible_message(`${user} unfastens the internal armor layer.`, "<span class='notice'>You unfasten the internal armor layer.</span>");
			this.holder.icon_state = "odysseus9";
		}
	} else if (index === 3) {
		if (diff == -1) {
			user.visible_message(`${user} installs ${used_atom} layer to the ${this.holder}.`, `<span class='notice'>You install the external reinforced armor layer to the ${this.holder}.</span>`);
			this.holder.icon_state = "odysseus12";
		} else {
			user.visible_message(`${user} cuts the internal armor layer from the ${this.holder}.`, `<span class='notice'>You cut the internal armor layer from the ${this.holder}.</span>`);
			this.holder.icon_state = "odysseus10";
		}
	} else if (index === 2) {
		if (diff == -1) {
			user.visible_message(`${user} secures the external armor layer.`, "<span class='notice'>You secure the external reinforced armor layer.</span>");
			this.holder.icon_state = "odysseus13";
		} else {
			(MS = (yield* new_(T("/obj/item/stack/sheet/plasteel"), rt.getStep(f, this.holder, 0)))).amount = 5;
			user.visible_message(`${user} pries ${MS} from the ${this.holder}.`, `<span class='notice'>You pry ${MS} from the ${this.holder}.</span>`);
			this.holder.icon_state = "odysseus11";
		}
	} else if (index === 1) {
		if (diff == -1) {
			user.visible_message(`${user} welds the external armor layer to the ${this.holder}.`, `<span class='notice'>You weld the external armor layer to the ${this.holder}.</span>`);
			this.holder.icon_state = "odysseus14";
		} else {
			user.visible_message(`${user} unfastens the external armor layer.`, "<span class='notice'>You unfasten the external armor layer.</span>");
			this.holder.icon_state = "odysseus12";
		}
	}
	return 1;
}, true);

// mecha_construction_paths.dm:1694
rt.def("/datum/construction/reversible/mecha/odysseus/proc/spawn_result", function* spawn_result(f: Frame) {
	yield* parent_proc();
	return f.dot;
}, true);
