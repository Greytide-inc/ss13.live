// Based on /tg/station's code/game/objects/items/weapons/powerfist.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(5660, "/obj/item/weapon/melee/powerfist", "/obj/item/weapon/melee", {
	click_delay: 1.5,
	fisto_setting: 1,
	gasperfist: 3,
	tank: null,
	flags: 64,
	throw_range: 7,
	name: "power-fist",
	desc: "A metal gauntlet with a piston-powered ram ontop for that extra 'ompfh' in your punch.",
	icon_state: "powerfist",
	item_state: "powerfist",
	attack_verb: null,
	force: 20,
	throwforce: 10,
	w_class: 3,
	origin_tech: "combat=5;powerstorage=3;syndicate=3",
	armor: null,
	resistance_flags: 2,
});

// powerfist.dm:13
rt.def("/obj/item/weapon/melee/powerfist/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.attack_verb = list("whacked", "fisted", "power-punched");
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 40]);
	return f.dot;
});

// powerfist.dm:22
rt.def("/obj/item/weapon/melee/powerfist/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!(get_dist(user, this) <= 1)) {
		to_chat(user, "<span class='notice'>You'll need to get closer to see any more.</span>");
		return f.dot;
	}
	if (!this.tank) return f.dot;
	to_chat(user, fmt("<span class='notice'>＀ It has ％！ mounted onto it.</span>", [bicon(this.tank), this.tank]));
	return f.dot;
}, false);

// powerfist.dm:31
rt.def("/obj/item/weapon/melee/powerfist/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let IT: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/tank/internals"))) {
		if (!this.tank) {
			if ((IT = W).volume <= 3) {
				to_chat(user, fmt("<span class='warning'>＄！ is too small for ％！.</span>", [IT, this]));
				return f.dot;
			}
			yield* this.updateTank(W, 0, user);
		}
	} else if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
		if (this.fisto_setting === 1) {
			this.fisto_setting = 2;
		} else if (this.fisto_setting === 2) {
			this.fisto_setting = 3;
		} else if (this.fisto_setting === 3) {
			this.fisto_setting = 1;
		}
		playsound(this.loc, W.usesound, 50, 1);
		to_chat(user, fmt("<span class='notice'>You tweak ％！'s piston valve to ＀.</span>", [this, this.fisto_setting]));
	} else {
		if (!rt.istype(W, T("/obj/item/weapon/screwdriver"))) return f.dot;
		if (!this.tank) return f.dot;
		yield* this.updateTank(this.tank, 1, user);
	}
	return f.dot;
}, true);

// powerfist.dm:55
rt.def("/obj/item/weapon/melee/powerfist/proc/updateTank", function* updateTank(f: Frame, thetank: Value, removing: Value, user: Value) {
	removing ??= 0;
	if (removing) {
		if (!this.tank) {
			to_chat(user, fmt("<span class='notice'>＄！ currently has no tank attached to it.</span>", [this]));
			return f.dot;
		}
		to_chat(user, fmt("<span class='notice'>You detach ％！ from ％！.</span>", [thetank, this]));
		yield* this.tank.forceMove(rt.getStep(f, user, 0));
		yield* user.put_in_hands(this.tank);
		this.tank = null;
	}
	if (removing) return f.dot;
	if (this.tank) {
		to_chat(user, fmt("<span class='warning'>＄！ already has a tank.</span>", [this]));
		return f.dot;
	}
	if (!(yield* user.transferItemToLoc(thetank, this))) {
		return f.dot;
	}
	to_chat(user, fmt("<span class='notice'>You hook ％！ up to ％！.</span>", [thetank, this]));
	this.tank = thetank;
	return f.dot;
}, true);

// powerfist.dm:73
rt.def("/obj/item/weapon/melee/powerfist/proc/attack", function* attack(f: Frame, target: Value, user: Value) {
	if (!this.tank) {
		to_chat(user, fmt("<span class='warning'>＄！ can't operate without a source of gas!</span>", [this]));
		return f.dot;
	}
	if (this.tank && !(yield* this.tank.air_contents.remove(this.gasperfist * this.fisto_setting))) {
		to_chat(user, fmt("<span class='warning'>＄！'s piston-ram lets out a weak hiss, it needs more gas!</span>", [this]));
		playsound(this.loc, rt.rsc("sound/effects/refill.ogg"), 50, 1);
		return f.dot;
	}
	yield* target.apply_damage(this.force * this.fisto_setting, "brute");
	target.visible_message(`<span class='danger'>${user}'s powerfist lets out a loud hiss as they punch ${target.name}!</span>`, `<span class='userdanger'>You cry out in pain as ${user}'s punch flings you backwards!</span>`);
	yield* new_(T("/obj/effect/temp_visual/kinetic_blast"), target.loc);
	playsound(this.loc, rt.rsc("sound/weapons/resonator_blast.ogg"), 50, 1);
	playsound(this.loc, rt.rsc("sound/weapons/genhit2.ogg"), 50, 1);
	let throw_target: Value = get_edge_target_turf(target, rt.getDir(f, this, get_step_away(target, this)));
	yield* target.throw_at(throw_target, 5 * this.fisto_setting, 0.2);
	add_logs(user, target, "power fisted", this);
	user.changeNext_move(8 * this.click_delay);
	return f.dot;
}, true);
