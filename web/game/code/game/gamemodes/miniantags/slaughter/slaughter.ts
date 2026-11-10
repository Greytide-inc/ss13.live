// Based on /tg/station's code/game/gamemodes/miniantags/slaughter/slaughter.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// slaughter.dm:7
rt.def("/mob/living/simple_animal/slaughter/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak_emote = list("gurgles");
	this.emote_hear = list("wails", "screeches");
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);

	this.faction = list("slaughter");

	this.loot = list(T("/obj/effect/decal/cleanable/blood"), T("/obj/effect/decal/cleanable/blood/innards"), T("/obj/item/organ/heart/demon"));
	return f.dot;
});

// slaughter.dm:50
rt.def("/mob/living/simple_animal/slaughter/proc/Initialize", function* Initialize(f: Frame) {
	let bloodspell: Value = null;
	yield* parent_proc();
	yield* this.AddSpell((bloodspell = (yield* new_(T("/obj/effect/proc_holder/spell/bloodcrawl")))));
	if (!rt.istype(this.loc, T("/obj/effect/dummy/slaughter"))) return f.dot;
	bloodspell.phased = 1;
	return f.dot;
}, true);

// slaughter.dm:57
rt.def("/mob/living/simple_animal/slaughter/proc/Life", function Life(f: Frame) {
	parent_proc();
	if (this.boost < rt.worldTime(f)) {
		this.speed = 1;
	} else {
		this.speed = 0;
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

// slaughter.dm:68
rt.def("/obj/effect/decal/cleanable/blood/innards/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.random_icon_states = list("innards");
	return f.dot;
});

// slaughter.dm:71
rt.def("/mob/living/simple_animal/slaughter/proc/phasein", function* phasein(f: Frame) {
	f.dot = (yield* parent_proc());
	this.speed = 0;
	this.boost = rt.worldTime(f) + 60;
	return f.dot;
}, true);

rt.type(9454, "/obj/item/organ/heart/demon", "/obj/item/organ/heart", {
	name: "demon heart",
	desc: "Still it beats furiously, emanating an aura of utter hate.",
	icon: rt.rsc("icons/obj/surgery.dmi"),
	icon_state: "demon_heart-on",
	origin_tech: "combat=5;biotech=7",
});

// slaughter.dm:88
rt.def("/obj/item/organ/heart/demon/proc/attack", function* attack(f: Frame, M: Value, user: Value, target: Value) {
	let knownspell: Value = null;
	if (M != user) {
		return (yield* parent_proc());
	}
	user.visible_message(`<span class='warning'>${user} raises ${this} to their mouth and tears into it with their teeth!</span>`, `<span class='danger'>An unnatural hunger consumes you. You raise ${this} your mouth and devour it!</span>`);
	playsound(user, rt.rsc("sound/magic/demon_consume.ogg"), 50, 1);
	for (knownspell of each(user.mind.spell_list, T("/obj/effect/proc_holder/spell"))) {
		if (knownspell.type == T("/obj/effect/proc_holder/spell/bloodcrawl")) {
			to_chat(user, "<span class='warning'>...and you don't feel any different.</span>");
			yield* qdel(this);
			return f.dot;
		}
	}
	user.visible_message(`<span class='warning'>${user}'s eyes flare a deep crimson!</span>`, "<span class='userdanger'>You feel a strange power seep into your body... you have absorbed the demon's blood-travelling powers!</span>");
	yield* user.drop_item();
	yield* this.Insert(user);
	return f.dot;
}, true);

// slaughter.dm:104
rt.def("/obj/item/organ/heart/demon/proc/Insert", function* Insert(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	if (!f.args[0].mind) return f.dot;
	yield* f.args[0].mind.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/bloodcrawl"), null)));
	return f.dot;
}, true, { args: ["M", "special"] });

// slaughter.dm:109
rt.def("/obj/item/organ/heart/demon/proc/Remove", function* Remove(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	if (!f.args[0].mind) return f.dot;
	yield* f.args[0].mind.RemoveSpell(T("/obj/effect/proc_holder/spell/bloodcrawl"));
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

// slaughter.dm:138
rt.def("/mob/living/simple_animal/slaughter/laughter/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.consumed_mobs = list();
	this.speak_emote = list("giggles", "titters", "chuckles");
	this.emote_hear = list("guffaws", "laughs");

	this.loot = list(T("/mob/living/simple_animal/pet/cat/kitten"));
	return f.dot;
});

// slaughter.dm:155
rt.def("/mob/living/simple_animal/slaughter/laughter/proc/Destroy", function* Destroy(f: Frame) {
	yield* this.release_friends();
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// slaughter.dm:159
rt.def("/mob/living/simple_animal/slaughter/laughter/proc/ex_act", function* ex_act(f: Frame, severity: Value) {
	if (severity === 1) {
		yield* this.death();
	} else if (severity === 2) {
		yield* this.adjustBruteLoss(60);
	} else if (severity === 3) {
		yield* this.adjustBruteLoss(30);
	}
	return f.dot;
}, true, { waitfor: false });

// slaughter.dm:168
rt.def("/mob/living/simple_animal/slaughter/laughter/proc/release_friends", function* release_friends(f: Frame) {
	let M: Value = null, _T: Value = null;
	if (!this.consumed_mobs) {
		return f.dot;
	}
	for (M of each(this.consumed_mobs, T("/mob/living"))) {
		if (!M) {
			continue;
		}
		if (!(_T = find_safe_turf())) {
			_T = rt.getStep(f, this, 0);
		}
		yield* M.forceMove(_T);
		if (yield* M.revive({ full_heal: 1, admin_revive: 1 })) {
			yield* M.grab_ghost({ force: 1 });
			playsound(_T, this.feast_sound, 50, 1, -1);
			to_chat(M, `<span class='clown'>You leave ${this}'s warm embrace,\tand feel ready to take on the world.</span>`);
		}
	}
	return f.dot;
}, true);

// slaughter.dm:186
rt.def("/mob/living/simple_animal/slaughter/laughter/proc/bloodcrawl_swallow", function* bloodcrawl_swallow(f: Frame, victim: Value) {
	if (this.consumed_mobs) {
		this.consumed_mobs += victim;
	} else {
		yield* victim.forceMove(rt.getStep(f, victim, 0));
		victim.exit_blood_effect();
		victim.visible_message(`${victim} falls out of the air, covered in blood, looking highly confused. And dead.`);
	}
	return f.dot;
}, true);
