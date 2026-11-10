// Based on /tg/station's code/game/machinery/camera/camera_assembly.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(9544, "/obj/item/wallframe/camera", "/obj/item/wallframe", {
	name: "camera assembly",
	desc: "The basic construction for Nanotrasen-Always-Watching-You cameras.",
	icon: rt.rsc("icons/obj/monitors.dmi"),
	icon_state: "cameracase",
	materials: null,
	result_path: rt.typePath("/obj/structure/camera_assembly"),
});

// camera_assembly.dm:6
rt.def("/obj/item/wallframe/camera/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 400, "$glass", 250]);
	return f.dot;
});

rt.type(12553, "/obj/structure/camera_assembly", "/obj/structure", {
	upgrades: null,
	state: 1,
	name: "camera assembly",
	desc: "The basic construction for Nanotrasen-Always-Watching-You cameras.",
	icon: rt.rsc("icons/obj/monitors.dmi"),
	icon_state: "camera1",
	obj_integrity: 150,
	max_integrity: 150,
}, { global: { possible_upgrades: 798 } });

// camera_assembly.dm:30
rt.def("/obj/structure/camera_assembly/proc/Initialize", function Initialize(f: Frame, mapload: Value, ndir: Value, building: Value) {
	f.dot = parent_proc();
	if (building) {
		this.setDir(ndir);
	}
	this.upgrades = list();
	return f.dot;
}, false);

// camera_assembly.dm:36
rt.def("/obj/structure/camera_assembly/proc/Destroy", function* Destroy(f: Frame) {
	let I: Value = null;
	if (this.upgrades) {
		for (I of each(this.upgrades)) {
			yield* qdel(I);
		}
		this.upgrades.Cut();
	}
	return (yield* parent_proc());
}, true);

// camera_assembly.dm:40
rt.def("/obj/structure/camera_assembly/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let C: Value = null, input: Value = null, tempnetwork: Value = null, C_2: Value = null, A: Value = null, U: Value = null;
	if (this.state === 1) {
		if (rt.istype(W, T("/obj/item/weapon/weldingtool"))) {
			if (yield* this.weld(W, user)) {
				to_chat(user, "<span class='notice'>You weld the assembly securely into place.</span>");
				this.anchored = 1;
				this.state = 2;
			}
			return f.dot;
		} else if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
			playsound(this.loc, W.usesound, 50, 1);
			to_chat(user, "<span class='notice'>You unattach the assembly from its place.</span>");
			yield* new_(T("/obj/item/wallframe/camera"), rt.getStep(f, this, 0));
			yield* qdel(this);
			return f.dot;
		}
	} else if (this.state === 2) {
		if (rt.istype(W, T("/obj/item/stack/cable_coil"))) {
			if (yield* (C = W).use(2)) {
				to_chat(user, "<span class='notice'>You add wires to the assembly.</span>");
				this.state = 3;
			} else {
				to_chat(user, "<span class='warning'>You need two lengths of cable to wire a camera!</span>");
				return f.dot;
			}
			return f.dot;
		} else if (rt.istype(W, T("/obj/item/weapon/weldingtool"))) {
			if (yield* this.weld(W, user)) {
				to_chat(user, "<span class='notice'>You unweld the assembly from its place.</span>");
				this.state = 1;
				this.anchored = 1;
			}
			return f.dot;
		}
	} else if (this.state === 3) {
		if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
			playsound(this.loc, W.usesound, 50, 1);
			if (!(input = (yield* stripped_input(user, "Which networks would you like to connect this camera to? Seperate networks with a comma. No Spaces!\nFor example: SS13,Security,Secret ", "Set Network", "SS13")))) {
				to_chat(user, "<span class='warning'>No input found, please hang up and try your call again!</span>");
				return f.dot;
			}
			if (rt.len(f, (tempnetwork = splittext(input, ","))) < 1) {
				to_chat(user, "<span class='warning'>No network found, please hang up and try your call again!</span>");
				return f.dot;
			}
			this.state = 4;
			C_2 = (yield* new_(T("/obj/machinery/camera"), this.loc));
			this.loc = C_2;
			C_2.assembly = this;
			yield* C_2.setDir(this.dir);
			C_2.network = tempnetwork;
			A = get_area(this);
			C_2.c_tag = `${A.name} (${rand(1, 999)})`;
		} else if (rt.istype(W, T("/obj/item/weapon/wirecutters"))) {
			yield* new_(T("/obj/item/stack/cable_coil"), rt.getStep(f, this, 0), 2);
			playsound(this.loc, W.usesound, 50, 1);
			to_chat(user, "<span class='notice'>You cut the wires from the circuits.</span>");
			this.state = 2;
			return f.dot;
		}
	}
	if (is_type_in_typecache(W, GLOB.possible_upgrades) && !is_type_in_list(W, this.upgrades)) {
		if (!(yield* user.drop_item(W))) {
			return f.dot;
		}
		to_chat(user, fmt("<span class='notice'>You attach ％！ into the assembly inner circuits.</span>", [W]));
		this.upgrades += W;
		yield* W.forceMove(this);
		return f.dot;
	} else if (rt.istype(W, T("/obj/item/weapon/crowbar")) && rt.len(f, this.upgrades)) {
		if (U = rt.locateIn(f, T("/obj"), this.upgrades)) {
			to_chat(user, "<span class='notice'>You unattach an upgrade from the assembly.</span>");
			playsound(this.loc, W.usesound, 50, 1);
			U.loc = rt.getStep(f, this, 0);
			this.upgrades -= U;
		}
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// camera_assembly.dm:133
rt.def("/obj/structure/camera_assembly/proc/weld", function* weld(f: Frame, WT: Value, user: Value) {
	if (!(yield* WT.remove_fuel(0, user))) {
		return 0;
	}
	to_chat(user, fmt("<span class='notice'>You start to weld ％！...</span>", [this]));
	playsound(this.loc, WT.usesound, 50, 1);
	if (yield* do_after(user, 20 * WT.toolspeed, { target: this })) {
		if (WT.isOn()) {
			playsound(this.loc, rt.rsc("sound/items/welder2.ogg"), 50, 1);
			return 1;
		}
	}
	return 0;
}, true);

// camera_assembly.dm:144
rt.def("/obj/structure/camera_assembly/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		yield* new_(T("/obj/item/stack/sheet/metal"), this.loc);
	}
	yield* qdel(this);
	return f.dot;
}, true);
