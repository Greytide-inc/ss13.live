// Based on /tg/station's code/modules/admin/verbs/bluespacearty.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// bluespacearty.dm:2
rt.def("/client/proc/bluespace_artillery", function* bluespace_artillery(f: Frame, M: Value) {
	let target: Value = null, _T: Value = null;
	if (!this.holder || !check_rights(8)) {
		return f.dot;
	}
	if (!rt.istype((target = M), T("/mob/living"))) {
		to_chat(f.usr, "This can only be used on instances of type /mob/living");
		return f.dot;
	}
	yield* explosion(target.loc, 0, 0, 0, 0);
	if (rt.istype((_T = rt.getStep(f, target, 0)), T("/turf/open/floor"))) {
		if (prob(80)) {
			yield* _T.break_tile_to_plating();
		} else {
			yield* _T.break_tile();
		}
	}
	if (target.health <= 1) {
		yield* target.gib(1, 1);
	} else {
		yield* target.adjustBruteLoss(min(99, target.health - 1));
		yield* target.Knockdown(400);
		target.stuttering = 20;
	}
	return f.dot;
}, true);
