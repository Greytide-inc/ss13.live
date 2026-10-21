// From code/modules/clothing/masks/hailer.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8558, "/obj/item/clothing/mask/gas/sechailer", "/obj/item/clothing/mask/gas", {
	aggressiveness: 2,
	cooldown_special: null,
	recent_uses: 0,
	broken_hailer: 0,
	safety: 1,
	flags: 4104,
	name: "security gas mask",
	desc: "A standard issue Security gas mask with integrated 'Compli-o-nator 3000' device. Plays over a dozen pre-recorded compliance phrases designed to get scumbags to stand still whilst you taze them. Do not tamper with the device.",
	actions_types: null,
	icon_state: "sechailer",
	item_state: "sechailer",
	flags_inv: 640,
	w_class: 2,
	visor_flags: 4104,
	visor_flags_inv: 128,
	flags_cover: 8,
	visor_flags_cover: 8,
});

// /obj/item/clothing/mask/gas/sechailer/proc/<init>  (code/modules/clothing/masks/hailer.dm:7)
rt.def("/obj/item/clothing/mask/gas/sechailer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/halt"), T("/datum/action/item_action/adjust")));
	return f.dot;
});

rt.type(8559, "/obj/item/clothing/mask/gas/sechailer/swat", "/obj/item/clothing/mask/gas/sechailer", {
	aggressiveness: 3,
	name: "１SWAT mask",
	desc: "A close-fitting tactical mask with an especially aggressive Compli-o-nator 3000.",
	actions_types: null,
	icon_state: "swat",
	item_state: "swat",
	flags_inv: 992,
	visor_flags_inv: 0,
});

// /obj/item/clothing/mask/gas/sechailer/swat/proc/<init>  (code/modules/clothing/masks/hailer.dm:26)
rt.def("/obj/item/clothing/mask/gas/sechailer/swat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/halt")));
	return f.dot;
});

rt.type(8560, "/obj/item/clothing/mask/gas/sechailer/cyborg", "/obj/item/clothing/mask/gas/sechailer", {
	aggressiveness: 1,
	name: "security hailer",
	desc: "A set of recognizable pre-recorded messages for cyborgs to use when apprehending criminals.",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "taperecorder_idle",
	actions_types: null,
});

// /obj/item/clothing/mask/gas/sechailer/cyborg/proc/<init>  (code/modules/clothing/masks/hailer.dm:39)
rt.def("/obj/item/clothing/mask/gas/sechailer/cyborg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/halt")));
	return f.dot;
});

// /obj/item/clothing/mask/gas/sechailer/proc/attackby  (code/modules/clothing/masks/hailer.dm:42)  may sleep
rt.def("/obj/item/clothing/mask/gas/sechailer/proc/attackby", function* attackby(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		$0 = rt.sv(f, "aggressiveness");
		if ($0 === 1) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You set the restrictor to the middle position.</span>"]);
			rt.setSv(f, "aggressiveness", 2);
		} else if ($0 === 2) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You set the restrictor to the last position.</span>"]);
			rt.setSv(f, "aggressiveness", 3);
		} else if ($0 === 3) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You set the restrictor to the first position.</span>"]);
			rt.setSv(f, "aggressiveness", 1);
		} else if ($0 === 4) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='danger'>You adjust the restrictor but nothing happens, probably because it's broken.</span>"]);
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wirecutters")) ? 1 : 0))) {
			if (!isEqual(rt.sv(f, "aggressiveness"), 4)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='danger'>You broke the restrictor!</span>"]);
				rt.setSv(f, "aggressiveness", 4);
			}
		} else {
			yield* g.callSuper(f, [], rt.Args.Same);
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/clothing/mask/gas/sechailer/proc/ui_action_click  (code/modules/clothing/masks/hailer.dm:63)  may sleep
rt.def("/obj/item/clothing/mask/gas/sechailer/proc/ui_action_click", function* ui_action_click(f: Frame, user: Value, action: Value) {
	f.vars = () => [user, action];
	if (truthy((rt.istype(live(action), T("/datum/action/item_action/halt")) ? 1 : 0))) {
		yield* g.srcCall(f, "halt");
	} else {
		yield* g.srcCall(f, "adjustmask", live(user));
	}
	return f.dot;
}, true);

// /obj/item/clothing/mask/gas/sechailer/proc/attack_self  (code/modules/clothing/masks/hailer.dm:69)
rt.def("/obj/item/clothing/mask/gas/sechailer/proc/attack_self", function attack_self(f: Frame) {
	rt.callSrc(f, "halt", []);
	return f.dot;
});

// /obj/item/clothing/mask/gas/sechailer/proc/emag_act  (code/modules/clothing/masks/hailer.dm:73)
rt.def("/obj/item/clothing/mask/gas/sechailer/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (truthy(rt.sv(f, "safety"))) {
		rt.setSv(f, "safety", 0);
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You silently fry ＀'s vocal circuit with the cryptographic sequencer.", [live(f.src)])]);
	} else {
		return live(f.dot);
	}
	return f.dot;
});

// /obj/item/clothing/mask/gas/sechailer/verb/halt  (code/modules/clothing/masks/hailer.dm:81)
rt.def("/obj/item/clothing/mask/gas/sechailer/verb/halt", function halt(f: Frame) {
	let phrase: Value = null, phrase_text: Value = null, phrase_sound: Value = null;
	let $0: any;
	f.vars = () => [phrase, phrase_text, phrase_sound, $0];
	if (!truthy((rt.istype(live(f.usr), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy(rt.callSrc(f, "can_use", [live(f.usr)]))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "broken_hailer"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>＄！'s hailing system is broken.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	phrase = 0;
	phrase_text = null;
	phrase_sound = null;
	if (!rt.lt(rt.sv(f, "cooldown"), subtract(rt.worldTime(f), 30))) return f.dot;
	rt.incSrcVar(f, "recent_uses", 1, true);
	if (rt.lt(rt.sv(f, "cooldown_special"), subtract(rt.worldTime(f), 180))) {
		rt.setSv(f, "recent_uses", rt.initial(f, live(f.src), "recent_uses"));
	}
	$0 = rt.sv(f, "recent_uses");
	if ($0 === 3) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>＄！ is starting to heat up.</span>", [live(f.src)])]);
	} else if ($0 === 4) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='userdanger'>＄！ is heating up dangerously from overuse!</span>", [live(f.src)])]);
	} else if ($0 === 5) {
		rt.setSv(f, "broken_hailer", 1);
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='userdanger'>＄！'s power modulator overloads and breaks.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	$0 = rt.sv(f, "aggressiveness");
	if ($0 === 1) {
		phrase = rt.call(f, P("/proc/rand"), null, [1, 5]);
	} else if ($0 === 2) {
		phrase = rt.call(f, P("/proc/rand"), null, [1, 11]);
	} else if ($0 === 3) {
		phrase = rt.call(f, P("/proc/rand"), null, [1, 18]);
	} else if ($0 === 4) {
		phrase = rt.call(f, P("/proc/rand"), null, [12, 18]);
	}
	if (!truthy(rt.sv(f, "safety"))) {
		phrase_text = "FUCK YOUR CUNT YOU SHIT EATING COCKSTORM AND EAT A DONG FUCKING ASS RAMMING SHIT FUCK EAT PENISES IN YOUR FUCK FACE AND SHIT OUT ABORTIONS OF FUCK AND POO AND SHIT IN YOUR ASS YOU COCK FUCK SHIT MONKEY FUCK ASS WANKER FROM THE DEPTHS OF SHIT.";
		phrase_sound = "emag";
	} else {
		$0 = live(phrase);
		if ($0 === 1) {
			phrase_text = "HALT! HALT! HALT!";
			phrase_sound = "halt";
		} else if ($0 === 2) {
			phrase_text = "Stop in the name of the Law.";
			phrase_sound = "bobby";
		} else if ($0 === 3) {
			phrase_text = "Compliance is in your best interest.";
			phrase_sound = "compliance";
		} else if ($0 === 4) {
			phrase_text = "Prepare for justice!";
			phrase_sound = "justice";
		} else if ($0 === 5) {
			phrase_text = "Running will only increase your sentence.";
			phrase_sound = "running";
		} else if ($0 === 6) {
			phrase_text = "Don't move, Creep!";
			phrase_sound = "dontmove";
		} else if ($0 === 7) {
			phrase_text = "Down on the floor, Creep!";
			phrase_sound = "floor";
		} else if ($0 === 8) {
			phrase_text = "Dead or alive you're coming with me.";
			phrase_sound = "robocop";
		} else if ($0 === 9) {
			phrase_text = "God made today for the crooks we could not catch yesterday.";
			phrase_sound = "god";
		} else if ($0 === 10) {
			phrase_text = "Freeze, Scum Bag!";
			phrase_sound = "freeze";
		} else if ($0 === 11) {
			phrase_text = "Stop right there, criminal scum!";
			phrase_sound = "imperial";
		} else if ($0 === 12) {
			phrase_text = "Stop or I'll bash you.";
			phrase_sound = "bash";
		} else if ($0 === 13) {
			phrase_text = "Go ahead, make my day.";
			phrase_sound = "harry";
		} else if ($0 === 14) {
			phrase_text = "Stop breaking the law, ass hole.";
			phrase_sound = "asshole";
		} else if ($0 === 15) {
			phrase_text = "You have the right to shut the fuck up.";
			phrase_sound = "stfu";
		} else if ($0 === 16) {
			phrase_text = "Shut up crime!";
			phrase_sound = "shutup";
		} else if ($0 === 17) {
			phrase_text = "Face the wrath of the golden bolt.";
			phrase_sound = "super";
		} else if ($0 === 18) {
			phrase_text = "I am, the LAW!";
			phrase_sound = "dredd";
		}
	}
	rt.callName(f, live(f.usr), "audible_message", [fmt("＀'s Compli-o-Nator: <font color='red' size='4'><b>＀</b></font>", [live(f.usr), live(phrase_text)])]);
	rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), fmt("sound/voice/complionator/＀.ogg", [live(phrase_sound)]), 100, 0, 4]);
	rt.setSv(f, "cooldown", rt.worldTime(f));
	rt.setSv(f, "cooldown_special", rt.worldTime(f));
	return f.dot;
}, false, { verb: { name: "HALT", category: "Object", src: 11 } });
