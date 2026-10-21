// From code/modules/clothing/under/jobs/civilian.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8286, "/obj/item/clothing/under/rank/clown", "/obj/item/clothing/under/rank", {
	name: "clown suit",
	desc: "<i>'HONK!'</i>",
	icon_state: "clown",
	item_state: "clown",
	item_color: "clown",
	fitted: 2,
	can_adjust: 0,
});

// /obj/item/clothing/under/rank/clown/proc/hit_reaction  (code/modules/clothing/under/jobs/civilian.dm:62)
rt.def("/obj/item/clothing/under/rank/clown/proc/hit_reaction", function hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	f.vars = () => [attack_text, final_block_chance, damage, attack_type];
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
	rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/bikehorn.ogg"), 50, 1, -1]);
	return 0;
});

rt.type(8304, "/obj/item/clothing/under/rank/janitor", "/obj/item/clothing/under/rank", {
	desc: "It's the official uniform of the station's janitor. It has minor protection from biohazards.",
	name: "janitor's jumpsuit",
	icon_state: "janitor",
	item_color: "janitor",
	armor: null,
});

// /obj/item/clothing/under/rank/janitor/proc/<init>  (code/modules/clothing/under/jobs/civilian.dm:86)
rt.def("/obj/item/clothing/under/rank/janitor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 10, "rad", 0, "fire", 0, "acid", 0]));
	return f.dot;
});
