// From code/modules/mob/living/carbon/human/say.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/human/proc/say_mod  (code/modules/mob/living/carbon/human/say.dm:2)
rt.def("/mob/living/carbon/human/proc/say_mod", function say_mod(f: Frame) {
	rt.setSv(f, "verb_say", rt.gv(f, "say_mod", rt.fv(f, "species", rt.sv(f, "dna"))));
	if (truthy(rt.sv(f, "slurring"))) {
		return "slurs";
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["input", "message_mode"] });

// /mob/living/carbon/human/proc/treat_message  (code/modules/mob/living/carbon/human/say.dm:9)
rt.def("/mob/living/carbon/human/proc/treat_message", function treat_message(f: Frame, message: Value) {
	let D: Value = null, temp_message: Value = null, pick_list: Value = null, i: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [message, D, temp_message, pick_list, i, H, $e];
	message = rt.callName(f, rt.fv(f, "species", rt.sv(f, "dna")), "handle_speech", [live(message), live(f.src)]);
	if (truthy(rt.len(f, rt.sv(f, "viruses")))) {
		D = null;
		rt.forList(f, 0, rt.sv(f, "viruses"), T("/datum/disease/pierrot_throat"));
		while (($e = rt.next(f, 0)) !== undefined) {
			D = $e;
			temp_message = rt.call(f, P("/proc/splittext"), null, [live(message), " "]);
			pick_list = rt.list();
			i = null;
			i = 1;
			while (rt.le(live(i), rt.len(f, live(temp_message)))) {
				pick_list = rt.modify(live(pick_list), live(i), add);
				i = rt.inc(live(i), 1);
			}
			i = null;
			i = 1;
			while (rt.le(live(i), rt.fv(f, "stage", live(D))) && rt.le(live(i), rt.len(f, live(temp_message)))) {
				blk71: {
					if (truthy(rt.op(f, "Prob", [], [multiply(3, rt.fv(f, "stage", live(D)))]))) {
						H = rt.op(f, "PickUnweighted", [1], [live(pick_list)]);
						if (((truthy(rt.call(f, P("/proc/findtext"), null, [rt.index(live(temp_message), live(H)), "*"])) || truthy(rt.call(f, P("/proc/findtext"), null, [rt.index(live(temp_message), live(H)), ";"]))) || truthy(rt.call(f, P("/proc/findtext"), null, [rt.index(live(temp_message), live(H)), ":"])))) {
							break blk71;
						}
						rt.setAt(live(temp_message), live(H), "HONK");
						(pick_list = rt.modify(live(pick_list), live(H), subtract));
					}
					message = rt.call(f, P("/proc/jointext"), null, [live(temp_message), " "]);
				}
				i = rt.inc(live(i), 1);
			}
		}
		rt.endFor(f, 0);
	}
	message = rt.callSuper(f, [live(message)]);
	return (message = rt.callName(f, rt.sv(f, "dna"), "mutations_say_mods", [live(message)]));
});

// /mob/living/carbon/human/proc/get_spans  (code/modules/mob/living/carbon/human/say.dm:28)
rt.def("/mob/living/carbon/human/proc/get_spans", function get_spans(f: Frame) {
	return rt.bitOr(rt.bitOr(rt.callSuper(f, [], rt.Args.Same), rt.callName(f, rt.sv(f, "dna"), "mutations_get_spans", [])), rt.callName(f, rt.sv(f, "dna"), "species_get_spans", []));
});

// /mob/living/carbon/human/proc/GetVoice  (code/modules/mob/living/carbon/human/say.dm:31)
rt.def("/mob/living/carbon/human/proc/GetVoice", function GetVoice(f: Frame) {
	let V: Value = null, idcard: Value = null;
	f.vars = () => [V, idcard];
	if (truthy((rt.istype(rt.sv(f, "wear_mask"), T("/obj/item/clothing/mask/chameleon")) ? 1 : 0))) {
		if ((truthy(rt.gv(f, "vchange", (V = rt.sv(f, "wear_mask")))) && truthy(rt.sv(f, "wear_id")))) {
			if (truthy((rt.istype((idcard = rt.callName(f, rt.sv(f, "wear_id"), "GetID", [])), T("/obj/item/weapon/card/id")) ? 1 : 0))) {
				return rt.fv(f, "registered_name", live(idcard));
			}
			return rt.sv(f, "real_name");
		} else {
			return rt.sv(f, "real_name");
		}
	}
	if (((truthy(rt.sv(f, "mind")) && truthy(rt.fv(f, "changeling", rt.sv(f, "mind")))) && truthy(rt.gv(f, "mimicing", rt.fv(f, "changeling", rt.sv(f, "mind")))))) {
		return rt.gv(f, "mimicing", rt.fv(f, "changeling", rt.sv(f, "mind")));
	}
	if (truthy(rt.callSrc(f, "GetSpecialVoice", []))) {
		return rt.callSrc(f, "GetSpecialVoice", []);
	}
	return rt.sv(f, "real_name");
});

// /mob/living/carbon/human/proc/IsVocal  (code/modules/mob/living/carbon/human/say.dm:48)
rt.def("/mob/living/carbon/human/proc/IsVocal", function IsVocal(f: Frame) {
	if ((!truthy(rt.fv(f, "dna", live(f.src))) || !truthy(rt.gv(f, "species", rt.fv(f, "dna", live(f.src)))))) {
		return live(f.dot);
	}
	if ((!truthy((rt.isIn(f, 10, rt.gv(f, "species_traits", rt.fv(f, "species", rt.sv(f, "dna")))) ? 1 : 0)) && !truthy(rt.callSrc(f, "getorganslot", ["lungs"])))) {
		return 0;
	}
	if (truthy(rt.sv(f, "mind"))) {
		return (!truthy(rt.fv(f, "miming", rt.sv(f, "mind"))) ? 1 : 0);
	}
	return 1;
});

// /mob/living/carbon/human/proc/SetSpecialVoice  (code/modules/mob/living/carbon/human/say.dm:59)
rt.def("/mob/living/carbon/human/proc/SetSpecialVoice", function SetSpecialVoice(f: Frame, new_voice: Value) {
	if (truthy(live(new_voice))) {
		rt.setSv(f, "special_voice", live(new_voice));
	}
	return live(f.dot);
});

// /mob/living/carbon/human/proc/UnsetSpecialVoice  (code/modules/mob/living/carbon/human/say.dm:63)
rt.def("/mob/living/carbon/human/proc/UnsetSpecialVoice", function UnsetSpecialVoice(f: Frame) {
	rt.setSv(f, "special_voice", "");
	return live(f.dot);
});

// /mob/living/carbon/human/proc/binarycheck  (code/modules/mob/living/carbon/human/say.dm:71)
rt.def("/mob/living/carbon/human/proc/binarycheck", function binarycheck(f: Frame) {
	let dongle: Value = null;
	f.vars = () => [dongle];
	if (!truthy(rt.sv(f, "ears"))) return f.dot;
	if (!truthy((rt.istype((dongle = rt.sv(f, "ears")), T("/obj/item/device/radio/headset")) ? 1 : 0))) {
		return 0;
	}
	if (!truthy(rt.fv(f, "translate_binary", live(dongle)))) return f.dot;
	return 1;
});

// /mob/living/carbon/human/proc/radio  (code/modules/mob/living/carbon/human/say.dm:76)  may sleep
rt.def("/mob/living/carbon/human/proc/radio", function* radio(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!isEqual(live(f.dot), 0)) {
		return live(f.dot);
	}
	$0 = live(f.args[1]);
	if ($0 === "headset") {
		if (truthy(rt.sv(f, "ears"))) {
			yield* g.callName(f, rt.sv(f, "ears"), "talk_into", [live(f.src), live(f.args[0]), null, live(f.args[2]), live(f.args[3])]);
		}
		return 3;
	} else if ($0 === "department") {
		if (truthy(rt.sv(f, "ears"))) {
			yield* g.callName(f, rt.sv(f, "ears"), "talk_into", [live(f.src), live(f.args[0]), live(f.args[1]), live(f.args[2]), live(f.args[3])]);
		}
		return 3;
	}
	if (truthy((rt.isIn(f, live(f.args[1]), rt.gl("radiochannels")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "ears"))) {
			yield* g.callName(f, rt.sv(f, "ears"), "talk_into", [live(f.src), live(f.args[0]), live(f.args[1]), live(f.args[2]), live(f.args[3])]);
			return 3;
		}
	}
	return 0;
}, true, { args: ["message", "message_mode", "spans", "language"] });

// /mob/living/carbon/human/proc/get_alt_name  (code/modules/mob/living/carbon/human/say.dm:99)
rt.def("/mob/living/carbon/human/proc/get_alt_name", function get_alt_name(f: Frame) {
	if (isEqual(rt.sv(f, "name"), rt.callSrc(f, "GetVoice", []))) return f.dot;
	return fmt(" (as ＀)", [rt.callSrc(f, "get_id_name", ["Unknown"])]);
});

// /mob/living/carbon/human/proc/forcesay  (code/modules/mob/living/carbon/human/say.dm:103)  may sleep
rt.def("/mob/living/carbon/human/proc/forcesay", function* forcesay(f: Frame, append: Value) {
	let virgin: Value = null, temp: Value = null, trimmed: Value = null;
	f.vars = () => [append, virgin, temp, trimmed];
	if (!isEqual(rt.sv(f, "stat"), 0)) return f.dot;
	if (!truthy(rt.sv(f, "client"))) return f.dot;
	virgin = 1;
	if (!(truthy((yield* g.call(f, P("/proc/findtextEx"), null, [(temp = (yield* g.call(f, P("/proc/winget"), null, [rt.sv(f, "client"), "input", "text"]))), "Say \"", 1, 7]))) && rt.gt(rt.length(live(temp)), 5))) return f.dot;
	if (truthy((yield* g.call(f, P("/proc/findtext"), null, [(yield* g.call(f, P("/proc/trim_left"), null, [(temp = (yield* g.call(f, P("/proc/replacetext"), null, [live(temp), ";", ""])))])), ":", 6, 7])))) {
		temp = (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/trim_left"), null, [live(temp)])), 8]));
		virgin = 0;
	}
	if (truthy(live(virgin))) {
		temp = (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/trim_left"), null, [live(temp)])), 6]));
		virgin = 0;
	}
	while (truthy((yield* g.call(f, P("/proc/findtext"), null, [(yield* g.call(f, P("/proc/trim_left"), null, [live(temp)])), ":", 1, 2])))) {
		temp = (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/trim_left"), null, [live(temp)])), 3]));
	}
	if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(temp), "*", 1, 2])))) {
		return live(f.dot);
	}
	if (truthy(rt.length((trimmed = (yield* g.call(f, P("/proc/trim_left"), null, [live(temp)])))))) {
		if (truthy(live(append))) {
			temp = rt.modify(live(temp), rt.op(f, "PickUnweighted", [1], [live(append)]), add);
		}
		yield* g.srcCall(f, "say", live(temp));
	}
	yield* g.call(f, P("/proc/winset"), null, [rt.sv(f, "client"), "input", fmt("text=＀", [null])]);
	return f.dot;
}, true);
