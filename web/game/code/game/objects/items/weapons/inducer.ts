// Based on /tg/station's code/game/objects/items/weapons/inducer.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(7267, "/obj/item/weapon/inducer", "/obj/item/weapon", {
	powertransfer: 1000,
	opened: 0,
	cell_type: rt.typePath("/obj/item/weapon/stock_parts/cell/high"),
	cell: null,
	recharging: 0,
	name: "inducer",
	desc: "A tool for inductively charging internal power cells.",
	icon: rt.rsc("icons/obj/tools.dmi"),
	icon_state: "inducer-engi",
	item_state: "inducer-engi",
	origin_tech: "engineering=4;magnets=4;powerstorage=4",
	force: 7,
});

// inducer.dm:16
rt.def("/obj/item/weapon/inducer/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!(!this.cell && this.cell_type)) return f.dot;
	this.cell = (yield* new_(this.cell_type));
	return f.dot;
}, true);

// inducer.dm:21
rt.def("/obj/item/weapon/inducer/proc/induce", function* induce(f: Frame, target: Value, coefficient: Value) {
	let totransfer: Value = min(this.cell.charge, this.powertransfer * coefficient);
	let transferred: Value = (yield* target.give(totransfer));
	yield* this.cell.use(transferred);
	yield* this.cell.update_icon();
	yield* target.update_icon();
	return f.dot;
}, true);

// inducer.dm:31
rt.def("/obj/item/weapon/inducer/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	yield* parent_proc();
	if (!this.cell) return f.dot;
	yield* this.cell.emp_act(severity);
	return f.dot;
}, true);

// inducer.dm:36
rt.def("/obj/item/weapon/inducer/proc/attack_obj", function* attack_obj(f: Frame, O: Value, user: Value) {
	if (user.a_intent == "harm") {
		return (yield* parent_proc());
	}
	if (this.cantbeused(user)) {
		return f.dot;
	}
	if (yield* this.recharge(O, user)) {
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// inducer.dm:48
rt.def("/obj/item/weapon/inducer/proc/cantbeused", function cantbeused(f: Frame, user: Value) {
	if (!user.IsAdvancedToolUser()) {
		to_chat(user, fmt("<span class='warning'>You don't have the dexterity to use ％！!</span>", [this]));
		return 1;
	}
	if (!this.cell) {
		to_chat(user, fmt("<span class='warning'>＄！ doesn't have a power cell installed!</span>", [this]));
		return 1;
	}
	if (!this.cell.charge) {
		to_chat(user, fmt("<span class='warning'>＄！'s battery is dead!</span>", [this]));
		return 1;
	}
	return 0;
});

// inducer.dm:63
rt.def("/obj/item/weapon/inducer/proc/attackby", function* attackby(f: Frame, W: Value, user: Value) {
	if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
		playsound(this, W.usesound, 50, 1);
		if (!this.opened) {
			to_chat(user, "<span class='notice'>You unscrew the battery compartment.</span>");
			this.opened = 1;
			yield* this.update_icon();
			return f.dot;
		} else {
			to_chat(user, "<span class='notice'>You close the battery compartment.</span>");
			this.opened = 0;
			yield* this.update_icon();
			return f.dot;
		}
	}
	if (rt.istype(W, T("/obj/item/weapon/stock_parts/cell"))) {
		if (this.opened) {
			if (!this.cell) {
				if (!(yield* user.transferItemToLoc(W, this))) {
					return f.dot;
				}
				to_chat(user, fmt("<span class='notice'>You insert ％！ into ％！.</span>", [W, this]));
				this.cell = W;
				yield* this.update_icon();
				return f.dot;
			} else {
				to_chat(user, fmt("<span class='notice'>＄！ already has ＇！ installed!</span>", [this, this.cell]));
				return f.dot;
			}
		}
	}
	if (this.cantbeused(user)) {
		return f.dot;
	}
	if (yield* this.recharge(W, user)) {
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// inducer.dm:98
rt.def("/obj/item/weapon/inducer/proc/recharge", function* recharge(f: Frame, A: Value, user: Value) {
	let E: Value = null, O: Value = null;
	if (this.recharging) {
		return 1;
	} else {
		this.recharging = 1;
	}
	let C: Value = A.get_cell();
	let coefficient: Value = 1;
	if (rt.istype(A, T("/obj/item/weapon/gun/energy"))) {
		coefficient = 0.075;
		E = A;
	}
	if (rt.istype(A, T("/obj"))) {
		O = A;
	}
	if (C) {
		if (C.charge >= C.maxcharge) {
			to_chat(user, fmt("<span class='notice'>＄！ is fully charged!</span>", [A]));
			this.recharging = 0;
			return 1;
		}
		user.visible_message(fmt("＀ starts recharging ％！ with ％！", [user, A, this]), fmt("<span class='notice'>You start recharging ＀ with ％！</span>", [A, this]));
		while (C.charge < C.maxcharge) {
			if (E) {
				E.chambered = null;
			}
			// tg read this.cell.charge with no null check: a cell taken out mid-charge killed the proc with `recharging` still set.
			if ((yield* do_after(user, 10, { target: user })) && this.cell && this.cell.charge) {
				yield* this.induce(C, coefficient);
				yield* do_sparks(1, 0, A);
				if (O) {
					yield* O.update_icon();
				}
			} else {
				break;
			}
		}
		if (E) {
			yield* E.recharge_newshot();
		}
		user.visible_message(fmt("＀ recharged ％！!", [user, A]), fmt("<span class='notice'>You recharged ％！!</span>", [A]));
		this.recharging = 0;
		return 1;
	}
	this.recharging = 0;
	return f.dot;
}, true);

// inducer.dm:135
rt.def("/obj/item/weapon/inducer/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	if (user.a_intent == "harm") {
		return (yield* parent_proc());
	}
	if (this.cantbeused(user)) {
		return f.dot;
	}
	if (yield* this.recharge(M, user)) {
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// inducer.dm:147
rt.def("/obj/item/weapon/inducer/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (!(this.opened && this.cell)) return f.dot;
	user.visible_message(fmt("＀ removes ％！ from ％！!", [user, this.cell, this]), fmt("<span class='notice'>You remove ％！.</span>", [this.cell]));
	yield* this.cell.update_icon();
	yield* user.put_in_hands(this.cell);
	this.cell = null;
	yield* this.update_icon();
	return f.dot;
}, true);

// inducer.dm:156
rt.def("/obj/item/weapon/inducer/proc/examine", function examine(f: Frame, M: Value) {
	parent_proc();
	if (this.cell) {
		to_chat(M, `<span class='notice'>It's display shows: ${this.cell.charge}W</span>`);
	} else {
		to_chat(M, "<span class='notice'>It's display is dark.</span>");
	}
	if (!this.opened) return f.dot;
	to_chat(M, "<span class='notice'>It's battery compartment is open.</span>");
	return f.dot;
}, false);

// inducer.dm:165
rt.def("/obj/item/weapon/inducer/proc/update_icon", function update_icon(f: Frame) {
	this.cut_overlays();
	if (!this.opened) return f.dot;
	if (!this.cell) {
		this.add_overlay("inducer-nobat");
	} else {
		this.add_overlay("inducer-bat");
	}
	return f.dot;
});

rt.type(7268, "/obj/item/weapon/inducer/sci", "/obj/item/weapon/inducer", {
	cell_type: null,
	powertransfer: 500,
	opened: 1,
	icon_state: "inducer-sci",
	item_state: "inducer-sci",
	desc: "A tool for inductively charging internal power cells. This one has a science color scheme, and is less potent than it's engineering counterpart.",
});

// inducer.dm:181
rt.def("/obj/item/weapon/inducer/sci/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.update_icon();
	return f.dot;
}, true);
