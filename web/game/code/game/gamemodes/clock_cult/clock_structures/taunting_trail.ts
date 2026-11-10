// Based on /tg/station's code/game/gamemodes/clock_cult/clock_structures/taunting_trail.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(12163, "/obj/structure/destructible/clockwork/taunting_trail", "/obj/structure/destructible/clockwork", {
	timerid: null,
	clockwork_desc: "A cloud of purple smoke that confuses and knocks down non-Servants that enter it.",
	name: "strange smoke",
	desc: "A cloud of purple smoke.",
	gender: "plural",
	max_integrity: 5,
	obj_integrity: 5,
	density: 1,
	color: null,
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "smoke",
	break_message: null,
	break_sound: rt.rsc("sound/magic/teleport_app.ogg"),
	debris: null,
});

// taunting_trail.dm:10
rt.def("/obj/structure/destructible/clockwork/taunting_trail/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.color = list("#AF0AAF", "#AF0AAF", "#AF0AAF", "#000000");

	this.debris = list();
	return f.dot;
});

// taunting_trail.dm:19
rt.def("/obj/structure/destructible/clockwork/taunting_trail/proc/Initialize", function* Initialize(f: Frame) {
	let Tt: Value = null, TT: Value = null;
	f.dot = (yield* parent_proc());
	this.timerid = (yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this)), 15, 8));
	if ((Tt = rt.locateIn(f, T("/obj/structure/destructible/clockwork/taunting_trail"), this.loc)) && Tt != this) {
		if (!(yield* step(this, pick(GLOB.alldirs)))) {
			yield* qdel(Tt);
		} else {
			for (TT of each(this.loc, T("/obj/structure/destructible/clockwork/taunting_trail"))) {
				if (TT != this) {
					yield* qdel(TT);
				}
			}
		}
	}
	yield* this.setDir(pick(GLOB.cardinal));
	this.transform = matrix() * 1.3;
	rt.op(f, "Animate", [2, 6], [null, this, "alpha", 100, "time", 15]);
	return f.dot;
}, true);

// taunting_trail.dm:34
rt.def("/obj/structure/destructible/clockwork/taunting_trail/proc/Destroy", function* Destroy(f: Frame) {
	yield* deltimer(this.timerid);
	return (yield* parent_proc());
}, true);

// taunting_trail.dm:38
rt.def("/obj/structure/destructible/clockwork/taunting_trail/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	damage_type ??= "brute";
	damage_flag ??= 0;
	playsound(this, rt.rsc("sound/items/welder.ogg"), 50, 1);
	return f.dot;
});

// taunting_trail.dm:44
rt.def("/obj/structure/destructible/clockwork/taunting_trail/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	yield* this.affect_mob(AM);
	return (yield* parent_proc());
}, true);

// taunting_trail.dm:48
rt.def("/obj/structure/destructible/clockwork/taunting_trail/proc/Bumped", function* Bumped(f: Frame, AM: Value) {
	yield* this.affect_mob(AM);
	return (yield* parent_proc());
}, true);

// taunting_trail.dm:52
rt.def("/obj/structure/destructible/clockwork/taunting_trail/proc/Bump", function* Bump(f: Frame, AM: Value) {
	yield* this.affect_mob(AM);
	return (yield* parent_proc());
}, true);

// taunting_trail.dm:56
rt.def("/obj/structure/destructible/clockwork/taunting_trail/proc/affect_mob", function* affect_mob(f: Frame, L: Value) {
	if (!(rt.istype(L, T("/mob/living")) && !is_servant_of_ratvar(L))) return f.dot;
	if (!L.null_rod_check()) {
		L.confused = min(L.confused + 15, 50);
		L.dizziness = min(L.dizziness + 15, 50);
		if (L.confused >= 25) {
			yield* L.Knockdown(Floor(L.confused * 0.8));
		}
	}
	yield* this.take_damage(this.max_integrity);
	return f.dot;
}, true);
