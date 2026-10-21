// From code/game/objects/structures/beds_chairs/alien_nest.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12246, "/obj/structure/bed/nest", "/obj/structure/bed", {
	smooth: 1,
	can_be_unanchored: 0,
	canSmoothWith: null,
	flags: 128,
	name: "alien nest",
	desc: "It's a gruesome pile of thick, sticky resin shaped like a nest.",
	icon: rt.rsc("icons/obj/smooth_structures/alien/nest.dmi"),
	icon_state: "nest",
	obj_integrity: 120,
	max_integrity: 120,
	buildstacktype: null,
}, { global: { nest_overlay: 797 } });

// /obj/structure/bed/nest/proc/user_unbuckle_mob  (code/game/objects/structures/beds_chairs/alien_nest.dm:18)  may sleep
rt.def("/obj/structure/bed/nest/proc/user_unbuckle_mob", function* user_unbuckle_mob(f: Frame, buckled_mob: Value, user: Value) {
	let buck: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [buckled_mob, user, buck, M, $e];
	if (!truthy((yield* g.srcCall(f, "has_buckled_mobs")))) return f.dot;
	buck = null;
	rt.forList(f, 0, rt.sv(f, "buckled_mobs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		buck = $e;
		M = live(buck);
		if (truthy((yield* g.callName(f, live(user), "getorgan", [T("/obj/item/organ/alien/plasmavessel")])))) {
			yield* g.srcCall(f, "unbuckle_mob", live(M));
			yield* g.srcCall(f, "add_fingerprint", live(user));
			return live(f.dot);
		}
		if (!isEqual(live(M), live(user))) {
			yield* g.callName(f, live(M), "visible_message", [fmt("＀ pulls ＀ free from the sticky nest!", [rt.fv(f, "name", live(user)), rt.fv(f, "name", live(M))]), fmt("<span class='notice'>＀ pulls you free from the gelatinous resin.</span>", [rt.fv(f, "name", live(user))]), "<span class='italics'>You hear squelching...</span>"]);
		} else {
			yield* g.callName(f, live(M), "visible_message", [fmt("<span class='warning'>＀ struggles to break free from the gelatinous resin!</span>", [rt.fv(f, "name", live(M))]), "<span class='notice'>You struggle to break free from the gelatinous resin... (Stay still for two minutes.)</span>", "<span class='italics'>You hear squelching...</span>"]);
			if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(M), null, 1200, "target", live(f.src)], rt.Args.Named)))) {
				if ((truthy(live(M)) && truthy(rt.fv(f, "buckled", live(M))))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='warning'>You fail to unbuckle yourself!</span>"]);
				}
				return live(f.dot);
			}
			if (!truthy(rt.fv(f, "buckled", live(M)))) {
				return live(f.dot);
			}
			yield* g.callName(f, live(M), "visible_message", [fmt("<span class='warning'>＀ breaks free from the gelatinous resin!</span>", [rt.fv(f, "name", live(M))]), "<span class='notice'>You break free from the gelatinous resin!</span>", "<span class='italics'>You hear squelching...</span>"]);
		}
		yield* g.srcCall(f, "unbuckle_mob", live(M));
		yield* g.srcCall(f, "add_fingerprint", live(user));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/structure/bed/nest/proc/user_buckle_mob  (code/game/objects/structures/beds_chairs/alien_nest.dm:52)  may sleep
rt.def("/obj/structure/bed/nest/proc/user_buckle_mob", function* user_buckle_mob(f: Frame, M: Value, user: Value) {
	f.vars = () => [M, user];
	if (((((!truthy((yield* g.call(f, P("/proc/ismob"), null, [live(M)]))) || rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(user)])), 1)) || !isEqual(rt.fv(f, "loc", live(M)), rt.fv(f, "loc", live(f.src)))) || truthy((yield* g.callName(f, live(user), "incapacitated", [])))) || truthy(rt.fv(f, "buckled", live(M))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, live(M), "getorgan", [T("/obj/item/organ/alien/plasmavessel")])))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(user), "getorgan", [T("/obj/item/organ/alien/plasmavessel")])))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "has_buckled_mobs")))) {
		yield* g.srcCall(f, "unbuckle_all_mobs");
	}
	if (!truthy((yield* g.srcCall(f, "buckle_mob", live(M))))) return f.dot;
	yield* g.callName(f, live(M), "visible_message", [fmt("＀ secretes a thick vile goo, securing ＀ into ＀!", [rt.fv(f, "name", live(user)), rt.fv(f, "name", live(M)), live(f.src)]), fmt("<span class='danger'>＀ drenches you in a foul-smelling resin, trapping you in ＀!</span>", [rt.fv(f, "name", live(user)), live(f.src)]), "<span class='italics'>You hear squelching...</span>"]);
	return f.dot;
}, true);

// /obj/structure/bed/nest/proc/post_buckle_mob  (code/game/objects/structures/beds_chairs/alien_nest.dm:70)
rt.def("/obj/structure/bed/nest/proc/post_buckle_mob", function post_buckle_mob(f: Frame, M: Value) {
	if (truthy((rt.isIn(f, live(M), rt.sv(f, "buckled_mobs")) ? 1 : 0))) {
		rt.setFv(f, "pixel_y", live(M), 0);
		rt.setFv(f, "pixel_x", live(M), add(rt.initial(f, live(M), "pixel_x"), 2));
		rt.setFv(f, "layer", live(M), 3.700000047683716);
		rt.callSrc(f, "add_overlay", [rt.gl("nest_overlay")]);
	} else {
		rt.setFv(f, "pixel_x", live(M), rt.callName(f, live(M), "get_standard_pixel_x_offset", [rt.fv(f, "lying", live(M))]));
		rt.setFv(f, "pixel_y", live(M), rt.callName(f, live(M), "get_standard_pixel_y_offset", [rt.fv(f, "lying", live(M))]));
		rt.setFv(f, "layer", live(M), rt.initial(f, live(M), "layer"));
		rt.callSrc(f, "cut_overlay", [rt.gl("nest_overlay")]);
	}
	return f.dot;
});

// /obj/structure/bed/nest/proc/play_attack_sound  (code/game/objects/structures/beds_chairs/alien_nest.dm:82)
rt.def("/obj/structure/bed/nest/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	let $0: any;
	f.vars = () => [damage_type, damage_flag, $0];
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	$0 = live(damage_type);
	if ($0 === "brute") {
		rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/attackblob.ogg"), 100, 1]);
	} else if ($0 === "fire") {
		rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/welder.ogg"), 100, 1]);
	}
	return f.dot;
});

// /obj/structure/bed/nest/proc/attack_alien  (code/game/objects/structures/beds_chairs/alien_nest.dm:89)  may sleep
rt.def("/obj/structure/bed/nest/proc/attack_alien", function* attack_alien(f: Frame) {
	if (!isEqual(rt.fv(f, "a_intent", live(f.args[0])), "harm")) {
		return (yield* g.srcCall(f, "attack_hand", live(f.args[0])));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["user"] });
