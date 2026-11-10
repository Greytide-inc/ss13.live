// Based on /tg/station's code/game/objects/items/shooting_range.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9777, "/obj/item/target", "/obj/item", {
	hp: 1800,
	pinnedLoc: null,
	name: "shooting target",
	desc: "A shooting target.",
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "target_h",
	density: 0,
});

// shooting_range.dm:11
rt.def("/obj/item/target/proc/Destroy", function* Destroy(f: Frame) {
	this.removeOverlays();
	if (this.pinnedLoc) {
		this.pinnedLoc.nullPinnedTarget();
	}
	return (yield* parent_proc());
}, true);

// shooting_range.dm:21
rt.def("/obj/item/target/proc/removeOverlays", function removeOverlays(f: Frame) {
	this.cut_overlays();
	return f.dot;
});

// shooting_range.dm:24
rt.def("/obj/item/target/proc/Move", function* Move(f: Frame) {
	yield* parent_proc();
	if (!this.pinnedLoc) return f.dot;
	this.pinnedLoc.loc = this.loc;
	return f.dot;
}, true);

// shooting_range.dm:29
rt.def("/obj/item/target/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let WT: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/weldingtool"))) {
		if (yield* (WT = W).remove_fuel(0, user)) {
			this.removeOverlays();
			to_chat(user, `<span class='notice'>You slice off ${this}'s uneven chunks of aluminium and scorch marks.</span>`);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// shooting_range.dm:39
rt.def("/obj/item/target/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.pinnedLoc) {
		yield* this.pinnedLoc.removeTarget(user);
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(9780, "/obj/item/target/clown", "/obj/item/target", {
	hp: 2000,
	icon_state: "target_c",
	desc: "A shooting target that looks like a useless clown.",
});

// shooting_range.dm:61
rt.def("/obj/item/target/clown/proc/bullet_act", function* bullet_act(f: Frame) {
	yield* parent_proc();
	playsound(this.loc, rt.rsc("sound/items/bikehorn.ogg"), 50, 1);
	return f.dot;
}, true, { args: ["P"] });

// shooting_range.dm:65
rt.def("/obj/item/target/proc/bullet_act", function* bullet_act(f: Frame, _P: Value) {
	let C: Value = null, bullet_hole: Value = null;
	let p_x: Value = _P.p_x + pick(0, 0, 0, 0, 0, -1, 1);
	let p_y: Value = _P.p_y + pick(0, 0, 0, 0, 0, -1, 1);
	let decaltype: Value = 1;
	if (rt.op(f, "IsType", [], [T("/obj/item/projectile/bullet"), _P])) {
		decaltype = 2;
	}
	if ((C = icon(this.icon, this.icon_state)).GetPixel(p_x, p_y) && _P.original == this && rt.len(f, this.overlays) <= 35) {
		this.hp -= _P.damage;
		if (this.hp <= 0) {
			this.visible_message(`<span class='danger'>${this} breaks into tiny pieces and collapses!</span>`);
			yield* qdel(this);
		}
		(bullet_hole = image(rt.rsc("icons/effects/effects.dmi"), "scorch", 3.5)).pixel_x = p_x - 1;
		bullet_hole.pixel_y = p_y - 1;
		if (decaltype == 1) {
			yield* bullet_hole.setDir(pick(1, 2, 4, 8));
			if (_P.damage >= 20 || rt.istype(_P, T("/obj/item/projectile/beam/practice"))) {
				yield* bullet_hole.setDir(pick(1, 2, 4, 8));
			} else {
				bullet_hole.icon_state = "light_scorch";
			}
		} else {
			bullet_hole.icon_state = "dent";
		}
		this.add_overlay(bullet_hole);
		return f.dot;
	}
	return -1;
}, true);
