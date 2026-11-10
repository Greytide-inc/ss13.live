// Based on /tg/station's code/game/objects/items/weapons/grenades/flashbang.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(6917, "/obj/item/weapon/grenade/flashbang", "/obj/item/weapon/grenade", {
	name: "flashbang",
	icon_state: "flashbang",
	item_state: "flashbang",
	origin_tech: "materials=2;combat=3",
});

// flashbang.dm:8
rt.def("/obj/item/weapon/grenade/flashbang/proc/prime", function* prime(f: Frame) {
	let flashbang_turf: Value = null, M: Value = null, B: Value = null, distance: Value = null, damage: Value = null;
	yield* this.update_mob();
	if (!(flashbang_turf = rt.getStep(f, this, 0))) {
		return f.dot;
	}
	for (M of each(get_hearers_in_view(7, flashbang_turf), T("/mob/living"))) {
		yield* this.bang(rt.getStep(f, M, 0), M);
	}
	for (B of each(get_hear(8, flashbang_turf), T("/obj/structure/blob"))) {
		distance = get_dist(B, rt.getStep(f, this, 0));
		damage = round(100 / (distance * distance) + 1);
		yield* B.take_damage(damage, "fire", "energy");
	}
	yield* qdel(this);
	return f.dot;
}, true);

// flashbang.dm:22
rt.def("/obj/item/weapon/grenade/flashbang/proc/bang", function* bang(f: Frame, _T: Value, M: Value) {
	if (M.stat == 2) {
		return f.dot;
	}
	M.show_message("<span class='warning'>BANG</span>", 2);
	playsound(this.loc, rt.rsc("sound/weapons/flashbang.ogg"), 100, 1);
	let distance: Value = max(0, get_dist(rt.getStep(f, this, 0), _T));
	if (yield* M.flash_act({ affect_silicon: 1 })) {
		yield* M.Knockdown(max(100 / max(1, distance), 3));
	}
	if (!distance || this.loc == M || this.loc == M.loc) {
		yield* M.Knockdown(200);
		yield* M.soundbang_act(1, 200, 10, 15);
	} else {
		yield* M.soundbang_act(1, max(20 / max(1, distance), 3), rand(0, 5));
	}
	return f.dot;
}, true);
