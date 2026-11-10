// Based on /tg/station's code/modules/assembly/doorcontrol.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(9363, "/obj/item/device/assembly/control", "/obj/item/device/assembly", {
	id: null,
	can_change_id: 0,
	cooldown: 0,
	attachable: 1,
	name: "blast door controller",
	desc: "A small electronic device able to control a blast door remotely.",
	icon_state: "control",
	origin_tech: "magnets=1;programming=2",
});

// doorcontrol.dm:12
rt.def("/obj/item/device/assembly/control/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!this.id) return f.dot;
	to_chat(user, `<span class='notice'>Its channel ID is '${this.id}'.</span>`);
	return f.dot;
}, false);

// doorcontrol.dm:20
rt.def("/obj/item/device/assembly/control/proc/activate", function* activate(f: Frame) {
	let openclose: Value = null, M: Value = null;
	this.cooldown = 1;
	for (M of each(GLOB.machines, T("/obj/machinery/door/poddoor"))) {
		if (M.id == this.id) {
			openclose ??= M.density;
			rt.spawnTail(f, 0, "/obj/item/device/assembly/control/proc/activate: spawn at modules/assembly/doorcontrol.dm:24", openclose, M);
		}
	}
	yield* sleep(10);
	this.cooldown = 0;
	return f.dot;
}, true);

// a spawn(0) body of /obj/item/device/assembly/control/proc/activate, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/assembly/control/proc/activate: spawn at modules/assembly/doorcontrol.dm:24", function* (f: Frame, openclose: Value, M: Value) {
	if (M) {
		if (openclose) {
			yield* M.open();
		} else {
			yield* M.close();
		}
	}
	return f.dot;
});

rt.type(9364, "/obj/item/device/assembly/control/airlock", "/obj/item/device/assembly/control", {
	specialfunctions: 1,
	id: "badmin",
	name: "airlock controller",
	desc: "A small electronic device able to control an airlock remotely.",
});

// doorcontrol.dm:51
rt.def("/obj/item/device/assembly/control/airlock/proc/activate", function* activate(f: Frame) {
	let D: Value = null;
	let $0: any, $1: any, $e: any;
	this.cooldown = 1;
	let doors_need_closing: Value = 0;
	let open_or_close: Value = list();
	for (D of each(GLOB.airlocks, T("/obj/machinery/door/airlock"))) {
		if (D.id_tag == this.id) {
			if (rt.bitAnd(this.specialfunctions, 1)) {
				open_or_close += D;
				if (!D.density) {
					doors_need_closing = 1;
				}
			}
			if (rt.bitAnd(this.specialfunctions, 2)) {
				D.aiDisabledIdScanner = (!D.aiDisabledIdScanner ? 1 : 0);
			}
			if (rt.bitAnd(this.specialfunctions, BOLTS)) {
				if (!D.wires.is_cut("Bolts") && D.hasPower()) {
					D.locked = (!D.locked ? 1 : 0);
					yield* D.update_icon();
				}
			}
			if (rt.bitAnd(this.specialfunctions, 8)) {
				if (D.secondsElectrified) {
					D.secondsElectrified = -1;
					D.shockedby += `[${time_stamp()}]${f.usr}(ckey:${f.usr.ckey})`;
					add_logs(f.usr, D, "electrified");
				} else {
					D.secondsElectrified = 0;
				}
			}
			if (rt.bitAnd(this.specialfunctions, 16)) {
				D.safe = (!D.safe ? 1 : 0);
			}
		}
	}
	D = null;
	for (D of each(open_or_close)) {
		$0 = D;
		if (doors_need_closing) {
			$1 = P("/obj/machinery/door/airlock/proc/close");
		} else {
			$1 = P("/obj/machinery/door/airlock/proc/open");
		}
		yield* ImmediateInvokeAsync($0, $1);
	}
	yield* sleep(10);
	this.cooldown = 0;
	return f.dot;
}, true);

rt.type(9365, "/obj/item/device/assembly/control/massdriver", "/obj/item/device/assembly/control", {
	name: "mass driver controller",
	desc: "A small electronic device able to control a mass driver.",
});

// doorcontrol.dm:87
rt.def("/obj/item/device/assembly/control/massdriver/proc/activate", function* activate(f: Frame) {
	let M: Value = null;
	this.cooldown = 1;
	for (M of each(GLOB.machines, T("/obj/machinery/door/poddoor"))) {
		if (M.id == this.id) {
			rt.spawnTail(f, 0, "/obj/item/device/assembly/control/massdriver/proc/activate: spawn at modules/assembly/doorcontrol.dm:89", M);
		}
	}
	yield* sleep(10);
	M = null;
	for (M of each(GLOB.machines, T("/obj/machinery/mass_driver"))) {
		if (M.id == this.id) {
			yield* M.drive();
		}
	}
	yield* sleep(60);
	M = null;
	for (M of each(GLOB.machines, T("/obj/machinery/door/poddoor"))) {
		if (M.id == this.id) {
			rt.spawnTail(f, 0, "/obj/item/device/assembly/control/massdriver/proc/activate: spawn at modules/assembly/doorcontrol.dm:102", M);
		}
	}
	yield* sleep(10);
	this.cooldown = 0;
	return f.dot;
}, true);

// a spawn(0) body of /obj/item/device/assembly/control/massdriver/proc/activate, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/assembly/control/massdriver/proc/activate: spawn at modules/assembly/doorcontrol.dm:102", function* (f: Frame, M: Value) {
	yield* M.close();
	return null;
});

// a spawn(0) body of /obj/item/device/assembly/control/massdriver/proc/activate, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/assembly/control/massdriver/proc/activate: spawn at modules/assembly/doorcontrol.dm:89", function* (f: Frame, M: Value) {
	yield* M.open();
	return null;
});

rt.type(9366, "/obj/item/device/assembly/control/igniter", "/obj/item/device/assembly/control", {
	name: "ignition controller",
	desc: "A remote controller for a mounted igniter.",
});

// doorcontrol.dm:115
rt.def("/obj/item/device/assembly/control/igniter/proc/activate", function* activate(f: Frame) {
	let M: Value = null;
	this.cooldown = 1;
	for (M of each(GLOB.machines, T("/obj/machinery/sparker"))) {
		if (M.id == this.id) {
			rt.spawnTail(f, 0, "/obj/item/device/assembly/control/igniter/proc/activate: spawn at modules/assembly/doorcontrol.dm:117", M);
		}
	}
	M = null;
	for (M of each(GLOB.machines, T("/obj/machinery/igniter"))) {
		if (M.id == this.id) {
			yield* M.use_power(50);
			M.on = (!M.on ? 1 : 0);
			M.icon_state = `igniter${M.on}`;
		}
	}
	yield* sleep(30);
	this.cooldown = 0;
	return f.dot;
}, true);

// a spawn(0) body of /obj/item/device/assembly/control/igniter/proc/activate, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/assembly/control/igniter/proc/activate: spawn at modules/assembly/doorcontrol.dm:117", function* (f: Frame, M: Value) {
	yield* M.ignite();
	return null;
});

rt.type(9367, "/obj/item/device/assembly/control/flasher", "/obj/item/device/assembly/control", {
	name: "flasher controller",
	desc: "A remote controller for a mounted flasher.",
});

// doorcontrol.dm:136
rt.def("/obj/item/device/assembly/control/flasher/proc/activate", function* activate(f: Frame) {
	let M: Value = null;
	this.cooldown = 1;
	for (M of each(GLOB.machines, T("/obj/machinery/flasher"))) {
		if (M.id == this.id) {
			rt.spawnTail(f, 0, "/obj/item/device/assembly/control/flasher/proc/activate: spawn at modules/assembly/doorcontrol.dm:138", M);
		}
	}
	yield* sleep(50);
	this.cooldown = 0;
	return f.dot;
}, true);

// a spawn(0) body of /obj/item/device/assembly/control/flasher/proc/activate, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/assembly/control/flasher/proc/activate: spawn at modules/assembly/doorcontrol.dm:138", function* (f: Frame, M: Value) {
	yield* M.flash();
	return null;
});

rt.type(9368, "/obj/item/device/assembly/control/crematorium", "/obj/item/device/assembly/control", {
	name: "crematorium controller",
	desc: "An evil-looking remote controller for a crematorium.",
});

// doorcontrol.dm:151
rt.def("/obj/item/device/assembly/control/crematorium/proc/activate", function* activate(f: Frame) {
	let C: Value = null;
	this.cooldown = 1;
	for (C of each(GLOB.crematoriums, T("/obj/structure/bodycontainer/crematorium"))) {
		if (C.id == this.id) {
			yield* C.cremate(f.usr);
		}
	}
	yield* sleep(50);
	this.cooldown = 0;
	return f.dot;
}, true);
