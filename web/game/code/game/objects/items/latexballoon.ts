// Based on /tg/station's code/game/objects/items/latexballoon.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9776, "/obj/item/latexballon", "/obj/item", {
	state: null,
	air_contents: null,
	item_state: "lgloves",
	w_class: 1,
	throw_speed: 1,
	throw_range: 7,
	name: "latex glove",
	desc: "Sterile and airtight.",
	icon_state: "latexballon",
	force: 0,
	throwforce: 0,
});

// latexballoon.dm:15
rt.def("/obj/item/latexballon/proc/blow", function* blow(f: Frame, tank: Value, user: Value) {
	if (this.icon_state == "latexballon_bursted") {
		return f.dot;
	}
	this.icon_state = "latexballon_blow";
	this.item_state = "latexballon";
	yield* user.update_inv_hands();
	to_chat(user, `<span class='notice'>You blow up ${this} with ${tank}.</span>`);
	this.air_contents = (yield* tank.remove_air_volume(3));
	return f.dot;
}, true);

// latexballoon.dm:24
rt.def("/obj/item/latexballon/proc/burst", function* burst(f: Frame) {
	let user: Value = null;
	if (!this.air_contents || this.icon_state != "latexballon_blow") {
		return f.dot;
	}
	playsound(this, rt.rsc("sound/weapons/gunshot.ogg"), 100, 1);
	this.icon_state = "latexballon_bursted";
	this.item_state = "lgloves";
	if (rt.istype(this.loc, T("/mob/living"))) {
		yield* (user = this.loc).update_inv_hands();
	}
	yield* this.loc.assume_air(this.air_contents);
	return f.dot;
}, true);

// latexballoon.dm:35
rt.def("/obj/item/latexballon/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	yield* this.burst();
	if (severity === 1) {
		yield* qdel(this);
	} else if (severity === 2) {
		if (!prob(50)) return f.dot;
		yield* qdel(this);
	}
	return f.dot;
}, true, { waitfor: false });

// latexballoon.dm:44
rt.def("/obj/item/latexballon/proc/bullet_act", function* bullet_act(f: Frame) {
	yield* this.burst();
	return f.dot;
}, true);

// latexballoon.dm:47
rt.def("/obj/item/latexballon/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, temperature: Value, volume: Value) {
	if (!(temperature > 373.15)) return f.dot;
	yield* this.burst();
	return f.dot;
}, true);

// latexballoon.dm:51
rt.def("/obj/item/latexballon/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let _T: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/tank"))) {
		yield* this.blow((_T = W), user);
		return f.dot;
	}
	if (!(W.is_sharp() || W.is_hot() || is_type_in_typecache(W, GLOB.pointed_types))) return f.dot;
	yield* this.burst();
	return f.dot;
}, true);
