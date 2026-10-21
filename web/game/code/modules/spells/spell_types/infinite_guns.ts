// From code/modules/spells/spell_types/infinite_guns.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11319, "/obj/effect/proc_holder/spell/targeted/infinite_guns", "/obj/effect/proc_holder/spell/targeted", {
	summon_path: rt.typePath("/obj/item/weapon/gun/ballistic/shotgun/boltaction/enchanted"),
	include_user: 1,
	name: "Lesser Summon Guns",
	desc: "Why reload when you have infinite guns? Summons an unending stream of bolt action rifles. Requires both hands free to use. Learning this spell makes you unable to learn Arcane Barrage.",
	invocation_type: "none",
	range: -1,
	school: "conjuration",
	charge_max: 750,
	clothes_req: 1,
	cooldown_min: 10,
	action_icon_state: "bolt_action",
});

// /obj/effect/proc_holder/spell/targeted/infinite_guns/proc/cast  (code/modules/spells/spell_types/infinite_guns.dm:16)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/infinite_guns/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let C: Value = null, GUN: Value = null;
	let $e: any;
	f.vars = () => [targets, user, C, GUN, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	C = null;
	rt.forList(f, 0, live(targets), T("/mob/living/carbon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		yield* g.callName(f, live(C), "drop_item", []);
		yield* g.callName(f, live(C), "swap_hand", []);
		yield* g.callName(f, live(C), "drop_item", []);
		GUN = (yield* g.new_(f, rt.sv(f, "summon_path"), []));
		yield* g.callName(f, live(C), "put_in_hands", [live(GUN)]);
		yield* g.callName(f, live(C), "swap_hand", [(yield* g.callName(f, live(C), "get_held_index_of_item", [live(GUN)]))]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
