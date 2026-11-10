// Based on /tg/station's code/game/objects/items/weapons/courtroom.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(7150, "/obj/item/weapon/gavelhammer", "/obj/item/weapon", {
	name: "gavel hammer",
	desc: "Order, order! No bombs in my courthouse.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "gavelhammer",
	force: 5,
	throwforce: 6,
	w_class: 2,
	attack_verb: null,
	resistance_flags: 4,
});

// courtroom.dm:17
rt.def("/obj/item/weapon/gavelhammer/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} has sentenced ${user.p_them()}self to death with ${this}! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	playsound(this.loc, rt.rsc("sound/items/gavel.ogg"), 50, 1, -1);
	return 1;
});

rt.type(7151, "/obj/item/weapon/gavelblock", "/obj/item/weapon", {
	name: "gavel block",
	desc: "Smack it with a gavel hammer when the assistants get rowdy.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "gavelblock",
	force: 2,
	throwforce: 2,
	w_class: 1,
	resistance_flags: 4,
});

// courtroom.dm:32
rt.def("/obj/item/weapon/gavelblock/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/weapon/gavelhammer"))) {
		playsound(this.loc, rt.rsc("sound/items/gavel.ogg"), 100, 1);
		user.visible_message(`<span class='warning'>${user} strikes ${this} with ${I}.</span>`);
		user.changeNext_move(8);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);
