// From code/datums/martial/boxing.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(568, "/datum/martial_art/boxing", "/datum/martial_art", {
	name: "Boxing",
});

// /datum/martial_art/boxing/proc/disarm_act  (code/datums/martial/boxing.dm:5)
rt.def("/datum/martial_art/boxing/proc/disarm_act", function disarm_act(f: Frame, A: Value, D: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(A), "<span class='warning'>Can't disarm while boxing!</span>"]);
	return 1;
});

// /datum/martial_art/boxing/proc/grab_act  (code/datums/martial/boxing.dm:9)
rt.def("/datum/martial_art/boxing/proc/grab_act", function grab_act(f: Frame, A: Value, D: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(A), "<span class='warning'>Can't grab while boxing!</span>"]);
	return 1;
});

// /datum/martial_art/boxing/proc/harm_act  (code/datums/martial/boxing.dm:14)  may sleep
rt.def("/datum/martial_art/boxing/proc/harm_act", function* harm_act(f: Frame, A: Value, D: Value) {
	let atk_verb: Value = null, damage: Value = null, affecting: Value = null, armor_block: Value = null, knockout_prob: Value = null;
	f.vars = () => [A, D, atk_verb, damage, affecting, armor_block, knockout_prob];
	yield* g.callName(f, live(A), "do_attack_animation", [live(D), "punch"]);
	atk_verb = rt.op(f, "PickUnweighted", [3], ["left hook", "right hook", "straight punch"]);
	if (!truthy((damage = add((yield* g.call(f, P("/proc/rand"), null, [5, 8])), rt.gv(f, "punchdamagelow", rt.gv(f, "species", rt.fv(f, "dna", live(A)))))))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(D)), rt.gv(f, "miss_sound", rt.gv(f, "species", rt.fv(f, "dna", live(A)))), 25, 1, -1]);
		yield* g.callName(f, live(D), "visible_message", [fmt("<span class='warning'>＀ has attempted to ＀ ＀!</span>", [live(A), live(atk_verb), live(D)]), fmt("<span class='userdanger'>＀ has attempted to ＀ ＀!</span>", [live(A), live(atk_verb), live(D)]), null, 3]);
		yield* g.call(f, P("/proc/add_logs"), null, [live(A), live(D), "attempted to hit", live(atk_verb)]);
		return 0;
	}
	affecting = (yield* g.callName(f, live(D), "get_bodypart", [(yield* g.call(f, P("/proc/ran_zone"), null, [rt.fv(f, "zone_selected", live(A))]))]));
	armor_block = (yield* g.callName(f, live(D), "run_armor_check", [live(affecting), "melee"]));
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(D)), rt.gv(f, "attack_sound", rt.gv(f, "species", rt.fv(f, "dna", live(A)))), 25, 1, -1]);
	yield* g.callName(f, live(D), "visible_message", [fmt("<span class='danger'>＀ has ＀ed ＀!</span>", [live(A), live(atk_verb), live(D)]), fmt("<span class='userdanger'>＀ has ＀ed ＀!</span>", [live(A), live(atk_verb), live(D)]), null, 3]);
	yield* g.callName(f, live(D), "apply_damage", [live(damage), "stamina", live(affecting), live(armor_block)]);
	yield* g.call(f, P("/proc/add_logs"), null, [live(A), live(D), "punched (boxing) "]);
	if (rt.gt((yield* g.callName(f, live(D), "getStaminaLoss", [])), 50)) {
		knockout_prob = add((yield* g.callName(f, live(D), "getStaminaLoss", [])), (yield* g.call(f, P("/proc/rand"), null, [-15, 15])));
		if ((!isEqual(rt.fv(f, "stat", live(D)), 2) && truthy(rt.op(f, "Prob", [], [live(knockout_prob)])))) {
			yield* g.callName(f, live(D), "visible_message", [fmt("<span class='danger'>＀ has knocked ＀ out with a haymaker!</span>", [live(A), live(D)]), fmt("<span class='userdanger'>＀ has knocked ＀ out with a haymaker!</span>", [live(A), live(D)])]);
			yield* g.callName(f, live(D), "apply_effect", [200, "knockdown", live(armor_block)]);
			yield* g.callName(f, live(D), "SetSleeping", [100]);
			yield* g.callName(f, live(D), "forcesay", [rt.gl("hit_appends")]);
			yield* g.call(f, P("/proc/add_logs"), null, [live(A), live(D), "knocked out (boxing) "]);
		} else {
			if (truthy(rt.fv(f, "lying", live(D)))) {
				yield* g.callName(f, live(D), "forcesay", [rt.gl("hit_appends")]);
			}
		}
	}
	return 1;
}, true);

rt.type(7654, "/obj/item/clothing/gloves/boxing", "/obj/item/clothing/gloves", {
	style: null,
	name: "boxing gloves",
	desc: "Because you really needed another excuse to punch your crewmates.",
	icon_state: "boxing",
	item_state: "boxing",
	equip_delay_other: 60,
	species_exception: null,
});

// /obj/item/clothing/gloves/boxing/proc/<init>  (code/datums/martial/boxing.dm:51)
rt.def("/obj/item/clothing/gloves/boxing/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "style", rt.new_(f, T("/datum/martial_art/boxing"), []));
	$0 = $0;
	rt.setSv(f, "species_exception", rt.list(T("/datum/species/golem")));
	return f.dot;
});

// /obj/item/clothing/gloves/boxing/proc/equipped  (code/datums/martial/boxing.dm:54)
rt.def("/obj/item/clothing/gloves/boxing/proc/equipped", function equipped(f: Frame, user: Value, slot: Value) {
	let H: Value = null;
	f.vars = () => [H];
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (isEqual(live(slot), 9)) {
		H = live(user);
		rt.callName(f, rt.sv(f, "style"), "teach", [live(H), 1]);
	}
	return live(f.dot);
});

// /obj/item/clothing/gloves/boxing/proc/dropped  (code/datums/martial/boxing.dm:62)
rt.def("/obj/item/clothing/gloves/boxing/proc/dropped", function dropped(f: Frame, user: Value) {
	let H: Value = null;
	f.vars = () => [H];
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (isEqual(rt.callName(f, (H = live(user)), "get_item_by_slot", [9]), live(f.src))) {
		rt.callName(f, rt.sv(f, "style"), "remove", [live(H)]);
	}
	return live(f.dot);
});
