// From code/modules/events/wizard/imposter.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(343, "/datum/round_event/wizard/imposter", "/datum/round_event/wizard", {});

// /datum/round_event/wizard/imposter/proc/start  (code/modules/events/wizard/imposter.dm:10)  may sleep
rt.def("/datum/round_event/wizard/imposter/proc/start", function* start(f: Frame) {
	let M: Value = null, W: Value = null, candidates: Value = null, C: Value = null, I: Value = null, protect_objective: Value = null;
	let $e: any;
	f.vars = () => [M, W, candidates, C, I, protect_objective, $e];
	M = null;
	rt.forList(f, 0, rt.gv(f, "wizards", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (!truthy((rt.istype(rt.fv(f, "current", live(M)), T("/mob/living/carbon/human")) ? 1 : 0))) {
			continue;
		}
		W = rt.fv(f, "current", live(M));
		if (!truthy((candidates = (yield* g.call(f, P("/proc/get_candidates"), null, ["wizard"]))))) {
			return live(f.dot);
		}
		C = rt.op(f, "PickUnweighted", [1], [live(candidates)]);
		yield* g.new_(f, T("/obj/effect/particle_effect/smoke"), [rt.fv(f, "loc", live(W))]);
		I = (yield* g.new_(f, T("/mob/living/carbon/human"), [rt.fv(f, "loc", live(W))]));
		yield* g.callName(f, rt.fv(f, "dna", live(W)), "transfer_identity", [null, live(I), "transfer_SE", 1], rt.Args.Named);
		rt.setFv(f, "real_name", live(I), rt.gv(f, "real_name", rt.fv(f, "dna", live(I))));
		rt.setFv(f, "name", live(I), rt.gv(f, "real_name", rt.fv(f, "dna", live(I))));
		yield* g.callName(f, live(I), "updateappearance", ["mutcolor_update", 1], rt.Args.Named);
		yield* g.callName(f, live(I), "domutcheck", []);
		if (truthy(rt.fv(f, "ears", live(W)))) {
			yield* g.callName(f, live(I), "equip_to_slot_or_del", [(yield* g.new_(f, rt.gv(f, "type", rt.fv(f, "ears", live(W))), [])), 7]);
		}
		if (truthy(rt.fv(f, "w_uniform", live(W)))) {
			yield* g.callName(f, live(I), "equip_to_slot_or_del", [(yield* g.new_(f, rt.gv(f, "type", rt.fv(f, "w_uniform", live(W))), [])), 14]);
		}
		if (truthy(rt.fv(f, "shoes", live(W)))) {
			yield* g.callName(f, live(I), "equip_to_slot_or_del", [(yield* g.new_(f, rt.gv(f, "type", rt.fv(f, "shoes", live(W))), [])), 12]);
		}
		if (truthy(rt.fv(f, "wear_suit", live(W)))) {
			yield* g.callName(f, live(I), "equip_to_slot_or_del", [(yield* g.new_(f, rt.gv(f, "type", rt.fv(f, "wear_suit", live(W))), [])), 13]);
		}
		if (truthy(rt.fv(f, "head", live(W)))) {
			yield* g.callName(f, live(I), "equip_to_slot_or_del", [(yield* g.new_(f, rt.gv(f, "type", rt.fv(f, "head", live(W))), [])), 11]);
		}
		if (truthy(rt.fv(f, "back", live(W)))) {
			yield* g.callName(f, live(I), "equip_to_slot_or_del", [(yield* g.new_(f, rt.gv(f, "type", rt.fv(f, "back", live(W))), [])), 1]);
		}
		rt.setFv(f, "key", live(I), rt.fv(f, "key", live(C)));
		yield* g.callName(f, rt.fv(f, "mind", live(I)), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/area_teleport/teleport"), [null]))]);
		yield* g.callName(f, rt.fv(f, "mind", live(I)), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/turf_teleport/blink"), [null]))]);
		yield* g.callName(f, rt.fv(f, "mind", live(I)), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/ethereal_jaunt"), [null]))]);
		rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "apprentices", rt.fv(f, "mind", live(I)), add);
		rt.setFv(f, "special_role", rt.fv(f, "mind", live(I)), "imposter");
		rt.setFv(f, "owner", (protect_objective = (yield* g.new_(f, T("/datum/objective/protect"), []))), rt.fv(f, "mind", live(I)));
		rt.setFv(f, "target", live(protect_objective), rt.fv(f, "mind", live(W)));
		rt.setFv(f, "explanation_text", live(protect_objective), fmt("Protect ＀, the wizard.", [rt.fv(f, "real_name", live(W))]));
		rt.modField(f, rt.fv(f, "mind", live(I)), "objectives", live(protect_objective), add);
		yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_wiz_icons_added", [rt.fv(f, "mind", live(I))]);
		yield* g.callName(f, live(I), "log_message", ["<font color='red'>Is an imposter!</font>", "Attack log"]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(I), "<B>You are an imposter! Trick and confuse the crew to misdirect malice from your handsome original!</B>"]);
		rt.op(f, "Output", [], [live(I), (yield* g.call(f, P("/proc/sound"), null, [rt.rsc("sound/effects/magic.ogg")]))], false);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
