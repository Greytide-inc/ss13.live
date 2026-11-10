// Based on /tg/station's code/game/turfs/simulated/wall/mineral_walls.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(4416, "/turf/closed/wall/mineral", "/turf/closed/wall", {
	last_event: 0,
	active: null,
	name: "mineral wall",
	desc: "This shouldn't exist",
	icon_state: "",
	canSmoothWith: null,
	smooth: 1,
});

// mineral_walls.dm:7
rt.def("/turf/closed/wall/mineral/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = null;
	return f.dot;
});

rt.type(4420, "/turf/closed/wall/mineral/gold", "/turf/closed/wall/mineral", {
	name: "gold wall",
	desc: "A wall with gold plating. Swag!",
	icon: rt.rsc("icons/turf/walls/gold_wall.dmi"),
	icon_state: "gold",
	explosion_block: 0,
	canSmoothWith: null,
	sheet_type: rt.typePath("/obj/item/stack/sheet/mineral/gold"),
});

// mineral_walls.dm:19
rt.def("/turf/closed/wall/mineral/gold/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/turf/closed/wall/mineral/gold"), T("/obj/structure/falsewall/gold"));
	return f.dot;
});

rt.type(4421, "/turf/closed/wall/mineral/silver", "/turf/closed/wall/mineral", {
	name: "silver wall",
	desc: "A wall with silver plating. Shiny!",
	icon: rt.rsc("icons/turf/walls/silver_wall.dmi"),
	icon_state: "silver",
	canSmoothWith: null,
	sheet_type: rt.typePath("/obj/item/stack/sheet/mineral/silver"),
});

// mineral_walls.dm:29
rt.def("/turf/closed/wall/mineral/silver/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/turf/closed/wall/mineral/silver"), T("/obj/structure/falsewall/silver"));
	return f.dot;
});

rt.type(4422, "/turf/closed/wall/mineral/diamond", "/turf/closed/wall/mineral", {
	name: "diamond wall",
	desc: "A wall with diamond plating. You monster.",
	icon: rt.rsc("icons/turf/walls/diamond_wall.dmi"),
	icon_state: "diamond",
	slicing_duration: 200,
	explosion_block: 3,
	canSmoothWith: null,
	sheet_type: rt.typePath("/obj/item/stack/sheet/mineral/diamond"),
});

// mineral_walls.dm:39
rt.def("/turf/closed/wall/mineral/diamond/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/turf/closed/wall/mineral/diamond"), T("/obj/structure/falsewall/diamond"));
	return f.dot;
});

rt.type(4423, "/turf/closed/wall/mineral/clown", "/turf/closed/wall/mineral", {
	name: "bananium wall",
	desc: "A wall with bananium plating. Honk!",
	icon: rt.rsc("icons/turf/walls/bananium_wall.dmi"),
	icon_state: "bananium",
	canSmoothWith: null,
	sheet_type: rt.typePath("/obj/item/stack/sheet/mineral/bananium"),
});

// mineral_walls.dm:50
rt.def("/turf/closed/wall/mineral/clown/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/turf/closed/wall/mineral/clown"), T("/obj/structure/falsewall/clown"));
	return f.dot;
});

rt.type(4424, "/turf/closed/wall/mineral/sandstone", "/turf/closed/wall/mineral", {
	name: "sandstone wall",
	desc: "A wall with sandstone plating. Rough.",
	icon: rt.rsc("icons/turf/walls/sandstone_wall.dmi"),
	icon_state: "sandstone",
	explosion_block: 0,
	canSmoothWith: null,
	sheet_type: rt.typePath("/obj/item/stack/sheet/mineral/sandstone"),
});

// mineral_walls.dm:59
rt.def("/turf/closed/wall/mineral/sandstone/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/turf/closed/wall/mineral/sandstone"), T("/obj/structure/falsewall/sandstone"));
	return f.dot;
});

rt.type(4425, "/turf/closed/wall/mineral/uranium", "/turf/closed/wall/mineral", {
	name: "uranium wall",
	desc: "A wall with uranium plating. This is probably a bad idea.",
	icon: rt.rsc("icons/turf/walls/uranium_wall.dmi"),
	icon_state: "uranium",
	canSmoothWith: null,
	sheet_type: rt.typePath("/obj/item/stack/sheet/mineral/uranium"),
});

// mineral_walls.dm:67
rt.def("/turf/closed/wall/mineral/uranium/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/turf/closed/wall/mineral/uranium"), T("/obj/structure/falsewall/uranium"));
	return f.dot;
});

// mineral_walls.dm:70
rt.def("/turf/closed/wall/mineral/uranium/proc/radiate", function* radiate(f: Frame) {
	let _T: Value = null;
	if (!this.active) {
		if (rt.worldTime(f) > this.last_event + 15) {
			this.active = 1;
			yield* radiation_pulse(rt.getStep(f, this, 0), 3, 3, 4, 0);
			for (_T of each(orange(1, this), T("/turf/closed/wall/mineral/uranium"))) {
				yield* _T.radiate();
			}
			this.last_event = rt.worldTime(f);
			this.active = null;
			return f.dot;
		}
	}
	return f.dot;
}, true);

// mineral_walls.dm:82
rt.def("/turf/closed/wall/mineral/uranium/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* this.radiate();
	yield* parent_proc();
	return f.dot;
}, true);

// mineral_walls.dm:86
rt.def("/turf/closed/wall/mineral/uranium/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	yield* this.radiate();
	yield* parent_proc();
	return f.dot;
}, true);

// mineral_walls.dm:90
rt.def("/turf/closed/wall/mineral/uranium/proc/Bumped", function* Bumped(f: Frame, AM: Value) {
	yield* this.radiate();
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(4426, "/turf/closed/wall/mineral/plasma", "/turf/closed/wall/mineral", {
	name: "plasma wall",
	desc: "A wall with plasma plating. This is definitely a bad idea.",
	icon: rt.rsc("icons/turf/walls/plasma_wall.dmi"),
	icon_state: "plasma",
	thermal_conductivity: 0.04,
	canSmoothWith: null,
	sheet_type: rt.typePath("/obj/item/stack/sheet/mineral/plasma"),
});

// mineral_walls.dm:100
rt.def("/turf/closed/wall/mineral/plasma/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/turf/closed/wall/mineral/plasma"), T("/obj/structure/falsewall/plasma"));
	return f.dot;
});

// mineral_walls.dm:103
rt.def("/turf/closed/wall/mineral/plasma/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let $0: any, $1: any;
	if (W.is_hot() > 300) {
		$0 = `${key_name_admin(user)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [user])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [user])}`;
		if (this) {
			$1 = `${`(${this.x},${this.y},${this.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${this.x};Y=${this.y};Z=${this.z}'>JMP</a>)`}`;
		} else {
			$1 = "nonexistent location";
		}
		message_admins(`Plasma wall ignited by ${$0} in ${`${$1}`}`, 0, 1);
		log_game(`Plasma wall ignited by ${key_name(user)} in ${`(${this.x},${this.y},${this.z})`}`);
		yield* this.ignite(W.is_hot());
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// mineral_walls.dm:111
rt.def("/turf/closed/wall/mineral/plasma/proc/PlasmaBurn", function* PlasmaBurn(f: Frame, temperature: Value) {
	let _T: Value = null;
	yield* new_(this.girder_type, this);
	yield* this.ChangeTurf(T("/turf/open/floor/plasteel"));
	(_T = this).atmos_spawn_air(`plasma=400;TEMP=${temperature}`);
	return f.dot;
}, true);

// mineral_walls.dm:117
rt.def("/turf/closed/wall/mineral/plasma/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	if (!(exposed_temperature > 300)) return f.dot;
	yield* this.PlasmaBurn(exposed_temperature);
	return f.dot;
}, true);

// mineral_walls.dm:121
rt.def("/turf/closed/wall/mineral/plasma/proc/ignite", function* ignite(f: Frame, exposed_temperature: Value) {
	if (!(exposed_temperature > 300)) return f.dot;
	yield* this.PlasmaBurn(exposed_temperature);
	return f.dot;
}, true);

// mineral_walls.dm:125
rt.def("/turf/closed/wall/mineral/plasma/proc/bullet_act", function* bullet_act(f: Frame, Proj: Value) {
	if (rt.istype(Proj, T("/obj/item/projectile/beam"))) {
		yield* this.PlasmaBurn(2500);
	} else if (rt.istype(Proj, T("/obj/item/projectile/ion"))) {
		yield* this.PlasmaBurn(500);
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(4427, "/turf/closed/wall/mineral/wood", "/turf/closed/wall/mineral", {
	name: "wooden wall",
	desc: "A wall with wooden plating. Stiff.",
	icon: rt.rsc("icons/turf/walls/wood_wall.dmi"),
	icon_state: "wood",
	hardness: 70,
	explosion_block: 0,
	canSmoothWith: null,
	sheet_type: rt.typePath("/obj/item/stack/sheet/mineral/wood"),
});

// mineral_walls.dm:140
rt.def("/turf/closed/wall/mineral/wood/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/turf/closed/wall/mineral/wood"), T("/obj/structure/falsewall/wood"));
	return f.dot;
});

rt.type(4417, "/turf/closed/wall/mineral/iron", "/turf/closed/wall/mineral", {
	name: "rough metal wall",
	desc: "A wall with rough metal plating.",
	icon: rt.rsc("icons/turf/walls/iron_wall.dmi"),
	icon_state: "iron",
	canSmoothWith: null,
	sheet_type: rt.typePath("/obj/item/stack/rods"),
});

// mineral_walls.dm:148
rt.def("/turf/closed/wall/mineral/iron/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/turf/closed/wall/mineral/iron"), T("/obj/structure/falsewall/iron"));
	return f.dot;
});

rt.type(4428, "/turf/closed/wall/mineral/snow", "/turf/closed/wall/mineral", {
	name: "packed snow wall",
	desc: "A wall made of densely packed snow blocks.",
	icon: rt.rsc("icons/turf/walls/snow_wall.dmi"),
	icon_state: "snow",
	hardness: 80,
	explosion_block: 0,
	slicing_duration: 30,
	canSmoothWith: null,
	sheet_type: rt.typePath("/obj/item/stack/sheet/mineral/snow"),
	girder_type: null,
});

// mineral_walls.dm:159
rt.def("/turf/closed/wall/mineral/snow/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = null;
	return f.dot;
});

rt.type(4429, "/turf/closed/wall/mineral/abductor", "/turf/closed/wall/mineral", {
	name: "alien wall",
	desc: "A wall with alien alloy plating.",
	icon: rt.rsc("icons/turf/walls/abductor_wall.dmi"),
	icon_state: "abductor",
	smooth: 5,
	slicing_duration: 200,
	explosion_block: 3,
	canSmoothWith: null,
	sheet_type: rt.typePath("/obj/item/stack/sheet/mineral/abductor"),
});

// mineral_walls.dm:171
rt.def("/turf/closed/wall/mineral/abductor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/turf/closed/wall/mineral/abductor"), T("/obj/structure/falsewall/abductor"));
	return f.dot;
});

rt.type(4430, "/turf/closed/wall/mineral/titanium", "/turf/closed/wall/mineral", {
	name: "wall",
	desc: "A light-weight titanium wall used in shuttles.",
	icon: rt.rsc("icons/turf/walls/shuttle_wall.dmi"),
	icon_state: "map-shuttle",
	flags: 36,
	smooth: 6,
	canSmoothWith: null,
	sheet_type: rt.typePath("/obj/item/stack/sheet/mineral/titanium"),
});

// mineral_walls.dm:181
rt.def("/turf/closed/wall/mineral/titanium/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/turf/closed/wall/mineral/titanium"), T("/obj/machinery/door/airlock/shuttle"), T("/obj/machinery/door/airlock"), T("/turf/closed/wall/shuttle"), T("/obj/structure/window/shuttle"), T("/obj/structure/shuttle/engine/heater"), T("/obj/structure/falsewall/titanium"));
	return f.dot;
});

rt.type(4433, "/turf/closed/wall/mineral/titanium/overspace", "/turf/closed/wall/mineral/titanium", {
	icon_state: "map-overspace",
	fixed_underlay: null,
});

// mineral_walls.dm:194
rt.def("/turf/closed/wall/mineral/titanium/overspace/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.fixed_underlay = rt.alist(f, ["space", 1]);
	return f.dot;
});

rt.type(4434, "/turf/closed/wall/mineral/titanium/interior", "/turf/closed/wall/mineral/titanium", {});

// mineral_walls.dm:199
rt.def("/turf/closed/wall/mineral/titanium/interior/proc/copyTurf", function* copyTurf(f: Frame, _T: Value) {
	if (_T.type != this.type) {
		yield* _T.ChangeTurf(this.type);
		if (rt.len(f, this.underlays)) {
			_T.underlays = this.underlays;
		}
	}
	if (_T.icon_state != this.icon_state) {
		_T.icon_state = this.icon_state;
	}
	if (_T.icon != this.icon) {
		_T.icon = this.icon;
	}
	if (this.color) {
		_T.atom_colours = (yield* this.atom_colours.Copy());
		_T.update_atom_colour();
	}
	if (_T.dir != this.dir) {
		_T.dir = this.dir;
	}
	_T.transform = this.transform;
	return _T;
}, true);

// mineral_walls.dm:216
rt.def("/turf/closed/wall/mineral/titanium/proc/copyTurf", function* copyTurf(f: Frame, T: Value) {
	f.dot = (yield* parent_proc());
	T.transform = this.transform;
	return f.dot;
}, true);

rt.type(4435, "/turf/closed/wall/mineral/titanium/survival", "/turf/closed/wall/mineral/titanium", {
	name: "pod wall",
	desc: "An easily-compressable wall used for temporary shelter.",
	icon: rt.rsc("icons/turf/walls/survival_pod_walls.dmi"),
	icon_state: "smooth",
	smooth: 6,
	canSmoothWith: null,
});

// mineral_walls.dm:225
rt.def("/turf/closed/wall/mineral/titanium/survival/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/turf/closed/wall/mineral/titanium/survival"), T("/obj/machinery/door/airlock/survival_pod"), T("/obj/structure/window/shuttle/survival_pod"), T("/obj/structure/shuttle/engine"));
	return f.dot;
});

rt.type(4437, "/turf/closed/wall/mineral/titanium/survival/pod", "/turf/closed/wall/mineral/titanium/survival", {
	canSmoothWith: null,
});

// mineral_walls.dm:231
rt.def("/turf/closed/wall/mineral/titanium/survival/pod/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/turf/closed/wall/mineral/titanium/survival"), T("/obj/machinery/door/airlock"), T("/obj/structure/window/fulltile"), T("/obj/structure/window/reinforced/fulltile"), T("/obj/structure/window/reinforced/tinted/fulltile"), T("/obj/structure/window/shuttle"), T("/obj/structure/shuttle/engine"));
	return f.dot;
});

rt.type(4439, "/turf/closed/wall/mineral/plastitanium/interior", "/turf/closed/wall/mineral/plastitanium", {});

// mineral_walls.dm:243
rt.def("/turf/closed/wall/mineral/plastitanium/interior/proc/copyTurf", function* copyTurf(f: Frame, _T: Value) {
	if (_T.type != this.type) {
		yield* _T.ChangeTurf(this.type);
		if (rt.len(f, this.underlays)) {
			_T.underlays = this.underlays;
		}
	}
	if (_T.icon_state != this.icon_state) {
		_T.icon_state = this.icon_state;
	}
	if (_T.icon != this.icon) {
		_T.icon = this.icon;
	}
	if (this.color) {
		_T.atom_colours = (yield* this.atom_colours.Copy());
		_T.update_atom_colour();
	}
	if (_T.dir != this.dir) {
		_T.dir = this.dir;
	}
	_T.transform = this.transform;
	return _T;
}, true);

rt.type(4438, "/turf/closed/wall/mineral/plastitanium", "/turf/closed/wall/mineral", {
	name: "wall",
	desc: "An evil wall of plasma and titanium.",
	icon: rt.rsc("icons/turf/shuttle.dmi"),
	icon_state: "wall3",
	smooth: 0,
	sheet_type: rt.typePath("/obj/item/stack/sheet/mineral/plastitanium"),
});

// mineral_walls.dm:260
rt.def("/turf/closed/wall/mineral/plastitanium/proc/copyTurf", function* copyTurf(f: Frame, T: Value) {
	f.dot = (yield* parent_proc());
	T.transform = this.transform;
	return f.dot;
}, true);
