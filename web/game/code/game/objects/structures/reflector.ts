// Based on /tg/station's code/game/objects/structures/reflector.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(12861, "/obj/structure/reflector", "/obj/structure", {
	finished: 0,
	admin: 0,
	framebuildstacktype: rt.typePath("/obj/item/stack/sheet/metal"),
	framebuildstackamount: 5,
	buildstacktype: rt.typePath("/obj/item/stack/sheet/metal"),
	buildstackamount: 0,
	anchored: 0,
	name: "reflector frame",
	icon: rt.rsc("icons/obj/stock_parts.dmi"),
	icon_state: "box_0",
	desc: "An angled mirror for reflecting lasers. This one does so at a 90 degree angle.",
	density: 1,
	layer: 2.9,
});

// reflector.dm:17
rt.def("/obj/structure/reflector/proc/bullet_act", function* bullet_act(f: Frame, P: Value) {
	let reflect_turf: Value = null;
	let reflector_turf: Value = rt.getStep(f, this, 0);
	let new_dir: Value = this.get_reflection(this.dir, P.dir);
	if (!rt.istype(P, T("/obj/item/projectile/beam"))) {
		return (yield* parent_proc());
	}
	if (new_dir) {
		reflect_turf = rt.getStep(f, reflect_turf, new_dir);
	} else {
		this.visible_message(`<span class='notice'>${this} is hit by the ${P}!</span>`);
		new_dir = 0;
		return (yield* parent_proc());
	}
	reflect_turf = rt.getStep(f, this.loc, new_dir);
	P.original = reflect_turf;
	P.starting = reflector_turf;
	P.current = reflector_turf;
	P.yo = reflect_turf.y - reflector_turf.y;
	P.xo = reflect_turf.x - reflector_turf.x;
	P.range = rt.initial(f, P, "range");
	new_dir = 0;
	return -1;
}, true);

// reflector.dm:44
rt.def("/obj/structure/reflector/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let WT: Value = null, S: Value = null;
	if (this.admin) {
		return f.dot;
	}
	if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
		if (this.anchored) {
			to_chat(user, `Unweld the ${this} first!`);
		}
		if (yield* do_after(user, 80 * W.toolspeed, { target: this })) {
			playsound(this.loc, W.usesound, 50, 1);
			to_chat(user, `You dismantle the ${this}.`);
			yield* new_(this.framebuildstacktype, this.loc, this.framebuildstackamount);
			yield* new_(this.buildstacktype, this.loc, this.buildstackamount);
			yield* qdel(this);
		}
	} else if (rt.istype(W, T("/obj/item/weapon/weldingtool"))) {
		WT = W;
		if (this.anchored === 0) {
			if (yield* WT.remove_fuel(0, user)) {
				playsound(this.loc, rt.rsc("sound/items/welder2.ogg"), 50, 1);
				user.visible_message(`${user.name} starts to weld the ${this.name} to the floor.`, fmt("<span class='notice'>You start to weld ％！ to the floor...</span>", [this]), "<span class='italics'>You hear welding.</span>");
				if (yield* do_after(user, 20 * W.toolspeed, { target: this })) {
					if (!this || !WT.isOn()) {
						return f.dot;
					}
					this.anchored = 1;
					to_chat(user, fmt("<span class='notice'>You weld ％！ to the floor.</span>", [this]));
				}
			}
		} else if (this.anchored === 1) {
			if (yield* WT.remove_fuel(0, user)) {
				playsound(this.loc, rt.rsc("sound/items/welder2.ogg"), 50, 1);
				user.visible_message(`${user.name} starts to cut the ${this.name} free from the floor.`, fmt("<span class='notice'>You start to cut ％！ free from the floor...</span>", [this]), "<span class='italics'>You hear welding.</span>");
				if (yield* do_after(user, 20 * W.toolspeed, { target: this })) {
					if (!this || !WT.isOn()) {
						return f.dot;
					}
					this.anchored = 0;
					to_chat(user, fmt("<span class='notice'>You cut ％！ free from the floor.</span>", [this]));
				}
			}
		}
	} else if (rt.istype(W, T("/obj/item/stack/sheet"))) {
		if (this.finished) {
			return f.dot;
		}
		S = W;
		if (rt.istype(W, T("/obj/item/stack/sheet/glass"))) {
			if (S.get_amount() < 5) {
				to_chat(user, "<span class='warning'>You need five sheets of glass to create a reflector!</span>");
				return f.dot;
			} else {
				yield* S.use(5);
				yield* new_(T("/obj/structure/reflector/single"), this.loc);
				yield* qdel(this);
			}
		}
		if (rt.istype(W, T("/obj/item/stack/sheet/rglass"))) {
			if (S.get_amount() < 10) {
				to_chat(user, "<span class='warning'>You need ten sheets of reinforced glass to create a double reflector!</span>");
				return f.dot;
			} else {
				yield* S.use(10);
				yield* new_(T("/obj/structure/reflector/double"), this.loc);
				yield* qdel(this);
			}
		}
		if (rt.istype(W, T("/obj/item/stack/sheet/mineral/diamond"))) {
			if (S.get_amount() >= 1) {
				yield* S.use(1);
				yield* new_(T("/obj/structure/reflector/box"), this.loc);
				yield* qdel(this);
			}
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// reflector.dm:116
rt.def("/obj/structure/reflector/verb/rotate", function rotate(f: Frame) {
	if (f.usr.stat || !f.usr.canmove || f.usr.restrained()) {
		return f.dot;
	}
	if (this.anchored) {
		to_chat(f.usr, "<span class='warning'>It is fastened to the floor!</span>");
		return 0;
	}
	this.setDir(turn(this.dir, 270));
	return 1;
}, false, { verb: { name: "Rotate", category: "Object", src: 3, range: 1 } });

// reflector.dm:126
rt.def("/obj/structure/reflector/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	yield* parent_proc();
	if (!(yield* user.canUseTopic(this, { be_close: 1 }))) {
		to_chat(user, "<span class='warning'>You can't do that right now!</span>");
		return f.dot;
	} else {
		yield* this.rotate();
	}
	return f.dot;
}, true);

rt.type(12862, "/obj/structure/reflector/single", "/obj/structure/reflector", {
	finished: 1,
	buildstacktype: rt.typePath("/obj/item/stack/sheet/glass"),
	buildstackamount: 5,
	name: "reflector",
	icon: rt.rsc("icons/obj/structures.dmi"),
	icon_state: "reflector",
	desc: "A double sided angled mirror for reflecting lasers. This one does so at a 90 degree angle.",
}, { global: { rotations: 801 } });

// reflector.dm:152
rt.def("/obj/structure/reflector/single/proc/get_reflection", function get_reflection(f: Frame, srcdir: Value, pdir: Value) {
	let new_dir: Value = null;
	return (new_dir = rt.index(rt.index(GLOB.rotations, `${srcdir}`), `${pdir}`));
});

rt.type(12864, "/obj/structure/reflector/double", "/obj/structure/reflector", {
	finished: 1,
	buildstacktype: rt.typePath("/obj/item/stack/sheet/rglass"),
	buildstackamount: 10,
	name: "double sided reflector",
	icon: rt.rsc("icons/obj/structures.dmi"),
	icon_state: "reflector_double",
	desc: "A double sided angled mirror for reflecting lasers. This one does so at a 90 degree angle.",
}, { global: { double_rotations: 802 } });

// reflector.dm:175
rt.def("/obj/structure/reflector/double/proc/get_reflection", function get_reflection(f: Frame, srcdir: Value, pdir: Value) {
	let new_dir: Value = null;
	return (new_dir = rt.index(rt.index(GLOB.double_rotations, `${srcdir}`), `${pdir}`));
});

rt.type(12866, "/obj/structure/reflector/box", "/obj/structure/reflector", {
	finished: 1,
	buildstacktype: rt.typePath("/obj/item/stack/sheet/mineral/diamond"),
	buildstackamount: 1,
	name: "reflector box",
	icon: rt.rsc("icons/obj/structures.dmi"),
	icon_state: "reflector_box",
	desc: "A box with an internal set of mirrors that reflects all laser fire in a single direction.",
}, { global: { box_rotations: 803 } });

// reflector.dm:198
rt.def("/obj/structure/reflector/box/proc/get_reflection", function get_reflection(f: Frame, srcdir: Value, pdir: Value) {
	let new_dir: Value = null;
	return (new_dir = rt.index(rt.index(GLOB.box_rotations, `${srcdir}`), `${pdir}`));
});

// reflector.dm:208
rt.def("/obj/structure/reflector/proc/ex_act", function ex_act(f: Frame) {
	if (this.admin) {
		return f.dot;
	} else {
		parent_proc();
	}
	return f.dot;
}, false, { waitfor: false });

// reflector.dm:215
rt.def("/obj/structure/reflector/proc/singularity_act", function* singularity_act(f: Frame) {
	if (this.admin) {
		return f.dot;
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);
