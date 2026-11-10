// Based on /tg/station's code/game/objects/items/weapons/holosign_creator.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(7234, "/obj/item/weapon/holosign_creator", "/obj/item/weapon", {
	signs: null,
	max_signs: 10,
	creation_time: 0,
	holocreator_busy: 0,
	holosign_type: rt.typePath("/obj/structure/holosign/wetsign"),
	throw_speed: 3,
	throw_range: 7,
	flags: 4,
	name: "holographic sign projector",
	desc: "A handy-dandy holographic projector that displays a janitorial sign.",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "signmaker",
	item_state: "electronic",
	force: 0,
	w_class: 2,
	throwforce: 0,
	origin_tech: "magnets=1;programming=3",
});

// holosign_creator.dm:14
rt.def("/obj/item/weapon/holosign_creator/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.signs = list();
	return f.dot;
});

// holosign_creator.dm:22
rt.def("/obj/item/weapon/holosign_creator/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, flag: Value) {
	let H: Value = null;
	if (!flag) return f.dot;
	if (!this.check_allowed_items(target, 1)) {
		return f.dot;
	}
	let _T: Value = rt.getStep(f, target, 0);
	if (H = rt.locateIn(f, this.holosign_type, _T)) {
		to_chat(user, `<span class='notice'>You use ${this} to deactivate ${H}.</span>`);
		yield* qdel(H);
	} else {
		if (is_blocked_turf(_T, 1)) return f.dot;
		if (this.holocreator_busy) {
			to_chat(user, `<span class='notice'>${this} is busy creating a hologram.</span>`);
			return f.dot;
		}
		if (rt.len(f, this.signs) < this.max_signs) {
			playsound(this.loc, rt.rsc("sound/machines/click.ogg"), 20, 1);
			if (this.creation_time) {
				this.holocreator_busy = 1;
				if (!(yield* do_after(user, this.creation_time, { target: target }))) {
					this.holocreator_busy = 0;
					return f.dot;
				}
				this.holocreator_busy = 0;
				if (rt.len(f, this.signs) >= this.max_signs) {
					return f.dot;
				}
				if (is_blocked_turf(_T, 1)) {
					return f.dot;
				}
			}
			H = (yield* new_(this.holosign_type, rt.getStep(f, target, 0), this));
			to_chat(user, fmt("<span class='notice'>You create ＇！ with ＀.</span>", [H, this]));
		} else {
			to_chat(user, `<span class='notice'>${this} is projecting at max capacity!</span>`);
		}
	}
	return f.dot;
}, true);

// holosign_creator.dm:55
rt.def("/obj/item/weapon/holosign_creator/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let H: Value = null;
	if (!rt.len(f, this.signs)) return f.dot;
	for (H of each(this.signs)) {
		yield* qdel(H);
	}
	to_chat(user, "<span class='notice'>You clear all active holograms.</span>");
	return f.dot;
}, true);

rt.type(7238, "/obj/item/weapon/holosign_creator/cyborg", "/obj/item/weapon/holosign_creator", {
	shock: 0,
	creation_time: 15,
	max_signs: 9,
	name: "Energy Barrier Projector",
	desc: "A holographic projector that creates fragile energy fields",
	holosign_type: rt.typePath("/obj/structure/holosign/barrier/cyborg"),
});

// holosign_creator.dm:94
rt.def("/obj/item/weapon/holosign_creator/cyborg/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let R: Value = null, H: Value = null, H_0: Value = null;
	if (rt.istype(user, T("/mob/living/silicon/robot"))) {
		R = user;
		if (this.shock) {
			to_chat(user, "<span class='notice'>You clear all active holograms, and reset your projector to normal.</span>");
			this.holosign_type = T("/obj/structure/holosign/barrier/cyborg");
			this.creation_time = 5;
			if (rt.len(f, this.signs)) {
				for (H of each(this.signs)) {
					yield* qdel(H);
				}
			}
			this.shock = 0;
			return f.dot;
		} else if (R.emagged && !this.shock) {
			to_chat(user, "<span class='warning'>You clear all active holograms, and overload your energy projector!</span>");
			this.holosign_type = T("/obj/structure/holosign/barrier/cyborg/hacked");
			this.creation_time = 30;
			if (rt.len(f, this.signs)) {
				H = null;
				for (H of each(this.signs)) {
					yield* qdel(H);
				}
			}
			this.shock = 1;
			return f.dot;
		} else if (rt.len(f, this.signs)) {
			H = null;
			for (H of each(this.signs)) {
				yield* qdel(H);
			}
			to_chat(user, "<span class='notice'>You clear all active holograms.</span>");
		}
	}
	if (!rt.len(f, this.signs)) return f.dot;
	for (H_0 of each(this.signs)) {
		yield* qdel(H_0);
	}
	to_chat(user, "<span class='notice'>You clear all active holograms.</span>");
	return f.dot;
}, true);
