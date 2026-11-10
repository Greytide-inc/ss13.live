// Based on /tg/station's code/modules/surgery/organs/appendix.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9486, "/obj/item/organ/appendix", "/obj/item/organ", {
	inflamed: 0,
	name: "appendix",
	icon_state: "appendix",
	zone: "groin",
	slot: "appendix",
});

// appendix.dm:10
rt.def("/obj/item/organ/appendix/proc/update_icon", function update_icon(f: Frame) {
	if (this.inflamed) {
		this.icon_state = "appendixinflamed";
		this.name = "inflamed appendix";
	} else {
		this.icon_state = "appendix";
		this.name = "appendix";
	}
	return f.dot;
});

// appendix.dm:17
rt.def("/obj/item/organ/appendix/proc/Remove", function* Remove(f: Frame) {
	let A: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	for (A of each(f.args[0].viruses, T("/datum/disease/appendicitis"))) {
		yield* A.cure();
		this.inflamed = 1;
	}
	yield* this.update_icon();
	yield* parent_proc();
	return f.dot;
}, true, { args: ["M", "special"] });

// appendix.dm:24
rt.def("/obj/item/organ/appendix/proc/Insert", function* Insert(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	if (!this.inflamed) return f.dot;
	yield* f.args[0].AddDisease((yield* new_(T("/datum/disease/appendicitis"))));
	return f.dot;
}, true, { args: ["M", "special"] });

// appendix.dm:29
rt.def("/obj/item/organ/appendix/proc/prepare_eat", function* prepare_eat(f: Frame) {
	let S: Value = (yield* parent_proc());
	if (this.inflamed) {
		yield* S.reagents.add_reagent("bad_food", 5);
	}
	return S;
}, true);
