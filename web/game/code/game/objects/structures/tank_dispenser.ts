// Based on /tg/station's code/game/objects/structures/tank_dispenser.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12877, "/obj/structure/tank_dispenser", "/obj/structure", {
	oxygentanks: 10,
	plasmatanks: 10,
	anchored: 1,
	name: "tank dispenser",
	desc: "A simple yet bulky storage device for gas tanks. Holds up to 10 oxygen tanks and 10 plasma tanks.",
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "dispenser",
	density: 1,
	obj_integrity: 300,
	max_integrity: 300,
});

// tank_dispenser.dm:22
rt.def("/obj/structure/tank_dispenser/proc/Initialize", function* Initialize(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.dot = (yield* parent_proc());
	rt.forRange(f, 0, 1, this.oxygentanks, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/tank/internals/oxygen"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, this.plasmatanks, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/tank/internals/plasma"), this);
	}
	rt.endFor(f, 0);
	yield* this.update_icon();
	return f.dot;
}, true);

// tank_dispenser.dm:30
rt.def("/obj/structure/tank_dispenser/proc/update_icon", function update_icon(f: Frame) {
	this.cut_overlays();
	if (rt.inRange(this.oxygentanks, 1, 3)) {
		this.add_overlay(`oxygen-${this.oxygentanks}`);
	} else if (rt.inRange(this.oxygentanks, 4, 10)) {
		this.add_overlay("oxygen-4");
	}
	if (rt.inRange(this.plasmatanks, 1, 4)) {
		this.add_overlay(`plasma-${this.plasmatanks}`);
	} else if (rt.inRange(this.plasmatanks, 5, 10)) {
		this.add_overlay("plasma-5");
	}
	return f.dot;
});

// tank_dispenser.dm:44
rt.def("/obj/structure/tank_dispenser/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let full: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/tank/internals/plasma"))) {
		if (this.plasmatanks < 10) {
			this.plasmatanks++;
		} else {
			full = 1;
		}
	} else if (rt.istype(I, T("/obj/item/weapon/tank/internals/oxygen"))) {
		if (this.oxygentanks < 10) {
			this.oxygentanks++;
		} else {
			full = 1;
		}
	} else if (rt.istype(I, T("/obj/item/weapon/wrench"))) {
		yield* this.default_unfasten_wrench(user, I, { time: 20 });
		return f.dot;
	} else if (user.a_intent != "harm") {
		to_chat(user, `<span class='notice'>${I} does not fit into ${this}.</span>`);
		return f.dot;
	} else {
		return (yield* parent_proc());
	}
	if (full) {
		to_chat(user, `<span class='notice'>${this} can't hold any more of ${I}.</span>`);
		return f.dot;
	}
	if (!(yield* user.drop_item())) {
		return f.dot;
	}
	I.loc = this;
	to_chat(user, `<span class='notice'>You put ${I} in ${this}.</span>`);
	yield* this.update_icon();
	return f.dot;
}, true);

// tank_dispenser.dm:74
rt.def("/obj/structure/tank_dispenser/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.physical_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "tank_dispenser", this.name, 275, 100, master_ui, state))).open();
	return f.dot;
}, true);

// tank_dispenser.dm:80
rt.def("/obj/structure/tank_dispenser/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null;
	rt.setAt((data = list()), "oxygen", this.oxygentanks);
	rt.setAt(data, "plasma", this.plasmatanks);
	return data;
});

// tank_dispenser.dm:87
rt.def("/obj/structure/tank_dispenser/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let tank: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "plasma") {
		if ((tank = rt.locateIn(f, T("/obj/item/weapon/tank/internals/plasma"), this)) && this.Adjacent(f.usr)) {
			yield* f.usr.put_in_hands(tank);
			this.plasmatanks--;
		}
		f.dot = 1;
	} else if (action === "oxygen") {
		if ((tank = rt.locateIn(f, T("/obj/item/weapon/tank/internals/oxygen"), this)) && this.Adjacent(f.usr)) {
			yield* f.usr.put_in_hands(tank);
			this.oxygentanks--;
		}
		f.dot = 1;
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// tank_dispenser.dm:106
rt.def("/obj/structure/tank_dispenser/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let X: Value = null, I: Value = null;
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		for (X of each(this)) {
			yield* (I = X).forceMove(this.loc);
		}
		yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, 2);
	}
	yield* qdel(this);
	return f.dot;
}, true);
