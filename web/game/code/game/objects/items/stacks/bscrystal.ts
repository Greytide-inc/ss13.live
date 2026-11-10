// Based on /tg/station's code/game/objects/items/stacks/bscrystal.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(7037, "/obj/item/weapon/ore/bluespace_crystal", "/obj/item/weapon/ore", {
	blink_range: 8,
	name: "bluespace crystal",
	desc: "A glowing bluespace crystal, not much is known about how they work. It looks very delicate.",
	icon: rt.rsc("icons/obj/telescience.dmi"),
	icon_state: "bluespace_crystal",
	w_class: 1,
	materials: null,
	origin_tech: "bluespace=6;materials=3",
	points: 50,
	refined_type: rt.typePath("/obj/item/stack/sheet/bluespace_crystal"),
});

// bscrystal.dm:8
rt.def("/obj/item/weapon/ore/bluespace_crystal/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$bluespace", 2000]);
	return f.dot;
});

// bscrystal.dm:20
rt.def("/obj/item/weapon/ore/bluespace_crystal/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.pixel_x = rand(-5, 5);
	this.pixel_y = rand(-5, 5);
	return f.dot;
}, true);

// bscrystal.dm:25
rt.def("/obj/item/weapon/ore/bluespace_crystal/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	user.visible_message(`<span class='warning'>${user} crushes ${this}!</span>`, `<span class='danger'>You crush ${this}!</span>`);
	yield* new_(T("/obj/effect/particle_effect/sparks"), this.loc);
	playsound(this.loc, "sparks", 50, 1);
	yield* this.blink_mob(user);
	yield* qdel(this);
	return f.dot;
}, true);

// bscrystal.dm:32
rt.def("/obj/item/weapon/ore/bluespace_crystal/proc/blink_mob", function* blink_mob(f: Frame, L: Value) {
	yield* do_teleport(L, rt.getStep(f, L, 0), this.blink_range, { asoundin: rt.rsc("sound/effects/phasein.ogg") });
	return f.dot;
}, true);

// bscrystal.dm:35
rt.def("/obj/item/weapon/ore/bluespace_crystal/proc/throw_impact", function* throw_impact(f: Frame, hit_atom: Value) {
	let _T: Value = null;
	if (yield* parent_proc()) return f.dot;
	this.visible_message(`<span class='notice'>${this} fizzles and disappears upon impact!</span>`);
	yield* new_(T("/obj/effect/particle_effect/sparks"), (_T = rt.getStep(f, hit_atom, 0)));
	playsound(this.loc, "sparks", 50, 1);
	if (rt.istype(hit_atom, T("/mob/living"))) {
		yield* this.blink_mob(hit_atom);
	}
	yield* qdel(this);
	return f.dot;
}, true, { waitfor: false });

rt.type(7039, "/obj/item/weapon/ore/bluespace_crystal/artificial", "/obj/item/weapon/ore/bluespace_crystal", {
	blink_range: 4,
	name: "artificial bluespace crystal",
	desc: "An artificially made bluespace crystal, it looks delicate.",
	origin_tech: "bluespace=3;plasmatech=4",
	materials: null,
	points: 0,
	refined_type: null,
});

// bscrystal.dm:49
rt.def("/obj/item/weapon/ore/bluespace_crystal/artificial/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$bluespace", 1000]);
	return f.dot;
});

rt.type(9021, "/obj/item/stack/sheet/bluespace_crystal", "/obj/item/stack/sheet", {
	crystal_type: rt.typePath("/obj/item/weapon/ore/bluespace_crystal/refined"),
	name: "bluespace polycrystal",
	icon: rt.rsc("icons/obj/telescience.dmi"),
	icon_state: "polycrystal",
	desc: "A stable polycrystal, made of fused-together bluespace crystals. You could probably break one off.",
	origin_tech: "bluespace=6;materials=3",
	materials: null,
	attack_verb: null,
	novariants: 1,
});

// bscrystal.dm:61
rt.def("/obj/item/stack/sheet/bluespace_crystal/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$bluespace", 2000]);
	this.attack_verb = list("bluespace polybashed", "bluespace polybattered", "bluespace polybludgeoned", "bluespace polythrashed", "bluespace polysmashed");
	return f.dot;
});

// bscrystal.dm:67
rt.def("/obj/item/stack/sheet/bluespace_crystal/proc/attack_self", function attack_self(f: Frame, user: Value) {
	to_chat(user, "<span class='warning'>You cannot crush the polycrystal in-hand, try breaking one off.</span>");
	return f.dot;
});

// bscrystal.dm:70
rt.def("/obj/item/stack/sheet/bluespace_crystal/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let BC: Value = null;
	if (user.get_inactive_held_item() == this) {
		if (yield* this.zero_amount()) {
			return f.dot;
		}
		BC = (yield* new_(this.crystal_type, this));
		yield* user.put_in_hands(BC);
		yield* this.use(1);
		if (!this.amount) {
			to_chat(user, "<span class='notice'>You break the final crystal off.</span>");
		} else {
			to_chat(user, "<span class='notice'>You break off a crystal.</span>");
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);
