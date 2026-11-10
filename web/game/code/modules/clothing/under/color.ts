// Based on /tg/station's code/modules/clothing/under/color.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(8262, "/obj/item/clothing/under/color/random", "/obj/item/clothing/under/color", {});

// color.dm:5
rt.def("/obj/item/clothing/under/color/random/proc/New", function* New(f: Frame) {
	let C: Value = null;
	yield* parent_proc();
	this.name = rt.initial(f, (C = pick(typesof(T("/obj/item/clothing/under/color")) - T("/obj/item/clothing/under/color") - T("/obj/item/clothing/under/color/random"))), "name");
	this.icon_state = rt.initial(f, C, "icon_state");
	this.item_state = rt.initial(f, C, "item_state");
	this.item_color = rt.initial(f, C, "item_color");
	return f.dot;
}, true);

rt.type(8266, "/obj/item/clothing/under/color/grey/glorf", "/obj/item/clothing/under/color/grey", {
	name: "ancient jumpsuit",
	desc: "A terribly ragged and frayed grey jumpsuit. It looks like it hasn't been washed in over a decade.",
});

// color.dm:34
rt.def("/obj/item/clothing/under/color/grey/glorf/proc/hit_reaction", function* hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	attack_text ??= "the attack";
	final_block_chance ??= 0;
	damage ??= 0;
	attack_type ??= 1;
	yield* owner.forcesay(GLOB.hit_appends);
	return 0;
}, true);
