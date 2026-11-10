// Based on /tg/station's code/game/machinery/cell_charger.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10784, "/obj/machinery/cell_charger", "/obj/machinery", {
	charging: null,
	chargelevel: -1,
	anchored: 1,
	name: "cell charger",
	desc: "It charges power cells.",
	icon: rt.rsc("icons/obj/power.dmi"),
	icon_state: "ccharger0",
	use_power: 1,
	idle_power_usage: 5,
	active_power_usage: 60,
	power_channel: 1,
});

// cell_charger.dm:15
rt.def("/obj/machinery/cell_charger/proc/updateicon", function updateicon(f: Frame) {
	let newlevel: Value = null;
	this.icon_state = `ccharger${this.charging ? 1 : 0}`;
	if (this.charging && !rt.bitAnd(this.stat, 3)) {
		newlevel = round(this.charging.percent() * 4 / 100);
		if (this.chargelevel != newlevel) {
			this.chargelevel = newlevel;
			this.cut_overlays();
			this.add_overlay(`ccharger-o${newlevel}`);
		}
	} else {
		this.cut_overlays();
	}
	return f.dot;
});

// cell_charger.dm:30
rt.def("/obj/machinery/cell_charger/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	let $0: any = user;
	to_chat($0, `There's ${this.charging ? "a" : "no"} cell in the charger.`);
	if (!this.charging) return f.dot;
	to_chat(user, `Current charge: ${round(this.charging.percent(), 1)}%`);
	return f.dot;
}, false);

// cell_charger.dm:36
rt.def("/obj/machinery/cell_charger/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let a: Value = null;
	let $0: any, $1: any;
	if (rt.istype(W, T("/obj/item/weapon/stock_parts/cell"))) {
		if (rt.bitAnd(this.stat, 1)) {
			to_chat(user, `<span class='warning'>${this} is broken!</span>`);
			return f.dot;
		}
		if (!this.anchored) {
			to_chat(user, `<span class='warning'>${this} isn't attached to the ground!</span>`);
			return f.dot;
		}
		if (this.charging) {
			to_chat(user, "<span class='warning'>There is already a cell in the charger!</span>");
			return f.dot;
		} else {
			if (!isarea((a = this.loc.loc))) {
				return f.dot;
			}
			if (a.power_equip == 0) {
				to_chat(user, `<span class='warning'>The ${this.name} blinks red as you try to insert the cell!</span>`);
				return f.dot;
			}
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			W.loc = this;
			this.charging = W;
			user.visible_message(`${user} inserts a cell into the charger.`, "<span class='notice'>You insert a cell into the charger.</span>");
			this.chargelevel = -1;
			this.updateicon();
		}
	} else if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
		if (this.charging) {
			to_chat(user, "<span class='warning'>Remove the cell first!</span>");
			return f.dot;
		}
		this.anchored = (!this.anchored ? 1 : 0);
		$0 = user;
		if (this.anchored) {
			$1 = "attach";
		} else {
			$1 = "detach";
		}
		to_chat($0, `<span class='notice'>You ${$1} the cell charger ${this.anchored ? "to" : "from"} the ground</span>`);
		playsound(this.loc, W.usesound, 75, 1);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// cell_charger.dm:74
rt.def("/obj/machinery/cell_charger/proc/removecell", function removecell(f: Frame) {
	this.charging.update_icon();
	this.charging = null;
	this.chargelevel = -1;
	this.updateicon();
	return f.dot;
});

// cell_charger.dm:80
rt.def("/obj/machinery/cell_charger/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (!this.charging) {
		return f.dot;
	}
	yield* user.put_in_hands(this.charging);
	yield* this.charging.add_fingerprint(user);
	user.visible_message(`${user} removes the cell from the charger.`, "<span class='notice'>You remove the cell from the charger.</span>");
	this.removecell();
	return f.dot;
}, true);

// cell_charger.dm:91
rt.def("/obj/machinery/cell_charger/proc/attack_tk", function* attack_tk(f: Frame, user: Value) {
	if (!this.charging) {
		return f.dot;
	}
	yield* this.charging.forceMove(this.loc);
	to_chat(user, `<span class='notice'>You telekinetically remove ${this.charging} from ${this}.</span>`);
	this.removecell();
	return f.dot;
}, true);

// cell_charger.dm:103
rt.def("/obj/machinery/cell_charger/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	if (this.charging) {
		yield* this.charging.emp_act(severity);
	}
	yield* parent_proc(severity);
	return f.dot;
}, true);

// cell_charger.dm:113
rt.def("/obj/machinery/cell_charger/proc/process", function* process(f: Frame) {
	if (!this.charging || !this.anchored || rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	if (this.charging.percent() >= 100) {
		return f.dot;
	}
	yield* this.use_power(200);
	yield* this.charging.give(175);
	this.updateicon();
	return f.dot;
}, true, { waitfor: false });
