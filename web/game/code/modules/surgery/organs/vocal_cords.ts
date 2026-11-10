// Based on /tg/station's code/modules/surgery/organs/vocal_cords.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


rt.type(9532, "/obj/item/organ/vocal_cords", "/obj/item/organ", {
	spans: null,
	zone: "mouth",
	slot: "vocal_cords",
	name: "vocal cords",
	icon_state: "appendix",
	gender: "plural",
});

// vocal_cords.dm:21
rt.def("/obj/item/organ/vocal_cords/proc/handle_speech", function* handle_speech(f: Frame, message: Value) {
	yield* this.owner.say(message, { spans: this.spans, sanitize: 0 });
	return f.dot;
}, true);

rt.type(9533, "/obj/item/organ/vocal_cords/adamantine", "/obj/item/organ/vocal_cords", {
	zone: "mouth",
	slot: "vocal_cords",
	name: "adamantine vocal cords",
	desc: "When adamantine resonates, it causes all nearby pieces of adamantine to resonate as well. Adamantine golems use this to broadcast messages to nearby golems.",
	actions_types: null,
	icon_state: "adamantine_cords",
});

// vocal_cords.dm:33
rt.def("/obj/item/organ/vocal_cords/adamantine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/organ_action/use/adamantine_vocal_cords"));
	return f.dot;
});

rt.type(229, "/datum/action/item_action/organ_action/use/adamantine_vocal_cords", "/datum/action/item_action/organ_action/use", {});

// vocal_cords.dm:39
rt.def("/datum/action/item_action/organ_action/use/adamantine_vocal_cords/proc/Trigger", function* Trigger(f: Frame) {
	if (!(yield* this.IsAvailable())) {
		return f.dot;
	}
	let message: Value = (yield* g.op(f, "Prompt", [2], [null, "Resonate", "Resonate a message to all nearby golems.", this.owner, null]));
	if (!this || this.gc_destroyed || !this.owner || this.owner.gc_destroyed || !message) {
		return f.dot;
	}
	yield* this.owner.say(`.x${message}`);
	return f.dot;
}, true);

// vocal_cords.dm:47
rt.def("/obj/item/organ/vocal_cords/adamantine/proc/handle_speech", function handle_speech(f: Frame, message: Value) {
	let m: Value = null, C: Value = null, link: Value = null;
	let msg: Value = `<span class='resonate'><span class='name'>${this.owner.real_name}</span> <span class='message'>resonates, "${message}"</span></span>`;
	for (m of each(GLOB.player_list)) {
		if (rt.istype(m, T("/mob/living/carbon"))) {
			if ((C = m).getorganslot("adamantine_resonator")) {
				to_chat(C, msg);
			}
		}
		if (rt.istype(m, T("/mob/dead/observer"))) {
			link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [m, this.owner]);
			to_chat(m, `${link} ${msg}`);
		}
	}
	return f.dot;
});

rt.type(9534, "/obj/item/organ/vocal_cords/colossus", "/obj/item/organ/vocal_cords", {
	next_command: 0,
	cooldown_mod: 1,
	base_multiplier: 1,
	zone: "mouth",
	slot: "vocal_cords",
	spans: null,
	name: "divine vocal cords",
	desc: "They carry the voice of an ancient god.",
	icon_state: "voice_of_god",
	actions_types: null,
});

// vocal_cords.dm:64
rt.def("/obj/item/organ/vocal_cords/colossus/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spans = list("colossus", "yell");

	this.actions_types = list(T("/datum/action/item_action/organ_action/colossus"));
	return f.dot;
});

rt.type(231, "/datum/action/item_action/organ_action/colossus", "/datum/action/item_action/organ_action", {
	cords: null,
	name: "Voice of God",
});

// vocal_cords.dm:75
rt.def("/datum/action/item_action/organ_action/colossus/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.cords = this.target;
	return f.dot;
}, true);

// vocal_cords.dm:79
rt.def("/datum/action/item_action/organ_action/colossus/proc/IsAvailable", function IsAvailable(f: Frame) {
	if (rt.worldTime(f) < this.cords.next_command) {
		return 0;
	}
	if (!this.owner) {
		return 0;
	}
	if (!this.owner.can_speak()) {
		return 0;
	}
	if (rt.bitAnd(this.check_flags, AB_CHECK_CONSCIOUS)) {
		if (this.owner.stat) {
			return 0;
		}
	}
	return 1;
});

// vocal_cords.dm:91
rt.def("/datum/action/item_action/organ_action/colossus/proc/Trigger", function* Trigger(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!(yield* this.IsAvailable())) {
		if (rt.worldTime(f) < this.cords.next_command) {
			to_chat(this.owner, `<span class='notice'>You must wait ${(this.cords.next_command - rt.worldTime(f)) / 10} seconds before Speaking again.</span>`);
		}
		return f.dot;
	}
	let command: Value = (yield* g.op(f, "Prompt", [2], [null, "Command", "Speak with the Voice of God", this.owner, null]));
	if (!this || this.gc_destroyed || !this.owner || this.owner.gc_destroyed) {
		return f.dot;
	}
	if (!command) {
		return f.dot;
	}
	yield* this.owner.say(`.x${command}`);
	return f.dot;
}, true);

// vocal_cords.dm:104
rt.def("/obj/item/organ/vocal_cords/colossus/proc/can_speak_with", function can_speak_with(f: Frame) {
	if (rt.worldTime(f) < this.next_command) {
		to_chat(this.owner, `<span class='notice'>You must wait ${(this.next_command - rt.worldTime(f)) / 10} seconds before Speaking again.</span>`);
		return 0;
	}
	if (!this.owner) {
		return 0;
	}
	if (!this.owner.can_speak()) {
		to_chat(this.owner, "<span class='warning'>You are unable to speak!</span>");
		return 0;
	}
	return 1;
});

// vocal_cords.dm:115
rt.def("/obj/item/organ/vocal_cords/colossus/proc/handle_speech", function* handle_speech(f: Frame, message: Value) {
	yield* this.owner.say(uppertext(message), { spans: this.spans, sanitize: 0 });
	playsound(rt.getStep(f, this.owner, 0), rt.rsc("sound/magic/clockwork/invoke_general.ogg"), 300, 1, 5);
	return f.dot;
}, true);

// vocal_cords.dm:120
rt.def("/obj/item/organ/vocal_cords/colossus/proc/speak_with", function* speak_with(f: Frame, message: Value) {
	let cooldown: Value = (yield* voice_of_god(message, this.owner, this.spans, this.base_multiplier));
	this.next_command = rt.worldTime(f) + cooldown * this.cooldown_mod;
	return f.dot;
}, true);

// vocal_cords.dm:130
rt.def("/proc/voice_of_god", function* voice_of_god(f: Frame, message: Value, user: Value, span_list: Value, base_multiplier: Value) {
	let L: Value = null, H: Value = null, found_string: Value = null, V: Value = null, L_7: Value = null, devilinfo: Value = null, start: Value = null, C: Value = null, H_6: Value = null, throwtarget: Value = null, S: Value = null, direction: Value = null, i: Value = null, V_8: Value = null, L_9: Value = null, chair: Value = null;
	let $0: any, $1: any, $e: any;
	base_multiplier ??= 1;
	let cooldown: Value = 0;
	if (!user || !user.can_speak() || user.stat) {
		return 0;
	}
	let log_message: Value = uppertext(message);
	if (!span_list || !rt.len(f, span_list)) {
		if (iscultist(user)) {
			span_list = list("narsiesmall");
		} else if (is_servant_of_ratvar(user)) {
			span_list = list("ratvar");
		} else {
			span_list = list();
		}
	}
	message = lowertext(message);
	let listeners: Value = list();
	for (L of each(get_hearers_in_view(8, user), T("/mob/living"))) {
		if (L.can_hear() && !L.null_rod_check() && L != user && L.stat != 2) {
			if (rt.istype(L, T("/mob/living/carbon/human"))) {
				if (rt.istype((H = L).ears, T("/obj/item/clothing/ears/earmuffs"))) {
					continue;
				}
			}
			listeners += L;
		}
	}
	if (!rt.len(f, listeners)) {
		return (cooldown = COOLDOWN_NONE);
	}
	let power_multiplier: Value = base_multiplier;
	if (user.mind) {
		if (user.mind.assigned_role == "Chaplain") {
			power_multiplier *= 2;
		}
		if (rt.isIn(f, user.mind.assigned_role, GLOB.command_positions)) {
			power_multiplier *= 1.4;
		}
		if (user.mind.assigned_role == "Mime") {
			power_multiplier *= 0.5;
		}
	}
	if (iscultist(user)) {
		power_multiplier *= 2;
	} else if (is_servant_of_ratvar(user)) {
		power_multiplier *= 2;
	}
	let specific_listeners: Value = list();
	message = get_full_job_name(message);
	for (V of each(listeners)) {
		L_7 = V;
		if ((devilinfo = is_devil(L_7)) && findtext(message, devilinfo.truename)) {
			start = findtext(message, devilinfo.truename);
			listeners = list(L_7);
			power_multiplier *= 5;
			message = copytext(message, 0, start) + copytext(message, start + rt.length(devilinfo.truename), rt.length(message) + 1);
			break;
		} else if (dd_hasprefix(message, L_7.real_name)) {
			specific_listeners += L_7;
			found_string = L_7.real_name;
		} else if (dd_hasprefix(message, L_7.first_name())) {
			specific_listeners += L_7;
			found_string = L_7.first_name();
		} else if (L_7.mind && dd_hasprefix(message, L_7.mind.assigned_role)) {
			specific_listeners += L_7;
			found_string = L_7.mind.assigned_role;
		}
	}
	if (rt.len(f, specific_listeners)) {
		listeners = specific_listeners;
		power_multiplier *= 1 + 1 / rt.len(f, specific_listeners);
		message = copytext(message, 0, 1) + copytext(message, 1 + rt.length(found_string), rt.length(message) + 1);
	}
	if (findtext(message, GLOB.stun_words)) {
		cooldown = COOLDOWN_STUN;
		V = null;
		for (V of each(listeners)) {
			yield* (L_7 = V).Stun(60 * power_multiplier);
		}
	} else if (findtext(message, GLOB.knockdown_words)) {
		cooldown = COOLDOWN_STUN;
		V = null;
		for (V of each(listeners)) {
			yield* (L_7 = V).Knockdown(60 * power_multiplier);
		}
	} else if (findtext(message, GLOB.sleep_words)) {
		cooldown = COOLDOWN_STUN;
		for (C of each(listeners, T("/mob/living/carbon"))) {
			yield* C.Sleeping(40 * power_multiplier);
		}
	} else if (findtext(message, GLOB.vomit_words)) {
		cooldown = COOLDOWN_STUN;
		C = null;
		for (C of each(listeners, T("/mob/living/carbon"))) {
			yield* C.vomit(10 * power_multiplier, { distance: power_multiplier });
		}
	} else if (findtext(message, GLOB.silence_words)) {
		cooldown = COOLDOWN_STUN;
		C = null;
		for (C of each(listeners, T("/mob/living/carbon"))) {
			if (user.mind && (user.mind.assigned_role == "Curator" || user.mind.assigned_role == "Mime")) {
				power_multiplier *= 3;
			}
			C.silent += 10 * power_multiplier;
		}
	} else if (findtext(message, GLOB.hallucinate_words)) {
		cooldown = COOLDOWN_MEME;
		V = null;
		for (V of each(listeners)) {
			yield* new_(T("/obj/effect/hallucination/delusion"), rt.getStep(f, (L_7 = V), 0), L_7, null, 150 * power_multiplier, 0);
		}
	} else if (findtext(message, GLOB.wakeup_words)) {
		cooldown = COOLDOWN_DAMAGE;
		V = null;
		for (V of each(listeners)) {
			yield* (L_7 = V).SetSleeping(0);
		}
	} else if (findtext(message, GLOB.heal_words)) {
		cooldown = COOLDOWN_DAMAGE;
		V = null;
		for (V of each(listeners)) {
			yield* (L_7 = V).heal_overall_damage(10 * power_multiplier, 10 * power_multiplier, 0, 0);
		}
	} else if (findtext(message, GLOB.hurt_words)) {
		cooldown = COOLDOWN_DAMAGE;
		V = null;
		for (V of each(listeners)) {
			yield* (L_7 = V).apply_damage(15 * power_multiplier, { def_zone: "chest" });
		}
	} else if (findtext(message, GLOB.bleed_words)) {
		cooldown = COOLDOWN_DAMAGE;
		for (H_6 of each(listeners, T("/mob/living/carbon/human"))) {
			H_6.bleed_rate += 5 * power_multiplier;
		}
	} else if (findtext(message, GLOB.burn_words)) {
		cooldown = COOLDOWN_DAMAGE;
		V = null;
		for (V of each(listeners)) {
			yield* (L_7 = V).adjust_fire_stacks(1 * power_multiplier);
			yield* L_7.IgniteMob();
		}
	} else if (findtext(message, GLOB.hot_words)) {
		cooldown = COOLDOWN_DAMAGE;
		V = null;
		for (V of each(listeners)) {
			(L_7 = V).bodytemperature += 50 * power_multiplier;
		}
	} else if (findtext(message, GLOB.cold_words)) {
		cooldown = COOLDOWN_DAMAGE;
		V = null;
		for (V of each(listeners)) {
			(L_7 = V).bodytemperature -= 50 * power_multiplier;
		}
	} else if (findtext(message, GLOB.repulse_words)) {
		cooldown = COOLDOWN_DAMAGE;
		V = null;
		for (V of each(listeners)) {
			L_7 = V;
			throwtarget = get_edge_target_turf(user, rt.getDir(f, user, get_step_away(L_7, user)));
			yield* L_7.throw_at(throwtarget, 3 * power_multiplier, 1 * power_multiplier);
		}
	} else if (findtext(message, GLOB.attract_words)) {
		cooldown = COOLDOWN_DAMAGE;
		V = null;
		for (V of each(listeners)) {
			yield* (L_7 = V).throw_at(get_step_towards(user, L_7), 3 * power_multiplier, 1 * power_multiplier);
		}
	} else if (findtext(message, GLOB.whoareyou_words)) {
		cooldown = COOLDOWN_MEME;
		V = null;
		for (V of each(listeners)) {
			if (is_devil((L_7 = V))) {
				devilinfo = is_devil(L_7);
				yield* L_7.say(`${devilinfo.truename}`);
			} else {
				yield* L_7.say(`${L_7.real_name}`);
			}
			yield* sleep(5);
		}
	} else if (findtext(message, GLOB.saymyname_words)) {
		cooldown = COOLDOWN_MEME;
		V = null;
		for (V of each(listeners)) {
			yield* (L_7 = V).say(`${user.name}!`);
			yield* sleep(5);
		}
	} else if (findtext(message, GLOB.knockknock_words)) {
		cooldown = COOLDOWN_MEME;
		V = null;
		for (V of each(listeners)) {
			yield* (L_7 = V).say("Who's there?");
			yield* sleep(5);
		}
	} else if (findtext(message, GLOB.statelaws_words)) {
		cooldown = COOLDOWN_STUN;
		for (S of each(listeners, T("/mob/living/silicon"))) {
			yield* S.statelaws({ force: 1 });
		}
	} else if (findtext(message, GLOB.move_words)) {
		cooldown = COOLDOWN_MEME;
		if (findtext(message, GLOB.up_words)) {
			direction = 1;
		} else if (findtext(message, GLOB.down_words)) {
			direction = 2;
		} else if (findtext(message, GLOB.left_words)) {
			direction = 8;
		} else if (findtext(message, GLOB.right_words)) {
			direction = 4;
		}
		i = 1;
		while (i <= 5 * power_multiplier) {
			V_8 = null;
			for (V_8 of each(listeners)) {
				$0 = (L_9 = V_8);
				if (direction) {

					$1 = direction;
				} else {
					$1 = pick(GLOB.cardinal);
				}
				yield* step($0, $1);
			}
			yield* sleep(10);
			i++;
		}
	} else if (findtext(message, GLOB.walk_words)) {
		cooldown = COOLDOWN_MEME;
		V = null;
		for (V of each(listeners)) {
			if ((L_7 = V).m_intent != "walk") {
				yield* L_7.toggle_move_intent();
			}
		}
	} else if (findtext(message, GLOB.run_words)) {
		cooldown = COOLDOWN_MEME;
		V = null;
		for (V of each(listeners)) {
			if ((L_7 = V).m_intent != "run") {
				yield* L_7.toggle_move_intent();
			}
		}
	} else if (findtext(message, GLOB.helpintent_words)) {
		cooldown = COOLDOWN_MEME;
		H_6 = null;
		for (H_6 of each(listeners, T("/mob/living/carbon/human"))) {
			H_6.a_intent_change("help");
			yield* H_6.click_random_mob();
			yield* sleep(2);
		}
	} else if (findtext(message, GLOB.disarmintent_words)) {
		cooldown = COOLDOWN_MEME;
		H_6 = null;
		for (H_6 of each(listeners, T("/mob/living/carbon/human"))) {
			H_6.a_intent_change("disarm");
			yield* H_6.click_random_mob();
			yield* sleep(2);
		}
	} else if (findtext(message, GLOB.grabintent_words)) {
		cooldown = COOLDOWN_MEME;
		H_6 = null;
		for (H_6 of each(listeners, T("/mob/living/carbon/human"))) {
			H_6.a_intent_change("grab");
			yield* H_6.click_random_mob();
			yield* sleep(2);
		}
	} else if (findtext(message, GLOB.harmintent_words)) {
		cooldown = COOLDOWN_MEME;
		H_6 = null;
		for (H_6 of each(listeners, T("/mob/living/carbon/human"))) {
			H_6.a_intent_change("harm");
			yield* H_6.click_random_mob();
			yield* sleep(2);
		}
	} else if (findtext(message, GLOB.throwmode_words)) {
		cooldown = COOLDOWN_MEME;
		C = null;
		for (C of each(listeners, T("/mob/living/carbon"))) {
			C.throw_mode_on();
		}
	} else if (findtext(message, GLOB.flip_words)) {
		cooldown = COOLDOWN_MEME;
		V = null;
		for (V of each(listeners)) {
			yield* (L_7 = V).emote("flip");
		}
	} else if (findtext(message, GLOB.speak_words)) {
		cooldown = COOLDOWN_MEME;
		V = null;
		for (V of each(listeners)) {
			yield* (L_7 = V).say(strings_replacement("brain_damage_lines.json", "brain_damage"));
			yield* sleep(5);
		}
	} else if (findtext(message, GLOB.getup_words)) {
		cooldown = COOLDOWN_DAMAGE;
		V = null;
		for (V of each(listeners)) {
			if ((L_7 = V).resting) {
				yield* L_7.lay_down();
			}
			yield* L_7.SetStun(0);
			yield* L_7.SetKnockdown(0);
			yield* L_7.SetUnconscious(0);
		}
	} else if (findtext(message, GLOB.sit_words)) {
		cooldown = COOLDOWN_MEME;
		V = null;
		for (V of each(listeners)) {
			L_7 = V;
			chair = null;
			rt.forList(f, 1, rt.getStep(f, L_7, 0), T("/obj/structure/chair"));
			if (($e = rt.next(f, 1)) !== undefined) {
				chair = $e;
				yield* chair.buckle_mob(L_7);
			}
			rt.endFor(f, 1);
		}
	} else if (findtext(message, GLOB.stand_words)) {
		cooldown = COOLDOWN_MEME;
		V = null;
		for (V of each(listeners)) {
			if ((L_7 = V).buckled && rt.istype(L_7.buckled, T("/obj/structure/chair"))) {
				yield* L_7.buckled.unbuckle_mob(L_7);
			}
		}
	} else if (findtext(message, GLOB.dance_words)) {
		cooldown = COOLDOWN_MEME;
		V = null;
		for (V of each(listeners)) {
			yield* (L_7 = V).emote("dance");
			yield* sleep(5);
		}
	} else if (findtext(message, GLOB.jump_words)) {
		cooldown = COOLDOWN_MEME;
		V = null;
		for (V of each(listeners)) {
			L_7 = V;
			if (prob(25)) {
				yield* L_7.say("HOW HIGH?!!");
			}
			yield* L_7.emote("jump");
			yield* sleep(5);
		}
	} else if (findtext(message, GLOB.salute_words)) {
		cooldown = COOLDOWN_MEME;
		V = null;
		for (V of each(listeners)) {
			yield* (L_7 = V).emote("salute");
			yield* sleep(5);
		}
	} else if (findtext(message, GLOB.deathgasp_words)) {
		cooldown = COOLDOWN_MEME;
		V = null;
		for (V of each(listeners)) {
			yield* (L_7 = V).emote("deathgasp");
			yield* sleep(5);
		}
	} else if (findtext(message, GLOB.clap_words)) {
		cooldown = COOLDOWN_MEME;
		V = null;
		for (V of each(listeners)) {
			yield* (L_7 = V).emote("clap");
			yield* sleep(5);
		}
	} else if (findtext(message, GLOB.honk_words)) {
		cooldown = COOLDOWN_MEME;
		yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/playsound"), rt.getStep(f, user, 0), rt.rsc("sound/items/bikehorn.ogg"), 300, 1)), 25);
		if (user.mind && user.mind.assigned_role == "Clown") {
			C = null;
			for (C of each(listeners, T("/mob/living/carbon"))) {
				yield* C.slip(140 * power_multiplier);
			}
			cooldown = COOLDOWN_MEME;
		}
	} else if (findtext(message, GLOB.multispin_words)) {
		cooldown = COOLDOWN_MEME;
		V = null;
		for (V of each(listeners)) {
			yield* (L_7 = V).SpinAnimation({ speed: 10, loops: 5 });
		}
	} else {
		cooldown = 100;
	}
	message_admins(`${key_name_admin(user)} has said '${log_message}' with a Voice of God, affecting ${english_list(listeners)}, with a power multiplier of ${power_multiplier}.`);
	log_game(`${key_name(user)} has said '${log_message}' with a Voice of God, affecting ${english_list(listeners)}, with a power multiplier of ${power_multiplier}.`);
	return cooldown;
}, true);
