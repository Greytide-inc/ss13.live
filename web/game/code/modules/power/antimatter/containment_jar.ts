// Based on /tg/station's code/modules/power/antimatter/containment_jar.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(7641, "/obj/item/weapon/am_containment", "/obj/item/weapon", {
	fuel: 10000,
	fuel_max: 10000,
	stability: 100,
	anchored: 0,
	throw_speed: 1,
	throw_range: 2,
	name: "antimatter containment jar",
	desc: "Holds antimatter.",
	icon: rt.rsc("icons/obj/machines/antimatter.dmi"),
	icon_state: "jar",
	density: 0,
	force: 8,
	throwforce: 10,
});

// containment_jar.dm:19
rt.def("/obj/item/weapon/am_containment/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	if (severity === 1) {
		yield* explosion(rt.getStep(f, this, 0), 1, 2, 3, 5);
		if (this) {
			yield* qdel(this);
		}
	} else if (severity === 2) {
		if (prob(this.fuel / 10 - this.stability)) {
			yield* explosion(rt.getStep(f, this, 0), 1, 2, 3, 5);
			if (this) {
				yield* qdel(this);
			}
			return f.dot;
		}
		this.stability -= 40;
	} else if (severity === 3) {
		this.stability -= 20;
	}
	return f.dot;
}, true, { waitfor: false });

// containment_jar.dm:37
rt.def("/obj/item/weapon/am_containment/proc/usefuel", function usefuel(f: Frame, wanted: Value) {
	if (this.fuel < wanted) {
		wanted = this.fuel;
	}
	this.fuel -= wanted;
	return wanted;
});
