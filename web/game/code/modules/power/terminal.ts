// Based on /tg/station's code/modules/power/terminal.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10323, "/obj/machinery/power/terminal", "/obj/machinery/power", {
	master: null,
	level: 1,
	anchored: 1,
	name: "terminal",
	icon_state: "term",
	desc: "It's an underfloor wiring terminal for power equipment.",
	layer: 2.45,
});

// terminal.dm:17
rt.def("/obj/machinery/power/terminal/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	let _T: Value = this.loc;
	if (this.level == 1) {
		yield* this.hide(_T.intact);
	}
	return f.dot;
}, true);

// terminal.dm:24
rt.def("/obj/machinery/power/terminal/proc/Destroy", function* Destroy(f: Frame) {
	if (this.master) {
		this.master.disconnect_terminal();
	}
	return (yield* parent_proc());
}, true);

// terminal.dm:30
rt.def("/obj/machinery/power/terminal/proc/hide", function hide(f: Frame, i: Value) {
	if (i) {
		this.invisibility = INVISIBILITY_MAXIMUM;
		this.icon_state = "term-f";
	} else {
		this.invisibility = 0;
		this.icon_state = "term";
	}
	return f.dot;
});

// terminal.dm:51
rt.def("/obj/machinery/power/terminal/proc/dismantle", function* dismantle(f: Frame, user: Value, W: Value) {
	let _T: Value = null;
	if (!isturf(this.loc)) return f.dot;
	if ((_T = this.loc).intact) {
		to_chat(user, "<span class='warning'>You must first expose the power terminal!</span>");
		return f.dot;
	}
	if (!(!this.master || this.master.can_terminal_dismantle())) return f.dot;
	user.visible_message(`${user.name} dismantles the power terminal from ${this.master}.`, "<span class='notice'>You begin to cut the cables...</span>");
	playsound(this.loc, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
	if (!(yield* do_after(user, 50 * W.toolspeed, { target: this }))) return f.dot;
	if (!(!this.master || this.master.can_terminal_dismantle())) return f.dot;
	if (prob(50) && (yield* electrocute_mob(user, this.powernet, this, 1, 1))) {
		yield* do_sparks(5, 1, this.master);
		return f.dot;
	}
	yield* new_(T("/obj/item/stack/cable_coil"), this.loc, 10);
	to_chat(user, "<span class='notice'>You cut the cables and dismantle the power terminal.</span>");
	yield* qdel(this);
	return f.dot;
}, true);

// terminal.dm:73
rt.def("/obj/machinery/power/terminal/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/weapon/wirecutters"))) {
		yield* this.dismantle(user, W);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);
