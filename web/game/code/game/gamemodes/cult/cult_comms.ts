// Based on /tg/station's code/game/gamemodes/cult/cult_comms.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(91, "/datum/action/innate/cult", "/datum/action/innate", {
	background_icon_state: "bg_demon",
	buttontooltipstyle: "cult",
	check_flags: 11,
});

// cult_comms.dm:10
rt.def("/datum/action/innate/cult/proc/IsAvailable", function IsAvailable(f: Frame) {
	if (!iscultist(this.owner)) {
		return 0;
	}
	return parent_proc();
});

rt.type(92, "/datum/action/innate/cult/comm", "/datum/action/innate/cult", {
	name: "Communion",
	button_icon_state: "cult_comms",
});

// cult_comms.dm:19
rt.def("/datum/action/innate/cult/comm/proc/Activate", function* Activate(f: Frame) {
	let input: Value = null;
	if (!(input = (yield* stripped_input(f.usr, "Please choose a message to tell to the other acolytes.", "Voice of Blood", ""))) || !(yield* this.IsAvailable())) {
		return f.dot;
	}
	yield* cultist_commune(f.usr, input);
	return f.dot;
}, true);

// cult_comms.dm:27
rt.def("/proc/cultist_commune", function* cultist_commune(f: Frame, user: Value, message: Value) {
	let M: Value = null, link: Value = null;
	let $2: any, $e: any;
	if (!message) {
		return f.dot;
	}
	yield* user.whisper(`O bidai nabora se${pick("'", "`")}sma!`, { language: T("/datum/language/common") });
	yield* user.whisper(html_decode(message));
	let title: Value = "Acolyte";
	let span: Value = "cultitalic";
	if (user.mind && user.mind.has_antag_datum(T("/datum/antagonist/cult/master"))) {
		span = "cultlarge";
		if (rt.istype(user, T("/mob/living/carbon/human"))) {
			title = "Master";
		} else {
			title = "Lord";
		}
	} else if (!rt.istype(user, T("/mob/living/carbon/human"))) {
		title = "Construct";
	}
	let $0: any = span;
	let $1: any = title;
	if (findtextEx(user.name, user.real_name)) {
		$2 = user.name;
	} else {
		$2 = `${user.real_name} (as ${user.name})`;
	}
	let my_message: Value = `<span class='${$0}'><b>${$1} ${$2}:</b> ${message}</span>`;
	for (M of each(GLOB.mob_list, T("/mob"))) {
		if (iscultist(M)) {
			to_chat(M, my_message);
		} else if (rt.isIn(f, M, GLOB.dead_mob_list)) {
			link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [M, user]);
			to_chat(M, `${link} ${my_message}`);
		}
	}
	log_say(`${user.real_name}/${user.key} : ${message}`);
	return f.dot;
}, true);

// cult_comms.dm:54
rt.def("/mob/living/proc/cult_help", function* cult_help(f: Frame) {
	let popup: Value = null;
	let text: Value = "";
	text += "<center><font color='red' size=3><b><i>Tenets of the Dark One</i></b></font></center><br><br><br>";
	text += "<font color='red'><b>I. SECRECY</b></font><br>Your cult is a SECRET organization. Your success DEPENDS on keeping your cult's members and locations SECRET for as long as possible. This means that your tome should be hidden in your bag and never brought out in public. You should never create runes where other crew might find them, and you should avoid using talismans or other cult magic with witnesses around.<br><br>";
	text += "<font color='red'><b>II. TOME</b></font><br>You start with a unique talisman in your bag. This supply talisman can be used 3 times, and creates starter equipment for your cult. The most critical of the talisman's functions is the power to create a tome. This tome is your most important item and summoning one (in secret) is your FIRST PRIORITY. It lets you talk to fellow cultists and create runes, which in turn is essential to growing the cult's power.<br><br>";
	text += "<font color='red'><b>III. RUNES</b></font><br>Runes are powerful sources of cult magic. Your tome will allow you to draw runes with your blood. Those runes, when hit with an empty hand, will attempt to trigger the rune's magic. Runes are essential for the cult to convert new members, create powerful minions, or call upon incredibly powerful magic. Some runes require more than one cultist to use.<br><br>";
	text += "<font color='red'><b>IV. TALISMANS</b></font><br>Talismans are a mobile source of cult magic that are NECESSARY to achieve success as a cult. Your starting talisman can produce certain talismans, but you will need to use the -create talisman- rune (with ordinary paper on top) to get more talismans. Talismans are EXTREMELY powerful, therefore creating more talismans in a HIDDEN location should be one of your TOP PRIORITIES.<br><br>";
	text += "<font color='red'><b>V. GROW THE CULT</b></font><br>There are certain basic strategies that all cultists should master. STUN talismans are the foundation of a successful cult. If you intend to convert the stunned person you should use cuffs or a talisman of shackling on them and remove their headset before they recover (it takes about 10 seconds to recover). If you intend to sacrifice the victim, striking them quickly and repeatedly with your tome will knock them out before they can recover. Sacrificed victims will their soul behind in a shard, these shards can be used on construct shells to make powerful servants for the cult. Remember you need TWO cultists standing near a conversion rune to convert someone. Your construct minions cannot trigger most runes, but they will count as cultists in helping you trigger more powerful runes like conversion or blood boil.<br><br>";
	text += "<font color='red'><b>VI. VICTORY</b></font><br>You have two ultimate goals as a cultist, sacrifice your target, and summon Nar-Sie. Sacrificing the target involves killing that individual and then placing their corpse on a sacrifice rune and triggering that rune with THREE cultists. Do NOT lose the target's corpse! Only once the target is sacrificed can Nar-Sie be summoned. Summoning Nar-Sie will take nearly one minute just to draw the massive rune needed. Do not create the rune until your cult is ready, the crew will receive the NAME and LOCATION of anyone who attempts to create the Nar-Sie rune. Once the Nar-Sie rune is drawn you must gathered 9 cultists (or constructs) over the rune and then click it to bring the Dark One into this world!<br><br>";
	(popup = (yield* new_(T("/datum/browser"), f.usr, "mind", "", 800, 600))).set_content(text);
	yield* popup.open();
	return 1;
}, true, { verb: { name: "How to Play Cult", category: "Cultist" } });

rt.type(93, "/datum/action/innate/cult/mastervote", "/datum/action/innate/cult", {
	name: "Assert Leadership",
	button_icon_state: "cultvote",
});

// cult_comms.dm:89
rt.def("/datum/action/innate/cult/mastervote/proc/IsAvailable", function IsAvailable(f: Frame) {
	if (GLOB.cult_vote_called || !rt.istype(this.owner, T("/mob/living/carbon/human"))) {
		return 0;
	}
	return parent_proc();
});

// cult_comms.dm:94
rt.def("/datum/action/innate/cult/mastervote/proc/Activate", function* Activate(f: Frame) {
	yield* pollCultists(this.owner);
	return f.dot;
}, true);

// cult_comms.dm:97
rt.def("/proc/pollCultists", function* pollCultists(f: Frame, Nominee: Value) {
	let B: Value = null, B_1: Value = null, B_2: Value = null, vote: Value = null;
	if (rt.worldTime(f) < 2400) {
		to_chat(Nominee, `It would be premature to select a leader while everyone is still settling in, try again in ${round((2400 - rt.worldTime(f)) / 10)} seconds.`);
		return f.dot;
	}
	GLOB.cult_vote_called = 1;
	for (B of each(GLOB.SSticker.mode.cult, T("/datum/mind"))) {
		if (B.current) {
			yield* B.current.update_action_buttons_icon();
			if (!B.current.incapacitated()) {
				rt.op(f, "OutputReference", [rt.R.field("current")], [B, rt.rsc("sound/hallucinations/im_here1.ogg")], false);
				to_chat(B.current, `<span class='cultlarge'>Acolyte ${Nominee} has asserted that they are worthy of leading the cult. A vote will be called shortly.</span>`);
			}
		}
	}
	yield* sleep(100);
	let asked_cultists: Value = list();
	for (B_1 of each(GLOB.SSticker.mode.cult, T("/datum/mind"))) {
		if (B_1.current && B_1.current != Nominee && !B_1.current.incapacitated()) {
			rt.op(f, "OutputReference", [rt.R.field("current")], [B_1, rt.rsc("sound/magic/exit_blood.ogg")], false);
			asked_cultists += B_1.current;
		}
	}
	let yes_voters: Value = (yield* pollCandidates(`${Nominee} seeks to lead your cult, do you support ${Nominee.p_them()}?`, { poll_time: 300, group: asked_cultists }));
	if (!Nominee || Nominee.gc_destroyed || Nominee.incapacitated()) {
		GLOB.cult_vote_called = 0;
		for (B_2 of each(GLOB.SSticker.mode.cult, T("/datum/mind"))) {
			if (B_2.current) {
				yield* B_2.current.update_action_buttons_icon();
				if (!B_2.current.incapacitated()) {
					to_chat(B_2.current, `<span class='cultlarge'>${Nominee} has died in the process of attempting to win the cult's support!`);
				}
			}
		}
		return 0;
	}
	if (!Nominee.mind) {
		GLOB.cult_vote_called = 0;
		B_2 = null;
		for (B_2 of each(GLOB.SSticker.mode.cult, T("/datum/mind"))) {
			if (B_2.current) {
				yield* B_2.current.update_action_buttons_icon();
				if (!B_2.current.incapacitated()) {
					to_chat(B_2.current, `<span class='cultlarge'>${Nominee} has gone catatonic in the process of attempting to win the cult's support!`);
				}
			}
		}
		return 0;
	}
	if (rt.length(yes_voters) <= rt.length(asked_cultists) * 0.5) {
		GLOB.cult_vote_called = 0;
		B_2 = null;
		for (B_2 of each(GLOB.SSticker.mode.cult, T("/datum/mind"))) {
			if (B_2.current) {
				yield* B_2.current.update_action_buttons_icon();
				if (!B_2.current.incapacitated()) {
					to_chat(B_2.current, `<span class='cultlarge'>${Nominee} could not win the cult's support and shall continue to serve as an acolyte.`);
				}
			}
		}
		return 0;
	}
	GLOB.cult_mastered = 1;
	yield* GLOB.SSticker.mode.remove_cultist(Nominee.mind, 1);
	yield* Nominee.mind.add_antag_datum(T("/datum/antagonist/cult/master"));
	B_2 = null;
	for (B_2 of each(GLOB.SSticker.mode.cult, T("/datum/mind"))) {
		if (B_2.current) {
			vote = null;
			for (vote of each(B_2.current.actions, T("/datum/action/innate/cult/mastervote"))) {
				yield* vote.Remove(B_2.current);
			}
			if (!B_2.current.incapacitated()) {
				to_chat(B_2.current, `<span class='cultlarge'>${Nominee} has won the cult's support and is now their master. Follow ${Nominee.p_their()} orders to the best of your ability!`);
			}
		}
	}
	return 1;
}, true);

rt.type(94, "/datum/action/innate/cult/master", "/datum/action/innate/cult", {});

// cult_comms.dm:150
rt.def("/datum/action/innate/cult/master/proc/IsAvailable", function IsAvailable(f: Frame) {
	if (!this.owner.mind || !this.owner.mind.has_antag_datum(T("/datum/antagonist/cult/master")) || GLOB.cult_narsie) {
		return 0;
	}
	return parent_proc();
});

rt.type(95, "/datum/action/innate/cult/master/finalreck", "/datum/action/innate/cult/master", {
	name: "Final Reckoning",
	desc: "A single-use spell that brings the entire cult to the master's location.",
	button_icon_state: "sintouch",
});

// cult_comms.dm:160
rt.def("/datum/action/innate/cult/master/finalreck/proc/Activate", function* Activate(f: Frame) {
	let i: Value = null, destinations: Value = null, _T: Value = null, B: Value = null, mobloc: Value = null, final: Value = null, S: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 4, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* this.chant(i);
		destinations = list();
		_T = null;
		for (_T of each(orange(1, this.owner), T("/turf"))) {
			if (!is_blocked_turf(_T, 1)) {
				destinations += _T;
			}
		}
		if (!rt.length(destinations)) {
			to_chat(this.owner, "<span class='warning'>You need more space to summon the cult!</span>");
			return f.dot;
		}
		if (yield* do_after(this.owner, 30, { target: this.owner })) {
			B = null;
			for (B of each(GLOB.SSticker.mode.cult, T("/datum/mind"))) {
				if (B.current && B.current.stat != 2) {
					mobloc = rt.getStep(f, B.current, 0);
					if (i === 1) {
						yield* new_(T("/obj/effect/temp_visual/cult/sparks"), mobloc, B.current.dir);
						playsound(mobloc, "sparks", 50, 1);
					} else if (i === 2) {
						yield* new_(T("/obj/effect/temp_visual/dir_setting/cult/phase/out"), mobloc, B.current.dir);
						playsound(mobloc, "sparks", 75, 1);
					} else if (i === 3) {
						yield* new_(T("/obj/effect/temp_visual/dir_setting/cult/phase"), mobloc, B.current.dir);
						playsound(mobloc, "sparks", 100, 1);
					} else if (i === 4) {
						playsound(mobloc, rt.rsc("sound/magic/exit_blood.ogg"), 100, 1);
						if (B.current != this.owner) {
							final = pick(destinations);
							if (rt.istype(B.current.loc, T("/obj/item/device/soulstone"))) {
								yield* (S = B.current.loc).release_shades(this.owner);
							}
							yield* B.current.setDir(2);
							yield* new_(T("/obj/effect/temp_visual/cult/blood"), final);
							yield* addtimer((yield* new_(T("/datum/callback"), B.current, P("/mob/proc/reckon"), final)), 10);
						}
					}
				}
			}
		} else {
			return f.dot;
		}
	}
	rt.endFor(f, 0);
	GLOB.reckoning_complete = 1;
	yield* this.Remove(this.owner);
	return f.dot;
}, true);

// cult_comms.dm:199
rt.def("/mob/proc/reckon", function* reckon(f: Frame, final: Value) {
	yield* new_(T("/obj/effect/temp_visual/cult/blood/out"), rt.getStep(f, this, 0));
	yield* this.forceMove(final);
	return f.dot;
}, true, { argTypes: [{ path: "/turf" }] });

// cult_comms.dm:203
rt.def("/datum/action/innate/cult/master/finalreck/proc/chant", function* chant(f: Frame, chant_number: Value) {
	if (chant_number === 1) {
		yield* this.owner.say("C'arta forbici!", { language: T("/datum/language/common") });
	} else if (chant_number === 2) {
		yield* this.owner.say("Pleggh e'ntrath!", { language: T("/datum/language/common") });
		playsound(rt.getStep(f, this.owner, 0), rt.rsc("sound/magic/clockwork/narsie_attack.ogg"), 50, 1);
	} else if (chant_number === 3) {
		yield* this.owner.say("Barhah hra zar'garis!", { language: T("/datum/language/common") });
		playsound(rt.getStep(f, this.owner, 0), rt.rsc("sound/magic/clockwork/narsie_attack.ogg"), 75, 1);
	} else if (chant_number === 4) {
		yield* this.owner.say("N'ath reth sh'yro eth d'rekkathnor!!!", { language: T("/datum/language/common") });
		playsound(rt.getStep(f, this.owner, 0), rt.rsc("sound/magic/clockwork/narsie_attack.ogg"), 100, 1);
	}
	return f.dot;
}, true);

rt.type(96, "/datum/action/innate/cult/master/cultmark", "/datum/action/innate/cult/master", {
	CM: null,
	cooldown: 0,
	base_cooldown: 1200,
	name: "Mark Target",
	desc: "Marks a target for the cult.",
	button_icon_state: "cult_mark",
});

// cult_comms.dm:225
rt.def("/datum/action/innate/cult/master/cultmark/proc/New", function* New(f: Frame) {
	this.CM = (yield* new_(T("/obj/effect/proc_holder/cultmark")));
	this.CM.attached_action = this;
	yield* parent_proc();
	return f.dot;
}, true);

// cult_comms.dm:230
rt.def("/datum/action/innate/cult/master/cultmark/proc/IsAvailable", function IsAvailable(f: Frame) {
	if (!this.owner.mind || !this.owner.mind.has_antag_datum(T("/datum/antagonist/cult/master"))) {
		return 0;
	}
	if (this.cooldown > rt.worldTime(f)) {
		if (!this.CM.active) {
			to_chat(this.owner, `<span class='cultlarge'><b>You need to wait ${round((this.cooldown - rt.worldTime(f)) * 0.1)} seconds before you can mark another target!</b></span>`);
		}
		return 0;
	}
	return parent_proc();
});

// cult_comms.dm:239
rt.def("/datum/action/innate/cult/master/cultmark/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.CM);
	this.CM = null;
	return (yield* parent_proc());
}, true);

// cult_comms.dm:243
rt.def("/datum/action/innate/cult/master/cultmark/proc/Activate", function* Activate(f: Frame) {
	yield* this.CM.toggle(this.owner);
	return 1;
}, true);

rt.type(11269, "/obj/effect/proc_holder/cultmark", "/obj/effect/proc_holder", {
	attached_action: null,
	active: 0,
	ranged_mousepointer: rt.rsc("icons/effects/cult_target.dmi"),
});

// cult_comms.dm:253
rt.def("/obj/effect/proc_holder/cultmark/proc/Destroy", function* Destroy(f: Frame) {
	this.attached_action = null;
	return (yield* parent_proc());
}, true);

// cult_comms.dm:257
rt.def("/obj/effect/proc_holder/cultmark/proc/toggle", function* toggle(f: Frame, user: Value) {
	if (this.active) {
		yield* this.remove_ranged_ability("<span class='cult'>You cease the marking ritual.</span>");
	} else {
		yield* this.add_ranged_ability(user, "<span class='cult'>You prepare to mark a target for your cult...</span>");
	}
	return f.dot;
}, true);

// cult_comms.dm:262
rt.def("/obj/effect/proc_holder/cultmark/proc/InterceptClickOn", function* InterceptClickOn(f: Frame, caller: Value, params: Value, target: Value) {
	let _T: Value = null, A: Value = null, B: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (this.ranged_ability_user.incapacitated()) {
		yield* this.remove_ranged_ability();
		return f.dot;
	}
	if (!isturf((_T = rt.getStep(f, this.ranged_ability_user, 0)))) {
		return 0;
	}
	if (rt.isIn(f, target, view(7, rt.getStep(f, this.ranged_ability_user, 0)))) {
		GLOB.blood_target = target;
		A = get_area(target);
		this.attached_action.cooldown = rt.worldTime(f) + this.attached_action.base_cooldown;
		yield* addtimer((yield* new_(T("/datum/callback"), this.attached_action.owner, P("/mob/proc/update_action_buttons_icon"))), this.attached_action.base_cooldown);
		GLOB.blood_target_image = image(rt.rsc("icons/effects/cult_target.dmi"), target, "glow", ABOVE_MOB_LAYER);
		GLOB.blood_target_image.appearance_flags = 2;
		GLOB.blood_target_image.pixel_x = -target.pixel_x;
		GLOB.blood_target_image.pixel_y = -target.pixel_y;
		for (B of each(GLOB.SSticker.mode.cult, T("/datum/mind"))) {
			if (B.current && B.current.stat != 2 && B.current.client) {
				to_chat(B.current, `<span class='cultlarge'><b>Master ${this.ranged_ability_user} has marked ${GLOB.blood_target} in the ${A.name} as the cult's top priority, get there immediately!</b></span>`);
				rt.op(f, "OutputReference", [rt.R.field("current")], [B, pick(sound(rt.rsc("sound/hallucinations/over_here2.ogg"), 0, 1, 75), sound(rt.rsc("sound/hallucinations/over_here3.ogg"), 0, 1, 75))], false);
				B.current.client.images += GLOB.blood_target_image;
			}
		}
		yield* this.attached_action.owner.update_action_buttons_icon();
		yield* this.remove_ranged_ability("<span class='cult'>The marking rite is complete! It will last for 90 seconds.</span>");
		GLOB.blood_target_reset_timer = (yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/reset_blood_target"))), 900, 8));
		return 1;
	}
	return 0;
}, true);

// cult_comms.dm:291
rt.def("/proc/reset_blood_target", function* reset_blood_target(f: Frame) {
	let B: Value = null;
	for (B of each(GLOB.SSticker.mode.cult, T("/datum/mind"))) {
		if (B.current && B.current.stat != 2 && B.current.client) {
			if (GLOB.blood_target) {
				to_chat(B.current, "<span class='cultlarge'><b>The blood mark has expired!</b></span>");
			}
			B.current.client.images -= GLOB.blood_target_image;
		}
	}
	yield* qdel(GLOB.blood_target_image);
	GLOB.blood_target_image = null;
	GLOB.blood_target = null;
	return f.dot;
}, true);

rt.type(97, "/datum/action/innate/cult/master/pulse", "/datum/action/innate/cult/master", {
	PM: null,
	cooldown: 0,
	base_cooldown: 150,
	throwing: 0,
	throwee: null,
	name: "Eldritch Pulse",
	desc: "Seize upon a fellow cultist or cult structure and teleport it to a nearby location.",
	button_icon_state: "arcane_barrage",
});

// cult_comms.dm:316
rt.def("/datum/action/innate/cult/master/pulse/proc/New", function* New(f: Frame) {
	this.PM = (yield* new_(T("/obj/effect/proc_holder/pulse")));
	this.PM.attached_action = this;
	yield* parent_proc();
	return f.dot;
}, true);

// cult_comms.dm:321
rt.def("/datum/action/innate/cult/master/pulse/proc/IsAvailable", function IsAvailable(f: Frame) {
	if (!this.owner.mind || !this.owner.mind.has_antag_datum(T("/datum/antagonist/cult/master"))) {
		return 0;
	}
	if (this.cooldown > rt.worldTime(f)) {
		if (!this.PM.active) {
			rt.op(f, "OutputReference", [rt.R.srcVar("owner")], [`<span class='cultlarge'><b>You need to wait ${round((this.cooldown - rt.worldTime(f)) * 0.1)} seconds before you can pulse again!</b></span>`], false);
		}
		return 0;
	}
	return parent_proc();
});

// cult_comms.dm:330
rt.def("/datum/action/innate/cult/master/pulse/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.PM);
	this.PM = null;
	return (yield* parent_proc());
}, true);

// cult_comms.dm:334
rt.def("/datum/action/innate/cult/master/pulse/proc/Activate", function* Activate(f: Frame) {
	yield* this.PM.toggle(this.owner);
	return 1;
}, true);

rt.type(11270, "/obj/effect/proc_holder/pulse", "/obj/effect/proc_holder", {
	attached_action: null,
	active: 0,
	ranged_mousepointer: rt.rsc("icons/effects/throw_target.dmi"),
});

// cult_comms.dm:343
rt.def("/obj/effect/proc_holder/pulse/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.attached_action);
	this.attached_action = null;
	return (yield* parent_proc());
}, true);

// cult_comms.dm:348
rt.def("/obj/effect/proc_holder/pulse/proc/toggle", function* toggle(f: Frame, user: Value) {
	if (this.active) {
		yield* this.remove_ranged_ability("<span class='cult'>You cease your preparations...</span>");
		this.attached_action.throwing = 0;
	} else {
		yield* this.add_ranged_ability(user, "<span class='cult'>You prepare to tear through the fabric of reality...</span>");
	}
	return f.dot;
}, true);

// cult_comms.dm:354
rt.def("/obj/effect/proc_holder/pulse/proc/InterceptClickOn", function* InterceptClickOn(f: Frame, caller: Value, params: Value, target: Value) {
	let _T: Value = null, distance: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (this.ranged_ability_user.incapacitated()) {
		yield* this.remove_ranged_ability();
		return f.dot;
	}
	if (!isturf((_T = rt.getStep(f, this.ranged_ability_user, 0)))) {
		return 0;
	}
	if (!rt.isIn(f, target, view(7, rt.getStep(f, this.ranged_ability_user, 0)))) return f.dot;
	if ((!(iscultist(target) || rt.istype(target, T("/obj/structure/destructible/cult"))) || target == caller) && !this.attached_action.throwing) {
		return f.dot;
	}
	if (!this.attached_action.throwing) {
		this.attached_action.throwing = 1;
		this.attached_action.throwee = target;
		rt.op(f, "OutputReference", [rt.R.srcVar("ranged_ability_user")], [rt.rsc("sound/weapons/thudswoosh.ogg")], false);
		to_chat(this.ranged_ability_user, `<span class='cult'><b>You reach through the veil with your mind's eye and seize ${target}!</b></span>`);
		return f.dot;
	} else {
		yield* new_(T("/obj/effect/temp_visual/cult/sparks"), rt.getStep(f, this.attached_action.throwee, 0), this.ranged_ability_user.dir);
		if ((distance = get_dist(this.attached_action.throwee, target)) >= 16) {
			return f.dot;
		}
		playsound(target, rt.rsc("sound/magic/exit_blood.ogg"));
		yield* this.attached_action.throwee.Beam(target, { icon_state: "sendbeam", time: 4 });
		yield* this.attached_action.throwee.forceMove(rt.getStep(f, target, 0));
		yield* new_(T("/obj/effect/temp_visual/cult/sparks"), rt.getStep(f, target, 0), this.ranged_ability_user.dir);
		this.attached_action.throwing = 0;
		this.attached_action.cooldown = rt.worldTime(f) + this.attached_action.base_cooldown;
		this.remove_mousepointer(this.ranged_ability_user.client);
		yield* this.remove_ranged_ability(`<span class='cult'>A pulse of blood magic surges through you as you shift ${this.attached_action.throwee} through time and space.</span>`);
		yield* caller.update_action_buttons_icon();
		yield* addtimer((yield* new_(T("/datum/callback"), caller, P("/mob/proc/update_action_buttons_icon"))), this.attached_action.base_cooldown);
	}
	return f.dot;
}, true);
