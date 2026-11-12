// Based on /tg/station's code/game/machinery/embedded_controller/access_controller.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(10860, "/obj/machinery/doorButtons", "/obj/machinery", {
	idSelf: null,
	power_channel: 3,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 2,
	active_power_usage: 4,
	resistance_flags: 115,
});

// access_controller.dm:17
rt.def("/obj/machinery/doorButtons/proc/attackby", function* attackby(f: Frame, O: Value, user: Value) {
	yield* this.attack_hand(user);
	return f.dot;
}, true);

// access_controller.dm:23
rt.def("/obj/machinery/doorButtons/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	return INITIALIZE_HINT_LATELOAD;
}, true);

// access_controller.dm:27
rt.def("/obj/machinery/doorButtons/proc/LateInitialize", function LateInitialize(f: Frame) {
	this.findObjsByTag();
	return f.dot;
});

// access_controller.dm:30
rt.def("/obj/machinery/doorButtons/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (this.emagged) return f.dot;
	this.emagged = 1;
	this.req_access = list();
	this.req_one_access = list();
	playsound(this.loc, "sparks", 100, 1);
	to_chat(user, "<span class='warning'>You short out the access controller.</span>");
	return f.dot;
});

rt.type(10861, "/obj/machinery/doorButtons/access_button", "/obj/machinery/doorButtons", {
	idDoor: null,
	door: null,
	controller: null,
	busy: null,
	icon: rt.rsc("icons/obj/airlock_machines.dmi"),
	icon_state: "access_button_standby",
	name: "access button",
});

// access_controller.dm:50
rt.def("/obj/machinery/doorButtons/access_button/proc/findObjsByTag", function findObjsByTag(f: Frame) {
	let A: Value = null, I: Value = null;
	for (A of each(GLOB.machines, T("/obj/machinery/doorButtons/airlock_controller"))) {
		if (A.idSelf == this.idSelf) {
			this.controller = A;
			break;
		}
	}
	for (I of each(GLOB.machines, T("/obj/machinery/door/airlock"))) {
		if (I.id_tag == this.idDoor) {
			this.door = I;
			break;
		}
	}
	return f.dot;
});

// access_controller.dm:60
rt.def("/obj/machinery/doorButtons/access_button/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (this.busy) {
		return f.dot;
	}
	if (!(yield* this.allowed(user))) {
		to_chat(user, "<span class='warning'>Access denied.</span>");
		return f.dot;
	}
	if (!(this.controller && !this.controller.busy && this.door)) return f.dot;
	if (rt.bitAnd(this.controller.stat, 2)) {
		return f.dot;
	}
	this.busy = 1;
	yield* this.update_icon();
	if (this.door.density) {
		if (!this.controller.exteriorAirlock || !this.controller.interiorAirlock) {
			yield* this.controller.onlyOpen(this.door);
		} else if (this.controller.exteriorAirlock.density && this.controller.interiorAirlock.density) {
			yield* this.controller.onlyOpen(this.door);
		} else {
			this.controller.cycleClose(this.door);
		}
	} else {
		this.controller.onlyClose(this.door);
	}
	yield* sleep(20);
	this.busy = 0;
	yield* this.update_icon();
	return f.dot;
}, true);

// access_controller.dm:87
rt.def("/obj/machinery/doorButtons/access_button/proc/update_icon", function update_icon(f: Frame) {
	if (rt.bitAnd(this.stat, 2)) {
		this.icon_state = "access_button_off";
	} else if (this.busy) {
		this.icon_state = "access_button_cycle";
	} else {
		this.icon_state = "access_button_standby";
	}
	return f.dot;
});

// access_controller.dm:96
rt.def("/obj/machinery/doorButtons/access_button/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	this.update_icon();
	return f.dot;
});

// access_controller.dm:100
rt.def("/obj/machinery/doorButtons/access_button/proc/removeMe", function removeMe(f: Frame, O: Value) {
	if (O != this.door) return f.dot;
	this.door = null;
	return f.dot;
});

rt.type(10862, "/obj/machinery/doorButtons/airlock_controller", "/obj/machinery/doorButtons", {
	interiorAirlock: null,
	exteriorAirlock: null,
	idInterior: null,
	idExterior: null,
	busy: null,
	lostPower: null,
	icon: rt.rsc("icons/obj/airlock_machines.dmi"),
	icon_state: "access_control_standby",
	name: "access console",
});

// access_controller.dm:117
rt.def("/obj/machinery/doorButtons/airlock_controller/proc/removeMe", function removeMe(f: Frame, O: Value) {
	if (O == this.interiorAirlock) {
		this.interiorAirlock = null;
	} else {
		if (O != this.exteriorAirlock) return f.dot;
		this.exteriorAirlock = null;
	}
	return f.dot;
});

// access_controller.dm:123
rt.def("/obj/machinery/doorButtons/airlock_controller/proc/Destroy", function* Destroy(f: Frame) {
	let A: Value = null;
	for (A of each(GLOB.machines, T("/obj/machinery/doorButtons/access_button"))) {
		if (A.controller == this) {
			A.controller = null;
		}
	}
	return (yield* parent_proc());
}, true);

// access_controller.dm:129
rt.def("/obj/machinery/doorButtons/airlock_controller/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (this.busy) {
		return f.dot;
	}
	if (!(yield* this.allowed(f.usr))) {
		to_chat(f.usr, "<span class='warning'>Access denied.</span>");
		return f.dot;
	}
	const item = rt.at(href_list, "command");
	if (item === "close_exterior") {
		this.onlyClose(this.exteriorAirlock);
	} else if (item === "close_interior") {
		this.onlyClose(this.interiorAirlock);
	} else if (item === "cycle_exterior") {
		this.cycleClose(this.exteriorAirlock);
	} else if (item === "cycle_interior") {
		this.cycleClose(this.interiorAirlock);
	} else if (item === "open_exterior") {
		yield* this.onlyOpen(this.exteriorAirlock);
	} else if (item === "open_interior") {
		yield* this.onlyOpen(this.interiorAirlock);
	}
	return f.dot;
}, true);

// access_controller.dm:153
rt.def("/obj/machinery/doorButtons/airlock_controller/proc/onlyOpen", function* onlyOpen(f: Frame, A: Value) {
	if (!A) return f.dot;
	this.busy = 1;
	yield* this.update_icon();
	yield* this.openDoor(A);
	return f.dot;
}, true);

// access_controller.dm:159
rt.def("/obj/machinery/doorButtons/airlock_controller/proc/onlyClose", function onlyClose(f: Frame, A: Value) {
	if (!A) return f.dot;
	this.busy = 1;
	this.closeDoor(A);
	return f.dot;
});

// access_controller.dm:163
rt.def("/obj/machinery/doorButtons/airlock_controller/proc/closeDoor", function* closeDoor(f: Frame, A: Value) {
	if (A.density) {
		yield* this.goIdle();
		return 0;
	}
	yield* this.update_icon();
	A.unbolt();
	f.dot = 1;
	if (A && (yield* A.close())) {
		if (rt.bitAnd(this.stat, 2) || this.lostPower || !A || !A || A.gc_destroyed) {
			yield* this.goIdle(1);
			return f.dot;
		}
		A.bolt();
		if (this.busy == 1) {
			yield* this.goIdle(1);
		}
	} else {
		yield* this.goIdle(1);
	}
	return f.dot;
}, true, { waitfor: false });

// access_controller.dm:180
rt.def("/obj/machinery/doorButtons/airlock_controller/proc/cycleClose", function cycleClose(f: Frame, A: Value) {
	if (!A || !this.exteriorAirlock || !this.interiorAirlock) {
		return f.dot;
	}
	if (this.exteriorAirlock.density == this.interiorAirlock.density || !A.density) {
		return f.dot;
	}
	this.busy = 3;
	this.update_icon();
	if (A == this.interiorAirlock) {
		if (this.closeDoor(this.exteriorAirlock)) {
			this.busy = 5;
		}
	} else {
		if (!this.closeDoor(this.interiorAirlock)) return f.dot;
		this.busy = 4;
	}
	return f.dot;
});

// access_controller.dm:194
rt.def("/obj/machinery/doorButtons/airlock_controller/proc/cycleOpen", function* cycleOpen(f: Frame, A: Value) {
	// tg went idle on a missing door but carried on into openDoor(null): a runtime error that left the console busy all round.
	if (!A) {
		yield* this.goIdle(1);
		return f.dot;
	}
	if (A == this.exteriorAirlock) {
		if (this.interiorAirlock) {
			if (!this.interiorAirlock.density || !this.interiorAirlock.locked) {
				return f.dot;
			}
		}
	} else if (this.exteriorAirlock) {
		if (!this.exteriorAirlock.density || !this.exteriorAirlock.locked) {
			return f.dot;
		}
	}
	if (this.busy == 2) return f.dot;
	this.busy = 2;
	yield* this.openDoor(A);
	return f.dot;
}, true);

// access_controller.dm:209
rt.def("/obj/machinery/doorButtons/airlock_controller/proc/openDoor", function* openDoor(f: Frame, A: Value) {
	if (this.exteriorAirlock && this.interiorAirlock && (!this.exteriorAirlock.density || !this.interiorAirlock.density)) {
		yield* this.goIdle(1);
		return f.dot;
	}
	A.unbolt();
	rt.spawnTail(f, 0, "/obj/machinery/doorButtons/airlock_controller/proc/openDoor: spawn at game/machinery/embedded_controller/access_controller.dm:213", A);
	return f.dot;
}, true);

// a spawn(0) body of /obj/machinery/doorButtons/airlock_controller/proc/openDoor, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/doorButtons/airlock_controller/proc/openDoor: spawn at game/machinery/embedded_controller/access_controller.dm:213", function* (f: Frame, A: Value) {
	if (A && (yield* A.open())) {
		if (rt.bitOr(this.stat, 2) && !this.lostPower && A && !(!A || A.gc_destroyed)) {
			A.bolt();
		}
	}
	yield* this.goIdle(1);
	return null;
});

// access_controller.dm:223
rt.def("/obj/machinery/doorButtons/airlock_controller/proc/goIdle", function* goIdle(f: Frame, update: Value) {
	this.lostPower = 0;
	this.busy = 0;
	if (update) {
		yield* this.update_icon();
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// access_controller.dm:227
rt.def("/obj/machinery/doorButtons/airlock_controller/proc/process", function* process(f: Frame) {
	if (rt.bitAnd(this.stat, 2)) {
		return f.dot;
	}
	if (this.busy == 4) {
		yield* this.cycleOpen(this.exteriorAirlock);
	} else {
		if (this.busy != 5) return f.dot;
		yield* this.cycleOpen(this.interiorAirlock);
	}
	return f.dot;
}, true, { waitfor: false });

// access_controller.dm:235
rt.def("/obj/machinery/doorButtons/airlock_controller/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	if (rt.bitAnd(this.stat, 2)) {
		this.lostPower = 1;
	} else if (!this.busy) {
		this.lostPower = 0;
	}
	this.update_icon();
	return f.dot;
});

// access_controller.dm:244
rt.def("/obj/machinery/doorButtons/airlock_controller/proc/findObjsByTag", function findObjsByTag(f: Frame) {
	let A: Value = null;
	for (A of each(GLOB.machines, T("/obj/machinery/door/airlock"))) {
		if (A.id_tag == this.idInterior) {
			this.interiorAirlock = A;
		} else if (A.id_tag == this.idExterior) {
			this.exteriorAirlock = A;
		}
	}
	return f.dot;
});

// access_controller.dm:251
rt.def("/obj/machinery/doorButtons/airlock_controller/proc/update_icon", function update_icon(f: Frame) {
	if (rt.bitAnd(this.stat, 2)) {
		this.icon_state = "access_control_off";
		return f.dot;
	}
	if (this.busy || this.lostPower) {
		this.icon_state = "access_control_process";
	} else {
		this.icon_state = "access_control_standby";
	}
	return f.dot;
});

// access_controller.dm:260
rt.def("/obj/machinery/doorButtons/airlock_controller/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let popup: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	(popup = (yield* new_(T("/datum/browser"), user, "computer", this.name))).set_title_image(user.browse_rsc_icon(this.icon, this.icon_state));
	popup.set_content(this.returnText());
	yield* popup.open();
	return f.dot;
}, true);

// access_controller.dm:269
rt.def("/obj/machinery/doorButtons/airlock_controller/proc/returnText", function returnText(f: Frame) {
	let output: Value = null;
	if (!this.exteriorAirlock && !this.interiorAirlock) {
		return "ERROR ERROR ERROR ERROR";
	}
	if (this.lostPower) {
		output = "Initializing...";
	} else if (!this.exteriorAirlock || !this.interiorAirlock) {
		if (!this.exteriorAirlock) {
			if (this.interiorAirlock.density) {
				output = fmt("<A href='?src=＃;command=open_interior'>Open Interior Airlock</A><BR>", [this]);
			} else {
				output = fmt("<A href='?src=＃;command=close_interior'>Close Interior Airlock</A><BR>", [this]);
			}
		} else if (this.exteriorAirlock.density) {
			output = fmt("<A href='?src=＃;command=open_exterior'>Open Exterior Airlock</A><BR>", [this]);
		} else {
			output = fmt("<A href='?src=＃;command=close_exterior'>Close Exterior Airlock</A><BR>", [this]);
		}
	} else if (this.exteriorAirlock.density) {
		if (this.interiorAirlock.density) {
			output = fmt("<A href='?src=＃;command=open_exterior'>Open Exterior Airlock</A><BR>\n\t\t\t\t\t<A href='?src=＃;command=open_interior'>Open Interior Airlock</A><BR>", [this, this]);
		} else {
			output = fmt("<A href='?src=＃;command=cycle_exterior'>Cycle to Exterior Airlock</A><BR>\n\t\t\t\t\t<A href='?src=＃;command=close_interior'>Close Interior Airlock</A><BR>", [this, this]);
		}
	} else if (this.interiorAirlock.density) {
		output = fmt("<A href='?src=＃;command=close_exterior'>Close Exterior Airlock</A><BR>\n\t\t\t\t\t<A href='?src=＃;command=cycle_interior'>Cycle to Interior Airlock</A><BR>", [this, this]);
	} else {
		output = fmt("<A href='?src=＃;command=close_exterior'>Close Exterior Airlock</A><BR>\n\t\t\t\t\t<A href='?src=＃;command=close_interior'>Close Interior Airlock</A><BR>", [this, this]);
	}
	output = `<B>Access Control Console</B><HR>\n\t\t\t\t${output}<HR>`;
	if (this.exteriorAirlock) {
		output += `<B>Exterior Door: </B> ${this.exteriorAirlock.density ? "closed" : "open"}<BR>`;
	}
	if (this.interiorAirlock) {
		output += `<B>Interior Door: </B> ${this.interiorAirlock.density ? "closed" : "open"}<BR>`;
	}
	return output;
});
