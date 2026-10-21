// From code/modules/mob/mob_helpers.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/proc/isloyal  (code/modules/mob/mob_helpers.dm:8)
rt.def("/mob/living/carbon/proc/isloyal", function isloyal(f: Frame) {
	let L: Value = null;
	let $e: any;
	f.vars = () => [L, $e];
	L = null;
	rt.forList(f, 0, rt.sv(f, "implants"), T("/obj/item/weapon/implant/mindshield"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		return 1;
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /proc/check_zone  (code/modules/mob/mob_helpers.dm:13)
rt.def("/proc/check_zone", function check_zone(f: Frame, zone: Value) {
	let $0: any;
	f.vars = () => [zone, $0];
	if (!truthy(live(zone))) {
		return "chest";
	}
	$0 = live(zone);
	if ($0 === "eyes") {
		zone = "head";
	} else if ($0 === "mouth") {
		zone = "head";
	} else if ($0 === "l_hand") {
		zone = "l_arm";
	} else if ($0 === "r_hand") {
		zone = "r_arm";
	} else if ($0 === "l_foot") {
		zone = "l_leg";
	} else if ($0 === "r_foot") {
		zone = "r_leg";
	} else if ($0 === "groin") {
		zone = "chest";
	}
	return live(zone);
});

// /proc/ran_zone  (code/modules/mob/mob_helpers.dm:35)
rt.def("/proc/ran_zone", function ran_zone(f: Frame, zone: Value, probability: Value) {
	let t: Value = null;
	let $0: any;
	f.vars = () => [zone, probability, t, $0];
	if (live(probability) === null) {
		probability = 80;
	}
	zone = rt.call(f, P("/proc/check_zone"), null, [live(zone)]);
	if (truthy(rt.op(f, "Prob", [], [live(probability)]))) {
		return live(zone);
	}
	$0 = (t = rt.call(f, P("/proc/rand"), null, [1, 18]));
	if ($0 === 1) {
		return "head";
	} else if ($0 === 2) {
		return "chest";
	} else if (rt.inRange($0, 3, 6)) {
		return "l_arm";
	} else if (rt.inRange($0, 7, 10)) {
		return "r_arm";
	} else if (rt.inRange($0, 11, 14)) {
		return "l_leg";
	} else if (rt.inRange($0, 15, 18)) {
		return "r_leg";
	}
	return live(zone);
});

// /proc/above_neck  (code/modules/mob/mob_helpers.dm:59)
rt.def("/proc/above_neck", function above_neck(f: Frame, zone: Value) {
	let zones: Value = null;
	f.vars = () => [zones];
	if (truthy(rt.callName(f, (zones = rt.list("head", "mouth", "eyes")), "Find", [live(zone)]))) {
		return 1;
	} else {
		return 0;
	}
	return f.dot;
});

// /proc/stars  (code/modules/mob/mob_helpers.dm:65)
rt.def("/proc/stars", function stars(f: Frame, n: Value, pr: Value) {
	let te: Value = null, t: Value = null, p: Value = null;
	f.vars = () => [n, pr, te, t, p];
	n = rt.call(f, P("/proc/html_encode"), null, [live(n)]);
	if (live(pr) === null) {
		pr = 25;
	}
	if (rt.le(live(pr), 0)) {
		return null;
	}
	if (rt.ge(live(pr), 100)) {
		return live(n);
	}
	te = live(n);
	t = "";
	n = rt.length(live(n));
	p = null;
	p = 1;
	while (rt.le(live(p), live(n))) {
		if ((isEqual(rt.call(f, P("/proc/copytext"), null, [live(te), live(p), add(live(p), 1)]), " ") || truthy(rt.op(f, "Prob", [], [live(pr)])))) {
			t = fmt("＀＀", [live(t), rt.call(f, P("/proc/copytext"), null, [live(te), live(p), add(live(p), 1)])]);
		} else {
			t = fmt("＀*", [live(t)]);
		}
		p = rt.inc(live(p), 1);
	}
	return rt.call(f, P("/proc/sanitize"), null, [live(t)]);
});

// /proc/slur  (code/modules/mob/mob_helpers.dm:87)
rt.def("/proc/slur", function slur(f: Frame, n: Value) {
	let phrase: Value = null, leng: Value = null, counter: Value = null, newphrase: Value = null, newletter: Value = null;
	let $0: any;
	f.vars = () => [phrase, leng, counter, newphrase, newletter, $0];
	phrase = rt.call(f, P("/proc/html_decode"), null, [live(n)]);
	leng = rt.call(f, P("/proc/lentext"), null, [live(phrase)]);
	counter = rt.call(f, P("/proc/lentext"), null, [live(phrase)]);
	newphrase = "";
	newletter = "";
	while (rt.ge(live(counter), 1)) {
		newletter = rt.call(f, P("/proc/copytext"), null, [live(phrase), add(subtract(live(leng), live(counter)), 1), add(subtract(live(leng), live(counter)), 2)]);
		if (isEqual(rt.call(f, P("/proc/rand"), null, [1, 3]), 3)) {
			if (isEqual(rt.call(f, P("/proc/lowertext"), null, [live(newletter)]), "o")) {
				newletter = "u";
			}
			if (isEqual(rt.call(f, P("/proc/lowertext"), null, [live(newletter)]), "s")) {
				newletter = "ch";
			}
			if (isEqual(rt.call(f, P("/proc/lowertext"), null, [live(newletter)]), "a")) {
				newletter = "ah";
			}
			if (isEqual(rt.call(f, P("/proc/lowertext"), null, [live(newletter)]), "u")) {
				newletter = "oo";
			}
			if (isEqual(rt.call(f, P("/proc/lowertext"), null, [live(newletter)]), "c")) {
				newletter = "k";
			}
		}
		if (isEqual(rt.call(f, P("/proc/rand"), null, [1, 20]), 20)) {
			if (isEqual(live(newletter), " ")) {
				newletter = "...huuuhhh...";
			}
			if (isEqual(live(newletter), ".")) {
				newletter = " *BURP*.";
			}
		}
		$0 = rt.call(f, P("/proc/rand"), null, [1, 20]);
		if ($0 === 1) {
			newletter = rt.modify(live(newletter), "'", add);
		} else if ($0 === 10) {
			newletter = rt.modify(live(newletter), fmt("＀", [live(newletter)]), add);
		} else if ($0 === 20) {
			newletter = rt.modify(live(newletter), fmt("＀＀", [live(newletter), live(newletter)]), add);
		}
		newphrase = rt.modify(live(newphrase), fmt("＀", [live(newletter)]), add);
		(counter = rt.modify(live(counter), 1, subtract));
	}
	return live(newphrase);
});

// /proc/cultslur  (code/modules/mob/mob_helpers.dm:122)
rt.def("/proc/cultslur", function cultslur(f: Frame, n: Value) {
	let phrase: Value = null, leng: Value = null, counter: Value = null, newphrase: Value = null, newletter: Value = null;
	let $0: any;
	f.vars = () => [phrase, leng, counter, newphrase, newletter, $0];
	phrase = rt.call(f, P("/proc/html_decode"), null, [live(n)]);
	leng = rt.call(f, P("/proc/lentext"), null, [live(phrase)]);
	counter = rt.call(f, P("/proc/lentext"), null, [live(phrase)]);
	newphrase = "";
	newletter = "";
	while (rt.ge(live(counter), 1)) {
		newletter = rt.call(f, P("/proc/copytext"), null, [live(phrase), add(subtract(live(leng), live(counter)), 1), add(subtract(live(leng), live(counter)), 2)]);
		if (isEqual(rt.call(f, P("/proc/rand"), null, [1, 2]), 2)) {
			if (isEqual(rt.call(f, P("/proc/lowertext"), null, [live(newletter)]), "o")) {
				newletter = "u";
			}
			if (isEqual(rt.call(f, P("/proc/lowertext"), null, [live(newletter)]), "t")) {
				newletter = "ch";
			}
			if (isEqual(rt.call(f, P("/proc/lowertext"), null, [live(newletter)]), "a")) {
				newletter = "ah";
			}
			if (isEqual(rt.call(f, P("/proc/lowertext"), null, [live(newletter)]), "u")) {
				newletter = "oo";
			}
			if (isEqual(rt.call(f, P("/proc/lowertext"), null, [live(newletter)]), "c")) {
				newletter = " NAR ";
			}
			if (isEqual(rt.call(f, P("/proc/lowertext"), null, [live(newletter)]), "s")) {
				newletter = " SIE ";
			}
		}
		if (isEqual(rt.call(f, P("/proc/rand"), null, [1, 4]), 4)) {
			if (isEqual(live(newletter), " ")) {
				newletter = " no hope... ";
			}
			if (isEqual(live(newletter), "H")) {
				newletter = " IT COMES... ";
			}
		}
		$0 = rt.call(f, P("/proc/rand"), null, [1, 15]);
		if ($0 === 1) {
			newletter = "'";
		} else if ($0 === 2) {
			newletter = rt.modify(live(newletter), "agn", add);
		} else if ($0 === 3) {
			newletter = "fth";
		} else if ($0 === 4) {
			newletter = "nglu";
		} else if ($0 === 5) {
			newletter = "glor";
		}
		newphrase = rt.modify(live(newphrase), fmt("＀", [live(newletter)]), add);
		(counter = rt.modify(live(counter), 1, subtract));
	}
	return live(newphrase);
});

// /proc/stutter  (code/modules/mob/mob_helpers.dm:164)
rt.def("/proc/stutter", function stutter(f: Frame, n: Value) {
	let te: Value = null, t: Value = null, p: Value = null, n_letter: Value = null;
	f.vars = () => [n, te, t, p, n_letter];
	te = rt.call(f, P("/proc/html_decode"), null, [live(n)]);
	t = "";
	n = rt.length(live(n));
	p = null;
	p = 1;
	while (rt.le(live(p), live(n))) {
		n_letter = rt.call(f, P("/proc/copytext"), null, [live(te), live(p), add(live(p), 1)]);
		if ((truthy(rt.op(f, "Prob", [], [80])) && truthy((rt.isIn(f, rt.call(f, P("/proc/ckey"), null, [live(n_letter)]), rt.list("b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z")) ? 1 : 0)))) {
			if (truthy(rt.op(f, "Prob", [], [10]))) {
				n_letter = fmt("＀-＀-＀-＀", [live(n_letter), live(n_letter), live(n_letter), live(n_letter)]);
			} else {
				if (truthy(rt.op(f, "Prob", [], [20]))) {
					n_letter = fmt("＀-＀-＀", [live(n_letter), live(n_letter), live(n_letter)]);
				} else {
					if (truthy(rt.op(f, "Prob", [], [5]))) {
						n_letter = null;
					} else {
						n_letter = fmt("＀-＀", [live(n_letter), live(n_letter)]);
					}
				}
			}
		}
		t = fmt("＀＀", [live(t), live(n_letter)]);
		p = rt.inc(live(p), 1);
	}
	return rt.call(f, P("/proc/copytext"), null, [rt.call(f, P("/proc/sanitize"), null, [live(t)]), 1, 1024]);
});

// /proc/derpspeech  (code/modules/mob/mob_helpers.dm:187)
rt.def("/proc/derpspeech", function derpspeech(f: Frame, message: Value, stuttering: Value) {
	f.vars = () => [message];
	message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [live(message), " am ", " "])), " is ", " "])), " are ", " "])), "you", "u"])), "help", "halp"])), "grief", "grife"])), "space", "spess"])), "carp", "crap"])), "reason", "raisin"]);
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		message = rt.call(f, P("/proc/uppertext"), null, [live(message)]);
		message = rt.modify(live(message), fmt("＀", [rt.call(f, P("/proc/stutter"), null, [rt.op(f, "PickUnweighted", [3], ["!", "!!", "!!!"])])]), add);
	}
	if ((!truthy(live(stuttering)) && truthy(rt.op(f, "Prob", [], [15])))) {
		message = rt.call(f, P("/proc/stutter"), null, [live(message)]);
	}
	return live(message);
});

// /proc/Gibberish  (code/modules/mob/mob_helpers.dm:206)
rt.def("/proc/Gibberish", function Gibberish(f: Frame, t: Value, p: Value) {
	let returntext: Value = null, i: Value = null, letter: Value = null, j: Value = null;
	f.vars = () => [returntext, i, letter, j];
	returntext = "";
	i = null;
	i = 1;
	while (rt.le(live(i), rt.length(live(t)))) {
		letter = rt.call(f, P("/proc/copytext"), null, [live(t), live(i), add(live(i), 1)]);
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			if (rt.ge(live(p), 70)) {
				letter = "";
			}
			j = null;
			j = 1;
			while (rt.le(live(j), rt.call(f, P("/proc/rand"), null, [0, 2]))) {
				letter = rt.modify(live(letter), rt.op(f, "PickUnweighted", [17], ["#", "@", "*", "&", "%", "$", "/", "<", ">", ";", "*", "*", "*", "*", "*", "*", "*"]), add);
				j = rt.inc(live(j), 1);
			}
		}
		returntext = rt.modify(live(returntext), live(letter), add);
		i = rt.inc(live(i), 1);
	}
	return live(returntext);
});

// /proc/shake_camera  (code/modules/mob/mob_helpers.dm:252)
rt.def("/proc/shake_camera", function shake_camera(f: Frame, M: Value, duration: Value, strength: Value) {
	let C: Value = null, oldx: Value = null, oldy: Value = null, max: Value = null, min: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [strength, C, oldx, oldy, max, min, i, $e];
	if (live(strength) === null) {
		strength = 1;
	}
	if (((!truthy(live(M)) || !truthy(rt.fv(f, "client", live(M)))) || rt.le(live(duration), 0))) {
		return live(f.dot);
	}
	C = rt.fv(f, "client", live(M));
	oldx = rt.fv(f, "pixel_x", live(C));
	oldy = rt.fv(f, "pixel_y", live(C));
	max = multiply(live(strength), rt.fv(f, "icon_size", rt.world()));
	min = rt.neg(multiply(live(strength), rt.fv(f, "icon_size", rt.world())));
	i = null;
	rt.forRange(f, 0, 0, subtract(live(duration), 1), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (isEqual(live(i), 0)) {
			rt.op(f, "Animate", [2, 8], [null, live(C), "pixel_x", rt.call(f, P("/proc/rand"), null, [live(min), live(max)]), "pixel_y", rt.call(f, P("/proc/rand"), null, [live(min), live(max)]), "time", 1]);
		} else {
			rt.op(f, "Animate", [2, 6], ["pixel_x", rt.call(f, P("/proc/rand"), null, [live(min), live(max)]), "pixel_y", rt.call(f, P("/proc/rand"), null, [live(min), live(max)]), "time", 1]);
		}
	}
	rt.endFor(f, 0);
	rt.op(f, "Animate", [2, 6], ["pixel_x", live(oldx), "pixel_y", live(oldy), "time", 1]);
	return f.dot;
});

// /proc/findname  (code/modules/mob/mob_helpers.dm:270)
rt.def("/proc/findname", function findname(f: Frame, msg: Value) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [msg, M, $e];
	if (!truthy(rt.call(f, P("/proc/istext"), null, [live(msg)]))) {
		msg = fmt("＀", [live(msg)]);
	}
	M = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (isEqual(rt.fv(f, "real_name", live(M)), live(msg))) {
			return live(M);
		}
	}
	rt.endFor(f, 0);
	return 0;
});

// /mob/proc/first_name  (code/modules/mob/mob_helpers.dm:279)
rt.def("/mob/proc/first_name", function first_name(f: Frame) {
	rt.callName(f, rt.gl("firstname"), "Find", [rt.sv(f, "real_name")]);
	return rt.fv(f, "match", rt.gl("firstname"));
});

// /mob/proc/abiotic  (code/modules/mob/mob_helpers.dm:283)
rt.def("/mob/proc/abiotic", function abiotic(f: Frame, full_body: Value) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [full_body, I, $e];
	if (live(full_body) === null) {
		full_body = 0;
	}
	I = null;
	rt.forList(f, 0, rt.sv(f, "held_items"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (!truthy(rt.bitAnd(rt.fv(f, "flags", live(I)), 2))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return 0;
});

// /mob/verb/a_intent_change  (code/modules/mob/mob_helpers.dm:293)
rt.def("/mob/verb/a_intent_change", function a_intent_change(f: Frame, input: Value) {
	let current_intent: Value = null;
	f.vars = () => [current_intent];
	if ((!truthy(rt.sv(f, "possible_a_intents")) || !truthy(rt.len(f, rt.sv(f, "possible_a_intents"))))) {
		return live(f.dot);
	}
	if (truthy((rt.isIn(f, live(input), rt.sv(f, "possible_a_intents")) ? 1 : 0))) {
		rt.setSv(f, "a_intent", live(input));
	} else {
		if (!truthy((current_intent = rt.callName(f, rt.sv(f, "possible_a_intents"), "Find", [rt.sv(f, "a_intent")])))) {
			current_intent = 1;
		}
		if (isEqual(live(input), "right")) {
			current_intent = rt.modify(live(current_intent), 1, add);
		}
		if (isEqual(live(input), "left")) {
			(current_intent = rt.modify(live(current_intent), 1, subtract));
		}
		if (rt.lt(live(current_intent), 1)) {
			current_intent = rt.len(f, rt.sv(f, "possible_a_intents"));
		}
		if (rt.gt(live(current_intent), rt.len(f, rt.sv(f, "possible_a_intents")))) {
			current_intent = 1;
		}
		rt.setSv(f, "a_intent", rt.index(rt.sv(f, "possible_a_intents"), live(current_intent)));
	}
	if (!(truthy(rt.sv(f, "hud_used")) && truthy(rt.fv(f, "action_intent", rt.sv(f, "hud_used"))))) return f.dot;
	rt.setFv(f, "icon_state", rt.fv(f, "action_intent", rt.sv(f, "hud_used")), fmt("＀", [rt.sv(f, "a_intent")]));
	return f.dot;
}, false, { hidden: true, verb: { name: "a-intent" }, argTypes: [{ type: 2 }] });

// /proc/is_blind  (code/modules/mob/mob_helpers.dm:323)
rt.def("/proc/is_blind", function is_blind(f: Frame, A: Value) {
	let B: Value = null;
	f.vars = () => [B];
	if (truthy(rt.call(f, P("/proc/ismob"), null, [live(A)]))) {
		return rt.gv(f, "eye_blind", (B = live(A)));
	}
	return 0;
});

// /proc/is_special_character  (code/modules/mob/mob_helpers.dm:329)
rt.def("/proc/is_special_character", function is_special_character(f: Frame, M: Value) {
	let R: Value = null, A: Value = null;
	let $0: any;
	f.vars = () => [R, A, $0];
	if (!truthy(rt.callName(f, rt.gl("SSticker"), "HasRoundStarted", []))) {
		return 0;
	}
	if (!truthy((rt.istype(live(M), T("/mob")) ? 1 : 0))) {
		return 0;
	}
	if (truthy((rt.istype(live(M), T("/mob/living/silicon")) ? 1 : 0))) {
		if (truthy((rt.istype(live(M), T("/mob/living/silicon/robot")) ? 1 : 0))) {
			if ((truthy(rt.gv(f, "mind", (R = live(M)))) && truthy(rt.gv(f, "special_role", rt.fv(f, "mind", live(R)))))) {
				if (((truthy(rt.fv(f, "laws", live(R))) && truthy(rt.gv(f, "zeroth", rt.fv(f, "laws", live(R))))) && truthy(rt.fv(f, "syndicate", live(R))))) {
					if (truthy(rt.fv(f, "connected_ai", live(R)))) {
						if (((truthy(rt.call(f, P("/proc/is_special_character"), null, [rt.fv(f, "connected_ai", live(R))])) && truthy(rt.gv(f, "laws", rt.fv(f, "connected_ai", live(R))))) && (isEqual(rt.gv(f, "zeroth_borg", rt.gv(f, "laws", rt.fv(f, "connected_ai", live(R)))), rt.gv(f, "zeroth", rt.fv(f, "laws", live(R)))) || isEqual(rt.gv(f, "zeroth", rt.gv(f, "laws", rt.fv(f, "connected_ai", live(R)))), rt.gv(f, "zeroth", rt.fv(f, "laws", live(R))))))) {
							return 0;
						}
						return 1;
					}
					return 1;
				}
			}
		} else {
			if (truthy((rt.istype(live(M), T("/mob/living/silicon/ai")) ? 1 : 0))) {
				if ((((truthy(rt.gv(f, "laws", (A = live(M)))) && truthy(rt.gv(f, "zeroth", rt.fv(f, "laws", live(A))))) && truthy(rt.fv(f, "mind", live(A)))) && truthy(rt.gv(f, "special_role", rt.fv(f, "mind", live(A)))))) {
					return 1;
				}
			}
		}
		return 0;
	}
	if ((truthy(rt.fv(f, "mind", live(M))) && truthy(rt.gv(f, "special_role", rt.fv(f, "mind", live(M)))))) {
		$0 = rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker")));
		if ($0 === "revolution") {
			if ((truthy((rt.isIn(f, rt.fv(f, "mind", live(M)), rt.gv(f, "head_revolutionaries", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0)) || truthy((rt.isIn(f, rt.fv(f, "mind", live(M)), rt.gv(f, "revolutionaries", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0)))) {
				return 2;
			}
		} else if ($0 === "cult") {
			if (truthy((rt.isIn(f, rt.fv(f, "mind", live(M)), rt.gv(f, "cult", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
				return 2;
			}
		} else if ($0 === "nuclear") {
			if (truthy((rt.isIn(f, rt.fv(f, "mind", live(M)), rt.gv(f, "syndicates", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
				return 2;
			}
		} else if ($0 === "changeling") {
			if (truthy((rt.isIn(f, rt.fv(f, "mind", live(M)), rt.gv(f, "changelings", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
				return 2;
			}
		} else if ($0 === "wizard") {
			if (truthy((rt.isIn(f, rt.fv(f, "mind", live(M)), rt.gv(f, "wizards", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
				return 2;
			}
		} else if ($0 === "apprentice") {
			if (truthy((rt.isIn(f, rt.fv(f, "mind", live(M)), rt.gv(f, "apprentices", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
				return 2;
			}
		} else if ($0 === "monkey") {
			if ((truthy(rt.fv(f, "viruses", live(M))) && truthy(rt.locateIn(f, T("/datum/disease/transformation/jungle_fever"), rt.fv(f, "viruses", live(M)))))) {
				return 2;
			}
		} else if ($0 === "abductor") {
			if (truthy((rt.isIn(f, rt.fv(f, "mind", live(M)), rt.gv(f, "abductors", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
				return 2;
			}
		}
		return 1;
	}
	return 0;
});

// /proc/notify_ghosts  (code/modules/mob/mob_helpers.dm:381)  may sleep
rt.def("/proc/notify_ghosts", function* notify_ghosts(f: Frame, message: Value, ghost_sound: Value, enter_link: Value, source: Value, alert_overlay: Value, action: Value, flashwindow: Value) {
	let O: Value = null, A: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [message, ghost_sound, enter_link, source, alert_overlay, action, flashwindow, O, A, $0, $1, $2, $e];
	if (live(ghost_sound) === null) {
		ghost_sound = null;
	}
	if (live(enter_link) === null) {
		enter_link = null;
	}
	if (live(source) === null) {
		source = null;
	}
	if (live(alert_overlay) === null) {
		alert_overlay = null;
	}
	if (live(action) === null) {
		action = "jump";
	}
	if (live(flashwindow) === null) {
		flashwindow = 1;
	}
	if (!isEqual(rt.fv(f, "initialized", rt.gl("SSatoms")), 2)) {
		return live(f.dot);
	}
	O = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/dead/observer"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (truthy(rt.fv(f, "client", live(O)))) {
			$0 = live(O);
			$1 = live(message);
			if (truthy(live(enter_link))) {
				$1 = $1;
				$2 = fmt(" ＀", [live(enter_link)]);
			} else {
				$2 = "";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='ghostalert'>＀＀<span>", [$1, $2])]);
			if (truthy(live(ghost_sound))) {
				rt.op(f, "Output", [], [live(O), (yield* g.call(f, P("/proc/sound"), null, [live(ghost_sound)]))], false);
			}
			if (truthy(live(flashwindow))) {
				yield* g.call(f, P("/proc/window_flash"), null, [rt.fv(f, "client", live(O))]);
			}
			if (truthy(live(source))) {
				if (truthy((A = (yield* g.callName(f, live(O), "throw_alert", [fmt("＃_notify_action", [live(source)]), T("/obj/screen/alert/notify_action")]))))) {
					if ((truthy(rt.gv(f, "prefs", rt.fv(f, "client", live(O)))) && truthy(rt.gv(f, "UI_style", rt.gv(f, "prefs", rt.fv(f, "client", live(O))))))) {
						rt.setFv(f, "icon", live(A), (yield* g.call(f, P("/proc/ui_style2icon"), null, [rt.gv(f, "UI_style", rt.gv(f, "prefs", rt.fv(f, "client", live(O))))])));
					}
					rt.setFv(f, "desc", live(A), live(message));
					rt.setFv(f, "action", live(A), live(action));
					rt.setFv(f, "target", live(A), live(source));
					if (!truthy(live(alert_overlay))) {
						alert_overlay = (yield* g.new_(f, T("/mutable_appearance"), [live(source)]));
					}
					rt.setFv(f, "layer", live(alert_overlay), -1);
					rt.setFv(f, "plane", live(alert_overlay), -32767);
					yield* g.callName(f, live(A), "add_overlay", [live(alert_overlay)]);
				}
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /proc/item_heal_robotic  (code/modules/mob/mob_helpers.dm:405)  may sleep
rt.def("/proc/item_heal_robotic", function* item_heal_robotic(f: Frame, H: Value, user: Value, brute_heal: Value, burn_heal: Value) {
	let affecting: Value = null, dam: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [H, user, brute_heal, burn_heal, affecting, dam, $0, $1, $2];
	if (!(truthy((affecting = (yield* g.callName(f, live(H), "get_bodypart", [(yield* g.call(f, P("/proc/check_zone"), null, [rt.fv(f, "zone_selected", live(user))]))])))) && isEqual(rt.fv(f, "status", live(affecting)), 2))) return f.dot;
	dam = null;
	if (rt.gt(live(brute_heal), live(burn_heal))) {
		dam = 1;
	} else {
		dam = 0;
	}
	if (((rt.gt(live(brute_heal), 0) && rt.gt(rt.fv(f, "brute_dam", live(affecting)), 0)) || (rt.gt(live(burn_heal), 0) && rt.gt(rt.fv(f, "burn_dam", live(affecting)), 0)))) {
		if (truthy((yield* g.callName(f, live(affecting), "heal_damage", [live(brute_heal), live(burn_heal), 1, 0])))) {
			yield* g.callName(f, live(H), "update_damage_overlays", []);
		}
		$0 = live(user);
		$1 = live(user);
		if (truthy(live(dam))) {
			$1 = $1;
			$2 = "dents on";
		} else {
			$2 = "burnt wires in";
		}
		$1 = fmt("＀ has fixed some of the ＀ ＀'s ＀.", [$1, $2, live(H), rt.fv(f, "name", live(affecting))]);
		if (truthy(live(dam))) {
			$2 = "dents on";
		} else {
			$2 = "burnt wires in";
		}
		yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='notice'>You fix some of the ＀ ＀'s ＀.</span>", [$2, live(H), rt.fv(f, "name", live(affecting))])]);
		return 1;
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is already in good condition!</span>", [live(affecting)])]);
	}
	return f.dot;
}, true);

// /proc/IsAdminGhost  (code/modules/mob/mob_helpers.dm:423)
rt.def("/proc/IsAdminGhost", function IsAdminGhost(f: Frame, user: Value) {
	if (!truthy(live(user))) {
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "client", live(user)))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(user), T("/mob/dead/observer")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy(rt.call(f, P("/proc/check_rights_for"), null, [rt.fv(f, "client", live(user)), 2]))) {
		return live(f.dot);
	}
	if (!truthy(rt.gv(f, "AI_Interact", rt.fv(f, "client", live(user))))) {
		return live(f.dot);
	}
	return 1;
});

// /proc/offer_control  (code/modules/mob/mob_helpers.dm:436)  may sleep
rt.def("/proc/offer_control", function* offer_control(f: Frame, M: Value) {
	let poll_message: Value = null, candidates: Value = null, theghost: Value = null;
	f.vars = () => [M, poll_message, candidates, theghost];
	yield* g.call(f, P("/proc/to_chat"), null, [live(M), "Control of your mob has been offered to dead players."]);
	if (truthy(live(f.usr))) {
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has offered control of (＀) to ghosts.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(M)]))])]);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has offered control of (＀) to ghosts", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(M)]))])]);
	}
	poll_message = fmt("Do you want to play as ＀?", [rt.fv(f, "real_name", live(M))]);
	if ((truthy(rt.fv(f, "mind", live(M))) && truthy(rt.gv(f, "assigned_role", rt.fv(f, "mind", live(M)))))) {
		poll_message = fmt("＀ Job:＀.", [live(poll_message), rt.gv(f, "assigned_role", rt.fv(f, "mind", live(M)))]);
	}
	if ((truthy(rt.fv(f, "mind", live(M))) && truthy(rt.gv(f, "special_role", rt.fv(f, "mind", live(M)))))) {
		poll_message = fmt("＀ Status:＀.", [live(poll_message), rt.gv(f, "special_role", rt.fv(f, "mind", live(M)))]);
	}
	candidates = (yield* g.call(f, P("/proc/pollCandidatesForMob"), null, [live(poll_message), "pAI", null, 0, 100, live(M)]));
	theghost = null;
	if (truthy(rt.len(f, live(candidates)))) {
		theghost = rt.op(f, "PickUnweighted", [1], [live(candidates)]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "Your mob has been taken over by a ghost!"]);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has taken control of (＀)", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(theghost)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(M)]))])]);
		yield* g.callName(f, live(M), "ghostize", [0]);
		rt.setFv(f, "key", live(M), rt.fv(f, "key", live(theghost)));
		return 1;
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "There were no ghosts willing to take control."]);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("No ghosts were willing to take control of ＀)", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(M)]))])]);
		return 0;
	}
	return f.dot;
}, true);

// /mob/proc/is_flying  (code/modules/mob/mob_helpers.dm:461)
rt.def("/mob/proc/is_flying", function is_flying(f: Frame, M: Value) {
	f.vars = () => [M];
	if (live(M) === null) {
		M = live(f.src);
	}
	if (truthy(rt.bitAnd(rt.fv(f, "movement_type", live(M)), 2))) {
		return 1;
	} else {
		return 0;
	}
	return f.dot;
});

// /mob/proc/click_random_mob  (code/modules/mob/mob_helpers.dm:467)  may sleep
rt.def("/mob/proc/click_random_mob", function* click_random_mob(f: Frame) {
	let nearby_mobs: Value = null, L: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [nearby_mobs, L, _T, $e];
	nearby_mobs = rt.list();
	L = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, live(f.src)])), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (!isEqual(live(L), live(f.src))) {
			(nearby_mobs = rt.modify(live(nearby_mobs), live(L), rt.bitOr));
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.len(f, live(nearby_mobs)))) return f.dot;
	yield* g.srcCall(f, "ClickOn", (_T = rt.op(f, "PickUnweighted", [1], [live(nearby_mobs)])));
	return f.dot;
}, true);

// /mob/proc/log_message  (code/modules/mob/mob_helpers.dm:476)
rt.def("/mob/proc/log_message", function log_message(f: Frame, message: Value, message_type: Value) {
	let timestamped_message: Value = null;
	f.vars = () => [timestamped_message];
	if ((!truthy(rt.length(live(message))) || !truthy(live(message_type)))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(rt.index(rt.sv(f, "logging"), live(message_type)), T("/list")) ? 1 : 0))) {
		rt.setAt(rt.sv(f, "logging"), live(message_type), rt.list());
	}
	timestamped_message = rt.alist(f, [fmt("＀[＀] ＀", [add(rt.length(rt.index(rt.sv(f, "logging"), live(message_type))), 1), rt.call(f, P("/proc/time_stamp"), null, []), rt.call(f, P("/proc/key_name"), null, [live(f.src)])]), live(message)]);
	rt.modAt(rt.sv(f, "logging"), live(message_type), live(timestamped_message), add);
	return f.dot;
});
