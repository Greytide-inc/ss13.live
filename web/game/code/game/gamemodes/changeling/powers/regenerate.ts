// From code/game/gamemodes/changeling/powers/regenerate.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11247, "/obj/effect/proc_holder/changeling/regenerate", "/obj/effect/proc_holder/changeling", {
	helptext: "Will alert nearby crew if any external limbs are regenerated. Can be used while unconscious.",
	chemical_cost: 10,
	dna_cost: 0,
	req_stat: 1,
	always_keep: 1,
	name: "Regenerate",
	desc: "Allows us to regrow and restore missing external limbs, and vital internal organs, as well as removing shrapnel and restoring blood volume.",
});

// /obj/effect/proc_holder/changeling/regenerate/proc/sting_action  (code/game/gamemodes/changeling/powers/regenerate.dm:14)  may sleep
rt.def("/obj/effect/proc_holder/changeling/regenerate/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let C: Value = null, missing: Value = null, B: Value = null, H: Value = null;
	f.vars = () => [user, C, missing, B, H];
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You feel an itching, both inside and outside as your tissues knit and reknit.</span>"]);
	if (truthy((rt.istype(live(user), T("/mob/living/carbon")) ? 1 : 0))) {
		C = live(user);
		if (truthy(rt.getLen(f, (missing = (yield* g.callName(f, live(C), "get_missing_limbs", [])))))) {
			yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/magic/demon_consume.ogg"), 50, 1]);
			yield* g.callName(f, live(C), "visible_message", [fmt("<span class='warning'>＀'s missing limbs reform, making a loud, grotesque sound!</span>", [live(user)]), "<span class='userdanger'>Your limbs regrow, making a loud, crunchy sound and giving you great pain!</span>", "<span class='italics'>You hear organic matter ripping and tearing!</span>"]);
			yield* g.callName(f, live(C), "emote", ["scream"]);
			yield* g.callName(f, live(C), "regenerate_limbs", [1]);
		}
		yield* g.callName(f, live(C), "regenerate_organs", []);
		if (!truthy((yield* g.callName(f, live(user), "getorganslot", ["brain"])))) {
			yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/organ/brain/changeling_brain"), []))), "Insert", [live(C)]);
		}
	}
	if (truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		yield* g.callName(f, (H = live(user)), "restore_blood", []);
		yield* g.callName(f, live(H), "remove_all_embedded_objects", []);
	}
	return 1;
}, true);
