// Based on /tg/station's code/modules/recycling/disposal-construction.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12986, "/obj/structure/disposalconstruct", "/obj/structure", {
	ptype: 0,
	dpdir: 0,
	base_state: "pipe-s",
	anchored: 0,
	pressure_resistance: 506.625,
	level: 2,
	name: "disposal pipe segment",
	desc: "A huge pipe segment used for constructing disposal systems.",
	icon: rt.rsc("icons/obj/atmospherics/pipes/disposal.dmi"),
	icon_state: "conpipe-s",
	density: 0,
	obj_integrity: 200,
	max_integrity: 200,
});

// disposal-construction.dm:22
rt.def("/obj/structure/disposalconstruct/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, "<span class='notice'>Alt-click to rotate it clockwise.</span>");
	return f.dot;
}, false);

// disposal-construction.dm:26
rt.def("/obj/structure/disposalconstruct/proc/New", function* New(f: Frame, loc: Value, pipe_type: Value, direction: Value) {
	direction ??= 1;
	yield* parent_proc(loc);
	if (pipe_type) {
		this.ptype = pipe_type;
	}
	yield* this.setDir(direction);
	return f.dot;
}, true);

// disposal-construction.dm:33
rt.def("/obj/structure/disposalconstruct/proc/update_icon", function update_icon(f: Frame) {
	let flip: Value = turn(this.dir, 180);
	let left: Value = turn(this.dir, 90);
	let right: Value = turn(this.dir, -90);
	let $0: any = this.ptype;
	if ($0 === DISP_PIPE_STRAIGHT) {
		this.base_state = "pipe-s";
		this.dpdir = rt.bitOr(this.dir, flip);
	} else if ($0 === DISP_PIPE_BENT) {
		this.base_state = "pipe-c";
		this.dpdir = rt.bitOr(this.dir, right);
	} else if ($0 === DISP_JUNCTION) {
		this.base_state = "pipe-j1";
		this.dpdir = rt.bitOr(rt.bitOr(this.dir, right), flip);
	} else if ($0 === DISP_JUNCTION_FLIP) {
		this.base_state = "pipe-j2";
		this.dpdir = rt.bitOr(rt.bitOr(this.dir, left), flip);
	} else if ($0 === DISP_YJUNCTION) {
		this.base_state = "pipe-y";
		this.dpdir = rt.bitOr(rt.bitOr(this.dir, left), right);
	} else if ($0 === DISP_END_TRUNK) {
		this.base_state = "pipe-t";
		this.dpdir = this.dir;
	} else if ($0 === DISP_END_BIN) {
		if (this.anchored) {
			this.base_state = "disposal";
		} else {
			this.base_state = "condisposal";
		}
	} else if ($0 === DISP_END_OUTLET) {
		this.base_state = "outlet";
		this.dpdir = this.dir;
	} else if ($0 === DISP_END_CHUTE) {
		this.base_state = "intake";
		this.dpdir = this.dir;
	} else if ($0 === DISP_SORTJUNCTION) {
		this.base_state = "pipe-j1s";
		this.dpdir = rt.bitOr(rt.bitOr(this.dir, right), flip);
	} else if ($0 === DISP_SORTJUNCTION_FLIP) {
		this.base_state = "pipe-j2s";
		this.dpdir = rt.bitOr(rt.bitOr(this.dir, left), flip);
	}
	if (this.is_pipe()) {
		this.icon_state = `con${this.base_state}`;
	} else {
		this.icon_state = this.base_state;
	}
	this.alpha = this.invisibility ? 0 : 255;
	return f.dot;
});

// disposal-construction.dm:91
rt.def("/obj/structure/disposalconstruct/proc/hide", function hide(f: Frame, intact: Value) {
	this.invisibility = intact && this.level == 1 ? INVISIBILITY_MAXIMUM : 0;
	this.update_icon();
	return f.dot;
});

// disposal-construction.dm:101
rt.def("/obj/structure/disposalconstruct/verb/rotate", function rotate(f: Frame) {
	if (f.usr.stat || !f.usr.canmove || f.usr.restrained()) {
		return f.dot;
	}
	if (this.anchored) {
		to_chat(f.usr, "<span class='warning'>You must unfasten the pipe before rotating it!</span>");
		return f.dot;
	}
	this.setDir(turn(this.dir, -90));
	this.update_icon();
	return f.dot;
}, false, { verb: { name: "Rotate Pipe", category: "Object", src: 1, range: 1 } });

// disposal-construction.dm:112
rt.def("/obj/structure/disposalconstruct/proc/AltClick", function* AltClick(f: Frame, user: Value) {
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

// disposal-construction.dm:125
rt.def("/obj/structure/disposalconstruct/verb/flip", function flip(f: Frame) {
	if (f.usr.stat || !f.usr.canmove || f.usr.restrained()) {
		return f.dot;
	}
	if (this.anchored) {
		to_chat(f.usr, "<span class='warning'>You must unfasten the pipe before flipping it!</span>");
		return f.dot;
	}
	this.setDir(turn(this.dir, 180));
	if (this.ptype === DISP_JUNCTION) {
		this.ptype = DISP_JUNCTION_FLIP;
	} else if (this.ptype === DISP_JUNCTION_FLIP) {
		this.ptype = DISP_JUNCTION;
	} else if (this.ptype === DISP_SORTJUNCTION) {
		this.ptype = DISP_SORTJUNCTION_FLIP;
	} else if (this.ptype === DISP_SORTJUNCTION_FLIP) {
		this.ptype = DISP_SORTJUNCTION;
	}
	this.update_icon();
	return f.dot;
}, false, { verb: { name: "Flip Pipe", category: "Object", src: 1, range: 1 } });

// disposal-construction.dm:147
rt.def("/obj/structure/disposalconstruct/proc/dpipetype", function dpipetype(f: Frame) {
	if (this.ptype === DISP_PIPE_STRAIGHT || this.ptype === DISP_PIPE_BENT) {
		return T("/obj/structure/disposalpipe/segment");
	} else if (this.ptype === DISP_JUNCTION || this.ptype === DISP_JUNCTION_FLIP || this.ptype === DISP_YJUNCTION) {
		return T("/obj/structure/disposalpipe/junction");
	} else if (this.ptype === DISP_END_TRUNK) {
		return T("/obj/structure/disposalpipe/trunk");
	} else if (this.ptype === DISP_END_BIN) {
		return T("/obj/machinery/disposal/bin");
	} else if (this.ptype === DISP_END_OUTLET) {
		return T("/obj/structure/disposaloutlet");
	} else if (this.ptype === DISP_END_CHUTE) {
		return T("/obj/machinery/disposal/deliveryChute");
	} else if (this.ptype === DISP_SORTJUNCTION || this.ptype === DISP_SORTJUNCTION_FLIP) {
		return T("/obj/structure/disposalpipe/sortjunction");
	}
	return f.dot;
});

// disposal-construction.dm:171
rt.def("/obj/structure/disposalconstruct/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let _T: Value = null, pdir: Value = null, W: Value = null, pipetype: Value = null, _P: Value = null, SortP: Value = null, B: Value = null, _P_5: Value = null;
	let nicetype: Value = "pipe";
	let ispipe: Value = this.is_pipe();
	yield* this.add_fingerprint(user);
	if (this.ptype === DISP_END_BIN) {
		nicetype = "disposal bin";
	} else if (this.ptype === DISP_END_OUTLET) {
		nicetype = "disposal outlet";
	} else if (this.ptype === DISP_END_CHUTE) {
		nicetype = "delivery chute";
	} else if (this.ptype === DISP_SORTJUNCTION || this.ptype === DISP_SORTJUNCTION_FLIP) {
		nicetype = "sorting pipe";
	} else {
		nicetype = "pipe";
	}
	if ((_T = this.loc).intact && rt.istype(_T, T("/turf/open/floor"))) {
		to_chat(user, `<span class='warning'>You can only attach the ${nicetype} if the floor plating is removed!</span>`);
		return f.dot;
	}
	if (!ispipe && rt.istype(_T, T("/turf/closed/wall"))) {
		to_chat(user, `<span class='warning'>You can't build ${nicetype}s on walls, only disposal pipes!</span>`);
		return f.dot;
	}
	let CP: Value = rt.locateIn(f, T("/obj/structure/disposalpipe"), _T);
	if (rt.istype(I, T("/obj/item/weapon/wrench"))) {
		if (this.anchored) {
			this.anchored = 0;
			if (ispipe) {
				this.level = 2;
			}
			this.density = 0;
			to_chat(user, `<span class='notice'>You detach the ${nicetype} from the underfloor.</span>`);
		} else {
			if (!this.is_pipe()) {
				if (CP) {
					if (!rt.istype(CP, T("/obj/structure/disposalpipe/trunk"))) {
						to_chat(user, `<span class='warning'>The ${nicetype} requires a trunk underneath it in order to work!</span>`);
						return f.dot;
					}
				} else {
					to_chat(user, `<span class='warning'>The ${nicetype} requires a trunk underneath it in order to work!</span>`);
					return f.dot;
				}
			} else if (CP) {
				yield* this.update_icon();
				pdir = CP.dpdir;
				if (rt.istype(CP, T("/obj/structure/disposalpipe/broken"))) {
					pdir = CP.dir;
				}
				if (rt.bitAnd(pdir, this.dpdir)) {
					to_chat(user, `<span class='warning'>There is already a ${nicetype} at that location!</span>`);
					return f.dot;
				}
			}
			this.anchored = 1;
			if (ispipe) {
				this.level = 1;
			}
			this.density = 0;
			to_chat(user, `<span class='notice'>You attach the ${nicetype} to the underfloor.</span>`);
		}
		playsound(this.loc, I.usesound, 100, 1);
		yield* this.update_icon();
	} else {
		if (!rt.istype(I, T("/obj/item/weapon/weldingtool"))) return f.dot;
		if (this.anchored) {
			if (yield* (W = I).remove_fuel(0, user)) {
				playsound(this.loc, rt.rsc("sound/items/welder2.ogg"), 100, 1);
				to_chat(user, `<span class='notice'>You start welding the ${nicetype} in place...</span>`);
				if (yield* do_after(user, 8 * I.toolspeed, { target: this })) {
					if (!this.loc || !W.isOn()) {
						return f.dot;
					}
					to_chat(user, `<span class='notice'>The ${nicetype} has been welded in place.</span>`);
					yield* this.update_icon();
					if (ispipe) {
						pipetype = this.dpipetype();
						(_P = (yield* new_(pipetype, this.loc, this))).updateicon();
						this.transfer_fingerprints_to(_P);
						if (this.ptype == DISP_SORTJUNCTION || this.ptype == DISP_SORTJUNCTION_FLIP) {
							(SortP = _P).updatedir();
						}
					} else if (this.ptype == DISP_END_BIN) {
						(B = (yield* new_(T("/obj/machinery/disposal/bin"), this.loc, this))).pressure_charging = 0;
						this.transfer_fingerprints_to(B);
					} else if (this.ptype == DISP_END_OUTLET) {
						this.transfer_fingerprints_to((_P_5 = (yield* new_(T("/obj/structure/disposaloutlet"), this.loc, this))));
					} else if (this.ptype == DISP_END_CHUTE) {
						this.transfer_fingerprints_to((_P_5 = (yield* new_(T("/obj/machinery/disposal/deliveryChute"), this.loc, this))));
					}
					return f.dot;
				}
			}
		} else {
			to_chat(user, "<span class='warning'>You need to attach it to the plating first!</span>");
			return f.dot;
		}
	}
	return f.dot;
}, true);

// disposal-construction.dm:271
rt.def("/obj/structure/disposalconstruct/proc/is_pipe", function is_pipe(f: Frame) {
	return (!(this.ptype >= DISP_END_BIN && this.ptype <= DISP_END_CHUTE) ? 1 : 0);
});

// disposal-construction.dm:275
rt.def("/obj/structure/disposalconstruct/proc/can_place", function can_place(f: Frame) {
	let DC: Value = null;
	if (this.is_pipe()) {
		return 1;
	}
	for (DC of each(rt.getStep(f, this, 0), T("/obj/structure/disposalconstruct"))) {
		if (DC == this) {
			continue;
		}
		if (!DC.is_pipe()) {
			return 0;
		}
	}
	return 1;
});
