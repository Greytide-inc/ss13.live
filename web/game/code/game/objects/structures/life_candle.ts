// Based on /tg/station's code/game/objects/structures/life_candle.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(12794, "/obj/structure/life_candle", "/obj/structure", {
	icon_state_active: "candle1_lit",
	icon_state_inactive: "candle1",
	lit_luminosity: 2,
	linked_minds: null,
	mob_type: rt.typePath("/mob/living/carbon/human"),
	outfit: null,
	respawn_time: 50,
	respawn_sound: rt.rsc("sound/magic/staff_animation.ogg"),
	light_color: "#FAA019",
	anchored: 1,
	name: "life candle",
	desc: "You are dead. Insert quarter to continue.",
	icon: rt.rsc("icons/obj/candle.dmi"),
	icon_state: "candle1",
	resistance_flags: 115,
});

// life_candle.dm:16
rt.def("/obj/structure/life_candle/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.linked_minds = list();
	return f.dot;
});

// life_candle.dm:28
rt.def("/obj/structure/life_candle/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (!user.mind) {
		return f.dot;
	}
	if (rt.isIn(f, user.mind, this.linked_minds)) {
		user.visible_message(`<span class='notice'>${user} reaches out and pinches the flame of ${this}.</span>`, `<span class='warning'>You sever the connection between yourself and ${this}.</span>`);
		this.linked_minds -= user.mind;
	} else {
		user.visible_message(`<span class='notice'>${user} touches ${this}. It seems to respond to their presence!</span>`, `<span class='warning'>You create a connection between you and ${this}.</span>`);
		(rt.modSrcVar(f, "linked_minds", user.mind, rt.bitOr));
	}
	yield* this.update_icon();
	yield* this.float(rt.len(f, this.linked_minds));
	if (rt.len(f, this.linked_minds)) {
		if (!this.isprocessing) {
			this.isprocessing = 1;
			GLOB.SSobj.processing += this;
		}
		this.set_light(this.lit_luminosity);
	} else {
		this.isprocessing = 0;
		GLOB.SSobj.processing -= this;
		this.set_light(0);
	}
	return f.dot;
}, true);

// life_candle.dm:47
rt.def("/obj/structure/life_candle/proc/update_icon", function update_icon(f: Frame) {
	if (rt.len(f, this.linked_minds)) {
		this.icon_state = this.icon_state_active;
	} else {
		this.icon_state = this.icon_state_inactive;
	}
	return f.dot;
});

// life_candle.dm:53
rt.def("/obj/structure/life_candle/proc/examine", function examine(f: Frame, user: Value) {
	f.dot = parent_proc();
	if (rt.len(f, this.linked_minds)) {
		to_chat(user, `${this} is active, and linked to ${rt.len(f, this.linked_minds)} souls.`);
	} else {
		to_chat(user, "It is static, still, unmoving.");
	}
	return f.dot;
}, false);

// life_candle.dm:60
rt.def("/obj/structure/life_candle/proc/process", function* process(f: Frame) {
	let m: Value = null, mind: Value = null;
	if (!rt.len(f, this.linked_minds)) {
		this.isprocessing = 0;
		GLOB.SSobj.processing -= this;
		return f.dot;
	}
	for (m of each(this.linked_minds)) {
		if (!(mind = m).current || mind.current && mind.current.stat == 2) {
			yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/structure/life_candle/proc/respawn"), mind)), this.respawn_time, 1);
		}
	}
	return f.dot;
}, true, { waitfor: false });

// life_candle.dm:70
rt.def("/obj/structure/life_candle/proc/respawn", function* respawn(f: Frame, mind: Value) {
	let body: Value = null, ghostie: Value = null;
	let _T: Value = rt.getStep(f, this, 0);
	if (mind.current) {
		if (mind.current.stat != 2) {
			return f.dot;
		} else {
			body = mind.current;
		}
	}
	if (!body) {
		body = (yield* new_(this.mob_type, _T));
		if ((ghostie = mind.get_ghost(1)).client && ghostie.client.prefs) {
			yield* ghostie.client.prefs.copy_to(body);
		}
		yield* mind.transfer_to(body);
	} else {
		yield* body.forceMove(_T);
		yield* body.revive(1, 1);
	}
	yield* mind.grab_ghost(1);
	yield* body.flash_act();
	if (rt.istype(body, T("/mob/living/carbon/human")) && rt.istype(this.outfit, T("/datum/outfit"))) {
		yield* this.outfit.equip(body);
	}
	playsound(_T, this.respawn_sound, 50, 1);
	return f.dot;
}, true, { argTypes: [{ path: "/datum/mind" }] });
