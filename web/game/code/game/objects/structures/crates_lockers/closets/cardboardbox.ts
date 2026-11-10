// Based on /tg/station's code/game/objects/structures/crates_lockers/closets/cardboardbox.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12291, "/obj/structure/closet/cardboard", "/obj/structure/closet", {
	move_speed_multiplier: 1,
	move_delay: 0,
	egged: 0,
	mob_storage_capacity: 1,
	can_weld_shut: 0,
	cutting_tool: rt.typePath("/obj/item/weapon/wirecutters"),
	open_sound: "rustle",
	cutting_sound: rt.rsc("sound/items/poster_ripped.ogg"),
	material_drop: rt.typePath("/obj/item/stack/sheet/cardboard"),
	delivery_icon: "deliverybox",
	anchorable: 0,
	name: "large cardboard box",
	desc: "Just a box...",
	icon_state: "cardboard",
	resistance_flags: 4,
	obj_integrity: 70,
	max_integrity: 70,
	integrity_failure: 0,
});

// cardboardbox.dm:23
rt.def("/obj/structure/closet/cardboard/proc/relaymove", function* relaymove(f: Frame, user: Value, direction: Value) {
	if (this.opened || this.move_delay || user.stat || user.IsStun() || user.IsKnockdown() || user.IsUnconscious() || !isturf(this.loc) || !this.has_gravity(this.loc)) {
		return f.dot;
	}
	this.move_delay = 1;
	if (yield* step(this, direction)) {
		rt.spawnTail(f, GLOB.config.walk_speed * this.move_speed_multiplier, "/obj/structure/closet/cardboard/proc/relaymove: spawn at game/objects/structures/crates_lockers/closets/cardboardbox.dm:26", user, direction);
	} else {
		this.move_delay = 0;
	}
	return f.dot;
}, true);

// a spawn(multiply(rt.fieldI(f, rt.glob(813/*config*/), $ic[6]), rt.srcVarI(f, $ic[7]))) body of /obj/structure/closet/cardboard/proc/relaymove, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/structure/closet/cardboard/proc/relaymove: spawn at game/objects/structures/crates_lockers/closets/cardboardbox.dm:26", function* (f: Frame, user: Value, direction: Value) {
	this.move_delay = 0;
	return null;
});

// cardboardbox.dm:33
rt.def("/obj/structure/closet/cardboard/proc/open", function* open(f: Frame) {
	let alerted: Value = null, Snake: Value = null, L: Value = null, L_1: Value = null;
	let $e: any;
	if (this.opened || !this.can_open()) {
		return 0;
	}
	if (this.egged < rt.worldTime(f)) {
		rt.forList(f, 0, this.contents, T("/mob/living"));
		if (($e = rt.next(f, 0)) !== undefined) {
			L = $e;
			Snake = L;
		}
		rt.endFor(f, 0);
		if (Snake) {
			alerted = viewers(7, this);
		}
	}
	yield* parent_proc();
	if (!rt.length(alerted)) return f.dot;
	this.egged = rt.worldTime(f) + SNAKE_SPAM_TICKS;
	for (L_1 of each(alerted, T("/mob/living"))) {
		if (!L_1.stat) {
			if (!(yield* L_1.incapacitated({ ignore_restraints: 1 }))) {
				yield* L_1.face_atom(this);
			}
			yield* L_1.do_alert_animation(L_1);
		}
	}
	playsound(this.loc, rt.rsc("sound/machines/chime.ogg"), 50, 0, -5);
	return f.dot;
}, true);

// cardboardbox.dm:54
rt.def("/mob/living/proc/do_alert_animation", function* do_alert_animation(f: Frame, A: Value) {
	let I: Value = null;
	yield* flick_overlay_view((I = image(rt.rsc("icons/obj/closet.dmi"), A, "cardboard_special", A.layer + 1)), A, 8);
	I.alpha = 0;
	rt.op(f, "Animate", [2, 10], [null, I, "pixel_z", 32, "alpha", 255, "time", 5, "easing", 5]);
	return f.dot;
}, true);
