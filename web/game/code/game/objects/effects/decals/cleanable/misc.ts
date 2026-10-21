// From code/game/objects/effects/decals/cleanable/misc.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11738, "/obj/effect/decal/cleanable/ash", "/obj/effect/decal/cleanable", {
	mergeable_decal: 0,
	name: "ashes",
	desc: "Ashes to ashes, dust to dust, and into space.",
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "ash",
});

// /obj/effect/decal/cleanable/ash/proc/Initialize  (code/game/objects/effects/decals/cleanable/misc.dm:15)  may sleep
rt.def("/obj/effect/decal/cleanable/ash/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["ash", 30]);
	rt.setSv(f, "pixel_x", (yield* g.call(f, P("/proc/rand"), null, [-5, 5])));
	rt.setSv(f, "pixel_y", (yield* g.call(f, P("/proc/rand"), null, [-5, 5])));
	return f.dot;
}, true);

rt.type(11739, "/obj/effect/decal/cleanable/ash/large", "/obj/effect/decal/cleanable/ash", {
	name: "large pile of ashes",
	icon_state: "big_ash",
});

// /obj/effect/decal/cleanable/ash/large/proc/Initialize  (code/game/objects/effects/decals/cleanable/misc.dm:25)  may sleep
rt.def("/obj/effect/decal/cleanable/ash/large/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["ash", 30]);
	return f.dot;
}, true);

rt.type(11743, "/obj/effect/decal/cleanable/greenglow", "/obj/effect/decal/cleanable", {
	light_color: "#64C864",
	name: "glowing goo",
	desc: "Jeez. I hope that's not for lunch.",
	icon_state: "greenglow",
});

// /obj/effect/decal/cleanable/greenglow/proc/Initialize  (code/game/objects/effects/decals/cleanable/misc.dm:47)  may sleep
rt.def("/obj/effect/decal/cleanable/greenglow/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "set_light", 1);
	return f.dot;
}, true, { args: ["mapload"] });

rt.type(11748, "/obj/effect/decal/cleanable/vomit", "/obj/effect/decal/cleanable", {
	viruses: null,
	random_icon_states: null,
	name: "vomit",
	desc: "Gosh, how unpleasant.",
	icon: rt.rsc("icons/effects/blood.dmi"),
	icon_state: "vomit_1",
});

// /obj/effect/decal/cleanable/vomit/proc/<init>  (code/game/objects/effects/decals/cleanable/misc.dm:83)
rt.def("/obj/effect/decal/cleanable/vomit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", rt.list("vomit_1", "vomit_2", "vomit_3", "vomit_4"));
	$0 = $0;
	rt.setSv(f, "viruses", rt.list());
	return f.dot;
});

// /obj/effect/decal/cleanable/vomit/proc/attack_hand  (code/game/objects/effects/decals/cleanable/misc.dm:86)  may sleep
rt.def("/obj/effect/decal/cleanable/vomit/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let H: Value = null, R: Value = null, nutri_check: Value = null;
	let $e: any;
	f.vars = () => [user, H, R, nutri_check, $e];
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	if (!truthy((yield* g.call(f, P("/proc/is_species"), null, [(H = live(user)), T("/datum/species/fly")])))) return f.dot;
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/items/drink.ogg"), 50, 1]);
	yield* g.callName(f, live(H), "visible_message", [fmt("<span class='alert'>＀ extends a small proboscis into the vomit pool, sucking it with a slurping sound.</span>", [live(H)])]);
	if (truthy(rt.sv(f, "reagents"))) {
		R = null;
		rt.forList(f, 0, rt.fv(f, "reagent_list", rt.sv(f, "reagents")), T("/datum/reagent"));
		while (($e = rt.next(f, 0)) !== undefined) {
			R = $e;
			if (truthy((rt.istype(live(R), T("/datum/reagent/consumable")) ? 1 : 0))) {
				if (rt.gt(rt.gv(f, "nutriment_factor", (nutri_check = live(R))), 0)) {
					rt.modField(f, live(H), "nutrition", multiply(rt.fv(f, "nutriment_factor", live(nutri_check)), rt.fv(f, "volume", live(nutri_check))), add);
					yield* g.callName(f, rt.sv(f, "reagents"), "remove_reagent", [rt.fv(f, "id", live(nutri_check)), rt.fv(f, "volume", live(nutri_check))]);
				}
			}
		}
		rt.endFor(f, 0);
	}
	yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(H), rt.fv(f, "total_volume", rt.sv(f, "reagents"))]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/effect/decal/cleanable/vomit/proc/Destroy  (code/game/objects/effects/decals/cleanable/misc.dm:102)  may sleep
rt.def("/obj/effect/decal/cleanable/vomit/proc/Destroy", function* Destroy(f: Frame) {
	let D: Value = null;
	let $e: any;
	f.vars = () => [D, $e];
	D = null;
	rt.forList(f, 0, rt.sv(f, "viruses"), T("/datum/disease"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		yield* g.callName(f, live(D), "cure", [0]);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "viruses", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(11749, "/obj/effect/decal/cleanable/vomit/old", "/obj/effect/decal/cleanable/vomit", {
	name: "crusty dried vomit",
	desc: "You try not to look at the chunks, and fail.",
});

// /obj/effect/decal/cleanable/vomit/old/proc/Initialize  (code/game/objects/effects/decals/cleanable/misc.dm:112)  may sleep
rt.def("/obj/effect/decal/cleanable/vomit/old/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "icon_state", "-old", add);
	return f.dot;
}, true);

rt.type(11751, "/obj/effect/decal/cleanable/plant_smudge", "/obj/effect/decal/cleanable", {
	random_icon_states: null,
	name: "plant smudge",
	gender: "neuter",
	icon: rt.rsc("icons/effects/tomatodecal.dmi"),
});

// /obj/effect/decal/cleanable/plant_smudge/proc/<init>  (code/game/objects/effects/decals/cleanable/misc.dm:126)
rt.def("/obj/effect/decal/cleanable/plant_smudge/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", rt.list("smashed_plant"));
	return f.dot;
});

rt.type(11753, "/obj/effect/decal/cleanable/pie_smudge", "/obj/effect/decal/cleanable", {
	random_icon_states: null,
	name: "smashed pie",
	desc: "It's pie cream from a cream pie.",
	gender: "neuter",
	icon: rt.rsc("icons/effects/tomatodecal.dmi"),
});

// /obj/effect/decal/cleanable/pie_smudge/proc/<init>  (code/game/objects/effects/decals/cleanable/misc.dm:140)
rt.def("/obj/effect/decal/cleanable/pie_smudge/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", rt.list("smashed_pie"));
	return f.dot;
});

rt.type(11755, "/obj/effect/decal/cleanable/shreds", "/obj/effect/decal/cleanable", {
	mergeable_decal: 0,
	name: "shreds",
	desc: "The shredded remains of what appears to be clothing.",
	icon_state: "shreds",
	gender: "plural",
});

// /obj/effect/decal/cleanable/shreds/proc/ex_act  (code/game/objects/effects/decals/cleanable/misc.dm:157)  may sleep
rt.def("/obj/effect/decal/cleanable/shreds/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	f.vars = () => [severity, target];
	if (!isEqual(live(severity), 1)) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { waitfor: false });

// /obj/effect/decal/cleanable/shreds/proc/Initialize  (code/game/objects/effects/decals/cleanable/misc.dm:161)  may sleep
rt.def("/obj/effect/decal/cleanable/shreds/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "pixel_x", (yield* g.call(f, P("/proc/rand"), null, [-10, 10])));
	rt.setSv(f, "pixel_y", (yield* g.call(f, P("/proc/rand"), null, [-10, 10])));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);
