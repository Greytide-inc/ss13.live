// Based on /tg/station's code/game/machinery/dna_scanner.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10787, "/obj/machinery/dna_scannernew", "/obj/machinery", {
	locked: 0,
	damage_coeff: null,
	scan_level: null,
	precision_coeff: null,
	anchored: 1,
	name: "１DNA scanner",
	desc: "It scans DNA structures.",
	icon: rt.rsc("icons/obj/cryogenic2.dmi"),
	icon_state: "scanner",
	density: 1,
	use_power: 1,
	idle_power_usage: 50,
	active_power_usage: 300,
	occupant_typecache: null,
});

// dna_scanner.dm:12
rt.def("/obj/machinery/dna_scannernew/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.occupant_typecache = list(T("/mob/living"), T("/obj/item/bodypart/head"), T("/obj/item/organ/brain"));
	return f.dot;
});

// dna_scanner.dm:18
rt.def("/obj/machinery/dna_scannernew/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/clonescanner"), null))).apply_default_parts(this);
	return f.dot;
}, true);

rt.type(6720, "/obj/item/weapon/circuitboard/machine/clonescanner", "/obj/item/weapon/circuitboard/machine", {
	name: "Cloning Scanner (Machine Board)",
	build_path: rt.typePath("/obj/machinery/dna_scannernew"),
	origin_tech: "programming=2;biotech=2",
	req_components: null,
});

// dna_scanner.dm:26
rt.def("/obj/item/weapon/circuitboard/machine/clonescanner/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/scanning_module"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 1, T("/obj/item/weapon/stock_parts/micro_laser"), 1, T("/obj/item/stack/sheet/glass"), 1, T("/obj/item/stack/cable_coil"), 2]);
	return f.dot;
});

// dna_scanner.dm:37
rt.def("/obj/machinery/dna_scannernew/proc/RefreshParts", function RefreshParts(f: Frame) {
	let _P: Value = null;
	this.scan_level = 0;
	this.damage_coeff = 0;
	this.precision_coeff = 0;
	for (_P of each(this.component_parts, T("/obj/item/weapon/stock_parts/scanning_module"))) {
		this.scan_level += _P.rating;
	}
	_P = null;
	for (_P of each(this.component_parts, T("/obj/item/weapon/stock_parts/manipulator"))) {
		this.precision_coeff = _P.rating;
	}
	_P = null;
	for (_P of each(this.component_parts, T("/obj/item/weapon/stock_parts/micro_laser"))) {
		this.damage_coeff = _P.rating;
	}
	return f.dot;
});

// dna_scanner.dm:47
rt.def("/obj/machinery/dna_scannernew/proc/update_icon", function update_icon(f: Frame) {
	if (rt.bitAnd(this.stat, 3)) {
		this.icon_state = rt.initial(f, this, "icon_state") + (this.state_open ? "_open" : "") + "_unpowered";
		return f.dot;
	}
	if (rt.bitAnd(this.stat, MAINT) || this.panel_open) {
		this.icon_state = rt.initial(f, this, "icon_state") + (this.state_open ? "_open" : "") + "_maintenance";
		return f.dot;
	}
	if (this.occupant) {
		this.icon_state = rt.initial(f, this, "icon_state") + "_occupied";
		return f.dot;
	}
	this.icon_state = rt.initial(f, this, "icon_state") + (this.state_open ? "_open" : "");
	return f.dot;
});

// dna_scanner.dm:64
rt.def("/obj/machinery/dna_scannernew/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	this.update_icon();
	return f.dot;
});

// dna_scanner.dm:69
rt.def("/obj/machinery/dna_scannernew/proc/toggle_open", function* toggle_open(f: Frame, user: Value) {
	if (this.panel_open) {
		to_chat(user, "<span class='notice'>Close the maintenance panel first.</span>");
		return f.dot;
	}
	if (this.state_open) {
		yield* this.close_machine();
		return f.dot;
	} else if (this.locked) {
		to_chat(user, "<span class='notice'>The bolts are locked down, securing the door shut.</span>");
		return f.dot;
	}
	yield* this.open_machine();
	return f.dot;
}, true);

// dna_scanner.dm:84
rt.def("/obj/machinery/dna_scannernew/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	let breakout_time: Value = 2;
	if (this.state_open || !this.locked) {
		this.state_open = 1;
		return f.dot;
	}
	user.changeNext_move(100);
	user.last_special = rt.worldTime(f) + 100;
	to_chat(user, `<span class='notice'>You lean on the back of ${this} and start pushing the door open... (this will take about ${breakout_time} minutes.)</span>`);
	user.visible_message(`<span class='italics'>You hear a metallic creaking from ${this}!</span>`);
	if (!(yield* do_after(user, breakout_time * 60 * 10, { target: this }))) return f.dot;
	if (!user || user.stat != 0 || user.loc != this || this.state_open || !this.locked) {
		return f.dot;
	}
	this.locked = 0;
	this.visible_message(`<span class='warning'>${user} successfully broke out of ${this}!</span>`);
	to_chat(user, `<span class='notice'>You successfully break out of ${this}!</span>`);
	yield* this.open_machine();
	return f.dot;
}, true);

// dna_scanner.dm:103
rt.def("/obj/machinery/dna_scannernew/proc/locate_computer", function locate_computer(f: Frame, type_: Value) {
	let C: Value = null;
	let $e: any;
	rt.forList(f, 0, list(1, 4, 2, 8));
	while (($e = rt.next(f, 0)) !== undefined) {
		this.dir = $e;
		if (C = rt.locateIn(f, type_, rt.getStep(f, this, this.dir))) {
			return C;
		}
	}
	rt.endFor(f, 0);
	return null;
});

// dna_scanner.dm:110
rt.def("/obj/machinery/dna_scannernew/proc/close_machine", function* close_machine(f: Frame) {
	let mob_occupant: Value = null, console: Value = null;
	if (!this.state_open) {
		return 0;
	}
	yield* parent_proc();
	if (rt.istype((mob_occupant = get_mob_or_brainmob(this.occupant)), T("/mob/living"))) {
		if (this.locate_computer(T("/obj/machinery/computer/cloning"))) {
			if (!mob_occupant.suiciding && !rt.bitAnd(mob_occupant.disabilities, 128) && !mob_occupant.hellbound) {
				yield* mob_occupant.notify_ghost_cloning("Your corpse has been placed into a cloning scanner. Re-enter your corpse if you want to be cloned!", { source: this });
			}
		}
	}
	if (rt.istype(this.occupant, T("/mob/living"))) {
		if (console = this.locate_computer(T("/obj/machinery/computer/scan_consolenew"))) {
			yield* console.on_scanner_close();
		}
	}
	return 1;
}, true);

// dna_scanner.dm:134
rt.def("/obj/machinery/dna_scannernew/proc/open_machine", function* open_machine(f: Frame) {
	if (this.state_open) {
		return 0;
	}
	yield* parent_proc();
	return 1;
}, true);

// dna_scanner.dm:139
rt.def("/obj/machinery/dna_scannernew/proc/relaymove", function* relaymove(f: Frame, user: Value) {
	if (user.stat || this.locked) {
		return f.dot;
	}
	yield* this.open_machine();
	return f.dot;
}, true);

// dna_scanner.dm:147
rt.def("/obj/machinery/dna_scannernew/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (!this.occupant && this.default_deconstruction_screwdriver(user, this.icon_state, this.icon_state, I)) {
		yield* this.update_icon();
		return f.dot;
	}
	if (yield* this.exchange_parts(user, I)) {
		return f.dot;
	}
	if (yield* this.default_pry_open(I)) {
		return f.dot;
	}
	if (yield* this.default_deconstruction_crowbar(I)) {
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// dna_scanner.dm:163
rt.def("/obj/machinery/dna_scannernew/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (yield* parent_proc(user, 1, 0)) {
		return f.dot;
	}
	yield* this.toggle_open(user);
	return f.dot;
}, true);
