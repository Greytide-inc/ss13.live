// Based on /tg/station's code/game/machinery/PDApainter.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, add, fmt } = rt;


rt.type(10810, "/obj/machinery/pdapainter", "/obj/machinery", {
	storedpda: null,
	colorlist: null,
	anchored: 1,
	name: "１PDA painter",
	desc: "A PDA painting machine. To use, simply insert your PDA and choose the desired preset paint scheme.",
	icon: rt.rsc("icons/obj/pda.dmi"),
	icon_state: "pdapainter",
	density: 1,
	obj_integrity: 200,
	max_integrity: 200,
});

// PDApainter.dm:9
rt.def("/obj/machinery/pdapainter/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.colorlist = list();
	return f.dot;
});

// PDApainter.dm:15
rt.def("/obj/machinery/pdapainter/proc/update_icon", function update_icon(f: Frame) {
	this.cut_overlays();
	if (rt.bitAnd(this.stat, 1)) {
		this.icon_state = `${rt.initial(f, this, "icon_state")}-broken`;
		return f.dot;
	}
	if (this.storedpda) {
		this.add_overlay(`${rt.initial(f, this, "icon_state")}-closed`);
	}
	if (this.powered()) {
		this.icon_state = rt.initial(f, this, "icon_state");
	} else {
		this.icon_state = `${rt.initial(f, this, "icon_state")}-off`;
	}
	return f.dot;
});

// PDApainter.dm:32
rt.def("/obj/machinery/pdapainter/proc/New", function* New(f: Frame) {
	let _P: Value = null, D: Value = null;
	yield* parent_proc();
	let blocked: Value = list(T("/obj/item/device/pda/ai/pai"), T("/obj/item/device/pda/ai"), T("/obj/item/device/pda/heads"), T("/obj/item/device/pda/clear"), T("/obj/item/device/pda/syndicate"));
	for (_P of each(typesof(T("/obj/item/device/pda")) - blocked)) {
		(D = (yield* new_(_P))).name = D.icon_state;
		rt.modField(f, this, "colorlist", D, add);
	}
	return f.dot;
}, true);

// PDApainter.dm:46
rt.def("/obj/machinery/pdapainter/proc/Destroy", function* Destroy(f: Frame) {
	if (this.storedpda) {
		yield* qdel(this.storedpda);
		this.storedpda = null;
	}
	return (yield* parent_proc());
}, true);

// PDApainter.dm:52
rt.def("/obj/machinery/pdapainter/proc/on_deconstruction", function* on_deconstruction(f: Frame) {
	if (!this.storedpda) return f.dot;
	yield* this.storedpda.forceMove(this.loc);
	this.storedpda = null;
	return f.dot;
}, true);

// PDApainter.dm:57
rt.def("/obj/machinery/pdapainter/proc/contents_explosion", function contents_explosion(f: Frame, severity: Value, target: Value) {
	if (!this.storedpda) return f.dot;
	this.storedpda.ex_act(severity, target);
	return f.dot;
});

// PDApainter.dm:60
rt.def("/obj/machinery/pdapainter/proc/handle_atom_del", function handle_atom_del(f: Frame, A: Value) {
	if (A != this.storedpda) return f.dot;
	this.storedpda = null;
	this.update_icon();
	return f.dot;
});

// PDApainter.dm:65
rt.def("/obj/machinery/pdapainter/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	let _P: Value = null, WT: Value = null;
	if (yield* this.default_unfasten_wrench(user, O)) {
		yield* this.power_change();
		return f.dot;
	} else if (rt.istype(O, T("/obj/item/device/pda"))) {
		if (this.storedpda) {
			to_chat(user, "<span class='warning'>There is already a PDA inside!</span>");
			return f.dot;
		} else if (rt.istype((_P = user.get_active_held_item()), T("/obj/item/device/pda"))) {
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			this.storedpda = _P;
			_P.loc = this;
			yield* _P.add_fingerprint(user);
			yield* this.update_icon();
		}
	} else if (rt.istype(O, T("/obj/item/weapon/weldingtool")) && user.a_intent != "harm") {
		WT = O;
		if (rt.bitAnd(this.stat, 1)) {
			if (yield* WT.remove_fuel(0, user)) {
				user.visible_message(`${user} is repairing ${this}.`, `<span class='notice'>You begin repairing ${this}...</span>`, "<span class='italics'>You hear welding.</span>");
				playsound(this.loc, WT.usesound, 40, 1);
				if (yield* do_after(user, 40 * WT.toolspeed, 1, { target: this })) {
					if (!WT.isOn() || !rt.bitAnd(this.stat, 1)) {
						return f.dot;
					}
					to_chat(user, `<span class='notice'>You repair ${this}.</span>`);
					playsound(this.loc, rt.rsc("sound/items/welder2.ogg"), 50, 1);
					(rt.modSrcVar(f, "stat", 16777214, rt.bitAnd));
					this.obj_integrity = this.max_integrity;
					yield* this.update_icon();
				}
			}
		} else {
			to_chat(user, `<span class='notice'>${this} does not need repairs.</span>`);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// PDApainter.dm:105
rt.def("/obj/machinery/pdapainter/proc/deconstruct", function deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	if (rt.bitAnd(this.flags, NODECONSTRUCT)) return f.dot;
	if (rt.bitAnd(this.stat, 1)) return f.dot;
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	this.update_icon();
	return f.dot;
});

// PDApainter.dm:111
rt.def("/obj/machinery/pdapainter/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let _P: Value = null;
	if (yield* parent_proc()) return f.dot;
	yield* this.add_fingerprint(user);
	if (this.storedpda) {
		if (!(_P = (yield* g.op(f, "Prompt", [1], [null, "PDA Painting", "Select your color!", user, this.colorlist])))) {
			return f.dot;
		}
		if (!(get_dist(this, user) <= 1)) {
			return f.dot;
		}
		if (!this.storedpda) {
			return f.dot;
		}
		this.storedpda.icon_state = _P.icon_state;
		this.storedpda.desc = _P.desc;
		this.ejectpda();
	} else {
		to_chat(user, fmt("<span class='notice'>＄！ is empty.</span>", [this]));
	}
	return f.dot;
}, true);

// PDApainter.dm:136
rt.def("/obj/machinery/pdapainter/verb/ejectpda", function ejectpda(f: Frame) {
	if (f.usr.stat || f.usr.restrained() || !f.usr.canmove) {
		return f.dot;
	}
	if (this.storedpda) {
		this.storedpda.loc = rt.getStep(f, this.loc, 0);
		this.storedpda = null;
		this.update_icon();
	} else {
		to_chat(f.usr, `<span class='notice'>The ${this} is empty.</span>`);
	}
	return f.dot;
}, false, { verb: { name: "Eject PDA", category: "Object", src: 3, range: 1 } });

// PDApainter.dm:148
rt.def("/obj/machinery/pdapainter/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	this.update_icon();
	return f.dot;
});
