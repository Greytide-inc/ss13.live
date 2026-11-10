// Based on /tg/station's code/modules/events/wizard/imposter.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(343, "/datum/round_event/wizard/imposter", "/datum/round_event/wizard", {});

// imposter.dm:10
rt.def("/datum/round_event/wizard/imposter/proc/start", function* start(f: Frame) {
	let M: Value = null, W: Value = null, candidates: Value = null, C: Value = null, I: Value = null, protect_objective: Value = null;
	for (M of each(GLOB.SSticker.mode.wizards, T("/datum/mind"))) {
		if (!rt.istype(M.current, T("/mob/living/carbon/human"))) {
			continue;
		}
		W = M.current;
		if (!(candidates = get_candidates("wizard"))) {
			return f.dot;
		}
		C = pick(candidates);
		yield* new_(T("/obj/effect/particle_effect/smoke"), W.loc);
		I = (yield* new_(T("/mob/living/carbon/human"), W.loc));
		yield* W.dna.transfer_identity(I, { transfer_SE: 1 });
		I.real_name = I.dna.real_name;
		I.name = I.dna.real_name;
		yield* I.updateappearance({ mutcolor_update: 1 });
		yield* I.domutcheck();
		if (W.ears) {
			yield* I.equip_to_slot_or_del((yield* new_(W.ears.type)), slot_ears);
		}
		if (W.w_uniform) {
			yield* I.equip_to_slot_or_del((yield* new_(W.w_uniform.type)), slot_w_uniform);
		}
		if (W.shoes) {
			yield* I.equip_to_slot_or_del((yield* new_(W.shoes.type)), slot_shoes);
		}
		if (W.wear_suit) {
			yield* I.equip_to_slot_or_del((yield* new_(W.wear_suit.type)), slot_wear_suit);
		}
		if (W.head) {
			yield* I.equip_to_slot_or_del((yield* new_(W.head.type)), slot_head);
		}
		if (W.back) {
			yield* I.equip_to_slot_or_del((yield* new_(W.back.type)), slot_back);
		}
		I.key = C.key;
		yield* I.mind.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/targeted/area_teleport/teleport"), null)));
		yield* I.mind.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/targeted/turf_teleport/blink"), null)));
		yield* I.mind.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/targeted/ethereal_jaunt"), null)));
		GLOB.SSticker.mode.apprentices += I.mind;
		I.mind.special_role = "imposter";
		(protect_objective = (yield* new_(T("/datum/objective/protect")))).owner = I.mind;
		protect_objective.target = W.mind;
		protect_objective.explanation_text = `Protect ${W.real_name}, the wizard.`;
		I.mind.objectives += protect_objective;
		GLOB.SSticker.mode.update_wiz_icons_added(I.mind);
		I.log_message("<font color='red'>Is an imposter!</font>", "Attack log");
		to_chat(I, "<B>You are an imposter! Trick and confuse the crew to misdirect malice from your handsome original!</B>");
		rt.op(f, "Output", [], [I, sound(rt.rsc("sound/effects/magic.ogg"))], false);
	}
	return f.dot;
}, true);
