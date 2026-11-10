// Based on /tg/station's code/modules/flufftext/Dreaming.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// Dreaming.dm:12
rt.def("/mob/living/carbon/proc/dream", function* dream(f: Frame) {
	let i: Value = null, dream_image: Value = null;
	let $e: any;
	this.dreaming = 1;
	let dreams: Value = list("an ID card", "a bottle", "a familiar face", "a crewmember", "a toolbox", "a security officer", "the captain", "voices from all around", "deep space", "a doctor", "the engine", "a traitor", "an ally", "darkness", "light", "a scientist", "a monkey", "a catastrophe", "a loved one", "a gun", "warmth", "freezing", "the sun", "a hat", "the Luna", "a ruined station", "a planet", "plasma", "air", "the medical bay", "the bridge", "blinking lights", "a blue light", "an abandoned laboratory", "Nanotrasen", "The Syndicate", "blood", "healing", "power", "respect", "riches", "space", "a crash", "happiness", "pride", "a fall", "water", "flames", "ice", "melons", "flying");
	rt.forRange(f, 0, 1, rand(1, rand(3, 7)), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		dreams -= (dream_image = pick(dreams));
		to_chat(this, `<span class='notice'><i>... ${dream_image} ...</i></span>`);
		yield* sleep(rand(40, 70));
		if (this.stat != 1 || this.InCritical()) {
			break;
		}
	}
	rt.endFor(f, 0);
	this.dreaming = 0;
	return 1;
}, true, { waitfor: false });

// Dreaming.dm:23
rt.def("/mob/living/carbon/proc/handle_dreams", function handle_dreams(f: Frame) {
	if (!(prob(5) && !this.dreaming)) return f.dot;
	this.dream();
	return f.dot;
});
