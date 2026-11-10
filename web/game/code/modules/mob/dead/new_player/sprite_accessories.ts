// Based on /tg/station's code/modules/mob/dead/new_player/sprite_accessories.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// sprite_accessories.dm:20
rt.def("/proc/init_sprite_accessory_subtypes", function* init_sprite_accessory_subtypes(f: Frame, prototype: Value, L: Value, male: Value, female: Value, roundstart: Value) {
	let path: Value = null, _P: Value = null, D: Value = null;
	let $e: any;
	roundstart ??= 0;
	if (!rt.istype(L, T("/list"))) {
		L = list();
	}
	if (!rt.istype(male, T("/list"))) {
		male = list();
	}
	if (!rt.istype(female, T("/list"))) {
		female = list();
	}
	for (path of each(typesof(prototype))) {
		if (path == prototype) {
			continue;
		}
		if (roundstart) {
			if (rt.initial(f, (_P = path), "locked")) {
				continue;
			}
		}
		if ((D = (yield* new_(path))).icon_state) {
			rt.setAt(L, D.name, D);
		} else {
			L += D.name;
		}
		if (D.gender === "male") {
			male += D.name;
		} else if (D.gender === "female") {
			female += D.name;
		} else {
			male += D.name;
			female += D.name;
		}
	}
	return L;
}, true);
