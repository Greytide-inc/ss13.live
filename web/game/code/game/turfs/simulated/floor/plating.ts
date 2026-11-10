// Based on /tg/station's code/game/turfs/simulated/floor/plating.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4507, "/turf/open/floor/plating", "/turf/open/floor", {
	name: "plating",
	icon_state: "plating",
	intact: 0,
});

// plating.dm:17
rt.def("/turf/open/floor/plating/proc/Initialize", function* Initialize(f: Frame) {
	if (!this.broken_states) {
		this.broken_states = GLOB.plating_broken_states; // tg_js: shared read-only lists (_globals.ts), not a copy per tile
	}
	if (!this.burnt_states) {
		this.burnt_states = GLOB.plating_burnt_states;
	}
	yield* parent_proc();
	this.icon_plating = this.icon_state;
	return f.dot;
}, true);

// plating.dm:25
rt.def("/turf/open/floor/plating/proc/update_icon", function update_icon(f: Frame) {
	if (!parent_proc()) {
		return f.dot;
	}
	if (!(!this.broken && !this.burnt)) return f.dot;
	this.icon_state = this.icon_plating;
	return f.dot;
});

// plating.dm:31
rt.def("/turf/open/floor/plating/proc/attackby", function* attackby(f: Frame, C: Value, user: Value, params: Value) {
	let R: Value = null, W: Value = null, _T: Value = null, L: Value = null, F: Value = null, welder: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (rt.istype(C, T("/obj/item/stack/rods"))) {
		if (this.broken || this.burnt) {
			to_chat(user, "<span class='warning'>Repair the plating first!</span>");
			return f.dot;
		}
		if ((R = C).get_amount() < 2) {
			to_chat(user, "<span class='warning'>You need two rods to make a reinforced floor!</span>");
			return f.dot;
		} else {
			to_chat(user, "<span class='notice'>You begin reinforcing the floor...</span>");
			if (yield* do_after(user, 30, { target: this })) {
				if (R.get_amount() >= 2 && !rt.istype(this, T("/turf/open/floor/engine"))) {
					yield* this.ChangeTurf(T("/turf/open/floor/engine"));
					playsound(this, rt.rsc("sound/items/deconstruct.ogg"), 80, 1);
					yield* R.use(2);
					to_chat(user, "<span class='notice'>You reinforce the floor.</span>");
				}
				return f.dot;
			}
		}
	} else if (rt.istype(C, T("/obj/item/stack/tile"))) {
		if (!this.broken && !this.burnt) {
			if (!(yield* (W = C).use(1))) {
				return f.dot;
			}
			_T = (yield* this.ChangeTurf(W.turf_type));
			if (rt.istype(W, T("/obj/item/stack/tile/light"))) {
				L = W;
				(F = _T).state = L.state;
			}
			playsound(this, rt.rsc("sound/weapons/genhit.ogg"), 50, 1);
		} else {
			to_chat(user, "<span class='warning'>This section is too damaged to support a tile! Use a welder to fix the damage.</span>");
		}
	} else {
		if (!rt.istype(C, T("/obj/item/weapon/weldingtool"))) return f.dot;
		if (!((welder = C).isOn() && (this.broken || this.burnt))) return f.dot;
		if (!(yield* welder.remove_fuel(0, user))) return f.dot;
		to_chat(user, "<span class='danger'>You fix some dents on the broken plating.</span>");
		playsound(this, welder.usesound, 80, 1);
		this.icon_state = this.icon_plating;
		this.burnt = 0;
		this.broken = 0;
	}
	return f.dot;
}, true);
