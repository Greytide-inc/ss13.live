// Based on /tg/station's code/game/machinery/mass_driver.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10806, "/obj/machinery/mass_driver", "/obj/machinery", {
	power: 1,
	code: 1,
	id: 1,
	drive_range: 50,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 2,
	active_power_usage: 50,
	name: "mass driver",
	desc: "The finest in spring-loaded piston toy technology, now on a space station near you.",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "mass_driver",
});

// mass_driver.dm:17
rt.def("/obj/machinery/mass_driver/proc/drive", function* drive(f: Frame, amount: Value) {
	let O_limit: Value = null, O: Value = null;
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	yield* this.use_power(500);
	let target: Value = get_edge_target_turf(this, this.dir);
	for (O of each(this.loc, T("/atom/movable"))) {
		if (!O.anchored || rt.istype(O, T("/obj/mecha"))) {
			O_limit++;
			if (O_limit >= 20) {
				this.audible_message(`<span class='notice'>${this} lets out a screech, it doesn't seem to be able to handle the load.</span>`);
				break;
			}
			yield* this.use_power(500);
			yield* O.throw_at(target, this.drive_range * this.power, this.power);
		}
	}
	flick("mass_driver1", this);
	return f.dot;
}, true);

// mass_driver.dm:34
rt.def("/obj/machinery/mass_driver/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	yield* this.drive();
	yield* parent_proc(severity);
	return f.dot;
}, true);
