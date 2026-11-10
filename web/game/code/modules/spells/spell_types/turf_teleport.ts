// Based on /tg/station's code/modules/spells/spell_types/turf_teleport.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11340, "/obj/effect/proc_holder/spell/targeted/turf_teleport", "/obj/effect/proc_holder/spell/targeted", {
	inner_tele_radius: 1,
	outer_tele_radius: 2,
	include_space: 0,
	include_dense: 0,
	sound1: rt.rsc("sound/weapons/zapbang.ogg"),
	sound2: rt.rsc("sound/weapons/zapbang.ogg"),
	name: "Turf Teleport",
	desc: "This spell teleports the target to the turf in range.",
	nonabstract_req: 1,
});

// turf_teleport.dm:15
rt.def("/obj/effect/proc_holder/spell/targeted/turf_teleport/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let target: Value = null, turfs: Value = null, _T: Value = null, turfs_to_pick_from: Value = null, _T_3: Value = null, picked: Value = null;
	user ??= f.usr;
	playsound(rt.getStep(f, user, 0), this.sound1, 50, 1);
	for (target of each(targets, T("/mob/living"))) {
		turfs = (yield* new_(T("/list")));
		_T = null;
		for (_T of each(range(target, this.outer_tele_radius), T("/turf"))) {
			if (rt.isIn(f, _T, range(target, this.inner_tele_radius))) {
				continue;
			}
			if (rt.istype(_T, T("/turf/open/space")) && !this.include_space) {
				continue;
			}
			if (_T.density && !this.include_dense) {
				continue;
			}
			if (_T.x > rt.world().maxx - this.outer_tele_radius || _T.x < this.outer_tele_radius) {
				continue;
			}
			if (_T.y > rt.world().maxy - this.outer_tele_radius || _T.y < this.outer_tele_radius) {
				continue;
			}
			turfs += _T;
		}
		if (!rt.len(f, turfs)) {
			turfs_to_pick_from = list();
			_T_3 = null;
			for (_T_3 of each(orange(target, this.outer_tele_radius), T("/turf"))) {
				if (!rt.isIn(f, _T_3, orange(target, this.inner_tele_radius))) {
					turfs_to_pick_from += _T_3;
				}
			}
			turfs += pick((rt.isIn(f, T("/turf"), turfs_to_pick_from) ? 1 : 0));
		}
		if (!(picked = pick(turfs)) || !isturf(picked)) {
			return f.dot;
		}
		if (!(yield* target.Move(picked))) {
			if (target.buckled) {
				yield* target.buckled.unbuckle_mob(target, { force: 1 });
			}
			if (target.has_buckled_mobs()) {
				yield* target.unbuckle_all_mobs({ force: 1 });
			}
			target.loc = picked;
			playsound(rt.getStep(f, user, 0), this.sound2, 50, 1);
		}
	}
	return f.dot;
}, true);
