// From code/modules/mob/living/silicon/robot/emote.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(531, "/datum/emote/silicon", "/datum/emote", {
	emote_type: 2,
	mob_type_allowed_typecache: null,
});

// /datum/emote/silicon/proc/<init>  (code/modules/mob/living/silicon/robot/emote.dm:2)
rt.def("/datum/emote/silicon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mob_type_allowed_typecache", rt.list(T("/mob/living/silicon")));
	return f.dot;
});

rt.type(428, "/datum/emote/sound/silicon", "/datum/emote/sound", {
	emote_type: 2,
	mob_type_allowed_typecache: null,
});

// /datum/emote/sound/silicon/proc/<init>  (code/modules/mob/living/silicon/robot/emote.dm:6)
rt.def("/datum/emote/sound/silicon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mob_type_allowed_typecache", rt.list(T("/mob/living/silicon")));
	return f.dot;
});

// /mob/living/silicon/robot/verb/powerwarn  (code/modules/mob/living/silicon/robot/emote.dm:66)
rt.def("/mob/living/silicon/robot/verb/powerwarn", function powerwarn(f: Frame) {
	if (!isEqual(rt.sv(f, "stat"), 0)) return f.dot;
	if ((!truthy(rt.sv(f, "cell")) || !truthy(rt.fv(f, "charge", rt.sv(f, "cell"))))) {
		rt.callSrc(f, "visible_message", [fmt("The power warning light on <span class='name'>＀</span> flashes urgently.", [live(f.src)]), "You announce you are operating in low power mode."]);
		rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/machines/buzz-two.ogg"), 50, 0]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You can only use this emote when you're out of charge.</span>"]);
	}
	return f.dot;
}, false, { verb: { name: "Power Warning", category: "Robot Commands" } });
