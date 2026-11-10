// Based on /tg/station's code/game/turfs/simulated/chasm.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(4793, "/turf/open/chasm", "/turf/open", {
	drop_x: 1,
	drop_y: 1,
	drop_z: 1,
	name: "chasm",
	desc: "Watch your step.",
	baseturf: rt.typePath("/turf/open/chasm"),
	smooth: 11,
	icon: rt.rsc("icons/turf/floors/chasms.dmi"),
	icon_state: "smooth",
	canSmoothWith: null,
	density: 1,
});

// chasm.dm:11
rt.def("/turf/open/chasm/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/turf/open/floor/fakepit"), T("/turf/open/chasm"));
	return f.dot;
});

// chasm.dm:18
rt.def("/turf/open/chasm/proc/Entered", function* Entered(f: Frame, AM: Value) {
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSobj.processing += this;
	}
	yield* this.drop_stuff(AM);
	return f.dot;
}, true);

// chasm.dm:22
rt.def("/turf/open/chasm/proc/process", function* process(f: Frame) {
	if (yield* this.drop_stuff()) return f.dot;
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return f.dot;
}, true, { waitfor: false });

// chasm.dm:26
rt.def("/turf/open/chasm/proc/get_smooth_underlay_icon", function get_smooth_underlay_icon(f: Frame, underlay_appearance: Value, asking_turf: Value, adjacency_dir: Value) {
	underlay_appearance.icon = rt.rsc("icons/turf/floors.dmi");
	underlay_appearance.icon_state = "basalt";
	return 1;
});

// chasm.dm:31
rt.def("/turf/open/chasm/proc/attackby", function* attackby(f: Frame, C: Value, user: Value, params: Value, area_restriction: Value) {
	let R: Value = null, L: Value = null, L_0: Value = null, S: Value = null;
	yield* parent_proc();
	if (rt.istype(C, T("/obj/item/stack/rods"))) {
		R = C;
		if (!(L = rt.locateIn(f, T("/obj/structure/lattice"), this))) {
			if (yield* R.use(1)) {
				to_chat(user, "<span class='notice'>You construct a lattice.</span>");
				playsound(this, rt.rsc("sound/weapons/genhit.ogg"), 50, 1);
				yield* this.ReplaceWithLattice();
			} else {
				to_chat(user, "<span class='warning'>You need one rod to build a lattice.</span>");
			}
			return f.dot;
		}
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

// chasm.dm:60
rt.def("/turf/open/chasm/proc/is_safe", function is_safe(f: Frame) {
	let found_safeties: Value = null;
	return rt.length((found_safeties = typecache_filter_list(this.contents, GLOB.chasm_safeties_typecache)));
});

// chasm.dm:65
rt.def("/turf/open/chasm/proc/drop_stuff", function* drop_stuff(f: Frame, AM: Value) {
	let thing: Value = null;
	f.dot = 0;
	if (this.is_safe()) {
		return 0;
	}
	let thing_to_check: Value = this;
	if (AM) {
		thing_to_check = list(AM);
	}
	for (thing of each(thing_to_check)) {
		if (yield* this.droppable(thing)) {
			f.dot = 1;
			yield* ImmediateInvokeAsync(this, P("/turf/open/chasm/proc/drop"), thing);
		}
	}
	return f.dot;
}, true);

// chasm.dm:76
rt.def("/turf/open/chasm/proc/droppable", function* droppable(f: Frame, AM: Value) {
	let MM: Value = null, H: Value = null, J: Value = null;
	if (!rt.istype(AM, T("/mob/living")) && !rt.istype(AM, T("/obj"))) {
		return 0;
	}
	if (rt.istype(AM, T("/obj/singularity")) || rt.istype(AM, T("/obj/item/projectile")) || AM.throwing) {
		return 0;
	}
	if (rt.istype(AM, T("/obj/effect/portal"))) {
		return 0;
	}
	if (rt.istype(AM, T("/mob/living"))) {
		if (rt.bitAnd((MM = AM).movement_type, 2)) {
			return 0;
		}
	}
	if (rt.istype(AM, T("/mob/living/carbon/human"))) {
		if (rt.istype((H = AM).belt, T("/obj/item/device/wormhole_jaunter"))) {
			J = H.belt;
			this.visible_message(`<span class='boldwarning'>${H} falls into ${this}!</span>`);
			yield* J.chasm_react(H);
			return 0;
		}
	}
	return 1;
}, true);

// chasm.dm:100
rt.def("/turf/open/chasm/proc/drop", function* drop(f: Frame, AM: Value) {
	let _T: Value = null, L: Value = null;
	if (!AM || !AM || AM.gc_destroyed) {
		return f.dot;
	}
	if (!(_T = rt.locate(this.drop_x, this.drop_y, this.drop_z))) return f.dot;
	AM.visible_message(`<span class='boldwarning'>${AM} falls into ${this}!</span>`, "<span class='userdanger'>GAH! Ah... where are you?</span>");
	_T.visible_message(`<span class='boldwarning'>${AM} falls from above!</span>`);
	yield* AM.forceMove(_T);
	if (!rt.istype(AM, T("/mob/living"))) return f.dot;
	yield* (L = AM).Knockdown(100);
	yield* L.adjustBruteLoss(30);
	return f.dot;
}, true, { argTypes: [{ path: "/atom/movable" }] });

rt.type(4794, "/turf/open/chasm/straight_down", "/turf/open/chasm", {});

// chasm.dm:115
rt.def("/turf/open/chasm/straight_down/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.drop_x = this.x;
	this.drop_y = this.y;
	if (!(this.z + 1 <= rt.world().maxz)) return f.dot;
	this.drop_z = this.z + 1;
	return f.dot;
}, true);

rt.type(4795, "/turf/open/chasm/straight_down/lava_land_surface", "/turf/open/chasm/straight_down", {
	initial_gas_mix: "o2=14;n2=23;TEMP=300",
	planetary_atmos: 1,
	baseturf: rt.typePath("/turf/open/chasm/straight_down/lava_land_surface"),
	light_range: 1.9,
	light_power: 0.65,
	light_color: "#C48A18",
});

// chasm.dm:132
rt.def("/turf/open/chasm/straight_down/lava_land_surface/proc/drop", function* drop(f: Frame, AM: Value) {
	let L: Value = null, i: Value = null, S: Value = null;
	let $e: any;
	if (!AM || !AM || AM.gc_destroyed) {
		return f.dot;
	}
	AM.visible_message(`<span class='boldwarning'>${AM} falls into ${this}!</span>`, "<span class='userdanger'>You stumble and stare into an abyss before you. It stares back, and you fall into the enveloping dark.</span>");
	if (rt.istype(AM, T("/mob/living"))) {
		(L = AM).notransform = 1;
		yield* L.Stun(200);
		L.resting = 1;
	}
	let oldtransform: Value = AM.transform;
	let oldcolor: Value = AM.color;
	let oldalpha: Value = AM.alpha;
	rt.op(f, "Animate", [2, 10], [null, AM, "transform", matrix() - matrix(), "alpha", 0, "color", rt.op(f, "Rgb", [1, 3], [0, 0, 0]), "time", 10]);
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!AM || !AM || AM.gc_destroyed) {
			return f.dot;
		}
		AM.pixel_y--;
		yield* sleep(2);
	}
	rt.endFor(f, 0);
	if (!AM || !AM || AM.gc_destroyed) {
		return f.dot;
	}
	if (rt.istype(AM, T("/mob/living/silicon/robot"))) {
		yield* qdel((S = AM).mmi);
	}
	yield* qdel(AM);
	if (!(AM && !(!AM || AM.gc_destroyed))) return f.dot;
	this.visible_message(`<span class='boldwarning'>${this} spits out the ${AM}!</span>`);
	AM.alpha = oldalpha;
	AM.color = oldcolor;
	AM.transform = oldtransform;
	yield* AM.throw_at(get_edge_target_turf(this, pick(GLOB.alldirs)), rand(1, 10), rand(1, 10));
	return f.dot;
}, true);

rt.type(4798, "/turf/open/chasm/jungle", "/turf/open/chasm", {
	icon: rt.rsc("icons/turf/floors/junglechasm.dmi"),
	planetary_atmos: 1,
	initial_gas_mix: "o2=14;n2=23;TEMP=300",
});

// chasm.dm:187
rt.def("/turf/open/chasm/jungle/proc/get_smooth_underlay_icon", function get_smooth_underlay_icon(f: Frame, underlay_appearance: Value, asking_turf: Value, adjacency_dir: Value) {
	underlay_appearance.icon = rt.rsc("icons/turf/floors.dmi");
	underlay_appearance.icon_state = "dirt";
	return 1;
});
