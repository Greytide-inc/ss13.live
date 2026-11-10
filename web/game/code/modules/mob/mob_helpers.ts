// Based on /tg/station's code/modules/mob/mob_helpers.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, add, fmt } = rt;


// mob_helpers.dm:8
rt.def("/mob/living/carbon/proc/isloyal", function isloyal(f: Frame) {
	let L: Value = null;
	for (L of each(this.implants, T("/obj/item/weapon/implant/mindshield"))) {
		return 1;
	}
	return f.dot;
});

// mob_helpers.dm:13
rt.def("/proc/check_zone", function check_zone(f: Frame, zone: Value) {
	if (!zone) {
		return "chest";
	}
	if (zone === "eyes") {
		zone = "head";
	} else if (zone === "mouth") {
		zone = "head";
	} else if (zone === "l_hand") {
		zone = "l_arm";
	} else if (zone === "r_hand") {
		zone = "r_arm";
	} else if (zone === "l_foot") {
		zone = "l_leg";
	} else if (zone === "r_foot") {
		zone = "r_leg";
	} else if (zone === "groin") {
		zone = "chest";
	}
	return zone;
});

// mob_helpers.dm:35
rt.def("/proc/ran_zone", function ran_zone(f: Frame, zone: Value, probability: Value) {
	let t: Value = null;
	probability ??= 80;
	zone = check_zone(zone);
	if (prob(probability)) {
		return zone;
	}
	const subject = (t = rand(1, 18));
	if (subject === 1) {
		return "head";
	} else if (subject === 2) {
		return "chest";
	} else if (rt.inRange(subject, 3, 6)) {
		return "l_arm";
	} else if (rt.inRange(subject, 7, 10)) {
		return "r_arm";
	} else if (rt.inRange(subject, 11, 14)) {
		return "l_leg";
	} else if (rt.inRange(subject, 15, 18)) {
		return "r_leg";
	}
	return zone;
});

// mob_helpers.dm:59
rt.def("/proc/above_neck", function above_neck(f: Frame, zone: Value) {
	let zones: Value = null;
	if ((zones = list("head", "mouth", "eyes")).Find(zone)) {
		return 1;
	} else {
		return 0;
	}
});

// mob_helpers.dm:65
rt.def("/proc/stars", function stars(f: Frame, n: Value, pr: Value) {
	n = html_encode(n);
	pr ??= 25;
	if (pr <= 0) {
		return null;
	}
	if (pr >= 100) {
		return n;
	}
	let te: Value = n;
	let t: Value = "";
	n = rt.length(n);
	let p: Value = 1;
	while (p <= n) {
		if (copytext(te, p, p + 1) == " " || prob(pr)) {
			t = `${t}${copytext(te, p, p + 1)}`;
		} else {
			t = `${t}*`;
		}
		p++;
	}
	return sanitize(t);
});

// mob_helpers.dm:87
rt.def("/proc/slur", function slur(f: Frame, n: Value) {
	let phrase: Value = html_decode(n);
	let leng: Value = lentext(phrase);
	let counter: Value = lentext(phrase);
	let newphrase: Value = "";
	let newletter: Value = "";
	while (counter >= 1) {
		newletter = copytext(phrase, leng - counter + 1, leng - counter + 2);
		if (rand(1, 3) == 3) {
			if (lowertext(newletter) == "o") {
				newletter = "u";
			}
			if (lowertext(newletter) == "s") {
				newletter = "ch";
			}
			if (lowertext(newletter) == "a") {
				newletter = "ah";
			}
			if (lowertext(newletter) == "u") {
				newletter = "oo";
			}
			if (lowertext(newletter) == "c") {
				newletter = "k";
			}
		}
		if (rand(1, 20) == 20) {
			if (newletter == " ") {
				newletter = "...huuuhhh...";
			}
			if (newletter == ".") {
				newletter = " *BURP*.";
			}
		}
		const die = rand(1, 20);
		if (die === 1) {
			newletter += "'";
		} else if (die === 10) {
			newletter += `${newletter}`;
		} else if (die === 20) {
			newletter += `${newletter}${newletter}`;
		}
		newphrase += `${newletter}`;
		counter -= 1;
	}
	return newphrase;
});

// mob_helpers.dm:122
rt.def("/proc/cultslur", function cultslur(f: Frame, n: Value) {
	let phrase: Value = html_decode(n);
	let leng: Value = lentext(phrase);
	let counter: Value = lentext(phrase);
	let newphrase: Value = "";
	let newletter: Value = "";
	while (counter >= 1) {
		newletter = copytext(phrase, leng - counter + 1, leng - counter + 2);
		if (rand(1, 2) == 2) {
			if (lowertext(newletter) == "o") {
				newletter = "u";
			}
			if (lowertext(newletter) == "t") {
				newletter = "ch";
			}
			if (lowertext(newletter) == "a") {
				newletter = "ah";
			}
			if (lowertext(newletter) == "u") {
				newletter = "oo";
			}
			if (lowertext(newletter) == "c") {
				newletter = " NAR ";
			}
			if (lowertext(newletter) == "s") {
				newletter = " SIE ";
			}
		}
		if (rand(1, 4) == 4) {
			if (newletter == " ") {
				newletter = " no hope... ";
			}
			if (newletter == "H") {
				newletter = " IT COMES... ";
			}
		}
		const die = rand(1, 15);
		if (die === 1) {
			newletter = "'";
		} else if (die === 2) {
			newletter += "agn";
		} else if (die === 3) {
			newletter = "fth";
		} else if (die === 4) {
			newletter = "nglu";
		} else if (die === 5) {
			newletter = "glor";
		}
		newphrase += `${newletter}`;
		counter -= 1;
	}
	return newphrase;
});

// mob_helpers.dm:164
rt.def("/proc/stutter", function stutter(f: Frame, n: Value) {
	let n_letter: Value = null;
	let te: Value = html_decode(n);
	let t: Value = "";
	n = rt.length(n);
	let p: Value = 1;
	while (p <= n) {
		n_letter = copytext(te, p, p + 1);
		if (prob(80) && rt.isIn(f, ckey(n_letter), list("b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z"))) {
			if (prob(10)) {
				n_letter = `${n_letter}-${n_letter}-${n_letter}-${n_letter}`;
			} else if (prob(20)) {
				n_letter = `${n_letter}-${n_letter}-${n_letter}`;
			} else if (prob(5)) {
				n_letter = null;
			} else {
				n_letter = `${n_letter}-${n_letter}`;
			}
		}
		t = `${t}${n_letter}`;
		p++;
	}
	return copytext(sanitize(t), 1, 1024);
});

// mob_helpers.dm:187
rt.def("/proc/derpspeech", function derpspeech(f: Frame, message: Value, stuttering: Value) {
	message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext(message, " am ", " ")), " is ", " ")), " are ", " ")), "you", "u")), "help", "halp")), "grief", "grife")), "space", "spess")), "carp", "crap")), "reason", "raisin");
	if (prob(50)) {
		message = uppertext(message);
		message += `${stutter(pick("!", "!!", "!!!"))}`;
	}
	if (!stuttering && prob(15)) {
		message = stutter(message);
	}
	return message;
});

// mob_helpers.dm:206
rt.def("/proc/Gibberish", function Gibberish(f: Frame, t: Value, p: Value) {
	let letter: Value = null, j: Value = null;
	let returntext: Value = "";
	let i: Value = 1;
	while (i <= rt.length(t)) {
		letter = copytext(t, i, i + 1);
		if (prob(50)) {
			if (p >= 70) {
				letter = "";
			}
			j = 1;
			while (j <= rand(0, 2)) {
				letter += pick("#", "@", "*", "&", "%", "$", "/", "<", ">", ";", "*", "*", "*", "*", "*", "*", "*");
				j++;
			}
		}
		returntext += letter;
		i++;
	}
	return returntext;
});

// mob_helpers.dm:252
rt.def("/proc/shake_camera", function shake_camera(f: Frame, M: Value, duration: Value, strength: Value) {
	let i: Value = null;
	let $e: any;
	strength ??= 1;
	if (!M || !M.client || duration <= 0) {
		return f.dot;
	}
	let C: Value = M.client;
	let oldx: Value = C.pixel_x;
	let oldy: Value = C.pixel_y;
	let max: Value = strength * rt.world().icon_size;
	let min: Value = -(strength * rt.world().icon_size);
	rt.forRange(f, 0, 0, duration - 1, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (i == 0) {
			rt.op(f, "Animate", [2, 8], [null, C, "pixel_x", rand(min, max), "pixel_y", rand(min, max), "time", 1]);
		} else {
			rt.op(f, "Animate", [2, 6], ["pixel_x", rand(min, max), "pixel_y", rand(min, max), "time", 1]);
		}
	}
	rt.endFor(f, 0);
	rt.op(f, "Animate", [2, 6], ["pixel_x", oldx, "pixel_y", oldy, "time", 1]);
	return f.dot;
});

// mob_helpers.dm:270
rt.def("/proc/findname", function findname(f: Frame, msg: Value) {
	let M: Value = null;
	if (!istext(msg)) {
		msg = `${msg}`;
	}
	for (M of each(GLOB.mob_list, T("/mob"))) {
		if (M.real_name == msg) {
			return M;
		}
	}
	return 0;
});

// mob_helpers.dm:279
rt.def("/mob/proc/first_name", function first_name(f: Frame) {
	GLOB.firstname.Find(this.real_name);
	return GLOB.firstname.match;
});

// mob_helpers.dm:283
rt.def("/mob/proc/abiotic", function abiotic(f: Frame, full_body: Value) {
	let I: Value = null;
	full_body ??= 0;
	for (I of each(this.held_items, T("/obj/item"))) {
		if (!rt.bitAnd(I.flags, NODROP)) {
			return 1;
		}
	}
	return 0;
});

// mob_helpers.dm:293
rt.def("/mob/verb/a_intent_change", function a_intent_change(f: Frame, input: Value) {
	let current_intent: Value = null;
	if (!this.possible_a_intents || !rt.len(f, this.possible_a_intents)) {
		return f.dot;
	}
	if (rt.isIn(f, input, this.possible_a_intents)) {
		this.a_intent = input;
	} else {
		if (!(current_intent = this.possible_a_intents.Find(this.a_intent))) {
			current_intent = 1;
		}
		if (input == "right") {
			current_intent += 1;
		}
		if (input == "left") {
			current_intent -= 1;
		}
		if (current_intent < 1) {
			current_intent = rt.len(f, this.possible_a_intents);
		}
		if (current_intent > rt.len(f, this.possible_a_intents)) {
			current_intent = 1;
		}
		this.a_intent = rt.index(this.possible_a_intents, current_intent);
	}
	if (!(this.hud_used && this.hud_used.action_intent)) return f.dot;
	this.hud_used.action_intent.icon_state = `${this.a_intent}`;
	return f.dot;
}, false, { hidden: true, verb: { name: "a-intent" }, argTypes: [{ type: 2 }] });

// mob_helpers.dm:323
rt.def("/proc/is_blind", function is_blind(f: Frame, A: Value) {
	let B: Value = null;
	if (ismob(A)) {
		return (B = A).eye_blind;
	}
	return 0;
});

// mob_helpers.dm:329
rt.def("/proc/is_special_character", function is_special_character(f: Frame, M: Value) {
	let R: Value = null, A: Value = null;
	if (!GLOB.SSticker.HasRoundStarted()) {
		return 0;
	}
	if (!rt.istype(M, T("/mob"))) {
		return 0;
	}
	if (rt.istype(M, T("/mob/living/silicon"))) {
		if (rt.istype(M, T("/mob/living/silicon/robot"))) {
			if ((R = M).mind && R.mind.special_role) {
				if (R.laws && R.laws.zeroth && R.syndicate) {
					if (R.connected_ai) {
						if (rt.call(f, P("/proc/is_special_character"), null, [R.connected_ai]) && R.connected_ai.laws && (R.connected_ai.laws.zeroth_borg == R.laws.zeroth || R.connected_ai.laws.zeroth == R.laws.zeroth)) {
							return 0;
						}
						return 1;
					}
					return 1;
				}
			}
		} else if (rt.istype(M, T("/mob/living/silicon/ai"))) {
			if ((A = M).laws && A.laws.zeroth && A.mind && A.mind.special_role) {
				return 1;
			}
		}
		return 0;
	}
	if (M.mind && M.mind.special_role) {
		if (GLOB.SSticker.mode.config_tag === "revolution") {
			if (rt.isIn(f, M.mind, GLOB.SSticker.mode.head_revolutionaries) || rt.isIn(f, M.mind, GLOB.SSticker.mode.revolutionaries)) {
				return 2;
			}
		} else if (GLOB.SSticker.mode.config_tag === "cult") {
			if (rt.isIn(f, M.mind, GLOB.SSticker.mode.cult)) {
				return 2;
			}
		} else if (GLOB.SSticker.mode.config_tag === "nuclear") {
			if (rt.isIn(f, M.mind, GLOB.SSticker.mode.syndicates)) {
				return 2;
			}
		} else if (GLOB.SSticker.mode.config_tag === "changeling") {
			if (rt.isIn(f, M.mind, GLOB.SSticker.mode.changelings)) {
				return 2;
			}
		} else if (GLOB.SSticker.mode.config_tag === "wizard") {
			if (rt.isIn(f, M.mind, GLOB.SSticker.mode.wizards)) {
				return 2;
			}
		} else if (GLOB.SSticker.mode.config_tag === "apprentice") {
			if (rt.isIn(f, M.mind, GLOB.SSticker.mode.apprentices)) {
				return 2;
			}
		} else if (GLOB.SSticker.mode.config_tag === "monkey") {
			if (M.viruses && rt.locateIn(f, T("/datum/disease/transformation/jungle_fever"), M.viruses)) {
				return 2;
			}
		} else if (GLOB.SSticker.mode.config_tag === "abductor") {
			if (rt.isIn(f, M.mind, GLOB.SSticker.mode.abductors)) {
				return 2;
			}
		}
		return 1;
	}
	return 0;
});

// mob_helpers.dm:381
rt.def("/proc/notify_ghosts", function* notify_ghosts(f: Frame, message: Value, ghost_sound: Value, enter_link: Value, source: Value, alert_overlay: Value, action: Value, flashwindow: Value) {
	let O: Value = null, A: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	action ??= "jump";
	flashwindow ??= 1;
	if (GLOB.SSatoms.initialized != INITIALIZATION_INNEW_REGULAR) {
		return f.dot;
	}
	for (O of each(GLOB.player_list, T("/mob/dead/observer"))) {
		if (O.client) {
			$0 = O;
			$1 = message;
			if (enter_link) {

				$2 = ` ${enter_link}`;
			} else {
				$2 = "";
			}
			to_chat($0, `<span class='ghostalert'>${$1}${$2}<span>`);
			if (ghost_sound) {
				rt.op(f, "Output", [], [O, sound(ghost_sound)], false);
			}
			if (flashwindow) {
				window_flash(O.client);
			}
			if (source) {
				if (A = (yield* O.throw_alert(fmt("＃_notify_action", [source]), T("/obj/screen/alert/notify_action")))) {
					if (O.client.prefs && O.client.prefs.UI_style) {
						A.icon = ui_style2icon(O.client.prefs.UI_style);
					}
					A.desc = message;
					A.action = action;
					A.target = source;
					if (!alert_overlay) {
						alert_overlay = (yield* new_(T("/mutable_appearance"), source));
					}
					alert_overlay.layer = -1;
					alert_overlay.plane = -32767;
					A.add_overlay(alert_overlay);
				}
			}
		}
	}
	return f.dot;
}, true);

// mob_helpers.dm:405
rt.def("/proc/item_heal_robotic", function* item_heal_robotic(f: Frame, H: Value, user: Value, brute_heal: Value, burn_heal: Value) {
	let affecting: Value = null, dam: Value = null;
	let $0: any, $1: any, $2: any;
	if (!((affecting = H.get_bodypart(check_zone(user.zone_selected))) && affecting.status == BODYPART_ROBOTIC)) return f.dot;
	if (brute_heal > burn_heal) {
		dam = 1;
	} else {
		dam = 0;
	}
	if (brute_heal > 0 && affecting.brute_dam > 0 || burn_heal > 0 && affecting.burn_dam > 0) {
		if (yield* affecting.heal_damage(brute_heal, burn_heal, 1, 0)) {
			H.update_damage_overlays();
		}
		$0 = user;
		$1 = user;
		if (dam) {

			$2 = "dents on";
		} else {
			$2 = "burnt wires in";
		}
		$1 = `${$1} has fixed some of the ${$2} ${H}'s ${affecting.name}.`;
		if (dam) {
			$2 = "dents on";
		} else {
			$2 = "burnt wires in";
		}
		$0.visible_message($1, `<span class='notice'>You fix some of the ${$2} ${H}'s ${affecting.name}.</span>`);
		return 1;
	} else {
		to_chat(user, `<span class='warning'>${affecting} is already in good condition!</span>`);
	}
	return f.dot;
}, true);

// mob_helpers.dm:423
rt.def("/proc/IsAdminGhost", function IsAdminGhost(f: Frame, user: Value) {
	if (!user) {
		return f.dot;
	}
	if (!user.client) {
		return f.dot;
	}
	if (!rt.istype(user, T("/mob/dead/observer"))) {
		return f.dot;
	}
	if (!check_rights_for(user.client, 2)) {
		return f.dot;
	}
	if (!user.client.AI_Interact) {
		return f.dot;
	}
	return 1;
});

// mob_helpers.dm:436
rt.def("/proc/offer_control", function* offer_control(f: Frame, M: Value) {
	let theghost: Value = null;
	to_chat(M, "Control of your mob has been offered to dead players.");
	if (f.usr) {
		log_admin(`${key_name(f.usr)} has offered control of (${key_name(M)}) to ghosts.`);
		message_admins(`${key_name_admin(f.usr)} has offered control of (${key_name_admin(M)}) to ghosts`);
	}
	let poll_message: Value = `Do you want to play as ${M.real_name}?`;
	if (M.mind && M.mind.assigned_role) {
		poll_message = `${poll_message} Job:${M.mind.assigned_role}.`;
	}
	if (M.mind && M.mind.special_role) {
		poll_message = `${poll_message} Status:${M.mind.special_role}.`;
	}
	let candidates: Value = (yield* pollCandidatesForMob(poll_message, "pAI", null, 0, 100, M));
	if (rt.len(f, candidates)) {
		theghost = pick(candidates);
		to_chat(M, "Your mob has been taken over by a ghost!");
		message_admins(`${key_name_admin(theghost)} has taken control of (${key_name_admin(M)})`);
		yield* M.ghostize(0);
		M.key = theghost.key;
		return 1;
	} else {
		to_chat(M, "There were no ghosts willing to take control.");
		message_admins(`No ghosts were willing to take control of ${key_name_admin(M)})`);
		return 0;
	}
}, true);

// mob_helpers.dm:461
rt.def("/mob/proc/is_flying", function is_flying(f: Frame, M: Value) {
	M ??= this;
	if (rt.bitAnd(M.movement_type, 2)) {
		return 1;
	} else {
		return 0;
	}
});

// mob_helpers.dm:467
rt.def("/mob/proc/click_random_mob", function* click_random_mob(f: Frame) {
	let L: Value = null, _T: Value = null;
	let nearby_mobs: Value = list();
	for (L of each(range(1, this), T("/mob/living"))) {
		if (L != this) {
			(nearby_mobs = rt.modify(nearby_mobs, L, rt.bitOr));
		}
	}
	if (!rt.len(f, nearby_mobs)) return f.dot;
	yield* this.ClickOn((_T = pick(nearby_mobs)));
	return f.dot;
}, true);

// mob_helpers.dm:476
rt.def("/mob/proc/log_message", function log_message(f: Frame, message: Value, message_type: Value) {
	if (!rt.length(message) || !message_type) {
		return f.dot;
	}
	if (!rt.istype(rt.index(this.logging, message_type), T("/list"))) {
		rt.setAt(this.logging, message_type, list());
	}
	let timestamped_message: Value = rt.alist(f, [`${rt.length(rt.index(this.logging, message_type)) + 1}[${time_stamp()}] ${key_name(this)}`, message]);
	rt.modAt(this.logging, message_type, timestamped_message, add);
	return f.dot;
});
