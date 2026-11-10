// Based on /tg/station's code/game/objects/structures/extinguisher.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12748, "/obj/structure/extinguisher_cabinet", "/obj/structure", {
	stored_extinguisher: null,
	opened: 0,
	anchored: 1,
	name: "extinguisher cabinet",
	desc: "A small wall mounted cabinet designed to hold a fire extinguisher.",
	icon: rt.rsc("icons/obj/wallmounts.dmi"),
	icon_state: "extinguisher_closed",
	density: 0,
	obj_integrity: 200,
	max_integrity: 200,
	integrity_failure: 50,
});

// extinguisher.dm:15
rt.def("/obj/structure/extinguisher_cabinet/proc/New", function* New(f: Frame, loc: Value, ndir: Value, building: Value) {
	let $0: any;
	yield* parent_proc();
	if (building) {
		yield* this.setDir(ndir);
		if (rt.bitAnd(this.dir, 3)) {
			$0 = 0;
		} else if (this.dir == 4) {
			$0 = -27;
		} else {
			$0 = 27;
		}
		this.pixel_x = $0;
		if (rt.bitAnd(this.dir, 3)) {
			if (this.dir == 1) {
				$0 = -30;
			} else {
				$0 = 30;
			}
		} else {
			$0 = 0;
		}
		this.pixel_y = $0;
		this.opened = 1;
		this.icon_state = "extinguisher_empty";
	} else {
		this.stored_extinguisher = (yield* new_(T("/obj/item/weapon/extinguisher"), this));
	}
	return f.dot;
}, true);

// extinguisher.dm:27
rt.def("/obj/structure/extinguisher_cabinet/proc/Destroy", function* Destroy(f: Frame) {
	if (this.stored_extinguisher) {
		yield* qdel(this.stored_extinguisher);
		this.stored_extinguisher = null;
	}
	return (yield* parent_proc());
}, true);

// extinguisher.dm:33
rt.def("/obj/structure/extinguisher_cabinet/proc/contents_explosion", function contents_explosion(f: Frame, severity: Value, target: Value) {
	if (!this.stored_extinguisher) return f.dot;
	this.stored_extinguisher.ex_act(severity, target);
	return f.dot;
});

// extinguisher.dm:36
rt.def("/obj/structure/extinguisher_cabinet/proc/handle_atom_del", function handle_atom_del(f: Frame, A: Value) {
	if (A != this.stored_extinguisher) return f.dot;
	this.stored_extinguisher = null;
	this.update_icon();
	return f.dot;
});

// extinguisher.dm:41
rt.def("/obj/structure/extinguisher_cabinet/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/weapon/wrench")) && !this.stored_extinguisher) {
		to_chat(user, `<span class='notice'>You start unsecuring ${this.name}...</span>`);
		playsound(this.loc, I.usesound, 50, 1);
		if (yield* do_after(user, 60 * I.toolspeed, { target: this })) {
			playsound(this.loc, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
			to_chat(user, `<span class='notice'>You unsecure ${this.name}.</span>`);
			yield* this.deconstruct(1);
		}
		return f.dot;
	}
	if (rt.istype(user, T("/mob/living/silicon/robot")) || rt.istype(user, T("/mob/living/carbon/alien"))) {
		return f.dot;
	}
	if (rt.istype(I, T("/obj/item/weapon/extinguisher"))) {
		if (!this.stored_extinguisher && this.opened) {
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			this.contents += I;
			this.stored_extinguisher = I;
			to_chat(user, `<span class='notice'>You place ${I} in ${this}.</span>`);
			yield* this.update_icon();
		} else {
			this.toggle_cabinet(user);
		}
	} else if (user.a_intent != "harm") {
		this.toggle_cabinet(user);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// extinguisher.dm:69
rt.def("/obj/structure/extinguisher_cabinet/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (rt.istype(user, T("/mob/living/silicon/robot")) || rt.istype(user, T("/mob/living/carbon/alien"))) {
		return f.dot;
	}
	if (this.stored_extinguisher) {
		yield* user.put_in_hands(this.stored_extinguisher);
		to_chat(user, `<span class='notice'>You take ${this.stored_extinguisher} from ${this}.</span>`);
		this.stored_extinguisher = null;
		if (!this.opened) {
			this.opened = 1;
			playsound(this.loc, rt.rsc("sound/machines/click.ogg"), 15, 1, -3);
		}
		yield* this.update_icon();
	} else {
		this.toggle_cabinet(user);
	}
	return f.dot;
}, true);

// extinguisher.dm:85
rt.def("/obj/structure/extinguisher_cabinet/proc/attack_tk", function* attack_tk(f: Frame, user: Value) {
	if (this.stored_extinguisher) {
		yield* this.stored_extinguisher.forceMove(this.loc);
		to_chat(user, `<span class='notice'>You telekinetically remove ${this.stored_extinguisher} from ${this}.</span>`);
		this.stored_extinguisher = null;
		this.opened = 1;
		playsound(this.loc, rt.rsc("sound/machines/click.ogg"), 15, 1, -3);
		yield* this.update_icon();
	} else {
		this.toggle_cabinet(user);
	}
	return f.dot;
}, true);

// extinguisher.dm:96
rt.def("/obj/structure/extinguisher_cabinet/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	yield* this.attack_hand(user);
	return f.dot;
}, true);

// extinguisher.dm:99
rt.def("/obj/structure/extinguisher_cabinet/proc/AltClick", function AltClick(f: Frame, user: Value) {
	if (user.incapacitated() || !this.Adjacent(user) || !rt.istype(user, T("/mob/living"))) {
		return f.dot;
	}
	this.toggle_cabinet(user);
	return f.dot;
});

// extinguisher.dm:104
rt.def("/obj/structure/extinguisher_cabinet/proc/toggle_cabinet", function toggle_cabinet(f: Frame, user: Value) {
	if (this.opened && this.broken) {
		to_chat(user, `<span class='warning'>${this} is broken open.</span>`);
	} else {
		playsound(this.loc, rt.rsc("sound/machines/click.ogg"), 15, 1, -3);
		this.opened = (!this.opened ? 1 : 0);
		this.update_icon();
	}
	return f.dot;
});

// extinguisher.dm:112
rt.def("/obj/structure/extinguisher_cabinet/proc/update_icon", function update_icon(f: Frame) {
	if (!this.opened) {
		this.icon_state = "extinguisher_closed";
		return f.dot;
	}
	if (this.stored_extinguisher) {
		if (rt.istype(this.stored_extinguisher, T("/obj/item/weapon/extinguisher/mini"))) {
			this.icon_state = "extinguisher_mini";
		} else {
			this.icon_state = "extinguisher_full";
		}
	} else {
		this.icon_state = "extinguisher_empty";
	}
	return f.dot;
});

// extinguisher.dm:124
rt.def("/obj/structure/extinguisher_cabinet/proc/obj_break", function* obj_break(f: Frame, damage_flag: Value) {
	if (!(!this.broken && !rt.bitAnd(this.flags, NODECONSTRUCT))) return f.dot;
	this.broken = 1;
	this.opened = 1;
	if (this.stored_extinguisher) {
		yield* this.stored_extinguisher.forceMove(this.loc);
		this.stored_extinguisher = null;
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// extinguisher.dm:134
rt.def("/obj/structure/extinguisher_cabinet/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		if (disassembled) {
			yield* new_(T("/obj/item/wallframe/extinguisher_cabinet"), this.loc);
		} else {
			yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, 2);
		}
		if (this.stored_extinguisher) {
			yield* this.stored_extinguisher.forceMove(this.loc);
			this.stored_extinguisher = null;
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);
