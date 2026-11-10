// Based on /tg/station's code/game/machinery/computer/buildandrepair.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(12543, "/obj/structure/frame/computer", "/obj/structure/frame", {
	state: 0,
	name: "computer frame",
	icon_state: "0",
});

// buildandrepair.dm:7
rt.def("/obj/structure/frame/computer/proc/attackby", function* attackby(f: Frame) {
	let WT: Value = null, M: Value = null, C: Value = null, A: Value = null, G: Value = null, B: Value = null;
	yield* this.add_fingerprint(f.args[1]);
	if (this.state === 0) {
		if (rt.istype(f.args[0], T("/obj/item/weapon/wrench"))) {
			playsound(this.loc, f.args[0].usesound, 50, 1);
			to_chat(f.args[1], "<span class='notice'>You start wrenching the frame into place...</span>");
			if (yield* do_after(f.args[1], 20 * f.args[0].toolspeed, { target: this })) {
				to_chat(f.args[1], "<span class='notice'>You wrench the frame into place.</span>");
				this.anchored = 1;
				this.state = 1;
			}
			return f.dot;
		}
		if (rt.istype(f.args[0], T("/obj/item/weapon/weldingtool"))) {
			if (!(yield* (WT = f.args[0]).remove_fuel(0, f.args[1]))) {
				if (!WT.isOn()) {
					to_chat(f.args[1], "<span class='warning'>The welding tool must be on to complete this task!</span>");
				}
				return f.dot;
			}
			playsound(this.loc, f.args[0].usesound, 50, 1);
			to_chat(f.args[1], "<span class='notice'>You start deconstructing the frame...</span>");
			if (yield* do_after(f.args[1], 20 * f.args[0].toolspeed, { target: this })) {
				if (!this || !WT.isOn()) {
					return f.dot;
				}
				to_chat(f.args[1], "<span class='notice'>You deconstruct the frame.</span>");
				yield* (M = (yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, 5))).add_fingerprint(f.args[1]);
				yield* qdel(this);
			}
			return f.dot;
		}
	} else if (this.state === 1) {
		if (rt.istype(f.args[0], T("/obj/item/weapon/wrench"))) {
			playsound(this.loc, f.args[0].usesound, 50, 1);
			to_chat(f.args[1], "<span class='notice'>You start to unfasten the frame...</span>");
			if (yield* do_after(f.args[1], 20 * f.args[0].toolspeed, { target: this })) {
				to_chat(f.args[1], "<span class='notice'>You unfasten the frame.</span>");
				this.anchored = 0;
				this.state = 0;
			}
			return f.dot;
		}
		if (rt.istype(f.args[0], T("/obj/item/weapon/circuitboard/computer")) && !this.circuit) {
			if (!(yield* f.args[1].drop_item())) {
				return f.dot;
			}
			playsound(this.loc, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
			to_chat(f.args[1], "<span class='notice'>You place the circuit board inside the frame.</span>");
			this.icon_state = "1";
			this.circuit = f.args[0];
			yield* this.circuit.add_fingerprint(f.args[1]);
			f.args[0].loc = null;
			return f.dot;
		} else if (rt.istype(f.args[0], T("/obj/item/weapon/circuitboard")) && !this.circuit) {
			to_chat(f.args[1], "<span class='warning'>This frame does not accept circuit boards of this type!</span>");
			return f.dot;
		}
		if (rt.istype(f.args[0], T("/obj/item/weapon/screwdriver")) && this.circuit) {
			playsound(this.loc, f.args[0].usesound, 50, 1);
			to_chat(f.args[1], "<span class='notice'>You screw the circuit board into place.</span>");
			this.state = 2;
			this.icon_state = "2";
			return f.dot;
		}
		if (rt.istype(f.args[0], T("/obj/item/weapon/crowbar")) && this.circuit) {
			playsound(this.loc, f.args[0].usesound, 50, 1);
			to_chat(f.args[1], "<span class='notice'>You remove the circuit board.</span>");
			this.state = 1;
			this.icon_state = "0";
			this.circuit.loc = this.loc;
			yield* this.circuit.add_fingerprint(f.args[1]);
			this.circuit = null;
			return f.dot;
		}
	} else if (this.state === 2) {
		if (rt.istype(f.args[0], T("/obj/item/weapon/screwdriver")) && this.circuit) {
			playsound(this.loc, f.args[0].usesound, 50, 1);
			to_chat(f.args[1], "<span class='notice'>You unfasten the circuit board.</span>");
			this.state = 1;
			this.icon_state = "1";
			return f.dot;
		}
		if (rt.istype(f.args[0], T("/obj/item/stack/cable_coil"))) {
			if ((C = f.args[0]).get_amount() >= 5) {
				playsound(this.loc, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
				to_chat(f.args[1], "<span class='notice'>You start adding cables to the frame...</span>");
				if (yield* do_after(f.args[1], 20 * f.args[0].toolspeed, { target: this })) {
					if (C.get_amount() >= 5 && this.state == 2) {
						yield* C.use(5);
						to_chat(f.args[1], "<span class='notice'>You add cables to the frame.</span>");
						this.state = 3;
						this.icon_state = "3";
					}
				}
			} else {
				to_chat(f.args[1], "<span class='warning'>You need five lengths of cable to wire the frame!</span>");
			}
			return f.dot;
		}
	} else if (this.state === 3) {
		if (rt.istype(f.args[0], T("/obj/item/weapon/wirecutters"))) {
			playsound(this.loc, f.args[0].usesound, 50, 1);
			to_chat(f.args[1], "<span class='notice'>You remove the cables.</span>");
			this.state = 2;
			this.icon_state = "2";
			(A = (yield* new_(T("/obj/item/stack/cable_coil"), this.loc))).amount = 5;
			yield* A.add_fingerprint(f.args[1]);
			return f.dot;
		}
		if (rt.istype(f.args[0], T("/obj/item/stack/sheet/glass"))) {
			if ((G = f.args[0]).get_amount() < 2) {
				to_chat(f.args[1], "<span class='warning'>You need two glass sheets to continue construction!</span>");
				return f.dot;
			} else {
				playsound(this.loc, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
				to_chat(f.args[1], "<span class='notice'>You start to put in the glass panel...</span>");
				if (yield* do_after(f.args[1], 20, { target: this })) {
					if (G.get_amount() >= 2 && this.state == 3) {
						yield* G.use(2);
						to_chat(f.args[1], "<span class='notice'>You put in the glass panel.</span>");
						this.state = 4;
						this.icon_state = "4";
					}
				}
			}
			return f.dot;
		}
	} else if (this.state === 4) {
		if (rt.istype(f.args[0], T("/obj/item/weapon/crowbar"))) {
			playsound(this.loc, f.args[0].usesound, 50, 1);
			to_chat(f.args[1], "<span class='notice'>You remove the glass panel.</span>");
			this.state = 3;
			this.icon_state = "3";
			yield* (G = (yield* new_(T("/obj/item/stack/sheet/glass"), this.loc, 2))).add_fingerprint(f.args[1]);
			return f.dot;
		}
		if (rt.istype(f.args[0], T("/obj/item/weapon/screwdriver"))) {
			playsound(this.loc, f.args[0].usesound, 50, 1);
			to_chat(f.args[1], "<span class='notice'>You connect the monitor.</span>");
			this.transfer_fingerprints_to((B = (yield* new_(this.circuit.build_path, this.loc, this.circuit))));
			yield* qdel(this);
			return f.dot;
		}
	}
	if (f.args[1].a_intent != "harm") return f.dot;
	return (yield* parent_proc());
}, true, { args: ["P", "user", "params"] });

// buildandrepair.dm:139
rt.def("/obj/structure/frame/computer/proc/deconstruct", function* deconstruct(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 1;
	}
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		if (this.state == 4) {
			yield* new_(T("/obj/item/weapon/shard"), this.loc);
			yield* new_(T("/obj/item/weapon/shard"), this.loc);
		}
		if (this.state >= 3) {
			yield* new_(T("/obj/item/stack/cable_coil"), this.loc, 5);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["disassembled"] });

rt.type(6712, "/obj/item/weapon/circuitboard", "/obj/item/weapon", {
	build_path: null,
	name: "circuit board",
	icon: rt.rsc("icons/obj/module.dmi"),
	icon_state: "id_mod",
	item_state: "electronic",
	origin_tech: "programming=2",
	materials: null,
	w_class: 2,
});

// buildandrepair.dm:154
rt.def("/obj/item/weapon/circuitboard/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$glass", 1000]);
	return f.dot;
});

rt.type(6806, "/obj/item/weapon/circuitboard/computer/card/minor", "/obj/item/weapon/circuitboard/computer/card", {
	target_dept: 1,
	dept_list: null,
	name: "Department Management Console (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/card/minor"),
});

// buildandrepair.dm:223
rt.def("/obj/item/weapon/circuitboard/computer/card/minor/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/weapon/screwdriver"))) {
		this.target_dept = this.target_dept == rt.len(f, this.dept_list) ? 1 : this.target_dept + 1;
		to_chat(user, `<span class='notice'>You set the board to "${rt.index(this.dept_list, this.target_dept)}".</span>`);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// buildandrepair.dm:230
rt.def("/obj/item/weapon/circuitboard/computer/card/minor/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, `Currently set to "${rt.index(this.dept_list, this.target_dept)}".`);
	return f.dot;
}, false);

rt.type(6827, "/obj/item/weapon/circuitboard/computer/rdconsole", "/obj/item/weapon/circuitboard/computer", {
	name: "R&D Console (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/rdconsole/core"),
});

// buildandrepair.dm:311
rt.def("/obj/item/weapon/circuitboard/computer/rdconsole/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/weapon/screwdriver"))) {
		if (this.build_path == T("/obj/machinery/computer/rdconsole/core")) {
			this.name = "R&D Console - Robotics (Computer Board)";
			this.build_path = T("/obj/machinery/computer/rdconsole/robotics");
			to_chat(user, "<span class='notice'>Access protocols successfully updated.</span>");
		} else {
			this.name = "R&D Console (Computer Board)";
			this.build_path = T("/obj/machinery/computer/rdconsole/core");
			to_chat(user, "<span class='notice'>Defaulting access protocols.</span>");
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(6832, "/obj/item/weapon/circuitboard/computer/cargo", "/obj/item/weapon/circuitboard/computer", {
	contraband: 0,
	emagged: 0,
	name: "Supply Console (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/cargo"),
	origin_tech: "programming=3",
});

// buildandrepair.dm:346
rt.def("/obj/item/weapon/circuitboard/computer/cargo/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/device/multitool"))) {
		if (!this.emagged) {
			this.contraband = (!this.contraband ? 1 : 0);
			to_chat(user, `<span class='notice'>Receiver spectrum set to ${this.contraband ? "Broad" : "Standard"}.</span>`);
		} else {
			to_chat(user, "<span class='notice'>The spectrum chip is unresponsive.</span>");
		}
	} else if (rt.istype(I, T("/obj/item/weapon/card/emag"))) {
		if (!this.emagged) {
			this.contraband = 1;
			this.emagged = 1;
			to_chat(user, `<span class='notice'>You adjust ${this}'s routing and receiver spectrum, unlocking special supplies and contraband.</span>`);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(6839, "/obj/item/weapon/circuitboard/computer/shuttle", "/obj/item/weapon/circuitboard/computer", {
	shuttleId: null,
	possible_destinations: "",
	name: "Shuttle (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/shuttle"),
});

// buildandrepair.dm:392
rt.def("/obj/item/weapon/circuitboard/computer/shuttle/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let chosen_id: Value = null;
	if (rt.istype(I, T("/obj/item/device/multitool"))) {
		if ((chosen_id = round((yield* g.op(f, "Prompt", [33], [null, "Input an Integer", "Choose an ID number (-1 for reset):", f.usr, null])))) >= 0) {
			this.shuttleId = chosen_id;
		} else {
			this.shuttleId = rt.initial(f, this, "shuttleId");
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(6851, "/obj/item/weapon/circuitboard/computer/libraryconsole", "/obj/item/weapon/circuitboard/computer", {
	name: "Library Visitor Console (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/libraryconsole"),
	origin_tech: "programming=1",
});

// buildandrepair.dm:444
rt.def("/obj/item/weapon/circuitboard/computer/libraryconsole/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/weapon/screwdriver"))) {
		if (this.build_path == T("/obj/machinery/computer/libraryconsole/bookmanagement")) {
			this.name = "Library Visitor Console (Computer Board)";
			this.build_path = T("/obj/machinery/computer/libraryconsole");
			to_chat(user, "<span class='notice'>Defaulting access protocols.</span>");
		} else {
			this.name = "Book Inventory Management Console (Computer Board)";
			this.build_path = T("/obj/machinery/computer/libraryconsole/bookmanagement");
			to_chat(user, "<span class='notice'>Access protocols successfully updated.</span>");
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);
