// From code/game/gamemodes/miniantags/slaughter/slaughter.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5047, "/mob/living/simple_animal/slaughter", "/mob/living/simple_animal", {
	feast_sound: rt.rsc("sound/magic/demon_consume.ogg"),
	boost: 0,
	playstyle_string: "<B><font size=3 color='red'>You are a slaughter demon,</font> a terrible creature from another realm. You have a single desire: To kill.  You may use the \"Blood Crawl\" ability near blood pools to travel through them, appearing and disappearing from the station at will. Pulling a dead or unconscious mob while you enter a pool will pull them in with you, allowing you to feast and regain your health. You move quickly upon leaving a pool of blood, but the material world will soon sap your strength and leave you sluggish. </B>",
	name: "slaughter demon",
	real_name: "slaughter demon",
	desc: "A large, menacing creature covered in armored black scales.",
	speak_emote: null,
	emote_hear: null,
	response_help: "thinks better of touching",
	response_disarm: "flails at",
	response_harm: "punches",
	icon: rt.rsc("icons/mob/mob.dmi"),
	icon_state: "daemon",
	icon_living: "daemon",
	speed: 1,
	a_intent: "harm",
	stop_automated_movement: 1,
	status_flags: 8,
	attack_sound: rt.rsc("sound/magic/demon_attack1.ogg"),
	death_sound: rt.rsc("sound/magic/demon_dies.ogg"),
	atmos_requirements: null,
	minbodytemp: 0,
	maxbodytemp: 1e+31,
	faction: null,
	attacktext: "wildly tears into",
	maxHealth: 200,
	health: 200,
	healable: 0,
	environment_smash: 1,
	obj_damage: 50,
	melee_damage_lower: 30,
	melee_damage_upper: 30,
	see_in_dark: 8,
	lighting_alpha: 128,
	bloodcrawl: 2,
	loot: null,
	del_on_death: 1,
	deathmessage: "screams in anger as it collapses into a puddle of viscera!",
});

// /mob/living/simple_animal/slaughter/proc/<init>  (code/game/gamemodes/miniantags/slaughter/slaughter.dm:7)
rt.def("/mob/living/simple_animal/slaughter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak_emote", rt.list("gurgles"));
	rt.setSv(f, "emote_hear", rt.list("wails", "screeches"));
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("slaughter"));
	$0 = $0;
	rt.setSv(f, "loot", rt.list(T("/obj/effect/decal/cleanable/blood"), T("/obj/effect/decal/cleanable/blood/innards"), T("/obj/item/organ/heart/demon")));
	return f.dot;
});

// /mob/living/simple_animal/slaughter/proc/Initialize  (code/game/gamemodes/miniantags/slaughter/slaughter.dm:50)  may sleep
rt.def("/mob/living/simple_animal/slaughter/proc/Initialize", function* Initialize(f: Frame) {
	let bloodspell: Value = null;
	f.vars = () => [bloodspell];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "AddSpell", (bloodspell = (yield* g.new_(f, T("/obj/effect/proc_holder/spell/bloodcrawl"), []))));
	if (!truthy((rt.istype(rt.sv(f, "loc"), T("/obj/effect/dummy/slaughter")) ? 1 : 0))) return f.dot;
	rt.setFv(f, "phased", live(bloodspell), 1);
	return f.dot;
}, true);

// /mob/living/simple_animal/slaughter/proc/Life  (code/game/gamemodes/miniantags/slaughter/slaughter.dm:57)
rt.def("/mob/living/simple_animal/slaughter/proc/Life", function Life(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (rt.lt(rt.sv(f, "boost"), rt.worldTime(f))) {
		rt.setSv(f, "speed", 1);
	} else {
		rt.setSv(f, "speed", 0);
	}
	return f.dot;
}, false, { waitfor: false });

rt.type(11708, "/obj/effect/decal/cleanable/blood/innards", "/obj/effect/decal/cleanable/blood", {
	icon: rt.rsc("icons/obj/surgery.dmi"),
	name: "pile of viscera",
	desc: "A repulsive pile of guts and gore.",
	gender: "neuter",
	random_icon_states: null,
});

// /obj/effect/decal/cleanable/blood/innards/proc/<init>  (code/game/gamemodes/miniantags/slaughter/slaughter.dm:68)
rt.def("/obj/effect/decal/cleanable/blood/innards/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", rt.list("innards"));
	return f.dot;
});

// /mob/living/simple_animal/slaughter/proc/phasein  (code/game/gamemodes/miniantags/slaughter/slaughter.dm:71)  may sleep
rt.def("/mob/living/simple_animal/slaughter/proc/phasein", function* phasein(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "speed", 0);
	rt.setSv(f, "boost", add(rt.worldTime(f), 60));
	return f.dot;
}, true);

rt.type(9454, "/obj/item/organ/heart/demon", "/obj/item/organ/heart", {
	name: "demon heart",
	desc: "Still it beats furiously, emanating an aura of utter hate.",
	icon: rt.rsc("icons/obj/surgery.dmi"),
	icon_state: "demon_heart-on",
	origin_tech: "combat=5;biotech=7",
});

// /obj/item/organ/heart/demon/proc/attack  (code/game/gamemodes/miniantags/slaughter/slaughter.dm:88)  may sleep
rt.def("/obj/item/organ/heart/demon/proc/attack", function* attack(f: Frame) {
	let knownspell: Value = null;
	let $e: any;
	f.vars = () => [knownspell, $e];
	if (!isEqual(live(f.args[0]), live(f.args[1]))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ raises ＀ to their mouth and tears into it with their teeth!</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='danger'>An unnatural hunger consumes you. You raise ＀ your mouth and devour it!</span>", [live(f.src)])]);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.args[1]), rt.rsc("sound/magic/demon_consume.ogg"), 50, 1]);
	knownspell = null;
	rt.forList(f, 0, rt.gv(f, "spell_list", rt.fv(f, "mind", live(f.args[1]))), T("/obj/effect/proc_holder/spell"));
	while (($e = rt.next(f, 0)) !== undefined) {
		knownspell = $e;
		if (isEqual(rt.fv(f, "type", live(knownspell)), T("/obj/effect/proc_holder/spell/bloodcrawl"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>...and you don't feel any different.</span>"]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀'s eyes flare a deep crimson!</span>", [live(f.args[1])]), "<span class='userdanger'>You feel a strange power seep into your body... you have absorbed the demon's blood-travelling powers!</span>"]);
	yield* g.callName(f, live(f.args[1]), "drop_item", []);
	yield* g.callName(f, live(f.src), "Insert", [live(f.args[1])]);
	return f.dot;
}, true, { args: ["M", "user", "target"] });

// /obj/item/organ/heart/demon/proc/Insert  (code/game/gamemodes/miniantags/slaughter/slaughter.dm:104)  may sleep
rt.def("/obj/item/organ/heart/demon/proc/Insert", function* Insert(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.fv(f, "mind", live(f.args[0])))) return f.dot;
	yield* g.callName(f, rt.fv(f, "mind", live(f.args[0])), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/bloodcrawl"), [null]))]);
	return f.dot;
}, true, { args: ["M", "special"] });

// /obj/item/organ/heart/demon/proc/Remove  (code/game/gamemodes/miniantags/slaughter/slaughter.dm:109)  may sleep
rt.def("/obj/item/organ/heart/demon/proc/Remove", function* Remove(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.fv(f, "mind", live(f.args[0])))) return f.dot;
	yield* g.callName(f, rt.fv(f, "mind", live(f.args[0])), "RemoveSpell", [T("/obj/effect/proc_holder/spell/bloodcrawl")]);
	return f.dot;
}, true, { args: ["M", "special"] });

rt.type(5048, "/mob/living/simple_animal/slaughter/laughter", "/mob/living/simple_animal/slaughter", {
	consumed_mobs: null,
	feast_sound: rt.rsc("sound/spookoween/scary_horn2.ogg"),
	playstyle_string: "<B><font size=3 color='red'>You are a laughter demon,</font> a wonderful creature from another realm. You have a single desire: <span class='clown'>To hug and tickle.</span><BR>You may use the \"Blood Crawl\" ability near blood pools to travel through them, appearing and disappearing from the station at will. Pulling a dead or unconscious mob while you enter a pool will pull them in with you, allowing you to hug them and regain your health.<BR> You move quickly upon leaving a pool of blood, but the material world will soon sap your strength and leave you sluggish.<BR>What makes you a little sad is that people seem to die when you tickle them; but don't worry! When you die, everyone you hugged will be released and fully healed, because in the end it's just a jape, sibling!</B>",
	name: "laughter demon",
	real_name: "laughter demon",
	desc: "A large, adorable creature covered in armor with pink bows.",
	speak_emote: null,
	emote_hear: null,
	response_help: "hugs",
	attacktext: "wildly tickles",
	attack_sound: rt.rsc("sound/items/bikehorn.ogg"),
	death_sound: rt.rsc("sound/misc/sadtrombone.ogg"),
	icon_state: "bowmon",
	icon_living: "bowmon",
	deathmessage: "fades out, as all of its friends are released from its prison of hugs.",
	loot: null,
});

// /mob/living/simple_animal/slaughter/laughter/proc/<init>  (code/game/gamemodes/miniantags/slaughter/slaughter.dm:138)
rt.def("/mob/living/simple_animal/slaughter/laughter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "consumed_mobs", rt.list());
	rt.setSv(f, "speak_emote", rt.list("giggles", "titters", "chuckles"));
	rt.setSv(f, "emote_hear", rt.list("guffaws", "laughs"));
	$0 = $0;
	rt.setSv(f, "loot", rt.list(T("/mob/living/simple_animal/pet/cat/kitten")));
	return f.dot;
});

// /mob/living/simple_animal/slaughter/laughter/proc/Destroy  (code/game/gamemodes/miniantags/slaughter/slaughter.dm:155)  may sleep
rt.def("/mob/living/simple_animal/slaughter/laughter/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.srcCall(f, "release_friends");
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /mob/living/simple_animal/slaughter/laughter/proc/ex_act  (code/game/gamemodes/miniantags/slaughter/slaughter.dm:159)  may sleep
rt.def("/mob/living/simple_animal/slaughter/laughter/proc/ex_act", function* ex_act(f: Frame, severity: Value) {
	let $0: any;
	f.vars = () => [severity, $0];
	$0 = live(severity);
	if ($0 === 1) {
		yield* g.srcCall(f, "death");
	} else if ($0 === 2) {
		yield* g.srcCall(f, "adjustBruteLoss", 60);
	} else if ($0 === 3) {
		yield* g.srcCall(f, "adjustBruteLoss", 30);
	}
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/slaughter/laughter/proc/release_friends  (code/game/gamemodes/miniantags/slaughter/slaughter.dm:168)  may sleep
rt.def("/mob/living/simple_animal/slaughter/laughter/proc/release_friends", function* release_friends(f: Frame) {
	let M: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [M, _T, $e];
	if (!truthy(rt.sv(f, "consumed_mobs"))) {
		return live(f.dot);
	}
	M = null;
	rt.forList(f, 0, rt.sv(f, "consumed_mobs"), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (!truthy(live(M))) {
			continue;
		}
		if (!truthy((_T = (yield* g.call(f, P("/proc/find_safe_turf"), null, []))))) {
			_T = rt.getStep(f, live(f.src), 0);
		}
		yield* g.callName(f, live(M), "forceMove", [live(_T)]);
		if (truthy((yield* g.callName(f, live(M), "revive", ["full_heal", 1, "admin_revive", 1], rt.Args.Named)))) {
			yield* g.callName(f, live(M), "grab_ghost", ["force", 1], rt.Args.Named);
			yield* g.call(f, P("/proc/playsound"), null, [live(_T), rt.sv(f, "feast_sound"), 50, 1, -1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='clown'>You leave ＀'s warm embrace,\tand feel ready to take on the world.</span>", [live(f.src)])]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/simple_animal/slaughter/laughter/proc/bloodcrawl_swallow  (code/game/gamemodes/miniantags/slaughter/slaughter.dm:186)  may sleep
rt.def("/mob/living/simple_animal/slaughter/laughter/proc/bloodcrawl_swallow", function* bloodcrawl_swallow(f: Frame, victim: Value) {
	f.vars = () => [victim];
	if (truthy(rt.sv(f, "consumed_mobs"))) {
		rt.modSrcVar(f, "consumed_mobs", live(victim), add);
	} else {
		yield* g.callName(f, live(victim), "forceMove", [rt.getStep(f, live(victim), 0)]);
		yield* g.callName(f, live(victim), "exit_blood_effect", []);
		yield* g.callName(f, live(victim), "visible_message", [fmt("＀ falls out of the air, covered in blood, looking highly confused. And dead.", [live(victim)])]);
	}
	return f.dot;
}, true);
