// From code/modules/flufftext/Dreaming.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/proc/dream  (code/modules/flufftext/Dreaming.dm:12)  may sleep
rt.def("/mob/living/carbon/proc/dream", function* dream(f: Frame) {
	let dreams: Value = null, i: Value = null, dream_image: Value = null;
	let $e: any;
	f.vars = () => [dreams, i, dream_image, $e];
	rt.setSv(f, "dreaming", 1);
	dreams = rt.list("an ID card", "a bottle", "a familiar face", "a crewmember", "a toolbox", "a security officer", "the captain", "voices from all around", "deep space", "a doctor", "the engine", "a traitor", "an ally", "darkness", "light", "a scientist", "a monkey", "a catastrophe", "a loved one", "a gun", "warmth", "freezing", "the sun", "a hat", "the Luna", "a ruined station", "a planet", "plasma", "air", "the medical bay", "the bridge", "blinking lights", "a blue light", "an abandoned laboratory", "Nanotrasen", "The Syndicate", "blood", "healing", "power", "respect", "riches", "space", "a crash", "happiness", "pride", "a fall", "water", "flames", "ice", "melons", "flying");
	i = null;
	rt.forRange(f, 0, 1, (yield* g.call(f, P("/proc/rand"), null, [1, (yield* g.call(f, P("/proc/rand"), null, [3, 7]))])), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		(dreams = rt.modify(live(dreams), (dream_image = rt.op(f, "PickUnweighted", [1], [live(dreams)])), subtract));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='notice'><i>... ＀ ...</i></span>", [live(dream_image)])]);
		yield* g.call(f, P("/proc/sleep"), null, [(yield* g.call(f, P("/proc/rand"), null, [40, 70]))]);
		if ((!isEqual(rt.sv(f, "stat"), 1) || truthy((yield* g.srcCall(f, "InCritical"))))) {
			break;
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "dreaming", 0);
	return 1;
}, true, { waitfor: false });

// /mob/living/carbon/proc/handle_dreams  (code/modules/flufftext/Dreaming.dm:23)
rt.def("/mob/living/carbon/proc/handle_dreams", function handle_dreams(f: Frame) {
	if (!(truthy(rt.op(f, "Prob", [], [5])) && !truthy(rt.sv(f, "dreaming")))) return f.dot;
	rt.callSrc(f, "dream", []);
	return f.dot;
});
