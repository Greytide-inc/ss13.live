// Based on /tg/station's code/game/gamemodes/clock_cult/clock_items/soul_vessel.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9117, "/obj/item/device/mmi/posibrain/soul_vessel", "/obj/item/device/mmi/posibrain", {
	clockwork_desc: "A soul vessel, an ancient relic that can attract the souls of the damned or simply rip a mind from an unconscious or dead human.\n<span class='brass'>If active, can serve as a positronic brain, placable in cyborg shells or clockwork construct shells.</span>",
	name: "soul vessel",
	desc: "A heavy brass cube, three inches to a side, with a single protruding cogwheel.",
	icon: rt.rsc("icons/obj/clockwork_objects.dmi"),
	icon_state: "soul_vessel",
	req_access: null,
	braintype: "Servant",
	begin_activation_message: "<span class='brass'>You activate the cogwheel. It hitches and stalls as it begins spinning.</span>",
	success_message: "<span class='brass'>The cogwheel's rotation smooths out as the soul vessel activates.</span>",
	fail_message: "<span class='warning'>The cogwheel creaks and grinds to a halt. Maybe you could try again?</span>",
	new_role: "Soul Vessel",
	welcome_message: "<span class='warning'>ALL PAST LIVES ARE FORGOTTEN.</span>\n<b>You are a soul vessel - a clockwork mind created by Ratvar, the Clockwork Justiciar.\nYou answer to Ratvar and his servants. It is your discretion as to whether or not to answer to anyone else.\nThe purpose of your existence is to further the goals of the servants and Ratvar himself. Above all else, serve Ratvar.</b>",
	new_mob_message: "<span class='brass'>The soul vessel emits a jet of steam before its cogwheel smooths out.</span>",
	dead_message: "<span class='deadsay'>Its cogwheel, scratched and dented, lies motionless.</span>",
	possible_names: null,
	autoping: 0,
	resistance_flags: 34,
	force_replace_ai_name: 1,
});

// soul_vessel.dm:9
rt.def("/obj/item/device/mmi/posibrain/soul_vessel/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list();
	this.possible_names = list("Judge", "Guard", "Servant", "Smith", "Auger");
	return f.dot;
});

// soul_vessel.dm:27
rt.def("/obj/item/device/mmi/posibrain/soul_vessel/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.radio.on = 0;
	this.laws = (yield* new_(T("/datum/ai_laws/ratvar")));
	this.braintype = this.picked_name;
	GLOB.all_clockwork_objects += this;
	return f.dot;
}, true);

// soul_vessel.dm:34
rt.def("/obj/item/device/mmi/posibrain/soul_vessel/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.all_clockwork_objects -= this;
	return (yield* parent_proc());
}, true);

// soul_vessel.dm:38
rt.def("/obj/item/device/mmi/posibrain/soul_vessel/proc/examine", function examine(f: Frame, user: Value) {
	if ((is_servant_of_ratvar(user) || rt.istype(user, T("/mob/dead/observer"))) && this.clockwork_desc) {
		this.desc = this.clockwork_desc;
	}
	parent_proc();
	this.desc = rt.initial(f, this, "desc");
	return f.dot;
}, false);

// soul_vessel.dm:44
rt.def("/obj/item/device/mmi/posibrain/soul_vessel/proc/transfer_personality", function* transfer_personality(f: Frame, candidate: Value) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	yield* add_servant_of_ratvar(this.brainmob, 1);
	return f.dot;
}, true);

// soul_vessel.dm:49
rt.def("/obj/item/device/mmi/posibrain/soul_vessel/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (!is_servant_of_ratvar(user)) {
		to_chat(user, `<span class='warning'>You fiddle around with ${this}, to no avail.</span>`);
		return 0;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// soul_vessel.dm:55
rt.def("/obj/item/device/mmi/posibrain/soul_vessel/proc/attack", function* attack(f: Frame, target: Value, user: Value) {
	let H: Value = null, I: Value = null, HE: Value = null, B: Value = null;
	if (!is_servant_of_ratvar(user) || !rt.istype(target, T("/mob/living/carbon/human"))) {
		yield* parent_proc();
		return f.dot;
	}
	if (!this.brainmob || this.brainmob.gc_destroyed) {
		return f.dot;
	}
	if (this.brainmob.key) {
		to_chat(user, "<span class='nezbere'>\"This vessel is filled, friend. Provide it with a body.\"</span>");
		return f.dot;
	}
	if (is_servant_of_ratvar(target)) {
		to_chat(user, "<span class='nezbere'>\"It would be more wise to revive your allies, friend.\"</span>");
		return f.dot;
	}
	if ((H = target).stat == 0) {
		to_chat(user, `<span class='warning'>${H} must be dead or unconscious for you to claim ${H.p_their()} mind!</span>`);
		return f.dot;
	}
	if (H.head) {
		if (rt.bitAnd((I = H.head).flags_inv, HIDEHAIR)) {
			to_chat(user, `<span class='warning'>${H}'s head is covered, remove ${H.head} first!</span>`);
			return f.dot;
		}
	}
	if (H.wear_mask) {
		if (rt.bitAnd((I = H.wear_mask).flags_inv, HIDEHAIR)) {
			to_chat(user, `<span class='warning'>${H}'s head is covered, remove ${H.wear_mask} first!</span>`);
			return f.dot;
		}
	}
	if (!(HE = H.get_bodypart("head"))) {
		to_chat(user, `<span class='warning'>${H} has no head, and thus no mind to claim!</span>`);
		return f.dot;
	}
	if (!(B = H.getorgan(T("/obj/item/organ/brain")))) {
		to_chat(user, `<span class='warning'>${H} has no brain, and thus no mind to claim!</span>`);
		return f.dot;
	}
	if (!H.key) {
		to_chat(user, `<span class='warning'>${H} has no mind to claim!</span>`);
		return f.dot;
	}
	playsound(H, rt.rsc("sound/misc/splort.ogg"), 60, 1, -1);
	playsound(H, rt.rsc("sound/magic/clockwork/anima_fragment_attack.ogg"), 40, 1, -1);
	let prev_fakedeath: Value = rt.bitAnd(H.status_flags, 8192);
	(rt.modField(f, H, "status_flags", 8192, rt.bitOr));
	yield* H.death();
	if (!prev_fakedeath) {
		(rt.modField(f, H, "status_flags", 16769023, rt.bitAnd));
	}
	yield* H.apply_status_effect(T("/datum/status_effect/sigil_mark"));
	this.picked_name = "Slave";
	this.braintype = this.picked_name;
	this.brainmob.timeofhostdeath = H.timeofdeath;
	user.visible_message(`<span class='warning'>${user} presses ${this} to ${H}'s head, ripping through the skull and carefully extracting the brain!</span>`, `<span class='brass'>You extract ${H}'s consciousness from ${H.p_their()} body, trapping it in the soul vessel.</span>`);
	yield* this.transfer_personality(H);
	yield* this.brainmob.fully_replace_character_name(null, `${this.braintype} ${H.real_name}`);
	this.name = `${rt.initial(f, this, "name")} (${this.brainmob.name})`;
	yield* B.Remove(H);
	yield* qdel(B);
	yield* H.update_hair();
	return f.dot;
}, true);
