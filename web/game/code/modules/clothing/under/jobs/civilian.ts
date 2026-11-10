// Based on /tg/station's code/modules/clothing/under/jobs/civilian.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(8286, "/obj/item/clothing/under/rank/clown", "/obj/item/clothing/under/rank", {
	name: "clown suit",
	desc: "<i>'HONK!'</i>",
	icon_state: "clown",
	item_state: "clown",
	item_color: "clown",
	fitted: 2,
	can_adjust: 0,
});

// civilian.dm:62
rt.def("/obj/item/clothing/under/rank/clown/proc/hit_reaction", function hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	attack_text ??= "the attack";
	final_block_chance ??= 0;
	damage ??= 0;
	attack_type ??= 1;
	playsound(this.loc, rt.rsc("sound/items/bikehorn.ogg"), 50, 1, -1);
	return 0;
});

rt.type(8304, "/obj/item/clothing/under/rank/janitor", "/obj/item/clothing/under/rank", {
	desc: "It's the official uniform of the station's janitor. It has minor protection from biohazards.",
	name: "janitor's jumpsuit",
	icon_state: "janitor",
	item_color: "janitor",
	armor: null,
});

// civilian.dm:86
rt.def("/obj/item/clothing/under/rank/janitor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 10, "rad", 0, "fire", 0, "acid", 0]);
	return f.dot;
});
