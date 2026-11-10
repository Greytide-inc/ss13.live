// Based on /tg/station's code/modules/spells/spell_types/mime.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11364, "/obj/effect/proc_holder/spell/aoe_turf/conjure/mime_wall", "/obj/effect/proc_holder/spell/aoe_turf/conjure", {
	summon_lifespan: 300,
	cast_sound: null,
	name: "Invisible Wall",
	desc: "The mime's performance transmutates into physical reality.",
	school: "mime",
	panel: "Mime",
	summon_type: null,
	invocation_type: "emote",
	invocation_emote_self: "<span class='notice'>You form a wall in front of yourself.</span>",
	charge_max: 300,
	clothes_req: 0,
	range: 0,
	human_req: 1,
	action_icon_state: "mime",
	action_background_icon_state: "bg_mime",
});

// mime.dm:6
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/mime_wall/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.summon_type = list(T("/obj/effect/forcefield/mime"));
	return f.dot;
});

// mime.dm:20
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/mime_wall/proc/Click", function* Click(f: Frame) {
	if (f.usr && f.usr.mind) {
		if (!f.usr.mind.miming) {
			to_chat(f.usr, "<span class='notice'>You must dedicate yourself to silence first.</span>");
			return f.dot;
		}
		this.invocation = `<B>${f.usr.real_name}</B> looks as if a wall is in front of ${f.usr.p_them()}.`;
	} else {
		this.invocation_type = "none";
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(11328, "/obj/effect/proc_holder/spell/targeted/mime/speak", "/obj/effect/proc_holder/spell/targeted/mime", {
	include_user: 1,
	name: "Speech",
	desc: "Make or break a vow of silence.",
	school: "mime",
	panel: "Mime",
	clothes_req: 0,
	human_req: 1,
	charge_max: 3000,
	range: -1,
	action_icon_state: "mime",
	action_background_icon_state: "bg_mime",
});

// mime.dm:45
rt.def("/obj/effect/proc_holder/spell/targeted/mime/speak/proc/Click", function* Click(f: Frame) {
	let H: Value = null;
	if (!f.usr) {
		return f.dot;
	}
	if (!rt.istype(f.usr, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	if ((H = f.usr).mind.miming) {
		this.still_recharging_msg = "<span class='warning'>You can't break your vow of silence that fast!</span>";
	} else {
		this.still_recharging_msg = "<span class='warning'>You'll have to wait before you can give your vow of silence again!</span>";
	}
	yield* parent_proc();
	return f.dot;
}, true);

// mime.dm:57
rt.def("/obj/effect/proc_holder/spell/targeted/mime/speak/proc/cast", function cast(f: Frame, targets: Value, user: Value) {
	let H: Value = null;
	user ??= f.usr;
	for (H of each(targets, T("/mob/living/carbon/human"))) {
		H.mind.miming = (!H.mind.miming ? 1 : 0);
		if (H.mind.miming) {
			to_chat(H, "<span class='notice'>You make a vow of silence.</span>");
		} else {
			to_chat(H, "<span class='notice'>You break your vow of silence.</span>");
		}
	}
	return f.dot;
});

rt.type(11315, "/obj/effect/proc_holder/spell/targeted/forcewall/mime", "/obj/effect/proc_holder/spell/targeted/forcewall", {
	include_user: 1,
	name: "Invisible Blockade",
	desc: "Form an invisible three tile wide blockade.",
	wall_type: rt.typePath("/obj/effect/forcefield/mime/advanced"),
	invocation_type: "emote",
	invocation_emote_self: "<span class='notice'>You form a blockade in front of yourself.</span>",
	charge_max: 600,
	sound: null,
	clothes_req: 0,
	range: -1,
	action_icon_state: "mime",
	action_background_icon_state: "bg_mime",
});

// mime.dm:82
rt.def("/obj/effect/proc_holder/spell/targeted/forcewall/mime/proc/Click", function* Click(f: Frame) {
	if (f.usr && f.usr.mind) {
		if (!f.usr.mind.miming) {
			to_chat(f.usr, "<span class='notice'>You must dedicate yourself to silence first.</span>");
			return f.dot;
		}
		this.invocation = `<B>${f.usr.real_name}</B> looks as if a blockade is in front of ${f.usr.p_them()}.`;
	} else {
		this.invocation_type = "none";
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(11381, "/obj/effect/proc_holder/spell/aimed/finger_guns", "/obj/effect/proc_holder/spell/aimed", {
	school: "mime",
	charge_max: 300,
	clothes_req: 0,
	invocation_type: "emote",
	invocation_emote_self: "<span class='dangers'>You fire your finger gun!</span>",
	range: 20,
	projectile_type: rt.typePath("/obj/item/projectile/bullet/weakbullet2"),
	projectile_amount: 3,
	sound: null,
	active_msg: "You draw your fingers!",
	deactive_msg: "You put your fingers at ease. Another time.",
	action_icon_state: "mime",
	action_background_icon_state: "bg_mime",
	base_icon_state: "mime",
	name: "Finger Guns",
	desc: "Shoot a mimed bullet from your fingers that stuns and does some damage.",
	panel: "Mime",
	active: 0,
});

// mime.dm:114
rt.def("/obj/effect/proc_holder/spell/aimed/finger_guns/proc/Click", function* Click(f: Frame) {
	let owner: Value = null;
	if ((owner = f.usr).incapacitated()) {
		to_chat(owner, "<span class='warning'>You can't properly point your fingers while incapacitated.</span>");
		return f.dot;
	}
	if (f.usr && f.usr.mind) {
		if (!f.usr.mind.miming) {
			to_chat(f.usr, "<span class='notice'>You must dedicate yourself to silence first.</span>");
			return f.dot;
		}
		this.invocation = `<B>${f.usr.real_name}</B> fires ${f.usr.p_their()} finger gun!`;
	} else {
		this.invocation_type = "none";
	}
	yield* parent_proc();
	return f.dot;
}, true);
