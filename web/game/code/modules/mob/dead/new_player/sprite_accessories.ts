// From code/modules/mob/dead/new_player/sprite_accessories.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/init_sprite_accessory_subtypes  (code/modules/mob/dead/new_player/sprite_accessories.dm:20)  may sleep
rt.def("/proc/init_sprite_accessory_subtypes", function* init_sprite_accessory_subtypes(f: Frame, prototype: Value, L: Value, male: Value, female: Value, roundstart: Value) {
	let path: Value = null, _P: Value = null, D: Value = null;
	let $0: any, $e: any;
	f.vars = () => [prototype, L, male, female, roundstart, path, _P, D, $0, $e];
	if (live(roundstart) === null) {
		roundstart = 0;
	}
	if (!truthy((rt.istype(live(L), T("/list")) ? 1 : 0))) {
		L = rt.list();
	}
	if (!truthy((rt.istype(live(male), T("/list")) ? 1 : 0))) {
		male = rt.list();
	}
	if (!truthy((rt.istype(live(female), T("/list")) ? 1 : 0))) {
		female = rt.list();
	}
	path = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/typesof"), null, [live(prototype)])));
	while (($e = rt.next(f, 0)) !== undefined) {
		path = $e;
		if (isEqual(live(path), live(prototype))) {
			continue;
		}
		if (truthy(live(roundstart))) {
			if (truthy(rt.initial(f, (_P = live(path)), "locked"))) {
				continue;
			}
		}
		if (truthy(rt.gv(f, "icon_state", (D = (yield* g.new_(f, live(path), [])))))) {
			rt.setAt(live(L), rt.fv(f, "name", live(D)), live(D));
		} else {
			L = rt.modify(live(L), rt.fv(f, "name", live(D)), add);
		}
		$0 = rt.fv(f, "gender", live(D));
		if ($0 === "male") {
			male = rt.modify(live(male), rt.fv(f, "name", live(D)), add);
		} else if ($0 === "female") {
			female = rt.modify(live(female), rt.fv(f, "name", live(D)), add);
		} else {
			male = rt.modify(live(male), rt.fv(f, "name", live(D)), add);
			female = rt.modify(live(female), rt.fv(f, "name", live(D)), add);
		}
	}
	rt.endFor(f, 0);
	return live(L);
}, true);
