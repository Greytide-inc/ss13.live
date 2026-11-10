// Based on /tg/station's code/modules/hydroponics/sample.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(9985, "/obj/item/seeds/sample", "/obj/item/seeds", {
	sample_color: "#FFFFFF",
	name: "plant sample",
	icon_state: "sample-empty",
	potency: -1,
	yield: -1,
});

// sample.dm:9
rt.def("/obj/item/seeds/sample/proc/New", function* New(f: Frame) {
	let filling: Value = null;
	yield* parent_proc();
	if (!this.sample_color) return f.dot;
	(filling = mutable_appearance(this.icon, "sample-filling")).color = this.sample_color;
	this.add_overlay(filling);
	return f.dot;
}, true);

// sample.dm:16
rt.def("/obj/item/seeds/sample/proc/get_analyzer_text", function get_analyzer_text(f: Frame) {
	return " The DNA of this sample is damaged beyond recovery, it can't support life on its own.\n*---------*";
});
