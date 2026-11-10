// Based on /tg/station's code/modules/surgery/organs/tongue.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(9523, "/obj/item/organ/tongue", "/obj/item/organ", {
	languages_possible: null,
	say_mod: null,
	taste_sensitivity: 15,
	zone: "mouth",
	slot: "tongue",
	name: "tongue",
	desc: "A fleshy muscle mostly used for lying.",
	icon_state: "tonguenormal",
	attack_verb: null,
});

// tongue.dm:13
rt.def("/obj/item/organ/tongue/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	f.dot = (yield* parent_proc());
	this.languages_possible = typecacheof(list(T("/datum/language/common"), T("/datum/language/draconic"), T("/datum/language/codespeak"), T("/datum/language/monkey"), T("/datum/language/narsie"), T("/datum/language/beachbum"), T("/datum/language/ratvar")));
	return f.dot;
}, true);

// tongue.dm:25
rt.def("/obj/item/organ/tongue/proc/get_spans", function get_spans(f: Frame) {
	return list();
});

// tongue.dm:31
rt.def("/obj/item/organ/tongue/proc/Insert", function* Insert(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	if (!(this.say_mod && f.args[0].dna && f.args[0].dna.species)) return f.dot;
	f.args[0].dna.species.say_mod = this.say_mod;
	return f.dot;
}, true, { args: ["M", "special"] });

// tongue.dm:36
rt.def("/obj/item/organ/tongue/proc/Remove", function* Remove(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	if (!(this.say_mod && f.args[0].dna && f.args[0].dna.species)) return f.dot;
	f.args[0].dna.species.say_mod = rt.initial(f, f.args[0].dna.species, "say_mod");
	return f.dot;
}, true, { args: ["M", "special"] });

// tongue.dm:41
rt.def("/obj/item/organ/tongue/proc/could_speak_in_language", function could_speak_in_language(f: Frame, dt: Value) {
	f.dot = is_type_in_typecache(dt, this.languages_possible);
	return f.dot;
});

rt.type(9524, "/obj/item/organ/tongue/lizard", "/obj/item/organ/tongue", {
	say_mod: "hisses",
	taste_sensitivity: 10,
	name: "forked tongue",
	desc: "A thin and long muscle typically found in reptilian races, apparently moonlights as a nose.",
	icon_state: "tonguelizard",
});

// tongue.dm:51
rt.def("/obj/item/organ/tongue/lizard/proc/TongueSpeech", function TongueSpeech(f: Frame, message: Value) {
	let lizard_hiss: Value = new_(T("/regex"), "s+", "g");
	let lizard_hiSS: Value = new_(T("/regex"), "S+", "g");
	if (copytext(message, 1, 2) != "*") {
		message = lizard_hiss.Replace(message, "sss");
		message = lizard_hiSS.Replace(message, "SSS");
	}
	return message;
});

rt.type(9525, "/obj/item/organ/tongue/fly", "/obj/item/organ/tongue", {
	say_mod: "buzzes",
	taste_sensitivity: 25,
	name: "proboscis",
	desc: "A freakish looking meat tube that apparently can take in liquids.",
	icon_state: "tonguefly",
});

// tongue.dm:66
rt.def("/obj/item/organ/tongue/fly/proc/TongueSpeech", function TongueSpeech(f: Frame, message: Value) {
	let fly_buzz: Value = new_(T("/regex"), "z+", "g");
	let fly_buZZ: Value = new_(T("/regex"), "Z+", "g");
	if (copytext(message, 1, 2) != "*") {
		message = fly_buzz.Replace(message, "zzz");
		message = fly_buZZ.Replace(message, "ZZZ");
	}
	return message;
});

rt.type(9526, "/obj/item/organ/tongue/abductor", "/obj/item/organ/tongue", {
	say_mod: "gibbers",
	taste_sensitivity: 101,
	name: "superlingual matrix",
	desc: "A mysterious structure that allows for instant communication between users. Pretty impressive until you need to eat something.",
	icon_state: "tongueayylmao",
});

// tongue.dm:82
rt.def("/obj/item/organ/tongue/abductor/proc/TongueSpeech", function TongueSpeech(f: Frame, message: Value) {
	let H: Value = null, _T: Value = null, Ayy: Value = null, Byy: Value = null, M: Value = null, link: Value = null;
	let user: Value = f.usr;
	let rendered: Value = `<span class='abductor'><b>${user.name}:</b> ${message}</span>`;
	for (H of each(GLOB.living_mob_list, T("/mob/living/carbon/human"))) {
		if (!(_T = H.getorganslot("tongue")) || _T.type != this.type) {
			continue;
		}
		if (H.dna && H.dna.species.id == "abductor" && user.dna && user.dna.species.id == "abductor") {
			Ayy = user.dna.species;
			Byy = H.dna.species;
			if (Ayy.team != Byy.team) {
				continue;
			}
		}
		to_chat(H, rendered);
	}
	for (M of each(GLOB.dead_mob_list, T("/mob"))) {
		link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [M, user]);
		to_chat(M, `${link} ${rendered}`);
	}
	return "";
});

rt.type(9527, "/obj/item/organ/tongue/zombie", "/obj/item/organ/tongue", {
	say_mod: "moans",
	taste_sensitivity: 32,
	name: "rotting tongue",
	desc: "Between the decay and the fact that it's just lying there you doubt a tongue has ever seemed less sexy.",
	icon_state: "tonguezombie",
});

// tongue.dm:107
rt.def("/obj/item/organ/tongue/zombie/proc/TongueSpeech", function TongueSpeech(f: Frame, message: Value) {
	let insertpos: Value = null, inserttext: Value = null;
	let message_list: Value = splittext(message, " ");
	let maxchanges: Value = max(round(rt.len(f, message_list) / 1.5), 2);
	let i: Value = rand(maxchanges / 2, maxchanges);
	while (i > 0) {
		insertpos = rand(1, rt.len(f, message_list) - 1);
		if (copytext((inserttext = rt.index(message_list, insertpos)), rt.length(inserttext) - 2) != "...") {
			rt.setAt(message_list, insertpos, inserttext + "...");
		}
		if (prob(20) && rt.len(f, message_list) > 3) {
			message_list.Insert(insertpos, `${pick("BRAINS", "Brains", "Braaaiinnnsss", "BRAAAIIINNSSS")}...`);
		}
		i--;
	}
	return jointext(message_list, " ");
});

rt.type(9528, "/obj/item/organ/tongue/alien", "/obj/item/organ/tongue", {
	say_mod: "hisses",
	taste_sensitivity: 10,
	name: "alien tongue",
	desc: "According to leading xenobiologists the evolutionary benefit of having a second mouth in your mouth is \"that it looks badass\".",
	icon_state: "tonguexeno",
});

// tongue.dm:130
rt.def("/obj/item/organ/tongue/alien/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	f.dot = (yield* parent_proc());
	this.languages_possible = typecacheof(list(T("/datum/language/xenocommon"), T("/datum/language/common"), T("/datum/language/draconic"), T("/datum/language/ratvar"), T("/datum/language/monkey")));
	return f.dot;
}, true);

// tongue.dm:139
rt.def("/obj/item/organ/tongue/alien/proc/TongueSpeech", function TongueSpeech(f: Frame, message: Value) {
	playsound(this.owner, "hiss", 25, 1, 1);
	return message;
});

rt.type(9529, "/obj/item/organ/tongue/bone", "/obj/item/organ/tongue", {
	chattering: 0,
	phomeme_type: "sans",
	phomeme_types: null,
	say_mod: "rattles",
	taste_sensitivity: 101,
	name: "bone \"tongue\"",
	desc: "Apparently skeletons alter the sounds they produce through oscillation of their teeth, hence their characteristic rattling.",
	icon_state: "tonguebone",
	attack_verb: null,
});

// tongue.dm:155
rt.def("/obj/item/organ/tongue/bone/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.phomeme_type = pick(this.phomeme_types);
	return f.dot;
}, true);

// tongue.dm:159
rt.def("/obj/item/organ/tongue/bone/proc/TongueSpeech", function TongueSpeech(f: Frame, message: Value) {
	f.dot = message;
	if (!this.chattering) return f.dot;
	chatter(message, this.phomeme_type, f.usr);
	return f.dot;
});

// tongue.dm:166
rt.def("/obj/item/organ/tongue/bone/proc/get_spans", function get_spans(f: Frame) {
	f.dot = parent_proc();
	if (this.phomeme_type === "sans") {
		(f.dot = rt.modify(f.dot, "sans", rt.bitOr));
	} else if (this.phomeme_type === "papyrus") {
		(f.dot = rt.modify(f.dot, "papyrus", rt.bitOr));
	}
	return f.dot;
});

rt.type(9531, "/obj/item/organ/tongue/robot", "/obj/item/organ/tongue", {
	status: 2,
	say_mod: "states",
	taste_sensitivity: 25,
	name: "robotic voicebox",
	desc: "A voice synthesizer that can interface with organic lifeforms.",
	icon_state: "tonguerobot",
	attack_verb: null,
});

// tongue.dm:195
rt.def("/obj/item/organ/tongue/robot/proc/get_spans", function get_spans(f: Frame) {
	return rt.bitOr(parent_proc(), "robot");
});
