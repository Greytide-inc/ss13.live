// Based on /tg/station's code/datums/ruins.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(756, "/datum/map_template/ruin", "/datum/map_template", {
	id: null,
	description: "In the middle of a clearing in the rockface, there's a chest filled with gold coins with Spanish engravings. How is there a wooden container filled with 18th century coinage in the middle of a lavawracked hellscape? It is clearly a mystery.",
	cost: null,
	allow_duplicates: 1,
	prefix: null,
	suffix: null,
	name: null,
});

// ruins.dm:16
rt.def("/datum/map_template/ruin/proc/New", function* New(f: Frame) {
	if (!this.name && this.id) {
		this.name = this.id;
	}
	this.mappath = this.prefix + this.suffix;
	yield* parent_proc({ path: this.mappath });
	return f.dot;
}, true);
