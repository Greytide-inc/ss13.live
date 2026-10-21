// From code/modules/surgery/organs/tongue.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/item/organ/tongue/proc/Initialize  (code/modules/surgery/organs/tongue.dm:13)  may sleep
rt.def("/obj/item/organ/tongue/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "languages_possible", (yield* g.call(f, P("/proc/typecacheof"), null, [rt.list(T("/datum/language/common"), T("/datum/language/draconic"), T("/datum/language/codespeak"), T("/datum/language/monkey"), T("/datum/language/narsie"), T("/datum/language/beachbum"), T("/datum/language/ratvar"))])));
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/item/organ/tongue/proc/get_spans  (code/modules/surgery/organs/tongue.dm:25)
rt.def("/obj/item/organ/tongue/proc/get_spans", function get_spans(f: Frame) {
	return rt.list();
});

// /obj/item/organ/tongue/proc/Insert  (code/modules/surgery/organs/tongue.dm:31)  may sleep
rt.def("/obj/item/organ/tongue/proc/Insert", function* Insert(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!((truthy(rt.sv(f, "say_mod")) && truthy(rt.fv(f, "dna", live(f.args[0])))) && truthy(rt.gv(f, "species", rt.fv(f, "dna", live(f.args[0])))))) return f.dot;
	rt.setFv(f, "say_mod", rt.gv(f, "species", rt.fv(f, "dna", live(f.args[0]))), rt.sv(f, "say_mod"));
	return f.dot;
}, true, { args: ["M", "special"] });

// /obj/item/organ/tongue/proc/Remove  (code/modules/surgery/organs/tongue.dm:36)  may sleep
rt.def("/obj/item/organ/tongue/proc/Remove", function* Remove(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!((truthy(rt.sv(f, "say_mod")) && truthy(rt.fv(f, "dna", live(f.args[0])))) && truthy(rt.gv(f, "species", rt.fv(f, "dna", live(f.args[0])))))) return f.dot;
	rt.setFv(f, "say_mod", rt.gv(f, "species", rt.fv(f, "dna", live(f.args[0]))), rt.initial(f, rt.gv(f, "species", rt.fv(f, "dna", live(f.args[0]))), "say_mod"));
	return f.dot;
}, true, { args: ["M", "special"] });

// /obj/item/organ/tongue/proc/could_speak_in_language  (code/modules/surgery/organs/tongue.dm:41)
rt.def("/obj/item/organ/tongue/proc/could_speak_in_language", function could_speak_in_language(f: Frame, dt: Value) {
	f.dot = rt.call(f, P("/proc/is_type_in_typecache"), null, [live(dt), rt.sv(f, "languages_possible")]);
	return f.dot;
});

rt.type(9524, "/obj/item/organ/tongue/lizard", "/obj/item/organ/tongue", {
	say_mod: "hisses",
	taste_sensitivity: 10,
	name: "forked tongue",
	desc: "A thin and long muscle typically found in reptilian races, apparently moonlights as a nose.",
	icon_state: "tonguelizard",
});

// /obj/item/organ/tongue/lizard/proc/TongueSpeech  (code/modules/surgery/organs/tongue.dm:51)
rt.def("/obj/item/organ/tongue/lizard/proc/TongueSpeech", function TongueSpeech(f: Frame, message: Value) {
	let lizard_hiss: Value = null, lizard_hiSS: Value = null;
	f.vars = () => [message, lizard_hiss, lizard_hiSS];
	lizard_hiss = rt.new_(f, T("/regex"), ["s+", "g"]);
	lizard_hiSS = rt.new_(f, T("/regex"), ["S+", "g"]);
	if (!isEqual(rt.call(f, P("/proc/copytext"), null, [live(message), 1, 2]), "*")) {
		message = rt.callName(f, live(lizard_hiss), "Replace", [live(message), "sss"]);
		message = rt.callName(f, live(lizard_hiSS), "Replace", [live(message), "SSS"]);
	}
	return live(message);
});

rt.type(9525, "/obj/item/organ/tongue/fly", "/obj/item/organ/tongue", {
	say_mod: "buzzes",
	taste_sensitivity: 25,
	name: "proboscis",
	desc: "A freakish looking meat tube that apparently can take in liquids.",
	icon_state: "tonguefly",
});

// /obj/item/organ/tongue/fly/proc/TongueSpeech  (code/modules/surgery/organs/tongue.dm:66)
rt.def("/obj/item/organ/tongue/fly/proc/TongueSpeech", function TongueSpeech(f: Frame, message: Value) {
	let fly_buzz: Value = null, fly_buZZ: Value = null;
	f.vars = () => [message, fly_buzz, fly_buZZ];
	fly_buzz = rt.new_(f, T("/regex"), ["z+", "g"]);
	fly_buZZ = rt.new_(f, T("/regex"), ["Z+", "g"]);
	if (!isEqual(rt.call(f, P("/proc/copytext"), null, [live(message), 1, 2]), "*")) {
		message = rt.callName(f, live(fly_buzz), "Replace", [live(message), "zzz"]);
		message = rt.callName(f, live(fly_buZZ), "Replace", [live(message), "ZZZ"]);
	}
	return live(message);
});

rt.type(9526, "/obj/item/organ/tongue/abductor", "/obj/item/organ/tongue", {
	say_mod: "gibbers",
	taste_sensitivity: 101,
	name: "superlingual matrix",
	desc: "A mysterious structure that allows for instant communication between users. Pretty impressive until you need to eat something.",
	icon_state: "tongueayylmao",
});

// /obj/item/organ/tongue/abductor/proc/TongueSpeech  (code/modules/surgery/organs/tongue.dm:82)
rt.def("/obj/item/organ/tongue/abductor/proc/TongueSpeech", function TongueSpeech(f: Frame, message: Value) {
	let user: Value = null, rendered: Value = null, H: Value = null, _T: Value = null, Ayy: Value = null, Byy: Value = null, M: Value = null, link: Value = null;
	let $e: any;
	f.vars = () => [user, rendered, H, _T, Ayy, Byy, M, link, $e];
	user = live(f.usr);
	rendered = fmt("<span class='abductor'><b>＀:</b> ＀</span>", [rt.fv(f, "name", live(user)), live(message)]);
	H = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		if ((!truthy((_T = rt.callName(f, live(H), "getorganslot", ["tongue"]))) || !isEqual(rt.fv(f, "type", live(_T)), rt.sv(f, "type")))) {
			continue;
		}
		if ((((truthy(rt.fv(f, "dna", live(H))) && isEqual(rt.gv(f, "id", rt.gv(f, "species", rt.fv(f, "dna", live(H)))), "abductor")) && truthy(rt.fv(f, "dna", live(user)))) && isEqual(rt.gv(f, "id", rt.gv(f, "species", rt.fv(f, "dna", live(user)))), "abductor"))) {
			Ayy = rt.gv(f, "species", rt.fv(f, "dna", live(user)));
			Byy = rt.gv(f, "species", rt.fv(f, "dna", live(H)));
			if (!isEqual(rt.fv(f, "team", live(Ayy)), rt.fv(f, "team", live(Byy)))) {
				continue;
			}
		}
		rt.call(f, P("/proc/to_chat"), null, [live(H), live(rendered)]);
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, rt.gl("dead_mob_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [live(M), live(user)]);
		rt.call(f, P("/proc/to_chat"), null, [live(M), fmt("＀ ＀", [live(link), live(rendered)])]);
	}
	rt.endFor(f, 0);
	return "";
});

rt.type(9527, "/obj/item/organ/tongue/zombie", "/obj/item/organ/tongue", {
	say_mod: "moans",
	taste_sensitivity: 32,
	name: "rotting tongue",
	desc: "Between the decay and the fact that it's just lying there you doubt a tongue has ever seemed less sexy.",
	icon_state: "tonguezombie",
});

// /obj/item/organ/tongue/zombie/proc/TongueSpeech  (code/modules/surgery/organs/tongue.dm:107)
rt.def("/obj/item/organ/tongue/zombie/proc/TongueSpeech", function TongueSpeech(f: Frame, message: Value) {
	let message_list: Value = null, maxchanges: Value = null, i: Value = null, insertpos: Value = null, inserttext: Value = null;
	f.vars = () => [message_list, maxchanges, i, insertpos, inserttext];
	message_list = rt.call(f, P("/proc/splittext"), null, [live(message), " "]);
	maxchanges = rt.call(f, P("/proc/max"), null, [rt.call(f, P("/proc/round"), null, [divide(rt.len(f, live(message_list)), 1.5)]), 2]);
	i = null;
	i = rt.call(f, P("/proc/rand"), null, [divide(live(maxchanges), 2), live(maxchanges)]);
	while (rt.gt(live(i), 0)) {
		insertpos = rt.call(f, P("/proc/rand"), null, [1, subtract(rt.len(f, live(message_list)), 1)]);
		if (!isEqual(rt.call(f, P("/proc/copytext"), null, [(inserttext = rt.index(live(message_list), live(insertpos))), subtract(rt.length(live(inserttext)), 2)]), "...")) {
			rt.setAt(live(message_list), live(insertpos), add(live(inserttext), "..."));
		}
		if ((truthy(rt.op(f, "Prob", [], [20])) && rt.gt(rt.len(f, live(message_list)), 3))) {
			rt.callName(f, live(message_list), "Insert", [live(insertpos), fmt("＀...", [rt.op(f, "PickUnweighted", [4], ["BRAINS", "Brains", "Braaaiinnnsss", "BRAAAIIINNSSS"])])]);
		}
		i = rt.inc(live(i), -1);
	}
	return rt.call(f, P("/proc/jointext"), null, [live(message_list), " "]);
});

rt.type(9528, "/obj/item/organ/tongue/alien", "/obj/item/organ/tongue", {
	say_mod: "hisses",
	taste_sensitivity: 10,
	name: "alien tongue",
	desc: "According to leading xenobiologists the evolutionary benefit of having a second mouth in your mouth is \"that it looks badass\".",
	icon_state: "tonguexeno",
});

// /obj/item/organ/tongue/alien/proc/Initialize  (code/modules/surgery/organs/tongue.dm:130)  may sleep
rt.def("/obj/item/organ/tongue/alien/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "languages_possible", (yield* g.call(f, P("/proc/typecacheof"), null, [rt.list(T("/datum/language/xenocommon"), T("/datum/language/common"), T("/datum/language/draconic"), T("/datum/language/ratvar"), T("/datum/language/monkey"))])));
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/item/organ/tongue/alien/proc/TongueSpeech  (code/modules/surgery/organs/tongue.dm:139)
rt.def("/obj/item/organ/tongue/alien/proc/TongueSpeech", function TongueSpeech(f: Frame, message: Value) {
	rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "owner"), "hiss", 25, 1, 1]);
	return live(message);
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

// /obj/item/organ/tongue/bone/proc/Initialize  (code/modules/surgery/organs/tongue.dm:155)  may sleep
rt.def("/obj/item/organ/tongue/bone/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "phomeme_type", rt.op(f, "PickUnweighted", [1], [rt.sv(f, "phomeme_types")]));
	return f.dot;
}, true);

// /obj/item/organ/tongue/bone/proc/TongueSpeech  (code/modules/surgery/organs/tongue.dm:159)
rt.def("/obj/item/organ/tongue/bone/proc/TongueSpeech", function TongueSpeech(f: Frame, message: Value) {
	f.dot = live(message);
	if (!truthy(rt.sv(f, "chattering"))) return f.dot;
	rt.call(f, P("/proc/chatter"), null, [live(message), rt.sv(f, "phomeme_type"), live(f.usr)]);
	return f.dot;
});

// /obj/item/organ/tongue/bone/proc/get_spans  (code/modules/surgery/organs/tongue.dm:166)
rt.def("/obj/item/organ/tongue/bone/proc/get_spans", function get_spans(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "phomeme_type");
	if ($0 === "sans") {
		(f.dot = rt.modify(live(f.dot), "sans", rt.bitOr));
	} else if ($0 === "papyrus") {
		(f.dot = rt.modify(live(f.dot), "papyrus", rt.bitOr));
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

// /obj/item/organ/tongue/robot/proc/get_spans  (code/modules/surgery/organs/tongue.dm:195)
rt.def("/obj/item/organ/tongue/robot/proc/get_spans", function get_spans(f: Frame) {
	return rt.bitOr(rt.callSuper(f, [], rt.Args.Same), "robot");
});
