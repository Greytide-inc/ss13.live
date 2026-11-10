// Based on /tg/station's code/modules/mob/living/emote.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;


// emote.dm:3
rt.def("/mob/living/proc/emote", function* emote(f: Frame, act: Value, m_type: Value, message: Value) {
	let custom_param: Value = null, E: Value = null;
	act = lowertext(act);
	let param: Value = message;
	if (custom_param = findchar(act, " ")) {
		param = copytext(act, custom_param + 1, rt.length(act) + 1);
		act = copytext(act, 1, custom_param);
	}
	if (!(E = rt.index(GLOB.emote_list, act))) {
		to_chat(this, `<span class='notice'>Unusable emote '${act}'. Say *help for a list.</span>`);
		return f.dot;
	}
	yield* E.run_emote(this, param, m_type);
	return f.dot;
}, true);

rt.type(436, "/datum/emote/living", "/datum/emote", {
	mob_type_allowed_typecache: null,
	mob_type_blacklist_typecache: null,
});

// emote.dm:19
rt.def("/datum/emote/living/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mob_type_allowed_typecache = list(T("/mob/living"));

	this.mob_type_blacklist_typecache = list(T("/mob/living/simple_animal/slime"), T("/mob/living/brain"));
	return f.dot;
});

rt.type(443, "/datum/emote/living/collapse", "/datum/emote/living", {
	key: "collapse",
	key_third_person: "collapses",
	message: "collapses!",
	emote_type: 2,
});

// emote.dm:64
rt.def("/datum/emote/living/collapse/proc/run_emote", function* run_emote(f: Frame, user: Value, params: Value) {
	let L: Value = null;
	f.dot = (yield* parent_proc());
	if (!(f.dot && rt.istype(user, T("/mob/living")))) return f.dot;
	yield* (L = user).Unconscious(40);
	return f.dot;
}, true);

rt.type(446, "/datum/emote/living/deathgasp", "/datum/emote/living", {
	key: "deathgasp",
	key_third_person: "deathgasps",
	message: "seizes up and falls limp, their eyes dead and lifeless...",
	message_robot: "shudders violently for a moment before falling still, its eyes slowly darkening.",
	message_AI: "lets out a flurry of sparks, its screen flickering as its systems slowly halt.",
	message_alien: "lets out a waning guttural screech, green blood bubbling from its maw...",
	message_larva: "lets out a sickly hiss of air and falls limply to the floor...",
	message_monkey: "lets out a faint chimper as it collapses and stops moving...",
	message_simple: "stops moving...",
	stat_allowed: 1,
});

// emote.dm:94
rt.def("/datum/emote/living/deathgasp/proc/run_emote", function* run_emote(f: Frame, user: Value, params: Value) {
	let S: Value = null;
	if (rt.istype((S = user), T("/mob/living/simple_animal")) && S.deathmessage) {
		this.message_simple = S.deathmessage;
	}
	f.dot = (yield* parent_proc());
	this.message_simple = rt.initial(f, this, "message_simple");
	if (!(f.dot && rt.istype(user, T("/mob/living/carbon/alien/humanoid")))) return f.dot;
	playsound(user.loc, rt.rsc("sound/voice/hiss6.ogg"), 80, 1, 1);
	return f.dot;
}, true);

rt.type(448, "/datum/emote/living/faint", "/datum/emote/living", {
	key: "faint",
	key_third_person: "faints",
	message: "faints.",
});

// emote.dm:113
rt.def("/datum/emote/living/faint/proc/run_emote", function* run_emote(f: Frame, user: Value, params: Value) {
	let L: Value = null;
	f.dot = (yield* parent_proc());
	if (!(f.dot && rt.istype(user, T("/mob/living")))) return f.dot;
	yield* (L = user).SetSleeping(200);
	return f.dot;
}, true);

rt.type(449, "/datum/emote/living/flap", "/datum/emote/living", {
	wing_time: 20,
	key: "flap",
	key_third_person: "flaps",
	message: "flaps their wings.",
});

// emote.dm:125
rt.def("/datum/emote/living/flap/proc/run_emote", function* run_emote(f: Frame, user: Value, params: Value) {
	let $1: any;
	f.dot = (yield* parent_proc());
	if (!(f.dot && rt.istype(user, T("/mob/living/carbon/human")))) return f.dot;
	let H: Value = user;
	let open: Value = 0;
	if (rt.index(H.dna.features, "wings") == "None") return f.dot;
	if (rt.isIn(f, "wingsopen", H.dna.species.mutant_bodyparts)) {
		open = 1;
		yield* H.CloseWings();
	} else {
		yield* H.OpenWings();
	}
	let $0: any = H;
	if (open) {
		$1 = P("/mob/living/carbon/human/proc/OpenWings");
	} else {
		$1 = P("/mob/living/carbon/human/proc/CloseWings");
	}
	yield* addtimer((yield* new_(T("/datum/callback"), $0, $1)), this.wing_time);
	return f.dot;
}, true);

rt.type(451, "/datum/emote/living/flip", "/datum/emote/living", {
	key: "flip",
	key_third_person: "flips",
	restraint_check: 1,
});

// emote.dm:149
rt.def("/datum/emote/living/flip/proc/run_emote", function* run_emote(f: Frame, user: Value, params: Value) {
	f.dot = (yield* parent_proc());
	if (f.dot) return f.dot;
	user.SpinAnimation(7, 1);
	return f.dot;
}, true);

rt.type(481, "/datum/emote/living/surrender", "/datum/emote/living", {
	key: "surrender",
	key_third_person: "surrenders",
	message: "puts their hands on their head and falls to the ground, they surrender%s!",
	emote_type: 2,
});

// emote.dm:333
rt.def("/datum/emote/living/surrender/proc/run_emote", function* run_emote(f: Frame, user: Value, params: Value) {
	let L: Value = null;
	f.dot = (yield* parent_proc());
	if (!(f.dot && rt.istype(user, T("/mob/living")))) return f.dot;
	yield* (L = user).Knockdown(200);
	return f.dot;
}, true);

rt.type(490, "/datum/emote/living/custom", "/datum/emote/living", {
	key: "me",
	key_third_person: "custom",
	message: null,
});

// emote.dm:386
rt.def("/datum/emote/living/custom/proc/check_invalid", function check_invalid(f: Frame, user: Value, input: Value) {
	f.dot = 1;
	if (copytext(input, 1, 5) == "says") {
		to_chat(user, "<span class='danger'>Invalid emote.</span>");
	} else if (copytext(input, 1, 9) == "exclaims") {
		to_chat(user, "<span class='danger'>Invalid emote.</span>");
	} else if (copytext(input, 1, 6) == "yells") {
		to_chat(user, "<span class='danger'>Invalid emote.</span>");
	} else if (copytext(input, 1, 5) == "asks") {
		to_chat(user, "<span class='danger'>Invalid emote.</span>");
	} else {
		f.dot = 0;
	}
	return f.dot;
});

// emote.dm:398
rt.def("/datum/emote/living/custom/proc/run_emote", function* run_emote(f: Frame) {
	let custom_emote: Value = null, type: Value = null;
	if (f.args[2] === null) {
		f.args[2] = null;
	}
	if (jobban_isbanned(f.args[0], "emote")) {
		to_chat(f.args[0], "You cannot send custom emotes (banned).");
		return 0;
	} else if (f.args[0].client && rt.bitAnd(f.args[0].client.prefs.muted, 1)) {
		to_chat(f.args[0], "You cannot send IC messages (muted).");
		return 0;
	} else if (!f.args[1]) {
		if ((custom_emote = copytext(sanitize((yield* g.op(f, "Prompt", [3], [null, null, null, "Choose an emote to display.", null]))), 1, 1024)) && !this.check_invalid(f.args[0], custom_emote)) {
			const subject = (type = (yield* g.op(f, "Prompt", [1], [null, null, null, "Is this a visible or hearable emote?", list("Visible", "Hearable")])));
			if (subject === "Visible") {
				this.emote_type = 1;
			} else if (subject === "Hearable") {
				this.emote_type = EMOTE_AUDIBLE;
			} else {
				yield* alert("Unable to use this emote, must be either hearable or visible.");
				return f.dot;
			}
			rt.setSv(f, "message", custom_emote);
		}
	} else {
		rt.setSv(f, "message", f.args[1]);
		if (f.args[2]) {
			this.emote_type = f.args[2];
		}
	}
	f.dot = (yield* parent_proc());
	rt.setSv(f, "message", null);
	this.emote_type = EMOTE_VISIBLE;
	return f.dot;
}, true, { args: ["user", "params", "type_override"] });

rt.type(491, "/datum/emote/living/help", "/datum/emote/living", {
	key: "help",
});

// emote.dm:432
rt.def("/datum/emote/living/help/proc/run_emote", function* run_emote(f: Frame, user: Value, params: Value) {
	let E: Value = null, e: Value = null, emote: Value = null;
	let keys: Value = list();
	let message: Value = list("Available emotes, you can use them with say \"*emote\": ");
	let emote_list: Value = GLOB.emote_list;
	for (e of each(emote_list)) {
		if (rt.isIn(f, e, keys)) {
			continue;
		}
		if ((E = rt.index(emote_list, e)).can_run_emote(user, 1)) {
			keys += E.key;
		}
	}
	keys = (yield* sortList(keys));
	for (emote of each(keys)) {
		if (rt.length(message) > 1) {
			message += `, ${emote}`;
		} else {
			message += `${emote}`;
		}
	}
	message = jointext((message += "."), "");
	to_chat(user, message);
	return f.dot;
}, true);

rt.type(492, "/datum/emote/living/spin", "/datum/emote/living", {
	key: "spin",
	key_third_person: "spins",
	message: "spins around dizzily!",
});

// emote.dm:471
rt.def("/datum/emote/living/spin/proc/run_emote", function* run_emote(f: Frame, user: Value) {
	let R: Value = null, M: Value = null;
	yield* user.spin(20, 1);
	if (rt.istype(user, T("/mob/living/silicon/robot"))) {
		if ((R = user).buckled_mobs) {
			for (M of each(R.buckled_mobs, T("/mob"))) {
				if (R.riding_datum) {
					yield* R.riding_datum.force_dismount(M);
				} else {
					yield* R.unbuckle_all_mobs();
				}
			}
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);
