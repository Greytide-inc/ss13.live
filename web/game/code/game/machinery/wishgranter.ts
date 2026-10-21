// From code/game/machinery/wishgranter.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10857, "/obj/machinery/wish_granter", "/obj/machinery", {
	charges: 1,
	insisting: 0,
	use_power: 0,
	anchored: 1,
	name: "wish granter",
	desc: "You're not so sure about this, anymore...",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "syndbeacon",
	density: 1,
});

// /obj/machinery/wish_granter/proc/attack_hand  (code/game/machinery/wishgranter.dm:15)  may sleep
rt.def("/obj/machinery/wish_granter/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let hijack: Value = null;
	f.vars = () => [user, hijack];
	if (rt.le(rt.sv(f, "charges"), 0)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "The Wish Granter lies silent."]);
		return live(f.dot);
	} else {
		if (!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "You feel a dark stirring inside of the Wish Granter, something you want nothing of. Your instincts are better than any man's."]);
			return live(f.dot);
		} else {
			if (truthy((yield* g.call(f, P("/proc/is_special_character"), null, [live(user)])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Even to a heart as dark as yours, you know nothing good will come of this.  Something instinctual makes you pull away."]);
			} else {
				if (!truthy(rt.sv(f, "insisting"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Your first touch makes the Wish Granter stir, listening to you.  Are you really sure you want to do this?"]);
					rt.incSrcVar(f, "insisting", 1, true);
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("You speak.  ＀.  The Wish Granter answers.", [rt.op(f, "PickUnweighted", [5], ["I want the station to disappear", "Humanity is corrupt, mankind must be destroyed", "I want to be rich", "I want to rule the world", "I want immortality."])])]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Your head pounds for a moment, before your vision clears.  You are the avatar of the Wish Granter, and your power is LIMITLESS!  And it's all yours.  You need to make sure no one can take it from you.  No one can know, first."]);
					rt.incSrcVar(f, "charges", -1, true);
					rt.setSv(f, "insisting", 0);
					yield* g.callName(f, rt.fv(f, "dna", live(user)), "add_mutation", ["Hulk"]);
					yield* g.callName(f, rt.fv(f, "dna", live(user)), "add_mutation", ["X Ray Vision"]);
					yield* g.callName(f, rt.fv(f, "dna", live(user)), "add_mutation", ["Cold Resistance"]);
					yield* g.callName(f, rt.fv(f, "dna", live(user)), "add_mutation", ["Telekinesis"]);
					rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "traitors", rt.fv(f, "mind", live(user)), add);
					rt.setFv(f, "special_role", rt.fv(f, "mind", live(user)), "Avatar of the Wish Granter");
					rt.setFv(f, "owner", (hijack = (yield* g.new_(f, T("/datum/objective/hijack"), []))), rt.fv(f, "mind", live(user)));
					rt.modField(f, rt.fv(f, "mind", live(user)), "objectives", live(hijack), add);
					yield* g.callName(f, rt.fv(f, "mind", live(user)), "announce_objectives", []);
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), "You have a very bad feeling about this."]);
				}
			}
		}
	}
	return live(f.dot);
}, true);
