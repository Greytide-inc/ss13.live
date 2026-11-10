// Based on /tg/station's code/modules/surgery/organs/tails.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(9522, "/obj/item/organ/tail/cat", "/obj/item/organ/tail", {
	name: "cat tail",
	desc: "Who's wagging now?",
	icon_state: "severedtail",
});

// tails.dm:13
rt.def("/obj/item/organ/tail/cat/proc/Insert", function* Insert(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	yield* parent_proc();
	this.color = f.args[0].hair_color;
	rt.setAt(f.args[0].dna.features, "tail_human", "Cat");
	yield* f.args[0].update_body();
	return f.dot;
}, true, { args: ["H", "special", "drop_if_replaced"] });

// tails.dm:19
rt.def("/obj/item/organ/ears/cat/proc/Remove", function* Remove(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	yield* f.args[0].endTailWag();
	rt.setAt(f.args[0].dna.features, "tail_human", "None");
	this.color = f.args[0].hair_color;
	yield* f.args[0].update_body();
	return f.dot;
}, true, { args: ["H", "special"] });
