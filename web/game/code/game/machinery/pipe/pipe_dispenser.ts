// Based on /tg/station's code/game/machinery/pipe/pipe_dispenser.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(10867, "/obj/machinery/pipedispenser", "/obj/machinery", {
	wait: 0,
	anchored: 1,
	name: "pipe dispenser",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "pipe_d",
	density: 1,
});

// pipe_dispenser.dm:10
rt.def("/obj/machinery/pipedispenser/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// pipe_dispenser.dm:13
rt.def("/obj/machinery/pipedispenser/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (yield* parent_proc()) {
		return 1;
	}
	let dat: Value = fmt("\n<b>Regular pipes:</b><BR>\n<A href='?src=＃;make=＀;dir=1'>Pipe</A><BR>\n<A href='?src=＃;make=＀;dir=5'>Bent Pipe</A><BR>\n<A href='?src=＃;make=＀;dir=1'>Manifold</A><BR>\n<A href='?src=＃;make=＀;dir=1'>4-Way Manifold</A><BR>\n<A href='?src=＃;make=＀;dir=1'>Manual Valve</A><BR>\n<A href='?src=＃;make=＀;dir=1'>Digital Valve</A><BR>\n<b>Devices:</b><BR>\n<A href='?src=＃;make=＀;dir=1'>Connector</A><BR>\n<A href='?src=＃;make=＀;dir=1'>Vent</A><BR>\n<A href='?src=＃;make=＀;dir=1'>Gas Pump</A><BR>\n<A href='?src=＃;make=＀;dir=1'>Passive Gate</A><BR>\n<A href='?src=＃;make=＀;dir=1'>Volume Pump</A><BR>\n<A href='?src=＃;make=＀;dir=1'>Scrubber</A><BR>\n<A href='?src=＃;makemeter=1'>Meter</A><BR>\n<A href='?src=＃;make=＀;dir=1'>Gas Filter</A><BR>\n<A href='?src=＃;make=＀;dir=1'>Gas Mixer</A><BR>\n<b>Heat exchange:</b><BR>\n<A href='?src=＃;make=＀;dir=1'>Pipe</A><BR>\n<A href='?src=＃;make=＀;dir=5'>Bent Pipe</A><BR>\n<A href='?src=＃;make=＀;dir=1'>Manifold</A><BR>\n<A href='?src=＃;make=＀;dir=1'>4-Way Manifold</A><BR>\n<A href='?src=＃;make=＀;dir=1'>Junction</A><BR>\n<A href='?src=＃;make=＀;dir=1'>Heat Exchanger</A><BR>\n", [this, T("/obj/machinery/atmospherics/pipe/simple"), this, T("/obj/machinery/atmospherics/pipe/simple"), this, T("/obj/machinery/atmospherics/pipe/manifold"), this, T("/obj/machinery/atmospherics/pipe/manifold4w"), this, T("/obj/machinery/atmospherics/components/binary/valve"), this, T("/obj/machinery/atmospherics/components/binary/valve/digital"), this, T("/obj/machinery/atmospherics/components/unary/portables_connector"), this, T("/obj/machinery/atmospherics/components/unary/vent_pump"), this, T("/obj/machinery/atmospherics/components/binary/pump"), this, T("/obj/machinery/atmospherics/components/binary/passive_gate"), this, T("/obj/machinery/atmospherics/components/binary/volume_pump"), this, T("/obj/machinery/atmospherics/components/unary/vent_scrubber"), this, this, T("/obj/machinery/atmospherics/components/trinary/filter"), this, T("/obj/machinery/atmospherics/components/trinary/mixer"), this, T("/obj/machinery/atmospherics/pipe/heat_exchanging/simple"), this, T("/obj/machinery/atmospherics/pipe/heat_exchanging/simple"), this, T("/obj/machinery/atmospherics/pipe/heat_exchanging/manifold"), this, T("/obj/machinery/atmospherics/pipe/heat_exchanging/manifold4w"), this, T("/obj/machinery/atmospherics/pipe/heat_exchanging/junction"), this, T("/obj/machinery/atmospherics/components/unary/heat_exchanger")]);
	rt.op(f, "Browse", [], [user, `<HEAD><TITLE>${this}</TITLE></HEAD><TT>${dat}</TT>`, "window=pipedispenser"], false);
	onclose(user, "pipedispenser");
	return f.dot;
}, true);

// pipe_dispenser.dm:48
rt.def("/obj/machinery/pipedispenser/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let p_type: Value = null, p_dir: Value = null, _P: Value = null;
	if (yield* parent_proc()) {
		return 1;
	}
	if (!this.anchored || !f.usr.canmove || f.usr.stat || f.usr.restrained() || !(get_dist(this.loc, f.usr) <= 1)) {
		rt.op(f, "Browse", [], [f.usr, null, "window=pipedispenser"], false);
		return 1;
	}
	yield* f.usr.set_machine(this);
	yield* this.add_fingerprint(f.usr);
	if (rt.at(href_list, "make")) {
		if (this.wait < rt.worldTime(f)) {
			p_type = text2path(rt.at(href_list, "make")); if (!rt.isIn(f, p_type, GLOB.pipe_types)) return 1; // tg's own hole: make= took any type path, and wrenching the fitting created it
			p_dir = text2num(rt.at(href_list, "dir"));
			yield* (_P = (yield* new_(T("/obj/item/pipe"), this.loc, { pipe_type: p_type, dir: p_dir }))).add_fingerprint(f.usr);
			this.wait = rt.worldTime(f) + 10;
		}
	}
	if (rt.at(href_list, "makemeter")) {
		if (this.wait < rt.worldTime(f)) {
			yield* new_(T("/obj/item/pipe_meter"), this.loc);
			this.wait = rt.worldTime(f) + 15;
		}
	}
	return f.dot;
}, true);

// pipe_dispenser.dm:69
rt.def("/obj/machinery/pipedispenser/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	yield* this.add_fingerprint(user);
	if (rt.istype(W, T("/obj/item/pipe")) || rt.istype(W, T("/obj/item/pipe_meter"))) {
		to_chat(f.usr, `<span class='notice'>You put ${W} back into ${this}.</span>`);
		if (!(yield* user.drop_item())) {
			return f.dot;
		}
		yield* qdel(W);
		return f.dot;
	} else if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
		if (!this.anchored && !this.isinspace()) {
			playsound(this.loc, W.usesound, 50, 1);
			to_chat(user, fmt("<span class='notice'>You begin to fasten ％！ to the floor...</span>", [this]));
			if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
				yield* this.add_fingerprint(user);
				user.visible_message(fmt("＀ fastens ％！.", [user, this]), fmt("<span class='notice'>You fasten ％！. Now it can dispense pipes.</span>", [this]), "<span class='italics'>You hear ratchet.</span>");
				this.anchored = 1;
				(rt.modSrcVar(f, "stat", MAINT, rt.bitAnd));
				if (f.usr.machine == this) {
					rt.op(f, "Browse", [], [f.usr, null, "window=pipedispenser"], false);
				}
			}
		} else if (this.anchored) {
			playsound(this.loc, W.usesound, 50, 1);
			to_chat(user, fmt("<span class='notice'>You begin to unfasten ％！ from the floor...</span>", [this]));
			if (yield* do_after(user, 20 * W.toolspeed, { target: this })) {
				yield* this.add_fingerprint(user);
				user.visible_message(fmt("＀ unfastens ％！.", [user, this]), fmt("<span class='notice'>You unfasten ％！. Now it can be pulled somewhere else.</span>", [this]), "<span class='italics'>You hear ratchet.</span>");
				this.anchored = 0;
				(rt.modSrcVar(f, "stat", 16777207, rt.bitOr));
				yield* this.power_change();
			}
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(10868, "/obj/machinery/pipedispenser/disposal", "/obj/machinery/pipedispenser", {
	anchored: 1,
	name: "disposal pipe dispenser",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "pipe_d",
	density: 1,
});

// pipe_dispenser.dm:124
rt.def("/obj/machinery/pipedispenser/disposal/proc/MouseDrop_T", function* MouseDrop_T(f: Frame, pipe: Value, usr: Value) {
	if (!usr.canmove || usr.stat || usr.restrained()) {
		return f.dot;
	}
	if (!rt.istype(pipe, T("/obj/structure/disposalconstruct")) && !rt.istype(pipe, T("/obj/structure/c_transit_tube")) && !rt.istype(pipe, T("/obj/structure/c_transit_tube_pod"))) {
		return f.dot;
	}
	if (get_dist(usr, this) > 1 || get_dist(this, pipe) > 1) {
		return f.dot;
	}
	if (pipe.anchored) {
		return f.dot;
	}
	yield* qdel(pipe);
	return f.dot;
}, true);

// pipe_dispenser.dm:139
rt.def("/obj/machinery/pipedispenser/disposal/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (yield* parent_proc()) {
		return 1;
	}
	let dat: Value = fmt("<b>Disposal Pipes</b><br><br>\n<A href='?src=＃;dmake=＀'>Pipe</A><BR>\n<A href='?src=＃;dmake=＀'>Bent Pipe</A><BR>\n<A href='?src=＃;dmake=＀'>Junction</A><BR>\n<A href='?src=＃;dmake=＀'>Y-Junction</A><BR>\n<A href='?src=＃;dmake=＀'>Trunk</A><BR>\n<A href='?src=＃;dmake=＀'>Bin</A><BR>\n<A href='?src=＃;dmake=＀'>Outlet</A><BR>\n<A href='?src=＃;dmake=＀'>Chute</A><BR>\n<A href='?src=＃;dmake=＀'>Sort Junction</A><BR>\n", [this, 0, this, 1, this, 2, this, 4, this, 5, this, 6, this, 7, this, 8, this, 9]);
	rt.op(f, "Browse", [], [user, `<HEAD><TITLE>${this}</TITLE></HEAD><TT>${dat}</TT>`, "window=pipedispenser"], false);
	return f.dot;
}, true);

// pipe_dispenser.dm:159
rt.def("/obj/machinery/pipedispenser/disposal/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let p_type: Value = null, C: Value = null;
	if (yield* parent_proc()) {
		return 1;
	}
	yield* f.usr.set_machine(this);
	yield* this.add_fingerprint(f.usr);
	if (rt.at(href_list, "dmake")) {
		if (this.wait < rt.worldTime(f)) {
			p_type = text2num(rt.at(href_list, "dmake"));
			if (!(C = (yield* new_(T("/obj/structure/disposalconstruct"), this.loc, p_type))).can_place()) {
				to_chat(f.usr, "<span class='warning'>There's not enough room to build that here!</span>");
				yield* qdel(C);
				return f.dot;
			}
			yield* C.add_fingerprint(f.usr);
			yield* C.update_icon();
			this.wait = rt.worldTime(f) + 15;
		}
	}
	return f.dot;
}, true);

rt.type(10869, "/obj/machinery/pipedispenser/disposal/transit_tube", "/obj/machinery/pipedispenser/disposal", {
	anchored: 1,
	name: "transit tube dispenser",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "pipe_d",
	density: 1,
});

// pipe_dispenser.dm:188
rt.def("/obj/machinery/pipedispenser/disposal/transit_tube/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (yield* parent_proc()) {
		return 1;
	}
	let dat: Value = fmt("<B>Transit Tubes:</B><BR>\n<A href='?src=＃;tube=＀'>Straight Tube</A><BR>\n<A href='?src=＃;tube=＀'>Straight Tube with Crossing</A><BR>\n<A href='?src=＃;tube=＀'>Curved Tube</A><BR>\n<A href='?src=＃;tube=＀'>Diagonal Tube</A><BR>\n<A href='?src=＃;tube=＀'>Diagonal Tube with Crossing</A><BR>\n<A href='?src=＃;tube=＀'>Junction</A><BR>\n<b>Station Equipment:</b><BR>\n<A href='?src=＃;tube=＀'>Through Tube Station</A><BR>\n<A href='?src=＃;tube=＀'>Terminus Tube Station</A><BR>\n<A href='?src=＃;tube=＀'>Transit Tube Pod</A><BR>\n", [this, 0, this, 1, this, 2, this, 3, this, 4, this, 5, this, 6, this, 7, this, 8]);
	rt.op(f, "Browse", [], [user, `<HEAD><TITLE>${this}</TITLE></HEAD><TT>${dat}</TT>`, "window=pipedispenser"], false);
	return f.dot;
}, true);

// pipe_dispenser.dm:209
rt.def("/obj/machinery/pipedispenser/disposal/transit_tube/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let tube_type: Value = null, C: Value = null;
	if (yield* parent_proc()) {
		return 1;
	}
	yield* f.usr.set_machine(this);
	yield* this.add_fingerprint(f.usr);
	if (this.wait < rt.worldTime(f)) {
		if (rt.at(href_list, "tube")) {
			tube_type = text2num(rt.at(href_list, "tube"));
			if (tube_type === TRANSIT_TUBE_STRAIGHT) {
				C = (yield* new_(T("/obj/structure/c_transit_tube"), this.loc));
			} else if (tube_type === TRANSIT_TUBE_STRAIGHT_CROSSING) {
				C = (yield* new_(T("/obj/structure/c_transit_tube/crossing"), this.loc));
			} else if (tube_type === TRANSIT_TUBE_CURVED) {
				C = (yield* new_(T("/obj/structure/c_transit_tube/curved"), this.loc));
			} else if (tube_type === TRANSIT_TUBE_DIAGONAL) {
				C = (yield* new_(T("/obj/structure/c_transit_tube/diagonal"), this.loc));
			} else if (tube_type === TRANSIT_TUBE_DIAGONAL_CROSSING) {
				C = (yield* new_(T("/obj/structure/c_transit_tube/diagonal/crossing"), this.loc));
			} else if (tube_type === TRANSIT_TUBE_JUNCTION) {
				C = (yield* new_(T("/obj/structure/c_transit_tube/junction"), this.loc));
			} else if (tube_type === TRANSIT_TUBE_STATION) {
				C = (yield* new_(T("/obj/structure/c_transit_tube/station"), this.loc));
			} else if (tube_type === TRANSIT_TUBE_TERMINUS) {
				C = (yield* new_(T("/obj/structure/c_transit_tube/station/reverse"), this.loc));
			} else if (tube_type === TRANSIT_TUBE_POD) {
				C = (yield* new_(T("/obj/structure/c_transit_tube_pod"), this.loc));
			}
			if (C) {
				yield* C.add_fingerprint(f.usr);
			}
			this.wait = rt.worldTime(f) + 15;
		}
	}
	return f.dot;
}, true);
