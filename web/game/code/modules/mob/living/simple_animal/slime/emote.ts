// From code/modules/mob/living/simple_animal/slime/emote.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(533, "/datum/emote/slime", "/datum/emote", {
	mob_type_blacklist_typecache: null,
	mob_type_allowed_typecache: rt.typePath("/mob/living/simple_animal/slime"),
});

// /datum/emote/slime/proc/<init>  (code/modules/mob/living/simple_animal/slime/emote.dm:3)
rt.def("/datum/emote/slime/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mob_type_blacklist_typecache", rt.list());
	return f.dot;
});

rt.type(538, "/datum/emote/slime/mood", "/datum/emote/slime", {
	mood: null,
	key: "moodnone",
});

// /datum/emote/slime/mood/proc/run_emote  (code/modules/mob/living/simple_animal/slime/emote.dm:30)  may sleep
rt.def("/datum/emote/slime/mood/proc/run_emote", function* run_emote(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setFv(f, "mood", (S = live(f.args[0])), rt.sv(f, "mood"));
	yield* g.callName(f, live(S), "regenerate_icons", []);
	return f.dot;
}, true, { args: ["user", "params"] });
