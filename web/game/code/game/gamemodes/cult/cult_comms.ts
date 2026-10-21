// From code/game/gamemodes/cult/cult_comms.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(91, "/datum/action/innate/cult", "/datum/action/innate", {
	background_icon_state: "bg_demon",
	buttontooltipstyle: "cult",
	check_flags: 11,
});

// /datum/action/innate/cult/proc/IsAvailable  (code/game/gamemodes/cult/cult_comms.dm:10)
rt.def("/datum/action/innate/cult/proc/IsAvailable", function IsAvailable(f: Frame) {
	if (!truthy(rt.call(f, P("/proc/iscultist"), null, [rt.sv(f, "owner")]))) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

rt.type(92, "/datum/action/innate/cult/comm", "/datum/action/innate/cult", {
	name: "Communion",
	button_icon_state: "cult_comms",
});

// /datum/action/innate/cult/comm/proc/Activate  (code/game/gamemodes/cult/cult_comms.dm:19)  may sleep
rt.def("/datum/action/innate/cult/comm/proc/Activate", function* Activate(f: Frame) {
	let input: Value = null;
	f.vars = () => [input];
	if ((!truthy((input = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Please choose a message to tell to the other acolytes.", "Voice of Blood", ""])))) || !truthy((yield* g.srcCall(f, "IsAvailable"))))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/cultist_commune"), null, [live(f.usr), live(input)]);
	return f.dot;
}, true);

// /proc/cultist_commune  (code/game/gamemodes/cult/cult_comms.dm:27)  may sleep
rt.def("/proc/cultist_commune", function* cultist_commune(f: Frame, user: Value, message: Value) {
	let my_message: Value = null, title: Value = null, span: Value = null, M: Value = null, link: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [user, message, my_message, title, span, M, link, $0, $1, $2, $e];
	my_message = null;
	if (!truthy(live(message))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "whisper", [null, fmt("O bidai nabora se＀sma!", [rt.op(f, "PickUnweighted", [2], ["'", "`"])]), "language", T("/datum/language/common")], rt.Args.Named);
	yield* g.callName(f, live(user), "whisper", [(yield* g.call(f, P("/proc/html_decode"), null, [live(message)]))]);
	title = "Acolyte";
	span = "cultitalic";
	if ((truthy(rt.fv(f, "mind", live(user))) && truthy((yield* g.callName(f, rt.fv(f, "mind", live(user)), "has_antag_datum", [T("/datum/antagonist/cult/master")]))))) {
		span = "cultlarge";
		if (truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
			title = "Master";
		} else {
			title = "Lord";
		}
	} else {
		if (!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
			title = "Construct";
		}
	}
	$0 = live(span);
	$1 = live(title);
	if (truthy((yield* g.call(f, P("/proc/findtextEx"), null, [rt.fv(f, "name", live(user)), rt.fv(f, "real_name", live(user))])))) {
		$2 = rt.fv(f, "name", live(user));
	} else {
		$2 = fmt("＀ (as ＀)", [rt.fv(f, "real_name", live(user)), rt.fv(f, "name", live(user))]);
	}
	my_message = fmt("<span class='＀'><b>＀ ＀:</b> ＀</span>", [$0, $1, $2, live(message)]);
	M = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(M)])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), live(my_message)]);
		} else {
			if (truthy((rt.isIn(f, live(M), rt.gl("dead_mob_list")) ? 1 : 0))) {
				link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [live(M), live(user)]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("＀ ＀", [live(link), live(my_message)])]);
			}
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/log_say"), null, [fmt("＀/＀ : ＀", [rt.fv(f, "real_name", live(user)), rt.fv(f, "key", live(user)), live(message)])]);
	return f.dot;
}, true);

// /mob/living/proc/cult_help  (code/game/gamemodes/cult/cult_comms.dm:54)  may sleep
rt.def("/mob/living/proc/cult_help", function* cult_help(f: Frame) {
	let text: Value = null, popup: Value = null;
	f.vars = () => [text, popup];
	text = "";
	text = rt.modify(live(text), "<center><font color='red' size=3><b><i>Tenets of the Dark One</i></b></font></center><br><br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>I. SECRECY</b></font><br>Your cult is a SECRET organization. Your success DEPENDS on keeping your cult's members and locations SECRET for as long as possible. This means that your tome should be hidden in your bag and never brought out in public. You should never create runes where other crew might find them, and you should avoid using talismans or other cult magic with witnesses around.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>II. TOME</b></font><br>You start with a unique talisman in your bag. This supply talisman can be used 3 times, and creates starter equipment for your cult. The most critical of the talisman's functions is the power to create a tome. This tome is your most important item and summoning one (in secret) is your FIRST PRIORITY. It lets you talk to fellow cultists and create runes, which in turn is essential to growing the cult's power.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>III. RUNES</b></font><br>Runes are powerful sources of cult magic. Your tome will allow you to draw runes with your blood. Those runes, when hit with an empty hand, will attempt to trigger the rune's magic. Runes are essential for the cult to convert new members, create powerful minions, or call upon incredibly powerful magic. Some runes require more than one cultist to use.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>IV. TALISMANS</b></font><br>Talismans are a mobile source of cult magic that are NECESSARY to achieve success as a cult. Your starting talisman can produce certain talismans, but you will need to use the -create talisman- rune (with ordinary paper on top) to get more talismans. Talismans are EXTREMELY powerful, therefore creating more talismans in a HIDDEN location should be one of your TOP PRIORITIES.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>V. GROW THE CULT</b></font><br>There are certain basic strategies that all cultists should master. STUN talismans are the foundation of a successful cult. If you intend to convert the stunned person you should use cuffs or a talisman of shackling on them and remove their headset before they recover (it takes about 10 seconds to recover). If you intend to sacrifice the victim, striking them quickly and repeatedly with your tome will knock them out before they can recover. Sacrificed victims will their soul behind in a shard, these shards can be used on construct shells to make powerful servants for the cult. Remember you need TWO cultists standing near a conversion rune to convert someone. Your construct minions cannot trigger most runes, but they will count as cultists in helping you trigger more powerful runes like conversion or blood boil.<br><br>", add);
	text = rt.modify(live(text), "<font color='red'><b>VI. VICTORY</b></font><br>You have two ultimate goals as a cultist, sacrifice your target, and summon Nar-Sie. Sacrificing the target involves killing that individual and then placing their corpse on a sacrifice rune and triggering that rune with THREE cultists. Do NOT lose the target's corpse! Only once the target is sacrificed can Nar-Sie be summoned. Summoning Nar-Sie will take nearly one minute just to draw the massive rune needed. Do not create the rune until your cult is ready, the crew will receive the NAME and LOCATION of anyone who attempts to create the Nar-Sie rune. Once the Nar-Sie rune is drawn you must gathered 9 cultists (or constructs) over the rune and then click it to bring the Dark One into this world!<br><br>", add);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(f.usr), "mind", "", 800, 600]))), "set_content", [live(text)]);
	yield* g.callName(f, live(popup), "open", []);
	return 1;
}, true, { verb: { name: "How to Play Cult", category: "Cultist" } });

rt.type(93, "/datum/action/innate/cult/mastervote", "/datum/action/innate/cult", {
	name: "Assert Leadership",
	button_icon_state: "cultvote",
});

// /datum/action/innate/cult/mastervote/proc/IsAvailable  (code/game/gamemodes/cult/cult_comms.dm:89)
rt.def("/datum/action/innate/cult/mastervote/proc/IsAvailable", function IsAvailable(f: Frame) {
	if ((truthy(rt.gl("cult_vote_called")) || !truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living/carbon/human")) ? 1 : 0)))) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

// /datum/action/innate/cult/mastervote/proc/Activate  (code/game/gamemodes/cult/cult_comms.dm:94)  may sleep
rt.def("/datum/action/innate/cult/mastervote/proc/Activate", function* Activate(f: Frame) {
	yield* g.call(f, P("/proc/pollCultists"), null, [rt.sv(f, "owner")]);
	return f.dot;
}, true);

// /proc/pollCultists  (code/game/gamemodes/cult/cult_comms.dm:97)  may sleep
rt.def("/proc/pollCultists", function* pollCultists(f: Frame, Nominee: Value) {
	let B: Value = null, asked_cultists: Value = null, B_1: Value = null, yes_voters: Value = null, B_2: Value = null, vote: Value = null;
	let $e: any;
	f.vars = () => [Nominee, B, asked_cultists, B_1, yes_voters, B_2, vote, $e];
	if (rt.lt(rt.worldTime(f), 2400)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(Nominee), fmt("It would be premature to select a leader while everyone is still settling in, try again in ＀ seconds.", [(yield* g.call(f, P("/proc/round"), null, [divide(subtract(2400, rt.worldTime(f)), 10)]))])]);
		return live(f.dot);
	}
	rt.setGl("cult_vote_called", 1);
	B = null;
	rt.forList(f, 0, rt.gv(f, "cult", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		if (truthy(rt.fv(f, "current", live(B)))) {
			yield* g.callName(f, rt.fv(f, "current", live(B)), "update_action_buttons_icon", []);
			if (!truthy((yield* g.callName(f, rt.fv(f, "current", live(B)), "incapacitated", [])))) {
				rt.op(f, "OutputReference", [rt.R.field("current")], [live(B), rt.rsc("sound/hallucinations/im_here1.ogg")], false);
				yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(B)), fmt("<span class='cultlarge'>Acolyte ＀ has asserted that they are worthy of leading the cult. A vote will be called shortly.</span>", [live(Nominee)])]);
			}
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/sleep"), null, [100]);
	asked_cultists = rt.list();
	B_1 = null;
	rt.forList(f, 0, rt.gv(f, "cult", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B_1 = $e;
		if (((truthy(rt.fv(f, "current", live(B_1))) && !isEqual(rt.fv(f, "current", live(B_1)), live(Nominee))) && !truthy((yield* g.callName(f, rt.fv(f, "current", live(B_1)), "incapacitated", []))))) {
			rt.op(f, "OutputReference", [rt.R.field("current")], [live(B_1), rt.rsc("sound/magic/exit_blood.ogg")], false);
			asked_cultists = rt.modify(live(asked_cultists), rt.fv(f, "current", live(B_1)), add);
		}
	}
	rt.endFor(f, 0);
	yes_voters = (yield* g.call(f, P("/proc/pollCandidates"), null, [null, fmt("＀ seeks to lead your cult, do you support ＀?", [live(Nominee), (yield* g.callName(f, live(Nominee), "p_them", []))]), "poll_time", 300, "group", live(asked_cultists)], rt.Args.Named));
	if (((!truthy(live(Nominee)) || truthy(rt.fv(f, "gc_destroyed", live(Nominee)))) || truthy((yield* g.callName(f, live(Nominee), "incapacitated", []))))) {
		rt.setGl("cult_vote_called", 0);
		B_2 = null;
		rt.forList(f, 0, rt.gv(f, "cult", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/mind"));
		while (($e = rt.next(f, 0)) !== undefined) {
			B_2 = $e;
			if (truthy(rt.fv(f, "current", live(B_2)))) {
				yield* g.callName(f, rt.fv(f, "current", live(B_2)), "update_action_buttons_icon", []);
				if (!truthy((yield* g.callName(f, rt.fv(f, "current", live(B_2)), "incapacitated", [])))) {
					yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(B_2)), fmt("<span class='cultlarge'>＀ has died in the process of attempting to win the cult's support!", [live(Nominee)])]);
				}
			}
		}
		rt.endFor(f, 0);
		return 0;
	}
	if (!truthy(rt.fv(f, "mind", live(Nominee)))) {
		rt.setGl("cult_vote_called", 0);
		B_2 = null;
		rt.forList(f, 0, rt.gv(f, "cult", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/mind"));
		while (($e = rt.next(f, 0)) !== undefined) {
			B_2 = $e;
			if (truthy(rt.fv(f, "current", live(B_2)))) {
				yield* g.callName(f, rt.fv(f, "current", live(B_2)), "update_action_buttons_icon", []);
				if (!truthy((yield* g.callName(f, rt.fv(f, "current", live(B_2)), "incapacitated", [])))) {
					yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(B_2)), fmt("<span class='cultlarge'>＀ has gone catatonic in the process of attempting to win the cult's support!", [live(Nominee)])]);
				}
			}
		}
		rt.endFor(f, 0);
		return 0;
	}
	if (rt.le(rt.length(live(yes_voters)), multiply(rt.length(live(asked_cultists)), 0.5))) {
		rt.setGl("cult_vote_called", 0);
		B_2 = null;
		rt.forList(f, 0, rt.gv(f, "cult", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/mind"));
		while (($e = rt.next(f, 0)) !== undefined) {
			B_2 = $e;
			if (truthy(rt.fv(f, "current", live(B_2)))) {
				yield* g.callName(f, rt.fv(f, "current", live(B_2)), "update_action_buttons_icon", []);
				if (!truthy((yield* g.callName(f, rt.fv(f, "current", live(B_2)), "incapacitated", [])))) {
					yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(B_2)), fmt("<span class='cultlarge'>＀ could not win the cult's support and shall continue to serve as an acolyte.", [live(Nominee)])]);
				}
			}
		}
		rt.endFor(f, 0);
		return 0;
	}
	rt.setGl("cult_mastered", 1);
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "remove_cultist", [rt.fv(f, "mind", live(Nominee)), 1]);
	yield* g.callName(f, rt.fv(f, "mind", live(Nominee)), "add_antag_datum", [T("/datum/antagonist/cult/master")]);
	B_2 = null;
	rt.forList(f, 0, rt.gv(f, "cult", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B_2 = $e;
		if (truthy(rt.fv(f, "current", live(B_2)))) {
			vote = null;
			rt.forList(f, 1, rt.gv(f, "actions", rt.fv(f, "current", live(B_2))), T("/datum/action/innate/cult/mastervote"));
			while (($e = rt.next(f, 1)) !== undefined) {
				vote = $e;
				yield* g.callName(f, live(vote), "Remove", [rt.fv(f, "current", live(B_2))]);
			}
			rt.endFor(f, 1);
			if (!truthy((yield* g.callName(f, rt.fv(f, "current", live(B_2)), "incapacitated", [])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(B_2)), fmt("<span class='cultlarge'>＀ has won the cult's support and is now their master. Follow ＀ orders to the best of your ability!", [live(Nominee), (yield* g.callName(f, live(Nominee), "p_their", []))])]);
			}
		}
	}
	rt.endFor(f, 0);
	return 1;
}, true);

rt.type(94, "/datum/action/innate/cult/master", "/datum/action/innate/cult", {});

// /datum/action/innate/cult/master/proc/IsAvailable  (code/game/gamemodes/cult/cult_comms.dm:150)
rt.def("/datum/action/innate/cult/master/proc/IsAvailable", function IsAvailable(f: Frame) {
	if (((!truthy(rt.fv(f, "mind", rt.sv(f, "owner"))) || !truthy(rt.callName(f, rt.fv(f, "mind", rt.sv(f, "owner")), "has_antag_datum", [T("/datum/antagonist/cult/master")]))) || truthy(rt.gl("cult_narsie")))) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

rt.type(95, "/datum/action/innate/cult/master/finalreck", "/datum/action/innate/cult/master", {
	name: "Final Reckoning",
	desc: "A single-use spell that brings the entire cult to the master's location.",
	button_icon_state: "sintouch",
});

// /datum/action/innate/cult/master/finalreck/proc/Activate  (code/game/gamemodes/cult/cult_comms.dm:160)  may sleep
rt.def("/datum/action/innate/cult/master/finalreck/proc/Activate", function* Activate(f: Frame) {
	let i: Value = null, destinations: Value = null, _T: Value = null, B: Value = null, mobloc: Value = null, final: Value = null, S: Value = null;
	let $0: any, $e: any;
	f.vars = () => [i, destinations, _T, B, mobloc, final, S, $0, $e];
	i = null;
	rt.forRange(f, 0, 1, 4, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.srcCall(f, "chant", live(i));
		destinations = rt.list();
		_T = null;
		rt.forList(f, 1, (yield* g.call(f, P("/proc/orange"), null, [1, rt.sv(f, "owner")])), T("/turf"));
		while (($e = rt.next(f, 1)) !== undefined) {
			_T = $e;
			if (!truthy((yield* g.call(f, P("/proc/is_blocked_turf"), null, [live(_T), 1])))) {
				destinations = rt.modify(live(destinations), live(_T), add);
			}
		}
		rt.endFor(f, 1);
		if (!truthy(rt.length(live(destinations)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='warning'>You need more space to summon the cult!</span>"]);
			return live(f.dot);
		}
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, rt.sv(f, "owner"), null, 30, "target", rt.sv(f, "owner")], rt.Args.Named)))) {
			B = null;
			rt.forList(f, 1, rt.gv(f, "cult", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/mind"));
			while (($e = rt.next(f, 1)) !== undefined) {
				B = $e;
				if ((truthy(rt.fv(f, "current", live(B))) && !isEqual(rt.gv(f, "stat", rt.fv(f, "current", live(B))), 2))) {
					mobloc = rt.getStep(f, rt.fv(f, "current", live(B)), 0);
					$0 = live(i);
					if ($0 === 1) {
						yield* g.new_(f, T("/obj/effect/temp_visual/cult/sparks"), [live(mobloc), rt.gv(f, "dir", rt.fv(f, "current", live(B)))]);
						yield* g.call(f, P("/proc/playsound"), null, [live(mobloc), "sparks", 50, 1]);
					} else if ($0 === 2) {
						yield* g.new_(f, T("/obj/effect/temp_visual/dir_setting/cult/phase/out"), [live(mobloc), rt.gv(f, "dir", rt.fv(f, "current", live(B)))]);
						yield* g.call(f, P("/proc/playsound"), null, [live(mobloc), "sparks", 75, 1]);
					} else if ($0 === 3) {
						yield* g.new_(f, T("/obj/effect/temp_visual/dir_setting/cult/phase"), [live(mobloc), rt.gv(f, "dir", rt.fv(f, "current", live(B)))]);
						yield* g.call(f, P("/proc/playsound"), null, [live(mobloc), "sparks", 100, 1]);
					} else if ($0 === 4) {
						yield* g.call(f, P("/proc/playsound"), null, [live(mobloc), rt.rsc("sound/magic/exit_blood.ogg"), 100, 1]);
						if (!isEqual(rt.fv(f, "current", live(B)), rt.sv(f, "owner"))) {
							final = rt.op(f, "PickUnweighted", [1], [live(destinations)]);
							if (truthy((rt.istype(rt.gv(f, "loc", rt.fv(f, "current", live(B))), T("/obj/item/device/soulstone")) ? 1 : 0))) {
								yield* g.callName(f, (S = rt.gv(f, "loc", rt.fv(f, "current", live(B)))), "release_shades", [rt.sv(f, "owner")]);
							}
							yield* g.callName(f, rt.fv(f, "current", live(B)), "setDir", [2]);
							yield* g.new_(f, T("/obj/effect/temp_visual/cult/blood"), [live(final)]);
							yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [rt.fv(f, "current", live(B)), P("/mob/proc/reckon"), live(final)])), 10]);
						}
					}
				}
			}
			rt.endFor(f, 1);
		} else {
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	rt.setGl("reckoning_complete", 1);
	yield* g.srcCall(f, "Remove", rt.sv(f, "owner"));
	return f.dot;
}, true);

// /mob/proc/reckon  (code/game/gamemodes/cult/cult_comms.dm:199)  may sleep
rt.def("/mob/proc/reckon", function* reckon(f: Frame, final: Value) {
	f.vars = () => [final];
	yield* g.new_(f, T("/obj/effect/temp_visual/cult/blood/out"), [rt.getStep(f, live(f.src), 0)]);
	yield* g.srcCall(f, "forceMove", live(final));
	return f.dot;
}, true, { argTypes: [{ path: "/turf" }] });

// /datum/action/innate/cult/master/finalreck/proc/chant  (code/game/gamemodes/cult/cult_comms.dm:203)  may sleep
rt.def("/datum/action/innate/cult/master/finalreck/proc/chant", function* chant(f: Frame, chant_number: Value) {
	let $0: any;
	f.vars = () => [chant_number, $0];
	$0 = live(chant_number);
	if ($0 === 1) {
		yield* g.callName(f, rt.sv(f, "owner"), "say", [null, "C'arta forbici!", "language", T("/datum/language/common")], rt.Args.Named);
	} else if ($0 === 2) {
		yield* g.callName(f, rt.sv(f, "owner"), "say", [null, "Pleggh e'ntrath!", "language", T("/datum/language/common")], rt.Args.Named);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, rt.sv(f, "owner"), 0), rt.rsc("sound/magic/clockwork/narsie_attack.ogg"), 50, 1]);
	} else if ($0 === 3) {
		yield* g.callName(f, rt.sv(f, "owner"), "say", [null, "Barhah hra zar'garis!", "language", T("/datum/language/common")], rt.Args.Named);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, rt.sv(f, "owner"), 0), rt.rsc("sound/magic/clockwork/narsie_attack.ogg"), 75, 1]);
	} else if ($0 === 4) {
		yield* g.callName(f, rt.sv(f, "owner"), "say", [null, "N'ath reth sh'yro eth d'rekkathnor!!!", "language", T("/datum/language/common")], rt.Args.Named);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, rt.sv(f, "owner"), 0), rt.rsc("sound/magic/clockwork/narsie_attack.ogg"), 100, 1]);
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

// /datum/action/innate/cult/master/cultmark/proc/New  (code/game/gamemodes/cult/cult_comms.dm:225)  may sleep
rt.def("/datum/action/innate/cult/master/cultmark/proc/New", function* New(f: Frame) {
	rt.setSv(f, "CM", (yield* g.new_(f, T("/obj/effect/proc_holder/cultmark"), [])));
	rt.setFv(f, "attached_action", rt.sv(f, "CM"), live(f.src));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /datum/action/innate/cult/master/cultmark/proc/IsAvailable  (code/game/gamemodes/cult/cult_comms.dm:230)
rt.def("/datum/action/innate/cult/master/cultmark/proc/IsAvailable", function IsAvailable(f: Frame) {
	if ((!truthy(rt.fv(f, "mind", rt.sv(f, "owner"))) || !truthy(rt.callName(f, rt.fv(f, "mind", rt.sv(f, "owner")), "has_antag_datum", [T("/datum/antagonist/cult/master")])))) {
		return 0;
	}
	if (rt.gt(rt.sv(f, "cooldown"), rt.worldTime(f))) {
		if (!truthy(rt.fv(f, "active", rt.sv(f, "CM")))) {
			rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), fmt("<span class='cultlarge'><b>You need to wait ＀ seconds before you can mark another target!</b></span>", [rt.call(f, P("/proc/round"), null, [multiply(subtract(rt.sv(f, "cooldown"), rt.worldTime(f)), 0.10000000149011612)])])]);
		}
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

// /datum/action/innate/cult/master/cultmark/proc/Destroy  (code/game/gamemodes/cult/cult_comms.dm:239)  may sleep
rt.def("/datum/action/innate/cult/master/cultmark/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "CM")]);
	rt.setSv(f, "CM", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/action/innate/cult/master/cultmark/proc/Activate  (code/game/gamemodes/cult/cult_comms.dm:243)  may sleep
rt.def("/datum/action/innate/cult/master/cultmark/proc/Activate", function* Activate(f: Frame) {
	yield* g.callName(f, rt.sv(f, "CM"), "toggle", [rt.sv(f, "owner")]);
	return 1;
}, true);

rt.type(11269, "/obj/effect/proc_holder/cultmark", "/obj/effect/proc_holder", {
	attached_action: null,
	active: 0,
	ranged_mousepointer: rt.rsc("icons/effects/cult_target.dmi"),
});

// /obj/effect/proc_holder/cultmark/proc/Destroy  (code/game/gamemodes/cult/cult_comms.dm:253)  may sleep
rt.def("/obj/effect/proc_holder/cultmark/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "attached_action", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/effect/proc_holder/cultmark/proc/toggle  (code/game/gamemodes/cult/cult_comms.dm:257)  may sleep
rt.def("/obj/effect/proc_holder/cultmark/proc/toggle", function* toggle(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "active"))) {
		yield* g.srcCall(f, "remove_ranged_ability", "<span class='cult'>You cease the marking ritual.</span>");
	} else {
		yield* g.srcCall(f, "add_ranged_ability", live(user), "<span class='cult'>You prepare to mark a target for your cult...</span>");
	}
	return f.dot;
}, true);

// /obj/effect/proc_holder/cultmark/proc/InterceptClickOn  (code/game/gamemodes/cult/cult_comms.dm:262)  may sleep
rt.def("/obj/effect/proc_holder/cultmark/proc/InterceptClickOn", function* InterceptClickOn(f: Frame) {
	let _T: Value = null, A: Value = null, B: Value = null;
	let $e: any;
	f.vars = () => [_T, A, B, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, rt.sv(f, "ranged_ability_user"), "incapacitated", [])))) {
		yield* g.srcCall(f, "remove_ranged_ability");
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [(_T = rt.getStep(f, rt.sv(f, "ranged_ability_user"), 0))])))) {
		return 0;
	}
	if (truthy((rt.isIn(f, live(f.args[2]), (yield* g.call(f, P("/proc/view"), null, [7, rt.getStep(f, rt.sv(f, "ranged_ability_user"), 0)]))) ? 1 : 0))) {
		rt.setGl("blood_target", live(f.args[2]));
		A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.args[2])]));
		rt.setFv(f, "cooldown", rt.sv(f, "attached_action"), add(rt.worldTime(f), rt.fv(f, "base_cooldown", rt.sv(f, "attached_action"))));
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [rt.fv(f, "owner", rt.sv(f, "attached_action")), P("/mob/proc/update_action_buttons_icon")])), rt.fv(f, "base_cooldown", rt.sv(f, "attached_action"))]);
		rt.setGl("blood_target_image", (yield* g.call(f, P("/proc/image"), null, [rt.rsc("icons/effects/cult_target.dmi"), live(f.args[2]), "glow", 4.099999904632568])));
		rt.setFv(f, "appearance_flags", rt.gl("blood_target_image"), 2);
		rt.setFv(f, "pixel_x", rt.gl("blood_target_image"), rt.neg(rt.fv(f, "pixel_x", live(f.args[2]))));
		rt.setFv(f, "pixel_y", rt.gl("blood_target_image"), rt.neg(rt.fv(f, "pixel_y", live(f.args[2]))));
		B = null;
		rt.forList(f, 0, rt.gv(f, "cult", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/mind"));
		while (($e = rt.next(f, 0)) !== undefined) {
			B = $e;
			if (((truthy(rt.fv(f, "current", live(B))) && !isEqual(rt.gv(f, "stat", rt.fv(f, "current", live(B))), 2)) && truthy(rt.gv(f, "client", rt.fv(f, "current", live(B)))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(B)), fmt("<span class='cultlarge'><b>Master ＀ has marked ＀ in the ＀ as the cult's top priority, get there immediately!</b></span>", [rt.sv(f, "ranged_ability_user"), rt.gl("blood_target"), rt.fv(f, "name", live(A))])]);
				rt.op(f, "OutputReference", [rt.R.field("current")], [live(B), rt.op(f, "PickUnweighted", [2], [(yield* g.call(f, P("/proc/sound"), null, [rt.rsc("sound/hallucinations/over_here2.ogg"), 0, 1, 75])), (yield* g.call(f, P("/proc/sound"), null, [rt.rsc("sound/hallucinations/over_here3.ogg"), 0, 1, 75]))])], false);
				rt.modField(f, rt.gv(f, "client", rt.fv(f, "current", live(B))), "images", rt.gl("blood_target_image"), add);
			}
		}
		rt.endFor(f, 0);
		yield* g.callName(f, rt.fv(f, "owner", rt.sv(f, "attached_action")), "update_action_buttons_icon", []);
		yield* g.srcCall(f, "remove_ranged_ability", "<span class='cult'>The marking rite is complete! It will last for 90 seconds.</span>");
		rt.setGl("blood_target_reset_timer", (yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/reset_blood_target")])), 900, 8])));
		return 1;
	}
	return 0;
}, true, { args: ["caller", "params", "target"] });

// /proc/reset_blood_target  (code/game/gamemodes/cult/cult_comms.dm:291)  may sleep
rt.def("/proc/reset_blood_target", function* reset_blood_target(f: Frame) {
	let B: Value = null;
	let $e: any;
	f.vars = () => [B, $e];
	B = null;
	rt.forList(f, 0, rt.gv(f, "cult", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		if (((truthy(rt.fv(f, "current", live(B))) && !isEqual(rt.gv(f, "stat", rt.fv(f, "current", live(B))), 2)) && truthy(rt.gv(f, "client", rt.fv(f, "current", live(B)))))) {
			if (truthy(rt.gl("blood_target"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(B)), "<span class='cultlarge'><b>The blood mark has expired!</b></span>"]);
			}
			(rt.modField(f, rt.gv(f, "client", rt.fv(f, "current", live(B))), "images", rt.gl("blood_target_image"), subtract));
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [rt.gl("blood_target_image")]);
	rt.setGl("blood_target_image", null);
	rt.setGl("blood_target", null);
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

// /datum/action/innate/cult/master/pulse/proc/New  (code/game/gamemodes/cult/cult_comms.dm:316)  may sleep
rt.def("/datum/action/innate/cult/master/pulse/proc/New", function* New(f: Frame) {
	rt.setSv(f, "PM", (yield* g.new_(f, T("/obj/effect/proc_holder/pulse"), [])));
	rt.setFv(f, "attached_action", rt.sv(f, "PM"), live(f.src));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /datum/action/innate/cult/master/pulse/proc/IsAvailable  (code/game/gamemodes/cult/cult_comms.dm:321)
rt.def("/datum/action/innate/cult/master/pulse/proc/IsAvailable", function IsAvailable(f: Frame) {
	if ((!truthy(rt.fv(f, "mind", rt.sv(f, "owner"))) || !truthy(rt.callName(f, rt.fv(f, "mind", rt.sv(f, "owner")), "has_antag_datum", [T("/datum/antagonist/cult/master")])))) {
		return 0;
	}
	if (rt.gt(rt.sv(f, "cooldown"), rt.worldTime(f))) {
		if (!truthy(rt.fv(f, "active", rt.sv(f, "PM")))) {
			rt.op(f, "OutputReference", [rt.R.srcVar("owner")], [fmt("<span class='cultlarge'><b>You need to wait ＀ seconds before you can pulse again!</b></span>", [rt.call(f, P("/proc/round"), null, [multiply(subtract(rt.sv(f, "cooldown"), rt.worldTime(f)), 0.10000000149011612)])])], false);
		}
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

// /datum/action/innate/cult/master/pulse/proc/Destroy  (code/game/gamemodes/cult/cult_comms.dm:330)  may sleep
rt.def("/datum/action/innate/cult/master/pulse/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "PM")]);
	rt.setSv(f, "PM", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/action/innate/cult/master/pulse/proc/Activate  (code/game/gamemodes/cult/cult_comms.dm:334)  may sleep
rt.def("/datum/action/innate/cult/master/pulse/proc/Activate", function* Activate(f: Frame) {
	yield* g.callName(f, rt.sv(f, "PM"), "toggle", [rt.sv(f, "owner")]);
	return 1;
}, true);

rt.type(11270, "/obj/effect/proc_holder/pulse", "/obj/effect/proc_holder", {
	attached_action: null,
	active: 0,
	ranged_mousepointer: rt.rsc("icons/effects/throw_target.dmi"),
});

// /obj/effect/proc_holder/pulse/proc/Destroy  (code/game/gamemodes/cult/cult_comms.dm:343)  may sleep
rt.def("/obj/effect/proc_holder/pulse/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "attached_action")]);
	rt.setSv(f, "attached_action", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/effect/proc_holder/pulse/proc/toggle  (code/game/gamemodes/cult/cult_comms.dm:348)  may sleep
rt.def("/obj/effect/proc_holder/pulse/proc/toggle", function* toggle(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "active"))) {
		yield* g.srcCall(f, "remove_ranged_ability", "<span class='cult'>You cease your preparations...</span>");
		rt.setFv(f, "throwing", rt.sv(f, "attached_action"), 0);
	} else {
		yield* g.srcCall(f, "add_ranged_ability", live(user), "<span class='cult'>You prepare to tear through the fabric of reality...</span>");
	}
	return f.dot;
}, true);

// /obj/effect/proc_holder/pulse/proc/InterceptClickOn  (code/game/gamemodes/cult/cult_comms.dm:354)  may sleep
rt.def("/obj/effect/proc_holder/pulse/proc/InterceptClickOn", function* InterceptClickOn(f: Frame) {
	let _T: Value = null, distance: Value = null;
	f.vars = () => [_T, distance];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, rt.sv(f, "ranged_ability_user"), "incapacitated", [])))) {
		yield* g.srcCall(f, "remove_ranged_ability");
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [(_T = rt.getStep(f, rt.sv(f, "ranged_ability_user"), 0))])))) {
		return 0;
	}
	if (!truthy((rt.isIn(f, live(f.args[2]), (yield* g.call(f, P("/proc/view"), null, [7, rt.getStep(f, rt.sv(f, "ranged_ability_user"), 0)]))) ? 1 : 0))) return f.dot;
	if (((!(truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(f.args[2])]))) || truthy((rt.istype(live(f.args[2]), T("/obj/structure/destructible/cult")) ? 1 : 0))) || isEqual(live(f.args[2]), live(f.args[0]))) && !truthy(rt.fv(f, "throwing", rt.sv(f, "attached_action"))))) {
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "throwing", rt.sv(f, "attached_action")))) {
		rt.setFv(f, "throwing", rt.sv(f, "attached_action"), 1);
		rt.setFv(f, "throwee", rt.sv(f, "attached_action"), live(f.args[2]));
		rt.op(f, "OutputReference", [rt.R.srcVar("ranged_ability_user")], [rt.rsc("sound/weapons/thudswoosh.ogg")], false);
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "ranged_ability_user"), fmt("<span class='cult'><b>You reach through the veil with your mind's eye and seize ＀!</b></span>", [live(f.args[2])])]);
		return live(f.dot);
	} else {
		yield* g.new_(f, T("/obj/effect/temp_visual/cult/sparks"), [rt.getStep(f, rt.fv(f, "throwee", rt.sv(f, "attached_action")), 0), rt.fv(f, "dir", rt.sv(f, "ranged_ability_user"))]);
		if (rt.ge((distance = (yield* g.call(f, P("/proc/get_dist"), null, [rt.fv(f, "throwee", rt.sv(f, "attached_action")), live(f.args[2])]))), 16)) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/playsound"), null, [live(f.args[2]), rt.rsc("sound/magic/exit_blood.ogg")]);
		yield* g.callName(f, rt.fv(f, "throwee", rt.sv(f, "attached_action")), "Beam", [null, live(f.args[2]), "icon_state", "sendbeam", "time", 4], rt.Args.Named);
		yield* g.callName(f, rt.fv(f, "throwee", rt.sv(f, "attached_action")), "forceMove", [rt.getStep(f, live(f.args[2]), 0)]);
		yield* g.new_(f, T("/obj/effect/temp_visual/cult/sparks"), [rt.getStep(f, live(f.args[2]), 0), rt.fv(f, "dir", rt.sv(f, "ranged_ability_user"))]);
		rt.setFv(f, "throwing", rt.sv(f, "attached_action"), 0);
		rt.setFv(f, "cooldown", rt.sv(f, "attached_action"), add(rt.worldTime(f), rt.fv(f, "base_cooldown", rt.sv(f, "attached_action"))));
		yield* g.srcCall(f, "remove_mousepointer", rt.fv(f, "client", rt.sv(f, "ranged_ability_user")));
		yield* g.srcCall(f, "remove_ranged_ability", fmt("<span class='cult'>A pulse of blood magic surges through you as you shift ＀ through time and space.</span>", [rt.fv(f, "throwee", rt.sv(f, "attached_action"))]));
		yield* g.callName(f, live(f.args[0]), "update_action_buttons_icon", []);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.args[0]), P("/mob/proc/update_action_buttons_icon")])), rt.fv(f, "base_cooldown", rt.sv(f, "attached_action"))]);
	}
	return f.dot;
}, true, { args: ["caller", "params", "target"] });
