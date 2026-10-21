// From code/game/gamemodes/clock_cult/clock_items/soul_vessel.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9117, "/obj/item/device/mmi/posibrain/soul_vessel", "/obj/item/device/mmi/posibrain", {
	clockwork_desc: "A soul vessel, an ancient relic that can attract the souls of the damned or simply rip a mind from an unconscious or dead human.\n<span class='brass'>If active, can serve as a positronic brain, placable in cyborg shells or clockwork construct shells.</span>",
	name: "soul vessel",
	desc: "A heavy brass cube, three inches to a side, with a single protruding cogwheel.",
	icon: rt.rsc("icons/obj/clockwork_objects.dmi"),
	icon_state: "soul_vessel",
	req_access: null,
	braintype: "Servant",
	begin_activation_message: "<span class='brass'>You activate the cogwheel. It hitches and stalls as it begins spinning.</span>",
	success_message: "<span class='brass'>The cogwheel's rotation smooths out as the soul vessel activates.</span>",
	fail_message: "<span class='warning'>The cogwheel creaks and grinds to a halt. Maybe you could try again?</span>",
	new_role: "Soul Vessel",
	welcome_message: "<span class='warning'>ALL PAST LIVES ARE FORGOTTEN.</span>\n<b>You are a soul vessel - a clockwork mind created by Ratvar, the Clockwork Justiciar.\nYou answer to Ratvar and his servants. It is your discretion as to whether or not to answer to anyone else.\nThe purpose of your existence is to further the goals of the servants and Ratvar himself. Above all else, serve Ratvar.</b>",
	new_mob_message: "<span class='brass'>The soul vessel emits a jet of steam before its cogwheel smooths out.</span>",
	dead_message: "<span class='deadsay'>Its cogwheel, scratched and dented, lies motionless.</span>",
	possible_names: null,
	autoping: 0,
	resistance_flags: 34,
	force_replace_ai_name: 1,
});

// /obj/item/device/mmi/posibrain/soul_vessel/proc/<init>  (code/game/gamemodes/clock_cult/clock_items/soul_vessel.dm:9)
rt.def("/obj/item/device/mmi/posibrain/soul_vessel/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list());
	rt.setSv(f, "possible_names", rt.list("Judge", "Guard", "Servant", "Smith", "Auger"));
	return f.dot;
});

// /obj/item/device/mmi/posibrain/soul_vessel/proc/Initialize  (code/game/gamemodes/clock_cult/clock_items/soul_vessel.dm:27)  may sleep
rt.def("/obj/item/device/mmi/posibrain/soul_vessel/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setFv(f, "on", rt.sv(f, "radio"), 0);
	rt.setSv(f, "laws", (yield* g.new_(f, T("/datum/ai_laws/ratvar"), [])));
	rt.setSv(f, "braintype", rt.sv(f, "picked_name"));
	rt.modGl("all_clockwork_objects", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/device/mmi/posibrain/soul_vessel/proc/Destroy  (code/game/gamemodes/clock_cult/clock_items/soul_vessel.dm:34)  may sleep
rt.def("/obj/item/device/mmi/posibrain/soul_vessel/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("all_clockwork_objects", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/device/mmi/posibrain/soul_vessel/proc/examine  (code/game/gamemodes/clock_cult/clock_items/soul_vessel.dm:38)
rt.def("/obj/item/device/mmi/posibrain/soul_vessel/proc/examine", function examine(f: Frame) {
	if (((truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])])) || truthy((rt.istype(live(f.args[0]), T("/mob/dead/observer")) ? 1 : 0))) && truthy(rt.sv(f, "clockwork_desc")))) {
		rt.setSv(f, "desc", rt.sv(f, "clockwork_desc"));
	}
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "desc", rt.initial(f, live(f.src), "desc"));
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/device/mmi/posibrain/soul_vessel/proc/transfer_personality  (code/game/gamemodes/clock_cult/clock_items/soul_vessel.dm:44)  may sleep
rt.def("/obj/item/device/mmi/posibrain/soul_vessel/proc/transfer_personality", function* transfer_personality(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.call(f, P("/proc/add_servant_of_ratvar"), null, [rt.sv(f, "brainmob"), 1]);
	return f.dot;
}, true, { args: ["candidate"] });

// /obj/item/device/mmi/posibrain/soul_vessel/proc/attack_self  (code/game/gamemodes/clock_cult/clock_items/soul_vessel.dm:49)  may sleep
rt.def("/obj/item/device/mmi/posibrain/soul_vessel/proc/attack_self", function* attack_self(f: Frame) {
	if (!truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>You fiddle around with ＀, to no avail.</span>", [live(f.src)])]);
		return 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/device/mmi/posibrain/soul_vessel/proc/attack  (code/game/gamemodes/clock_cult/clock_items/soul_vessel.dm:55)  may sleep
rt.def("/obj/item/device/mmi/posibrain/soul_vessel/proc/attack", function* attack(f: Frame) {
	let H: Value = null, I: Value = null, HE: Value = null, B: Value = null, prev_fakedeath: Value = null;
	f.vars = () => [H, I, HE, B, prev_fakedeath];
	if ((!truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[1])]))) || !truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0)))) {
		yield* g.callSuper(f, [], rt.Args.Same);
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "brainmob")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "brainmob"))))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "key", rt.sv(f, "brainmob")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='nezbere'>\"This vessel is filled, friend. Provide it with a body.\"</span>"]);
		return live(f.dot);
	}
	if (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='nezbere'>\"It would be more wise to revive your allies, friend.\"</span>"]);
		return live(f.dot);
	}
	if (isEqual(rt.gv(f, "stat", (H = live(f.args[0]))), 0)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ must be dead or unconscious for you to claim ＀ mind!</span>", [live(H), (yield* g.callName(f, live(H), "p_their", []))])]);
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "head", live(H)))) {
		if (truthy(rt.bitAnd(rt.gv(f, "flags_inv", (I = rt.fv(f, "head", live(H)))), 256))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀'s head is covered, remove ＀ first!</span>", [live(H), rt.fv(f, "head", live(H))])]);
			return live(f.dot);
		}
	}
	if (truthy(rt.fv(f, "wear_mask", live(H)))) {
		if (truthy(rt.bitAnd(rt.gv(f, "flags_inv", (I = rt.fv(f, "wear_mask", live(H)))), 256))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀'s head is covered, remove ＀ first!</span>", [live(H), rt.fv(f, "wear_mask", live(H))])]);
			return live(f.dot);
		}
	}
	if (!truthy((HE = (yield* g.callName(f, live(H), "get_bodypart", ["head"]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ has no head, and thus no mind to claim!</span>", [live(H)])]);
		return live(f.dot);
	}
	if (!truthy((B = (yield* g.callName(f, live(H), "getorgan", [T("/obj/item/organ/brain")]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ has no brain, and thus no mind to claim!</span>", [live(H)])]);
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "key", live(H)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ has no mind to claim!</span>", [live(H)])]);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/playsound"), null, [live(H), rt.rsc("sound/misc/splort.ogg"), 60, 1, -1]);
	yield* g.call(f, P("/proc/playsound"), null, [live(H), rt.rsc("sound/magic/clockwork/anima_fragment_attack.ogg"), 40, 1, -1]);
	prev_fakedeath = rt.bitAnd(rt.fv(f, "status_flags", live(H)), 8192);
	(rt.modField(f, live(H), "status_flags", 8192, rt.bitOr));
	yield* g.callName(f, live(H), "death", []);
	if (!truthy(live(prev_fakedeath))) {
		(rt.modField(f, live(H), "status_flags", 16769023, rt.bitAnd));
	}
	yield* g.callName(f, live(H), "apply_status_effect", [T("/datum/status_effect/sigil_mark")]);
	rt.setSv(f, "picked_name", "Slave");
	rt.setSv(f, "braintype", rt.sv(f, "picked_name"));
	rt.setFv(f, "timeofhostdeath", rt.sv(f, "brainmob"), rt.fv(f, "timeofdeath", live(H)));
	yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ presses ＀ to ＀'s head, ripping through the skull and carefully extracting the brain!</span>", [live(f.args[1]), live(f.src), live(H)]), fmt("<span class='brass'>You extract ＀'s consciousness from ＀ body, trapping it in the soul vessel.</span>", [live(H), (yield* g.callName(f, live(H), "p_their", []))])]);
	yield* g.srcCall(f, "transfer_personality", live(H));
	yield* g.callName(f, rt.sv(f, "brainmob"), "fully_replace_character_name", [null, fmt("＀ ＀", [rt.sv(f, "braintype"), rt.fv(f, "real_name", live(H))])]);
	rt.setSv(f, "name", fmt("＀ (＀)", [rt.initial(f, live(f.src), "name"), rt.fv(f, "name", rt.sv(f, "brainmob"))]));
	yield* g.callName(f, live(B), "Remove", [live(H)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(B)]);
	yield* g.callName(f, live(H), "update_hair", []);
	return f.dot;
}, true, { args: ["target", "user"] });
