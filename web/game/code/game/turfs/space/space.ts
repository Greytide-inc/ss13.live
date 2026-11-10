// Based on /tg/station's code/game/turfs/space/space.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4498, "/turf/open/space", "/turf/open", {
	destination_z: null,
	destination_x: null,
	destination_y: null,
	icon: rt.rsc("icons/turf/space.dmi"),
	icon_state: "0",
	name: "０space",
	intact: 0,
	temperature: 2.7,
	thermal_conductivity: 0.4,
	heat_capacity: 700000,
	plane: -95,
	light_power: 0.25,
	dynamic_lighting: 0,
}, { global: { space_gas: 690 } });

// space.dm:26
rt.def("/turf/open/space/proc/Initialize", function Initialize(f: Frame) {
	this.icon_state = `${rt.bitXor(this.x + this.y, rt.op(f, "BitNot", [], [this.x * this.y]) + this.z) % 25}`;
	this.air = GLOB.space_gas;
	if (this.initialized) {
		stack_trace(`Warning: ${this}(${this.type}) initialized multiple times!`);
	}
	this.initialized = 1;
	let A: Value = this.loc;
	if (!this.dynamic_lighting && A.dynamic_lighting) {
		this.add_overlay(T("/obj/effect/fullbright"));
	}
	if (this.requires_activation) {
		GLOB.SSair.add_to_active(this);
	}
	if (this.light_power && this.light_range) {
		this.update_light();
	}
	if (this.opacity) {
		this.has_opaque_atom = 1;
	}
	return INITIALIZE_HINT_NORMAL;
});

// space.dm:50
rt.def("/turf/open/space/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	if (!this.destination_z) return f.dot;
	let _T: Value = rt.locate(this.destination_x, this.destination_y, this.destination_z);
	yield* user.forceMove(_T);
	return f.dot;
}, true);

// space.dm:62
rt.def("/turf/open/space/proc/AfterChange", function* AfterChange(f: Frame) {
	yield* parent_proc();
	this.atmos_overlay_types = null;
	return f.dot;
}, true);

// space.dm:69
rt.def("/turf/open/space/proc/update_starlight", function update_starlight(f: Frame) {
	let t: Value = null;
	if (!GLOB.config.starlight) return f.dot;
	for (t of each(block(rt.locate(max(this.x - 1, 1), max(this.y - 1, 1), this.z), rt.locate(min(this.x + 1, rt.world().maxx), min(this.y + 1, rt.world().maxy), this.z)))) {
		if (rt.istype(t, T("/turf/open/space"))) {
			continue;
		}
		this.set_light(2);
		return f.dot;
	}
	this.set_light(0);
	return f.dot;
});

// space.dm:79
rt.def("/turf/open/space/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// space.dm:85
rt.def("/turf/open/space/proc/attackby", function* attackby(f: Frame, C: Value, user: Value, params: Value) {
	let R: Value = null, L: Value = null, W: Value = null, L_0: Value = null, S: Value = null;
	yield* parent_proc();
	if (!this.CanBuildHere()) {
		return f.dot;
	}
	if (rt.istype(C, T("/obj/item/stack/rods"))) {
		R = C;
		L = rt.locateIn(f, T("/obj/structure/lattice"), this);
		if (W = rt.locateIn(f, T("/obj/structure/lattice/catwalk"), this)) {
			to_chat(user, "<span class='warning'>There is already a catwalk here!</span>");
			return f.dot;
		}
		if (L) {
			if (yield* R.use(1)) {
				to_chat(user, "<span class='notice'>You construct a catwalk.</span>");
				playsound(this, rt.rsc("sound/weapons/genhit.ogg"), 50, 1);
				yield* new_(T("/obj/structure/lattice/catwalk"), this);
			} else {
				to_chat(user, "<span class='warning'>You need two rods to build a catwalk!</span>");
			}
			return f.dot;
		}
		if (yield* R.use(1)) {
			to_chat(user, "<span class='notice'>You construct a lattice.</span>");
			playsound(this, rt.rsc("sound/weapons/genhit.ogg"), 50, 1);
			yield* this.ReplaceWithLattice();
		} else {
			to_chat(user, "<span class='warning'>You need one rod to build a lattice.</span>");
		}
		return f.dot;
	}
	if (!rt.istype(C, T("/obj/item/stack/tile/plasteel"))) return f.dot;
	if (L_0 = rt.locateIn(f, T("/obj/structure/lattice"), this)) {
		if (yield* (S = C).use(1)) {
			yield* qdel(L_0);
			playsound(this, rt.rsc("sound/weapons/genhit.ogg"), 50, 1);
			to_chat(user, "<span class='notice'>You build a floor.</span>");
			yield* this.ChangeTurf(T("/turf/open/floor/plating"));
		} else {
			to_chat(user, "<span class='warning'>You need one floor tile to build a floor!</span>");
		}
	} else {
		to_chat(user, "<span class='warning'>The plating is going to need some support! Place metal rods first.</span>");
	}
	return f.dot;
}, true);

// space.dm:125
rt.def("/turf/open/space/proc/Entered", function* Entered(f: Frame, A: Value) {
	let L: Value = null, _T: Value = null;
	yield* parent_proc();
	if (!A || this != A.loc) {
		return f.dot;
	}
	if (!this.destination_z) return f.dot;
	A.x = this.destination_x;
	A.y = this.destination_y;
	A.z = this.destination_z;
	if (rt.istype(A, T("/mob/living"))) {
		if ((L = A).pulling) {
			_T = rt.getStep(f, L.loc, turn(A.dir, 180));
			L.pulling.loc = _T;
		}
	}
	yield* stoplag();
	yield* A.newtonian_move(A.inertia_dir);
	return f.dot;
}, true);

// space.dm:151
rt.def("/turf/open/space/proc/can_have_cabling", function can_have_cabling(f: Frame) {
	if (rt.locateIn(f, T("/obj/structure/lattice/catwalk"), this)) {
		return 1;
	}
	return 0;
});

// space.dm:156
rt.def("/turf/open/space/proc/is_transition_turf", function is_transition_turf(f: Frame) {
	if (!(this.destination_x || this.destination_y || this.destination_z)) return f.dot;
	return 1;
});

// space.dm:164
rt.def("/turf/open/space/proc/get_smooth_underlay_icon", function get_smooth_underlay_icon(f: Frame, underlay_appearance: Value, asking_turf: Value, adjacency_dir: Value) {
	underlay_appearance.icon = rt.rsc("icons/turf/space.dmi");
	underlay_appearance.icon_state = `${rt.bitXor(this.x + this.y, rt.op(f, "BitNot", [], [this.x * this.y]) + this.z) % 25}`;
	underlay_appearance.plane = PLANE_SPACE;
	return 1;
});

// space.dm:171
rt.def("/turf/open/space/proc/rcd_vals", function rcd_vals(f: Frame, user: Value, the_rcd: Value) {
	let L: Value = null;
	if (!this.CanBuildHere()) {
		return 0;
	}
	if (the_rcd.mode === RCD_FLOORWALL) {
		if (L = rt.locateIn(f, T("/obj/structure/lattice"), this)) {
			return rt.alist(f, ["mode", RCD_FLOORWALL, "delay", 0, "cost", RCD_FLOORWALL]);
		}
		return rt.alist(f, ["mode", RCD_FLOORWALL, "delay", 0, "cost", 3]);
	}
	return 0;
});

// space.dm:183
rt.def("/turf/open/space/proc/rcd_act", function* rcd_act(f: Frame, user: Value, the_rcd: Value, passed_mode: Value) {
	if (passed_mode === 1) {
		to_chat(user, "<span class='notice'>You build a floor.</span>");
		yield* this.ChangeTurf(T("/turf/open/floor/plating"));
		return 1;
	}
	return 0;
}, true);

// space.dm:191
rt.def("/turf/open/space/proc/ReplaceWithLattice", function* ReplaceWithLattice(f: Frame) {
	let dest_x: Value = this.destination_x;
	let dest_y: Value = this.destination_y;
	let dest_z: Value = this.destination_z;
	yield* parent_proc();
	this.destination_x = dest_x;
	this.destination_y = dest_y;
	this.destination_z = dest_z;
	return f.dot;
}, true);
