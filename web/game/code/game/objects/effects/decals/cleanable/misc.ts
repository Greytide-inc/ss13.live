// Based on /tg/station's code/game/objects/effects/decals/cleanable/misc.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11738, "/obj/effect/decal/cleanable/ash", "/obj/effect/decal/cleanable", {
	mergeable_decal: 0,
	name: "ashes",
	desc: "Ashes to ashes, dust to dust, and into space.",
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "ash",
});

// misc.dm:15
rt.def("/obj/effect/decal/cleanable/ash/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	yield* this.reagents.add_reagent("ash", 30);
	this.pixel_x = rand(-5, 5);
	this.pixel_y = rand(-5, 5);
	return f.dot;
}, true);

rt.type(11739, "/obj/effect/decal/cleanable/ash/large", "/obj/effect/decal/cleanable/ash", {
	name: "large pile of ashes",
	icon_state: "big_ash",
});

// misc.dm:25
rt.def("/obj/effect/decal/cleanable/ash/large/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	yield* this.reagents.add_reagent("ash", 30);
	return f.dot;
}, true);

rt.type(11743, "/obj/effect/decal/cleanable/greenglow", "/obj/effect/decal/cleanable", {
	light_color: "#64C864",
	name: "glowing goo",
	desc: "Jeez. I hope that's not for lunch.",
	icon_state: "greenglow",
});

// misc.dm:47
rt.def("/obj/effect/decal/cleanable/greenglow/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	this.set_light(1);
	return f.dot;
}, true);

rt.type(11748, "/obj/effect/decal/cleanable/vomit", "/obj/effect/decal/cleanable", {
	viruses: null,
	random_icon_states: null,
	name: "vomit",
	desc: "Gosh, how unpleasant.",
	icon: rt.rsc("icons/effects/blood.dmi"),
	icon_state: "vomit_1",
});

// misc.dm:83
rt.def("/obj/effect/decal/cleanable/vomit/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.random_icon_states = list("vomit_1", "vomit_2", "vomit_3", "vomit_4");

	this.viruses = list();
	return f.dot;
});

// misc.dm:86
rt.def("/obj/effect/decal/cleanable/vomit/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let H: Value = null, R: Value = null, nutri_check: Value = null;
	if (!rt.istype(user, T("/mob/living/carbon/human"))) return f.dot;
	if (!is_species((H = user), T("/datum/species/fly"))) return f.dot;
	playsound(rt.getStep(f, this, 0), rt.rsc("sound/items/drink.ogg"), 50, 1);
	H.visible_message(`<span class='alert'>${H} extends a small proboscis into the vomit pool, sucking it with a slurping sound.</span>`);
	if (this.reagents) {
		for (R of each(this.reagents.reagent_list, T("/datum/reagent"))) {
			if (rt.istype(R, T("/datum/reagent/consumable"))) {
				if ((nutri_check = R).nutriment_factor > 0) {
					H.nutrition += nutri_check.nutriment_factor * nutri_check.volume;
					yield* this.reagents.remove_reagent(nutri_check.id, nutri_check.volume);
				}
			}
		}
	}
	yield* this.reagents.trans_to(H, this.reagents.total_volume);
	yield* qdel(this);
	return f.dot;
}, true);

// misc.dm:102
rt.def("/obj/effect/decal/cleanable/vomit/proc/Destroy", function* Destroy(f: Frame) {
	let D: Value = null;
	for (D of each(this.viruses, T("/datum/disease"))) {
		yield* D.cure(0);
	}
	this.viruses = null;
	return (yield* parent_proc());
}, true);

rt.type(11749, "/obj/effect/decal/cleanable/vomit/old", "/obj/effect/decal/cleanable/vomit", {
	name: "crusty dried vomit",
	desc: "You try not to look at the chunks, and fail.",
});

// misc.dm:112
rt.def("/obj/effect/decal/cleanable/vomit/old/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.icon_state += "-old";
	return f.dot;
}, true);

rt.type(11751, "/obj/effect/decal/cleanable/plant_smudge", "/obj/effect/decal/cleanable", {
	random_icon_states: null,
	name: "plant smudge",
	gender: "neuter",
	icon: rt.rsc("icons/effects/tomatodecal.dmi"),
});

// misc.dm:126
rt.def("/obj/effect/decal/cleanable/plant_smudge/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.random_icon_states = list("smashed_plant");
	return f.dot;
});

rt.type(11753, "/obj/effect/decal/cleanable/pie_smudge", "/obj/effect/decal/cleanable", {
	random_icon_states: null,
	name: "smashed pie",
	desc: "It's pie cream from a cream pie.",
	gender: "neuter",
	icon: rt.rsc("icons/effects/tomatodecal.dmi"),
});

// misc.dm:140
rt.def("/obj/effect/decal/cleanable/pie_smudge/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.random_icon_states = list("smashed_pie");
	return f.dot;
});

rt.type(11755, "/obj/effect/decal/cleanable/shreds", "/obj/effect/decal/cleanable", {
	mergeable_decal: 0,
	name: "shreds",
	desc: "The shredded remains of what appears to be clothing.",
	icon_state: "shreds",
	gender: "plural",
});

// misc.dm:157
rt.def("/obj/effect/decal/cleanable/shreds/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	if (severity != 1) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true, { waitfor: false });

// misc.dm:161
rt.def("/obj/effect/decal/cleanable/shreds/proc/Initialize", function* Initialize(f: Frame) {
	this.pixel_x = rand(-10, 10);
	this.pixel_y = rand(-10, 10);
	yield* parent_proc();
	return f.dot;
}, true);
