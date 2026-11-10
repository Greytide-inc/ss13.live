// Based on /tg/station's code/modules/mining/machine_stacking.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(10932, "/obj/machinery/mineral/stacking_unit_console", "/obj/machinery/mineral", {
	machine: null,
	machinedir: 6,
	anchored: 1,
	speed_process: 1,
	name: "stacking machine console",
	icon: rt.rsc("icons/obj/machines/mining_machines.dmi"),
	icon_state: "console",
	density: 0,
});

// machine_stacking.dm:14
rt.def("/obj/machinery/mineral/stacking_unit_console/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.machine = rt.locateIn(f, T("/obj/machinery/mineral/stacking_machine"), rt.getStep(f, this, this.machinedir));
	if (this.machine) {
		this.machine.CONSOLE = this;
	} else {
		yield* qdel(this);
	}
	return f.dot;
}, true);

// machine_stacking.dm:26
rt.def("/obj/machinery/mineral/stacking_unit_console/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	let s: Value = null, dat: Value = null, O: Value = null;
	dat += "<b>Stacking unit console</b><br><br>";
	for (O of each(this.machine.stack_list)) {
		if ((s = rt.index(this.machine.stack_list, O)).amount > 0) {
			dat += fmt("＀: ＀ <A href='?src=＃;release=＀'>Release</A><br>", [capitalize(s.name), s.amount, this, s.type]);
		}
	}
	dat += `<br>Stacking: ${this.machine.stack_amt}<br><br>`;
	rt.op(f, "Browse", [], [user, dat, "window=console_stacking_machine"], false);
	return f.dot;
});

// machine_stacking.dm:40
rt.def("/obj/machinery/mineral/stacking_unit_console/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let inp: Value = null, out: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* f.usr.set_machine(this);
	yield* this.add_fingerprint(f.usr);
	if (rt.at(href_list, "release")) {
		if (!rt.isIn(f, text2path(rt.at(href_list, "release")), this.machine.stack_list)) {
			return f.dot;
		}
		inp = rt.index(this.machine.stack_list, text2path(rt.at(href_list, "release")));
		(out = (yield* new_(inp.type))).amount = inp.amount;
		inp.amount = 0;
		yield* this.machine.unload_mineral(out);
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

rt.type(10933, "/obj/machinery/mineral/stacking_machine", "/obj/machinery/mineral", {
	CONSOLE: null,
	stk_types: null,
	stk_amt: null,
	stack_list: null,
	stack_amt: 50,
	anchored: 1,
	input_dir: 4,
	output_dir: 8,
	name: "stacking machine",
	icon: rt.rsc("icons/obj/machines/mining_machines.dmi"),
	icon_state: "stacker",
	density: 1,
});

// machine_stacking.dm:66
rt.def("/obj/machinery/mineral/stacking_machine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.stk_types = list();

	this.stk_amt = list();

	this.stack_list = rt.op(f, "CreateMultidimensionalList", [1], [0]);
	return f.dot;
});

// machine_stacking.dm:74
rt.def("/obj/machinery/mineral/stacking_machine/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.proximity_monitor = (yield* new_(T("/datum/proximity_monitor"), this, 1));
	return f.dot;
}, true);

// machine_stacking.dm:78
rt.def("/obj/machinery/mineral/stacking_machine/proc/HasProximity", function* HasProximity(f: Frame, AM: Value) {
	if (!(rt.istype(AM, T("/obj/item/stack/sheet")) && AM.loc == rt.getStep(f, this, this.input_dir))) return f.dot;
	yield* this.process_sheet(AM);
	return f.dot;
}, true);

// machine_stacking.dm:82
rt.def("/obj/machinery/mineral/stacking_machine/proc/process_sheet", function* process_sheet(f: Frame, inp: Value) {
	let s: Value = null, storage: Value = null, out: Value = null;
	if (!rt.isIn(f, inp.type, this.stack_list)) {
		(s = (yield* new_(inp.type, this, 0))).amount = 0;
		rt.setAt(this.stack_list, inp.type, s);
	}
	(storage = rt.index(this.stack_list, inp.type)).amount += inp.amount;
	inp.loc = null;
	while (storage.amount > this.stack_amt) {
		(out = (yield* new_(inp.type))).amount = this.stack_amt;
		yield* this.unload_mineral(out);
		storage.amount -= this.stack_amt;
	}
	return f.dot;
}, true);
