// Based on /tg/station's code/modules/recycling/disposal-structures.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(12987, "/obj/structure/disposalholder", "/obj/structure", {
	gas: null,
	active: 0,
	count: 1000,
	destinationTag: 0,
	tomail: 0,
	hasmob: 0,
	invisibility: 100,
	resistance_flags: 115,
	dir: 0,
});

// disposal-structures.dm:19
rt.def("/obj/structure/disposalholder/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.gas);
	this.active = 0;
	return (yield* parent_proc());
}, true);

// disposal-structures.dm:29
rt.def("/obj/structure/disposalholder/proc/init", function* init(f: Frame, D: Value) {
	let M: Value = null, O: Value = null, M_1: Value = null, AM: Value = null, _T: Value = null;
	this.gas = D.air_contents;
	for (M of each(D, T("/mob/living"))) {
		if (M.client) {
			yield* M.reset_perspective(this);
		}
		this.hasmob = 1;
	}
	for (O of each(D, T("/obj"))) {
		if (O.contents) {
			M_1 = null;
			for (M_1 of each(O.contents, T("/mob/living"))) {
				this.hasmob = 1;
			}
		}
	}
	for (AM of each(D, T("/atom/movable"))) {
		AM.loc = this;
		if (rt.istype(AM, T("/obj/structure/bigDelivery")) && !this.hasmob) {
			_T = AM;
			this.destinationTag = _T.sortTag;
		}
		if (rt.istype(AM, T("/obj/item/smallDelivery")) && !this.hasmob) {
			_T = AM;
			this.destinationTag = _T.sortTag;
		}
	}
	return f.dot;
}, true);

// disposal-structures.dm:56
rt.def("/obj/structure/disposalholder/proc/start", function* start(f: Frame, D: Value) {
	if (!D.trunk) {
		yield* D.expel(this);
		return f.dot;
	}
	this.loc = D.trunk;
	this.active = 1;
	yield* this.setDir(32);
	yield* this.move();
	return f.dot;
}, true);

// disposal-structures.dm:71
rt.def("/obj/structure/disposalholder/proc/move", function* move(f: Frame) {
	let last: Value = null, curr: Value = null;
	while (this.active) {
		last = (curr = this.loc);
		if (!(curr = (yield* curr.transfer(this))) && this.active) {
			yield* last.expel(this, this.loc, this.dir);
		}
		yield* stoplag();
		if (!this.count--) {
			this.active = 0;
		}
	}
	return f.dot;
}, true, { waitfor: false });

// disposal-structures.dm:84
rt.def("/obj/structure/disposalholder/proc/nextloc", function nextloc(f: Frame) {
	return rt.getStep(f, this.loc, this.dir);
});

// disposal-structures.dm:89
rt.def("/obj/structure/disposalholder/proc/findpipe", function findpipe(f: Frame, _T: Value) {
	let _P: Value = null;
	if (!_T) {
		return null;
	}
	let fdir: Value = turn(this.dir, 180);
	for (_P of each(_T, T("/obj/structure/disposalpipe"))) {
		if (rt.bitAnd(fdir, _P.dpdir)) {
			return _P;
		}
	}
	return null;
});

// disposal-structures.dm:102
rt.def("/obj/structure/disposalholder/proc/merge", function* merge(f: Frame, other: Value) {
	let AM: Value = null, M: Value = null;
	for (AM of each(other, T("/atom/movable"))) {
		AM.loc = this;
		if (ismob(AM)) {
			yield* (M = AM).reset_perspective(this);
		}
	}
	yield* qdel(other);
	return f.dot;
}, true);

// disposal-structures.dm:112
rt.def("/obj/structure/disposalholder/proc/relaymove", function relaymove(f: Frame, user: Value) {
	let M: Value = null;
	if (user.stat) {
		return f.dot;
	}
	if (this.loc) {
		for (M of each(get_hearers_in_view(this.loc.loc), T("/mob"))) {
			M.show_message(`<FONT size=${max(0, 5 - get_dist(this, M))}>CLONG, clong!</FONT>`, 2);
		}
	}
	playsound(this.loc, rt.rsc("sound/effects/clang.ogg"), 50, 0, 0);
	return f.dot;
});

// disposal-structures.dm:121
rt.def("/obj/structure/disposalholder/proc/vent_gas", function* vent_gas(f: Frame, _T: Value) {
	yield* _T.assume_air(this.gas);
	_T.air_update_turf();
	return f.dot;
}, true);

rt.type(12517, "/obj/structure/disposalpipe", "/obj/structure", {
	dpdir: 0,
	base_icon_state: null,
	stored: null,
	anchored: 1,
	level: 1,
	icon: rt.rsc("icons/obj/atmospherics/pipes/disposal.dmi"),
	name: "disposal pipe",
	desc: "An underfloor disposal pipe.",
	density: 0,
	on_blueprints: 1,
	dir: 0,
	obj_integrity: 200,
	max_integrity: 200,
	armor: null,
	layer: 2.3,
});

// disposal-structures.dm:144
rt.def("/obj/structure/disposalpipe/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 25, "bullet", 10, "laser", 10, "energy", 100, "bomb", 0, "bio", 100, "rad", 100, "fire", 90, "acid", 30]);
	return f.dot;
});

// disposal-structures.dm:151
rt.def("/obj/structure/disposalpipe/proc/Initialize", function* Initialize(f: Frame, mapload: Value, make_from: Value) {
	f.dot = (yield* parent_proc());
	if (make_from && !(!make_from || make_from.gc_destroyed)) {
		this.base_icon_state = make_from.base_state;
		yield* this.setDir(make_from.dir);
		this.dpdir = make_from.dpdir;
		make_from.loc = this;
		this.stored = make_from;
	} else {
		this.base_icon_state = this.icon_state;
		this.stored = (yield* new_(T("/obj/structure/disposalconstruct"), this, { direction: this.dir }));
		if (this.base_icon_state === "pipe-s") {
			this.stored.ptype = DISP_PIPE_STRAIGHT;
		} else if (this.base_icon_state === "pipe-c") {
			this.stored.ptype = DISP_PIPE_BENT;
		} else if (this.base_icon_state === "pipe-j1") {
			this.stored.ptype = DISP_JUNCTION;
		} else if (this.base_icon_state === "pipe-j2") {
			this.stored.ptype = DISP_JUNCTION_FLIP;
		} else if (this.base_icon_state === "pipe-y") {
			this.stored.ptype = DISP_YJUNCTION;
		} else if (this.base_icon_state === "pipe-t") {
			this.stored.ptype = DISP_END_TRUNK;
		} else if (this.base_icon_state === "pipe-j1s") {
			this.stored.ptype = DISP_SORTJUNCTION;
		} else if (this.base_icon_state === "pipe-j2s") {
			this.stored.ptype = DISP_SORTJUNCTION_FLIP;
		}
	}
	return f.dot;
}, true);

// disposal-structures.dm:184
rt.def("/obj/structure/disposalpipe/proc/Destroy", function* Destroy(f: Frame) {
	let H: Value = null, _T: Value = null;
	if (H = rt.locateIn(f, T("/obj/structure/disposalholder"), this)) {
		H.active = 0;
		_T = this.loc;
		yield* this.expel(H, _T, 0);
	}
	return (yield* parent_proc());
}, true);

// disposal-structures.dm:194
rt.def("/obj/structure/disposalpipe/proc/nextdir", function nextdir(f: Frame, fromdir: Value) {
	return rt.bitAnd(this.dpdir, rt.op(f, "BitNot", [], [turn(fromdir, 180)]));
});

// disposal-structures.dm:200
rt.def("/obj/structure/disposalpipe/proc/transfer", function* transfer(f: Frame, H: Value) {
	let nextdir: Value = this.nextdir(H.dir);
	return (yield* this.transfer_to_dir(H, nextdir));
}, true);

// disposal-structures.dm:204
rt.def("/obj/structure/disposalpipe/proc/transfer_to_dir", function* transfer_to_dir(f: Frame, H: Value, nextdir: Value) {
	let _P: Value = null, H2: Value = null;
	yield* H.setDir(nextdir);
	let _T: Value = H.nextloc();
	if (_P = H.findpipe(_T)) {
		if ((H2 = rt.locateIn(f, T("/obj/structure/disposalholder"), _P)) && !H2.active) {
			yield* H.merge(H2);
		}
		H.loc = _P;
		return _P;
	} else {
		H.loc = rt.getStep(f, this, 0);
		return null;
	}
}, true);

// disposal-structures.dm:223
rt.def("/obj/structure/disposalpipe/proc/update", function update(f: Frame) {
	let _T: Value = null;
	this.hide(((_T = this.loc).intact && (!rt.istype(_T, T("/turf/open/space")) ? 1 : 0)));
	return f.dot;
});

// disposal-structures.dm:228
rt.def("/obj/structure/disposalpipe/proc/hide", function hide(f: Frame, intact: Value) {
	this.invisibility = intact ? INVISIBILITY_MAXIMUM : 0;
	this.updateicon();
	return f.dot;
});

// disposal-structures.dm:237
rt.def("/obj/structure/disposalpipe/proc/updateicon", function updateicon(f: Frame) {
	if (this.invisibility) {
		this.icon_state = `${this.base_icon_state}f`;
	} else {
		this.icon_state = this.base_icon_state;
	}
	return f.dot;
});

// disposal-structures.dm:253
rt.def("/obj/structure/disposalpipe/proc/expel", function* expel(f: Frame, H: Value, _T: Value, direction: Value) {
	let target: Value = null, floorturf: Value = null, AM: Value = null;
	let eject_range: Value = 5;
	if (rt.istype(_T, T("/turf/open/floor"))) {
		if ((floorturf = _T).floor_tile) {
			yield* new_(floorturf.floor_tile, _T);
		}
		yield* floorturf.make_plating();
	}
	if (direction) {
		if (rt.istype(_T, T("/turf/open/space"))) {
			target = get_edge_target_turf(_T, direction);
		} else {
			target = get_ranged_target_turf(_T, direction, 10);
		}
		eject_range = 10;
	} else if (floorturf) {
		target = get_offset_target_turf(_T, rand(5) - rand(5), rand(5) - rand(5));
	}
	playsound(this, rt.rsc("sound/machines/hiss.ogg"), 50, 0, 0);
	for (AM of each(H, T("/atom/movable"))) {
		yield* AM.forceMove(this.loc);
		AM.pipe_eject(direction);
		if (target) {
			yield* AM.throw_at(target, eject_range, 1);
		}
	}
	yield* H.vent_gas(_T);
	yield* qdel(H);
	return f.dot;
}, true);

// disposal-structures.dm:282
rt.def("/obj/structure/disposalpipe/proc/contents_explosion", function contents_explosion(f: Frame, severity: Value, target: Value) {
	let H: Value = null;
	if (!(H = rt.locateIn(f, T("/obj/structure/disposalholder"), this))) return f.dot;
	H.contents_explosion(severity, target);
	return f.dot;
});

// disposal-structures.dm:288
rt.def("/obj/structure/disposalpipe/proc/run_obj_armor", function run_obj_armor(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (f.args[2] == "melee" && f.args[0] < 10) {
		return 0;
	}
	f.dot = parent_proc();
	return f.dot;
}, false, { args: ["damage_amount", "damage_type", "damage_flag", "attack_dir"] });

// disposal-structures.dm:297
rt.def("/obj/structure/disposalpipe/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let _T: Value = null, W: Value = null;
	if ((_T = this.loc).intact) {
		return f.dot;
	}
	yield* this.add_fingerprint(user);
	if (rt.istype(I, T("/obj/item/weapon/weldingtool"))) {
		W = I;
		if (this.can_be_deconstructed(user)) {
			if (yield* W.remove_fuel(0, user)) {
				playsound(this.loc, rt.rsc("sound/items/welder2.ogg"), 100, 1);
				to_chat(user, "<span class='notice'>You start slicing the disposal pipe...</span>");
				if (yield* do_after(user, 30, { target: this })) {
					if (!this || !W.isOn()) {
						return f.dot;
					}
					yield* this.deconstruct();
					to_chat(user, "<span class='notice'>You slice the disposal pipe.</span>");
				}
			}
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// disposal-structures.dm:320
rt.def("/obj/structure/disposalpipe/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let _T: Value = null, D: Value = null, _P: Value = null;
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		if (disassembled) {
			if (this.stored) {
				_T = this.loc;
				this.stored.loc = _T;
				this.transfer_fingerprints_to(this.stored);
				yield* this.stored.setDir(this.dir);
				this.stored.density = 0;
				this.stored.anchored = 1;
				yield* this.stored.update_icon();
			}
		} else {
			for (D of each(GLOB.cardinal)) {
				if (rt.bitAnd(D, this.dpdir)) {
					yield* (_P = (yield* new_(T("/obj/structure/disposalpipe/broken"), this.loc))).setDir(D);
				}
			}
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);

// disposal-structures.dm:339
rt.def("/obj/structure/disposalpipe/proc/singularity_pull", function* singularity_pull(f: Frame, S: Value, current_size: Value) {
	if (!(current_size >= STAGE_FIVE)) return f.dot;
	yield* this.deconstruct();
	return f.dot;
}, true);

// disposal-structures.dm:344
rt.def("/obj/structure/disposalpipe/proc/shuttleRotate", function* shuttleRotate(f: Frame, rotation: Value) {
	let D: Value = null;
	yield* parent_proc();
	let new_dpdir: Value = 0;
	for (D of each(GLOB.cardinal)) {
		if (rt.bitAnd(this.dpdir, D)) {
			new_dpdir = rt.bitOr(new_dpdir, angle2dir(rotation + dir2angle(D)));
		}
	}
	this.dpdir = new_dpdir;
	return f.dot;
}, true);

rt.type(12518, "/obj/structure/disposalpipe/segment", "/obj/structure/disposalpipe", {
	icon_state: "pipe-s",
});

// disposal-structures.dm:362
rt.def("/obj/structure/disposalpipe/segment/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (this.stored.ptype == DISP_PIPE_STRAIGHT) {
		this.dpdir = rt.bitOr(this.dir, turn(this.dir, 180));
	} else {
		this.dpdir = rt.bitOr(this.dir, turn(this.dir, -90));
	}
	yield* this.update();
	return f.dot;
}, true);

rt.type(12519, "/obj/structure/disposalpipe/junction", "/obj/structure/disposalpipe", {
	icon_state: "pipe-j1",
});

// disposal-structures.dm:378
rt.def("/obj/structure/disposalpipe/junction/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (this.stored.ptype === DISP_JUNCTION) {
		this.dpdir = rt.bitOr(rt.bitOr(this.dir, turn(this.dir, -90)), turn(this.dir, 180));
	} else if (this.stored.ptype === DISP_JUNCTION_FLIP) {
		this.dpdir = rt.bitOr(rt.bitOr(this.dir, turn(this.dir, 90)), turn(this.dir, 180));
	} else if (this.stored.ptype === DISP_YJUNCTION) {
		this.dpdir = rt.bitOr(rt.bitOr(this.dir, turn(this.dir, 90)), turn(this.dir, -90));
	}
	yield* this.update();
	return f.dot;
}, true);

// disposal-structures.dm:394
rt.def("/obj/structure/disposalpipe/junction/proc/nextdir", function nextdir(f: Frame, fromdir: Value) {
	let flipdir: Value = null, mask: Value = null, setbit: Value = null;
	if ((flipdir = turn(fromdir, 180)) != this.dir) {
		return this.dir;
	} else {
		mask = parent_proc(fromdir);
		setbit = 0;
		if (rt.bitAnd(mask, 1)) {
			setbit = 1;
		} else if (rt.bitAnd(mask, 2)) {
			setbit = 2;
		} else if (rt.bitAnd(mask, 4)) {
			setbit = 4;
		} else {
			setbit = 8;
		}
		if (prob(50)) {
			return setbit;
		} else {
			return rt.bitAnd(mask, rt.op(f, "BitNot", [], [setbit]));
		}
	}
});

rt.type(12520, "/obj/structure/disposalpipe/sortjunction", "/obj/structure/disposalpipe", {
	sortType: 0,
	sortTypes: null,
	posdir: 0,
	negdir: 0,
	sortdir: 0,
	desc: "An underfloor disposal pipe with a package sorting mechanism.",
	icon_state: "pipe-j1s",
});

// disposal-structures.dm:425
rt.def("/obj/structure/disposalpipe/sortjunction/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.sortTypes = list();
	return f.dot;
});

// disposal-structures.dm:431
rt.def("/obj/structure/disposalpipe/sortjunction/proc/examine", function examine(f: Frame, user: Value) {
	let t: Value = null;
	parent_proc();
	if (rt.len(f, this.sortTypes) > 0) {
		to_chat(user, "It is tagged with the following tags:");
		for (t of each(this.sortTypes)) {
			to_chat(user, rt.index(GLOB.TAGGERLOCATIONS, t));
		}
	} else {
		to_chat(user, "It has no sorting tags set.");
	}
	return f.dot;
}, false);

// disposal-structures.dm:441
rt.def("/obj/structure/disposalpipe/sortjunction/proc/updatedir", function updatedir(f: Frame) {
	this.posdir = this.dir;
	this.negdir = turn(this.posdir, 180);
	if (this.stored.ptype == DISP_SORTJUNCTION) {
		this.sortdir = turn(this.posdir, -90);
	} else {
		this.icon_state = "pipe-j2s";
		this.sortdir = turn(this.posdir, 90);
	}
	this.dpdir = rt.bitOr(rt.bitOr(this.sortdir, this.posdir), this.negdir);
	return f.dot;
});

// disposal-structures.dm:453
rt.def("/obj/structure/disposalpipe/sortjunction/proc/Initialize", function* Initialize(f: Frame) {
	let sorts: Value = null, x: Value = null, n: Value = null;
	f.dot = (yield* parent_proc());
	if (this.sortType) {
		if (isnum(this.sortType)) {
			(rt.modSrcVar(f, "sortTypes", this.sortType, rt.bitOr));
		} else if (istext(this.sortType)) {
			sorts = splittext(this.sortType, ";");
			for (x of each(sorts)) {
				if (n = text2num(x)) {
					(rt.modSrcVar(f, "sortTypes", n, rt.bitOr));
				}
			}
		}
	}
	this.updatedir();
	yield* this.update();
	return f.dot;
}, true);

// disposal-structures.dm:470
rt.def("/obj/structure/disposalpipe/sortjunction/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let O: Value = null;
	if (rt.istype(I, T("/obj/item/device/destTagger"))) {
		if ((O = I).currTag > 0) {
			if (rt.isIn(f, O.currTag, this.sortTypes)) {
				this.sortTypes -= O.currTag;
				to_chat(user, `<span class='notice'>Removed "${rt.index(GLOB.TAGGERLOCATIONS, O.currTag)}" filter.</span>`);
			} else {
				(rt.modSrcVar(f, "sortTypes", O.currTag, rt.bitOr));
				to_chat(user, `<span class='notice'>Added "${rt.index(GLOB.TAGGERLOCATIONS, O.currTag)}" filter.</span>`);
			}
			playsound(this.loc, rt.rsc("sound/machines/twobeep.ogg"), 100, 1);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// disposal-structures.dm:492
rt.def("/obj/structure/disposalpipe/sortjunction/proc/nextdir", function nextdir(f: Frame, fromdir: Value, sortTag: Value) {
	if (fromdir != this.sortdir) {
		if (rt.isIn(f, sortTag, this.sortTypes)) {
			return this.sortdir;
		} else {
			return this.posdir;
		}
	} else {
		return this.posdir;
	}
});

// disposal-structures.dm:503
rt.def("/obj/structure/disposalpipe/sortjunction/proc/transfer", function* transfer(f: Frame, H: Value) {
	let nextdir: Value = this.nextdir(H.dir, H.destinationTag);
	return (yield* this.transfer_to_dir(H, nextdir));
}, true);

rt.type(12521, "/obj/structure/disposalpipe/wrapsortjunction", "/obj/structure/disposalpipe", {
	posdir: 0,
	negdir: 0,
	sortdir: 0,
	desc: "An underfloor disposal pipe which sorts wrapped and unwrapped objects.",
	icon_state: "pipe-j1s",
});

// disposal-structures.dm:516
rt.def("/obj/structure/disposalpipe/wrapsortjunction/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.posdir = this.dir;
	if (this.stored.ptype == DISP_SORTJUNCTION) {
		this.sortdir = turn(this.posdir, -90);
		this.negdir = turn(this.posdir, 180);
	} else {
		this.icon_state = "pipe-j2s";
		this.sortdir = turn(this.posdir, 90);
		this.negdir = turn(this.posdir, 180);
	}
	this.dpdir = rt.bitOr(rt.bitOr(this.sortdir, this.posdir), this.negdir);
	yield* this.update();
	return f.dot;
}, true);

// disposal-structures.dm:536
rt.def("/obj/structure/disposalpipe/wrapsortjunction/proc/nextdir", function nextdir(f: Frame, fromdir: Value, istomail: Value) {
	if (fromdir != this.sortdir) {
		if (istomail) {
			return this.sortdir;
		} else {
			return this.posdir;
		}
	} else {
		return this.posdir;
	}
});

// disposal-structures.dm:547
rt.def("/obj/structure/disposalpipe/wrapsortjunction/proc/transfer", function* transfer(f: Frame, H: Value) {
	let nextdir: Value = this.nextdir(H.dir, H.tomail);
	return (yield* this.transfer_to_dir(H, nextdir));
}, true);

rt.type(12522, "/obj/structure/disposalpipe/trunk", "/obj/structure/disposalpipe", {
	linked: null,
	icon_state: "pipe-t",
});

// disposal-structures.dm:556
rt.def("/obj/structure/disposalpipe/trunk/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.dpdir = this.dir;
	rt.spawnTail(f, 1, "/obj/structure/disposalpipe/trunk/proc/Initialize: spawn at modules/recycling/disposal-structures.dm:558");
	yield* this.update();
	return f.dot;
}, true);

// a spawn(1) body of /obj/structure/disposalpipe/trunk/proc/Initialize, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/structure/disposalpipe/trunk/proc/Initialize: spawn at modules/recycling/disposal-structures.dm:558", function* (f: Frame) {
	this.getlinked();
	return null;
});

// disposal-structures.dm:565
rt.def("/obj/structure/disposalpipe/trunk/proc/Destroy", function* Destroy(f: Frame) {
	let D: Value = null;
	if (this.linked) {
		if (rt.istype(this.linked, T("/obj/structure/disposaloutlet"))) {
			(D = this.linked).trunk = null;
		} else if (rt.istype(this.linked, T("/obj/machinery/disposal"))) {
			(D = this.linked).trunk = null;
		}
	}
	return (yield* parent_proc());
}, true);

// disposal-structures.dm:575
rt.def("/obj/structure/disposalpipe/trunk/proc/getlinked", function getlinked(f: Frame) {
	let D: Value = null, O: Value = null;
	this.linked = null;
	if (D = rt.locateIn(f, T("/obj/machinery/disposal"), this.loc)) {
		this.linked = D;
		if (!D.trunk) {
			D.trunk = this;
		}
	}
	if (O = rt.locateIn(f, T("/obj/structure/disposaloutlet"), this.loc)) {
		this.linked = O;
	}
	this.update();
	return f.dot;
});

// disposal-structures.dm:590
rt.def("/obj/structure/disposalpipe/trunk/proc/can_be_deconstructed", function can_be_deconstructed(f: Frame, user: Value) {
	if (this.linked) {
		to_chat(user, "<span class='warning'>You need to deconstruct disposal machinery above this pipe!</span>");
	} else {
		f.dot = 1;
	}
	return f.dot;
});

// disposal-structures.dm:599
rt.def("/obj/structure/disposalpipe/trunk/proc/transfer", function* transfer(f: Frame, H: Value) {
	let O: Value = null, D: Value = null;
	if (H.dir == 32) {
		return (yield* parent_proc());
	}
	if (this.linked) {
		if (rt.istype((O = this.linked), T("/obj/structure/disposaloutlet")) && H) {
			yield* O.expel(H);
		} else {
			D = this.linked;
			if (H) {
				yield* D.expel(H);
			}
		}
	} else if (H) {
		yield* this.expel(H, rt.getStep(f, this, 0), 0);
	}
	return null;
}, true);

// disposal-structures.dm:616
rt.def("/obj/structure/disposalpipe/trunk/proc/nextdir", function nextdir(f: Frame, fromdir: Value) {
	if (fromdir == 32) {
		return this.dir;
	} else {
		return 0;
	}
});

rt.type(12523, "/obj/structure/disposalpipe/broken", "/obj/structure/disposalpipe", {
	dpdir: 0,
	icon_state: "pipe-b",
	desc: "A broken piece of disposal pipe.",
});

// disposal-structures.dm:629
rt.def("/obj/structure/disposalpipe/broken/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.update();
	return f.dot;
}, true);

// disposal-structures.dm:635
rt.def("/obj/structure/disposalpipe/broken/proc/deconstruct", function* deconstruct(f: Frame) {
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(12988, "/obj/structure/disposaloutlet", "/obj/structure", {
	active: 0,
	target: null,
	trunk: null,
	stored: null,
	mode: 0,
	start_eject: 0,
	eject_range: 2,
	anchored: 1,
	name: "disposal outlet",
	desc: "An outlet for the pneumatic disposal system.",
	icon: rt.rsc("icons/obj/atmospherics/pipes/disposal.dmi"),
	icon_state: "outlet",
	density: 1,
});

// disposal-structures.dm:653
rt.def("/obj/structure/disposaloutlet/proc/Initialize", function* Initialize(f: Frame, mapload: Value, make_from: Value) {
	f.dot = (yield* parent_proc());
	if (make_from) {
		yield* this.setDir(make_from.dir);
		make_from.loc = this;
		this.stored = make_from;
	} else {
		this.stored = (yield* new_(T("/obj/structure/disposalconstruct"), this, DISP_END_OUTLET, this.dir));
	}
	rt.spawnTail(f, 1, "/obj/structure/disposaloutlet/proc/Initialize: spawn at modules/recycling/disposal-structures.dm:661");
	return f.dot;
}, true);

// a spawn(1) body of /obj/structure/disposaloutlet/proc/Initialize, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/structure/disposaloutlet/proc/Initialize: spawn at modules/recycling/disposal-structures.dm:661", function* (f: Frame) {
	this.target = get_ranged_target_turf(this, this.dir, 10);
	this.trunk = rt.locateIn(f, T("/obj/structure/disposalpipe/trunk"), this.loc);
	if (this.trunk) {
		this.trunk.linked = this;
	}
	return null;
});

// disposal-structures.dm:670
rt.def("/obj/structure/disposaloutlet/proc/Destroy", function* Destroy(f: Frame) {
	if (this.trunk) {
		this.trunk.linked = null;
	}
	return (yield* parent_proc());
}, true);

// disposal-structures.dm:676
rt.def("/obj/structure/disposaloutlet/proc/expel", function* expel(f: Frame, H: Value) {
	let AM: Value = null;
	let _T: Value = rt.getStep(f, this, 0);
	flick("outlet-open", this);
	if (this.start_eject + 30 < rt.worldTime(f)) {
		this.start_eject = rt.worldTime(f);
		playsound(this, rt.rsc("sound/machines/warning-buzzer.ogg"), 50, 0, 0);
		yield* sleep(20);
		playsound(this, rt.rsc("sound/machines/hiss.ogg"), 50, 0, 0);
	} else {
		yield* sleep(20);
	}
	if (H) {
		for (AM of each(H, T("/atom/movable"))) {
			yield* AM.forceMove(_T);
			AM.pipe_eject(this.dir);
			yield* AM.throw_at(this.target, this.eject_range, 1);
		}
		yield* H.vent_gas(_T);
		yield* qdel(H);
	}
	return f.dot;
}, true);

// disposal-structures.dm:696
rt.def("/obj/structure/disposaloutlet/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let W: Value = null;
	yield* this.add_fingerprint(user);
	if (rt.istype(I, T("/obj/item/weapon/screwdriver"))) {
		if (this.mode == 0) {
			this.mode = 1;
			playsound(this.loc, I.usesound, 50, 1);
			to_chat(user, "<span class='notice'>You remove the screws around the power connection.</span>");
		} else if (this.mode == 1) {
			this.mode = 0;
			playsound(this.loc, I.usesound, 50, 1);
			to_chat(user, "<span class='notice'>You attach the screws around the power connection.</span>");
		}
	} else if (rt.istype(I, T("/obj/item/weapon/weldingtool")) && this.mode == 1) {
		if (yield* (W = I).remove_fuel(0, user)) {
			playsound(this.loc, rt.rsc("sound/items/welder2.ogg"), 100, 1);
			to_chat(user, fmt("<span class='notice'>You start slicing the floorweld off ％！...</span>", [this]));
			if (yield* do_after(user, 20 * I.toolspeed, { target: this })) {
				if (!this || !W.isOn()) {
					return f.dot;
				}
				to_chat(user, fmt("<span class='notice'>You slice the floorweld off ％！.</span>", [this]));
				this.stored.loc = this.loc;
				this.transfer_fingerprints_to(this.stored);
				yield* this.stored.update_icon();
				this.stored.anchored = 0;
				this.stored.density = 1;
				yield* qdel(this);
			}
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// disposal-structures.dm:735
rt.def("/obj/effect/decal/cleanable/blood/gibs/proc/pipe_eject", function pipe_eject(f: Frame, direction: Value) {
	let dirs: Value = null;
	if (direction) {
		dirs = list(direction, turn(direction, -45), turn(direction, 45));
	} else {
		dirs = GLOB.alldirs.Copy();
	}
	this.streak(dirs);
	return f.dot;
});

rt.type(11704, "/obj/effect/decal/cleanable/robot_debris/gib", "/obj/effect/decal/cleanable/robot_debris", {});

// disposal-structures.dm:744
rt.def("/obj/effect/decal/cleanable/robot_debris/gib/proc/pipe_eject", function pipe_eject(f: Frame, direction: Value) {
	let dirs: Value = null;
	if (direction) {
		dirs = list(direction, turn(direction, -45), turn(direction, 45));
	} else {
		dirs = GLOB.alldirs.Copy();
	}
	this.streak(dirs);
	return f.dot;
});
