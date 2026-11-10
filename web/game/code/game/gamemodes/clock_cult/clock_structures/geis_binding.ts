// Based on /tg/station's code/game/gamemodes/clock_cult/clock_structures/geis_binding.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12161, "/obj/structure/destructible/clockwork/geis_binding", "/obj/structure/destructible/clockwork", {
	resisting: 0,
	can_resist: 0,
	mob_layer: 4,
	clockwork_desc: "A binding ring around a target, preventing them from taking action while they're being converted.",
	light_range: 2,
	light_power: 0.5,
	light_color: "#AF0AAF",
	immune_to_servant_attacks: 1,
	can_buckle: 1,
	buckle_lying: 0,
	buckle_prevents_pull: 1,
	name: "glowing ring",
	desc: "A flickering, glowing purple ring around a target.",
	max_integrity: 25,
	obj_integrity: 25,
	density: 0,
	icon: rt.rsc("icons/effects/clockwork_effects.dmi"),
	icon_state: "geisbinding_full",
	break_message: null,
	break_sound: rt.rsc("sound/magic/repulse.ogg"),
	debris: null,
});

// geis_binding.dm:17
rt.def("/obj/structure/destructible/clockwork/geis_binding/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.debris = list();
	return f.dot;
});

// geis_binding.dm:26
rt.def("/obj/structure/destructible/clockwork/geis_binding/proc/examine", function examine(f: Frame, user: Value) {
	this.icon_state = "geisbinding_full";
	parent_proc();
	this.icon_state = "geisbinding";
	return f.dot;
}, false);

// geis_binding.dm:34
rt.def("/obj/structure/destructible/clockwork/geis_binding/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	yield* new_(T("/obj/effect/temp_visual/emp"), this.loc);
	yield* qdel(this);
	return f.dot;
}, true);

// geis_binding.dm:38
rt.def("/obj/structure/destructible/clockwork/geis_binding/proc/post_buckle_mob", function* post_buckle_mob(f: Frame, M: Value) {
	let I: Value = null, i: Value = null, B: Value = null, G: Value = null, _T: Value = null, GB: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	yield* parent_proc();
	if (M.buckled == this) {
		this.desc = `A flickering, glowing purple ring around ${M}.`;
		this.clockwork_desc = `A binding ring around ${M}, preventing ${M.p_them()} from taking action while ${M.p_theyre()} being converted.`;
		this.icon_state = "geisbinding";
		this.mob_layer = M.layer;
		this.layer = M.layer - 0.01;
		this.add_overlay(mutable_appearance(rt.rsc("icons/effects/clockwork_effects.dmi"), "geisbinding_top", M.layer + 0.01));
		for (I of each(M.held_items, T("/obj/item"))) {
			yield* M.dropItemToGround(I);
		}
		for (i of each(M.get_empty_held_indexes())) {
			B = (yield* new_(T("/obj/item/geis_binding"), M));
			yield* M.put_in_hands(B, i);
		}
		yield* M.regenerate_icons();
		$0 = M;
		$1 = `<span class='warning'>A ${this.name} appears around ${M}!</span>`;
		$2 = this.name;
		if (this.can_resist) {
			$3 = "\n<span class='userdanger'>Resist!</span>";
		} else {
			$3 = "";
		}
		$0.visible_message($1, `<span class='warning'>A ${$2} appears around you!</span>${$3}`);
		if (!this.can_resist) {
			yield* this.repair_and_interrupt();
		}
	} else {
		G = (yield* new_(T("/obj/effect/temp_visual/ratvar/geis_binding"), M.loc));
		_T = (yield* new_(T("/obj/effect/temp_visual/ratvar/geis_binding/top"), M.loc));
		G.layer = this.mob_layer - 0.01;
		_T.layer = this.mob_layer + 0.01;
		G.alpha = this.alpha;
		_T.alpha = this.alpha;
		rt.op(f, "Animate", [2, 10], [null, G, "transform", matrix() * 2, "alpha", 0, "time", 8, "easing", 128]);
		rt.op(f, "Animate", [2, 10], [null, _T, "transform", matrix() * 2, "alpha", 0, "time", 8, "easing", 128]);
		M.visible_message(`<span class='warning'>${this} snaps into glowing pieces and dissipates!</span>`);
		for (GB of each(M.held_items, T("/obj/item/geis_binding"))) {
			yield* M.dropItemToGround(GB, 1);
		}
	}
	return f.dot;
}, true);

// geis_binding.dm:70
rt.def("/obj/structure/destructible/clockwork/geis_binding/proc/relaymove", function* relaymove(f: Frame, user: Value, direction: Value) {
	let L: Value = null;
	if (!(rt.istype(user, T("/mob/living")) && this.can_resist)) return f.dot;
	yield* (L = user).resist();
	return f.dot;
}, true);

// geis_binding.dm:75
rt.def("/obj/structure/destructible/clockwork/geis_binding/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	damage_type ??= "brute";
	damage_flag ??= 0;
	playsound(this, rt.rsc("sound/effects/empulse.ogg"), 50, 1);
	return f.dot;
});

// geis_binding.dm:78
rt.def("/obj/structure/destructible/clockwork/geis_binding/proc/take_damage", function* take_damage(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = "brute";
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (f.args[3] === null) {
		f.args[3] = 1;
	}
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	yield* this.update_icon();
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "sound_effect", "attack_dir"] });

// geis_binding.dm:83
rt.def("/obj/structure/destructible/clockwork/geis_binding/proc/update_icon", function update_icon(f: Frame) {
	this.alpha = min(rt.initial(f, this, "alpha") + (this.obj_integrity - this.max_integrity) * 5, 255);
	return f.dot;
});

// geis_binding.dm:86
rt.def("/obj/structure/destructible/clockwork/geis_binding/proc/repair_and_interrupt", function* repair_and_interrupt(f: Frame) {
	let m: Value = null, L: Value = null, C: Value = null;
	this.obj_integrity = this.max_integrity;
	yield* this.update_icon();
	for (m of each(this.buckled_mobs)) {
		if (L = m) {
			yield* L.Stun(20, 1, 1);
			if (rt.istype(L, T("/mob/living/carbon"))) {
				(C = L).silent += 4;
			}
		}
	}
	this.visible_message(`<span class='sevtug'>${this} flares brightly!</span>`);
	let G1: Value = (yield* new_(T("/obj/effect/temp_visual/ratvar/geis_binding"), this.loc));
	let G2: Value = (yield* new_(T("/obj/effect/temp_visual/ratvar/geis_binding"), this.loc));
	let T1: Value = (yield* new_(T("/obj/effect/temp_visual/ratvar/geis_binding/top"), this.loc));
	let T2: Value = (yield* new_(T("/obj/effect/temp_visual/ratvar/geis_binding/top"), this.loc));
	G1.layer = this.mob_layer - 0.01;
	G2.layer = this.mob_layer - 0.01;
	T1.layer = this.mob_layer + 0.01;
	T2.layer = this.mob_layer + 0.01;
	rt.op(f, "Animate", [2, 10], [null, G1, "pixel_y", this.pixel_y + 9, "alpha", 0, "time", 8, "easing", 64]);
	rt.op(f, "Animate", [2, 10], [null, G2, "pixel_y", this.pixel_y - 9, "alpha", 0, "time", 8, "easing", 64]);
	rt.op(f, "Animate", [2, 10], [null, T1, "pixel_y", this.pixel_y + 9, "alpha", 0, "time", 8, "easing", 64]);
	rt.op(f, "Animate", [2, 10], [null, T2, "pixel_y", this.pixel_y - 9, "alpha", 0, "time", 8, "easing", 64]);
	return f.dot;
}, true);

// geis_binding.dm:110
rt.def("/obj/structure/destructible/clockwork/geis_binding/proc/user_unbuckle_mob", function* user_unbuckle_mob(f: Frame, buckled_mob: Value, user: Value) {
	if (buckled_mob == user) {
		if (!this.resisting && this.can_resist) {
			this.resisting = 1;
			user.visible_message(`<span class='warning'>${user} starts struggling against ${this}...</span>`, `<span class='userdanger'>You start breaking out of ${this}...</span>`);
			while ((yield* do_after(user, 10, { target: this })) && this.resisting && this.obj_integrity) {
				if (this.obj_integrity - 5 <= 0) {
					user.visible_message(`<span class='warning'>${user} breaks ${this}!</span>`, `<span class='userdanger'>You break ${this}!</span>`);
					yield* this.take_damage(5);
					return user;
				}
				yield* this.take_damage(5);
			}
			this.resisting = 0;
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(9438, "/obj/item/geis_binding", "/obj/item", {
	flags: 16514,
	name: "glowing ring",
	desc: "A flickering ring preventing you from holding items.",
	icon: rt.rsc("icons/effects/clockwork_effects.dmi"),
	icon_state: "geisbinding_full",
});

// geis_binding.dm:132
rt.def("/obj/item/geis_binding/proc/pre_attackby", function* pre_attackby(f: Frame, target: Value, user: Value, params: Value) {
	yield* user.resist();
	return 0;
}, true);
