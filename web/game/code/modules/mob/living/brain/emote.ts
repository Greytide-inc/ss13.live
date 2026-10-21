// From code/modules/mob/living/brain/emote.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(525, "/datum/emote/brain", "/datum/emote", {
	mob_type_blacklist_typecache: null,
	mob_type_allowed_typecache: null,
});

// /datum/emote/brain/proc/<init>  (code/modules/mob/living/brain/emote.dm:3)
rt.def("/datum/emote/brain/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mob_type_blacklist_typecache", rt.list());
	$0 = $0;
	rt.setSv(f, "mob_type_allowed_typecache", rt.list(T("/mob/living/brain")));
	return f.dot;
});

// /datum/emote/brain/proc/can_run_emote  (code/modules/mob/living/brain/emote.dm:6)
rt.def("/datum/emote/brain/proc/can_run_emote", function can_run_emote(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!(!truthy((rt.istype((B = live(f.args[0])), T("/mob/living/brain")) ? 1 : 0)) || !(truthy(rt.fv(f, "container", live(B))) && truthy((rt.istype(rt.fv(f, "container", live(B)), T("/obj/item/device/mmi")) ? 1 : 0))))) return f.dot;
	return 0;
}, false, { args: ["user"] });
