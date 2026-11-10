// Based on /tg/station's code/modules/projectiles/ammunition.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(8654, "/obj/item/ammo_casing", "/obj/item", {
	fire_sound: null,
	caliber: null,
	projectile_type: null,
	BB: null,
	pellets: 1,
	variance: 0,
	randomspread: 0,
	delay: 0,
	click_cooldown_override: 0,
	firing_effect_type: rt.typePath("/obj/effect/temp_visual/dir_setting/firing_effect"),
	flags: 64,
	name: "bullet casing",
	desc: "A bullet casing.",
	icon: rt.rsc("icons/obj/ammo.dmi"),
	icon_state: "s-casing",
	slot_flags: 512,
	throwforce: 0,
	w_class: 1,
});

// ammunition.dm:23
rt.def("/obj/item/ammo_casing/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (this.projectile_type) {
		this.BB = (yield* new_(this.projectile_type, this));
	}
	this.pixel_x = rand(-10, 10);
	this.pixel_y = rand(-10, 10);
	yield* this.setDir(pick(GLOB.alldirs));
	yield* this.update_icon();
	return f.dot;
}, true);

// ammunition.dm:32
rt.def("/obj/item/ammo_casing/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	let $0: any = rt.initial(f, this, "icon_state");
	this.icon_state = `${$0}${this.BB ? "-live" : ""}`;
	this.desc = `${rt.initial(f, this, "desc")}${this.BB ? "" : " This one is spent"}`;
	return f.dot;
});

// ammunition.dm:38
rt.def("/obj/item/ammo_casing/proc/newshot", function* newshot(f: Frame) {
	if (this.BB) return f.dot;
	this.BB = (yield* new_(this.projectile_type, this));
	return f.dot;
}, true);

// ammunition.dm:42
rt.def("/obj/item/ammo_casing/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let box: Value = null, boolets: Value = null, bullet: Value = null;
	if (rt.istype(I, T("/obj/item/ammo_box"))) {
		box = I;
		if (isturf(this.loc)) {
			boolets = 0;
			for (bullet of each(this.loc, T("/obj/item/ammo_casing"))) {
				if (rt.len(f, box.stored_ammo) >= box.max_ammo) {
					break;
				}
				if (bullet.BB) {
					if (yield* box.give_round(bullet, 0)) {
						boolets++;
					}
				} else {
					continue;
				}
			}
			if (boolets > 0) {
				yield* box.update_icon();
				to_chat(user, fmt("<span class='notice'>You collect ＀ shell５. ＀ now contains ＀ shell５.</span>", [boolets, box, rt.len(f, box.stored_ammo)]));
			} else {
				to_chat(user, "<span class='warning'>You fail to collect anything!</span>");
			}
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);
