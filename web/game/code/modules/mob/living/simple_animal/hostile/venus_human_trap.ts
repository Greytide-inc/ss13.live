// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/venus_human_trap.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(12715, "/obj/structure/alien/resin/flower_bud_enemy", "/obj/structure/alien/resin", {
	growth_time: 1200,
	canSmoothWith: null,
	smooth: 0,
	name: "flower bud",
	desc: "A large pulsating plant...",
	icon: rt.rsc("icons/effects/spacevines.dmi"),
	icon_state: "flower_bud",
	layer: 4.9,
	opacity: 0,
});

// venus_human_trap.dm:10
rt.def("/obj/structure/alien/resin/flower_bud_enemy/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list();
	return f.dot;
});

// venus_human_trap.dm:16
rt.def("/obj/structure/alien/resin/flower_bud_enemy/proc/New", function* New(f: Frame) {
	let _T: Value = null, B: Value = null;
	yield* parent_proc();
	let anchors: Value = list();
	anchors += rt.locate(this.x - 2, this.y + 2, this.z);
	anchors += rt.locate(this.x + 2, this.y + 2, this.z);
	anchors += rt.locate(this.x - 2, this.y - 2, this.z);
	anchors += rt.locate(this.x + 2, this.y - 2, this.z);
	for (_T of each(anchors, T("/turf"))) {
		(B = (yield* this.Beam(_T, "vine", { time: 1e+31, maxdistance: 5, beam_type: T("/obj/effect/ebeam/vine") }))).sleep_time = 10;
	}
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/structure/alien/resin/flower_bud_enemy/proc/bear_fruit"))), this.growth_time);
	return f.dot;
}, true);

// venus_human_trap.dm:29
rt.def("/obj/structure/alien/resin/flower_bud_enemy/proc/bear_fruit", function* bear_fruit(f: Frame) {
	this.visible_message("<span class='danger'>the plant has borne fruit!</span>");
	yield* new_(T("/mob/living/simple_animal/hostile/venus_human_trap"), rt.getStep(f, this, 0));
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(11219, "/obj/effect/ebeam/vine", "/obj/effect/ebeam", {
	name: "thick vine",
	mouse_opacity: 1,
	desc: "A thick vine, painful to the touch.",
});

// venus_human_trap.dm:41
rt.def("/obj/effect/ebeam/vine/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	if (!rt.istype(AM, T("/mob/living"))) return f.dot;
	let L: Value = AM;
	if (rt.isIn(f, "vines", L.faction)) return f.dot;
	yield* L.adjustBruteLoss(5);
	to_chat(L, "<span class='alert'>You cut yourself on the thorny vines.</span>");
	return f.dot;
}, true);

rt.type(4996, "/mob/living/simple_animal/hostile/venus_human_trap", "/mob/living/simple_animal/hostile", {
	grasping: null,
	max_grasps: 4,
	grasp_chance: 20,
	grasp_pull_chance: 85,
	grasp_range: 4,
	ranged: 1,
	name: "venus human trap",
	desc: "Now you know how the fly feels.",
	icon_state: "venus_human_trap",
	layer: 4.9,
	health: 50,
	maxHealth: 50,
	harm_intent_damage: 5,
	obj_damage: 60,
	melee_damage_lower: 25,
	melee_damage_upper: 25,
	a_intent: "harm",
	attack_sound: rt.rsc("sound/weapons/bladeslice.ogg"),
	atmos_requirements: null,
	unsuitable_atmos_damage: 0,
	faction: null,
	del_on_death: 1,
});

// venus_human_trap.dm:66
rt.def("/mob/living/simple_animal/hostile/venus_human_trap/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.grasping = list();
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);
	this.faction = list("hostile", "vines", "plants");
	return f.dot;
});

// venus_human_trap.dm:74
rt.def("/mob/living/simple_animal/hostile/venus_human_trap/proc/Destroy", function* Destroy(f: Frame) {
	let L: Value = null, B: Value = null;
	for (L of each(this.grasping)) {
		if (B = rt.index(this.grasping, L)) {
			yield* qdel(B);
		}
	}
	this.grasping = null;
	return (yield* parent_proc());
}, true);

// venus_human_trap.dm:82
rt.def("/mob/living/simple_animal/hostile/venus_human_trap/proc/handle_automated_action", function* handle_automated_action(f: Frame) {
	let L: Value = null, B: Value = null, t: Value = null, a: Value = null, A: Value = null;
	let $e: any;
	if (!(yield* parent_proc())) return f.dot;
	for (L of each(this.grasping, T("/mob/living"))) {
		if (L.stat == 2) {
			if (B = rt.index(this.grasping, L)) {
				yield* B.End();
			}
			this.grasping -= L;
		}
		if (L.Adjacent(this)) {
			yield* L.attack_animal(this);
		} else if (prob(this.grasp_pull_chance)) {
			yield* this.setDir(rt.getDir(f, this, L));
			yield* step(L, rt.getDir(f, L, this));
			yield* L.Knockdown(60);
		}
	}
	if (!(rt.len(f, this.grasping) < this.max_grasps)) return f.dot;
	L = null;
	rt.forList(f, 0, view(this.grasp_range, this), T("/mob/living"));
	loop52: while (true) {
		if (($e = rt.next(f, 0)) === undefined) break;
		L = $e;
		if (L == this || this.faction_check_mob(L) || rt.isIn(f, L, this.grasping) || L == this.target) {
			continue;
		}
		t = null;
		for (t of each(getline(this, L))) {
			a = null;
			for (a of each(t)) {
				if ((A = a).density && A != L) {
					continue loop52;
				}
			}
		}
		if (prob(this.grasp_chance)) {
			to_chat(L, fmt("<span class='userdanger'>＄！ has you entangled!</span>", [this]));
			rt.setAt(this.grasping, L, (yield* this.Beam(L, "vine", { time: 1e+31, maxdistance: 5, beam_type: T("/obj/effect/ebeam/vine") })));
			break;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });

// venus_human_trap.dm:117
rt.def("/mob/living/simple_animal/hostile/venus_human_trap/proc/OpenFire", function* OpenFire(f: Frame, the_target: Value) {
	let dist: Value = get_dist(this, the_target);
	yield* this.Beam(the_target, "vine", { time: dist * 2, maxdistance: dist + 2, beam_type: T("/obj/effect/ebeam/vine") });
	yield* the_target.attack_animal(this);
	return f.dot;
}, true);

// venus_human_trap.dm:123
rt.def("/mob/living/simple_animal/hostile/venus_human_trap/proc/CanAttack", function CanAttack(f: Frame, the_target: Value) {
	f.dot = parent_proc();
	if (!f.dot) return f.dot;
	if (!rt.isIn(f, the_target, this.grasping)) return f.dot;
	return 0;
}, false);
