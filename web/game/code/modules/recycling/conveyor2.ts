// Based on /tg/station's code/modules/recycling/conveyor2.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(10919, "/obj/machinery/conveyor/auto", "/obj/machinery/conveyor", {});

// conveyor2.dm:28
rt.def("/obj/machinery/conveyor/auto/proc/Initialize", function* Initialize(f: Frame, mapload: Value, newdir: Value) {
	f.dot = (yield* parent_proc());
	this.operating = 1;
	this.update_move_direction();
	return f.dot;
}, true);

// conveyor2.dm:33
rt.def("/obj/machinery/conveyor/auto/proc/update", function update(f: Frame) {
	if (rt.bitAnd(this.stat, 1)) {
		this.icon_state = "conveyor-broken";
		this.operating = 0;
		return f.dot;
	} else if (!this.operable) {
		this.operating = 0;
	} else if (rt.bitAnd(this.stat, 2)) {
		this.operating = 0;
	} else {
		this.operating = 1;
	}
	this.icon_state = `conveyor${this.operating * this.verted}`;
	return f.dot;
});

rt.type(10916, "/obj/machinery/conveyor", "/obj/machinery", {
	operating: 0,
	operable: 1,
	forwards: null,
	backwards: null,
	movedir: null,
	affecting: null,
	id: "",
	verted: 1,
	anchored: 1,
	speed_process: 1,
	icon: rt.rsc("icons/obj/recycling.dmi"),
	icon_state: "conveyor0",
	name: "conveyor belt",
	desc: "A conveyor belt.",
});

// conveyor2.dm:47
rt.def("/obj/machinery/conveyor/proc/Initialize", function* Initialize(f: Frame, mapload: Value, newdir: Value) {
	f.dot = (yield* parent_proc());
	if (newdir) {
		yield* this.setDir(newdir);
	}
	this.update_move_direction();
	return f.dot;
}, true);

// conveyor2.dm:53
rt.def("/obj/machinery/conveyor/proc/update_move_direction", function update_move_direction(f: Frame) {
	let temp: Value = null;
	if (this.dir === 1) {
		this.forwards = 1;
		this.backwards = 2;
	} else if (this.dir === 2) {
		this.forwards = 2;
		this.backwards = 1;
	} else if (this.dir === 4) {
		this.forwards = 4;
		this.backwards = 8;
	} else if (this.dir === 8) {
		this.forwards = 8;
		this.backwards = 4;
	} else if (this.dir === 5) {
		this.forwards = 4;
		this.backwards = 2;
	} else if (this.dir === 9) {
		this.forwards = 1;
		this.backwards = 4;
	} else if (this.dir === 6) {
		this.forwards = 2;
		this.backwards = 8;
	} else if (this.dir === 10) {
		this.forwards = 8;
		this.backwards = 1;
	}
	if (this.verted == -1) {
		temp = this.forwards;
		this.forwards = this.backwards;
		this.backwards = temp;
	}
	if (this.operating == 1) {
		this.movedir = this.forwards;
	} else {
		this.movedir = this.backwards;
	}
	this.update();
	return f.dot;
});

// conveyor2.dm:89
rt.def("/obj/machinery/conveyor/proc/update", function update(f: Frame) {
	if (rt.bitAnd(this.stat, 1)) {
		this.icon_state = "conveyor-broken";
		this.operating = 0;
		return f.dot;
	}
	// `operating` is what the switch set (1, -1 or 0). No power or a broken neighbour only stops the belt for now: tg set
	// operating to 0, so belts stayed stopped after a power cut until someone flipped their switch.
	let running: Value = this.operating;
	if (!this.operable || rt.bitAnd(this.stat, 2)) {
		running = 0;
	}
	this.icon_state = `conveyor${running * this.verted}`;
	return f.dot;
});

// conveyor2.dm:102
rt.def("/obj/machinery/conveyor/proc/process", function* process(f: Frame) {
	if (rt.bitAnd(this.stat, 3) || !this.operable) {
		return f.dot;
	}
	if (!this.operating) {
		return f.dot;
	}
	yield* this.use_power(100);
	this.affecting = this.loc.contents - this;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/conveyor/proc/convey"), this.affecting)), 1);
	return f.dot;
}, true, { waitfor: false });

// conveyor2.dm:111
rt.def("/obj/machinery/conveyor/proc/convey", function convey(f: Frame, affecting: Value) {
	let A: Value = null;
	for (A of each(affecting, T("/atom/movable"))) {
		if (A.loc == this.loc && A.has_gravity()) {
			A.ConveyorMove(this.movedir);
		}
	}
	return f.dot;
}, false, { argTypes: [{ path: "/list" }] });

// conveyor2.dm:117
rt.def("/obj/machinery/conveyor/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let C: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/crowbar"))) {
		user.visible_message(fmt("<span class='notice'>＀ struggles to pry up ％！ with ％！.</span>", [user, this, I]), fmt("<span class='notice'>You struggle to pry up ％！ with ％！.</span>", [this, I]));
		if (yield* do_after(user, 40 * I.toolspeed, { target: this })) {
			if (!this || this.gc_destroyed) {
				return f.dot;
			}
			if (!rt.bitAnd(this.stat, 1)) {
				(C = (yield* new_(T("/obj/item/conveyor_construct"), this.loc))).id = this.id;
				this.transfer_fingerprints_to(C);
			}
			to_chat(user, "<span class='notice'>You remove the conveyor belt.</span>");
			yield* qdel(this);
		}
	} else if (rt.istype(I, T("/obj/item/weapon/wrench"))) {
		if (!rt.bitAnd(this.stat, 1)) {
			playsound(this.loc, I.usesound, 50, 1);
			yield* this.setDir(turn(this.dir, -45));
			this.update_move_direction();
			to_chat(user, `<span class='notice'>You rotate ${this}.</span>`);
		}
	} else if (rt.istype(I, T("/obj/item/weapon/screwdriver"))) {
		if (!rt.bitAnd(this.stat, 1)) {
			this.verted = this.verted * -1;
			this.update_move_direction();
			to_chat(user, `<span class='notice'>You reverse ${this}'s direction.</span>`);
		}
	} else if (user.a_intent != "harm") {
		if (yield* user.drop_item()) {
			I.loc = this.loc;
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// conveyor2.dm:151
rt.def("/obj/machinery/conveyor/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* user.Move_Pulled(this);
	return f.dot;
}, true);

// conveyor2.dm:157
rt.def("/obj/machinery/conveyor/proc/broken", function broken(f: Frame) {
	let C: Value = null;
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	this.update();
	if (C = rt.locateIn(f, T("/obj/machinery/conveyor"), rt.getStep(f, this, this.dir))) {
		C.set_operable(this.dir, this.id, 0);
	}
	if (!(C = rt.locateIn(f, T("/obj/machinery/conveyor"), rt.getStep(f, this, turn(this.dir, 180))))) return f.dot;
	C.set_operable(turn(this.dir, 180), this.id, 0);
	return f.dot;
});

// conveyor2.dm:173
rt.def("/obj/machinery/conveyor/proc/set_operable", function set_operable(f: Frame, stepdir: Value, match_id: Value, op: Value) {
	let C: Value = null;
	if (this.id != match_id) {
		return f.dot;
	}
	this.operable = op;
	this.update();
	if (!(C = rt.locateIn(f, T("/obj/machinery/conveyor"), rt.getStep(f, this, stepdir)))) return f.dot;
	C.set_operable(stepdir, this.id, op);
	return f.dot;
});

// conveyor2.dm:189
rt.def("/obj/machinery/conveyor/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	this.update();
	return f.dot;
});

rt.type(10982, "/obj/machinery/conveyor_switch", "/obj/machinery", {
	position: 0,
	last_pos: -1,
	operated: 1,
	convdir: 0,
	id: "",
	conveyors: null,
	anchored: 1,
	speed_process: 1,
	name: "conveyor switch",
	desc: "A conveyor control switch.",
	icon: rt.rsc("icons/obj/recycling.dmi"),
	icon_state: "switch-off",
});

// conveyor2.dm:216
rt.def("/obj/machinery/conveyor_switch/proc/Initialize", function* Initialize(f: Frame, mapload: Value, newid: Value) {
	yield* parent_proc();
	if (!this.id) {
		this.id = newid;
	}
	yield* this.update();
	return INITIALIZE_HINT_LATELOAD;
}, true);

// conveyor2.dm:224
rt.def("/obj/machinery/conveyor_switch/proc/LateInitialize", function LateInitialize(f: Frame) {
	let C: Value = null;
	this.conveyors = list();
	for (C of each(GLOB.machines, T("/obj/machinery/conveyor"))) {
		if (C.id == this.id) {
			this.conveyors += C;
		}
	}
	return f.dot;
});

// conveyor2.dm:232
rt.def("/obj/machinery/conveyor_switch/proc/update", function update(f: Frame) {
	if (this.position < 0) {
		this.icon_state = "switch-rev";
	} else if (this.position > 0) {
		this.icon_state = "switch-fwd";
	} else {
		this.icon_state = "switch-off";
	}
	return f.dot;
});

// conveyor2.dm:244
rt.def("/obj/machinery/conveyor_switch/proc/process", function* process(f: Frame) {
	let C: Value = null;
	if (!this.operated) {
		return f.dot;
	}
	this.operated = 0;
	for (C of each(this.conveyors, T("/obj/machinery/conveyor"))) {
		C.operating = this.position;
		C.update_move_direction();
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	return f.dot;
}, true, { waitfor: false });

// conveyor2.dm:255
rt.def("/obj/machinery/conveyor_switch/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let S: Value = null;
	yield* this.add_fingerprint(user);
	if (this.position == 0) {
		if (this.convdir) {
			this.position = this.convdir;
		} else if (this.last_pos < 0) {
			this.position = 1;
			this.last_pos = 0;
		} else {
			this.position = -1;
			this.last_pos = 0;
		}
	} else {
		this.last_pos = this.position;
		this.position = 0;
	}
	this.operated = 1;
	yield* this.update();
	for (S of each(GLOB.machines, T("/obj/machinery/conveyor_switch"))) {
		if (S.id == this.id) {
			S.position = this.position;
			yield* S.update();
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	return f.dot;
}, true);

// conveyor2.dm:281
rt.def("/obj/machinery/conveyor_switch/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let C: Value = null;
	if (!rt.istype(I, T("/obj/item/weapon/crowbar"))) return f.dot;
	(C = (yield* new_(T("/obj/item/conveyor_switch_construct"), this.loc))).id = this.id;
	this.transfer_fingerprints_to(C);
	to_chat(user, "<span class='notice'>You deattach the conveyor switch.</span>");
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(10135, "/obj/item/conveyor_construct", "/obj/item", {
	id: "",
	w_class: 4,
	icon: rt.rsc("icons/obj/recycling.dmi"),
	icon_state: "conveyor0",
	name: "conveyor belt assembly",
	desc: "A conveyor belt assembly.",
});

// conveyor2.dm:305
rt.def("/obj/item/conveyor_construct/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let C: Value = null;
	yield* parent_proc();
	if (!rt.istype(I, T("/obj/item/conveyor_switch_construct"))) return f.dot;
	to_chat(user, "<span class='notice'>You link the switch to the conveyor belt assembly.</span>");
	this.id = (C = I).id;
	return f.dot;
}, true);

// conveyor2.dm:312
rt.def("/obj/item/conveyor_construct/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	let C: Value = null;
	if (!proximity || user.stat || !rt.istype(A, T("/turf/open/floor")) || rt.istype(A, T("/area/shuttle"))) {
		return f.dot;
	}
	let cdir: Value = rt.getDir(f, A, user);
	if (A == user.loc) {
		to_chat(user, "<span class='notice'>You cannot place a conveyor belt under yourself.</span>");
		return f.dot;
	}
	(C = (yield* new_(T("/obj/machinery/conveyor"), A, cdir))).id = this.id;
	this.transfer_fingerprints_to(C);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(10136, "/obj/item/conveyor_switch_construct", "/obj/item", {
	id: "",
	w_class: 4,
	name: "conveyor switch assembly",
	desc: "A conveyor control switch assembly.",
	icon: rt.rsc("icons/obj/recycling.dmi"),
	icon_state: "switch-off",
});

// conveyor2.dm:332
rt.def("/obj/item/conveyor_switch_construct/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.id = rand();
	return f.dot;
}, true);

// conveyor2.dm:336
rt.def("/obj/item/conveyor_switch_construct/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	let C: Value = null, NC: Value = null;
	if (!proximity || user.stat || !rt.istype(A, T("/turf/open/floor")) || rt.istype(A, T("/area/shuttle"))) {
		return f.dot;
	}
	let found: Value = 0;
	for (C of each(view(), T("/obj/machinery/conveyor"))) {
		if (C.id == this.id) {
			found = 1;
			break;
		}
	}
	if (!found) {
		to_chat(user, `${bicon(this)}<span class=notice>The conveyor switch did not detect any linked conveyor belts in range.</span>`);
		return f.dot;
	}
	this.transfer_fingerprints_to((NC = (yield* new_(T("/obj/machinery/conveyor_switch"), A, this.id))));
	yield* qdel(this);
	return f.dot;
}, true);
