// Based on /tg/station's code/game/machinery/pipe/construction.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(9554, "/obj/item/pipe", "/obj/item", {
	pipe_type: 0,
	pipename: null,
	flipped: 0,
	is_bent: 0,
	level: 2,
	name: "pipe",
	desc: "A pipe",
	force: 7,
	throwforce: 7,
	icon: rt.rsc("icons/obj/atmospherics/pipes/pipe_item.dmi"),
	icon_state: "simple",
	item_state: "buildpipe",
	w_class: 3,
}, { global: { pipe_types: 1052 } });

// construction.dm:51
rt.def("/obj/item/pipe/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, "<span class='notice'>Alt-click to rotate it clockwise.</span>");
	return f.dot;
}, false);

// construction.dm:55
rt.def("/obj/item/pipe/proc/New", function* New(f: Frame, loc: Value, pipe_type: Value, dir: Value, make_from: Value) {
	let _P: Value = null, triP: Value = null;
	yield* parent_proc();
	if (make_from) {
		yield* this.setDir(make_from.dir);
		this.pipename = make_from.name;
		this.add_atom_colour(make_from.color, FIXED_COLOUR_PRIORITY);
		if (rt.isIn(f, make_from.type, GLOB.pipe_types)) {
			this.pipe_type = make_from.type;
		} else {
			for (_P of each(GLOB.pipe_types)) {
				if (rt.op(f, "IsType", [], [make_from, _P])) {
					this.pipe_type = _P;
					break;
				}
			}
		}
		if (rt.istype((triP = make_from), T("/obj/machinery/atmospherics/components/trinary")) && triP.flipped) {
			this.flipped = 1;
			yield* this.setDir(turn(this.dir, -45));
		}
	} else {
		this.pipe_type = pipe_type;
		yield* this.setDir(dir);
	}
	if (rt.isIn(f, this.dir, GLOB.diagonals)) {
		this.is_bent = 1;
	}
	yield* this.update();
	this.pixel_x = rand(-5, 5);
	this.pixel_y = rand(-5, 5);
	return f.dot;
}, true);

// construction.dm:85
rt.def("/datum/controller/global_vars/proc/InitGlobalpipeID2State", function InitGlobalpipeID2State(f: Frame) {
	GLOB.pipeID2State = rt.alist(f, [`${T("/obj/machinery/atmospherics/pipe/simple")}`, "simple", `${T("/obj/machinery/atmospherics/pipe/manifold")}`, "manifold", `${T("/obj/machinery/atmospherics/pipe/manifold4w")}`, "manifold4w", `${T("/obj/machinery/atmospherics/pipe/heat_exchanging/simple")}`, "he", `${T("/obj/machinery/atmospherics/pipe/heat_exchanging/manifold")}`, "he_manifold", `${T("/obj/machinery/atmospherics/pipe/heat_exchanging/manifold4w")}`, "he_manifold4w", `${T("/obj/machinery/atmospherics/pipe/heat_exchanging/junction")}`, "junction", `${T("/obj/machinery/atmospherics/components/unary/portables_connector")}`, "connector", `${T("/obj/machinery/atmospherics/components/unary/vent_pump")}`, "uvent", `${T("/obj/machinery/atmospherics/components/unary/vent_scrubber")}`, "scrubber", `${T("/obj/machinery/atmospherics/components/unary/outlet_injector")}`, "injector", `${T("/obj/machinery/atmospherics/components/unary/heat_exchanger")}`, "heunary", `${T("/obj/machinery/atmospherics/components/binary/pump")}`, "pump", `${T("/obj/machinery/atmospherics/components/binary/passive_gate")}`, "passivegate", `${T("/obj/machinery/atmospherics/components/binary/volume_pump")}`, "volumepump", `${T("/obj/machinery/atmospherics/components/binary/valve")}`, "mvalve", `${T("/obj/machinery/atmospherics/components/binary/valve/digital")}`, "dvalve", `${T("/obj/machinery/atmospherics/components/trinary/filter")}`, "filter", `${T("/obj/machinery/atmospherics/components/trinary/mixer")}`, "mixer"]);
	this.gvars_datum_init_order += "pipeID2State";
	return f.dot;
});

// construction.dm:111
rt.def("/obj/item/pipe/proc/update", function update(f: Frame) {
	let nlist: Value = null;
	let $0: any = (nlist = rt.alist(f, [`${T("/obj/machinery/atmospherics/pipe/simple")}`, "pipe", `${T("/obj/machinery/atmospherics/pipe/simple")}_b`, "bent pipe", `${T("/obj/machinery/atmospherics/pipe/manifold")}`, "manifold", `${T("/obj/machinery/atmospherics/pipe/manifold4w")}`, "4-way manifold", `${T("/obj/machinery/atmospherics/pipe/heat_exchanging/simple")}`, "h/e pipe", `${T("/obj/machinery/atmospherics/pipe/heat_exchanging/simple")}_b`, "bent h/e pipe", `${T("/obj/machinery/atmospherics/pipe/heat_exchanging/manifold")}`, "h/e manifold", `${T("/obj/machinery/atmospherics/pipe/heat_exchanging/manifold4w")}`, "h/e 4-way manifold", `${T("/obj/machinery/atmospherics/pipe/heat_exchanging/junction")}`, "junction", `${T("/obj/machinery/atmospherics/components/unary/portables_connector")}`, "connector", `${T("/obj/machinery/atmospherics/components/unary/vent_pump")}`, "vent", `${T("/obj/machinery/atmospherics/components/unary/vent_scrubber")}`, "scrubber", `${T("/obj/machinery/atmospherics/components/unary/outlet_injector")}`, "injector", `${T("/obj/machinery/atmospherics/components/unary/heat_exchanger")}`, "heat exchanger", `${T("/obj/machinery/atmospherics/components/binary/pump")}`, "pump", `${T("/obj/machinery/atmospherics/components/binary/passive_gate")}`, "passive gate", `${T("/obj/machinery/atmospherics/components/binary/volume_pump")}`, "volume pump", `${T("/obj/machinery/atmospherics/components/binary/valve")}`, "manual valve", `${T("/obj/machinery/atmospherics/components/binary/valve/digital")}`, "digital valve", `${T("/obj/machinery/atmospherics/components/trinary/filter")}`, "gas filter", `${T("/obj/machinery/atmospherics/components/trinary/mixer")}`, "gas mixer"]));
	let $1: any = this.pipe_type;
	this.name = rt.index($0, `${$1}${this.is_bent ? "_b" : ""}`) + " fitting";
	this.icon_state = rt.index(GLOB.pipeID2State, `${this.pipe_type}`);
	return f.dot;
});

// construction.dm:148
rt.def("/obj/item/pipe/verb/rotate", function rotate(f: Frame) {
	if (f.usr.stat || f.usr.restrained() || !f.usr.canmove) {
		return f.dot;
	}
	this.setDir(turn(this.dir, -90));
	this.fixdir();
	return f.dot;
}, false, { verb: { name: "Rotate Pipe", category: "Object", src: 1, range: 1 } });

// construction.dm:162
rt.def("/obj/item/pipe/verb/flip", function flip(f: Frame) {
	if (f.usr.stat || f.usr.restrained() || !f.usr.canmove) {
		return f.dot;
	}
	if (rt.isIn(f, this.pipe_type, list(T("/obj/machinery/atmospherics/components/trinary/filter"), T("/obj/machinery/atmospherics/components/trinary/mixer")))) {
		this.setDir(turn(this.dir, this.flipped) ? 45 : -45);
		this.flipped = (!this.flipped ? 1 : 0);
		return f.dot;
	}
	this.setDir(turn(this.dir, -180));
	this.fixdir();
	return f.dot;
}, false, { verb: { name: "Flip Pipe", category: "Object", src: 1, range: 1 } });

// construction.dm:177
rt.def("/obj/item/pipe/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	yield* parent_proc();
	if (user.incapacitated()) {
		to_chat(user, "<span class='warning'>You can't do that right now!</span>");
		return f.dot;
	}
	if (!(get_dist(this, user) <= 1)) {
		return f.dot;
	} else {
		yield* this.rotate();
	}
	return f.dot;
}, true);

// construction.dm:187
rt.def("/obj/item/pipe/proc/Move", function* Move(f: Frame) {
	let old_dir: Value = this.dir;
	yield* parent_proc();
	yield* this.setDir(old_dir);
	return f.dot;
}, true);

// construction.dm:192
rt.def("/obj/item/pipe/proc/unflip", function unflip(f: Frame, direction: Value) {
	if (rt.isIn(f, direction, GLOB.diagonals)) {
		return turn(direction, 45);
	}
	return direction;
});

// construction.dm:199
rt.def("/obj/item/pipe/proc/fixdir", function fixdir(f: Frame) {
	if (!(rt.isIn(f, this.pipe_type, list(T("/obj/machinery/atmospherics/pipe/simple"), T("/obj/machinery/atmospherics/pipe/heat_exchanging/simple"), T("/obj/machinery/atmospherics/components/binary/valve"), T("/obj/machinery/atmospherics/components/binary/valve/digital"))) && !this.is_bent)) return f.dot;
	if (this.dir == 2) {
		this.setDir(1);
	} else {
		if (this.dir != 8) return f.dot;
		this.setDir(4);
	}
	return f.dot;
});

// construction.dm:206
rt.def("/obj/item/pipe/proc/attack_self", function attack_self(f: Frame, user: Value) {
	return this.rotate();
});

// construction.dm:209
rt.def("/obj/item/pipe/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let A: Value = null, M: Value = null, _T: Value = null;
	if (!rt.istype(W, T("/obj/item/weapon/wrench"))) {
		return (yield* parent_proc());
	}
	if (!isturf(this.loc)) {
		return 1;
	}
	if (!rt.isIn(f, this.pipe_type, GLOB.pipe_types)) return 1; this.fixdir(); // tg's own hole: a fitting of any type (from a forged dispenser href) created that type
	if (rt.isIn(f, this.pipe_type, list(T("/obj/machinery/atmospherics/components/trinary/mixer"), T("/obj/machinery/atmospherics/components/trinary/filter")))) {
		yield* this.setDir(this.unflip(this.dir));
	}
	yield* (A = (yield* new_(this.pipe_type, this.loc))).setDir(this.dir);
	A.SetInitDirections();
	for (M of each(this.loc, T("/obj/machinery/atmospherics"))) {
		if (M == A) {
			continue;
		}
		if (rt.bitAnd(M.GetInitDirections(), A.GetInitDirections())) {
			to_chat(user, "<span class='warning'>There is already a pipe at that location!</span>");
			yield* qdel(A);
			return 1;
		}
	}
	if (this.pipename) {
		A.name = this.pipename;
	}
	if (rt.istype((_T = A), T("/obj/machinery/atmospherics/components/trinary"))) {
		_T.flipped = this.flipped;
	}
	yield* A.on_construction(this.pipe_type, this.color);
	playsound(this.loc, W.usesound, 50, 1);
	user.visible_message(fmt("＀ fastens ％！.", [user, this]), fmt("<span class='notice'>You fasten ％！.</span>", [this]), "<span class='italics'>You hear ratchet.</span>");
	yield* qdel(this);
	return f.dot;
}, true);

// construction.dm:248
rt.def("/obj/item/pipe/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	let C: Value = null, i: Value = null;
	let $e: any;
	if (rt.isIn(f, this.pipe_type, list(T("/obj/machinery/atmospherics/components/binary/pump"), T("/obj/machinery/atmospherics/components/binary/passive_gate"), T("/obj/machinery/atmospherics/components/binary/volume_pump")))) {
		user.visible_message(`<span class='suicide'>${user} shoves the ${this} in ${user.p_their()} mouth and turns it on!  It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
		if (rt.istype(user, T("/mob/living/carbon"))) {
			C = user;
			rt.forRange(f, 0, 1, 20, 1);
			while (($e = rt.next(f, 0)) !== undefined) {
				i = $e;
				yield* C.vomit(0, 1, 0, 4, 0);
				if (prob(20)) {
					yield* C.spew_organ();
				}
				yield* sleep(5);
			}
			rt.endFor(f, 0);
			C.blood_volume = 0;
		}
		return 9;
	} else {
		return (yield* parent_proc());
	}
}, true);

rt.type(9555, "/obj/item/pipe_meter", "/obj/item", {
	name: "meter",
	desc: "A meter that can be laid on pipes",
	icon: rt.rsc("icons/obj/atmospherics/pipes/pipe_item.dmi"),
	icon_state: "meter",
	item_state: "buildpipe",
	w_class: 4,
});

// construction.dm:271
rt.def("/obj/item/pipe_meter/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	yield* parent_proc();
	if (!rt.istype(W, T("/obj/item/weapon/wrench"))) {
		return (yield* parent_proc());
	}
	if (!rt.locateIn(f, T("/obj/machinery/atmospherics/pipe"), this.loc)) {
		to_chat(user, "<span class='warning'>You need to fasten it to a pipe!</span>");
		return 1;
	}
	yield* new_(T("/obj/machinery/meter"), this.loc);
	playsound(this.loc, W.usesound, 50, 1);
	to_chat(user, "<span class='notice'>You fasten the meter to the pipe.</span>");
	yield* qdel(this);
	return f.dot;
}, true);
