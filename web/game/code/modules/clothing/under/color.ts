// From code/modules/clothing/under/color.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8262, "/obj/item/clothing/under/color/random", "/obj/item/clothing/under/color", {});

// /obj/item/clothing/under/color/random/proc/New  (code/modules/clothing/under/color.dm:5)  may sleep
rt.def("/obj/item/clothing/under/color/random/proc/New", function* New(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "name", rt.initial(f, (C = rt.op(f, "PickUnweighted", [1], [subtract(subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/clothing/under/color")])), T("/obj/item/clothing/under/color")), T("/obj/item/clothing/under/color/random"))])), "name"));
	rt.setSv(f, "icon_state", rt.initial(f, live(C), "icon_state"));
	rt.setSv(f, "item_state", rt.initial(f, live(C), "item_state"));
	rt.setSv(f, "item_color", rt.initial(f, live(C), "item_color"));
	return f.dot;
}, true);

rt.type(8266, "/obj/item/clothing/under/color/grey/glorf", "/obj/item/clothing/under/color/grey", {
	name: "ancient jumpsuit",
	desc: "A terribly ragged and frayed grey jumpsuit. It looks like it hasn't been washed in over a decade.",
});

// /obj/item/clothing/under/color/grey/glorf/proc/hit_reaction  (code/modules/clothing/under/color.dm:34)  may sleep
rt.def("/obj/item/clothing/under/color/grey/glorf/proc/hit_reaction", function* hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	f.vars = () => [owner, hitby, attack_text, final_block_chance, damage, attack_type];
	if (live(attack_text) === null) {
		attack_text = "the attack";
	}
	if (live(final_block_chance) === null) {
		final_block_chance = 0;
	}
	if (live(damage) === null) {
		damage = 0;
	}
	if (live(attack_type) === null) {
		attack_type = 1;
	}
	yield* g.callName(f, live(owner), "forcesay", [rt.gl("hit_appends")]);
	return 0;
}, true);
